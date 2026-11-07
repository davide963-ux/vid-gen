import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
meta = json.load(open("lines.json"))
model = WhisperModel("small.en", device="cpu", compute_type="int8")
words = []
for L in meta["lines"]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", L["file"], "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, dtype=np.float32)
    segs, _ = model.transcribe(audio, word_timestamps=True, language="en", beam_size=5)
    ws = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words if w.word.strip()]
    if L["i"] == 7:                                   # spoken "ten thousand dollars" -> shown as the script's 10,000$.
        ws = [("10,000$.", ws[0][1], ws[-1][2])]
    # merge numeric fragments like "$1" + ",000"
    for (t, s, e) in ws:
        words.append({"w": t, "s": round(L["start"] + s, 3), "e": round(L["start"] + e, 3), "line": L["i"]})
    print(L["i"], " ".join(t for t, _, _ in ws))
json.dump(words, open("words.json", "w"), indent=1)
print(len(words), "words")
