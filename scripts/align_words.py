"""Local word-timing for narration: transcribe each voice wav with faster-whisper
and write frame-relative words into audio_meta.json (the shape captions.mjs reads).

Usage: python align_words.py <project_dir> [model]
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

project = Path(sys.argv[1])
model_name = sys.argv[2] if len(sys.argv) > 2 else "base.en"
meta_path = project / "audio_meta.json"
meta = json.loads(meta_path.read_text(encoding="utf-8"))

model = WhisperModel(model_name, device="cpu", compute_type="int8")
n = 0
for v in meta["voices"]:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(project / v["path"]), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
        capture_output=True, check=True,
    ).stdout
    audio = np.frombuffer(raw, dtype=np.float32)
    segments, _ = model.transcribe(audio, word_timestamps=True, language="en", beam_size=5)
    words = []
    for seg in segments:
        for w in seg.words:
            text = w.word.strip()
            if text:
                words.append({"id": f"w{n}", "text": text, "start": round(w.start, 3), "end": round(w.end, 3)})
                n += 1
    v["words"] = words
    print(f"frame {v['frame']}: {len(words)} words | {' '.join(w['text'] for w in words)}")

meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
print("wrote", meta_path)
