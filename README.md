# Free video system

OBS Studio or ffmpeg (record) -> ffmpeg (normalize) -> Hyperframes (HTML compose/render) -> ffmpeg (music mix + loudness). Everything free.

1. **Record**: OBS Studio (obsproject.com) saving to `assets/rec/`, or `npm run record -- mytake` (ffmpeg screen + mic, press `q` to stop).
2. `npm run normalize` -> 1080p30 clips in `assets/clips/`.
3. **Music** (pick one):
   - Pixabay Music (pixabay.com/music): free commercial use, no attribution. Download by hand into `assets/music/`.
   - YouTube Audio Library: filter to tracks that need no attribution.
   - Jamendo API: free key in `.env` as `JAMENDO_CLIENT_ID`, then `npm run music:search -- upbeat tech` and `npm run music:get -- <id> bgm`. Skips nothing for you except it flags non-commercial tracks; credit goes in `bgm.credit.txt`, paste it in the video description.
4. Ask Claude Code: "Using /hyperframes, build a video from assets/clips/x.norm.mp4". Preview `npm run dev`, render `npm run render`.
5. `npm run mix -- out/render.mp4 assets/music/bgm.mp3` then `npm run loudnorm -- out/final.mp4`.
