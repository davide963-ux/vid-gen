      // Explainer-UI style (like inflation / bill-value): eyebrow + big headline + drawn UI cards with Phosphor icons, black and gold. No emoji, no characters.
      const NO_CAPTION_LINES = [15];
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

      // ---------- ambient layer: gold dust + flash (3D salt cubes / lattice / temple / scale / coin live in src/modules.html, canvas #gl) ----------
      const TOTAL = 67.77;
      for (let i = 0; i < 16; i++) {
        const sz = 4 + hashH(i + 3) * 7, x = 20 + hashH(i + 11) * 1040, sp = 70 + hashH(i + 5) * 90, y0 = hashH(i + 7) * 1900;
        dyn.insertAdjacentHTML('beforeend', `<div id="pt${i}" class="pt" style="left:${x}px;top:0;width:${sz}px;height:${sz}px;opacity:${(0.14 + hashH(i + 9) * 0.22).toFixed(2)}"></div>`);
        const first = (y0 + 80) / sp, cyc = 2000 / sp;
        tl.fromTo('#pt' + i, { y: y0 }, { y: -80, duration: first, ease: 'none' }, 0);
        tl.fromTo('#pt' + i, { y: 1960 }, { y: -80, duration: cyc, ease: 'none', repeat: Math.ceil((TOTAL - first) / cyc), immediateRender: false }, first);
      }
      dyn.insertAdjacentHTML('beforeend', '<div id="flash"></div>');
      const flash = (t, a = 0.5) => tl.fromTo('#flash', { opacity: a }, { opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t);
      const START = [0, 7.66, 8.56, 11.94, 18.6, 19.44, 22.26, 26.3, 33.7, 38.74, 44.64, 51.02, 54.82, 58.22, 64.38];
      const B = (n, o, t1, t0) => { const i = parseInt(n, 10); return beat(n, t0 !== undefined ? t0 : i === 1 ? 0 : START[i - 1] - 0.1, t1 || (i === 15 ? 67.4 : START[i] - 0.1), o); };

      // 1 hook: 3D salt lattice
      { B(1, { eyebrow: 'WHAT IF I TOLD YOU THE WORD', rows: [['“SALARY”', G, 170], ['IS CONNECTED TO YOUR KITCHEN', W, 54]] }); }
      // 2 SALT.
      { B(2, { rows: [['SALT.', G, 300]], top: 300 }); flash(7.7, 0.5); }
      // 3 same salt on your food
      { B(3, { eyebrow: 'YES, THE SAME SALT', rows: [['YOU PUT ON', W, 120], ['YOUR FOOD', G, 130]] }); }
      // 4 more valuable thousands of years ago (lattice turns gold)
      { const P = B(4, { eyebrow: 'THOUSANDS OF YEARS AGO', rows: [['SALT WAS MORE', W, 110], ['VALUABLE', G, 150]] });
        chip(P, 'THAN IT IS TODAY', 330, 1318, wd(4, 11) - 0.1, 'tagc fill'); flash(wd(4, 9), 0.25); }
      // 5 why
      { B(5, { rows: [['WHY?', G, 330]], top: 300 }); }
      // 6 no refrigerators
      { const P = B(6, { eyebrow: 'BECAUSE THERE WERE', rows: [['NO', G, 150], ['REFRIGERATORS', W, 100]] });
        P.el('fridge abs', 340, 650, 400, 600, '<div style="position:absolute;left:0;right:0;top:230px;height:6px;background:#4a3607"></div><div style="position:absolute;right:34px;top:70px;width:12px;height:110px;border-radius:6px;background:#e5ab33"></div><div style="position:absolute;right:34px;top:300px;width:12px;height:160px;border-radius:6px;background:#e5ab33"></div><div class="lab" style="left:0;width:400px;text-align:center;top:520px">FRIDGE</div>', 19.6);
        const x1 = P.el('abs', 300, 940, 500, 18, '<div style="width:100%;height:100%;border-radius:9px;background:#e5ab33;transform:rotate(45deg) scaleX(1.25)"></div>', wd(6, 1) + 0.1, 'transform-origin:center'), x2 = P.el('abs', 300, 940, 500, 18, '<div style="width:100%;height:100%;border-radius:9px;background:#e5ab33;transform:rotate(-45deg) scaleX(1.25)"></div>', wd(6, 1) + 0.3, 'transform-origin:center');
        flash(wd(6, 1) + 0.12, 0.25); }
      // 7 salt preserves food
      { const P = B(7, { eyebrow: 'PEOPLE NEEDED SALT TO', rows: [['PRESERVE FOOD', G, 120]] });
        P.el('uc abs', 120, 600, 840, 640, `${IMG('fork-knife', 40, 40, 100)}${LAB('WITHOUT SALT', 170, 50)}<div style="position:absolute;left:170px;top:100px;width:620px;height:44px;border-radius:14px;background:#4a3607"></div>${IMG('fork-knife', 40, 340, 100)}${LAB('WITH SALT', 170, 350)}<div style="position:absolute;left:170px;top:400px;width:620px;height:44px;border-radius:14px;background:#4a3607"></div>`, 22.7);
        const b1 = P.el('abs', 290, 700, 620, 44, '<div style="width:100%;height:100%;border-radius:14px;background:#e5ab33"></div>', 23.0, 'transform-origin:left center');
        const b2 = P.el('abs', 290, 1000, 620, 44, '<div style="width:100%;height:100%;border-radius:14px;background:#e5ab33"></div>', 23.2, 'transform-origin:left center');
        tl.to(b1, { scaleX: 0.06, duration: 1.8, ease: 'power2.in' }, wd(7, 9));
        chip(P, '✕ SPOILS', 640, 758, wd(7, 11) + 0.5, 'tagc'); chip(P, '✓ PRESERVED', 560, 1060, wd(7, 5) + 0.6, 'tagc fill'); }
      // 8 ancient Rome (3D temple)
      { const P = B(8, { eyebrow: 'IN ANCIENT ROME', rows: [['SALT WAS SO', W, 110], ['IMPORTANT', G, 140]] });
        chip(P, 'LINKED TO PAYMENT', 330, 1290, wd(8, 14), 'tagc fill'); }
      // 9 salarium -> salary (3D denarius)
      { B(9, { eyebrow: 'THE LATIN WORD', rows: [['“SALARIUM”', W, 110]] });
        const P2 = B('9b', { rows: [['“SALARY”', G, 125]], top: 355 }, undefined, wd(9, 10) - 0.1); flash(wd(9, 10), 0.35); }
      // 10 paid in salt? (3D balance scale)
      { B(10, { eyebrow: 'THERE’S A FAMOUS STORY', rows: [['ROMAN SOLDIERS', W, 110], ['PAID IN SALT?', G, 120]] }); }
      // 11 no solid evidence
      { const P = B(11, { eyebrow: 'BUT HISTORIANS HAVEN’T FOUND', rows: [['SOLID EVIDENCE', G, 125]], top: 260 });
        const s = P.el('stamp abs', 190, 1000, 700, 170, '<div style="font-size:100px;line-height:150px">NOT PROVEN</div>', wd(11, 5) + 0.2, 'rotate:-8deg'); flash(wd(11, 5) + 0.22, 0.3);
        chip(P, 'SOLDIERS PAID IN SALT', 290, 1290, wd(11, 8), 'tagc'); }
      // 12 connection is real (3D salt + coin linked)
      { const P = B(12, { eyebrow: 'STILL', rows: [['THE CONNECTION', W, 105], ['IS REAL', G, 150]] });
        chip(P, 'SALT → SALARIUM → SALARY', 230, 1290, 52.4, 'tagc fill'); }
      // 13 paycheck
      { const P = B(13, { eyebrow: 'NEXT TIME YOUR PAYCHECK ARRIVES', rows: [['REMEMBER…', G, 140]], top: 300 });
        P.el('uc abs', 100, 700, 880, 440, `${LAB('PAYCHECK', 50, 40)}${VAL('SALARY', 50, 110, 130, G)}<div style="position:absolute;left:50px;top:290px;width:520px;height:5px;background:#4a3607"></div><div style="position:absolute;left:50px;top:340px;width:340px;height:5px;background:#4a3607"></div><svg viewBox="0 0 200 80" style="position:absolute;right:50px;bottom:40px;width:240px;height:96px"><path id="sigP" d="M10 55 C 30 10, 50 10, 60 50 S 90 70, 100 30 S 140 10, 190 45" fill="none" stroke="#e5ab33" stroke-width="6" stroke-linecap="round"/></svg>`, 55.9);
        const sg = document.getElementById('sigP'), SL = sg.getTotalLength(); sg.style.strokeDasharray = SL; sg.style.strokeDashoffset = SL;
        tl.fromTo('#sigP', { strokeDashoffset: SL }, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut', immediateRender: false }, 56.9); }
      // 14 roots in an ancient everyday ingredient (3D coin + salt)
      { const P = B(14, { eyebrow: 'A WORD FOR EARNING MONEY', rows: [['HAS ITS ROOTS IN', W, 100], ['AN ANCIENT INGREDIENT', G, 72]] }); }
      // 15 end
      { const P = B(15, { rows: [['YOU DIDN’T KNOW', W, 104], ['THAT ABOUT MONEY!', G, 104]], top: 960 }); flash(64.6, 0.3); }
