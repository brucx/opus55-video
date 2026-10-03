/*
 * s20_ship — Step 6 「检查」, then the homework card. The last page of the worksheet chapter.
 *
 * In:        wipe-up from s19. Once the turning page has uncovered the rail (RAIL_DELAY, same constant as s16–s19) its lime
 *            pill hops 5 → 6 and ripples as it lands (during 「第六步」). The page arrives pre-printed: a numbered, blank
 *            five-row form whose rule lines draw in as the page turns.
 * 第六:      「第六步 · 检查」 rises per character.
 * 检查:      a lime marker draws under 检查; the five items write themselves into the form, and on the right s19's sample
 *            rises in a player, picking up at s19's 0:11 (PAGE.draw — the code s04 printed — under the 示意 sample title).
 * 截图 / 片段 / 声音: a white focus bar steps down the list and each item ticks on its word while the player acts it out:
 *            flash + freeze, the frame shrinks into a screenshot that rests under the 示意 tag, then is pocketed out of the
 *            top edge (截图); the playhead seeks 0:08, collapses to a dot and loops the bracketed 0:08–0:11 range at 3×,
 *            wrapping once (片段, the stretch s19 fixed); back to 0:00, the speaker pops on and the waveform draws (声音).
 *            Items 4 and 5 tick in the tail of the line (no voice; readable on pause).
 * 模型:      the player shrinks into the tip card's diagram — video ┄┄ the model's eye — and the tip text takes the top
 *            (its small print arrives with the H3 so it stays up ≈ 3 s).
 *            不了: the eye is struck through. 截成: the video is snapped into four photos (shutter burst); checklist item
 *            「截图」 gets a marker. 图片: a green arrow replaces the broken line. 再看: the strike drops and the eye opens.
 * 你的第一:  the list lifts away; the tip card washes to white and grows into the homework sheet (its punched edge appears
 *            as it grows), landing at −1.5° and settling to 0°. The six steps are done: as the card grows, the rail recedes
 *            (35 %) and scrolls one slot on, revealing a lime 「6 步走完 → 开做」 tag at its right end (rail + tag centred), so
 *            the card reads as the finish line of the six steps, not a sub-item of 检查.
 *            支: the sheet fills in one gesture — the pills pop (all inside the word), the 20 s example timeline draws and
 *            each part label rises as the bar reaches it, the small line rises — so the unvoiced part of the card is
 *            complete just before the number lands (instead of trickling in until after it).
 *            15 到 30 秒: the number lands on its dashed blank (impact) and the highlighter runs under it; the lime playhead
 *            then plays the example 0:00 → 0:20, filling each part as it passes, and holds 0:20 into s21's chapter wipe while
 *            the riser peaks on the closing bar line (ctx.dur).
 * Every time comes from ctx.word() / ctx.cueEnd() / ctx.dur; render() is a pure function of t and holds the end state.
 * Determinism (pixels must not depend on seek order): Chrome reuses and resamples the raster of compositor layers when they
 * move or scale, so the result would depend on what was rendered before. This scene therefore keeps everything in the
 * scene's own layer: 2D transforms only (tf2, never translate3d), the .ch spans opt out of will-change, fixed pictures
 * (screenshot, photos, waveform) are <img>s drawn once, and the camera drifts by translation only (no scale). Both glows
 * drift every frame, so the page is repainted whole rather than patched (patched rounded corners anti-alias differently).
 * The one live <canvas> (the player) is always a layer, so page one stays on whole pixels and the page drift starts once
 * that panel is gone.
 */
(() => {
  'use strict';
  const ID = 's20_ship';
  const L1 = `${ID}.1`, L2 = `${ID}.2`, L3 = `${ID}.3`;
  const INK = '#241E1E', INK2 = '#5D5656', GREEN = '#238653', GDEEP = '#176A42', LIME = '#C9DF8D', LINE = '#DDD7DB';
  const RAIL_DELAY = 0.4;     // the wipe-up uncovers the rail (y 150–198) at ≈0.4 s; the pill hops after that (as s16–s19)
  const RAIL = { y: 150, h: 48, gap: 24 };   // K.stepRail's fixed geometry (pills 48 px tall, 24 px apart)
  const DONE_TAG = '6 步走完 → 开做';         // the rail's finish tag on page two (22 px, lime marker fill, ink text)

  // ---- copy (storyboard s20 + amendments: 静帧 → 截图, tip body 先截成图片，再让它看) ----
  const HEAD_PARTS = [{ t: '第六步 · ' }, { t: '检查', mark: true }];
  const ITEMS = [
    { text: '截图', sub: '溢出、错字、遮挡' },
    { text: '片段', sub: '转场、穿帮' },
    { text: '带声音看完整版' },
    { text: '手机上再看一遍' },
    { text: '保留工程和素材来源' },
  ];
  const TIP = { tag: '小提示', h3: '模型看不了视频', body: '先截成图片，再让它看', small: 'Opus 5.5 输入文字和图片，只输出文字',
    video: '视频', pics: '图片', model: '模型' };
  const HW_COPY = {
    title: '你的第一支', num: '15–30', unit: '秒', pills: ['一个主体', '一个目标', '一个转折'], ex: '例：20 秒',
    segs: [
      { a: 0, b: 3, range: '0–3 秒', label: '钩子：前 3 秒抓人', fill: GREEN, onFill: '#FFFFFF', labelOn: GDEEP },
      { a: 3, b: 15, range: '3–15 秒', label: '主体 · 目标', fill: 'rgba(35,134,83,.16)', onFill: INK, labelOn: INK },
      { a: 15, b: 20, range: '15–20 秒', label: '转折 · 呼应开头', fill: LIME, onFill: INK, labelOn: INK },
    ],
    small: '先找一个对标 · 保留工程',
  };

  // ---- layout (stage px) ----
  const HEAD = { x: 112, y: 222, size: 64 };
  const CHECK = { x: 112, y: 334, w: 800, size: 46, gap: 34 };   // ends ≈ y 857, level with the panel
  const PANEL = { x: 960, y: 334, w: 848, h: 539 };              // player (beat 1) → tip card (beat 2); 16:9 video + controls
  const VID1 = { x: 0, y: 0, w: 848, h: 477 };                    // panel-local video rect, beat 1
  const VID2 = { x: 40, y: 230, w: 288, h: 162 };                 // ... and as the tip's diagram thumbnail
  const BAR = { y: 477, h: 62, x0: 112, x1: 768, len: 20 };       // controls; the 0:00 knob starts clear of the speaker
  const EYE = { cx: 746, cy: VID2.y + VID2.h / 2, k: 1.25 };      // the model's eye (svg drawn at 96 × 80, shown ×1.25)
  const PH = { w: 128, h: 72, gap: 8, rot: [-2.5, 2, 1.5, -2] };  // the four snapped photos (2 × 2 contact sheet)
  const SHOT = { w: 200, x: 26, y: 68 };                          // the screenshot rests top-left, clear of the 示意 tag
  SHOT.h = SHOT.w * VID1.h / VID1.w;
  const LOOP_SPEED = 3;                                           // 片段: the 3 s range plays at 3× so it visibly wraps
  const SAMPLE_TITLE = '我做数据可视化';                           // s19's sample title (示意)
  const HW = { x: 310, y: 246, w: 1300, h: 584 };                // homework sheet; content in sheet-local px below
  const HWL = { padX: 116, titleY: 50, numY: 138, blankY: 290, pillR: 1220, pillY: 66, pillGap: 22,
    exY: 398, barX: 276, barW: 944, barH: 46, labY: 460, smallY: 516 };
  const DURATION_EX = 20;                                         // the example timeline is 20 s long

  // ---- timing: every value from the voice ----
  function timing(ctx) {
    const w = (l, x, n = 0) => ctx.word(l, x, n);
    const T = {
      six: w(L1, '第六'), check: w(L1, '检查'),
      shot: w(L1, '截图'), clip: w(L1, '片段'), sound: w(L1, '声音'), l1End: ctx.cueEnd(L1),
      model: w(L2, '模型'), cant: w(L2, '不了'), cut: w(L2, '截成'), pics: w(L2, '图片'), again: w(L2, '再'),
      l2End: ctx.cueEnd(L2),
      first: w(L3, '你的第一'), zhi: w(L3, '支'), jiu: w(L3, '就'), num: w(L3, '15'),
    };
    T.hopLand = RAIL_DELAY + 0.32;      // the rail pill lands on step 6 (spring settles) — ripple here
    T.write = T.check + 0.06;
    T.panelIn = T.check - 0.12;
    // items 4 and 5 are not voiced: they tick in the tail of line 1 (完整看一遍), before the tip
    const t4 = Math.min(T.sound + 0.7, T.model - 0.85), t5 = Math.min(T.sound + 1.0, T.model - 0.55);
    T.ticks = [T.shot, T.clip, T.sound, t4, t5];
    T.panelOut = t5 + 0.3;
    // 截图: flash, shrink into a screenshot, rest, then pocket it out of the top edge just before 片段
    T.shotIn = T.shot + 0.08;
    T.shotOut = T.clip - 0.05;
    T.morph = Math.max(T.l1End + 0.02, T.model - 0.2);   // player → tip diagram
    T.tipText = T.morph + 0.15;
    T.listOut = T.l2End;                // page two: the list lifts away …
    T.exit = T.first - 0.05;            // … the tip card washes to white …
    T.grow0 = T.exit + 0.06;            // … and grows into the homework sheet
    T.grow1 = T.grow0 + 0.5;
    T.drift0 = T.exit + 0.16;           // the page starts drifting once the player/tip panel (with its canvases) is gone
    T.titleIn = Math.max(T.first, T.grow1 - 0.3);
    T.railOut = T.exit;                 // the rail recedes and scrolls to its finish tag while the card grows
    // the sheet fills on 「支」 in one gesture (the sheet has just finished growing); only the number waits for its word
    T.pills = [0, 1, 2].map(i => T.zhi + 0.12 * i);   // all three inside the word 支 (0.41 s); pops (0.12 s) don't overlap
    T.tl = T.zhi + 0.05;                // example timeline: label, bar draws, part labels
    T.small = T.zhi + 0.25;
    T.ph = T.num + 0.25;                // playhead pops in at 0:00 once the number has landed …
    T.run0 = T.num + 0.5;               // … and plays 0 → 20 s
    T.run1 = ctx.dur - 0.3;             // lands just before the bar line so 0:20 holds into s21's wipe
    return T;
  }

  // the sample's own clock (seconds into the 20 s sample) — what the player shows at local time t
  function sampleTime(t, T) {
    const run = (from, at) => from + Math.max(0, t - at);
    if (t < T.shot) return run(11.0, T.panelIn);       // picks up where s19's playhead stopped (0:11)
    if (t < T.clip) {                                   // 截图: the frame freezes for half a second
      const f = 11.0 + (T.shot - T.panelIn);
      return t < T.shot + 0.5 ? f : f + (t - T.shot - 0.5);
    }
    if (t < T.sound) return 8 + (((t - T.clip) * LOOP_SPEED) % 3);   // 片段: loop 0:08–0:11 (the range s19 gave feedback on)
    if (t < T.cut) return run(0, T.sound);             // 声音: from the top, with sound
    return T.cut - T.sound;                             // 截成: frozen
  }
  const fmtT = v => { const s = Math.max(0, Math.floor(v + 1e-6)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  // one frame of the sample, exactly as s19 shows it: PAGE.draw, a bottom shade, the sample title
  function drawSample(g, vt, W, H) {
    window.PAGE.draw(g, vt, W, H);
    const sh = g.createLinearGradient(0, H * 0.52, 0, H);
    sh.addColorStop(0, 'rgba(18,16,17,0)');
    sh.addColorStop(1, 'rgba(18,16,17,0.62)');
    g.fillStyle = sh;
    g.fillRect(0, H * 0.52, W, H * 0.48);
    g.font = `900 ${Math.round(H * 0.17)}px NSC`;
    g.fillStyle = '#FFFFFF';
    g.textBaseline = 'alphabetic';
    g.fillText(SAMPLE_TITLE, W * 0.054, H * 0.885);
  }
  // A fixed picture (drawn once on an offscreen canvas) shown as an <img>: unlike a <canvas> element it is not a compositor
  // layer, so it paints into the page exactly like everything else. E.setImg in render() makes the first frame wait for it.
  function picture(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    return c.toDataURL('image/png');
  }
  // 2D transform + opacity. Unlike E.tf (translate3d) this never promotes the element to its own compositor layer, so a
  // scale animation is painted exactly at every frame instead of reusing a raster whose scale depends on the seek history.
  // Settled springs snap to exactly 1 so no residual scale() is left behind.
  function tf2(el, o = {}) {
    const x = o.x || 0, y = o.y || 0, r = o.r || 0;
    let sx = o.sx != null ? o.sx : o.s != null ? o.s : 1;
    let sy = o.sy != null ? o.sy : o.s != null ? o.s : 1;
    if (Math.abs(sx - 1) < 1e-4) sx = 1;
    if (Math.abs(sy - 1) < 1e-4) sy = 1;
    let tr = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
    if (Math.abs(r) > 1e-4) tr += ` rotate(${r.toFixed(3)}deg)`;
    if (sx !== 1 || sy !== 1) tr += ` scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    el.style.transform = tr;
    if (o.o != null) el.style.opacity = M.clamp(o.o).toFixed(4);
  }
  // 「示意」 tag, same two variants as s19 (20 px: the design floor for meta text)
  function shiyi(dark) {
    return E.h('div', { class: 'abs', style: dark
      ? { padding: '5px 10px 6px', borderRadius: '8px', background: 'rgba(18,16,17,.62)', border: '1px solid rgba(255,255,255,.24)', color: 'rgba(255,255,255,.88)',
        font: '600 20px/1 var(--cn)', whiteSpace: 'nowrap' }
      : { padding: '5px 10px 6px', borderRadius: '8px', border: `1.5px solid ${LINE}`, background: '#FFFFFF', color: INK2, font: '600 20px/1 var(--cn)', whiteSpace: 'nowrap' },
    text: '示意' });
  }

  // per-character kinetic text (same motion as K.title); `mark` parts carry a lime marker behind them
  function kinetic(parts, { size, weight = 900, color = INK, lh = 1.15, markH = 0.42, markB = 0.04 }) {
    const { h } = E;
    const el = h('div', { class: 'abs', style: { font: `${weight} ${size}px/${lh} var(--cn)`, color, letterSpacing: '0.01em', whiteSpace: 'nowrap' } });
    const spans = [], marks = [];
    parts.forEach(p => {
      let host = el;
      if (p.mark) {
        host = h('span', { style: { position: 'relative', display: 'inline-block', isolation: 'isolate' } });
        const mk = h('span', { style: { position: 'absolute', left: '-0.07em', right: '-0.05em', bottom: `${markB}em`, height: `${markH}em`,
          background: LIME, borderRadius: '0.07em', zIndex: '-1', transformOrigin: '0 50%', transform: 'scaleX(0)' } });
        host.append(mk);
        marks.push(mk);
        el.append(host);
      }
      for (const c of Array.from(p.t)) {
        // .ch carries will-change: transform in styles.css; here it stays in the page's own layer (see header note)
        const sp = h('span', { class: 'ch', style: { willChange: 'auto' }, text: c });
        host.append(sp);
        spans.push(sp);
      }
    });
    return { el, spans, marks, size };
  }
  function riseChars(spans, t, start, size, stagger = 0.032) {
    spans.forEach((sp, i) => {
      const p = M.prog(t, start + i * stagger, 0.7, M.ease.outQuint);
      tf2(sp, { y: (1 - p) * size * 0.55, o: p });
      const b = (1 - p) * 6;
      sp.style.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none';
    });
  }

  Scene.define({
    id: ID,

    build(root, ctx) {
      const { h, s: S } = E;
      const T = timing(ctx);
      const rnd = ctx.rng('wave');

      const bg = K.bg(root, 'paper', { glows: [
        { x: 1460, y: 560, r: 680, color: 'rgba(201,223,141,.24)', o: 1 },
        { x: 250, y: 960, r: 620, color: 'rgba(234,216,235,.55)', o: 1 },
      ] });

      // world: the page drifts slowly upwards (translation only); the rail stays fixed above it
      const world = h('div', { class: 'fill' });
      root.append(world);

      // ================= page one: checklist + player/tip =================
      const head = kinetic(HEAD_PARTS, { size: HEAD.size, weight: 800 });
      Object.assign(head.el.style, { left: `${HEAD.x}px`, top: `${HEAD.y}px` });
      world.append(head.el);

      const check = K.checklist({ items: ITEMS.map((it, i) => ({ ...it, t: T.write + i * 0.08 })), w: CHECK.w, size: CHECK.size, light: true });
      Object.assign(check.el.style, { left: `${CHECK.x}px`, top: `${CHECK.y}px`, gap: `${CHECK.gap}px`, isolation: 'isolate' });
      world.append(check.el);
      // the form: numbered boxes + blank rule lines that the voice fills in
      const blanks = check.rows.map(r => {
        const txt = r.row.lastElementChild;
        Object.assign(r.row.style, { position: 'relative', zIndex: '1' });
        const bx = Math.round(CHECK.size * 1.35) + 22;
        const line = h('div', { style: { position: 'absolute', left: `${bx}px`, top: '50%', width: '320px', height: '2px', marginTop: '-1px',
          background: '#CFC8CB', borderRadius: '1px', transformOrigin: '0 50%', transform: 'scaleX(0)' } });
        r.row.append(line);
        return { txt, line };
      });
      // focus bar: walks down the list with the voice (its width is fitted to the longest item in render's first call)
      const focus = h('div', { class: 'abs', style: { left: '-24px', top: '0px', width: '560px', height: '80px', borderRadius: '20px',
        background: '#FFFFFF', zIndex: '0', opacity: '0', transformOrigin: '0 50%',
        boxShadow: `inset 5px 0 0 ${GREEN}, 0 18px 40px rgba(36,30,30,.10), 0 0 0 1.5px rgba(35,134,83,.28)` } });
      check.el.prepend(focus);
      // item 1 「截图」 gets a lime marker when the tip says 截成图片
      const t1 = blanks[0].txt.firstElementChild;
      t1.textContent = '';
      const shotWrap = h('span', { style: { position: 'relative', display: 'inline-block', isolation: 'isolate' } });
      const shotMark = h('span', { style: { position: 'absolute', left: '-6px', right: '-6px', bottom: '0.04em', height: '0.44em', background: LIME,
        borderRadius: '4px', zIndex: '-1', transformOrigin: '0 50%', transform: 'scaleX(0)' } });
      shotWrap.append(shotMark, document.createTextNode(ITEMS[0].text));
      t1.append(shotWrap);

      // ---- panel: the player, which becomes the tip card ----
      const panel = h('div', { class: 'abs', style: { left: `${PANEL.x}px`, top: `${PANEL.y}px`, width: `${PANEL.w}px`, height: `${PANEL.h}px`,
        borderRadius: '24px', background: '#FFFFFF', overflow: 'hidden', visibility: 'hidden',
        boxShadow: '0 30px 70px rgba(36,30,30,.15), 0 0 0 1.5px rgba(36,30,30,.09)' } });
      // tip text (beat 2)
      const PX = 40;
      const tagWrap = h('div', { class: 'abs', style: { left: `${PX}px`, top: '32px' } }, K.tag(TIP.tag, { light: true }));
      const tipTag = shiyi(false);
      Object.assign(tipTag.style, { right: `${PX}px`, top: '40px' });
      const tipH3 = h('div', { class: 'abs', style: { left: `${PX}px`, top: '94px', font: '800 48px/1.2 var(--cn)', color: INK, whiteSpace: 'nowrap' }, text: TIP.h3 });
      const tipBody = h('div', { class: 'abs', style: { left: `${PX}px`, top: '158px', font: '500 32px/1.4 var(--cn)', color: INK2, whiteSpace: 'nowrap' }, text: TIP.body });
      const tipSmall = h('div', { class: 'abs', style: { left: `${PX}px`, top: '470px', font: '500 22px/1.4 var(--cn)', color: INK2, whiteSpace: 'nowrap' }, text: TIP.small });
      const LAB_Y = VID2.y + VID2.h + 16;
      const labStyle = c => ({ left: '0px', top: `${LAB_Y}px`, font: '600 22px/1.2 var(--cn)', color: c, whiteSpace: 'nowrap' });
      const labVideo = h('div', { class: 'abs', style: labStyle(INK2), text: TIP.video });
      const labPics = h('div', { class: 'abs', style: labStyle(GDEEP), text: TIP.pics });
      const labModel = h('div', { class: 'abs', style: labStyle(INK2), text: TIP.model });
      const tipEls = [tagWrap, tipTag, tipH3, tipBody, tipSmall, labVideo, labPics, labModel];
      tipEls.forEach(el => { el.style.opacity = '0'; });
      panel.append(...tipEls);

      // diagram links: broken line (video ┄✗┄ eye) and the green arrow (photos → eye)
      const linkSvg = S('svg', { width: PANEL.w, height: PANEL.h, viewBox: `0 0 ${PANEL.w} ${PANEL.h}`, style: { position: 'absolute', left: '0px', top: '0px', overflow: 'visible' } });
      const ly = EYE.cy, lx0 = VID2.x + VID2.w + 28, lx1 = EYE.cx - 80;
      const broken = S('path', { d: `M${lx0} ${ly} L${lx1} ${ly}`, stroke: '#B5ADAF', 'stroke-width': 4, 'stroke-dasharray': '9 9', 'stroke-linecap': 'round', fill: 'none', opacity: 0 });
      const xm = (lx0 + lx1) / 2;
      const crossBg = S('circle', { cx: xm, cy: ly, r: 18, fill: '#FFFFFF', opacity: 0 });
      const cross = K.drawPath(`M${xm - 10} ${ly - 10} L${xm + 10} ${ly + 10} M${xm + 10} ${ly - 10} L${xm - 10} ${ly + 10}`, { stroke: INK2, 'stroke-width': 4.5 });
      const arrowLine = K.drawPath(`M${lx0 + 10} ${ly} L${lx1 + 2} ${ly}`, { stroke: GREEN, 'stroke-width': 5 });
      const arrowHead = K.drawPath(`M${lx1 - 14} ${ly - 14} L${lx1 + 2} ${ly} L${lx1 - 14} ${ly + 14}`, { stroke: GREEN, 'stroke-width': 5 });
      linkSvg.append(broken, crossBg, cross.el, arrowLine.el, arrowHead.el);
      panel.append(linkSvg);
      // the model's eye
      const EW = 96 * EYE.k, EH = 80 * EYE.k;
      const eyeSvg = S('svg', { width: EW, height: EH, viewBox: '0 0 96 80', style: { position: 'absolute', left: `${EYE.cx - EW / 2}px`, top: `${EYE.cy - EH / 2}px`, overflow: 'visible',
        transformOrigin: `${EW / 2}px ${EH / 2}px`, opacity: 0 } });
      const eyeShape = S('path', { d: 'M6 40 Q48 2 90 40 Q48 78 6 40 Z', fill: '#FFFFFF', stroke: INK2, 'stroke-width': 4.5, 'stroke-linejoin': 'round' });
      const iris = S('circle', { cx: 48, cy: 40, r: 15, fill: '#B5ADAF' });
      const pupil = S('circle', { cx: 48, cy: 40, r: 6, fill: INK });
      const glint = S('circle', { cx: 53, cy: 35, r: 3, fill: '#FFFFFF' });
      const slashG = S('g');
      const slashBg = K.drawPath('M14 74 L82 6', { stroke: '#FFFFFF', 'stroke-width': 12 });
      const slash = K.drawPath('M14 74 L82 6', { stroke: INK, 'stroke-width': 5 });
      slashG.append(slashBg.el, slash.el);
      eyeSvg.append(eyeShape, iris, pupil, glint, slashG);
      panel.append(eyeSvg);

      // the video (beat 1: the player's picture; beat 2: the diagram's thumbnail) — s19's sample, continued
      const video = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: `${VID1.w}px`, height: `${VID1.h}px`, overflow: 'hidden',
        transformOrigin: '0 0', background: '#1B1718' } });
      const vCanvas = h('canvas', { width: VID1.w * 2, height: VID1.h * 2, style: { position: 'absolute', left: '0px', top: '0px', width: `${VID1.w}px`, height: `${VID1.h}px` } });
      const vg = vCanvas.getContext('2d');
      // 截图: the frozen frame shrinks into a screenshot that rests under the 示意 tag (flash first)
      const shot = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: `${VID1.w}px`, height: `${VID1.h}px`, transformOrigin: '0 0', visibility: 'hidden' } });
      const shotImg = h('img', { style: { position: 'absolute', left: '0px', top: '0px', width: `${VID1.w}px`, height: `${VID1.h}px` } });
      const shotUrl = picture(VID1.w * 2, VID1.h * 2, (g, w, hh) => drawSample(g, sampleTime(T.shot, T), w, hh));   // the frozen frame
      const shotRim = h('div', { class: 'fill' });
      shot.append(shotImg, shotRim);
      const flash = h('div', { class: 'fill', style: { background: '#FFFFFF', opacity: '0' } });
      const vTag = shiyi(true);
      Object.assign(vTag.style, { left: '14px', top: '14px' });
      // ▶ badge for the thumbnail state (it scales down with the video, so it is drawn ≈3× size; glyph only, no small text)
      const dur = h('div', { class: 'abs', style: { right: '26px', top: '26px', width: '96px', height: '72px', borderRadius: '16px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', background: 'rgba(18,16,17,.78)', opacity: '0' } },
        S('svg', { width: 46, height: 46, viewBox: '0 0 24 24' }, S('path', { d: 'M7 4.5 L19.5 12 L7 19.5 Z', fill: '#FFFFFF' })));
      // 片段: an in/out chip in the top-right corner (the stretch s19 fixed)
      const clipChip = h('div', { class: 'abs', style: { right: '20px', top: '20px', height: '42px', padding: '0 14px 0 10px', borderRadius: '10px', display: 'flex',
        alignItems: 'center', gap: '8px', background: 'rgba(18,16,17,.78)', border: '1px solid rgba(255,255,255,.24)', color: '#FFFFFF',
        font: '600 22px/1 var(--mono)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', transformOrigin: '100% 0%', opacity: '0' } },
        S('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: LIME, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
          S('path', { d: 'M4 12 A8 8 0 0 1 18.5 7.5' }), S('path', { d: 'M19 3.5 V8 H14.5' }),
          S('path', { d: 'M20 12 A8 8 0 0 1 5.5 16.5' }), S('path', { d: 'M5 20.5 V16 H9.5' })),
        h('span', { text: '0:08–0:11' }));
      video.append(vCanvas, shot, flash, vTag, dur, clipChip);
      panel.append(video);

      // player controls
      const ctl = h('div', { class: 'abs', style: { left: '0px', top: `${BAR.y}px`, width: `${PANEL.w}px`, height: `${BAR.h}px` } });
      const spk = S('svg', { width: 34, height: 34, viewBox: '0 0 24 24', style: { position: 'absolute', left: '24px', top: `${BAR.h / 2 - 17}px`, overflow: 'visible',
        transformOrigin: '17px 17px' } });
      spk.append(S('path', { d: 'M3 9.5 H7 L12 5 V19 L7 14.5 H3 Z', fill: INK }));
      const spkMute = S('path', { d: 'M16 9.5 L21 14.5 M21 9.5 L16 14.5', stroke: INK2, 'stroke-width': 2.2, 'stroke-linecap': 'round', fill: 'none' });
      const spkOn = S('g', { fill: 'none', stroke: GREEN, 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: 0 },
        S('path', { d: 'M15.5 9 Q17.5 12 15.5 15' }), S('path', { d: 'M18.5 6.5 Q22.5 12 18.5 17.5' }));
      spk.append(spkMute, spkOn);
      const trackW = BAR.x1 - BAR.x0, ty = BAR.h / 2;
      const track = h('div', { class: 'abs', style: { left: `${BAR.x0}px`, top: `${ty - 3}px`, width: `${trackW}px`, height: '6px', borderRadius: '3px', background: '#E6E1E3' } });
      const played = h('div', { class: 'abs', style: { left: `${BAR.x0}px`, top: `${ty - 3}px`, width: `${trackW}px`, height: '6px', borderRadius: '3px', background: GREEN, transformOrigin: '0 50%' } });
      // waveform (声音): drawn once from a seeded pattern, revealed left → right
      const wave = h('img', { style: { position: 'absolute', left: `${BAR.x0}px`, top: `${ty - 20}px`, width: `${trackW}px`, height: '40px',
        opacity: '0.5', clipPath: 'inset(0 100% 0 0)' } });
      const waveUrl = picture(trackW * 2, 80, g => {
        g.fillStyle = GREEN;
        for (let x = 4; x < trackW * 2 - 4; x += 10) {
          const env = 0.35 + 0.65 * Math.abs(Math.sin(x / 70) * Math.cos(x / 23));
          const hh = Math.max(6, (12 + rnd() * 60) * env);
          g.fillRect(x, 40 - hh / 2, 5, hh);
        }
      });
      // range (片段): 0:08–0:11, bracketed so it reads around the small looping playhead
      const rx0 = BAR.x0 + (8 / BAR.len) * trackW, rx1 = BAR.x0 + (11 / BAR.len) * trackW;
      // (the in/out brackets are plain child bars: inset box-shadows on a rounded box rasterise their corners differently
      // depending on what was drawn before, which breaks seek-order independence)
      const range = h('div', { class: 'abs', style: { left: `${rx0 - 2}px`, top: `${ty - 23}px`, width: `${rx1 - rx0 + 4}px`, height: '46px', borderRadius: '9px',
        background: 'rgba(35,134,83,.16)', border: `2px solid ${GREEN}`, opacity: '0' } },
        h('div', { class: 'abs', style: { left: '0px', top: '0px', bottom: '0px', width: '5px', borderRadius: '7px 0 0 7px', background: GREEN } }),
        h('div', { class: 'abs', style: { right: '0px', top: '0px', bottom: '0px', width: '5px', borderRadius: '0 7px 7px 0', background: GREEN } }));
      const total = h('div', { class: 'abs', style: { left: `${BAR.x1 + 18}px`, top: `${ty - 12}px`, font: '600 20px/24px var(--mono)', color: INK2, whiteSpace: 'nowrap' }, text: '0:20' });
      // the lime playhead, styled like s19's knob …
      const knob = h('div', { class: 'abs', style: { left: '0px', top: `${ty - 17}px`, height: '34px', padding: '0 13px', borderRadius: '17px', background: LIME, color: INK,
        display: 'flex', alignItems: 'center', font: '600 22px/1 var(--mono)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
        boxShadow: '0 6px 16px rgba(35,134,83,.28), 0 0 0 2.5px rgba(255,255,255,.95)' }, text: '0:11' });
      // … which collapses to a dot while it loops the range (片段)
      const dot = h('div', { class: 'abs', style: { left: '0px', top: `${ty - 11}px`, width: '22px', height: '22px', borderRadius: '50%', background: LIME,
        boxSizing: 'border-box', border: `2px solid ${GDEEP}`, boxShadow: '0 0 0 3px #FFFFFF, 0 4px 10px rgba(35,134,83,.35)', opacity: '0' } });
      ctl.append(spk, track, wave, range, played, total, knob, dot);
      panel.append(ctl);

      // the four photos snapped from the video (beat 2): a 2 × 2 contact sheet over the thumbnail
      const photos = [];
      for (let i = 0; i < 4; i++) {
        const el = h('div', { class: 'abs', style: { left: `${-PH.w / 2 - 5}px`, top: `${-PH.h / 2 - 5}px`, width: `${PH.w + 10}px`, height: `${PH.h + 10}px`, padding: '5px',
          boxSizing: 'border-box', background: '#FFFFFF', borderRadius: '5px', boxShadow: '0 8px 18px rgba(36,30,30,.22), 0 0 0 1px rgba(36,30,30,.08)', visibility: 'hidden' } });
        const img = h('img', { style: { display: 'block', width: `${PH.w}px`, height: `${PH.h}px`, borderRadius: '2px' } });
        const fl = h('div', { class: 'abs', style: { left: '5px', top: '5px', width: `${PH.w}px`, height: `${PH.h}px`, background: '#FFFFFF', borderRadius: '2px' } });
        el.append(img, fl);
        panel.append(el);
        // four frames around the moment of 截成, 0.75 s apart (the sample is frozen there)
        const ft = Math.max(0, sampleTime(T.cut, T) - 1.5 + i * 0.75);
        photos.push({ el, img, url: picture(PH.w * 3, PH.h * 3, (g, w, hh) => drawSample(g, ft, w, hh)), flash: fl });
      }
      world.append(panel);

      // ================= page two: the homework sheet =================
      const hw = h('div', { class: 'abs', style: { left: `${HW.x}px`, top: `${HW.y}px`, width: `${HW.w}px`, height: `${HW.h}px`, borderRadius: '24px',
        boxShadow: '0 30px 70px rgba(36,30,30,.15), 0 0 0 1.5px rgba(36,30,30,.09)', transformOrigin: '50% 55%', visibility: 'hidden' } });
      // white sheet with real punched holes (masked) down the left edge; 13 holes fit the height exactly
      const sheet = h('div', { class: 'fill', style: { borderRadius: '24px', background: '#FFFFFF' } });
      const pitch = (HW.h - 2 * 28) / 12;
      const holeMask = `radial-gradient(circle at 32px ${pitch / 2}px, transparent 0 9px, #000 10px) 0 ${28 - pitch / 2}px / 64px ${pitch}px repeat-y, linear-gradient(#000, #000) 64px 0 / calc(100% - 64px) 100% no-repeat`;
      sheet.style.setProperty('-webkit-mask', holeMask);
      sheet.style.setProperty('mask', holeMask);
      const tear = h('div', { class: 'abs', style: { left: '66px', top: '16px', bottom: '16px', width: '0px', borderLeft: `2px dashed ${LINE}` } });
      hw.append(sheet, tear);

      const hwTitle = kinetic([{ t: HW_COPY.title }], { size: 64, weight: 800 });
      Object.assign(hwTitle.el.style, { left: `${HWL.padX}px`, top: `${HWL.titleY}px` });
      hw.append(hwTitle.el);

      // number on its blank line, with a highlighter stroke once it lands
      const numRow = h('div', { class: 'abs', style: { left: `${HWL.padX}px`, top: `${HWL.numY}px`, display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap' } });
      const numEl = h('span', { style: { display: 'inline-block', font: '700 160px/1 var(--display)', color: GDEEP, fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.02em', transformOrigin: '0% 85%' }, text: HW_COPY.num });
      const unitEl = h('span', { style: { display: 'inline-block', marginLeft: '20px', font: '800 64px/1 var(--cn)', color: GDEEP, transformOrigin: '0% 90%' }, text: HW_COPY.unit });
      numRow.append(numEl, unitEl);
      const blank = h('div', { class: 'abs', style: { left: `${HWL.padX}px`, top: `${HWL.blankY}px`, width: '560px', height: '4px', borderRadius: '2px',
        background: 'repeating-linear-gradient(90deg, #CFC8CB 0 16px, transparent 16px 28px)' } });
      const numMark = h('div', { class: 'abs', style: { left: `${HWL.padX - 10}px`, top: `${HWL.blankY - 36}px`, width: '580px', height: '40px', borderRadius: '8px',
        background: LIME, transformOrigin: '0 50%', transform: 'scaleX(0)' } });
      hw.append(blank, numMark, numRow);

      // three pills, right-aligned with the timeline's end; dashed blanks hold their places until they pop
      const pillSlots = HW_COPY.pills.map((p, i) => {
        const el = h('div', { class: 'abs', style: { right: `${HW.w - HWL.pillR}px`, top: `${HWL.pillY + i * (64 + HWL.pillGap)}px`, width: '230px', height: '64px',
          borderRadius: '32px', border: '2px dashed #D3CCCF', boxSizing: 'border-box', opacity: '0' } });
        hw.append(el);
        return el;
      });
      const pills = HW_COPY.pills.map((p, i) => {
        const el = h('div', { class: 'abs', style: { right: `${HW.w - HWL.pillR}px`, top: `${HWL.pillY + i * (64 + HWL.pillGap)}px`, height: '64px', padding: '0 30px 0 20px',
          display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '32px', background: LIME, color: INK, font: '700 32px/1 var(--cn)', whiteSpace: 'nowrap',
          boxShadow: '0 10px 22px rgba(35,134,83,.14)', visibility: 'hidden', transformOrigin: '100% 50%' } },
        h('span', { class: 'center', style: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,.72)', font: '700 22px/1 var(--display)',
          color: GDEEP, fontVariantNumeric: 'tabular-nums' }, text: String(i + 1) }),
        h('span', { text: p }));
        hw.append(el);
        return el;
      });

      // example timeline
      const exLabel = h('div', { class: 'abs', style: { left: `${HWL.padX}px`, top: `${HWL.exY + HWL.barH / 2 - 14}px`, font: '600 22px/28px var(--mono)', color: INK2, whiteSpace: 'nowrap' }, text: HW_COPY.ex });
      const bar = h('div', { class: 'abs', style: { left: `${HWL.barX}px`, top: `${HWL.exY}px`, width: `${HWL.barW}px`, height: `${HWL.barH}px` } });
      const GAP = 6;
      const segs = HW_COPY.segs.map((sg, i) => {
        const x0 = (sg.a / DURATION_EX) * HWL.barW + (i > 0 ? GAP / 2 : 0);
        const x1 = (sg.b / DURATION_EX) * HWL.barW - (i < HW_COPY.segs.length - 1 ? GAP / 2 : 0);
        const box = h('div', { class: 'abs', style: { left: `${x0}px`, top: '0px', width: `${x1 - x0}px`, height: `${HWL.barH}px`, borderRadius: '11px',
          background: '#FFFFFF', boxShadow: `inset 0 0 0 1.5px ${LINE}`, overflow: 'hidden' } });
        const fill = h('div', { class: 'fill', style: { background: sg.fill, clipPath: 'inset(0 100% 0 0)' } });
        const rangeTxt = h('div', { class: 'fill center', style: { font: '600 20px/1 var(--mono)', color: INK2, whiteSpace: 'nowrap' }, text: sg.range });
        box.append(fill, rangeTxt);
        bar.append(box);
        const lab = h('div', { class: 'abs', style: { left: `${HWL.barX + (i === 0 ? x0 : (x0 + x1) / 2)}px`, top: `${HWL.labY}px`, font: '700 26px/1.2 var(--cn)', color: INK2, whiteSpace: 'nowrap' }, text: sg.label });
        hw.append(lab);
        return { sg, box, fill, range: rangeTxt, lab, x0, x1 };
      });
      hw.append(exLabel, bar);
      // playhead: the lime pill from s19's scrubber, with a stem through the bar
      const phWrap = h('div', { class: 'abs', style: { left: `${HWL.barX}px`, top: `${HWL.exY - 52}px`, width: '0px', height: '0px', visibility: 'hidden' } });
      const stem = h('div', { class: 'abs', style: { left: '-1.5px', top: '38px', width: '3px', height: `${HWL.barH + 22}px`, borderRadius: '2px', background: INK } });
      const phPill = h('div', { class: 'abs', style: { left: '0px', top: '0px', height: '38px', padding: '0 14px', borderRadius: '19px', background: LIME, color: INK,
        display: 'flex', alignItems: 'center', font: '600 22px/1 var(--mono)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', transform: 'translateX(-50%)',
        boxShadow: '0 8px 20px rgba(35,134,83,.22), 0 0 0 2px #FFFFFF' }, text: '0:00' });
      const phPillWrap = h('div', { class: 'abs', style: { left: '0px', top: '0px', transformOrigin: '0px 19px' } }, phPill);
      phWrap.append(stem, phPillWrap);
      hw.append(phWrap);
      const small = h('div', { class: 'abs', style: { left: `${HWL.padX}px`, top: `${HWL.smallY}px`, font: '500 24px/1.3 var(--cn)', color: INK2, whiteSpace: 'nowrap' }, text: HW_COPY.small });
      hw.append(small);
      world.append(hw);

      // ---- the rail: fixed above the page ----
      const rail = K.stepRail();
      root.append(rail.el);
      const railPills = Array.from(rail.el.children);
      // page two: the rail's finish tag (a sibling of the rail, so it stays at full strength while the rail recedes)
      const doneTag = h('div', { class: 'abs', style: { left: '0px', top: `${RAIL.y + (RAIL.h - 40) / 2}px`, height: '40px', padding: '0 18px',
        boxSizing: 'border-box', borderRadius: '20px', display: 'flex', alignItems: 'center', background: LIME, color: INK,
        font: '700 22px/1 var(--cn)', whiteSpace: 'nowrap', boxShadow: '0 8px 22px rgba(35,134,83,.18)', zIndex: '50', opacity: '0' }, text: DONE_TAG });
      root.append(doneTag);

      return { T, bg, world, head, check, blanks, focus, shotMark, panel, tagWrap, tipTag, tipH3, tipBody, tipSmall, labVideo, labPics, labModel,
        broken, crossBg, cross, arrowLine, arrowHead, eyeSvg, eyeShape, iris, pupil, glint, slashG, slash, slashBg,
        video, vg, shot, shotImg, shotUrl, shotRim, flash, vTag, dur, clipChip, ctl, spk, spkMute, spkOn, wave, waveUrl, range, played, knob, dot, photos,
        hw, hwTitle, blank, numMark, numEl, unitEl, pills, pillSlots, exLabel, bar, segs, phWrap, phPill, phPillWrap, small, rail, railPills, doneTag,
        geo: null, lastVt: null };
    },

    render(s, t, ctx) {
      const { clamp, lerp, prog, ease, spring, mixColor } = M;
      const T = s.T;

      // ---- rail: the lime pill hops 5 → 6 once the turning page has uncovered it, and ripples as it lands ----
      s.rail.render(Math.max(0, t - RAIL_DELAY), 5, 4);
      if (t >= T.hopLand - 0.1) {            // step 6 is the active (lime) pill from ≈ RAIL_DELAY + 0.1 on
        const parts = ['0 8px 22px rgba(35,134,83,.18)'];
        const q = clamp((t - T.hopLand) / 0.6);
        if (t >= T.hopLand && q < 1) parts.push(`0 0 0 ${(2 + 14 * ease.outCubic(q)).toFixed(2)}px rgba(35,134,83,${(0.3 * (1 - q)).toFixed(3)})`);
        s.railPills[5].style.boxShadow = parts.join(',');
      }
      if (!s.geo) {
        const rowsGeo = s.check.rows.map(r => ({ y: r.row.offsetTop, h: r.row.offsetHeight }));
        const textR = Math.max(...s.blanks.map(b => b.txt.offsetLeft + b.txt.offsetWidth));
        s.focus.style.width = `${Math.round(textR + 24 + 48)}px`;      // the longest item + padding, not the column width
        s.geo = { rows: rowsGeo, labW: s.segs.map(g => g.lab.offsetWidth),
          lw: [s.labVideo.offsetWidth, s.labPics.offsetWidth, s.labModel.offsetWidth], knobW: s.knob.offsetWidth,
          railShift: Math.round((RAIL.gap + s.doneTag.offsetWidth) / 2) };   // rail + finish tag end up centred (whole px)
        s.pillSlots.forEach((el, i) => { el.style.width = `${s.pills[i].offsetWidth}px`; });   // blanks match the pills exactly
      }
      // ---- page two: the six steps are done. The rail recedes to 35 % and scrolls one slot on (left by half the tag + gap,
      // so rail + tag stay centred), revealing the lime finish tag at its right end; the tag keeps full strength. ----
      {
        const r = prog(t, T.railOut, 0.5, ease.inOutCubic);
        const shift = s.geo.railShift * r;
        tf2(s.rail.el, { x: -shift, o: 1 - 0.65 * r });
        const p6 = s.railPills[5];
        const railR = parseFloat(p6.style.left) + parseFloat(p6.style.width);   // the rail's right end, as K.stepRail laid it out
        // the tag fades in only once its right edge has scrolled inside x 1808 (≈ 0.26 s), and is full before 支
        const ta = prog(t, T.railOut + 0.26, 0.28, ease.outCubic);
        tf2(s.doneTag, { x: railR + RAIL.gap - shift, o: ta });
      }

      // ---- camera: the light drifts all the time; the page itself drifts up 14 px on page two only (translation only).
      // Page one keeps whole-pixel positions because the player's live canvas is a compositor layer: moved by fractions it
      // would be resampled differently depending on the seek history. Page one has its own motion (the sample plays). ----
      tf2(s.world, { y: -14 * ease.inOutSine(clamp((t - T.drift0) / (ctx.dur + 0.6 - T.drift0))) });
      {
        const g = prog(t, T.exit, 1.6, ease.inOutSine);
        tf2(s.bg.glowEls[0], { x: lerp(0, -380, g) + 16 * Math.sin(t * 0.35), y: lerp(0, -20, g) });
        tf2(s.bg.glowEls[1], { x: 22 * Math.sin(t * 0.3 + 1.2), y: -60 - 14 * Math.sin(t * 0.22) });   // (both glows move every frame: the page is repainted whole, never patched)
      }

      // ================= page one =================
      const outQ = (d = 0) => prog(t, T.listOut + d, 0.32, ease.inCubic);
      riseChars(s.head.spans, t, T.six - 0.04, HEAD.size, 0.034);
      s.head.marks[0].style.transform = `scaleX(${prog(t, T.check + 0.02, 0.34, ease.outCubic).toFixed(4)})`;
      { const q = outQ(0); tf2(s.head.el, { y: -q * 46, o: 1 - q }); }

      // checklist: pre-printed form → items write in on 检查 → ticks on their words
      const tickAt = {};
      T.ticks.forEach((tt, i) => { tickAt[i] = tt; });
      s.check.render(t, { tickAt });
      s.check.rows.forEach((r, i) => {
        const lb = 0.16 + (4 - i) * 0.06;        // rule lines draw bottom-up with the page turn
        s.blanks[i].line.style.transform = `scaleX(${prog(t, lb, 0.45, ease.outCubic).toFixed(4)})`;
        const tw = T.write + i * 0.08;
        s.blanks[i].line.style.opacity = (1 - prog(t, tw - 0.06, 0.16)).toFixed(3);   // the rule clears just before its words land
        const a = prog(t, tw, 0.5, ease.outQuint);
        tf2(s.blanks[i].txt, { x: (1 - a) * 34, o: a });
        const d = t - T.ticks[i];
        const bump = d > 0 && d < 0.22 ? 0.16 * Math.sin(Math.PI * d / 0.22) * Math.exp(-d * 3) : 0;
        tf2(r.box, { s: 1 + bump });
        const q = outQ(0.02 + i * 0.025);
        tf2(r.row, { y: -q * 46, o: 1 - q });
      });
      {
        const R = s.geo.rows, PAD = 16;
        let fy = R[0].y, fh = R[0].h;
        for (let i = 1; i < R.length; i++) {
          const m = prog(t, T.ticks[i] - 0.27, 0.25, ease.inOutCubic);
          fy = lerp(fy, R[i].y, m);
          fh = lerp(fh, R[i].h, m);
        }
        const a = prog(t, T.ticks[0] - 0.3, 0.26, ease.outCubic);
        const o = a * (1 - prog(t, T.panelOut, 0.35, ease.inCubic));
        s.focus.style.top = `${(fy - PAD).toFixed(2)}px`;
        s.focus.style.height = `${(fh + 2 * PAD).toFixed(2)}px`;
        tf2(s.focus, { sx: lerp(0.97, 1, a), o });
      }
      s.shotMark.style.transform = `scaleX(${prog(t, T.cut + 0.02, 0.32, ease.outCubic).toFixed(4)})`;

      // ---- panel: rises on 检查; at page two the sheet covers it and takes over ----
      {
        const a = prog(t, T.panelIn, 0.6, ease.outCubic);
        tf2(s.panel, { y: Math.round((1 - a) * 50), o: a });   // whole pixels (canvas layers, see camera note)
        const v = t >= T.panelIn && t < T.exit + 0.16 ? 'visible' : 'hidden';   // the sheet takes over
        if (s.panel.style.visibility !== v) s.panel.style.visibility = v;
      }
      // the sample at the player's clock (redrawn only when its time changes)
      const vt = sampleTime(t, T);
      if (s.lastVt !== vt) { drawSample(s.vg, vt, s.vg.canvas.width, s.vg.canvas.height); s.lastVt = vt; }
      // beat 1: 截图 (flash, freeze, screenshot) · 片段 (range loop + chip) · 声音 (speaker on, waveform)
      s.flash.style.opacity = (t >= T.shot ? 0.9 * (1 - prog(t, T.shot, 0.38, ease.outCubic)) : 0).toFixed(3);
      {
        // the frozen frame shrinks into a screenshot (top-left, under 示意), rests, then is pocketed out of the top edge
        E.setImg(s.shotImg, s.shotUrl);
        const sm = prog(t, T.shotIn, 0.4, ease.outCubic);
        const k = lerp(1, SHOT.w / VID1.w, sm);
        const pk = prog(t, T.shotOut, 0.3, ease.inCubic);
        const vis = t >= T.shot && pk < 1 && t < T.exit + 0.16;
        s.shot.style.visibility = vis ? 'visible' : 'hidden';
        const sx = lerp(0, SHOT.x, sm) + 26 * pk;
        const sy = lerp(0, SHOT.y, sm) - (SHOT.y + SHOT.h + 40) * pk;
        s.shot.style.transform = `translate(${sx.toFixed(2)}px,${sy.toFixed(2)}px) rotate(${(-3 * sm + 5 * pk).toFixed(3)}deg) scale(${k.toFixed(5)})`;
        s.shotRim.style.boxShadow = `inset 0 0 0 ${(5 / k * sm).toFixed(2)}px #FFFFFF`;
        s.shot.style.boxShadow = `0 ${(10 / k * sm).toFixed(1)}px ${(26 / k * sm).toFixed(1)}px rgba(0,0,0,${(0.45 * sm).toFixed(3)})`;
        s.shot.style.borderRadius = `${(6 / k * sm).toFixed(2)}px`;

        // 片段: the bracketed range opens from its centre; the playhead seeks 0:08 and collapses into a dot that loops it
        const rIn = prog(t, T.clip - 0.05, 0.3, ease.outCubic);
        const half = (1 - rIn) * 50;
        s.range.style.clipPath = half > 0.005 ? `inset(0 ${half.toFixed(2)}% 0 ${half.toFixed(2)}%)` : 'none';
        s.range.style.opacity = (clamp(rIn * 1.5) * (1 - prog(t, T.sound - 0.02, 0.25, ease.inCubic))).toFixed(3);
        const cp = spring(t - T.clip, { stiffness: 300, damping: 18 });
        const co = clamp((t - T.clip) / 0.12) * (1 - prog(t, T.sound - 0.05, 0.22, ease.inCubic));
        tf2(s.clipChip, { s: lerp(0.7, 1, clamp(cp, 0, 1.15)), o: co });

        // 声音: back to 0:00, the speaker pops on and the waveform draws
        const son = prog(t, T.sound, 0.25, ease.outCubic);
        s.spkMute.style.opacity = (1 - son).toFixed(3);
        s.spkOn.style.opacity = son.toFixed(3);
        const ds = t - T.sound;
        tf2(s.spk, { s: ds > 0 && ds < 0.3 ? 1 + 0.25 * Math.sin(Math.PI * ds / 0.3) : 1 });
        E.setImg(s.wave, s.waveUrl);
        s.wave.style.clipPath = `inset(0 ${((1 - prog(t, T.sound, 0.6, ease.inOutCubic)) * 100).toFixed(2)}% 0 0)`;

        const trackW = BAR.x1 - BAR.x0;
        const kp = clamp(vt / BAR.len);
        const kx = BAR.x0 + kp * trackW;
        s.played.style.transform = `scaleX(${kp.toFixed(4)})`;
        const kt = fmtT(vt);
        if (s.knob.textContent !== kt) s.knob.textContent = kt;
        const dk = prog(t, T.clip + 0.02, 0.18, ease.inOutCubic) * (1 - prog(t, T.sound + 0.02, 0.18, ease.inOutCubic));
        tf2(s.knob, { x: kx - s.geo.knobW / 2, s: lerp(1, 0.3, dk), o: 1 - dk });
        tf2(s.dot, { x: kx - 11, s: lerp(0.4, 1, dk), o: dk });
      }
      // 模型: the player shrinks into the tip's diagram; its controls drop away
      {
        const m = prog(t, T.morph, 0.5, ease.inOutCubic);
        const k = lerp(1, VID2.w / VID1.w, m);
        s.video.style.transform = `translate(${lerp(VID1.x, VID2.x, m).toFixed(2)}px,${lerp(VID1.y, VID2.y, m).toFixed(2)}px) scale(${k.toFixed(5)})`;
        s.video.style.borderRadius = `${((12 / k) * m).toFixed(2)}px`;
        s.video.style.opacity = (1 - prog(t, T.cut + 0.1, 0.25, ease.inCubic)).toFixed(3);   // snapped into photos on 截成
        s.vTag.style.opacity = (1 - prog(t, T.morph, 0.2)).toFixed(3);
        s.dur.style.opacity = (prog(t, T.morph + 0.3, 0.3) * (1 - prog(t, T.cut - 0.1, 0.15))).toFixed(3);
        const cq = prog(t, T.morph - 0.1, 0.2, ease.inCubic);
        tf2(s.ctl, { y: cq * 16, o: 1 - cq });
      }
      // tip text (the small print rises with the H3 so it stays up ≈ 3 s)
      {
        const up = (el, t0, dist = 18) => { const p = prog(t, t0, 0.5, ease.outCubic); tf2(el, { y: (1 - p) * dist, o: p }); };
        up(s.tagWrap, T.tipText - 0.05);
        up(s.tipTag, T.tipText + 0.05, 10);
        up(s.tipH3, T.tipText);
        up(s.tipBody, T.tipText + 0.1);
        up(s.tipSmall, T.tipText, 10);
        // diagram labels: 视频 → 图片 on 截成
        const lv = prog(t, T.tipText + 0.2, 0.4) * (1 - prog(t, T.cut, 0.2));
        const lp = prog(t, T.cut + 0.15, 0.3);
        const cxv = VID2.x + VID2.w / 2;
        tf2(s.labVideo, { x: cxv - s.geo.lw[0] / 2, o: lv });
        tf2(s.labPics, { x: cxv - s.geo.lw[1] / 2, y: (1 - lp) * 8, o: lp });
        tf2(s.labModel, { x: EYE.cx - s.geo.lw[2] / 2, o: prog(t, T.tipText + 0.25, 0.4) });
      }
      // the eye: arrives with the tip, struck through on 不了, opens on 再看
      {
        const ea = prog(t, T.tipText + 0.15, 0.4, ease.outBack);
        tf2(s.eyeSvg, { s: lerp(0.6, 1, ea), o: clamp(ea * 1.4) });
        const strike = prog(t, T.cant, 0.28, ease.inOutCubic);
        s.slash.render(strike);
        s.slashBg.render(strike);
        s.slashG.style.opacity = (1 - prog(t, T.again - 0.02, 0.14)).toFixed(3);
        const op = prog(t, T.again, 0.26, ease.outCubic);
        s.eyeShape.setAttribute('stroke', mixColor(INK2, GDEEP, op));
        s.iris.setAttribute('fill', mixColor('#B5ADAF', GREEN, op));
        s.iris.setAttribute('r', (13 + 3 * spring(t - T.again, { stiffness: 260, damping: 14 })).toFixed(2));
        const look = -6 * op;
        s.iris.setAttribute('cx', (48 + look).toFixed(2));
        s.pupil.setAttribute('cx', (48 + look * 1.3).toFixed(2));
        s.glint.setAttribute('cx', (53 + look * 1.3).toFixed(2));
      }
      // links: broken line (✗ on 不了) → green arrow on 图片
      {
        const bl = prog(t, T.tipText + 0.2, 0.4) * (1 - prog(t, T.pics - 0.05, 0.2));
        s.broken.style.opacity = bl.toFixed(3);
        const cp = prog(t, T.cant + 0.12, 0.25, ease.outCubic);
        const cx = cp * (1 - prog(t, T.pics - 0.05, 0.2));
        s.cross.render(cp);
        s.cross.el.style.opacity = cx.toFixed(3);
        s.crossBg.style.opacity = cx.toFixed(3);
        s.arrowLine.render(prog(t, T.pics, 0.3, ease.inOutCubic));
        s.arrowHead.render(prog(t, T.pics + 0.2, 0.18, ease.outCubic));
      }
      // 截成: the video is snapped into four photos, laid out as a 2 × 2 contact sheet
      {
        const cxv = VID2.x + VID2.w / 2, cyv = VID2.y + VID2.h / 2;
        s.photos.forEach((ph, i) => {
          const t0 = T.cut + i * 0.07;
          E.setImg(ph.img, ph.url);
          const v = t >= t0 && t < T.exit + 0.16 ? 'visible' : 'hidden';   // (an explicit 'visible' would override the hidden panel)
          if (ph.el.style.visibility !== v) ph.el.style.visibility = v;
          const p = spring(t - t0, { stiffness: 280, damping: 18 });
          const gx = cxv + ((i % 2) - 0.5) * (PH.w + 10 + PH.gap);
          const gy = cyv + (Math.floor(i / 2) - 0.5) * (PH.h + 10 + PH.gap);
          tf2(ph.el, { x: lerp(cxv, gx, p), y: lerp(cyv, gy, p), r: PH.rot[i] * p, s: lerp(0.7, 1, clamp(p, 0, 1.15)), o: clamp((t - t0) / 0.06) });
          ph.flash.style.opacity = (0.95 * (1 - prog(t, t0, 0.3, ease.outCubic))).toFixed(3);
        });
      }

      // ================= page two: the homework sheet =================
      {
        // the tip card washes to white, then slides left and grows into the sheet (punched edge appears as it grows);
        // it lands at −1.5° and settles to 0°, then drifts a few px left (translation only)
        const v = t >= T.exit ? 'visible' : 'hidden';
        if (s.hw.style.visibility !== v) s.hw.style.visibility = v;
        const m = prog(t, T.grow0, T.grow1 - T.grow0, ease.inOutCubic);
        s.hw.style.left = `${lerp(PANEL.x, HW.x, m).toFixed(2)}px`;
        s.hw.style.top = `${lerp(PANEL.y, HW.y, m).toFixed(2)}px`;
        s.hw.style.width = `${lerp(PANEL.w, HW.w, m).toFixed(2)}px`;
        s.hw.style.height = `${lerp(PANEL.h, HW.h, m).toFixed(2)}px`;
        const settle = prog(t, T.grow1 - 0.05, 1.6, ease.inOutSine);
        const rot = -1.5 * ease.outSine(m) * (1 - settle);
        const dx = -10 * ease.inOutSine(clamp((t - T.grow1) / (ctx.dur + 0.6 - T.grow1)));
        tf2(s.hw, { x: dx, r: rot, o: prog(t, T.exit, 0.14) });

        riseChars(s.hwTitle.spans, t, T.titleIn, 64, 0.04);

        // the pills pop on 支 (dashed blanks wait for them as the sheet lands)
        s.pillSlots.forEach((el, i) => {
          el.style.opacity = (prog(t, T.grow1 - 0.3 + i * 0.04, 0.2) * (1 - prog(t, T.pills[i] + 0.05, 0.12))).toFixed(3);
        });
        s.pills.forEach((el, i) => {
          const v2 = t >= T.pills[i] ? 'visible' : 'hidden';
          if (el.style.visibility !== v2) el.style.visibility = v2;
          const sp = spring(t - T.pills[i], { stiffness: 300, damping: 18 });
          tf2(el, { s: lerp(0.55, 1, sp), o: clamp((t - T.pills[i]) / 0.18) });
        });

        // example timeline, on 支 (the part labels rise as the bar's drawn edge reaches them)
        const tl = T.tl;
        const lp = prog(t, tl, 0.3, ease.outCubic);
        tf2(s.exLabel, { x: (1 - lp) * -12, o: lp });
        const D0 = tl + 0.05, DD = 0.55;
        const draw = prog(t, D0, DD, ease.inOutCubic);
        s.bar.style.clipPath = `inset(-4px ${((1 - draw) * 100).toFixed(2)}% -4px -4px)`;
        const pr = clamp((t - T.run0) / (T.run1 - T.run0));
        const px = pr * HWL.barW;
        // inverse of ease.inOutCubic: when the drawn edge reaches a given fraction of the bar
        const reach = f => D0 + DD * (f < 0.5 ? Math.cbrt(f / 4) : 1 - Math.cbrt(2 * (1 - f)) / 2);
        s.segs.forEach((g, i) => {
          const la = prog(t, reach((g.x0 + g.x1) / 2 / HWL.barW) - 0.04, 0.36, ease.outCubic);   // rises as its part is drawn
          tf2(g.lab, { x: i === 0 ? 0 : -s.geo.labW[i] / 2, y: (1 - la) * 12, o: la });
          const f = clamp((px - g.x0) / Math.max(1, g.x1 - g.x0));
          g.fill.style.clipPath = `inset(0 ${((1 - f) * 100).toFixed(2)}% 0 0)`;
          g.range.style.color = mixColor(INK2, g.sg.onFill, clamp(f * 2.2));
          g.lab.style.color = mixColor(INK2, g.sg.labelOn, clamp((px - g.x0) / 14));
        });
        const sm = prog(t, T.small, 0.45, ease.outCubic);
        tf2(s.small, { y: (1 - sm) * 12, o: sm });

        // 15 到 30 秒: the number lands on its blank line
        const n0 = T.num - 0.05;
        const nl = spring(t - n0, { stiffness: 340, damping: 18 });
        tf2(s.numEl, { s: lerp(1.18, 1, nl), y: (1 - nl) * 10, o: clamp((t - n0) / 0.08) });
        const ul = spring(t - (n0 + 0.1), { stiffness: 340, damping: 18 });
        tf2(s.unitEl, { s: lerp(1.3, 1, ul), o: clamp((t - n0 - 0.1) / 0.08) });
        s.numMark.style.transform = `scaleX(${prog(t, T.num + 0.08, 0.42, ease.outCubic).toFixed(4)})`;
        s.blank.style.opacity = (prog(t, T.titleIn + 0.25, 0.45) * (1 - prog(t, T.num, 0.25))).toFixed(3);

        // playhead: pops in at 0:00 once the number has landed, then plays the example
        const pv = t >= T.ph ? 'visible' : 'hidden';
        if (s.phWrap.style.visibility !== pv) s.phWrap.style.visibility = pv;
        const pp = spring(t - T.ph, { stiffness: 300, damping: 18 });
        const arrive = t - T.run1;
        const bump = arrive > 0 && arrive < 0.25 ? 0.14 * Math.sin(Math.PI * arrive / 0.25) * Math.exp(-arrive * 4) : 0;
        tf2(s.phWrap, { x: px, o: clamp((t - T.ph) / 0.12) });
        tf2(s.phPillWrap, { s: lerp(0.5, 1, clamp(pp, 0, 1.15)) * (1 + bump) });
        const txt = fmtT(Math.min(DURATION_EX, pr * DURATION_EX));
        if (s.phPill.textContent !== txt) s.phPill.textContent = txt;
      }
    },

    events(ctx) {
      const T = timing(ctx);
      const out = [];
      T.ticks.forEach((tt, i) => out.push({ t: tt, type: 'tick', gain: i < 3 ? 0.38 : 0.26 }));
      out.push({ t: T.shot, type: 'shutter', gain: 0.24 });
      out.push({ t: T.morph, type: 'swish', gain: 0.22 });
      for (let i = 0; i < 4; i++) out.push({ t: T.cut + i * 0.07, type: 'shutter', gain: 0.26 });
      out.push({ t: T.again + 0.02, type: 'blip', gain: 0.22 });
      out.push({ t: T.exit, type: 'swish', gain: 0.3 });
      T.pills.forEach(tp => out.push({ t: tp, type: 'pop', gain: 0.3 }));
      out.push({ t: T.num - 0.03, type: 'impact', gain: 0.3 });
      out.push({ t: ctx.dur - 1.6, type: 'riser', gain: 0.42 });
      return out;
    },
  });
})();
