# Promo video ad

A 30.6-second vertical (1080×1920, 30 fps) motion-graphics ad for the quiz: `out/onepiece-quiz-ad.mp4` (H.264 + AAC, faststart, −14 LUFS).

It is styled after the site:
- **Look:** the moonlit night-ocean background (sky gradient, moon and reflection, stars, island silhouettes, fog, gold/sea-foam/ember motes), the brand palette (ocean-deep, sunset, gold, pirate-red, sea-foam).
- **Type:** Cinzel, Cinzel Decorative, Bungee and Poppins, with the `text-fire` and `text-gold-foil` gradients.
- **Signature pieces:** the rising-sun glow behind the logo, the gold-framed wanted posters and the sunset-gradient "Begin Your Journey" button.
- **Artwork:** the wanted-poster art in `public/images`.

| Time | Scene |
| --- | --- |
| 0–5.0s | Hook: the Thousand Sunny on a moonlit sea, "Every great pirate… begins with one question." |
| 5.0–8.4s | Logo crash; "WHICH STRAW HAT ARE YOU?" slams on the music drop (6.70s) with a white flash and camera shake |
| 8.4–19.7s | Character montage: 10 Straw Hats, one cut every 2 beats; each has a manga panel, its colour, name, title and quote, and the narrator says the name |
| 19.7–24.8s | "24 QUESTIONS · 10 STRAW HAT CHARACTERS · 1 DESTINY", one hit per voice line on the beat, plus a scrolling strip of wanted posters |
| 24.8–28.8s | Call to action on the second drop: poster collage, logo, "Discover Your Pirate Destiny", glowing "Begin Your Journey" button, onepiecemi2o.netlify.app |
| 28.8–30.6s | Freeze-frame outro: a "WANTED — YOU — Bounty ???,???,???" poster drops in, with "Find your bounty" and the URL |

**Music:** the user-supplied One Piece OST "Overtaken" (`music.mp3`, not stored in the repo). It runs at 106 BPM. Its drops are at 16.48s and 34.59s, exactly 32 beats apart. Starting it at 9.78s puts the first drop on the "ARE YOU?" slam and the second on the call to action. The scene cuts in `timeline.json` all sit on that beat grid. Check that you have the rights to the music before running it as a paid ad; platforms may mute or block copyrighted tracks.

**Voice:** ElevenLabs "Don – Movie Trailers" (`eleven_multilingual_v2`), every line recorded in one calm take. `split_vo.py` cuts it at the pauses. No line is sped up.

**Sound effects:** the rumble layers an ElevenLabs rumble over a synthesized bed. The impact, whoosh and sparkle are synthesized by `sfx.py`. There is no effect on the montage cuts.

## Files

- `ad.html`: the animation. `window.render(t)` draws the frame at `t` seconds.
- `timeline.json`: scene timings, on the music's beat grid.
- `render.mjs`: renders frames or stills with Playwright.
- `split_vo.py`: splits the narration take into clips.
- `sfx.py`: synthesizes the sound effects.
- `mix.py`: builds the soundtrack: places the voice clips and effects, ducks the music under the voice (sidechain, with the voice track padded to the full length), low-passes the music during the hook, and runs a two-pass loudnorm to −14 LUFS.
- `fonts/`, `fonts.css`: local copies of the site fonts, so rendering works offline.

## Re-render

```sh
cd promo
# 1. audio: put music.mp3 + narration.mp3 (+ optional rumble_el.mp3) in <audio_dir>
python3 split_vo.py <audio_dir>/narration.mp3 <audio_dir>
python3 sfx.py <audio_dir>
python3 mix.py <audio_dir> 0.65            # 0.65 = music volume → <audio_dir>/mix.wav

# 2. preview stills (check text overlap, crops, readability)
node render.mjs stills <dir> 2 6.8 12 21 27 30

# 3. all frames as JPEG, 4 workers in parallel
for w in 0 1 2 3; do node render.mjs frames <frames_dir> 30 $w 4 & done; wait

# 4. encode
ffmpeg -framerate 30 -i <frames_dir>/f%05d.jpg -i <audio_dir>/mix.wav \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -shortest -movflags +faststart out/onepiece-quiz-ad.mp4
```
