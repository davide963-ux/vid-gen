# Synthesize a royalty-free upbeat background track (no downloads, no licence issues).
# Linear build: one continuous groove, constant tempo and key, layers join at bar boundaries and never drop out.
# Usage: python3 scripts/gen_music_upbeat.py out.wav [duration=87] [bpm=120] [layer_times="0,6,22,40,58"]
#   layers: 0 = pad + soft arpeggio | 1 = kick + bass | 2 = hats + clap | 3 = high pluck counter-line | 4 = full (open hats, octave arp, stabs)
import sys, wave
import numpy as np
out = sys.argv[1]; dur = float(sys.argv[2]) if len(sys.argv) > 2 else 87.0
bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 120.0
T = [float(x) for x in (sys.argv[4] if len(sys.argv) > 4 else "0,6,22,40,58").split(",")]
SR = 44100; N = int(dur * SR); beat = 60.0 / bpm; bar = 4 * beat
L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(7)
mtof = lambda m: 440.0 * 2 ** ((m - 69) / 12)
CH = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]  # C G Am F : bass root + triad

def add(sig, t, pan=0.0, g=1.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    s = sig[: N - i] * g
    L[i:i + len(s)] += s * (1 - max(0, pan)); R[i:i + len(s)] += s * (1 + min(0, pan))

def env(n, a, d):  # attack/exp-decay
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def pluck(f, d=0.28, n=None):
    n = n or int(0.9 * SR); t = np.arange(n) / SR
    w = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(4 * np.pi * f * t) + 0.25 * np.sin(6 * np.pi * f * t) + 0.12 * np.sin(8 * np.pi * f * t)
    return w * env(n, 0.003, d) * 0.5
def pad(freqs, n):
    t = np.arange(n) / SR; w = sum(np.sin(2 * np.pi * f * t) + np.sin(2 * np.pi * f * 1.004 * t) for f in freqs)
    a = np.minimum(1, t / 0.5) * np.minimum(1, (n / SR - t) / 0.5)
    return w * a * 0.05
def bass(f):
    n = int(0.45 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(n, 0.005, 0.22) * 0.55
def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR; f = 45 + 90 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.14) * 0.9
def hat(d=0.04, g=0.18):
    n = int(0.25 * SR); x = rng.standard_normal(n); x = np.diff(x, prepend=0)
    return x * env(n, 0.001, d) * g
def clap():
    n = int(0.3 * SR); x = rng.standard_normal(n); x = np.diff(x, prepend=0)
    return x * (env(n, 0.001, 0.07) + 0.6 * env(n, 0.001, 0.02)) * 0.28

nbars = int(dur / bar) + 1
for b in range(nbars):
    t0 = b * bar; root, tri = CH[b % 4]
    if t0 >= T[0]:
        add(pad([mtof(m) for m in tri] + [mtof(root + 12)], int(bar * SR)), t0, 0, 1.0)
        for k in range(8):   # soft 8th-note arpeggio
            add(pluck(mtof(tri[[0, 1, 2, 1][k % 4]] + (12 if k >= 4 and t0 >= T[3] else 0)), 0.22), t0 + k * beat / 2, (-0.4 if k % 2 else 0.4), 0.55)
    if t0 >= T[1]:
        for k in range(4): add(kick(), t0 + k * beat, 0, 0.8)
        for k in range(8): add(bass(mtof(root) * (2 if k % 4 == 3 else 1)), t0 + k * beat / 2, 0, 0.9)
    if t0 >= T[2]:
        for k in range(8): add(hat(0.03 if k % 2 else 0.05, 0.16 if k % 2 else 0.10), t0 + k * beat / 2 + (beat / 4 if False else 0), 0.2, 1.0)
        for k in (1, 3): add(clap(), t0 + k * beat, 0, 1.0)
    if t0 >= T[3]:
        for k, m in zip((0, 1.5, 2.5, 3), (tri[2] + 12, tri[1] + 12, tri[2] + 12, tri[0] + 19)): add(pluck(mtof(m), 0.3), t0 + k * beat, 0.5, 0.45)
    if t0 >= T[4]:
        for k in range(4): add(hat(0.18, 0.18), t0 + k * beat + beat / 2, -0.2, 0.8)
        for k in (0, 2): add(pad([mtof(m + 12) for m in tri], int(beat * 1.6 * SR)) * 3.0, t0 + k * beat, 0, 0.6)
tail = int(2.5 * SR); fade = np.ones(N); fade[-tail:] = np.linspace(1, 0, tail) ** 1.5; fade[: int(0.2 * SR)] = np.linspace(0, 1, int(0.2 * SR))
st = np.stack([L * fade, R * fade], 1); st = st / (np.abs(st).max() + 1e-9) * 0.85
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype("<i2").tobytes())
print("wrote", out, round(dur, 1), "s", bpm, "bpm")
