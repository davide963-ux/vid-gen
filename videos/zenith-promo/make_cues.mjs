// SFX cues + music moments for the Zenith promo, timed from words.json (same constants as src/scenes.js).
//   node videos/zenith-promo/make_cues.mjs   (repo root)
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const WORDS = JSON.parse(fs.readFileSync(dir + 'words.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
const LS = (n) => WORDS.find((w) => w.line === n).s;
const W = (n, p) => { const x = WORDS.find((w) => w.line === n && norm(w.w).startsWith(p)); if (!x) throw new Error(`word not found L${n} ${p}`); return x.s; };
const cues = []; const c = (id, t, vol = 0.6, extra = {}) => cues.push({ id, t: +Math.max(0, t).toFixed(3), vol, ...extra });
const UI = 'whoosh-designed-generic-air', CK1 = 'ui-click-01', CK2 = 'ui-click-02', TICK = 'ui-typing-tick', UP = 'ui-blip-up', DN = 'ui-blip-down', OK = 'ui-confirm';
const BOOM = 'impact-sub-boom', SHAT = 'impact-glass-shatter';
const ST = (i) => `glitch-stutter-0${i}`, ZAP = (i) => `glitch-zap-0${i}`, STAT = (i) => `glitch-static-burst-0${i}`;
const T2 = W(2, 'potential') - 0.05, T3 = W(2, 'but') - 0.1, T4 = LS(3) - 0.12, T5 = LS(4) - 0.12, T6 = LS(5) - 0.12, T7 = LS(6) - 0.12, T8 = LS(7) - 0.1, T9 = LS(8);
// S1 hook
c(ST(1), 0.03, 0.55); c(UI, 0.02, 0.55); c(BOOM, 0.04, 0.55); c(STAT(1), 0.12, 0.35);
// S2 customers
c('whoosh-classic-airy', T2 - 0.35, 0.6); c(ZAP(1), T2 - 0.2, 0.5);
for (let i = 0; i < 16; i++) c(TICK, W(2, 'customers') + 0.5 + i * 0.125, 0.25);
['find', 'your', 'business'].forEach((p, k) => c(UP, W(2, 'find') - 0.2 + k * 0.25, 0.35)); c(OK, W(2, 'online'), 0.5); c(UI, W(2, 'online'), 0.4);
// S3 but where?
c('whoosh-wind', T3 - 0.3, 0.65); c(STAT(2), W(2, 'but'), 0.4); c('whoosh-mids', W(2, 'where') - 0.25, 0.5); c(DN, W(2, 'where') + 0.15, 0.4);
for (let k = 0; k < 4; k++) c('glitch-data-whirr', W(2, 'where') + 0.6 + k * 1.5, 0.2, { trim: 0.5, fade: 0.2 });
['explore', 'discover', 'learn'].forEach((p) => { c(UI, W(2, p) - 0.05, 0.45); c(CK1, W(2, p) + 0.1, 0.4); });
// S4 website
c(ST(2), T4 - 0.12, 0.6); c(STAT(1), T4 - 0.1, 0.4); c(UI, W(3, 'your'), 0.4); c(UI, W(3, 'website'), 0.4);
const B0 = W(3, 'website') + 0.35, CT = [B0 + 0.6, B0 + 1.25, B0 + 1.85, B0 + 2.4, B0 + 2.8, B0 + 3.2];
for (let i = 0; i < 8; i++) c(TICK, B0 + i * 0.11, 0.22);
CT.slice(1).forEach((t) => { c(CK2, t, 0.55); c(UI, t + 0.02, 0.28); });
[['professional', 0.1], ['trust', 0.1], ['reach', 0.3]].forEach(([p, d]) => { c('whoosh-softs', W(3, p) - d, 0.45); c(UP, W(3, p) + 0.3, 0.35); });
// S5 Zenith builds it
c('whoosh-classic-airy', T5 - 0.3, 0.6); c(ZAP(2), T5 - 0.1, 0.4); c(UP, W(4, 'zenith') - 0.1, 0.4); c('whoosh-softs', W(4, 'zenith') + 0.4, 0.3);
['design', 'develop', 'modern', 'ecom'].forEach((w, k) => { c(UI, W(4, w) - 0.55, 0.4); c(CK1, W(4, w) + 0.05, 0.6); c(ZAP(1), W(4, w) + 0.05, 0.3); });
['modern', 'ecom', 'booking', 'custom'].forEach((w) => { c(UI, W(4, w) - 0.1, 0.45); c(UP, W(4, w) + 0.25, 0.3); });
// S6 stop limiting
c(ST(4), T6 - 0.14, 0.65); c(STAT(2), T6 - 0.12, 0.5); c(BOOM, W(5, 'stop') + 0.1, 0.9); c('whoosh-wind', W(5, 'stop') - 0.2, 0.5); c(ST(3), W(5, 'limiting'), 0.5);
c('riser-transition-reverse-eerie-fast-short', LS(5) - 0.2, 0.35);
[0, 1, 2].forEach((k) => c(DN, W(5, 'your') + k * 0.1, 0.3)); [0, 1, 2].forEach((k) => c(DN, W(5, 'social') + k * 0.14, 0.3));
for (let i = 0; i < 6; i++) c(CK1, W(5, 'media') + 0.2 + i * 0.12, 0.3);
const BRK = T7 - 0.05; c('glitch-tape-stop', BRK - 0.45, 0.5); c(SHAT, BRK, 1.0); c(BOOM, BRK, 0.8);
// S7 build your digital presence
c('whoosh-classic-airy', T7 - 0.3, 0.8); c('glitch-data-whirr', LS(6) + 0.35, 0.5);
for (let k = 0; k < 10; k += 2) c(UP, LS(6) + 0.7 + k * 0.09, 0.28); c(UI, W(6, 'digital') - 0.1, 0.4);
// S8 expand
c('whoosh-wind', T8 - 0.3, 0.65);
for (let k = 0; k < 5; k++) c(UP, LS(7) + 0.1 + k * 0.13, 0.35); c('glitch-data-whirr', LS(7) + 0.5, 0.35);
for (let k = 0; k < 4; k++) c(UI, W(7, 'opportunities') - 0.5 + k * 0.1, 0.4);
// S9 sting
c('riser-transition-whoosh-fast-short-01', T9 - 3.0, 0.5); c(STAT(1), T9 - 0.05, 0.5); c(ST(1), T9 - 0.05, 0.6); c(BOOM, T9 - 0.02, 1.0); c('whoosh-classic-airy', T9 - 0.05, 0.9);
c(ZAP(2), T9 + 0.45, 0.4); c('whoosh-softs', T9 + 0.5, 0.4); c(OK, W(9, 'digitally') - 0.1, 0.6); c(UI, W(9, 'digitally') - 0.1, 0.5);
// resolve ids -> real index ids (glitch/ui/impact packs live in *-synth folders but keep the same ids)
const SYNTH = new Set(JSON.parse(fs.readFileSync(new URL('../../sound-effects/index.json', import.meta.url))).sounds.map((s) => s.id));
for (const q of cues) if (!SYNTH.has(q.id)) throw new Error('unknown sound id ' + q.id);
fs.writeFileSync(dir + 'sfx_cues.json', JSON.stringify(cues, null, 1));
const m = [
  [0, 'groove', {}], [W(2, 'but') - 0.1, 'soft', { gain: 0.75 }], [LS(3) - 0.1, 'tech', {}], [W(3, 'professional') - 0.1, 'build', {}],
  [LS(4) - 0.1, 'lift', {}], [LS(5) - 0.1, 'soft', { gain: 0.5 }], [LS(6) - 0.15, 'peak', { gain: 0.9 }], [LS(7) - 0.1, 'climb', {}],
  [LS(8) - 1.8, 'swell', {}], [LS(8), 'peak', { gain: 1.15 }], [W(9, 'your') - 0.1, 'cta', { gain: 0.95 }],
].map(([t, style, o]) => ({ t: +t.toFixed(2), style, override: { bright: 0.65, ...o } }));
fs.writeFileSync(dir + 'moments.json', JSON.stringify(m, null, 1));
console.log(cues.length, 'cues;', m.length, 'music sections');
