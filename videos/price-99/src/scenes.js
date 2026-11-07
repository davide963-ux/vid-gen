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

      // ---------- ambient layer: gold dust + flash (3D tag / digit blocks / 1¢ coin / dim coins live in src/modules.html, canvas #gl) ----------
      const TOTAL = 72.58;
      for (let i = 0; i < 14; i++) {
        const sz = 4 + hashH(i + 3) * 7, x = 20 + hashH(i + 11) * 1040, sp = 70 + hashH(i + 5) * 90, y0 = hashH(i + 7) * 1900;
        dyn.insertAdjacentHTML('beforeend', `<div id="pt${i}" class="pt" style="left:${x}px;top:0;width:${sz}px;height:${sz}px;opacity:${(0.14 + hashH(i + 9) * 0.22).toFixed(2)}"></div>`);
        const first = (y0 + 80) / sp, cyc = 2000 / sp;
        tl.fromTo('#pt' + i, { y: y0 }, { y: -80, duration: first, ease: 'none' }, 0);
        tl.fromTo('#pt' + i, { y: 1960 }, { y: -80, duration: cyc, ease: 'none', repeat: Math.ceil((TOTAL - first) / cyc), immediateRender: false }, first);
      }
      dyn.insertAdjacentHTML('beforeend', '<div id="flash"></div>');
      const flash = (t, a = 0.5) => tl.fromTo('#flash', { opacity: a }, { opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t);
      const START = [0, 6.4, 8.04, 12.36, 15.86, 21.3, 22.62, 24.32, 26.78, 32.94, 35.9, 40.94, 44.06, 50.32, 52.16, 55.52, 60.66, 65.96, 69.18];
      const B = (n, o, t1, t0) => { const i = parseInt(n, 10); return beat(n, t0 !== undefined ? t0 : i === 1 ? 0 : START[i - 1] - 0.1, t1 || (i === 19 ? 72.2 : START[i] - 0.1), o); };
      const tagHTML = (price, x, y, at, P, rot = 0) => { const id = P.el('ptag abs', x, y, 260, 330, `<div class="hole"></div><div class="pv">${price}</div>`, at); tl.fromTo(id, { rotation: -rot }, { rotation: rot, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: 6 }, at + 0.4); return id; };

      // 1 hook: 3D hanging price tag
      { B(1, { eyebrow: 'WHAT IF I TOLD YOU', rows: [['ONE CENT', G, 170], ['CAN TRICK YOUR BRAIN', W, 62]] }); }
      // 2 sounds ridiculous
      { const P = B(2, { rows: [['SOUNDS', W, 140], ['RIDICULOUS?', G, 120]], top: 260 });
        P.el('abs', 320, 820, 440, 440, IMG('question', 0, 0, 440), 6.55); }
      // 3 so many prices end in 99
      { const P = B(3, { eyebrow: 'THERE’S A REASON SO MANY', rows: [['PRICES END IN', W, 100], ['99', G, 230]] });
        tagHTML('$4<b>.99</b>', 90, 900, 8.5, P, 3); tagHTML('$9<b>.99</b>', 410, 900, 8.9, P, 3); tagHTML('$29<b>.99</b>', 730, 900, 9.3, P, 3); }
      // 4 a shirt for $20 (3D tag shows $20.00)
      { B(4, { eyebrow: 'IMAGINE A SHIRT FOR', rows: [['$20', G, 230]] }); }
      // 5 same shirt $19.99 (tag flips)
      { const P = B(5, { eyebrow: 'NOW THE SAME SHIRT COSTS', rows: [['$19.99', G, 200]] }); flash(wd(5, 6) - 0.1, 0.25); }
      // 6 the difference?
      { B(6, { eyebrow: 'THE', rows: [['DIFFERENCE?', G, 130]], top: 300 }); }
      // 7 just one cent (3D 1c coin)
      { const P = B(7, { eyebrow: 'JUST', rows: [['ONE CENT', G, 170]] }); chip(P, '$20.00 − $19.99 = $0.01', 180, 1300, wd(7, 2) - 0.1, 'tagc fill'); flash(22.7, 0.3); }
      // 8 your brain plays tricks
      { const P = B(8, { eyebrow: 'BUT HERE’S WHERE', rows: [['YOUR BRAIN', W, 130], ['PLAYS TRICKS', G, 120]] });
        for (let i = 0; i < 3; i++) { const r = P.el('ring2 abs', 340, 760, 400, 400, '', 24.9 + i * 0.4); tl.fromTo(r, { scale: 0.6, opacity: 0.5 }, { scale: 1.4, opacity: 0, duration: 1.4, ease: 'power1.out', repeat: 1, immediateRender: false }, 25.0 + i * 0.4); }
        P.el('abs', 390, 810, 300, 300, IMG('lightbulb', 0, 0, 300), 24.8); }
      // 9 focus on the first number (3D digit blocks)
      { const P = B(9, { eyebrow: 'WHEN YOU SEE $19.99 YOU FOCUS ON', rows: [['THE FIRST', W, 115], ['NUMBER', G, 115]] }); }
      // 10 you see 19 instead of 20
      { const P = B(10, { eyebrow: 'YOU SEE', rows: [['19', G, 230]] });
        const c = P.el('tagc fill abs', 440, 1290, 'auto', 'auto', 'NOT 20', wd(10, 3)); }
      // 11 feels cheaper
      { const P = B(11, { eyebrow: 'THE PRICE CAN FEEL', rows: [['MUCH CHEAPER', G, 120]] });
        P.el('uc abs', 120, 640, 840, 560, `${LAB('WHAT IT FEELS LIKE', 50, 40)}<div style="position:absolute;left:50px;top:95px;width:740px;height:70px;border-radius:20px;background:#4a3607"></div>${LAB('WHAT IT ACTUALLY COSTS', 50, 260)}<div style="position:absolute;left:50px;top:315px;width:740px;height:70px;border-radius:20px;background:#4a3607"></div>`, 36.3);
        const b1 = P.el('abs', 170, 735, 740, 70, '<div style="width:100%;height:100%;border-radius:20px;background:#e5ab33"></div>', 36.6, 'transform-origin:left center'), b2 = P.el('abs', 170, 955, 740, 70, '<div style="width:100%;height:100%;border-radius:20px;background:#e5ab33"></div>', 36.9, 'transform-origin:left center');
        tl.to(b1, { scaleX: 0.7, duration: 1.2, ease: 'power3.inOut' }, 38.2);
        chip(P, 'JUST 1¢ APART', 330, 1090, 38.9, 'tagc fill'); }
      // 12 psychological pricing
      { const P = B(12, { eyebrow: 'THIS IS CALLED', rows: [['PSYCHOLOGICAL', G, 100], ['PRICING', W, 150]] });
        P.el('uc abs', 270, 740, 540, 380, `${IMG('shopping-cart', 220, 60, 100)}${IMG('trend-up', 60, 60, 100)}${LAB('PRICE PSYCHOLOGY', 90, 230)}${VAL('99', 190, 270, 70, G)}`, 41.3); }
      // 13 decades, influences what customers buy
      { const P = B(13, { eyebrow: 'BUSINESSES HAVE USED IT FOR', rows: [['DECADES', G, 170]] });
        P.el('uc abs', 100, 640, 380, 330, `${IMG('calendar', 130, 50, 120)}${LAB('DECADES', 105, 200)}${VAL('A STRATEGY', 70, 250, 44, W)}`, 44.9);
        P.el('abs', 500, 760, 80, 80, IMG('trend-up', 0, 0, 80), wd(13, 8));
        const u = P.el('uc gold abs', 600, 640, 380, 330, `${IMG('shopping-cart-k', 130, 50, 120)}${LAB('WHAT YOU BUY', 85, 200)}${VAL('INFLUENCED', 60, 250, 44, K)}`, wd(13, 11) - 0.1); P.pulse(u, wd(13, 12)); }
      // 14 funny part
      { const P = B(14, { eyebrow: 'AND HERE’S', rows: [['THE FUNNY', W, 130], ['PART', G, 170]], top: 280 }); P.el('abs', 390, 900, 300, 300, IMG('sparkle', 0, 0, 300), 50.6); }
      // 15 even when you know the trick it works
      { const P = B(15, { eyebrow: 'EVEN WHEN YOU KNOW THE TRICK', rows: [['IT CAN STILL', W, 115], ['WORK ON YOU', G, 115]] });
        P.el('uc abs', 120, 700, 840, 200, `${IMG('check-circle', 40, 40, 120)}${VAL('YOU KNOW THE TRICK', 190, 70, 56, W)}`, 52.7);
        P.el('uc gold abs', 120, 940, 840, 200, `${IMG('warning', 40, 40, 120)}${VAL('IT STILL WORKS', 190, 70, 56, K)}`, wd(15, 8)); }
      // 16 next time $9.99 (3D tag)
      { B(16, { eyebrow: 'NEXT TIME YOU SEE SOMETHING PRICED AT', rows: [['$9.99', G, 230]] }); }
      // 17 the missing penny (3D coin)
      { const P = B(17, { eyebrow: 'THAT MISSING PENNY', rows: [['ISN’T THERE TO', W, 100], ['SAVE YOU MONEY', G, 100]] });
        chip(P, 'PROBABLY NOT SAVINGS', 270, 1300, wd(17, 5), 'tagc fill'); }
      // 18 it's there to make you feel you spend less
      { const P = B(18, { eyebrow: 'IT’S THERE TO MAKE YOU FEEL LIKE', rows: [['YOU’RE SPENDING', W, 100], ['LESS', G, 230]] });
        tagHTML('$9<b>.99</b>', 410, 900, 66.4, P, 4); chip(P, '▼ FEELS CHEAPER', 300, 1260, wd(18, 8), 'tagc fill'); }
      // 19 end
      { const P = B(19, { rows: [['YOU DIDN’T KNOW', W, 104], ['THAT ABOUT MONEY!', G, 104]], top: 960 }); flash(69.5, 0.3); }
