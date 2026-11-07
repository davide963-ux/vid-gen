#!/usr/bin/env node
// Builds sound-effects/index.json by scanning sound-effects/**/*.{mp3,wav}.
//
//   npm run sfx:index
//
// - id        : filename without extension
// - file      : repo-relative path (use directly as <audio src>)
// - category  : first sub-folder under sound-effects/
// - duration  : seconds, measured with ffprobe (needs ffprobe on PATH)
// - tags/use  : auto-seeded from the filename on first run, then PRESERVED on
//               later runs, so you can hand-edit them in index.json.
//
// Files that disappear from disk are dropped from the index.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SFX_DIR = join(ROOT, "sound-effects");
const OUT = join(SFX_DIR, "index.json");
const EXTS = new Set([".mp3", ".wav"]);
const STOP = new Set(["x3", "x6", "01", "02", "03", "the", "of", "to", "is"]);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : EXTS.has(extname(name).toLowerCase()) ? [p] : [];
  });
}

function duration(file) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8" },
  );
  return Math.round(parseFloat(out) * 100) / 100;
}

if (!existsSync(SFX_DIR)) {
  console.error(`Missing folder: ${SFX_DIR}`);
  process.exit(1);
}

// Keep hand-edited tags/use from the previous index.
const previous = new Map();
if (existsSync(OUT)) {
  try {
    for (const e of JSON.parse(readFileSync(OUT, "utf8")).sounds ?? []) previous.set(e.id, e);
  } catch {
    console.warn("Existing index.json is not valid JSON; regenerating from scratch.");
  }
}

const sounds = walk(SFX_DIR)
  .sort()
  .map((abs) => {
    const rel = relative(ROOT, abs).split("\\").join("/");
    const id = basename(abs, extname(abs));
    const category = relative(SFX_DIR, abs).split(/[\\/]/)[0];
    const old = previous.get(id);
    const seeded = id
      .split("-")
      .filter((t) => t && t !== category && !STOP.has(t));
    return {
      id,
      file: rel,
      category,
      duration: duration(abs),
      tags: old?.tags ?? seeded,
      use: old?.use ?? "",
    };
  })
  .sort((a, b) => a.category.localeCompare(b.category) || a.duration - b.duration);

writeFileSync(OUT, JSON.stringify({ sounds }, null, 2) + "\n");

const fresh = sounds.filter((s) => !previous.has(s.id)).length;
const byCat = sounds.reduce((m, s) => ((m[s.category] = (m[s.category] ?? 0) + 1), m), {});
console.log(`Wrote ${relative(ROOT, OUT)}: ${sounds.length} sounds (${fresh} new)`);
for (const [c, n] of Object.entries(byCat)) console.log(`  ${c.padEnd(16)} ${n}`);
