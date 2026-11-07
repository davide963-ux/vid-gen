#!/usr/bin/env node
// Final audio mix + mux: narration (untouched) + synthesized SFX (ducked under the voice) + optional music, loudness -14 LUFS, video copied as-is.
// Usage: node scripts/mix_final.mjs videos/<name> <render.mp4 (relative to project)> <out.mp4> [--music file] [--music-vol 0.08] [--music-ss 0] [--sfx-vol 0.6] [--no-sfx]
// Default is NO music (the user found the stock track annoying). Uses assets/voice/narration.wav and assets/voice/sfx.wav from the project.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const [proj, render, out, ...rest] = process.argv.slice(2);
if (!proj || !render || !out) { console.error('usage: node scripts/mix_final.mjs videos/<name> <render.mp4> <out.mp4> [--music file] [--music-vol 0.08] [--music-ss 0] [--sfx-vol 0.6] [--no-sfx]'); process.exit(1); }
const opt = (k, d) => (rest.includes(k) ? rest[rest.indexOf(k) + 1] : d);
const total = JSON.parse(fs.readFileSync(path.join(proj, 'lines.json'), 'utf8')).total;
const music = opt('--music', null), mvol = opt('--music-vol', '0.08'), mss = opt('--music-ss', '0'), svol = opt('--sfx-vol', '0.6');
const useSfx = !rest.includes('--no-sfx') && fs.existsSync(path.join(proj, 'assets/voice/sfx.wav'));
const inputs = ['-i', path.join(proj, render), '-i', path.join(proj, 'assets/voice/narration.wav')]; let idx = 2; const labels = [];
const fmt = 'aformat=sample_rates=44100:channel_layouts=stereo';
let fc = `[1:a]${fmt},apad=whole_dur=${total},asplit[v1][v2];`;
if (useSfx) { inputs.push('-i', path.join(proj, 'assets/voice/sfx.wav')); fc += `[${idx}:a]${fmt},volume=${svol}[s${idx}];`; labels.push(`[s${idx}]`); idx++; }
if (music) { inputs.push('-ss', mss, '-t', String(total), '-i', music); fc += `[${idx}:a]${fmt},volume=${mvol},apad=whole_dur=${total}[m${idx}];`; labels.push(`[m${idx}]`); idx++; }
if (labels.length) {
  fc += labels.length > 1 ? `${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=longest[bed];` : `${labels[0]}anull[bed];`;
  fc += `[bed][v1]sidechaincompress=threshold=0.02:ratio=4:attack=30:release=600[duck];[v2][duck]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]`;
} else fc += `[v1]loudnorm=I=-14:TP=-1.5:LRA=11[a];[v2]anullsink`;
fs.mkdirSync(path.dirname(out), { recursive: true });
if (!labels.length) fc = `[1:a]${fmt},apad=whole_dur=${total},loudnorm=I=-14:TP=-1.5:LRA=11[a]`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(total), out], { stdio: 'inherit' });
console.log('wrote', out, `(${total}s, sfx:${useSfx ? 'on' : 'off'}, music:${music ? 'on' : 'off'})`);
