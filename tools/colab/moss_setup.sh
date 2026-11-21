#!/bin/bash
# MOSS-TTS setup in Google Colab (GPU runtime). In a cell:
#   !wget -q https://raw.githubusercontent.com/ningshanchuan/middle/main/tools/colab/moss_setup.sh -O moss_setup.sh && bash moss_setup.sh
set -e
nvidia-smi --query-gpu=name,memory.total --format=csv
cd /content
[ -d MOSS-TTS ] || git clone -q https://github.com/OpenMOSS/MOSS-TTS.git
cd MOSS-TTS
pip install -q --extra-index-url https://download.pytorch.org/whl/cu128 -e . 2>&1 | tail -3
python -c "import torch, transformers; print('torch', torch.__version__, '| transformers', transformers.__version__, '| cuda', torch.cuda.is_available())"
echo "setup done"
