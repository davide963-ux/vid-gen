#!/usr/bin/env node
// Scaffold a new short-form video project from templates/short-form (hook-on-frame-1, mask reveal, pulses, safe area, karaoke captions).
//   kokoro : English AI voice          -> node scripts/voice_pipeline.mjs videos/<name> videos/<name>/script.json am_michael 1.0
//   edge   : other languages (free)    -> node scripts/voice_pipeline_edge.mjs videos/<name> videos/<name>/script.json sq-AL-IlirNeural -4%
//   file   : your own recording / ElevenLabs file (already clean) -> py -3.12 scripts/align_script_to_audio.py <audio> videos/<name>/script_lines.json videos/<name> 1.4 en
import fs from 'node:fs';
import path from 'node:path';
const [name, ...rest] = process.argv.slice(2);
if (!name) { console.error('usage: node scripts/new_video.mjs <name> [--voice kokoro|edge|file]'); process.exit(1); }
const voice = rest.includes('--voice') ? rest[rest.indexOf('--voice') + 1] : 'kokoro';
const opt = (k, d) => (rest.includes(k) ? rest[rest.indexOf(k) + 1] : d);
const theme = opt('--theme', null);
const src = path.resolve('templates/short-form'), dst = path.resolve('videos', name);
if (fs.existsSync(dst)) { console.error('already exists:', dst); process.exit(1); }
fs.cpSync(src, dst, { recursive: true });
fs.mkdirSync(path.join(dst, 'assets/lottie'), { recursive: true }); fs.mkdirSync(path.join(dst, 'assets/img'), { recursive: true }); fs.mkdirSync(path.join(dst, 'assets/voice'), { recursive: true });
const V = '0.8.140';
fs.writeFileSync(path.join(dst, 'package.json'), JSON.stringify({ name, private: true, type: 'module', scripts: { dev: `npx --yes hyperframes@${V} preview`, check: `npx --yes hyperframes@${V} check`, render: `npx --yes hyperframes@${V} render`, publish: `npx --yes hyperframes@${V} publish` } }, null, 2));
fs.writeFileSync(path.join(dst, 'meta.json'), JSON.stringify({ id: name, name, createdAt: new Date().toISOString() }, null, 2));
// confetti Lottie (shifted later with scripts/lottie_shift.mjs if wanted)
const conf = path.resolve('assets/lottie/Confetti.json'); if (fs.existsSync(conf)) fs.copyFileSync(conf, path.join(dst, 'assets/lottie/confetti-s.json'));
if (voice === 'kokoro') fs.writeFileSync(path.join(dst, 'script.json'), JSON.stringify([{ say: 'Your first line.', pause: 0.3 }, { say: "You didn't know that about money.", pause: 0.3, tail: 1.2 }], null, 2));
else fs.writeFileSync(path.join(dst, 'script_lines.json'), JSON.stringify(['Your first line.', "You didn't know that about money."], null, 2));
if (theme) { const tf = path.join(src, 'themes', theme + '.css'); if (fs.existsSync(tf)) fs.copyFileSync(tf, path.join(dst, 'src/theme.css')); else console.error('unknown theme', theme); }
fs.rmSync(path.join(dst, 'themes'), { recursive: true, force: true }); fs.rmSync(path.join(dst, 'cards.spec.example.json'), { force: true });
console.log(`created videos/${name}  (voice mode: ${voice}${theme ? ', theme ' + theme : ''})\n`);
console.log('Next steps (run from studio/):');
console.log(`  1. Edit videos/${name}/${voice === 'kokoro' ? 'script.json' : 'script_lines.json'} with the real script.`);
console.log('  2. Voice + word timings -> see the commands at the top of scripts/new_video.mjs (sets words.json + lines.json).');
console.log(`  3. Edit videos/${name}/src/body.html (elements) and src/scenes.js (timeline). Use wd(line, word) for timing.`);
console.log(`  4. cd videos/${name} && node src/build.mjs`);
console.log(`  5. node scripts/verify_video.mjs videos/${name}      (check + frames + safe-area + hook test)`);
console.log(`  6. cd videos/${name} && npx hyperframes@${V} render -o renders/out.mp4`);
console.log(`  7. node scripts/mix_final.mjs videos/${name} renders/out.mp4 out/${name}.mp4 [--music file]`);
