#!/usr/bin/env node
// Fetch free icons from Iconify (no account, no key) into assets/illustrations/icons/.
// Usage: node scripts/icon.mjs <set:name> [<set:name> ...] [--color=#1e2bfa] [--size=128]
//   e.g. node scripts/icon.mjs lucide:landmark ph:coins-bold tabler:shield-check --color=#1e2bfa
// Find names at https://icon-sets.iconify.design/  (check the set's licence: most are MIT/Apache/CC0).
import { mkdirSync, writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const names = args.filter((a) => !a.startsWith('--'));
if (!names.length) { console.error('usage: node scripts/icon.mjs set:name [...] [--color=#hex] [--size=128]'); process.exit(1); }
mkdirSync('assets/illustrations/icons', { recursive: true });
for (const n of names) {
  const [set, name] = n.split(':'); if (!set || !name) { console.error('bad name', n); continue; }
  const q = new URLSearchParams(); if (opt.color) q.set('color', opt.color); if (opt.size) q.set('height', opt.size);
  const r = await fetch(`https://api.iconify.design/${set}/${name}.svg?${q}`);
  const svg = await r.text();
  if (!r.ok || !svg.startsWith('<svg')) { console.error('not found:', n); continue; }
  writeFileSync(`assets/illustrations/icons/${set}-${name}.svg`, svg);
  console.log('saved', `assets/illustrations/icons/${set}-${name}.svg`, svg.length + ' bytes');
}
