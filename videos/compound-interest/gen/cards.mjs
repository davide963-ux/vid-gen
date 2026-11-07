// Three "teal spot" cards (style from MengTo/Skills illustration-teal-spot, MIT) telling a compound-interest story with coin stacks on a white tile.
import fs from 'node:fs';
import { C, mul, dot, poly, frame, tiltFrame, rrect, circle, makeCam, card, spark, arc, bbox, deg } from './teal3d.mjs';

const TH = -25, PH = 36;
const V = [-Math.sin(TH * deg) * Math.cos(PH * deg), -Math.cos(TH * deg) * Math.cos(PH * deg), Math.sin(PH * deg)];
const GL = {
  dollar: `<path d="M5,-5.5C5,-9.5 -5,-9.5 -5,-4.2C-5,1 5,0 5,5.4C5,10.5 -5,10.5 -5,5.8M0,-11L0,11.5" fill="none" stroke="${C.deep}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  pct: `<path d="M-6,6.5L6,-6.5" fill="none" stroke="${C.deep}" stroke-width="2.6" stroke-linecap="round"/><circle cx="-5.2" cy="-5" r="2.8" fill="none" stroke="${C.deep}" stroke-width="2.4"/><circle cx="5.2" cy="5" r="2.8" fill="none" stroke="${C.deep}" stroke-width="2.4"/>`,
  up: `<path d="M0,8.5L0,-8M-6.4,-1.8L0,-8.4L6.4,-1.8" fill="none" stroke="${C.deep}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`,
};

function build(P, label, stacks, opts) {
  const cam = makeCam({ TH, PH, S: 0.9 });
  const { pr, BOX, mat, solid, floorShadow, castShadow, coin, liftShadow, streak } = cam;
  let scene = ''; const put = (s) => { scene += s + '\n'; };
  const W = 250, D = 160, H = 30, R = 20; const ring = rrect(0, 0, W, D, R);
  put(`<path id="${P}shadow" d="${poly(floorShadow(ring, H * 1.05))}" fill="${C.deep}"/>`);
  const hero = solid({ fr: frame([0, 0, 0]), r0: ring, z0: 0, r1: ring, z1: H, col: { front: C.white, left: C.white, back: C.white, right: C.teal, up: C.white, down: C.white, cap: C.white } });
  put(`<g id="${P}tile">${hero.svg}`);
  put(streak([-W / 2 + 26, -D / 2, H - 8], [-W / 2 + 120, -D / 2, H - 8]));
  const zr = H + 0.01, y0 = -D / 2 + 11;
  put(`<path d="${poly(rrect(W / 2 - 60, y0, 28, 4.4, 2.2, 5).map(([x, y]) => pr([x, y, zr])))}" fill="${C.grey}"/>`);
  put(`<path d="${poly(rrect(W / 2 - 34, y0, 4.8, 4.8, 2.4, 5).map(([x, y]) => pr([x, y, zr])))}" fill="${C.teal}" stroke="${C.ink}" stroke-width="0.8"/></g>`);
  // hard shadows of the stacks, clipped to the tile top
  const topClip = poly(ring.map(([x, y]) => pr([x, y, H])));
  let shadows = '';
  for (const s of stacks) { const h = s.n * 5.5; const pts = [...circle(s.x, s.y, 20, 36).map(([x, y]) => [x, y, H]), ...circle(s.x, s.y, 20, 36).map(([x, y]) => [x, y, H + h])]; shadows += `<path d="${poly(castShadow(pts, H))}" fill="${C.deep}"/>`; }
  put(`<clipPath id="${P}topclip"><path d="${topClip}"/></clipPath><g clip-path="url(#${P}topclip)">${shadows}</g>`);
  // stacks, back to front
  const order = stacks.slice().sort((a, b) => dot([a.x, a.y, 0], V) - dot([b.x, b.y, 0], V));
  for (const s of order) {
    for (let i = 0; i < s.n; i++) {
      const top = i === s.n - 1; const z = H + i * 5.5; const fr = frame([s.x, s.y, z]);
      const cc = { front: C.mid, left: C.mid, back: C.mid, right: C.teal, up: C.mid, down: C.mid, cap: C.pale };
      const extra = top && s.glyph ? `<g transform="${mat(frame([s.x, s.y, z + 5.5]), 0)}"><g transform="scale(0.85)">${GL[s.glyph]}</g></g>` : '';
      put(solid({ fr, r0: circle(0, 0, 20, 48), z0: 0, r1: circle(0, 0, 20, 48), z1: 5.5, col: cc, creases: false, extra }).svg);
    }
  }
  // floating extras
  const extras = [];
  for (const e of opts.coins) { const c = coin({ pos: e.pos, rot: e.rot || [56, -24, 0], R: e.R || 17, glyph: GL[e.glyph], face: e.accent ? C.teal : C.pale, col: e.accent ? { front: C.tealD, left: C.tealD, back: C.tealD, right: C.deep, up: C.tealD, down: C.tealD } : undefined, rim: e.accent ? C.tealD : C.mid }); put(`<g>${c.shadow}${c.svg}</g>`); extras.push(c); }
  if (opts.plate) {
    const cfr = frame(opts.plate.pos, tiltFrame(28).map((v) => mul(v, 0.9)));
    const bars = opts.plate.bars.map((h, i) => `<rect x="${-30 + i * 17}" y="${14 - h}" width="11" height="${h}" rx="2.5" fill="${i === opts.plate.bars.length - 1 ? C.teal : C.mid}" stroke="${C.ink}" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join('');
    const cr = rrect(0, 0, 84, 50, 8);
    const ui = `<rect x="-36" y="-20" width="30" height="4.4" rx="2.2" fill="${C.grey}"/>${bars}`;
    const cs = solid({ fr: cfr, r0: cr, z0: 0, r1: cr, z1: 8, col: { front: C.pale, right: C.mid, left: C.pale, back: C.pale, up: C.pale, down: C.pale, cap: C.white }, extra: `<g transform="${mat(cfr, 8)}">${ui}</g>` });
    put(`<g>${liftShadow(cs.hull)}${cs.svg}</g>`); extras.push({ hull: cs.hull });
  }
  const bbs = extras.map((e) => bbox(e.hull));
  const out = card({ prefix: P, label, scene, BOX, decor: (sh) => {
    const a = sh([bbs[0][2], bbs[0][1]]), b = sh([(bbs.at(-1)[0] + bbs.at(-1)[2]) / 2, (bbs.at(-1)[1] + bbs.at(-1)[3]) / 2]);
    return [spark(a[0] + 14, a[1] - 6, 6.5), spark(a[0] + 26, a[1] + 10, 3.8), spark(b[0] - 34, b[1] - 20, 4.6), ...(opts.arc ? [arc(a[0] - 8, a[1] + 12, 24, -70, -34)] : [])];
  } });
  return out;
}

const cards = {
  'card-a': build('ca-', 'Deposit', [{ x: -10, y: 0, n: 3, glyph: 'dollar' }], { coins: [{ pos: [-150, -20, 80], glyph: 'dollar' }], plate: { pos: [110, 60, 120], bars: [10, 14] } }),
  'card-b': build('cb-', 'Interest', [{ x: -55, y: 0, n: 5, glyph: 'dollar' }, { x: 60, y: -10, n: 1 }], { arc: true, coins: [{ pos: [-55, 0, 128], rot: [20, -10, 0], glyph: 'pct', accent: true }, { pos: [-160, -10, 60], glyph: 'dollar' }], plate: { pos: [120, 70, 130], bars: [10, 15, 20] } }),
  'card-c': build('cc-', 'Interest on interest', [{ x: -85, y: 5, n: 3 }, { x: 0, y: 0, n: 6 }, { x: 85, y: -5, n: 10, glyph: 'dollar' }], { arc: true, coins: [{ pos: [85, -5, 150], rot: [20, -10, 0], glyph: 'up', accent: true }, { pos: [-165, -15, 70], glyph: 'pct' }], plate: { pos: [30, 100, 130], bars: [8, 14, 22, 32] } }),
};
for (const [k, c] of Object.entries(cards)) { fs.writeFileSync(`../assets/img/${k}.svg`, c.svg); console.log(k, 'bbox', c.bbox.join(' '), `${c.widthPct}% x ${c.heightPct}%`); }
