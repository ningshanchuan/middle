#!/bin/bash
# MOSS-TTS setup in Google Colab (GPU runtime). In a cell:
#   !wget -q https://raw.githubusercontent.com/ningshanchuan/middle/main/tools/colab/moss_setup.sh -O moss_setup.sh && bash moss_setup.sh
set -e
nvidia-smi --query-gpu=name,memory.total --format=csv
cd /content
[ -d MOSS-TTS ] || git clone -q https://github.com/OpenMOSS/MOSS-TTS.git
cd MOSS-TTS
pip install -q --extra-index-url https://download.pytorch.org/whl/cu128 -e . 2>&1 | tail -3
# pin exactly the versions that worked on the TTS PC (tools/moss/requirements-moss.txt in gc-audio-science)
pip install -q --extra-index-url https://download.pytorch.org/whl/cu128 torch==2.9.1 torchaudio==2.9.1 transformers==5.0.0 accelerate==1.16.0 safetensors==0.6.2 tokenizers==0.22.2 huggingface-hub==1.33.0 soundfile==0.14.0 librosa==0.11.0 einops==0.8.1 2>&1 | tail -3
python -c "import torch, transformers; print('torch', torch.__version__, '| transformers', transformers.__version__, '| cuda', torch.cuda.is_available())"
echo "setup done. NOW restart the session (Runtime > Restart session), then run the test cell."
