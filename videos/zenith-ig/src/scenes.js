      // Explainer-UI style (like inflation / bill-value): eyebrow + big headline + drawn UI cards with Phosphor icons, black and gold. No emoji, no characters.
      const NO_CAPTION_LINES = [7];
      const W = '#E8F0FF', G = '#7FB6FF', K = '#04112B';
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

      // ---------- ambient layer + flash (3D logo / panels / knot live in src/modules.html, canvas #gl) ----------
      const TOTAL = 20.16;
      const A = '#7FB6FF';
      for (let i = 0; i < 10; i++) {
        const sz = 3 + hashH(i + 3) * 5, x = 20 + hashH(i + 11) * 1040, sp = 60 + hashH(i + 5) * 70, y0 = hashH(i + 7) * 1900;
        dyn.insertAdjacentHTML('beforeend', `<div id="pt${i}" class="pt" style="left:${x}px;top:0;width:${sz}px;height:${sz}px;opacity:${(0.2 + hashH(i + 9) * 0.3).toFixed(2)}"></div>`);
        const first = (y0 + 80) / sp, cyc = 2000 / sp;
        tl.fromTo('#pt' + i, { y: y0 }, { y: -80, duration: first, ease: 'none' }, 0);
        tl.fromTo('#pt' + i, { y: 1960 }, { y: -80, duration: cyc, ease: 'none', repeat: Math.ceil((TOTAL - first) / cyc), immediateRender: false }, first);
      }
      dyn.insertAdjacentHTML('beforeend', '<div id="flash"></div>');
      const flash = (t, a = 0.5) => tl.fromTo('#flash', { opacity: a }, { opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t);
      const START = [0, 2.6, 4.08, 8.04, 11.26, 13.12, 16.62];
      const B = (n, o, t1, t0) => { const i = parseInt(n, 10); return beat(n, t0 !== undefined ? t0 : i === 1 ? 0 : START[i - 1] - 0.1, t1 || (i === 7 ? 21.5 : START[i] - 0.1), o); };
      const mid = (P, txt, y, at, cls = 'tagc fill', w = 560) => P.el(cls + ' abs', (1080 - w) / 2, y, w, 64, `<div style="text-align:center;line-height:40px">${txt}</div>`, at);

      // 1 hook: the real site panels orbit
      { B(1, { eyebrow: 'SOFTWARE STUDIO · ALBANIA', rows: [['NEED A WEBSITE', W, 84], ['THAT ACTUALLY', W, 84], ['WORKS?', A, 160]] }); }
      // 2 meet Zenith Software (3D logo)
      { B(2, { eyebrow: 'MEET', rows: [['ZENITH', W, 170], ['SOFTWARE', A, 64]] }); flash(2.66, 0.35); }
      // 3 websites, web apps, custom tools (3D knot)
      { const P = B(3, { eyebrow: 'A SMALL STUDIO BUILDING', rows: [['WEBSITES', W, 104], ['WEB APPS', W, 104], ['CUSTOM TOOLS', A, 92]] }); }
      // 4 a direct line to the developer
      { const P = B(4, { eyebrow: 'A DIRECT LINE', rows: [['TALK TO THE', W, 100], ['DEVELOPER', A, 130]] });
        P.el('bub q abs', 90, 760, 'auto', 'auto', 'Can we add a booking page?', 8.55);
        P.el('bub a abs', 395, 910, 'auto', 'auto', 'Yes. Sketch ready tomorrow.', 9.6);
        mid(P, 'NO HAND-OFFS', 1130, 10.3, 'tagc fill', 420); }
      // 5 fixed quote after a free call
      { const P = B(5, { eyebrow: 'A FREE CALL, THEN A', rows: [['FIXED QUOTE', A, 120]], top: 215 });
        const rows = [['WEBSITE', '2–4 weeks'], ['WEB APP', '4–8 weeks'], ['CUSTOM SOFTWARE', '6–12 weeks']];
        P.el('uc abs', 90, 600, 900, 560, `${LAB('TYPICAL TIMELINE', 40, 36)}` + rows.map(([a, b], i) => `<div style="position:absolute;left:40px;right:40px;top:${100 + i * 150}px;height:1px;background:rgba(140,175,255,.22)"></div>${LAB(a, 40, 128 + i * 150)}${VAL(b, 40, 172 + i * 150, 58, i === 2 ? A : W)}`).join(''), 11.4); }
      // 6 you own everything (code handover)
      { const P = B(6, { eyebrow: 'YOU OWN', rows: [['EVERYTHING', A, 120]] });
        P.el('uc abs', 90, 560, 900, 560, '', 13.2);
        const L = (txt, id, at, top) => { dyn.insertAdjacentHTML('beforeend', `<div id="${id}" class="code" style="left:140px;top:${top}px">${txt}</div>`); tl.fromTo('#' + id, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, at); tl.to('#' + id, { opacity: 0, duration: 0.2 }, START[6] - 0.32); };
        L('<i>handover</i>({', 'cl1', 13.3, 600); L('  code:    <b>"your GitHub"</b>,', 'cl2', 14.55, 700); L('  hosting: <b>"your account"</b>,', 'cl3', 15.1, 790); L('  domain:  <b>"your registrar"</b>,', 'cl4', 15.65, 880); L('})', 'cl5', 16.1, 970);
        mid(P, '✓ NEVER LOCKED IN', 1200, 16.15, 'tagc fill', 520); }
      // 7 end card (3D logo on top)
      { const P = B(7, { rows: [['ZENITH SOFTWARE', W, 74], ['BUILT TO LAST.', A, 96]], top: 1020 });
        mid(P, 'zenith-software.tech', 1250, 18.0, 'tagc fill', 620); mid(P, 'contact@zenith-software.tech', 1330, 18.4, 'tagc', 760); flash(16.7, 0.3); }
