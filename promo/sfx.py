"""Synthesize the ad's sound effects with numpy (no samples needed).

    python3 sfx.py <audio_dir>

Writes impact.wav, whoosh.wav, sparkle.wav and rumble.wav into <audio_dir>.
If <audio_dir>/rumble_el.mp3 exists (the ElevenLabs rumble), it is layered on
top of the synthesized rumble bed.
"""
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
rng = np.random.default_rng(7)
d = Path(sys.argv[1])


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def lowpass(x, fc):
    # one-pole low-pass, run twice for a 12 dB/oct slope
    a = np.exp(-2 * np.pi * fc / SR)
    for _ in range(2):
        y = np.empty_like(x)
        acc = 0.0
        for i, v in enumerate(x):
            acc = (1 - a) * v + a * acc
            y[i] = acc
        x = y
    return x


def lowpass_fast(x, fc):
    # FFT brick-ish low-pass with a soft knee (fast enough for long noise beds)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / fc) ** 4)
    return np.fft.irfft(X, len(x))


def bandpass_sweep(x, f0, f1, q=2.5):
    # time-varying state-variable band-pass, centre sweeping f0 → f1
    n = len(x)
    fc = np.geomspace(f0, f1, n)
    y = np.empty(n)
    lo = bp = 0.0
    for i in range(n):
        f = 2 * np.sin(np.pi * fc[i] / SR)
        hp = x[i] - lo - bp / q
        bp += f * hp
        lo += f * bp
        y[i] = bp
    return y


def save(name, x, stereo_width=0.0):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    if stereo_width:
        dl = int(0.012 * SR)
        r = np.r_[np.zeros(dl), x[:-dl]]
        l = x
        st = np.stack([l * (1 - stereo_width / 2) + r * stereo_width / 2, r * (1 - stereo_width / 2) + l * stereo_width / 2], 1)
    else:
        st = np.stack([x, x], 1)
    pcm = (np.clip(st, -1, 1) * 32767).astype('<i2')
    with wave.open(str(d / name), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print('wrote', d / name)


# --- impact: pitched sub drop + noise crack + low tail -------------------------
t = t_(2.2)
f = 38 + 110 * np.exp(-t * 18)
boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6)
crack = rng.standard_normal(len(t)) * np.exp(-t * 55)
body = lowpass_fast(rng.standard_normal(len(t)), 900) * np.exp(-t * 7)
tail = lowpass_fast(rng.standard_normal(len(t)), 220) * np.exp(-t * 2.2)
imp = 1.0 * boom + 0.35 * crack + 0.55 * body / (np.abs(body).max() + 1e-9) + 0.4 * tail / (np.abs(tail).max() + 1e-9)
imp = np.tanh(imp * 1.6)
imp[:48] *= np.linspace(0, 1, 48)
save('impact.wav', imp, 0.3)

# --- whoosh: swept band-passed noise, swelling then passing --------------------
t = t_(0.9)
env = np.sin(np.pi * np.clip(t / 0.9, 0, 1)) ** 2 * np.exp(-((t - 0.55) ** 2) / 0.06)
wh = bandpass_sweep(rng.standard_normal(len(t)), 300, 3800) * env
save('whoosh.wav', wh, 0.8)

# --- sparkle: cluster of high bell partials with fast decays -------------------
t = t_(1.6)
sp = np.zeros(len(t))
for k in range(26):
    st = rng.uniform(0, 0.75)
    fr = rng.choice([2093, 2637, 3136, 3520, 4186, 5274, 6272]) * rng.uniform(0.995, 1.005)
    m = t >= st
    tt = t[m] - st
    sp[m] += rng.uniform(0.3, 1) * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * rng.uniform(5, 11)) * (1 - np.exp(-tt * 400))
sp += 0.15 * bandpass_sweep(rng.standard_normal(len(t)), 5000, 9000, 4) * np.exp(-t * 3)
save('sparkle.wav', sp, 0.9)

# --- rumble: slow-swelling sub bed (+ ElevenLabs rumble layer if present) ------
t = t_(5.2)
bed = lowpass_fast(rng.standard_normal(len(t)), 70)
bed = bed / np.abs(bed).max()
swell = np.clip(t / 3.2, 0, 1) ** 1.6 * np.clip((5.2 - t) / 0.3, 0, 1)
rum = bed * swell + 0.25 * np.sin(2 * np.pi * 41 * t) * swell
el = d / 'rumble_el.mp3'
if el.exists():
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(el), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    e = np.frombuffer(raw, np.float32).astype(float)
    e = e / (np.abs(e).max() + 1e-9)
    for start in (0.4, 2.6):  # two hits of the short ElevenLabs rumble inside the bed
        i0 = int(start * SR)
        n = min(len(e), len(rum) - i0)
        rum[i0:i0 + n] += 0.7 * e[:n]
save('rumble.wav', rum, 0.4)
