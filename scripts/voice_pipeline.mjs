#!/usr/bin/env node
// Narration pipeline: lines -> Kokoro TTS per line -> stitched narration.wav + lines.json + word timings (words.json)
// Usage: node scripts/voice_pipeline.mjs <project-dir> <script.json> [voice=am_michael] [speed=1.0]
// script.json: [ { "say": "text spoken by TTS", "show": "caption text (optional)", "pause": 0.4 }, ... ]
// Run with HYPERFRAMES_PYTHON set to a Python 3.12 that has kokoro-onnx and faster-whisper.
import { spawnSync, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const [proj, scriptPath, voice = 'am_michael', speed = '1.0'] = process.argv.slice(2);
if (!proj || !scriptPath) { console.error('usage: voice_pipeline.mjs <project> <script.json> [voice] [speed]'); process.exit(1); }
const LINES = JSON.parse(readFileSync(scriptPath, 'utf8'));
mkdirSync(join(proj, 'assets/voice'), { recursive: true });
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const lines = []; let t = 0.3;
LINES.forEach((L, i) => {
  const f = join(proj, 'assets/voice', String(i + 1).padStart(2, '0') + '.wav');
  const r = spawnSync('npx', ['hyperframes', 'tts', L.say, '--voice', voice, '--speed', speed, '--output', f], { shell: true, encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); }
  const d = dur(f); const pause = L.pause ?? 0.4;
  lines.push({ i: i + 1, file: 'assets/voice/' + String(i + 1).padStart(2, '0') + '.wav', text: L.show ?? L.say, tts: L.say, start: +t.toFixed(3), dur: +d.toFixed(3), end: +(t + d).toFixed(3), pause });
  console.log(i + 1, d.toFixed(2) + 's', '@' + t.toFixed(2));
  t += d + pause;
});
const total = +(lines.at(-1).end + (LINES.at(-1).tail ?? 1.0)).toFixed(2);
const inputs = lines.flatMap((l) => ['-i', join(proj, l.file)]);
const filt = lines.map((l, k) => `[${k}:a]adelay=${Math.round(l.start * 1000)}|${Math.round(l.start * 1000)},aformat=sample_rates=44100:channel_layouts=stereo[a${k}]`).join(';') + ';' + lines.map((_, k) => `[a${k}]`).join('') + `amix=inputs=${lines.length}:normalize=0:duration=longest,apad=whole_dur=${total}[o]`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filt, '-map', '[o]', '-t', String(total), join(proj, 'assets/voice/narration.wav')]);
writeFileSync(join(proj, 'lines.json'), JSON.stringify({ total, lines }, null, 2));
// word timings via faster-whisper, run inside the project dir
copyFileSync(resolve('scripts/align_words_generic.py'), join(proj, 'align_words_generic.py'));
const py = process.env.HYPERFRAMES_PYTHON || 'py';
const a = spawnSync(py, py === 'py' ? ['-3.12', 'align_words_generic.py'] : ['align_words_generic.py'], { cwd: proj, stdio: 'inherit' });
if (a.status !== 0) process.exit(a.status ?? 1);
// map caption tokens onto the aligned words (1:1 if counts match, proportional otherwise)
const W = JSON.parse(readFileSync(join(proj, 'words_raw.json'), 'utf8')); const out = [];
for (const L of lines) {
  const ws = W.filter((w) => w.line === L.i); const toks = L.text.split(/\s+/).filter(Boolean);
  toks.forEach((tk, j) => { const a0 = ws[Math.min(ws.length - 1, Math.floor(j * ws.length / toks.length))]; const a1 = ws[Math.max(0, Math.min(ws.length - 1, Math.ceil((j + 1) * ws.length / toks.length) - 1))];
    out.push({ w: tk, s: +a0.s.toFixed(3), e: +Math.max(a1.e, a0.s + 0.1).toFixed(3), line: L.i }); });
}
writeFileSync(join(proj, 'words.json'), JSON.stringify(out, null, 1));
console.log('total', total, 's;', out.length, 'caption words');
