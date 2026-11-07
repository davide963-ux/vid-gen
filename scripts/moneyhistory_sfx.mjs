// Deterministic SFX bed for the digital-money: synthesized in JS (seeded noise), no downloads.
// Usage: node scripts/frog_sfx.mjs <out.wav>
import { writeFileSync, readFileSync } from 'node:fs';

const SR = 44100, DUR = 76;
const N = SR * DUR;
const L = new Float32Array(N);
let seed = 1234567;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const add = (t, buf, gain = 1) => { const s = Math.floor(t * SR); for (let i = 0; i < buf.length && s + i < N; i++) L[s + i] += buf[i] * gain; };
const lp = (x, f) => { const a = Math.exp(-2 * Math.PI * f / SR); let y = 0; return x.map(v => (y = (1 - a) * v + a * y)); };
const hp = (x, f) => { const l = lp(x, f); return x.map((v, i) => v - l[i]); };
const env = (n, a, d) => Float32Array.from({ length: n }, (_, i) => { const t = i / SR; return Math.min(1, t / a) * Math.exp(-t / d); });
const noise = (n) => Float32Array.from({ length: n }, () => rnd() * 2 - 1);

// soft "whoosh": band-passed noise swelling then fading, with a frequency sweep
const whoosh = (t, dur, gain, f0 = 500, f1 = 2400) => {
  const n = Math.floor(dur * SR); const x = noise(n); const out = new Float32Array(n);
  const seg = 32; for (let s = 0; s < n; s += seg) {
    const p = s / n, f = f0 + (f1 - f0) * Math.sin(p * Math.PI);
    const a = Math.exp(-2 * Math.PI * f / SR); let y = 0; for (let i = s; i < Math.min(n, s + seg); i++) { y = (1 - a) * x[i] + a * y; out[i] = x[i] - y; }
  }
  const lpd = lp(out, f1 * 1.2);
  add(t, lpd.map((v, i) => v * Math.sin(Math.PI * i / n) ** 1.5), gain);
};
// thump: pitched-down sine + a little noise
const thud = (t, f0, dur, gain, nz = 0.3) => {
  const n = Math.floor(dur * SR); const e = env(n, 0.002, dur / 5); const nn = lp(noise(n), 900);
  let ph = 0; const out = new Float32Array(n);
  for (let i = 0; i < n; i++) { const f = f0 * (1 + 1.4 * Math.exp(-i / SR / 0.03)); ph += 2 * Math.PI * f / SR; out[i] = (Math.sin(ph) + nz * nn[i]) * e[i]; }
  add(t, out, gain);
};
const click = (t, gain) => { const n = Math.floor(0.05 * SR); const e = env(n, 0.0005, 0.012); add(t, hp(lp(noise(n), 3500), 900).map((v, i) => v * e[i]), gain); };
const chirp = (t, f, gain) => { const n = Math.floor(0.22 * SR); let ph = 0; const out = new Float32Array(n); for (let i = 0; i < n; i++) { const p = i / n; const ff = f * (1 + 0.5 * Math.sin(p * 18) * (1 - p) + 0.3 * p); ph += 2 * Math.PI * ff / SR; out[i] = Math.sin(ph) * Math.sin(Math.PI * p) ** 2; } add(t, out, gain); };
const gong = (t, gain) => { const n = Math.floor(1.4 * SR); const e = env(n, 0.003, 0.45); const out = new Float32Array(n); for (let i = 0; i < n; i++) { const tt = i / SR; out[i] = (Math.sin(2 * Math.PI * 440 * tt) + 0.6 * Math.sin(2 * Math.PI * 663 * tt) + 0.4 * Math.sin(2 * Math.PI * 1187 * tt)) * e[i]; } add(t, out, gain); };

const ping = (t, f, dur, gain, h2 = 0.35) => { const n = Math.floor(dur * SR); const e = env(n, 0.002, dur / 4); const out = new Float32Array(n); for (let i = 0; i < n; i++) { const tt = i / SR; out[i] = (Math.sin(2 * Math.PI * f * tt) + h2 * Math.sin(2 * Math.PI * f * 2.76 * tt)) * e[i]; } add(t, out, gain); };
// riser / downer: sine sweep with swelling envelope
const sweep = (t, dur, f0, f1, gain, nz = 0.2) => { const n = Math.floor(dur * SR); let ph = 0; const out = new Float32Array(n); const nn = lp(noise(n), 2500); for (let i = 0; i < n; i++) { const p = i / n; const f = f0 * Math.pow(f1 / f0, p); ph += 2 * Math.PI * f / SR; out[i] = (Math.sin(ph) + nz * nn[i]) * Math.sin(Math.PI * p) ** 1.4; } add(t, out, gain); };
// deep boom: sub sine drop + noise tail
const boom = (t, gain, len = 1.8) => { const n = Math.floor(len * SR); let ph = 0; const out = new Float32Array(n); const e = env(n, 0.004, len / 3.2); const nn = lp(noise(n), 300); for (let i = 0; i < n; i++) { const f = 38 + 90 * Math.exp(-i / SR / 0.08); ph += 2 * Math.PI * f / SR; out[i] = (Math.sin(ph) + 0.35 * nn[i]) * e[i]; } add(t, out, gain); };

// word-timing lookup so every sound lands on the spoken word
const WORDS = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const at = (line, k) => WORDS.filter((w) => w.line === line)[k].s;
const pop = (t, f = 700, g = 0.2) => { ping(t, f, 0.12, g, 0.15); click(t, g * 0.8); };
const stampHit = (t) => { thud(t, 85, 0.35, 0.7, 0.7); click(t, 0.5); };
const sparkle = (t, n = 8, g = 0.06) => { for (let i = 0; i < n; i++) ping(t + i * 0.045, 1800 + (i % 4) * 330, 0.14, g, 0.2); };
const swoosh = (t, d, g = 0.1) => whoosh(t, d, g, 400, 2200);
const bell = (t, g = 0.2) => { ping(t, 2093, 1.2, g, 0.4); ping(t + 0.01, 3136, 1.0, g * 0.7, 0.3); ping(t + 0.02, 4186, 0.8, g * 0.4, 0.2); };
const ticks = (t, f0, f1, n, dt, g) => { for (let i = 0; i < n; i++) { const f = f0 + (f1 - f0) * (i / Math.max(1, n - 1)); ping(t + i * dt, f, 0.06, g, 0.1); click(t + i * dt, g * 0.5); } };
const nope = (t) => { thud(t, 70, 0.4, 0.5, 0.4); ping(t, 330, 0.8, 0.1, 0.2); ping(t + 0.05, 247, 0.8, 0.09, 0.2); };

const riser = (t, d, f0, f1, g) => { const n = Math.floor(d * SR); let ph = 0; const out = new Float32Array(n); for (let i = 0; i < n; i++) { const p = i / n; ph += 2 * Math.PI * (f0 + (f1 - f0) * p) / SR; out[i] = Math.sin(ph) * Math.sin(Math.PI * p) * 0.9; } add(t, out, g); };
const chime = (t, g = 0.12) => { bell(t, g); ping(t + 0.12, 1568, 0.9, g * 0.5, 0.2); };
const soft = (t, d = 0.9, g = 0.07) => whoosh(t, d, g, 300, 1800);
const clack = (t, g = 0.1) => { click(t, g * 1.4); ping(t, 520, 0.12, g * 0.6, 0.5); };
const sprinkle = (t, d = 0.9, g = 0.06) => { const n = Math.floor(d * SR); const x = noise(n); const hpf = hp(x, 3000); const e = env(n, 0.02, d / 3); add(t, hpf.map((v, i) => v * e[i]), g); };
// 1 salt, seashells, tea
soft(0.05, 0.7, 0.05); sprinkle(at(1, 9) - 0.2); clack(at(1, 10) - 0.15, 0.14); ping(at(1, 13) - 0.1, 1568, 0.5, 0.07, 0.3); pop(at(1, 13) - 0.2, 620, 0.08); stampHit(at(1, 14) - 0.1);
// 2 sounds ridiculous
soft(7.65, 0.6, 0.06); pop(at(2, 1), 600, 0.08); pop(at(2, 2), 720, 0.08);
// 3 before cards and bills
soft(10.7, 0.7, 0.06); pop(at(3, 3) - 0.1, 640, 0.09); pop(at(3, 6) - 0.1, 600, 0.09); nope(at(3, 7) + 0.1); nope(at(3, 8) + 0.1); stampHit(at(3, 10) - 0.25); riser(at(3, 10) - 0.2, 0.6, 400, 900, 0.04);
// 4 cowries
soft(17.2, 0.7, 0.06); pop(at(4, 4) - 0.1, 600, 0.08); pop(at(4, 6) - 0.1, 700, 0.08); stampHit(at(4, 9) - 0.2); for (let i = 0; i < 8; i++) clack(at(4, 10) + i * 0.1, 0.1); whoosh(22.6, 1.2, 0.05, 800, 3000); pop(at(4, 13), 560, 0.08); pop(at(4, 15), 700, 0.08);
// 5 tea bricks
soft(24.1, 0.7, 0.06); stampHit(at(5, 4) - 0.1); sprinkle(at(5, 4), 1.0, 0.05); riser(at(5, 6), 1.2, 600, 150, 0.05); thud(at(5, 8) - 0.1, 70, 0.4, 0.35, 0.4); clack(at(5, 8) - 0.1, 0.16); pop(at(5, 12), 620, 0.09); bell(at(5, 16), 0.1);
// 6 / 7 salt
stampHit(31.15); sprinkle(31.3, 1.0, 0.06); ping(31.3, 880, 0.7, 0.07, 0.3); stampHit(at(7, 3) - 0.2); ping(at(7, 3) - 0.18, 523, 1.3, 0.08, 0.2); bell(at(7, 3), 0.12); sparkle(at(7, 3) + 0.1, 8, 0.035); soft(at(7, 7), 0.6, 0.05); pop(at(7, 9), 640, 0.08); ping(at(7, 10), 1175, 0.5, 0.07, 0.3);
// 8 interesting
soft(38.2, 0.6, 0.06); stampHit(at(8, 3) - 0.1); ping(at(8, 3) + 0.1, 1568, 0.7, 0.08, 0.3);
// 9 no numbers
soft(40.6, 0.6, 0.06); for (let i = 1; i <= 3; i++) pop(at(9, i), 560 + i * 60, 0.07); [0, 1, 2].forEach((i) => { pop(at(9, 6) + i * 0.1, 640, 0.06); nope(at(9, 8) + i * 0.1 + 0.05); });
// 10 useful, desirable, accepted
soft(43.55, 0.6, 0.06); [5, 6, 8].forEach((k, i) => { soft(at(10, k) - 0.25, 0.4, 0.05); pop(at(10, k) - 0.1, 640 + i * 80, 0.09); ping(at(10, k), 1175 + i * 160, 0.4, 0.07, 0.3); }); stampHit(at(10, 8) - 0.1);
// 11 fascinating
soft(48.95, 0.6, 0.06); stampHit(at(11, 4) - 0.2); chime(at(11, 4), 0.12); sparkle(at(11, 4) + 0.2, 12, 0.04);
// 12 paper, metal, digital
soft(51.9, 0.6, 0.06); stampHit(at(12, 5) - 0.2); [7, 8, 11].forEach((k, i) => { pop(at(12, k) - 0.1, 600 + i * 100, 0.09); ping(at(12, k) - 0.05, 1046 + i * 150, 0.35, 0.06, 0.3); });
// 13 trust
soft(58.15, 0.6, 0.06); stampHit(at(13, 5) - 0.2); soft(at(13, 3), 0.7, 0.06); chime(at(13, 5) + 0.1, 0.1); pop(at(13, 9), 620, 0.08); chime(at(13, 11), 0.1);
// 14 / 15 seashell, bill, bitcoin
soft(62.45, 0.6, 0.06); [4, 6, 9].forEach((k, i) => { pop(at(14, k) - 0.15, 600 + i * 100, 0.1); ping(at(14, k) - 0.1, 1175 + i * 180, 0.45, 0.07, 0.3); }); stampHit(at(15, 5) - 0.2); pop(at(15, 6) - 0.1, 560, 0.09); pop(at(15, 6) + 0.05, 660, 0.09); chime(at(15, 6) + 0.3, 0.1);
// 16 final
stampHit(71.6); ping(71.62, 523, 1.6, 0.1, 0.2); stampHit(72.2); ping(72.22, 659, 1.6, 0.1, 0.2); ping(72.3, 784, 1.5, 0.08, 0.2);
{ const n = Math.floor(0.3 * SR); const e = env(n, 0.001, 0.08); add(72.5, lp(noise(n), 5000).map((v, i) => v * e[i]), 0.45); } sparkle(72.55, 14, 0.05);

// normalise gently, write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, L[i] * g)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
writeFileSync(process.argv[2], buf);
console.log('wrote', process.argv[2], (buf.length / 1e6).toFixed(1) + ' MB');
