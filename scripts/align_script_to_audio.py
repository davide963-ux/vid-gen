# Align a known script onto an existing narration file (any voice) using faster-whisper word timestamps.
# Usage: py -3.12 scripts/align_script_to_audio.py <audio> <script_lines.json> <out_dir> [tail=1.4] [lang=en]
# Writes <out_dir>/words.json (caption tokens with line + timing), lines.json, words_raw.json
import sys, json, re, subprocess, difflib
import numpy as np
from faster_whisper import WhisperModel
audio, script, out = sys.argv[1:4]
tail = float(sys.argv[4]) if len(sys.argv) > 4 else 1.4
lang = sys.argv[5] if len(sys.argv) > 5 else "en"
lines = json.load(open(script, encoding="utf-8"))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
dur = len(raw) / 4 / 16000
model = WhisperModel("small.en" if lang == "en" else "small", device="cpu", compute_type="int8")
segs, _ = model.transcribe(np.frombuffer(raw, dtype=np.float32), word_timestamps=True, language=lang, beam_size=5, vad_filter=False)
W = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words if w.word.strip()]
json.dump([{"w": a, "s": b, "e": c} for a, b, c in W], open(out + "/words_raw.json", "w"), indent=1)
norm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower().replace("$", "").replace(",", ""))
toks = []  # (token, line)
for li, L in enumerate(lines, 1):
    for t in L.split():
        toks.append((t, li))
a = [norm(t) for t, _ in toks]; b = [norm(w[0]) for w in W]
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
tm = [None] * len(toks)
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        tm[blk.a + k] = (W[blk.b + k][1], W[blk.b + k][2])
# fill gaps by interpolating between matched neighbours
n = len(toks); i = 0
while i < n:
    if tm[i] is None:
        j = i
        while j < n and tm[j] is None: j += 1
        s0 = tm[i - 1][1] if i > 0 else 0.0
        e0 = tm[j][0] if j < n else dur
        cnt = j - i
        for k in range(cnt):
            tm[i + k] = (s0 + (e0 - s0) * k / cnt, s0 + (e0 - s0) * (k + 1) / cnt)
        i = j
    else: i += 1
words = [{"w": t, "s": round(tm[k][0], 3), "e": round(max(tm[k][1], tm[k][0] + 0.08), 3), "line": li} for k, (t, li) in enumerate(toks)]
json.dump(words, open(out + "/words.json", "w"), indent=1, ensure_ascii=False)
ls = []
for li, L in enumerate(lines, 1):
    ws = [w for w in words if w["line"] == li]
    ls.append({"i": li, "text": L, "start": ws[0]["s"], "end": ws[-1]["e"], "dur": round(ws[-1]["e"] - ws[0]["s"], 3)})
json.dump({"total": round(dur + tail, 2), "lines": ls}, open(out + "/lines.json", "w"), indent=2, ensure_ascii=False)
matched = sum(1 for x in sm.get_matching_blocks() for _ in range(x.size))
print("audio", round(dur, 2), "s; script tokens", n, "whisper words", len(W), "matched", matched)
for l in ls: print(l["i"], l["start"], l["end"], l["text"][:50])
