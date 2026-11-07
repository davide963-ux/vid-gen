#!/usr/bin/env node
// Synthesized upbeat tech/corporate bed (kick, hat, bass, arp, pad), no downloads. Usage: node scripts/upbeat_music.mjs <out.wav> [sec=22] [bpm=124]
import { writeFileSync } from 'node:fs';
const [out, secA = '22', bpmA = '124'] = process.argv.slice(2); const SR = 44100, DUR = +secA, bpm = +bpmA, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N); const beat = 60 / bpm;
let seed = 7; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const add = (t, len, fn, g, pan = 0) => { const s = Math.floor(t * SR), n = Math.floor(len * SR); for (let i = 0; i < n && s + i < N; i++) { const v = fn(i / SR, i / n) * g; L[s + i] += v * (1 - pan) ; R[s + i] += v * (1 + pan); } };
const prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];       // Am F C G
const bars = Math.ceil(DUR / (beat * 4));
for (let b = 0; b < bars; b++) {
  const t0 = b * beat * 4, ch = prog[b % 4], intro = b < 1 ? 0.45 : 1, lift = b >= 3 ? 1 : 0.85;
  ch.forEach((m, k) => add(t0, beat * 4, (t, p) => (Math.sin(2 * Math.PI * hz(m) * t) + 0.5 * Math.sin(2 * Math.PI * hz(m) * 1.003 * t)) * Math.min(1, t / 0.3) * Math.min(1, (1 - p) * 6), 0.05 * intro, k - 1 === 0 ? 0 : (k - 1) * 0.5));
  for (let i = 0; i < 4; i++) {
    const t = t0 + i * beat;
    if (b >= 1 || i % 2 === 0) add(t, 0.25, (tt, p) => Math.sin(2 * Math.PI * (50 + 90 * Math.exp(-tt * 28)) * tt) * Math.exp(-tt * 9), 0.55 * lift);
    add(t + beat / 2, 0.08, (tt) => rnd() * Math.exp(-tt * 55), 0.07 * (b >= 1 ? 1 : 0.5));
    if (i % 2 === 1 && b >= 1) add(t, 0.18, (tt) => rnd() * Math.exp(-tt * 20), 0.12);
  }
  for (let i = 0; i < 8; i++) { const t = t0 + i * beat / 2; const root = ch[0] - 12; add(t, beat / 2 * 0.9, (tt, p) => Math.sin(2 * Math.PI * hz(root) * tt) * Math.exp(-tt * 5) * Math.min(1, tt * 200), 0.22 * (b >= 1 ? 1 : 0.0) * lift); }
  if (b >= 1) for (let i = 0; i < 16; i++) { const t = t0 + i * beat / 4; const m = ch[[0, 1, 2, 1, 0, 2, 1, 2][i % 8]] + 12 + (i % 16 >= 8 ? 12 : 0); add(t, beat / 4 * 1.5, (tt) => (Math.sin(2 * Math.PI * hz(m) * tt) + 0.3 * Math.sin(4 * Math.PI * hz(m) * tt)) * Math.exp(-tt * 14), 0.07, Math.sin(i) * 0.5); }
}
const fade = (i) => Math.min(1, i / (SR * 0.5), (N - i) / (SR * 1.5));
let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
const buf = Buffer.alloc(44 + N * 4); buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const g = 0.85 / pk * fade(i); buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
writeFileSync(out, buf); console.log('wrote', out);
