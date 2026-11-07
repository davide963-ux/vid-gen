# Synthesize a glitch / UI / impact sound-effect pack (no downloads, no licence issues) into sound-effects/.
# Usage: python3 scripts/gen_glitch_sfx.py            (then: npm run sfx:index)
# Seeded, so every run produces identical files.
import os, wave
import numpy as np
SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "sound-effects")

def save(folder, name, x):
    os.makedirs(os.path.join(ROOT, folder), exist_ok=True)
    x = np.asarray(x, dtype=np.float64); x = x / (np.abs(x).max() + 1e-9) * 0.9
    st = np.stack([x, x], 1)
    with wave.open(os.path.join(ROOT, folder, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype("<i2").tobytes())

def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, d, hold=0):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - hold) / d)
def noise(n, rng): return rng.standard_normal(n)
def hp(x): return np.diff(x, prepend=0)
def crush(x, bits, dec):
    x = np.repeat(x[::dec], dec)[: len(x)]
    q = 2 ** (bits - 1)
    return np.round(x * q) / q
def saw(f, t): return 2 * ((f * t) % 1.0) - 1

def stutter(seed, d=0.5, bits=5, dec=6, base=220):
    rng = np.random.default_rng(seed); n = int(d * SR); t = np.arange(n) / SR
    f = base * 2 ** (rng.integers(-6, 12, size=8) / 12.0)
    seg = n // 8; x = np.zeros(n)
    for k in range(8):
        a = k * seg; tt = np.arange(seg) / SR
        s = 0.6 * saw(f[k], tt) + 0.4 * noise(seg, rng) * (0.3 + 0.7 * (k % 2))
        x[a:a + seg] = s
    # stutter: repeat tiny slices
    out = np.zeros(n); i = 0
    while i < n:
        L = int(rng.integers(300, 1800)); rep = int(rng.integers(2, 6)); sl = x[i:i + L]
        for r in range(rep):
            if i + len(sl) > n: break
            out[i:i + len(sl)] = sl; i += len(sl)
        i += int(rng.integers(0, 600))
    out = crush(out, bits, dec)
    gate = (np.sin(2 * np.pi * rng.uniform(18, 40) * t) > -0.3).astype(float)
    return out * gate * env(n, 0.002, d * 0.55, hold=d * 0.35)

def zap(seed, d=0.35):
    rng = np.random.default_rng(seed); n = int(d * SR); t = np.arange(n) / SR
    f = 2400 * np.exp(-t / 0.09) + 180
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * hp(noise(n, rng))
    sh = np.repeat(x[:: 40], 40)[:n]                              # sample & hold
    return crush(0.6 * x + 0.5 * sh, 4, 3) * env(n, 0.001, 0.13)

def static_burst(seed, d=0.4):
    rng = np.random.default_rng(seed); n = int(d * SR); t = np.arange(n) / SR
    gate = (rng.random(int(d * 60) + 1) > 0.45).astype(float); g = np.repeat(gate, SR // 60 + 1)[:n]
    return hp(noise(n, rng)) * g * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)) * env(n, 0.001, d * 0.6)

def tape_stop(d=0.55):
    rng = np.random.default_rng(3); n = int(d * SR); t = np.arange(n) / SR
    f = 700 * (1 - t / d) ** 2 + 40
    x = saw(1, 1) * 0 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.7 + 0.25 * np.sign(np.sin(2 * np.pi * np.cumsum(f * 0.5) / SR))
    return crush(x, 6, 2) * np.minimum(1, (d - t) / 0.1) * env(n, 0.002, d)

def click(f=2600, d=0.03, seed=1):
    rng = np.random.default_rng(seed); n = int(d * SR); t = np.arange(n) / SR
    return (hp(noise(n, rng)) * 0.7 + np.sin(2 * np.pi * f * t)) * env(n, 0.0004, 0.004)
def tick():  # typing tick
    rng = np.random.default_rng(9); n = int(0.02 * SR); t = np.arange(n) / SR
    return (hp(noise(n, rng)) * 0.5 + np.sin(2 * np.pi * 1500 * t)) * env(n, 0.0003, 0.003)
def blip(f1, f2, d=0.09):
    n = int(d * SR); t = np.arange(n) / SR; f = np.where(t < d / 2, f1, f2)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, d * 0.5) * 0.8
def confirm():
    x = np.zeros(int(0.4 * SR))
    for k, f in enumerate((880, 1175, 1568)):
        b = blip(f, f * 1.003, 0.14); a = int(k * 0.07 * SR); x[a:a + len(b)] += b[: len(x) - a]
    return x
def impact_sub(d=1.1):
    rng = np.random.default_rng(5); n = int(d * SR); t = np.arange(n) / SR
    f = 48 + 90 * np.exp(-t / 0.07)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.38)
    crack = hp(noise(n, rng)) * np.exp(-t / 0.05) * 0.5
    return boom + crack
def shatter(d=1.2):
    rng = np.random.default_rng(11); n = int(d * SR); t = np.arange(n) / SR
    x = hp(hp(noise(n, rng))) * np.exp(-t / 0.18) * 0.5
    for _ in range(24):
        f = rng.uniform(2500, 9000); a = int(rng.uniform(0, 0.5) * SR); m = n - a
        x[a:] += np.sin(2 * np.pi * f * np.arange(m) / SR) * np.exp(-np.arange(m) / SR / 0.05) * rng.uniform(0.1, 0.35)
    return x
def data_whirr(d=0.7):
    rng = np.random.default_rng(13); n = int(d * SR); t = np.arange(n) / SR
    f = 300 + 1800 * t / d
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sign(np.sin(2 * np.pi * 28 * t))
    return crush(x, 5, 3) * np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.12) * 0.7

for i, (seed, d, b, dec, base) in enumerate([(1, .45, 5, 6, 220), (2, .6, 4, 8, 330), (3, .35, 6, 4, 165), (4, .8, 5, 5, 110)], 1):
    save("glitch-synth", f"glitch-stutter-{i:02d}", stutter(seed, d, b, dec, base))
save("glitch-synth", "glitch-zap-01", zap(1)); save("glitch-synth", "glitch-zap-02", zap(2, 0.5))
save("glitch-synth", "glitch-static-burst-01", static_burst(1)); save("glitch-synth", "glitch-static-burst-02", static_burst(2, 0.7))
save("glitch-synth", "glitch-tape-stop", tape_stop())
save("glitch-synth", "glitch-data-whirr", data_whirr())
save("ui-synth", "ui-click-01", click()); save("ui-synth", "ui-click-02", click(3400, 0.025, 2)); save("ui-synth", "ui-typing-tick", tick())
save("ui-synth", "ui-blip-up", blip(900, 1350)); save("ui-synth", "ui-blip-down", blip(1350, 900)); save("ui-synth", "ui-confirm", confirm())
save("impacts-synth", "impact-sub-boom", impact_sub()); save("impacts-synth", "impact-glass-shatter", shatter())
print("wrote", sum(len(f) for _, _, f in os.walk(ROOT)) , "files under sound-effects/")
