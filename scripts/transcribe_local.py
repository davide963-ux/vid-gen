"""Lightweight local transcription for the embedded-captions workflow (no PyTorch, no GPU).

Writes <project>/transcript.json as { text, language_code, words:[{text,start,end,type}] },
the shape embedded-captions' transcribe.cjs accepts as "already normalized" (so it skips WhisperX).

Usage: py -3.12 transcribe_local.py <video-or-audio> <project-dir> [model=small.en] [language=en]
Models (CPU, int8): tiny.en / base.en / small.en (default, good accuracy) / small / medium (multilingual, slow).
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

src, project = Path(sys.argv[1]), Path(sys.argv[2])
model_name = sys.argv[3] if len(sys.argv) > 3 else "small.en"
language = sys.argv[4] if len(sys.argv) > 4 else ("en" if model_name.endswith(".en") else None)

raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", str(src), "-vn", "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
    capture_output=True, check=True,
).stdout
audio = np.frombuffer(raw, dtype=np.float32)
if audio.size < 16000 * 0.5 or float(np.abs(audio).max()) < 0.005:
    sys.exit("No audible speech found: refusing to caption silence (whisper would invent words).")

model = WhisperModel(model_name, device="cpu", compute_type="int8")
segments, info = model.transcribe(audio, word_timestamps=True, language=language, beam_size=5, vad_filter=True)

words, text = [], []
for seg in segments:
    text.append(seg.text.strip())
    for w in seg.words:
        t = w.word.strip()
        if t:
            words.append({"text": t, "start": round(w.start, 3), "end": round(w.end, 3), "type": "word"})

# merge number fragments ("$1" + ",000") so captions show whole tokens
merged = []
for w in words:
    if merged and w["text"][:1] in ",." and w["text"][1:2].isdigit():
        merged[-1]["text"] += w["text"]
        merged[-1]["end"] = w["end"]
    else:
        merged.append(w)

project.mkdir(parents=True, exist_ok=True)
out = project / "transcript.json"
out.write_text(json.dumps({"text": " ".join(text), "language_code": info.language, "words": merged}, indent=2), encoding="utf-8")
print(f"wrote {out}: {len(merged)} words, language={info.language}, model={model_name}")
print("first words:", " ".join(w["text"] for w in merged[:14]))
