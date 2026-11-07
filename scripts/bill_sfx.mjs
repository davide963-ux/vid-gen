// Deterministic SFX bed for the digital-money: synthesized in JS (seeded noise), no downloads.
// Usage: node scripts/frog_sfx.mjs <out.wav>
import { writeFileSync, readFileSync } from 'node:fs';

const SR = 44100, DUR = 68;
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
pop(0.3, 520, 0.16); pop(0.92, 700, 0.18); swoosh(0.25, 0.5, 0.07); ping(at(1, 6), 1568, 0.7, 0.14, 0.3); swoosh(1.0, 0.7, 0.08);
// 2 face value
swoosh(3.2, 0.6, 0.09); pop(3.7, 640, 0.16); pop(at(2, 3), 560, 0.14); ticks(at(2, 4), 600, 1600, 8, 0.07, 0.07); bell(at(2, 4) + 0.7, 0.16); sparkle(5.5, 8, 0.06);
// 3 costs far less
swoosh(7.16, 0.4, 0.07); pop(7.7, 600, 0.14); swoosh(7.5, 0.8, 0.07); pop(at(3, 4), 480, 0.12); pop(at(3, 5), 420, 0.12); thud(at(3, 8), 90, 0.25, 0.3, 0.4);
// 4 think
stampHit(11.16); pop(at(4, 1), 700, 0.16); ping(at(4, 2), 1760, 0.8, 0.12, 0.3);
// 5 not $100 of material
swoosh(12.83, 0.4, 0.07); pop(at(5, 2), 640, 0.16); pop(at(5, 4), 720, 0.18); nope(at(5, 7) + 0.1); thud(at(5, 10), 70, 0.3, 0.4, 0.4);
// 6 ink, security, printing
swoosh(19.3, 0.4, 0.07); pop(at(6, 5), 600, 0.15);
[9, 10, 13].forEach((k, i) => { const t = at(6, k) - 0.2; swoosh(t, 0.35, 0.07); pop(t + 0.3, 700 + i * 150, 0.16); });
whoosh(at(6, 9) - 0.2, 0.9, 0.06, 1500, 4000); ping(at(6, 10), 1397, 0.6, 0.09, 0.3); whoosh(at(6, 14) - 0.2, 1.0, 0.06, 1500, 4000);
// 7 not the material
swoosh(26.35, 0.4, 0.07); stampHit(at(7, 6) - 0.1); pop(at(7, 8) - 0.1, 620, 0.17); pop(at(7, 8) + 0.1, 760, 0.17); nope(at(7, 9) + 0.05); nope(at(7, 9) + 0.2);
// 8 everyone agrees
swoosh(31.5, 0.4, 0.07); pop(at(8, 3), 640, 0.14); [4, 5, 6, 8].forEach((k, i) => { pop(at(8, k) - 0.1, 600 + i * 120, 0.17); });
[0, 1, 2, 3].forEach((i) => ping(at(8, 9) + i * 0.12, 1568 + i * 220, 0.35, 0.09, 0.3)); stampHit(at(8, 14)); bell(at(8, 14) + 0.1, 0.16); sparkle(36.7, 10, 0.06);
// 9 the $1 bill
swoosh(38.53, 0.4, 0.07); swoosh(38.6, 0.7, 0.08); pop(39.4, 640, 0.15); swoosh(at(9, 6) - 0.1, 0.5, 0.08); pop(at(9, 6) + 0.3, 520, 0.14);
// 10 little value
swoosh(41.77, 0.7, 0.07); pop(at(10, 2), 480, 0.14); pop(at(10, 4), 400, 0.14); thud(at(10, 5), 70, 0.3, 0.35, 0.4);
// 11 number changes what you can buy
swoosh(44.79, 0.4, 0.07); [3, 6, 8].forEach((k, i) => { const t = at(11, k); stampHit(t); ping(t + 0.02, 523 * Math.pow(1.26, i * 2), 0.7, 0.12, 0.2); pop(t + 0.1, 800 + i * 150, 0.16); });
ping(at(11, 10), 1760, 0.6, 0.1, 0.3);
// 12 holding a $100 bill
swoosh(48.65, 0.4, 0.07); stampHit(at(12, 5)); ping(at(12, 5) + 0.03, 659, 1.2, 0.12, 0.2);
// 13 not paper
swoosh(51.64, 0.4, 0.07); pop(at(13, 4) - 0.1, 600, 0.15); nope(at(13, 7) - 0.05);
// 14 society agreed
swoosh(55.57, 0.4, 0.07); [0, 1, 2, 3].forEach((i) => pop(at(14, 4) - 0.1 + i * 0.16, 620 + i * 100, 0.15));
[0, 1, 2, 3].forEach((i) => ping(at(14, 6) + i * 0.1, 1568 + i * 220, 0.35, 0.09, 0.3)); stampHit(at(14, 6) + 0.2); bell(at(14, 6) + 0.3, 0.16);
stampHit(at(14, 8) - 0.2); ping(at(14, 8) - 0.18, 659, 1.6, 0.12, 0.2); ping(at(14, 8) - 0.1, 784, 1.5, 0.1, 0.2); sparkle(59.0, 12, 0.06);
// 15 strangest
swoosh(61.03, 0.4, 0.07); stampHit(at(15, 5) - 0.3); ping(at(15, 5) - 0.28, 440, 1.4, 0.12, 0.3); ping(at(15, 5) - 0.2, 554, 1.3, 0.1, 0.3); pop(at(15, 6), 600, 0.14); sparkle(61.6, 8, 0.05);
// 16 final
stampHit(64.27); ping(64.29, 523, 1.8, 0.12, 0.2); stampHit(64.95); ping(64.96, 659, 1.6, 0.12, 0.2); ping(65.05, 784, 1.5, 0.1, 0.2); ping(65.15, 1047, 1.5, 0.09, 0.2);
{ const n = Math.floor(0.3 * SR); const e = env(n, 0.001, 0.08); add(65.3, lp(noise(n), 5000).map((v, i) => v * e[i]), 0.5); } sparkle(65.35, 16, 0.07);

// normalise gently, write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, L[i] * g)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
writeFileSync(process.argv[2], buf);
console.log('wrote', process.argv[2], (buf.length / 1e6).toFixed(1) + ' MB');
