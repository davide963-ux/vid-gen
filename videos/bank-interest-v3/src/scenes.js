      const NO_CAPTION_LINES = [6];
      const hh = (i) => { const x = Math.sin(i * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
      const spr = (parent, id, name, w, x, y) => $(parent).insertAdjacentHTML('beforeend', `<img id="${id}" class="sp" src="assets/img/${name}.svg" style="left:${x}px;top:${y}px;width:${w}px" />`);
      // ---- scene containers wipe in (faster cuts: a new space every ~3 s)
      tl.set('#sc2', { x: 1080 }, 0); tl.set('#sc3', { y: 1920 }, 0); tl.set('#sc4', { x: -1080 }, 0); tl.set('#sc5', { x: 1080 }, 0); tl.set('#sc6', { scale: 1.5, opacity: 0 }, 0);
      const cut = (prev, next, t, from, d = 0.5) => {
        tl.fromTo(next, from, { x: 0, y: 0, scale: 1, opacity: 1, duration: d, ease: 'power4.out', immediateRender: false }, t);
        tl.to(prev, { x: from.x ? -from.x * 0.25 : 0, y: from.y ? -from.y * 0.2 : 0, duration: d, ease: 'power4.out' }, t);
        tl.set(prev, { opacity: 0 }, t + d + 0.05);
      };
      cut('#sc1', '#sc2', 2.45, { x: 1080 }); cut('#sc2', '#sc3', 5.4, { y: 1920 }); cut('#sc3', '#sc4', 8.62, { x: -1080 }); cut('#sc4', '#sc5', 11.5, { x: 1080 }); cut('#sc5', '#sc6', 14.95, { scale: 1.5, opacity: 0 }, 0.45);
      // slow push-in on every scene (camera feel)
      [['#sc1', 0, 2.6], ['#sc2', 2.5, 5.5], ['#sc4', 8.6, 11.6], ['#sc5', 11.5, 15.0]].forEach(([s, a, b]) => tl.fromTo(s, { scale: 1 }, { scale: 1.05, duration: b - a, ease: 'none', immediateRender: false }, a + 0.01));

      // ---- S1 hook: text AND the big coin are on screen at frame 1; coins rain behind
      hookNow(tl, ['#a1', '#a2', '#a3', '#a4']);
      tl.set('#bigcoin', { opacity: 1 }, 0);
      tl.fromTo('#bigcoin', { scaleX: 1 }, { scaleX: -1, duration: 0.55, ease: 'sine.inOut', yoyo: true, repeat: 4, immediateRender: false }, 0);
      tl.fromTo('#bigcoin', { y: 0 }, { y: -40, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 0);
      [[0.30, '#a1'], [0.86, '#a2'], [1.06, '#a3'], [1.54, '#a4']].forEach(([t, s]) => punch(tl, s, t, { scale: 1.07, dur: 0.14 }));
      for (let i = 0; i < 18; i++) {
        const el = 'rn' + i, w = 80 + hh(i) * 80; spr('#rain', el, i % 3 ? 'coin-dollar' : 'coin-dollar-accent', w, 20 + hh(i + 3) * 960, 0);
        const dur = 1.3 + hh(i + 7) * 0.8, t0 = hh(i + 11) * 0.9;
        for (let c = 0; c < 3; c++) tl.fromTo('#' + el, { y: -260, opacity: 1, rotation: -30 + hh(i) * 60 }, { y: 2100, rotation: 30 + hh(i + 2) * 120, duration: dur, ease: 'none', immediateRender: false }, t0 + c * dur);
      }

      // ---- S2 your deposit: coins drop into the safe
      const SAFEPT = [465, 640];                                            // where coins land on the safe (calibrated on a still)
      R('#safe', 2.55, { y: 80, scale: 0.9 }, { scale: 1, duration: 0.7, ease: 'back.out(1.4)' });
      maskReveal(tl, '#t2a', 2.62); maskReveal(tl, '#t2b', 3.12);
      const drops = [3.0, 3.4, 3.85, 4.25, 4.6];
      drops.forEach((t0, i) => {
        spr('#sc2', 'c2_' + i, i % 2 ? 'coin-dollar-accent' : 'coin-dollar', 150, SAFEPT[0] - 75 + (i - 2) * 22, -200);
        tl.fromTo('#c2_' + i, { opacity: 1, y: 0, rotation: -40 + i * 25 }, { y: SAFEPT[1] + 200, rotation: 120, duration: 0.5, ease: 'power2.in', immediateRender: false }, t0);
        tl.to('#c2_' + i, { opacity: 0, scale: 0.4, duration: 0.12 }, t0 + 0.46); punch(tl, '#safe', t0 + 0.48, { scale: 1.045, dur: 0.1 });
      });
      tl.to(['#t2a', '#t2b'], { opacity: 0, y: -70, duration: 0.2, ease: 'power2.in' }, 4.05);
      maskReveal(tl, '#t2c', 4.15); maskReveal(tl, '#t2d', 4.4);

      // ---- S3 lent out: 3D street + coins flying out
      tl.fromTo('#t3', { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)', immediateRender: false }, wd(3, 2) - 0.1);
      tl.fromTo('#p1', { opacity: 0, scale: 0.4, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, wd(3, 6) - 0.1);
      tl.fromTo('#p2', { opacity: 0, scale: 0.4, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, wd(3, 8) - 0.1);
      const tg = [[150, 1010], [880, 980], [170, 640], [860, 600], [540, 560], [540, 1130]];
      tg.forEach(([tx, ty], i) => {
        const t0 = 5.85 + i * 0.28; spr('#sc3', 'c3_' + i, i % 2 ? 'coin-dollar' : 'coin-dollar-accent', 150, 465, 1500);
        tl.fromTo('#c3_' + i, { opacity: 1, x: 0, rotation: 0 }, { x: tx - 465, rotation: 360, duration: 1.0, ease: 'none', immediateRender: false }, t0);
        tl.fromTo('#c3_' + i, { y: 0 }, { y: ty - 1500 - 260, duration: 0.5, ease: 'power2.out', immediateRender: false }, t0); tl.to('#c3_' + i, { y: ty - 1500, duration: 0.5, ease: 'power2.in' }, t0 + 0.5);
        tl.to('#c3_' + i, { opacity: 0, scale: 0.4, duration: 0.15 }, t0 + 1.0);
      });

      // ---- S4 interest: a % coin stamps onto the loan document
      R('#doc', 8.7, { y: 90, scale: 0.9 }, { scale: 1, duration: 0.7, ease: 'back.out(1.4)' });
      tl.fromTo('#t4a', { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)', immediateRender: false }, 8.78);
      maskReveal(tl, '#t4b', wd(4, 4) - 0.25);
      const BADGE = [500, 850];                                           // the % badge on the document (calibrated)
      spr('#sc4', 'c4', 'coin-pct-accent', 260, BADGE[0] - 130 + 250, -320);
      tl.fromTo('#c4', { opacity: 1, x: 0, y: 0, rotation: 200, scale: 1.2 }, { x: -250, y: BADGE[1] + 320 - 120, rotation: 0, scale: 0.7, duration: 0.5, ease: 'power2.in', immediateRender: false }, 9.5);
      tl.to('#c4', { opacity: 0, duration: 0.1 }, 10.0); punch(tl, '#doc', 10.0, { scale: 1.06, dur: 0.12 });
      R('#t4c', wd(4, 6) - 0.1, { scale: 0.6 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' });
      for (let i = 0; i < 4; i++) {
        spr('#sc4', 'c4r_' + i, i % 2 ? 'coin-dollar' : 'coin-dollar-accent', 110, 250 + i * 190, 1180);
        tl.fromTo('#c4r_' + i, { opacity: 0, y: 0, rotation: 0 }, { opacity: 1, y: -280 - hh(i) * 120, rotation: 140, duration: 0.8, ease: 'power2.out', immediateRender: false }, 10.35 + i * 0.18); tl.to('#c4r_' + i, { opacity: 0, duration: 0.2 }, 11.1 + i * 0.1);
      }

      // ---- S5 the difference: pie slice pulls out
      R('#pbase', 11.6, { y: 80, scale: 0.9 }, { scale: 1, duration: 0.7, ease: 'back.out(1.4)' });
      R('#pslice', 11.6, { y: 80, scale: 0.9 }, { scale: 1, duration: 0.7, ease: 'back.out(1.4)' });
      tl.fromTo('#t5a', { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, 11.62);
      maskReveal(tl, '#t5b', wd(5, 4) - 0.12);
      tl.fromTo('#k1', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, wd(5, 2));
      tl.to('#pslice', { x: 55, y: -85, rotation: 5, duration: 0.55, ease: 'back.out(1.8)' }, wd(5, 6));
      tl.fromTo('#k2', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, wd(5, 8));
      punch(tl, '#pbase', wd(5, 3), { scale: 1.04 }); heartbeat(tl, '#pbase', 12.6, 14.9, { scale: 1.03 });

      // ---- S6 ending
      maskReveal(tl, '#e1', 15.22); maskReveal(tl, '#e2', wd(6, 3) - 0.1);
      for (let i = 0; i < 10; i++) {
        const el = 'r6_' + i; spr('#rain6', el, i % 2 ? 'coin-dollar' : 'coin-dollar-accent', 90 + hh(i + 20) * 60, 30 + hh(i + 31) * 960, 0);
        const dur = 1.9 + hh(i + 5) * 1.2, t0 = 15.3 + hh(i + 9) * 1.2;
        for (let c = 0; c < 3; c++) tl.fromTo('#' + el, { y: -240, opacity: 1, rotation: -20 }, { y: 2100, rotation: 100, duration: dur, ease: 'none', immediateRender: false }, t0 + c * dur);
      }
      tl.fromTo('#conf', { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, 17.1); tl.to('#conf', { opacity: 0, duration: 0.01 }, 19.9);
      const lot = lottie.loadAnimation({ container: document.getElementById('conf'), renderer: 'svg', loop: false, autoplay: false, path: 'assets/lottie/confetti-s.json', rendererSettings: { preserveAspectRatio: 'xMidYMid meet' } }); (window.__hfLottie = window.__hfLottie || []).push(lot);
