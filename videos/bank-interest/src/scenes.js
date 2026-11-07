      const NO_CAPTION_LINES = [6];
      const swap = (from, to, t) => { tl.to(from, { opacity: 0, x: -30, duration: 0.35, ease: 'power2.in' }, t - 0.1); tl.fromTo(to, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, t); };
      // rule 1: hook text and the first illustration are on screen at frame 1
      hookNow(tl, ['#hk1', '#hk2', '#ca']);
      ['#hk1', '#hk2'].forEach((s) => tl.to(s, { opacity: 0, y: -40, duration: 0.3, ease: 'power2.in' }, 2.3));
      // 1 your deposit
      maskReveal(tl, '#hd2', wd(2, 3) - 0.1);
      R('#ch1', wd(2, 0), {}, { duration: 0.4 });
      punch(tl, '#ca', wd(2, 2), { scale: 1.05 });
      ['#ch1', '#hd2'].forEach((s) => X(s, 5.4, 0.25));
      // 2 lent out
      swap('#ca', '#cb', 5.55);
      maskReveal(tl, '#hd3', wd(3, 2) - 0.1);
      R('#ch2', wd(3, 0), {}, { duration: 0.4 });
      punch(tl, '#cb', wd(3, 6), { scale: 1.05 });
      ['#ch2', '#hd3'].forEach((s) => X(s, 8.55, 0.25));
      // 3 the loan pays interest
      swap('#cb', '#cc', 8.7);
      R('#ch3', wd(4, 0), {}, { duration: 0.4 });
      punch(tl, '#cc', wd(4, 4), { scale: 1.06 });
      punch(tl, '#cc', wd(4, 7), { scale: 1.05 });
      X('#ch3', 11.5, 0.25);
      // 4 the difference
      swap('#cc', '#cd', 11.6);
      maskReveal(tl, '#hd4', wd(5, 3) - 0.1);
      R('#ch4', wd(5, 5), {}, { duration: 0.4 });
      heartbeat(tl, '#cd', 12.4, 15.0, { scale: 1.04 });
      ['#cd', '#ch4', '#hd4'].forEach((s) => X(s, 15.05, 0.3));
      // ending
      maskReveal(tl, '#e1', 15.25); maskReveal(tl, '#e2', wd(6, 3) - 0.1);
      tl.fromTo('#conf', { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, 17.1); tl.to('#conf', { opacity: 0, duration: 0.01 }, 19.9);
      const lot = lottie.loadAnimation({ container: document.getElementById('conf'), renderer: 'svg', loop: false, autoplay: false, path: 'assets/lottie/confetti-s.json', rendererSettings: { preserveAspectRatio: 'xMidYMid meet' } }); (window.__hfLottie = window.__hfLottie || []).push(lot);
