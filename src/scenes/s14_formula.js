/*
 * s14_formula — Synthesis: beauty is directing, not "Opus paints"; you direct, it codes.
 *
 * Phase 1 (所以…画画): case 8's own frame stays exactly where s13 left it while the iris opens around it, then shrinks
 *   into slot 08 of a row of eight mini case cards. 「好看 ＝ ▍」 waits; 「Opus 会画画」 types in and is struck in lime.
 *   Each mini card carries its case number (lime badge) and its 招 in a strip along the bottom; the @handle sits under it.
 * Phase 2 (而是…反复检查): the myth falls away, 「好看 ＝」 settles at the left of the equation row and the five terms land
 *   on their words. The newest term is the lime pill (the film's playhead), lime threads run into it from the cases that
 *   taught it (their 招 strips turn lime with them), and the previous term cools to an outline. On 「检查」 light runs
 *   down every thread and the row glows once.
 * Phase 3 (导演功夫…交给它): a brace gathers the five terms 「＝ 导演功夫」, then the roles: 「方向和反馈：你」 (the lime pill
 *   that becomes step 1's pill in s15) and 「代码：Opus」.
 * Every time comes from ctx.word(); render() is a pure function of t (clamped past ctx.dur).
 */
(() => {
  'use strict';
  const ID = 's14_formula';
  const LIME = '#C9DF8D', INK = '#241E1E', INK2 = '#5D5656', SNOW = '#F4F1F2', FOG = '#A39A9B', NIGHT2 = '#1B1718';

  // carousel order; thumbnails are the rack frames (storyboard global rule 3; case 05 never uses the wall poster).
  // move = the case's 招 in a few characters (from its secret line in s06–s13), printed on the thumbnail's strip.
  // shift/bg: case 05's GoodCase.ai logo sits in the frame's top-left corner, so that frame moves right, clear of the
  // number badge (card x 6–45 at 20 px; the logo starts ≈ 5 px past it, the wordmark ends ≈ 6 px inside the right edge),
  // and its flat page colour fills the gap
  const CASES = [
    { n: '01', clip: 'c1-006-morph', at: 1.9, author: '@twoclipping', pos: '50% 52%', move: '形状贯穿' },
    { n: '02', clip: 'c2-060-light', at: 4.4, author: '@morpheusdv', move: '暖色省用' },
    { n: '03', clip: 'c3-0962-web', at: 6.0, author: '@kimmonismus', move: '分层做' },
    { n: '04', clip: 'c4-1377-sun', at: 3.5, author: '@WinterArc2125', move: '真实数据' },
    { n: '05', clip: 'c5-072-brand', at: 0.65, author: '@aiwarts', pos: '30% 50%', move: '跟着点击', shift: 40, bg: '#FAFAF6' },
    { n: '06', clip: 'c6-054-render', at: 1.5, author: '@yoshifujidesign', pos: '50% 50%', move: '产品不动' },
    { n: '07', clip: 'c7-2348-hikare', at: 2.0, author: '@aicreataro', move: '动作驱动' },
    { n: '08', clip: 'c8-133-stage', at: 13.38, author: '@KanaWorks_AI', move: '各管一段' },
  ];
  // which cases illustrate which term (amendments: s14_formula)
  const TERMS = [
    { text: '叙事', from: [0, 2, 4], word: '叙事' },
    { text: '少量规则', from: [1, 5, 7], word: '规则' },
    { text: '统一时间轴', from: [0, 2], word: '时间' },
    { text: '声音落点', from: [0, 3, 6], word: '声音' },
    { text: '反复检查', from: [0, 2], word: '反复' },
  ];
  const MYTH = 'Opus 会画画';
  const FOOT = '注：案例 05、07、08 最像大片的画面来自现成素材或生成模型；Opus 负责设计、代码与编排（据作者）';

  // ---- layout (stage px) ----
  const MW = 168, MH = 95, MTOP = 160, MX0 = 162, MGAP = 36;
  const miniX = i => MX0 + i * (MW + MGAP);
  const miniCx = i => miniX(i) + MW / 2;
  const STRIP_H = 30;                                   // the 招 strip along each thumbnail's bottom edge (22 px label)
  const LABEL_TOP = MTOP + MH + 10;                     // the @handle line under each card (y 265–285)
  const PORT_Y = 306;                                   // thread ports sit below the handle line
  // the equation row fits x 137–1783 at scale 1, so the 1.00 → 1.03 push about x 960 ends it on the content box 112–1808
  const TW = 240, TH = 150, TTOP = 440, TX0 = 383, TGAP = 50;
  const EQ_X = 137;                                     // 「好看 ＝」 left edge in the equation (x 112 at the end of the push)
  const termX = k => TX0 + k * (TW + TGAP);
  const termCx = k => termX(k) + TW / 2;
  const ROW_CY = TTOP + TH / 2;
  const RHS_CX = (TX0 + termX(4) + TW) / 2;          // centre of the five terms (1083)
  const BR = { top: 606, mid: 622, tip: 640, x0: TX0, x1: termX(4) + TW };
  const DIR_TOP = 648, CHIP_TOP = 760, FOOT_TOP = 850;
  const EQ_BIG = 96, EQ_SMALL = 64;                     // 「好看 ＝」: H1 while it waits for the myth, H2 in the equation
  // out-continuity: 「方向和反馈：你」 flies (screen space) onto step 1's lime pill on K.stepRail in s15, the box
  // x 270–530, y 150–198 (label 26 px), and is parked there `lead` s before s15's chapter wipe reaches the pill's left
  // edge, so the bar hands one resting lime pill over to the other.
  const HAND = { x: 400, y: 174, w: 260, h: 48, text: 26, dur: 0.5, lead: 0.05 };
  // camera: the world starts DRIFT px low (phase-1 equation near frame centre) and tilts up to the final layout by 导演,
  // then pushes in 1.00 → 1.03 about PUSH_O
  const PUSH_O = { x: 960, y: 520 };
  const DRIFT = 46;
  // s13 leaves case 8 in the case template's 16:9 card: 1000×562 centred at (632, 515), push-in 1.025, last frame 10.8 s
  const C8 = { cx: 632, cy: 515, w: 1000, h: 562, s: 1.025, frame: 13.38 };   // s13's last frame (c8-133-stage now ends at 13.4 s)

  // when case 8's card can start its flight: once the iris has opened past the card's far corner (no double image)
  function flightTimes() {
    const me = (window.TIMELINE.scenes || []).find(x => x.id === ID) || {};
    const tr = me.transition || { type: 'iris', dur: 0.7 };
    if (tr.type !== 'iris') return { fly0: 0.2, fly1: 0.98 };
    const R = Math.hypot(960, 540);
    const far = Math.hypot(960 - (C8.cx - (C8.w * C8.s) / 2), 540 - (C8.cy - (C8.h * C8.s) / 2));
    let p = 0;
    while (p < 1 && M.ease.inOutQuart(p) * R < far) p += 0.005;
    const fly0 = p * (tr.dur || 0.7);
    return { fly0, fly1: fly0 + 0.78 };
  }
  const dropTime = (fly0, i) => fly0 + 0.06 + i * 0.08;

  // seconds after ctx.dur at which the next scene's chapter wipe (engine: bar at inOutCubic(p)·1920) reaches screen x;
  // 0 when the next transition is not a wipe. Read from TIMELINE because ctx.next is not set yet during build().
  function nextWipeAt(x) {
    const all = window.TIMELINE.scenes || [];
    const nx = all[all.findIndex(sc => sc.id === ID) + 1] || {};
    const tr = nx.transition || {};
    if (tr.type !== 'wipe' || !tr.dur) return 0;
    let lo = 0, hi = 1;
    for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (M.ease.inOutCubic(mid) * 1920 < x) lo = mid; else hi = mid; }
    return lo * tr.dur;
  }

  let mctx = null;
  const textW = (str, font) => { if (!mctx) mctx = document.createElement('canvas').getContext('2d'); mctx.font = font; return mctx.measureText(str).width; };

  Scene.define({
    id: ID,

    build(root, ctx) {
      const { h, s: S } = E;
      const L1 = `${ID}.1`, L2 = `${ID}.2`, L3 = `${ID}.3`;
      const T = {
        good: ctx.word(L1, '好看'), opus: ctx.word(L1, 'Opus'), paint: ctx.word(L1, '画画'),
        but: ctx.word(L2, '而是'), plus: ctx.word(L2, '加上'), check: ctx.word(L2, '检查'),
        dir: ctx.word(L3, '导演'), you: ctx.word(L3, '方向'), code: ctx.word(L3, '代码'),
      };
      T.land = TERMS.map(tm => ctx.word(L2, tm.word));
      // the hand-off lifts off as line 3 ends and lands before s15's wipe bar reaches the pill (x 270 at ≈ dur + 0.20)
      T.hand = ctx.dur + nextWipeAt(HAND.x - HAND.w / 2) - HAND.lead - HAND.dur;
      T.until = TERMS.map((_, k) => (k < TERMS.length - 1 ? T.land[k + 1] : T.dir));   // a term is "newest" until the next lands
      Object.assign(T, flightTimes());
      T.drop = CASES.map((_, i) => dropTime(T.fly0, i));

      K.bg(root, 'night', { glows: [
        { x: 1120, y: 520, r: 760, color: 'rgba(201,223,141,.11)', o: 1 },
        { x: 260, y: 180, r: 620, color: 'rgba(173,133,186,.32)', o: 0.55 },
      ] });

      // world: everything that rides the slow push-in
      const world = h('div', { class: 'fill', style: { transformOrigin: `${PUSH_O.x}px ${PUSH_O.y}px` } });
      root.append(world);

      // ---- mini case cards ----
      // each thumbnail carries its case number (lime badge, top-left) and its 招 (strip along the bottom, turns lime with
      // the threads); the author's handle sits alone under the card at meta size. The 招 (700 22 px) outranks the handle
      // (500 20 px mono): it is the word that ties the case to its terms.
      const minis = CASES.map((c, i) => {
        const el = h('div', { class: 'abs', style: { left: `${miniX(i)}px`, top: `${MTOP}px`, width: `${MW}px`, height: `${MH}px`,
          borderRadius: '12px', overflow: 'hidden', background: c.bg || '#000',
          boxShadow: '0 12px 28px rgba(0,0,0,.5), 0 0 0 1.5px rgba(255,255,255,.12)' } });
        const img = h('img', { style: { position: 'absolute', left: `${c.shift || 0}px`, top: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: c.pos || '50% 50%' } });
        const strip = h('div', { class: 'abs center', style: { left: '0px', right: '0px', bottom: '0px', height: `${STRIP_H}px`,
          background: 'rgba(18,16,17,.75)', color: SNOW, font: '700 22px/1 var(--cn)', letterSpacing: '.04em', whiteSpace: 'nowrap' }, text: c.move });
        const badge = h('div', { class: 'abs', style: { left: '6px', top: '6px', padding: '4px 7px', borderRadius: '6px', background: LIME,
          color: INK, font: '600 20px/1 var(--mono)', letterSpacing: '.02em', boxShadow: '0 2px 6px rgba(0,0,0,.35)' }, text: c.n });
        const ring = h('div', { class: 'fill', style: { borderRadius: '12px', boxShadow: `inset 0 0 0 3px ${LIME}`, opacity: '0' } });
        el.append(img, strip, badge, ring);
        const who = h('div', { class: 'abs', style: { left: `${miniCx(i) - 110}px`, top: `${LABEL_TOP}px`, width: '220px', textAlign: 'center',
          font: '500 20px/1 var(--mono)', color: 'rgba(244,241,242,.75)', whiteSpace: 'nowrap' }, text: c.author });
        world.append(el, who);
        return { el, img, strip, badge, ring, who, c };
      });

      // ---- threads (under the term cards) ----
      const svg = K.svgRoot(1920, 1080);
      world.append(svg);
      const gSoft = S('g'), gCore = S('g'), gDots = S('g');
      svg.append(gSoft, gCore, gDots);
      const threads = [];
      TERMS.forEach((tm, k) => {
        const src = [...tm.from].sort((a, b) => miniCx(a) - miniCx(b));
        src.forEach((ci, j) => {
          const xs = miniCx(ci), ys = PORT_Y;
          const xe = termCx(k) + (j - (src.length - 1) / 2) * 40, ye = TTOP - 4;
          // each term's bundle crosses the band at its own height (mid-height = centre + 3(a-b)/8), so the bundles layer
          // like strings instead of piling into one band
          const H = ye - ys, lift = (k - 2) * 9 * Math.min(1, Math.abs(xe - xs) / 500);
          const a = H * 0.78 + (4 / 3) * lift, b = H * 0.78 - (4 / 3) * lift;
          const d = `M${xs},${ys} C${xs},${(ys + a).toFixed(1)} ${xe},${(ye - b).toFixed(1)} ${xe},${ye}`;
          const line = K.drawPath(d, { stroke: LIME, 'stroke-width': 2.4 });
          const glow = K.drawPath(d, { stroke: LIME, 'stroke-width': 11, opacity: 0 });
          const comet = S('path', { d, fill: 'none', stroke: '#F1F8DC', 'stroke-width': 3.6, 'stroke-linecap': 'round', opacity: 0 });
          const tip = S('circle', { r: 5, fill: '#F1F8DC', opacity: 0 });
          const end = S('circle', { cx: xe, cy: ye, r: 3.6, fill: LIME, opacity: 0 });
          gSoft.append(glow.el);
          gCore.append(line.el, comet);
          gDots.append(tip, end);
          threads.push({ k, j, ci, line, glow, comet, tip, end, len: null, t0: 0 });
        });
      });
      // a thread starts drawing on its term's word; within a term, sources leave left to right
      threads.forEach(th => { th.t0 = T.land[th.k] + 0.05 + th.j * 0.07; });
      const ports = CASES.map((_, i) => {
        const c = S('circle', { cx: miniCx(i), cy: PORT_Y, r: 4.5, fill: LIME, opacity: 0 });
        gDots.append(c);
        const first = Math.min(...threads.filter(th => th.ci === i).map(th => th.t0));
        return { c, first };
      });

      // ---- equation row ----
      const eq = h('div', { class: 'abs', style: { left: '0px', top: '0px', font: `800 ${EQ_BIG}px/1 var(--cn)`, color: SNOW, whiteSpace: 'nowrap' } });
      const eqSpans = E.chars(eq, '好看 ＝');
      world.append(eq);
      const myth = h('div', { class: 'abs', style: { left: '0px', top: `${ROW_CY - EQ_BIG / 2}px`, height: `${EQ_BIG}px`, font: `900 ${EQ_BIG}px/1 var(--cn)`,
        color: SNOW, whiteSpace: 'nowrap', transformOrigin: '30% 50%' } });
      const mythSpans = E.chars(myth, MYTH);
      const caret = h('div', { class: 'abs', style: { top: `${EQ_BIG * 0.08}px`, width: '7px', height: `${EQ_BIG * 0.86}px`, borderRadius: '3px', background: LIME } });
      const strike = h('div', { class: 'abs', style: { left: '-14px', top: `${EQ_BIG * 0.6 - 5}px`, height: '10px', borderRadius: '5px', background: LIME,
        transformOrigin: '0 50%', boxShadow: '0 0 18px rgba(201,223,141,.55)' } });
      myth.append(caret, strike);
      world.append(myth);
      // geometry of 「好看 ＝ Opus 会画画」 centred while it waits, from the real glyph advances
      const eqWBig = textW('好看 ＝', `800 ${EQ_BIG}px NSC`);
      const mythW = textW(MYTH, `900 ${EQ_BIG}px NSC`);
      const mythCum = Array.from(MYTH).map((_, i) => textW(Array.from(MYTH).slice(0, i + 1).join(''), `900 ${EQ_BIG}px NSC`));
      const GAP1 = 44;
      const groupL = 960 - (eqWBig + GAP1 + mythW) / 2;
      myth.style.left = `${(groupL + eqWBig + GAP1).toFixed(1)}px`;
      myth.style.width = `${Math.ceil(mythW)}px`;
      strike.style.width = `${Math.ceil(mythW + 28)}px`;

      const plusEls = TERMS.map((_, k) => {
        if (k === 0) return null;
        const el = h('div', { class: 'abs center', style: { left: `${termX(k) - TGAP / 2 - 30}px`, top: `${ROW_CY - 30}px`, width: '60px', height: '60px',
          font: '300 44px/1 var(--cn)', color: FOG }, text: '＋' });
        world.append(el);
        return el;
      });
      const cards = TERMS.map((tm, k) => {
        const el = h('div', { class: 'abs', style: { left: `${termX(k)}px`, top: `${TTOP}px`, width: `${TW}px`, height: `${TH}px`, borderRadius: '22px',
          border: '2px solid rgba(201,223,141,.42)', background: NIGHT2, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '14px' } });
        const term = h('div', { style: { font: '800 40px/1.1 var(--cn)', color: SNOW, whiteSpace: 'nowrap', letterSpacing: '.01em' }, text: tm.text });
        const sub = h('div', { style: { font: '600 22px/1 var(--mono)', color: FOG, whiteSpace: 'nowrap', letterSpacing: '.04em' },
          text: tm.from.map(i => CASES[i].n).join(' · ') });
        el.append(term, sub);
        const flash = h('div', { class: 'abs', style: { left: `${termX(k)}px`, top: `${TTOP}px`, width: `${TW}px`, height: `${TH}px`, borderRadius: '22px',
          border: `2px solid ${LIME}`, opacity: '0' } });
        world.append(flash, el);
        return { el, term, sub, flash };
      });

      // ---- brace 「＝ 导演功夫」 ----
      const braceL = K.drawPath(`M${RHS_CX},${BR.tip} Q${RHS_CX},${BR.mid} ${RHS_CX - 18},${BR.mid} L${BR.x0 + 16},${BR.mid} Q${BR.x0},${BR.mid} ${BR.x0},${BR.top}`,
        { stroke: LIME, 'stroke-width': 3 });
      const braceR = K.drawPath(`M${RHS_CX},${BR.tip} Q${RHS_CX},${BR.mid} ${RHS_CX + 18},${BR.mid} L${BR.x1 - 16},${BR.mid} Q${BR.x1},${BR.mid} ${BR.x1},${BR.top}`,
        { stroke: LIME, 'stroke-width': 3 });
      svg.append(braceL.el, braceR.el);
      const dirTitle = K.title('＝ 导演功夫', { size: 72, weight: 900, color: 'var(--lime)', lh: 1.15, align: 'center', stagger: 0.04 });
      Object.assign(dirTitle.el.style, { position: 'absolute', left: `${RHS_CX - 400}px`, top: `${DIR_TOP}px`, width: '800px' });
      world.append(dirTitle.el);

      // ---- role chips ----
      const chipRow = h('div', { class: 'abs', style: { left: `${RHS_CX - 450}px`, top: `${CHIP_TOP}px`, width: '900px', display: 'flex', justifyContent: 'center', gap: '26px' } });
      const chipYou = h('div', { style: { padding: '11px 26px 12px', borderRadius: '999px', background: LIME, color: INK, font: '800 30px/1.1 var(--cn)',
        whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(201,223,141,.22)' }, text: '方向和反馈：你' });
      const chipOpus = h('div', { style: { padding: '9px 24px 10px', borderRadius: '999px', border: '2px solid rgba(234,216,235,.78)', color: 'var(--lilac)',
        background: 'rgba(234,216,235,.06)', font: '700 30px/1.1 var(--cn)', whiteSpace: 'nowrap' }, text: '代码：Opus' });
      chipRow.append(chipYou, chipOpus);
      world.append(chipRow);
      // the hand-off pill: takes over from chipYou when the flight starts and morphs, in screen space, from its box to the
      // rail pill's box (a separate element, so resizing it never reflows the chip row)
      const handText = h('div', { style: { font: '800 30px/1.1 var(--cn)', color: INK, whiteSpace: 'nowrap' }, text: '方向和反馈：你' });
      const hand = h('div', { class: 'abs center', style: { left: '0px', top: '0px', borderRadius: '999px', background: LIME, overflow: 'hidden',
        visibility: 'hidden', zIndex: '6' } }, handText);

      // the footnote is a caption: it stays put in screen space (never drifts toward the subtitle band)
      const foot = h('div', { class: 'abs', style: { left: '112px', top: `${FOOT_TOP}px`, font: '500 20px/1.3 var(--cn)', color: FOG, whiteSpace: 'nowrap' }, text: FOOT });
      root.append(foot);

      // ---- case 8's card, matched to s13's last frame; it shrinks into slot 08 ----
      const flier = K.videoCard({ clip: 'c8-133-stage', w: C8.w, h: C8.h, radius: 24, credit: { author: '@KanaWorks_AI', note: '原作片段' } });
      Object.assign(flier.el.style, { left: `${C8.cx - C8.w / 2}px`, top: `${C8.cy - C8.h / 2}px`, zIndex: '5' });
      root.append(flier.el, hand);

      return { T, world, minis, threads, ports, eq, eqSpans, groupL, myth, mythSpans, mythCum, caret, strike, plusEls, cards,
        braceL, braceR, dirTitle, chipRow, chipYou, chipOpus, hand, handText, foot, flier, chipGeo: null };
    },

    render(s, t, ctx) {
      const { tf, setImg } = E;
      const { clamp, lerp, prog, ease, spring, mixColor } = M;
      const T = s.T;

      // ---- camera: slow tilt up to the final layout by 导演, push-in after card 08 has landed ----
      const drift = DRIFT * (1 - ease.inOutSine(clamp(t / T.dir)));
      const push = 1 + 0.03 * ease.inOutSine(clamp((t - T.fly1) / Math.max(1, ctx.dur + 0.6 - T.fly1)));
      s.world.style.transform = `translate3d(0,${drift.toFixed(2)}px,0) scale(${push.toFixed(5)})`;

      // ---- case 8's card: hold under the iris, then arc into slot 08 ----
      const fly = { cx: miniCx(7), bottom: MTOP + MH + drift };   // the flier's screen centre x and bottom edge (for its handle)
      {
        const p = clamp((t - T.fly0) / (T.fly1 - T.fly0));
        const u = ease.inOutCubic(p);
        const tx = miniCx(7), ty = MTOP + MH / 2 + drift;          // slot 08 where the world is at this moment (push is 1 until fly1)
        // quadratic arc: right first, then up into the slot (stays below the row until it arrives)
        const cx = (1 - u) * (1 - u) * C8.cx + 2 * u * (1 - u) * tx + u * u * tx;
        const cy = (1 - u) * (1 - u) * C8.cy + 2 * u * (1 - u) * C8.cy + u * u * ty;
        const sc = lerp(C8.s, MW / C8.w, ease.outCubic(p));
        fly.cx = cx; fly.bottom = cy + (C8.h * sc) / 2;
        s.flier.el.style.display = p >= 1 ? 'none' : 'block';
        if (p < 1) {
          setImg(s.flier.img, ctx.clipUrl('c8-133-stage', C8.frame));
          tf(s.flier.el, { x: cx - C8.cx, y: cy - C8.cy, s: sc });
          s.flier.el.style.borderRadius = `${(lerp(24 * C8.s, 12, ease.outCubic(p)) / sc).toFixed(2)}px`;
          s.flier.creditEl.style.opacity = (1 - prog(t, T.fly0, 0.22, ease.linear)).toFixed(3);
        }
      }

      // ---- mini cards ----
      // highlight = this case feeds the newest term (or the 检查 flash)
      const flashAll = M.env(t, T.check, T.check + 0.75, 0.08, 0.5);
      s.minis.forEach((m, i) => {
        setImg(m.img, ctx.clipUrl(m.c.clip, m.c.at));
        let y = 0, o = 1, sc = 1;
        if (i < 7) {
          const st = T.drop[i];
          const sp = spring(t - st, { stiffness: 230, damping: 19 });
          y = (1 - sp) * -56;
          o = clamp((t - st) / 0.16);
        } else {
          o = t >= T.fly1 ? 1 : 0;
          sc = 1 + 0.06 * Math.exp(-(t - T.fly1) * 9) * Math.sin(Math.max(0, t - T.fly1) * 22);   // tiny landing settle
        }
        let hi = 0;
        TERMS.forEach((tm, k) => {
          if (!tm.from.includes(i)) return;
          hi = Math.max(hi, Math.min(prog(t, T.land[k], 0.2), 1 - prog(t, T.until[k], 0.25)));
        });
        hi = Math.max(hi, flashAll * 0.9);
        tf(m.el, { y: y - 6 * hi, s: sc, o });
        m.ring.style.opacity = hi.toFixed(3);
        // the 招 strip turns lime (ink text) with the threads, so a landing term reads 「叙事 ← 形状贯穿 · 分层做 · 跟着点击」
        m.strip.style.background = `rgba(${Math.round(lerp(18, 201, hi))},${Math.round(lerp(16, 223, hi))},${Math.round(lerp(17, 141, hi))},${lerp(0.75, 1, hi).toFixed(3)})`;
        m.strip.style.color = mixColor(SNOW, INK, hi);
        // card 08 lands as the flier: its badge and strip settle in just after it
        if (i === 7) { const a = prog(t, T.fly1, 0.2).toFixed(3); m.strip.style.opacity = a; m.badge.style.opacity = a; }
        // card 08's handle is the flier's credit: it fades in under the flier before the flier's own chip has faded, rides
        // 10 px below the flier's bottom edge (never under it) and lands with it as the slot's handle
        const lo = i < 7 ? prog(t, T.drop[i] + 0.12, 0.35) : prog(t, T.fly0 + 0.05, 0.25);
        if (i === 7 && t < T.fly1) tf(m.who, { x: fly.cx - miniCx(7), y: fly.bottom + 10 - (LABEL_TOP + drift), o: lo });
        else tf(m.who, { y: (1 - lo) * 8 - 6 * hi, o: lo });
        m.who.style.color = `rgba(244,241,242,${lerp(0.75, 1, hi).toFixed(3)})`;
      });

      // ---- threads ----
      s.threads.forEach(th => {
        if (th.len == null) { try { th.len = th.line.el.getTotalLength(); } catch (e) { th.len = 400; } th.comet.style.strokeDasharray = `70 ${th.len + 80}`; }
        const k = th.k;
        const p = prog(t, th.t0, 0.5, ease.inOutCubic);
        th.line.render(p);
        th.glow.render(p);
        const newest = Math.min(prog(t, T.land[k], 0.15), 1 - prog(t, T.until[k], 0.35));
        const late = prog(t, T.dir, 0.5);
        const base = lerp(0.3, 0.44, late);
        const op = p > 0 ? lerp(base, 1, newest) : 0;
        th.line.el.style.opacity = op.toFixed(3);
        th.line.el.setAttribute('stroke-width', lerp(1.7, 2.6, newest).toFixed(2));
        th.glow.el.style.opacity = (0.16 * newest * (p > 0 ? 1 : 0)).toFixed(3);
        // drawing tip
        const drawing = p > 0 && p < 1;
        th.tip.style.opacity = drawing ? '1' : '0';
        if (drawing) {
          const pt = th.line.el.getPointAtLength(th.len * p);
          th.tip.setAttribute('cx', pt.x.toFixed(1)); th.tip.setAttribute('cy', pt.y.toFixed(1));
        }
        th.end.style.opacity = (prog(t, th.t0 + 0.42, 0.15) * lerp(0.55, 1, newest)).toFixed(3);
        // 检查: light runs down every thread at once
        const c0 = T.check + 0.04 * k;
        const cp = clamp((t - c0) / 0.55);
        const on = t >= c0 && cp < 1 && p >= 1;
        th.comet.style.opacity = on ? '0.95' : '0';
        if (on) th.comet.style.strokeDashoffset = String(lerp(70, -th.len, ease.inOutSine(cp)));
      });
      s.ports.forEach(pt => { pt.c.style.opacity = (prog(t, pt.first, 0.2) * 0.9).toFixed(3); });

      // ---- 「好看 ＝」: lands big on 好看, settles into the equation on 而是 ----
      {
        // settles before the first term lands on 叙事 (≈ 0.32 s after 而是)
        const g = prog(t, T.but, Math.min(0.42, Math.max(0.2, T.land[0] - T.but)), ease.outCubic);
        const size = lerp(EQ_BIG, EQ_SMALL, g);
        const left = lerp(s.groupL, EQ_X, g);
        s.eq.style.fontSize = `${size.toFixed(2)}px`;
        s.eq.style.left = `${left.toFixed(1)}px`;
        s.eq.style.top = `${(ROW_CY - size / 2).toFixed(1)}px`;
        s.eqSpans.forEach((sp, i) => {
          const a = prog(t, T.good + i * 0.05, 0.6, ease.outQuint);
          tf(sp, { y: (1 - a) * 46, o: a });
        });
      }

      // ---- the myth: types on Opus, struck on 画画, falls on 而是 ----
      {
        const n = s.mythSpans.length;
        const typeDur = 0.46;
        const tp = clamp((t - T.opus) / typeDur);
        const shown = Math.round(tp * n);
        s.mythSpans.forEach((sp, i) => { sp.style.opacity = i < shown ? '1' : '0'; });
        // caret: blinks in the empty slot after 「好看 ＝」 lands, rides the typing, gone once the strike lands
        const caretOn = t >= T.good + 0.45 && t < T.paint;
        const typing = t >= T.opus && tp < 1;
        const blink = typing || Math.floor((t - T.good) * 2.6) % 2 === 0;
        s.caret.style.opacity = caretOn && blink ? '1' : '0';
        s.caret.style.left = `${(shown > 0 ? s.mythCum[shown - 1] + 6 : 0).toFixed(1)}px`;
        // strike + shake
        const sk = prog(t, T.paint, 0.2, ease.outCubic);
        s.strike.style.transform = `rotate(-1.4deg) scaleX(${sk.toFixed(4)})`;
        s.strike.style.opacity = sk > 0 ? '1' : '0';
        const shakeP = clamp((t - T.paint) / 0.4);
        const shake = t >= T.paint && shakeP < 1 ? 4 * Math.sin((t - T.paint) * Math.PI * 2 * 18) * (1 - shakeP) : 0;
        s.myth.style.color = mixColor(SNOW, '#8E8586', prog(t, T.paint + 0.1, 0.3));
        const f = prog(t, T.but, 0.42, ease.inCubic);
        tf(s.myth, { x: shake, y: f * 110, r: f * 7, o: 1 - f });
        s.myth.style.visibility = f >= 1 ? 'hidden' : 'visible';
      }

      // ---- terms ----
      s.cards.forEach((c, k) => {
        const L = T.land[k];
        const sp = spring(t - L, { stiffness: 300, damping: 20 });
        const vis = t >= L - 0.02;
        const lime = Math.min(prog(t, L - 0.02, 0.06), 1 - prog(t, T.until[k], 0.35, ease.inOutCubic));
        // 检查: the row glows once, card by card, as the light arrives down the threads
        const glow = M.env(t, T.check + 0.36 + k * 0.05, T.check + 1.25 + k * 0.05, 0.16, 0.6, ease.outCubic, ease.inOutSine);
        tf(c.el, { y: (1 - Math.min(1, sp)) * 26, s: lerp(0.72, 1, sp), o: vis ? clamp((t - L + 0.02) / 0.07) : 0 });
        c.el.style.background = mixColor(NIGHT2, LIME, lime);
        c.el.style.borderColor = lime > 0.5 ? LIME : `rgba(201,223,141,${(0.42 + 0.5 * glow).toFixed(3)})`;
        c.term.style.color = mixColor(SNOW, INK, lime);
        c.sub.style.color = mixColor(FOG, INK2, lime);
        const sh = [];
        if (lime > 0.01) sh.push(`0 16px 44px rgba(201,223,141,${(0.26 * lime).toFixed(3)})`);
        if (glow > 0.01) sh.push(`0 0 ${(34 * glow).toFixed(1)}px rgba(201,223,141,${(0.55 * glow).toFixed(3)})`);
        c.el.style.boxShadow = sh.length ? sh.join(',') : 'none';
        const fl = clamp((t - L) / 0.42);
        tf(c.flash, { s: 1 + 0.09 * ease.outCubic(fl), o: t >= L && fl < 1 ? 0.7 * (1 - ease.outCubic(fl)) : 0 });
        // 「＋」 pops just before its term; the last one on the spoken 「加上」
        if (s.plusEls[k]) K.pop(s.plusEls[k], t, k === TERMS.length - 1 ? T.plus : L - 0.12, { from: 0.4 });
      });

      // ---- 导演功夫 ----
      const bp = prog(t, T.dir - 0.12, 0.55, ease.inOutCubic);
      s.braceL.render(bp); s.braceR.render(bp);
      s.braceL.el.style.opacity = bp > 0 ? '1' : '0';
      s.braceR.el.style.opacity = bp > 0 ? '1' : '0';
      s.dirTitle.render(t, T.dir);

      // ---- roles ----
      {
        // 「方向和反馈：你」 springs in on 方向; as the line ends it lifts into step 1's slot on the s15 rail and rests there,
        // so the chapter wipe hands it over to s15's lime pill
        if (!s.chipGeo) s.chipGeo = { cx: s.chipRow.offsetLeft + s.chipYou.offsetLeft + s.chipYou.offsetWidth / 2,
          cy: s.chipRow.offsetTop + s.chipYou.offsetTop + s.chipYou.offsetHeight / 2, w: s.chipYou.offsetWidth, h: s.chipYou.offsetHeight };
        const g = s.chipGeo;
        const sp = spring(t - T.you, { stiffness: 300, damping: 18 });
        const s0 = lerp(0.5, 1, sp);
        const hp = prog(t, T.hand, HAND.dur, ease.inOutCubic);
        tf(s.chipYou, { s: s0, o: t >= T.you ? clamp((t - T.you) / 0.18) : 0 });
        s.chipYou.style.visibility = hp > 0 ? 'hidden' : 'visible';
        s.hand.style.visibility = hp > 0 ? 'visible' : 'hidden';
        if (hp > 0) {
          // the chip's on-screen box at this frame (the world is translated by drift and scaled by push about PUSH_O)
          const x0 = PUSH_O.x + (g.cx - PUSH_O.x) * push, y0 = PUSH_O.y + (g.cy - PUSH_O.y) * push + drift;
          const w0 = g.w * push * s0, h0 = g.h * push * s0;
          // arc: left along the chip row first (clear of 「＝ 导演功夫」), then up the left side into the slot
          const bx = (1 - hp) * (1 - hp) * x0 + 2 * hp * (1 - hp) * HAND.x + hp * hp * HAND.x;
          const by = (1 - hp) * (1 - hp) * y0 + 2 * hp * (1 - hp) * y0 + hp * hp * HAND.y;
          const w = lerp(w0, HAND.w, hp), hh = lerp(h0, HAND.h, hp);
          Object.assign(s.hand.style, { left: `${(bx - w / 2).toFixed(2)}px`, top: `${(by - hh / 2).toFixed(2)}px`,
            width: `${w.toFixed(2)}px`, height: `${hh.toFixed(2)}px`,
            boxShadow: `0 10px 30px rgba(201,223,141,${(0.22 + 0.3 * Math.sin(Math.PI * hp)).toFixed(3)})` });
          tf(s.handText, { s: lerp(push * s0, HAND.text / 30, hp) });
        }
      }
      // 「代码：Opus」 waits beside it at half strength (so it is on screen > 3 s), then lights up on 代码
      {
        const a = prog(t, T.you + 0.18, 0.4, ease.outCubic);
        const on = clamp((t - T.code) / 0.15);
        const bump = t >= T.code ? 0.1 * Math.sin(Math.PI * clamp((t - T.code) / 0.32)) : 0;
        tf(s.chipOpus, { x: (1 - a) * -18, s: 1 + bump, o: a * lerp(0.38, 1, on) });
        s.chipOpus.style.borderColor = `rgba(234,216,235,${lerp(0.4, 0.85, on).toFixed(3)})`;
      }

      // ---- footnote (amendment: from 0.5 s) ----
      tf(s.foot, { y: (1 - prog(t, 0.5, 0.5)) * 10, o: prog(t, 0.5, 0.5) });
    },

    events(ctx) {
      const L1 = `${ID}.1`, L2 = `${ID}.2`, L3 = `${ID}.3`;
      const out = [];
      const { fly0, fly1 } = flightTimes();
      for (let i = 0; i < 7; i++) out.push({ t: dropTime(fly0, i), type: 'tick', gain: 0.22 });
      out.push({ t: fly1, type: 'tick', gain: 0.3 });
      out.push({ t: ctx.word(L1, '画画'), type: 'glitch', gain: 0.35 });
      TERMS.forEach(tm => out.push({ t: ctx.word(L2, tm.word), type: 'blip', gain: 0.4 }));
      out.push({ t: ctx.word(L2, '检查'), type: 'ding', gain: 0.45 });
      out.push({ t: ctx.word(L3, '导演'), type: 'impact', gain: 0.3 });
      out.push({ t: ctx.word(L3, '方向'), type: 'pop', gain: 0.4 });
      out.push({ t: ctx.word(L3, '代码'), type: 'pop', gain: 0.4 });
      return out;
    },
  });
})();
