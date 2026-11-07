# Synthesize a background track whose MOOD follows the story. Same constant tempo and key throughout (so it stays one
# continuous piece), but each section changes chords, density and brightness, with an impact at big moments.
# Usage: python3 scripts/gen_music_moments.py out.wav moments.json [duration] [bpm=120]
# moments.json = [{"t": 7.1, "style": "groove"}, ...]  (t is snapped to the nearest beat; a section lasts until the next t)
# styles: intro groove tech build soft hopeful lift swell peak play climb cta
import sys, json, wave
import numpy as np
out, mfile = sys.argv[1:3]
dur = float(sys.argv[3]) if len(sys.argv) > 3 else 87.0
bpm = float(sys.argv[4]) if len(sys.argv) > 4 else 120.0
SR = 44100; N = int(dur * SR); beat = 60.0 / bpm; bar = 4 * beat
L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(7)
mtof = lambda m: 440.0 * 2 ** ((m - 69) / 12)
CH = {'C': (48, [60, 64, 67]), 'G': (43, [59, 62, 67]), 'Am': (45, [60, 64, 69]), 'F': (41, [60, 65, 69]), 'Dm': (50, [62, 65, 69]), 'Em': (52, [59, 64, 67])}
# prog, kick, bass, hats(0/1/2), clap, arp(0 none/1 8ths/2 16ths), counter, stabs, pad gain, bright(0-1), impact
S = {
 'intro':   dict(p='C G Am F',  kick=0, bass=0, hats=0, clap=0, arp=1, counter=0, stabs=0, pad=1.0, bright=.7, impact=0, gain=1.1),
 'groove':  dict(p='C G Am F',  kick=1, bass=1, hats=0, clap=0, arp=1, counter=0, stabs=0, pad=1.0, bright=.8, impact=1),
 'tech':    dict(p='F C G Am',  kick=1, bass=1, hats=1, clap=1, arp=2, counter=0, stabs=0, pad=.8,  bright=1., impact=1),
 'build':   dict(p='Am F C G',  kick=1, bass=1, hats=1, clap=1, arp=1, counter=1, stabs=0, pad=1.0, bright=.9, impact=1),
 'soft':    dict(p='Am Dm F G', kick=0, bass=1, hats=0, clap=0, arp=1, counter=0, stabs=0, pad=1.4, bright=.35, impact=0, gain=.5),
 'hopeful': dict(p='C G Am F',  kick=1, bass=1, hats=1, clap=0, arp=1, counter=1, stabs=0, pad=1.1, bright=.9, impact=1),
 'lift':    dict(p='F G Am C',  kick=1, bass=1, hats=1, clap=1, arp=2, counter=1, stabs=1, pad=.9,  bright=1., impact=1),
 'swell':   dict(p='Am F G G',  kick=0, bass=1, hats=0, clap=0, arp=2, counter=0, stabs=0, pad=1.0, bright=1., impact=0),
 'peak':    dict(p='C F G C',   kick=1, bass=1, hats=2, clap=1, arp=2, counter=1, stabs=1, pad=1.0, bright=1., impact=2, gain=1.1),
 'play':    dict(p='G Am F C',  kick=0, bass=1, hats=1, clap=0, arp=1, counter=1, stabs=0, pad=.7,  bright=1., impact=0, gain=.75),
 'climb':   dict(p='F G Am C',  kick=1, bass=1, hats=2, clap=1, arp=2, counter=1, stabs=1, pad=.9,  bright=1., impact=1),
 'cta':     dict(p='C G Am F',  kick=1, bass=1, hats=2, clap=1, arp=2, counter=1, stabs=1, pad=1.0, bright=1., impact=2),
}

CUR = [1.0]
def add(sig, t, pan=0.0, g=1.0):
    g = g * CUR[0]
    i = int(round(t * SR))
    if i >= N or i < 0: return
    s = sig[: N - i] * g
    L[i:i + len(s)] += s * (1 - max(0, pan)); R[i:i + len(s)] += s * (1 + min(0, pan))
def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def pluck(f, d=0.28, bright=1.0):
    n = int(0.9 * SR); t = np.arange(n) / SR
    w = np.sin(2 * np.pi * f * t) + 0.5 * bright * np.sin(4 * np.pi * f * t) + 0.25 * bright * np.sin(6 * np.pi * f * t) + 0.12 * bright * np.sin(8 * np.pi * f * t)
    return w * env(n, 0.003, d) * 0.5
def pad(freqs, n):
    t = np.arange(n) / SR; w = sum(np.sin(2 * np.pi * f * t) + np.sin(2 * np.pi * f * 1.004 * t) for f in freqs)
    return w * np.minimum(1, t / 0.4) * np.minimum(1, np.maximum(0, (n / SR - t)) / 0.3) * 0.05
def bass(f, d=0.22):
    n = int(0.5 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(n, 0.005, d) * 0.55
def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR; f = 45 + 90 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.14) * 0.9
def noise(n): return np.diff(rng.standard_normal(n), prepend=0)
def hat(d=0.04, g=0.18): n = int(0.25 * SR); return noise(n) * env(n, 0.001, d) * g
def clap(): n = int(0.3 * SR); return noise(n) * (env(n, 0.001, 0.07) + 0.6 * env(n, 0.001, 0.02)) * 0.28
def impact(big):  # boom + crash at a section start
    n = int(1.6 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-t / 0.08)) * t) * np.exp(-t / 0.5) * 0.9
    crash = noise(n) * np.exp(-t / (0.9 if big > 1 else 0.45)) * (0.22 if big > 1 else 0.12)
    return boom + crash
def riser(length):  # rising noise swell
    n = int(length * SR); t = np.arange(n) / SR; x = noise(n)
    return x * (t / length) ** 2.2 * 0.35

M = sorted(json.load(open(mfile)), key=lambda m: m['t'])
for m in M: m['t'] = round(m['t'] / beat) * beat
for k, m in enumerate(M):
    t0 = m['t']; t1 = M[k + 1]['t'] if k + 1 < len(M) else dur + 1
    st = {**S[m['style']], **m.get('override', {})}; prog = [CH[c] for c in st['p'].split()]; CUR[0] = st.get('gain', 1.0)
    if st['impact']: add(impact(st['impact']), t0, 0, 0.9)
    if m['style'] == 'swell':  # riser + snare roll that accelerates into the next section
        add(riser(t1 - t0), t0, 0, 1.0)
        steps = int((t1 - t0) / (beat / 2));
        for q in range(steps):
            tt = t0 + q * beat / 2
            if tt >= t1 - 2 * beat:
                for r in range(2): add(clap(), tt + r * beat / 4, 0, 0.7)
            else: add(clap(), tt, 0, 0.45)
    b = 0
    while t0 + b * bar < t1 - 1e-6:
        tb = t0 + b * bar; root, tri = prog[b % len(prog)]
        room = min(bar, t1 - tb); nb = max(1, int(round(room / beat)))
        add(pad([mtof(x) for x in tri] + [mtof(root + 12)], int(room * SR)), tb, 0, st['pad'])
        if st['arp']:
            steps = 8 if st['arp'] == 1 else 16; dt = bar / steps
            for q in range(steps):
                if tb + q * dt >= t1 - 1e-6: break
                m_ = tri[[0, 1, 2, 1][q % 4]] + (12 if (st['arp'] == 2 and (q // 4) % 2) else 0)
                add(pluck(mtof(m_), 0.2 if st['arp'] == 2 else 0.24, st['bright']), tb + q * dt, (-0.4 if q % 2 else 0.4), 0.5)
        for q in range(nb):
            tq = tb + q * beat
            if st['kick']: add(kick(), tq, 0, 0.8)
            if st['clap'] and q in (1, 3): add(clap(), tq, 0, 1.0)
        if st['bass']:
            for q in range(2 * nb):
                add(bass(mtof(root) * (2 if q % 4 == 3 else 1), 0.5 if m['style'] == 'soft' else 0.22), tb + q * beat / 2, 0, 0.9)
        if st['hats']:
            for q in range(2 * nb): add(hat(0.03 if q % 2 else 0.05, 0.16 if q % 2 else 0.10), tb + q * beat / 2, 0.2, 1.0)
            if st['hats'] == 2:
                for q in range(nb): add(hat(0.18, 0.18), tb + q * beat + beat / 2, -0.2, 0.8)
        if st['counter']:
            for q, mm in zip((0, 1.5, 2.5, 3), (tri[2] + 12, tri[1] + 12, tri[2] + 12, tri[0] + 19)):
                if q < nb: add(pluck(mtof(mm), 0.3, st['bright']), tb + q * beat, 0.5, 0.45)
        if st['stabs']:
            for q in (0, 2):
                if q < nb: add(pad([mtof(x + 12) for x in tri], int(beat * 1.6 * SR)) * 3.0, tb + q * beat, 0, 0.6)
        b += 1
tail = int(2.5 * SR); fade = np.ones(N); fade[-tail:] = np.linspace(1, 0, tail) ** 1.5; fade[: int(0.2 * SR)] = np.linspace(0, 1, int(0.2 * SR))
st_ = np.stack([L * fade, R * fade], 1); st_ = st_ / (np.abs(st_).max() + 1e-9) * 0.85
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st_ * 32767).astype("<i2").tobytes())
print("wrote", out, round(dur, 1), "s,", len(M), "sections")
