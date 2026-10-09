"""Mix the ad soundtrack: music (ducked under the voiceover) + voiceover + SFX, normalised to -14 LUFS.

    python3 mix.py <audio_dir> [music_volume]

<audio_dir> must contain music.mp3 (the user-supplied "Overtaken" OST, not stored
in the repo), the narration clips from split_vo.py (intro1, intro2, q1, q2,
name1…name10, stat1…stat3, cta) and the SFX from sfx.py (impact, whoosh,
sparkle, rumble). Writes <audio_dir>/mix.wav. Event times come from timeline.json;
timeline.json's musicOffset trims the music so its drop (16.48s into the track)
lands on the "ARE YOU?" slam.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

here = Path(__file__).parent
T = json.loads((here / 'timeline.json').read_text())
d = Path(sys.argv[1])
music_volume = float(sys.argv[2]) if len(sys.argv) > 2 else 0.65
dur = T['DUR']
B = T['beat']

ins = []


def add(name):
    ins.extend(['-i', str(d / name)])
    return len(ins) // 2 - 1


mus = add('music.mp3')
imp, wh, sp, rum = (add(n) for n in ('impact.wav', 'whoosh.wav', 'sparkle.wav', 'rumble.wav'))

# Narration: every clip starts with 30 ms of lead-in, so place it 0.03 s early.
s3a, s3b = T['s3']
per = (s3b - s3a) / 10
vo = [('intro1', T['s1w1']), ('intro2', T['s1w2']), ('q1', T['s2q1']), ('q2', T['s2slam'])]
vo += [(f'name{k + 1}', s3a + per * k + 0.06) for k in range(10)]
vo += [(f'stat{k + 1}', t) for k, t in enumerate(T['s4hits'])]
vo += [('cta', T['ctaVo'])]

# SFX: rumble under the intro, impacts on the logo crash / slam / each stat / CTA / ending,
# a whoosh into the CTA, a sparkle when the start button appears. Nothing on montage cuts.
ev = [(rum, 0.0, 0.55), (imp, T['s2'][0], 0.8), (imp, T['s2slam'], 1.0), (wh, T['s2'][0] - 0.45, 0.35)]
ev += [(imp, t, 0.7) for t in T['s4hits']]
ev += [(wh, T['s5'][0] - 0.55, 0.75), (imp, T['s5'][0], 0.6), (sp, T['s5'][0] + 1.55, 0.7),
       (imp, T['s6'][0], 0.75), (sp, T['s6'][0] + 0.5, 0.35)]

fmt = 'aformat=sample_rates=48000:channel_layouts=stereo'
f, labels, vl = [], [], []
for k, (i, t, v) in enumerate(ev):
    ms = max(0, int(t * 1000))
    f.append(f'[{i}:a]{fmt},volume={v},adelay={ms}|{ms}[e{k}]')
    labels.append(f'[e{k}]')
for k, (name, t) in enumerate(vo):
    i = add(f'{name}.wav')
    ms = max(0, int((t - 0.03) * 1000))
    f.append(f'[{i}:a]{fmt},adelay={ms}|{ms}[v{k}]')
    vl.append(f'[v{k}]')
# Voice bus, padded to the full length so the sidechain (and the music) never stops early.
f.append(''.join(vl) + f'amix=inputs={len(vl)}:normalize=0,'
         'highpass=f=70,acompressor=threshold=0.1:ratio=3:attack=5:release=120,volume=1.5,'
         f'apad=whole_dur={dur},asplit=2[vo][vosc]')
# Music: trim to the drop, keep the hook dark (low-passed) until the logo crash, fade out at the end.
lp_end = T['s2'][0]
f.append(f'[{mus}:a]{fmt},atrim=start={T["musicOffset"]},asetpts=PTS-STARTPTS,'
         f"lowpass=f=420:enable='lt(t,{lp_end})',volume=1.4:enable='lt(t,{lp_end})',"
         f'volume={music_volume},afade=t=in:d=0.8,afade=t=out:st={dur - 1.6}:d=1.6[m]')
f.append('[m][vosc]sidechaincompress=threshold=0.04:ratio=5:attack=15:release=250:makeup=1[md]')
f.append('[md][vo]' + ''.join(labels) + f'amix=inputs={2 + len(labels)}:normalize=0,'
         f'atrim=0:{dur},apad=whole_dur={dur}[pre]')

graph = ';'.join(f)
pre = d / 'premix.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', graph, '-map', '[pre]',
                '-ar', '48000', '-c:a', 'pcm_f32le', str(pre)], check=True)

# Two-pass loudnorm to -14 LUFS integrated, -1 dBTP.
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(pre), '-af',
                    'loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True)
m = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', r.stderr).group(0))
ln = (f'loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={m["input_i"]}:measured_TP={m["input_tp"]}:'
      f'measured_LRA={m["input_lra"]}:measured_thresh={m["input_thresh"]}:offset={m["target_offset"]}:linear=true')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(pre), '-af', ln + ',aresample=48000',
                '-ar', '48000', '-c:a', 'pcm_s16le', str(d / 'mix.wav')], check=True)
print('wrote', d / 'mix.wav', '(input', m['input_i'], 'LUFS)')
