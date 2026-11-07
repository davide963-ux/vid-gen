# Offline forced alignment of a KNOWN script onto a narration file (any voice) with pocketsphinx.
# Use when faster-whisper / HuggingFace is not reachable (e.g. the cloud container). Needs: pip install pocketsphinx
# Usage: python3 scripts/align_pocketsphinx.py <audio> <script_lines.json> <out_dir> [tail=1.6] [spoken_map.json]
# Writes <out_dir>/words.json and <out_dir>/lines.json in the same format as align_script_to_audio.py.
#
# script_lines.json  = display text, one string per line (what the captions show).
# spoken_map.json    = optional {"token": "how it is spoken"} for tokens the dictionary cannot read
#                      (numbers, $ amounts, brands). Built-in defaults cover common ones.
import sys, json, re, subprocess
from pocketsphinx import Decoder, get_model_path

audio, script, out = sys.argv[1:4]
tail = float(sys.argv[4]) if len(sys.argv) > 4 else 1.6
extra_map = json.load(open(sys.argv[5], encoding="utf-8")) if len(sys.argv) > 5 else {}

# pronunciations for words missing from cmudict (ARPAbet)
PHONES = {
    "tiktok": "T IH K T AA K", "fiverr": "F AY V ER", "upwork": "AH P W ER K", "canva": "K AE N V AH",
    "chatgpt": "CH AE T JH IY P IY T IY", "dm": "D IY EH M", "ai": "EY AY",
}
SPOKEN = {"1:": "one", "2:": "two", "3:": "three", "4:": "four", "2": "two", "3": "three", "4": "four", "100$": "one hundred dollars", "$100": "one hundred dollars",
          "$25": "twenty five dollars", "25": "twenty five"}
SPOKEN.update({k.lower(): v for k, v in extra_map.items()})

lines = json.load(open(script, encoding="utf-8"))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                     capture_output=True, check=True).stdout
dur = len(raw) / 2 / 16000

mp = get_model_path()
dec = Decoder(hmm=mp + "/en-us/en-us", dict=mp + "/en-us/cmudict-en-us.dict", loglevel="FATAL", frate=100)
for w, ph in PHONES.items():
    if dec.lookup_word(w) is None:
        dec.add_word(w, ph, True)

def clean(t):  # one display token -> list of dictionary words
    key = t.lower().strip(".,!?\"'()")
    key_raw = t.lower().strip(".,!?")
    for k in (key_raw, key):
        if k in SPOKEN:
            return SPOKEN[k].split()
    w = re.sub(r"[^a-z']", "", key)
    return [w] if w else []

toks = []  # (display token, line no, [spoken words])
for li, L in enumerate(lines, 1):
    for t in L.split():
        toks.append((t, li, clean(t)))
spoken = [w for _, _, ws in toks for w in ws]
# unknown words -> report
unk = sorted({w for w in spoken if dec.lookup_word(w) is None})
if unk:
    print("WARNING words not in dictionary (add to PHONES):", unk)
    spoken = [w for w in spoken if w not in unk]

dec.set_align_text(" ".join(spoken))
dec.start_utt()
dec.process_raw(raw, False, True)
dec.end_utt()
segs = [(s.word, s.start_frame / 100.0, (s.end_frame + 1) / 100.0) for s in dec.seg() if s.word not in ("<s>", "</s>", "<sil>", "[SPEECH]", "(NULL)")]
segs = [(re.sub(r"\(\d+\)$", "", w), s, e) for w, s, e in segs]
if len(segs) != len(spoken):
    print(f"WARNING: aligned {len(segs)} words, expected {len(spoken)}")

# map aligned words back onto display tokens
words = []; k = 0
for t, li, ws in toks:
    if not ws or any(w not in spoken for w in ws) and False:
        continue
    n = len([w for w in ws if w not in unk])
    chunk = segs[k:k + n]; k += n
    if not chunk:
        continue
    words.append({"w": t, "s": round(chunk[0][1], 3), "e": round(max(chunk[-1][2], chunk[0][1] + 0.08), 3), "line": li})
json.dump(words, open(out + "/words.json", "w"), indent=1, ensure_ascii=False)
ls = []
for li, L in enumerate(lines, 1):
    ws = [w for w in words if w["line"] == li]
    if not ws: continue
    ls.append({"i": li, "text": L, "start": ws[0]["s"], "end": ws[-1]["e"], "dur": round(ws[-1]["e"] - ws[0]["s"], 3)})
json.dump({"total": round(dur + tail, 2), "lines": ls}, open(out + "/lines.json", "w"), indent=2, ensure_ascii=False)
print("audio", round(dur, 2), "s; display tokens", len(toks), "aligned words", len(segs))
for l in ls: print(l["i"], l["start"], l["end"], l["text"][:60])
