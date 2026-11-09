      // ===== helpers =====
      const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
      const LS = (n) => WORDS.find((w) => w.line === n).s;
      const W = (n, p) => { const x = WORDS.find((w) => w.line === n && norm(w.w).startsWith(p)); if (!x) throw new Error('word not found: L' + n + ' ' + p); return x.s; };
      const TOTAL = WORDS[WORDS.length - 1].e + 1.8;
      const NO_CAPTION_LINES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];   // brief: no captions
      const TG = W(1, 'experience') + 0.25, SHT = W(2, 'five') + 0.05;
      const T3 = LS(3) - 0.1, T4 = LS(4) - 0.1, T5 = LS(5) - 0.1, T6 = LS(6) - 0.1, T7 = LS(7) - 0.1, T8 = LS(8) - 0.1, T9 = LS(9) - 0.1, T10 = LS(10) - 0.1, T11 = LS(11) - 0.1, T12 = LS(12) - 0.1, T13 = LS(13) - 0.1;
      const STARTS = [0, TG, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, TOTAL];
      const ST = (n) => STARTS[n - 1];                       // start of scene n (ST(14) = TOTAL)
      const r01 = (i) => hashH(i * 7.31 + 1.7);

      // every element animates with transform / opacity only (no masks, no filters, no display flips except whole scenes)
      const IM = (id, l, t, s, file) => `<div id="${id}" class="tilex" style="left:${l}px;top:${t}px;width:${s}px;height:${s}px"><img src="assets/img/${file}.svg"></div>`;
      const LOGO3D = (id, l, t, s, logo) => `<div id="${id}" class="lg3" style="left:${l}px;top:${t}px;width:${s}px;height:${s}px"><div id="${id}i" class="lg3i">${Array.from({ length: 9 }, (_, k) => `<img src="assets/img/app-${logo}.svg" style="transform:translateZ(${(k - 4) * 3}px);${k === 0 || k === 8 ? '' : 'filter:brightness(' + (0.52 + k * 0.03).toFixed(2) + ')'}">`).join('')}</div></div>`;
      const TX = (id, top, size, txt, cls) => { const words = txt.split(' '); size = Math.min(size, Math.floor(930 / (txt.length * 0.7))); return `<div id="${id}" class="t ${cls || ''}" style="top:${top}px;font-size:${size}px">${words.map((w) => `<span class="w">${w}</span>`).join('')}</div>`; };
      const drop = (id, t, st) => tl.fromTo(`#${id} .w`, { opacity: 0, y: -70, rotation: -6 }, { opacity: 1, y: 0, rotation: 0, duration: 0.55, ease: 'back.out(1.7)', stagger: st === undefined ? 0.09 : st, immediateRender: false }, t);
      const dropOut = (id, t) => tl.to(`#${id} .w`, { opacity: 0, y: 40, duration: 0.25, ease: 'power2.in', stagger: 0.03 }, t);
      const pop = (sel, t, o = {}) => tl.fromTo(sel, { opacity: 0, scale: o.s === undefined ? 0.5 : o.s, y: o.y === undefined ? 40 : o.y, x: o.x || 0, rotation: o.r || 0 }, { opacity: 1, scale: 1, y: 0, x: 0, rotation: 0, duration: o.d || 0.6, ease: o.e || 'back.out(1.8)', immediateRender: false }, t);
      const fadeOut = (sel, t, d) => tl.to(sel, { opacity: 0, duration: d || 0.25, ease: 'power2.in' }, t);
      const bob = (sel, from, to, amp, per) => { amp = amp || 10; per = per || 2.2; const n = Math.max(2, 2 * Math.round((to - from) / per)); tl.fromTo(sel, { y: 0 }, { y: -amp, duration: (to - from) / n, ease: 'sine.inOut', yoyo: true, repeat: n - 1, immediateRender: false }, from); };
      const ring = (id, t, s0, s1, d) => tl.fromTo('#' + id, { scale: s0, opacity: 0.8 }, { scale: s1, opacity: 0, duration: d || 1, ease: 'power2.out', immediateRender: false }, t);
      const flip = (id, t, len) => { tl.fromTo('#' + id, { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, t);
        tl.fromTo('#' + id + 'i', { rotationY: -115, scale: 0.4 }, { rotationY: 0, scale: 1, duration: 0.85, ease: 'back.out(1.5)', immediateRender: false }, t);
        const n = Math.max(2, 2 * Math.round(len / 3.2)); tl.fromTo('#' + id + 'i', { rotationY: 0 }, { rotationY: 16, duration: len / n, ease: 'sine.inOut', yoyo: true, repeat: n - 1, immediateRender: false }, t + 0.9); };
      const streak = (id, top, h, rot, t, d) => { tl.fromTo('#' + id, { x: -1400, opacity: 1 }, { x: 1500, duration: d || 1.1, ease: 'power2.inOut', immediateRender: false }, t); tl.set('#' + id, { opacity: 0 }, t + (d || 1.1)); return `<div id="${id}" class="streak" style="top:${top}px;height:${h}px;transform:rotate(${rot}deg)"></div>`; };
      const PERSON = (id, l, t, sc, body, pose) => { const arm = pose === 'up' ? `<path d="M12 30 L4 8" stroke="${body}" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M28 32 L33 46" stroke="${body}" stroke-width="7" stroke-linecap="round" fill="none"/>` : pose === 'point' ? `<path d="M28 31 L47 22" stroke="${body}" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M12 32 L8 48" stroke="${body}" stroke-width="7" stroke-linecap="round" fill="none"/>` : `<path d="M12 32 L7 50" stroke="${body}" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M28 32 L33 50" stroke="${body}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
        return `<svg id="${id}" viewBox="0 0 52 92" style="position:absolute;left:${l}px;top:${t}px;width:${52 * sc}px;height:${92 * sc}px;opacity:0;overflow:visible"><circle cx="20" cy="12" r="10" fill="#111827"/><rect x="9" y="24" width="22" height="34" rx="9" fill="${body}"/>${arm}<rect x="12" y="56" width="9" height="34" rx="4" fill="#111827"/><rect x="25" y="56" width="9" height="34" rx="4" fill="#111827"/></svg>`; };
      const SC = (n, inner) => `<div class="sc" id="s${n}" style="z-index:${n}"><div class="cam" id="c${n}">${inner}</div></div>`;
      // scene transitions: 'push' = new scene rises over the old one (old one recedes); 'iris' = circular reveal from a point
      const zoomGrid = (t) => { tl.fromTo('#zg', { opacity: 0, scale: 0.7 }, { opacity: 0.6, scale: 1.15, duration: 0.25, ease: 'power2.out', immediateRender: false }, t); tl.to('#zg', { opacity: 0, scale: 1.7, duration: 0.35, ease: 'power2.in' }, t + 0.25); };
      const sceneIn = (n, kind, cx, cy) => { const t = ST(n);
        tl.set('#s' + n, { display: 'block' }, t);
        if (kind === 'push') tl.fromTo('#s' + n, { y: 1920 }, { y: 0, duration: 0.65, ease: 'expo.out', immediateRender: false }, t);
        else if (kind === 'zoom') { tl.set('#s' + n, { transformOrigin: `${cx || 540}px ${cy || 960}px` }, t); tl.fromTo('#s' + n, { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }, t); zoomGrid(t); }
        else tl.fromTo('#s' + n, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(2400px at ${cx}px ${cy}px)`, duration: 0.8, ease: 'power3.inOut', immediateRender: false }, t);
        if (kind === 'zoom') tl.fromTo('#s' + (n - 1), { scale: 1 }, { scale: 1.9, duration: 0.55, ease: 'power2.in', immediateRender: false }, t); else tl.fromTo('#s' + (n - 1), { scale: 1 }, { scale: 0.93, duration: 0.7, ease: 'power2.out', immediateRender: false }, t);
        tl.set('#s' + (n - 1), { display: 'none' }, t + 0.85);
        tl.fromTo('#c' + n, { scale: 1 }, { scale: 1.045, duration: ST(n + 1) - t + 0.9, ease: 'none', immediateRender: false }, t); };

      // ---- background ----
      add('<div id="bl1" style="position:absolute;left:560px;top:-260px;width:900px;height:900px;border-radius:50%;background:radial-gradient(closest-side,rgba(34,166,90,0.13),transparent)"></div>');
      const LOGOS = ['chatgpt', 'canva', 'capcut', 'lovable', 'zapier'];
      const bez = (p0, c, p1, k) => { const u = 1 - k; return [u * u * p0[0] + 2 * u * k * c[0] + k * k * p1[0], u * u * p0[1] + 2 * u * k * c[1] + k * k * p1[1]]; };

      // ============ S1  HOOK  [neon silhouette + agent swarm] on a dark scene ============
      const SWN = 36; let swd = '';
      for (let i = 0; i < SWN; i++) { const a = i * 2 * Math.PI / SWN, rr = 300 + (i % 3) * 32, sz = 14 + (i % 4) * 4; swd += `<div id="sw${i}" class="dot" style="left:${(Math.cos(a) * rr - sz / 2).toFixed(0)}px;top:${(Math.sin(a) * rr - sz / 2).toFixed(0)}px;width:${sz}px;height:${sz}px;background:${i % 2 ? '#FBBF24' : '#4ADE80'}"></div>`; }
      const NEON = (id, w, op) => `<g fill="none" stroke="#4ADE80" stroke-width="${w}" stroke-linecap="round" opacity="${op}"><circle id="${id}h" cx="200" cy="150" r="95" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path id="${id}b" d="M30 740 L30 520 C30 400 110 330 200 330 C290 330 370 400 370 520 L370 740" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></g>`;
      add(SC(1, `${streak('st1a', 520, 70, -18, 0.2, 1.1)}${streak('st1b', 1180, 60, -18, 0.6, 1.1)}
        <svg id="sil" style="position:absolute;left:340px;top:700px;width:400px;height:760px" viewBox="0 0 400 760">${NEON('n1', 30, 0.10)}${NEON('n2', 16, 0.24)}${NEON('n3', 6, 1)}</svg>
        <div id="h_lb" class="abs mono" style="left:340px;top:1478px;width:400px;font-size:26px;color:#9CA3AF">You</div>
        <div id="swr" class="orb" style="left:540px;top:1060px">${swd}</div>
        ${TX('h_q', 110, 480, '?', 'ng')}
        <div id="h_r1" class="ring" style="left:340px;top:130px;width:400px;height:400px;border-color:#4ADE80"></div>
        <div id="h_ai" class="btn3" style="left:380px;top:560px;width:320px;height:150px;font-size:100px">AI</div><div id="h_r2" class="ring" style="left:330px;top:520px;width:420px;height:230px;border-radius:115px;border-color:#FBBF24"></div>
        <div id="h_ca" class="nc" style="left:90px;top:230px;width:900px;height:200px"><img src="assets/img/ico-code.svg" style="position:absolute;left:36px;top:40px;width:110px;height:110px"><div class="t wh" style="left:180px;width:560px;top:56px;font-size:64px;text-align:left">NO CODING</div></div>
        <div id="h_cb" class="nc" style="left:90px;top:470px;width:900px;height:200px"><img src="assets/img/ico-palette.svg" style="position:absolute;left:36px;top:40px;width:110px;height:110px"><div class="t wh" style="left:180px;width:560px;top:56px;font-size:64px;text-align:left">NO DESIGN</div></div>
        ${IM('h_x1', 760, 250, 160, 'ico-x-circle')}${IM('h_x2', 760, 490, 160, 'ico-x-circle')}`));
      tl.set('#s1', { display: 'block' }, 0);
      ['n1', 'n2', 'n3'].forEach((p) => ['h', 'b'].forEach((q, k) => tl.fromTo('#' + p + q, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out', immediateRender: false }, 0.15 + k * 0.5)));
      tl.fromTo('#h_lb', { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, 1.6);
      pop('#h_q .w', 0.05, { s: 0.2, y: 0, e: 'elastic.out(1,0.5)', d: 1.1 }); ring('h_r1', 0.35, 0.6, 1.8, 1.2);
      tl.to('#h_q .w', { opacity: 0, scale: 0.4, y: -120, duration: 0.3, ease: 'power3.in' }, W(1, 'making') - 0.2);
      // agent swarm: dots fly in from everywhere, lock onto a ring around the silhouette and orbit it
      const tsw = W(1, 'making') - 0.1;
      for (let i = 0; i < SWN; i++) tl.fromTo('#sw' + i, { opacity: 0, scale: 0.3, x: (r01(i) - 0.5) * 2200, y: (r01(i + 5) - 0.5) * 2600 }, { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.9 + r01(i + 9) * 0.5, ease: 'power3.out', immediateRender: false }, tsw + i * 0.035);
      tl.fromTo('#swr', { rotation: 0 }, { rotation: 220, duration: W(1, 'even') - tsw, ease: 'none', immediateRender: false }, tsw);
      tl.to('#swr', { scale: 0.62, duration: 0.5, ease: 'power2.inOut' }, W(1, 'using') - 0.1);
      pop('#h_ai', W(1, 'using') + 0.05, { s: 0.2, y: 0, e: 'back.out(2.4)' }); ring('h_r2', W(1, 'using') + 0.2, 0.9, 1.9, 0.9);
      fadeOut('#h_ai', W(1, 'even') - 0.1, 0.25);
      for (let i = 0; i < SWN; i++) { const a = i * 2 * Math.PI / SWN; tl.to('#sw' + i, { x: Math.cos(a) * 800, y: Math.sin(a) * 800, opacity: 0, duration: 0.5, ease: 'power2.in' }, W(1, 'even') - 0.15 + i * 0.006); }
      pop('#h_ca', W(1, 'even') - 0.05, { x: -1100, y: 0, s: 1, e: 'expo.out', d: 0.7 }); pop('#h_cb', W(1, 'even') + 0.1, { x: 1100, y: 0, s: 1, e: 'expo.out', d: 0.7 });
      [['h_x1', 'coding'], ['h_x2', 'design']].forEach(([x, w]) => tl.fromTo('#' + x, { opacity: 0, scale: 3.2, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, W(1, w)));

      // ============ S2  GLASS BREAKS -> 5 AI TOOLS ============
      const GC = 4, GR = 6, CW = 1080 / GC, CH = 1920 / GR, IX = 540, IY = 800;
      let shards = ''; const smeta = [];
      for (let r = 0; r < GR; r++) for (let c = 0; c < GC; c++) { const id = r * GC + c; const j = (k) => (r01(id * 5 + k) - 0.5) * 0.4;
        const pts = [[j(1) * CW, j(2) * CH], [CW + 10 + j(3) * CW, j(4) * CH], [CW + 10 + j(5) * CW, CH + 10 + j(6) * CH], [j(7) * CW, CH + 10 + j(8) * CH]].map((p) => `${Math.max(0, p[0]).toFixed(0)}px ${Math.max(0, p[1]).toFixed(0)}px`).join(',');
        shards += `<div id="sg${id}" style="position:absolute;left:${c * CW - 5}px;top:${r * CH - 5}px;width:${CW + 10}px;height:${CH + 10}px;background:linear-gradient(${110 + r01(id) * 70}deg,rgba(255,255,255,0.88),rgba(176,222,196,0.62) 55%,rgba(255,255,255,0.8));clip-path:polygon(${pts})"></div>`; smeta.push([c * CW + CW / 2, r * CH + CH / 2]); }
      let cracks = ''; for (let i = 0; i < 14; i++) { const a = i * 0.4488 + (r01(i) - 0.5) * 0.25; let x = IX, y = IY, p = `${x},${y}`; const segs = 3 + (i % 3); for (let k = 0; k < segs; k++) { const L = 140 + r01(i * 7 + k) * 260; x += Math.cos(a + (r01(i * 3 + k) - 0.5) * 0.5) * L; y += Math.sin(a + (r01(i * 3 + k) - 0.5) * 0.5) * L; p += ` ${x.toFixed(0)},${y.toFixed(0)}`; } cracks += `<polyline id="cr${i}" points="${p}" fill="none" stroke="#111827" stroke-width="${i % 4 ? 3 : 5}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1500" stroke-dashoffset="1500"/>`; }
      add(SC(2, `${TX('f_n', 130, 560, '5', 'g')}${TX('f_t', 720, 160, 'AI TOOLS')}
        ${LOGOS.map((n, k) => LOGO3D('lf' + k, 60 + k * 185, 960, 160, n)).join('')}
        <div id="f_c1" class="ch3" style="left:90px;top:1220px;width:370px;height:112px"><img src="assets/img/ico-graduation-cap.svg"><span>SKILLS</span></div>
        <div id="f_ar" class="tilex" style="left:490px;top:1236px;width:80px;height:80px"><img src="assets/img/ico-arrow-right.svg"></div>
        <div id="f_c2" class="ch3" style="left:600px;top:1220px;width:390px;height:112px"><img src="assets/img/ico-briefcase.svg"><span>BUSINESS</span></div>
        <div id="f_rg" class="ring" style="left:240px;top:500px;width:600px;height:600px;border-color:#22A65A"></div>
        <div id="shg" style="position:absolute;left:0;top:0;width:1080px;height:1920px">${shards}</div>
        <svg id="crk" style="position:absolute;left:0;top:0;width:1080px;height:1920px" viewBox="0 0 1080 1920">${cracks}</svg>`));
      sceneIn(2, 'push');
      const cs = ST(2) + 0.1, ce = Math.max(cs + 0.5, SHT - 0.05);
      for (let i = 0; i < 14; i++) tl.fromTo('#cr' + i, { strokeDashoffset: 1500 }, { strokeDashoffset: 0, duration: (ce - cs) * (0.55 + r01(i) * 0.4), ease: 'power2.out', immediateRender: false }, cs + r01(i + 9) * (ce - cs) * 0.25);
      tl.set('#crk', { opacity: 0 }, SHT);
      smeta.forEach(([x, y], id) => { const d = Math.hypot(x - IX, y - IY); tl.fromTo('#sg' + id, { y: 0, x: 0, rotation: 0 }, { y: 2300 + r01(id) * 300, x: (x - IX) * 0.25 + (r01(id + 3) - 0.5) * 200, rotation: (r01(id + 6) - 0.5) * 140, duration: 1.1, ease: 'power2.in', immediateRender: false }, SHT + d / 1500 * 0.3); });
      tl.set('#shg', { display: 'none' }, SHT + 1.6);
      ring('f_rg', SHT, 0.3, 2.6, 1.3);
      pop('#f_n .w', SHT + 0.05, { s: 0.2, y: 0, e: 'back.out(2.2)', d: 0.7 }); drop('f_t', SHT + 0.2, 0.15);
      LOGOS.forEach((n, k) => flip('lf' + k, SHT + 0.3 + k * 0.12, ST(3) - SHT - 0.5));
      pop('#f_c1', W(2, 'skills') - 0.15, { x: -300, y: 0, s: 1, e: 'expo.out' }); pop('#f_ar', W(2, 'into') - 0.1, { s: 0.2, y: 0 }); pop('#f_c2', W(2, 'business') - 0.15, { x: 300, y: 0, s: 1, e: 'expo.out' });

      // ============ S3-S7  TOOLS  [orbit: the features orbit the 3D logo; digital zoom / push / iris transitions; agent swarm on Zapier] ============
      const MOT = {
        3: (n, t) => { add2(n, `<div id="m3u" class="bub" style="left:340px;top:440px;width:660px;background:#111827;color:#fff;font-size:28px;border-bottom-right-radius:8px">Write a launch post for my bakery</div>
            <div id="m3a" class="bub" style="left:80px;top:550px;width:760px;height:150px;background:#fff;border:1px solid rgba(17,24,39,.08);box-shadow:0 14px 30px rgba(17,24,39,.10);border-bottom-left-radius:8px"></div>
            <div id="m3b0" class="bar" style="left:120px;top:585px;width:680px;height:16px;background:rgba(21,128,61,.40)"></div><div id="m3b1" class="bar" style="left:120px;top:625px;width:560px;height:16px;background:rgba(21,128,61,.30)"></div><div id="m3b2" class="bar" style="left:120px;top:665px;width:380px;height:16px;background:rgba(245,158,11,.55)"></div>`);
          pop('#m3u', t, { x: 160, y: 0, s: 0.9, e: 'expo.out' }); pop('#m3a', t + 0.5, { x: -160, y: 0, s: 0.9, e: 'expo.out' });
          [0, 1, 2].forEach((k) => tl.fromTo('#m3b' + k, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power3.out', immediateRender: false }, t + 0.9 + k * 0.18)); },
        4: (n, t) => { add2(n, [0, 1, 2].map((k) => `<div id="m4_${k}" class="card3" style="left:${110 + k * 310}px;top:440px;width:280px;height:250px;opacity:0">${['<div style="position:absolute;left:70px;top:36px;width:140px;height:140px;border-radius:50%;background:#22A65A"></div><div style="position:absolute;left:30px;top:196px;width:220px;height:18px;border-radius:9px;background:#111827"></div>', '<div style="position:absolute;left:30px;top:34px;width:220px;height:110px;border-radius:16px;background:#F59E0B"></div><div style="position:absolute;left:30px;top:164px;width:150px;height:16px;border-radius:8px;background:#111827"></div><div style="position:absolute;left:30px;top:196px;width:100px;height:16px;border-radius:8px;background:rgba(17,24,39,.25)"></div>', '<div style="position:absolute;left:0;top:0;width:280px;height:250px;border-radius:28px;background:#111827"></div><div style="position:absolute;left:34px;top:52px;width:200px;height:26px;border-radius:13px;background:#86EFAC"></div><div style="position:absolute;left:34px;top:104px;width:140px;height:20px;border-radius:10px;background:#FCD34D"></div>'][k]}</div>`).join(''));
          [0, 1, 2].forEach((k) => tl.fromTo('#m4_' + k, { opacity: 0, x: (1 - k) * 310, rotation: (k - 1) * -12, scale: 0.7 }, { opacity: 1, x: 0, rotation: (k - 1) * 3, scale: 1, duration: 0.75, ease: 'back.out(1.5)', immediateRender: false }, t + k * 0.12)); },
        5: (n, t) => { add2(n, `<div id="m5t" class="card3" style="left:90px;top:470px;width:900px;height:190px;opacity:0"></div>${[0, 1, 2, 3, 4, 5].map((k) => `<div id="m5_${k}" class="blk" style="left:${116 + k * 142}px;top:500px;width:128px;height:130px;background:${['#22A65A', '#F59E0B', '#111827', '#15803D', '#F59E0B', '#22A65A'][k]};transform-origin:center bottom"></div>`).join('')}<div id="m5p" style="position:absolute;left:104px;top:445px;width:8px;height:240px;border-radius:4px;background:#111827;opacity:0"></div>`);
          pop('#m5t', t, { y: 40, s: 0.96 }); [0, 1, 2, 3, 4, 5].forEach((k) => tl.fromTo('#m5_' + k, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.45, ease: 'back.out(1.6)', immediateRender: false }, t + 0.3 + k * 0.1));
          tl.fromTo('#m5p', { opacity: 0, x: 0 }, { opacity: 1, x: 790, duration: 2.2, ease: 'none', immediateRender: false }, t + 0.9); tl.set('#m5p', { opacity: 0 }, t + 3.15); },
        6: (n, t) => { add2(n, `<div id="m6f" class="card3" style="left:110px;top:440px;width:860px;height:260px;opacity:0"><div style="position:absolute;left:28px;top:22px;width:16px;height:16px;border-radius:50%;background:#111827;opacity:.2"></div><div style="position:absolute;left:54px;top:22px;width:16px;height:16px;border-radius:50%;background:#111827;opacity:.2"></div></div>
            <div id="m6h" class="blk" style="left:140px;top:500px;width:400px;height:170px;background:linear-gradient(120deg,#15803D,#F59E0B)"></div><div id="m6a" class="bar" style="left:580px;top:510px;width:350px;height:20px;background:#111827"></div><div id="m6b" class="bar" style="left:580px;top:552px;width:290px;height:16px;background:rgba(17,24,39,.25)"></div><div id="m6c" class="bar" style="left:580px;top:588px;width:320px;height:16px;background:rgba(17,24,39,.25)"></div><div id="m6d" class="blk" style="left:580px;top:628px;width:170px;height:46px;background:#15803D"></div>
            <div id="m6p" class="pill" style="left:720px;top:408px;width:250px;height:62px;background:#111827;color:#fff;font-size:26px">NO CODE</div>`);
          pop('#m6f', t, { y: 40, s: 0.96 }); ['m6h', 'm6a', 'm6b', 'm6c', 'm6d'].forEach((id, k) => tl.fromTo('#' + id, { opacity: 0, scale: 0.6, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.8)', immediateRender: false }, t + 0.35 + k * 0.22)); pop('#m6p', t + 1.7, { s: 0.2, y: 0, e: 'back.out(2.4)' }); },
        7: (n, t) => { const sats = [[130, 420, 'chatgpt'], [130, 600, 'canva'], [850, 420, 'capcut'], [850, 600, 'lovable']]; const cxm = 540, cym = 565;
          add2(n, sats.map(([x, y], k) => { const dx = x + 50 - cxm, dy = y + 50 - cym, L = Math.hypot(dx, dy), a = Math.atan2(dy, dx) * 180 / Math.PI; return `<div id="m7l${k}" class="bar" style="left:${cxm}px;top:${cym - 5}px;width:${L.toFixed(0)}px;height:10px;background:#F59E0B;transform:rotate(${a.toFixed(1)}deg)"></div>`; }).join('') + sats.map(([x, y, lg], k) => IM('m7s' + k, x, y, 100, 'app-' + lg)).join('') + IM('m7c', 465, 490, 150, 'app-zapier')
            + sats.map((s, k) => [0, 1, 2].map((j) => `<div id="m7d${k}_${j}" class="dot" style="left:${cxm - 8}px;top:${cym - 8}px;width:16px;height:16px;background:${j % 2 ? '#15803D' : '#111827'}"></div>`).join('')).join(''));
          pop('#m7c', t, { s: 0.2, y: 0, e: 'back.out(2.2)' });
          sats.forEach((s, k) => { tl.fromTo('#m7l' + k, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power3.out', immediateRender: false }, t + 0.35 + k * 0.15); pop('#m7s' + k, t + 0.7 + k * 0.15, { s: 0.2, y: 0 });
            // agent swarm: little agents shuttle work between the apps and the hub
            [0, 1, 2].forEach((j) => { const t0 = t + 1.4 + j * 0.34 + k * 0.08; tl.fromTo('#m7d' + k + '_' + j, { opacity: 1, x: 0, y: 0 }, { opacity: 1, x: s[0] + 50 - cxm, y: s[1] + 50 - cym, duration: 1.0, ease: 'none', repeat: 3, immediateRender: false }, t0); tl.set('#m7d' + k + '_' + j, { opacity: 0 }, t0 + 4.05); }); }); } };
      const add2 = (n, html) => document.getElementById('mw' + n).insertAdjacentHTML('beforeend', html);
      const TOOL = (n, c) => { const { line, name, logo, nameWord, items, kind, cx, cy, num, pa, pb } = c, S0 = ST(n), S1 = ST(n + 1), R = 235, rot = 300;
        add(SC(n, `<div id="rg${n}" style="position:absolute;left:${540 - R}px;top:${360 - R}px;width:${2 * R}px;height:${2 * R}px;border-radius:50%;border:3px dashed rgba(17,24,39,0.20);opacity:0"></div>
          <div id="ob${n}" class="orb" style="left:540px;top:360px">${items.map((it, k) => { const a = k * 2 * Math.PI / items.length - Math.PI / 2; return `<div id="oi${n}_${k}" class="tilex" style="left:${(R * Math.cos(a) - 42).toFixed(0)}px;top:${(R * Math.sin(a) - 42).toFixed(0)}px;width:84px;height:84px"><img src="assets/img/ico-${it[0]}.svg"></div>`; }).join('')}</div>
          ${LOGO3D('lg' + n, 420, 240, 240, logo)}
          ${TX('nm' + n, 650, 140, name)}<div id="lb${n}" class="abs mono" style="left:60px;top:852px;width:960px;font-size:24px">Tool ${num} of 5</div>
          ${items.map((it, k) => `<div id="ch${n}_${k}" class="ch3" style="left:90px;top:${900 + k * 126}px;width:900px;height:108px"><img src="assets/img/ico-${it[0]}.svg"><span>${it[1]}</span><img id="ck${n}_${k}" class="ok" src="assets/img/ico-check-circle.svg"></div>`).join('')}
          <div id="mw${n}" style="position:absolute;left:0;top:0;width:1080px;height:1920px"></div>
          ${PERSON('pa' + n, 14, 1000, 0.78, '#15803D', pa)}${PERSON('pb' + n, 1022, 1130, 0.62, '#D97706', pb)}`));
        sceneIn(n, kind, cx, cy);
        tl.set('#mw' + n, { y: 990, scale: 0.8, transformOrigin: '540px 430px' }, 0);
        const tn = W(line, nameWord); flip('lg' + n, S0 + 0.25, S1 - S0 - 0.6);
        tl.fromTo('#rg' + n, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', immediateRender: false }, S0 + 0.3);
        tl.fromTo('#ob' + n, { rotation: 0 }, { rotation: rot, duration: S1 - S0 + 1, ease: 'none', immediateRender: false }, S0);
        items.forEach((it, k) => { tl.fromTo('#oi' + n + '_' + k, { rotation: 0 }, { rotation: -rot, duration: S1 - S0 + 1, ease: 'none', immediateRender: false }, S0); tl.fromTo('#oi' + n + '_' + k, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(2)', immediateRender: false }, W(line, it[2]) - 0.1); });
        drop('nm' + n, Math.min(tn - 0.05, S0 + 0.9)); tl.fromTo('#lb' + n, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, S0 + 0.9);
        MOT[n](n, tn + 0.3);
        items.forEach((it, k) => { const t = W(line, it[2]) - 0.15; tl.fromTo('#ch' + n + '_' + k, { opacity: 0, x: k % 2 ? 1100 : -1100, rotation: k % 2 ? 5 : -5 }, { opacity: 1, x: 0, rotation: 0, duration: 0.65, ease: 'expo.out', immediateRender: false }, t); tl.fromTo('#ck' + n + '_' + k, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)', immediateRender: false }, t + 0.45); });
        pop('#pa' + n, S0 + 1.0, { y: 70, s: 1, e: 'bounce.out', d: 0.8 }); pop('#pb' + n, S0 + 1.3, { y: 70, s: 1, e: 'bounce.out', d: 0.8 }); bob('#pa' + n, S0 + 2.2, S1 - 0.2, 8, 1.1); bob('#pb' + n, S0 + 2.4, S1 - 0.2, 8, 1.3); };
      TOOL(3, { num: 1, name: 'ChatGPT', logo: 'chatgpt', line: 3, nameWord: 'chatgpt', kind: 'zoom', cx: 540, cy: 360, pa: 'point', pb: 'stand', items: [['pen-nib', 'Write content', 'write'], ['magnifying-glass', 'Research ideas', 'research'], ['strategy', 'Marketing strategies', 'marketing'], ['list-checks', 'Everyday tasks', 'everyday']] });
      TOOL(4, { num: 2, name: 'Canva', logo: 'canva', line: 4, nameWord: 'canva', kind: 'push', pa: 'up', pb: 'point', items: [['image', 'Social media designs', 'social'], ['presentation-chart', 'Presentations', 'presentations'], ['megaphone', 'Advertisements', 'advertisements'], ['package', 'Digital products', 'digital']] });
      TOOL(5, { num: 3, name: 'CapCut', logo: 'capcut', line: 5, nameWord: 'capcut', kind: 'iris', cx: 540, cy: 360, pa: 'stand', pb: 'up', items: [['film-strip', 'Short-form video editing', 'short'], ['storefront', 'For businesses', 'businesses'], ['users-three', 'For content creators', 'content']] });
      TOOL(6, { num: 4, name: 'Lovable', logo: 'lovable', line: 6, nameWord: 'lovable', kind: 'zoom', cx: 540, cy: 360, pa: 'point', pb: 'stand', items: [['browser', 'Websites', 'websites'], ['app-window', 'Simple applications', 'simple'], ['graduation-cap', 'No programmer needed', 'programmer']] });
      TOOL(7, { num: 5, name: 'Zapier', logo: 'zapier', line: 7, nameWord: 'zapier', kind: 'push', pa: 'up', pb: 'point', items: [['arrows-clockwise', 'Automate repetitive tasks', 'automate'], ['plugs-connected', 'Connect their apps', 'connect'], ['hourglass', 'Save hours of work', 'save']] });

      // ============ S8  "Here's the interesting part."  [digital zoom in] bulb drops, rays burst ============
      let rays8 = ''; for (let i = 0; i < 12; i++) rays8 += `<div class="rw" style="left:540px;top:660px;transform:rotate(${i * 30}deg)"><div id="r8_${i}" class="rb" style="left:260px;width:150px;height:12px;background:${i % 2 ? '#F59E0B' : '#22A65A'};transform-origin:left center"></div></div>`;
      add(SC(8, `${rays8}${IM('b8', 360, 460, 360, 'ico-lightbulb')}${TX('t8a', 1070, 150, "HERE'S THE")}${TX('t8b', 1230, 150, 'INTERESTING')}${TX('t8c', 1390, 200, 'PART', 'g')}`));
      sceneIn(8, 'zoom', 540, 660);
      tl.fromTo('#b8', { opacity: 0, y: -900 }, { opacity: 1, y: 0, duration: 1.0, ease: 'bounce.out', immediateRender: false }, ST(8) + 0.25);
      for (let i = 0; i < 12; i++) { tl.fromTo('#r8_' + i, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: false }, ST(8) + 1.0 + i * 0.03); tl.to('#r8_' + i, { opacity: 0.45, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, ST(8) + 1.5 + i * 0.03); }
      drop('t8a', ST(8) + 0.3, 0.12); drop('t8b', W(8, 'interesting') - 0.1, 0.1); drop('t8c', W(8, 'part') - 0.05, 0.1);

      // ============ S9  "You don't need to master all five tools." ============
      add(SC(9, `${TX('t9a', 160, 190, 'NO NEED')}${TX('t9b', 410, 160, 'TO MASTER', 'm')}${TX('t9c', 600, 190, 'ALL FIVE', 'g')}
        ${LOGOS.map((n, k) => LOGO3D('lh' + k, 60 + k * 185, 930, 160, n)).join('')}
        <div id="s9k" class="bar" style="left:80px;top:1003px;width:920px;height:16px;background:#111827"></div>
        <div id="s9m" class="abs mono" style="left:60px;top:1210px;width:960px;font-size:32px;color:#15803D">One is enough</div>`));
      sceneIn(9, 'push');
      drop('t9a', W(9, 'need') - 0.15, 0.12); drop('t9b', W(9, 'master') - 0.1, 0.12); drop('t9c', W(9, 'all') - 0.1, 0.12);
      LOGOS.forEach((n, k) => flip('lh' + k, W(9, 'five') - 0.1 + k * 0.08, 3));
      tl.fromTo('#s9k', { opacity: 1, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, W(9, 'tools') + 0.1);
      LOGOS.forEach((n, k) => { if (k !== 2) tl.to('#lh' + k, { opacity: 0.25, duration: 0.4 }, W(9, 'tools') + 0.5); });
      tl.fromTo('#s9m', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, W(9, 'tools') + 0.6);

      // ============ S10  four steps as a MAP ROUTE: pins along a winding route, a marker travels it ============
      const RP = [[230, 560], [800, 820], [260, 1080], [790, 1340]];
      const RC = [[[560, 560], [470, 820]], [[470, 820], [530, 1080]], [[560, 1080], [480, 1340]]];
      const RSTEPS = [['graduation-cap', 'Pick one tool', 'pick'], ['book-open', 'Learn how to use it', 'learn'], ['image', 'Create a few examples', 'create'], ['handshake', 'Offer it to businesses', 'offer']];
      const cub = (p0, c1, c2, p1, k) => { const u = 1 - k; return [u * u * u * p0[0] + 3 * u * u * k * c1[0] + 3 * u * k * k * c2[0] + k * k * k * p1[0], u * u * u * p0[1] + 3 * u * u * k * c1[1] + 3 * u * k * k * c2[1] + k * k * k * p1[1]]; };
      const segD = (k) => `M${RP[k][0]} ${RP[k][1]} C${RC[k][0][0]} ${RC[k][0][1]} ${RC[k][1][0]} ${RC[k][1][1]} ${RP[k + 1][0]} ${RP[k + 1][1]}`;
      add(SC(10, `<svg style="position:absolute;left:0;top:0;width:1080px;height:1920px" viewBox="0 0 1080 1920"><path d="M-20 420 L1100 520 M-20 1240 L1100 1180 M120 380 L170 1500 M700 380 L650 1500 M960 420 L930 1500" stroke="rgba(17,24,39,0.05)" stroke-width="30" fill="none" stroke-linecap="round"/><rect x="380" y="900" width="230" height="130" rx="30" fill="rgba(34,166,90,0.10)"/><rect x="760" y="1120" width="220" height="110" rx="30" fill="rgba(34,166,90,0.10)"/><rect x="70" y="620" width="190" height="120" rx="30" fill="rgba(245,158,11,0.10)"/>
          ${[0, 1, 2].map((k) => `<path d="${segD(k)}" fill="none" stroke="rgba(17,24,39,0.18)" stroke-width="10" stroke-linecap="round" stroke-dasharray="1 22"/>`).join('')}
          ${[0, 1, 2].map((k) => `<path id="rs${k}" d="${segD(k)}" fill="none" stroke="#15803D" stroke-width="12" stroke-linecap="butt" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1"/>`).join('')}</svg>
        ${TX('t10', 140, 150, 'YOUR ROUTE', 'g')}
        ${RSTEPS.map((s, k) => `<div id="pn${k}" class="pin" style="left:${RP[k][0] - 48}px;top:${RP[k][1] - 48}px">${k + 1}</div><div id="rl${k}" class="rlab" style="left:${k % 2 ? 540 : 60}px;top:${k === 2 ? RP[k][1] + 70 : RP[k][1] - 190}px;width:440px"><img src="assets/img/ico-${s[0]}.svg"><span>${s[1]}</span></div>`).join('')}
        <div id="mk" style="position:absolute;left:-20px;top:-20px;width:40px;height:40px;border-radius:50%;background:#F59E0B;border:6px solid #fff;box-shadow:0 8px 18px rgba(17,24,39,.25);opacity:0"></div>`));
      sceneIn(10, 'iris', 540, 1000);
      drop('t10', ST(10) + 0.3, 0.12);
      const tp = RSTEPS.map((s) => W(10, s[2]) - 0.1);
      tl.set('#mk', { x: RP[0][0], y: RP[0][1] }, 0);
      tl.fromTo('#mk', { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, tp[0] + 0.1);
      RSTEPS.forEach((s, k) => { tl.fromTo('#pn' + k, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)', immediateRender: false }, tp[k]); pop('#rl' + k, tp[k] + 0.1, { y: 30, s: 0.9 });
        if (k > 0) { const d1 = tp[k] - 0.05, d0 = Math.max(tp[k - 1] + 0.5, d1 - 0.95), seg = k - 1; tl.fromTo('#rs' + seg, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d1 - d0, ease: 'power1.inOut', immediateRender: false }, d0);
          const NS = 14; for (let q = 0; q < NS; q++) { const a = cub(RP[seg], RC[seg][0], RC[seg][1], RP[seg + 1], q / NS), b = cub(RP[seg], RC[seg][0], RC[seg][1], RP[seg + 1], (q + 1) / NS); tl.fromTo('#mk', { x: a[0], y: a[1] }, { x: b[0], y: b[1], duration: (d1 - d0) / NS, ease: 'none', immediateRender: false }, d0 + q * (d1 - d0) / NS); } } });

      // ============ S11  "selling a solution" [git city]: a skyline of commits grows; the tall green tower is your solution ============
      const BX = (i) => 60 + i * 80, BASE = 1500, BHT = [190, 320, 260, 240, 300, 220, 380, 520, 760, 280, 430, 250], PB = 3, SB = 8;
      add(SC(11, `<svg width="0" height="0" style="position:absolute"><defs><pattern id="win" width="24" height="30" patternUnits="userSpaceOnUse"><rect x="5" y="6" width="12" height="16" rx="2" fill="#FCD34D"/></pattern></defs></svg>
        ${TX('t11a', 190, 150, 'SELLING AI')}<div id="k11" class="bar" style="left:130px;top:262px;width:820px;height:16px;background:#111827"></div>${TX('t11b', 400, 160, 'A SOLUTION', 'g')}
        ${BHT.map((h, i) => `<div id="b11_${i}" style="position:absolute;left:${BX(i)}px;top:${BASE - h}px;width:72px;height:${h}px;border-radius:8px 8px 0 0;overflow:hidden;opacity:0;transform-origin:center bottom;background:${i === SB ? '#15803D' : i === PB ? '#374151' : 'rgba(17,24,39,0.13)'}"><svg id="w11_${i}" width="72" height="${h}" style="position:absolute;left:0;top:0;opacity:0"><rect width="72" height="${h}" fill="url(#win)"/></svg></div>`).join('')}
        <div id="g11" class="bar" style="left:40px;top:${BASE}px;width:1000px;height:10px;background:#111827"></div>
        ${IM('w11', BX(PB) - 4, BASE - BHT[PB] - 96, 80, 'ico-warning')}${IM('chk11', BX(SB) - 9, BASE - BHT[SB] - 110, 90, 'ico-check-circle')}
        <div id="lp11" class="abs mono" style="left:${BX(PB) - 100}px;top:${BASE + 26}px;width:272px;font-size:20px;text-indent:0">Real problem</div><div id="ls11" class="abs mono" style="left:${BX(SB) - 100}px;top:${BASE + 26}px;width:272px;font-size:20px;text-indent:0;color:#15803D">Your solution</div>`));
      sceneIn(11, 'push');
      drop('t11a', LS(11) - 0.05, 0.12); tl.fromTo('#k11', { opacity: 1, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.4, ease: 'power3.out', immediateRender: false }, W(11, 'ai') + 0.35); tl.to('#t11a .w', { opacity: 0.35, duration: 0.3 }, W(11, 'ai') + 0.5);
      drop('t11b', W(11, 'solution') - 0.1, 0.12);
      const tc = W(11, 'solution') - 0.1; let ci = 0;
      BHT.forEach((h, i) => { if (i === PB || i === SB) return; const t = tc + ci * 0.09; ci++; tl.fromTo('#b11_' + i, { opacity: 1, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.65, ease: 'back.out(1.2)', immediateRender: false }, t); tl.fromTo('#w11_' + i, { opacity: 0 }, { opacity: 0.35 + r01(i) * 0.5, duration: 0.5, immediateRender: false }, t + 0.55 + r01(i + 3) * 0.6); });
      tl.fromTo('#b11_' + PB, { opacity: 1, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.6, ease: 'back.out(1.3)', immediateRender: false }, W(11, 'real') - 0.2); pop('#w11', W(11, 'real') + 0.2, { s: 0.2, y: 0, e: 'back.out(2.4)' }); tl.fromTo('#lp11', { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, W(11, 'real') + 0.3);
      const tsb = W(11, 'problem') + 0.3;
      tl.fromTo('#b11_' + SB, { opacity: 1, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 1.0, ease: 'power3.out', immediateRender: false }, tsb); tl.fromTo('#w11_' + SB, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, tsb + 0.6);
      pop('#chk11', tsb + 0.9, { s: 0.2, y: 0, e: 'back.out(2.4)' }); tl.fromTo('#ls11', { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, tsb + 1.0);

      // ============ S12  rich overnight? -> [deep time] years race forward through the opening doors ============
      const TICKS12 = Array.from({ length: 12 }, (_, i) => `<div style="position:absolute;left:176px;top:6px;width:8px;height:${i % 3 ? 22 : 36}px;border-radius:4px;background:#111827;transform-origin:4px 174px;transform:rotate(${i * 30}deg)"></div>`).join('');
      const YRS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
      add(SC(12, `${TX('t12a', 180, 220, 'RICH', 'g')}${TX('t12b', 420, 150, 'OVERNIGHT?')}
        <div id="clk" style="position:absolute;left:360px;top:760px;width:360px;height:360px;border-radius:50%;background:#fff;border:8px solid #111827;opacity:0;box-shadow:0 16px 36px rgba(17,24,39,.12)">${TICKS12}<div id="hnd" style="position:absolute;left:170px;top:36px;width:12px;height:148px;border-radius:6px;background:#111827;transform-origin:6px 144px"></div><div id="hnh" style="position:absolute;left:170px;top:76px;width:14px;height:108px;border-radius:7px;background:#15803D;transform-origin:7px 104px"></div></div>${IM('mn12', 760, 740, 130, 'ico-moon-stars')}
        <div id="lt12" style="position:absolute;left:290px;top:560px;width:500px;height:620px;border-radius:30px;background:radial-gradient(closest-side,#FFF7D6,#F59E0B);opacity:0;overflow:hidden">
          ${[0, 1, 2].map((k) => `<div id="dt${k}" style="position:absolute;left:100px;top:160px;width:300px;height:300px;border-radius:50%;border:6px solid ${k % 2 ? 'rgba(255,255,255,0.9)' : 'rgba(21,128,61,0.55)'};opacity:0"></div>`).join('')}
          ${YRS.map((y, i) => `<div id="yr${i}" class="t" style="left:0;width:500px;top:230px;font-size:130px;opacity:0">${y}</div>`).join('')}
          <div id="yn" class="mono" style="position:absolute;left:0;top:410px;width:500px;font-size:30px;color:#15803D;opacity:0">Now</div></div>
        <div id="dl12" style="position:absolute;left:290px;top:560px;width:250px;height:620px;border-radius:30px 0 0 30px;background:#15803D;transform-origin:left center;opacity:0"></div><div id="dr12" style="position:absolute;left:540px;top:560px;width:250px;height:620px;border-radius:0 30px 30px 0;background:#0E5C2B;transform-origin:right center;opacity:0"></div>
        ${TX('t12c', 180, 170, 'OPEN DOORS', 'g')}
        ${['rocket-launch', 'chart-line-up', 'storefront', 'laptop', 'handshake'].map((f, k) => IM('n12_' + k, 60 + k * 185, 1250, 150, 'ico-' + f)).join('')}${TX('t12d', 1430, 120, 'OPPORTUNITIES', 'g')}`));
      sceneIn(12, 'zoom', 540, 760);
      drop('t12a', ST(12) + 0.3, 0.1); drop('t12b', W(12, 'overnight') - 0.1, 0.1);
      pop('#clk', ST(12) + 0.5, { s: 0.3, y: 0 }); pop('#mn12', W(12, 'overnight'), { s: 0.2, y: 0 });
      tl.fromTo('#hnd', { rotation: 0 }, { rotation: 1080, duration: W(12, 'but') - ST(12) - 0.6, ease: 'power2.inOut', immediateRender: false }, ST(12) + 0.8); tl.fromTo('#hnh', { rotation: 0 }, { rotation: 90, duration: W(12, 'but') - ST(12) - 0.6, ease: 'power2.inOut', immediateRender: false }, ST(12) + 0.8);
      tl.to(['#t12a', '#t12b', '#clk', '#mn12'], { x: -1300, duration: 0.5, ease: 'power3.in' }, W(12, 'but') - 0.1);
      tl.set(['#lt12', '#dl12', '#dr12'], { opacity: 1 }, W(12, 'but') + 0.35);
      tl.fromTo(['#lt12', '#dl12', '#dr12'], { x: 1300 }, { x: 0, duration: 0.6, ease: 'expo.out', immediateRender: false }, W(12, 'but') + 0.3);
      const to12 = W(12, 'open') - 0.05; tl.to('#dl12', { scaleX: 0.12, duration: 0.9, ease: 'power3.inOut' }, to12); tl.to('#dr12', { scaleX: 0.12, duration: 0.9, ease: 'power3.inOut' }, to12);
      drop('t12c', W(12, 'open') + 0.1, 0.12);
      for (let k = 0; k < 3; k++) tl.fromTo('#dt' + k, { scale: 0.1, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 1.4, ease: 'power1.in', repeat: Math.ceil((ST(13) - to12) / 1.4) + 1, immediateRender: false }, to12 + 0.1 + k * 0.47);
      const ty0 = to12 + 0.35, tyd = Math.max(0.16, (W(12, 'opportunities') - ty0) / YRS.length);
      YRS.forEach((y, i) => { const a = ty0 + i * tyd; tl.fromTo('#yr' + i, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.08, ease: 'power2.out', immediateRender: false }, a); if (i < YRS.length - 1) tl.to('#yr' + i, { opacity: 0, duration: 0.05 }, a + tyd - 0.04); });
      tl.fromTo('#yn', { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, ty0 + (YRS.length - 1) * tyd + 0.1);
      for (let k = 0; k < 5; k++) tl.fromTo('#n12_' + k, { opacity: 0, x: 540 - (60 + k * 185 + 75), y: -460, scale: 0.2 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.6)', immediateRender: false }, W(12, 'opportunities') - 0.1 + k * 0.1);
      drop('t12d', W(12, 'opportunities') + 0.1, 0.1);

      // ============ S13  CTA  [global arcs] on a dot-matrix world map, logos as pins ============
      const MX = 60, MY = 1135, MW = 960, MHH = 390, proj = (lo, la) => [MX + (lo + 180) / 360 * MW, MY + (80 - la) / 138 * MHH];
      const LAND = [[[-168, 66], [-140, 70], [-120, 72], [-95, 72], [-80, 73], [-62, 60], [-55, 50], [-67, 44], [-76, 35], [-81, 25], [-97, 26], [-105, 20], [-95, 16], [-85, 10], [-79, 8], [-92, 15], [-105, 22], [-117, 32], [-124, 40], [-125, 50], [-140, 59], [-152, 59], [-165, 62]],
        [[-80, 10], [-62, 11], [-50, 0], [-35, -6], [-40, -22], [-48, -28], [-58, -38], [-65, -45], [-70, -55], [-75, -48], [-72, -30], [-70, -18], [-81, -5]],
        [[-10, 36], [-9, 43], [-2, 48], [-5, 52], [5, 58], [10, 64], [20, 70], [30, 70], [40, 66], [38, 56], [40, 46], [28, 41], [20, 38], [12, 38], [2, 38]],
        [[-17, 21], [-10, 32], [10, 37], [32, 31], [43, 12], [51, 11], [40, -10], [35, -25], [20, -35], [12, -17], [9, 4], [-8, 4], [-17, 14]],
        [[30, 70], [60, 73], [100, 77], [140, 72], [170, 66], [160, 55], [142, 46], [130, 35], [122, 30], [110, 20], [105, 10], [98, 8], [100, 17], [88, 22], [78, 8], [70, 22], [58, 25], [50, 30], [35, 32], [28, 41], [40, 46], [38, 56], [40, 66]],
        [[114, -22], [130, -12], [142, -11], [153, -26], [146, -39], [135, -35], [115, -34]]];
      const inPoly = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { if (((P[i][1] > y) !== (P[j][1] > y)) && (x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0])) c = !c; } return c; };
      let mdots = ''; for (let lo = -176; lo < 180; lo += 4.6) for (let la = 76; la > -56; la -= 4.4) if (LAND.some((P) => inPoly(lo, la, P))) { const p = proj(lo, la); mdots += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.2"/>`; }
      const CITY = { sf: [-122.4, 37.8], sao: [-46.6, -23.5], lon: [-0.1, 51.5], dxb: [55.3, 25.2], tyo: [139.7, 35.7] };
      const ARCS = [['sf', 'lon', 'chatgpt', 'lon'], ['lon', 'dxb', 'canva', 'dxb'], ['dxb', 'tyo', 'capcut', 'tyo'], ['sf', 'sao', 'lovable', 'sao'], ['lon', 'sao', 'zapier', 'sao']];
      const arcGeo = ARCS.map((a) => { const p0 = proj(...CITY[a[0]]), p1 = proj(...CITY[a[1]]); const cc = [(p0[0] + p1[0]) / 2, Math.min(p0[1], p1[1]) - 0.3 * Math.abs(p1[0] - p0[0]) - 30]; return { p0, p1, cc }; });
      add(SC(13, `${streak('st13a', 560, 80, -18, ST(13) + 0.3, 1.1)}
        ${TX('t13', 150, 210, 'COMMENT')}
        <div id="r13" class="ring" style="left:300px;top:390px;width:480px;height:200px;border-radius:100px;border-color:#15803D"></div><div id="r13b" class="ring" style="left:300px;top:390px;width:480px;height:200px;border-radius:100px;border-color:#F59E0B"></div>
        <div id="b13" class="btn3" style="left:340px;top:405px;width:400px;height:170px;font-size:110px">&ldquo;AI&rdquo;</div>
        <div id="c13a" class="ch3" style="left:90px;top:630px;width:900px;height:110px;font-size:42px"><img src="assets/img/ico-list-checks.svg"><span>Step-by-step tutorial</span></div>
        <div id="c13b" class="ch3" style="left:90px;top:760px;width:900px;height:110px;font-size:42px"><img src="assets/img/ico-envelope.svg"><span>Sent to your DMs!</span></div>
        <div id="th13" class="card3" style="left:90px;top:900px;width:900px;height:190px;opacity:0"><img src="assets/img/ico-user.svg" style="position:absolute;left:30px;top:24px;width:66px;height:66px"><div class="bub" id="u13" style="left:116px;top:20px;width:150px;height:70px;background:#111827;color:#fff;font-size:34px;padding:11px 28px;opacity:1">AI</div><img src="assets/img/ico-paper-plane-tilt.svg" style="position:absolute;left:810px;top:22px;width:70px;height:70px"><div id="a13" class="bub" style="left:116px;top:108px;width:560px;height:64px;background:rgba(21,128,61,.12);color:#15803D;font-size:28px;padding:13px 26px;opacity:1">Sent! Check your DMs</div></div>
        <svg id="gm" style="position:absolute;left:0;top:0;width:1080px;height:1920px" viewBox="0 0 1080 1920"><g id="gmd" fill="rgba(17,24,39,0.20)" opacity="0">${mdots}</g>
          ${arcGeo.map((g, k) => `<path id="ga${k}" d="M${g.p0[0].toFixed(1)} ${g.p0[1].toFixed(1)} Q${g.cc[0].toFixed(1)} ${g.cc[1].toFixed(1)} ${g.p1[0].toFixed(1)} ${g.p1[1].toFixed(1)}" fill="none" stroke="#F59E0B" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1"/>`).join('')}</svg>
        ${ARCS.map((a, k) => `<div id="gp${k}" class="dot" style="left:${arcGeo[k].p0[0] - 9}px;top:${arcGeo[k].p0[1] - 9}px;width:18px;height:18px;background:#15803D"></div>`).join('')}
        ${ARCS.map((a, k) => { const p = arcGeo[k].p1; return IM('gl' + k, p[0] - 32, p[1] - 32, 64, 'app-' + a[2]); }).join('')}`));
      sceneIn(13, 'push');
      drop('t13', W(13, 'comment') - 0.1, 0.1);
      pop('#b13', W(13, 'ai') - 0.1, { s: 0.2, y: 0, e: 'back.out(2.4)' }); for (let k = 0; k < 5; k++) { ring('r13', W(13, 'ai') + 0.2 + k * 1.1, 0.8, 1.6, 0.9); ring('r13b', W(13, 'ai') + 0.75 + k * 1.1, 0.8, 1.6, 0.9); }
      pop('#c13a', W(13, 'stepbystep') - 0.15, { x: -1100, y: 0, s: 1, e: 'expo.out' }); pop('#c13b', W(13, 'dms') - 0.2, { x: 1100, y: 0, s: 1, e: 'expo.out' });
      pop('#th13', W(13, 'dms') + 0.3, { y: 60, s: 0.95 }); tl.fromTo('#a13', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out', immediateRender: false }, W(13, 'dms') + 1.1);
      tl.fromTo('#gmd', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out', immediateRender: false }, ST(13) + 0.6);
      ARCS.forEach((a, k) => { const t0 = W(13, 'ai') + 1.0 + k * 0.62, d = 0.8, g = arcGeo[k];
        tl.fromTo('#gp' + k, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, t0 - 0.1);
        tl.fromTo('#ga' + k, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: 'power2.inOut', immediateRender: false }, t0);
        pop('#gl' + k, t0 + d - 0.05, { s: 0.2, y: 0, e: 'back.out(2.2)' }); ring('r13', t0 + d, 0.8, 0.9, 0.01); });

      // ============ HUD: editor timeline strip with a moving playhead (ref 04) + digital-zoom grid ============
      let seg = ''; for (let i = 1; i <= 13; i++) { const a = 60 + 960 * ST(i) / TOTAL, b = 60 + 960 * ST(i + 1) / TOTAL; seg += `<div style="position:absolute;left:${a.toFixed(1)}px;top:1750px;width:${(b - a - 4).toFixed(1)}px;height:16px;border-radius:8px;background:${i % 2 ? '#22A65A' : '#F59E0B'};opacity:.7"></div>`; }
      add(`<div class="hud"><div id="zg" style="position:absolute;left:0;top:0;width:1080px;height:1920px;opacity:0;background-image:linear-gradient(rgba(21,128,61,0.7) 3px,transparent 3px),linear-gradient(90deg,rgba(21,128,61,0.7) 3px,transparent 3px);background-size:120px 120px"></div><div class="mono" style="position:absolute;left:60px;top:1700px;width:600px;font-size:20px;text-align:left;text-indent:0">5 AI tools to make money</div>${seg}<div id="hph" style="position:absolute;left:60px;top:1730px;width:6px;height:56px;border-radius:3px;background:#111827"></div></div>`);
      tl.fromTo('#hph', { x: 0 }, { x: 954, duration: TOTAL, ease: 'none', immediateRender: false }, 0);
