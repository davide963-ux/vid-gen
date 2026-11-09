// Visual-glitch finder: seeks the composition every 0.5s and reports (1) text boxes that overlap other text boxes,
// (2) text outside the 1080x1920 frame, (3) text clipped by an ancestor. Usage: node scripts/qa_overlap.js videos/<name> [step=0.5]
const { chromium } = require('playwright');
(async () => {
  const dir = require('path').resolve(process.argv[2]); const step = parseFloat(process.argv[3] || '0.5');
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + dir + '/index.html'); await p.waitForTimeout(1500);
  const total = await p.evaluate(() => window.__timelines.main.duration());
  const issues = [];
  for (let t = 0.2; t < total; t += step) {
    const r = await p.evaluate((t) => {
      window.__timelines.main.seek(t, false); const out = []; const root = document.getElementById('dyn');
      const vis = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.55) return false; } return true; };
      const boxes = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) { const n = walker.currentNode; if (!n.nodeValue.trim()) continue; const el = n.parentElement; if (!vis(el)) continue; const range = document.createRange(); range.selectNodeContents(n); const rc = range.getBoundingClientRect(); if (rc.width < 6 || rc.height < 6) continue;
        // visible part after overflow:hidden ancestors (scroll containers marked data-scroll are intended)
        let vl = rc.left, vr = rc.right, vt = rc.top, vb = rc.bottom, clipped = false, gone = false;
        for (let e = el.parentElement; e && e !== root; e = e.parentElement) { const cs = getComputedStyle(e); if ((cs.overflow === 'hidden' || cs.overflowX === 'hidden') && !e.classList.contains('mw') && !e.classList.contains('sc')) { const ar = e.getBoundingClientRect(); const nl = Math.max(vl, ar.left), nr = Math.min(vr, ar.right), nt = Math.max(vt, ar.top), nb = Math.min(vb, ar.bottom); if (nr <= nl || nb <= nt) { gone = true; break; } if ((nr - nl) * (nb - nt) < (vr - vl) * (vb - vt) * 0.9 && !e.hasAttribute('data-scroll')) clipped = true; vl = nl; vr = nr; vt = nt; vb = nb; } }
        if (gone) continue;
        boxes.push({ t: n.nodeValue.trim().slice(0, 24), l: vl, r: vr, tp: vt, bt: vb, clipped, el }); }
      for (const a of boxes) { if (a.l < -2 || a.r > 1082) out.push('OUT-OF-FRAME "' + a.t + '" x=' + Math.round(a.l) + '..' + Math.round(a.r)); if (a.clipped) out.push('CLIPPED "' + a.t + '"'); }
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) { const a = boxes[i], c = boxes[j]; if (a.el.contains(c.el) || c.el.contains(a.el)) continue; const ox = Math.min(a.r, c.r) - Math.max(a.l, c.l), oy = Math.min(a.bt, c.bt) - Math.max(a.tp, c.tp); if (ox > 8 && oy > 8) { const area = ox * oy, sm = Math.min((a.r - a.l) * (a.bt - a.tp), (c.r - c.l) * (c.bt - c.tp)); if (area / sm > 0.2) out.push('OVERLAP "' + a.t + '" x "' + c.t + '"'); } }
      return out; }, t);
    for (const m of r) issues.push(t.toFixed(1) + 's  ' + m);
  }
  const uniq = [...new Set(issues.map((s) => s.replace(/^[\d.]+s\s+/, '')))];
  console.log(issues.length ? issues.slice(0, 60).join('\n') : 'no overlaps / clipping found');
  console.log('--- ' + issues.length + ' hits, ' + uniq.length + ' distinct');
  await b.close();
})();
