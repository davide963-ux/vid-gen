#!/usr/bin/env node
// Remove an image background with rembg (local, free). Default model u2net = Apache-2.0 (safe for commercial videos).
// Usage: node scripts/cutout.mjs <in.png|jpg> [out.png] [model]
//   models: u2net (general, default) · isnet-general-use (cleaner edges) · isnet-anime (cartoons/illustrations) · u2net_human_seg (people)
import { spawnSync } from 'node:child_process';
import { basename, extname, join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
const REMBG = process.env.REMBG_EXE ?? (process.env.LOCALAPPDATA + '/Programs/Python/Python312/Scripts/rembg.exe');
const [inp, outArg, model = 'u2net'] = process.argv.slice(2);
if (!inp) { console.error('usage: node scripts/cutout.mjs <in> [out.png] [model]'); process.exit(1); }
const out = outArg ?? join(dirname(inp), basename(inp, extname(inp)) + '-cutout.png');
if (!existsSync(REMBG)) { console.error('rembg not found at ' + REMBG + ' (pip install "rembg[cli]" with Python 3.12, or set REMBG_EXE)'); process.exit(1); }
const r = spawnSync(REMBG, ['i', '-m', model, inp, out], { stdio: 'inherit' });
if (r.status !== 0 || !existsSync(out)) { console.error('rembg failed'); process.exit(r.status || 1); }
console.log('cutout ->', out);
