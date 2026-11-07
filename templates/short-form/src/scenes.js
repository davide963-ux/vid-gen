      // Example scenes. Replace with the video's own. Available: tl, wd(line, wordIndex), R, X, STRIKE, POP/POPTO, add, count, $, and the helpers:
      //   hookNow(tl, [sels])  maskReveal(tl, sel, t) / maskHide  punch(tl, sel, t)  heartbeat(tl, sel, from, to)
      // Optional: const NO_CAPTION_LINES = [lastLineNumber];   (hide the caption on the final card)
      const NO_CAPTION_LINES = [];
      hookNow(tl, ['#hk1', '#hk2']);                                   // rule 1: hook text is on screen at frame 1
      ['#hk1', '#hk2'].forEach((s) => tl.to(s, { opacity: 0, y: -40, duration: 0.3, ease: 'power2.in' }, 2.0));
      // rule 3: a visual change every 2-4 s (uneven); use punch()/heartbeat() on holds longer than ~4 s
      // rule 4: mid-video headlines use maskReveal
      maskReveal(tl, '#e1', 3.0); maskReveal(tl, '#e2', 3.4);
      const lastEnd = WORDS[WORDS.length - 1].e;
      tl.fromTo('#conf', { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, 3.6); tl.to('#conf', { opacity: 0, duration: 0.01 }, 5.6);
      const lot = lottie.loadAnimation({ container: document.getElementById('conf'), renderer: 'svg', loop: false, autoplay: false, path: 'assets/lottie/confetti-s.json', rendererSettings: { preserveAspectRatio: 'xMidYMid meet' } }); (window.__hfLottie = window.__hfLottie || []).push(lot);
