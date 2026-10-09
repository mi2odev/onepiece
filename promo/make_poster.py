"""Build the blank wanted poster used by the "WANTED — YOU" outro.

    python3 make_poster.py

Takes the site's own poster art (public/images/robin.jpg, which has the most
even paper), erases the name and the bounty digits (the "DEAD OR ALIVE" line,
scroll brackets, Berry sign, fine print and MARINE stay), and writes
assets/wanted-blank.jpg. ad.html prints the new name/bounty and the photo on top.
"""
from pathlib import Path

import numpy as np
from PIL import Image

here = Path(__file__).parent
src = here.parent / 'public' / 'images' / 'robin.jpg'
img = np.asarray(Image.open(src).convert('RGB')).astype(float)
H, W, _ = img.shape
rng = np.random.default_rng(3)

# Regions to clear (pixels, 717×1029 source): the name line and the bounty digits.
REGIONS = [(70, 726, 660, 860), (134, 866, 652, 934)]


def box_blur(a, r):
    """Separable box blur via cumulative sums (edge-padded); a is HxW or HxWxC."""
    for axis in (0, 1):
        pad = [(0, 0)] * a.ndim
        pad[axis] = (r + 1, r)
        c = np.cumsum(np.pad(a, pad, mode='edge'), axis=axis)
        hi = np.take(c, range(2 * r + 1, c.shape[axis]), axis=axis)
        lo = np.take(c, range(0, c.shape[axis] - 2 * r - 1), axis=axis)
        a = (hi - lo) / (2 * r + 1)
    return a


lum = img.mean(2)
paper = box_blur(lum, 12)
ink = lum < paper - 12                      # printed ink is darker than the local paper
ink = box_blur(ink.astype(float), 4) > 0.02  # dilate to catch anti-aliased edges
photo = np.zeros((H, W), bool)
photo[205:662, 52:666] = True                # the old photo is covered by ad.html's art

# Low-frequency paper colour: normalised convolution over ink-free paper only.
keep = (~ink & ~photo).astype(float)
num, den = img * keep[..., None], keep
for _ in range(3):
    num, den = box_blur(num, 16), box_blur(den, 16)
bg = num / np.maximum(den, 1e-6)[..., None]

# Fine paper texture: residual of clean paper, harvested as ink-free 24px blocks.
resid = img - bg
B = 24
blocks = [resid[y:y + B, x:x + B] for y in range(0, H - B, 12) for x in range(0, W - B, 12)
          if keep[y:y + B, x:x + B].all()]
print(len(blocks), 'clean texture blocks')
# Overlap-add with a smooth window (half-block step), so no seams show.
win = np.outer(np.hanning(B + 2)[1:-1], np.hanning(B + 2)[1:-1])[..., None]
tex = np.zeros((H + 2 * B, W + 2 * B, 3))
wsum = np.zeros((H + 2 * B, W + 2 * B, 1))
for y in range(-B // 2, H, B // 2):
    for x in range(-B // 2, W, B // 2):
        blk = blocks[rng.integers(len(blocks))]
        if rng.random() < 0.5: blk = blk[:, ::-1]
        if rng.random() < 0.5: blk = blk[::-1]
        yy, xx = y + B // 2, x + B // 2
        tex[yy:yy + B, xx:xx + B] += blk * win
        wsum[yy:yy + B, xx:xx + B] += win
tex = tex / np.maximum(wsum, 1e-6)
tex = tex[B // 2:B // 2 + H, B // 2:B // 2 + W] * 1.35  # averaging softens grain; restore its strength
fill = bg + tex

# Replace the whole name / bounty strips, feathered at the edges.
m = np.zeros((H, W))
for x0, y0, x1, y1 in REGIONS:
    m[y0:y1, x0:x1] = 1
m = box_blur(box_blur(m, 4), 4)[..., None]
out = img * (1 - m) + fill * m
(here / 'assets').mkdir(exist_ok=True)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(here / 'assets' / 'wanted-blank.jpg', quality=93)
print('wrote', here / 'assets' / 'wanted-blank.jpg')

