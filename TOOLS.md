# Studio toolbox (all free, all local)

| Task | Command |
|---|---|
| Remove an image background | `node scripts/cutout.mjs photo.jpg cutout.png [u2net\|isnet-general-use\|isnet-anime\|u2net_human_seg]` |
| Start a caption edit on a talking video | `node scripts/new_caption_project.mjs clip.mp4 my-clip [small.en]` then ask Claude: "Using /embedded-captions, add captions to videos/my-clip" |
| Word timings for any audio/video | `py -3.12 scripts/transcribe_local.py clip.mp4 <project-dir> small.en` |
| Sound effects for animated clips | `node scripts/frog_sfx.mjs out.wav` (edit the event times inside) |
| Mix music under voice | see the ffmpeg sidechain command in the bank video build, or `npm run mix` in the first project |

Notes
- rembg models live in `~/.rembg/models` (u2net, 168 MB, Apache-2.0: fine for commercial videos). Do NOT use `bria-rmbg` (non-commercial licence).
- Captions: the skill's matting needs one-time downloads (a 168 MB person-segmentation model + puppeteer's browser). It only works on ONE person talking to camera, no burned-in subtitles, no hard cuts.
- Python tools run on Python 3.12: use `py -3.12`, not `python` (the Windows Store stub).

## Free asset library (no accounts) - added
| Asset | Where | Licence | Notes |
|---|---|---|---|
| Kenney Blocky Characters (18 people, 27 animations each) | `assets/models/kenney/blocky-characters/Models/GLB format/` | CC0 | Clips: idle, walk, sprint, sit, drive, die, pick-up, emote-yes, emote-no, holding-*, attack-*, interact-*, wheelchair-* |
| Kenney City Kit Commercial (41 models) | `assets/models/kenney/city-kit-commercial/` | CC0 | building-a..n, building-skyscraper-a..e, detail-awning/parasol, low-detail-* |
| Kenney City Kit Suburban (40 models) | `assets/models/kenney/city-kit-suburban/` | CC0 | houses, fences, trees, driveways |
| Iconify icons (12 starters, cobalt) | `assets/illustrations/icons/` | MIT (Lucide) | More: `node scripts/icon.mjs lucide:name --color=#1e2bfa --size=128` |

Using the 3D models in a HyperFrames scene (working example: `videos/kenney-test/index.html`):
- Copy the `GLB format` folder (with its `Textures/` folder) into the project's `assets/models/`.
- Load with `GLTFLoader` (importmap, three@0.181.2). Don't trust the files' unit scale: measure with `THREE.Box3` after loading and scale to a target size.
- Animate with `AnimationMixer`: `mixer.setTime(t)` inside the `hf-seek` handler. Find a clip with `THREE.AnimationClip.findByName(gltf.animations, 'walk')`.
- Kenney characters face +Z; rotate by PI to face away from camera, 0 to face it.

### Second batch (all CC0 or MIT, no accounts)
| Asset | Where | Contents |
|---|---|---|
| Kenney Furniture Kit | `assets/models/kenney/furniture-kit/` | 140 GLB: desks, chairs, computerKeyboard/Mouse, lamps, shelves, beds, sofas |
| Kenney Nature Kit | `assets/models/kenney/nature-kit/` | 329 GLB: trees, rocks, plants, bridges, tents, fences |
| Kenney Food Kit | `assets/models/kenney/food-kit/` | 200 GLB: cup-coffee, cup-tea, burgers, fruit, drinks |
| Kenney Car Kit | `assets/models/kenney/car-kit/` | 50 GLB: sedans, taxis, trucks, vans, race cars |
| Kenney Particle Pack | `assets/illustrations/kenney/particle-pack/` | 193 PNG sprites: sparks, smoke, stars, flames, glows (use as Points/sprite textures or CSS images) |
| Kenney Emotes Pack | `assets/illustrations/kenney/emotes-pack/` | 513 PNG (+1 SVG): emote_alert, emote_cash, emote_idea, emote_heart, ... reaction bubbles |
| Icons (39 total) | `assets/illustrations/icons/` | Lucide 12, Phosphor 12, Tabler 8 (all recolourable, cobalt by default), Fluent Emoji Flat 7 (full-colour: money-bag, money-with-wings, thinking-face, exploding-head, light-bulb, bank, coin) |
Licences: Kenney = CC0 (credit optional, see `assets/models/kenney/CREDITS.txt`); Lucide/Phosphor/Tabler/Fluent Emoji = MIT.
Not auto-downloaded (manual): Quaternius, Open Peeps, unDraw (its licence forbids scripted downloading), Poly Pizza.

## Short-form style rules (adopted Oct 2026)
Ideas read from the MIT-licensed iart-ai/tiktok-video-skills and kinetic-typography-skills (read-only; nothing installed). Rewritten for HyperFrames/GSAP. Code: `scripts/motion_helpers.js` (paste into a template's classic script; needs the `.mw` / `.mi` CSS shown at the top of that file). Tested on `videos/_helper-test`.
1. Hook on frame 1: the first line of text is fully visible at t=0, no fade-up, no fade from black. Use `hookNow(tl, ['#a1','#a2'])`. Strongest visual first, not a slow intro.
2. One idea per video; open a loop in the first ~3s and close it last (the script is usually the user's, so check this when they paste one and say so if it is missing).
3. Visual change every 2-4 s, uneven (never a metronome). On any hold longer than ~4 s add `punch(tl, sel, t)` or `heartbeat(tl, sel, from, to)`.
4. Headlines that appear mid-video: mask reveal, `maskReveal(tl, '#id', t)` (plain-text elements only) with `maskHide` to leave. Ease expo.out, ~0.6 s per word, 60 ms stagger, whole reveal under ~1 s. Lock line-height/tracking first (display: line-height 1.0-1.1, letter-spacing -0.02em to -0.035em).
5. Safe area for 1080x1920: keep text and cards inside x 60-960 (right ~120 px belongs to TikTok's buttons), y 120-1600. Captions stay at y ~1392-1582 (bottom ~320 px clear). Cards should not run to x=1040 any more.
6. Captions: word-level timing only (real word times from Whisper or the TTS engine, never an even split); bold, high contrast; 3-5 words per page.
7. Optional loop: end on the same look as frame 0, and let the last line lead back into the hook.
8. Verify loop we already use: `check` + `snapshot` at the hook, a mid-point and the last frame before every render.
Not adopted: Remotion/Manim code, countdown and lower-third skills. Their retention statistics are the authors' claims, not verified here.

## One-command workflow for a new short video (Oct 2026)
```
node scripts/new_video.mjs <name> --voice kokoro|edge|file     # scaffold from templates/short-form (hook on frame 1, mask reveal, pulses, safe area, karaoke captions)
# voice + word timings (any one of):
node scripts/voice_pipeline.mjs videos/<name> videos/<name>/script.json am_michael 1.0           # English AI voice (set HYPERFRAMES_PYTHON to Python 3.12)
node scripts/voice_pipeline_edge.mjs videos/<name> videos/<name>/script.json sq-AL-IlirNeural -4% # other languages, free (edge-tts)
py -3.12 scripts/align_script_to_audio.py <your-voice.mp3> videos/<name>/script_lines.json videos/<name> 1.4 en   # your own / ElevenLabs file, left untouched
# edit videos/<name>/src/body.html + src/scenes.js, then:
cd videos/<name> && node src/build.mjs && cd ../..
node scripts/verify_video.mjs videos/<name>                    # check + hook/mid/last stills + hook test + safe-area scan
cd videos/<name> && npx hyperframes@0.8.140 render -o renders/out.mp4 && cd ../..
node scripts/mix_final.mjs videos/<name> renders/out.mp4 out/<name>.mp4 [--music file --music-vol 0.08]   # default: no music
```
Notes: the user found the old Pixabay track annoying, so music is off unless asked. Calm option: `node scripts/sea_classical.mjs assets/music/sea-classical.wav 54 62` (synthesized sea waves + soft piano). Word timing comes from the TTS engine or Whisper, never an even split. Do not delete the old per-video template files; new videos use `templates/short-form`.


## TTS number rule (Oct 2026)
Kokoro reads "$1,000" as "dollar one thousand". In script.json write the spoken form in `say` ("one thousand dollars", "three percent", "one hundred thirty-four dollars"), then align captions with the original text: `py -3.12 scripts/align_script_to_audio.py <narration.wav> script_lines.json <project> 1.5 en` (script_lines.json = the display text with $ and %).
