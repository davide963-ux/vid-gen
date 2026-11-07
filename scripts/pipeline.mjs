#!/usr/bin/env node
// Free video system glue: OBS/ffmpeg recording -> ffmpeg -> Hyperframes -> ffmpeg mix, plus free music (Jamendo / Pixabay).
// Usage: node scripts/pipeline.mjs <command> [args]
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const die = (m) => { console.error(m); process.exit(1); };
const run = (cmd, args) => {
  console.log('>', cmd, args.join(' '));
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false });
  if (r.status !== 0) die(`${cmd} failed (${r.status})`);
};
const env = () => {
  if (existsSync('.env')) for (const l of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
};

const commands = {
  // Normalize recordings (any fps/res/audio) to 1080p30 H.264/AAC so Hyperframes renders consistently.
  normalize(dir = 'assets/rec') {
    for (const f of readdirSync(dir).filter(f => /\.(mp4|mov|webm|mkv)$/i.test(f) && !f.includes('.norm.'))) {
      const out = join('assets/clips', basename(f, extname(f)) + '.norm.mp4');
      run('ffmpeg', ['-y', '-i', join(dir, f), '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', out]);
    }
  },

  // Free screen recording with ffmpeg (Windows gdigrab + default mic). Press q in the terminal to stop.
  // record [name] [--no-mic]   Prefer OBS Studio (free) for anything fancier; drop its output into assets/rec/.
  record(name = 'recording', flag) {
    const out = `assets/rec/${name}.mp4`;
    const args = ['-y', '-f', 'gdigrab', '-framerate', '30', '-i', 'desktop'];
    if (flag !== '--no-mic') {
      const r = spawnSync('ffmpeg', ['-list_devices', 'true', '-f', 'dshow', '-i', 'dummy'], { encoding: 'utf8' });
      const mic = ((r.stderr || '').match(/"([^"]+)" \(audio\)/) || [])[1];
      if (mic) args.push('-f', 'dshow', '-i', `audio=${mic}`); else console.log('No mic found, recording video only');
    }
    run('ffmpeg', [...args, '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', out]);
  },

  // FREE music via Jamendo (free client_id: devportal.jamendo.com). Only tracks whose CC license allows commercial
  // use are listed (no NC). Most still need attribution, which is saved next to the file.
  // music-search "upbeat tech"
  async 'music-search'(...q) {
    env(); if (!process.env.JAMENDO_CLIENT_ID) die('Set JAMENDO_CLIENT_ID in .env');
    const u = new URL('https://api.jamendo.com/v3.0/tracks/');
    Object.entries({ client_id: process.env.JAMENDO_CLIENT_ID, format: 'json', limit: 10, search: q.join(' '), audiodlformat: 'mp32',
      include: 'licenses', order: 'popularity_total' }).forEach(([k, v]) => u.searchParams.set(k, v));
    const r = await fetch(u); if (!r.ok) die(`Jamendo ${r.status}: ${await r.text()}`);
    for (const t of (await r.json()).results ?? []) {
      const nc = /-nc/.test(t.license_ccurl || '');
      console.log(t.id, '|', t.name, '-', t.artist_name, '|', t.duration + 's', '|', (t.license_ccurl || '').split('/licenses/')[1] ?? '?', nc ? '| NON-COMMERCIAL' : '| ok for commercial');
    }
  },

  // music-get <trackId> [name]  -> assets/music/<name>.mp3 + <name>.credit.txt
  async 'music-get'(id, name) {
    env(); if (!id) die('track id required');
    const u = new URL('https://api.jamendo.com/v3.0/tracks/');
    Object.entries({ client_id: process.env.JAMENDO_CLIENT_ID, format: 'json', id, audiodlformat: 'mp32' }).forEach(([k, v]) => u.searchParams.set(k, v));
    const t = ((await (await fetch(u)).json()).results ?? [])[0]; if (!t) die('track not found');
    if (/-nc/.test(t.license_ccurl || '')) console.warn('WARNING: non-commercial license, do not use in monetized/commercial videos');
    const f = await fetch(t.audiodownload_allowed && t.audiodownload ? t.audiodownload : t.audio); if (!f.ok) die('download failed ' + f.status);
    const base = `assets/music/${name ?? id}`;
    writeFileSync(base + '.mp3', Buffer.from(await f.arrayBuffer()));
    writeFileSync(base + '.credit.txt', `Music: "${t.name}" by ${t.artist_name} (${t.shareurl}) licensed ${t.license_ccurl}\n`);
    console.log('saved', base + '.mp3\n' + readFileSync(base + '.credit.txt', 'utf8'));
  },

  // Mix rendered video + music, ducking music under the video's own voice track.
  // mix <video.mp4> <music.mp3> [out.mp4]
  mix(video, music, out = 'out/final.mp4') {
    if (!video || !music) die('mix <video> <music> [out]');
    run('ffmpeg', ['-y', '-i', video, '-stream_loop', '-1', '-i', music, '-filter_complex',
      '[1:a]volume=0.35[m];[m][0:a]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400[duck];[0:a][duck]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]',
      '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out]);
  },

  // Loudness-normalize for web delivery (-14 LUFS).
  loudnorm(input, out = 'out/final.norm.mp4') {
    run('ffmpeg', ['-y', '-i', input, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', out]);
  },
};

const [cmd, ...args] = process.argv.slice(2);
if (!commands[cmd]) die('Commands: ' + Object.keys(commands).join(', '));
await commands[cmd](...args);
