# Keep the working SGLang-Omni environment (/content/sgl) in Google Drive, so a fresh Colab session restores exactly
# the environment that works instead of reinstalling the latest packages.
#   %run colab_drive_env.py --save      mount Drive (the user clicks "Allow" once per session), pack /content/sgl into
#                                       MyDrive/colab_envs/sgl.tar.zst (one file), check it
#   %run colab_drive_env.py --restore   mount Drive, unpack it back to /content/sgl (exit 1 if there is no archive)
import argparse, os, shutil, subprocess, sys, time
from pathlib import Path
ap = argparse.ArgumentParser(); ap.add_argument('--save', action='store_true'); ap.add_argument('--restore', action='store_true')
args, _ = ap.parse_known_args()
SRC = Path('/content/sgl'); DRIVE = Path('/content/drive'); DST = DRIVE / 'MyDrive/colab_envs'; ARC = DST / 'sgl.tar.zst'


def mount():
    if not (DRIVE / 'MyDrive').exists():
        from google.colab import drive
        print('mounting Google Drive: please click "Allow" in the window that opens', flush=True)
        drive.mount(str(DRIVE))
    DST.mkdir(parents=True, exist_ok=True)


def zstd():
    if not shutil.which('zstd'):
        subprocess.run('apt-get -qq install -y zstd >/dev/null', shell=True, check=True)


def gb(n):
    return f'{n / 2**30:.1f} GB'


if args.save:
    if not (SRC / 'bin/sgl-omni').exists():
        raise SystemExit('no SGLang environment at /content/sgl to save')
    mount(); zstd()
    size = int(subprocess.run(['du', '-sb', str(SRC)], capture_output=True, text=True).stdout.split()[0])
    free = shutil.disk_usage(str(DRIVE / 'MyDrive')).free
    print(f'environment {gb(size)} on disk; Drive free about {gb(free)}', flush=True)
    if free < size * 0.8:
        raise SystemExit('not enough free space in Google Drive for the archive; nothing written')
    tmp = Path('/content/sgl.tar.zst'); t0 = time.time()
    # pack locally first (Drive writes are slow for many small files), at low priority so the worker keeps its CPU
    subprocess.run(f'cd /content && nice -n 15 tar -I "zstd -T4 -6" -cf {tmp} sgl', shell=True, check=True)
    print(f'packed {gb(tmp.stat().st_size)} in {(time.time() - t0) / 60:.1f} min; copying to Drive ...', flush=True)
    t1 = time.time(); shutil.copyfile(tmp, ARC); tmp.unlink()
    (DST / 'sgl.info.txt').write_text(f'packed {time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime())}; restore: colab_drive_env.py --restore\n')
    print(f'saved {ARC} ({gb(ARC.stat().st_size)}) in {(time.time() - t1) / 60:.1f} min', flush=True)

if args.restore:
    mount()
    if not ARC.exists():
        print('no archive in Drive', flush=True); sys.exit(1)
    zstd(); t0 = time.time()
    tmp = Path('/content/sgl.tar.zst'); shutil.copyfile(ARC, tmp)
    subprocess.run(f'cd /content && tar -I zstd -xf {tmp}', shell=True, check=True); tmp.unlink()
    ok = (SRC / 'bin/sgl-omni').exists()
    print(f'restored /content/sgl in {(time.time() - t0) / 60:.1f} min: {"ok" if ok else "FAILED"}', flush=True)
    sys.exit(0 if ok else 1)
