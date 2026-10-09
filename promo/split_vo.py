"""Split the single-take narration into the clips mix.py places on the timeline.

    python3 split_vo.py <narration.mp3> <audio_dir>

The take must contain, in order and separated by pauses:
  "Every great pirate…" / "begins with one question." / "Which Straw Hat…" / "are you?" /
  10 names / "Twenty-four questions." / "Ten characters." / "One destiny." /
  "Take the quiz…" / "and find your place on the Thousand Sunny."
Writes intro1, intro2, q1, q2, name1…name10, stat1…stat3 and cta (the two CTA
phrases kept together, with their natural pause) as WAV into <audio_dir>.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np

src, out = sys.argv[1], Path(sys.argv[2])
SR = 48000
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)

# 10 ms RMS envelope → voiced regions; gaps shorter than 140 ms are bridged.
hop = SR // 100
env = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, 'same')[::hop])
on = 20 * np.log10(env + 1e-9) > -40
segs, i, n = [], 0, len(on)
while i < n:
    if not on[i]:
        i += 1
        continue
    j = i
    while j < n and (on[j] or on[j:j + 14].any()):
        j += 1
    if j - i > 8:
        segs.append((i / 100, j / 100))
    i = j

names = ['intro1', 'intro2', 'q1', 'q2'] + [f'name{k}' for k in range(1, 11)] + ['stat1', 'stat2', 'stat3', 'cta']
if len(segs) == len(names) + 1:  # CTA split at its "…" pause: merge the last two
    segs = segs[:-2] + [(segs[-2][0], segs[-1][1])]
assert len(segs) == len(names), f'expected {len(names)} phrases, found {len(segs)}: {segs}'

for name, (a, b) in zip(names, segs):
    a, b = max(0, a - 0.03), b + 0.06
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', src,
                    '-af', 'afade=t=in:d=0.02,areverse,afade=t=in:d=0.05,areverse', '-ar', str(SR), '-ac', '2',
                    str(out / f'{name}.wav')], check=True)
    print(f'{name:7s} {a:6.2f}–{b:6.2f}  ({b - a:.2f}s)')
