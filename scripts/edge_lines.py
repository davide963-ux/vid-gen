# Free neural TTS via edge-tts (Microsoft online voices, no account). Writes NN.mp3 + word boundaries per line.
# Usage: py -3.12 scripts/edge_lines.py <script.json> <outdir> <voice> <rate e.g. -4%>
import asyncio, json, sys, os
import edge_tts
script, outdir, voice, rate = sys.argv[1:5]
lines = json.load(open(script, encoding="utf-8"))
os.makedirs(outdir, exist_ok=True)
async def one(i, text):
    c = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    b = []
    with open(os.path.join(outdir, f"{i:02d}.mp3"), "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] == "WordBoundary": b.append({"w": ch["text"], "s": ch["offset"] / 1e7, "d": ch["duration"] / 1e7})
    return b
async def main():
    out = {}
    for i, L in enumerate(lines, 1):
        out[i] = await one(i, L["say"]); print(i, len(out[i]), "words")
    json.dump(out, open(os.path.join(outdir, "bounds.json"), "w", encoding="utf-8"), ensure_ascii=False)
asyncio.run(main())
