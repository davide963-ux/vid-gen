// Deterministic SFX bed for the digital-money: synthesized in JS (seeded noise), no downloads.
// Usage: node scripts/frog_sfx.mjs <out.wav>
import { writeFileSync, readFileSync } from 'node:fs';

const SR = 44100, DUR = 71;
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
// 1 hook
pop(0.3, 520, 0.16); pop(0.8, 640, 0.16); pop(1.45, 760, 0.17); swoosh(0.25, 0.5, 0.07); swoosh(1.2, 0.7, 0.08); ping(at(1, 8), 1568, 0.7, 0.14, 0.3);
// 2 thin air
stampHit(4.1); swoosh(4.02, 0.4, 0.07); pop(4.5, 700, 0.15); swoosh(6.0, 0.4, 0.07); whoosh(6.0, 1.0, 0.07, 1200, 3500); bell(6.3, 0.16); sparkle(6.25, 12, 0.06); stampHit(at(2, 10) - 0.3);
// 3 no machine, no gold, just numbers
swoosh(8.28, 0.4, 0.07); pop(at(3, 1) - 0.1, 600, 0.15); nope(at(3, 2) + 0.02); pop(at(3, 4) - 0.1, 680, 0.15); nope(at(3, 4) + 0.4); stampHit(at(3, 5) - 0.1); pop(at(3, 5), 760, 0.16); ticks(at(3, 6), 600, 1900, 14, 0.06, 0.07); bell(at(3, 6) + 0.95, 0.15);
// 4 magic trick
swoosh(11.89, 0.4, 0.07); stampHit(at(4, 3) - 0.2); sparkle(at(4, 3), 12, 0.07); riser(at(4, 3), 0.7, 500, 1500, 0.07); sparkle(12.7, 10, 0.05);
// 5 modern financial system
swoosh(14.44, 0.4, 0.07); stampHit(at(5, 7) - 0.2); pop(at(5, 3), 600, 0.14); for (let i = 0; i < 12; i++) click(at(5, 3) + i * 0.28, 0.14); pop(at(5, 9), 520, 0.13);
// 6 central banks create money electronically
swoosh(18.63, 0.4, 0.07); stampHit(at(6, 3) - 0.2); swoosh(at(6, 4), 0.5, 0.08); ticks(at(6, 6), 600, 1900, 16, 0.08, 0.07); bell(at(6, 6) + 1.3, 0.15);
// 7 put more money into the system
swoosh(23.52, 0.4, 0.07); swoosh(at(7, 6) - 0.2, 0.5, 0.08); whoosh(25.6, 1.2, 0.06, 1200, 3500); stampHit(at(7, 10) - 0.2); pop(at(7, 10), 640, 0.14);
// 8 buy government bonds
swoosh(28.8, 0.4, 0.07); stampHit(at(8, 3) - 0.1); pop(at(8, 4) - 0.1, 700, 0.17); whoosh(at(8, 6), 0.9, 0.08, 500, 2400); thud(at(8, 6) + 0.85, 90, 0.25, 0.3, 0.4); ping(at(8, 6) + 0.88, 1175, 0.5, 0.1, 0.3);
// 9 how does it pay
stampHit(33.06); riser(33.4, 1.0, 300, 900, 0.08); ping(at(9, 4), 880, 0.7, 0.1, 0.3);
// 10 by creating new electronic money
swoosh(34.98, 0.4, 0.07); stampHit(at(10, 3) - 0.3); for (let i = 0; i < 6; i++) { pop(at(10, 1) + i * 0.16 + 0.4, 500 + i * 70, 0.1); } ticks(at(10, 2), 600, 1900, 14, 0.07, 0.07); bell(at(10, 2) + 1.2, 0.16); sparkle(35.8, 8, 0.05);
// 11 no trucks, no presses
swoosh(37.74, 0.4, 0.07); stampHit(at(11, 4) - 0.1); pop(at(11, 1) - 0.1, 600, 0.15); nope(at(11, 4) + 0.02); pop(at(11, 6) - 0.1, 680, 0.15); nope(at(11, 8) - 0.03);
// 12 added to the banking system
swoosh(41.76, 0.4, 0.07); pop(at(12, 2) - 0.2, 600, 0.14); riser(at(12, 3), 1.1, 400, 1400, 0.09); stampHit(at(12, 5) - 0.3); bell(at(12, 3) + 1.1, 0.16);
// 13 the catch
swoosh(44.93, 0.4, 0.07); stampHit(at(13, 2)); thud(at(13, 2), 60, 0.5, 0.5, 0.4); nope(at(13, 3));
// 14 more money isn't richer
swoosh(46.79, 0.4, 0.07); stampHit(at(14, 5) - 0.1); for (let i = 0; i < 5; i++) pop(at(14, 1) + i * 0.22, 600 + i * 70, 0.13); nope(at(14, 7) - 0.03);
// 15 spending vs production
swoosh(51.24, 0.4, 0.07); swoosh(at(15, 1) - 0.1, 0.4, 0.07); riser(at(15, 2), 1.5, 300, 1200, 0.09); swoosh(at(15, 6) - 0.1, 0.4, 0.06); whoosh(at(15, 6), 3.0, 0.03, 400, 1200); stampHit(at(15, 12) - 0.2); pop(at(15, 12), 700, 0.16); riser(at(15, 12), 0.7, 400, 1100, 0.08); pop(at(15, 13), 520, 0.13);
// 16 buying less
swoosh(57.84, 0.4, 0.07); stampHit(at(16, 6) - 0.2); for (let i = 0; i < 4; i++) pop(at(16, 2) + i * 0.12, 600 + i * 90, 0.12); nope(at(16, 7) + 0.1); nope(at(16, 7) + 0.3);
// 17 / 18 one thing vs different
swoosh(60.6, 0.4, 0.07); stampHit(at(17, 4) - 0.1); pop(at(17, 2), 640, 0.15); swoosh(63.22, 0.4, 0.07); stampHit(at(18, 4) - 0.1); pop(at(18, 1), 700, 0.15); stampHit(at(18, 5)); ping(at(18, 5) + 0.02, 440, 1.2, 0.12, 0.3);
// 19 final
stampHit(67.12); ping(67.14, 523, 1.8, 0.12, 0.2); stampHit(67.8); ping(67.81, 659, 1.6, 0.12, 0.2); ping(67.9, 784, 1.5, 0.1, 0.2); ping(68.0, 1047, 1.5, 0.09, 0.2);
{ const n = Math.floor(0.3 * SR); const e = env(n, 0.001, 0.08); add(68.0, lp(noise(n), 5000).map((v, i) => v * e[i]), 0.5); } sparkle(68.05, 16, 0.07);

// normalise gently, write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, L[i] * g)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
writeFileSync(process.argv[2], buf);
console.log('wrote', process.argv[2], (buf.length / 1e6).toFixed(1) + ' MB');
