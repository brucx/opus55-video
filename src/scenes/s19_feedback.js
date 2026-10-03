/*
 * s19_feedback — Step 5: feedback = time point + problem + expectation.
 *
 * In:     the wipe-up turns the page and the new page is already printed (as in s16–s18 and s20): centre stage, the
 *         formula's skeleton 「反馈 ＝ [ ] ＋ [ ] ＋ [ ]」, three blank (dashed) slots. Once the page has uncovered the rail,
 *         its lime pill hops 4 → 5 on 「第五步」.
 * 反馈:   a lime marker sweeps under 「反馈」 and the rail's pill ripples.
 * 时间点 / 问题 / 期望: each slot fills on its word (badge pops, label rises, the blank becomes a card).
 *         The finished formula docks under the rail and the tip 「每轮只改一类：故事 › 构图 › 动作 › 声音」 settles under it.
 * 别说:   the ✗ panel takes centre stage: 「感觉不对，再炫一点」 → the reply 「……哪一段？哪里不对？」 → a ✗ stamp;
 *         then it docks to the left (the same move the formula made), clearing the centre for the preview.
 * 要:     ✓ panel (right) opens with a bubble of three dashed blanks labelled 时间点 / 问题 / 期望 (the formula as a
 *         template); the ✗ panel steps back; the 20 s ruler draws in along the bottom, lime playhead parked at 0:00.
 * 8 到 11 秒: chip 1 flies out of slot 1 into the bubble; the 8–11 s range lights; the playhead seeks to 0:08 and a beam
 *         rises from the range into the preview between the panels (the film's own PAGE.draw under a sample title, 示意).
 * 标题:   chip 2 flies in; the sample plays on and the title cuts out at 0:09.5, right on 「消失」: the film's only warm
 *         red marks it (out-point flag on the ruler above the playhead, a ring around the preview on the paper, the
 *         title's ghost box inside it). The tip dims while a chip crosses it.
 * 请:     chip 3 flies in. 延长: the flag (the title's out-point) slides 9.5 → 11, flips green near the end of the slide;
 *         the title is back. 停留: ✓, and the playhead runs on to 0:11 with the title held. The end state holds through
 *         the next wipe.
 * Every time comes from ctx.word(); render() is a pure function of t.
 */
(() => {
  'use strict';
  const ID = 's19_feedback';
  const L1 = `${ID}.1`, L2 = `${ID}.2`;
  const INK = '#241E1E', INK2 = '#5D5656', GREEN = '#238653', DEEP = '#176A42', LIME = '#C9DF8D';
  const LINE = '#DDD7DB', WHITE = '#FFFFFF', BUBBLE_BG = '#E9F3EC', AI_BG = '#F3F0F1';
  const RED = '#C0392B';                        // storyboard: warm red at 70 %, used only for the vanishing title
  const RAIL_DELAY = 0.4;                       // the wipe-up uncovers the rail at ≈0.4 s; the pill hops after that

  // ---- copy (storyboard + amendment s19_feedback.2) ----
  const SLOTS = [
    { label: '时间点', icon: 'clock', chip: [['第 '], ['8–11', 1], [' 秒']] },
    { label: '问题', icon: 'warn', chip: [['标题没读完就消失']] },
    { label: '期望', icon: 'check', chip: [['请延长停留']] },
  ];
  const BUBBLE_ROWS = [[0, 1], [2]];
  const TIP = [['每轮只改一类', 'b'], ['：', ''], ['故事', 'k'], [' › ', 'g'], ['构图', 'k'], [' › ', 'g'], ['动作', 'k'], [' › ', 'g'], ['声音', 'k']];
  const BAD_USER = '感觉不对，再炫一点';
  const BAD_REPLY = '……哪一段？哪里不对？';
  const SAMPLE_TITLE = '我做数据可视化';

  // ---- layout (stage px) ----
  const px = v => `${v}px`;
  const FORM = { y: 226, h: 96, headW: 136, eqW: 60, plusW: 52, slotW: 360, gap: 20, r: 18 };
  {
    const widths = [FORM.headW, FORM.eqW, FORM.slotW, FORM.plusW, FORM.slotW, FORM.plusW, FORM.slotW];
    const total = widths.reduce((a, b) => a + b, 0) + FORM.gap * (widths.length - 1);
    let x = Math.round((1920 - total) / 2);
    FORM.xs = widths.map(w => { const x0 = x; x += w + FORM.gap; return x0; });
    FORM.head = FORM.xs[0]; FORM.eq = FORM.xs[1]; FORM.slots = [FORM.xs[2], FORM.xs[4], FORM.xs[6]]; FORM.plus = [FORM.xs[3], FORM.xs[5]];
    FORM.cy = FORM.y + FORM.h / 2;
  }
  const TIP_Y = 338, TIP_SIZE = 26;
  const STAGE = { dy: 232, s: 1.12 };                              // phase 1: the formula sits centre stage, then docks
  const PANEL = { y: 384, h: 238, lx: 112, lw: 528, rx: 1200, rw: 608, pad: 26 };   // ✗ | preview | ✓
  // the ✗ panel's own centre stage (frame centre), from 「别说」 until it docks left before 「要」. It is moved by layout
  // (left/top), not by a transform, and not scaled: a transformed panel fading in at centre stage rasterised differently
  // after a sequential run than in a fresh render (4.0 → 5.0 frame by frame vs a direct seek), and a scaled one left a
  // 1 px seam. Positioned by layout it renders the same either way.
  const BAD_STAGE = { dx: 960 - (PANEL.lx + PANEL.lw / 2), dy: 40 };
  const SCR = { x0: 160, x1: 1760, y: 820, secs: 20 };            // the 20 s ruler; y = track centre line
  const sx = sec => SCR.x0 + (sec / SCR.secs) * (SCR.x1 - SCR.x0);
  const RANGE = [8, 11], OUT0 = 9.5;
  const BAND = { y: SCR.y - 13, h: 26 };
  const PV = { w: 480, h: 270, bottom: 676, r: 16 };               // the preview, centred over the range, between the panels
  PV.cx = (sx(RANGE[0]) + sx(RANGE[1])) / 2; PV.x = Math.round(PV.cx - PV.w / 2); PV.y = PV.bottom - PV.h;
  // the out-point flag: the pole clears the knob (knob y 802–838) so the pennant (y 756–780) reads as its own marker
  const FLAG = { h: 64, pw: 40, ph: 24 };
  const PV_SHADOW = '0 22px 48px rgba(36,30,30,.26), 0 0 0 1.5px rgba(36,30,30,.2)';

  // ---- timing: every value from the voice ----
  function timing(ctx) {
    const w = (l, x) => ctx.word(l, x), we = (l, x) => ctx.wordEnd(l, x);
    const T = {
      fk: w(L1, '反馈'), sjd: w(L1, '时间点'), wt: w(L1, '问题'), qw: w(L1, '期望'),
      bs: w(L2, '别说'), dianEnd: we(L2, '点'), yao: w(L2, '要'), di: w(L2, '第'), rng: w(L2, '8 到 11 秒'),
      bt: w(L2, '标题'), xs: w(L2, '消失'), qing: w(L2, '请'), yc: w(L2, '延长'),
    };
    // the skeleton 「反馈 ＝ [ ] ＋ [ ] ＋ [ ]」 is printed on the page from frame 0 and rides in with the wipe-up
    T.mark = T.fk - 0.02;                                   // 「反馈」: the lime marker sweeps under the printed word
    T.fill = [T.sjd, T.wt, T.qw].map(x => x - 0.05);
    T.dock = T.qw + 0.26; T.dockDur = 0.45;                 // the finished formula holds a beat, then docks under the rail …
    T.tip = T.dock + 0.24;                                  // … and the tip settles with it
    T.badIn = T.bs - 0.04;
    T.badUser = T.bs + 0.1;
    T.badReply = T.dianEnd - 0.22;
    T.stamp = T.dianEnd + 0.2;
    T.badDock = T.yao - 0.25; T.badDockDur = 0.6;          // stamped, the ✗ panel steps aside as the ✓ panel opens
    T.goodIn = T.yao - 0.08;
    T.bubble = T.yao + 0.1;
    T.dim = T.yao + 0.4;
    T.strip = T.yao + 0.22;
    T.knobIn = T.strip + 0.45;
    T.fly = [T.di + 0.02, T.bt - 0.02, T.qing - 0.02];
    T.flyDur = [0.56, 0.56, 0.48];
    T.band = T.rng + 0.02;                                  // the range sweeps 8 → 11 as the words are spoken
    T.hop = T.rng; T.hopDur = 0.5;                         // the playhead seeks 0:00 → 0:08
    T.beam = T.rng + 0.24;                                  // a beam rises from the range …
    T.pv = T.hop + T.hopDur - 0.02;                         // … and the preview opens as the playhead lands
    T.play0 = Math.min(T.rng + 0.78, T.xs - 0.6);          // leaves 0:08 …
    T.vanish = T.xs;                                        // … and reaches 0:09.5 on 「消失」: the title cuts out
    T.fix = T.yc + 0.04; T.fixDur = 0.46;                   // the out-point slides 9.5 → 11 …
    T.flagSwap = T.fix + 0.6 * T.fixDur;                    // … and flips red → green at ≈ 3/4 of the way (no muddy blend)
    T.back = T.fix + 0.06;                                  // the title returns as soon as the out-point moves
    T.ok = T.fix + T.fixDur;                                // ✓ (lands inside 「停留」)
    T.res0 = Math.max(T.ok - 0.12, T.xs + 0.2); T.res1 = T.res0 + 0.62;   // the playhead runs on 9.5 → 11, title held
    return T;
  }

  // sample time under the playhead
  function sampleAt(t, T) {
    const { clamp, lerp, ease } = M;
    if (t < T.hop) return 0;
    if (t < T.hop + T.hopDur) return RANGE[0] * ease.inOutCubic((t - T.hop) / T.hopDur);
    if (t < T.play0) return RANGE[0];
    if (t < T.vanish) return lerp(RANGE[0], OUT0, (t - T.play0) / (T.vanish - T.play0));
    if (t < T.res0) return OUT0;
    return lerp(OUT0, RANGE[1], ease.inOutSine(clamp((t - T.res0) / (T.res1 - T.res0))));
  }

  // ---- transforms: 2D only, no will-change, and settled elements drop their transform. Chrome promotes elements whose
  // transform keeps changing, and a promoted *scaled* layer keeps the raster of an earlier frame, so a frame's pixels came
  // to depend on the frames rendered before it (a render worker starting mid-scene drew it sharper than its neighbour).
  // For the same reason there is no camera scale on the page: sequential and fresh renders now match to AA noise.
  function tf(el, o = {}) {
    const x = o.x || 0, y = o.y || 0, r = o.r || 0;
    const sx = o.sx != null ? o.sx : o.s != null ? o.s : 1;
    const sy = o.sy != null ? o.sy : o.s != null ? o.s : 1;
    // a settled element gets no transform at all, so it is painted fresh rather than from a cached layer
    const still = Math.abs(x) < 0.005 && Math.abs(y) < 0.005 && Math.abs(r) < 0.001 && Math.abs(sx - 1) < 2e-4 && Math.abs(sy - 1) < 2e-4;
    let t = 'none';
    if (!still) {
      t = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
      if (r) t += ` rotate(${r.toFixed(3)}deg)`;
      if (sx !== 1 || sy !== 1) t += ` scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    }
    if (el.style.transform !== t) el.style.transform = t;
    if (o.o != null) el.style.opacity = M.clamp(o.o).toFixed(4);
    if (o.blur != null) el.style.filter = o.blur > 0.05 ? `blur(${o.blur.toFixed(2)}px)` : 'none';
  }
  function charSpans(host, text) {
    return Array.from(text).map(c => {
      const sp = E.h('span', { style: { display: 'inline-block', whiteSpace: 'pre', willChange: 'auto' }, text: c });
      host.append(sp);
      return sp;
    });
  }

  // ---- small builders ----
  function icon(kind, size, color, sw = 2.4) {
    const S = E.s;
    const svg = S('svg', { width: size, height: size, viewBox: '0 0 24 24', style: { display: 'block', overflow: 'visible' } });
    const st = { fill: 'none', stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    if (kind === 'clock') svg.append(S('circle', { cx: 12, cy: 12, r: 8.4, ...st }), S('path', { d: 'M12 7.4 V12.3 L15.3 14.4', ...st }));
    else if (kind === 'warn') svg.append(S('path', { d: 'M12 3.9 L20.9 19.3 H3.1 Z', ...st }), S('path', { d: 'M12 9.6 V13.6', ...st }),
      S('circle', { cx: 12, cy: 16.5, r: 0.35, ...st }));
    else if (kind === 'check') svg.append(S('path', { d: 'M6 12.6 L10.2 16.6 L18 8.2', ...st }));
    else if (kind === 'cross') svg.append(S('path', { d: 'M7.3 7.3 L16.7 16.7 M16.7 7.3 L7.3 16.7', ...st }));
    return svg;
  }
  function badge(kind, size, { bg = GREEN, fg = WHITE, ring = null, sw = 2.6, glyph = 0.62 } = {}) {
    const el = E.h('div', { style: { width: px(size), height: px(size), borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flex: 'none', boxSizing: 'border-box', border: ring ? `2.5px solid ${ring}` : 'none' } });
    el.append(icon(kind, Math.round(size * glyph), fg, sw));
    return el;
  }
  // 「示意」 tag: 20 px (the design floor for meta text); identical to s20's shiyi() variants so the two scenes match
  function tagEl(dark = false) {
    return E.h('div', { class: 'abs', style: dark
      ? { padding: '5px 10px 6px', borderRadius: '8px', background: 'rgba(18,16,17,.62)', border: '1px solid rgba(255,255,255,.24)', color: 'rgba(255,255,255,.88)',
        font: '600 20px/1 var(--cn)', whiteSpace: 'nowrap' }
      : { padding: '5px 10px 6px', borderRadius: '8px', border: `1.5px solid ${LINE}`, background: WHITE, color: INK2, font: '600 20px/1 var(--cn)', whiteSpace: 'nowrap' },
    text: '示意' });
  }
  // a feedback chip: mini badge + text (numbers in the display face)
  function chipEl(sd) {
    const { h } = E;
    const el = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '9px', height: '54px', padding: '0 16px 0 11px', borderRadius: '13px',
      background: WHITE, border: '1.5px solid rgba(35,134,83,.5)', font: '700 30px/1 var(--cn)', color: INK, whiteSpace: 'pre', boxSizing: 'border-box' } });
    el.append(badge(sd.icon, 28, { sw: 3, glyph: 0.66 }));
    const tx = h('span', { style: { whiteSpace: 'pre' } });
    sd.chip.forEach(([s, num]) => tx.append(h('span', { style: num ? { font: '700 31px/1 var(--display)', letterSpacing: '-0.01em' } : {}, text: s })));
    el.append(tx);
    return el;
  }
  function bubbleEl(text, who) {
    const user = who === 'user';
    return E.h('div', { class: 'abs', style: { padding: '9px 20px 11px', borderRadius: user ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
      background: user ? BUBBLE_BG : AI_BG, border: user ? '1.5px solid rgba(35,134,83,.35)' : '1.5px solid transparent',
      font: '500 30px/1.4 var(--cn)', color: user ? INK : INK2, whiteSpace: 'nowrap' }, text });
  }
  // rounded-rect outline path (clockwise from the top-left corner)
  const rrPath = (x, y, w, h, r) => `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} ` +
    `H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y}`;

  Scene.define({
    id: ID,

    build(root, ctx) {
      const { h, s: S } = E;
      const T = timing(ctx);

      const bg = K.bg(root, 'paper', { glows: [
        { x: 1540, y: 360, r: 640, color: 'rgba(201,223,141,.2)', o: 1 },
        { x: 260, y: 920, r: 620, color: 'rgba(234,216,235,.55)', o: 1 },
      ] });
      // world: the page. No camera scale on it: a scaled layer keeps a raster from earlier frames (see tf below); the
      // ambient drift is carried by the two soft glows instead.
      const world = h('div', { class: 'fill' });
      root.append(world);

      // ================= formula row: 反馈 ＝ [时间点] ＋ [问题] ＋ [期望] (+ tip), in one container that docks =================
      const form = h('div', { class: 'fill', style: { transformOrigin: `960px ${FORM.cy}px` } });
      world.append(form);
      const head = h('div', { class: 'abs center', style: { left: px(FORM.head), top: px(FORM.y), width: px(FORM.headW), height: px(FORM.h) } });
      const headWrap = h('span', { style: { position: 'relative', display: 'inline-block', isolation: 'isolate', font: '800 64px/1 var(--cn)', color: INK,
        whiteSpace: 'nowrap', letterSpacing: '0.01em' } });
      const headMark = h('span', { style: { position: 'absolute', left: '-7px', right: '-6px', bottom: '-1px', height: '27px', background: LIME, borderRadius: '5px',
        zIndex: '-1', transformOrigin: '0 50%', transform: 'scaleX(0)' } });
      headWrap.append(headMark);
      charSpans(headWrap, '反馈');
      head.append(headWrap);
      form.append(head);
      // 「反馈 ＝」 and the two ＋ are printed on the page: static from frame 0, never transformed
      const sign = (c, x, w) => form.append(h('div', { class: 'abs center', style: { left: px(x), top: px(FORM.y), width: px(w), height: px(FORM.h),
        font: '700 52px/1 var(--cn)', color: DEEP }, text: c }));
      sign('＝', FORM.eq, FORM.eqW);
      FORM.plus.forEach(x => sign('＋', x, FORM.plusW));

      // the blanks are printed on the page (fully dashed from frame 0); each fades out as its slot fills
      const slots = SLOTS.map((sd, k) => {
        const x = FORM.slots[k];
        const el = h('div', { class: 'abs', style: { left: px(x), top: px(FORM.y), width: px(FORM.slotW), height: px(FORM.h) } });
        const card = h('div', { class: 'fill', style: { borderRadius: px(FORM.r), background: WHITE, border: `2px solid ${GREEN}`, opacity: '0',
          boxShadow: '0 14px 30px rgba(36,30,30,.08)' } });
        const svg = S('svg', { width: FORM.slotW, height: FORM.h, viewBox: `0 0 ${FORM.slotW} ${FORM.h}`, style: { position: 'absolute', left: '0px', top: '0px', overflow: 'visible' } });
        const dash = S('path', { d: rrPath(1, 1, FORM.slotW - 2, FORM.h - 2, FORM.r - 1), fill: 'none', stroke: 'rgba(35,134,83,.6)', 'stroke-width': 2, 'stroke-linecap': 'round',
          'stroke-dasharray': '11 8' });
        svg.append(dash);
        const row = h('div', { class: 'fill center', style: { gap: '18px' } });
        const bdg = badge(sd.icon, 54, { sw: 2.5 });
        const lab = h('div', { style: { font: '800 44px/1 var(--cn)', color: INK, whiteSpace: 'nowrap', letterSpacing: '0.02em' } });
        const chs = charSpans(lab, sd.label);
        row.append(bdg, lab);
        const ring = h('div', { class: 'fill', style: { borderRadius: px(FORM.r) } });
        el.append(ring, card, svg, row);
        form.append(el);
        return { el, card, dash, bdg, lab, chs, ring, cx: x + FORM.slotW / 2, cy: FORM.cy };
      });

      // tip under the row
      const tip = h('div', { class: 'abs', style: { left: '0px', top: px(TIP_Y), width: '1920px', textAlign: 'center', font: `500 ${TIP_SIZE}px/1.3 var(--cn)`, color: INK2, whiteSpace: 'pre' } });
      TIP.forEach(([txt, k]) => tip.append(h('span', { style: k === 'b' ? { color: INK, fontWeight: '700' } : k === 'k' ? { color: INK, fontWeight: '600' }
        : k === 'g' ? { color: GREEN, fontWeight: '700' } : {}, text: txt })));
      form.append(tip);

      // ================= panels =================
      const panel = (x, w, good) => {
        const el = h('div', { class: 'abs', style: { left: px(x), top: px(PANEL.y), width: px(w), height: px(PANEL.h), borderRadius: '24px', background: WHITE,
          boxSizing: 'border-box', border: good ? `2px solid ${GREEN}` : `1.5px solid ${LINE}`,
          boxShadow: good ? '0 24px 54px rgba(35,134,83,.13)' : '0 18px 40px rgba(36,30,30,.07)' } });
        const hdr = h('div', { class: 'abs', style: { left: px(PANEL.pad - 2), top: '18px', display: 'flex', alignItems: 'center', gap: '12px' } });
        const ic = good ? badge('check', 36, { sw: 3 }) : badge('cross', 36, { bg: WHITE, fg: INK2, ring: INK2, sw: 3, glyph: 0.6 });
        const lab = h('div', { style: { font: '800 30px/1 var(--cn)', color: good ? DEEP : INK2, whiteSpace: 'nowrap' }, text: good ? '这样说' : '别这样说' });
        hdr.append(ic, lab);
        const tg = tagEl();
        Object.assign(tg.style, { right: px(PANEL.pad - 4), top: '22px' });
        el.append(hdr, tg);
        world.append(el);
        return { el, hdr, tg };
      };
      const bad = panel(PANEL.lx, PANEL.lw, false);
      const badUser = bubbleEl(BAD_USER, 'user');
      Object.assign(badUser.style, { right: px(PANEL.pad), top: '74px', transformOrigin: '100% 100%' });
      const badReply = bubbleEl(BAD_REPLY, 'ai');
      Object.assign(badReply.style, { left: px(PANEL.pad), top: '154px', transformOrigin: '0% 100%' });
      const stamp = h('div', { class: 'abs center', style: { left: '-76px', top: '-1px', width: '64px', height: '64px', borderRadius: '50%', border: `3px solid ${INK2}`,
        background: 'rgba(255,255,255,.94)', boxShadow: '0 6px 14px rgba(36,30,30,.12)' } }, icon('cross', 34, INK2, 3));
      badUser.append(stamp);
      bad.el.append(badUser, badReply);

      const good = panel(PANEL.rx, PANEL.rw, true);
      const bubble = h('div', { class: 'abs', style: { right: px(PANEL.pad), top: '70px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px',
        padding: '12px 14px', borderRadius: '20px 20px 6px 20px', background: BUBBLE_BG, border: '1.5px solid rgba(35,134,83,.35)', transformOrigin: '100% 100%' } });
      const holders = [];
      BUBBLE_ROWS.forEach(ids => {
        const row = h('div', { style: { display: 'flex', gap: '10px' } });
        ids.forEach(k => {
          const sd = SLOTS[k];
          const ph = h('div', { style: { position: 'relative', flex: 'none' } });
          const sizer = chipEl(sd);
          sizer.style.visibility = 'hidden';
          const blank = h('div', { class: 'fill center', style: { borderRadius: '13px', border: '2px dashed rgba(35,134,83,.5)', font: '600 24px/1 var(--cn)',
            color: 'rgba(93,86,86,.62)', whiteSpace: 'nowrap' }, text: sd.label });
          const chip = chipEl(sd);
          Object.assign(chip.style, { position: 'absolute', left: '0px', top: '0px', opacity: '0' });
          ph.append(sizer, blank, chip);
          row.append(ph);
          holders[k] = { ph, blank, chip };
        });
        bubble.append(row);
      });
      good.el.append(bubble);

      // ================= bottom strip: the 20 s ruler =================
      const strip = h('div', { class: 'fill' });
      world.append(strip);
      // the beam (range → preview) sits under the ruler; the out-point flag gets its own SVG above it
      const beamSvg = S('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0px', top: '0px', overflow: 'visible' } });
      const defs = S('defs');
      const grad = S('linearGradient', { id: `${ID}-beam`, x1: 0, y1: 0, x2: 0, y2: 1 },
        S('stop', { offset: '0%', 'stop-color': GREEN, 'stop-opacity': 0.05 }), S('stop', { offset: '100%', 'stop-color': GREEN, 'stop-opacity': 0.16 }));
      defs.append(grad);
      const beamG = S('g');
      const beam = S('path', { d: `M${PV.x},${PV.bottom - 2} L${PV.x + PV.w},${PV.bottom - 2} L${sx(RANGE[1])},${BAND.y} L${sx(RANGE[0])},${BAND.y} Z`, fill: `url(#${ID}-beam)` });
      const beamL = S('line', { x1: PV.x + 0.75, y1: PV.bottom - 2, x2: sx(RANGE[0]), y2: BAND.y, stroke: 'rgba(35,134,83,.42)', 'stroke-width': 1.5, 'stroke-dasharray': '6 6' });
      const beamR = S('line', { x1: PV.x + PV.w - 0.75, y1: PV.bottom - 2, x2: sx(RANGE[1]), y2: BAND.y, stroke: 'rgba(35,134,83,.42)', 'stroke-width': 1.5, 'stroke-dasharray': '6 6' });
      beamG.append(beam, beamL, beamR);
      // two flags on one mast position, red (the title's out-point at 0:09.5) and green (moved to 0:11): the pennant flips
      // from one to the other (fold, then unfurl), so the two colours are never blended
      const flagG = S('g');
      const mkFlag = col => {
        const g0 = S('g');
        const pole = S('line', { x1: 0, y1: 0, x2: 0, y2: -FLAG.h, stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round' });
        const penG = S('g');
        const pen = S('path', { d: `M0,${-FLAG.h} L${FLAG.pw},${-FLAG.h + FLAG.ph / 2} L0,${-FLAG.h + FLAG.ph} Z`, fill: col, 'stroke-linejoin': 'round' });
        penG.append(pen);
        g0.append(pole, penG);
        flagG.append(g0);
        return { g: g0, penG, pen };
      };
      const flags = [mkFlag(RED), mkFlag(GREEN)];
      beamSvg.append(defs, beamG);
      strip.append(beamSvg);

      const track = h('div', { class: 'abs', style: { left: px(SCR.x0), top: px(SCR.y - 2), width: px(SCR.x1 - SCR.x0), height: '4px', borderRadius: '2px',
        background: 'rgba(36,30,30,.16)', transformOrigin: '0 50%' } });
      const played = h('div', { class: 'abs', style: { left: px(SCR.x0), top: px(SCR.y - 2), width: '0px', height: '4px', borderRadius: '2px', background: GREEN } });
      const band = h('div', { class: 'abs', style: { left: px(sx(RANGE[0])), top: px(BAND.y), width: px(sx(RANGE[1]) - sx(RANGE[0])), height: px(BAND.h),
        borderRadius: '7px', background: 'rgba(35,134,83,.30)', transformOrigin: '0 50%', boxShadow: 'inset 0 0 0 1.5px rgba(35,134,83,.55)' } });
      strip.append(band, track, played);
      const ticks = [];
      for (let i = 0; i <= SCR.secs; i++) {
        const major = i % 5 === 0;
        const tk = h('div', { class: 'abs', style: { left: px(sx(i) - 1), top: px(SCR.y + 15), width: '2px', height: px(major ? 14 : 8), borderRadius: '1px',
          background: major ? 'rgba(36,30,30,.45)' : 'rgba(36,30,30,.24)' } });
        strip.append(tk);
        let lab = null;
        if (major) {
          lab = h('div', { class: 'abs', style: { left: px(sx(i)), top: px(SCR.y + 34), font: '600 20px/1 var(--mono)', color: INK2, whiteSpace: 'nowrap',
            fontVariantNumeric: 'tabular-nums' }, text: `0:${String(i).padStart(2, '0')}` });
          strip.append(lab);
        }
        ticks.push({ tk, lab, i });
      }
      const flagSvg = S('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0px', top: '0px', overflow: 'visible' } });
      flagSvg.append(flagG);
      strip.append(flagSvg);

      // the preview: PAGE.draw (the film's own page drawer) under a sample title
      // its red / green status ring is drawn outside it, on the paper (box-shadow spread), where the colour contrasts
      const pv = h('div', { class: 'abs', style: { left: px(PV.x), top: px(PV.y), width: px(PV.w), height: px(PV.h), borderRadius: px(PV.r), overflow: 'hidden',
        background: '#1B1718', boxShadow: PV_SHADOW, transformOrigin: '50% 100%' } });
      const cv = h('canvas', { width: PV.w * 2, height: PV.h * 2, style: { position: 'absolute', left: '0px', top: '0px', width: px(PV.w), height: px(PV.h) } });
      const g = cv.getContext('2d');
      const pvShade = h('div', { class: 'fill', style: { background: 'linear-gradient(180deg, rgba(18,16,17,0) 52%, rgba(18,16,17,.62) 100%)' } });
      const pvTitle = h('div', { class: 'abs', style: { left: '26px', bottom: '22px', font: '900 46px/1.15 var(--cn)', color: '#FFFFFF', whiteSpace: 'nowrap',
        letterSpacing: '0.01em', textShadow: '0 2px 14px rgba(0,0,0,.45)' }, text: SAMPLE_TITLE });
      const ghost = h('div', { class: 'abs', style: { left: '13px', bottom: '12px', height: '74px', width: '340px', borderRadius: '10px',
        border: '3px dashed rgba(192,57,43,.7)', background: 'rgba(192,57,43,.12)', opacity: '0', boxSizing: 'border-box' } });
      // where the title was: a faint trace of it
      const ghostTitle = h('div', { class: 'abs', style: { left: '26px', bottom: '22px', font: '900 46px/1.15 var(--cn)', color: 'rgba(255,255,255,.14)', whiteSpace: 'nowrap',
        letterSpacing: '0.01em', opacity: '0' }, text: SAMPLE_TITLE });
      const pvTag = tagEl(true);
      Object.assign(pvTag.style, { left: '12px', top: '12px' });
      const pvOk = badge('check', 50, { sw: 3.2, glyph: 0.62 });
      Object.assign(pvOk.style, { position: 'absolute', right: '14px', top: '14px', opacity: '0', boxShadow: '0 6px 16px rgba(0,0,0,.35), 0 0 0 3px rgba(255,255,255,.9)' });
      pv.append(cv, pvShade, ghost, ghostTitle, pvTitle, pvTag, pvOk);
      strip.append(pv);

      // the lime playhead: a knob riding the track
      const knob = h('div', { style: { height: '36px', padding: '0 14px', borderRadius: '18px', background: LIME, color: INK, font: '600 22px/36px var(--mono)',
        fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', boxShadow: '0 6px 16px rgba(35,134,83,.28), 0 0 0 2.5px rgba(255,255,255,.95)' } });
      const knobTxt = h('span', { text: '0:00' });
      knob.append(knobTxt);
      const knobBox = h('div', { class: 'abs', style: { left: '0px', top: px(SCR.y - 18) } }, knob);
      strip.append(knobBox);

      // ================= rail: fixed above the page =================
      const rail = K.stepRail();
      root.append(rail.el);
      const pills = Array.from(rail.el.children);

      return { T, glows: bg.glowEls, world, form, headMark, slots, tip, bad, badUser, badReply, stamp, good, bubble, holders,
        track, played, band, ticks, beamG, flagG, flags, pv, cv, g, pvTitle, ghost, ghostTitle, pvOk, knob, knobBox, knobTxt, rail, pills, geo: null };
    },

    render(s, t, ctx) {
      const { clamp, lerp, prog, ease, spring } = M;
      const T = s.T;
      const vis = (el, on) => { const v = on ? 'visible' : 'hidden'; if (el.style.visibility !== v) el.style.visibility = v; };

      // ---- rail: the lime pill hops 4 → 5 once the turning page has uncovered it; a ripple on 「反馈」 ----
      s.rail.render(Math.max(0, t - RAIL_DELAY), 4, 3);
      {
        const parts = ['0 8px 22px rgba(35,134,83,.18)'];
        const q = clamp((t - (T.fk - 0.04)) / 0.6);
        if (t >= T.fk - 0.04 && q < 1) parts.push(`0 0 0 ${(2 + 14 * ease.outCubic(q)).toFixed(2)}px rgba(35,134,83,${(0.32 * (1 - q)).toFixed(3)})`);
        if (t >= RAIL_DELAY + 0.3) s.pills[4].style.boxShadow = parts.join(',');
      }

      // ---- one-time layout measurements (fonts are loaded; the scene is displayed) ----
      if (!s.geo) {
        const wpos = el => { let x = 0, y = 0, e = el; while (e && e !== s.world) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y }; };
        // centre the ✓ bubble in the panel area under the header
        const hb = s.bubble.offsetHeight, top0 = 18 + 36 + 6, bot = PANEL.h - 6;
        s.bubble.style.top = px(Math.round(top0 + (bot - top0 - hb) / 2));
        s.geo = {
          chips: s.holders.map(hd => { const p = wpos(hd.ph); return { cx: p.x + hd.ph.offsetWidth / 2, cy: p.y + hd.ph.offsetHeight / 2 }; }),
          labW: s.ticks.map(tk => (tk.lab ? tk.lab.offsetWidth : 0)),
        };
        s.ghost.style.width = px(s.pvTitle.offsetWidth + 26);
      }

      // ---- ambient motion ----
      {
        // ambient drift: the light moves, the page never resamples
        const d = ease.inOutSine(clamp(t / (ctx.dur + 0.6)));
        tf(s.glows[0], { x: -70 * d, y: 36 * d });
        tf(s.glows[1], { x: 60 * d, y: -40 * d });
      }

      // ================= formula row =================
      {
        const d = prog(t, T.dock, T.dockDur, ease.inOutCubic);
        tf(s.form, { y: STAGE.dy * (1 - d), s: lerp(STAGE.s, 1, d) });
      }
      // 「反馈 ＝ [ ] ＋ [ ] ＋ [ ]」 is already printed; on 「反馈」 the lime marker sweeps under the word
      s.headMark.style.transform = `scaleX(${prog(t, T.mark, 0.4, ease.outCubic).toFixed(4)})`;
      s.slots.forEach((sl, k) => {
        // the printed blank fills on its word
        const f = T.fill[k];
        const fp = prog(t, f, 0.32, ease.outCubic);
        sl.dash.style.opacity = (1 - fp).toFixed(3);
        sl.card.style.opacity = fp.toFixed(3);
        const pop = spring(t - f, { stiffness: 300, damping: 17 });
        // slot bump when filled, and a small dip when its chip leaves for the bubble
        const lv = t - T.fly[k];
        const leave = lv > 0 && lv < 0.7 ? 0.035 * Math.sin(Math.PI * Math.min(1, lv / 0.22)) * Math.exp(-lv * 4) : 0;
        tf(sl.el, { s: (t >= f ? lerp(0.96, 1, clamp(pop, 0, 1.2)) : 1) - leave });
        tf(sl.bdg, { s: lerp(0.3, 1, clamp(spring(t - f - 0.02, { stiffness: 320, damping: 15 }), 0, 1.3)), o: clamp((t - f) / 0.12) });
        sl.chs.forEach((sp, i) => { const p = prog(t, f + 0.05 + i * 0.05, 0.55, ease.outQuint); tf(sp, { y: (1 - p) * 26, o: p }); });
        // ring pulse as the chip leaves
        const q = clamp(lv / 0.65);
        sl.ring.style.boxShadow = lv >= 0 && q < 1 ? `0 0 0 ${(2 + 16 * ease.outCubic(q)).toFixed(2)}px rgba(35,134,83,${(0.38 * (1 - q)).toFixed(3)})` : 'none';
      });
      {
        const p = prog(t, T.tip, 0.5, ease.outCubic);
        // chips 1 and 2 leave their slots across the tip line: it steps back to ≈40 % while one passes over it
        const cross = Math.max(...[0, 1].map(k => M.env(t, T.fly[k], T.fly[k] + 0.4, 0.08, 0.15)));
        tf(s.tip, { y: (1 - p) * 12, o: p * (1 - 0.6 * cross) });
      }

      // ================= ✗ panel =================
      {
        const a = prog(t, T.badIn, 0.55, ease.outCubic);
        const dim = prog(t, T.dim, 0.45, ease.inOutSine);
        // centre stage while it is the lesson (「别说再炫一点」), then docked to its slot on the left before 「要」
        // (inOutSine: 584 px at ≈ 51 px/frame peak, the same top speed as the formula's dock)
        const dk = prog(t, T.badDock, T.badDockDur, ease.inOutSine);
        s.bad.el.style.left = px(+(PANEL.lx + BAD_STAGE.dx * (1 - dk)).toFixed(2));
        s.bad.el.style.top = px(+(PANEL.y + BAD_STAGE.dy * (1 - dk) + (1 - a) * 40).toFixed(2));
        tf(s.bad.el, { o: a * (1 - 0.36 * dim) });
        const u = spring(t - T.badUser, { stiffness: 260, damping: 19 });
        tf(s.badUser, { s: lerp(0.86, 1, clamp(u, 0, 1.1)), y: (1 - clamp(u)) * 10, o: clamp((t - T.badUser) / 0.16) });
        const r = spring(t - T.badReply, { stiffness: 260, damping: 19 });
        tf(s.badReply, { s: lerp(0.86, 1, clamp(r, 0, 1.1)), y: (1 - clamp(r)) * 10, o: clamp((t - T.badReply) / 0.16) });
        const st = spring(t - T.stamp, { stiffness: 340, damping: 17 });
        tf(s.stamp, { s: lerp(1.7, 1, clamp(st, 0, 1.2)), r: -14, o: clamp((t - T.stamp) / 0.1) });
      }

      // ================= ✓ panel =================
      {
        const a = prog(t, T.goodIn, 0.55, ease.outCubic);
        tf(s.good.el, { y: (1 - a) * 40, o: a });
        const b = spring(t - T.bubble, { stiffness: 250, damping: 20 });
        tf(s.bubble, { s: lerp(0.9, 1, clamp(b, 0, 1.1)), o: clamp((t - T.bubble) / 0.18) });
        s.holders.forEach((hd, k) => {
          const t0 = T.fly[k], d = T.flyDur[k], land = t0 + d;
          const p = clamp((t - t0) / d);
          const u = ease.inOutCubic(p);
          hd.blank.style.opacity = (1 - prog(t, land - 0.06, 0.16)).toFixed(3);
          if (t < t0) { hd.chip.style.opacity = '0'; hd.chip.style.boxShadow = 'none'; return; }
          // quadratic arc from the slot centre to the blank, tossed up a little
          const c = s.geo.chips[k], sl = s.slots[k];
          const x0 = sl.cx - c.cx, y0 = sl.cy + FORM.h / 2 + 8 - c.cy;
          const cxp = x0 * 0.45, cyp = Math.min(y0, 0) - 60;
          const x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cxp;
          const y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cyp;
          const dt = t - land;
          const squash = dt > 0 && dt < 0.8 ? 0.05 * Math.sin(Math.PI * Math.min(1, dt / 0.2)) * Math.exp(-dt * 5) : 0;
          tf(hd.chip, { x, y, s: lerp(0.5, 1, u) + 0.08 * Math.sin(Math.PI * u) - squash, r: -5 * Math.sin(Math.PI * u), o: clamp(p / 0.2) });
          const sh = Math.sin(Math.PI * u);
          hd.chip.style.boxShadow = p < 1 ? `0 ${(6 + 16 * sh).toFixed(1)}px ${(12 + 22 * sh).toFixed(1)}px rgba(36,30,30,${(0.12 + 0.16 * sh).toFixed(3)})` : 'none';
        });
      }

      // ================= bottom strip =================
      const smp = sampleAt(t, T);
      const fx = prog(t, T.fix, T.fixDur, ease.inOutCubic);   // how far the out-point has been dragged (9.5 → 11)
      {
        const a = prog(t, T.strip, 0.6, ease.outCubic);
        s.track.style.transform = `scaleX(${a.toFixed(4)})`;
        vis(s.track, t >= T.strip);
        s.ticks.forEach(({ tk, lab, i }) => {
          const q = prog(t, T.strip + 0.04 + i * 0.022, 0.3);
          tk.style.opacity = q.toFixed(3);
          if (lab) tf(lab, { x: -s.geo.labW[i] / 2, y: (1 - q) * 6, o: q });
        });
        // range 8–11 lights with the words
        const bp = prog(t, T.band, 0.5, ease.outCubic);
        s.band.style.transform = `scaleX(${bp.toFixed(4)})`;
        vis(s.band, bp > 0);
        // it flashes once when it lights, and again when the fix lands (✓)
        const flash = (t >= T.band + 0.3 ? Math.exp(-(t - T.band - 0.3) * 4) : 0) + (t >= T.ok ? Math.exp(-(t - T.ok) * 4) : 0);
        s.band.style.background = `rgba(35,134,83,${(0.3 + 0.22 * Math.min(1, flash)).toFixed(3)})`;
        // knob
        const kx = sx(smp);
        const ki = spring(t - T.knobIn, { stiffness: 280, damping: 18 });
        const hopP = clamp((t - T.hop) / T.hopDur);
        const lift = t > T.hop && hopP < 1 ? -16 * Math.sin(Math.PI * hopP) : 0;
        const land = t - (T.hop + T.hopDur);
        const thud = land > 0 && land < 0.6 ? 0.07 * Math.sin(Math.PI * Math.min(1, land / 0.16)) * Math.exp(-land * 6) : 0;
        tf(s.knobBox, { x: kx, y: lift, o: clamp((t - T.knobIn) / 0.12) });
        const ks = lerp(0.5, 1, clamp(ki, 0, 1.15));
        s.knob.style.transform = `translateX(-50%) scale(${(ks * (1 + thud)).toFixed(4)},${(ks * (1 - thud)).toFixed(4)})`;
        vis(s.knobBox, t >= T.knobIn);
        const txt = `0:${String(Math.floor(smp + 1e-6)).padStart(2, '0')}`;
        if (s.knobTxt.textContent !== txt) s.knobTxt.textContent = txt;
        s.played.style.width = px(Math.max(0, kx - SCR.x0));
        s.played.style.opacity = prog(t, T.knobIn, 0.2).toFixed(3);
      }

      // ---- beam + preview ----
      {
        const bm = prog(t, T.beam, 0.4, ease.outCubic);
        s.beamG.style.opacity = bm.toFixed(3);
        s.beamG.style.transformOrigin = `${PV.cx}px ${BAND.y}px`;
        s.beamG.style.transform = `scaleY(${lerp(0.2, 1, bm).toFixed(4)})`;
        const pa = spring(t - T.pv, { stiffness: 230, damping: 19 });
        tf(s.pv, { s: lerp(0.55, 1, clamp(pa, 0, 1.1)), y: (1 - clamp(pa)) * 40, o: clamp((t - T.pv) / 0.14) });
        vis(s.pv, t >= T.pv);
        if (t >= T.pv) window.PAGE.draw(s.g, smp, s.cv.width, s.cv.height);
        // title: on screen at 0:08, cut on 「消失」, back once the out-point moves
        const ta = t < T.back ? 1 - prog(t, T.vanish, 0.07) : prog(t, T.back, 0.28, ease.outCubic);
        const jolt = t >= T.vanish && t < T.vanish + 0.07 ? 4 : 0;
        tf(s.pvTitle, { x: jolt, y: t >= T.back ? (1 - ta) * 12 : 0, o: ta });
        const gh = prog(t, T.vanish + 0.04, 0.18) * (1 - prog(t, T.back, 0.2));
        s.ghost.style.opacity = gh.toFixed(3);
        s.ghostTitle.style.opacity = gh.toFixed(3);
        // ring around the preview, on the paper: red (#C0392B at 70 %) while the title is missing, green once it holds
        const red = prog(t, T.vanish, 0.12) * (1 - prog(t, T.fix, 0.3));
        const grn = prog(t, T.ok - 0.1, 0.3);
        const ringParts = [];
        if (red > 0.002) ringParts.push(`0 0 0 5px rgba(192,57,43,${(0.7 * red).toFixed(3)})`);
        if (grn > 0.002) ringParts.push(`0 0 0 5px rgba(35,134,83,${grn.toFixed(3)})`);
        ringParts.push(PV_SHADOW);
        s.pv.style.boxShadow = ringParts.join(',');
        const ok = spring(t - T.ok, { stiffness: 320, damping: 16 });
        tf(s.pvOk, { s: lerp(0.3, 1, clamp(ok, 0, 1.25)), o: clamp((t - T.ok) / 0.1) });
      }

      // ---- the out-point flag: red at 9.5 when the title vanishes, dragged to 11; it flips green near the end ----
      {
        const out = lerp(OUT0, RANGE[1], fx);
        const fp = spring(t - T.vanish, { stiffness: 300, damping: 15 });
        const sy = clamp(fp, 0, 1.2);
        s.flagG.setAttribute('transform', `translate(${sx(out).toFixed(2)},${SCR.y}) scale(1,${Math.max(0.001, sy).toFixed(4)})`);
        vis(s.flagG, t >= T.vanish);
        const appear = clamp((t - T.vanish) / 0.08);
        // red stays red until ≈ 3/4 of the slide, then the pennant flips: the red one folds onto the pole (2 frames) and
        // the green one unfurls from it with a small overshoot. Either colour is shown pure, never a red/green blend.
        const fold = prog(t, T.flagSwap - 0.07, 0.07, ease.inCubic);
        const green = t >= T.flagSwap;
        const [fr, fg] = s.flags;
        fr.g.style.opacity = (appear * 0.7).toFixed(3);       // #C0392B at 70 %
        fg.g.style.opacity = appear.toFixed(3);
        vis(fr.g, !green);
        vis(fg.g, green);
        const ay = -FLAG.h + FLAG.ph / 2;                     // both pennants hinge on the pole (x = 0)
        fr.penG.setAttribute('transform', `translate(0,${ay}) scale(${Math.max(0.001, 1 - fold).toFixed(4)},1) translate(0,${-ay})`);
        const un = green ? spring(t - T.flagSwap, { stiffness: 420, damping: 17 }) : 0;
        fg.penG.setAttribute('transform', `translate(0,${ay}) scale(${Math.max(0.001, un).toFixed(4)},${lerp(1.15, 1, clamp(un)).toFixed(4)}) translate(0,${-ay})`);
        // the pennant flutters a little while it moves
        const wav = Math.sin(Math.PI * fx) * 6;
        const d = `M0,${-FLAG.h} Q${(FLAG.pw / 2).toFixed(1)},${(-FLAG.h - wav * 0.3).toFixed(1)} ${FLAG.pw},${(-FLAG.h + FLAG.ph / 2 + wav * 0.2).toFixed(1)} L0,${-FLAG.h + FLAG.ph} Z`;
        fr.pen.setAttribute('d', d);
        fg.pen.setAttribute('d', d);
      }
    },

    events(ctx) {
      const T = timing(ctx);
      const out = [];
      T.fill.forEach(f => out.push({ t: f, type: 'pop', gain: 0.32 }));
      out.push({ t: T.stamp, type: 'blip', gain: 0.4 });
      T.fly.forEach(f => out.push({ t: f, type: 'swish', gain: 0.28 }));
      out.push({ t: T.hop + T.hopDur, type: 'tick', gain: 0.35 });
      out.push({ t: T.vanish, type: 'glitch', gain: 0.2 });     // 「消失」: the title cuts out (soft)
      out.push({ t: T.ok, type: 'ding', gain: 0.4 });
      return out;
    },
  });
})();
