"""Crop the montage pictures to the manga-panel shape (940×800, drawn at 1100×936 for the zoom).

    python3 prep_montage.py <source_dir>

<source_dir> is the "data" folder of the Mugiwara image dataset from
github.com/AlissonRP/OnePiece-img-Classification (data.zip, Git LFS).
Writes assets/montage/<character>.jpg. Each crop box (source pixels) frames the
face and leaves out watermarks/credit bars; small sources are upscaled with
Lanczos + a light unsharp mask.
"""
import sys
from pathlib import Path

from PIL import Image, ImageFilter

here = Path(__file__).parent
src = Path(sys.argv[1])
OUT_W, OUT_H = 1100, 936

PICKS = {  # character: (dataset file, crop box x0, y0, x1, y1)
    'luffy': ('Luffy/luffy 2.jpg', (91, 0, 770, 578)),
    'zoro': ('Zoro/zoro.jpg', (0, 80, 715, 688)),
    'nami': ('Nami/4.jpg', (0, 0, 720, 613)),
    'sanji': ('Sanji/104.jpg', (0, 0, 744, 633)),
    'usopp': ('Usopp/usoo3.jpg', (52, 0, 914, 734)),
    'chopper': ('Chopper/chopper.jpg', (0, 10, 236, 211)),
    'robin': ('Robin/73.jpg', (0, 300, 1280, 1389)),
    'franky': ('Franky/3dca8999ad33bfdefaf499f6f3c5180f.jpg', (0, 0, 1024, 871)),
    'brook': ('Brook/Brook 1.jpg', (171, 0, 1017, 720)),
    'jinbe': ('Jinbei/10.png', (0, 0, 900, 766)),
}

out = here / 'assets' / 'montage'
out.mkdir(parents=True, exist_ok=True)
for key, (f, box) in PICKS.items():
    im = Image.open(src / f).convert('RGB').crop(box)
    small = im.width < OUT_W * 0.6
    im = im.resize((OUT_W, OUT_H), Image.LANCZOS)
    if small:
        im = im.filter(ImageFilter.UnsharpMask(radius=2.2, percent=90, threshold=2))
    im.save(out / f'{key}.jpg', quality=92)
    print(key, box, '(upscaled)' if small else '')
