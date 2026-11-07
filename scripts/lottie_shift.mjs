#!/usr/bin/env node
// Delay a Lottie so it starts at <seconds> on the composition clock (HyperFrames plays every Lottie from t=0).
// Usage: node scripts/lottie_shift.mjs <in.json> <seconds> <out.json>
// Shifts layer in/out/start times and every keyframe time. Does not shift nested precomp content (it follows its layer).
import { readFileSync, writeFileSync } from 'node:fs';
const [inp, secs, out] = process.argv.slice(2);
if (!inp || !secs || !out) { console.error('usage: lottie_shift.mjs in.json seconds out.json'); process.exit(1); }
const j = JSON.parse(readFileSync(inp, 'utf8'));
const shift = Math.round(parseFloat(secs) * j.fr);
const isKey = (o) => typeof o.t === 'number' && ('s' in o || 'e' in o || 'h' in o || 'i' in o || 'o' in o);
function walk(n, topLayers) {
  if (Array.isArray(n)) { n.forEach((x) => walk(x, topLayers)); return; }
  if (!n || typeof n !== 'object') return;
  if (isKey(n)) n.t += shift;
  if (typeof n.tm === 'number' && ('cm' in n)) n.tm += shift;   // marker
  for (const k of Object.keys(n)) walk(n[k], topLayers);
}
walk(j.layers); (j.assets || []).forEach((a) => { if (a.layers) { /* precomp layers are relative to their parent layer: left unchanged */ } });
for (const l of j.layers) { l.ip += shift; l.op += shift; if (typeof l.st === 'number') l.st += shift; }
j.ip = 0; j.op += shift;
writeFileSync(out, JSON.stringify(j));
console.log(`${inp}: +${shift} frames (${secs}s) -> ${out}; duration now ${(j.op / j.fr).toFixed(2)}s`);
