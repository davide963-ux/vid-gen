#!/usr/bin/env node
// One command to start a caption-edit project from an existing talking-head video.
// Usage: node scripts/new_caption_project.mjs <video.mp4> <project-name> [whisper-model=small.en]
// Creates videos/<name> (HyperFrames embedded-captions project) and writes a word-level transcript.json
// with the lightweight local transcriber (skips the PyTorch-based WhisperX the skill defaults to).
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const [video, name, model = 'small.en'] = process.argv.slice(2);
if (!video || !name) { console.error('usage: node scripts/new_caption_project.mjs <video> <name> [model]'); process.exit(1); }
if (!existsSync(video)) { console.error('video not found: ' + video); process.exit(1); }
const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' && cmd === 'npx' }); if (r.status !== 0) process.exit(r.status ?? 1); };
const dir = `videos/${name}`;
run('npx', ['hyperframes', 'init', dir, '--non-interactive', '--video', video, '--skill=embedded-captions']);
run('py', ['-3.12', 'scripts/transcribe_local.py', video, dir, model]);
console.log(`
Project ready: ${dir}
Next, tell Claude:  "Using /embedded-captions, add captions to ${dir}"
First caption run also needs (one time, ~150 MB + a 168 MB matting model):
  npm install --prefix ${dir} --save-dev --save-exact sharp@0.35.3 puppeteer@25.8.0 gsap@3.15.0
`);
