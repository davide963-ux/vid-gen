#!/usr/bin/env node
// Build <project>/assets/voice/sfx.wav from a cue list that points at sounds in sound-effects/index.json.
//   node scripts/build_sfx_track.mjs videos/<name> videos/<name>/sfx_cues.json
// cue = { "id": "cartoon-pop-various", "t": 12.4, "vol": 0.8, "trim": 1.5, "fade": 0.3 }
//   id   : id from sound-effects/index.json        t    : start time in seconds on the video clock
//   vol  : gain (default 1)                         trim : keep only the first N seconds (optional)
//   fade : fade-out length when trim is used (default 0.25)
// Total length comes from <project>/lines.json. Feeds scripts/mix_final.mjs (which ducks it under the voice).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const [proj, cuesFile] = process.argv.slice(2);
if (!proj || !cuesFile) { console.error('usage: node scripts/build_sfx_track.mjs videos/<name> cues.json'); process.exit(1); }
const index = JSON.parse(fs.readFileSync('sound-effects/index.json', 'utf8')).sounds;
const byId = new Map(index.map((s) => [s.id, s]));
const cues = JSON.parse(fs.readFileSync(cuesFile, 'utf8')).sort((a, b) => a.t - b.t);
const total = JSON.parse(fs.readFileSync(path.join(proj, 'lines.json'), 'utf8')).total;
const inputs = []; const chains = []; const labels = [];
cues.forEach((c, i) => {
  const s = byId.get(c.id); if (!s) throw new Error('unknown sound id: ' + c.id);
  inputs.push('-i', s.file);
  const ms = Math.max(0, Math.round(c.t * 1000));
  let f = `[${i}:a]aformat=sample_rates=44100:channel_layouts=stereo`;
  if (c.trim) { const fd = c.fade ?? 0.25; f += `,atrim=0:${c.trim},afade=t=out:st=${Math.max(0, c.trim - fd)}:d=${fd}`; }
  f += `,volume=${c.vol ?? 1},adelay=${ms}|${ms}[a${i}]`;
  chains.push(f); labels.push(`[a${i}]`);
});
const fc = chains.join(';') + ';' + labels.join('') + `amix=inputs=${cues.length}:normalize=0:duration=longest,apad=whole_dur=${total},atrim=0:${total}[out]`;
const out = path.join(proj, 'assets/voice/sfx.wav');
fs.mkdirSync(path.dirname(out), { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-ac', '2', out], { stdio: 'inherit' });
console.log(`wrote ${out}: ${cues.length} cues, ${total}s`);
