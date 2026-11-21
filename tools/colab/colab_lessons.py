# Record whole lessons in Google Colab with the TTS PC's own MOSS engine and rules (gc-audio-science tools/moss),
# as a stand-in while the TTS PC is down. Default: the 3 test lessons with the 8B model, for a listening comparison
# with the 4B recordings now live (TTS PC README §6).
#   !wget -q https://raw.githubusercontent.com/ningshanchuan/middle/main/tools/colab/colab_lessons.py -O colab_lessons.py
#   %run colab_lessons.py --model 8b                      (lessons default to the 3 test lessons)
#   %run colab_lessons.py --model 8b --lessons biology/cell-theory --show 12
# Output: /content/gc-audio/_colab/<model>/<subject>__<topic>/<lang>/<key>.mp3 + results.json (+ a listening table).
import argparse, base64, html, json, os, subprocess, sys, time
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('--model', default='8b', choices=['8b', '4b'])
ap.add_argument('--lessons', default='biology/cell-theory,china/ming-qing,yuwen/yw-tang-poems')
ap.add_argument('--lang', default='zh')
ap.add_argument('--demand', action='store_true', help='also record on-demand (hover) clips')
ap.add_argument('--show', type=int, default=10, help='clips per lesson in the listening table')
args, _ = ap.parse_known_args()

# 1. the TTS PC's code (sparse checkout of tools/moss only; the audio repos are large)
SRC = Path('/content/gc-audio-moss')
if not (SRC / 'tools/moss/tools/moss_engine.py').exists():
    subprocess.run('git clone -q --depth 1 --filter=blob:none --sparse https://github.com/gladcolor/gc-audio-science.git '
                   f'{SRC} && cd {SRC} && git sparse-checkout set tools/moss', shell=True, check=True)
TOOLS = SRC / 'tools/moss/tools'
sys.path.insert(0, str(TOOLS))
import numpy as np, torch                                   # noqa: E402
import tts_worker as W                                      # noqa: E402
import moss_engine as ME                                    # noqa: E402

MODELS = {   # revisions as used / tested by the TTS PC (tools/moss/README.md §1)
  '8b': dict(model='OpenMOSS-Team/MOSS-TTS-v1.5', rev='cdd3b911b1585e3f2dbc7775ef10f9926f58850a',
             codec='OpenMOSS-Team/MOSS-Audio-Tokenizer', tag='serena moss8b'),
  '4b': dict(model='OpenMOSS-Team/MOSS-TTS-Local-Transformer-v1.5', rev='be7766a6735b98bd793f7c79fb720b4d0f5d13b8',
             codec='OpenMOSS-Team/MOSS-Audio-Tokenizer-v2', tag='serena moss15')}
M = MODELS[args.model]
ME.ROOT = Path('/content/gc-audio'); ME.REFS = SRC / 'tools/moss/refs'
FF = 'ffmpeg'
cfg = W.load_config(TOOLS / 'tts_config_moss.json'); cfg['ffmpeg'] = FF   # Linux ffmpeg; everything else as on the TTS PC


class ColabMoss(ME.Moss):
    """ME.Moss with Hugging Face ids, and the 8B differences: reference [1, samples]; output 24 kHz mono."""
    def __init__(self):
        from transformers import AutoModel, AutoProcessor
        self.torch = torch
        torch.backends.cuda.enable_cudnn_sdp(False)
        self.proc = AutoProcessor.from_pretrained(M['model'], revision=M['rev'], trust_remote_code=True, codec_path=M['codec'])
        self.proc.audio_tokenizer = self.proc.audio_tokenizer.to('cuda')
        self.model = AutoModel.from_pretrained(M['model'], revision=M['rev'], trust_remote_code=True,
                                               attn_implementation='sdpa', dtype=torch.bfloat16).to('cuda').eval()
        self.sr = int(self.proc.model_config.sampling_rate)
        files = {'poem': 'serena_zh_poem.mp3', 'explain': 'serena_zh_explain.mp3', 'en': 'serena_en_explain.mp3'}
        self.refs = {k: self._encode(ME.REFS / f, FF) for k, f in files.items()}

    def _encode(self, path, ffmpeg):
        r = subprocess.run([ffmpeg, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', '24000', '-f', 'f32le', 'pipe:1'],
                           capture_output=True, check=True)
        wav = torch.from_numpy(np.frombuffer(r.stdout, dtype='<f4').copy())
        if args.model == '8b':
            wav = wav[None, :]                             # the 8B codec wants [channels, samples]
        return self.proc.encode_audios_from_wav([wav], 24000)[0]

    def generate(self, items, ffmpeg):
        convs = [[self.proc.build_user_message(text=it['text'], language='Chinese' if it['lang'] == 'zh' else 'English',
                                               reference=[self.refs[ME.REF_KIND.get(it['kind'], it['kind'])]])] for it in items]
        batch = self.proc(convs, mode='generation')
        secs = [2 * ME.expected_seconds(it['text'], it['lang'], it['kind'], it.get('pace')) + 10 for it in items]
        gen = dict(ME.GEN, max_new_tokens=min(ME.GEN['max_new_tokens'], int(max(secs) * 12.5) + 25))
        with torch.no_grad():
            out = self.model.generate(input_ids=batch['input_ids'].to('cuda'), attention_mask=batch['attention_mask'].to('cuda'), **gen)
        pcms = []
        for m in self.proc.decode(out):
            if m is None:
                pcms.append(None); continue
            a = m.audio_codes_list[0].float()
            if a.dim() == 2:
                a = a.mean(dim=0)                          # 4B: 48 kHz stereo -> mono
            wav = a.cpu().numpy()
            r = subprocess.run([ffmpeg, '-v', 'error', '-f', 'f32le', '-ar', str(self.sr), '-ac', '1', '-i', 'pipe:0',
                                '-ar', '24000', '-f', 's16le', 'pipe:1'], input=wav.astype('<f4').tobytes(), capture_output=True)
            pcms.append(r.stdout if r.returncode == 0 and r.stdout else None)
        return pcms


# 2. clips of the lessons (the site's transcripts), the TTS PC's kind / pace / pause rules
lessons = [l.strip() for l in args.lessons.split(',') if l.strip()]
idx = json.loads(W.fetch(ME.SITE + 'index.json').decode('utf-8'))
repo_of = {l['id']: l['repo'] for l in idx['lessons']}
clips = []
for l in lessons:
    t = json.loads(W.fetch(ME.SITE + l + '.json').decode('utf-8'))
    for c in t['clips']:
        if c['lang'] != args.lang or (c.get('demand') and not args.demand):
            continue
        kind = ME.kind_of(l, args.lang, c.get('style'))
        clips.append(dict(lesson=l, lang=args.lang, key=c['key'], send=c['send'], kind=kind, style=c.get('style'),
                          work=c.get('work'), pace=ME.target_pace(l, kind, c['send']), text=ME.with_pauses(c['send'], args.lang, kind)))
print(f'{len(clips)} clips in {len(lessons)} lessons ({args.lang}, demand {"on" if args.demand else "off"})', flush=True)

OUT = ME.ROOT / '_colab' / args.model
def dst(c): return OUT / c['lesson'].replace('/', '__') / c['lang'] / f"{c['key']}.mp3"
t0 = time.time(); engine = ColabMoss()
print(f"{M['model']} loaded in {time.time() - t0:.0f}s, GPU memory {torch.cuda.memory_allocated() / 2**30:.1f} GB", flush=True)
t1 = time.time()
ME.record(engine, clips, cfg, log=lambda s: print(s, flush=True), on_best=lambda c: W.to_mp3(cfg, c['best']['pcm'], 24000, dst(c)))
wall = time.time() - t1
audio_s = sum(c['best']['sec'] for c in clips if c.get('best'))
bad = [c for c in clips if not c.get('best') or c['best']['reasons']]
print(f"RESULT {args.model}: {len(clips)} clips, {audio_s / 60:.1f} min audio in {wall / 60:.1f} min "
      f"({audio_s / max(wall, 1):.2f}x real time), tries {sum(c.get('tries', 0) for c in clips)}, still failing {len(bad)}", flush=True)
res = [dict(lesson=c['lesson'], lang=c['lang'], key=c['key'], send=c['send'], kind=c['kind'], pace_target=c['pace'],
            tries=c.get('tries', 0), **{k: v for k, v in (c.get('best') or {}).items() if k != 'pcm'}) for c in clips]
(OUT / 'results.json').write_text(json.dumps(dict(model=M['model'], rev=M['rev'], tag=M['tag'], wall_s=wall, audio_s=audio_s,
                                                  clips=res), ensure_ascii=False, indent=1), encoding='utf-8')

# 3. listening table in the notebook: Colab recording next to the one now live on the site
from IPython.display import HTML, display
rows = []
for l in lessons:
    cs = [c for c in clips if c['lesson'] == l and c.get('best')][:args.show]
    for c in cs:
        b64 = base64.b64encode(dst(c).read_bytes()).decode()
        live = f"https://gladcolor.github.io/{repo_of.get(l, 'gc-audio-science')}/{l}/{c['lang']}/{c['key']}.mp3"
        b = c['best']
        rows.append(f"<tr><td style='max-width:420px'>{html.escape(c['send'][:160])}<br><small>{l} · {c['kind']} · "
                    f"{b['sec']}s · {b['pace']}/s (target {c['pace'] or 'free'}) · tries {c['tries']}"
                    f"{' · FAIL: ' + '; '.join(b['reasons']) if b['reasons'] else ''}</small></td>"
                    f"<td><audio controls preload=none src='data:audio/mpeg;base64,{b64}'></audio></td>"
                    f"<td><audio controls preload=none src='{live}'></audio></td></tr>")
display(HTML(f"<h3>Colab {args.model.upper()} (left) vs the recording live on the site (right)</h3>"
             f"<table border=1 cellpadding=4 style='border-collapse:collapse'><tr><th>text</th><th>Colab {args.model}</th>"
             f"<th>live now</th></tr>{''.join(rows)}</table>"))
