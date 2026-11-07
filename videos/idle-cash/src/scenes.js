      // Explainer-UI style (like inflation / bill-value): eyebrow + big headline + drawn UI cards with Phosphor icons, black and gold. No emoji, no characters.
      const NO_CAPTION_LINES = [22];
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
            tl.fromTo('#' + id, { opacity: 0, y: 70, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)', immediateRender: false }, at);
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

      const bill = (P, l, t, w, at, amt = '$1,000') => {
        const h = Math.round(w * 0.48), r = Math.round(h * 0.62);
        return P.el('bill abs', l, t, w, h, `<div class="ring" style="left:${(w - r) / 2}px;top:${(h - r) / 2}px;width:${r}px;height:${r}px;font-size:${r * 0.34}px">${amt}</div><div class="val" style="left:${w * 0.05}px;top:${h * 0.1}px;font-size:${h * 0.16}px;color:#3b2a05">$</div><div class="val" style="right:${w * 0.05}px;bottom:${h * 0.1}px;font-size:${h * 0.16}px;color:#3b2a05">$</div>`, at);
      };
      const L = (n) => LINES_T[n - 1];                       // [start, end] of narration line n
      const LINES_T = [[0.3, 4.2], [5.1, 10.27], [11.07, 12.84], [13.64, 18.65], [19.35, 21.61], [22.31, 25.32], [26.02, 27.58], [28.28, 32.31], [33.11, 38.02], [38.72, 47.63], [48.43, 50.03], [50.63, 52.3], [53.1, 55.21], [55.91, 59.45], [60.25, 64.26], [65.06, 70.16], [70.86, 72.91], [73.51, 75.56], [76.36, 77.85], [78.55, 81.96], [82.56, 86.23], [87.13, 88.92]];
      const B = (n, o) => beat(n, n === 1 ? 0 : L(n)[0] - 0.1, n === 22 ? 91.5 : L(n + 1)[0] - 0.1, o);

      // 1 hook
      { const P = B(1, { eyebrow: 'DID YOU KNOW', rows: [['YOUR MONEY', W, 135], ['LOSES VALUE', G, 135]] });
        const b = bill(P, 140, 650, 800, 0); hookNow(tl, [b]); tl.fromTo(b, { rotation: -4 }, { rotation: 3, duration: 4.5, ease: 'sine.inOut' }, 0);
        const ch = P.el('tagc fill abs', 190, 1190, 700, 80, '<div style="text-align:center;line-height:56px">WHILE SITTING STILL</div>', 0); hookNow(tl, [ch]); }
      // 2 nothing -> worth less
      { const P = B(2, { eyebrow: 'WHAT IF', rows: [['DOING NOTHING', W, 105], ['MAKES IT', W, 105], ['WORTH LESS?', G, 125]] });
        P.el('uc abs', 120, 700, 840, 330, `${IMG('money', 50, 50, 110)}${LAB('WHAT YOUR MONEY IS WORTH', 190, 54)}<div style="position:absolute;left:50px;top:200px;width:740px;height:70px;border-radius:20px;background:#4a3607"></div>`, 6.4);
        const bar = P.el('abs', 170, 900, 740, 70, '<div style="width:100%;height:100%;border-radius:20px;background:#e5ab33"></div>', 7.2, 'transform-origin:left center');
        tl.to(bar, { scaleX: 0.55, duration: 1.2, ease: 'power2.inOut' }, 9.0); P.pulse(bar, 10.3); }
      // 3 impossible
      { const P = B(3, { rows: [['SOUNDS', W, 150], ['IMPOSSIBLE?', G, 140]], top: 250 });
        P.el('abs', 290, 800, 500, 500, IMG('question', 0, 0, 500), 11.2); }
      // 4 drawer
      { const P = B(4, { eyebrow: 'IMAGINE', rows: [['$1,000', G, 210], ['IN A DRAWER', W, 105]] });
        const bl = bill(P, 260, 760, 560, 15.2); tl.to(bl, { y: 150, duration: 0.7, ease: 'power2.in' }, 17.0);
        P.el('uc abs', 160, 960, 760, 300, `<div style="position:absolute;left:30px;top:30px;right:30px;bottom:30px;border-radius:22px;border:3px solid #4a3607"></div><div style="position:absolute;left:300px;top:105px;width:160px;height:36px;border-radius:18px;background:#e5ab33"></div>${LAB('DRAWER', 300, 195)}`, 14.4); }
      // 5 ten years later
      { const P = B(5, { eyebrow: 'TEN YEARS LATER', rows: [['OPEN THE', W, 125], ['DRAWER', G, 150]] });
        P.el('uc abs', 120, 700, 840, 330, `${IMG('calendar', 50, 55, 160)}${LAB('YEARS PASSED', 260, 64)}${VAL('10', 260, 110, 170, G)}`, 19.9); }
      // 6 still $1,000
      { const P = B(6, { eyebrow: 'GOOD NEWS', rows: [['STILL', W, 130], ['$1,000', G, 220]] });
        bill(P, 140, 800, 800, 23.4); const c = P.el('abs', 770, 740, 160, 160, IMG('check-circle', 0, 0, 160), 24.2); P.pulse(c, 24.8); }
      // 7 problem
      { const P = B(7, { eyebrow: 'BUT HERE’S', rows: [['THE', W, 130], ['PROBLEM', G, 170]], top: 300 });
        P.el('abs', 340, 880, 400, 400, IMG('warning', 0, 0, 400), 26.4); }
      // 8 things cost more
      { const P = B(8, { eyebrow: 'WHAT YOU COULD BUY', rows: [['NOW COSTS', W, 125], ['MUCH MORE', G, 140]] });
        [['coffee', 'COFFEE'], ['fork-knife', 'DINNER'], ['t-shirt', 'CLOTHES']].forEach(([ic, nm], i) => { const at = 29.6 + i * 0.9;
          P.el('uc abs', 120, 650 + i * 190, 840, 160, `${IMG(ic, 40, 28, 100)}${VAL(nm, 175, 52, 56, W)}`, at);
          chip(P, '▲ MORE', 690, 690 + i * 190, at + 0.3, 'tagc fill'); }); }
      // 9 cart $100
      { const P = B(9, { eyebrow: 'TODAY', rows: [['A CART OF', W, 120], ['GROCERIES', G, 130]] });
        P.el('uc abs', 120, 680, 840, 360, `${IMG('shopping-cart', 50, 60, 200)}${LAB('COSTS TODAY', 290, 70)}${VAL('$100', 290, 125, 190, W)}`, 35.2); }
      // 10 3% a year -> $134
      { const P = B(10, { eyebrow: 'PRICES RISE ~3% A YEAR', rows: [['IN TEN YEARS', W, 115], ['THE SAME CART?', G, 115]] });
        P.el('uc abs', 100, 640, 380, 330, `${IMG('shopping-cart', 130, 40, 120)}${LAB('TODAY', 120, 190)}${VAL('$100', 90, 235, 80, W)}`, wd(10, 0) + 0.3);
        chip(P, '+3% / YEAR', 340, 1010, wd(10, 7) - 0.1, 'tagc');
        P.el('abs', 495, 770, 90, 90, IMG('trend-up', 0, 0, 90), wd(10, 7) + 0.3);
        const g = P.el('uc gold abs', 600, 640, 380, 330, `${IMG('shopping-cart-k', 130, 40, 120)}${LAB('IN 10 YEARS', 85, 190)}${VAL('≈ $134', 60, 235, 80, K)}`, wd(10, 15) - 0.1); P.pulse(g, wd(10, 15) + 0.7); }
      // 11 money hasn't changed
      { const P = B(11, { eyebrow: 'YOUR MONEY', rows: [['HASN’T', W, 150], ['CHANGED', G, 150]] });
        bill(P, 140, 760, 800, 49.0); }
      // 12 buying power has
      { const P = B(12, { eyebrow: 'BUT ITS', rows: [['BUYING POWER', G, 130], ['HAS', W, 130]] });
        P.el('uc abs', 120, 700, 840, 280, `${IMG('shopping-cart', 50, 50, 110)}${LAB('WHAT $1,000 BUYS', 190, 54)}<div style="position:absolute;left:50px;top:170px;width:740px;height:60px;border-radius:18px;background:#4a3607"></div>`, 51.2);
        const bar = P.el('abs', 170, 872, 740, 60, '<div style="width:100%;height:100%;border-radius:18px;background:#e5ab33"></div>', 51.6, 'transform-origin:left center');
        tl.to(bar, { scaleX: 0.6, duration: 0.9, ease: 'power2.inOut' }, wd(12, 2)); }
      // 13 interesting
      { const P = B(13, { eyebrow: 'AND HERE’S', rows: [['WHAT MAKES', W, 120], ['THIS INTERESTING', G, 100]], top: 280 });
        P.el('abs', 390, 900, 300, 300, IMG('sparkle', 0, 0, 300), 53.9); }
      // 14 no need to spend
      { const P = B(14, { eyebrow: 'YOU DON’T NEED TO SPEND IT', rows: [['TO LOSE', W, 125], ['SOME VALUE', G, 135]] });
        P.el('uc abs', 120, 700, 840, 260, `${IMG('money', 50, 50, 110)}${LAB('MONEY SPENT', 190, 56)}${VAL('$0', 190, 110, 110, W)}`, 57.0);
        chip(P, 'VALUE ▼', 340, 1020, wd(14, 8), 'tagc fill'); }
      // 15 inflation while still
      { const P = B(15, { eyebrow: 'INFLATION CAN DO THAT', rows: [['WHILE CASH', W, 125], ['SITS STILL', G, 140]] });
        bill(P, 140, 700, 800, 61.4);
        P.el('uc gold abs', 220, 1130, 640, 150, `${IMG('trend-up-k', 25, 20, 110)}${VAL('INFLATION', 160, 40, 56, K)}${LAB('PRICES GO UP', 160, 100)}`, 62.8); }
      // 16 savings account
      { const P = B(16, { eyebrow: 'IN A SAVINGS ACCOUNT', rows: [['MIGHT EARN', W, 125], ['INTEREST', G, 150]] });
        P.el('uc abs', 120, 700, 840, 280, `${IMG('bank', 50, 55, 150)}${LAB('SAVINGS ACCOUNT', 240, 60)}${VAL('+ INTEREST', 240, 115, 90, G)}`, 66.4);
        chip(P, 'CAN HELP OFFSET INFLATION', 190, 1050, wd(16, 8), 'tagc fill'); }
      // 17 mattress
      { const P = B(17, { eyebrow: 'BUT CASH', rows: [['UNDER THE', W, 120], ['MATTRESS?', G, 135]] });
        const m = P.el('uc abs', 120, 760, 840, 300, `<div style="position:absolute;left:30px;right:30px;top:80px;height:150px;border-radius:30px;background:repeating-linear-gradient(90deg,#241a07 0 60px,#2e2209 60px 120px);border:3px solid #4a3607"></div><div style="position:absolute;left:60px;top:40px;width:230px;height:70px;border-radius:30px;background:#4a3607"></div>${LAB('MATTRESS', 330, 245)}`, 71.3);
        bill(P, 540, 770, 330, 72.0); }
      // 18 earns nothing
      { const P = B(18, { eyebrow: 'IT EARNS', rows: [['ABSOLUTELY', W, 120], ['NOTHING', G, 160]] });
        P.el('uc abs', 120, 720, 840, 300, `${IMG('prohibit', 50, 55, 140)}${LAB('INTEREST EARNED', 240, 60)}${VAL('$0.00', 240, 115, 130, W)}`, 74.4); }
      // 19 lesson
      { const P = B(19, { eyebrow: 'SO HERE’S', rows: [['THE LESSON', G, 150]], top: 330 });
        P.el('abs', 340, 780, 400, 400, IMG('note', 0, 0, 400), 76.9); }
      // 20 number stays
      { const P = B(20, { eyebrow: 'THE NUMBER ON YOUR MONEY', rows: [['CAN STAY', W, 130], ['THE SAME', G, 140]] });
        bill(P, 140, 720, 800, 79.2); const c = P.el('abs', 770, 660, 160, 160, IMG('check-circle', 0, 0, 160), 80.2); P.pulse(c, 80.8); }
      // 21 what it buys
      { const P = B(21, { eyebrow: 'BUT WHAT IT CAN BUY', rows: [['MAY NOT', W, 135], ['STAY THE SAME', G, 105]] });
        P.el('uc abs', 120, 700, 840, 280, `${IMG('shopping-cart', 50, 55, 150)}${LAB('WHAT IT CAN BUY', 240, 60)}${VAL('LESS ▼', 240, 115, 110, G)}`, 83.6); }
      // 22 end
      { const P = B(22, { rows: [['YOU DIDN’T KNOW', W, 104], ['THAT ABOUT MONEY.', G, 104]], top: 820 });
        P.el('abs', 340, 380, 400, 400, IMG('coins', 0, 0, 400), 87.5); }
