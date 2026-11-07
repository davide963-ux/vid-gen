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

      // 1 hook
      { const P = beat(1, 0, 4.2, { eyebrow: 'DID YOU KNOW', rows: [['CREDIT CARDS', W, 130], ['MAKE MONEY', G, 130]] });
        const c = creditCard(P, 150, 640, 780, 0); hookNow(tl, [c]); tl.fromTo(c, { rotation: -4 }, { rotation: 3, duration: 3.6, ease: 'sine.inOut' }, 0);
        const ch = P.el('tagc fill abs', 190, 1200, 700, 80, '<div style="text-align:center;line-height:56px">EVEN WHEN YOU PAY ON TIME</div>', 0); hookNow(tl, [ch]); }
      // 2 interest 0 vs issuer earns
      { const P = beat(2, 5.22, 12.8, { eyebrow: 'WHAT IF', rows: [['THEY EARN', W, 120], ['FROM YOU?', G, 120]] });
        P.el('uc abs', 120, 520, 840, 270, `${IMG('credit-card', 50, 55, 120)}${LAB('INTEREST YOU PAY', 210, 62)}${VAL('$0.00', 210, 120, 120, W)}`, 5.9);
        P.el('abs', 480, 810, 120, 120, IMG('check-circle', 0, 0, 120), 8.2);
        const b = P.el('uc gold abs', 120, 960, 840, 270, `${IMG('bank-k', 50, 55, 120)}${LAB('YOUR CARD ISSUER EARNS', 210, 62)}${VAL('$ ???', 210, 120, 120, K)}`, 9.4); P.pulse(b, 10.4); }
      // 3 sounds strange
      { const P = beat(3, 13.82, 15.0, { rows: [['SOUNDS', W, 150], ['STRANGE?', G, 150]], top: 250 });
        P.el('abs', 290, 760, 500, 500, IMG('question', 0, 0, 500), 13.95); }
      // 4 most people think
      { const P = beat(4, 15.36, 20.8, { eyebrow: 'MOST PEOPLE THINK', rows: [['ONLY FROM', W, 120], ['DEBT', G, 150]] });
        P.el('uc abs', 120, 700, 840, 330, `${IMG('credit-card', 50, 55, 110)}${LAB('UNPAID BALANCE', 190, 50)}${VAL('$$$', 190, 105, 130, W)}${IMG('warning', 690, 70, 120)}`, 16.2);
        chip(P, '+ INTEREST ▲', 330, 1100, 18.2, 'tagc fill'); }
      // 5 not the whole story
      { const P = beat(5, 21.24, 23.1, { eyebrow: 'BUT', rows: [['NOT THE', W, 140], ['WHOLE STORY', G, 140]], top: 330 });
        P.el('abs', 340, 840, 400, 400, IMG('note', 0, 0, 400), 21.7); }
      // 6 shoes purchase
      { const P = beat(6, 23.7, 29.6, { eyebrow: 'IMAGINE', rows: [['YOU BUY', W, 120], ['$100 SHOES', G, 130]] });
        creditCard(P, 80, 620, 440, 24.6);
        P.el('abs', 525, 705, 60, 60, IMG('shopping-cart', 0, 0, 60), 25.6);
        P.el('uc abs', 600, 600, 390, 330, `${IMG('storefront', 135, 45, 120)}${LAB('SHOE STORE', 75, 190)}${VAL('$100', 100, 235, 70, G)}`, 26.4);
        P.el('uc abs', 160, 1010, 760, 190, `${IMG('shopping-cart', 40, 45, 100)}${LAB('1 PAIR OF SHOES', 170, 40)}${VAL('$100.00', 170, 90, 80, W)}`, 28.0); }
      // 7 you pay $100
      { const P = beat(7, 30.0, 31.8, { eyebrow: 'YOU PAY', rows: [['$100', G, 260]], top: 240 });
        P.el('uc abs', 160, 760, 760, 360, `${IMG('check-circle', 320, 45, 120)}${LAB('PAID BY CARD', 215, 200)}${VAL('$100.00', 160, 250, 90, W)}`, 30.3); }
      // 8 store gets less
      { const P = beat(8, 32.34, 36.9, { eyebrow: 'BUT THE STORE', rows: [['GETS A LITTLE', W, 100], ['LESS', G, 150]] });
        P.el('uc abs', 100, 640, 880, 520, `${LAB('YOU PAY', 50, 44)}<div style="position:absolute;left:50px;top:110px;width:780px;height:90px;border-radius:24px;background:#e5ab33"></div>${LAB('STORE RECEIVES', 50, 260)}<div style="position:absolute;left:50px;top:326px;width:780px;height:90px;border-radius:24px;border:3px dashed #4a3607"></div>`, 33.0);
        const bar = P.el('abs', 150, 966, 720, 90, '<div style="width:100%;height:100%;border-radius:24px;background:#e5ab33"></div>', 34.4, 'transform-origin:left center');
        tl.to(bar, { width: 650, duration: 0.7, ease: 'power3.inOut' }, 35.4);
        chip(P, 'LESS THAN $100', 330, 1110, 35.9, 'tagc fill'); }
      // 9 why
      { beat(9, 37.0, 38.3, { rows: [['WHY?', G, 330]], top: 560 }); }
      // 10 stores pay fees
      { const P = beat(10, 38.48, 42.5, { eyebrow: 'BECAUSE STORES PAY', rows: [['FEES TO PROCESS', W, 100], ['CARDS', G, 150]] });
        P.el('uc abs', 90, 700, 380, 340, `${IMG('storefront', 130, 50, 120)}${LAB('STORE', 130, 210)}${VAL('$100', 100, 255, 60, W)}`, 39.2);
        P.el('abs', 500, 800, 80, 80, IMG('gear-six', 0, 0, 80), 40.0);
        P.el('uc gold abs', 610, 700, 380, 340, `${IMG('gear-six-k', 130, 50, 120)}${LAB('PROCESSING', 100, 210)}${VAL('FEE', 140, 255, 60, K)}`, 40.6);
        chip(P, 'PAYMENT PROCESSING FEES', 230, 1130, 41.2); }
      // 11 part of fee goes to bank
      { const P = beat(11, 42.72, 47.4, { eyebrow: 'PART OF THE FEE', rows: [['GOES TO', W, 120], ['YOUR BANK', G, 130]] });
        P.el('uc abs', 100, 660, 880, 300, `${LAB('THE FEE, SPLIT', 50, 40)}<div style="position:absolute;left:50px;top:110px;width:780px;height:100px;border-radius:26px;background:#4a3607"></div>`, 43.2);
        const seg = P.el('abs', 612, 770, 318, 100, '<div style="width:100%;height:100%;border-radius:0 26px 26px 0;background:#e5ab33"></div>', 44.6, 'transform-origin:left center'); P.grow(seg, 44.6, 0.7);
        const bk = P.el('uc gold abs', 560, 1000, 420, 150, `${IMG('bank-k', 25, 20, 110)}${VAL('YOUR BANK', 150, 40, 40, K)}${LAB('CARD ISSUER', 150, 92)}`, 45.2); P.pulse(bk, 46.2); }
      // 12 paid in full on time
      { const P = beat(12, 47.88, 51.8, { eyebrow: 'EVEN IF YOU', rows: [['PAY IN FULL', W, 130], ['ON TIME', G, 150]] });
        P.el('uc abs', 120, 740, 840, 340, `${IMG('calendar', 50, 50, 130)}${LAB('STATEMENT', 220, 56)}${VAL('PAID IN FULL', 220, 110, 80, W)}${LAB('ON TIME', 220, 230)}`, 49.0);
        const c = P.el('abs', 770, 940, 190, 190, IMG('check-circle', 0, 0, 190), 50.4); P.pulse(c, 51.0); }
      // 13 issuer still earns
      { const P = beat(13, 52.1, 57.0, { eyebrow: 'THE CARD ISSUER', rows: [['STILL', W, 140], ['EARNS', G, 170]] });
        const b = P.el('uc gold abs', 150, 760, 780, 300, `${IMG('bank-k', 55, 60, 150)}${LAB('CARD ISSUER', 250, 60)}${VAL('+ FEES', 250, 115, 110, K)}`, 53.2); P.pulse(b, 53.9);
        chip(P, '+ FEE', 200, 1130, 54.3, 'tagc fill'); chip(P, '+ FEE', 470, 1160, 55.0, 'tagc fill'); chip(P, '+ FEE', 730, 1130, 55.7, 'tagc fill'); }
      // 14 interesting part
      { const P = beat(14, 57.1, 58.9, { eyebrow: 'AND HERE’S', rows: [['THE', W, 140], ['INTERESTING', G, 120], ['PART', G, 150]], top: 260 });
        P.el('abs', 390, 1000, 300, 300, IMG('sparkle', 0, 0, 300), 57.7); }
      // 15 more use more fees
      { const P = beat(15, 58.84, 66.6, { eyebrow: 'THE MORE YOU USE IT', rows: [['MORE FEES', G, 140], ['ADD UP', W, 110]] });
        const rows = [['coffee', 'COFFEE'], ['shopping-cart', 'GROCERIES'], ['fork-knife', 'DINNER'], ['truck', 'DELIVERY'], ['t-shirt', 'CLOTHES']];
        rows.forEach(([ic, nm], i) => { const at = 60.2 + i * 1.15;
          P.el('uc abs', 120, 590 + i * 150, 840, 130, `${IMG(ic, 35, 20, 90)}${VAL(nm, 160, 38, 52, W)}`, at);
          chip(P, '+ FEE', 735, 612 + i * 150, at + 0.35, 'tagc fill'); }); }
      // 16 interest and other charges
      { const P = beat(16, 67.02, 71.9, { eyebrow: 'ISSUERS ALSO EARN FROM', rows: [['INTEREST', G, 150]], top: 260 });
        P.el('uc abs', 90, 640, 420, 420, `${IMG('trend-up', 150, 60, 120)}${VAL('INTEREST', 60, 250, 56, G)}${LAB('ON BALANCES', 60, 330)}`, 68.4);
        P.el('uc abs', 570, 640, 420, 420, `${IMG('note', 150, 60, 120)}${VAL('CHARGES', 70, 250, 56, W)}${LAB('& OTHER FEES', 80, 330)}`, 69.8); }
      // 17 surprising truth
      { const P = beat(17, 72.12, 73.8, { rows: [['THE SURPRISING', W, 100], ['TRUTH?', G, 190]], top: 380 });
        P.el('abs', 360, 960, 360, 360, IMG('sparkle', 0, 0, 360), 72.5); }
      // 18 no debt needed
      { const P = beat(18, 74.18, 78.6, { eyebrow: 'THEY DON’T ALWAYS NEED', rows: [['YOUR DEBT', W, 150]] });
        P.el('uc abs', 120, 600, 840, 230, `${IMG('warning', 50, 50, 120)}${VAL('IN DEBT', 220, 60, 100, W)}`, 74.9);
        const st = P.el('abs', 140, 700, 800, 18, '<div style="width:100%;height:100%;border-radius:9px;background:#e5ab33"></div>', 75.8, 'transform-origin:left center'); P.grow(st, 75.8, 0.5);
        P.el('uc gold abs', 120, 930, 840, 270, `${IMG('coins-k', 50, 55, 150)}${LAB('TO MAKE A', 250, 60)}${VAL('PROFIT', 250, 110, 120, K)}`, 76.8); }
      // 19 end
      { const P = beat(19, 79.18, 83.0, { rows: [['YOU DIDN’T KNOW', W, 104], ['THAT ABOUT MONEY.', G, 104]], top: 820 });
        P.el('abs', 340, 380, 400, 400, IMG('coins', 0, 0, 400), 79.4); }
