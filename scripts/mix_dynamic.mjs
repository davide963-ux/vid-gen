#!/usr/bin/env node
// Final mix: narration + sound effects (NOT ducked, so they stay clearly audible) + music (ducked under the voice).
// Usage: node scripts/mix_dynamic.mjs videos/<name> <render.mp4> <out.mp4> --music file [--music-vol 0.5] [--sfx-vol 0.55]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const [proj, render, out, ...rest] = process.argv.slice(2);
const opt = (k, d) => (rest.includes(k) ? rest[rest.indexOf(k) + 1] : d);
const total = JSON.parse(fs.readFileSync(path.join(proj, 'lines.json'), 'utf8')).total;
const music = opt('--music', null), mvol = opt('--music-vol', '0.5'), svol = opt('--sfx-vol', '0.55');
const fmt = 'aformat=sample_rates=44100:channel_layouts=stereo';
const inputs = ['-i', path.join(proj, render), '-i', path.join(proj, 'assets/voice/narration.wav'), '-i', path.join(proj, 'assets/voice/sfx.wav')];
let fc = `[1:a]${fmt},apad=whole_dur=${total},asplit[v1][v2];[2:a]${fmt},volume=${svol},apad=whole_dur=${total}[sfx];`;
if (music) { inputs.push('-i', music); fc += `[3:a]${fmt},volume=${mvol},apad=whole_dur=${total}[m];[m][v1]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=500[mduck];[v2][sfx][mduck]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]`; }
else { fc += `[v1]anullsink;[v2][sfx]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]`; }
fs.mkdirSync(path.dirname(out), { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(total), out], { stdio: 'inherit' });
console.log('wrote', out, `(${total}s, sfx not ducked, music ducked)`);
