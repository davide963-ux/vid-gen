// Deterministic SFX bed for the money-debt-2d light: synthesized in JS (seeded noise), no downloads.
// Usage: node scripts/frog_sfx.mjs <out.wav>
import { writeFileSync, readFileSync } from 'node:fs';

const SR = 44100, DUR = 74;
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

// 01 the loan
pop(0.5, 520, 0.15); [0, 1, 2].forEach((i) => pop(at(1, 2) + 0.1 + i * 0.22, 600 + i * 140, 0.14)); ping(at(1, 6), 1318, 0.8, 0.12);
swoosh(at(2, 3) - 0.5, 0.4, 0.1); stampHit(at(2, 3) + 0.15); sparkle(at(2, 3) + 0.2, 7); ping(at(2, 7), 440, 0.4, 0.1); ping(at(2, 7) + 0.12, 560, 0.4, 0.1);
swoosh(at(3, 2), 0.7, 0.1); pop(at(3, 2) + 0.55, 880, 0.18); ping(at(3, 3), 988, 0.6, 0.1);
// someone else's money does not move
swoosh(at(4, 4) + 0.1, 1.3, 0.09); swoosh(at(4, 13), 0.8, 0.08); stampHit(at(4, 15) + 0.05); ping(at(4, 15) + 0.05, 330, 0.9, 0.12); ping(at(4, 15) + 0.1, 247, 0.9, 0.1);
// 02 the new deposit
sparkle(at(5, 3), 14, 0.07); swoosh(at(5, 3), 0.6, 0.1); pop(at(5, 3) + 0.4, 1040, 0.16);
for (let i = 0; i < 8; i++) click(at(6, 3) + i * 0.06, 0.1);
stampHit(at(7, 0)); ping(at(7, 0), 1568, 1.2, 0.14); ping(at(7, 0) + 0.06, 2093, 1.2, 0.1); sparkle(at(7, 0) + 0.05, 16, 0.07);
for (let i = 0; i < 10; i++) click(at(7, 0) + 0.05 + i * 0.08, 0.12);
// spent in the real economy: coin pings
for (let i = 0; i < 9; i++) ping(at(8, 5) + 0.6 + i * 0.37, 1200 + (i % 3) * 260, 0.25, 0.09, 0.3);
// banks create new money
for (let i = 0; i < 18; i++) pop(at(9, 9) + i * 0.28, 800 + (i % 4) * 160, 0.1); swoosh(at(9, 9) - 0.1, 1.2, 0.12);
// zeros, then stop
pop(35.3, 500, 0.12);
for (let i = 0; i < 26; i++) click(at(11, 4) + i * 0.085, 0.09);
swoosh(40.2, 0.4, 0.1); ping(40.45, 1760, 0.9, 0.14, 0.4); ping(40.5, 2349, 0.9, 0.1, 0.4); sparkle(40.55, 8, 0.06); stampHit(40.55);
// the limits: one chime per card, rising
[4, 6, 8, 9, 15].forEach((k, i) => { const t = at(12, k) - 0.1; swoosh(t, 0.35, 0.07); ping(t + 0.1, 784 * Math.pow(1.122, i * 2), 0.8, 0.13, 0.3); thud(t + 0.1, 90, 0.2, 0.2, 0.3); });
// the weirdest part
ping(51.7, 262, 1.8, 0.1, 0.2); ping(51.75, 392, 1.8, 0.07, 0.2); pop(52.6, 600, 0.12);
// repayment: coins in, balance ticks down, PAID, bills fade
for (let i = 0; i < 10; i++) ping(at(14, 3) + 0.9 + i * 0.3, 1500 - i * 55, 0.2, 0.09, 0.3);
for (let i = 0; i < 18; i++) click(at(14, 5) + i * 0.155, 0.06);
stampHit(at(15, 7) - 0.4 + 0.15); sparkle(at(15, 7), 6, 0.05); swoosh(at(15, 8), 1.0, 0.1);
// the crowd, then the IOUs
for (let i = 0; i < 11; i++) pop(63.0 + i * 0.12, 500 + i * 40, 0.07);
for (let i = 0; i < 11; i++) { click(ln_flip() + 0.2 + i * 0.07, 0.12); }
function ln_flip() { return 67.55; }
stampHit(67.4); ping(67.45, 523, 1.8, 0.12, 0.2); ping(67.55, 784, 1.6, 0.09, 0.2);
stampHit(70.05); ping(70.1, 659, 2.2, 0.11, 0.2); ping(70.2, 988, 2.0, 0.08, 0.2);

// normalise gently, write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, L[i] * g)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
writeFileSync(process.argv[2], buf);
console.log('wrote', process.argv[2], (buf.length / 1e6).toFixed(1) + ' MB');
