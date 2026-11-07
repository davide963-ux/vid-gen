      // Explainer-UI style (like inflation / bill-value): eyebrow + big headline + drawn UI cards with Phosphor icons, black and gold. No emoji, no characters.
      const NO_CAPTION_LINES = [18];
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

      // ---------- ambient layer: gold dust + flash (the 3D coin pattern lives in src/modules.html, canvas #gl behind everything) ----------
      const TOTAL = 72.89;
      for (let i = 0; i < 18; i++) {
        const sz = 4 + hashH(i + 3) * 8, x = 20 + hashH(i + 11) * 1040, sp = 70 + hashH(i + 5) * 90, y0 = hashH(i + 7) * 1900;
        dyn.insertAdjacentHTML('beforeend', `<div id="pt${i}" class="pt" style="left:${x}px;top:0;width:${sz}px;height:${sz}px;opacity:${(0.15 + hashH(i + 9) * 0.25).toFixed(2)}"></div>`);
        const first = (y0 + 80) / sp, cyc = 2000 / sp;
        tl.fromTo('#pt' + i, { y: y0 }, { y: -80, duration: first, ease: 'none' }, 0);
        tl.fromTo('#pt' + i, { y: 1960 }, { y: -80, duration: cyc, ease: 'none', repeat: Math.ceil((TOTAL - first) / cyc), immediateRender: false }, first);
      }
      dyn.insertAdjacentHTML('beforeend', '<div id="flash"></div>');
      const flash = (t, a = 0.5) => tl.fromTo('#flash', { opacity: a }, { opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t);

      const START = [0, 4.26, 11.8, 13.7, 18.64, 23.36, 25.94, 27.15, 30.72, 36.52, 39.96, 43.16, 45.18, 47.92, 54.0, 57.3, 66.82, 69.48];
      const B = (n, o, t1, t0) => { const i = parseInt(n, 10); return beat(n, t0 !== undefined ? t0 : i === 1 ? 0 : START[i - 1] - 0.1, t1 || (i === 18 ? 72.6 : START[i] - 0.1), o); };
      const CREDIT = 'Photo: The Portable Antiquities Scheme / Edwin Wood · CC BY 2.0 · Wikimedia Commons';
      const pic = (P, src, l, t, w, h, at, style = '') => P.el('photo abs', l, t, w, h, `<img src="assets/img/${src}" /><div class="shine"></div>`, at, style);
      const credit = (P, y, at) => P.el('lab abs', 120, y, 'auto', 'auto', CREDIT, at, 'font-size:20px;letter-spacing:.03em;text-transform:none');
      // pizza / pie of 8 slices (CSS clip-path wedges). hi = indexes drawn bright; others drawn dim when dimOthers
      const pizza = (P, cx, cy, size, at, o = {}) => { const ids = [];
        for (let k = 0; k < 8; k++) { const a0 = (k * 45 - 0) * Math.PI / 180, a1 = ((k + 1) * 45) * Math.PI / 180, am = (a0 + a1) / 2;
          const pt = (a) => `${(50 + 90 * Math.sin(a)).toFixed(2)}% ${(50 - 90 * Math.cos(a)).toFixed(2)}%`;
          const dim = o.hi && !o.hi.includes(k);
          const id = P.el('pz abs' + (dim ? ' dim' : ''), cx - size / 2, cy - size / 2, size, size, '', at + (o.stagger === false ? 0 : k * 0.06), `clip-path:polygon(50% 50%, ${pt(a0)}, ${pt((a0 + am) / 2)}, ${pt(am)}, ${pt((am + a1) / 2)}, ${pt(a1)})`);
          ids.push({ id, am }); }
        return ids; };

      // 1 hook: 3D coin
      { const P = B(1, { eyebrow: 'DID YOU KNOW', rows: [['PEOPLE CUT COINS', W, 100], ['INTO PIECES', G, 140]] });
        const c = P.el('tagc fill abs', 190, 1330, 700, 74, '<div style="text-align:center;line-height:52px;font-size:32px">REAL 1771 SPANISH SILVER DOLLAR</div>', 0); hookNow(tl, [c]); }
      // 2 cut money into pieces, still worth something
      { const P = B(2, { eyebrow: 'WHAT IF PEOPLE CUT', rows: [['THEIR MONEY', W, 125], ['INTO PIECES?', G, 125]] });
        chip(P, 'EACH PIECE STILL WORTH SOMETHING', 150, 1330, wd(2, 13) - 0.2, 'tagc fill'); }
      // 3 sounds crazy
      { const P = B(3, { rows: [['SOUNDS', W, 150], ['CRAZY?', G, 170]], top: 250 });
        P.el('abs', 290, 800, 500, 500, IMG('question', 0, 0, 500), 11.95); }
      // 4 hundreds of years ago: change; the real cut fragment
      { const P = B(4, { eyebrow: 'HUNDREDS OF YEARS AGO', rows: [['A WAY TO', W, 120], ['MAKE CHANGE', G, 135]] });
        const f = pic(P, 'cut-fragment-h.jpg', 120, 700, 840, 363, 14.8); tl.fromTo(f + ' img', { scale: 1.12 }, { scale: 1, duration: 3.6, ease: 'power1.out' }, 14.8);
        chip(P, 'A REAL CUT COIN FRAGMENT', 280, 1090, 15.6, 'tagc fill'); credit(P, 1160, 15.9); }
      // 5 the Spanish silver dollar (photo)
      { const P = B(5, { eyebrow: 'ONE OF THE MOST FAMOUS COINS', rows: [['THE SPANISH', W, 120], ['SILVER DOLLAR', G, 120]] });
        for (let i = 0; i < 3; i++) { const r = P.el('ring2 abs', 190, 640, 700, 700, '', 19.3 + i * 0.4); tl.fromTo(r, { scale: 0.7, opacity: 0.5 }, { scale: 1.25, opacity: 0, duration: 1.6, ease: 'power1.out', repeat: 2, immediateRender: false }, 19.4 + i * 0.5); }
        const c = P.el('abs', 220, 670, 640, 640, '<img src="assets/img/coin-front.png" style="width:100%;height:100%;filter:drop-shadow(0 30px 40px rgba(0,0,0,.6)) drop-shadow(0 0 60px rgba(229,171,51,.35))" />', 19.2);
        tl.fromTo(c, { rotation: -10 }, { rotation: 8, duration: 4.4, ease: 'sine.inOut' }, 19.3); }
      // 6 "Piece of Eight": the back of the coin with the 8
      { const P = B(6, { eyebrow: 'PEOPLE CALLED IT THE', rows: [['“PIECE OF EIGHT”', G, 105]] });
        const c = P.el('abs', 220, 640, 640, 640, '<img src="assets/img/coin-back.jpg" style="width:100%;height:100%;border-radius:50%;box-shadow:0 30px 70px rgba(0,0,0,.65),0 0 90px rgba(229,171,51,.3)" />', 23.5);
        tl.fromTo(c, { rotation: 12 }, { rotation: -6, duration: 2.4, ease: 'sine.inOut' }, 23.5);
        const r = P.el('ring2 abs', 220 + 640 * 0.79 - 70, 640 + 640 * 0.51 - 70, 140, 140, '', wd(6, 6) - 0.1, 'border-color:#fffdf6'); tl.fromTo(r, { scale: 2.2 }, { scale: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, wd(6, 6) - 0.1); }
      // 7 why eight
      { const P = B(7, { eyebrow: 'WHY', rows: [['EIGHT?', G, 250]], top: 330 });
        P.el('abs', 340, 850, 400, 400, '<div style="width:400px;height:400px;border-radius:50%;border:12px solid #e5ab33;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:290px;color:#e5ab33;background:#17130a">8</div>', 26.1); }
      // 8 worth eight smaller units
      { const P = B(8, { eyebrow: 'BECAUSE IT WAS WORTH', rows: [['EIGHT', G, 150], ['SMALLER UNITS', W, 100]] });
        P.el('uc abs', 120, 660, 840, 470, `${LAB('1 SPANISH DOLLAR  =  8 REALES', 50, 36)}`, 27.3);
        for (let i = 0; i < 8; i++) { const x = 150 + (i % 4) * 190, y = 760 + Math.floor(i / 4) * 160;
          P.el('abs', x, y, 140, 140, `<div style="width:140px;height:140px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f6cf72,#d79a22 65%,#a86f12);box-shadow:0 12px 24px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:60px;color:#3b2a05">1</div>`, 27.9 + i * 0.28); }
        chip(P, '= ONE SILVER DOLLAR', 290, 1160, 30.2, 'tagc fill'); }
      // 9 cut silver coins into pieces: 3D coin splits
      { const P = B(9, { eyebrow: 'WHEN SMALL COINS WERE HARD TO FIND', rows: [['PEOPLE CUT', W, 115], ['SILVER COINS', G, 115]] });
        flash(wd(9, 10) - 0.02, 0.45);
        const cut = P.el('abs', 140, 988, 800, 8, '<div style="width:100%;height:100%;border-radius:4px;background:linear-gradient(90deg,transparent,#fffdf6,transparent);box-shadow:0 0 24px #e5ab33"></div>', wd(9, 10) - 0.25, 'transform-origin:center'); tl.fromTo(cut, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power3.out', immediateRender: false }, wd(9, 10) - 0.25); tl.to(cut, { opacity: 0, duration: 0.3 }, wd(9, 10) + 0.2); }
      // 10 pizza, eight slices
      { const P = B(10, { eyebrow: 'IMAGINE A PIZZA DIVIDED INTO', rows: [['EIGHT SLICES', G, 130]] });
        const sl = pizza(P, 540, 1000, 660, 36.8);
        tl.to(sl.map((s) => s.id), { rotation: 8, duration: 2.6, ease: 'sine.inOut' }, 36.9); }
      // 11 each slice = part of the value
      { const P = B(11, { eyebrow: 'EACH SLICE REPRESENTS', rows: [['PART OF THE', W, 110], ['ORIGINAL VALUE', G, 110]] });
        const sl = pizza(P, 540, 1010, 640, 40.1, { stagger: false });
        const k = 2, s = sl[k]; tl.to(s.id, { x: 120 * Math.sin(s.am), y: -120 * Math.cos(s.am), duration: 0.6, ease: 'back.out(1.7)' }, wd(11, 2) + 0.1);
        chip(P, '1/8 OF THE VALUE', 640, 880, wd(11, 5), 'tagc fill'); }
      // 12 interesting
      { const P = B(12, { eyebrow: 'AND HERE’S', rows: [['SOMETHING', W, 130], ['INTERESTING', G, 120]], top: 280 });
        P.el('abs', 390, 900, 300, 300, IMG('sparkle', 0, 0, 300), 43.7); }
      // 13 two bits
      { const P = B(13, { eyebrow: 'EVER HEARD SOMEONE SAY', rows: [['“TWO BITS”?', G, 150]], top: 300 });
        for (let i = 0; i < 2; i++) P.el('abs', 300 + i * 260, 820, 220, 220, '<div style="width:220px;height:220px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f6cf72,#d79a22 65%,#a86f12);box-shadow:0 20px 40px rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:100px;color:#3b2a05">' + (i + 1) + '</div>', wd(13, 6) + i * 0.4);
        chip(P, 'AN OLD EXPRESSION', 330, 1110, wd(13, 7), 'tagc'); }
      // 14 25 cents from 8-part value
      { const P = B(14, { eyebrow: 'THE OLD EXPRESSION FOR', rows: [['25 CENTS', G, 150]], top: 260 });
        const sl = pizza(P, 540, 1010, 560, 49.0, { hi: [0, 1], stagger: true });
        chip(P, 'FROM THE DOLLAR’S 8 PARTS', 260, 1290, wd(14, 11) - 0.2, 'tagc fill'); }
      // 15 two out of eight = one quarter
      { const P = B(15, { eyebrow: 'TWO OUT OF EIGHT PARTS', rows: [['= ONE QUARTER', G, 125]] });
        const sl = pizza(P, 540, 960, 520, 54.2, { hi: [0, 1], stagger: false });
        P.el('uc gold abs', 270, 1260, 540, 130, `${VAL('2/8 = 1/4 = 25¢', 40, 38, 58, K)}`, wd(15, 6) - 0.2); flash(wd(15, 7), 0.3); }
      // 16 before cards, ATMs, digital: cutting silver
      { const P = B(16, { eyebrow: 'BEFORE CREDIT CARDS, ATMS AND DIGITAL PAYMENTS', rows: [['PEOPLE MADE CHANGE BY', W, 70], ['CUTTING SILVER', G, 120]], top: 215 });
        [['credit-card', 2, 'CARDS'], ['money', 4, 'ATMS'], ['mobile', 6, 'DIGITAL']].forEach(([ic, k, nm], i) => { const at = wd(16, k) - 0.1, x = 100 + i * 290;
          P.el('uc abs', x, 640, 260, 250, `${IMG(ic, 80, 40, 100)}${LAB(nm, 130 - nm.length * 8.5, 175)}`, at);
          const st = P.el('abs', x + 20, 760, 220, 12, '<div style="width:100%;height:100%;border-radius:6px;background:#e5ab33;transform:rotate(-14deg)"></div>', wd(16, 8) + i * 0.25, 'transform-origin:left center'); P.grow(st, wd(16, 8) + i * 0.25, 0.35); });
        pic(P, 'cut-fragment-h.jpg', 160, 940, 760, 388, wd(16, 12)); credit(P, 1310, wd(16, 13)); }
      // 17 try that with your debit card
      { const P = B(17, { eyebrow: 'IMAGINE TRYING THAT WITH', rows: [['YOUR DEBIT CARD', G, 105]] });
        const cardHTML = '<div class="ccard" style="position:absolute;left:0;top:0;width:700px;height:434px;border-radius:40px;opacity:1"><div class="chipx" style="left:52px;top:105px;transform:scale(.9);transform-origin:left top"></div><div class="val" style="left:52px;top:276px;font-size:46px">•••• •••• •••• 4821</div><div class="lab" style="left:52px;top:344px;color:#3b2a05;font-size:24px">DEBIT CARD</div></div>';
        const a = P.el('abs', 190, 760, 700, 434, cardHTML, 67.2, 'clip-path:polygon(0 0, 52% 0, 46% 100%, 0 100%)'), b = P.el('abs', 190, 760, 700, 434, cardHTML, 67.2, 'clip-path:polygon(52% 0, 100% 0, 100% 100%, 46% 100%)');
        const T = wd(17, 4) + 0.1; tl.to(a, { x: -60, rotation: -5, duration: 0.5, ease: 'back.out(1.8)' }, T); tl.to(b, { x: 60, rotation: 5, duration: 0.5, ease: 'back.out(1.8)' }, T);
        const ln = P.el('abs', 190 + 0.49 * 700 - 4, 740, 8, 474, '<div style="width:100%;height:100%;background:#fffdf6;box-shadow:0 0 24px #e5ab33;transform:rotate(5deg)"></div>', T - 0.35); tl.to(ln, { opacity: 0, duration: 0.3 }, T + 0.1); flash(T, 0.35); }
      // 18 end
      { const P = B(18, { rows: [['YOU DIDN’T KNOW', W, 104], ['THAT ABOUT MONEY.', G, 104]], top: 960 }); flash(69.9, 0.3); }
