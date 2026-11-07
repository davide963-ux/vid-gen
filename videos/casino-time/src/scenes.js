      // Explainer-UI style (like inflation / bill-value): eyebrow + big headline + drawn UI cards with Phosphor icons, black and gold. No emoji, no characters.
      const NO_CAPTION_LINES = [19];
      const W = '#fffdf6', G = '#e5ab33', K = '#0a0a0a';
      const dyn = document.getElementById('dyn');
      let U = 0;
      const IMG = (n, x, y, s) => `<img src="assets/img/${n}.svg" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px" />`;
      const LAB = (s, x, y) => `<div class="lab" style="left:${x}px;top:${y}px">${s}</div>`;
      const VAL = (s, x, y, size, c) => `<div class="val" style="left:${x}px;top:${y}px;font-size:${size}px;${c ? 'color:' + c : ''}">${s}</div>`;
      function beat(n, t0, t1, o) {
        const out = t1 - 0.22;
        const P = {
          el(cls, l, t, w, h, html, at, style = '') {
            at = Math.min(at, Math.max(0, out - 0.4));                       // never schedule an entrance after the scene's own exit (would leave it stuck on screen)
            const id = `u${U++}`;
            dyn.insertAdjacentHTML('beforeend', `<div id="${id}" class="${cls}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;${style}">${html}</div>`);
            if (at === 0) tl.set('#' + id, { opacity: 1 }, 0); else tl.fromTo('#' + id, { opacity: 0, y: 70, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)', immediateRender: false }, at);
            tl.to('#' + id, { opacity: 0, y: -30, duration: 0.2, ease: 'power2.in' }, out);
            return '#' + id;
          },
          grow(sel, at, d = 0.9) { tl.fromTo(sel, { scaleX: 0 }, { scaleX: 1, duration: d, ease: 'power3.out', immediateRender: false }, at); },
          pulse(sel, at) { punch(tl, sel, at, { scale: 1.06 }); },
        };
        if (o.eyebrow) {
          const id = `e${n}`;
          dyn.insertAdjacentHTML('beforeend', `<div id="${id}" class="abs tag" style="left:0;top:150px;width:1080px">${o.eyebrow}</div>`);
          if (n === 1) hookNow(tl, ['#' + id]); else tl.fromTo('#' + id, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, t0);
          tl.to('#' + id, { opacity: 0, duration: 0.2 }, out);
        }
        let y = o.top || 215;
        (o.rows || []).forEach(([s, c, sz], i) => {
          const id = `h${n}_${i}`;
          dyn.insertAdjacentHTML('beforeend', `<div id="${id}" class="abs big" style="left:0;top:${y}px;width:1080px;font-size:${sz}px;color:${c}">${s}</div>`);
          y += sz * 1.08;
          if (n === 1) hookNow(tl, ['#' + id]); else maskReveal(tl, '#' + id, t0 + 0.05 + i * 0.15);
          tl.to('#' + id, { opacity: 0, y: -40, duration: 0.2, ease: 'power2.in' }, out);
        });
        return P;
      }
      const creditCard = (P, l, t, w, at) => {
        const h = Math.round(w * 0.62), k = w / 780;
        return P.el('ccard abs', l, t, w, h, `<div class="chipx" style="left:${60 * k}px;top:${120 * k}px;transform:scale(${k});transform-origin:left top"></div><div class="val" style="left:${60 * k}px;top:${h - 160 * k}px;font-size:${52 * k}px">•••• •••• •••• 4821</div><div class="lab" style="left:${60 * k}px;top:${h - 90 * k}px;color:#3b2a05;font-size:${28 * k}px">CREDIT CARD</div>`, at);
      };
      const chip = (P, txt, l, t, at, cls = 'tagc') => P.el(cls + ' abs', l, t, 'auto', 'auto', txt, at);

      // ---------- ambient layer: gold dust + flash (3D wheel / slot / clock / chips / scale / dice live in src/modules.html, canvas #gl) ----------
      const TOTAL = 74.59;
      for (let i = 0; i < 12; i++) {
        const sz = 4 + hashH(i + 3) * 7, x = 20 + hashH(i + 11) * 1040, sp = 70 + hashH(i + 5) * 90, y0 = hashH(i + 7) * 1900;
        dyn.insertAdjacentHTML('beforeend', `<div id="pt${i}" class="pt" style="left:${x}px;top:0;width:${sz}px;height:${sz}px;opacity:${(0.14 + hashH(i + 9) * 0.22).toFixed(2)}"></div>`);
        const first = (y0 + 80) / sp, cyc = 2000 / sp;
        tl.fromTo('#pt' + i, { y: y0 }, { y: -80, duration: first, ease: 'none' }, 0);
        tl.fromTo('#pt' + i, { y: 1960 }, { y: -80, duration: cyc, ease: 'none', repeat: Math.ceil((TOTAL - first) / cyc), immediateRender: false }, first);
      }
      dyn.insertAdjacentHTML('beforeend', '<div id="flash"></div>');
      const flash = (t, a = 0.5) => tl.fromTo('#flash', { opacity: a }, { opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t);
      const START = [0, 6.06, 9.4, 12.98, 17.9, 20.34, 22.92, 25.52, 27.22, 32.64, 34.32, 40.42, 46.34, 50.06, 52.24, 56.34, 60.44, 65.56, 69.96];
      const B = (n, o, t1, t0) => { const i = parseInt(n, 10); return beat(n, t0 !== undefined ? t0 : i === 1 ? 0 : START[i - 1] - 0.1, t1 || (i === 19 ? 74.3 : START[i] - 0.1), o); };
      const mid = (P, txt, y, at, cls = 'tagc fill', w = 560) => P.el(cls + ' abs', (1080 - w) / 2, y, w, 64, `<div style="text-align:center;line-height:50px">${txt}</div>`, at);   // a chip centred on the frame

      // 1 hook: 3D roulette wheel
      { B(1, { eyebrow: 'WHAT IF I TOLD YOU', rows: [['CASINOS WANT YOU TO', W, 70], ['LOSE TRACK', G, 150], ['OF TIME… AND MONEY', W, 66]] }); }
      // 2 not an accident
      { B(2, { rows: [['NOT AN', W, 130], ['ACCIDENT', G, 150]], top: 270 }); flash(6.2, 0.3); }
      // 3 the inside of a casino (3D slot machine)
      { B(3, { eyebrow: 'THINK ABOUT THE LAST TIME YOU SAW', rows: [['THE INSIDE OF', W, 100], ['A CASINO', G, 150]] }); }
      // 4 bright lights, flashing slot machines
      { B(4, { eyebrow: 'BRIGHT LIGHTS', rows: [['FLASHING SLOT', W, 100], ['MACHINES', G, 140]] });
        [1, 3, 5, 8].forEach((k) => flash(wd(4, k), 0.22)); flash(16.7, 0.4); }
      // 5 something strange
      { const P = B(5, { eyebrow: 'BUT HAVE YOU NOTICED', rows: [['SOMETHING', W, 115], ['STRANGE?', G, 125]] });
        P.el('abs', 350, 820, 380, 380, IMG('question', 0, 0, 380), 18.3); }
      // 6 very few visible clocks (3D clock)
      { B(6, { eyebrow: 'MANY CASINOS HAVE', rows: [['VERY FEW', G, 120], ['VISIBLE CLOCKS', W, 95]] }); flash(wd(6, 4) + 0.1, 0.3); }
      // 7 no windows
      { const P = B(7, { eyebrow: 'AND SOME GAMING AREAS', rows: [['DON’T HAVE', W, 110], ['WINDOWS', G, 150]] });
        P.el('win abs', 350, 740, 380, 480, '<i style="left:0;right:0;top:50%;height:10px;margin-top:-5px"></i><i style="top:0;bottom:0;left:50%;width:10px;margin-left:-5px"></i><div style="position:absolute;left:34px;top:34px;width:132px;height:182px;border-radius:6px;background:linear-gradient(180deg,#3a2a0a,#17110a)"></div><div style="position:absolute;right:34px;top:34px;width:132px;height:182px;border-radius:6px;background:linear-gradient(180deg,#3a2a0a,#17110a)"></div><div style="position:absolute;left:34px;bottom:34px;width:132px;height:182px;border-radius:6px;background:linear-gradient(180deg,#2a1d07,#17110a)"></div><div style="position:absolute;right:34px;bottom:34px;width:132px;height:182px;border-radius:6px;background:linear-gradient(180deg,#2a1d07,#17110a)"></div>', 23.2);
        const x1 = P.el('abs', 290, 970, 500, 18, '<div style="width:100%;height:100%;border-radius:9px;background:#e5ab33;transform:rotate(55deg) scaleX(0.95)"></div>', wd(7, 4) + 0.1), x2 = P.el('abs', 290, 970, 500, 18, '<div style="width:100%;height:100%;border-radius:9px;background:#e5ab33;transform:rotate(-55deg) scaleX(0.95)"></div>', wd(7, 4) + 0.3);
        flash(wd(7, 4) + 0.12, 0.25); }
      // 8 why?
      { B(8, { rows: [['WHY?', G, 330]], top: 560 }); }
      // 9 less attention to time -> keep playing (wheel again)
      { const P = B(9, { eyebrow: 'THE LESS ATTENTION YOU PAY', rows: [['TO TIME', G, 150]] });
        mid(P, 'ATTENTION TO TIME ▼', 1240, wd(9, 7), 'tagc', 560); mid(P, 'EASIER TO KEEP PLAYING ▲', 1312, wd(9, 14) - 0.1, 'tagc fill', 700); }
      // 10 another trick
      { const P = B(10, { eyebrow: 'BUT HERE’S', rows: [['ANOTHER', W, 130], ['TRICK', G, 170]], top: 300 }); P.el('abs', 390, 880, 300, 300, IMG('sparkle', 0, 0, 300), 32.9); }
      // 11 chips or digital credits (3D chip stack)
      { const P = B(11, { eyebrow: 'INSTEAD OF HANDING OVER CASH', rows: [['CHIPS OR', W, 110], ['DIGITAL CREDITS', G, 92]] });
        mid(P, '✕ CASH EVERY TIME', 1240, wd(11, 4), 'tagc', 600); mid(P, '✓ CHIPS · DIGITAL CREDITS', 1312, wd(11, 12), 'tagc fill', 720); }
      // 12 $100 chip vs $100 bill (3D chip + bill)
      { const P = B(12, { eyebrow: 'SPENDING A $100 CHIP', rows: [['FEELS VERY', W, 110], ['DIFFERENT', G, 140]] });
        P.el('tagc fill abs', 150, 1230, 280, 66, '<div style="text-align:center;line-height:46px">$100 CHIP</div>', wd(12, 3)); P.el('tagc fill abs', 650, 1230, 280, 66, '<div style="text-align:center;line-height:46px">$100 BILL</div>', wd(12, 13)); }
      // 13 exactly the same value
      { const P = B(13, { eyebrow: 'EVEN THOUGH THE VALUE IS', rows: [['EXACTLY THE SAME', G, 100]] });
        P.el('abs', 440, 880, 200, 200, '<div class="val" style="left:0;width:200px;text-align:center;top:30px;font-size:190px;color:#e5ab33">=</div>', wd(13, 5)); flash(wd(13, 7), 0.25); }
      // 14 the important part
      { const P = B(14, { eyebrow: 'AND HERE’S', rows: [['THE IMPORTANT', W, 110], ['PART', G, 170]], top: 260 }); P.el('abs', 390, 900, 300, 300, IMG('warning', 0, 0, 300), 50.3); }
      // 15 mathematical advantage for the house (3D scale)
      { const P = B(15, { eyebrow: 'CASINO GAMES HAVE A', rows: [['MATHEMATICAL', G, 104], ['ADVANTAGE FOR THE HOUSE', W, 62]] });
        P.el('tagc abs', 160, 1290, 140, 64, '<div style="text-align:center;line-height:44px">YOU</div>', 53.4); P.el('tagc fill abs', 700, 1290, 250, 64, '<div style="text-align:center;line-height:44px">THE HOUSE</div>', wd(15, 10)); }
      // 16 expected to win
      { const P = B(16, { eyebrow: 'MEANING THAT OVER TIME', rows: [['THE CASINO IS', W, 100], ['EXPECTED TO WIN', G, 100]] });
        P.el('stamp abs', 190, 1000, 700, 160, '<div style="font-size:92px;line-height:140px">HOUSE EDGE</div>', wd(16, 8) + 0.1, 'rotate:-8deg'); flash(wd(16, 8) + 0.12, 0.3); }
      // 17 you think you're just having fun (3D dice)
      { B(17, { eyebrow: 'YOU MIGHT WALK IN THINKING', rows: [['YOU’RE JUST', W, 105], ['HAVING FUN…', G, 115]] }); }
      // 18 the whole environment is designed to keep you playing
      { B(18, { eyebrow: 'THE WHOLE PLACE IS DESIGNED TO', rows: [['ENCOURAGE YOU', W, 100], ['TO KEEP PLAYING', G, 100]] }); }
      // 19 end
      { B(19, { rows: [['YOU DIDN’T KNOW', W, 98], ['THAT ABOUT MONEY.', G, 98]], top: 960 }); flash(70.1, 0.3); }
