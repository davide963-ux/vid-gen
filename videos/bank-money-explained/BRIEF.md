---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Your bank deposit isn't sitting in a vault — it's working in the financial system, and most money is just digital numbers."
destination: tiktok
aspect: 1080x1920
language: en
audience: general TikTok viewers curious about money
length: 55s
angle: concept
VO_MODE: verbatim
---

## Intent

Faceless 9:16 TikTok explainer. User's script is used verbatim as the voiceover. Male voice. Reassuring-but-curious tone: a "weird fact" hook, then demystify, never alarmist.

## Customizations

- Male voiceover (local Kokoro `am_michael`; user not signed in to HeyGen).
- Word-synced captions.
- Background music: free only. Offline MusicGen needs multi-GB PyTorch, so storyboard uses `music: none` and a free track is mixed in with ffmpeg after render.

## Notes

- User said "just build it" -> autonomous; one kept question (render now or what changes) at the final preview.
- Do not imply banks are stealing money; keep the reassurance beat.
- Machine has ~0.7 GB free RAM: render may need low worker count.
