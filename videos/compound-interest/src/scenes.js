      const NO_CAPTION_LINES = [5];
      // rule 1: hook text AND the first illustration are on screen at frame 1
      hookNow(tl, ['#hk1', '#hk2', '#ca']);
      ['#hk1', '#hk2'].forEach((s) => tl.to(s, { opacity: 0, y: -40, duration: 0.3, ease: 'power2.in' }, 2.0));
      // 1 deposit
      R('#ch1', wd(2, 0) - 0.05, {}, { duration: 0.4 });
      punch(tl, '#ca', wd(2, 6), { scale: 1.05 });
      X('#ch1', 4.7, 0.2);
      // 2 interest on the deposit (card B)
      tl.to('#ca', { opacity: 0, x: -30, duration: 0.4, ease: 'power2.in' }, 4.65);
      tl.fromTo('#cb', { opacity: 0, x: 30, y: 0 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, 4.75);
      R('#ch2', wd(3, 0), {}, { duration: 0.4 });
      punch(tl, '#cb', wd(3, 3), { scale: 1.05 });
      punch(tl, '#cb', wd(3, 6), { scale: 1.05 });
      X('#ch2', 7.4, 0.2);
      // 3 snowball (card C)
      tl.to('#cb', { opacity: 0, x: -30, duration: 0.4, ease: 'power2.in' }, 7.35);
      tl.fromTo('#cc', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, 7.45);
      R('#ch3', wd(4, 0) - 0.1, {}, { duration: 0.4 });
      maskReveal(tl, '#sn', wd(4, 3) - 0.15);
      heartbeat(tl, '#cc', 8.0, 9.4, { scale: 1.04 });
      ['#cc', '#ch3', '#sn'].forEach((s) => X(s, 9.45, 0.3));
      // ending
      maskReveal(tl, '#e1', 9.62); maskReveal(tl, '#e2', wd(5, 3) - 0.1);
      tl.fromTo('#conf', { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, 10.8); tl.to('#conf', { opacity: 0, duration: 0.01 }, 12.6);
      const lot = lottie.loadAnimation({ container: document.getElementById('conf'), renderer: 'svg', loop: false, autoplay: false, path: 'assets/lottie/confetti-s.json', rendererSettings: { preserveAspectRatio: 'xMidYMid meet' } }); (window.__hfLottie = window.__hfLottie || []).push(lot);
