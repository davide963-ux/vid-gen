#!/usr/bin/env node
// Narration pipeline for non-English voices (edge-tts, free): lines -> mp3 -> wav -> stitched narration.wav + lines.json + words.json
// Usage: node scripts/voice_pipeline_edge.mjs <project-dir> <script.json> <voice e.g. sq-AL-IlirNeural> [rate=-4%]
import { spawnSync, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const [proj, scriptPath, voice, rate = '+0%'] = process.argv.slice(2);
const LINES = JSON.parse(readFileSync(scriptPath, 'utf8'));
const vdir = join(proj, 'assets/voice'); mkdirSync(vdir, { recursive: true });
const r = spawnSync('py', ['-3.12', 'scripts/edge_lines.py', scriptPath, vdir, voice, rate], { stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status ?? 1);
const B = JSON.parse(readFileSync(join(vdir, 'bounds.json'), 'utf8'));
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const lines = []; let t = 0.3;
LINES.forEach((L, i) => {
  const n = String(i + 1).padStart(2, '0'); const mp3 = join(vdir, n + '.mp3'), wav = join(vdir, n + '.wav');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp3, '-ar', '44100', '-ac', '1', wav]);
  const d = dur(wav); const pause = L.pause ?? 0.4;
  lines.push({ i: i + 1, file: 'assets/voice/' + n + '.wav', text: L.show ?? L.say, tts: L.say, start: +t.toFixed(3), dur: +d.toFixed(3), end: +(t + d).toFixed(3), pause });
  console.log(i + 1, d.toFixed(2) + 's', '@' + t.toFixed(2)); t += d + pause;
});
const total = +(lines.at(-1).end + (LINES.at(-1).tail ?? 1.0)).toFixed(2);
const inputs = lines.flatMap((l) => ['-i', join(proj, l.file)]);
const filt = lines.map((l, k) => `[${k}:a]adelay=${Math.round(l.start * 1000)}|${Math.round(l.start * 1000)},aformat=sample_rates=44100:channel_layouts=stereo[a${k}]`).join(';') + ';' + lines.map((_, k) => `[a${k}]`).join('') + `amix=inputs=${lines.length}:normalize=0:duration=longest,apad=whole_dur=${total}[o]`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filt, '-map', '[o]', '-t', String(total), join(proj, 'assets/voice/narration.wav')]);
writeFileSync(join(proj, 'lines.json'), JSON.stringify({ total, lines }, null, 2));
// caption tokens (the shown text) mapped onto the spoken word boundaries (1:1 when counts match, proportional otherwise)
const out = [];
for (const L of lines) {
  const ws = B[L.i]; const toks = L.text.split(/\s+/).filter(Boolean);
  toks.forEach((tk, j) => { const a0 = ws[Math.min(ws.length - 1, Math.floor(j * ws.length / toks.length))]; const a1 = ws[Math.max(0, Math.min(ws.length - 1, Math.ceil((j + 1) * ws.length / toks.length) - 1))];
    out.push({ w: tk, s: +(L.start + a0.s).toFixed(3), e: +(L.start + Math.max(a1.s + a1.d, a0.s + 0.1)).toFixed(3), line: L.i }); });
}
writeFileSync(join(proj, 'words.json'), JSON.stringify(out, null, 1));
console.log('total', total, 's;', out.length, 'caption words');
