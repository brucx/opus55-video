/*
 * s01_cold — cold open (8.0 s, chrome off, subtitles on).
 * Code-rendered footage, hard-cut on the beat from frame 0, under a timeline HUD: a beat ruler (0–8 s, 186 px/s),
 * the lime playhead pill whose readout is the real film time, and a frame counter. Every cut strikes the ruler: the tick
 * at the playhead shoots up lime and the pill pulses (「每」 is the biggest strike). lists-006's own command palette types
 * "frame" and lands its toast "Every frame is code" on 「每」; on 「代码」 a lime bar draws under the toast text: the
 * film's own accent arrives.
 * Everything is a pure function of t (any order, any t; t past the end holds the last state).
 *
 * window.S01_COLD_HUD is an optional continuity kit for s02_title, which opens on this scene's last frame:
 *   const k = window.S01_COLD_HUD;
 *   const hud = k.buildHud(root, { page: 1 });   // same scrim, tag, ruler (paged to 8–16 s), pill, counter
 *   hud.render(ctx.start + t, { flash });        // playhead + frame counter at the real film time (options: buildHud)
 *   root.append(k.creditRow({ author: '@twoclipping' }));
 *   held frame: co-006-cmdk last frame scaled k.TOAST.holdScale[1] about k.TOAST.origin; lime bar = k.TOAST.underline
 */
(() => {
  'use strict';

  // 2D transform + opacity. Unlike E.tf (translate3d) this does not promote the element to its own compositor layer,
  // so it paints into the scene layer as a pure function of the DOM: the same pixels whatever frame was rendered before
  // (a composited layer keeps a sticky raster scale across frames, which made scaled footage history-dependent).
  function tf2(el, { x = 0, y = 0, s = 1, o = null } = {}) {
    let tr = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
    if (s !== 1) tr += ` scale(${s.toFixed(5)})`;
    el.style.transform = tr;
    if (o != null) el.style.opacity = M.clamp(o).toFixed(4);
  }

  // laid-out width of an element (the scene root is display:none during build, so measure off-stage)
  function measure(el) {
    const host = E.h('div', { style: { position: 'absolute', left: '-6000px', top: '0px', visibility: 'hidden' } });
    host.append(el);
    document.body.append(host);
    const w = el.getBoundingClientRect().width;
    host.remove();
    return Math.ceil(w);
  }

  // ---------------------------------------------------------------- HUD (ruler, playhead, frame counter)
  const X0 = 112;                 // ruler x at 0 s
  const PXS = 186;                // px per second (0.5 s beat = 93 px)
  const RULER_Y = 160;            // ruler hairline
  const RULER_SEC = 8;            // ruler covers 0–8 s (x 112 → 1600)
  const PILL_W = 156, PILL_H = 40; // `t = 0.00 s` is 132 px in 22 px mono, so the pill gets 12 px side padding
  const PILL_TOP = RULER_Y + 10;  // the pill hangs from the ruler on a short stem: the tick at the playhead stays visible
  const LIME = '#C9DF8D', SNOW = '#F4F1F2';
  // dark only where HUD text sits (tag 112–136, labels and counter 135–185, pill 170–210), then a fast fall-off, so the
  // footage below y ≈ 230 keeps its own brightness
  const SCRIM_H = 270;
  const SCRIM = 'linear-gradient(180deg, rgba(18,16,17,.78) 0px, rgba(18,16,17,.72) 120px, rgba(18,16,17,.64) 190px, ' +
    'rgba(18,16,17,.3) 230px, rgba(18,16,17,0) 265px)';
  // A strike: the tick under the playhead shoots up to `len` (4 px, full lime, in a soft 28 px-wide halo with a short
  // flare along the hairline) and drops back over `dur`. Ticks under the tag stop TAG_AIR px below its glyphs.
  const STRIKE = { len: 28, w: 4, halo: 14, haloA: 0.6, flare: 38, flareA: 0.55, dur: 0.2 };
  let hudSeq = 0;                 // unique gradient ids per HUD instance (s02 builds its own)
  const TAG_TOP = 112, TAG_H = 24, TAG_AIR = 6;
  // the pill's reaction to a strike at the playhead: scale 1 + amp → 1 (outBack, slight undershoot) over `dur`, snow
  // fill for its first two frames
  const PULSE = { dur: 0.18, amp: 0.10, flash: 2 / 30 };

  /*
   * buildHud(root, { page = 0 }) -> { el, scrim, tag, svg, labels, stem, pill, counter, render(T, opts) }
   *   page   ruler page: page 0 shows 0–8 s; page 1 shows 8–16 s (s02 turns the page on the 8.0 s match cut)
   *   T      absolute film time in seconds: pill readout, pill x = 112 + 186·(T − 8·page), frame = floor(T·30) + 1
   *   opts   draw       0..1 ruler boot (the hairline draws left → right and ticks rise as it passes); default 1
   *          flash      (tickTime) -> 0..1, or { f, len }: strike strength of the tick at that absolute time (len
   *                     overrides the 28 px strike height); default none
   *          hit        seconds since a strike at the playhead (pill pulse + 2-frame snow flash); default none
   *          hitAmp     pulse size; default 0.10
   *          lineFlash  0..1: the elapsed part of the hairline flashes lime; default 0
   * Layout: tag at (112, 112); hairline y 160 from x 112 to 1600, ticks rise above it (beats 8 px, bars 14 px), bar
   * labels right of their ticks (page 0 has no `0s` label: it would sit under the tag, and the pill marks the start);
   * pill 156×40 at y 170–210 centred on x, 2 px lime stem up to the line; counter right-aligned at x 1808, `FRAME`
   * over the digits, centred on y 160. `scrim` is the top gradient behind it all.
   */
  function buildHud(root, { page = 0 } = {}) {
    const { h, s } = E;
    const T0 = page * RULER_SEC;    // film time at the left end of the ruler
    const scrim = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '1920px', height: `${SCRIM_H}px`, background: SCRIM } });
    const el = h('div', { class: 'fill' });
    const shade = '0 1px 3px rgba(18,16,17,.6)';   // text halo on bright footage
    const TAG_TEXT = 'WAYTOAGI · OPUS 5.5 案例';
    const tagFont = { font: '600 20px/1 var(--mono)', letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' };
    const tag = h('div', { class: 'abs', style: { left: `${X0}px`, top: `${TAG_TOP}px`, height: `${TAG_H}px`, display: 'flex', alignItems: 'center',
      ...tagFont, color: 'rgba(244,241,242,.82)', textShadow: shade }, text: TAG_TEXT });
    const tagRight = X0 + measure(E.h('span', { style: tagFont, text: TAG_TEXT }));
    // 20 px mono caps centred in the 24 px tag box end at ≈ y 131
    const tagMaxLen = RULER_Y - (TAG_TOP + TAG_H / 2 + 7.5 + TAG_AIR);

    const svg = K.svgRoot(1920, 240);
    const gid = `s01-hud-glow-${++hudSeq}`;
    svg.append(s('defs', {}, s('radialGradient', { id: gid },
      s('stop', { offset: '0', 'stop-color': LIME, 'stop-opacity': '1' }),
      s('stop', { offset: '0.4', 'stop-color': LIME, 'stop-opacity': '0.5' }),
      s('stop', { offset: '1', 'stop-color': LIME, 'stop-opacity': '0' }))));
    const glowFill = `url(#${gid})`;
    const xEnd = X0 + PXS * RULER_SEC;
    const lineShadow = s('line', { x1: X0, y1: RULER_Y + 0.5, x2: xEnd, y2: RULER_Y + 0.5, stroke: 'rgba(18,16,17,.45)', 'stroke-width': 3 });
    const line = s('line', { x1: X0, y1: RULER_Y, x2: xEnd, y2: RULER_Y, stroke: 'rgba(244,241,242,.32)', 'stroke-width': 1.5 });
    const lineGlow = s('line', { x1: X0, y1: RULER_Y, x2: X0, y2: RULER_Y, stroke: LIME, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0 });
    const lineDone = s('line', { x1: X0, y1: RULER_Y, x2: X0, y2: RULER_Y, stroke: SNOW, 'stroke-opacity': 0.78, 'stroke-width': 1.5 });
    svg.append(lineShadow, line, lineGlow, lineDone);
    const ticks = [];
    for (let i = 0; i <= RULER_SEC * 2; i++) {
      const tt = i * 0.5, x = X0 + PXS * tt, bar = i % 4 === 0, len = bar ? 14 : 8;
      // soft glow (no filter): a radial-gradient halo around the tick and a flare along the hairline
      const halo = s('ellipse', { cx: x, cy: RULER_Y, rx: STRIKE.halo, ry: 1, fill: glowFill, opacity: 0, visibility: 'hidden' });
      const flare = s('ellipse', { cx: x, cy: RULER_Y, rx: STRIKE.flare, ry: 5, fill: glowFill, opacity: 0, visibility: 'hidden' });
      const tk = s('line', { x1: x, y1: RULER_Y, x2: x, y2: RULER_Y - len, stroke: SNOW, 'stroke-width': bar ? 2 : 1.5 });
      svg.append(halo, flare, tk);
      ticks.push({ tt: T0 + tt, x, len, bar, maxLen: x <= tagRight + STRIKE.halo ? tagMaxLen : Infinity, tk, halo, flare });
    }
    const labels = [];
    for (let sec = page === 0 ? 2 : 0; sec <= RULER_SEC; sec += 2) {
      const lb = h('div', { class: 'abs', style: { left: `${X0 + PXS * sec + 6}px`, top: `${RULER_Y - 19}px`, font: '600 18px/1 var(--mono)',
        color: 'var(--snow)', opacity: '0.55', whiteSpace: 'nowrap', textShadow: shade }, text: `${T0 + sec}s` });
      labels.push({ el: lb, x: X0 + PXS * sec });
    }
    const stem = h('div', { class: 'abs', style: { left: '0px', top: `${RULER_Y - 3}px`, width: '2px', height: `${PILL_TOP - RULER_Y + 3}px`, background: 'var(--lime)' } });
    const pill = h('div', { class: 'abs center', style: { left: '0px', top: `${PILL_TOP}px`, width: `${PILL_W}px`, height: `${PILL_H}px`,
      borderRadius: `${PILL_H / 2}px`, background: 'var(--lime)', color: 'var(--ink)', font: '600 22px/1 var(--mono)',
      fontVariantNumeric: 'tabular-nums', whiteSpace: 'pre', boxShadow: '0 6px 18px rgba(18,16,17,.35)' } });
    const counter = h('div', { class: 'abs', style: { right: `${1920 - 1808}px`, top: `${RULER_Y - 25}px`, display: 'flex',
      flexDirection: 'column', alignItems: 'flex-end', gap: '2px' } });
    const cLabel = h('div', { style: { font: '600 20px/1 var(--mono)', letterSpacing: '.06em', color: 'rgba(244,241,242,.66)', textShadow: shade }, text: 'FRAME' });
    const cNum = h('div', { style: { font: '700 28px/1 var(--display)', color: 'var(--lime)', fontVariantNumeric: 'tabular-nums', textShadow: shade } });
    counter.append(cLabel, cNum);
    el.append(tag, svg, ...labels.map(l => l.el), stem, pill, counter);
    root.append(scrim, el);

    let lastPill = '', lastNum = '', lastFill = '';
    function render(T, { draw = 1, flash = null, hit = null, hitAmp = PULSE.amp, lineFlash = 0 } = {}) {
      const { clamp, lerp, mixColor, ease } = M;
      const x = X0 + PXS * (T - T0);
      const ph = hit != null && hit > -1e-6 && hit < PULSE.dur ? Math.max(0, hit) / PULSE.dur : null;
      tf2(pill, { x: x - PILL_W / 2, s: ph == null ? 1 : 1 + hitAmp * (1 - ease.outBack(ph)) });
      const fill = ph != null && hit < PULSE.flash - 1e-6 ? SNOW : 'var(--lime)';
      if (fill !== lastFill) { pill.style.background = fill; lastFill = fill; }
      tf2(stem, { x: x - 1 });
      const pt = `t = ${T.toFixed(2)} s`;
      if (pt !== lastPill) { pill.textContent = pt; lastPill = pt; }
      const num = String(Math.floor(T * 30 + 1e-6) + 1).padStart(5, '0');
      if (num !== lastNum) { cNum.textContent = num; lastNum = num; }

      const xr = X0 + PXS * RULER_SEC * clamp(draw);
      line.setAttribute('x2', xr.toFixed(1));
      lineShadow.setAttribute('x2', xr.toFixed(1));
      const xd = Math.max(X0, Math.min(x, xr));
      const lf = clamp(lineFlash);
      lineDone.setAttribute('x2', xd.toFixed(1));             // elapsed time reads brighter
      lineDone.setAttribute('stroke', lf > 0.01 ? mixColor(SNOW, LIME, Math.min(1, lf * 2)) : SNOW);
      lineDone.setAttribute('stroke-opacity', lerp(0.78, 1, lf).toFixed(3));
      lineDone.setAttribute('stroke-width', lerp(1.5, 3, lf).toFixed(2));
      lineGlow.setAttribute('x2', xd.toFixed(1));
      lineGlow.setAttribute('opacity', (0.3 * lf).toFixed(3));
      const full = draw >= 1 ? 1 : 0;
      ticks.forEach(tk => {
        const a = clamp((xr - tk.x) / 60 + full);
        const fv = flash ? flash(tk.tt) : 0;
        const f = clamp(typeof fv === 'number' ? fv : (fv && fv.f) || 0);
        const base = tk.len * a;
        const sLen = Math.min(tk.maxLen, (fv && typeof fv === 'object' && fv.len) || STRIKE.len);
        const top = RULER_Y - lerp(base, Math.max(base, sLen), f);
        const done = tk.x <= x + 0.5;
        tk.tk.setAttribute('y2', top.toFixed(1));
        tk.tk.setAttribute('stroke', f > 0.02 ? mixColor(SNOW, LIME, Math.min(1, f * 3)) : SNOW);
        tk.tk.setAttribute('stroke-width', lerp(tk.bar ? 2 : 1.5, STRIKE.w, f).toFixed(2));
        tk.tk.setAttribute('opacity', Math.max((0.15 + 0.85 * a) * (done ? 0.78 : 0.42), f).toFixed(3));
        const lit = f > 0.004;
        tk.halo.setAttribute('visibility', lit ? 'visible' : 'hidden');
        tk.flare.setAttribute('visibility', lit ? 'visible' : 'hidden');
        if (lit) {
          const hl = RULER_Y - top;   // the halo hugs the tick: its top stays within 6 px of the tick's top
          tk.halo.setAttribute('cy', (RULER_Y - hl / 2).toFixed(1));
          tk.halo.setAttribute('ry', (hl / 2 + 6).toFixed(1));
          tk.halo.setAttribute('opacity', (STRIKE.haloA * f).toFixed(3));
          tk.flare.setAttribute('rx', (STRIKE.flare * (0.6 + 0.4 * f)).toFixed(1));
          tk.flare.setAttribute('opacity', (STRIKE.flareA * f).toFixed(3));
        }
      });
      labels.forEach(lb => { lb.el.style.opacity = (0.55 * clamp((xr - lb.x) / 80 + full)).toFixed(3); });
    }
    return { el, scrim, tag, svg, labels: labels.map(l => l.el), stem, pill, counter, render };
  }

  // Held toast at the end of the scene (co-006-cmdk last frame = source 12.467 s, cover-fit 1920×1080).
  // Measured in the unscaled frame: pill x 312–1608, y 421–661; check disc Ø 81 at (427, 541); text x 520–1137,
  // cap top 516, baseline 565. The frame is pushed 1.00 → 1.02 about (960, 540) over the hold.
  const TOAST = { holdScale: [1.0, 1.02], origin: [960, 540],
    underline: { x: 516, y: 599, w: 620, h: 10, glow: '0 0 22px rgba(201,223,141,.55)' } };

  // co-006-cmdk camera offset in px, keyed to the clip frame (the footage is discrete, so the offset changes with the
  // picture). The full-height palette (clip f8–f21) would put its search field under the HUD and 「Every frame is code」
  // under the subtitle, so the footage drops while the palette is up:
  //   f1–f4    0          the 「Search ⌘K」 pill
  //   f5–f8    40 → 150   inside the pill's blurred expansion into 「Type a command」: on screen the palette's top edge
  //                       stops under the ruler (177 → 136 → 136 → 145) instead of shooting past the frame top, and
  //                       the placeholder is clear of the pill by the time it sharpens
  //   f8–f21   150        the field (centroid 239 → 260, glyphs from y ≈ 225) takes f / fr just below the pill
  //                       (bottom 210), clear of the tag;
  //                       「Every frame is code」 waits below the frame and 「Frame rate」 sits above the credit chips
  //   f22–f26  measured   the palette shrinks to two rows: dy = smooth on-screen target (261 → 276) − the field's
  //                       centroid measured on each frame (136, 173, 211, 240, 262), so 「fra」 lands where 「fr」 was
  //   f27–     0          exact 1.0×: the list, selection, Enter, collapse and the toast keep the geometry s02 matches
  // The strip uncovered above the dropped frame is filled with the frame's own top 2 px, stretched.
  const CMDK_DROP = 150;
  const CMDK_RAMP = [40, 100, 140];           // clip frames f5–f7
  const CMDK_SHRINK = [125, 90, 54, 28, 9];   // clip frames f22–f26
  function cmdkDy(local, fps) {
    const i = Math.floor(local * fps + 1e-6);   // 0-based clip frame, as clipUrl picks it
    if (i < 4) return 0;
    if (i < 7) return CMDK_RAMP[i - 4];
    if (i <= 20) return CMDK_DROP;
    if (i <= 25) return CMDK_SHRINK[i - 21];
    return 0;
  }

  // 9:16 panel for co-054-render, lifted 64 px so the footage's own caption (184の部品がひとつになる / 184 → 1) clears the
  // subtitle box; its ÉPURE header goes under the scrim and the blurred backdrop shows below it: a floating screen
  const PANEL = { w: 608, h: 1080, top: -64 };

  // Burst shot (co-0962-burst, near-black): its own titles sit right behind the frame counter and the tag (GPT-3,
  // OpenAI · May 2020 · 175B, 2018 – 2020) and its scaling-law chart and PARAMETERS readout behind and under the
  // credits. Burn those corners down (the footage is near-black there, so only its labels go).
  const burnSpot = (rx, ry, cx, cy) => `radial-gradient(${rx}px ${ry}px at ${cx}px ${cy}px, rgba(10,8,9,.92) 0%, rgba(10,8,9,.92) 58%, rgba(10,8,9,0) 100%)`;
  const BURN = [burnSpot(320, 135, 1680, 150), burnSpot(230, 75, 220, 96), burnSpot(420, 200, 260, 880)].join(', ');

  // ---------------------------------------------------------------- credits
  const CHIP_H = 40;
  const NOTE_CODE = '作者自述：画面由代码渲染';
  const NOTE_054 = '3D 数据渲染 · 工具未公开';
  // chip 1: handle + small lime 原作片段 (the k-credit look); chip 2: the provenance claim, quieter but legible on
  // bright footage (the montage is mostly paper, haze and light UI). The 1 px hairline keeps both reading as chips
  // on the dark shots and disappears on the light ones.
  // Sizes: handle 20 px, 原作片段 18 px, claim 20 px (the meta minimum). The widest row (@yoshifujidesign + NOTE_054)
  // must stay clear of the 9:16 panel's left edge (x 656), so the row is set tight: 12 px chip padding, an 8 px
  // handle gap, no tracking and a half-width interpunct. It ends at x ≈ 645.
  const CHIP = { height: `${CHIP_H}px`, borderRadius: '12px', boxShadow: '0 0 0 1px rgba(244,241,242,.16)' };
  const CHIP_PAD = 12;
  const CHIP_A_BG = 'rgba(10,8,9,.72)', CHIP_B_BG = 'rgba(18,16,17,.74)';
  const HANDLE = { font: '600 20px/1.1 var(--sans)', color: '#fff' };
  const ORIG = { font: '500 18px/1 var(--mono)', color: 'var(--lime)' };
  const PROV = { font: '500 20px/1.1 var(--cn)', color: 'rgba(244,241,242,.8)' };
  // The SC interpunct is full width, so with a space on each side it left a 1.5 em hole. 'halt' halves it (the gap
  // is then ≈ 1 em). The colon in 作者自述： keeps its full width.
  const HALT = { fontFeatureSettings: '"halt" 1' };
  const handleBox = a => E.h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
    E.h('span', { style: HANDLE, text: a }), E.h('small', { style: ORIG, text: '原作片段' }));
  const provBox = n => E.h('div', { style: { display: 'flex', alignItems: 'center' } },
    E.h('span', { style: PROV }, n.split(/(·)/).filter(Boolean).map(p => (p === '·' ? E.h('span', { style: HALT, text: p }) : p))));

  // the credit row at (112, 822): two chips in a flex row (gap 12), each sized by its own text
  const chipBox = (bg, ...children) => E.h('div', { style: { ...CHIP, display: 'flex', alignItems: 'center', padding: `0 ${CHIP_PAD}px`, background: bg, whiteSpace: 'nowrap' } }, ...children);
  const creditBar = (...chips) => E.h('div', { class: 'abs', style: { left: `${X0}px`, top: '822px', display: 'flex', gap: '12px' } }, ...chips);

  // static credit row in this scene's style, for a neighbour that keeps showing the same footage
  function creditRow({ author, note = NOTE_CODE }) {
    return creditBar(chipBox(CHIP_A_BG, handleBox(author)), chipBox(CHIP_B_BG, provBox(note)));
  }

  window.S01_COLD_HUD = { buildHud, creditRow, X0, PXS, RULER_Y, RULER_SEC, PILL_W, PILL_H, PILL_TOP, TOAST };

  // A credit chip that swaps its text on every cut, hard, like the footage: the new credit is complete, in place and
  // at full strength on the cut frame itself, and the chip (and the chip after it) take the new width on that frame,
  // with no glide after the cut. Same layout as creditRow, so the row is pixel-identical across the cut into s02.
  function swapChip(variants, bg) {
    const items = variants.map(make => { const el = make(); el.style.display = 'none'; return el; });
    const el = chipBox(bg, ...items);
    let last = -1;
    function render(cur) {
      if (cur === last) return;
      items.forEach((it, i) => { it.style.display = i === cur ? 'flex' : 'none'; });
      last = cur;
    }
    return { el, render };
  }

  // ---------------------------------------------------------------- scene
  Scene.define({
    id: 's01_cold',

    build(root, ctx) {
      const { h } = E;
      const bt = n => ctx.beatTime(n);
      // timing: beats for the montage cuts, the voice for the toast and the underline
      const tMei = ctx.word('s01_cold.3', '每');          // 6.00: toast arrives (clip 2.0 = source 12.0 = bar-4 downbeat)
      const tCode = ctx.word('s01_cold.3', '代码');       // 7.25: lime underline
      const cmdkT0 = tMei - 2.0;                           // 4.00: cmdk clip start (on a beat)
      const holdT0 = cmdkT0 + 2.5;                         // 6.50: last frame held from here

      const shots = [
        { clip: 'co-060-ring', t0: 0, push: [1.0, 1.04], author: '@morpheusdv', note: NOTE_CODE },
        { clip: 'co-1377-sun', t0: bt(2), push: [1.0, 1.03], author: '@WinterArc2125', note: NOTE_CODE },
        { clip: 'co-054-render', t0: bt(4), panel: true, author: '@yoshifujidesign', note: NOTE_054 },
        { clip: 'co-006-island', t0: bt(6), author: '@twoclipping', note: NOTE_CODE },
        { clip: 'co-0962-burst', t0: bt(7), burn: true, author: '@kimmonismus', note: NOTE_CODE },
        { clip: 'co-006-cmdk', t0: cmdkT0, drop: true, author: '@twoclipping', note: NOTE_CODE, hold: true },
      ];
      shots.forEach((sh, i) => { sh.t1 = i + 1 < shots.length ? shots[i + 1].t0 : Infinity; });
      // the ruler strikes on every cut (frame 0 included) and, biggest, on the bar-4 downbeat where the toast lands
      const strikes = shots.map(sh => sh.t0).concat([tMei]);

      // footage: full-bleed layer (pushes, the cmdk drop, held frame, underline) and the 9:16 panel over its own
      // blurred copy
      K.bg(root, 'plain');
      const ambImg = h('img', { class: 'abs', style: { left: '0px', top: '0px', width: '192px', height: '108px', objectFit: 'cover',
        transformOrigin: '96px 54px', filter: 'blur(5px) saturate(1.4) brightness(0.34)' } });
      const amb = h('div', { class: 'fill', style: { overflow: 'hidden', visibility: 'hidden' } }, ambImg);
      const panelImg = h('img', { style: { position: 'absolute', left: '0px', top: '0px', width: '100%', height: '100%', objectFit: 'cover', display: 'block' } });
      const panel = h('div', { class: 'abs', style: { left: `${(1920 - PANEL.w) / 2}px`, top: `${PANEL.top}px`, width: `${PANEL.w}px`, height: `${PANEL.h}px`,
        overflow: 'hidden', background: '#000', boxShadow: '0 0 90px rgba(0,0,0,.55), 0 0 0 1.5px rgba(255,255,255,.08)', visibility: 'hidden' } }, panelImg);
      // the strip above the dropped cmdk frame: the same frame's top 2 px, stretched to the drop
      const stripImg = h('img', { style: { position: 'absolute', left: '0px', top: '0px', width: '1920px', height: '1080px', objectFit: 'cover', display: 'block' } });
      const strip = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '1920px', height: '2px', overflow: 'hidden',
        transformOrigin: '0 0', visibility: 'hidden' } }, stripImg);
      const fullImg = h('img', { style: { position: 'absolute', left: '0px', top: '0px', width: '1920px', height: '1080px', objectFit: 'cover', display: 'block' } });
      const U = TOAST.underline;
      const underline = h('div', { class: 'abs', style: { left: `${U.x}px`, top: `${U.y}px`, width: `${U.w}px`, height: `${U.h}px`, borderRadius: `${U.h / 2}px`,
        background: 'var(--lime)', transformOrigin: '0 50%', boxShadow: U.glow, visibility: 'hidden' } });
      const glint = h('div', { class: 'abs', style: { left: '0px', top: `${U.y + U.h / 2 - 16}px`, width: '56px', height: '32px', borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,255,255,.95), rgba(233,245,196,.55) 45%, rgba(201,223,141,0))', visibility: 'hidden' } });
      const full = h('div', { class: 'fill', style: { transformOrigin: `${TOAST.origin[0]}px ${TOAST.origin[1]}px` } }, fullImg, underline, glint);
      // burst-only corner burn: above the footage, under the HUD and the credits
      const burn = h('div', { class: 'fill', style: { background: BURN, visibility: 'hidden' } });
      root.append(amb, panel, strip, full, burn);

      const hud = buildHud(root);

      // credits row at (112, 822): handle + 原作片段 | provenance note
      const handles = [...new Set(shots.map(sh => sh.author))];
      const notes = [...new Set(shots.map(sh => sh.note))];
      const chipA = swapChip(handles.map(a => () => handleBox(a)), CHIP_A_BG);
      const chipB = swapChip(notes.map(n => () => provBox(n)), CHIP_B_BG);
      root.append(creditBar(chipA.el, chipB.el));
      shots.forEach(sh => { sh.ia = handles.indexOf(sh.author); sh.ib = notes.indexOf(sh.note); });

      return { shots, strikes, tMei, tCode, holdT0, amb, ambImg, panel, panelImg, strip, stripImg, full, fullImg, underline, glint, burn,
        hud, chipA, chipB };
    },

    render(st, t, ctx) {
      const { setImg } = E;
      const { clamp, lerp, prog, ease } = M;
      const tc = Math.max(0, t);

      // --- footage: which shot, clip-local time (clipUrl clamps: the cmdk shot holds its last frame, source 12.467 s)
      let k = 0;
      for (let i = 0; i < st.shots.length; i++) if (tc + 1e-6 >= st.shots[i].t0) k = i;
      const sh = st.shots[k];
      const local = tc - sh.t0;
      const url = ctx.clipUrl(sh.clip, local);
      st.panel.style.visibility = sh.panel ? 'visible' : 'hidden';
      st.amb.style.visibility = sh.panel ? 'visible' : 'hidden';
      st.full.style.visibility = sh.panel ? 'hidden' : 'visible';
      st.burn.style.visibility = sh.burn ? 'visible' : 'hidden';   // hard on both cuts, like the footage
      let dy = 0;
      if (sh.panel) {
        setImg(st.panelImg, url);
        setImg(st.ambImg, url);
        // 192×108 blurred copy scaled ×11.5 about the frame centre (hides the blur's soft rim), drifting a little
        tf2(st.ambImg, { x: 960 - 96, y: 540 - 54, s: 11.5 + 0.4 * clamp(local / (sh.t1 - sh.t0)) });
      } else {
        setImg(st.fullImg, url);
        let sc = 1;
        if (sh.push) sc = lerp(sh.push[0], sh.push[1], clamp(local / (sh.t1 - sh.t0)));
        // the push lands exactly on 1.02 on the last rendered frame: s02 opens on the same frame at the same scale
        if (sh.hold) sc = lerp(TOAST.holdScale[0], TOAST.holdScale[1], clamp((tc - st.holdT0) / Math.max(0.01, ctx.dur - 1 / ctx.fps - st.holdT0)));
        if (sh.drop) dy = cmdkDy(local, ctx.fps);
        tf2(st.full, { y: dy, s: sc });
      }
      st.strip.style.visibility = dy > 0.5 ? 'visible' : 'hidden';
      if (dy > 0.5) {
        setImg(st.stripImg, url);
        st.strip.style.transform = `scale(1,${(dy / 2).toFixed(3)})`;
      }

      // --- lime underline under the toast text on 「代码」 (0.35 s, outQuint, left → right) with a glint at its head
      const u = prog(tc, st.tCode, 0.35, ease.outQuint);
      st.underline.style.visibility = u > 0 ? 'visible' : 'hidden';
      st.underline.style.transform = `scaleX(${u.toFixed(4)})`;
      const g = u > 0 ? Math.min(1, u * 6) * (1 - prog(tc, st.tCode + 0.16, 0.22, ease.outCubic)) : 0;
      st.glint.style.visibility = g > 0.002 ? 'visible' : 'hidden';
      tf2(st.glint, { x: TOAST.underline.x + TOAST.underline.w * u - 28, o: g });

      // --- HUD at the real film time; the ruler boots over the first 0.5 s. Strikes: the tick at the playhead shoots
      // up and drops back over 0.2 s, the pill pulses; 「每」 is the biggest (36 px tick, bigger pulse, the elapsed
      // hairline flashes lime for 0.25 s)
      const T = ctx.start + clamp(tc, 0, ctx.dur - 1 / ctx.fps);
      let hit = null, big = false;
      for (const s0 of st.strikes) if (tc + 1e-6 >= s0) { hit = tc - s0; big = s0 === st.tMei; }
      st.hud.render(T, {
        draw: prog(tc, 0, 0.5, ease.outCubic),
        flash: tt => {
          let f = 0, len = 0;
          for (const s0 of st.strikes) {   // strikes are scene-local, ticks carry absolute film time
            if (Math.abs(ctx.start + s0 - tt) < 1e-3 && tc + 1e-6 >= s0) {
              const v = 1 - ease.inQuad(clamp((tc - s0) / STRIKE.dur));
              if (v > f) { f = v; len = s0 === st.tMei ? 36 : 0; }
            }
          }
          return len ? { f, len } : f;
        },
        hit,
        hitAmp: big ? 0.14 : PULSE.amp,
        lineFlash: tc + 1e-6 >= st.tMei ? 1 - ease.inQuad(clamp((tc - st.tMei) / 0.25)) : 0,
      });

      // --- credits: hard swap on every cut
      st.chipA.render(sh.ia);
      st.chipB.render(sh.ib);
    },

    events(ctx) {
      const bt = n => ctx.beatTime(n);
      const tMei = ctx.word('s01_cold.3', '每');
      const tCode = ctx.word('s01_cold.3', '代码');
      const c0 = tMei - 2.0;   // cmdk clip start; keys land in the footage at clip 0.53 / 0.63 / 0.77 / 0.90 / 1.03
      const ev = [
        { t: 0, type: 'boom', gain: 0.5 },
        { t: bt(2), type: 'shutter', gain: 0.45 },
        { t: bt(4), type: 'shutter', gain: 0.45 },
        { t: bt(6), type: 'shutter', gain: 0.45 },
        { t: bt(7), type: 'tick', gain: 0.5 },
        { t: c0, type: 'glitch', gain: 0.15 },             // soft: the pill is still blurred here
        { t: c0 + 0.16, type: 'swish', gain: 0.3 },        // 「Search ⌘K」 opens into 「Type a command」 (and the footage drops)
        { t: tMei - 1.6, type: 'riser', gain: 0.45 },      // the 1.6 s riser peaks on 「每」
        { t: c0 + 1.3, type: 'blip', gain: 0.45 },         // selection moves to "Every frame is code"
        { t: c0 + 1.5, type: 'pop', gain: 0.45 },          // Enter
        { t: tMei, type: 'impact', gain: 0.6 },
        { t: tMei, type: 'sparkle', gain: 0.5 },
        { t: tCode, type: 'swish', gain: 0.4 },
      ];
      [0.5, 0.62, 0.75, 0.87, 1.0].forEach(d => ev.push({ t: c0 + d, type: 'type', gain: 0.5 }));
      return ev;
    },
  });
})();
