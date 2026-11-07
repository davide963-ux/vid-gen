// Deterministic SFX bed for the digital-money: synthesized in JS (seeded noise), no downloads.
// Usage: node scripts/frog_sfx.mjs <out.wav>
import { writeFileSync, readFileSync } from 'node:fs';

const SR = 44100, DUR = 47;
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
swoosh(0.3, 0.5, 0.07); pop(0.3, 520, 0.14); riser(0.6, 2.4, 300, 900, 0.05); stampHit(at(1, 3) - 0.3); ping(at(1, 3) - 0.28, 440, 1.2, 0.1, 0.3); stampHit(at(1, 5) - 0.1); thud(at(1, 5) - 0.1, 55, 0.5, 0.45, 0.4);
// 2 brand
whoosh(3.45, 0.6, 0.09, 600, 3000); bell(3.7, 0.16); sparkle(3.75, 10, 0.05); pop(at(2, 1), 700, 0.15); swoosh(at(2, 1) + 0.3, 0.4, 0.06);
// 3 seven pairs, 24/5
swoosh(5.18, 0.4, 0.07); pop(5.4, 600, 0.14); stampHit(at(3, 2) - 0.1); whoosh(at(3, 2), 2.4, 0.05, 400, 2400); for (let i = 0; i < 7; i++) click(at(3, 2) + 0.15 + i * 0.34, 0.12); stampHit(at(3, 8) - 0.05); bell(at(3, 8), 0.16);
// 4 two things
swoosh(10.11, 0.4, 0.07); stampHit(at(4, 3)); swoosh(at(4, 5) - 0.3, 0.5, 0.08); riser(at(4, 6), 1.6, 400, 1100, 0.06); ping(at(4, 8), 1397, 0.6, 0.12, 0.3); pop(at(4, 8), 700, 0.14);
swoosh(at(4, 10) - 0.2, 0.5, 0.08); riser(at(4, 12), 1.4, 300, 900, 0.06); for (let i = 0; i < 5; i++) { ping(at(4, 14) + i * 0.2, 1046 + i * 130, 0.4, 0.1, 0.3); click(at(4, 14) + i * 0.2, 0.1); } bell(at(4, 14) + 1.0, 0.14);
// 5 signal
swoosh(17.6, 0.4, 0.07); stampHit(at(5, 3) - 0.3); swoosh(17.8, 0.6, 0.07); ping(at(5, 7), 1568, 0.5, 0.12, 0.3); click(at(5, 7), 0.4); stampHit(at(5, 8)); bell(at(5, 8) + 0.05, 0.15);
pop(at(5, 9), 880, 0.18); stampHit(at(5, 9) - 0.02); pop(at(5, 11), 440, 0.18); stampHit(at(5, 11) - 0.02);
// 6 ichimoku score
swoosh(21.79, 0.4, 0.07); swoosh(21.95, 0.6, 0.07); stampHit(at(6, 4) - 0.1); ping(at(6, 4) + 0.2, 1175, 0.6, 0.1, 0.3); stampHit(at(6, 9) - 0.05); thud(at(6, 9), 70, 0.3, 0.3, 0.4); for (let i = 0; i < 4; i++) { ping(at(6, 10) + i * 0.15, 1046 + i * 150, 0.35, 0.1, 0.3); click(at(6, 10) + i * 0.15, 0.1); } pop(at(6, 12), 700, 0.14);
// 7 calculator
swoosh(27.57, 0.4, 0.07); swoosh(27.75, 0.6, 0.07); stampHit(at(7, 8) - 0.1); for (let i = 0; i < 6; i++) click(at(7, 8) + 0.1 + i * 0.28, 0.12); ping(at(7, 9) + 0.2, 1568, 0.6, 0.1, 0.3);
// 8 backtest
swoosh(31.81, 0.4, 0.07); swoosh(32.0, 0.6, 0.07); stampHit(at(8, 3) - 0.1); pop(at(8, 5), 700, 0.16); ping(at(8, 5), 1245, 0.5, 0.1, 0.3); pop(at(8, 7), 600, 0.13);
// 9 stop staring
swoosh(35.72, 0.4, 0.07); stampHit(35.72); stampHit(at(9, 2) - 0.05); stampHit(at(9, 4) - 0.05); ping(at(9, 3), 520, 0.8, 0.1, 0.3); { const n = Math.floor(0.4 * SR); let ph = 0; const out = new Float32Array(n); for (let i = 0; i < n; i++) { const p = i / n; ph += 2 * Math.PI * (900 - 600 * p) / SR; out[i] = Math.sin(ph) * Math.sin(Math.PI * p) * 0.9; } add(at(9, 3), out, 0.1); }
// 10 end card
swoosh(38.3, 0.5, 0.08); stampHit(38.3); ping(38.32, 523, 1.5, 0.12, 0.2); stampHit(at(10, 4) - 0.1); ping(at(10, 4) - 0.08, 659, 1.5, 0.12, 0.2); ping(at(10, 4) + 0.02, 784, 1.4, 0.1, 0.2); ping(at(10, 4) + 0.12, 1047, 1.4, 0.09, 0.2); sparkle(at(10, 4), 10, 0.05); pop(at(10, 4) + 0.4, 600, 0.12);
// 11 disclaimer
swoosh(41.51, 0.4, 0.06); thud(41.51, 80, 0.4, 0.3, 0.4); thud(at(11, 3) - 0.1, 70, 0.4, 0.3, 0.4);

// normalise gently, write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, L[i] * g)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
writeFileSync(process.argv[2], buf);
console.log('wrote', process.argv[2], (buf.length / 1e6).toFixed(1) + ' MB');
