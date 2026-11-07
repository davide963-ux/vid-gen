import json, subprocess
import numpy as np
from faster_whisper import WhisperModel
meta = json.load(open("lines.json"))
model = WhisperModel("small.en", device="cpu", compute_type="int8")
words = []
for L in meta["lines"]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", L["file"], "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    segs, _ = model.transcribe(np.frombuffer(raw, dtype=np.float32), word_timestamps=True, language="en", beam_size=5)
    ws = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words if w.word.strip()]
    if not ws:
        ws = [("", 0.0, L["dur"])]
    for (t, s, e) in ws:
        words.append({"w": t, "s": round(L["start"] + s, 3), "e": round(L["start"] + e, 3), "line": L["i"]})
    print(L["i"], " ".join(t for t, _, _ in ws))
json.dump(words, open("words_raw.json", "w"), indent=1)
