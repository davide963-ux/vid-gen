// Deterministic SFX bed for the digital-money: synthesized in JS (seeded noise), no downloads.
// Usage: node scripts/frog_sfx.mjs <out.wav>
import { writeFileSync, readFileSync } from 'node:fs';

const SR = 44100, DUR = 61.5;
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

// 1 hook
pop(0.3, 520, 0.16); pop(0.92, 700, 0.18); swoosh(0.25, 0.5, 0.07); ping(at(1, 6), 1568, 0.7, 0.14, 0.3);
// 2 not cash
swoosh(at(2, 0), 0.4, 0.08); pop(3.7, 640, 0.16); stampHit(at(2, 4)); ping(at(2, 4) + 0.02, 523, 0.9, 0.12, 0.2);
{ const n = Math.floor(0.3 * SR); const e = env(n, 0.002, 0.09); add(4.45, lp(noise(n), 3500).map((v, i) => v * e[i]), 0.35); } ping(4.6, 1760, 0.6, 0.09, 0.4); nope(at(2, 6));
// 3 bills and coins
swoosh(6.33, 0.4, 0.07); pop(8.0, 760, 0.2); pop(8.68, 900, 0.2); nope(9.05); nope(9.2);
// 4 digital: digits rain, then the big word
ticks(10.3, 800, 1800, 26, 0.04, 0.07); swoosh(10.2, 1.2, 0.09); stampHit(at(4, 4)); bell(at(4, 4) + 0.02, 0.14);
// 5 account
swoosh(at(5, 3) - 0.3, 0.6, 0.1); pop(at(5, 3), 700, 0.16);
// 6 balance, then a box of cash that is not there
ticks(at(6, 4), 700, 2000, 14, 0.05, 0.1); bell(at(6, 4) + 0.7, 0.16); swoosh(at(6, 6), 0.5, 0.08);
pop(at(6, 12), 520, 0.18); thud(at(6, 12), 70, 0.3, 0.4, 0.5); pop(at(6, 14), 880, 0.18); nope(at(6, 16)); sparkle(at(6, 16), 8, 0.05);
// 7 the system just records it
swoosh(at(7, 3) - 0.2, 0.5, 0.1); ticks(at(7, 4), 900, 1300, 5, 0.16, 0.1); bell(at(7, 9), 0.2); sparkle(at(7, 9) + 0.05, 10, 0.06);
// 8 no cash moves
pop(28.44, 600, 0.12); click(29.2, 0.4); click(29.6, 0.3); ping(31.0, 1397, 0.6, 0.1, 0.3); pop(at(8, 5), 480, 0.14); thud(at(8, 5), 65, 0.25, 0.3, 0.4);
// 9 and 10: one goes down, another goes up
swoosh(33.1, 0.5, 0.08); swoosh(33.3, 0.5, 0.08);
{ const n = Math.floor(0.6 * SR); let ph = 0; const out = new Float32Array(n); for (let i = 0; i < n; i++) { const p = i / n; ph += 2 * Math.PI * (900 - 600 * p) / SR; out[i] = Math.sin(ph) * Math.sin(Math.PI * p) * 0.9; } add(at(9, 3), out, 0.16); } pop(at(9, 3) + 0.4, 330, 0.12);
whoosh(35.3, 1.0, 0.06, 1500, 4000);
{ const n = Math.floor(0.6 * SR); let ph = 0; const out = new Float32Array(n); for (let i = 0; i < n; i++) { const p = i / n; ph += 2 * Math.PI * (500 + 900 * p) / SR; out[i] = Math.sin(ph) * Math.sin(Math.PI * p) * 0.9; } add(at(10, 3), out, 0.16); } bell(at(10, 3) + 0.5, 0.18); sparkle(at(10, 3) + 0.55, 10, 0.06);
// 11 that's it
stampHit(at(11, 0)); ping(at(11, 0) + 0.03, 523, 1.2, 0.13, 0.2); ping(at(11, 0) + 0.1, 784, 1.1, 0.1, 0.2);
// 12 card, online, salary
swoosh(38.82, 0.4, 0.07); [8, 10, 14].forEach((k, i) => { const t = at(12, k) - 0.3; swoosh(t, 0.3, 0.07); pop(t + 0.25, 700 + i * 160, 0.18); ping(t + 0.3, 1568 + i * 200, 0.4, 0.07, 0.3); });
// 13 numbers stored in banking systems
swoosh(44.69, 0.4, 0.07); ticks(at(13, 7), 700, 1700, 28, 0.07, 0.07); bell(at(13, 12), 0.14);
// 14 cash is a small part
swoosh(at(14, 1) - 0.1, 0.8, 0.09); pop(at(14, 4), 520, 0.15); stampHit(at(14, 4)); ping(at(14, 1) + 0.4, 1175, 0.5, 0.08, 0.3);
// 15 mostly digital information
[3, 4, 5].forEach((k, i) => { stampHit(at(15, k) - 0.05); ping(at(15, k), 392 * Math.pow(1.26, i * 2), 1.0, 0.1, 0.2); });
// 16 final
stampHit(at(16, 0)); ping(at(16, 0) + 0.02, 523, 1.8, 0.12, 0.2); stampHit(58.35); ping(58.36, 659, 1.6, 0.12, 0.2); ping(58.45, 784, 1.5, 0.1, 0.2); ping(58.55, 1047, 1.5, 0.09, 0.2);
{ const n = Math.floor(0.3 * SR); const e = env(n, 0.001, 0.08); add(58.85, lp(noise(n), 5000).map((v, i) => v * e[i]), 0.5); } sparkle(58.88, 16, 0.07);

// normalise gently, write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, L[i] * g)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
writeFileSync(process.argv[2], buf);
console.log('wrote', process.argv[2], (buf.length / 1e6).toFixed(1) + ' MB');
