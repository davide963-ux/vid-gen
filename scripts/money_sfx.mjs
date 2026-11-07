// Deterministic SFX bed for the money-from-debt cinematic: synthesized in JS (seeded noise), no downloads.
// Usage: node scripts/frog_sfx.mjs <out.wav>
import { writeFileSync } from 'node:fs';

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

// ---- bed: dark drone (low fifth, slow tremolo) the whole way, swelling at the end
{ const n = N; let p1 = 0, p2 = 0; for (let i = 0; i < n; i++) { const t = i / SR; const lfo = 0.65 + 0.35 * Math.sin(2 * Math.PI * 0.11 * t); p1 += 2 * Math.PI * 55 / SR; p2 += 2 * Math.PI * 82.4 / SR; const swell = 0.7 + 0.5 * Math.min(1, Math.max(0, (t - 60) / 8)); L[i] += (Math.sin(p1) * 0.5 + Math.sin(p2) * 0.28) * lfo * 0.16 * swell; } }
{ const w = lp(noise(N), 420); for (let i = 0; i < N; i++) L[i] += w[i] * 0.05; }

// ---- 01 the loan
sweep(0.4, 2.6, 80, 420, 0.10); boom(2.9, 0.5, 1.6);
ping(5.3, 1480, 0.9, 0.09); ping(5.5, 1975, 1.0, 0.07); ping(5.75, 2637, 1.1, 0.05);   // contract materialises
sweep(7.3, 1.6, 150, 900, 0.10);                                                            // person + link
ping(8.8, 1320, 0.7, 0.08);
// someone else's account: lift, travel, refusal
whoosh(12.1, 2.0, 0.10, 200, 900); thud(15.5, 62, 0.8, 0.45, 0.4); ping(15.55, 440, 1.0, 0.07); ping(15.6, 330, 1.0, 0.06);

// ---- 02 the new deposit
sweep(17.4, 1.9, 90, 700, 0.14); for (let i = 0; i < 14; i++) ping(18.2 + i * 0.28, 1800 + (i % 5) * 220, 0.12, 0.05, 0.2);
boom(23.4, 0.95, 2.4); ping(23.42, 1568, 1.6, 0.12); ping(23.5, 2093, 1.6, 0.09); ping(23.6, 3136, 1.4, 0.06);
for (let i = 0; i < 12; i++) click(23.45 + i * 0.075, 0.18);
// economy lights up, node by node
for (let i = 0; i < 12; i++) ping(25.7 + i * 0.22, 700 + i * 70, 0.35, 0.06, 0.25);
whoosh(26.0, 3.5, 0.10, 300, 2400);
sweep(32.2, 1.5, 200, 1200, 0.07); ping(32.5, 1760, 0.9, 0.06);

// ---- 03 the limits
whoosh(35.2, 1.2, 0.10, 150, 700); thud(36.2, 52, 0.9, 0.5, 0.5);
for (let i = 0; i < 5; i++) { ping(38.15 + i * 0.4, 900 + i * 90, 0.2, 0.05, 0.2); click(38.15 + i * 0.4, 0.2); }
boom(40.35, 1.0, 2.0); ping(40.36, 2349, 1.6, 0.13, 0.6); ping(40.4, 1175, 1.8, 0.1, 0.6);   // the wall
[43.0, 44.95, 46.15, 47.4, 49.2].forEach((t, k) => { ping(t, 880 * Math.pow(1.122, k * 2), 1.0, 0.09, 0.4); thud(t, 70, 0.3, 0.25, 0.3); });
whoosh(51.7, 1.6, 0.08, 200, 900);

// ---- 04 repayment (everything runs backwards)
sweep(54.4, 2.0, 700, 90, 0.14); for (let i = 0; i < 18; i++) click(56.2 + i * 0.165, 0.12 + 0.002 * i);
whoosh(55.5, 6.5, 0.08, 1800, 300); ping(61.8, 220, 1.6, 0.07); boom(62.0, 0.35, 1.4);

// ---- 05 the system
sweep(62.9, 4.4, 70, 600, 0.16);
for (let i = 0; i < 40; i++) ping(63.0 + (i / 40) * 4.0, 1200 + (i % 8) * 180, 0.18, 0.025, 0.2);
boom(67.4, 1.2, 2.8); ping(67.45, 523, 2.6, 0.12, 0.2); ping(67.55, 784, 2.4, 0.09, 0.2);
boom(70.05, 0.9, 3.2); ping(70.1, 659, 3.0, 0.1, 0.2); ping(70.2, 988, 2.6, 0.07, 0.2);

// normalise gently, write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, L[i] * g)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
writeFileSync(process.argv[2], buf);
console.log('wrote', process.argv[2], (buf.length / 1e6).toFixed(1) + ' MB');
