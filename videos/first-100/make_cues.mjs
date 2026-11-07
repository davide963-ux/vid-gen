// Generates sfx_cues.json for this video from words.json (same timing the visuals use).
//   node videos/first-100/make_cues.mjs   (run from the repo root)  ->  node scripts/build_sfx_track.mjs videos/first-100 videos/first-100/sfx_cues.json
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const WORDS = JSON.parse(fs.readFileSync(dir + 'words.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
const LS = (n) => WORDS.find((w) => w.line === n).s;
const W = (n, p) => { const x = WORDS.find((w) => w.line === n && norm(w.w).startsWith(p)); if (!x) throw new Error(`word not found L${n} ${p}`); return x.s; };
const cues = []; const c = (id, t, vol = 0.8, extra = {}) => cues.push({ id, t: +Math.max(0, t).toFixed(3), vol, ...extra });
const POP = ['cartoon-pop-various', 'cartoon-pop-mouth-finger', 'cartoon-pop-pops-x6', 'cartoon-pop-mouth-finger'];
let pi = 0; const pop = (t, v = 0.75) => c(POP[pi++ % POP.length], t, v);
const wipe = (t, id = 'whoosh-mids', v = 0.7) => c(id, t - 0.12, v);

// hook
c('whoosh-designed-generic-air', 0.02, 0.7); pop(W(1, '$100'), 0.6);
c('cartoon-whistle-slip-trip-up', W(1, 'experience'), 0.7);
// intro
wipe(LS(2), 'whoosh-wind', 0.6);
['exactly', 'how', 'can', 'start'].forEach((p) => c('cartoon-pop-mouth-finger', W(2, p) + 0.05, 0.55));
c('car-start-idle-external-rover', W(2, 'start') - 0.1, 0.4, { trim: 1.8, fade: 0.5 });
// step 1
c('riser-transition-whoosh-fast-short-01', LS(3) - 2.7, 0.4); wipe(LS(3), 'whoosh-mids', 0.8);
pop(W(3, 'choose'), 0.6); pop(W(3, 'service') - 0.2, 0.7);
wipe(LS(4) - 0.15, 'whoosh-softs', 0.55); c('cartoon-whistle-slip-trip-up', W(4, 'expert') + 0.35, 0.6); c('cartoon-boing-jump', W(4, 'expert') + 0.4, 0.45);
// list
wipe(LS(5), 'whoosh-wind', 0.5);
['editing', 'designing', 'writing', 'creating'].forEach((p) => pop(W(5, p) - 0.1, 0.85));
// step 2
c('riser-transition-reverse-eerie-fast-short', LS(6) - 2.6, 0.4); wipe(LS(6), 'whoosh-mids', 0.8);
pop(W(6, 'free'), 0.7); pop(W(6, 'ai'), 0.7); pop(W(6, 'tools'), 0.7);
// ChatGPT + Canva
wipe(LS(7), 'whoosh-softs', 0.5);
c('cartoon-boing-jump', W(7, 'chatgpt') - 0.05, 0.7); c('cartoon-boing-action-jump-jaw-harp', W(7, 'canva') - 0.05, 0.5);
['content', 'ideas', 'graphics', 'improve'].forEach((p) => c('cartoon-pop-mouth-finger', W(7, p) - 0.05, 0.65));
// examples
wipe(LS(8), 'whoosh-softs', 0.5); pop(W(8, '2'), 0.8); pop(W(8, '3'), 0.8); c('whoosh-designed-generic-air', W(8, 'examples') - 0.1, 0.6); pop(W(8, 'show'), 0.7);
// step 3
c('riser-stutter-is-coming', LS(9) - 3.6, 0.35); wipe(LS(9) + 0.05, 'whoosh-classic-airy', 0.8); pop(W(9, 'find'), 0.6); pop(W(9, 'customers'), 0.75);
// platforms
wipe(LS(10), 'whoosh-wind', 0.5);
['instagram', 'facebook', 'fiverr', 'upwork'].forEach((p) => pop(W(10, p) - 0.05, 0.85));
// problems
wipe(LS(11), 'whoosh-softs', 0.5); pop(W(11, 'businesses') + 0.2, 0.7); pop(W(11, 'poor') - 0.05, 0.75);
c('cartoon-trombone-vintage-failure-sad', W(11, 'don'), 0.5, { trim: 2.4, fade: 0.7 });
// contact
wipe(LS(12), 'whoosh-wind', 0.5); ['contact', 'how', 'could'].forEach((p) => pop(W(12, p), 0.75)); pop(W(12, 'business'), 0.7);
// step 4
c('riser-stutter-is-coming', LS(13) - 3.5, 0.35); wipe(LS(13) + 0.05, 'whoosh-classic-airy', 0.8); pop(W(13, 'get') + 0.1, 0.7);
// offer
wipe(LS(14), 'whoosh-softs', 0.5); pop(W(14, '$25') - 0.05, 0.8); pop(W(14, 'small') - 0.05, 0.7);
// 4 x $25 = $100
wipe(LS(15), 'whoosh-wind', 0.45);
['four', 'clients', 'paying', '$25'].forEach((p) => c('cartoon-pop-mouth-finger', W(15, p), 0.7));
c('cartoon-pop-pops-x6', W(15, 'gets') + 0.3, 0.7);
c('cartoon-musical-success-fanfare', W(15, '$100') - 0.05, 0.8);
// not overnight
wipe(LS(16), 'whoosh-wind', 0.5); pop(W(16, 'rich') + 0.1, 0.7); c('cartoon-making-fun-of-descending-02', W(16, 'overnight') + 0.4, 0.55);
// three actions
c('car-pass-by-fast', W(17, 'get') - 0.1, 0.5);
['started', 'build', 'land'].forEach((p) => { c('whoosh-designed-generic-air', W(17, p) - 0.3, 0.55); pop(W(17, p) - 0.15, 0.75); });
// CTA
c('car-horn-beep-short-x3', LS(18) - 0.2, 0.35); wipe(LS(18), 'whoosh-mids', 0.7);
c('cartoon-pop-pops-x6', W(18, '100') + 0.05, 0.8); pop(W(18, 'receive'), 0.6); pop(W(18, 'in'), 0.7);
fs.writeFileSync(dir + 'sfx_cues.json', JSON.stringify(cues, null, 1));
console.log(cues.length, 'cues');
