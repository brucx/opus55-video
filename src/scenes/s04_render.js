/*
 * s04_render — 原理 2：代码视频就像一本手翻书。给一个时间，就算出那一页。
 *
 * Every beat is cued to the TTS word times (ctx.word against src/timeline.js), never to literals.
 *  in  s03 dives into its output tile. s04's top page starts as that very tile: same screen rect (tracked through the
 *      engine's zoom), same live ball. The ball runs out and wraps to frame 0, the page settles into the book pose
 *      and pages 11…1 are dealt in underneath it.
 *  A  The flip book: 12 pages (702 × 395, draw() on night-3 paper), page k = PAGE.draw(g, k × 0.25). Riffled on 「手」 with
 *     onion skins of the two previous balls (so the arc reads); on 「时间」 the scrubber's lime playhead
 *     says t = 1.50 s and that page lights up; on 「就算」 it lifts out of the book and lands as the preview; the playhead
 *     swings away and back and the ball docks in its own ghost ring → 「同一帧 ✓」 + footnote, kept as the footer.
 *  B  「左边」: the preview slides right (fast-out), the code panel types PAGE.draw.toString() — the one function that
 *     draws every page, the preview and every tile in this scene — and the preview plays draw(t) live (held at 2.99 s).
 *  C  「30 秒」: the preview rewinds to 0 and flies (one ease, constant lime outline) into frame 0 of a 30 × 30 grid
 *     (tile i = PAGE.draw(g, i / 30, 26, 15)); then the code panel shrinks along the bottom into the code card, captioned.
 *     「每」…「900」: the frames are computed in order and the counter counts them.
 *  D  「900 次」 is struck; 「代码」: the card's badge; 「一次」: a lime 1 lands and one function fans out to all 30 rows.
 *  E  「再」: the badge and the 1 collapse into the ledger chip 「代码 ×1」; 「F」: the FFmpeg node; 「mpeg」: the rows
 *     stream into the encoder; 「拼」: video.mp4 lands; 「视频」: it plays, the lime playhead parked on its bar.
 * Text is moved with 2D transforms only (identity → 'none'), and hidden parts are display:none, so a frame never
 * depends on what was rendered before it.
 */
(() => {
  'use strict';
  const { h } = E;
  const { clamp, lerp, prog, ease, spring } = M;
  const px = v => `${(+v).toFixed(2)}px`;
  const drawPage = (g, t, w, hh) => window.PAGE.draw(g, t, w, hh);

  // ---------------- layout ----------------
  const BK = 1.3;                                                         // flip-book scale (pages were 540 × 304)
  const PW = 702, PH = 395, NP = 12, DT = 0.25, HI = 6, ZS = 4;          // flip-book pages; HI = the t = 1.50 s page
  const PR = 13;                                                          // page corner radius
  const BOOK = { y: 414, xa: 849, xc: 896, rx: 6, ry: -22, persp: 2800 }; // hinge x: closed book (centred near 1200) → open spread
  const F0 = BOOK.persp / (BOOK.persp - NP * ZS);                         // perspective magnification of the top page
  // the book's pages are draw(t) printed on night-3 paper with a snow rim, so they read against the night background;
  // the lifted page goes back to draw()'s own #1B1718 as it lands in the preview
  const PAPER = '#2A2425', INK0 = '#1B1718', RIM = 'rgba(244,241,242,.3)';
  const LAB = { size: 28, x: 23, y: 21 };                                 // page label 「t = 0.25 s」 (22 px at 540 wide, × 1.3)
  const ONION = [0.3, 0.15];                                              // onion skin: pages k−1, k−2 on page k during the riffle
  const PV = { w: 860, h: 484, bar: 54, ax: 530, bx: 948, y: 172 };      // preview window: A centred, B right
  const SHIFT = PV.bx - PV.ax;
  const SCR = { y: 778 };                                                 // scrubber track (x: window x … +860)
  const PILL_HALF = 81;                                                   // half width of the 「t = 0.00 s」 pill
  const FOOT = { y: 828, right: 1920 - (PV.ax + PV.w) + 6 };              // footer ends 6 px inside the preview (1802 in B)
  const CAP = { x: 960, y: 648 };                                         // 「手翻书」 caption centre x, top: 24 px under the open book (cam y 164–624)
  const GR = { x: 112, y: 252, tw: 26, th: 15, gap: 4, n: 30 };
  GR.w = GR.n * (GR.tw + GR.gap) - GR.gap;
  GR.h = GR.n * (GR.th + GR.gap) - GR.gap;
  const PLATE = { x: GR.x - 12, y: GR.y - 12, w: GR.w + 24, h: GR.h + 24 };
  const COL = 1240;                                                       // right column (counter, chips, node, file)
  const CODE = { x: 112, y: 192, w: 776, size: 25, padY: 28, padX: 32, top: 40 };
  CODE.lh = CODE.size * 1.55;
  CODE.h = 12 * CODE.lh + 2 * CODE.padY;
  const CARD = { x: COL, y: 548, s: 0.46 };
  const BADGE = { x: CARD.x + 14, y: CARD.y - 46 };                       // 「代码：写 1 次」: its bottom edge sits on the card's top border
  const LEDGER = { x: COL, y: 430, oneX: COL + 104, oneY: 451 };          // 「代码 ×1」 and where its 1 sits
  const NODE = { x: COL, y: 500, w: 170, h: 80 };
  const FILE = { x: COL, y: 632, w: 560, h: 134 };
  const FX = { x: 990, y: 236, w: 270, h: 600 };                          // canvas for the fan lines / stream
  const LIME = '#C9DF8D';
  // s03_text's dive, mirrored from src/scenes/s03_text.js (TILE 280 wide at (1590, 690), −20 px drift, DIVE to (1200, 450)
  // at 2.3× over 1.1 s, the tile plays PAGE.draw at 2× speed), so s04's top page can start as exactly that tile.
  const S03 = { id: 's03_text', line: 's03_text.2', word: '引擎', cx: 1590, cy: 690, w: 280, drift: -20, dx: 1200, dy: 450, ds: 2.3, diveDur: 1.1, speed: 2 };

  // ---------------- helpers ----------------
  // 2D transform + opacity. No translate3d (no compositor layer for text), identity → 'none'; snap: whole pixels
  // (text that comes to rest must not rest at a fractional offset).
  function tf2(el, o) {
    const x = o.snap ? Math.round(o.x || 0) : o.x || 0, y = o.snap ? Math.round(o.y || 0) : o.y || 0, r = o.r || 0;
    let sx = o.sx != null ? o.sx : o.s != null ? o.s : 1, sy = o.sy != null ? o.sy : o.s != null ? o.s : 1;
    if (Math.abs(sx - 1) < 0.001 && Math.abs(sy - 1) < 0.001) sx = sy = 1;   // a settling spring rests at exactly 1
    let tr = '';
    if (Math.abs(x) >= 0.005 || Math.abs(y) >= 0.005) tr += `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) `;
    if (Math.abs(r) >= 0.0005) tr += `rotate(${r.toFixed(3)}deg) `;
    if (Math.abs(sx - 1) >= 0.00005 || Math.abs(sy - 1) >= 0.00005) tr += `scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    el.style.transform = tr ? tr.trim() : 'none';
    if (o.o != null) el.style.opacity = clamp(o.o).toFixed(4);
    if (o.blur != null) el.style.filter = o.blur > 0.05 ? `blur(${o.blur.toFixed(2)}px)` : 'none';
  }
  // hidden parts leave layout (no stale layer from another seek)
  function show(el, on) {
    if (el.__disp === undefined) el.__disp = el.style.display;
    const v = on ? el.__disp : 'none';
    if (el.style.display !== v) el.style.display = v;
  }
  // per-character spans without will-change (the shared .ch class promotes every glyph to a layer)
  function spans(el, text) {
    return Array.from(text).map(c => { const sp = h('span', { style: { display: 'inline-block', whiteSpace: 'pre' }, text: c }); el.append(sp); return sp; });
  }
  function rise(sps, t, start, { stagger = 0.03, dur = 0.6, dist = 26, blur = 4, out = Infinity, outDur = 0.3 } = {}) {
    sps.forEach((sp, i) => {
      const p = prog(t, start + i * stagger, dur, ease.outQuint);
      const q = out < Infinity ? prog(t, out + i * stagger * 0.5, outDur, ease.inCubic) : 0;
      tf2(sp, { y: (1 - p) * dist - q * 12, o: p * (1 - q), blur: (1 - p) * blur });
    });
  }
  // the code on screen is the real function, verbatim (only the method's source indentation is removed)
  function codeText() {
    const lines = window.PAGE.draw.toString().split('\n');
    const ind = Math.min(...lines.slice(1).filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    return [lines[0], ...lines.slice(1).map(l => l.slice(ind))].join('\n');
  }
  // where PAGE.draw puts the ball (same arithmetic; used only to place annotations around it)
  const ballAt = (t, w, hh) => {
    const p = (t % 3) / 3, s = Math.sin(Math.PI * 2 * t);
    return { x: w * (0.1 + 0.8 * p), y: hh * (0.62 - 0.3 * Math.abs(s)), r: hh * 0.09 };
  };
  // draw(t) on the book's paper: 'lighten' lifts draw()'s #1B1718 fill to `col` and leaves the lime ball as drawn (every
  // channel of #C9DF8D is brighter than the paper)
  function paper(g, w, hh, col) {
    if (col.toUpperCase() === INK0) return;
    g.save();
    g.globalCompositeOperation = 'lighten';
    g.fillStyle = col;
    g.fillRect(0, 0, w, hh);
    g.restore();
  }
  const hexRgb = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mixHex = (a, b, k) => {
    const A = hexRgb(a), B = hexRgb(b);
    return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k))).toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  // onion skin for page k: the balls of pages k−1 and k−2, so the riffle shows the arc and not one dot
  function drawOnion(g, k) {
    g.clearRect(0, 0, PW, PH);
    for (let j = ONION.length; j >= 1; j--) {
      if (k - j < 0) continue;
      const b = ballAt((k - j) * DT, PW, PH);
      g.globalAlpha = ONION[j - 1];
      g.fillStyle = LIME;
      g.beginPath(); g.arc(b.x, b.y, b.r, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
  }
  const gridBg = (cell, a = 0.035) => `linear-gradient(rgba(255,255,255,${a}) 1px, transparent 1px) 0 0 / ${cell}px ${cell}px,` +
    `linear-gradient(90deg, rgba(255,255,255,${a}) 1px, transparent 1px) 0 0 / ${cell}px ${cell}px`;
  const invIOS = y => Math.acos(1 - 2 * y) / Math.PI;                                    // inverse of ease.inOutSine
  const cubic = (p0, c1, c2, p3, u) => {
    const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3;
    return [a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0], a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1]];
  };
  const tileXY = i => [(i % GR.n) * (GR.tw + GR.gap), Math.floor(i / GR.n) * (GR.th + GR.gap)];
  const checkSvg = (size, color) => E.s('svg', { width: size, height: size, viewBox: '0 0 24 24', style: { display: 'block' } },
    E.s('path', { d: 'M4.5 12.8 L9.6 17.6 L19.5 6.8', fill: 'none', stroke: color, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  // camera drift in whole pixels: static text never sits at a fractional offset, whose rasterisation in Chrome depends on
  // which frames were rendered before (1 px steps, about one a second, are invisible)
  const camDrift = (t, dur) => Math.round(-16 * ease.inOutSine(clamp(t / dur)));
  const ctx2d = cv => cv.getContext('2d');

  // ---------------- the s03 → s04 handoff ----------------
  function sceneInfo(ctx) {
    const TL = window.TIMELINE;
    const i = TL.scenes.findIndex(s => s.id === ctx.id);
    return { TL, me: TL.scenes[i], prev: TL.scenes[i - 1] };
  }
  function handoffInfo(ctx) {
    const { TL, me, prev } = sceneInfo(ctx);
    const tr = me.transition || {};
    const H = { ok: false, trDur: tr.type === 'zoom' ? tr.dur || 0 : 0, wrapT: 0 };
    if (!prev || prev.id !== S03.id || !(H.trDur > 0)) return H;
    const L2 = TL.lines.find(l => l.id === S03.line);
    const wd = L2 && (L2.words || []).find(x => x.w.includes(S03.word));
    if (!wd) return H;
    H.light = wd.start - prev.start + 0.08;                       // s03: T.light = 「引擎」 + 0.08
    H.dive = Math.max(L2.end - prev.start + 0.04, H.light + 0.4); // s03: T.dive
    H.dur3 = prev.dur;
    H.off = me.start - prev.start;
    H.ok = true;
    const tt0 = tileTime(0, H);
    H.wrapT = (3 * Math.ceil(tt0 / 3 - 1e-9) - tt0) / S03.speed;  // the tile's ball wraps to frame 0 here
    return H;
  }
  const tileTime = (t, H) => Math.max(0, t + H.off - H.light) * S03.speed;
  // s03's tile (centre, width) in s04 root coordinates at local t, through the engine's zoom; frozen once the zoom ends
  function handoffRect(t, H) {
    const tc = Math.min(Math.max(t, 0), H.trDur);
    const p = clamp(tc / H.trDur);
    const t3 = tc + H.off;
    const k = ease.inOutCubic(clamp((t3 - H.dive) / S03.diveDur));
    const s3 = lerp(1, S03.ds, k);
    const cx = lerp(S03.cx + S03.drift * clamp(t3 / H.dur3), S03.dx, k), cy = lerp(S03.cy, S03.dy, k);
    const so = lerp(1, 0.92, ease.inOutCubic(p));           // engine 'zoom': outgoing scene 1 → 0.92 …
    const si = lerp(1.12, 1, ease.outCubic(p));             // … incoming 1.12 → 1, both about (960, 540)
    return { x: 960 + (cx - 960) * so / si, y: 540 + (cy - 540) * so / si, w: S03.w * s3 * so / si };
  }

  // ---------------- beats (shared by build, render and events) ----------------
  function timing(ctx) {
    const w = (n, word, nth = 0) => ctx.word(`s04_render.${n}`, word, nth);
    const T = {
      shou: w(1, '手'), shijian: w(1, '时间'), jiusuan: w(1, '就算'),
      zuobian: w(2, '这'), daima2: w(2, '代码'),
      s30: w(3, '30 秒'), mei: w(3, '每'), n900: w(3, '900'), zhen2: w(3, '帧', 1),
      dan: w(4, '但'), ci900: w(4, '900 次'), daima4: w(4, '代码'), yici: w(4, '一次'),
      zai: w(5, '再'), F: w(5, 'F'), mpeg: w(5, 'FFmpeg'), pin: w(5, '拼'), shipin: w(5, '视频'),
    };
    const { me } = sceneInfo(ctx);
    const trDur = me.transition && me.transition.type !== 'cut' ? me.transition.dur || 0 : 0;
    T.set0 = 0.35 * trDur; T.set1 = trDur + 0.85;          // the top page leaves the tile pose for the book pose
    T.deal = k => T.set0 - 0.02 + (NP - 1 - k) * 0.07;     // pages 11…1 slide in under the top page
    T.flip = k => T.shou + k * 0.14;                       // riffle: pages 0…5 (settled before 「给」)
    T.flipDur = 0.5;
    T.onion0 = T.shou - 0.25;                              // onion skins on while the pages turn …
    T.onion1 = T.shijian - 0.12;                           // … and gone before the t = 1.50 page lights up
    T.lift = T.jiusuan;                                    // the t = 1.50 page lifts into the preview
    T.liftEnd = T.lift + 0.38;
    T.scrub = T.liftEnd + 0.02;                            // playhead 1.50 → 0.60 → 1.50 (one smooth swing)
    T.scrubDur = 0.52;
    T.stamp = T.scrub + T.scrubDur - 0.04;                 // the ball docks in its ghost ring
    T.glide = T.zuobian + 0.06;                            // preview slides right (fast-out) …
    T.panel = T.glide + 0.12;                              // … the code panel follows it in
    T.type0 = T.glide + 0.25;
    T.typeDur = 0.5;                                       // typed by 「是」, then ≈ 2 s at full size
    T.play = T.glide + 0.62;                               // the preview plays draw(t) live from here (held at 2.99)
    T.c0 = T.s30 + 0.05;                                   // B → C
    T.fly0 = T.c0; T.flyDur = 0.8;                         // preview → frame 0
    T.land = T.fly0 + T.flyDur;
    T.card0 = T.c0 + 0.25; T.cardDur = 0.7;                // code panel → code card, after the preview has gone
    T.cardIn = T.card0 + T.cardDur;
    T.slot0 = T.fly0 + 0.2;                                // empty slots cascade
    T.f30 = T.fly0 + 0.36;                                 // 「30 秒」
    T.fillDur = T.n900 - T.mei;                            // frames computed in order; counter = frames done
    T.chip900 = T.dan;                                     // 「调用模型 900 次」 is read while the voice says it …
    T.strike = T.ci900 + 0.08;                             // … and struck on 「900 次」
    T.fan0 = T.yici - 0.14;                                // lines leave on 「写」, the lime 1 lands on 「一次」
    T.e0 = T.zai;                                          // D → E
    T.col0 = T.e0 + 0.06;                                  // badge + 1 collapse (after the struck chip has left)
    T.ledger = T.col0 + 0.27;                              // 「代码 ×1」 lands
    T.scan0 = T.mpeg + 0.04; T.scanStep = 0.030;           // the encoder pulls the rows in (done by 「拼」)
    T.pkDur = 0.4;
    T.fileLand = T.pin;
    return T;
  }

  // ---------------- frames computed so far (C): frame 0 is the preview; 1…899 in order between 「每」 and 「900」 ----------------
  function framesDone(t, T) {
    if (t < T.land) return 0;
    if (t < T.mei) return 1;
    return 1 + 899 * ease.inOutSine(clamp((t - T.mei) / T.fillDur));
  }
  const fillTime = (i, T) => (i === 0 ? T.land : T.mei + T.fillDur * invIOS(i / 899));
  const fanStart = (r, T) => T.fan0 + Math.abs(r - 14.5) * 0.008;
  const rowArrive = (r, T) => fanStart(r, T) + 0.34;                                 // D: the fan packet reaches row r
  const scanTime = (r, T) => T.scan0 + r * T.scanStep;                              // E: row r leaves for the encoder
  function pulseAt(t, T) {
    let p = 0;
    for (let r = 0; r < GR.n; r++) { const a = scanTime(r, T) + T.pkDur; if (t >= a) p = Math.max(p, Math.exp(-(t - a) * 14)); }
    return p;
  }

  Scene.define({
    id: 's04_render',

    build(root, ctx) {
      const T = timing(ctx);
      const H = handoffInfo(ctx);

      const bg = K.bg(root, 'night', { glows: [
        { x: 0, y: 0, r: 660, color: 'rgba(173,133,186,.46)', o: 0.6 },
        { x: 0, y: 0, r: 520, color: 'rgba(201,223,141,.16)', o: 0.6 },
      ] });
      const cam = h('div', { class: 'fill' });
      root.append(cam);

      // ================= A: the flip book =================
      const bookWrap = h('div', { class: 'abs', style: { left: px(BOOK.xa), top: px(BOOK.y), width: '0px', height: '0px',
        perspective: px(BOOK.persp), perspectiveOrigin: '0px 0px' } });
      const book = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '0px', height: '0px', transformStyle: 'preserve-3d', transformOrigin: '0px 0px' } });
      bookWrap.append(book);
      const bshadow = h('div', { class: 'abs', style: { left: px(-680 * BK), top: px(-260 * BK), width: px(1360 * BK), height: px(520 * BK),
        background: 'radial-gradient(closest-side, rgba(0,0,0,.6), rgba(0,0,0,0))', transform: 'translateZ(-14px)' } });
      const board = h('div', { class: 'abs', style: { left: '0px', top: px(-PH / 2 - 2), width: px(PW + 14), height: px(PH + 14), borderRadius: px(PR + 2),
        background: 'linear-gradient(160deg, #453C3E, #2A2425)', boxShadow: '0 0 0 1.5px rgba(244,241,242,.2)', transform: 'translateZ(0px)' } });
      book.append(bshadow, board);
      const pages = [];
      for (let k = 0; k < NP; k++) {
        const el = h('div', { class: 'abs', style: { left: '0px', top: px(-PH / 2), width: px(PW), height: px(PH), transformStyle: 'preserve-3d', transformOrigin: `0px ${PH / 2}px` } });
        const front = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(PW), height: px(PH), borderRadius: px(PR), overflow: 'hidden',
          backfaceVisibility: 'hidden' } });
        const cv = h('canvas', { width: PW, height: PH, style: { position: 'absolute', left: '0px', top: '0px', width: px(PW), height: px(PH) } });
        const g = ctx2d(cv);
        drawPage(g, k * DT, PW, PH);
        if (k > 0) paper(g, PW, PH, PAPER);                       // the top page is s03's tile first (render() papers it)
        // onion skin only on pages that are ever the top page during the riffle (1 … HI)
        const onion = k >= 1 && k <= HI ? h('canvas', { width: PW, height: PH, style: { position: 'absolute', left: '0px', top: '0px', width: px(PW), height: px(PH), opacity: '0' } }) : null;
        if (onion) drawOnion(ctx2d(onion), k);
        const lab = h('div', { class: 'abs', style: { left: px(LAB.x), top: px(LAB.y), font: `600 ${LAB.size}px/1 var(--mono)`, color: 'var(--fog)', whiteSpace: 'nowrap' },
          text: `t = ${(k * DT).toFixed(2)} s` });
        const deco = h('div', { class: 'fill' }, h('div', { class: 'fill', style: { background: gridBg(PW / 20) } }),
          h('div', { class: 'fill', style: { background: 'linear-gradient(150deg, rgba(255,255,255,.07), rgba(255,255,255,0) 45%)' } }));
        const shade = h('div', { class: 'fill', style: { background: '#000', opacity: '0' } });
        const rim = h('div', { class: 'fill', style: { borderRadius: px(PR), boxShadow: `inset 0 0 0 1.5px ${RIM}` } });
        front.append(...[cv, onion, deco, lab, shade, rim].filter(Boolean));
        // the back of a page: lighter paper with the drawing showing through, mirrored
        const back = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(PW), height: px(PH), borderRadius: px(PR), overflow: 'hidden',
          backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(200deg, #423A3C, #312A2C)' } });
        const ghost = h('canvas', { width: PW, height: PH, style: { position: 'absolute', left: '0px', top: '0px', width: px(PW), height: px(PH), transform: 'scaleX(-1)', opacity: '.13' } });
        ctx2d(ghost).drawImage(cv, 0, 0);
        const bshade = h('div', { class: 'fill', style: { background: '#000', opacity: '0' } });
        back.append(ghost, h('div', { class: 'fill', style: { background: gridBg(PW / 20, 0.04) } }), bshade,
          h('div', { class: 'fill', style: { borderRadius: px(PR), boxShadow: `inset 0 0 0 1.5px ${RIM}` } }));
        el.append(front, back);
        book.append(el);
        pages.push({ el, front, back, shade, bshade, lab, rim, deco, onion, g });
      }
      cam.append(bookWrap);

      // caption 「手翻书」 (H3 44 / 700), 24 px under the open book, clear of the scrubber pill
      const cap = h('div', { class: 'abs', style: { left: px(CAP.x - 300), top: px(CAP.y), width: '600px', textAlign: 'center', font: '700 44px/1.15 var(--cn)',
        color: 'var(--snow)', letterSpacing: '.04em', whiteSpace: 'nowrap' } });
      const capSp = spans(cap, '手翻书');
      cam.append(cap);

      // the page that lifts out of the book (3D, same perspective as the book) and lands as the preview
      const liftWrap = h('div', { class: 'abs', style: { left: px(BOOK.xc), top: px(BOOK.y), width: '0px', height: '0px',
        perspective: px(BOOK.persp), perspectiveOrigin: '0px 0px' } });
      const lift = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(PV.w), height: px(PV.h), transformOrigin: '0px 0px', overflow: 'hidden' } });
      const liftCv = h('canvas', { width: PV.w, height: PV.h, style: { position: 'absolute', left: '0px', top: '0px', width: px(PV.w), height: px(PV.h) } });
      drawPage(ctx2d(liftCv), HI * DT, PV.w, PV.h);
      const kS = PV.w / PW;
      const liftLab = h('div', { class: 'abs', style: { left: px(LAB.x * kS), top: px(LAB.y * kS), font: `600 ${(LAB.size * kS).toFixed(1)}px/1 var(--mono)`, color: 'var(--lime)', whiteSpace: 'nowrap' }, text: 't = 1.50 s' });
      const liftRing = h('div', { class: 'fill', style: { borderRadius: 'inherit', boxShadow: `inset 0 0 0 ${(3 * kS).toFixed(1)}px ${LIME}` } });
      lift.append(liftCv, h('div', { class: 'fill', style: { background: gridBg(PV.w / 20) } }), liftLab, liftRing);
      liftWrap.append(lift);

      // ================= C: the 900-frame grid on its plate (under the code panel, which leaves along the bottom) =================
      const plate = h('div', { class: 'abs', style: { left: px(PLATE.x), top: px(PLATE.y), width: px(PLATE.w), height: px(PLATE.h), borderRadius: '12px',
        background: '#0B090A', boxShadow: '0 0 0 1.5px rgba(255,255,255,.06), 0 30px 70px rgba(0,0,0,.4)' } });
      const gridCv = h('canvas', { width: GR.w, height: GR.h, style: { position: 'absolute', left: px(GR.x), top: px(GR.y), width: px(GR.w), height: px(GR.h) } });
      cam.append(plate, gridCv);

      // ================= B: the code panel → C: the code card =================
      const codeWrap = h('div', { class: 'abs', style: { left: px(CODE.x), top: px(CODE.y), width: px(CODE.w), height: px(CODE.top + CODE.h), transformOrigin: '0px 0px' } });
      const hdr = h('div', { class: 'abs', style: { left: '0px', top: '0px', height: '28px', whiteSpace: 'nowrap' } });
      const hdrMark = h('div', { class: 'abs', style: { left: '-6px', top: '3px', height: '24px', width: '470px', borderRadius: '5px', background: 'rgba(201,223,141,.24)', transformOrigin: '0 50%', transform: 'scaleX(0)' } });
      const hdrTxt = h('span', { style: { position: 'relative', font: '500 20px/28px var(--mono)', color: 'var(--fog)' }, text: '// src/lib/shared.js · 本幕正在运行的代码' });
      hdr.append(hdrMark, hdrTxt);
      const code = K.codeBlock(codeText(), { size: CODE.size, width: CODE.w });
      Object.assign(code.el.style, { left: '0px', top: px(CODE.top), padding: `${CODE.padY}px ${CODE.padX}px`, height: px(CODE.h) });
      const actBar = h('div', { class: 'abs', style: { left: '0px', top: px(CODE.top + CODE.padY + 5 * CODE.lh), width: px(CODE.w), height: px(CODE.lh),
        background: 'rgba(201,223,141,.16)', borderLeft: `4px solid ${LIME}`, transformOrigin: '0 50%' } });
      const readout = h('div', { class: 'abs', style: { left: '622px', top: px(CODE.top + CODE.padY + 5 * CODE.lh + (CODE.lh - 30) / 2), height: '30px', padding: '0 10px', borderRadius: '8px',
        background: 'rgba(201,223,141,.14)', color: 'var(--lime)', font: '600 20px/30px var(--mono)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } });
      const cardRing = h('div', { class: 'abs', style: { left: '0px', top: px(CODE.top), width: px(CODE.w), height: px(CODE.h), borderRadius: '20px',
        boxShadow: `0 0 0 ${(2 / CARD.s).toFixed(1)}px ${LIME}, 0 0 70px rgba(201,223,141,.35)`, opacity: '0' } });
      codeWrap.append(hdr, code.el, actBar, readout, cardRing);
      cam.append(codeWrap);
      // the card's caption: the header comment again, readable at card size
      const cardCap = h('div', { class: 'abs', style: { left: px(CARD.x), top: px(CARD.y - 40), font: '500 20px/28px var(--mono)', color: 'var(--fog)', whiteSpace: 'nowrap' },
        text: 'src/lib/shared.js · 本幕正在运行的代码' });
      cam.append(cardCap);

      // ================= preview group (window, scrubber, footer): centred in A, slides right on 「左边」 =================
      const pg = h('div', { class: 'fill' });
      cam.append(pg);
      const win = K.windowFrame({ w: PV.w, h: PV.h + PV.bar, title: '预览 · 一页' });
      Object.assign(win.el.style, { left: px(PV.ax), top: px(PV.y) });
      win.body.style.padding = '0px';
      const winTitle = win.el.firstChild.lastChild;
      const prevCv = h('canvas', { width: PV.w, height: PV.h, style: { position: 'absolute', left: '0px', top: '0px', width: px(PV.w), height: px(PV.h) } });
      const ringSvg = E.s('svg', { width: PV.w, height: PV.h, viewBox: `0 0 ${PV.w} ${PV.h}`, style: { position: 'absolute', left: '0px', top: '0px', overflow: 'visible' } });
      const b15 = ballAt(1.5, PV.w, PV.h);
      const ring = E.s('circle', { cx: b15.x, cy: b15.y, r: b15.r + 10, fill: 'none', stroke: LIME, 'stroke-width': 3, 'stroke-dasharray': '9 8' });
      const ringFlash = E.s('circle', { cx: b15.x, cy: b15.y, r: b15.r + 10, fill: 'rgba(201,223,141,.35)', stroke: LIME, 'stroke-width': 2 });
      ringSvg.append(ringFlash, ring);
      win.body.append(prevCv, h('div', { class: 'fill', style: { background: gridBg(PV.w / 20) } }), ringSvg);
      pg.append(win.el);

      // scrubber: 0–3 s, a minor tick per flip-book page (0.25 s)
      const scr = h('div', { class: 'abs', style: { left: px(PV.ax), top: px(SCR.y - 60), width: px(PV.w), height: '100px' } });
      const track = h('div', { class: 'abs', style: { left: '0px', top: '58px', width: px(PV.w), height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,.16)', transformOrigin: '0 50%' } });
      const trackFill = h('div', { class: 'abs', style: { left: '0px', top: '58px', height: '4px', borderRadius: '2px', background: LIME, width: '0px' } });
      scr.append(track, trackFill);
      const ticks = [];
      for (let q = 0; q <= 12; q++) {
        const major = q % 4 === 0;
        const tk = h('div', { class: 'abs', style: { left: px(Math.round(q / 12 * PV.w) - 1), top: px(major ? 52 : 54), width: '2px', height: px(major ? 16 : 12), background: major ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.25)' } });
        scr.append(tk);
        let lab = null;
        if (major) {
          // the last label ends at the track end (stays inside the content box)
          lab = h('div', { class: 'abs', style: { left: px(q === 12 ? PV.w + 1 : Math.round(q / 12 * PV.w)), top: '74px', transform: q === 12 ? 'translateX(-100%)' : 'translateX(-50%)',
            font: '600 20px/1 var(--mono)', color: 'var(--fog)', whiteSpace: 'nowrap' }, text: q === 12 ? '3 s' : String(q / 4) });
          scr.append(lab);
        }
        ticks.push({ tk, lab, q });
      }
      const phLine = h('div', { class: 'abs', style: { left: '-1px', top: '44px', width: '3px', height: '32px', borderRadius: '2px', background: LIME, boxShadow: '0 0 12px rgba(201,223,141,.7)' } });
      const pill = h('div', { class: 'abs', style: { left: '0px', top: '0px', height: '38px', padding: '0 15px', borderRadius: '19px', background: LIME, color: 'var(--ink)',
        font: '600 22px/38px var(--mono)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', transform: 'translateX(-50%)', boxShadow: '0 8px 24px rgba(201,223,141,.25)' } });
      const pillTxt = h('span', { text: 't = 1.50 s' });
      pill.append(pillTxt);
      const pillBox = h('div', { class: 'abs', style: { left: '0px', top: '0px' } }, pill);
      scr.append(phLine, pillBox);
      pg.append(scr);

      // footer: determinism stamp + footnote (right-aligned to the preview; stays to the end)
      const foot = h('div', { class: 'abs', style: { right: px(FOOT.right), top: px(FOOT.y), display: 'flex', alignItems: 'center', gap: '18px', whiteSpace: 'nowrap' } });
      const stamp = h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 12px 5px 16px', border: `2px solid ${LIME}`, borderRadius: '10px',
        color: 'var(--lime)', font: '800 28px/1.25 var(--cn)', transformOrigin: '50% 50%' } }, h('span', { text: '同一帧' }), checkSvg(28, LIME));
      const fnote = h('div', { style: { font: '500 20px/1.3 var(--cn)', color: 'var(--fog)' }, text: '同一时刻、同一状态；换一台机器，像素仍可能有细微差别' });
      foot.append(stamp, fnote);
      pg.append(foot);
      cam.append(liftWrap);                                         // above the window it lands in

      // ================= C =================
      // the preview flying into frame 0 (above the code panel)
      const flyCv = h('canvas', { width: PV.w, height: PV.h, style: { position: 'absolute', left: '0px', top: '0px', width: px(PV.w), height: px(PV.h), transformOrigin: '0px 0px' } });
      cam.append(flyCv);
      // frame 0 lands: a lime box round slot 0 and its label
      const slotBox = h('div', { class: 'abs', style: { left: px(GR.x - 4), top: px(GR.y - 4), width: px(GR.tw + 8), height: px(GR.th + 8), borderRadius: '5px',
        border: `2px solid ${LIME}`, boxShadow: '0 0 14px rgba(201,223,141,.55)', transformOrigin: '50% 50%' } });
      const slotTag = h('div', { class: 'abs', style: { left: px(GR.x - 4), top: px(GR.y + GR.th + 10), padding: '3px 9px 4px', borderRadius: '7px', background: '#0B090A',
        border: '1.5px solid rgba(201,223,141,.7)', color: 'var(--lime)', font: '600 18px/1.2 var(--mono)', whiteSpace: 'nowrap', transformOrigin: '0% 0%' }, text: '帧 0' });
      cam.append(slotBox, slotTag);

      // formula over the grid (two halves cued separately) + 「1 页 ＝ 1 帧」
      const formula = h('div', { class: 'abs', style: { left: px(GR.x), top: '184px', font: '700 44px/1.2 var(--cn)', color: 'var(--fog)', whiteSpace: 'nowrap' } });
      const fSpans = spans(formula, '30 秒 × 每秒 30 帧');
      cam.append(formula);
      const chipPage = h('div', { class: 'abs', style: { left: '520px', top: '190px', padding: '8px 14px', borderRadius: '12px', border: '1.5px solid rgba(234,216,235,.6)',
        background: 'rgba(234,216,235,.06)', color: 'var(--lilac)', font: '600 24px/1.1 var(--mono)', whiteSpace: 'nowrap' }, text: '1 页 ＝ 1 帧' });
      cam.append(chipPage);

      // counter + unit
      const counter = K.counter({ size: 200 });
      Object.assign(counter.el.style, { position: 'absolute', left: px(COL), top: '196px', transformOrigin: '0% 60%' });
      const unit = h('div', { class: 'abs', style: { left: px(COL + 400), top: '292px', font: '800 72px/1 var(--cn)', color: 'var(--snow)' }, text: '帧' });
      cam.append(counter.el, unit);

      // ================= D =================
      const struck = h('div', { class: 'abs', style: { left: px(COL), top: '418px', padding: '6px 18px 8px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,.16)',
        background: 'rgba(255,255,255,.035)', whiteSpace: 'nowrap' } });
      const struckTxt = h('span', { style: { font: '500 30px/1.45 var(--cn)', color: 'var(--fog)' }, text: '调用模型 900 次' });
      const strike = h('div', { class: 'abs', style: { left: '12px', right: '12px', top: 'calc(50% - 2px)', height: '4px', borderRadius: '2px', background: LIME, transformOrigin: '0 50%', transform: 'scaleX(0)', boxShadow: '0 0 10px rgba(201,223,141,.6)' } });
      struck.append(struckTxt, strike);
      cam.append(struck);
      const badge = h('div', { class: 'abs', style: { left: px(BADGE.x), top: px(BADGE.y), padding: '5px 12px 6px', borderRadius: '10px', background: LIME, color: 'var(--ink)',
        font: '800 24px/1.15 var(--cn)', whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,.35)', transformOrigin: '0% 50%' }, text: '代码：写 1 次' });
      const ONE = { x: CARD.x + CODE.w * CARD.s + 34, y: CARD.y + 36 };
      const one = h('div', { class: 'abs', style: { left: px(ONE.x), top: px(ONE.y), font: '700 160px/1 var(--display)', color: 'var(--lime)',
        textShadow: '0 0 40px rgba(201,223,141,.45)', transformOrigin: '50% 60%' }, text: '1' });
      // E: the ledger chip both collapse into (kept to the end)
      const ledger = h('div', { class: 'abs', style: { left: px(LEDGER.x), top: px(LEDGER.y), display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 14px 6px',
        borderRadius: '10px', border: `1.5px solid ${LIME}`, background: 'rgba(201,223,141,.08)', color: 'var(--lime)', font: '600 22px/1.25 var(--mono)',
        whiteSpace: 'nowrap', transformOrigin: '0% 50%' } }, h('span', { text: '代码' }), h('span', { text: '×1' }));
      cam.append(badge, one, ledger);


      // ================= E =================
      const node = h('div', { class: 'abs center', style: { left: px(NODE.x), top: px(NODE.y), width: px(NODE.w), height: px(NODE.h), borderRadius: '18px', background: 'var(--night-2)',
        border: '2px solid var(--lilac)', boxShadow: '0 0 40px rgba(173,133,186,.35), 0 20px 50px rgba(0,0,0,.45)', font: '600 34px/1 var(--mono)', color: 'var(--snow)' } }, 'FFmpeg');
      const nodeBar = h('div', { class: 'abs', style: { left: '16px', bottom: '10px', height: '4px', width: '0px', borderRadius: '2px', background: LIME } });
      node.append(nodeBar);
      cam.append(node);
      const arrowSvg = K.svgRoot(1920, 1080);
      const ax = NODE.x + NODE.w / 2;
      const arrow = K.drawPath(`M${ax},${NODE.y + NODE.h + 6} L${ax},${FILE.y - 8}`, { stroke: LIME, 'stroke-width': 3 });
      const arrowHead = E.s('path', { d: `M${ax - 8},${FILE.y - 16} L${ax},${FILE.y - 6} L${ax + 8},${FILE.y - 16}`, fill: 'none', stroke: LIME, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      arrowSvg.append(arrow.el, arrowHead);
      cam.append(arrowSvg);

      const file = h('div', { class: 'abs', style: { left: px(FILE.x), top: px(FILE.y), width: px(FILE.w), height: px(FILE.h), borderRadius: '18px', background: '#0E0C0D',
        boxShadow: `0 0 0 2px ${LIME}, 0 24px 60px rgba(0,0,0,.5), 0 0 50px rgba(201,223,141,.18)`, transformOrigin: '15% 0%' } });
      const fileCv = h('canvas', { width: 192, height: 108, style: { position: 'absolute', left: '13px', top: '13px', width: '192px', height: '108px', borderRadius: '9px' } });
      const fileRim = h('div', { class: 'abs', style: { left: '13px', top: '13px', width: '192px', height: '108px', borderRadius: '9px', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.2)' } });
      const fileName = h('div', { class: 'abs', style: { left: '226px', top: '24px', display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' } });
      const play = E.s('svg', { width: 22, height: 24, viewBox: '0 0 22 24' }, E.s('path', { d: 'M2 2 L20 12 L2 22 Z', fill: LIME }));
      fileName.append(play, h('span', { style: { font: '500 28px/1.2 var(--mono)', color: 'var(--snow)' }, text: 'video.mp4 · 00:30' }));
      const fTrack = h('div', { class: 'abs', style: { left: '226px', top: '92px', width: '312px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,.18)' } });
      const fFill = h('div', { class: 'abs', style: { left: '226px', top: '92px', width: '0px', height: '4px', borderRadius: '2px', background: LIME } });
      const fPill = h('div', { class: 'abs', style: { left: '0px', top: '80px', width: '80px', height: '28px', borderRadius: '14px', background: LIME, color: 'var(--ink)',
        font: '600 20px/28px var(--mono)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textAlign: 'center' } });
      file.append(fileCv, fileRim, fileName, fTrack, fFill, fPill);
      cam.append(file);

      // fan lines (D) and the stream into the encoder (E). On top: a canvas is a composited layer, and anything that
      // scales above one keeps its raster scale between frames (seek-order dependent text); its lines stop short of
      // the right column, so nothing visible changes.
      const fx = h('canvas', { width: FX.w, height: FX.h, style: { position: 'absolute', left: px(FX.x), top: px(FX.y), width: px(FX.w), height: px(FX.h) } });
      cam.append(fx);

      return {
        T, H, bg, cam, bookWrap, book, bshadow, board, pages, cap, capSp, liftWrap, lift, liftLab, liftRing, pg, win, winTitle, prevCv, ring, ringFlash,
        scr, track, trackFill, ticks, phLine, pillBox, pill, pillTxt, foot, stamp, fnote, codeWrap, hdr, hdrMark, hdrTxt, code, actBar, readout, cardRing,
        cardCap, plate, gridCv, flyCv, slotBox, slotTag, formula, fSpans, chipPage, counter, unit, struck, strike, struckTxt, badge, one, ONE, ledger, fx,
        node, nodeBar, arrow, arrowHead, arrowSvg, file, fileCv, fPill, fFill,
        g: { prev: ctx2d(prevCv), lift: ctx2d(liftCv), grid: ctx2d(gridCv), fly: ctx2d(flyCv), fx: ctx2d(fx), file: ctx2d(fileCv) },
        last: {},
      };
    },

    render(s, t, ctx) {
      const T = s.T, H = s.H;
      const redraw = (key, val, fn) => { if (s.last[key] !== val) { s.last[key] = val; fn(); } };

      // ---------- camera drift (translate only, so right-aligned text never passes x 1808) and glows ----------
      const camY = camDrift(t, ctx.dur);
      tf2(s.cam, { y: camY });
      const gp = prog(t, T.glide, 0.45, ease.outCubic);
      const cpos = prog(t, T.c0, 0.9, ease.inOutCubic);
      const epos = prog(t, T.e0, 1.2, ease.inOutCubic);
      const open = prog(t, T.shou - 0.05, 0.95, ease.inOutSine);
      const bx = lerp(BOOK.xa, BOOK.xc, open);
      const gx = lerp(lerp(lerp(1180, 960, open), 1378, gp), 560, cpos);
      const gy = lerp(lerp(440, 450, gp), 520, cpos);
      s.bg.glowEls[0].style.transform = `translate(${lerp(gx, 1420, epos).toFixed(1)}px, ${gy.toFixed(1)}px)`;
      s.bg.glowEls[1].style.transform = `translate(${lerp(lerp(lerp(1100, 700, open), 400, gp), 1450, cpos).toFixed(1)}px, ${lerp(760, 640, cpos).toFixed(1)}px)`;

      // ================= A: flip book =================
      const out = prog(t, T.lift, 0.3, ease.outCubic);
      const bookOn = t < T.lift + 0.32;
      show(s.bookWrap, bookOn);
      if (bookOn) {
        // the book's pose: s03's tile (flat, tracked through the zoom) → the closed book (rx 9°, ry −22°, full size)
        let dxT = 0, dyT = 0, lsT = 0;
        if (H.ok) {
          const r = handoffRect(t, H);
          const scT = r.w / (PW * F0);
          dxT = (r.x - BOOK.xa) / F0 - scT * PW / 2;
          dyT = (r.y - camY - BOOK.y) / F0;
          lsT = Math.log(scT);
        }
        const wB = ease.inOutCubic(clamp((t - T.set0) / (T.set1 - T.set0)));
        const bsc = Math.exp(lsT * (1 - wB));
        s.bookWrap.style.left = px(bx);
        s.book.style.transform = `translate3d(${(dxT * (1 - wB)).toFixed(2)}px, ${(dyT * (1 - wB)).toFixed(2)}px, 0px) scale(${bsc.toFixed(5)}) ` +
          `rotateX(${(BOOK.rx * wB).toFixed(3)}deg) rotateY(${(BOOK.ry * wB).toFixed(3)}deg)`;
        s.bookWrap.style.opacity = (1 - out).toFixed(3);
        const under = prog(t, T.set0 + 0.05, 0.6);
        s.board.style.opacity = under.toFixed(3);
        s.bshadow.style.opacity = under.toFixed(3);
        const hl = prog(t, T.shijian + 0.1, 0.3);
        const onA = (prog(t, T.onion0, 0.2) * (1 - prog(t, T.onion1, 0.3, ease.inOutCubic))).toFixed(3);
        s.pages.forEach((p, k) => {
          const dp = k === 0 ? 1 : prog(t, T.deal(k), 0.45, ease.outCubic);
          const fp = k < HI ? prog(t, T.flip(k), T.flipDur, ease.outCubic) : 0;
          const phi = 180 * fp;
          const zR = (NP - k) * ZS, zL = ZS + k * ZS;
          const z = lerp(zR, zL, fp);
          p.el.style.transform = `translate3d(${((1 - dp) * 70 * BK).toFixed(2)}px, ${((1 - dp) * 16 * BK + out * 34).toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${(-phi).toFixed(2)}deg)`;
          const a = k === 0 ? 1 : clamp(dp * 5);
          const sn = Math.sin(Math.PI * fp);
          p.front.style.opacity = (k === HI && t >= T.lift ? 0 : a).toFixed(3);
          p.back.style.opacity = a.toFixed(3);
          p.shade.style.opacity = (fp < 0.5 ? 0.3 * sn : 0).toFixed(3);
          p.bshade.style.opacity = (fp >= 0.5 ? 0.3 * sn : 0).toFixed(3);
          if (p.onion) p.onion.style.opacity = onA;
          if (k === 0) {
            // the top page is s03's live tile until its ball wraps to frame 0, then it is page t = 0.00; it takes the
            // book's paper, rim and corner radius as it settles into the book pose (s03's tile: #1B1718, rim .14, r 14 at 280 wide)
            const tp = H.ok && t < H.wrapT ? tileTime(t, H) : 0;
            const wP = H.ok ? wB : 1;
            const pc = mixHex(INK0, PAPER, wP);
            redraw('p0', `${tp.toFixed(4)}|${pc}`, () => { drawPage(p.g, tp, PW, PH); paper(p.g, PW, PH, pc); });
            p.lab.style.opacity = prog(t, H.wrapT + 0.04, 0.3).toFixed(3);
            p.deco.style.opacity = prog(t, T.set0 + 0.15, 0.5).toFixed(3);
            const rr = `${lerp(H.ok ? 14 * PW / S03.w : PR, PR, wB).toFixed(1)}px`;
            p.front.style.borderRadius = rr;
            p.rim.style.borderRadius = rr;
            const rw = lerp(1.5 * PW / S03.w, 1.5, wP);                          // s03's 1.5 px edge at tile scale → the book's rim
            p.rim.style.boxShadow = `inset 0 0 0 ${rw.toFixed(2)}px rgba(${lerp(255, 244, wP).toFixed(0)},${lerp(255, 241, wP).toFixed(0)},${lerp(255, 242, wP).toFixed(0)},${lerp(0.14, 0.3, wP).toFixed(3)})`;
          }
          if (k === HI) {
            p.lab.style.color = hl > 0.5 ? 'var(--lime)' : 'var(--fog)';
            p.rim.style.boxShadow = hl > 0 ? `inset 0 0 0 ${(1.5 + 2 * hl).toFixed(2)}px rgba(201,223,141,${(0.3 + 0.7 * hl).toFixed(3)})` : `inset 0 0 0 1.5px ${RIM}`;
            p.front.style.boxShadow = hl > 0 ? `0 0 ${(44 * hl).toFixed(1)}px rgba(201,223,141,${(0.38 * hl).toFixed(3)})` : 'none';
          }
        });
      }
      // caption 「手翻书」
      const capOn = t > T.shou - 0.15 && t < T.lift + 0.45;
      show(s.cap, capOn);
      if (capOn) rise(s.capSp, t, T.shou - 0.12, { stagger: 0.03, dur: 0.7, dist: 24, out: T.lift - 0.1, outDur: 0.25 });

      // ---------- the page lifts into the preview ----------
      const le = ease.inOutCubic(prog(t, T.lift, T.liftEnd - T.lift, ease.linear));
      const liftOn = t >= T.lift && t < T.liftEnd;
      show(s.liftWrap, liftOn);
      if (liftOn) {
        s.liftWrap.style.left = px(bx);
        const s0 = PW / PV.w;
        const zHi = (NP - HI) * ZS;
        const tx = lerp(0, PV.ax - bx, le), ty = lerp(0, PV.y + PV.bar - BOOK.y, le), tz = 150 * Math.sin(Math.PI * le);
        s.lift.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, ${tz.toFixed(2)}px) rotateX(${(BOOK.rx * (1 - le)).toFixed(3)}deg) rotateY(${(BOOK.ry * (1 - le)).toFixed(3)}deg) ` +
          `translate3d(0px, ${(-PH / 2 * (1 - le)).toFixed(2)}px, ${(zHi * (1 - le)).toFixed(2)}px) scale(${lerp(s0, 1, le).toFixed(5)})`;
        const r0 = PR / s0;
        s.lift.style.borderRadius = `${lerp(r0, 0, le).toFixed(1)}px ${lerp(r0, 0, le).toFixed(1)}px ${lerp(r0, 22, le).toFixed(1)}px ${lerp(r0, 22, le).toFixed(1)}px`;
        const pc = mixHex(PAPER, INK0, le);                                     // book paper → draw()'s own fill (the preview's)
        redraw('lift', pc, () => { drawPage(s.g.lift, HI * DT, PV.w, PV.h); paper(s.g.lift, PV.w, PV.h, pc); });
        s.liftLab.style.opacity = (1 - clamp(le / 0.45)).toFixed(3);
        s.liftRing.style.opacity = (1 - clamp((le - 0.3) / 0.6)).toFixed(3);
      }

      // ---------- playhead time ----------
      // A: 1.50, one smooth swing to 0.60 and back; B: plays live from 1.50 and holds at 2.99; C: rewinds to 0 in flight
      let tPh = 1.5;
      if (t >= T.scrub && t < T.scrub + T.scrubDur) tPh = 1.5 - 0.9 * (1 - Math.cos(2 * Math.PI * (t - T.scrub) / T.scrubDur)) / 2;
      if (t >= T.play) tPh = Math.min(2.99, 1.5 + (t - T.play));
      const flyP = prog(t, T.fly0, T.flyDur, ease.linear);
      if (t >= T.fly0) tPh = lerp(Math.min(2.99, 1.5 + Math.max(0, T.fly0 - T.play)), 0, ease.inOutCubic(clamp(flyP / 0.75)));

      // ================= preview group =================
      const pgOn = t >= T.shijian - 0.01;
      show(s.pg, pgOn);
      if (pgOn) {
        tf2(s.pg, { x: SHIFT * gp, snap: true });
        const winA = prog(t, T.lift + 0.18, 0.26, ease.outCubic) * (1 - prog(t, T.c0, 0.14, ease.outCubic));
        show(s.win.el, winA > 0.001);
        tf2(s.win.el, { o: winA, s: lerp(0.97, 1, prog(t, T.lift + 0.18, 0.3, ease.outCubic)) });
        // title: one page in A, the live function once it plays
        const titleTxt = t < T.play ? '预览 · 一页' : '预览 · draw(t)';
        if (s.winTitle.textContent !== titleTxt) s.winTitle.textContent = titleTxt;
        s.winTitle.style.opacity = clamp(Math.abs(t - T.play) / 0.1).toFixed(3);
        const prevOn = t >= T.liftEnd && t < T.fly0;
        show(s.prevCv, prevOn);
        if (prevOn) redraw('prev', tPh.toFixed(4), () => drawPage(s.g.prev, tPh, PV.w, PV.h));
        // ghost ring: appears as the page lands; the ball swings out and docks back in → flash; gone once the preview plays
        const ringA = prog(t, T.liftEnd - 0.1, 0.3, ease.outCubic) * (1 - prog(t, T.play + 0.2, 0.3));
        s.ring.setAttribute('r', (b15r() + 10 + 18 * (1 - prog(t, T.liftEnd - 0.1, 0.3, ease.outCubic))).toFixed(2));
        s.ring.style.opacity = (ringA * 0.95).toFixed(3);
        s.ring.style.strokeDashoffset = String((-t * 14).toFixed(2));
        const fl0 = t >= T.stamp ? Math.exp(-(t - T.stamp) * 5) : 0;
        const fl = fl0 > 0.03 ? fl0 : 0;
        s.ringFlash.style.opacity = fl.toFixed(3);
        s.ringFlash.style.display = fl > 0 ? '' : 'none';
        s.ringFlash.setAttribute('r', (b15r() + 10 + 26 * (1 - fl)).toFixed(2));

        // scrubber
        const scrA = prog(t, T.shijian, 0.4, ease.outCubic) * (1 - prog(t, T.c0, 0.16, ease.outCubic));
        show(s.scr, scrA > 0.001);
        s.scr.style.opacity = scrA.toFixed(3);
        s.track.style.transform = `scaleX(${prog(t, T.shijian, 0.45, ease.outCubic).toFixed(4)})`;
        s.ticks.forEach(({ tk, lab, q }) => {
          const a = prog(t, T.shijian + 0.05 + q * 0.025, 0.25);
          tk.style.opacity = a.toFixed(3);
          if (lab) lab.style.opacity = a.toFixed(3);
        });
        const phx = (tPh / 3) * PV.w;
        s.trackFill.style.width = px(phx * prog(t, T.shijian + 0.15, 0.3));
        const pillIn = T.shijian + 0.12;
        const psp = spring(t - pillIn, { stiffness: 260, damping: 19 });
        tf2(s.pillBox, { x: clamp(phx, PILL_HALF, PV.w - PILL_HALF), y: lerp(14, 0, clamp(psp)), o: clamp((t - pillIn) / 0.15) });
        s.pill.style.transform = `translateX(-50%) scale(${lerp(0.6, 1, psp).toFixed(4)})`;
        tf2(s.phLine, { x: phx, o: clamp((t - pillIn) / 0.15) });
        const txt = `t = ${tPh.toFixed(2)} s`;
        if (s.pillTxt.textContent !== txt) s.pillTxt.textContent = txt;
      }

      // footer stamp (kept to the end)
      const footOn = t >= T.stamp - 0.05;
      show(s.foot, footOn);
      if (footOn) {
        const ss = t - T.stamp;
        const ssp = ss > 1.5 ? 1 : spring(ss, { stiffness: 320, damping: 17 });
        tf2(s.stamp, { s: lerp(1.6, 1, clamp(ssp, 0, 1.2)), r: -3, o: clamp(ss / 0.12) });
        const fp = prog(t, T.stamp + 0.12, 0.5, ease.outQuint);
        tf2(s.fnote, { x: (1 - fp) * -16, o: fp });
      }

      // ================= B: code panel → C: code card =================
      const codeIn = prog(t, T.panel, 0.6, ease.outQuint);
      const cardOut = prog(t, T.e0, 0.28, ease.inCubic);
      const codeOn = codeIn > 0.001 && cardOut < 1;
      show(s.codeWrap, codeOn);
      if (codeOn) {
        // shrink and drop first, then slide right along the bottom (never through the preview's flight path)
        const q = clamp((t - T.card0) / T.cardDur);
        const qs = ease.outCubic(q), qx = ease.inOutCubic(q);
        const sc = lerp(1, CARD.s, qs);
        const dx = lerp(0, CARD.x - CODE.x, qx) + (1 - codeIn) * -90 + cardOut * 80;
        const dy = lerp(0, CARD.y - CODE.y - CODE.top * CARD.s, qs);
        const lift = prog(t, T.daima4, 0.35, ease.outCubic) * (1 - cardOut);
        tf2(s.codeWrap, { x: dx, y: dy - 6 * lift, s: sc, o: codeIn * (1 - cardOut), snap: true });
        s.code.render(prog(t, T.type0, T.typeDur, ease.linear), t < T.type0 + T.typeDur + 0.1);
        s.hdr.style.opacity = (prog(t, T.panel + 0.06, 0.4) * (1 - prog(t, T.card0, 0.12))).toFixed(3);
        const mk = prog(t, T.daima2, 0.38, ease.inOutCubic);
        s.hdrMark.style.transform = `scaleX(${mk.toFixed(4)})`;
        s.hdrTxt.style.color = mk > 0.4 ? 'var(--snow)' : 'var(--fog)';
        const barA = prog(t, T.type0 + T.typeDur * 0.62, 0.3, ease.outCubic) * (1 - prog(t, T.card0, 0.15));
        s.actBar.style.opacity = barA.toFixed(3);
        s.actBar.style.transform = `scaleX(${barA.toFixed(4)})`;
        s.readout.style.opacity = barA.toFixed(3);
        const xv = `x = ${Math.round(ballAt(tPh, PV.w, PV.h).x)}`;
        if (s.readout.textContent !== xv) s.readout.textContent = xv;
        s.cardRing.style.opacity = lift.toFixed(3);
      }
      // the card's caption: from its landing until the badge takes the spot on 「代码」
      const ccA = prog(t, T.cardIn - 0.05, 0.35, ease.outCubic) * (1 - prog(t, T.daima4 - 0.15, 0.15, ease.inCubic));
      show(s.cardCap, ccA > 0.001);
      tf2(s.cardCap, { y: (1 - prog(t, T.cardIn - 0.05, 0.45, ease.outCubic)) * 10, o: ccA });

      // ================= C: grid =================
      const gridOn = t >= T.slot0 - 0.12;
      show(s.plate, gridOn);
      show(s.gridCv, gridOn);
      if (gridOn) {
        s.plate.style.opacity = prog(t, T.slot0 - 0.12, 0.35).toFixed(3);
        redraw('grid', Math.round(t * 1000), () => drawGrid(s.g.grid, t, T));
      }
      // the preview flies into frame 0: one ease drives size and position; constant 2 px lime outline
      const flyOn = t >= T.fly0 && t < T.land;
      show(s.flyCv, flyOn);
      if (flyOn) {
        const e = ease.inOutCubic(flyP);
        const sc = Math.exp(e * Math.log(GR.tw / PV.w));
        const cx = lerp(PV.bx + PV.w / 2, GR.x + GR.tw / 2, e);
        const cy = lerp(PV.y + PV.bar + PV.h / 2, GR.y + GR.th / 2, e) - 90 * Math.sin(Math.PI * e);
        tf2(s.flyCv, { x: cx - PV.w * sc / 2, y: cy - PV.h * sc / 2, s: sc });
        const rr = lerp(0, 3 / sc, e), rb = lerp(22, 3 / sc, e);
        s.flyCv.style.borderRadius = `${rr.toFixed(1)}px ${rr.toFixed(1)}px ${rb.toFixed(1)}px ${rb.toFixed(1)}px`;
        s.flyCv.style.boxShadow = `0 0 0 ${(2 / sc).toFixed(2)}px ${LIME}, 0 0 ${(18 / sc).toFixed(1)}px rgba(201,223,141,.35)`;
        redraw('fly', tPh.toFixed(4), () => drawPage(s.g.fly, tPh, PV.w, PV.h));
      }
      // frame 0 has landed: box + 「帧 0」 for ~0.8 s (gone before the frames under the label are computed)
      const slotA = prog(t, T.land - 0.02, 0.12) * (1 - prog(t, T.land + 0.62, 0.22, ease.inCubic));
      show(s.slotBox, slotA > 0.001);
      show(s.slotTag, slotA > 0.001);
      if (slotA > 0.001) {
        const ssp = spring(t - T.land, { stiffness: 360, damping: 20 });
        tf2(s.slotBox, { s: lerp(1.8, 1, clamp(ssp, 0, 1.2)), o: slotA });
        tf2(s.slotTag, { y: (1 - clamp(ssp)) * -8, o: slotA });
      }
      // formula: 「30 秒」 then 「× 每秒 30 帧」
      const fOn = t > T.f30 - 0.05;
      show(s.formula, fOn);
      if (fOn) {
        s.fSpans.forEach((sp, i) => {
          const st = i < 4 ? T.f30 + i * 0.03 : T.mei + (i - 4) * 0.03;
          const p = prog(t, st, 0.6, ease.outQuint);
          tf2(sp, { y: (1 - p) * 26, o: p, blur: (1 - p) * 4 });
        });
      }
      const chipOn = t >= T.zhen2 + 0.1;
      show(s.chipPage, chipOn);
      if (chipOn) {
        const cs = t - (T.zhen2 + 0.1);
        const chipSp = cs > 1.5 ? 1 : spring(cs, { stiffness: 280, damping: 18 });
        tf2(s.chipPage, { s: lerp(0.7, 1, chipSp), o: clamp(cs / 0.15) });
      }

      // counter = number of computed frames; it steps back on 「一次」 so the 1 and the encoder lead
      const cOn = t >= T.mei - 0.15;
      show(s.counter.el, cOn);
      if (cOn) {
        s.counter.render(Math.max(1, Math.min(900, Math.floor(framesDone(t, T) + 1e-6))));
        const k = t >= T.n900 ? Math.sin(Math.min(Math.PI, (t - T.n900) * 12)) * Math.exp(-(t - T.n900) * 3) : 0;
        const dim = prog(t, T.yici, 0.3, ease.inOutCubic);
        tf2(s.counter.el, { s: 1 + 0.07 * k, o: prog(t, T.mei - 0.15, 0.25) * lerp(1, 0.6, dim), y: (1 - prog(t, T.mei - 0.15, 0.4, ease.outCubic)) * 20 });
        s.counter.el.style.textShadow = `0 0 ${(30 + 50 * Math.max(0, k)).toFixed(1)}px rgba(201,223,141,${((0.18 + 0.4 * Math.max(0, k)) * (1 - dim)).toFixed(3)})`;
      }
      const unitOn = t >= T.zhen2;
      show(s.unit, unitOn);
      if (unitOn) {
        const us = t - T.zhen2;
        const usp = us > 1.5 ? 1 : spring(us, { stiffness: 300, damping: 18 });
        tf2(s.unit, { s: lerp(0.6, 1, usp), o: clamp(us / 0.15) * lerp(1, 0.7, prog(t, T.yici, 0.3, ease.inOutCubic)), y: (1 - clamp(usp)) * 10 });
      }

      // ================= D =================
      const stA = prog(t, T.chip900, 0.45, ease.outCubic);
      const stOut = prog(t, T.e0 - 0.1, 0.2, ease.inCubic);
      const stOn = stA > 0.001 && stOut < 1;
      show(s.struck, stOn);
      if (stOn) {
        const shake = t > T.strike && t < T.strike + 0.6 ? 5 * Math.sin((t - T.strike) * 70) * Math.exp(-(t - T.strike) * 12) : 0;
        tf2(s.struck, { x: (1 - stA) * 40 + shake, y: -stOut * 14, o: stA * (1 - stOut) });
        s.strike.style.transform = `scaleX(${prog(t, T.strike, 0.22, ease.outCubic).toFixed(4)})`;
        s.struckTxt.style.color = t > T.strike + 0.1 ? '#7A7273' : 'var(--fog)';
      }

      // badge 「代码：写 1 次」 and the lime 1; on 「再」 both collapse into the ledger chip 「代码 ×1」
      const col = prog(t, T.col0, 0.3, ease.inOutCubic);
      const badgeOn = t >= T.daima4 && t < T.col0 + 0.3;
      show(s.badge, badgeOn);
      if (badgeOn) {
        const bs = spring(t - T.daima4, { stiffness: 300, damping: 18 });
        tf2(s.badge, { x: (LEDGER.x - BADGE.x) * col, y: (LEDGER.y - BADGE.y) * col, s: lerp(0.6, 1, bs) * lerp(1, 0.7, col), r: -2 * (1 - col),
          o: clamp((t - T.daima4) / 0.15) * (1 - prog(t, T.col0 + 0.1, 0.18)) });
      }
      const oneOn = t >= T.yici && t < T.col0 + 0.34;
      show(s.one, oneOn);
      if (oneOn) {
        const osp = spring(t - T.yici, { stiffness: 260, damping: 15 });
        const c1 = prog(t, T.col0 + 0.02, 0.3, ease.inOutCubic);
        const ox = s.ONE.x + 44, oy = s.ONE.y + 96;                              // the glyph's transform origin on screen
        tf2(s.one, { x: (LEDGER.oneX - ox) * c1, y: (LEDGER.oneY - oy) * c1 - 40 * Math.sin(Math.PI * c1),
          s: lerp(1.9, 1, clamp(osp, 0, 1.3)) * lerp(1, 22 / 160, c1), o: clamp((t - T.yici) / 0.1) * (1 - prog(t, T.col0 + 0.22, 0.1)) });
      }
      const ledOn = t >= T.ledger;
      show(s.ledger, ledOn);
      if (ledOn) {
        const ls = t - T.ledger;
        const lsp = ls > 1.5 ? 1 : spring(ls, { stiffness: 320, damping: 18 });
        tf2(s.ledger, { s: lerp(0.7, 1, clamp(lsp, 0, 1.2)), o: clamp(ls / 0.1) });
        s.ledger.style.boxShadow = `0 0 ${(26 * Math.exp(-ls * 4)).toFixed(1)}px rgba(201,223,141,${(0.6 * Math.exp(-ls * 4)).toFixed(3)})`;
      }

      // fan lines + stream (one canvas)
      const fxOn = t >= T.fan0 - 0.05;
      show(s.fx, fxOn);
      if (fxOn) redraw('fx', Math.round(t * 1000), () => drawFx(s.g.fx, t, T));

      // ================= E =================
      const nodeOn = t >= T.F;
      show(s.node, nodeOn);
      if (nodeOn) {
        const nsp = t - T.F > 1.2 ? 1 : spring(t - T.F, { stiffness: 260, damping: 17 });
        const arrived = clamp((t - (T.scan0 + T.pkDur)) / (29 * T.scanStep + 0.001));
        const pulse = pulseAt(t, T);                                              // a row arrives: the node glows
        tf2(s.node, { s: lerp(0.6, 1, nsp), o: clamp((t - T.F) / 0.15) });
        s.node.style.boxShadow = `0 0 ${(40 + 30 * pulse).toFixed(1)}px rgba(173,133,186,${(0.35 + 0.3 * pulse).toFixed(3)}), ` +
          `0 0 0 ${(3 * pulse).toFixed(2)}px rgba(201,223,141,${(0.55 * pulse).toFixed(3)}), 0 20px 50px rgba(0,0,0,.45)`;
        s.nodeBar.style.width = px((NODE.w - 32) * (t >= T.scan0 + T.pkDur ? arrived : 0));
      }
      const arrowOn = t >= T.fileLand - 0.15;
      show(s.arrowSvg, arrowOn);
      if (arrowOn) {
        s.arrow.render(prog(t, T.fileLand - 0.15, 0.25, ease.outCubic));
        s.arrowHead.style.opacity = prog(t, T.fileLand + 0.02, 0.12).toFixed(3);
      }
      const fileOn = t >= T.fileLand;
      show(s.file, fileOn);
      if (fileOn) {
        const fsp = t - T.fileLand > 1.2 ? 1 : spring(t - T.fileLand, { stiffness: 220, damping: 18 });
        tf2(s.file, { y: lerp(-70, 0, clamp(fsp, 0, 1.2)), s: lerp(0.5, 1, clamp(fsp, 0, 1.1)), o: clamp((t - T.fileLand) / 0.12) });
        const tv = Math.max(0, t - T.shipin);                                     // plays from 「视频」
        redraw('file', tv.toFixed(4), () => drawPage(s.g.file, tv, 192, 108));
        const fx0 = 226, fw = 312;
        const ppx = Math.max(fx0 + 38, fx0 + (tv / 30) * fw);
        s.fFill.style.width = px(ppx - fx0);
        s.fPill.style.left = px(Math.round(ppx) - 40);
        const pt = `00:${String(Math.floor(tv)).padStart(2, '0')}`;
        if (s.fPill.textContent !== pt) s.fPill.textContent = pt;
      }
    },

    events(ctx) {
      const T = timing(ctx);
      const out = [];
      for (let k = 0; k < HI; k++) out.push({ t: T.flip(k), type: 'tick', gain: 0.32 });
      out.push({ t: T.lift, type: 'swish', gain: 0.22 });
      out.push({ t: T.scrub, type: 'tick', gain: 0.3 }, { t: T.scrub + T.scrubDur / 2, type: 'tick', gain: 0.3 });
      out.push({ t: T.stamp, type: 'ding', gain: 0.32 });
      out.push({ t: T.glide, type: 'swish', gain: 0.16 });
      const nType = Math.max(4, Math.round(T.typeDur * 13.7));                 // same key rate as before (13 over 0.95 s)
      for (let i = 0; i < nType; i++) out.push({ t: T.type0 + i * T.typeDur / nType, type: 'type', gain: 0.1 });
      out.push({ t: T.c0, type: 'swish', gain: 0.18 });
      out.push({ t: T.land, type: 'blip', gain: 0.2 });
      out.push({ t: T.n900 - 0.6, type: 'rise_short', gain: 0.28 }, { t: T.n900, type: 'pop', gain: 0.45 });
      out.push({ t: T.zhen2, type: 'blip', gain: 0.22 });
      out.push({ t: T.strike, type: 'glitch', gain: 0.22 });
      out.push({ t: T.yici, type: 'impact', gain: 0.28 });
      out.push({ t: T.ledger, type: 'blip', gain: 0.18 });
      out.push({ t: T.F, type: 'whoosh', gain: 0.32 });
      out.push({ t: T.fileLand, type: 'ding', gain: 0.32 });
      return out;
    },
  });

  const b15r = () => ballAt(1.5, PV.w, PV.h).r;

  function drawGrid(g, t, T) {
    g.clearRect(0, 0, GR.w, GR.h);
    for (let r = 0; r < GR.n; r++) {
      const s0 = T.slot0 + r * 0.016;
      const tArr = rowArrive(r, T);
      const tScan = scanTime(r, T);
      for (let c = 0; c < GR.n; c++) {
        const i = r * GR.n + c;
        const [x, y] = tileXY(i);
        const tf0 = fillTime(i, T);
        if (t < tf0) {                                   // an empty slot: the cascade sweeps from frame 0 outwards
          const sa = prog(t, s0 + c * 0.006, 0.2, ease.outCubic);
          if (sa <= 0) continue;
          g.globalAlpha = sa;
          g.fillStyle = 'rgba(255,255,255,.025)';
          g.fillRect(x, y, GR.tw, GR.th);
          g.strokeStyle = 'rgba(255,255,255,.10)';
          g.lineWidth = 1;
          g.strokeRect(x + 0.5, y + 0.5, GR.tw - 1, GR.th - 1);
          continue;
        }
        const fp = clamp((t - tf0) / 0.14);
        g.globalAlpha = 1;
        g.save();
        const k = lerp(0.55, 1, ease.outBack(fp));
        g.translate(x + GR.tw / 2, y + GR.th / 2);
        g.scale(k, k);
        g.translate(-GR.tw / 2, -GR.th / 2);
        drawPage(g, i / 30, GR.tw, GR.th);
        g.restore();
        g.globalAlpha = 0.2;                             // computed frames are brighter cells than the empty slots
        g.strokeStyle = '#FFFFFF';
        g.lineWidth = 1;
        g.strokeRect(x + 0.5, y + 0.5, GR.tw - 1, GR.th - 1);
        // a freshly computed frame flashes lime
        let fl = 0.4 * (1 - clamp((t - tf0) / 0.15));
        // D: the function's packet lights the row from its right end
        const tLit = tArr + ((GR.n - 1 - c) / GR.n) * 0.26;
        if (t >= tLit) fl = Math.max(fl, 0.36 * Math.exp(-(t - tLit) * 7));
        // E: the encoder pulls the row in
        if (t >= tScan) fl = Math.max(fl, 0.26 * Math.exp(-(t - tScan) * 6));
        if (fl > 0.005) {
          g.globalAlpha = fl;
          g.fillStyle = LIME;
          g.fillRect(x, y, GR.tw, GR.th);
        }
      }
    }
    g.globalAlpha = 1;
    // E: scan line
    const sp = (t - T.scan0) / (29 * T.scanStep);
    if (sp > -0.05 && sp < 1.15) {
      const yy = clamp(sp, 0, 1) * (GR.h - GR.th) + GR.th;
      g.globalAlpha = clamp(sp < 1 ? 1 : 1 - (sp - 1) / 0.15);
      const grd = g.createLinearGradient(0, yy - 20, 0, yy + 2);
      grd.addColorStop(0, 'rgba(201,223,141,0)');
      grd.addColorStop(1, 'rgba(201,223,141,.35)');
      g.fillStyle = grd;
      g.fillRect(0, yy - 20, GR.w, 22);
      g.fillStyle = LIME;
      g.fillRect(0, yy, GR.w, 2);
      g.globalAlpha = 1;
    }
  }

  function drawFx(g, t, T) {
    g.clearRect(0, 0, FX.w, FX.h);
    const rowY = r => GR.y + r * (GR.th + GR.gap) + GR.th / 2 - FX.y;
    const xRow = GR.x + GR.w + 6 - FX.x;
    const path = (P0, C1, C2, P3, u) => {
      g.beginPath();
      const N = 26;
      for (let j = 0; j <= N; j++) {
        const [x, y] = cubic(P0, C1, C2, P3, (j / N) * u);
        if (j === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
    };
    // D: one function → every row
    const fanFade = 1 - prog(t, T.e0, 0.35, ease.inCubic);
    if (fanFade > 0 && t >= T.fan0) {
      const P0 = [CARD.x - 4 - FX.x, CARD.y + (CODE.h * CARD.s) / 2 - FX.y];
      for (let r = 0; r < GR.n; r++) {
        const st = fanStart(r, T);
        const u = prog(t, st, 0.3, ease.outCubic);
        if (u <= 0) continue;
        const P3 = [xRow, rowY(r)], C1 = [P0[0] - 120, P0[1]], C2 = [P3[0] + 90, P3[1]];
        g.globalAlpha = 0.55 * fanFade;
        g.strokeStyle = LIME;
        g.lineWidth = 1.5;
        path(P0, C1, C2, P3, u);
        const pk = (t - (st + 0.08)) / 0.26;
        if (pk > 0 && pk < 1) {
          const [x, y] = cubic(P0, C1, C2, P3, ease.inOutSine(pk));
          g.globalAlpha = fanFade;
          g.fillStyle = LIME;
          g.beginPath(); g.arc(x, y, 3.5, 0, Math.PI * 2); g.fill();
        }
      }
    }
    // E: rows stream into the encoder
    if (t >= T.scan0) {
      const P3 = [NODE.x - 6 - FX.x, NODE.y + NODE.h / 2 - FX.y];
      for (let r = 0; r < GR.n; r++) {
        const st = scanTime(r, T);
        if (t < st) continue;
        const P0 = [xRow, rowY(r)], C1 = [P0[0] + 100, P0[1]], C2 = [P3[0] - 110, P3[1]];
        g.globalAlpha = 0.2;
        g.strokeStyle = LIME;
        g.lineWidth = 1.2;
        path(P0, C1, C2, P3, prog(t, st, 0.3, ease.outCubic));
        const pk = (t - st) / T.pkDur;
        if (pk > 0 && pk < 1) {
          const e = ease.inOutSine(pk);
          const [x, y] = cubic(P0, C1, C2, P3, e);
          const k = lerp(1, 0.55, e);
          g.globalAlpha = 1;
          g.save();
          g.translate(x, y); g.scale(k, k); g.translate(-GR.tw / 2, -GR.th / 2);
          drawPage(g, (r * GR.n + GR.n - 1) / 30, GR.tw, GR.th);
          g.strokeStyle = LIME; g.lineWidth = 1.5; g.strokeRect(0, 0, GR.tw, GR.th);
          g.restore();
        }
      }
    }
    g.globalAlpha = 1;
  }
})();
