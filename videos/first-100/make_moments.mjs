// Maps the story beats (from words.json) to music styles for scripts/gen_music_moments.py
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const WORDS = JSON.parse(fs.readFileSync(dir + 'words.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
const LS = (n) => WORDS.find((w) => w.line === n).s;
const W = (n, p) => WORDS.find((w) => w.line === n && norm(w.w).startsWith(p)).s;
const m = [
  [0, 'intro'],                    // hook + "here's how"
  [LS(3) - 0.1, 'groove'],         // step 1: kick + bass come in
  [LS(6) - 0.1, 'tech'],           // step 2 (AI tools): hats, clap, 16th arp
  [LS(9) - 0.1, 'build'],          // step 3: warmer chords + counter-melody
  [LS(11) - 0.1, 'soft'],          // "poor content / no website": drums drop, minor colour, soft pad
  [LS(12) - 0.1, 'hopeful'],       // "contact them": back to major, hopeful
  [LS(13) - 0.1, 'lift'],          // step 4 (get paid): bright lift
  [W(15, 'gets') - 0.1, 'swell'],  // "gets you to your first..." riser + snare roll
  [W(15, '$100'), 'peak'],         // "$100": impact + full groove
  [LS(16) - 0.1, 'play'],          // "get rich overnight?": light, playful
  [LS(17) - 0.1, 'climb'],         // "get started, build, land": full energy
  [LS(18) - 0.1, 'cta'],           // CTA: peak + crash
].map(([t, style]) => ({ t: +t.toFixed(2), style }));
fs.writeFileSync(dir + 'moments.json', JSON.stringify(m, null, 1)); console.log(m.map((x) => x.t + ' ' + x.style).join(' | '));
