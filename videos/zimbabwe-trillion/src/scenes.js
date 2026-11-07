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

      // ---------- ambient layer: drifting gold particles + flash overlay ----------
      const TOTAL = 96.74;
      for (let i = 0; i < 26; i++) {
        const sz = 5 + hashH(i + 3) * 9, x = 20 + hashH(i + 11) * 1040, sp = 70 + hashH(i + 5) * 90, y0 = hashH(i + 7) * 1900;
        dyn.insertAdjacentHTML('beforeend', `<div id="pt${i}" class="pt" style="left:${x}px;top:0;width:${sz}px;height:${sz}px;opacity:${(0.18 + hashH(i + 9) * 0.3).toFixed(2)};filter:blur(${hashH(i) > 0.6 ? 2 : 0}px)"></div>`);
        const first = (y0 + 80) / sp, cyc = 2000 / sp;
        tl.fromTo('#pt' + i, { y: y0 }, { y: -80, duration: first, ease: 'none' }, 0);
        tl.fromTo('#pt' + i, { y: 1960 }, { y: -80, duration: cyc, ease: 'none', repeat: Math.ceil((TOTAL - first) / cyc), immediateRender: false }, first);
        tl.fromTo('#pt' + i, { x: 0 }, { x: (hashH(i + 2) - 0.5) * 60, duration: 4 + hashH(i + 8) * 3, ease: 'sine.inOut', yoyo: true, repeat: 20 }, 0);
      }
      dyn.insertAdjacentHTML('beforeend', '<div id="flash"></div>');
      const flash = (t, a = 0.6) => tl.fromTo('#flash', { opacity: a }, { opacity: 0, duration: 0.55, ease: 'power2.out', immediateRender: false }, t);

      const START = [0, 6.52, 13.58, 15.16, 20.18, 25.34, 32.62, 34.74, 42.68, 51.78, 57.12, 59.36, 65.04, 73.0, 78.98, 80.58, 85.42, 89.34, 93.6];
      const B = (n, o, t1, t0) => { const i = parseInt(n, 10); return beat(n, t0 !== undefined ? t0 : i === 1 ? 0 : START[i - 1] - 0.1, t1 || (i === 19 ? 96.5 : START[i] - 0.1), o); };
      const photo = (P, src, l, t, w, at, extra = '') => {
        const h = Math.round(w * 0.491);
        const id = P.el('photo abs', l, t, w, h, `<img src="assets/img/${src}" /><div class="shine"></div>${extra}`, at);
        tl.fromTo(id + ' .shine', { x: -w * 0.6 }, { x: w * 1.5, duration: 1.6, ease: 'power2.inOut', repeat: 6, repeatDelay: 1.4 }, at + 0.7);
        return id;
      };
      const digits = (P, n, l, t, step, at, firstOne) => { const ids = []; for (let i = 0; i < n; i++) ids.push(P.el('dg abs' + (firstOne && i === 0 ? ' one' : ''), l + i * step, t, 56, 84, firstOne && i === 0 ? '1' : '0', at(i))); return ids; };

      // 1 hook: the real note
      { const P = B(1, { eyebrow: 'DID YOU KNOW', rows: [['TRILLION-DOLLAR', W, 112], ['BANKNOTES', G, 150]] });
        const n = photo(P, 'note100t.jpg', 90, 650, 900, 0); hookNow(tl, [n]); tl.fromTo(n, { rotation: -4, y: 0 }, { rotation: 2.5, y: -18, duration: 5.4, ease: 'sine.inOut' }, 0);
        const ch = P.el('tagc fill abs', 150, 1210, 780, 80, '<div style="text-align:center;line-height:56px">A REAL ZIMBABWEAN BANKNOTE</div>', 0); hookNow(tl, [ch]); }
      // 2 trillionaire but groceries
      { const P = B(2, { eyebrow: 'WHAT IF', rows: [['YOU COULD BE', W, 115], ['A TRILLIONAIRE', G, 115]] });
        P.el('uc abs', 120, 640, 840, 290, `${IMG('money', 50, 45, 110)}${LAB('YOUR NET WORTH', 190, 50)}<div id="nw" class="val" style="left:50px;top:170px;font-size:78px;color:#e5ab33">$0</div>`, 7.3);
        count('#nw', 7.7, 0, 1e12, 2.8);
        const g = P.el('uc gold abs', 120, 990, 840, 250, `${IMG('shopping-cart-k', 50, 50, 130)}${LAB('BUT STRUGGLING TO BUY', 215, 56)}${VAL('GROCERIES', 215, 112, 84, K)}`, wd(2, 11) - 0.2); P.pulse(g, wd(2, 13)); }
      // 3 sounds crazy
      { const P = B(3, { rows: [['SOUNDS', W, 150], ['CRAZY?', G, 170]], top: 250 });
        P.el('abs', 290, 800, 500, 500, IMG('question', 0, 0, 500), 13.7); }
      // 4 Zimbabwe
      { const P = B(4, { eyebrow: 'THAT’S EXACTLY HOW BAD IT GOT IN', rows: [['ZIMBABWE', G, 170]] });
        for (let i = 0; i < 3; i++) { const r = P.el('ring2 abs', 340, 720, 400, 400, '', 15.8 + i * 0.5); tl.fromTo(r, { scale: 0.5, opacity: 0.6 }, { scale: 1.6, opacity: 0, duration: 1.8, ease: 'power1.out', repeat: 2, immediateRender: false }, 15.9 + i * 0.6); }
        P.el('uc abs', 340, 720, 400, 400, `${IMG('buildings', 100, 80, 200)}${LAB('SOUTHERN AFRICA', 62, 310)}`, 15.7); }
      // 5 2008 inflation chart
      { const P = B(5, { eyebrow: '2008', rows: [['EXTREME', W, 125], ['INFLATION', G, 150]] });
        P.el('uc abs', 100, 660, 880, 560, `${LAB('PRICES', 50, 40)}<svg viewBox="0 0 800 440" style="position:absolute;left:40px;top:90px;width:800px;height:440px"><defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5ab33" stop-opacity=".35"/><stop offset="1" stop-color="#e5ab33" stop-opacity="0"/></linearGradient></defs><path id="areaP" d="M10 430 C 200 425 380 400 520 320 S 700 90 790 20 L 790 440 L 10 440 Z" fill="url(#gA)" opacity="0"/><path id="curveP" d="M10 430 C 200 425 380 400 520 320 S 700 90 790 20" fill="none" stroke="#e5ab33" stroke-width="12" stroke-linecap="round"/><circle id="dotP" cx="790" cy="20" r="16" fill="#fffdf6" opacity="0"/></svg>`, 21.0);
        const cv = document.getElementById('curveP'), CL = cv.getTotalLength(); cv.style.strokeDasharray = CL; cv.style.strokeDashoffset = CL;
        tl.fromTo('#curveP', { strokeDashoffset: CL }, { strokeDashoffset: 0, duration: 3.2, ease: 'power2.in', immediateRender: false }, 21.9);
        tl.to('#areaP', { opacity: 1, duration: 1.2 }, 23.2); tl.fromTo('#dotP', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, svgOrigin: '790 20', duration: 0.4, ease: 'back.out(3)', immediateRender: false }, 25.0);
        chip(P, 'PRICES ▲▲▲', 360, 1260, 24.0, 'tagc fill'); }
      // 6 money lost value almost every day
      { const P = B(6, { eyebrow: 'PRICES ROSE SO FAST', rows: [['MONEY LOST VALUE', W, 95], ['ALMOST EVERY DAY', G, 95]] });
        P.el('uc abs', 120, 640, 840, 520, `${IMG('calendar', 50, 45, 130)}<div id="dayn" class="val" style="left:220px;top:60px;font-size:90px">DAY 1</div>${LAB('WHAT YOUR MONEY IS WORTH', 50, 230)}<div style="position:absolute;left:50px;top:300px;width:740px;height:80px;border-radius:22px;background:#4a3607"></div>`, 26.4);
        const o = { v: 1 }; tl.to(o, { v: 30, duration: 5.5, ease: 'none', onUpdate() { document.getElementById('dayn').textContent = 'DAY ' + Math.round(o.v); } }, 27.0);
        const bar = P.el('abs', 170, 940, 740, 80, '<div style="width:100%;height:100%;border-radius:22px;background:#e5ab33"></div>', 26.8, 'transform-origin:left center');
        tl.to(bar, { scaleX: 0.1, duration: 5.2, ease: 'power2.in' }, 27.2);
        chip(P, 'VALUE ▼', 400, 1240, 29.5, 'tagc fill'); }
      // 7 bread today $10
      { const P = B(7, { eyebrow: 'IMAGINE BUYING BREAD', rows: [['TODAY FOR', W, 100], ['$10', G, 250]] });
        const l = P.el('loaf abs', 330, 840, 420, 230, '<i style="left:110px"></i><i style="left:200px"></i><i style="left:290px"></i>', 33.0); tl.fromTo(l, { rotation: -4 }, { rotation: 4, duration: 1.6, ease: 'sine.inOut' }, 33.0);
        chip(P, 'BREAD · $10', 380, 1130, 33.6, 'tagc fill'); }
      // 8 hundreds, thousands, millions + framed notes pan
      { const P = B(8, { eyebrow: 'COMING BACK LATER, IT COSTS', rows: [] });
        [['HUNDREDS', 8], ['THOUSANDS', 9], ['MILLIONS', 12]].forEach(([s, k], i) => { const id = `w8_${i}`, at = wd(8, k) - 0.05, nxt = i < 2 ? wd(8, k + 1 + (i === 0 ? 0 : 2)) : 42.5;
          dyn.insertAdjacentHTML('beforeend', `<div id="${id}" class="abs big" style="left:0;top:270px;width:1080px;font-size:${i === 2 ? 170 : 150}px;color:#e5ab33">${s}</div>`);
          tl.fromTo('#' + id, { opacity: 0, scale: 1.6, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.8)', immediateRender: false }, at);
          tl.to('#' + id, { opacity: 0, y: -30, duration: 0.18 }, i < 2 ? nxt - 0.12 : 42.4); });
        const fr = P.el('frame abs', 160, 560, 760, 640, '<img src="assets/img/notes-framed.jpg" id="nfimg" />', 35.6);
        tl.fromTo('#nfimg', { y: 0 }, { y: -(760 * 1.805 - 640), duration: 6.0, ease: 'power1.inOut', immediateRender: false }, 36.0);
        P.el('lab abs', 190, 1225, 'auto', 'auto', 'Photo: TCCOVGLAM · CC BY-SA 4.0 · Wikimedia Commons', 36.2, 'font-size:22px;letter-spacing:.04em;text-transform:none'); }
      // 9a printing the notes
      { const P = B('9a', { eyebrow: 'ZIMBABWE PRINTED A BANKNOTE', rows: [['WORTH…', G, 190]] }, 47.55);
        P.el('abs', 390, 760, 300, 300, IMG('printer', 0, 0, 300), 43.4);
        for (let i = 0; i < 5; i++) { const m = P.el('uc gold abs', 340, 1020, 400, 170, `<div class="ring" style="position:absolute;left:150px;top:35px;width:100px;height:100px;border-radius:50%;border:5px solid rgba(10,10,10,.5)"></div>`, 44.0 + i * 0.7, 'padding:0'); tl.fromTo(m, { y: 0, rotation: 0 }, { y: 120, rotation: (i % 2 ? 6 : -6), duration: 0.6, ease: 'power2.in' }, 44.35 + i * 0.7); } }
      // 9b the 100 trillion reveal
      { const P = B('9b', { eyebrow: 'ONE HUNDRED', rows: [['100 TRILLION', G, 128], ['DOLLARS', W, 128]], top: 270 }, 51.65, 47.6);
        flash(wd(9, 11) - 0.05, 0.7);
        const r = P.el('rays abs', -160, 600, 1400, 1400, '', wd(9, 11)); tl.to(r, { rotation: 180, duration: 5, ease: 'none' }, wd(9, 11));
        const n = photo(P, 'note100t.jpg', 90, 820, 900, wd(9, 11) + 0.15); tl.fromTo(n, { rotation: 5 }, { rotation: -2.5, duration: 4, ease: 'sine.inOut' }, wd(9, 11) + 0.2); }
      // 10 a one followed by fourteen zeros
      { const P = B(10, { eyebrow: 'A ONE FOLLOWED BY', rows: [['FOURTEEN ZEROS', G, 110]] });
        const ids = digits(P, 15, 64, 700, 60, (i) => i === 0 ? wd(10, 2) : 54.2 + i * 0.14, true);
        const o = { v: 0 }; P.el('uc abs', 330, 880, 420, 200, '<div id="zc" class="val" style="left:0;width:420px;text-align:center;top:30px;font-size:130px;color:#e5ab33">0</div><div class="lab" style="left:0;width:420px;text-align:center;top:160px">ZEROS</div>', 54.0);
        tl.to(o, { v: 14, duration: 14 * 0.14, ease: 'none', onUpdate() { document.getElementById('zc').textContent = Math.round(o.v); } }, 54.34); }
      // 11 shocking part
      { const P = B(11, { eyebrow: 'BUT HERE’S THE', rows: [['SHOCKING', W, 135], ['PART', G, 170]], top: 300 });
        const w = P.el('abs', 340, 880, 400, 400, IMG('warning', 0, 0, 400), 57.5); tl.fromTo(w, { rotation: -6 }, { rotation: 6, duration: 0.18, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 57.9); }
      // 12 not rich
      { const P = B(12, { eyebrow: 'A 100-TRILLION-DOLLAR NOTE', rows: [['DIDN’T MAKE', W, 125], ['YOU RICH', G, 150]] });
        const n = photo(P, 'note100t.jpg', 170, 700, 740, 60.4); tl.to(n, { opacity: 0.55, duration: 0.3 }, wd(12, 4));
        const s = P.el('stamp abs', 200, 840, 680, 170, '<div style="font-size:110px;line-height:150px">NOT RICH</div>', wd(12, 4) + 0.1, 'transform-origin:center;rotate:-9deg');
        flash(wd(12, 4) + 0.12, 0.35); }
      // 13 little purchasing power
      { const P = B(13, { eyebrow: 'THAT ENORMOUS NUMBER HAD', rows: [['VERY LITTLE', W, 120], ['BUYING POWER', G, 120]] });
        P.el('uc abs', 120, 660, 840, 560, `${LAB('NUMBER ON THE NOTE', 50, 40)}<div style="position:absolute;left:50px;top:95px;width:740px;height:70px;border-radius:20px;background:#4a3607"></div>${IMG('shopping-cart', 50, 245, 100)}${LAB('WHAT IT CAN BUY', 170, 250)}<div style="position:absolute;left:50px;top:380px;width:740px;height:70px;border-radius:20px;background:#4a3607"></div>`, 66.0);
        const b1 = P.el('abs', 170, 755, 740, 70, '<div style="width:100%;height:100%;border-radius:20px;background:#e5ab33"></div>', 66.3, 'transform-origin:left center');
        const b2 = P.el('abs', 170, 1040, 740, 70, '<div style="width:100%;height:100%;border-radius:20px;background:#e5ab33"></div>', 67.0, 'transform-origin:left center');
        tl.to(b2, { scaleX: 0.05, duration: 1.4, ease: 'power3.inOut' }, 69.2);
        chip(P, 'VERY LITTLE', 380, 1250, 70.0, 'tagc fill'); }
      // 14 abandoned in 2009
      { const P = B(14, { eyebrow: '2009', rows: [['ZIMBABWE ABANDONED', W, 86], ['ITS CURRENCY', G, 125]] });
        const n = photo(P, 'note100t.jpg', 170, 700, 740, 74.0); tl.to(n, { filter: 'grayscale(1) brightness(0.55)', duration: 0.6 }, wd(14, 2) + 0.2);
        const s = P.el('stamp abs', 190, 820, 700, 170, '<div style="font-size:96px;line-height:150px">ABANDONED</div>', wd(14, 2) + 0.4, 'rotate:-8deg');
        flash(wd(14, 2) + 0.42, 0.3); }
      // 15 lesson
      { const P = B(15, { eyebrow: 'AND HERE’S', rows: [['THE LESSON', G, 150]], top: 330 });
        P.el('abs', 340, 780, 400, 400, IMG('note', 0, 0, 400), 79.2); }
      // 16 huge number != wealth
      { const P = B(16, { eyebrow: 'A HUGE NUMBER ON A BANKNOTE', rows: [['DOESN’T MEAN', W, 115], ['YOU’RE WEALTHY', G, 105]] });
        P.el('uc abs', 100, 680, 880, 330, `${IMG('money', 50, 45, 110)}${LAB('NUMBER ON THE NOTE', 190, 50)}<div id="bn" class="val" style="left:50px;top:190px;font-size:66px;color:#e5ab33">$0</div>`, 81.4);
        count('#bn', 81.8, 0, 1e14, 2.0);
        const c = P.el('uc gold abs', 220, 1060, 640, 170, `${IMG('prohibit', 30, 20, 130)}${VAL('≠ WEALTH', 190, 45, 80, K)}`, 83.4); P.pulse(c, 84.1); }
      // 17 money isn't about zeros
      { const P = B(17, { eyebrow: 'MONEY ISN’T ABOUT', rows: [['HOW MANY ZEROS', W, 105], ['YOU HAVE', G, 130]] });
        const ids = digits(P, 10, 130, 760, 80, (i) => 85.9 + i * 0.12, false);
        ids.forEach((id, i) => tl.to(id, { y: 220 + hashH(i + 40) * 90, opacity: 0, rotation: (i % 2 ? 1 : -1) * (14 + hashH(i) * 20), duration: 0.5, ease: 'power2.in' }, 87.3 + i * 0.12)); }
      // 18 it's about what they can buy
      { const P = B(18, { eyebrow: 'IT’S ABOUT WHAT THEY CAN', rows: [['ACTUALLY BUY', G, 135]] });
        const l = P.el('loaf abs', 120, 760, 400, 220, '<i style="left:100px"></i><i style="left:190px"></i><i style="left:280px"></i>', 90.0);
        P.el('uc abs', 560, 740, 400, 250, `${IMG('shopping-cart', 140, 40, 120)}${LAB('GROCERIES', 108, 190)}`, 90.6);
        chip(P, '✓ BREAD', 170, 1030, 91.4, 'tagc fill'); chip(P, '✓ FOOD', 650, 1030, 91.9, 'tagc fill'); }
      // 19 end
      { const P = B(19, { rows: [['YOU DIDN’T KNOW', W, 104], ['THAT ABOUT MONEY.', G, 104]], top: 820 });
        P.el('abs', 340, 380, 400, 400, IMG('coins', 0, 0, 400), 93.8); flash(94.0, 0.3); }
