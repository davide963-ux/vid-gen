// Generate the narration line by line (Kokoro), stitch with deliberate pauses, write timings.
import { spawnSync, execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
// [spoken text for TTS, caption text, pause AFTER in seconds]
const LINES = [
  ["You probably didn't know this about money.", null, 0.55],
  ["When a bank approves a loan, something strange happens.", null, 0.55],
  ["Imagine you borrow ten thousand dollars.", null, 0.45],
  ["The bank doesn't necessarily take ten thousand dollars from someone else's account and hand it to you.", null, 0.5],
  ["Instead, it can create a new bank deposit.", null, 0.5],
  ["Your account suddenly says...", null, 0.9],
  ["Ten thousand dollars.", "10,000$.", 0.6],
  ["That money can now be spent in the real economy.", null, 0.45],
  ["So in a very real sense, commercial banks help create new money when they issue loans.", null, 0.6],
  ["But no...", null, 0.7],
  ["they can't just type unlimited zeros into everyone's accounts.", null, 0.5],
  ["Banks are restricted by capital requirements, liquidity rules, regulation, risk, and their ability to find borrowers who can repay.", null, 0.6],
  ["And here's the weirdest part.", null, 0.8],
  ["When that loan principal is repaid...", null, 0.8],
  ["the money created by the loan is effectively removed from the banking system.", null, 0.6],
  ["So a huge amount of the money circulating around us...", null, 0.9],
  ["started its life as debt.", null, 0.8],
  ["You didn't know that about money.", null, 0.6],
];
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const lines = []; let t = 0.4;   // small lead-in
LINES.forEach(([text, cap, pause], i) => {
  const f = `assets/voice/${String(i + 1).padStart(2, '0')}.wav`;
  const r = spawnSync('npx', ['hyperframes', 'tts', text, '--voice', 'am_michael', '--speed', '0.96', '--output', f], { shell: true, encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); }
  const d = dur(f);
  lines.push({ i: i + 1, file: f, text: cap ?? text, tts: text, start: +t.toFixed(3), dur: +d.toFixed(3), end: +(t + d).toFixed(3), pause });
  console.log(i + 1, d.toFixed(2) + 's');
  t += d + pause;
});
const total = +(lines.at(-1).end + 1.4).toFixed(2);
// stitch: place each line at its start time on a silent bed
const inputs = lines.flatMap(l => ['-i', l.file]);
const filt = lines.map((l, k) => `[${k}:a]adelay=${Math.round(l.start * 1000)}|${Math.round(l.start * 1000)},aformat=sample_rates=44100:channel_layouts=stereo[a${k}]`).join(';') + ';' +
  lines.map((_, k) => `[a${k}]`).join('') + `amix=inputs=${lines.length}:normalize=0:duration=longest,apad=whole_dur=${total}[o]`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filt, '-map', '[o]', '-t', String(total), 'assets/voice/narration.wav']);
writeFileSync('lines.json', JSON.stringify({ total, lines }, null, 2));
console.log('total', total, 's');
