// SFX cues + music moments for the Zenith promo, timed from words.json.
//   node videos/zenith-promo/make_cues.mjs   (repo root)
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const WORDS = JSON.parse(fs.readFileSync(dir + 'words.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
const LS = (n) => WORDS.find((w) => w.line === n).s;
const W = (n, p) => { const x = WORDS.find((w) => w.line === n && norm(w.w).startsWith(p)); if (!x) throw new Error(`word not found L${n} ${p}`); return x.s; };
const cues = []; const c = (id, t, vol = 0.6, extra = {}) => cues.push({ id, t: +Math.max(0, t).toFixed(3), vol, ...extra });
const UI = 'whoosh-designed-generic-air';        // short, clean "UI" whoosh for elements landing
// hook (light streaks)
c(UI, 0.02, 0.6);
// customers find you online
c('whoosh-softs', W(2, 'potential') - 0.1, 0.5);
['find', 'your', 'business'].forEach((p) => c(UI, W(2, p) - 0.05, 0.35)); c(UI, W(2, 'online'), 0.4);
// but where?
c('whoosh-mids', W(2, 'but') - 0.12, 0.55); c(UI, W(2, 'where') + 0.1, 0.45);
['explore', 'discover', 'learn'].forEach((p) => c(UI, W(2, p) - 0.05, 0.42));
// your own website
c('whoosh-classic-airy', LS(3) - 0.15, 0.6); c(UI, W(3, 'website') + 0.1, 0.4);
['professional', 'trust'].forEach((p) => c(UI, W(3, p) - 0.1, 0.45)); c(UI, W(3, 'reach') - 0.3, 0.45);
// Zenith builds it
c('whoosh-mids', LS(4) - 0.15, 0.55); c('whoosh-softs', W(4, 'zenith') + 0.5, 0.35);
['modern', 'ecom', 'booking', 'custom'].forEach((p) => c(UI, W(4, p) - 0.1, 0.45));
// stop limiting
c('whoosh-wind', LS(5) - 0.15, 0.5); c('riser-transition-reverse-eerie-fast-short', LS(5), 0.32);
c(UI, W(5, 'your'), 0.35); c(UI, W(5, 'social'), 0.35); c(UI, W(5, 'media') - 0.1, 0.4);
// build your digital presence (the break)
c('whoosh-classic-airy', LS(6) - 0.2, 0.8); c(UI, W(6, 'digital') - 0.1, 0.4);
// expand
c('whoosh-mids', LS(7) - 0.15, 0.6); c(UI, W(7, 'opportunities') - 0.45, 0.4);
// brand sting
c('riser-transition-whoosh-fast-short-01', LS(8) - 3.0, 0.5); c('whoosh-classic-airy', LS(8) - 0.05, 0.9);
c('whoosh-softs', LS(8) + 0.5, 0.4); c(UI, W(9, 'digitally'), 0.5);
fs.writeFileSync(dir + 'sfx_cues.json', JSON.stringify(cues, null, 1));
const m = [
  [0, 'intro', {}], [W(2, 'but') - 0.1, 'soft', { gain: 0.7 }], [LS(3) - 0.1, 'groove', {}], [W(3, 'professional') - 0.1, 'build', {}],
  [LS(4) - 0.1, 'lift', {}], [LS(5) - 0.1, 'soft', { gain: 0.5 }], [LS(6) - 0.15, 'build', {}], [LS(7) - 0.1, 'lift', {}],
  [LS(8) - 1.8, 'swell', {}], [LS(8), 'peak', { gain: 1.1 }], [W(9, 'your') - 0.1, 'cta', { gain: 0.9 }],
].map(([t, style, o]) => ({ t: +t.toFixed(2), style, override: { bright: 0.6, ...o } }));
fs.writeFileSync(dir + 'moments.json', JSON.stringify(m, null, 1));
console.log(cues.length, 'cues;', m.map((x) => x.t + ' ' + x.style).join(' | '));
