// SFX cues + music moments for the AI-tools video (same timing constants as src/scenes.js).
//   node videos/ai-tools-money/make_cues.mjs   (from the repo root)
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const WORDS = JSON.parse(fs.readFileSync(dir + 'words.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
const LS = (n) => WORDS.find((w) => w.line === n).s;
const W = (n, p) => { const x = WORDS.find((w) => w.line === n && norm(w.w).startsWith(p)); if (!x) throw new Error(`word not found L${n} ${p}`); return x.s; };
const cues = []; const c = (id, t, vol = 0.6, extra = {}) => cues.push({ id, t: +Math.max(0, t).toFixed(3), vol, ...extra });
const UI = 'whoosh-designed-generic-air', CK1 = 'ui-click-01', CK2 = 'ui-click-02', TICK = 'ui-typing-tick', UP = 'ui-blip-up', DN = 'ui-blip-down', OK = 'ui-confirm', COIN = 'ui-coin-ding', PING = 'ui-notify-ping';
const BOOM = 'impact-sub-boom', SHAT = 'impact-glass-shatter', CRK = 'impact-glass-crack', AIRY = 'whoosh-classic-airy', WIND = 'whoosh-wind', SOFT = 'whoosh-softs', MID = 'whoosh-mids', WHIRR = 'glitch-data-whirr';
const TG = W(1, 'experience') + 0.25, SHT = W(2, 'five') + 0.05;
const T3 = LS(3) - 0.1, T4 = LS(4) - 0.1, T5 = LS(5) - 0.1, T6 = LS(6) - 0.1, T7 = LS(7) - 0.1, T8 = LS(8) - 0.1, T9 = LS(9) - 0.1, T10 = LS(10) - 0.1, T11 = LS(11) - 0.1, T12 = LS(12) - 0.1, T13 = LS(13) - 0.1;
// S1 hook
c(AIRY, 0.0, 0.5); c(BOOM, 0.05, 0.5); for (let k = 0; k < 4; k++) c(UP, 0.3 + k * 0.3, 0.3); for (let k = 0; k < 8; k++) c(COIN, W(1, 'money') - 0.1 + k * 0.12, 0.28);
c(UP, W(1, 'online'), 0.4); c(UI, W(1, 'using'), 0.5); c(OK, W(1, 'using'), 0.5); c(SOFT, W(1, 'even') - 0.1, 0.5); c(CK1, W(1, 'even') - 0.1, 0.4); c(CK1, W(1, 'even') + 0.1, 0.4);
['coding', 'design'].forEach((p) => { c(BOOM, W(1, p), 0.65); c(CK2, W(1, p), 0.5); c(DN, W(1, p) + 0.05, 0.5); });
// S2 glass break -> five tools
c(MID, TG - 0.1, 0.55); c(UP, TG + 0.1, 0.3); c(SOFT, TG + 0.5, 0.3);
c('riser-stutter-is-coming', SHT - 3.8, 0.3); c('riser-transition-reverse-eerie-fast-short', SHT - 2.9, 0.4);
c(CRK, SHT - 0.34, 0.85); c(CRK, SHT - 0.2, 0.75); c(SHAT, SHT, 1.0); c(BOOM, SHT, 1.0); c(AIRY, SHT, 0.8);
for (let k = 0; k < 5; k++) { c(UP, SHT + 0.25 + k * 0.1, 0.4); c(UI, SHT + 0.25 + k * 0.1, 0.25); }
c(UI, W(2, 'tools') - 0.1, 0.45); c(CK1, W(2, 'skills') - 0.3, 0.4); c(SOFT, W(2, 'into') - 0.1, 0.4); c(OK, W(2, 'business') - 0.1, 0.5);
// tool scenes
const tool = (T, line, nameWord, items, extra) => { const t0 = W(line, nameWord);
  c(MID, T - 0.35, 0.6); c(UI, t0 - 0.75, 0.45); c(BOOM, t0 + 0.05, 0.5); c(SOFT, t0 - 0.05, 0.4); c(UP, T + 0.15, 0.35);
  items.forEach((p) => { const t = W(line, p) - 0.15; c(UI, t, 0.4); c(CK1, t + 0.1, 0.4); c(UP, t + 0.25, 0.3); }); extra && extra(); };
tool(T3, 3, 'chatgpt', ['write', 'research', 'marketing', 'everyday'], () => { [W(3, 'write') - 0.05, W(3, 'write') + 0.6, W(3, 'research') - 0.05, W(3, 'marketing') - 0.05, W(3, 'everyday') - 0.05].forEach((t) => c(PING, t, 0.5)); for (let k = 0; k < 4; k++) c(UP, W(3, 'marketing') + 0.2 + k * 0.1, 0.25); });
tool(T4, 4, 'canva', ['social', 'presentations', 'advertisements', 'digital'], () => { ['social', 'presentations', 'advertisements', 'digital'].forEach((p) => { c(CK1, W(4, p) - 0.1, 0.4); c(CK2, W(4, p) + 0.5, 0.4); c(UI, W(4, p) - 0.1, 0.35); }); });
tool(T5, 5, 'capcut', ['short', 'businesses', 'content'], () => { for (let k = 0; k < 7; k++) c(CK1, W(5, 'offer') + 0.1 + k * 0.1, 0.25); c(CK2, W(5, 'editing') + 0.05, 0.6); c(UI, W(5, 'editing') + 0.05, 0.5); c(CRK, W(5, 'editing') + 0.05, 0.4); c(WHIRR, W(5, 'short'), 0.25, { trim: 1.5, fade: 0.5 }); });
tool(T6, 6, 'lovable', ['websites', 'simple', 'experienced'], () => { for (let i = 0; i < 14; i++) c(TICK, W(6, 'build') + 0.1 + i * 0.08, 0.22); for (let k = 0; k < 6; k++) c(CK1, W(6, 'websites') + 0.1 + k * 0.18, 0.35); c(UI, W(6, 'applications') - 0.2, 0.45); c(OK, W(6, 'experienced') - 0.4, 0.55); c(BOOM, W(6, 'experienced') - 0.35, 0.45); });
tool(T7, 7, 'zapier', ['automate', 'connect', 'save'], () => { for (let k = 0; k < 3; k++) { c(UP, W(7, 'connect') + k * 0.2, 0.4); c(WHIRR, W(7, 'connect') + 0.15 + k * 0.2, 0.18, { trim: 0.4, fade: 0.15 }); } c(UI, W(7, 'automate'), 0.4); c(OK, W(7, 'save') + 0.5, 0.55); for (let k = 0; k < 5; k++) c(COIN, W(7, 'work') - 0.1 + k * 0.1, 0.3); });
// S8 interesting part
c(AIRY, T8 - 0.3, 0.8); c(BOOM, T8 + 0.5, 0.55); c(OK, T8 + 0.8, 0.5); c(UI, W(8, 'interesting') - 0.1, 0.4); c(UI, W(8, 'part') - 0.15, 0.45);
// S9 master all five
c(WIND, T9 - 0.3, 0.65); for (let k = 0; k < 5; k++) c(UP, T9 + 0.25 + k * 0.08, 0.3); c(UI, W(9, 'five') - 0.1, 0.45); c(CK2, W(9, 'five') - 0.1, 0.5); c(BOOM, W(9, 'tools') - 0.05, 0.8); c(DN, W(9, 'tools') - 0.05, 0.5);
// S10 four steps
c(MID, T10 - 0.35, 0.6); ['pick', 'learn', 'create', 'offering'].forEach((p, k) => { const t = W(10, p) - 0.2; c(UI, t, 0.45); c(CK1, t + 0.1, 0.4); c(UP, t + 0.3, 0.3); if (k) c(UP, t + 0.1, 0.25); }); c(OK, W(10, 'businesses') + 0.2, 0.6); for (let k = 0; k < 6; k++) c(COIN, W(10, 'businesses') + 0.25 + k * 0.1, 0.3);
// S11 not selling AI
c(AIRY, T11 - 0.3, 0.8); c(UI, W(11, 'selling') - 0.1, 0.4); c(BOOM, W(11, 'ai') + 0.1, 0.8); c(DN, W(11, 'ai') + 0.1, 0.5); c(CRK, W(11, 'ai') + 0.1, 0.4);
c(WIND, W(11, 'selling') + 0.5, 0.45); c(WIND, W(11, 'selling') + 0.7, 0.45); c(UI, W(11, 'solution') - 0.1, 0.45);
c(BOOM, W(11, 'solution') + 0.85, 0.8); c(CK2, W(11, 'solution') + 0.85, 0.6); c(OK, W(11, 'solution') + 0.9, 0.7); for (let k = 0; k < 8; k++) c(COIN, W(11, 'solution') + 0.95 + k * 0.1, 0.3);
// S12 overnight / doors
c(WIND, T12 - 0.3, 0.65); c(UI, T12 + 0.15, 0.4); for (let i = 0; i < 10; i++) c(TICK, W(12, 'make') + 0.3 + i * 0.18, 0.2);
c(BOOM, W(12, 'overnight') + 0.4, 0.8); c(DN, W(12, 'overnight') + 0.4, 0.5); c(UI, W(12, 'learning') - 0.1, 0.5);
c(AIRY, W(12, 'open') - 0.05, 0.8); c(MID, W(12, 'open') - 0.05, 0.5); c(BOOM, W(12, 'open') + 0.5, 0.55); c(OK, W(12, 'open') + 0.3, 0.5);
for (let k = 0; k < 5; k++) { const t = W(12, 'opportunities') + k * 0.12; c(UI, t, 0.45); c(UP, t + 0.4, 0.4); } c(UI, W(12, 'exist') - 0.1, 0.45);
// S13 CTA
c(MID, T13 - 0.35, 0.7); c(BOOM, T13 - 0.04, 0.7); c(UI, W(13, 'comment') - 0.05, 0.5); c(OK, W(13, 'ai') - 0.1, 0.65); c(UI, W(13, 'ai') - 0.1, 0.5);
for (let i = 0; i < 3; i++) c(TICK, W(13, 'ai') + 0.5 + i * 0.12, 0.25); c(CK2, W(13, 'ai') + 1.1, 0.5); c(PING, W(13, 'tutorial') - 0.1, 0.6); c(UI, W(13, 'tutorial') + 0.7, 0.5);
c(UI, W(13, 'step') - 0.2, 0.45); c(CK1, W(13, 'step') - 0.1, 0.4); c(UI, W(13, 'in') - 0.15, 0.45); c(CK1, W(13, 'in') - 0.05, 0.4);
for (let k = 0; k < 5; k++) c(UP, W(13, 'your') + k * 0.08, 0.3); c(AIRY, W(13, 'your'), 0.5); c(OK, W(13, 'your') + 0.05, 0.5);
const IDS = new Set(JSON.parse(fs.readFileSync(new URL('../../sound-effects/index.json', import.meta.url))).sounds.map((s) => s.id));
for (const q of cues) if (!IDS.has(q.id)) throw new Error('unknown sound id ' + q.id);
fs.writeFileSync(dir + 'sfx_cues.json', JSON.stringify(cues, null, 1));
// music: calm, confident, one linear groove that only builds (impact on the glass reveal)
const m = [[0, 'intro', { gain: 0.8 }], [SHT, 'groove', { gain: 0.9 }], [T5, 'build', { gain: 0.95 }], [T8, 'lift', { gain: 1.0 }], [T12, 'climb', { gain: 1.05 }], [T13, 'peak', { gain: 1.1 }]]
  .map(([t, style, o]) => ({ t: +t.toFixed(2), style, override: { bright: 0.55, ...o } }));
fs.writeFileSync(dir + 'moments.json', JSON.stringify(m, null, 1));
console.log(cues.length, 'cues;', m.map((x) => x.t + ' ' + x.style).join(' | '));
