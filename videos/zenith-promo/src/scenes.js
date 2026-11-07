      // ===== helpers =====
      const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
      const LS = (n) => WORDS.find((w) => w.line === n).s;
      const WW = (n, p) => { const x = WORDS.find((w) => w.line === n && norm(w.w).startsWith(p)); if (!x) throw new Error('word not found: L' + n + ' ' + p); return x; };
      const W = (n, p) => WW(n, p).s;
      const TOTAL = WORDS[WORDS.length - 1].e + 1.6;
      const NO_CAPTION_LINES = [1, 2, 3, 4, 5, 6, 7, 8, 9];   // brief: no captions
      const r01 = (i) => hashH(i * 7.31 + 1.7);
      const lerp = (a, b, p) => a + (b - a) * p;
      const pop = (sel, t, o = {}) => tl.fromTo(sel, { opacity: 0, scale: o.s === undefined ? 0.6 : o.s, y: o.y === undefined ? 36 : o.y, x: o.x || 0, rotation: o.r || 0 }, { opacity: 1, scale: 1, y: 0, x: 0, rotation: 0, duration: o.d || 0.6, ease: o.e || 'expo.out', immediateRender: false }, t);
      const out = (sel, t, d) => tl.to(sel, { opacity: 0, duration: d || 0.25, ease: 'power2.in' }, t);
      const bob = (sel, from, to, amp, per) => { amp = amp || 12; per = per || 2.4; const n = Math.max(2, 2 * Math.round((to - from) / per)); tl.fromTo(sel, { y: 0 }, { y: -amp, duration: (to - from) / n, ease: 'sine.inOut', yoyo: true, repeat: n - 1, immediateRender: false }, from); };
      const driver = (t0, t1, fn) => { const o = { p: 0 }; tl.to(o, { p: 1, duration: t1 - t0, ease: 'none', onUpdate: () => fn(o.p * (t1 - t0), o.p) }, t0); };
      const HD = (id, top, size, txt, cls) => { size = Math.min(size, Math.floor(860 / (txt.length * 1.04))); return `<div id="${id}" class="abs hd ${cls || ''}" style="left:60px;top:${top}px;width:900px;font-size:${size}px">${txt}</div>`; };
      const IM = (id, l, t, s, file, cls) => `<div id="${id}" class="tilex ${cls || ''}" style="left:${l}px;top:${t}px;width:${s}px;height:${s}px"><img src="assets/img/${file}.svg"></div>`;
      const CG = (id, l, t, w, h, icon, label, sub, fs) => `<div id="${id}" class="chg" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;font-size:${fs || 30}px"><img src="assets/img/ico-${icon}.svg"><div style="white-space:normal">${label}${sub ? '<small>' + sub + '</small>' : ''}</div></div>`;
      const ringBurst = (sel, t, d, s0, s1) => tl.fromTo(sel, { scale: s0 || 0.5, opacity: 0.85 }, { scale: s1 || 1.6, opacity: 0, duration: d || 1.2, ease: 'power2.out', immediateRender: false }, t);
      const MARK = (id, st) => `<svg id="${id}" viewBox="380 210 500 510" style="${st}"><polygon fill="url(#gB)" points="630,226 742,350 630,280 520,350"/><polygon fill="url(#gZ)" points="462,361 815,361 484,700 398,700 652,425 418,425"/><polygon fill="url(#gW)" points="676,573 856,573 738,700 484,700"/></svg>`;
      // scene wrapper: .sc (transitions) > .shk (impact shake) > .cam (camera drift + static vertical offset)
      const SC = (n, off, inner) => `<div class="sc" id="s${n}"><div class="shk" id="k${n}"><div class="cam" id="c${n}" style="top:${off}px">${inner}</div></div></div>`;
      const camMove = (n, t0, t1, a) => tl.fromTo('#c' + n, { scale: a.s0 === undefined ? 1 : a.s0, x: a.x0 || 0, y: a.y0 || 0, rotation: a.r0 || 0 }, { scale: a.s1 === undefined ? 1 : a.s1, x: a.x1 || 0, y: a.y1 || 0, rotation: a.r1 || 0, duration: t1 - t0, ease: a.e || 'none', immediateRender: false }, t0);
      const shake = (sel, t, amp, dur) => { amp = amp || 14; dur = dur || 0.4; const n = 8; for (let i = 0; i < n; i++) tl.to(sel, { x: (r01(i + Math.floor(t * 10)) - 0.5) * 2 * amp * (1 - i / n), y: (r01(i + 40 + Math.floor(t * 10)) - 0.5) * 2 * amp * (1 - i / n), duration: dur / n, ease: 'none' }, t + i * dur / n); tl.to(sel, { x: 0, y: 0, duration: 0.05 }, t + dur); };
      // kinetic type: split into characters and animate per character
      const kin = (sel, t, mode, o = {}) => {
        const el = document.querySelector(sel); const txt = el.textContent; el.setAttribute('aria-label', txt);
        el.innerHTML = txt.split('').map((c) => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
        const ch = el.querySelectorAll('.ch'); tl.set(sel, { opacity: 1 }, t); const st = o.stagger || 0.03;
        if (mode === 'up') tl.fromTo(ch, { yPercent: 120, rotationX: -80, opacity: 0, transformPerspective: 700 }, { yPercent: 0, rotationX: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: st, immediateRender: false }, t);
        else if (mode === 'zoom') tl.fromTo(ch, { scale: 2.8, opacity: 0, filter: 'blur(18px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'expo.out', stagger: st, immediateRender: false }, t);
        else if (mode === 'slide') tl.fromTo(ch, { x: o.dir === 'l' ? -140 : 140, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: st, immediateRender: false }, t);
        else if (mode === 'glitch') { ch.forEach((c, i) => { const j = r01(i + Math.floor(t * 10)); tl.fromTo(c, { x: (j - 0.5) * 90, opacity: o.visible ? 1 : 0, textShadow: '-9px 0 #3D7BFF, 9px 0 #7FB6FF' }, { x: 0, opacity: 1, textShadow: '0px 0 rgba(0,0,0,0), 0px 0 rgba(0,0,0,0)', duration: 0.45, ease: 'steps(5)', immediateRender: false }, t + i * st);
          tl.fromTo(c, { y: 0 }, { y: (j - 0.5) * 24, duration: 0.06, yoyo: true, repeat: 3, ease: 'none', immediateRender: false }, t + i * st + 0.05); }); }
        return ch.length; };
      // light streaks (reference 1)
      const rays = (id, cx, cy, t0, o = {}) => { const n = o.n || 34; let h = '';
        for (let i = 0; i < n; i++) { const a = (i * 360 / n + hashH(i + 3) * 9).toFixed(1); h += `<div class="rw" style="left:${cx}px;top:${cy}px;transform:rotate(${a}deg)"><div id="${id}${i}" class="rb" style="width:${(120 + hashH(i + 11) * 280).toFixed(0)}px;height:${(3 + hashH(i + 5) * 4).toFixed(1)}px"></div></div>`; }
        add(h);
        for (let i = 0; i < n; i++) { const st = t0 + hashH(i + 1) * (o.spread || 0.25), d = o.dur || 0.75, far = 1150 + hashH(i) * 300;
          if (o.inward) { tl.fromTo('#' + id + i, { x: far, opacity: 0 }, { x: 30, opacity: 1, duration: d, ease: 'power3.in', immediateRender: false }, st); tl.to('#' + id + i, { opacity: 0, duration: 0.12 }, st + d); }
          else { tl.fromTo('#' + id + i, { x: 40, opacity: 0 }, { x: far, opacity: 1, duration: d, ease: 'power2.in', immediateRender: false }, st); tl.to('#' + id + i, { opacity: 0, duration: 0.2 }, st + d - 0.15); } } };

      // ===== persistent background: glow, scanning grid floor, rising particles =====
      add('<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB6FF"/><stop offset="1" stop-color="#3D7BFF"/></linearGradient><linearGradient id="gZ" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#9BB0D3"/></linearGradient><linearGradient id="gW" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5B9BFF"/><stop offset="1" stop-color="#2A6BFF"/></linearGradient></defs></svg>');
      add('<div id="bgA" style="position:absolute;left:0;top:0;width:1080px;height:1920px;background:radial-gradient(900px 800px at 50% 42%,rgba(61,123,255,0.26),transparent 70%),radial-gradient(700px 600px at 92% 4%,rgba(30,70,170,0.38),transparent 70%),radial-gradient(640px 520px at 4% 100%,rgba(40,30,110,0.38),transparent 70%)"></div>');
      tl.fromTo('#bgA', { scale: 1, x: 0 }, { scale: 1.2, x: -40, duration: TOTAL, ease: 'none', immediateRender: false }, 0);
      add('<div id="grid" style="position:absolute;left:-420px;top:1180px;width:1920px;height:1100px;opacity:0.5;transform:perspective(520px) rotateX(64deg);transform-origin:50% 0%;background-image:linear-gradient(rgba(127,182,255,0.38) 2px,transparent 2px),linear-gradient(90deg,rgba(127,182,255,0.38) 2px,transparent 2px);background-size:96px 96px;-webkit-mask-image:linear-gradient(transparent,#000 45%);mask-image:linear-gradient(transparent,#000 45%)"></div>');
      tl.fromTo('#grid', { backgroundPosition: '0px 0px' }, { backgroundPosition: '0px 960px', duration: TOTAL, ease: 'none', immediateRender: false }, 0);
      for (let i = 0; i < 40; i++) { const sz = 3 + r01(i + 90) * 6; add(`<div id="pt${i}" class="dot" style="left:${r01(i + 50) * 1080}px;top:${400 + r01(i + 70) * 1500}px;width:${sz}px;height:${sz}px"></div>`);
        tl.fromTo('#pt' + i, { y: 0, opacity: 0.15 + r01(i + 20) * 0.45 }, { y: -(500 + r01(i + 110) * 1000), opacity: 0.15 + r01(i + 20) * 0.45, duration: TOTAL, ease: 'none', immediateRender: false }, 0); }

      // ===== scene start times =====
      const T2 = W(2, 'potential') - 0.05, T3 = W(2, 'but') - 0.1, T4 = LS(3) - 0.12, T5 = LS(4) - 0.12, T6 = LS(5) - 0.12, T7 = LS(6) - 0.12, T8 = LS(7) - 0.1, T9 = LS(8);

      // ============ S1  HOOK  ============
      add(SC(1, 130, `${MARK('h0', 'position:absolute;left:480px;top:330px;width:120px;height:122px')}<div id="h1" class="abs mono" style="left:60px;top:500px;width:900px;font-size:26px">Zenith Software</div>${HD('h2', 640, 210, 'THINK')}${HD('h3', 880, 118, 'ABOUT IT.', 'lb')}`));
      rays('r1_', 540, 1090, 0.02, { n: 34, dur: 0.85 });
      tl.set(['#h0', '#h1'], { opacity: 1 }, 0); tl.fromTo('#h0', { rotationY: 180, scale: 0.4 }, { rotationY: 0, scale: 1, duration: 0.8, ease: 'expo.out', transformPerspective: 600, immediateRender: false }, 0); tl.fromTo('#h1', { x: -40, letterSpacing: '0.9em' }, { x: 0, letterSpacing: '0.32em', duration: 0.9, ease: 'expo.out', immediateRender: false }, 0);
      kin('#h2', 0, 'glitch', { visible: true, stagger: 0.04 }); kin('#h3', 0.1, 'glitch', { visible: true, stagger: 0.03 });
      camMove(1, 0, T2 + 0.2, { s0: 1, s1: 1.3, e: 'power2.in' }); shake('#k1', 0.05, 12, 0.35);

      // ============ S2  customers find you online (typing search + 3D app carousel)  ============
      const QT = 'business near me';
      add(SC(2, 120, `${HD('a1', 200, 104, 'POTENTIAL')}${HD('a2', 320, 104, 'CUSTOMERS', 'lb')}
        <div id="sb" class="glass" style="left:90px;top:520px;width:840px;height:108px;border-radius:54px;opacity:0"><img src="assets/img/glyph-magnifying-glass.svg" style="position:absolute;left:34px;top:30px;width:48px;height:48px"><div id="sq" style="position:absolute;left:108px;top:0;height:108px;display:flex;align-items:center;font-family:'JetBrains Mono',monospace;font-size:38px;color:#E8F0FF;white-space:nowrap;clip-path:inset(0 100% 0 0)">${QT}</div><div id="scr" style="position:absolute;left:108px;top:30px;width:3px;height:48px;background:#7FB6FF"></div></div>
        ${[0, 1, 2].map((k) => IM('ai' + k, 0, 0, 250, 'app-' + ['instagram', 'facebook', 'tiktok'][k])).join('')}
        <div id="abz" class="chg" style="left:150px;top:1330px;width:720px;height:170px;font-size:38px"><img src="assets/img/ico-storefront.svg"><div>Your business<small>FOUND ONLINE</small></div></div>
        ${Array.from({ length: 12 }, (_, k) => `<div id="bs${k}" class="dot" style="left:510px;top:1410px;width:14px;height:14px;border-radius:3px;background:${k % 2 ? '#7FB6FF' : '#ffffff'}"></div>`).join('')}`));
      kin('#a1', W(2, 'potential'), 'up'); kin('#a2', W(2, 'customers'), 'slide', { dir: 'r' });
      pop('#sb', W(2, 'customers') + 0.1, { s: 0.9, y: -30 });
      tl.fromTo('#sq', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 2.0, ease: 'steps(16)', immediateRender: false }, W(2, 'customers') + 0.5);
      tl.fromTo('#scr', { x: 0, opacity: 1 }, { x: 16 * 22.6, duration: 2.0, ease: 'steps(16)', immediateRender: false }, W(2, 'customers') + 0.5); tl.to('#scr', { opacity: 0.2, duration: 0.3, yoyo: true, repeat: 9 }, W(2, 'customers') + 2.6);
      const ORB = [0, 1, 2]; tl.set(ORB.map((k) => '#ai' + k), { opacity: 0 }, 0);
      driver(W(2, 'find') - 0.2, T3 + 0.2, (t) => { ORB.forEach((k) => { const a = k * 2.0944 + t * 2.3, c = (Math.cos(a) + 1) / 2, sc = 0.55 + 0.55 * c; const el = document.getElementById('ai' + k); const born = Math.min(1, Math.max(0, (t - k * 0.25) / 0.4)); el.style.opacity = String(born); el.style.transform = `translate(${510 + 330 * Math.sin(a) - 125}px, ${1010 - 60 * c + 30 - 125}px) scale(${sc})`; el.style.zIndex = String(Math.round(c * 10)); }); });
      pop('#abz', W(2, 'online'), { s: 0.7, y: 60 });
      for (let k = 0; k < 12; k++) { const a = k * 0.5236; tl.fromTo('#bs' + k, { x: 0, y: 0, opacity: 1, scale: 1 }, { x: Math.cos(a) * (220 + r01(k) * 140), y: Math.sin(a) * (120 + r01(k + 9) * 120) - 60, opacity: 0, rotation: 200, scale: 0.4, duration: 0.8, ease: 'power3.out', immediateRender: false }, W(2, 'online') + 0.05); }
      camMove(2, T2, T3, { s0: 1.0, s1: 1.1, y0: 0, y1: -40, r0: 0.6, r1: -0.6 });

      // ============ S3  but where?  (3D phone, scanning, questions)  ============
      add(SC(3, 190, `${HD('b1', 180, 112, 'BUT WHERE?')}
        <div id="phw" style="position:absolute;left:70px;top:380px;width:460px;height:940px;opacity:0"><div id="ph" class="glass" style="left:0;top:0;width:460px;height:940px;border-radius:64px;border:6px solid rgba(140,175,255,0.45);overflow:hidden">
          <div class="sk" style="left:160px;top:18px;width:140px;height:26px;border-radius:20px;background:rgba(4,10,24,0.9)"></div>
          <div style="position:absolute;left:40px;top:90px;width:104px;height:104px;border-radius:50%;background:linear-gradient(135deg,#0F2A66,#3D7BFF);display:flex;align-items:center;justify-content:center">${MARK('pm', 'width:62px;height:63px')}</div>
          <div class="sk b" style="left:170px;top:106px;width:200px;height:22px"></div><div class="sk" style="left:170px;top:146px;width:140px;height:16px"></div>
          <div class="sk" style="left:40px;top:228px;width:360px;height:16px"></div><div class="sk" style="left:40px;top:262px;width:290px;height:16px"></div>
          <div id="lk" style="position:absolute;left:40px;top:316px;width:380px;height:72px;border:3px dashed rgba(127,182,255,0.75);border-radius:18px;display:flex;align-items:center;justify-content:center;gap:14px"><img src="assets/img/glyphb-link.svg" style="width:36px;height:36px"><div class="sk" style="position:relative;width:190px;height:18px"></div></div>
          <div id="feed" style="position:absolute;left:0;top:432px;width:460px;height:1200px">${Array.from({ length: 12 }, (_, k) => `<div class="sk" style="left:${28 + (k % 3) * 134}px;top:${Math.floor(k / 3) * 134}px;width:126px;height:126px;border-radius:12px;opacity:${0.85 - (k % 3) * 0.1}"></div>`).join('')}</div>
          <div id="scan" style="position:absolute;left:0;top:0;width:460px;height:90px;background:linear-gradient(rgba(61,123,255,0),rgba(127,182,255,0.45),rgba(61,123,255,0));opacity:0"></div></div></div>
        ${IM('qq', 390, 330, 150, 'ico-question', 'glow')}${[0, 1, 2, 3].map((k) => IM('qs' + k, 60 + k * 120, 330, 70, 'ico-question')).join('')}
        ${CG('qc0', 560, 430, 400, 230, 'package', 'Explore<br>products', '', 34)}${CG('qc1', 560, 690, 400, 230, 'wrench', 'Discover<br>services', '', 34)}${CG('qc2', 560, 950, 400, 230, 'info', 'Learn more<br>about you', '', 34)}
        ${[0, 1, 2].map((k) => `<div id="qn${k}" style="position:absolute;left:530px;top:${545 + k * 260}px;width:70px;height:3px;background:linear-gradient(90deg,#7FB6FF,rgba(127,182,255,0));transform-origin:left;transform:scaleX(0)"></div>`).join('')}`));
      tl.set('.chg[id^="qc"]', { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 16 }, 0);
      kin('#b1', W(2, 'but'), 'glitch', { stagger: 0.04 });
      tl.set('#phw', { transformPerspective: 1300 }, 0);
      tl.fromTo('#phw', { opacity: 0, rotationY: 55, x: -200, scale: 0.8 }, { opacity: 1, rotationY: -12, x: 0, scale: 1, duration: 0.9, ease: 'expo.out', immediateRender: false }, W(2, 'where') - 0.25);
      tl.to('#phw', { rotationY: 10, duration: T4 - W(2, 'where') - 0.5, ease: 'sine.inOut' }, W(2, 'where') + 0.7);
      tl.fromTo('#feed', { y: 0 }, { y: -268, duration: T4 - W(2, 'where'), ease: 'none', immediateRender: false }, W(2, 'where'));
      for (let k = 0; k < 8; k++) { tl.fromTo('#scan', { y: -90, opacity: 1 }, { y: 940, opacity: 1, duration: 1.1, ease: 'power1.inOut', immediateRender: false }, W(2, 'where') + 0.6 + k * 1.5); tl.set('#scan', { opacity: 0 }, W(2, 'where') + 0.6 + k * 1.5 + 1.1); }
      tl.fromTo('#lk', { boxShadow: '0 0 0 rgba(61,123,255,0)' }, { boxShadow: '0 0 40px rgba(61,123,255,0.95)', duration: 0.4, yoyo: true, repeat: 17, ease: 'sine.inOut', immediateRender: false }, W(2, 'where'));
      pop('#qq', W(2, 'where') + 0.15, { s: 0.2, r: -30 }); tl.fromTo('#qq', { rotation: -8 }, { rotation: 8, duration: 0.5, yoyo: true, repeat: 15, ease: 'sine.inOut', immediateRender: false }, W(2, 'where') + 0.8);
      [0, 1, 2, 3].forEach((k) => { tl.fromTo('#qs' + k, { opacity: 0, y: 520, x: 30 * k }, { opacity: 0.8, y: -260 - k * 50, x: 30 * k + (k % 2 ? 40 : -40), duration: 1.8, ease: 'power1.out', immediateRender: false }, W(2, 'where') + 0.3 + k * 0.45); tl.to('#qs' + k, { opacity: 0, duration: 0.4 }, W(2, 'where') + 1.7 + k * 0.45); });
      [['qc0', 'explore'], ['qc1', 'discover'], ['qc2', 'learn']].forEach(([id, w], k) => { const t = W(2, w) - 0.05; tl.fromTo('#' + id, { opacity: 0, x: 260, rotationY: -50, transformPerspective: 900 }, { opacity: 1, x: 0, rotationY: 0, duration: 0.7, ease: 'back.out(1.6)', immediateRender: false }, t); tl.fromTo('#qn' + k, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, t - 0.1); shake('#k3', t + 0.1, 6, 0.25); });
      camMove(3, T3, T4, { s0: 1.0, s1: 1.07, x0: 20, x1: -20 });

      // ============ S4  your own website  (3D browser, cursor, typing)  ============
      const SITE = (p, l, t, w, h) => `<div id="${p}" class="glass" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;border-radius:30px;overflow:hidden;opacity:0">
          <div style="position:absolute;left:0;top:0;width:100%;height:62px;border-bottom:1.5px solid rgba(140,175,255,0.28);background:rgba(61,123,255,0.06)"></div>
          ${[0, 1, 2].map((k) => `<div style="position:absolute;left:${26 + k * 26}px;top:22px;width:16px;height:16px;border-radius:50%;background:rgba(155,176,211,${0.55 - k * 0.12})"></div>`).join('')}
          <div style="position:absolute;left:${w * 0.2}px;top:12px;width:${w * 0.6}px;height:38px;border-radius:19px;background:rgba(4,10,24,0.8);border:1.5px solid rgba(140,175,255,0.3);overflow:hidden"><div id="${p}u" style="position:absolute;left:0;top:0;width:100%;height:100%;font-family:'JetBrains Mono',monospace;font-size:21px;color:#9BB0D3;display:flex;align-items:center;justify-content:center;clip-path:inset(0 100% 0 0)">yourbusiness.com</div></div>
          <div id="${p}1" class="sk b" style="left:40px;top:96px;width:${w * 0.44}px;height:26px;opacity:0"></div><div id="${p}2" class="sk" style="left:40px;top:140px;width:${w * 0.36}px;height:20px;opacity:0"></div><div id="${p}3" class="sk" style="left:40px;top:176px;width:${w * 0.3}px;height:20px;opacity:0"></div>
          <div id="${p}4" style="position:absolute;left:40px;top:226px;width:${w * 0.22}px;height:54px;border-radius:14px;background:linear-gradient(135deg,#5B9BFF,#2A6BFF);opacity:0"></div>
          <div id="${p}5" style="position:absolute;right:40px;top:92px;width:${w * 0.34}px;height:${h * 0.42}px;border-radius:22px;background:linear-gradient(135deg,#143A94,#3D7BFF);display:flex;align-items:center;justify-content:center;opacity:0">${MARK(p + 'm', 'width:' + w * 0.12 + 'px;height:' + w * 0.123 + 'px')}</div>
          ${[0, 1, 2].map((k) => `<div id="${p}c${k}" class="sk" style="left:${40 + k * ((w - 80 - 40) / 3 + 20)}px;bottom:36px;width:${(w - 80 - 40) / 3}px;height:${h * 0.22}px;border-radius:16px;background:rgba(127,182,255,0.16);border:1.5px solid rgba(140,175,255,0.28);opacity:0"></div>`).join('')}</div>`;
      add(SC(4, 90, `${HD('w1', 190, 108, 'YOUR OWN')}${HD('w2', 320, 108, 'WEBSITE', 'lb')}${SITE('bw', 90, 480, 840, 520)}
        ${[0, 1, 2].map((k) => `<div id="rp${k}" class="ring" style="left:0;top:0;width:90px;height:90px"></div>`).join('')}
        <div id="cur" class="tilex" style="left:0;top:0;width:78px;height:78px"><img src="assets/img/glyph-cursor-click.svg" style="filter:drop-shadow(0 6px 10px rgba(0,0,0,0.7))"></div>
        ${CG('bf0', 80, 1050, 860, 130, 'identification-badge', 'Professional identity', '', 40)}${CG('bf1', 80, 1210, 860, 130, 'shield-check', 'Builds trust', '', 40)}${CG('bf2', 80, 1370, 860, 130, 'paper-plane-tilt', 'Easy to reach you', '', 40)}
        ${IM('fl0', 790, 600, 110, 'ico-seal-check', 'glow')}${IM('fl1', 70, 1010, 90, 'ico-lock-key')}`));
      kin('#w1', W(3, 'your'), 'zoom'); kin('#w2', W(3, 'website'), 'up');
      tl.set('#bw', { transformPerspective: 1500 }, 0);
      tl.fromTo('#bw', { opacity: 0, rotationY: -40, rotationX: 14, y: 120, scale: 0.8 }, { opacity: 1, rotationY: -14, rotationX: 6, y: 0, scale: 1, duration: 0.9, ease: 'expo.out', immediateRender: false }, W(3, 'website') - 0.05);
      tl.to('#bw', { rotationY: 9, rotationX: 2, duration: T5 - W(3, 'website') - 0.8, ease: 'sine.inOut' }, W(3, 'website') + 0.9);
      const B0 = W(3, 'website') + 0.35;
      tl.fromTo('#bwu', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'steps(16)', immediateRender: false }, B0);
      const CP = [[880, 1130], [222, 733], [747, 682], [250, 905], [510, 905], [770, 905]];   // cursor stops (click targets)
      const CT = [B0 + 0.6, B0 + 1.25, B0 + 1.85, B0 + 2.4, B0 + 2.8, B0 + 3.2];
      tl.set('#cur', { opacity: 0 }, 0); tl.set('#cur', { opacity: 1, x: CP[0][0], y: CP[0][1], scale: 1 }, CT[0] - 0.7);
      CP.forEach((p, k) => { if (k) tl.to('#cur', { x: p[0], y: p[1], duration: CT[k] - (k === 1 ? CT[0] : CT[k - 1]) - 0.12 + (k === 1 ? 0.5 : 0), ease: 'power2.inOut' }, k === 1 ? CT[0] - 0.7 + 0.0 : CT[k - 1] + 0.1); });
      CP.forEach((p, k) => { if (k === 0) return; tl.fromTo('#cur', { scale: 1 }, { scale: 0.78, duration: 0.07, yoyo: true, repeat: 1 }, CT[k] - 0.07); tl.fromTo('#rp' + (k % 3), { x: p[0] - 45 + 10, y: p[1] - 45 + 8, scale: 0.2, opacity: 0.9 }, { scale: 1.6, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, CT[k]); });
      const reveal = (ids, t) => ids.forEach((id, k) => tl.fromTo('#' + id, { opacity: 0, y: 28, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'expo.out', immediateRender: false }, t + k * 0.1));
      reveal(['bw1', 'bw2', 'bw3'], CT[1] - 0.05); reveal(['bw4'], CT[1] + 0.05); reveal(['bw5'], CT[2]); reveal(['bwc0'], CT[3]); reveal(['bwc1'], CT[4]); reveal(['bwc2'], CT[5]);
      tl.to('#cur', { opacity: 0, x: 960, y: 1200, duration: 0.5, ease: 'power2.in' }, CT[5] + 0.35);
      [['bf0', 'professional', -1], ['bf1', 'trust', 1], ['bf2', 'reach', -1]].forEach(([id, w, d], k) => { const t = W(3, w) - (k === 2 ? 0.3 : 0.1); tl.fromTo('#' + id, { opacity: 0, x: d * 420, skewX: d * -20 }, { opacity: 1, x: 0, skewX: 0, duration: 0.6, ease: 'back.out(1.4)', immediateRender: false }, t); tl.fromTo('#' + id + ' img', { rotation: d * 360 }, { rotation: 0, duration: 0.8, ease: 'expo.out', immediateRender: false }, t); tl.fromTo('#' + id, { boxShadow: '0 0 0 rgba(61,123,255,0)' }, { boxShadow: '0 0 50px rgba(61,123,255,0.6)', duration: 0.4, yoyo: true, repeat: 1 }, t + 0.5); });
      pop('#fl0', W(3, 'trust') - 0.1, { s: 0.2, r: -40 }); bob('#fl0', W(3, 'trust') + 0.6, T5, 18, 1.6); pop('#fl1', W(3, 'reach') - 0.4, { s: 0.2, r: 30 }); bob('#fl1', W(3, 'reach') + 0.2, T5, 12, 1.2);
      camMove(4, T4, T5, { s0: 1.12, s1: 1.0, y0: -30, y1: 20, r0: -0.8, r1: 0.5, e: 'power1.out' });

      // ============ S5  Zenith builds it  (miniature team delivers blocks into the screen)  ============
      const PERSON = (id, l, t, sc, body, pose) => { const arm = pose === 'up' ? '<path d="M12 30 L4 8" stroke="' + body + '" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M28 32 L33 46" stroke="' + body + '" stroke-width="7" stroke-linecap="round" fill="none"/>' : pose === 'point' ? '<path d="M28 31 L47 22" stroke="' + body + '" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M12 32 L8 48" stroke="' + body + '" stroke-width="7" stroke-linecap="round" fill="none"/>' : pose === 'carry' ? '<path d="M12 32 L24 44" stroke="' + body + '" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M28 32 L26 44" stroke="' + body + '" stroke-width="7" stroke-linecap="round" fill="none"/><rect x="14" y="40" width="22" height="16" rx="3" fill="#5B9BFF"/>' : '<path d="M12 32 L7 50" stroke="' + body + '" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M28 32 L33 50" stroke="' + body + '" stroke-width="7" stroke-linecap="round" fill="none"/>';
        const legs = pose === 'sit' ? '<rect x="12" y="56" width="34" height="9" rx="4" fill="#0F2A66"/><rect x="38" y="56" width="9" height="26" rx="4" fill="#0F2A66"/>' : '<rect x="12" y="56" width="9" height="34" rx="4" fill="#0F2A66"/><rect x="25" y="56" width="9" height="34" rx="4" fill="#0F2A66"/>';
        return `<svg id="${id}" viewBox="0 0 52 92" style="position:absolute;left:${l}px;top:${t}px;width:${52 * sc}px;height:${92 * sc}px;opacity:0;overflow:visible"><circle cx="20" cy="12" r="10" fill="#E8F0FF"/><rect x="9" y="24" width="22" height="34" rx="9" fill="${body}"/>${arm}${legs}</svg>`; };
      add(SC(5, 90, `${MARK('z0', 'position:absolute;left:486px;top:150px;width:84px;height:86px;opacity:0')}<div id="z1" class="abs mono" style="left:60px;top:250px;width:900px;font-size:24px">Zenith Software</div>
        <div id="mwr" style="position:absolute;left:0;top:0;width:1080px;height:1000px">${SITE('mw', 90, 320, 840, 470)}</div>
        <div id="stk" style="position:absolute;left:470px;top:790px;width:80px;height:52px;background:linear-gradient(#16254d,#0b1630);opacity:0"></div>
        <div id="kbd" style="position:absolute;left:70px;top:850px;width:880px;height:110px;opacity:0;background:repeating-linear-gradient(90deg,transparent 0 40px,rgba(127,182,255,0.22) 40px 42px),repeating-linear-gradient(0deg,transparent 0 24px,rgba(127,182,255,0.22) 24px 26px),linear-gradient(#0e1c40,#081230);border:1.5px solid rgba(140,175,255,0.28);border-radius:14px;transform:perspective(500px) rotateX(38deg);transform-origin:bottom"></div>
        ${PERSON('pp0', 120, 790, 1.55, '#3D7BFF', 'point')}${PERSON('pp1', 300, 780, 1.6, '#E8F0FF', 'stand')}${PERSON('pp2', 600, 790, 1.55, '#5B9BFF', 'up')}${PERSON('pp3', 800, 784, 1.58, '#3D7BFF', 'stand')}${PERSON('pp4', 780, 236, 1.2, '#E8F0FF', 'sit')}${PERSON('pp5', 60, 800, 1.5, '#7FB6FF', 'carry')}
        ${[0, 1, 2, 3].map((k) => `<div id="bk${k}" class="dot" style="left:0;top:0;width:46px;height:46px;border-radius:9px;background:linear-gradient(135deg,#9CC6FF,#3D7BFF);box-shadow:0 0 36px rgba(61,123,255,0.95)"></div>`).join('')}
        ${Array.from({ length: 16 }, (_, k) => `<div id="sp${k}" class="dot" style="left:0;top:0;width:9px;height:9px;background:#fff"></div>`).join('')}
        ${CG('sv0', 60, 1030, 430, 190, 'browser', 'Modern websites', '', 31)}${CG('sv1', 530, 1030, 430, 190, 'shopping-cart', 'E-commerce platforms', '', 31)}${CG('sv2', 60, 1250, 430, 190, 'calendar-check', 'Booking systems', '', 31)}${CG('sv3', 530, 1250, 430, 190, 'puzzle-piece', 'Custom digital solutions', '', 31)}`));
      tl.set(['#z0', '#z1'], { opacity: 0 }, 0); pop('#z0', W(4, 'zenith') - 0.1, { s: 0.3, y: 0, r: -90 }); tl.fromTo('#z1', { opacity: 0, letterSpacing: '1em' }, { opacity: 1, letterSpacing: '0.32em', duration: 0.8, ease: 'expo.out', immediateRender: false }, W(4, 'zenith') + 0.1);
      tl.set('#mwr', { transformPerspective: 1500 }, 0);
      pop('#mw', W(4, 'design') - 0.3, { s: 0.92, y: 70, d: 0.8 }); pop('#stk', W(4, 'design') - 0.1, { s: 1, y: 0, d: 0.5 }); pop('#kbd', W(4, 'design') - 0.2, { s: 1, y: 40, d: 0.7 });
      ['pp0', 'pp1', 'pp2', 'pp3', 'pp4', 'pp5'].forEach((id, k) => { pop('#' + id, W(4, 'zenith') + 0.4 + k * 0.1, { s: 0.5, y: 70, d: 0.7 }); bob('#' + id, W(4, 'zenith') + 1.3, T6, 5 + (k % 3) * 2, 1.0 + k * 0.17); });
      tl.fromTo('#pp1', { x: 0 }, { x: 70, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 5, immediateRender: false }, W(4, 'zenith') + 1.3);
      tl.fromTo('#pp3', { x: 0 }, { x: -60, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: 6, immediateRender: false }, W(4, 'zenith') + 1.6);
      tl.fromTo('#pp2', { rotation: -4 }, { rotation: 4, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 15, immediateRender: false }, W(4, 'zenith') + 1.0);
      // delivery: blocks fly from the carrier into the screen; each arrival builds a piece, shakes the monitor and throws sparks
      const DEL = [['design', 'mw1', 430, 430], ['develop', 'mw4', 330, 560], ['modern', 'mw5', 700, 440], ['ecom', 'mwc1', 500, 710]];
      DEL.forEach(([w, piece, tx, ty], k) => { const t0 = W(4, w) - 0.55, t1 = W(4, w) + 0.05; const sx = 120 + (k % 2) * 40, sy = 800;
        driver(t0, t1, (t, p) => { const e = p * p * (3 - 2 * p), el = document.getElementById('bk' + k); el.style.opacity = p > 0 && p < 0.999 ? '1' : '0'; el.style.transform = `translate(${lerp(sx, tx, e)}px, ${lerp(sy, ty, e) - Math.sin(p * Math.PI) * 190}px) rotate(${p * 360}deg) scale(${lerp(1.1, 0.5, p)})`; });
        const bursts = [0, 1, 2, 3].map((j) => k * 4 + j); bursts.forEach((s, j) => tl.fromTo('#sp' + s, { x: tx, y: ty, opacity: 1, scale: 1 }, { x: tx + Math.cos(j * 1.57 + k) * 90, y: ty + Math.sin(j * 1.57 + k) * 90, opacity: 0, scale: 0.2, duration: 0.45, ease: 'power3.out', immediateRender: false }, t1));
        shake('#mwr', t1, 7, 0.3); });
      ['mw2', 'mw3', 'mwc0', 'mwc2'].forEach((id, k) => tl.fromTo('#' + id, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', immediateRender: false }, W(4, 'develop') + k * 0.35));
      [['sv0', 'modern', -1], ['sv1', 'ecom', 1], ['sv2', 'booking', -1], ['sv3', 'custom', 1]].forEach(([id, w, d]) => { const t = W(4, w) - 0.1; tl.fromTo('#' + id, { opacity: 0, x: d * 360, rotationY: d * 70, transformPerspective: 900 }, { opacity: 1, x: 0, rotationY: 0, duration: 0.65, ease: 'back.out(1.5)', immediateRender: false }, t); tl.fromTo('#' + id + ' img', { rotation: d * 270, scale: 0.4 }, { rotation: 0, scale: 1, duration: 0.7, ease: 'expo.out', immediateRender: false }, t); });
      camMove(5, T5, T6, { s0: 1.0, s1: 1.14, y0: 0, y1: -120, x0: 0, x1: 30, r0: 0, r1: -0.6, e: 'power1.inOut' });

      // ============ S6  Stop limiting  (trapped icons bounce, then everything shatters)  ============
      const APPS = ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'whatsapp'];
      add(SC(6, 110, `${HD('x1', 200, 230, 'STOP')}${HD('x2', 460, 128, 'LIMITING', 'lb')}
        <div id="fr" style="position:absolute;left:110px;top:690px;width:800px;height:580px;border:3px solid rgba(127,182,255,0.85);border-radius:44px;background:rgba(9,20,46,0.55);box-shadow:0 0 60px rgba(61,123,255,0.25),inset 0 0 60px rgba(61,123,255,0.10);opacity:0"></div>
        ${APPS.map((a, k) => IM('xa' + k, 0, 0, 150, 'app-' + a)).join('')}${IM('xl', 800, 640, 120, 'ico-lock-key', 'glow')}
        ${Array.from({ length: 22 }, (_, k) => `<div id="sh${k}" class="shd" style="left:510px;top:980px;width:${50 + r01(k) * 90}px;height:${40 + r01(k + 5) * 80}px;background:linear-gradient(135deg,${k % 3 ? '#7FB6FF' : '#E8F0FF'},#3D7BFF);clip-path:polygon(0 0,100% ${20 + r01(k) * 40}%,${30 + r01(k + 2) * 50}% 100%)"></div>`).join('')}`));
      kin('#x1', W(5, 'stop'), 'zoom', { stagger: 0.05 }); kin('#x2', W(5, 'limiting'), 'glitch', { stagger: 0.04 }); shake('#k6', W(5, 'stop') + 0.12, 22, 0.45);
      pop('#fr', W(5, 'limiting') + 0.1, { s: 1.25, y: 0, d: 0.6 });
      const HX = [235, 460, 685, 235, 460, 685], HY = [770, 770, 770, 1000, 1000, 1000];   // rest positions inside the frame
      driver(W(5, 'your') - 0.1, T7 - 0.1, (t, p) => { APPS.forEach((a, k) => { const sq = Math.min(1, t / 1.8), el = document.getElementById('xa' + k); const born = Math.min(1, Math.max(0, (t - k * 0.12) / 0.35)); const rx = HX[k] + 6 + (95 - 45 * sq) * Math.sin(t * (2.6 + k * 0.37) + k * 1.3), ry = HY[k] + 10 + (80 - 40 * sq) * Math.sin(t * (3.3 + k * 0.29) + k * 0.9); el.style.opacity = String(born); el.style.transform = `translate(${rx}px, ${ry}px) scale(${lerp(0.4, 1, born)}) rotate(${Math.sin(t * 4 + k) * 8}deg)`; }); });
      pop('#xl', W(5, 'media') - 0.1, { s: 0.3, y: 0 }); tl.fromTo('#xl', { x: -5 }, { x: 5, duration: 0.06, yoyo: true, repeat: 20, ease: 'none', immediateRender: false }, W(5, 'media') + 0.2);
      tl.fromTo('#fr', { scaleY: 1, scaleX: 1 }, { scaleY: 0.92, scaleX: 0.97, duration: 0.5, yoyo: true, repeat: 4, ease: 'sine.inOut', immediateRender: false }, W(5, 'limiting') + 0.6);
      const BRK = T7 - 0.05;
      tl.to('#fr', { scale: 1.5, opacity: 0, duration: 0.4, ease: 'power3.in' }, BRK); tl.to('#xl', { scale: 2, opacity: 0, duration: 0.3 }, BRK); out('#x1', BRK, 0.2); out('#x2', BRK, 0.2);
      APPS.forEach((a, k) => tl.to('#xa' + k, { opacity: 0, duration: 0.12 }, BRK));
      for (let k = 0; k < 22; k++) { const ang = r01(k + 3) * 6.283, dist = 380 + r01(k + 8) * 520; tl.fromTo('#sh' + k, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 0.6 }, { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist + 220, rotation: (r01(k + 4) - 0.5) * 900, opacity: 0, scale: 1.1, duration: 0.9, ease: 'power3.out', immediateRender: false }, BRK); }
      shake('#k6', BRK, 26, 0.45); camMove(6, T6, T7, { s0: 1.0, s1: 1.1 });

      // ============ S7  Build your digital presence  (globe + live network)  ============
      const NODES = 10;
      add(SC(7, 110, `${HD('p1', 220, 190, 'BUILD')}${HD('p2', 440, 88, 'YOUR DIGITAL')}${HD('p3', 548, 130, 'PRESENCE', 'lb')}
        ${[0, 1, 2].map((k) => `<div id="pr${k}" class="ring" style="left:${510 - (260 + k * 120)}px;top:${1090 - (260 + k * 120)}px;width:${520 + k * 240}px;height:${520 + k * 240}px"></div>`).join('')}
        <svg id="net" width="1080" height="1920" style="position:absolute;left:0;top:0;opacity:0">${Array.from({ length: NODES }, (_, k) => { const a = k * 6.283 / NODES + 0.3, R = 330 + (k % 3) * 70; return `<line id="nl${k}" x1="510" y1="1090" x2="${510 + Math.cos(a) * R}" y2="${1090 + Math.sin(a) * R}" stroke="#7FB6FF" stroke-width="2.5" stroke-opacity="0.6" stroke-dasharray="1000" stroke-dashoffset="1000"/><circle id="nc${k}" cx="${510 + Math.cos(a) * R}" cy="${1090 + Math.sin(a) * R}" r="0" fill="#7FB6FF"/>`; }).join('')}</svg>
        ${IM('pg', 340, 920, 340, 'ico-globe', 'glow')}
        <div id="orb" style="position:absolute;left:210px;top:790px;width:600px;height:600px;opacity:0">${['browser', 'shopping-cart', 'calendar-check'].map((n, k) => `<div id="ob${k}" style="position:absolute;left:${300 + 300 * Math.cos(k * 2.0944 - 1.5708) - 62}px;top:${300 + 300 * Math.sin(k * 2.0944 - 1.5708) - 62}px;width:124px;height:124px"><img src="assets/img/ico-${n}.svg" style="width:100%;height:100%;filter:drop-shadow(0 12px 24px rgba(0,0,0,0.5))"></div>`).join('')}</div>`));
      kin('#p1', W(6, 'build'), 'up'); kin('#p2', W(6, 'your'), 'slide', { dir: 'l' }); kin('#p3', W(6, 'presence') - 0.15, 'glitch');
      tl.fromTo('#pg', { opacity: 0, scale: 0.05, rotation: -200 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'expo.out', immediateRender: false }, LS(6) + 0.02);
      [0, 1, 2, 3, 4].forEach((k) => ringBurst('#pr' + (k % 3), LS(6) + 0.2 + k * 0.28, 1.0, 0.4, 1.1));
      tl.set('#net', { opacity: 1 }, LS(6) + 0.3);
      for (let k = 0; k < NODES; k++) { tl.fromTo('#nl' + k, { attr: { 'stroke-dashoffset': 1000 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 0.5, ease: 'power2.out', immediateRender: false }, LS(6) + 0.35 + k * 0.09); tl.fromTo('#nc' + k, { attr: { r: 0 } }, { attr: { r: 11 }, duration: 0.35, ease: 'back.out(3)', immediateRender: false }, LS(6) + 0.7 + k * 0.09); }
      tl.fromTo('#orb', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'expo.out', immediateRender: false }, W(6, 'digital') - 0.1);
      tl.fromTo('#orb', { rotation: 0 }, { rotation: 220, duration: T8 - W(6, 'digital') + 0.3, ease: 'none', immediateRender: false }, W(6, 'digital') - 0.1);
      [0, 1, 2].forEach((k) => tl.fromTo('#ob' + k, { rotation: 0 }, { rotation: -220, duration: T8 - W(6, 'digital') + 0.3, ease: 'none', immediateRender: false }, W(6, 'digital') - 0.1));
      camMove(7, T7, T8, { s0: 1.25, s1: 1.0, r0: -2, r1: 0, e: 'power2.out' });

      // ============ S8  Expand your opportunities  (chart grows, tiles blast outward)  ============
      add(SC(8, 110, `${HD('e1', 220, 190, 'EXPAND')}${HD('e2', 440, 96, 'YOUR')}${HD('e3', 560, 78, 'OPPORTUNITIES', 'lb')}
        ${[0, 1, 2].map((k) => `<div id="er${k}" class="ring" style="left:${510 - (200 + k * 130)}px;top:${1050 - (200 + k * 130)}px;width:${400 + k * 260}px;height:${400 + k * 260}px"></div>`).join('')}
        ${[0, 1, 2, 3, 4].map((k) => `<div id="cb${k}" style="position:absolute;left:${150 + k * 150}px;top:${1330 - (90 + k * 85)}px;width:112px;height:${90 + k * 85}px;border-radius:16px 16px 0 0;background:linear-gradient(#7FB6FF,#2A6BFF);box-shadow:0 0 40px rgba(61,123,255,0.5);transform-origin:bottom;opacity:0"></div>`).join('')}
        <svg width="1080" height="1920" style="position:absolute;left:0;top:0"><polyline id="ar" points="190,1190 340,1090 490,1000 640,880 790,790 880,700" fill="none" stroke="#E8F0FF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1100" stroke-dashoffset="1100" opacity="0"/><polygon id="ah" points="850,690 905,672 893,730" fill="#E8F0FF" opacity="0"/></svg>
        ${IM('ef0', 360, 780, 130, 'ico-users-three')}${IM('ef1', 560, 780, 130, 'ico-target')}${IM('ef2', 360, 1230, 130, 'ico-storefront')}${IM('ef3', 560, 1230, 130, 'ico-rocket-launch')}`));
      kin('#e1', W(7, 'expand'), 'zoom', { stagger: 0.05 }); kin('#e2', W(7, 'your'), 'slide', { dir: 'r' }); kin('#e3', W(7, 'opportunities') - 0.1, 'up', { stagger: 0.02 });
      [0, 1, 2].forEach((k) => ringBurst('#er' + k, LS(7) + 0.1 + k * 0.2, 1.1, 0.5, 1.15));
      [0, 1, 2, 3, 4].forEach((k) => tl.fromTo('#cb' + k, { opacity: 1, scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: 'back.out(1.7)', immediateRender: false }, LS(7) + 0.1 + k * 0.13));
      tl.set('#ar', { opacity: 1 }, LS(7) + 0.5); tl.fromTo('#ar', { attr: { 'stroke-dashoffset': 1100 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 0.8, ease: 'power2.out', immediateRender: false }, LS(7) + 0.5); pop('#ah', LS(7) + 1.25, { s: 0.2, y: 0 }); tl.set('#ah', { opacity: 1 }, LS(7) + 1.3);
      [['#ef0', -330, -300], ['#ef1', 340, -300], ['#ef2', -330, 250], ['#ef3', 340, 250]].forEach(([s, dx, dy], k) => tl.fromTo(s, { opacity: 0, x: 0, y: 0, scale: 0.2, rotation: -90 }, { opacity: 1, x: dx, y: dy, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)', immediateRender: false }, W(7, 'opportunities') - 0.5 + k * 0.1));
      camMove(8, T8, T9, { s0: 1.0, s1: 1.18, r0: 0, r1: 1.2, e: 'power2.in' });

      // ============ S9  brand sting (reference 1)  ============
      add(SC(9, 0, `<div id="s9ring" class="ring" style="left:190px;top:310px;width:700px;height:700px"></div>
        ${MARK('lg', 'position:absolute;left:300px;top:380px;width:480px;height:489px;opacity:0;filter:drop-shadow(0 0 80px rgba(61,123,255,0.6))')}
        <div id="swp" style="position:absolute;top:340px;left:-300px;width:160px;height:600px;background:linear-gradient(100deg,transparent,rgba(255,255,255,0.55),transparent);transform:skewX(-18deg);opacity:0"></div>
        <div id="zn" class="abs hd" style="left:0;top:940px;width:1080px;font-size:96px;letter-spacing:0.2em;text-indent:0.2em">ZENITH</div>
        <div id="sw" class="abs mono" style="left:0;top:1070px;width:1080px;font-size:32px;letter-spacing:0.55em;text-indent:0.55em">Software</div>
        <div id="tg1" class="abs hd" style="left:0;top:1190px;width:1080px;font-size:52px;font-weight:700">Your vision,</div><div id="tg2" class="abs hd lb" style="left:0;top:1262px;width:1080px;font-size:52px;font-weight:700">built digitally.</div>
        <div id="dom" class="pill" style="left:230px;top:1420px;width:620px;height:88px;font-size:36px;overflow:hidden">zenith-software.tech<div id="shim" style="position:absolute;top:0;left:-120px;width:90px;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,0.45),transparent);transform:skewX(-18deg)"></div></div>`));
      rays('r9_', 540, 624, T9 - 0.9, { n: 48, inward: true, dur: 0.85, spread: 0.2 });
      tl.set('#lg', { opacity: 0 }, 0);
      tl.fromTo('#lg', { scale: 2.4, opacity: 0, rotation: 8, filter: 'blur(14px) drop-shadow(0 0 80px rgba(61,123,255,0.6))' }, { scale: 1, opacity: 1, rotation: 0, filter: 'blur(0px) drop-shadow(0 0 80px rgba(61,123,255,0.6))', duration: 0.7, ease: 'expo.out', immediateRender: false }, T9 - 0.05);
      ringBurst('#s9ring', T9, 1.3, 0.5, 1.7); ringBurst('#s9ring', T9 + 0.2, 1.3, 0.4, 2.0); ringBurst('#s9ring', T9 + 0.4, 1.3, 0.3, 2.3); shake('#k9', T9 - 0.02, 24, 0.5);
      tl.fromTo('#swp', { x: 0, opacity: 0.9 }, { x: 1500, opacity: 0.9, duration: 0.9, ease: 'power2.inOut', immediateRender: false }, T9 + 0.3); tl.set('#swp', { opacity: 0 }, T9 + 1.3);
      kin('#zn', T9 + 0.45, 'glitch', { stagger: 0.06 });
      tl.fromTo('#sw', { opacity: 0, letterSpacing: '1.2em' }, { opacity: 1, letterSpacing: '0.55em', duration: 0.8, ease: 'expo.out', immediateRender: false }, T9 + 0.95);
      kin('#tg1', W(9, 'your'), 'up', { stagger: 0.025 }); kin('#tg2', W(9, 'built'), 'up', { stagger: 0.025 });
      tl.fromTo('#dom', { opacity: 0, scale: 0.8, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)', immediateRender: false }, W(9, 'digitally') - 0.1);
      for (let k = 0; k < 3; k++) tl.fromTo('#shim', { x: 0 }, { x: 760, duration: 0.8, ease: 'power2.inOut', immediateRender: false }, W(9, 'digitally') + 0.3 + k * 1.3);
      tl.fromTo('#lg', { y: 0 }, { y: -14, duration: 1.7, ease: 'sine.inOut', yoyo: true, repeat: 2 }, T9 + 0.9);
      tl.fromTo('#dom', { boxShadow: '0 0 0 rgba(61,123,255,0)' }, { boxShadow: '0 0 50px rgba(61,123,255,0.6)', duration: 0.9, yoyo: true, repeat: 3, ease: 'sine.inOut' }, W(9, 'digitally') + 0.5);
      camMove(9, T9, TOTAL, { s0: 1.0, s1: 1.07 });

      // ===== transitions between scenes =====
      const zoomIn = (n, t) => tl.fromTo('#s' + n, { scale: 0.5, opacity: 0, filter: 'blur(16px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'expo.out', immediateRender: false }, t - 0.05);
      const zoomOut = (n, t) => tl.to('#s' + n, { scale: 2.6, opacity: 0, filter: 'blur(18px)', duration: 0.4, ease: 'power3.in' }, t - 0.3);
      const whip = (a, b, t, dir) => { const ax = dir === 'l' ? -1080 : dir === 'r' ? 1080 : 0, ay = dir === 'u' ? -1920 : 0; tl.to('#s' + a, { x: ax, y: ay, filter: 'blur(26px)', duration: 0.45, ease: 'power4.in' }, t - 0.25); tl.set('#s' + a, { opacity: 0 }, t + 0.25); tl.fromTo('#s' + b, { x: -ax, y: -ay, filter: 'blur(26px)' }, { x: 0, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power4.out', immediateRender: false }, t - 0.1); };
      add('<div id="glx" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:70;pointer-events:none">' + Array.from({ length: 10 }, (_, k) => `<div id="gb${k}" class="gb"></div>`).join('') + '</div><div id="fl" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:71;background:#dfe9ff;opacity:0;pointer-events:none"></div><div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:80;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0 2px,transparent 2px 5px),radial-gradient(closest-side at 50% 50%,transparent 62%,rgba(2,6,16,0.55))"></div>');
      const GC = ['#3D7BFF', '#7FB6FF', '#E8F0FF', '#2A6BFF'];
      const glitch = (t, seed, heavy) => { const fr = heavy ? 8 : 6; for (let f = 0; f < fr; f++) { const tt = t + f * 0.042; for (let k = 0; k < 10; k++) { const j = r01(seed * 31 + f * 13 + k); tl.set('#gb' + k, { top: Math.round(r01(seed + f * 7 + k * 3) * 1800), height: Math.round(10 + j * (heavy ? 150 : 70)), x: Math.round((r01(seed + k + f) - 0.5) * 220), opacity: j > 0.35 ? 0.42 + j * 0.3 : 0, backgroundColor: GC[(k + f) % 4] }, tt); } } for (let k = 0; k < 10; k++) tl.set('#gb' + k, { opacity: 0 }, t + fr * 0.042); };
      const flash = (t, a) => { tl.fromTo('#fl', { opacity: 0 }, { opacity: a || 0.7, duration: 0.05, immediateRender: false }, t); tl.to('#fl', { opacity: 0, duration: 0.3, ease: 'power2.out' }, t + 0.05); };
      zoomOut(1, T2); zoomIn(2, T2); glitch(T2 - 0.2, 1, false);
      whip(2, 3, T3, 'l');
      tl.set('#s3', { opacity: 1 }, 0); tl.to('#s3', { opacity: 0, duration: 0.01 }, 0);   // reset helper (scene 3 is revealed by glitch cut below)
      tl.fromTo('#s3', { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, T3 - 0.1);
      tl.to('#s3', { opacity: 0, duration: 0.01 }, T4 - 0.05); glitch(T4 - 0.12, 3, false); shake('#k4', T4, 20, 0.4);
      whip(4, 5, T5, 'u');
      tl.to('#s5', { opacity: 0, duration: 0.01 }, T6 - 0.05); glitch(T6 - 0.14, 5, true); flash(T6 - 0.1, 0.5); shake('#k6', T6, 16, 0.3);
      tl.to('#s6', { opacity: 0, duration: 0.01 }, T7 + 0.5); flash(T7 - 0.05, 0.75); zoomIn(7, T7);
      whip(7, 8, T8, 'r');
      tl.to('#s8', { scale: 1.8, opacity: 0, filter: 'blur(18px)', duration: 0.35, ease: 'power3.in' }, T9 - 0.3); flash(T9 - 0.04, 0.9); glitch(T9 - 0.05, 8, true);
