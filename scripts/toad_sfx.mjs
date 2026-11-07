// Deterministic SFX bed for the Toad laptop-day clip: synthesized in JS (seeded noise), no downloads.
// Usage: node scripts/frog_sfx.mjs <out.wav>
import { writeFileSync } from 'node:fs';

const SR = 44100, DUR = 15;
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

// room tone (very quiet)
{ const w = lp(noise(N), 380); for (let i = 0; i < N; i++) L[i] += w[i] * 0.07; }

// shot 1: laptop opens, screen wakes, invite pings
whoosh(0.45, 0.45, 0.14, 300, 900); thud(0.55, 95, 0.12, 0.35, 0.6); click(1.28, 0.35);
ping(1.15, 880, 0.18, 0.12); ping(1.85, 1175, 0.55, 0.22); ping(2.0, 1568, 0.7, 0.2);

// shot 2: the calendar fills up, one pop per block, tension swell, a long look
for (let i = 0; i < 10; i++) { ping(3.05 + i * 0.28, 520 + i * 38, 0.09, 0.2, 0.15); click(3.05 + i * 0.28, 0.25); }
whoosh(4.2, 3.2, 0.10, 120, 380);
{ const n = Math.floor(3.2 * SR); let ph = 0; const out = new Float32Array(n); for (let i = 0; i < n; i++) { const p = i / n; ph += 2 * Math.PI * (92 - 18 * p) / SR; out[i] = Math.sin(ph) * Math.sin(Math.PI * p) * 0.5; } add(4.2, out, 0.22); }

// shot 3: laptop closes, mug is set down, steam hush
whoosh(7.6, 0.45, 0.14, 300, 900); thud(8.02, 70, 0.3, 0.7, 0.5);
whoosh(9.0, 0.7, 0.12, 250, 800);
ping(9.85, 2400, 0.5, 0.16, 0.5); ping(9.87, 3600, 0.35, 0.08, 0.2);
whoosh(9.9, 2.3, 0.05, 2200, 4600);

// shot 4: warm chime on the smile, little pop on the heart
ping(12.45, 523, 1.4, 0.2, 0.2); ping(12.55, 659, 1.3, 0.16, 0.2); ping(12.65, 784, 1.2, 0.12, 0.2);
ping(13.7, 740, 0.15, 0.16, 0.1);

// normalise gently, write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, L[i] * g)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
writeFileSync(process.argv[2], buf);
console.log('wrote', process.argv[2], (buf.length / 1e6).toFixed(1) + ' MB');
