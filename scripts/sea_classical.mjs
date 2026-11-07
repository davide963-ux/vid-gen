// Calm background bed: synthesized sea waves + a soft piano/strings piece (Pachelbel-style D–A–Bm–F#m–G–D–G–A progression, public domain harmony).
// Everything is generated in code (seeded noise, additive synthesis, small reverb) — no downloads, no licences.
// Usage: node scripts/sea_classical.mjs <out.wav> [seconds=54] [bpm=62]
import { writeFileSync } from 'node:fs';
const out = process.argv[2]; const DUR = parseFloat(process.argv[3] || '54'); const BPM = parseFloat(process.argv[4] || '62');
const SR = 44100, N = Math.floor(SR * DUR);
let seed = 987654321;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const mk = () => new Float32Array(N);
const L = mk(), R = mk();           // waves
const pL = mk(), pR = mk();         // piano + strings (dry)

// ---------- sea waves ----------
const lpState = (f) => { const a = Math.exp(-2 * Math.PI * f / SR); return { a, y: 0 }; };
const lp = (s, x) => (s.y = (1 - s.a) * x + s.a * s.y);
for (let ch = 0; ch < 2; ch++) {
  const O = ch ? R : L; const ph = ch ? 1.9 : 0.0;
  const s1 = lpState(700), s2 = lpState(1400), h1 = lpState(2500), h2 = lpState(7000), slow = lpState(0.4);
  for (let i = 0; i < N; i++) {
    const t = i / SR; const w = rnd() * 2 - 1;
    const per = 9.5 + 1.8 * Math.sin(t / 23 + ph);                 // slowly varying wave period
    const x = Math.sin(2 * Math.PI * t / per + ph);
    const swell = Math.pow(0.5 + 0.5 * x, 2.2);                      // rise and fall of a wave
    const crest = Math.pow(0.5 + 0.5 * Math.sin(2 * Math.PI * (t - 0.7) / per + ph), 5);  // foam arrives near the crest
    const surge = lp(s2, lp(s1, w)) * 4.2;                           // low rumble of water
    const hiss = (lp(h2, w) - lp(h1, w)) * 3.0;                      // bright foam
    O[i] = surge * (0.12 + 0.88 * swell) * 0.9 + hiss * (0.03 + 0.97 * crest) * 0.55 + lp(slow, w) * 0.0;
  }
}

// ---------- piano + strings ----------
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const addNote = (t0, midi, dur, gain, pan, kind) => {
  const f = mtof(midi); const s = Math.floor(t0 * SR); const n = Math.floor((dur + 0.4) * SR);
  const gL = Math.cos((pan + 1) * Math.PI / 4), gR = Math.sin((pan + 1) * Math.PI / 4);
  if (kind === 'piano') {
    const tau = 2.4 - Math.min(1.5, (midi - 40) * 0.028);            // higher notes die faster
    const amps = [1, 0.55, 0.34, 0.18, 0.1, 0.05];
    for (let i = 0; i < n && s + i < N; i++) {
      const t = i / SR; const env = Math.min(1, t / 0.004) * Math.exp(-t / tau) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.4) : 1);
      let v = 0; for (let h = 0; h < amps.length; h++) v += amps[h] * Math.sin(2 * Math.PI * f * (h + 1) * (1 + 0.0003 * h * h) * t) * Math.exp(-t * h * 0.9);
      v += (i < 300 ? (rnd() * 2 - 1) * 0.15 * (1 - i / 300) : 0);   // hammer
      v *= env * gain; pL[s + i] += v * gL; pR[s + i] += v * gR;
    }
  } else { // strings / pad: slow attack, gentle vibrato, two detuned voices
    for (let i = 0; i < n && s + i < N; i++) {
      const t = i / SR; const a = Math.min(1, t / 0.9); const r = t > dur ? Math.max(0, 1 - (t - dur) / 0.4) : 1; const vib = 1 + 0.002 * Math.sin(2 * Math.PI * 5.2 * t);
      let v = 0; for (const d of [0.9975, 1.0025]) { const ff = f * d * vib; v += Math.sin(2 * Math.PI * ff * t) + 0.35 * Math.sin(4 * Math.PI * ff * t) + 0.18 * Math.sin(6 * Math.PI * ff * t); }
      v *= a * r * gain * 0.5; pL[s + i] += v * gL; pR[s + i] += v * gR;
    }
  }
};
const beat = 60 / BPM; const bar = beat * 4;
const CH = [[62, 66, 69], [57, 61, 64], [59, 62, 66], [54, 57, 61], [55, 59, 62], [62, 66, 69], [55, 59, 62], [57, 61, 64]]; // D A Bm F#m G D G A (triad roots in octave 4)
const PAT = [0, 1, 2, 1, 2, 1, 0, 1];
const bars = Math.ceil(DUR / bar);
for (let b = 0; b < bars; b++) {
  const ch = CH[b % 8]; const t0 = b * bar;
  addNote(t0, ch[0] - 24, bar * 1.05, 0.34, -0.15, 'piano');       // bass
  addNote(t0, ch[0] - 12, bar * 1.05, 0.2, 0.15, 'piano');
  for (let k = 0; k < 3; k++) addNote(t0, ch[k] - 12, bar * 1.0, 0.1, k - 1 ? 0.3 : -0.3, 'pad');
  for (let e = 0; e < 8; e++) { // eighth-note arpeggio, a little melody on the upper octave
    const idx = PAT[e]; let m = ch[idx] + (e % 4 === 2 ? 12 : 0); if (idx === 2 && e === 4) m += 12;
    addNote(t0 + e * beat / 2, m, beat * 1.4, 0.2 + (e === 0 ? 0.06 : 0), -0.4 + 0.8 * (e / 7), 'piano');
  }
  if (b % 2 === 1) addNote(t0 + beat * 2, ch[2] + 12, bar * 0.8, 0.13, 0.35, 'piano');      // sparse top melody
}

// ---------- reverb (Schroeder) on the music only ----------
const reverb = (x, delays, fb, mix) => {
  const y = new Float32Array(x.length);
  for (const d of delays) { const D = Math.floor(d * SR); const buf = new Float32Array(D); let p = 0; let damp = 0; for (let i = 0; i < x.length; i++) { const o = buf[p]; damp = damp * 0.4 + o * 0.6; buf[p] = x[i] + damp * fb; p = (p + 1) % D; y[i] += o; } }
  for (const d of [0.0050, 0.0017]) { const D = Math.floor(d * SR); const buf = new Float32Array(D); let p = 0; for (let i = 0; i < x.length; i++) { const o = buf[p]; const v = y[i] + 0.5 * o; buf[p] = v; y[i] = o - 0.5 * v; p = (p + 1) % D; } }
  const out2 = new Float32Array(x.length); for (let i = 0; i < x.length; i++) out2[i] = x[i] * (1 - mix) + y[i] * mix * 0.25; return out2;
};
const mL = reverb(pL, [0.0297, 0.0371, 0.0411, 0.0437, 0.0517], 0.8, 0.6);
const mR = reverb(pR, [0.0311, 0.0383, 0.0423, 0.0451, 0.0529], 0.8, 0.6);

// ---------- master ----------
const outL = mk(), outR = mk();
for (let i = 0; i < N; i++) {
  const t = i / SR; const fin = Math.min(1, t / 2.5), fout = Math.min(1, (DUR - t) / 3.5);
  outL[i] = (mL[i] * 1.0 + L[i] * 0.32) * fin * fout; outR[i] = (mR[i] * 1.0 + R[i] * 0.32) * fin * fout;
}
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
const g = 0.8 / (peak || 1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outL[i] * g)) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outR[i] * g)) * 32767), 46 + i * 4); }
writeFileSync(out, buf); console.log('wrote', out, (buf.length / 1e6).toFixed(1) + ' MB,', DUR + 's');
