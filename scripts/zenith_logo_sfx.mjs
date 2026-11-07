// Deterministic SFX bed for the digital-money: synthesized in JS (seeded noise), no downloads.
// Usage: node scripts/frog_sfx.mjs <out.wav>
import { writeFileSync, readFileSync } from 'node:fs';

const SR = 44100, DUR = 7;
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
whoosh(0.2,0.6,0.1,300,3000); whoosh(0.45,0.5,0.08,400,2400); thud(0.8,70,0.4,0.4,0.5); click(0.8,0.4); sparkle(1.3,8,0.05); boom(1.4,0.4,1.4); whoosh(1.6,0.6,0.08,300,3000); pop(2.3,700,0.1); soft(2.7,0.8,0.05); pop(2.9,800,0.14); bell(3.0,0.1);
// normalise gently, write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]));
const g = 0.9 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, L[i] * g)); const s = Math.round(v * 32767); buf.writeInt16LE(s, 44 + i * 4); buf.writeInt16LE(s, 46 + i * 4); }
writeFileSync(process.argv[2], buf);
console.log('wrote', process.argv[2], (buf.length / 1e6).toFixed(1) + ' MB');
