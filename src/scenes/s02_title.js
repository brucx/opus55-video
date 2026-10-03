/*
 * s02_title — "Including this frame": X-ray our own frame, then the toast becomes the title and the syllabus.
 *
 * Voice (every time below comes from ctx.word / ctx.cue, never a literal):
 *   s02_title.1 包括你现在看到的这一帧。
 *   s02_title.2 用 Opus 5.5 做的视频，为什么这么炫？小白怎么做？一次讲明白。
 *
 * Choreography
 *   cut     s01's held toast frame, scrim, HUD and credits continue (same styles as s01_cold's HUD). The engine chrome
 *           boots on the downbeat and the beat ruler pages to 8s–16s: the match cut on the 8.0 s bar line, so the
 *           playhead restarts at the left and the 8 s bar tick strikes lime.
 *   包括    the playhead's stem extends to full height and the pill collapses into it (the code view grows with the
 *           stem): a lime scanline sweeps left → right in 0.6 s. Behind it the frame turns into code view (footage
 *           30 %, 48 px lime grid) and three outlines with 30 px labels resolve, each label popping when the line
 *           reaches the object it names: the progress bar (as the full-height stem touches it), the <img> toast and
 *           the subtitle box (computed from TIMELINE subs + a measured span, never read from the DOM). All three are up
 *           by ≈0.8 s (8.8 s film time). The credit row lifts 50 px to make room for the progress-bar label and is
 *           never cut; the provenance chip fades as a whole when the line reaches it.
 *   帧      "this frame": the outlines pulse 2 → 3.5 px with a glow and the frame counter flashes.
 *   line end  the X-ray hands back in three steps, so each label stays as long as it is true:
 *           · the code view, the toast outline and its 「<img> 原作片段」 label retract (0.18 s) and are gone at the
 *             handoff, when the footage has cross-dissolved (under them) into our code replica of the toast (fitted:
 *             mean difference ≈1.3 % inside the pill box): nothing labels our replica as original footage;
 *           · the progress-bar outline and label stay until just before Opus;
 *           · the subtitle label stays pinned to the live subtitle box (its outline and leader follow the engine's
 *             chunk swap on 用) through the iris, and fades on 做.
 *   用      the replica text blur-swaps to 每一帧，都是代码; the author chip 「@twoclipping 原作片段」 leaves with the
 *           footage it credits (gone ≈0.12 s later, before the Chinese text is readable).
 *   Opus    the pill springs to lime, a night iris opens from its centre; the characters lift out and grow into the
 *           150 px hero (ink on lime / snow on night: a knockout copy inside the pill); the empty pill gathers to a dot.
 *   5.5→做  the dot does lists-006's dual-spring stretch (right edge 260/22 leads, left edge 170/20) and settles as the
 *           1100×16 underline on 做.  The H3 rises from 5.5 (amendment: ≈3.0 s so it stays ≥ 5.1 s).
 *   为什么  chips 01 + 02 · 小白 chip 03 · end of 「怎么做？」 chip 04 「？」 (≥ 2.2 s on screen, G3) · 明白 its wobble.
 *   tail    during s03's lime wipe the text dims; the underline (s03 picks it up at the same screen spot) stays bright.
 *
 * Determinism: everything under `world` (which carries the drift scale) uses 2D transforms only (tf2), never E.tf /
 * translate3d / will-change (K.title's .ch spans are will-change layers, so the H3 is built here): a composited
 * descendant would composite `world`, whose raster scale then sticks across frames and depends on render order.
 * Every animated element also reaches a true rest state (springs eased to exactly 1 by toRest, and tf2 writes
 * `transform: none` at identity): text that has been transform-animated and still carries a transform rasters its
 * glyphs up to ±0.5 px differently after a sequential run than when the same frame is rendered fresh.
 */
(() => {
  'use strict';
  const { h, s } = E;
  const { clamp, lerp, prog, ease, spring } = M;

  const W = 1920, H = 1080;
  const LIME = '#C9DF8D', INK = '#241E1E', SNOW = '#F4F1F2';
  const L1 = 's02_title.1', L2 = 's02_title.2';

  // ---------- geometry ----------
  // Toast measured on co-006-cmdk f00075 (1280×720 → ×1.5), footage coordinates (before s01's push).
  const TOAST = { l: 311.25, r: 1607.25, t: 420.75, b: 660.75, rad: 120 };
  const TCX = (TOAST.l + TOAST.r) / 2, TCY = (TOAST.t + TOAST.b) / 2;
  const DISC = { cx: 426.75, cy: 540.75, r: 40.5 };
  // replica text, fitted to the footage by search (weight, size, tracking, position, softness)
  const EN = { text: 'Every frame is code', size: 71, weight: 550, left: 513.0, top: 505.35, soft: 0.78 };
  // drop shadow fitted to the footage's darkening around the pill (two Gaussian layers, mean error 1.4 levels)
  const SH = [[2.9, 7.8, 0.179], [35.3, 54.9, 0.208]];
  const shadowCss = k => SH.map(([y, b, a]) => `0 ${y}px ${b}px rgba(0,0,0,${(a * k).toFixed(3)})`).join(', ');
  const UL = { l: 410, r: 1510, cy: 600, h: 16 };      // the underline the pill settles into (s03 expects it here)
  const HERO = { text: '每一帧，都是代码', size: 150, top: 386 };
  // Noto Sans SC half-width punctuation alternates: the full-width comma would leave a 155 px hole between 帧 and 都
  // and push the hero ≈50 px past each end of the underline
  const HALT = '"halt" 1';
  const PUNCT = '，、。：；！？';
  const PILLTXT = { x: 516, size: 60 };                // Chinese toast text, left-aligned after the check
  const DOT = 42;                                      // the pill gathers to this dot before it stretches
  const SWEEP_END = W + 12;                            // the sweep eases out just past the right edge: it leaves on 这
  const H3 = { text: 'Opus 5.5 炫酷视频的秘密 ＋ 小白上手指南', size: 44, cy: 690 };
  const Q_GAP = 14;                                    // chip 04: equal gaps either side of the 「？」 ink

  // X-ray labels: the toast (above it), the subtitle box (right-aligned at 1808) and the progress bar (at 112, its
  // leader down x 140). Labels 2 and 3 share the row y 835–879; the credit row lifts out of it to 772 on 包括.
  // Short enough to read in the time each one is true: the author's handle is on the credit chip below, and the
  // subtitle label is the one that stays (pinned to the live box until 做).
  const LAB = ['<img> 原作片段', '字幕＝语音时间戳', '进度条 · t ÷ 总时长'];
  const LAB_PX = 30;
  const LAB_FONT = `600 ${LAB_PX}px/1.2 var(--mono)`;
  const LH = LAB_PX * 1.2 + 8;                         // label tab height
  const LAB3 = { x: 112, lead: 140 };
  const CREDIT_LIFT = 50;                              // credit row 822 → 772 (0.28 s, outCubic) as the scan starts

  // s01_cold's HUD (window.S01_COLD_HUD exposes its geometry; fall back to the same numbers)
  const S1 = window.S01_COLD_HUD || {};
  const HUD = {
    x0: S1.X0 || 112, pps: S1.PXS || 186, y: S1.RULER_Y || 160, secs: 8,
    pillW: S1.PILL_W || 156, pillH: S1.PILL_H || 40, pillTop: S1.PILL_TOP || 170,
  };
  const PUSH = (S1.TOAST && S1.TOAST.holdScale && S1.TOAST.holdScale[1]) || 1.02;   // s01 ends its push here
  const PUSH_V = 0.02 / 1.5;                          // …at this speed (1.00 → 1.02 over its 1.5 s hold)
  const U01 = (S1.TOAST && S1.TOAST.underline) || { x: 516, y: 599, w: 620, h: 10 };
  const SCRIM = 'linear-gradient(180deg, rgba(18,16,17,.78) 0px, rgba(18,16,17,.74) 100px, rgba(18,16,17,.66) 150px, ' +
    'rgba(18,16,17,.5) 200px, rgba(18,16,17,.28) 250px, rgba(18,16,17,.1) 300px, rgba(18,16,17,0) 340px)';
  const HALO = '0 1px 3px rgba(18,16,17,.6)';

  // ---------- helpers ----------
  // damped spring x0 → x1 (unit mass), optional initial velocity
  function springTo(t, x0, x1, k, c, v0 = 0) {
    if (t <= 0) return x0;
    const w0 = Math.sqrt(k), z = c / (2 * w0), A = x0 - x1;
    if (z < 1) {
      const wd = w0 * Math.sqrt(1 - z * z), B = (v0 + z * w0 * A) / wd;
      return x1 + Math.exp(-z * w0 * t) * (A * Math.cos(wd * t) + B * Math.sin(wd * t));
    }
    return x1 + Math.exp(-w0 * t) * (A + (v0 + w0 * A) * t);
  }
  const bump = (tau, k = 10, f = 18) => (tau <= 0 ? 0 : Math.exp(-k * tau) * Math.sin(f * tau));
  const px = v => `${v.toFixed(2)}px`;
  const f2 = v => v.toFixed(2);
  // half outlines of a rounded rect, both from the left middle (top half clockwise, bottom half anti-clockwise)
  function halfPath(l, tp, r, bt, rad, upper) {
    const cy = (tp + bt) / 2;
    rad = Math.max(0, Math.min(rad, (bt - tp) / 2, (r - l) / 2));
    return upper
      ? `M${f2(l)},${f2(cy)} L${f2(l)},${f2(tp + rad)} A${f2(rad)},${f2(rad)} 0 0 1 ${f2(l + rad)},${f2(tp)} L${f2(r - rad)},${f2(tp)} A${f2(rad)},${f2(rad)} 0 0 1 ${f2(r)},${f2(tp + rad)} L${f2(r)},${f2(cy)}`
      : `M${f2(l)},${f2(cy)} L${f2(l)},${f2(bt - rad)} A${f2(rad)},${f2(rad)} 0 0 0 ${f2(l + rad)},${f2(bt)} L${f2(r - rad)},${f2(bt)} A${f2(rad)},${f2(rad)} 0 0 0 ${f2(r)},${f2(bt - rad)} L${f2(r)},${f2(cy)}`;
  }
  const fullPath = (l, tp, r, bt, rad) => `${halfPath(l, tp, r, bt, rad, true)} ${halfPath(l, tp, r, bt, rad, false)}`;
  const halfLen = (w, hh, rad) => { rad = Math.max(0, Math.min(rad, hh / 2, w / 2)); return hh - 2 * rad + w - 2 * rad + Math.PI * rad; };
  // draw-on by dash offset. The gap is longer than the path, so the next dash can never start at the path's end (a
  // zero-length dash there draws a round-cap dot, depending on rounding); an undrawn path is hidden outright.
  function setDash(p, len, k) {
    k = clamp(k);
    p.style.visibility = k > 0 ? 'visible' : 'hidden';
    p.style.strokeDasharray = `${f2(len)} ${f2(len + 4)}`;
    p.style.strokeDashoffset = f2(len * (1 - k));
  }
  // rgba() between two [r, g, b, a] colours
  const mixRgba = (a, b, k) => `rgba(${a.slice(0, 3).map((v, i) => Math.round(lerp(v, b[i], k))).join(',')},${lerp(a[3], b[3], k).toFixed(3)})`;
  // ink box of a string in a canvas font: { l, r, w } from the text origin (null if the font cannot be measured)
  function inkBox(text, font) {
    try {
      const g = document.createElement('canvas').getContext('2d');
      g.font = font;
      const m = g.measureText(text);
      const l = -m.actualBoundingBoxLeft, r = m.actualBoundingBoxRight;
      if (Number.isFinite(l) && Number.isFinite(r) && r - l > 1) return { l, r, w: r - l };
    } catch (e) { /* fall through */ }
    return null;
  }
  // the subtitle chunk the engine shows at film time G (same lookup as the engine's)
  function subAt(G) {
    for (const l of window.TIMELINE.lines) {
      if (G < l.start - 0.05 || G > l.end + 0.6) continue;
      for (const sb of l.subs || []) if (G >= sb.start && G < sb.end) return sb;
    }
    return null;
  }

  // 2D transform + opacity. E.tf uses translate3d, which promotes an element to a compositor layer whose raster scale
  // can stick across frames (a glyph first rastered at 0.4× stays soft at 1×, and pixels depend on render order).
  // A 2D transform paints into the scene layer at the exact scale every frame.
  // At rest (identity to the written precision) the transform is removed: text whose transform has been animating
  // keeps a different glyph positioning while any transform remains (±0.5 px per glyph, so a frame rendered after a
  // sequential run differed from the same frame rendered fresh); `none` resets it.
  function tf2(el, { x = 0, y = 0, s = 1, sx = null, sy = null, r = 0, o = null } = {}) {
    const ax = sx != null ? sx : s, ay = sy != null ? sy : s;
    const X = x.toFixed(2), Y = y.toFixed(2), R = r.toFixed(3), SX = ax.toFixed(5), SY = ay.toFixed(5);
    const zero = v => Number(v) === 0;
    if (zero(X) && zero(Y) && zero(R) && SX === '1.00000' && SY === '1.00000') el.style.transform = 'none';
    else {
      let tr = `translate(${X}px,${Y}px)`;
      if (!zero(R)) tr += ` rotate(${R}deg)`;
      if (SX !== '1.00000' || SY !== '1.00000') tr += ` scale(${SX},${SY})`;
      el.style.transform = tr;
    }
    if (o != null) el.style.opacity = clamp(o).toFixed(4);
  }
  // a spring value (or any value converging on `rest`) blended to exactly `rest` between tau0 and tau1, so that the
  // element reaches a true rest state (and an identity transform) instead of creeping on by 1e-5 forever
  function toRest(v, tau, tau0, tau1, rest = 1) {
    if (tau >= tau1) return rest;
    if (tau <= tau0) return v;
    const k = 1 - (tau - tau0) / (tau1 - tau0);
    return rest + (v - rest) * k * k * (3 - 2 * k);
  }
  function pop2(el, t, start, { from = 0.6, r = 0, stiffness = 260, damping = 20, fade = 0.18 } = {}) {
    const sp = toRest(spring(t - start, { stiffness, damping }), t - start, 0.8, 1.1);
    tf2(el, { s: lerp(from, 1, sp), r, o: clamp((t - start) / fade) });
    return sp;
  }
  // K.title's per-character rise (outQuint 0.6 s, 26 ms stagger, 0.6 em rise, 6 px → 0 blur) on plain inline-block
  // spans driven by tf2: no .ch class (will-change), no translate3d
  function riseTitle(text, { size, weight = 700, color, ls = '0.01em', lh = 1.2, stagger = 0.026, dur = 0.6, rise = 0.6 }) {
    const el = h('div', { class: 'abs', style: { left: '0px', top: px(H3.cy - size * lh / 2), width: `${W}px`, textAlign: 'center', whiteSpace: 'nowrap',
      font: `${weight} ${size}px/${lh} var(--cn)`, color, letterSpacing: ls } });
    const spans = Array.from(text).map(c => { const sp = h('span', { style: { display: 'inline-block', whiteSpace: 'pre' }, text: c }); el.append(sp); return sp; });
    function render(t, start) {
      spans.forEach((sp, i) => {
        const p = prog(t, start + i * stagger, dur, ease.outQuint);
        tf2(sp, { y: (1 - p) * size * rise, o: p });
        sp.style.filter = p > 0.001 && p < 0.999 ? `blur(${f2((1 - p) * 6)}px)` : 'none';
      });
    }
    return { el, render };
  }

  function timings(ctx) {
    const T = {};
    T.scan = ctx.word(L1, '包括');            // stem extends, pill collapses into it
    T.ext = 0.13;
    T.sw0 = T.scan + T.ext;                   // sweep starts
    T.sw1 = T.sw0 + 0.6;                      // the line leaves the frame on 现在: every label is up by ≈0.8 s
    T.zhen = ctx.word(L1, '帧');              // "this frame": outlines pulse, the frame counter flashes
    T.ret = ctx.cueEnd(L1);                   // the line is spoken: the HUD ruler and s01's scrim hand back
    T.retD = 0.18;                            // X-ray retracts (inCubic)
    T.yong = ctx.word(L2, '用');              // replica text blur-swaps to Chinese; the author chip leaves
    T.hand1 = Math.min(T.ret + 0.11, T.yong - 0.008);   // footage → replica cross-dissolve, under the retract
    T.hand0 = T.hand1 - 0.11;
    T.xret = T.hand1 - T.retD;                // code view + toast outline + <img> label: gone when the replica takes over
    T.opus = ctx.word(L2, 'Opus');            // lime + iris
    T.pret = T.opus - 0.05;                   // progress-bar outline + label retract
    T.v55 = ctx.word(L2, '5.5');              // H3 rise (≈3.0 s, amendment)
    T.zuo = ctx.word(L2, '做');               // underline settles; the subtitle label (pinned to the live box) fades
    T.sretD = 0.25;
    T.lift = T.opus + 0.14;                   // characters lift off
    T.gather = T.opus + 0.2;                  // the empty pill gathers to a dot
    T.stretch = T.zuo - 0.44;                 // dual-spring stretch, settled on 做
    T.why = ctx.word(L2, '为什么');
    T.xb = ctx.word(L2, '小白');
    T.q = ctx.wordEnd(L2, '做', 1);           // end of 「小白怎么做？」
    T.mb = ctx.word(L2, '明白');
    return T;
  }
  // scanline x (screen) at local time tt: the playhead on the paged ruler, then an inOutCubic sweep off the right edge
  function scanX(T, tt) {
    const xPh = HUD.x0 + HUD.pps * Math.max(0, tt);
    if (tt <= T.sw0) return xPh;
    const x0 = HUD.x0 + HUD.pps * T.sw0, d = T.sw1 - T.sw0;
    return x0 + HUD.pps * (tt - T.sw0) + (SWEEP_END - x0 - HUD.pps * d) * ease.inOutCubic(clamp((tt - T.sw0) / d));
  }
  // local time at which the scanline reaches screen x
  function crossT(T, x) {
    let lo = 0, hi = T.sw1 + 0.05;
    if (scanX(T, lo) >= x) return lo;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (scanX(T, m) >= x) hi = m; else lo = m; }
    return hi;
  }
  // label pop times: each label pops when the line reaches the object it names: the toast, the subtitle box, and the
  // progress bar (the full-height stem touches it when the sweep starts)
  function popTimes(T, subLeft) { return [crossT(T, 314), crossT(T, subLeft), T.sw0 + 0.05]; }

  // ---------- fallback: a mirror of s01_cold's HUD kit, ruler on page 2 (8–16 s) ----------
  function ownHud(root) {
    const T0 = HUD.secs;
    const scrim = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: `${W}px`, height: '340px', background: SCRIM } });
    const el = h('div', { class: 'fill' });
    const tag = h('div', { class: 'abs', style: { left: `${HUD.x0}px`, top: '112px', height: '24px', display: 'flex', alignItems: 'center',
      font: '600 20px/1 var(--mono)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(244,241,242,.82)', whiteSpace: 'nowrap', textShadow: HALO },
      text: 'WAYTOAGI · OPUS 5.5 案例' });
    const svg = K.svgRoot(W, 240);
    const xEnd = HUD.x0 + HUD.pps * HUD.secs;
    const lineShadow = s('line', { x1: HUD.x0, y1: HUD.y + 0.5, x2: xEnd, y2: HUD.y + 0.5, stroke: 'rgba(18,16,17,.45)', 'stroke-width': 3 });
    const line = s('line', { x1: HUD.x0, y1: HUD.y, x2: xEnd, y2: HUD.y, stroke: 'rgba(244,241,242,.32)', 'stroke-width': 1.5 });
    const lineDone = s('line', { x1: HUD.x0, y1: HUD.y, x2: HUD.x0, y2: HUD.y, stroke: 'rgba(244,241,242,.78)', 'stroke-width': 1.5 });
    svg.append(lineShadow, line, lineDone);
    const ticks = [];
    for (let i = 0; i <= HUD.secs * 2; i++) {
      const x = HUD.x0 + HUD.pps * i * 0.5, bar = i % 4 === 0, len = bar ? 14 : 8;
      const glow = s('line', { x1: x, y1: HUD.y, x2: x, y2: HUD.y - len, stroke: LIME, 'stroke-width': 16, 'stroke-linecap': 'round', opacity: 0 });
      const glow2 = s('line', { x1: x, y1: HUD.y, x2: x, y2: HUD.y - len, stroke: LIME, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0 });
      const tk = s('line', { x1: x, y1: HUD.y, x2: x, y2: HUD.y - len, stroke: SNOW, 'stroke-width': bar ? 2 : 1.5 });
      svg.append(glow, glow2, tk);
      ticks.push({ tt: T0 + i * 0.5, x, len, bar, tk, glow, glow2 });
    }
    const labels = [];
    for (let sec = 0; sec <= HUD.secs; sec += 2) {
      labels.push(h('div', { class: 'abs', style: { left: `${HUD.x0 + HUD.pps * sec + 6}px`, top: `${HUD.y - 19}px`, font: '600 18px/1 var(--mono)',
        color: 'var(--snow)', opacity: '0.55', whiteSpace: 'nowrap', textShadow: HALO }, text: `${T0 + sec}s` }));
    }
    const stem = h('div', { class: 'abs', style: { left: '0px', top: `${HUD.y - 3}px`, width: '2px', height: `${HUD.pillTop - HUD.y + 3}px`, background: LIME } });
    const pill = h('div', { class: 'abs center', style: { left: '0px', top: `${HUD.pillTop}px`, width: `${HUD.pillW}px`, height: `${HUD.pillH}px`,
      borderRadius: `${HUD.pillH / 2}px`, background: LIME, color: INK, font: '600 22px/1 var(--mono)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'pre',
      boxShadow: '0 6px 18px rgba(18,16,17,.35)' } });
    const counter = h('div', { class: 'abs', style: { right: `${W - 1808}px`, top: `${HUD.y - 25}px`, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' } });
    const cNum = h('div', { style: { font: '700 28px/1 var(--display)', color: LIME, fontVariantNumeric: 'tabular-nums', textShadow: HALO } });
    counter.append(h('div', { style: { font: '600 20px/1 var(--mono)', letterSpacing: '.06em', color: 'rgba(244,241,242,.66)', textShadow: HALO }, text: 'FRAME' }), cNum);
    el.append(tag, svg, ...labels, stem, pill, counter);
    root.append(scrim, el);
    function render(T, { flash = null } = {}) {
      const x = HUD.x0 + HUD.pps * (T - T0);
      tf2(pill, { x: x - HUD.pillW / 2 });
      tf2(stem, { x: x - 1 });
      pill.textContent = `t = ${T.toFixed(2)} s`;
      cNum.textContent = String(Math.floor(T * 30 + 1e-6) + 1).padStart(5, '0');
      lineDone.setAttribute('x2', f2(Math.max(HUD.x0, Math.min(x, xEnd))));
      ticks.forEach(tk => {
        const f = flash ? clamp(flash(tk.tt)) : 0;
        const len = tk.len + 10 * f;
        const done = tk.x <= x + 0.5;
        tk.tk.setAttribute('y2', f2(HUD.y - len));
        tk.tk.setAttribute('stroke', f > 0.02 ? M.mixColor(SNOW, LIME, Math.min(1, f * 1.6)) : SNOW);
        tk.tk.setAttribute('stroke-width', f2((tk.bar ? 2 : 1.5) + 1.5 * f));
        tk.tk.setAttribute('opacity', Math.max(done ? 0.78 : 0.42, f).toFixed(3));
        tk.glow.setAttribute('y2', f2(HUD.y - len)); tk.glow.setAttribute('opacity', (0.16 * f).toFixed(3));
        tk.glow2.setAttribute('y2', f2(HUD.y - len)); tk.glow2.setAttribute('opacity', (0.3 * f).toFixed(3));
      });
    }
    return { el, scrim, tag, stem, pill, counter, render };
  }
  function ownCredits() {
    const chip = (bg, ...kids) => h('div', { style: { height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px', background: bg, whiteSpace: 'nowrap' } }, ...kids);
    return h('div', { class: 'abs', style: { left: '112px', top: '822px', display: 'flex', gap: '12px' } },
      chip('rgba(10,8,9,.72)', h('span', { style: { font: '600 20px/1.1 var(--sans)', color: '#fff' }, text: '@twoclipping' }),
        h('small', { style: { font: '500 16px/1 var(--mono)', color: LIME, letterSpacing: '.04em' }, text: '原作片段' })),
      chip('rgba(18,16,17,.74)', h('span', { style: { font: '500 18px/1.1 var(--cn)', color: 'rgba(244,241,242,.8)', letterSpacing: '.02em' }, text: '作者自述：画面由代码渲染' })));
  }

  let POPS = null;   // label pop times, set in build (events() runs after build)

  Scene.define({
    id: 's02_title',

    build(root, ctx) {
      const T = timings(ctx);

      // ---------- measuring (the scene root is display:none while building) ----------
      const meas = h('span', { style: { position: 'absolute', left: '-12000px', top: '0px', whiteSpace: 'pre', visibility: 'hidden' } });
      document.body.append(meas);
      const measure = (text, font, ls = 'normal', ff = 'normal') => {
        meas.style.font = font; meas.style.letterSpacing = ls; meas.style.fontFeatureSettings = ff; meas.textContent = text;
        return meas.getBoundingClientRect().width;
      };
      // subtitle chunks near this scene, measured like the engine's .sub (600 44px, .02em) + 30 px padding each side
      const subW = new Map();
      for (const l of window.TIMELINE.lines) {
        if (l.end + 0.6 < ctx.start - 1 || l.start - 0.05 > ctx.start + ctx.dur + 2) continue;
        for (const sb of l.subs || []) if (!subW.has(sb.text)) subW.set(sb.text, measure(sb.text, '600 44px/1.3 var(--cn)', '.02em') + 60);
      }
      const heroChars = Array.from(HERO.text);
      const adv = heroChars.map(c => measure(c, `900 ${HERO.size}px/1 var(--cn)`, '-0.01em', HALT));
      const heroW = adv.reduce((a, b) => a + b, 0);
      const labW = LAB.map(x => measure(x, LAB_FONT) + 20);
      meas.remove();
      // 'halt' halves the punctuation's advance but leaves its ink where the full-width glyph had it (the SC comma sits
      // 26 px into its box, which would hang it closer to the next character): pull the ink to 8 px into its slot
      const heroDx = heroChars.map(c => {
        if (!PUNCT.includes(c)) return 0;
        const ib = inkBox(c, `900 ${HERO.size}px NSC`);
        return ib ? -Math.max(0, ib.l - 8) : 0;
      });
      // Smiley Sans sets 「？」 at the left of a 0.8 em advance: box chip 04's glyph to its ink
      const qInk = inkBox('？', '38px Smiley, NSC, sans-serif');

      // ---------- base ----------
      root.append(h('div', { class: 'fill grid-night' }));

      // world (whole-frame drift 1.00 → 1.02) > toast (s01's push, relaxes to 1 during the morph)
      const world = h('div', { class: 'fill', style: { transformOrigin: '960px 540px' } });
      const toast = h('div', { class: 'fill', style: { transformOrigin: '960px 540px' } });
      world.append(toast);
      root.append(world);

      // warm world: our replica background (matched to the footage's soft light falloff)
      const warm = h('div', { class: 'fill', style: {
        background: 'radial-gradient(ellipse 1250px 820px at 960px 330px, #F2F3EE 0%, #F0F1EC 45%, #EDEEE9 78%, #ECEDE8 100%)' } });
      // night iris (opens from the pill centre on Opus) with two soft glows that live in the night world
      const iris = h('div', { class: 'fill grid-night', style: { display: 'none' } });
      const glowP = h('div', { class: 'abs', style: { left: '230px', top: '-90px', width: '1460px', height: '1120px', borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(173,133,186,.27), rgba(173,133,186,0))' } });
      const glowL = h('div', { class: 'abs', style: { left: '420px', top: '470px', width: '1080px', height: '260px', borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(201,223,141,.17), rgba(201,223,141,0))' } });
      iris.append(glowP, glowL);
      toast.append(warm, iris);

      // hero characters: rest layout (150 px, centred) and start layout (60 px, left-aligned in the toast)
      const chars = [];
      let acc = 0;
      heroChars.forEach((c, i) => {
        const x = 960 - heroW / 2 + acc + heroDx[i];
        chars.push({ c, x, w: adv[i], dx: heroDx[i], cx: x + adv[i] / 2, cy: HERO.top + HERO.size / 2 });
        acc += adv[i];
      });
      const k0 = PILLTXT.size / HERO.size;
      acc = 0;
      chars.forEach(ch => { ch.sx = PILLTXT.x + (acc + ch.dx + ch.w / 2) * k0; ch.sy = TCY - 3; acc += ch.w; });
      const mkChar = (ch, color) => h('span', { class: 'abs', style: { left: px(ch.x), top: px(HERO.top), width: px(ch.w), height: `${HERO.size}px`,
        font: `900 ${HERO.size}px/1 var(--cn)`, letterSpacing: '-0.01em', fontFeatureSettings: HALT, color, whiteSpace: 'pre', transformOrigin: '50% 50%' }, text: ch.c });
      const heroOut = h('div', { class: 'fill' });           // snow copy (outside the pill)
      chars.forEach(ch => { ch.out = mkChar(ch, SNOW); heroOut.append(ch.out); });
      toast.append(heroOut);

      // the pill: replica of the toast that becomes the underline; overflow:hidden clips the knockout copies
      const pill = h('div', { class: 'abs', style: { overflow: 'hidden', background: '#000' } });
      const inner = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: `${W}px`, height: `${H}px` } }); // toast coords
      pill.append(inner);
      const disc = h('div', { class: 'abs', style: { left: px(DISC.cx - DISC.r), top: px(DISC.cy - DISC.r), width: px(DISC.r * 2), height: px(DISC.r * 2),
        borderRadius: '50%', background: '#FFFFFF', transformOrigin: '50% 50%' } });
      const discSvg = s('svg', { width: DISC.r * 2, height: DISC.r * 2, viewBox: `${-DISC.r} ${-DISC.r} ${DISC.r * 2} ${DISC.r * 2}`, style: { position: 'absolute', left: 0, top: 0 } });
      const check = s('path', { d: 'M-16.5,1.5 L-4.5,12.5 L20.25,-12', fill: 'none', stroke: '#000', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      discSvg.append(check);
      disc.append(discSvg);
      const en = h('div', { class: 'abs', style: { left: px(EN.left), top: px(EN.top), font: `${EN.weight} ${EN.size}px/1 Inter`, color: '#FFFFFF', whiteSpace: 'pre' }, text: EN.text });
      inner.append(disc, en);
      chars.forEach(ch => { ch.ink = mkChar(ch, '#FFFFFF'); inner.append(ch.ink); });
      toast.append(pill);
      // a glint rides the underline's leading edge while it stretches (the same glint s01's lime bar drew with)
      const glint = h('div', { class: 'abs', style: { left: '0px', top: `${UL.cy - 16}px`, width: '56px', height: '32px', borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,255,255,.95), rgba(233,245,196,.55) 45%, rgba(201,223,141,0))', display: 'none' } });
      toast.append(glint);
      // …and one slow pass along the settled underline just before s03's wipe takes it over
      const sheen = h('div', { class: 'abs', style: { left: '0px', top: `${UL.cy - UL.h / 2}px`, width: '180px', height: `${UL.h}px`, borderRadius: `${UL.h / 2}px`,
        background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.75) 50%, rgba(255,255,255,0))', display: 'none' } });
      toast.append(sheen);

      // the held footage frame (s01's last frame) above the replica until the handoff, and s01's lime bar on top
      const foot = h('img', { class: 'abs', style: { left: '0px', top: '0px', width: `${W}px`, height: `${H}px`, objectFit: 'cover' } });
      const ul01 = h('div', { class: 'abs', style: { left: `${U01.x}px`, top: `${U01.y}px`, width: `${U01.w}px`, height: `${U01.h}px`, borderRadius: `${U01.h / 2}px`,
        background: LIME, boxShadow: '0 0 22px rgba(201,223,141,.55)' } });
      toast.append(foot, ul01);
      // handles for tools (calibration harness)
      Object.assign(world.dataset, { k: 'world' }); Object.assign(toast.dataset, { k: 'toast' }); Object.assign(warm.dataset, { k: 'warm' });
      Object.assign(pill.dataset, { k: 'pill' }); Object.assign(en.dataset, { k: 'en' }); Object.assign(disc.dataset, { k: 'disc' });
      Object.assign(foot.dataset, { k: 'foot' }); Object.assign(ul01.dataset, { k: 'ul01' });

      // ---------- H3 + syllabus chips (world) ----------
      const h3 = riseTitle(H3.text, { size: H3.size, weight: 700, color: 'rgba(244,241,242,.85)' });
      world.append(h3.el);
      const chipRow = h('div', { class: 'abs', style: { left: '0px', top: '764px', width: `${W}px`, height: '52px', display: 'flex', justifyContent: 'center', gap: '20px' } });
      const CHIPS = [['01', '原理'], ['02', '为什么炫'], ['03', '小白上手'], ['04', '？']];
      const chips = CHIPS.map(([n, lab], i) => {
        const fun = i === 3;
        const el = h('div', { style: { height: '52px', display: 'flex', alignItems: 'center', gap: fun ? `${Q_GAP}px` : '12px', padding: fun ? `0 ${Q_GAP}px 0 9px` : '0 20px 0 9px',
          borderRadius: '14px', background: '#1B1718', border: '1.5px solid rgba(244,241,242,.14)', boxShadow: '0 14px 34px rgba(0,0,0,.35)', transformOrigin: '50% 60%' } });
        el.append(h('span', { style: { padding: '7px 10px', borderRadius: '8px', background: LIME, color: INK, font: '600 22px/1 var(--mono)', letterSpacing: '.08em' }, text: n }));
        if (fun) {
          // the glyph's box is its ink (text-indent pulls the left bearing out, the empty right of the advance overflows)
          el.append(qInk
            ? h('span', { style: { display: 'block', flex: '0 0 auto', width: px(qInk.w), font: '38px/1 var(--fun)', color: LIME, whiteSpace: 'pre', textIndent: px(-qInk.l), overflow: 'visible' }, text: lab })
            : h('span', { style: { font: '38px/1 var(--fun)', color: LIME, padding: '0 2px' }, text: lab }));
        } else el.append(h('span', { style: { font: '600 26px/1 var(--cn)', color: SNOW, letterSpacing: '.02em' }, text: lab }));
        chipRow.append(el);
        return el;
      });
      world.append(chipRow);

      // ---------- screen space ----------
      // HUD: s01_cold's own kit (same scrim, tag, ruler, stem + pill, counter), its ruler turned to page 2 (8–16 s);
      // a mirrored copy is the fallback if that kit is not there
      const kit = window.S01_COLD_HUD;
      let hud = null;
      if (kit && typeof kit.buildHud === 'function') {
        const k = kit.buildHud(root, { page: 1 });
        if (k && k.el && k.scrim && k.stem && k.pill && k.tag && k.counter && typeof k.render === 'function') hud = k;
        else if (k) { if (k.el) k.el.remove(); if (k.scrim) k.scrim.remove(); }
      }
      if (!hud) hud = ownHud(root);
      // the frame counter flashes on 帧: its two rows (FRAME, digits) and their resting styles
      const cnt = Array.from(hud.counter.children).slice(0, 2);
      const cntDef = cnt.map(el => ({ color: el.style.color, shadow: el.style.textShadow }));
      hud.counter.style.transformOrigin = '100% 50%';
      // the storyboard's softer top gradient (0→200, .45) takes over from s01's scrim until the iris
      const scrimB = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: `${W}px`, height: '200px', background: 'linear-gradient(rgba(18,16,17,.45), rgba(18,16,17,0))' } });
      root.insertBefore(scrimB, hud.el);
      // X-ray code view: footage at 30 % + 48 px lime grid at 8 %, revealed behind the scanline (under the HUD)
      const xr = h('div', { class: 'fill' });
      xr.append(h('div', { class: 'fill', style: { background: 'rgba(18,16,17,.70)' } }));
      xr.append(h('div', { class: 'fill', style: { background: 'linear-gradient(rgba(201,223,141,.08) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(201,223,141,.08) 1px, transparent 1px) 0 0 / 48px 48px' } }));
      root.insertBefore(xr, hud.el);

      // s01's credit row at (112, 822), never clipped: it lifts to 772 as the scan starts (label 3 takes y 835–879);
      // chip 1 (the author credit) stays whole while the footage is on screen and leaves on 用, before our replica's
      // Chinese title is readable (it must never credit our card); chip 2 (the provenance claim) fades as a whole
      // when the scanline reaches it
      let credits = null;
      if (kit && typeof kit.creditRow === 'function') { try { credits = kit.creditRow({ author: '@twoclipping' }); } catch (e) { credits = null; } }
      if (!credits || credits.children.length < 2) credits = ownCredits();
      const cHost = h('div', { style: { position: 'absolute', left: '0px', top: '0px', width: `${W}px`, height: `${H}px`, visibility: 'hidden' } });
      document.body.append(cHost);
      cHost.append(credits);
      const hostL = cHost.getBoundingClientRect().left;
      const creditBox = Array.from(credits.children).map(c => { const r = c.getBoundingClientRect(); return { l: r.left - hostL, r: r.right - hostL }; });
      root.append(credits);
      cHost.remove();
      const creditChips = Array.from(credits.children);
      const creditsDisp = credits.style.display || 'flex';

      // X-ray outlines (clipped to the scanned side), their 帧 glows (wide, faint strokes underneath), leaders and labels
      const xsvg = K.svgRoot(W, H);
      const strokeA = { stroke: LIME, 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
      const glowA = (w, a) => ({ stroke: LIME, 'stroke-width': w, 'stroke-opacity': a, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', visibility: 'hidden' });
      const glows = [0, 1, 2].map(() => [s('path', glowA(18, 0.13)), s('path', glowA(8, 0.32))]);   // toast, subtitle, progress
      const oT = [s('path', strokeA), s('path', strokeA)];   // toast halves
      const oS = [s('path', strokeA), s('path', strokeA)];   // subtitle-box halves
      const PROG_D = fullPath(4, 1068, 1916, 1079, 5.5);
      const oP = s('path', { ...strokeA, d: PROG_D });       // progress track
      glows[2].forEach(g => g.setAttribute('d', PROG_D));
      // dark under-strokes for the chrome outlines and leaders: these outlive the code view, and thin lime alone
      // vanishes on the warm frame (invisible on the code view and on night)
      const UNDER = 'rgba(18,16,17,.5)';
      const underA = { ...strokeA, stroke: UNDER, 'stroke-width': 5 };
      const oSu = [s('path', underA), s('path', underA)];
      const oPu = s('path', { ...underA, d: PROG_D });
      xsvg.append(...oSu, oPu, ...glows.flat(), ...oT, ...oS, oP);   // the 帧 glows cover the casing while they pulse
      root.append(xsvg);
      const lsvg = K.svgRoot(W, H);
      const leadA = { stroke: LIME, 'stroke-width': 1.5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
      const leadsU = [0, 1, 2].map(() => s('path', { ...leadA, stroke: UNDER, 'stroke-width': 4.5 }));
      const leads = [0, 1, 2].map(() => s('path', leadA));
      const dots = [0, 1, 2].map(() => s('circle', { r: 4, fill: LIME, stroke: UNDER, 'stroke-width': 3, 'paint-order': 'stroke' }));
      lsvg.append(...leadsU, ...leads, ...dots);
      root.append(lsvg);
      const labPos = [[314, 383 - LH], [1808 - labW[1], 879 - LH], [LAB3.x, 879 - LH]];
      const labels = LAB.map((txt, i) => {
        const el = h('div', { class: 'abs', style: { left: px(labPos[i][0]), top: px(labPos[i][1]), padding: '4px 10px', borderRadius: '6px', background: INK, color: LIME,
          font: LAB_FONT, whiteSpace: 'pre', boxShadow: '0 6px 18px rgba(0,0,0,.35)', transformOrigin: i === 1 ? '100% 100%' : '0% 100%' }, text: txt });
        root.append(el);
        return el;
      });

      // the playhead (s01's stem + pill) is lifted above everything: it becomes the full-height scanline
      const trail = h('div', { class: 'abs', style: { top: '0px', height: `${H}px`, background: 'linear-gradient(90deg, rgba(201,223,141,0), rgba(201,223,141,.24))' } });
      root.append(trail, hud.stem, hud.pill);
      hud.pill.style.overflow = 'hidden';

      // label 2 pops when the line reaches the subtitle box it names (the chunk on screen during the sweep)
      const sub1 = subAt(ctx.start + T.sw0 + 0.3);
      const subLeft = sub1 ? 960 - (subW.get(sub1.text) || 600) / 2 - 6 : 677;

      return { T, glint, sheen, world, toast, warm, iris, glowP, glowL, chars, heroOut, pill, inner, disc, check, en, foot, ul01, h3, chips, chipRow,
        hud, cnt, cntDef, scrimB, xr, credits, creditChips, creditsDisp, xsvg, glows, oT, oS, oSu, oP, oPu, leads, leadsU, dots, labels, labW, labPos, trail, subW,
        c2Fade: crossT(T, creditBox[1] ? creditBox[1].l : 359), tExit: crossT(T, W + 2),
        pops: (POPS = popTimes(T, subLeft)) };
    },

    render(st, t, ctx) {
      const T = st.T;
      const tc = Math.min(Math.max(0, t), ctx.dur + 0.6);   // hold after the transition tail
      const G = ctx.start + tc;                              // film time: readouts and the subtitle lookup

      // ---------- camera: whole frame drifts 1.00 → 1.02 (exactly 1.02 at the end: s03 picks the underline up there) ----------
      const Wd = 1 + 0.02 * ease.inOutSine(clamp(tc / ctx.dur));
      tf2(st.world, { s: Wd });
      // the toast keeps s01's push, easing out of its speed, then relaxes to 1 during the morph
      const push = PUSH + PUSH_V * 0.5 * (1 - Math.exp(-tc / 0.5));
      const relax = ease.inOutCubic(clamp((tc - T.gather) / (T.zuo - T.gather)));
      const F = lerp(push, 1, relax);
      tf2(st.toast, { s: F });
      const sxS = x => 960 + (x - 960) * F * Wd, syS = y => 540 + (y - 540) * F * Wd;

      // ---------- HUD (s01's kit at the real film time; the 8 s bar tick strikes lime on the cut, s01's grammar) ----------
      const strike = 1 - ease.inQuad(clamp(tc / 0.2));
      st.hud.render(G, { flash: tt => (Math.abs(tt - HUD.secs) < 1e-3 ? strike : 0) });
      const hudA = 1 - prog(tc, T.ret, 0.3, ease.inCubic);
      st.hud.el.style.opacity = hudA.toFixed(3);
      st.hud.el.style.display = hudA > 0.001 ? 'block' : 'none';
      st.hud.tag.style.opacity = (1 - prog(tc, 0, 0.3, ease.inCubic)).toFixed(3);   // the engine's chapter tag takes over
      // scrims: s01's → the softer storyboard one during the retract → gone once the night iris has opened
      const sMix = prog(tc, T.ret, 0.3);
      const sOut = 1 - prog(tc, T.opus + 0.25, 0.4);
      st.hud.scrim.style.opacity = ((1 - sMix) * sOut).toFixed(3);
      st.hud.scrim.style.display = (1 - sMix) * sOut > 0.001 ? 'block' : 'none';
      st.scrimB.style.opacity = (sMix * sOut).toFixed(3);
      st.scrimB.style.display = sMix * sOut > 0.001 ? 'block' : 'none';

      // ---------- 帧: "this frame" accent (quick attack, slower release over 0.3 s) ----------
      const zp = (tc - T.zhen) / 0.3;
      const zk = zp <= 0 || zp >= 1 ? 0 : zp < 0.2 ? ease.outQuad(zp / 0.2) : 1 - ease.inOutSine((zp - 0.2) / 0.8);
      // the frame counter: FRAME turns lime, the digits flash white with a lime glow, a small swell from the right
      const [cLab, cNum] = st.cnt;
      if (zk > 0.002) {
        cLab.style.color = mixRgba([244, 241, 242, 0.66], [201, 223, 141, 1], zk);
        cNum.style.color = M.mixColor(LIME, '#FFFFFF', 0.85 * zk);
        cNum.style.textShadow = `0 0 ${f2(14 * zk)}px rgba(201,223,141,${(0.9 * zk).toFixed(3)}), ${st.cntDef[1].shadow || HALO}`;
        tf2(st.hud.counter, { s: 1 + 0.08 * zk });
      } else {
        cLab.style.color = st.cntDef[0].color; cLab.style.textShadow = st.cntDef[0].shadow;
        cNum.style.color = st.cntDef[1].color; cNum.style.textShadow = st.cntDef[1].shadow;
        st.hud.counter.style.transform = '';
      }

      // ---------- playhead → scanline: the stem extends to full height, the pill collapses into it, then it sweeps ----------
      const x = scanX(T, tc);
      const v = (x - scanX(T, tc - 1 / 30)) * 30;
      const ext = prog(tc, T.scan, T.ext, ease.inOutCubic);
      const sTop = lerp(HUD.y - 3, -40, ext), sBot = lerp(HUD.pillTop, H + 40, ext);   // the stem's vertical extent
      const live = tc < T.sw1 + 0.02;
      // past the right edge only the glow is left: it fades instead of popping off when the sweep ends
      const lineA = 1 - prog(tc, st.tExit, Math.max(0.02, T.sw1 - st.tExit), ease.linear);
      st.hud.stem.style.display = live ? 'block' : 'none';
      st.hud.pill.style.display = live && ext < 0.999 ? 'flex' : 'none';
      if (live && ext > 0) {
        const sw = lerp(2, 3, ext);
        Object.assign(st.hud.stem.style, { top: px(sTop), width: px(sw), height: px(sBot - sTop), opacity: lineA.toFixed(3),
          boxShadow: `0 0 ${f2(12 * ext)}px ${f2(2 * ext)}px rgba(201,223,141,.95), 0 0 ${f2(36 * ext)}px ${f2(8 * ext)}px rgba(201,223,141,.4)` });
        tf2(st.hud.stem, { x: x - sw / 2 });
        const pw = lerp(HUD.pillW, 3, ease.inCubic(ext));
        st.hud.pill.style.width = px(pw);
        st.hud.pill.style.color = ext > 0.25 ? 'transparent' : INK;
        tf2(st.hud.pill, { x: x - pw / 2, o: 1 - prog(tc, T.scan + 0.06, T.ext - 0.04) });
      } else if (live) {
        // before 包括: exactly s01's stem + pill (the kit positioned them); reset anything the scan changed
        Object.assign(st.hud.stem.style, { top: `${HUD.y - 3}px`, width: '2px', height: `${HUD.pillTop - HUD.y + 3}px`, boxShadow: 'none', opacity: '1' });
        Object.assign(st.hud.pill.style, { width: `${HUD.pillW}px`, color: INK, opacity: '1' });
      }
      const tw = clamp(v * 0.07, 0, 280) * ext;
      st.trail.style.display = live && tw > 2 ? 'block' : 'none';
      if (live && tw > 2) {
        const tTop = ext < 1 ? Math.max(0, sTop) : 0, tBot = ext < 1 ? Math.min(H, sBot) : H;   // as tall as the stem
        Object.assign(st.trail.style, { left: px(x - tw), width: px(tw), top: px(tTop), height: px(tBot - tTop), opacity: lineA.toFixed(3) });
      }
      const xrIn = prog(tc, T.scan, T.ext, ease.outCubic);
      // the X-ray hands back in three steps: code view + toast (gone at the handoff), progress bar (before Opus),
      // subtitle (pinned to the live box, on 做)
      const xrOut = prog(tc, T.xret, T.retD, ease.inCubic);
      const aT = 1 - xrOut;
      const aP = 1 - prog(tc, T.pret, T.retD, ease.inCubic);
      const aS = 1 - prog(tc, T.zuo, T.sretD, ease.inCubic);

      // ---------- X-ray ----------
      const xrA = xrIn * (1 - xrOut);
      const clipR = Math.max(0, W - x);
      // while the stem grows, the code view grows with it (no full-height band beside a half-length line)
      const xClip = ext < 1 ? `inset(${f2(Math.max(0, sTop))}px ${f2(clipR)}px ${f2(Math.max(0, H - sBot))}px 0)` : `inset(0 ${f2(clipR)}px 0 0)`;
      st.xr.style.display = xrA > 0.001 ? 'block' : 'none';
      if (xrA > 0.001) { st.xr.style.opacity = xrA.toFixed(4); st.xr.style.clipPath = xClip; }
      // credits (never clipped): the row lifts out of the label row as the scan starts; the author chip leaves on 用
      // with the footage it credits (gone before the replica's Chinese title is readable), the provenance chip as a
      // whole when the line reaches it
      const c1A = 1 - prog(tc, T.yong, 0.12, ease.linear);
      const c2A = 1 - prog(tc, st.c2Fade, 0.12, ease.linear);
      st.credits.style.display = c1A > 0.001 || c2A > 0.001 ? st.creditsDisp : 'none';
      st.credits.style.top = px(822 - CREDIT_LIFT * prog(tc, T.scan, 0.28, ease.outCubic));   // layout, not a lasting transform
      st.creditChips[0].style.opacity = c1A.toFixed(3);
      st.creditChips[1].style.opacity = c2A.toFixed(3);

      st.xsvg.style.display = xrIn > 0 && Math.max(aT, aP, aS) > 0.001 ? 'block' : 'none';
      st.xsvg.style.clipPath = xClip;
      const sw2 = f2(2 + 1.5 * zk);
      const glowOn = zk > 0.002;
      // (1) toast outline, in screen coordinates
      const tl = sxS(TOAST.l) - 8, tr = sxS(TOAST.r) + 8, tt = syS(TOAST.t) - 8, tb = syS(TOAST.b) + 8, trad = TOAST.rad * F * Wd + 8;
      const pT = prog(tc, crossT(T, tl), 0.3, ease.outCubic);
      const lT = halfLen(tr - tl, tb - tt, trad);
      st.oT.forEach((p, i) => { p.setAttribute('d', halfPath(tl, tt, tr, tb, trad, i === 0)); setDash(p, lT, pT); p.style.opacity = aT.toFixed(3); p.setAttribute('stroke-width', sw2); });
      // (2) subtitle box: current chunk (engine's own lookup), centred, bottom 1028, height 83, outlined 6 px outside;
      // it follows the engine's chunk swap on 用 (same lookup, same frame)
      const sub = subAt(G);
      const sw = sub ? (st.subW.get(sub.text) || 600) : 0;
      const sl = 960 - sw / 2 - 6, sr = 960 + sw / 2 + 6, stp = 1028 - 83 - 6, sbt = 1028 + 6;
      const pS = sub ? prog(tc, crossT(T, sl), 0.3, ease.outCubic) : 0;
      const lS = halfLen(sr - sl, sbt - stp, 20);
      const swU = f2(5 + 1.5 * zk);
      [st.oS, st.oSu].forEach((pair, u) => pair.forEach((p, i) => {
        p.setAttribute('d', halfPath(sl, stp, sr, sbt, 20, i === 0)); setDash(p, lS, pS);
        p.style.opacity = sub ? aS.toFixed(3) : '0'; p.setAttribute('stroke-width', u ? swU : sw2);
      }));
      // (3) progress track: revealed by the scan itself
      st.oP.style.opacity = aP.toFixed(3);
      st.oP.setAttribute('stroke-width', sw2);
      st.oPu.style.opacity = aP.toFixed(3);
      st.oPu.setAttribute('stroke-width', swU);
      // 帧 glows under the three outlines
      const glowK = [glowOn ? zk * aT : 0, glowOn && sub ? zk * aS : 0, glowOn ? zk * aP : 0];
      if (glowOn) {
        st.glows[0].forEach(g => g.setAttribute('d', fullPath(tl, tt, tr, tb, trad)));
        if (sub) st.glows[1].forEach(g => g.setAttribute('d', fullPath(sl, stp, sr, sbt, 20)));
      }
      st.glows.forEach((pair, i) => pair.forEach(g => {
        g.setAttribute('visibility', glowK[i] > 0.002 ? 'visible' : 'hidden');
        g.style.opacity = glowK[i].toFixed(3);
      }));

      // labels + leaders
      const fades = [aT, aS, aP];
      const lx2 = st.labPos[1][0] + 26;
      const lp = [
        { d: `M338,383 L338,${f2(tt)}`, len: Math.max(1, tt - 383), end: [338, tt] },
        { d: `M${f2(lx2)},879 L${f2(lx2)},986.5 L${f2(sr)},986.5`, len: 107.5 + Math.max(1, lx2 - sr), end: [sr, 986.5] },
        { d: `M${LAB3.lead},879 L${LAB3.lead},1068`, len: 189, end: [LAB3.lead, 1068] },
      ];
      st.labels.forEach((el, i) => {
        const p0 = st.pops[i];
        pop2(el, tc, p0, { from: 0.7, stiffness: 320, damping: 20 });
        const a = clamp((tc - p0) / 0.16) * fades[i];
        el.style.opacity = a.toFixed(3);
        el.style.display = a > 0.001 ? 'block' : 'none';
        const kL = prog(tc, p0 + 0.05, 0.2, ease.outCubic);
        [st.leads[i], st.leadsU[i]].forEach(p => {
          p.setAttribute('d', lp[i].d);
          setDash(p, lp[i].len, kL);
          p.style.opacity = fades[i].toFixed(3);
        });
        st.dots[i].setAttribute('cx', f2(lp[i].end[0])); st.dots[i].setAttribute('cy', f2(lp[i].end[1]));
        st.dots[i].style.opacity = (prog(tc, p0 + 0.2, 0.08) * fades[i]).toFixed(3);
      });

      // ---------- footage → replica (invisible, under the retract), iris ----------
      const footA = 1 - prog(tc, T.hand0, T.hand1 - T.hand0, ease.linear);
      st.foot.style.display = footA > 0.001 ? 'block' : 'none';
      if (footA > 0.001) { E.setImg(st.foot, ctx.clipUrl('co-006-cmdk', 99)); st.foot.style.opacity = footA.toFixed(4); }
      const irisDone = tc >= T.opus + 0.5;
      st.warm.style.display = irisDone ? 'none' : 'block';
      st.iris.style.display = tc >= T.opus ? 'block' : 'none';
      st.iris.style.clipPath = irisDone ? 'none' : `circle(${(1150 * ease.outQuart(clamp((tc - T.opus) / 0.5))).toFixed(1)}px at ${f2(TCX)}px ${f2(TCY)}px)`;
      st.glowP.style.opacity = (0.85 + 0.15 * M.noise1(tc * 0.35 + 3)).toFixed(3);
      st.glowL.style.opacity = (prog(tc, T.zuo - 0.05, 0.5) * (0.8 + 0.2 * M.noise1(tc * 0.5 + 9))).toFixed(3);

      // s01's lime bar under the toast text: follows the text swap, then melts into the lime pill
      const swap = prog(tc, T.yong, 0.26, ease.inOutCubic);
      st.ul01.style.width = px(lerp(U01.w, k0w(st), swap));
      st.ul01.style.display = tc < T.opus + 0.06 ? 'block' : 'none';

      // ---------- the pill (toast coordinates) ----------
      const flip = prog(tc, T.opus, 0.04, ease.outCubic);   // a hard flip on the beat (the pop + iris carry the motion)
      const pop = 22 * bump(tc - T.opus, 9, 16);
      const ga = ease.outQuart(clamp((tc - T.gather) / 0.32));
      let l = lerp(TOAST.l, 960 - DOT / 2, ga), r = lerp(TOAST.r, 960 + DOT / 2, ga);
      let top = lerp(TOAST.t, UL.cy - DOT / 2, ga), bot = lerp(TOAST.b, UL.cy + DOT / 2, ga);
      if (tc > T.stretch) {
        const tb2 = tc - T.stretch;
        r = springTo(tb2, 960 + DOT / 2, UL.r, 260, 22);
        l = springTo(tb2, 960 - DOT / 2, UL.l, 170, 20);
        const hh = Math.max(4, springTo(tb2, DOT, UL.h, 230, 24));
        top = UL.cy - hh / 2; bot = UL.cy + hh / 2;
      } else if (tc > T.gather) {
        const an = prog(tc, T.stretch - 0.12, 0.12, ease.inOutSine);    // anticipation: a slight squash
        l += 3 * an; r -= 3 * an; top -= 2 * an; bot += 2 * an;
      }
      l -= pop; r += pop; top -= pop * 0.5; bot += pop * 0.5;
      const pw = Math.max(1, r - l), ph = Math.max(1, bot - top);
      Object.assign(st.pill.style, { left: px(l), top: px(top), width: px(pw), height: px(ph), borderRadius: px(Math.min(ph / 2, TOAST.rad)) });
      st.inner.style.transform = `translate(${f2(-l)}px,${f2(-top)}px)`;
      const gA = tc > T.stretch ? Math.min(1, (tc - T.stretch) / 0.06) * (1 - prog(tc, T.zuo - 0.05, 0.3, ease.inCubic)) : 0;
      st.glint.style.display = gA > 0.003 ? 'block' : 'none';
      if (gA > 0.003) tf2(st.glint, { x: r - 34, o: gA });
      const shP = (tc - (ctx.dur - 0.7)) / 0.6;
      st.sheen.style.display = shP > 0 && shP < 1 ? 'block' : 'none';
      if (shP > 0 && shP < 1) {
        const sx = lerp(UL.l - 90, UL.r - 90, ease.inOutSine(shP));
        // clipped to the bar so the highlight never spills past its rounded ends
        const cl = Math.max(0, UL.l - sx), cr = Math.max(0, sx + 180 - UL.r);
        st.sheen.style.clipPath = `inset(0 ${f2(cr)}px 0 ${f2(cl)}px round ${UL.h / 2}px)`;
        tf2(st.sheen, { x: sx, o: Math.sin(Math.PI * shP) });
      }
      st.pill.style.background = flip > 0 ? M.mixColor('#000000', LIME, flip) : '#000000';
      const settle = prog(tc, T.zuo - 0.1, 0.4);
      const flare = Math.max(0, bump(tc - T.zuo, 6, 9));
      st.pill.style.boxShadow = flip < 1 ? shadowCss(1 - flip)
        : `0 0 ${(18 + 22 * settle + 30 * flare).toFixed(1)}px rgba(201,223,141,${(0.30 + 0.25 * settle + 0.35 * flare).toFixed(3)})`;

      // check disc: inverts with the flip and shrinks away
      const dk = prog(tc, T.opus + 0.04, 0.22, ease.inBack);
      st.disc.style.display = dk < 1 ? 'block' : 'none';
      tf2(st.disc, { s: Math.max(0, 1 - dk) });
      st.disc.style.background = flip < 0.5 ? '#FFFFFF' : INK;
      st.check.setAttribute('stroke', flip < 0.5 ? '#000000' : LIME);

      // English text blur-swaps to the Chinese title on 用
      const enOut = prog(tc, T.yong, 0.12, ease.inCubic);
      st.en.style.display = enOut < 1 ? 'block' : 'none';
      tf2(st.en, { x: -6 * enOut, o: 1 - enOut });
      st.en.style.filter = `blur(${f2(EN.soft + 7 * enOut)}px)`;
      const zhIn = prog(tc, T.yong + 0.07, 0.24, ease.outCubic);

      // characters: toast (60 px) → hero (150 px), one common progress for layout and size (glyphs can never overlap),
      // plus a per-character hop that ripples left → right. Ink knockout inside the pill, snow outside.
      const inkCol = flip < 0.5 ? '#FFFFFF' : INK;   // switch at the flip midpoint: no low-contrast grey-on-olive frame
      const pg = spring(tc - T.lift, { stiffness: 150, damping: 18 });
      // the spring's last ≈0.2 % is eased out by 1.0 s after the lift: the hero is then exactly at rest (no transform)
      const pl = toRest(clamp(pg, 0, 1.15), tc - T.lift, 0.7, 1.0);
      const sc = lerp(PILLTXT.size / HERO.size, 1, pl);
      st.chars.forEach((ch, i) => {
        const q = clamp((tc - T.lift - 0.02 - i * 0.034) / 0.42);
        const o = {
          x: lerp(ch.sx, ch.cx, pl) - ch.cx,
          y: lerp(ch.sy, ch.cy, pl) - ch.cy - 34 * Math.sin(Math.PI * q) * (1 - 0.4 * q),
          s: sc,
        };
        tf2(ch.out, o);
        tf2(ch.ink, o);
        ch.ink.style.filter = zhIn < 1 ? `blur(${f2((1 - zhIn) * 8 / o.s)}px)` : 'none';
        ch.ink.style.opacity = zhIn.toFixed(3);
        ch.ink.style.color = inkCol;
        ch.out.style.visibility = tc >= T.opus ? 'visible' : 'hidden';
      });

      // ---------- H3 and the syllabus ----------
      st.h3.render(tc, T.v55);
      const chipT = [T.why, T.why + 0.06, T.xb, T.q];
      st.chips.forEach((el, i) => {
        let r = 0;
        if (i === 3 && tc > T.mb) { const w = tc - T.mb; r = toRest(4 * Math.exp(-4.5 * w) * Math.sin(2 * Math.PI * 3.1 * w), w, 0.8, 1.2, 0); }
        pop2(el, tc, chipT[i], { from: 0.55, r, stiffness: 300, damping: 18 });
      });

      // ---------- tail: during the chapter wipe the lime underline is the last bright element ----------
      const textA = (1 - 0.62 * prog(t, ctx.dur, 0.3, ease.outCubic)).toFixed(3);
      st.heroOut.style.opacity = textA;
      st.h3.el.style.opacity = textA;
      st.chipRow.style.opacity = textA;
    },

    events(ctx) {
      const T = timings(ctx);
      return [
        { t: T.scan, type: 'glitch', gain: 0.3 },
        ...(POPS || popTimes(T, 677)).map(tp => ({ t: tp, type: 'tick', gain: 0.5 })),
        { t: T.zhen, type: 'tick', gain: 0.35 },
        { t: T.yong, type: 'swish', gain: 0.45 },
        { t: T.opus, type: 'boom', gain: 0.55 },
        { t: T.opus, type: 'sparkle', gain: 0.5 },
        { t: T.zuo - 0.6, type: 'rise_short', gain: 0.45 },
        { t: T.zuo, type: 'impact', gain: 0.5 },
        { t: T.why, type: 'pop', gain: 0.45 },
        { t: T.why + 0.06, type: 'pop', gain: 0.45 },
        { t: T.xb, type: 'pop', gain: 0.45 },
        { t: T.q, type: 'pop', gain: 0.45 },
        { t: T.mb, type: 'blip', gain: 0.4 },
      ];
    },
  });

  // width of the Chinese toast text (60 px): the s01 bar shrinks to it during the swap
  function k0w(st) { return (PILLTXT.size / HERO.size) * st.chars.reduce((a, c) => a + c.w, 0); }
})();
