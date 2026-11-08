// SFX cues + music moments for the Claude money video (same timing constants as src/scenes.js).
//   node videos/claude-money/make_cues.mjs   (from the repo root)
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const WORDS = JSON.parse(fs.readFileSync(dir + 'words.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
const LS = (n) => WORDS.find((w) => w.line === n).s;
const W = (n, p) => { const x = WORDS.find((w) => w.line === n && norm(w.w).startsWith(p)); if (!x) throw new Error(`word not found L${n} ${p}`); return x.s; };
const cues = []; const c = (id, t, vol = 0.6, extra = {}) => cues.push({ id, t: +Math.max(0, t).toFixed(3), vol, ...extra });
const UI = 'whoosh-designed-generic-air', CK1 = 'ui-click-01', CK2 = 'ui-click-02', TICK = 'ui-typing-tick', UP = 'ui-blip-up', DN = 'ui-blip-down', OK = 'ui-confirm', COIN = 'ui-coin-ding', PING = 'ui-notify-ping';
const BOOM = 'impact-sub-boom', SHAT = 'impact-glass-shatter', CRK = 'impact-glass-crack', AIRY = 'whoosh-classic-airy', WIND = 'whoosh-wind', SOFT = 'whoosh-softs', MID = 'whoosh-mids', WHIRR = 'glitch-data-whirr';
const ST = (i) => `glitch-stutter-0${i}`, ZAP = (i) => `glitch-zap-0${i}`, STAT = (i) => `glitch-static-burst-0${i}`;
const T2 = W(1, 'even') - 0.1, TG = LS(2) - 0.1, TH = LS(3) - 0.1, TP = LS(5) - 0.1, TL = LS(6) - 0.1, TF = LS(7) - 0.1, TB = LS(8) - 0.1, TA = LS(9) - 0.1, TC = LS(10) - 0.1, T1X = LS(11) - 0.1, TO = LS(12) - 0.1, TZ = LS(13) - 0.1, TN = LS(14) - 0.1, TS = LS(15) - 0.1, TW = LS(16) - 0.1, TU = LS(17) - 0.1;
const CLT = W(2, 'claude');
// S1 hook
c(ST(1), 0.03, 0.55); c(AIRY, 0.0, 0.55); c(BOOM, 0.05, 0.6); for (let k = 0; k < 5; k++) c(UP, 0.25 + k * 0.3, 0.3);
c(ZAP(1), W(1, 'using'), 0.5); c(UI, W(1, 'using'), 0.5); c(BOOM, W(1, 'using') + 0.02, 0.5);
// S2 no coding / design
c(ST(3), T2 - 0.12, 0.6); c(STAT(1), T2 - 0.1, 0.4); c(UI, W(1, 'even'), 0.4); c(UI, W(1, 'even') + 0.15, 0.4);
['absolutely'].forEach((p) => c(UP, W(1, p), 0.4));
['coding', 'design'].forEach((p) => { c(BOOM, W(1, p), 0.65); c(ZAP(2), W(1, p), 0.5); c(CK1, W(1, p) + 0.05, 0.5); }); c(DN, W(1, 'experience'), 0.5);
// S3 glass break -> Claude
c(AIRY, TG - 0.35, 0.6); c(ZAP(1), TG - 0.2, 0.4); c(UP, TG + 0.1, 0.3); c(SOFT, TG + 1.0, 0.3); c(SOFT, TG + 2.3, 0.3);
c('riser-stutter-is-coming', CLT - 3.8, 0.32); c('riser-transition-reverse-eerie-fast-short', CLT - 2.9, 0.42);
c(CRK, CLT - 0.34, 0.85); c(CRK, CLT - 0.2, 0.75); c(SHAT, CLT, 1.0); c(BOOM, CLT, 1.0); c(AIRY, CLT, 0.8); c(OK, CLT + 0.4, 0.5); c(UI, CLT + 0.3, 0.5);
// S4 hub
c(WIND, TH - 0.3, 0.65); c(UP, W(3, 'works'), 0.4);
['websites', 'applications', 'digital', 'marketing', 'automate'].forEach((p) => { const t = W(4, p) - 0.3; c(UI, t, 0.45); c(CK1, t + 0.15, 0.4); c(UP, t + 0.3, 0.3); c(WHIRR, t - 0.1, 0.18, { trim: 0.4, fade: 0.15 }); });
// S5 payments
c(ST(4), TP - 0.14, 0.65); c(STAT(2), TP - 0.12, 0.5);
[W(5, 'people'), W(5, 'already'), W(5, 'paying'), W(5, 'these')].forEach((t, k) => { c(PING, t - 0.1, 0.6); if (k < 3) c(COIN, t + 0.1, 0.45); });
for (let k = 0; k < 8; k++) c(COIN, W(5, 'paying') - 0.1 + k * 0.12, 0.3);
// S6 laptop
c(WIND, TL - 0.3, 0.65); c(UI, W(6, 'money'), 0.4); for (let k = 0; k < 6; k++) c(CK1, W(6, 'building') + 0.4 + k * 0.2, 0.4); for (let k = 0; k < 7; k++) c(COIN, W(6, 'websites') + 0.7 + k * 0.11, 0.3);
// S7 find businesses
c(AIRY, TF - 0.3, 0.6); c(ZAP(1), TF - 0.15, 0.4); for (let k = 0; k < 9; k++) c(UP, W(7, 'small') + 0.25 + k * 0.1, 0.22);
c(WHIRR, W(7, 'businesses') + 0.2, 0.3, { trim: 1.2, fade: 0.4 });
for (let i = 0; i < 3; i++) c(DN, W(7, 'don') + 0.1 + i * 0.35, 0.4); c(ST(2), W(7, 'don'), 0.4); for (let i = 0; i < 2; i++) c(DN, W(7, 'outdated') + i * 0.3, 0.4); c(OK, W(7, 'one') - 0.1, 0.5);
// S8 Claude builds the site
c(ST(2), TB - 0.12, 0.6); for (let i = 0; i < 24; i++) c(TICK, W(8, 'use') + 0.35 + i * 0.07, 0.22);
['design', 'build', 'professional'].forEach((p) => { c(CK1, W(8, p) - 0.1, 0.45); c(UP, W(8, p) - 0.05, 0.35); });
for (let k = 0; k < 7; k++) c(CK1, (k < 4 ? W(8, 'design') + 0.3 + k * 0.18 : W(8, 'build') + 0.2 + (k - 4) * 0.22), 0.4);
c(OK, W(8, 'website') - 0.05, 0.7); c(BOOM, W(8, 'website'), 0.5); c(UI, W(8, 'website'), 0.5);
// S9 approach
c(WIND, TA - 0.3, 0.65); [W(9, 'approach') - 0.1, W(9, 'create') - 0.1, W(9, 'helps') - 0.3].forEach((t) => c(PING, t, 0.55)); c(UP, W(9, 'helps') - 0.1, 0.4);
for (let k = 0; k < 6; k++) c(UP, W(9, 'attract') + 0.7 + k * 0.26, 0.28); for (let k = 0; k < 5; k++) c(UP, W(9, 'attract') + 0.3 + k * 0.3, 0.25);
// S10 pricing
c(AIRY, TC - 0.3, 0.8); c(ST(1), TC - 0.1, 0.4); c(BOOM, W(10, 'charge') + 0.35, 0.8);
[W(10, '$300'), W(10, '$500'), W(10, 'even')].forEach((t, k) => { c(UI, t - 0.1, 0.5); c(BOOM, t, 0.5); if (k < 2) for (let j = 0; j < 7; j++) c(COIN, t + 0.1 + j * 0.1, 0.32); else c(OK, t, 0.6); });
c(WHIRR, W(10, 'complexity'), 0.3, { trim: 1.2, fade: 0.4 }); c(WHIRR, W(10, 'value'), 0.3, { trim: 1.2, fade: 0.4 });
[W(5, 'people'), W(5, 'already'), W(5, 'paying'), W(10, '$300'), W(10, '$500')].forEach((t) => c(UP, t, 0.3));
// S11 one example
c(ST(3), T1X - 0.12, 0.6); c(BOOM, W(11, 'example'), 0.6); c(AIRY, W(11, 'example') - 0.2, 0.6); for (let k = 0; k < 8; k++) c(UP, W(11, 'example') - 0.2 + k * 0.07, 0.22);
// S12 options
c(WIND, TO - 0.3, 0.65);
['digital', 'business', 'ai', 'content'].forEach((p) => { const t = W(12, p) - 0.25; c(UI, t, 0.45); c(CK1, t + 0.2, 0.4); });
c(WHIRR, W(12, 'business') + 0.7, 0.25, { trim: 1.0, fade: 0.3 }); c(PING, W(12, 'ai') + 0.2, 0.5); for (let k = 0; k < 3; k++) c(UP, W(12, 'creation') - 0.2 + k * 0.15, 0.3);
// S13 faster
c(WIND, TZ - 0.3, 0.65); for (let k = 0; k < 6; k++) c(CK1, W(13, 'do') + k * 0.16, 0.35);
c(BOOM, W(13, 'claude'), 0.7); c(AIRY, W(13, 'claude') - 0.2, 0.8); c(SOFT, W(13, 'claude') + 0.1, 0.4);
for (let k = 0; k < 6; k++) c(OK, W(13, 'claude') + 0.3 + k * 0.32 + 0.9, 0.22);
c(BOOM, W(13, 'faster') - 0.1, 0.6); c(ZAP(2), W(13, 'faster') - 0.1, 0.5); c(WHIRR, W(13, 'much'), 0.35, { trim: 1.4, fade: 0.4 }); c(AIRY, W(13, 'produce'), 0.6);
// S14 not selling AI
c(ST(4), TN - 0.14, 0.7); c(STAT(2), TN - 0.1, 0.5); c(ZAP(2), W(14, 'selling'), 0.5); c('glitch-tape-stop', W(14, 'ai') - 0.35, 0.45);
c(BOOM, W(14, 'ai') + 0.1, 0.9); c(DN, W(14, 'ai') + 0.1, 0.5); c(ST(1), W(14, 'ai') + 0.1, 0.5);
// S15 solve problems
c(AIRY, TS - 0.3, 0.8); c(UI, W(15, 'solve') - 0.1, 0.5);
for (let k = 0; k < 3; k++) { const t0 = W(15, 'solve') - 0.1 + k * 0.55; c(DN, t0, 0.35); c(OK, t0 + 0.75, 0.45); c(COIN, t0 + 0.85, 0.4); }
for (let k = 0; k < 9; k++) c(COIN, W(15, 'pay') - 0.2 + k * 0.1, 0.3); c(UI, W(15, 'pay') - 0.2, 0.5); c(OK, W(15, 'pay'), 0.55);
// S16 want to learn
c(WIND, TW - 0.3, 0.65); c('riser-transition-reverse-eerie-fast-short', TW - 1.6, 0.35); c(AIRY, TW + 0.05, 0.7); for (let k = 0; k < 4; k++) c(UP, W(16, 'learn') + k * 0.1, 0.3);
// S17 CTA
c(AIRY, TU - 0.3, 0.8); c(BOOM, TU, 0.9); c(UI, W(17, 'comment') - 0.05, 0.5); c(OK, W(17, 'claude') - 0.15, 0.6); c(UI, W(17, 'claude') - 0.15, 0.5);
for (let i = 0; i < 6; i++) c(TICK, W(17, 'claude') + 0.5 + i * 0.1, 0.25); c(CK2, W(17, 'claude') + 1.2, 0.5); c(PING, W(17, 'tutorial') - 0.2, 0.6); c(UI, W(17, 'tutorial') + 0.6, 0.5);
c(UI, W(17, 'receive') - 0.1, 0.4); c(UP, W(17, 'in'), 0.4); c(AIRY, W(17, 'your'), 0.5); c(OK, W(17, 'your') + 0.05, 0.5);
// ids must exist in the sound index
const IDS = new Set(JSON.parse(fs.readFileSync(new URL('../../sound-effects/index.json', import.meta.url))).sounds.map((s) => s.id));
for (const q of cues) if (!IDS.has(q.id)) throw new Error('unknown sound id ' + q.id);
fs.writeFileSync(dir + 'sfx_cues.json', JSON.stringify(cues, null, 1));
// music: one continuous groove, energy only goes UP (linear), impact on the Claude reveal
const m = [[0, 'intro', { gain: 0.8 }], [CLT, 'groove', { gain: 0.9 }], [TP, 'build', { gain: 1.0 }], [TA, 'tech', { gain: 1.0 }], [T1X, 'lift', { gain: 1.05 }], [TN, 'climb', { gain: 1.1 }], [TU, 'peak', { gain: 1.15 }]]
  .map(([t, style, o]) => ({ t: +t.toFixed(2), style, override: { bright: 0.75, ...o } }));
fs.writeFileSync(dir + 'moments.json', JSON.stringify(m, null, 1));
console.log(cues.length, 'cues;', m.map((x) => x.t + ' ' + x.style).join(' | '));
