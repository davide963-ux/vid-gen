      // ===== helpers =====
      const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');
      const LS = (n) => WORDS.find((w) => w.line === n).s;
      const LE = (n) => WORDS.filter((w) => w.line === n).slice(-1)[0].e;
      const WW = (n, p) => { const x = WORDS.find((w) => w.line === n && norm(w.w).startsWith(p)); if (!x) throw new Error('word not found: L' + n + ' ' + p); return x; };
      const W = (n, p) => WW(n, p).s;
      const TOTAL = WORDS[WORDS.length - 1].e + 1.6;
      const NO_CAPTION_LINES = [18];
      const pop = (sel, t, o = {}) => tl.fromTo(sel, { opacity: 0, scale: o.s || 0.5, y: o.y === undefined ? 40 : o.y, x: o.x || 0, rotation: o.r === undefined ? -6 : o.r }, { opacity: 1, scale: 1, y: 0, x: 0, rotation: 0, duration: o.d || 0.55, ease: o.e || 'back.out(1.9)', immediateRender: false }, t);
      const out = (sel, t, d) => tl.to(sel, { opacity: 0, scale: 0.92, duration: d || 0.25, ease: 'power2.in' }, t);
      const bob = (sel, from, to, amp, per) => { amp = amp || 14; per = per || 2.2; const n = Math.max(2, 2 * Math.round((to - from) / per)); tl.fromTo(sel, { y: 0 }, { y: -amp, duration: (to - from) / n, ease: 'sine.inOut', yoyo: true, repeat: n - 1, immediateRender: false }, from); };
      const ctr = (top, inner, h) => `<div class="ctr" style="position:absolute;left:60px;top:${top}px;width:900px;${h ? 'height:' + h + 'px;' : ''}display:flex;justify-content:center;align-items:center;gap:26px">${inner}</div>`;
      const H = (id, top, size, txt, color) => `<div id="${id}" class="abs headline" style="left:60px;top:${top}px;width:900px;font-size:${size}px;${color ? 'color:' + color + ';' : ''}">${txt}</div>`;
      const EMO = (id, l, t, s, f) => `<div id="${id}" class="emo" style="left:${l}px;top:${t}px;width:${s}px;height:${s}px"><img src="assets/img/ico-${f}.svg"></div>`;
      const BADGE = (id, top, n, col) => ctr(top, `<div id="${id}" class="badge" style="--bc:${col};position:relative;opacity:0"><span class="n">${n}</span><span>STEP ${n}</span></div>`);
      const lot = (id, file, l, t, w, h, t0, dur) => { add(`<div id="${id}" class="lot" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px"></div>`);
        tl.fromTo('#' + id, { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, t0); tl.to('#' + id, { opacity: 0, duration: 0.01 }, t0 + dur);
        const a = lottie.loadAnimation({ container: document.getElementById(id), renderer: 'svg', loop: false, autoplay: false, path: 'assets/lottie/' + file, rendererSettings: { preserveAspectRatio: 'xMidYMid meet' } }); (window.__hfLottie = window.__hfLottie || []).push(a); };

      // ===== backgrounds: one colour world per step, cross-faded =====
      const BG = [['#FF2E86', '#6B22F0'], ['#F2641A', '#D1206B'], ['#0E8FD6', '#4A2BC9'], ['#0A9B6B', '#0B5A8A'], ['#F0701A', '#C81E5E'], ['#7A44F0', '#E02F86']];
      add('<div id="bgs">' + BG.map((c, i) => `<div class="bgl" id="bg${i}" style="background:linear-gradient(160deg,${c[0]},${c[1]})"></div>`).join('') + '<div class="bgl" id="bgdots" style="opacity:1;background-image:radial-gradient(rgba(255,255,255,0.16) 3px, transparent 3px);background-size:64px 64px"></div></div>');
      tl.set('#bg0', { opacity: 1 }, 0);
      [[1, LS(3) - 0.15], [2, LS(6) - 0.15], [3, LS(9) - 0.15], [4, LS(13) - 0.15], [5, LS(16) - 0.15]].forEach(([i, t]) => tl.to('#bg' + i, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, t));
      // drifting colour blobs (deterministic)
      const BC = ['#FFFFFF', '#FFD23F', '#FF3D8B', '#19D3F3', '#2EE59D', '#8B5CFF'];
      for (let i = 0; i < 14; i++) { const sz = 60 + hashH(i) * 190, l = hashH(i + 20) * 1000 - 40, tp = hashH(i + 40) * 1800 - 40; const ring = i % 3 === 0;
        add(`<div id="dc${i}" class="deco" style="width:${sz}px;height:${sz}px;left:${l}px;top:${tp}px;${ring ? 'border:10px solid ' + BC[i % 6] : 'background:' + BC[i % 6]}"></div>`);
        tl.fromTo('#dc' + i, { opacity: 0.0, y: 0 }, { opacity: ring ? 0.35 : 0.18, y: (i % 2 ? -1 : 1) * (120 + hashH(i + 7) * 200), duration: TOTAL, ease: 'none', immediateRender: false }, 0); }

      // ============ S0 HOOK (L1) ============
      add(`<div class="sc" id="s0">${H('h1', 190, 100, 'WANT YOUR FIRST')}${H('h2', 300, 372, '$100', '#FFD23F')}${H('h3', 800, 150, 'ONLINE?')}
        ${EMO('h4', 70, 1000, 250, 'money')}${EMO('h5', 700, 980, 250, 'coins')}
        <div id="h6" class="chipx" style="left:200px;top:1130px;width:620px;height:130px;background:#FF3D6E;font-size:56px">NO EXPERIENCE?</div></div>`);
      hookNow(tl, ['#h1', '#h2', '#h3', '#h4', '#h5']);
      bob('#h4', 0.8, LS(2), 20, 1.6); bob('#h5', 0.8, LS(2), 20, 1.9);
      punch(tl, '#h2', W(1, '$100'), { scale: 1.1 });
      pop('#h6', W(1, 'experience'), { s: 0.4, r: -10 }); tl.to('#h6', { rotation: 2, duration: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut' }, W(1, 'experience') + 0.55);
      out('#s0', LS(2) - 0.12);

      // ============ S1 INTRO (L2) ============
      add(`<div class="sc" id="s1">${H('i1', 260, 104, 'HERE\'S EXACTLY')}${H('i2', 390, 230, 'HOW TO', '#FFD23F')}${H('i3', 620, 280, 'START')}
        ${[0, 1, 2, 3].map((k) => `<div id="d${k}" class="abs" style="left:${120 + k * 210}px;top:1000px;width:150px;height:150px;border-radius:50%;background:${['#FFD23F', '#2EE59D', '#19D3F3', '#FF3D8B'][k]};color:#1A0B3B;font-weight:700;font-size:96px;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 0 rgba(0,0,0,.22)">${k + 1}</div>`).join('')}
        <div id="d4" class="chipx" style="left:260px;top:880px;width:500px;height:96px;background:#1A0B3B;font-size:44px">4 SIMPLE STEPS</div></div>`);
      maskReveal(tl, '#i1', LS(2)); maskReveal(tl, '#i2', W(2, 'how')); maskReveal(tl, '#i3', W(2, 'start') - 0.1);
      pop('#d4', W(2, 'exactly'), { s: 0.6 });
      ['exactly', 'how', 'can', 'start'].forEach((p, k) => pop('#d' + k, W(2, p) + 0.05, { s: 0.3, y: 60 }));
      out('#s1', LS(3) - 0.12);

      // ============ S2 STEP 1 (L3-L4) ============
      add(`<div class="sc" id="s2">${BADGE('b1', 230, 1, '#FF5A1F')}${H('a1', 470, 146, 'ONE SIMPLE')}${H('a2', 640, 210, 'SERVICE', '#FFD23F')}${EMO('a3', 390, 900, 300, 'storefront')}
        ${H('e1', 440, 150, 'YOU DON\'T')}${H('e2', 600, 150, 'NEED TO BE')}${H('e3', 760, 150, 'AN EXPERT', '#FFD23F')}<div id="ex" class="strikeR" style="left:112px;top:850px;width:796px"></div>${EMO('e4', 390, 960, 270, 'graduation-cap')}</div>`);
      pop('#b1', LS(3), { s: 0.4, y: 0, r: 0 });
      maskReveal(tl, '#a1', W(3, 'choose')); maskReveal(tl, '#a2', W(3, 'simple'));
      pop('#a3', W(3, 'service') - 0.2, { s: 0.3 }); bob('#a3', W(3, 'service'), LS(4) - 0.2, 16, 1.4);
      out('#b1', LS(4) - 0.25); ['#a1', '#a2'].forEach((s) => maskHide(tl, s, LS(4) - 0.3)); out('#a3', LS(4) - 0.3);
      maskReveal(tl, '#e1', LS(4)); maskReveal(tl, '#e2', W(4, 'need')); maskReveal(tl, '#e3', W(4, 'be'));
      tl.to('#ex', { scaleX: 1, duration: 0.3, ease: 'power2.out' }, WW(4, 'expert').s + 0.35);
      pop('#e4', W(4, 'expert') + 0.4, { s: 0.3 });
      out('#s2', LS(5) - 0.12);

      // ============ S3 IDEAS LIST (L5) ============
      const CARDS = [['tiktok', 'logo-tiktok', 'Edit TikTok videos', 'short-form editing', '#FF3D8B', 'editing'], ['insta', 'logo-instagram', 'Design Instagram posts', 'graphics & feeds', '#FF8A3D', 'designing'], ['desc', 'ico-note-pencil', 'Write product descriptions', 'words that sell', '#8B5CFF', 'writing'], ['web', 'ico-globe', 'Build simple websites', 'small business sites', '#19D3F3', 'creating']];
      add(`<div class="sc" id="s3"><div id="lh" class="abs sub" style="left:60px;top:170px;width:900px">PICK <span style="color:#FFD23F">ONE</span> OF THESE</div>${CARDS.map((c, k) => `<div id="c_${c[0]}" class="cardx" style="left:70px;top:${290 + k * 255}px;width:880px;height:215px;border-left:22px solid ${c[4]}"><img src="assets/img/${c[1]}.svg"><div>${c[2]}<small>${c[3]}</small></div></div>`).join('')}</div>`);
      pop('#lh', LS(5), { s: 0.8, y: 20, r: 0 });
      CARDS.forEach((c, k) => { pop('#c_' + c[0], W(5, c[5]) - 0.1, { x: k % 2 ? 260 : -260, y: 0, s: 0.7, r: k % 2 ? 4 : -4, e: 'back.out(1.5)' }); });
      out('#s3', LS(6) - 0.12);

      // ============ S4 STEP 2 (L6) ============
      add(`<div class="sc" id="s4">${BADGE('b2', 230, 2, '#0A8CAD')}${H('f1', 440, 100, 'USE')}${H('f2', 540, 330, 'FREE', '#FFD23F')}${H('f3', 860, 190, 'AI TOOLS')}${EMO('f4', 90, 1100, 220, 'sparkle')}${EMO('f5', 710, 1090, 230, 'lightbulb')}</div>`);
      pop('#b2', LS(6), { s: 0.4, y: 0, r: 0 });
      maskReveal(tl, '#f1', W(6, 'use')); maskReveal(tl, '#f2', W(6, 'free')); maskReveal(tl, '#f3', W(6, 'ai'));
      pop('#f4', W(6, 'ai'), { s: 0.3 }); pop('#f5', W(6, 'tools'), { s: 0.3 }); bob('#f4', W(6, 'ai') + 0.5, LS(7), 18, 1.3); bob('#f5', W(6, 'tools') + 0.5, LS(7), 18, 1.5);
      out('#s4', LS(7) - 0.12);

      // ============ S5 CHATGPT + CANVA (L7) ============
      const CH = [['content', 'CONTENT', 'device-mobile', '#FF3D8B'], ['ideas', 'IDEAS', 'lightbulb', '#F29A1F'], ['graphics', 'GRAPHICS', 'paint-brush', '#8B5CFF'], ['improve', 'IMPROVE', 'trend-up', '#14B86B']];
      const LAY = Array.from({ length: 16 }, (_, k) => `<div class="l" style="transform:translateZ(${(k - 7.5) * 3.2}px);${k === 15 || k === 0 ? '' : 'filter:brightness(' + (0.55 + 0.02 * k).toFixed(2) + ')'}"></div>`).join('');
      add(`<div class="sc" id="s5"><div id="gt" class="tilex" style="left:100px;top:240px;width:360px;height:360px"><img src="assets/img/logo-chatgpt.svg"></div><div id="gl" class="lbl" style="left:100px;top:625px;width:360px">ChatGPT</div>
        <div id="cv" class="c3d" style="left:560px;top:240px;width:360px;height:360px"><div class="c3d-in" id="cvi">${LAY}</div></div><div id="cl" class="lbl" style="left:560px;top:625px;width:360px">Canva</div>
        <div id="plus" class="abs headline" style="left:445px;top:330px;width:130px;font-size:130px;color:#FFD23F">+</div>
        ${CH.map((c, k) => `<div id="ch_${c[0]}" class="chipx" style="left:${70 + (k % 2) * 460}px;top:${790 + Math.floor(k / 2) * 240}px;width:420px;height:190px;background:${c[3]};font-size:50px"><img style="width:104px;height:104px" src="assets/img/glyph-${c[2]}.svg">${c[1]}</div>`).join('')}</div>`);
      pop('#gt', W(7, 'chatgpt'), { s: 0.2, r: -25 }); pop('#gl', W(7, 'chatgpt') + 0.25, { s: 0.7, y: 20, r: 0 });
      tl.fromTo('#gt', { rotation: 0 }, { rotation: 5, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: 6, immediateRender: false }, W(7, 'chatgpt') + 0.7);
      pop('#plus', W(7, 'and') - 0.02, { s: 0.2, y: 0, r: 0 });
      tl.fromTo('#cv', { opacity: 0, scale: 0.2, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', immediateRender: false }, W(7, 'canva'));
      tl.fromTo('#cvi', { rotationY: -200, rotationX: 14 }, { rotationY: 520, rotationX: 14, duration: LS(8) - W(7, 'canva') - 0.1, ease: 'none', immediateRender: false }, W(7, 'canva'));
      pop('#cl', W(7, 'canva') + 0.3, { s: 0.7, y: 20, r: 0 });
      CH.forEach((c) => pop('#ch_' + c[0], W(7, c[0]) - 0.05, { s: 0.4, y: 50 }));
      out('#s5', LS(8) - 0.12);

      // ============ S6 EXAMPLES (L8) ============
      add(`<div class="sc" id="s6"><div id="g0" class="abs sub" style="left:60px;top:200px;width:900px">LEARN THE BASICS, THEN MAKE</div>
        <div id="g1" class="abs headline" style="left:70px;top:330px;width:300px;font-size:420px;color:#FFD23F">2</div><div id="g2" class="abs headline" style="left:380px;top:430px;width:260px;font-size:110px">OR</div><div id="g3" class="abs headline" style="left:650px;top:330px;width:300px;font-size:420px;color:#FFD23F">3</div>
        ${H('g4', 790, 160, 'EXAMPLES')}<div id="g5" class="chipx" style="left:90px;top:1000px;width:840px;height:130px;background:#1A0B3B;font-size:46px">SHOW THEM TO POTENTIAL CLIENTS</div>${EMO('g6', 380, 1150, 220, 'handshake')}</div>`);
      pop('#g0', LS(8), { s: 0.8, y: 20, r: 0 });
      pop('#g1', W(8, '2'), { s: 0.2, r: -12 }); pop('#g2', W(8, 'or'), { s: 0.3, r: 0 }); pop('#g3', W(8, '3'), { s: 0.2, r: 12 });
      maskReveal(tl, '#g4', W(8, 'examples'));
      pop('#g5', W(8, 'show'), { s: 0.5, y: 30, r: 0 }); pop('#g6', W(8, 'potential'), { s: 0.3 });
      out('#s6', LS(9) - 0.12);

      // ============ S7 STEP 3 (L9) ============
      add(`<div class="sc" id="s7">${BADGE('b3', 230, 3, '#0B8F68')}${H('j1', 470, 150, 'FIND YOUR')}${H('j2', 640, 280, 'FIRST', '#FFD23F')}${H('j3', 940, 150, 'CUSTOMERS')}${EMO('j4', 110, 1130, 200, 'handshake')}${EMO('j5', 770, 1130, 200, 'users-three')}</div>`);
      pop('#b3', LS(9), { s: 0.4, y: 0, r: 0 });
      maskReveal(tl, '#j1', W(9, 'find')); maskReveal(tl, '#j2', W(9, 'first') - 0.1); maskReveal(tl, '#j3', W(9, 'customers') - 0.3);
      pop('#j4', W(9, 'customers'), { s: 0.3 }); pop('#j5', W(9, 'customers') + 0.15, { s: 0.3 }); bob('#j4', W(9, 'customers') + 0.6, LS(10), 16, 1.4); bob('#j5', W(9, 'customers') + 0.7, LS(10), 16, 1.6);
      out('#s7', LS(10) - 0.12);

      // ============ S8 PLATFORMS (L10) ============
      const PL = [['insta', 'logo-instagram', 'Instagram', 'instagram'], ['fb', 'logo-facebook', 'Facebook', 'facebook'], ['fiv', 'logo-fiverr', 'Fiverr', 'fiverr'], ['up', 'logo-upwork', 'Upwork', 'upwork']];
      add(`<div class="sc" id="s8"><div id="pg" class="abs sub" style="left:60px;top:170px;width:900px">GO TO</div>${PL.map((p, k) => `<div id="pt_${p[0]}" class="tilex" style="left:${80 + (k % 2) * 450}px;top:${260 + Math.floor(k / 2) * 480}px;width:370px;height:370px"><img src="assets/img/${p[1]}.svg"></div><div id="pl_${p[0]}" class="lbl" style="left:${80 + (k % 2) * 450}px;top:${640 + Math.floor(k / 2) * 480}px;width:370px;font-size:50px">${p[2]}</div>`).join('')}</div>`);
      pop('#pg', LS(10), { s: 0.8, y: 20, r: 0 });
      PL.forEach((p, k) => { const t = W(10, p[3]); pop('#pt_' + p[0], t - 0.05, { s: 0.2, r: k % 2 ? 14 : -14 }); pop('#pl_' + p[0], t + 0.2, { s: 0.7, y: 16, r: 0 }); tl.fromTo('#pt_' + p[0], { rotation: 0 }, { rotation: k % 2 ? -3 : 3, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 5, immediateRender: false }, t + 0.7); });
      out('#s8', LS(11) - 0.12);

      // ============ S9 SMALL BUSINESSES (L11) ============
      add(`<div class="sc" id="s9">${H('k1', 230, 270, 'SMALL', '#FFD23F')}${H('k2', 510, 156, 'BUSINESSES')}${EMO('k3', 70, 760, 330, 'storefront')}
        <div id="k4" class="chipx" style="left:420px;top:790px;width:520px;height:130px;background:#FF3D6E;font-size:48px">POOR CONTENT</div><div id="k5" class="chipx" style="left:420px;top:970px;width:520px;height:130px;background:#FF3D6E;font-size:48px">NO WEBSITE</div>${EMO('k6', 450, 1130, 190, 'warning')}</div>`);
      maskReveal(tl, '#k1', LS(11)); maskReveal(tl, '#k2', W(11, 'businesses') - 0.05);
      pop('#k3', W(11, 'businesses') + 0.2, { s: 0.3 });
      pop('#k4', W(11, 'poor') - 0.05, { x: 200, y: 0, s: 0.7, r: 3 }); pop('#k5', W(11, 'don') - 0.05, { x: 200, y: 0, s: 0.7, r: -3 });
      pop('#k6', W(11, 'website'), { s: 0.3 });
      tl.fromTo('#k5', { x: 0 }, { x: 10, duration: 0.07, yoyo: true, repeat: 5, ease: 'none', immediateRender: false }, W(11, 'don') + 0.6);
      out('#s9', LS(12) - 0.12);

      // ============ S10 CONTACT THEM (L12) ============
      add(`<div class="sc" id="s10"><div id="m0" class="abs sub" style="left:60px;top:170px;width:900px">SEND THEM A MESSAGE</div>
        <div id="m1" class="bub me" style="left:70px;top:290px;width:760px">Hi! I can make your Instagram posts look amazing.</div>
        <div id="m2" class="bub you" style="left:300px;top:640px;width:650px">Interesting! Tell me more.</div>
        <div id="m3" class="bub me" style="left:70px;top:900px;width:760px">I can help you get more customers.</div>${EMO('m4', 700, 1120, 220, 'handshake')}</div>`);
      pop('#m0', LS(12), { s: 0.8, y: 20, r: 0 });
      pop('#m1', W(12, 'contact'), { s: 0.5, x: -80, y: 20, r: 0 }); pop('#m2', W(12, 'how'), { s: 0.5, x: 80, y: 20, r: 0 }); pop('#m3', W(12, 'could'), { s: 0.5, x: -80, y: 20, r: 0 });
      pop('#m4', W(12, 'business'), { s: 0.3 }); bob('#m4', W(12, 'business') + 0.5, LS(13), 12, 1.0);
      out('#s10', LS(13) - 0.12);

      // ============ S11 STEP 4 (L13) ============
      add(`<div class="sc" id="s11">${BADGE('b4', 230, 4, '#E8590C')}${H('n1', 470, 190, 'GET PAID')}${EMO('n2', 330, 760, 420, 'money')}</div>`);
      pop('#b4', LS(13), { s: 0.4, y: 0, r: 0 });
      maskReveal(tl, '#n1', W(13, 'get') - 0.1); pop('#n2', W(13, 'get') + 0.1, { s: 0.2, r: -15 }); bob('#n2', W(13, 'get') + 0.7, LS(14), 20, 1.2);
      out('#s11', LS(14) - 0.12);

      // ============ S12 AFFORDABLE OFFER (L14) ============
      add(`<div class="sc" id="s12"><div id="o0" class="abs sub" style="left:60px;top:170px;width:900px">START WITH AN AFFORDABLE OFFER</div>${H('o1', 300, 440, '$0', '#1A0B3B')}
        <div id="o2" class="chipx" style="left:190px;top:900px;width:700px;height:130px;background:#1A0B3B;font-size:50px">SMALL PROJECT</div></div>`);
      pop('#o0', LS(14), { s: 0.8, y: 20, r: 0 });
      tl.set('#o1', { opacity: 1 }, W(14, '$25') - 0.05);
      tl.fromTo('#o1', { scale: 0.3 }, { scale: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, W(14, '$25') - 0.05);
      count('#o1', W(14, '$25') - 0.05, 0, 25, 0.7);
      pop('#o2', W(14, 'small') - 0.05, { s: 0.5, y: 30, r: 0 });
      lot('mon', 'money-stack-s.json', 330, 1030, 420, 331, W(14, 'small'), 2.8);
      out('#s12', LS(15) - 0.12);

      // ============ S13 FOUR x $25 = $100 (L15) ============
      add(`<div class="sc" id="s13"><div id="q0" class="abs sub" style="left:60px;top:170px;width:900px">4 CLIENTS × $25</div>
        ${[0, 1, 2, 3].map((k) => `<div id="q${k + 1}" class="abs" style="left:${65 + k * 232}px;top:300px;width:200px;height:200px;border-radius:50px;background:#fff;color:#E8590C;font-weight:700;font-size:72px;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 0 rgba(0,0,0,.2)">$25</div>`).join('')}
        ${H('q5', 620, 380, '$0', '#1A0B3B')}<div id="q6" class="chipx" style="left:130px;top:1090px;width:780px;height:130px;background:#2EE59D;color:#07331F;font-size:50px">YOUR FIRST $100</div></div>`);
      pop('#q0', W(15, 'four') - 0.1, { s: 0.8, y: 20, r: 0 });
      [W(15, 'four'), W(15, 'clients'), W(15, 'paying'), W(15, '$25')].forEach((t, k) => pop('#q' + (k + 1), t, { s: 0.3, y: 60 }));
      const tg = W(15, 'gets'); const tfin = W(15, '$100');
      [1, 2, 3, 4].forEach((k) => tl.to('#q' + k, { y: 330 + (k - 2.5) * 0, x: (2.5 - k) * 232 * 0.9, scale: 0.35, opacity: 0, duration: 0.5, ease: 'power3.in' }, tg + k * 0.07));
      tl.set('#q5', { opacity: 1 }, tg + 0.35);
      tl.fromTo('#q5', { scale: 0.4 }, { scale: 1, duration: 0.4, ease: 'back.out(1.8)', immediateRender: false }, tg + 0.35);
      count('#q5', tg + 0.35, 0, 100, Math.max(0.5, tfin - tg - 0.35));
      punch(tl, '#q5', tfin, { scale: 1.12 }); pop('#q6', tfin + 0.05, { s: 0.4, y: 30, r: 0 });
      lot('cf1', 'confetti-a.json', 90, 330, 900, 900, tfin, 2.2);
      out('#s13', LS(16) - 0.12);

      // ============ S14 NOT OVERNIGHT (L16) ============
      add(`<div class="sc" id="s14">${H('r1', 380, 190, 'GET RICH')}${H('r2', 610, 156, 'OVERNIGHT?', '#FFD23F')}<div id="rx" class="strikeR" style="left:95px;top:690px;width:830px"></div>${EMO('r3', 380, 900, 300, 'currency-dollar')}</div>`);
      maskReveal(tl, '#r1', W(16, 'get') - 0.05); maskReveal(tl, '#r2', W(16, 'rich'));
      pop('#r3', W(16, 'rich') + 0.1, { s: 0.3 });
      tl.to('#rx', { scaleX: 1, duration: 0.3, ease: 'power2.out' }, W(16, 'overnight') + 0.45);
      tl.to('#r3', { rotation: 8, y: 30, opacity: 0.35, duration: 0.5 }, W(16, 'overnight') + 0.5);
      out('#s14', LS(17) - 0.12);

      // ============ S15 THREE ACTIONS (L17) ============
      const AC = [['u1', 'GET STARTED', 'rocket-launch', '#FF3D8B', 'started'], ['u2', 'BUILD YOUR SKILL', 'hammer', '#8B5CFF', 'build'], ['u3', 'LAND CUSTOMER #1', 'target', '#14B86B', 'land']];
      add(`<div class="sc" id="s15">${AC.map((a, k) => `<div id="${a[0]}" class="chipx" style="left:70px;top:${300 + k * 300}px;width:880px;height:230px;background:${a[3]};font-size:68px;justify-content:flex-start;padding-left:40px;gap:28px"><img style="width:140px;height:140px" src="assets/img/ico-${a[2]}.svg">${a[1]}</div>`).join('')}</div>`);
      AC.forEach((a, k) => pop('#' + a[0], W(17, a[4]) - 0.15, { x: -300, y: 0, s: 0.8, r: 0, e: 'back.out(1.4)' }));
      out('#s15', LS(18) - 0.12);

      // ============ S16 CTA (L18) ============
      add(`<div class="sc" id="s16">${H('t1', 220, 170, 'COMMENT')}<div id="t2" class="btn" style="left:130px;top:470px;width:780px;height:320px;font-size:210px">"100$"</div>
        ${H('t3', 900, 84, 'TO GET THE TUTORIAL')}<div id="t4" class="chipx" style="left:210px;top:1050px;width:620px;height:150px;background:#1A0B3B;font-size:62px"><img style="width:100px;height:100px" src="assets/img/glyph-chat-circle-dots.svg">IN YOUR DMs</div></div>`);
      maskReveal(tl, '#t1', LS(18));
      pop('#t2', W(18, '100'), { s: 0.2, r: -8 }); heartbeat(tl, '#t2', W(18, '100') + 0.8, TOTAL);
      maskReveal(tl, '#t3', W(18, 'receive')); pop('#t4', W(18, 'in'), { s: 0.4, y: 30, r: 0 });
      lot('cf2', 'confetti-b.json', 90, 250, 900, 900, W(18, '100'), 2.2);
