/*
 * s22_end — End card: read, browse, go make your first; the playhead reaches the last frame.
 * (7.5 s · dark · iris from (960, 540) · chrome off, subtitles on)
 *
 * Voice (every time below comes from ctx.word / ctx.cue, never a literal):
 *   s22_end.1 完整文章和 5181 个案例，都在 WaytoAGI，去做你的第一支吧。
 *
 * Choreography
 *   iris   s21 leaves the lime playhead pill at the centre; the iris opens from it with a lime rim and reveals the card:
 *          the WaytoAGI logo and the film's title 「每一帧，都是代码」 rise in, the lime underline draws under 「代码」.
 *          Once the iris has room the pill hops off the centre and drops onto the end ruler (x 112–1808 = the whole film;
 *          its ticks are this film's scene starts from window.TIMELINE, taller at chapter starts), is caught by its stem
 *          and keeps travelling: x and readout are the real film time, the label above counts the real frame.
 *   完整   the left column (读全文 · WaytoAGI 飞书知识库 · the article) rises against the centre spine, settled by 「文章」.
 *   5181   the right column (逛案例 · URL · counts · date) rises; 5,181 and 1,704 count up odometer-style.
 *   Way    a lime sheen crosses the logo.
 *   去     the underline under 「代码」 glows once (a glint runs along it).
 *   end    on the film's last bar a lime pulse runs the whole ruler from frame 1 to the playhead, every scene tick
 *          strikes lime as it passes (s01's ruler did the same on every cut), the end cap lights and the pill glows
 *          (ding). On the last frame the stem stands exactly on x 1808 and the label reads 第 7,590 帧 / 共 7,590 帧.
 * render() is a pure function of t: everything is clamped to the last frame, so t past the end holds it.
 */
(() => {
  'use strict';
  const ID = 's22_end';
  const L1 = `${ID}.1`;
  const W = 1920, H = 1080;
  const LIME = '#C9DF8D', SNOW = '#F4F1F2', FOG = '#A39A9B', INK = '#241E1E';

  // ---------- layout (stage px) ----------
  // The logo SVG pads its 317×102 viewBox; the drawn mark (icon square + wordmark) is the `ink` box.
  const LOGO_VB = { w: 317, h: 102, ink: { x: 30, y: 25.269, w: 250.62, h: 50 } };
  const LOGO = { top: 150, h: 80, cx: 960 };                       // drawn mark 80 px tall, y 150–230, centred
  const HERO = { text: '每一帧，都是代码', size: 96, cy: 320, mark: [6, 7] };   // 「代码」 = characters 6–7
  const UL = { h: 12, gap: 14 };                                    // lime underline under 「代码」
  const SPINE = { x: 960, gap: 40, top: 436, bottom: 646 };         // the two columns mirror around the centre spine
  // row tops shared by both columns, so the lines pair up across the spine (centres 452 / 518 / 582 / 625)
  const ROWS = { tag: 430, h3: 492, url: 499.2, sub1: 560, sub2L: 603.5, sub2R: 609.3 };
  const CREDIT_TOP = 700;
  const RULER = { x0: 112, x1: 1808, y: 800 };
  // s21 parks the playhead at the iris centre as a 184×38 pill with a 36 px lime glow: same pill here, so the iris opens
  // on the same object; it hangs at y 814–852 once caught by its stem
  const PILL = { w: 184, h: 38, top: 814, padX: 12, glow0: { blur: 36, a: 0.6 } };
  const STEM_TOP = RULER.y - 3;
  const LABEL = { bottom: 780, inset: 16 };                         // frame label: right-aligned, clear of the end cap
  const DRIFT = { s: 0.012, ox: 960, oy: 470 };                     // slow push-in of the card (not the ruler)
  const GLOW_P = { from: [1180, 300], to: [960, 310] };            // purple glow: s21's end → behind the title
  const GLOW_L = { from: [700, 760], to: [1320, 730] };             // lime glow: s21's end → toward the ruler's end
  const TRAIL = 460;                                                // max length of the end pulse's lime trail

  const ARTICLE = ['《Opus 5.5 怎样把代码变成视频：', '8 个精选案例与制作经验》'];
  const URL = 'waytoagi.com/usecase-atlas/opus5-5';
  const CREDITS = '原作片段：@twoclipping @morpheusdv @kimmonismus @WinterArc2125 @aiwarts @yoshifujidesign @aicreataro @KanaWorks_AI';
  const N_CASES = 5181, N_VIDEO = 1704;

  const px = v => `${v.toFixed(2)}px`;
  const f2 = v => v.toFixed(2);

  // 2D transform + opacity. E.tf uses translate3d, which promotes the element to a compositor layer whose raster
  // scale can stick across frames under the card's push-in; a 2D transform paints at the exact scale every frame.
  function tf2(el, { x = 0, y = 0, s = 1, sx = null, sy = null, r = 0, o = null } = {}) {
    const ax = sx != null ? sx : s, ay = sy != null ? sy : s;
    let tr = `translate(${f2(x)}px,${f2(y)}px)`;
    if (r) tr += ` rotate(${r.toFixed(3)}deg)`;
    if (ax !== 1 || ay !== 1) tr += ` scale(${ax.toFixed(5)},${ay.toFixed(5)})`;
    el.style.transform = tr;
    if (o != null) el.style.opacity = M.clamp(o).toFixed(4);
  }
  const vis = (el, on) => { const v = on ? 'visible' : 'hidden'; if (el.style.visibility !== v) el.style.visibility = v; };
  const setText = (el, str) => { if (el.textContent !== str) el.textContent = str; };
  // odometer format: always 4 digits with a thousands comma; returns [dim leading zeros, significant part]
  function odo(v) {
    const f = String(Math.max(0, Math.round(v))).padStart(4, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let i = 0;
    while (i < f.length - 1 && (f[i] === '0' || f[i] === ',')) i++;
    return [f.slice(0, i), f.slice(i)];
  }

  // the scene's own transition (iris from the playhead) and the iris radius at local time t, as the engine draws it
  function irisOf() {
    const me = (window.TIMELINE.scenes || []).find(x => x.id === ID) || {};
    const tr = me.transition || {};
    const cx = tr.cx != null ? tr.cx : W / 2, cy = tr.cy != null ? tr.cy : H / 2;
    const dur = tr.type === 'iris' ? (tr.dur || 0.7) : 0;
    const R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
    return { cx, cy, dur, R, r: t => (dur > 0 ? M.ease.inOutQuart(M.clamp(t / dur)) * R : R * 2) };
  }

  function timings(ctx) {
    const { clamp } = M;
    const T = {
      wan: ctx.word(L1, '完整'), wen: ctx.word(L1, '文章'),
      num: ctx.word(L1, '5181'), numEnd: ctx.wordEnd(L1, '5181'),
      way: ctx.word(L1, 'Way'), qu: ctx.word(L1, '去'), end: ctx.cueEnd(L1),
    };
    const iris = irisOf();
    // the pill leaves the centre once the iris has opened past 300 px, so its whole flight stays inside the circle
    let p = 0;
    while (iris.dur > 0 && p < 1 && M.ease.inOutQuart(p) * iris.R < 300) p += 0.005;
    T.drop0 = p * iris.dur;
    T.dropDur = 0.6;
    T.land = T.drop0 + T.dropDur;
    T.hero = 0.06;                          // characters rise while the iris opens
    T.logo = 0.12;
    T.ul = 0.62;                            // underline draws under 「代码」
    T.ruler = T.drop0;                      // the ruler unrolls under the falling pill
    T.left = Math.max(0.4, T.wan - 0.12);   // left column rises on 「完整」, settled by 「文章」
    T.right = T.num - 0.3;                  // right column settles as 「5181 个」 starts (URL on screen ≥ 5.8 s)
    T.count0 = T.num;
    T.count1 = Math.max(T.count0 + 0.5, Math.min(T.numEnd - 0.15, T.count0 + 0.85));
    T.credit = T.right + 0.5;
    T.sheen = T.way;
    T.glow = T.qu;
    // the film's last bar line (music grid, 4 beats) that leaves room for the ding before the last frame
    const bar = 4 * ctx.beat;
    let b = Math.ceil(ctx.start / bar - 1e-6) * bar - ctx.start;
    while (b + bar <= ctx.dur - 0.85) b += bar;
    T.lastBar = clamp(b, T.end, ctx.dur - 0.5);
    T.pulseDur = 0.6;
    T.pulse0 = T.lastBar - T.pulseDur;      // the pulse leaves frame 1 and hits the playhead on the bar
    return T;
  }

  // count-up progress at time t (outCubic), and the times at which it crosses k/n of the way (for ticks)
  const countP = (T, t, delay = 0) => M.prog(t, T.count0 + delay, T.count1 - T.count0, M.ease.outCubic);
  const countTicks = (T, n) => Array.from({ length: n }, (_, k) => T.count0 + (T.count1 - T.count0) * (1 - Math.cbrt(1 - k / n)));

  // logo SVG with ids made unique (the engine's chrome logo uses the same ids)
  function logoSvg(prefix) {
    let svg = window.LOGO_DARK || '';
    const ids = [...svg.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
    for (const id of ids) svg = svg.split(`"${id}"`).join(`"${prefix}${id}"`).split(`#${id})`).join(`#${prefix}${id})`);
    return svg;
  }

  Scene.define({
    id: ID,

    build(root, ctx) {
      const { h, s: S } = E;
      const T = timings(ctx);
      const iris = irisOf();
      const fps = ctx.fps || 30;
      const Tlast = ctx.start + ctx.dur - 1 / fps;          // film time of the last frame (s22 is the last scene)
      const xAt = tt => RULER.x0 + (RULER.x1 - RULER.x0) * (tt / Tlast);

      // ---------- measuring (the scene root is display:none while building) ----------
      const meas = h('span', { style: { position: 'absolute', left: '-12000px', top: '0px', whiteSpace: 'pre', visibility: 'hidden' } });
      document.body.append(meas);
      const measure = (text, font, ls = 'normal') => { meas.style.font = font; meas.style.letterSpacing = ls; meas.textContent = text; return meas.getBoundingClientRect().width; };
      const heroChars = Array.from(HERO.text);
      const heroFont = `900 ${HERO.size}px/1 var(--cn)`;
      const adv = heroChars.map(c => measure(c, heroFont, '-0.01em'));
      const heroW = adv.reduce((a, b) => a + b, 0);
      const pillFont = '600 22px/1 var(--mono)';
      const pillW = Math.max(PILL.w, Math.ceil(measure(`t = ${Tlast.toFixed(2)} s`, pillFont) + 2 * PILL.padX));
      meas.remove();

      // ---------- background ----------
      // the same two glows s21 ends on (purple at (1180, 300), lime at (700, 760)): the iris opens on a matching
      // background, then they drift into this card's composition (purple behind the title, lime toward the end)
      const bg = K.bg(root, 'night', { glows: [
        { x: 0, y: 0, r: 760, color: 'rgba(173,133,186,.42)', o: 0.55 },
        { x: 0, y: 0, r: 560, color: 'rgba(201,223,141,.14)', o: 0.55 },
      ] });

      // world: everything that rides the slow push-in (the ruler stays put: its geometry is the film's time)
      const world = h('div', { class: 'fill', style: { transformOrigin: `${DRIFT.ox}px ${DRIFT.oy}px` } });
      root.append(world);

      // ---------- logo (+ a lime copy for the sheen) ----------
      const k = LOGO.h / LOGO_VB.ink.h;
      const lw = LOGO_VB.w * k, lh = LOGO_VB.h * k;
      const lLeft = LOGO.cx - (LOGO_VB.ink.w * k) / 2 - LOGO_VB.ink.x * k;
      const lTop = LOGO.top - LOGO_VB.ink.y * k;
      const logo = h('div', { class: 'abs', style: { left: px(lLeft), top: px(lTop), width: px(lw), height: px(lh) } });
      const mkLogo = (prefix, lime) => {
        const box = h('div', { class: 'fill', html: logoSvg(prefix) });
        const svg = box.querySelector('svg');
        if (svg) { svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%'); svg.style.display = 'block'; }
        if (lime) box.querySelectorAll('path, rect').forEach(el => { if (!el.closest('clipPath')) el.setAttribute('fill', LIME); });
        return box;
      };
      const sheen = mkLogo(`${ID}b_`, true);
      sheen.style.visibility = 'hidden';
      logo.append(mkLogo(`${ID}a_`, false), sheen);
      world.append(logo);

      // ---------- hero: 「每一帧，都是代码」 + underline under 「代码」 ----------
      const heroTop = HERO.cy - HERO.size / 2;
      const chars = [];
      let acc = 0;
      heroChars.forEach((c, i) => {
        const x = 960 - heroW / 2 + acc;
        const el = h('span', { class: 'abs', style: { left: px(x), top: px(heroTop), width: px(adv[i]), height: `${HERO.size}px`,
          font: heroFont, letterSpacing: '-0.01em', color: SNOW, whiteSpace: 'pre' }, text: c });
        world.append(el);
        chars.push({ el, x, w: adv[i] });
        acc += adv[i];
      });
      const inset = HERO.size * 0.04;
      const ulX = chars[HERO.mark[0]].x + inset;
      const ulW = chars[HERO.mark[1]].x + chars[HERO.mark[1]].w - inset - ulX;
      const ulTop = heroTop + HERO.size + UL.gap;
      const ul = h('div', { class: 'abs', style: { left: px(ulX), top: px(ulTop), width: px(ulW), height: `${UL.h}px`, borderRadius: `${UL.h / 2}px`,
        background: LIME, transformOrigin: '0 50%' } });
      const ulGlint = h('div', { class: 'abs', style: { left: '0px', top: px(ulTop + UL.h / 2 - 16), width: '56px', height: '32px', borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,255,255,.95), rgba(233,245,196,.55) 45%, rgba(201,223,141,0))', visibility: 'hidden' } });
      world.append(ul, ulGlint);

      // ---------- two columns around the spine ----------
      const rightX = SPINE.x + SPINE.gap;                   // right column's left edge
      const leftX = SPINE.x - SPINE.gap;                    // left column's right edge
      const rowL = (top, child) => { const el = h('div', { class: 'abs', style: { right: px(W - leftX), top: px(top), display: 'flex', justifyContent: 'flex-end', whiteSpace: 'nowrap' } }, child); world.append(el); return el; };
      const rowR = (top, child) => { const el = h('div', { class: 'abs', style: { left: px(rightX), top: px(top), display: 'flex', whiteSpace: 'nowrap' } }, child); world.append(el); return el; };
      const body = (text, color = FOG) => h('div', { style: { font: '500 30px/1.45 var(--cn)', color }, text });

      const colL = [
        rowL(ROWS.tag, K.tag('读全文')),
        rowL(ROWS.h3, h('div', { style: { font: '700 44px/1.2 var(--cn)', color: SNOW, letterSpacing: '.01em' }, text: 'WaytoAGI 飞书知识库' })),
        rowL(ROWS.sub1, body(ARTICLE[0])),
        rowL(ROWS.sub2L, body(ARTICLE[1])),
      ];
      // counters: odometer style (4 digits always, leading zeros dimmed) so the line never reflows while counting
      const mkCounter = () => {
        const dim = h('span', { style: { opacity: '0.26' } });
        const val = h('span');
        const el = h('span', { style: { font: '700 32px/1 var(--display)', color: SNOW, fontVariantNumeric: 'tabular-nums', whiteSpace: 'pre' } }, dim, val);
        return { el, dim, val };
      };
      const cCases = mkCounter(), cVideo = mkCounter();
      const stats = h('div', { style: { font: '500 30px/1.45 var(--cn)', color: SNOW, display: 'flex', alignItems: 'baseline', whiteSpace: 'pre' } },
        cCases.el, h('span', { text: ' 个案例 · 视频类 ' }), cVideo.el, h('span', { text: ' 个' }));
      const colR = [
        rowR(ROWS.tag, K.tag('逛案例')),
        rowR(ROWS.url, h('div', { style: { font: '600 32px/1.2 var(--mono)', color: LIME }, text: URL })),
        rowR(ROWS.sub1, stats),
        rowR(ROWS.sub2R, h('div', { style: { font: '500 22px/1.45 var(--cn)', color: FOG }, text: '截至 10 月 1 日 WaytoAGI 收录' })),
      ];
      const spine = h('div', { class: 'abs', style: { left: px(SPINE.x - 0.75), top: px(SPINE.top), width: '1.5px', height: px(SPINE.bottom - SPINE.top),
        background: 'linear-gradient(180deg, rgba(244,241,242,0), rgba(244,241,242,.22) 18%, rgba(244,241,242,.22) 82%, rgba(244,241,242,0))', transformOrigin: '50% 0' } });
      world.append(spine);

      // ---------- credits ----------
      const credit = h('div', { class: 'abs', style: { left: '0px', top: px(CREDIT_TOP), width: `${W}px`, textAlign: 'center',
        font: '500 20px/1.3 var(--mono)', color: FOG, whiteSpace: 'pre' }, text: CREDITS });
      world.append(credit);

      // ---------- ruler: the whole film, x 112–1808 (screen space, not drifting) ----------
      const hud = h('div', { class: 'fill' });
      root.append(hud);
      const endGlow = h('div', { class: 'abs', style: { left: px(RULER.x1 - 150), top: px(RULER.y - 150), width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(201,223,141,.42), rgba(201,223,141,.12) 45%, rgba(201,223,141,0))', opacity: '0' } });
      hud.append(endGlow);
      const svg = K.svgRoot(W, H);
      const lineRest = S('line', { x1: RULER.x0, y1: RULER.y, x2: RULER.x0, y2: RULER.y, stroke: 'rgba(244,241,242,.26)', 'stroke-width': 1.5 });
      const lineDone = S('line', { x1: RULER.x0, y1: RULER.y, x2: RULER.x0, y2: RULER.y, stroke: 'rgba(244,241,242,.72)', 'stroke-width': 2, 'stroke-linecap': 'round' });
      svg.append(lineRest, lineDone);
      // ticks: every scene start (chapter starts taller), from the real timeline; each has a lime glow for the strike
      const chapterStarts = new Set((window.TIMELINE.chapters || []).map(c => c.start.toFixed(3)));
      const ticks = (window.TIMELINE.scenes || []).map(sc => {
        const x = xAt(sc.start);
        const major = chapterStarts.has(sc.start.toFixed(3));
        const len = major ? 13 : 7;
        const glow = S('line', { x1: f2(x), y1: RULER.y, x2: f2(x), y2: RULER.y, stroke: LIME, 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0 });
        const el = S('line', { x1: f2(x), y1: RULER.y, x2: f2(x), y2: RULER.y, stroke: SNOW, 'stroke-width': major ? 2 : 1.5, 'stroke-linecap': 'round' });
        svg.append(glow, el);
        return { x, len, major, el, glow };
      });
      const endCap = S('line', { x1: RULER.x1, y1: RULER.y, x2: RULER.x1, y2: RULER.y, stroke: SNOW, 'stroke-width': 2, 'stroke-linecap': 'round' });
      svg.append(endCap);
      hud.append(svg);
      // the end pulse: a lime trail with a bright head that runs the ruler on the last bar
      const trail = h('div', { class: 'abs', style: { left: '0px', top: px(RULER.y - 1.5), width: `${TRAIL}px`, height: '3px', borderRadius: '2px',
        background: 'linear-gradient(90deg, rgba(201,223,141,0), rgba(201,223,141,.95))', visibility: 'hidden' } });
      const head = h('div', { class: 'abs', style: { left: '0px', top: px(RULER.y - 15), width: '60px', height: '30px', borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,255,255,.95), rgba(233,245,196,.6) 40%, rgba(201,223,141,0))', visibility: 'hidden' } });
      hud.append(trail, head);

      // frame label, right-aligned above the ruler: 第 n 帧 / 共 {{FRAMES}} 帧 (n live)
      const labN = h('span', { style: { color: LIME, fontVariantNumeric: 'tabular-nums' } });
      const label = h('div', { class: 'abs', style: { right: px(W - RULER.x1 + LABEL.inset), top: px(LABEL.bottom - 28), height: '28px', display: 'flex', alignItems: 'center',
        font: '600 22px/1 var(--mono)', color: FOG, whiteSpace: 'pre', letterSpacing: '.02em' } },
        h('span', { text: '第 ' }), labN, h('span', { text: ' 帧 / 共 ' }), h('span', { style: { color: SNOW }, text: E.fill('{{FRAMES}}') }), h('span', { text: ' 帧' }));
      hud.append(label);

      // the playhead: stem + pill (s01's HUD pill as s21 hands it over: lime, 38 px, ink mono 22 readout of the real film time)
      const stem = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '2px', height: '0px', background: LIME, borderRadius: '1px' } });
      const pill = h('div', { class: 'abs center', style: { left: '0px', top: '0px', width: `${pillW}px`, height: `${PILL.h}px`, borderRadius: `${PILL.h / 2}px`,
        background: LIME, color: INK, font: pillFont, fontVariantNumeric: 'tabular-nums', whiteSpace: 'pre', boxShadow: '0 6px 18px rgba(18,16,17,.35)',
        transformOrigin: '50% 0%' } });
      root.append(stem, pill);

      // the iris rim: a lime ring riding just inside the engine's iris edge
      const rimSvg = K.svgRoot(W, H);
      const rimGlow = S('circle', { cx: iris.cx, cy: iris.cy, r: 1, fill: 'none', stroke: LIME, 'stroke-width': 12, opacity: 0 });
      const rim = S('circle', { cx: iris.cx, cy: iris.cy, r: 1, fill: 'none', stroke: LIME, 'stroke-width': 3, opacity: 0 });
      rimSvg.append(rimGlow, rim);
      root.append(rimSvg);

      return { T, iris, Tlast, xAt, bg, world, logo, logoW: lw, sheen, chars, ul, ulGlint, ulX, ulW, colL, colR, cCases, cVideo, spine, credit,
        endGlow, lineRest, lineDone, ticks, endCap, trail, head, label, labN, stem, pill, pillW, rimSvg, rim, rimGlow };
    },

    render(s, t, ctx) {
      const { clamp, lerp, prog, ease } = M;
      const T = s.T;
      const fps = ctx.fps || 30;
      const tc = clamp(t, 0, ctx.dur - 1 / fps);            // hold the last frame beyond the end
      const Tf = ctx.start + tc;                              // real film time
      const xph = s.xAt(Tf);                                  // the playhead on the ruler

      // ---------- background glows: from s21's resting places into this card ----------
      const g1 = ease.inOutSine(clamp(tc / 3));
      tf2(s.bg.glowEls[0], { x: lerp(GLOW_P.from[0], GLOW_P.to[0], g1), y: lerp(GLOW_P.from[1], GLOW_P.to[1], g1) });
      const g2 = ease.inOutSine(clamp(tc / ctx.dur));
      tf2(s.bg.glowEls[1], { x: lerp(GLOW_L.from[0], GLOW_L.to[0], g2), y: lerp(GLOW_L.from[1], GLOW_L.to[1], g2) });

      // ---------- camera: slow push-in on the card ----------
      tf2(s.world, { s: 1 + DRIFT.s * ease.inOutSine(clamp(tc / ctx.dur)) });

      // ---------- iris rim ----------
      const ip = s.iris.dur > 0 ? clamp(tc / s.iris.dur) : 1;
      const r = s.iris.r(tc);
      const rimOn = ip > 0 && ip < 1 && r > 6;
      vis(s.rimSvg, rimOn);
      if (rimOn) {
        const a = 1 - ease.inQuad(ip);
        s.rim.setAttribute('r', f2(Math.max(1, r - 2.5)));
        s.rim.setAttribute('opacity', (0.9 * a).toFixed(3));
        s.rimGlow.setAttribute('r', f2(Math.max(1, r - 7)));
        s.rimGlow.setAttribute('opacity', (0.22 * a).toFixed(3));
      }

      // ---------- logo: rises in as the iris passes; lime sheen on 「Way」 ----------
      const lp = prog(tc, T.logo, 0.7, ease.outQuint);
      tf2(s.logo, { y: (1 - lp) * 16, o: lp });
      const sp = clamp((tc - T.sheen) / 0.8);
      const sheenOn = sp > 0 && sp < 1;
      vis(s.sheen, sheenOn);
      if (sheenOn) {
        const c = lerp(-0.2 * s.logoW, 1.15 * s.logoW, ease.inOutSine(sp));
        const band = `linear-gradient(110deg, rgba(0,0,0,0) ${f2(c - 70)}px, #000 ${f2(c - 18)}px, #000 ${f2(c + 18)}px, rgba(0,0,0,0) ${f2(c + 70)}px)`;
        s.sheen.style.webkitMaskImage = band;
        s.sheen.style.maskImage = band;
        s.sheen.style.opacity = '1';
      }

      // ---------- hero characters: per-character rise ----------
      s.chars.forEach((c, i) => {
        const p = prog(tc, T.hero + i * 0.035, 0.75, ease.outQuint);
        tf2(c.el, { y: (1 - p) * HERO.size * 0.5, o: p });
        const b = (1 - p) * 5;
        const f = b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none';
        if (c.el.style.filter !== f) c.el.style.filter = f;
      });

      // ---------- underline under 「代码」: draws in, then glows once on 「去」 ----------
      const u = prog(tc, T.ul, 0.4, ease.outQuint);
      vis(s.ul, u > 0);
      const gk = clamp((tc - T.glow) / 1.1);
      const pulse = gk > 0 && gk < 1 ? Math.sin(Math.PI * Math.pow(gk, 0.6)) : 0;
      s.ul.style.transform = `scale(${u.toFixed(4)},${(1 + 0.3 * pulse).toFixed(4)})`;
      s.ul.style.background = pulse > 0.001 ? M.mixColor(LIME, SNOW, 0.5 * pulse) : LIME;
      s.ul.style.boxShadow = `0 0 ${f2(22 + 30 * pulse)}px rgba(201,223,141,${(0.5 + 0.45 * pulse).toFixed(3)}), 0 0 ${f2(4 + 90 * pulse)}px rgba(201,223,141,${(0.42 * pulse).toFixed(3)})`;
      // glint: rides the head while drawing in, and one pass along the bar on 「去」
      let gx = null, ga = 0;
      if (u > 0 && u < 1) { gx = s.ulX + s.ulW * u; ga = Math.min(1, u * 6) * (1 - prog(tc, T.ul + 0.18, 0.22)); }
      const gp = clamp((tc - T.glow - 0.05) / 0.55);
      if (gp > 0 && gp < 1) { gx = s.ulX + s.ulW * ease.inOutSine(gp); ga = Math.sin(Math.PI * gp); }
      vis(s.ulGlint, gx != null && ga > 0.01);
      if (gx != null) tf2(s.ulGlint, { x: gx - 28, o: ga });

      // ---------- columns ----------
      const up = (el, t0, dist = 26, dur = 0.6) => { const p = prog(tc, t0, dur, ease.outQuint); tf2(el, { y: (1 - p) * dist, o: p }); vis(el, p > 0); };
      s.colL.forEach((el, i) => up(el, T.left + [0, 0.06, 0.13, 0.19][i]));
      s.colR.forEach((el, i) => up(el, T.right + [0, 0.06, 0.13, 0.2][i]));
      const spn = prog(tc, T.left, 0.8, ease.outCubic);
      s.spine.style.transform = `scaleY(${spn.toFixed(4)})`;
      vis(s.spine, spn > 0);
      // count-up (odometer)
      const [d1, v1] = odo(N_CASES * countP(T, tc));
      setText(s.cCases.dim, d1); setText(s.cCases.val, v1);
      const [d2, v2] = odo(N_VIDEO * countP(T, tc, 0.08));
      setText(s.cVideo.dim, d2); setText(s.cVideo.val, v2);
      // credits
      up(s.credit, T.credit, 14, 0.7);

      // ---------- ruler ----------
      const rp = prog(tc, T.ruler, T.dropDur + 0.1, ease.outCubic);
      const xr = lerp(RULER.x0, RULER.x1, rp);
      s.lineRest.setAttribute('x2', f2(xr));
      s.lineDone.setAttribute('x2', f2(Math.max(RULER.x0, Math.min(xph, xr))));
      s.lineRest.style.visibility = s.lineDone.style.visibility = rp > 0 ? 'visible' : 'hidden';
      // the end pulse: x0 → playhead on the last bar, accelerating into it (inQuad)
      const pq = (tc - T.pulse0) / T.pulseDur;
      const span = Math.max(1, xph - RULER.x0);
      const passT = x => T.pulse0 + T.pulseDur * Math.sqrt(clamp((x - RULER.x0) / span));
      s.ticks.forEach(tk => {
        const a = clamp((xr - tk.x) / 70);
        const tp = passT(tk.x);
        const f = tc >= tp ? 1 - ease.inQuad(clamp((tc - tp) / 0.4)) : 0;
        const len = tk.len * ease.outCubic(a) + 5 * f;
        tk.el.setAttribute('y2', f2(RULER.y - len));
        tk.el.setAttribute('stroke', f > 0.01 ? M.mixColor(SNOW, LIME, Math.min(1, f * 1.5)) : SNOW);
        tk.el.setAttribute('opacity', Math.max(a * (tk.x <= xph + 0.5 ? (tk.major ? 0.8 : 0.55) : 0.35), f).toFixed(3));
        tk.glow.setAttribute('y2', f2(RULER.y - len));
        tk.glow.setAttribute('opacity', (0.28 * f).toFixed(3));
      });
      const pulseOn = pq > 0 && tc < T.lastBar + 0.2;
      vis(s.trail, pulseOn);
      vis(s.head, pulseOn);
      if (pulseOn) {
        const xp = lerp(RULER.x0, xph, ease.inQuad(clamp(pq)));
        const fade = 1 - prog(tc, T.lastBar, 0.2, ease.outCubic);
        // the trail stretches with speed (≈ 0.08 s of travel) so the streak spans the gap between frames
        const speed = (2 * clamp(pq) * (xph - RULER.x0)) / T.pulseDur;
        const w = Math.min(clamp(0.08 * speed, 140, TRAIL), xp - RULER.x0);
        s.trail.style.width = px(Math.max(0, w));
        tf2(s.trail, { x: xp - w, o: fade });
        tf2(s.head, { x: xp - 30, o: fade * Math.min(1, pq * 5) });
      }
      // end cap: the film's last frame; lights lime as the pulse arrives
      const ea = clamp((xr - RULER.x1 + 40) / 40);
      const lit = prog(tc, T.lastBar - 0.04, 0.2, ease.outCubic);
      s.endCap.setAttribute('y2', f2(RULER.y - (17 + 5 * lit) * ea));
      s.endCap.setAttribute('stroke', M.mixColor(SNOW, LIME, lit));
      s.endCap.setAttribute('stroke-width', f2(2 + 0.5 * lit));
      s.endCap.setAttribute('opacity', (ea * lerp(0.6, 1, lit)).toFixed(3));
      const glow = prog(tc, T.lastBar - 0.08, 0.3, ease.outCubic) * lerp(1, 0.55, prog(tc, T.lastBar + 0.25, 0.7, ease.inOutSine));
      s.endGlow.style.opacity = glow.toFixed(3);

      // ---------- playhead pill: centre → drops onto the ruler → hangs from its stem at the real time ----------
      const W_P = s.pillW, H_P = PILL.h;
      const restX = xph - W_P / 2 + H_P / 2;                 // flag: the pill's right cap is centred on the stem
      const restY = PILL.top + H_P / 2;
      let cx, cy, rot = 0, sx = 1, sy = 1;
      const dp = clamp((tc - T.drop0) / T.dropDur);
      if (dp <= 0) { cx = s.iris.cx; cy = s.iris.cy; }
      else if (dp < 1) {
        // a hop and a drop: x eases across, y is a throw (up first, then falling faster)
        const x0 = s.iris.cx, y0 = s.iris.cy;
        cx = lerp(x0, restX, ease.inOutSine(dp));
        const v0 = -230, a = restY - y0 - v0;
        cy = y0 + v0 * dp + a * dp * dp;
        rot = 7 * Math.sin(Math.PI * dp) * (1 - dp * 0.4);
        const stretch = 0.08 * ease.inQuad(dp);
        sx = 1 - stretch * 0.5; sy = 1 + stretch;
      } else {
        // caught by the stem: a quick dip and squash that settles
        const tau = tc - T.land;
        const d = Math.exp(-9 * tau) * Math.sin(20 * tau);
        cx = restX; cy = restY + 7 * d;
        sy = 1 - 0.1 * d; sx = 1 + 0.05 * d;
      }
      tf2(s.pill, { x: cx - W_P / 2, y: cy - H_P / 2, sx, sy, r: rot });
      // glow: s21's handoff glow fades as the pill drops; it comes back when the end pulse arrives
      const g0 = 1 - prog(tc, T.drop0, 0.45, ease.inOutSine);
      const lit2 = lit * lerp(1, 0.5, prog(tc, T.lastBar + 0.3, 0.8));
      const gb = Math.max(PILL.glow0.blur * g0, 4 + 28 * lit2), ga2 = Math.max(PILL.glow0.a * g0, 0.65 * lit2);
      s.pill.style.boxShadow = `0 6px 18px rgba(18,16,17,.35), 0 0 ${f2(gb)}px rgba(201,223,141,${ga2.toFixed(3)})`;
      setText(s.pill, `t = ${Tf.toFixed(2)} s`);
      // stem: plugs in from the ruler as the pill is caught
      const st = prog(tc, T.land - 0.06, 0.12, ease.outCubic);
      vis(s.stem, st > 0);
      const stemBot = cy - (H_P / 2) * sy + 4;
      s.stem.style.height = px(Math.max(0, (stemBot - STEM_TOP) * st));
      tf2(s.stem, { x: xph - 1, y: STEM_TOP });

      // ---------- frame label: real frame number ----------
      const lb = prog(tc, T.land + 0.04, 0.4, ease.outQuint);
      tf2(s.label, { y: (1 - lb) * 10, o: lb });
      setText(s.labN, K.fmt(Math.floor(Tf * fps + 1e-6) + 1));
    },

    events(ctx) {
      const T = timings(ctx);
      const ev = [
        { t: T.land, type: 'tick', gain: 0.32 },
        { t: T.wen, type: 'pop', gain: 0.35 },
        { t: T.right + 0.12, type: 'pop', gain: 0.25 },
        { t: T.sheen, type: 'sparkle', gain: 0.45 },
        { t: T.pulse0, type: 'rise_short', gain: 0.18 },
        { t: T.lastBar, type: 'ding', gain: 0.32 },
      ];
      countTicks(T, 7).forEach((tt, i) => ev.push({ t: tt, type: 'tick', gain: 0.22 + 0.02 * i }));
      return ev;
    },
  });
})();
