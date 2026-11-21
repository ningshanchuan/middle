# MOSS-TTS test in Google Colab (stand-in for the TTS PC). Run in a GPU runtime after moss_setup.sh:
#   !wget -q https://raw.githubusercontent.com/ningshanchuan/middle/main/tools/colab/moss_test.py -O moss_test.py
#   %run moss_test.py --model 8b
# Voice: cloned from the site's Serena recordings (reference clips below) until the TTS PC's own reference is shared.
# Reading rules (TTS PC, decided by the user 2026-11-20): pause 1 s after a poem's title and author, 0.8 s after each
# sentence end; pace ~4.0 chars/s for Chinese explanations, ~2.5–3.0 for poems; English at the model's own pace.
import argparse, time, os, re, subprocess, importlib.util, urllib.request
from pathlib import Path
import torch, torchaudio
from transformers import AutoModel, AutoProcessor

ap = argparse.ArgumentParser()
ap.add_argument('--model', default='8b', choices=['8b', '4b'])
ap.add_argument('--temps', default='1.7,1.0', help='audio_temperature values to compare')
args, _ = ap.parse_known_args()
MODEL = {'8b': 'OpenMOSS-Team/MOSS-TTS-v1.5', '4b': 'OpenMOSS-Team/MOSS-TTS-Local-Transformer-v1.5'}[args.model]

torch.backends.cuda.enable_cudnn_sdp(False)          # README: the cuDNN SDPA backend is broken
torch.backends.cuda.enable_flash_sdp(True); torch.backends.cuda.enable_mem_efficient_sdp(True); torch.backends.cuda.enable_math_sdp(True)
device = 'cuda'; dtype = torch.bfloat16
attn = 'flash_attention_2' if importlib.util.find_spec('flash_attn') and torch.cuda.get_device_capability()[0] >= 8 else 'sdpa'
print('GPU:', torch.cuda.get_device_name(0), '| attention:', attn, '| model:', MODEL)

OUT = Path('/content/moss_out'); OUT.mkdir(exist_ok=True, parents=True)
REF = {   # Serena clips already on the site (Qwen3-TTS "serena"), used as the cloning reference
  'zh': 'https://gladcolor.github.io/gc-audio-science/biology/cell-organelles/zh/7ab9f5a5.mp3',
  'en': 'https://gladcolor.github.io/gc-audio-science/astronomy/big-bang/en/0c6307b2.mp3'}
refs = {}
for lang, url in REF.items():
    p = OUT / f'ref_{lang}.mp3'
    if not p.exists(): urllib.request.urlretrieve(url, p)
    wav = OUT / f'ref_{lang}.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(p), '-ar', '24000', '-ac', '1', str(wav)], check=True)
    refs[lang] = str(wav)

def pauses_zh(text, poem=None):
    """TTS PC rule: 0.8 s after each sentence end; for poems 1 s after title and author."""
    t = re.sub(r'([。！？；])(?!$)', r'\1[pause 0.8s]', text)
    if poem: t = f'{poem[0]}[pause 1.0s]{poem[1]}[pause 1.0s]' + t
    return t
def pauses_en(text):
    return re.sub(r'([.!?])\s+(?=[A-Z])', r'\1 [pause 0.8s] ', text)

TESTS = [
  ('zh_expl', 'zh', pauses_zh('细胞膜是细胞的“门卫”。它很薄，却能控制哪些物质进出细胞。水和氧气可以自由通过，而有些大分子需要专门的通道。'), 4.0),
  ('zh_poem', 'zh', pauses_zh('床前明月光，疑是地上霜。举头望明月，低头思故乡。', poem=('静夜思', '李白')), 2.5),
  ('zh_science', 'zh', pauses_zh('压强等于压力除以受力面积，公式是p等于F除以S。压力一定时，受力面积越小，压强越大。'), 3.8),
  ('en_expl', 'en', pauses_en('Every cell is wrapped in a thin membrane. It lets water and oxygen pass, but keeps most large molecules out. Think of it as a careful gatekeeper.'), None),
]

t0 = time.time()
processor = AutoProcessor.from_pretrained(MODEL, trust_remote_code=True)
processor.audio_tokenizer = processor.audio_tokenizer.to(device)
model = AutoModel.from_pretrained(MODEL, trust_remote_code=True, attn_implementation=attn, torch_dtype=dtype).to(device).eval()
print(f'model loaded in {time.time() - t0:.0f} s; GPU memory {torch.cuda.memory_allocated() / 2**30:.1f} GB')

from IPython.display import Audio, display, HTML
rows = []
for temp in [float(x) for x in args.temps.split(',')]:
    for name, lang, text, target in TESTS:
        msg = processor.build_user_message(text=text, reference=[refs[lang]], language='Chinese' if lang == 'zh' else 'English')
        batch = processor([[msg]], mode='generation')
        t1 = time.time()
        with torch.no_grad():
            out = model.generate(input_ids=batch['input_ids'].to(device), attention_mask=batch['attention_mask'].to(device),
                                 max_new_tokens=4096, audio_temperature=temp, audio_top_p=0.8, audio_top_k=25, audio_repetition_penalty=1.0)
        gen = time.time() - t1
        audio = processor.decode(out)[0].audio_codes_list[0]
        sr = processor.model_config.sampling_rate
        wav = OUT / f'{args.model}_{name}_t{temp}.wav'
        torchaudio.save(str(wav), audio.unsqueeze(0).float().cpu(), sr)
        dur = audio.shape[-1] / sr
        chars = len(re.sub(r'\[pause [\d.]+s\]|[\s，。！？；、“”：,.!?;:"]', '', text))
        pace = chars / dur if dur else 0
        rows.append((args.model, name, temp, dur, gen, gen / dur if dur else 0, pace, target))
        print(f'{name:11s} temp {temp}: {dur:5.1f} s audio, generated in {gen:5.1f} s (RTF {gen / dur:.2f}), {pace:.1f} chars/s' + (f' (target {target})' if target else ''))
        display(HTML(f'<b>{args.model} · {name} · temperature {temp}</b>')); display(Audio(str(wav)))
print('\nmodel | test | temp | audio s | gen s | RTF | chars/s | target')
for r in rows: print(' | '.join(str(round(x, 2)) if isinstance(x, float) else str(x) for x in r))
