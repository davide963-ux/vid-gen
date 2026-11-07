// Paste-in helpers for HyperFrames templates (classic <script>, GSAP timeline `tl`, `$` = querySelector).
// Ideas adapted (rewritten for our stack) from the MIT-licensed iart-ai/tiktok-video-skills + kinetic-typography-skills.
// Everything is seek-safe: tweens only, no timers, no randomness except the seeded hash().
//
// Needs this CSS in the template:
//   .mw { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.14em; margin-bottom: -0.14em; }
//   .mi { display: inline-block; will-change: transform; }

const SAFE = { left: 60, right: 960, top: 120, bottom: 1600 };   // 1080x1920: keep text/cards inside; TikTok UI sits outside (right ~120px, bottom ~320px)

const hashH = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Split a PLAIN-TEXT element into masked words (screen-reader label kept). Returns the inner word nodes.
const splitWords = (sel) => {
  const el = document.querySelector(sel); const txt = el.textContent.trim();
  el.setAttribute('aria-label', txt);
  el.innerHTML = txt.split(/\s+/).map((w) => `<span class="mw"><span class="mi">${w}</span></span>`).join(' ');
  return el.querySelectorAll('.mi');
};

// 1) Mask reveal: each word rises out of a clipped line. ~0.6s per word, 60ms stagger, expo ease (keep the whole reveal under ~0.8-1.0s).
//    Use for headlines that appear mid-video (NOT the hook; see hookNow).
const maskReveal = (tl, sel, t, o = {}) => {
  const items = splitWords(sel);
  tl.set(sel, { opacity: 1 }, t);
  tl.fromTo(items, { yPercent: 115 }, { yPercent: 0, duration: o.dur || 0.6, ease: 'expo.out', stagger: o.stagger || 0.06, immediateRender: false }, t);
  return items.length;
};
// matching exit: words drop back down (use instead of a plain fade when a headline leaves)
const maskHide = (tl, sel, t, o = {}) => {
  const items = document.querySelectorAll(sel + ' .mi');
  tl.to(items, { yPercent: -115, duration: o.dur || 0.35, ease: 'power3.in', stagger: o.stagger || 0.03 }, t);
  tl.set(sel, { opacity: 0 }, t + (o.dur || 0.35) + 0.03 * items.length);
};

// 2) Hook on frame 1: the hook text is fully visible at t=0 (no fade-up, no fade from black); only a tiny settle motion.
const hookNow = (tl, sels) => { sels.forEach((s) => { tl.set(s, { opacity: 1 }, 0); tl.fromTo(s, { scale: 1.05 }, { scale: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }, 0); }); };

// 3) Pattern interrupt: a quick punch-in pulse on an element (use on long holds).
const punch = (tl, sel, t, o = {}) => {
  tl.fromTo(sel, { scale: 1 }, { scale: o.scale || 1.07, duration: o.dur || 0.18, ease: 'power2.out', immediateRender: false }, t);
  tl.to(sel, { scale: 1, duration: 0.45, ease: 'power2.inOut' }, t + (o.dur || 0.18));
};
// Pulse an element every ~3s (uneven: 2.2s-3.8s gaps) between `from` and `to`. Never use a metronome gap.
const heartbeat = (tl, sel, from, to, o = {}) => { let t = from + 1.2; let i = 0; while (t < to - 0.8) { punch(tl, sel, t, o); t += 2.2 + hashH(i++ + (o.seed || 0)) * 1.6; } };

// 4) Optional seamless loop: end on the same first-frame look. Fade the final card out to the hook's background in the last 0.5s
//    and make the last spoken line read as the lead-in to the first line ("...and that is why" -> hook).

// 5) Scene wipe: each scene is a full-frame container (.sc, own background colour). The next one slides/zooms in over the previous.
//    Initial offsets: tl.set('#sc2', { x: 1080 }, 0)  or { y: 1920 } / { x: -1080 } / { scale: 1.5, opacity: 0 } (zoom-in). Example: sceneCut(tl, '#sc1', '#sc2', 2.45, { x: 1080 });
//    CSS: .sc { position:absolute; left:0; top:0; width:1080px; height:1920px; overflow:hidden; }
const sceneCut = (tl, prev, next, t, from, d = 0.5) => {
  tl.fromTo(next, from, { x: 0, y: 0, scale: 1, opacity: 1, duration: d, ease: 'power4.out', immediateRender: false }, t);
  tl.to(prev, { x: from.x ? -from.x * 0.25 : 0, y: from.y ? -from.y * 0.2 : 0, duration: d, ease: 'power4.out' }, t);
  tl.set(prev, { opacity: 0 }, t + d + 0.05);
};
// 6) Slow push-in on a scene container (camera feel): pushIn(tl, '#sc2', 2.5, 5.5)
const pushIn = (tl, sel, a, b, s = 1.05) => tl.fromTo(sel, { scale: 1 }, { scale: s, duration: b - a, ease: 'none', immediateRender: false }, a + 0.01);
