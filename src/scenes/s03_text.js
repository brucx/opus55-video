/*
 * s03_text — 原理 1：Opus 5.5 只输出文字；画画的是浏览器和图形引擎。
 *
 * Spec: script/storyboard.md § s03_text (no amendments). Every beat is read from the voice (src/timeline.js) with
 * ctx.word(); nothing below hard-codes a speech time.
 *
 *  wipe     s02's lime title underline survives the chapter wipe (same screen geometry) and contracts into the model card
 *           as the blank after 「输出」 (global rule 1: the lime pill is the through-object). The camera frames the card.
 *  文字      the blank pops into the lime 「文本」 pill.
 *  视频      a dashed ghost chip slides in, is struck through, the stamp 「没有视频输出」 drops as the strike finishes.
 *  line 2   a slim lime capsule (a copy of the pill, never showing text) slides out from behind 「文本」, tunnels under the
 *           struck 「视频」, leaves through the card's output port and splits into three capsules; each opens into its node
 *           card on its word (分镜 / 代码 / 工具). The camera pulls back to frame card + nodes.
 *  画画      the camera pans right and the painter (浏览器 / 图形引擎) springs in with its empty canvas; 浏览器: edges draw
 *           in carrying lime packets; 引擎: the canvas lights with a live PAGE.draw page.
 *  dive     the camera dives into the canvas (the tile grows 2.3×): the diagram dissolves first (gone before any text
 *           reaches the top band), the painter, its arrow and 「画面」 fly outward round the tile a few frames longer;
 *           s04's top page starts as this very tile (s04 mirrors DIVE / TILE / PAGE_SPEED / T.light / T.dive below, so
 *           keep them in step with src/scenes/s04_render.js § S03).
 */
(() => {
  'use strict';

  const L1 = 's03_text.1';
  const L2 = 's03_text.2';
  const LIME = '#C9DF8D', NIGHT2 = '#1B1718', SNOW = '#F4F1F2', FOG = '#A39A9B', LILAC = '#EAD8EB';

  // ---------------- layout (scene px, before the camera) ----------------
  const CARD = { x: 140, y: 200, w: 640, h: 500 };
  const ROW_IN = 462;                       // centre y of the 输入 row
  const ROW_OUT = 554;                      // centre y of the 输出 row
  const PILL = { x: 296, w: 140, h: 76 };   // the lime 「文本」 pill, centred on ROW_OUT
  const BLANK_H = 8;                        // the blank it starts as
  const GHOST = { x: 454, w: 124, h: 60 };
  const STAMP = { cx: 566, cy: 642 };
  const S02_BAR = { x: 399, y: 593, w: 1122, h: 16 }; // s02's underline (1100×16 at y 600) after its 1.00→1.02 drift (screen px)
  const PORT = { x: CARD.x + CARD.w, y: ROW_OUT };    // the card's output port (right edge, 输出 row)
  const CAPS = { w: 120, h: 26 };                     // the capsule a copy of the pill travels as
  const NODE = { cx: 1100, w: 290, h: 120 };
  const NODES = [
    { label: '分镜', sub: '镜头 · 时长 · 文字', y: 300, word: '分镜' },
    { label: '代码', sub: '<span style="font:500 26px/1 var(--mono);letter-spacing:0">render(t)</span> 函数', y: 480, word: '代码' },
    { label: '工具指令', sub: '浏览器 · FFmpeg', y: 660, word: '工具' },
  ];
  const ENG = { cx: 1590, cy: 480, w: 390, h: 150, r: 26 };
  const TILE = { cx: 1590, cy: 690, w: 280, h: 158 };
  // camera framings, screen = O + s · (p − F)
  const FRAME = { fx: 460, fy: 468, ox: 960, oy: 500, s0: 1.22, s1: 1.25 }; // line 1: the model card
  const BLOCK = { fx: 692, fy: 473, ox: 960, oy: 505, s: 1.1 };             // line 2: card + the three nodes, centred
  const FULL = { fx: 960, fy: 540, ox: 960, oy: 540, s: 1 };                // 画画: the whole pipeline (identity + drift)
  // the dive. s04_render mirrors these numbers (its S03 constant): its top page starts as this tile's exact screen rect
  // and plays the same live ball, so change them together with s04. At 2.3× the tile ends ≈ 590 px wide on screen
  // (× the zoom's 0.92), close to the book page it becomes, so the dive reads as a camera move into the canvas.
  const DIVE = { x: 1200, y: 450, s: 2.3, dur: 1.1 };
  const TILE_RES = 3;                         // tile canvas px per scene px: the ball stays crisp at the dive's full scale
  const EA = 0.5;                             // share of the flight spent on the shared segment (pill → port)
  const PAGE_SPEED = 2;                       // tile plays PAGE.draw at 2×: the ball crosses on a 1.5 s loop
  // engine 'zoom' transition (src/lib/engine.js): incoming root 1.12 → 1 (outCubic), outgoing 1 → 0.92 (inOutCubic),
  // both about (960, 540). The background grid follows it so s03's and s04's 48-px grids coincide during the zoom.
  const ZOOM = { in: 1.12, out: 0.92 };
  const BGX = -192, BGY = -144;               // background origin on the 48-px grid (s04's grid starts at (0, 0))

  // ---------------- small helpers ----------------
  const { clamp, lerp, ease } = M;
  const cubic = (p0, p1, p2, p3, u) => {
    const v = 1 - u;
    return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
      v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]];
  };
  function arcTable(fn, n = 160) {
    const pts = [], cum = [0];
    for (let k = 0; k <= n; k++) pts.push(fn(k / n));
    for (let k = 1; k <= n; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    return { pts, cum, len: cum[n] };
  }
  function atLen(tb, d) {
    d = clamp(d, 0, tb.len);
    let lo = 0, hi = tb.cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tb.cum[m] < d) lo = m; else hi = m; }
    const seg = tb.cum[hi] - tb.cum[lo] || 1, f = (d - tb.cum[lo]) / seg;
    return [lerp(tb.pts[lo][0], tb.pts[hi][0], f), lerp(tb.pts[lo][1], tb.pts[hi][1], f)];
  }
  // smooth 0→1→0 bump over [t0, t0 + dur]
  const bump = (t, t0, dur) => { const p = (t - t0) / dur; return p <= 0 || p >= 1 ? 0 : Math.sin(Math.PI * p) ** 2; };
  const px = v => `${v.toFixed(2)}px`;
  // 2D transform + opacity (+ blur). No translate3d: a 3D transform makes each element its own compositor layer, whose
  // raster scale then depends on earlier frames (seek order); identity → 'none'.
  function tf2(el, o) {
    const x = o.x || 0, y = o.y || 0, r = o.r || 0;
    const sx = o.sx != null ? o.sx : o.s != null ? o.s : 1, sy = o.sy != null ? o.sy : o.s != null ? o.s : 1;
    let tr = '';
    if (Math.abs(x) >= 0.005 || Math.abs(y) >= 0.005) tr += `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) `;
    if (Math.abs(r) >= 0.0005) tr += `rotate(${r.toFixed(3)}deg) `;
    if (Math.abs(sx - 1) >= 0.00005 || Math.abs(sy - 1) >= 0.00005) tr += `scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    el.style.transform = tr ? tr.trim() : 'none';
    if (o.o != null) el.style.opacity = clamp(o.o).toFixed(4);
    if (o.blur != null) el.style.filter = o.blur > 0.05 ? `blur(${o.blur.toFixed(2)}px)` : 'none';
  }

  // fan curve from the card's port to node i, and node i → engine edge
  const fanPts = i => [[PORT.x, PORT.y], [PORT.x + 95, PORT.y], [NODE.cx - 205, NODES[i].y], [NODE.cx, NODES[i].y]];
  const edgePts = i => {
    const x1 = NODE.cx + NODE.w / 2 + 10, y1 = NODES[i].y, x2 = ENG.cx - ENG.w / 2 - 13, y2 = ENG.cy + (i - 1) * 38;
    const c = 0.45 * (x2 - x1);
    return [[x1, y1], [x1 + c, y1], [x2 - c, y2], [x2, y2]];
  };
  const dOf = P => `M${P[0][0]},${P[0][1]} C${P[1][0]},${P[1][1]} ${P[2][0]},${P[2][1]} ${P[3][0]},${P[3][1]}`;

  // all beats, from the voice
  function timing(ctx) {
    const w = (line, word) => ctx.word(line, word);
    const T = {
      opus: w(L1, 'Opus'), opusEnd: ctx.wordEnd(L1, '5.5'), out: w(L1, '输出'), wenzi: w(L1, '文字'), video: w(L1, '视频'),
      end1: ctx.cueEnd(L1), nodes: NODES.map(n => w(L2, n.word)),
      paint: w(L2, '画画'), browser: w(L2, '浏览器'), gfx: w(L2, '图形'), engine: w(L2, '引擎'), end2: ctx.cueEnd(L2),
    };
    T.strike = T.video + 0.21;                       // strike draws across the ghost chip (0.2 s)
    T.stamp = T.video + 0.24;                        // stamp starts its drop …
    T.land = T.stamp + 0.15;                         // … and lands as the strike finishes
    T.launch = Math.max(T.end1, T.land + 0.08);      // the capsule leaves the card
    T.fly = 0.55;
    T.arrive = T.launch + T.fly;
    T.open = T.nodes.map(x => Math.max(x, T.arrive + 0.02));   // each capsule opens into its node card
    T.pull = T.launch + 0.05;                        // camera pulls back from the card to card + nodes
    T.pullDur = 0.8;
    T.pan = T.paint - 0.25;                          // … and pans to the whole pipeline: the painter enters on 「画画」
    T.panDur = 0.75;
    T.light = T.engine + 0.08;                       // the canvas lights
    T.dive = Math.max(T.end2 + 0.04, T.light + 0.4); // the camera dives into the canvas (s04 mirrors this formula)
    return T;
  }

  // camera: screen = (tx, ty) + s · p
  function camera(t, T, dur) {
    const drift = -20 * clamp(t / dur);
    const s1 = lerp(FRAME.s0, FRAME.s1, clamp(t / T.pull));            // slow push-in while framed on the card
    const kp = ease.inOutSine(clamp((t - T.pull) / T.pullDur));        // pull-back: text stays under ~20 px/frame
    const kq = ease.inOutSine(clamp((t - T.pan) / T.panDur));
    const fx = lerp(lerp(FRAME.fx, BLOCK.fx, kp), FULL.fx, kq), fy = lerp(lerp(FRAME.fy, BLOCK.fy, kp), FULL.fy, kq);
    const ox = lerp(lerp(FRAME.ox, BLOCK.ox, kp), FULL.ox, kq) + drift * kp, oy = lerp(lerp(FRAME.oy, BLOCK.oy, kp), FULL.oy, kq);
    let s = lerp(lerp(s1, BLOCK.s, kp), FULL.s, kq);
    let tx = ox - s * fx, ty = oy - s * fy;
    // dive: the tile flies to (DIVE.x, DIVE.y) at DIVE.s (s04's top page continues from exactly here)
    const k = ease.inOutCubic(clamp((t - T.dive) / DIVE.dur));
    if (k > 0) {
      s = lerp(1, DIVE.s, k);
      tx = lerp(TILE.cx + drift, DIVE.x, k) - s * TILE.cx;
      ty = lerp(TILE.cy, DIVE.y, k) - s * TILE.cy;
    }
    return { s, tx, ty, kp, kq, k };
  }

  // arc position of capsule c's centre along its own path (shared segment pill → port, then its fan curve)
  function capS(c, T, t) {
    const e = ease.inOutSine(clamp((t - T.launch) / T.fly));
    return e < EA ? lerp(c.s0, c.sp, e / EA) : lerp(c.sp, c.sn, (e - EA) / (1 - EA));
  }

  Scene.define({
    id: 's03_text',

    build(root, ctx) {
      const { h, s } = E;
      const T = timing(ctx);

      // ---- background grid: its own layer, oversized so camera parallax never exposes an edge ----
      const bgWrap = h('div', { class: 'abs', style: { left: `${BGX}px`, top: `${BGY}px`, width: '2304px', height: '1368px',
        transformOrigin: `${960 - BGX}px ${540 - BGY}px` } });
      root.append(bgWrap);
      K.bg(bgWrap, 'night');

      // ---- camera layers (same transform): glows (stay through the dive), the diagram (fades first), the painter + its
      //      arrow + caption (fly past a little longer, so the dive reads as a camera move), the canvas tile on top ----
      const mkLayer = () => h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '1920px', height: '1080px', transformOrigin: '0 0' } });
      const camGlow = mkLayer(), cam = mkLayer(), camNear = mkLayer(), camTop = mkLayer();
      root.append(camGlow, cam, camNear, camTop);

      const glow = (x, y, r, color) => { const d = h('div', { class: 'abs', style: { left: `${x - r}px`, top: `${y - r}px`, width: `${2 * r}px`, height: `${2 * r}px`,
        borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`, opacity: '0' } }); camGlow.append(d); return d; };
      const glowCard = glow(400, 560, 470, 'rgba(201,223,141,.16)');
      const glowEng = glow(1610, 560, 620, 'rgba(173,133,186,.50)');

      // ---- model card ----
      const card = h('div', { class: 'abs', style: {
        left: `${CARD.x}px`, top: `${CARD.y}px`, width: `${CARD.w}px`, height: `${CARD.h}px`, borderRadius: '28px',
        background: `linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,0) 34%), ${NIGHT2}`,
        boxShadow: '0 30px 80px rgba(0,0,0,.45), 0 0 0 1.5px rgba(255,255,255,.08)' } });
      cam.append(card);
      // the card's top layer (ghost chip, stamp): same geometry and motion as the card, stacked above the capsules
      const cardTop = h('div', { class: 'abs', style: { left: `${CARD.x}px`, top: `${CARD.y}px`, width: `${CARD.w}px`, height: `${CARD.h}px` } });
      const placeIn = parent => (el, x, y) => { el.style.position = 'absolute'; el.style.left = `${x - CARD.x}px`; el.style.top = `${y - CARD.y}px`; parent.append(el); return el; };
      const at = placeIn(card), atTop = placeIn(cardTop);

      const tag = at(K.tag('ANTHROPIC 模型页'), 192, 244);
      const titleEl = h('div', { style: { font: '800 64px/1.1 var(--cn)', color: SNOW, letterSpacing: '0', whiteSpace: 'nowrap' } });
      const title = { el: titleEl, spans: Array.from('Claude Opus 5.5').map(c => h('span', { style: { display: 'inline-block', whiteSpace: 'pre' }, text: c })) };
      titleEl.append(...title.spans);
      at(titleEl, 192, 306);
      const rule = at(h('div', { style: { width: `${CARD.w - 104}px`, height: '2px', background: 'rgba(255,255,255,.08)', transformOrigin: '0 50%' } }), 192, 406);

      const rowLabel = (text, cy) => at(h('div', { style: { font: '500 32px/40px var(--cn)', height: '40px', color: FOG, letterSpacing: '.04em', whiteSpace: 'nowrap' }, text }), 192, cy - 20);
      const lblIn = rowLabel('输入', ROW_IN);
      const lblOut = rowLabel('输出', ROW_OUT);

      const chip = (place, text, x, cy, { w = 124, ht = 60, border = '2px solid rgba(244,241,242,.78)', color = SNOW, bg = 'transparent' } = {}) => place(h('div', { class: 'center', style: {
        width: `${w}px`, height: `${ht}px`, borderRadius: `${ht / 2}px`, border, color, background: bg, font: '600 36px/1 var(--cn)', boxSizing: 'border-box', whiteSpace: 'nowrap' } }, text), x, cy - ht / 2);
      const inText = chip(at, '文本', 296, ROW_IN);
      const inImg = chip(at, '图片', 436, ROW_IN);

      // ghost 「视频」: opaque, so the capsule passes under it and the strike stays readable
      const ghost = chip(atTop, '视频', GHOST.x, ROW_OUT, { border: '2px dashed rgba(163,154,155,.9)', color: FOG, bg: NIGHT2 });
      const strike = h('div', { style: { position: 'absolute', left: '-12px', top: `${GHOST.h / 2 - 2 - 2}px`, width: `${GHOST.w + 20}px`, height: '4px',
        borderRadius: '2px', background: LIME, transformOrigin: '0 50%', boxShadow: '0 0 10px rgba(201,223,141,.45)' } });
      ghost.append(strike);

      const stampWrap = atTop(h('div', { style: { width: '0px', height: '0px' } }), STAMP.cx, STAMP.cy);
      const stamp = h('div', { style: { position: 'absolute', left: '0px', top: '0px', transform: 'translate(-50%, -50%)', padding: '9px 20px 10px',
        borderRadius: '10px', border: `2.5px solid ${LILAC}`, boxShadow: `inset 0 0 0 3px ${NIGHT2}, inset 0 0 0 4.5px rgba(234,216,235,.5)`,
        color: LILAC, font: '800 30px/1.1 var(--cn)', letterSpacing: '.06em', whiteSpace: 'nowrap' }, text: '没有视频输出' });
      stampWrap.append(stamp);

      const source = h('div', { class: 'abs', style: { left: `${CARD.x + 4}px`, top: `${CARD.y + CARD.h + 26}px`, font: '500 20px/1 var(--mono)',
        color: FOG, letterSpacing: '.02em', whiteSpace: 'nowrap' }, text: '来源：Anthropic 模型概览，2026-10-01 核对' });
      cam.append(source);

      // ---- SVG layers: fan, port, edges, packets (diagram); the arrow into the canvas (near layer, with the painter) ----
      const svg = K.svgRoot(1920, 1080);
      cam.append(svg);
      const nearSvg = K.svgRoot(1920, 1080);
      camNear.append(nearSvg);
      const marker = (id, color) => s('marker', { id, viewBox: '0 0 10 10', refX: 6.5, refY: 5, markerWidth: 4.4, markerHeight: 4.4, orient: 'auto' },
        s('path', { d: 'M0,0 L10,5 L0,10 z', fill: color }));
      svg.append(s('defs', {}, marker('s03-arrow-lime', LIME)));
      nearSvg.append(s('defs', {}, marker('s03-arrow-lilac', LILAC)));

      const fan = NODES.map((_, i) => {
        const P = fanPts(i);
        const tb = arcTable(u => cubic(P[0], P[1], P[2], P[3], u));
        const path = s('path', { d: dOf(P), fill: 'none', stroke: LIME, 'stroke-width': 2.6, 'stroke-linecap': 'round', opacity: 0.5 });
        path.style.strokeDasharray = `${tb.len + 4} ${tb.len + 4}`;
        svg.append(path);
        return { tb, path };
      });
      const portDot = s('circle', { cx: PORT.x, cy: PORT.y, r: 6, fill: LIME });
      svg.append(portDot);

      const edges = NODES.map((_, i) => {
        const P = edgePts(i);
        const tb = arcTable(u => cubic(P[0], P[1], P[2], P[3], u));
        const path = s('path', { d: dOf(P), fill: 'none', stroke: LIME, 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.9 });
        path.style.strokeDasharray = `${tb.len + 4} ${tb.len + 4}`;
        svg.append(path);
        const packets = [0, 1, 2].map(() => {
          const halo = s('circle', { r: 13, fill: LIME, opacity: 0.22 });
          const core = s('circle', { r: 6.5, fill: LIME });
          svg.append(halo, core);
          return { halo, core };
        });
        return { tb, path, packets };
      });

      const arrowLen = (TILE.cy - TILE.h / 2 - 12) - (ENG.cy + ENG.h / 2 + 10);
      const arrow = s('path', { d: `M${ENG.cx},${ENG.cy + ENG.h / 2 + 10} L${ENG.cx},${TILE.cy - TILE.h / 2 - 12}`, fill: 'none', stroke: LILAC, 'stroke-width': 3.5, 'stroke-linecap': 'round' });
      arrow.style.strokeDasharray = `${arrowLen + 2} ${arrowLen + 2}`;
      nearSvg.append(arrow);

      // ---- the capsules in flight: round-capped lime strands, each a dash sliding along its own path (it bends with the
      //      curve and stretches with speed); under the card's top layer and the hero, so it tunnels under 「视频」 ----
      const capSvg = K.svgRoot(1920, 1080);
      cam.append(capSvg);
      const caps = NODES.map((nd, i) => {
        const P = fanPts(i);
        const pts = [[PILL.x + PILL.w / 2 - 100, ROW_OUT], [PORT.x, PORT.y]];          // starts hidden behind the hero
        for (let k = 1; k <= 160; k++) pts.push(cubic(P[0], P[1], P[2], P[3], k / 160));
        pts.push([NODE.cx + 120, NODES[i].y]);                                         // run-out past the node centre
        const cum = [0];
        for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
        const d = 'M' + pts.map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' L');
        const st = { fill: 'none', stroke: LIME, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
        const halo = s('path', { d, ...st, 'stroke-width': CAPS.h + 16, opacity: 0 });
        const core = s('path', { d, ...st, 'stroke-width': CAPS.h });
        capSvg.append(halo, core);
        return { halo, core, s0: 100, sp: cum[1], sn: cum[pts.length - 2] };
      });

      // ---- the node cards: each capsule at rest, opening on its word ----
      const nodes = NODES.map(nd => {
        const box = h('div', { class: 'abs center', style: { flexDirection: 'column', gap: '8px', overflow: 'hidden', boxSizing: 'border-box',
          whiteSpace: 'nowrap', border: `2px solid ${LIME}`, visibility: 'hidden' } });
        const lab = h('div', { style: { font: '800 42px/1.1 var(--cn)', color: SNOW } }, nd.label);
        const sub = h('div', { style: { font: '500 28px/1.2 var(--cn)', color: 'rgba(244,241,242,.72)' }, html: nd.sub });
        box.append(lab, sub);
        cam.append(box);
        return { box, lab, sub };
      });
      cam.append(cardTop);

      // ---- the hero: s02's underline → the blank → the lime 「文本」 pill ----
      const ring = h('div', { class: 'abs', style: { border: `2.5px solid ${LIME}`, borderRadius: '999px', boxSizing: 'border-box', opacity: '0' } });
      const hero = h('div', { class: 'abs center', style: { background: LIME, overflow: 'hidden' } });
      const heroTxt = h('span', { style: { font: '800 40px/1 var(--cn)', color: 'var(--ink)', whiteSpace: 'nowrap', letterSpacing: '.02em' }, text: '文本' });
      hero.append(heroTxt);
      cam.append(ring, hero);

      // ---- engine node (the painter) ----
      const eng = h('div', { class: 'abs', style: { left: `${ENG.cx - ENG.w / 2}px`, top: `${ENG.cy - ENG.h / 2}px`, width: `${ENG.w}px`, height: `${ENG.h}px`,
        borderRadius: `${ENG.r}px`, background: `radial-gradient(130% 110% at 50% 0%, rgba(173,133,186,.26) 0%, rgba(173,133,186,0) 62%), ${NIGHT2}` } });
      const engSvg = s('svg', { width: ENG.w, height: ENG.h, viewBox: `0 0 ${ENG.w} ${ENG.h}`, style: { position: 'absolute', left: '0px', top: '0px', overflow: 'visible' } });
      const er = ENG.r - 1, ew = ENG.w - 2, eh = ENG.h - 2;
      const engPerim = 2 * (ew + eh) - (8 - 2 * Math.PI) * er;
      const engOutline = s('rect', { x: 1, y: 1, width: ew, height: eh, rx: er, ry: er, fill: 'none', stroke: LILAC, 'stroke-width': 2.2 });
      engOutline.style.strokeDasharray = `${engPerim + 4} ${engPerim + 4}`;
      engSvg.append(engOutline);
      const icon = kind => {
        const g = s('svg', { width: 40, height: 34, viewBox: '0 0 40 34', style: { display: 'block', overflow: 'visible' } });
        const st = { fill: 'none', stroke: LILAC, 'stroke-width': 2.4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
        if (kind === 'browser') {
          g.append(s('rect', { x: 2, y: 3, width: 36, height: 28, rx: 5, ...st }), s('path', { d: 'M2 11 H38', ...st }),
            s('circle', { cx: 7.5, cy: 7, r: 1.6, fill: LILAC }), s('circle', { cx: 12.5, cy: 7, r: 1.6, fill: LILAC }), s('circle', { cx: 17.5, cy: 7, r: 1.6, fill: LILAC }));
        } else {
          g.append(s('path', { d: 'M20 2 L35 10 L35 25 L20 33 L5 25 L5 10 Z', ...st }), s('path', { d: 'M5 10 L20 18 L35 10 M20 18 L20 33', ...st }));
        }
        return h('div', { style: { transformOrigin: '50% 60%' } }, g);
      };
      const word = text => {
        const el = h('div', { style: { position: 'relative', font: '800 42px/1.1 var(--cn)', color: SNOW, whiteSpace: 'nowrap' }, text });
        const u = h('div', { style: { position: 'absolute', left: '0px', right: '0px', bottom: '-9px', height: '3px', borderRadius: '2px', background: LILAC, transformOrigin: '0 50%' } });
        el.append(u);
        return { el, u };
      };
      const iconB = icon('browser'), iconG = icon('cube');
      const wB = word('浏览器'), wG = word('图形引擎');
      const slash = h('div', { style: { font: '400 40px/1.1 var(--cn)', color: 'rgba(234,216,235,.7)' }, text: '/' });
      const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'auto auto auto', columnGap: '10px', rowGap: '12px', alignItems: 'center', justifyItems: 'center' } },
        iconB, h('div'), iconG, wB.el, slash, wG.el);
      eng.append(h('div', { class: 'fill center' }, grid), engSvg);
      camNear.append(eng);

      const cap = h('div', { class: 'abs', style: { left: `${TILE.cx - 100}px`, top: `${TILE.cy + TILE.h / 2 + 16}px`, width: '200px', textAlign: 'center',
        font: '600 22px/1 var(--mono)', color: FOG, letterSpacing: '.06em' }, text: '画面' });
      camNear.append(cap);

      // ---- output canvas tile (a live PAGE.draw page), on the top layer: it survives the dive and becomes s04's top page ----
      const tile = h('div', { class: 'abs', style: { left: `${TILE.cx - TILE.w / 2}px`, top: `${TILE.cy - TILE.h / 2}px`, width: `${TILE.w}px`, height: `${TILE.h}px`,
        borderRadius: '14px', overflow: 'hidden', background: '#0E0C0D', boxShadow: '0 24px 60px rgba(0,0,0,.5)' } });
      const canvas = h('canvas', { width: TILE.w * TILE_RES, height: TILE.h * TILE_RES, style: { position: 'absolute', left: '0px', top: '0px', width: `${TILE.w}px`, height: `${TILE.h}px`, opacity: '0' } });
      const g2 = canvas.getContext('2d');
      const tileEmpty = h('div', { class: 'fill', style: { borderRadius: '14px', border: '2px dashed rgba(244,241,242,.30)' } });
      const tileEdge = h('div', { class: 'fill', style: { borderRadius: '14px', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.14)', opacity: '0' } });
      const tileFlash = h('div', { class: 'fill', style: { borderRadius: '14px', boxShadow: `inset 0 0 0 3px ${LIME}`, opacity: '0' } });
      tile.append(canvas, tileEmpty, tileEdge, tileFlash);
      camTop.append(tile);

      return { T, bgWrap, camGlow, cam, camNear, camTop, glowEng, glowCard, card, cardTop, tag, title, rule, lblIn, lblOut, inText, inImg, ghost, strike, stampWrap,
        source, fan, portDot, edges, arrow, arrowLen, ring, hero, heroTxt, eng, engOutline, engPerim, iconB, iconG, wB, wG, cap, caps, nodes,
        tile, canvas, g2, tileEmpty, tileEdge, tileFlash };
    },

    render(S, t, ctx) {
      const { prog, spring, mixColor } = M;
      const T = S.T;

      // ---------- camera ----------
      const C = camera(t, T, ctx.dur);
      const camTf = `translate(${C.tx.toFixed(2)}px,${C.ty.toFixed(2)}px) scale(${C.s.toFixed(5)})`;
      S.camGlow.style.transform = S.cam.style.transform = S.camNear.style.transform = S.camTop.style.transform = camTf;
      // the dive leaves only the canvas: the diagram dissolves first (gone before its top text reaches the y < 112 band),
      // the painter, its arrow and 「画面」 fly outward round the growing tile a few frames longer (gone as s04 fades in)
      S.cam.style.opacity = (1 - prog(t, T.dive + 0.02, 0.34, ease.inQuad)).toFixed(4);
      S.camNear.style.opacity = (1 - prog(t, T.dive + 0.24, 0.28, ease.inQuad)).toFixed(4);

      // ---------- background: parallax with the camera; through a 'zoom' out it matches the incoming grid exactly ----------
      let bs = 1 + 0.25 * (C.s - 1), bdx = -10 * clamp(t / ctx.dur);
      const nx = ctx.next || {};
      if (nx.transition && nx.transition.type === 'zoom' && t > T.dive) {
        const p = clamp((t - ctx.dur) / (nx.transition.dur || 0.6));
        const kb = lerp(ZOOM.in, 1, ease.outCubic(p)) / lerp(1, ZOOM.out, ease.inOutCubic(p));   // incoming ÷ outgoing root scale
        const wb = ease.inOutSine(clamp((t - T.dive) / Math.max(0.05, ctx.dur - T.dive)));
        bs = lerp(bs, kb, wb); bdx = lerp(bdx, 0, wb);
      }
      S.bgWrap.style.transform = `translate(${bdx.toFixed(2)}px,0px) scale(${bs.toFixed(5)})`;

      // ---------- model card ----------
      const cp = prog(t, 0.30, 0.6, ease.outQuint);
      const rise = (1 - cp) * 40;
      const ti = t - T.land;                                // stamp impact
      const thud = ti > 0 && ti < 0.24 ? Math.sin((ti / 0.08) * Math.PI * 2) * 2.5 * (1 - ti / 0.24) : 0;
      const cardO = prog(t, 0.28, 0.4, ease.outCubic);
      tf2(S.card, { y: rise + thud, o: cardO });
      tf2(S.cardTop, { y: rise + thud, o: cardO });

      const up = (el, t0, d = 18, dur = 0.5) => { const p = prog(t, t0, dur, ease.outQuint); tf2(el, { y: (1 - p) * d, o: p }); };
      up(S.tag, 0.40);
      S.title.spans.forEach((sp, j) => { const p = prog(t, 0.48 + j * 0.03, 0.7, ease.outQuint); tf2(sp, { y: (1 - p) * 64 * 0.55, o: p, blur: (1 - p) * 6 }); });
      // a glint runs across "Opus 5.5" while it is spoken
      const gl = (t - T.opus) / Math.max(0.3, T.opusEnd - T.opus);
      S.title.spans.forEach((sp, j) => {
        let g = 0;
        if (gl > 0 && gl < 1 && j >= 7) g = Math.exp(-(((j - lerp(5.5, 16.5, gl)) / 1.6) ** 2)) * Math.sin(Math.PI * gl);
        sp.style.color = g > 0.01 ? mixColor(SNOW, LIME, g) : '';
      });
      S.rule.style.transform = `scaleX(${prog(t, 0.62, 0.55, ease.inOutCubic).toFixed(4)})`;
      up(S.lblIn, 0.72); up(S.inText, 0.80, 14); up(S.inImg, 0.88, 14);
      up(S.lblOut, 1.0);
      S.lblOut.style.color = mixColor(FOG, SNOW, prog(t, T.out - 0.06, 0.3));
      up(S.source, 1.1, 10, 0.5);

      // ghost 「视频」: slides in on the word, struck through, shudders, then dims by colour (it stays opaque)
      const gp = prog(t, T.video, 0.26, ease.outCubic);
      const ts = t - T.strike;
      const shake = ts > 0 && ts < 0.2 ? 4 * Math.sin((ts / 0.1) * Math.PI * 2) * (1 - ts / 0.2) : 0;
      tf2(S.ghost, { x: (1 - gp) * 56 + shake, o: gp });
      const dim = prog(t, T.strike + 0.2, 0.3);
      S.ghost.style.color = mixColor(FOG, NIGHT2, 0.22 * dim);
      S.ghost.style.borderColor = `rgba(163,154,155,${lerp(0.9, 0.66, dim).toFixed(3)})`;
      S.strike.style.transform = `scaleX(${prog(t, T.strike, 0.2, ease.outCubic).toFixed(4)})`;

      // stamp 「没有视频输出」 drops
      const sd = ease.inCubic(clamp((t - T.stamp) / (T.land - T.stamp)));
      const ta = t - T.land;
      const squash = ta > 0 && ta < 0.14 ? Math.sin((ta / 0.14) * Math.PI) * 0.04 : 0;
      tf2(S.stampWrap, { s: lerp(1.6, 1, sd) - squash, r: lerp(-9, -4, sd), o: clamp((t - T.stamp) / 0.07) });

      // ---------- hero: underline → blank → 「文本」 pill ----------
      // before it moves, the bar holds s02's underline position on screen (inverse camera)
      const inv = (X, Y) => [(X - C.tx) / C.s, (Y - C.ty) / C.s];
      const [L0, T0y] = inv(S02_BAR.x, S02_BAR.y);
      const [R0, B0] = inv(S02_BAR.x + S02_BAR.w, S02_BAR.y + S02_BAR.h);
      const M0 = 0.62;
      let L = L0, R = R0, hh = B0 - T0y, bot = B0;
      if (t > M0) {
        const sl = spring(t - M0, { stiffness: 90, damping: 15 });   // calm, near-critical settle (~0.75 s)
        const sr = spring(t - M0, { stiffness: 62, damping: 15 });
        const sy = prog(t, M0, 0.8, ease.inOutCubic);
        L = lerp(L0, PILL.x, sl);
        R = lerp(R0, PILL.x + PILL.w, sr);
        hh = lerp(B0 - T0y, BLANK_H, sy);
        bot = lerp(B0, ROW_OUT + PILL.h / 2 + rise, sy);
      }
      const breath = bump(t, T.out - 0.04, 0.4);           // anticipation on 「输出」
      hh += 6 * breath;
      const pp = spring(t - T.wenzi + 0.04, { stiffness: 300, damping: 17 }); // pops on 「文字」
      hh = lerp(hh, PILL.h, pp);
      const launchPulse = bump(t, T.launch - 0.02, 0.3);
      S.hero.style.left = px(L);
      S.hero.style.top = px(bot - hh + thud);
      S.hero.style.width = px(Math.max(4, R - L));
      S.hero.style.height = px(hh);
      S.hero.style.borderRadius = px(hh / 2);
      const glowH = clamp(0.35 * breath + 0.9 * bump(t, T.wenzi - 0.04, 0.7) + 0.25 * clamp(pp));
      const s02Glow = 1 - prog(t, M0, 0.7, ease.inOutCubic);   // s02's settled underline glow, relaxing as it moves
      S.hero.style.boxShadow = `0 0 ${(6 + 26 * glowH + 34 * s02Glow).toFixed(1)}px rgba(201,223,141,${(0.15 + 0.4 * glowH + 0.4 * s02Glow).toFixed(3)})`;
      tf2(S.hero, { s: 1 + 0.07 * launchPulse });
      const tp = spring(t - T.wenzi - 0.01, { stiffness: 320, damping: 18 });
      tf2(S.heroTxt, { s: lerp(0.4, 1, tp), o: clamp((t - T.wenzi - 0.01) / 0.12) });
      // ring pulse on 「文字」, capped so its left arc stays clear of 「输出」
      const rp = clamp((t - T.wenzi - 0.02) / 0.45);
      const rq = ease.outQuart(rp);
      S.ring.style.left = px(PILL.x); S.ring.style.top = px(ROW_OUT - PILL.h / 2 + thud);
      S.ring.style.width = px(PILL.w); S.ring.style.height = px(PILL.h);
      tf2(S.ring, { sx: lerp(1.04, 1.35, rq), sy: lerp(1.04, 1.5, rq), o: rp > 0 && rp < 1 ? 0.95 * (1 - rp) ** 1.5 : 0 });

      // ---------- the capsule leaves through the port and splits into three ----------
      const e = ease.inOutSine(clamp((t - T.launch) / T.fly));
      const fanF = clamp((e - EA) / (1 - EA));
      S.fan.forEach(f => { f.path.style.strokeDashoffset = ((f.tb.len + 4) * (1 - fanF)).toFixed(1); f.path.style.visibility = fanF > 0 ? 'visible' : 'hidden'; });
      const portP = spring(t - (T.launch + T.fly * 0.45), { stiffness: 300, damping: 18 });
      S.portDot.setAttribute('r', (6 * clamp(portP, 0, 1.3)).toFixed(2));
      S.portDot.style.visibility = portP > 0.01 ? 'visible' : 'hidden';

      // in flight: each capsule is a 120 × 26 dash of its path, stretched along the motion (≤ 1.5×) by its screen speed
      S.caps.forEach((c, i) => {
        const fly = t >= T.launch && t < T.arrive;
        const vis = fly ? 'visible' : 'hidden';
        c.core.style.visibility = c.halo.style.visibility = vis;
        if (!fly) return;
        const dt = 1 / 120;
        const v = (Math.abs(capS(c, T, t + dt) - capS(c, T, t - dt)) / (2 * dt)) * C.s;
        const st = 1 + Math.min(0.5, v / 2500);
        const wd = CAPS.h * (1 - 0.3 * (st - 1));
        const len = CAPS.w * st - wd;                                 // dash length between the round caps
        const a = capS(c, T, t) - len / 2;
        for (const [p, w] of [[c.core, wd], [c.halo, wd + 16]]) {
          p.setAttribute('stroke-width', w.toFixed(2));
          p.style.strokeDasharray = `${len.toFixed(2)} 100000`;
          p.style.strokeDashoffset = (-a).toFixed(2);
        }
        c.halo.style.opacity = (0.28 * (i === 0 ? 1 : clamp((e - EA) / 0.08))).toFixed(3);   // one glow until the split
      });

      // at rest: the capsule waits at its node, then opens into the node card on its word
      S.nodes.forEach((nd, i) => {
        const { box, lab, sub } = nd;
        if (t < T.arrive) { box.style.visibility = 'hidden'; return; }
        box.style.visibility = 'visible';
        const cx = NODE.cx, cy = NODES[i].y;
        let w = CAPS.w, ht = CAPS.h;
        // waiting capsule breathes softly until its word
        const t0 = T.open[i];
        const wait = t > T.arrive && t < t0 ? 0.5 - 0.5 * Math.cos(((t - T.arrive) / 0.9) * Math.PI * 2) : 0;
        w += 8 * wait;
        // opens into the node card on its word: the fill goes dark at once, the lime stays as the border, then cools
        const sp = spring(t - t0, { stiffness: 230, damping: 20 });
        const cf = prog(t, t0, 0.16, ease.outQuad);
        const cb = prog(t, t0 + 0.1, 0.5, ease.inOutCubic);
        w = lerp(w, NODE.w, sp); ht = lerp(ht, NODE.h, sp);
        box.style.left = px(cx - w / 2); box.style.top = px(cy - ht / 2);
        box.style.width = px(w); box.style.height = px(ht);
        box.style.borderRadius = px(lerp(ht / 2, 24, clamp(cf + cb)));
        if (wait > 0 || (t > T.arrive && cf === 0)) {             // pending: a soft highlight sweeps across the capsule
          const hx = (((t - T.arrive) / 0.9 + i * 0.33) % 1) * 160 - 30;
          box.style.background = `linear-gradient(100deg, ${LIME} ${(hx - 22).toFixed(1)}%, #EEF7CF ${hx.toFixed(1)}%, ${LIME} ${(hx + 22).toFixed(1)}%)`;
        } else box.style.background = mixColor(LIME, NIGHT2, cf);
        box.style.borderColor = `rgba(201,223,141,${lerp(1, 0.4, cb).toFixed(3)})`;
        const flash = bump(t, t0, 0.6);
        box.style.boxShadow = `0 20px 50px rgba(0,0,0,${(0.45 * cf).toFixed(3)}), 0 0 ${(16 + 24 * flash).toFixed(1)}px rgba(201,223,141,${(0.45 * (1 - cf) + 0.3 * flash).toFixed(3)})`;
        const lp = prog(t, t0 + 0.08, 0.4, ease.outQuint); tf2(lab, { y: (1 - lp) * 14, o: lp });
        const sb = prog(t, t0 + 0.16, 0.4, ease.outQuint); tf2(sub, { y: (1 - sb) * 10, o: sb });
      });

      // ---------- the painter: engine node + empty canvas on 「画画」 (arrives with the camera pan) ----------
      const ep = spring(t - T.paint, { stiffness: 220, damping: 20 });
      tf2(S.eng, { s: lerp(0.86, 1, ep), y: (1 - clamp(ep)) * 10, o: clamp((t - T.paint) / 0.22) });
      S.engOutline.style.strokeDashoffset = ((S.engPerim + 4) * (1 - prog(t, T.paint, 0.7, ease.inOutCubic))).toFixed(1);
      S.wB.u.style.transform = `scaleX(${prog(t, T.browser, 0.35, ease.outCubic).toFixed(4)})`;
      S.wG.u.style.transform = `scaleX(${prog(t, T.gfx, 0.35, ease.outCubic).toFixed(4)})`;
      tf2(S.iconB, { s: 1 + 0.22 * bump(t, T.browser, 0.45) });
      tf2(S.iconG, { s: 1 + 0.22 * bump(t, T.gfx, 0.45) });
      const lit = prog(t, T.light, 0.25, ease.outCubic);
      const fire = bump(t, T.engine, 0.7);
      S.eng.style.boxShadow = `0 24px 60px rgba(0,0,0,.5), 0 0 ${(24 + 40 * fire).toFixed(1)}px rgba(173,133,186,${(0.16 + 0.18 * lit + 0.4 * fire).toFixed(3)})`;

      const tp0 = T.paint + 0.14;
      const tpp = prog(t, tp0, 0.5, ease.outQuint);
      tf2(S.cap, { o: prog(t, tp0 + 0.1, 0.4) });
      S.cap.style.color = mixColor(FOG, SNOW, lit);

      // ---------- the canvas tile (s04's top page continues it: same rect through the zoom, same live ball) ----------
      tf2(S.tile, { y: (1 - tpp) * 16, o: tpp, s: 1 + 0.035 * bump(t, T.light, 0.45) });
      S.canvas.style.opacity = lit.toFixed(3);
      S.tileEmpty.style.opacity = (1 - lit).toFixed(3);
      S.tileEdge.style.opacity = lit.toFixed(3);
      S.tileFlash.style.opacity = (bump(t, T.light, 0.6) * 0.9).toFixed(3);
      PAGE.draw(S.g2, Math.max(0, t - T.light) * PAGE_SPEED, TILE.w * TILE_RES, TILE.h * TILE_RES);

      // ---------- edges into the engine on 「浏览器」, carrying lime packets ----------
      S.edges.forEach((ed, i) => {
        const e0 = T.browser + i * 0.07;
        const p = prog(t, e0, 0.6, ease.inOutCubic);
        ed.path.style.strokeDashoffset = ((ed.tb.len + 4) * (1 - p)).toFixed(1);
        ed.path.style.visibility = p > 0 ? 'visible' : 'hidden';
        if (p > 0.97) ed.path.setAttribute('marker-end', 'url(#s03-arrow-lime)'); else ed.path.removeAttribute('marker-end');
        const first = e0 + 0.18, period = 0.42, travel = 0.8;
        const nLast = Math.floor((t - first) / period);
        ed.packets.forEach((pk, j) => {
          const n = nLast - ((((nLast - j) % 3) + 3) % 3);
          const age = t - (first + n * period);
          if (n < 0 || age < 0 || age >= travel) { pk.core.style.visibility = pk.halo.style.visibility = 'hidden'; return; }
          const u = age / travel;
          const [x, y] = atLen(ed.tb, u * ed.tb.len);
          const a = Math.min(1, u / 0.12, (1 - u) / 0.12);
          for (const c of [pk.core, pk.halo]) { c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.style.visibility = 'visible'; }
          pk.core.style.opacity = a.toFixed(3);
          pk.halo.style.opacity = (0.22 * a).toFixed(3);
        });
      });

      // ---------- 「引擎」: the painter fires down into the canvas ----------
      const ap = prog(t, T.engine, 0.28, ease.outCubic);
      S.arrow.style.strokeDashoffset = ((S.arrowLen + 2) * (1 - ap)).toFixed(1);
      S.arrow.style.visibility = ap > 0 ? 'visible' : 'hidden';
      if (ap > 0.95) S.arrow.setAttribute('marker-end', 'url(#s03-arrow-lilac)'); else S.arrow.removeAttribute('marker-end');

      // ---------- glows ----------
      S.glowEng.style.opacity = (0.32 * prog(t, T.paint, 0.8) + 0.3 * lit + 0.2 * fire).toFixed(3);
      S.glowCard.style.opacity = (0.9 * prog(t, T.wenzi, 0.5) * (1 - 0.45 * prog(t, T.launch, 1.2))).toFixed(3);
    },

    events(ctx) {
      const T = timing(ctx);
      return [
        { t: T.wenzi, type: 'pop', gain: 0.5 },
        { t: T.strike, type: 'glitch', gain: 0.3 },
        { t: T.land, type: 'tick', gain: 0.3 },
        { t: T.launch, type: 'swish', gain: 0.22 },
        ...T.open.map(x => ({ t: x, type: 'blip', gain: 0.4 })),
        { t: T.paint, type: 'pop', gain: 0.3 },
        { t: T.browser, type: 'whoosh', gain: 0.4 },
        { t: T.engine, type: 'ding', gain: 0.45 },
      ];
    },
  });
})();
