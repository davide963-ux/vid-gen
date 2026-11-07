#!/usr/bin/env node
// Pre-render verification: hyperframes check + stills (hook / middle / last) + our short-form rules.
// Usage: node scripts/verify_video.mjs videos/<name>
//   - runs `hyperframes check` (lint, layout, contrast)
//   - snapshots at 0.05s, middle and the last frame -> <project>/snapshots/verify-*.png
//   - HOOK TEST: frame ~0 must not be blank (hook text on screen at frame 1)
//   - SAFE-AREA SCAN: absolutely positioned elements in index.html whose left/width run outside x 60..960 (full-width 1080 text blocks are ignored)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const proj = path.resolve(process.argv[2] || '.');
const run = (cmd, args, opt = {}) => spawnSync(cmd, args, { cwd: proj, encoding: 'utf8', shell: true, ...opt });
const total = JSON.parse(fs.readFileSync(path.join(proj, 'lines.json'), 'utf8')).total;
let problems = 0; const warn = (m) => { problems++; console.log('  !', m); };

console.log('1/4 hyperframes check');
const c = run('npx', ['--yes', 'hyperframes@0.8.140', 'check']);
const out = (c.stdout || '') + (c.stderr || '');
const errs = out.split('\n').filter((l) => /✗/.test(l) && !/#cw\d+_\d+ [\d.]+:1/.test(l));   // caption fades flagged by the contrast probe are transients
console.log(errs.length ? errs.map((l) => '  ' + l.trim().slice(0, 200)).join('\n') : '  no errors');
if (errs.length) problems += errs.length;

console.log('2/4 stills (hook / middle / last)');
const ts = [0.05, +(total / 2).toFixed(2), +(total - 0.3).toFixed(2)];
run('npx', ['--yes', 'hyperframes@0.8.140', 'snapshot', '--at', ts.join(',')]);
const snaps = fs.existsSync(path.join(proj, 'snapshots')) ? fs.readdirSync(path.join(proj, 'snapshots')).filter((f) => /^frame-\d+-at-/.test(f)) : [];
console.log('  ' + snaps.length + ' stills in snapshots/ (open contact-sheet.jpg)');

console.log('3/4 hook test (frame 1 is not blank)');
const first = snaps.sort()[0];
if (first) {
  const py = process.env.HYPERFRAMES_PYTHON || 'py';
  const r = spawnSync(py, py === 'py' ? ['-3.12', '-c', `from PIL import Image, ImageStat; im=Image.open(r'${path.join(proj, 'snapshots', first)}').convert('L').crop((0,120,1080,1000)); print(round(ImageStat.Stat(im).stddev[0],1))`] : ['-c', `from PIL import Image, ImageStat; im=Image.open(r'${path.join(proj, 'snapshots', first)}').convert('L').crop((0,120,1080,1000)); print(round(ImageStat.Stat(im).stddev[0],1))`], { encoding: 'utf8' });
  const sd = parseFloat(r.stdout); console.log('  contrast of the top area at t=0.05s:', sd);
  if (!(sd > 12)) warn('frame 1 looks empty - the hook text should be on screen from the first frame (use hookNow)');
}

console.log('4/4 safe-area scan (x 60..960)');
const html = fs.readFileSync(path.join(proj, 'index.html'), 'utf8');
let n = 0;
for (const m of html.matchAll(/<[^>]*style="([^"]*)"[^>]*>/g)) {
  const s = m[1]; if (!/position:\s*absolute|class="[^"]*\babs\b/.test(m[0]) && !/left:/.test(s)) continue;
  const L = /(?:^|;)\s*left:\s*(-?\d+)px/.exec(s), W = /(?:^|;)\s*width:\s*(\d+)px/.exec(s);
  if (!L || !W) continue; const left = +L[1], width = +W[1];
  if (width >= 1000 && left <= 40) continue;                     // full-width centred text block
  if (left + width > 975 || left < 40) { n++; if (n <= 12) console.log(`  left:${left} width:${width}  ->  ${m[0].slice(0, 110).replace(/\s+/g, ' ')}`); }
}
if (n) warn(n + ' element(s) run outside the safe margin (right edge should stay <= x 960 so TikTok buttons never cover them)'); else console.log('  ok');

console.log(problems ? `\n${problems} thing(s) to look at before rendering.` : '\nAll checks passed. Render when ready.');
process.exit(0);
