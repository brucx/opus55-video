/*
 * s18_sample — Step 4: before the full piece, ask for a storyboard, three 效果图 and one short sample.
 *
 * In:      the wipe-up turns the page and the new page is already printed: three dashed slots joined by dotted
 *          connectors and, at the end of the row, the full piece 「全片」, greyed, its frames desaturated under a
 *          padlock (「确认后再做」). Once the page has uncovered the rail, its lime pill hops 3 → 4.
 * 第四:    the headline 「第四步 · 先要小样」 rises; 先: a lime marker sweeps under 「先要小样」.
 * The running example from s17 (新同事 · 自我介绍) carries through: every PAGE.draw surface is a shot of that intro,
 * so its copy (大家好！ / 我做数据可视化 / 也爱跑步！ / 欢迎来找我聊天～) sits over the drawing, as in s19 and s20.
 * 分镜:    card 1 pops into slot 1 and its table (时间 / 画面 / 文字 / 声音) writes row by row; the 画面 cells are
 *          PAGE.draw frames, the 文字 cells the intro's lines. Its check lands as the arrow to slot 2 draws.
 * 三…图:   card 2 pops; its three 效果图 (开头 / 中间 / 结尾 = PAGE.draw at three times, captioned 大家好！ /
 *          我做数据可视化 / 也爱跑步！) flash in on 三, 效果, 图.
 * 小样:    card 3 pops and its mini player runs PAGE.draw(t) live (the function s04 printed) under the sample title
 *          「我做数据可视化」, with the lime playhead on its scrubber; out.mp4 gets its tick.
 * 确认:    the stamp 「确认了，再做全片」 lands on card 4 (ding) and the card unlocks with it: the shackle lifts and
 *          swings open, the card un-greys, its frames come back to colour in a quick cascade and the last (short)
 *          arrow draws, all done ≈ 0.35 s after 确认, so the finished row holds to the wipe; the padlock then flies
 *          to the card's status corner. 全片: a packet arrives and the title gets its marker.
 * Every time comes from ctx.word(); render() is a pure function of t and holds the end state past ctx.dur.
 */
(() => {
  'use strict';
  const ID = 's18_sample';
  const L1 = `${ID}.1`;
  const INK = '#241E1E', INK2 = '#5D5656', FOG = '#A39A9B', GREEN = '#238653', GDEEP = '#176A42', LIME = '#C9DF8D', SNOW = '#F4F1F2';
  const px = v => `${(+v).toFixed(2)}px`;
  const rgbOf = c => M.hex2rgb(c);
  const mixRGB = (a, b, p) => a.map((v, i) => v + (b[i] - v) * M.clamp(p));
  const css = a => `rgb(${a.map(v => Math.round(v)).join(',')})`;

  // ---------------- layout (stage px) ----------------
  const HEAD = { x: 112, y: 222, size: 64 };
  const CARD = { w: 328, h: 436, y: 340, xs: [112, 568, 1024, 1480], pad: 24, r: 20 };
  const CY = CARD.y + CARD.h / 2;                        // the pipeline's centre line
  const RAIL_DELAY = 0.4;                                // the wipe-up uncovers the rail at ≈ 0.4 s (same as s16/s17/s19)
  const SHADOW = '0 18px 40px rgba(36,30,30,.10), 0 0 0 1.5px rgba(36,30,30,.10)';
  // card 1: the storyboard table. Its 文字 column holds the intro's lines (s17's example), one per shot, at 14 px
  // (two lines where a line is longer than the column); the 画面 thumbs are 84×47 so the column is 76 px wide.
  const TB = { cols: [0, 64, 160, 236], hdrY: 84, hdrH: 34, rowY: 124, rowH: 70, th: [84, 47] };
  const TXT = { size: 14, lh: 18 };
  const SHOTS = [
    { tc: '0:00', t: 0.25, txt: ['大家好！'] },
    { tc: '0:05', t: 1.0, txt: ['我做数据', '可视化'] },
    { tc: '0:10', t: 1.75, txt: ['也爱跑步！'] },
    { tc: '0:15', t: 2.5, txt: ['欢迎来找', '我聊天～'] },
  ];
  // card 2: three 效果图 (开头 / 中间 / 结尾 of the same drawing), each captioned with its line (snow 20 px, bottom-left).
  // 中间 is drawn at 1.4 s (ball mid-air) so the ball stays clear of the caption.
  const FR = { w: 176, h: 99, gap: 14, y: 84, cap: { x: 10, bottom: 8, size: 20 }, items: [
    { lab: '开头', t: 0.25, cap: '大家好！' }, { lab: '中间', t: 1.4, cap: '我做数据可视化' }, { lab: '结尾', t: 2.75, cap: '也爱跑步！' }] };
  // card 3: the 5-second sample, under the sample title s19 and s20 show (示意)
  const PL = { y: 84, w: 280, h: 158, len: 5, title: '我做数据可视化', cap: { x: 16, bottom: 10, size: 30 } };
  // card 4: the full piece (six shots of the same drawing)
  const GD = { y: 84, w: 134, h: 75, gap: 12, n: 6, t0: 0.25, dt: 0.5 };
  const BADGE = { d: 112, small: 36 };
  const STAMP = { cx: 1612, cy: 792, rot: -8, text: '确认了，再做全片' };

  // ---------------- timing: every value from the voice ----------------
  function timing(ctx) {
    const w = x => ctx.word(L1, x);
    const T = {
      di: w('第四'), xian: w('先'), fen: w('分镜'), san: w('三'), xg: w('效果'), tu: w('图'),
      xy: w('小样'), qr: w('确认'), qp: w('全片'),
    };
    T.c1 = T.fen; T.c2 = T.san; T.c3 = T.xy;
    T.rows = SHOTS.map((_, i) => T.c1 + 0.12 + i * 0.085);
    T.frames = [T.san + 0.12, T.xg + 0.02, T.tu + 0.02];   // 三 · 效果 · 图
    T.ok = [T.c2 - 0.1, T.frames[2] + 0.32, T.c3 + 0.42];   // status checks; card 3's is the out.mp4 tick
    // arrows draw into the next slot; the last one is short (≈ 96 px) and draws with the unlock, so it is quicker
    T.edge = [T.c2 - 0.32, T.c3 - 0.32, T.qr + 0.02];
    T.edgeDur = [0.6, 0.6, 0.3];
    // 确认: the stamp lands and card 4 unlocks with it; shackle, card and frames are done by ≈ 确认 + 0.35 s
    T.stamp = T.qr;                                       // the stamp lands on 确认
    T.lift = T.qr + 0.02;                                 // shackle lifts (0.12 s) and swings open (0.24 s from +0.05)
    T.grey = T.qr + 0.03;                                 // card 4 un-greys (0.32 s)
    T.color = T.qr + 0.05;                                // frames regain colour, a quick cascade (0.025 s apart, 0.18 s each)
    T.colorStep = 0.025; T.colorDur = 0.18;
    T.fly = T.qr + 0.22; T.flyDur = 0.4;                  // padlock → status corner, once the shackle is open
    T.mark = T.qp;                                        // marker under 「全片」
    // packets: a steady pulse along every drawn arrow; one lands in card 4 on 全片
    const pk = [];
    const run = (edge, t0, until, period = 0.85, dur = 0.5) => { for (let x = t0; x < until; x += period) pk.push({ edge, t0: x, dur }); };
    const until = ctx.dur + 1.2;                          // keeps pulsing through the wipe-up, whatever the scene's tail
    run(0, T.edge[0] + T.edgeDur[0], until);
    run(1, T.edge[1] + T.edgeDur[1], until);
    run(2, T.qp - 0.5, until);
    T.packets = pk;
    return T;
  }

  // ---------------- small builders ----------------
  function kinetic(parts, { size, weight = 800, color = INK }) {
    const { h } = E;
    const el = h('div', { class: 'abs', style: { left: px(HEAD.x), top: px(HEAD.y), font: `${weight} ${size}px/1.15 var(--cn)`, color,
      letterSpacing: '0.01em', whiteSpace: 'nowrap' } });
    const spans = [], marks = [];
    parts.forEach(p => {
      let host = el;
      if (p.mark) {
        host = h('span', { style: { position: 'relative', display: 'inline-block', isolation: 'isolate' } });
        const mk = h('span', { style: { position: 'absolute', left: '-0.07em', right: '-0.05em', bottom: '0.04em', height: '0.42em', background: LIME,
          borderRadius: '0.07em', zIndex: '-1', transformOrigin: '0 50%', transform: 'scaleX(0)' } });
        host.append(mk);
        marks.push(mk);
        el.append(host);
      }
      for (const c of Array.from(p.t)) { const sp = h('span', { class: 'ch', text: c }); host.append(sp); spans.push(sp); }
    });
    return { el, spans, marks };
  }

  function checkBadge(size, fill = GREEN) {
    const { h, s } = E;
    const el = h('div', { class: 'abs center', style: { width: px(size), height: px(size), borderRadius: '50%', background: fill,
      boxShadow: '0 6px 14px rgba(35,134,83,.25)' } });
    const svg = s('svg', { width: size * 0.64, height: size * 0.64, viewBox: '0 0 24 24', style: { display: 'block' } },
      s('path', { d: 'M5 12.5 L10 17.5 L19.5 7', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        style: { strokeDasharray: '22 22', strokeDashoffset: '22' } }));
    el.append(svg);
    return { el, path: svg.firstChild };
  }

  function padlock() {
    const { s } = E;
    const svg = s('svg', { width: 56, height: 68, viewBox: '0 0 56 68', style: { display: 'block', overflow: 'visible' } });
    const shackle = s('path', { d: 'M15 33 V21 a13 13 0 0 1 26 0 V33', fill: 'none', 'stroke-width': 7, 'stroke-linecap': 'round' });
    const body = s('rect', { x: 5, y: 30, width: 46, height: 36, rx: 9 });
    const hole1 = s('circle', { cx: 28, cy: 44.5, r: 5.2 });
    const hole2 = s('rect', { x: 25.6, y: 46, width: 4.8, height: 10, rx: 2.4 });
    svg.append(shackle, body, hole1, hole2);
    return { svg, shackle, body, holes: [hole1, hole2] };
  }

  // grid overlay used on every PAGE.draw surface (same look as s04's pages)
  const gridBg = cell => `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px) 0 0 / ${cell}px ${cell}px,` +
    `linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px) 0 0 / ${cell}px ${cell}px`;

  // cap (optional): { text, x, bottom, size, weight } — the intro's line over the drawing (snow, bottom-left), with a
  // soft shade under it as on s19's preview
  function pageCanvas(w, hh, t, radius, cap = null) {
    const { h } = E;
    const wrap = h('div', { class: 'abs', style: { width: px(w), height: px(hh), borderRadius: px(radius), overflow: 'hidden', background: '#1B1718' } });
    const cv = h('canvas', { width: w, height: hh, style: { position: 'absolute', left: '0px', top: '0px', width: px(w), height: px(hh) } });
    if (t != null) window.PAGE.draw(cv.getContext('2d'), t, w, hh);
    wrap.append(cv, h('div', { class: 'fill', style: { background: gridBg(w / 16) } }));
    if (cap) {
      wrap.append(h('div', { class: 'fill', style: { background: 'linear-gradient(180deg, rgba(18,16,17,0) 55%, rgba(18,16,17,.55) 100%)' } }),
        h('div', { class: 'abs', style: { left: px(cap.x), bottom: px(cap.bottom), font: `${cap.weight || 800} ${cap.size}px/1.15 var(--cn)`, color: SNOW,
          whiteSpace: 'nowrap', letterSpacing: '0.01em', textShadow: '0 1px 8px rgba(0,0,0,.45)' }, text: cap.text }));
    }
    wrap.append(h('div', { class: 'fill', style: { borderRadius: px(radius), boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.10)' } }));
    return { wrap, cv };
  }

  // the stamp's ink: a fixed speckle mask (seeded, built once)
  function inkMask(ctx, w, hh) {
    const c = document.createElement('canvas');
    c.width = w; c.height = hh;
    const g = c.getContext('2d');
    g.fillStyle = '#000';
    g.fillRect(0, 0, w, hh);
    const r = ctx.rng('ink');
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 520; i++) {
      const x = r() * w, y = r() * hh, rr = 0.4 + r() * 1.5;
      g.fillStyle = `rgba(0,0,0,${(0.25 + r() * 0.6).toFixed(3)})`;
      g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill();
    }
    for (let i = 0; i < 9; i++) {                           // a few dry streaks
      const y = r() * hh, x = r() * w, len = 20 + r() * 70;
      g.fillStyle = 'rgba(0,0,0,.28)';
      g.fillRect(x, y, len, 0.8 + r() * 1.2);
    }
    return c.toDataURL('image/png');
  }

  Scene.define({
    id: ID,

    build(root, ctx) {
      const { h, s } = E;
      const T = timing(ctx);

      K.bg(root, 'paper', { glows: [
        { x: 1560, y: 560, r: 680, color: 'rgba(201,223,141,.24)', o: 1 },
        { x: 260, y: 960, r: 620, color: 'rgba(234,216,235,.55)', o: 1 },
      ] });

      // world: the page rides a slow push-in; the rail stays fixed above it
      const world = h('div', { class: 'fill', style: { transformOrigin: '960px 560px' } });
      root.append(world);

      // ---- headline ----
      const head = kinetic([{ t: '第四步 · ' }, { t: '先要小样', mark: true }], { size: HEAD.size });
      world.append(head.el);

      // ---- dashed slots + dotted connectors (printed on the page before the wipe-up) ----
      // each empty slot carries a faint line icon of what goes there: a table, three frames, a player
      const GHOST = '#D2CACD';
      const icons = [
        [s('rect', { x: 4, y: 6, width: 88, height: 68, rx: 9 }), s('path', { d: 'M4 26 H92 M30 26 V74 M30 42 H92 M30 58 H92' })],
        [s('rect', { x: 14, y: 2, width: 68, height: 20, rx: 5 }), s('rect', { x: 14, y: 30, width: 68, height: 20, rx: 5 }), s('rect', { x: 14, y: 58, width: 68, height: 20, rx: 5 })],
        [s('rect', { x: 4, y: 8, width: 88, height: 52, rx: 9 }), s('path', { d: 'M40 22 L58 34 L40 46 Z' }), s('path', { d: 'M4 72 H92' }), s('circle', { cx: 34, cy: 72, r: 4.5 })],
      ];
      const slots = [0, 1, 2].map(i => {
        const el = h('div', { class: 'abs center', style: { left: px(CARD.xs[i]), top: px(CARD.y), width: px(CARD.w), height: px(CARD.h), borderRadius: px(CARD.r),
          border: '2px dashed #CFC8CA', background: 'rgba(255,255,255,.38)' } });
        const ic = s('svg', { width: 96, height: 80, viewBox: '0 0 96 80', fill: 'none', stroke: GHOST, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          style: { display: 'block', overflow: 'visible' } }, ...icons[i]);
        el.append(ic);
        world.append(el);
        return el;
      });

      // ---- the flow edges (K.flow, light); its node boxes are dropped, the cards below are the nodes ----
      const nodes = CARD.xs.map((x, i) => ({ id: `n${i}`, x: x + CARD.w / 2, y: CY, w: CARD.w, h: CARD.h, label: '' }));
      const flow = K.flow({ nodes, edges: [0, 1, 2].map(i => ({ from: `n${i}`, to: `n${i + 1}` })), light: true });
      flow.nodeEls.forEach(n => n.box.remove());
      const marker = flow.el.querySelector('marker');
      marker.id = `${ID}-arrow`;                           // unique: other light scenes may build K.flow too
      const arrowUrl = `url(#${ID}-arrow)`;
      flow.edgeEls.forEach(ed => { ed.dot.setAttribute('stroke', '#FFFFFF'); ed.dot.setAttribute('stroke-width', '3'); ed.dot.setAttribute('r', '8'); });
      const ghostSvg = K.svgRoot(1920, 1080);
      const ghosts = flow.edgeEls.map(ed => {
        const g = s('path', { d: ed.path.getAttribute('d'), fill: 'none', stroke: '#C9C1C4', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': '0.1 11' });
        ghostSvg.append(g);
        return g;
      });
      world.append(ghostSvg, flow.el);

      // ---- cards ----
      const mkCard = i => {
        const el = h('div', { class: 'abs', style: { left: px(CARD.xs[i]), top: px(CARD.y), width: px(CARD.w), height: px(CARD.h), borderRadius: px(CARD.r),
          background: '#FFFFFF', boxShadow: SHADOW, transformOrigin: '50% 50%' } });
        world.append(el);
        return el;
      };
      const titleEl = (...kids) => h('div', { class: 'abs', style: { left: px(CARD.pad), top: '17px', font: '800 40px/46px var(--cn)', color: INK, whiteSpace: 'nowrap' } }, ...kids);
      const num = (txt, extra = {}) => h('span', { style: { font: '700 40px/46px var(--display)', fontVariantNumeric: 'tabular-nums', ...extra }, text: txt });
      const oks = [];
      const addOk = (cardEl) => {
        const b = checkBadge(32);
        Object.assign(b.el.style, { left: px(CARD.w - CARD.pad - 32), top: '24px' });
        cardEl.append(b.el);
        oks.push(b);
        return b;
      };

      // card 1 · 分镜表
      const c1 = mkCard(0);
      c1.append(titleEl('分镜表'));
      addOk(c1);
      const tbl = h('div', { class: 'abs', style: { left: px(CARD.pad), top: '0px', width: px(CARD.w - 2 * CARD.pad), height: px(CARD.h) } });
      c1.append(tbl);
      ['时间', '画面', '文字', '声音'].forEach((lab, k) => tbl.append(h('div', { class: 'abs', style: { left: px(TB.cols[k]), top: px(TB.hdrY),
        font: '700 20px/34px var(--cn)', color: INK2, whiteSpace: 'nowrap' }, text: lab })));
      tbl.append(h('div', { class: 'abs', style: { left: '0px', right: '0px', top: px(TB.hdrY + TB.hdrH), height: '2px', background: '#E4DEE0' } }));
      const wr = ctx.rng('wave');
      const rows = SHOTS.map((sh, i) => {
        const y = TB.rowY + i * TB.rowH;
        const row = h('div', { class: 'abs', style: { left: '0px', top: px(y), width: '100%', height: px(TB.rowH) } });
        if (i > 0) row.append(h('div', { class: 'abs', style: { left: '0px', right: '0px', top: '0px', height: '1px', background: '#EFEAEC' } }));
        const tc = h('div', { class: 'abs', style: { left: px(TB.cols[0]), top: '0px', font: `600 22px/${TB.rowH}px var(--mono)`, color: INK,
          fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }, text: sh.tc });
        const pc = pageCanvas(TB.th[0], TB.th[1], sh.t, 6);
        Object.assign(pc.wrap.style, { left: px(TB.cols[1]), top: px(Math.round((TB.rowH - TB.th[1]) / 2)) });
        // the shot's line, written in left → right (one or two lines, centred on the row)
        const ty = TB.rowH / 2 - (sh.txt.length * TXT.lh) / 2;
        const lines = sh.txt.map((ln, k) => h('div', { class: 'abs', style: { left: px(TB.cols[2]), top: px(ty + k * TXT.lh), font: `600 ${TXT.size}px/${TXT.lh}px var(--cn)`,
          color: INK, whiteSpace: 'nowrap', clipPath: 'inset(0 100% 0 0)' }, text: ln }));
        const waves = [];
        for (let k = 0; k < 7; k++) {
          const hh = 6 + Math.round(wr() * 22);
          const b = h('div', { class: 'abs', style: { left: px(TB.cols[3] + k * 6), top: px(TB.rowH / 2 - hh / 2), width: '3px', height: px(hh), borderRadius: '2px',
            background: GREEN, opacity: '.75', transformOrigin: '50% 50%' } });
          waves.push(b);
        }
        row.append(tc, pc.wrap, ...lines, ...waves);
        tbl.append(row);
        return { tc, thumb: pc.wrap, lines, waves };
      });

      // card 2 · 效果图 ×3
      const c2 = mkCard(1);
      c2.append(titleEl('效果图', num(' ×3', { color: GDEEP })));
      addOk(c2);
      const frames = FR.items.map((it, i) => {
        const y = FR.y + i * (FR.h + FR.gap);
        const slot = h('div', { class: 'abs', style: { left: px(CARD.pad), top: px(y), width: px(FR.w), height: px(FR.h), borderRadius: '8px',
          border: '1.5px dashed #D3CCCF', background: '#F6F3F4' } });
        const pc = pageCanvas(FR.w, FR.h, it.t, 8, { text: it.cap, ...FR.cap });
        Object.assign(pc.wrap.style, { left: px(CARD.pad), top: px(y), transformOrigin: '50% 50%' });
        const flash = h('div', { class: 'fill', style: { background: '#FFFFFF', opacity: '0' } });
        pc.wrap.append(flash);
        const lab = h('div', { class: 'abs', style: { left: px(CARD.pad + FR.w + 20), top: px(y + FR.h / 2 - 17), font: '700 24px/34px var(--cn)', color: INK, whiteSpace: 'nowrap' }, text: it.lab });
        c2.append(slot, pc.wrap, lab);
        return { slot, wrap: pc.wrap, flash, lab };
      });

      // card 3 · 5 秒小样
      const c3 = mkCard(2);
      c3.append(titleEl(num('5'), ' 秒小样'));
      addOk(c3);
      const player = pageCanvas(PL.w, PL.h, null, 10, { text: PL.title, weight: 900, ...PL.cap });
      Object.assign(player.wrap.style, { left: px(CARD.pad), top: px(PL.y) });
      c3.append(player.wrap);
      const SCR_Y = PL.y + PL.h + 30;
      const track = h('div', { class: 'abs', style: { left: px(CARD.pad), top: px(SCR_Y), width: px(PL.w), height: '4px', borderRadius: '2px', background: '#E6E1E3' } });
      const trackFill = h('div', { class: 'abs', style: { left: px(CARD.pad), top: px(SCR_Y), width: '0px', height: '4px', borderRadius: '2px', background: GREEN } });
      const head3 = h('div', { class: 'abs', style: { left: '0px', top: px(SCR_Y + 2 - 9), width: '18px', height: '18px', borderRadius: '50%', background: LIME,
        boxShadow: `0 0 0 2px ${GDEEP}, 0 4px 10px rgba(35,134,83,.25)` } });
      const tcL = h('div', { class: 'abs', style: { left: px(CARD.pad), top: px(SCR_Y + 14), font: '600 20px/28px var(--mono)', color: INK2, fontVariantNumeric: 'tabular-nums' }, text: '0:00' });
      const tcR = h('div', { class: 'abs', style: { right: px(CARD.pad), top: px(SCR_Y + 14), font: '600 20px/28px var(--mono)', color: INK2, fontVariantNumeric: 'tabular-nums' }, text: '0:05' });
      const fileChip = h('div', { class: 'abs', style: { left: px(CARD.pad), top: px(CARD.h - CARD.pad - 44 - 6), height: '44px', padding: '0 12px 0 14px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', gap: '10px', background: '#F4F1F2', border: '1.5px solid #E1DBDD', whiteSpace: 'nowrap' } });
      const fileIcon = s('svg', { width: 18, height: 22, viewBox: '0 0 18 22', style: { display: 'block' } },
        s('path', { d: 'M2 1.5 H11.5 L16.5 6.5 V20.5 H2 Z', fill: 'none', stroke: INK2, 'stroke-width': 1.8, 'stroke-linejoin': 'round' }),
        s('path', { d: 'M7 9.5 L12 12.5 L7 15.5 Z', fill: INK2 }));
      const fileName = h('span', { style: { font: '600 22px/1 var(--mono)', color: INK }, text: 'out.mp4' });
      const fileOk = s('svg', { width: 22, height: 22, viewBox: '0 0 24 24', style: { display: 'block' } },
        s('path', { d: 'M4.5 12.8 L9.6 17.6 L19.5 6.8', fill: 'none', stroke: GREEN, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          style: { strokeDasharray: '22 22', strokeDashoffset: '22' } }));
      fileChip.append(fileIcon, fileName, fileOk);
      c3.append(track, trackFill, head3, tcL, tcR, fileChip);

      // card 4 · 全片 (on the page from the start: greyed and locked)
      const c4 = mkCard(3);
      c4.style.background = '#F2EFF0';
      const c4dash = h('div', { class: 'fill', style: { borderRadius: px(CARD.r), border: '2px dashed #CFC8CA' } });
      c4.append(c4dash);
      const c4Title = h('span', { style: { position: 'relative', display: 'inline-block', isolation: 'isolate' } });
      const c4Mark = h('span', { style: { position: 'absolute', left: '-0.08em', right: '-0.06em', bottom: '0.02em', height: '0.44em', background: LIME,
        borderRadius: '0.07em', zIndex: '-1', transformOrigin: '0 50%', transform: 'scaleX(0)' } });
      const c4TitleTxt = h('span', { text: '全片' });
      c4Title.append(c4Mark, c4TitleTxt);
      const c4Sub = h('span', { style: { marginLeft: '12px', font: '500 24px/46px var(--cn)', color: FOG }, text: '确认后再做' });
      const c4Head = titleEl(c4Title, c4Sub);
      c4Head.style.color = FOG;
      c4.append(c4Head);
      const shots = [];
      for (let k = 0; k < GD.n; k++) {
        const col = k % 2, row = Math.floor(k / 2);
        const pc = pageCanvas(GD.w, GD.h, GD.t0 + k * GD.dt, 7);
        Object.assign(pc.wrap.style, { left: px(CARD.pad + col * (GD.w + GD.gap)), top: px(GD.y + row * (GD.h + GD.gap)) });
        c4.append(pc.wrap);
        shots.push(pc.wrap);
      }
      // padlock badge: centred on the frames, later flies to the status corner (where cards 1–3 carry their checks)
      const gridCx = CARD.pad + GD.w + GD.gap / 2, gridCy = GD.y + (3 * GD.h + 2 * GD.gap) / 2;
      const cornerX = CARD.w - CARD.pad - 16, cornerY = 40;
      const badgeAnchor = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '0px', height: '0px' } });
      const badge = h('div', { class: 'abs center', style: { left: px(-BADGE.d / 2), top: px(-BADGE.d / 2), width: px(BADGE.d), height: px(BADGE.d), borderRadius: '50%',
        background: '#FFFFFF', boxShadow: '0 14px 30px rgba(36,30,30,.16), 0 0 0 1.5px rgba(36,30,30,.08)' } });
      const lock = padlock();
      badge.append(lock.svg);
      badgeAnchor.append(badge);
      c4.append(badgeAnchor);

      // ---- the stamp ----
      const stampAnchor = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '0px', height: '0px', zIndex: '5' } });
      const stamp = h('div', { class: 'abs', style: { left: '0px', top: '0px', transform: 'translate(-50%,-50%)', padding: '12px 24px 13px', borderRadius: '14px',
        border: `3px solid ${GDEEP}`, background: 'rgba(246,244,245,.88)', color: GDEEP, font: '900 36px/1.2 var(--cn)', letterSpacing: '0.02em', whiteSpace: 'nowrap' } });
      stamp.append(h('div', { class: 'abs', style: { left: '4px', top: '4px', right: '4px', bottom: '4px', borderRadius: '9px', border: `1.5px solid ${GDEEP}`, opacity: '.7' } }),
        h('span', { style: { position: 'relative' }, text: STAMP.text }));
      const stampRing = h('div', { class: 'abs', style: { left: '0px', top: '0px', transform: 'translate(-50%,-50%)', borderRadius: '18px', border: `2px solid ${GREEN}`, opacity: '0' } });
      stampAnchor.append(stampRing, stamp);
      world.append(stampAnchor);

      // ---- the rail: fixed above the page ----
      const rail = K.stepRail();
      root.append(rail.el);

      return {
        T, world, head, slots, flow, arrowUrl, ghosts, cards: [c1, c2, c3, c4], oks, rows, frames, player, pg: player.cv.getContext('2d'),
        trackFill, head3, tcL, fileChip, fileOk: fileOk.firstChild, c4, c4dash, c4Head, c4Sub, c4Mark, shots, badgeAnchor, badge, lock,
        gridCx, gridCy, cornerX, cornerY, stampAnchor, stamp, stampRing, rail, last: {}, maskSet: false, ctxRef: ctx,
      };
    },

    render(s, t, ctx) {
      const { tf } = E;
      const { clamp, lerp, prog, ease, spring, mixColor } = M;
      const T = s.T;

      // ---------- rail: 3 → 4 once the page has uncovered it ----------
      s.rail.render(t - RAIL_DELAY, 3, 2);

      // stamp ink mask needs the laid-out size; set once (pure: same result whatever t comes first)
      if (!s.maskSet) {
        const w = Math.ceil(s.stamp.offsetWidth), hh = Math.ceil(s.stamp.offsetHeight);
        if (w > 0) {
          const url = inkMask(s.ctxRef, w, hh);
          Object.assign(s.stamp.style, { webkitMaskImage: `url(${url})`, maskImage: `url(${url})`, webkitMaskSize: '100% 100%', maskSize: '100% 100%' });
          Object.assign(s.stampRing.style, { width: `${w + 10}px`, height: `${hh + 10}px` });
          s.maskSet = true;
        }
      }

      // ---------- camera: a slow push-in drifting along the pipeline ----------
      {
        const k = ease.inOutSine(clamp(t / (ctx.dur + 0.6)));
        tf(s.world, { x: lerp(6, -6, k), s: 1 + 0.012 * k });
      }

      // ---------- headline ----------
      {
        const t0 = T.di - 0.08;
        s.head.spans.forEach((sp, i) => {
          const p = prog(t, t0 + i * 0.03, 0.7, ease.outQuint);
          tf(sp, { y: (1 - p) * HEAD.size * 0.5, o: p, blur: (1 - p) * 5 });
        });
        s.head.marks[0].style.transform = `scaleX(${prog(t, T.xian, 0.45, ease.inOutSine).toFixed(4)})`;
      }

      // ---------- arrows + packets ----------
      s.flow.render(t, { edgeStart: { 0: T.edge[0], 1: T.edge[1], 2: T.edge[2] }, packets: T.packets });
      s.flow.edgeEls.forEach((ed, i) => {
        // K.flow draws every edge in 0.6 s; each edge here has its own duration (the last, short one is quicker)
        const dur = T.edgeDur[i];
        const p = prog(t, T.edge[i], dur, ease.inOutCubic);
        if (ed.len != null) ed.path.style.strokeDashoffset = String(ed.len * (1 - p));
        ed.path.setAttribute('marker-end', p > 0.9 ? s.arrowUrl : 'none');
        s.ghosts[i].style.opacity = (1 - prog(t, T.edge[i] + 0.67 * dur, 0.25)).toFixed(3);
        // packets fade in off the card and out before the arrowhead (same "last active wins" rule as K.flow)
        let q = -1;
        for (const pk of T.packets) { if (pk.edge !== i) continue; const u = (t - pk.t0) / pk.dur; if (u >= 0 && u <= 1) q = u; }
        const at = q < 0 ? 0 : ease.inOutSine(q);           // position along the path, as K.flow places the dot
        ed.dot.style.opacity = q < 0 ? '0' : clamp(Math.min(at / 0.12, (0.74 - at) / 0.14)).toFixed(3);
      });

      // ---------- cards 1–3 pop into their slots ----------
      const ring = (t0, base = SHADOW) => {
        const q = clamp((t - t0) / 0.55);
        if (t < t0 || q >= 1) return base;
        return `${base}, 0 0 0 ${(2 + 12 * ease.outCubic(q)).toFixed(2)}px rgba(35,134,83,${(0.3 * (1 - q)).toFixed(3)})`;
      };
      [T.c1, T.c2, T.c3].forEach((t0, i) => {
        const el = s.cards[i];
        K.pop(el, t, t0, { from: 0.86, stiffness: 250, damping: 19 });
        el.style.visibility = t >= t0 ? 'visible' : 'hidden';
        el.style.boxShadow = ring(t0 + 0.05);
        s.slots[i].style.opacity = (1 - prog(t, t0 + 0.12, 0.3)).toFixed(3);
      });
      // status checks
      s.oks.forEach((b, i) => {
        const t0 = T.ok[i];
        const sp = spring(t - t0, { stiffness: 320, damping: 17 });
        tf(b.el, { s: lerp(0.3, 1, clamp(sp, 0, 1.3)), o: clamp((t - t0) / 0.1) });
        b.path.style.strokeDashoffset = (22 * (1 - prog(t, t0 + 0.06, 0.25, ease.outCubic))).toFixed(2);
      });

      // card 1: the table writes row by row
      s.rows.forEach((r, i) => {
        const t0 = T.rows[i];
        const a = prog(t, t0, 0.25, ease.outCubic);
        tf(r.tc, { x: (1 - a) * -8, o: a });
        const th = prog(t, t0 + 0.03, 0.35, ease.outBack);
        tf(r.thumb, { s: lerp(0.5, 1, th), o: clamp((t - t0 - 0.03) / 0.12) });
        r.lines.forEach((el, k) => {
          const q = prog(t, t0 + 0.06 + k * 0.05, 0.25, ease.outCubic);
          el.style.clipPath = q >= 1 ? 'none' : `inset(0 ${((1 - q) * 100).toFixed(2)}% 0 0)`;
        });
        r.waves.forEach((b, k) => {
          const q = prog(t, t0 + 0.08 + k * 0.02, 0.22, ease.outCubic);
          b.style.transform = `scaleY(${Math.max(0.001, q).toFixed(4)})`;
        });
      });

      // card 2: three frames flash in on 三 / 效果 / 图
      s.frames.forEach((f, i) => {
        const t0 = T.frames[i];
        const sp = spring(t - t0, { stiffness: 300, damping: 19 });
        tf(f.wrap, { s: lerp(0.72, 1, clamp(sp, 0, 1.2)), o: clamp((t - t0) / 0.1) });
        f.flash.style.opacity = (t < t0 ? 0 : 0.75 * (1 - prog(t, t0, 0.3, ease.outCubic))).toFixed(3);
        const a = prog(t, t0 + 0.04, 0.4, ease.outQuint);
        tf(f.lab, { x: (1 - a) * -10, o: a });
      });

      // card 3: the sample plays PAGE.draw(t) live
      {
        const tt = Math.max(0, t - T.c3);
        const tv = tt % PL.len;
        const key = tv.toFixed(4);
        if (s.last.pl !== key) { s.last.pl = key; window.PAGE.draw(s.pg, tv, PL.w, PL.h); }
        const fx = (tv / PL.len) * PL.w;
        s.trackFill.style.width = px(fx);
        s.head3.style.transform = `translate3d(${(CARD.pad + fx - 9).toFixed(2)}px,0,0)`;
        const tc = `0:0${Math.floor(tv)}`;
        if (s.tcL.textContent !== tc) s.tcL.textContent = tc;
        const k = prog(t, T.ok[2] + 0.04, 0.3, ease.outCubic);
        s.fileOk.style.strokeDashoffset = (22 * (1 - k)).toFixed(2);
        s.fileChip.style.borderColor = mixColor('#E1DBDD', '#8CC3A4', k);
        s.fileChip.style.background = mixColor('#F4F1F2', '#EAF4EE', k);
      }

      // ---------- card 4: stamp, unlock, un-grey ----------
      {
        // the stamp: drops from above the page, presses, settles
        const ts = T.stamp, ta = ts - 0.15;
        let sc, o, rot;
        if (t < ta) { sc = 1.45; o = 0; rot = -13; }
        else if (t < ts) { const k = (t - ta) / (ts - ta); sc = lerp(1.45, 0.94, ease.inQuad(k)); o = clamp(k / 0.5); rot = lerp(-13, STAMP.rot, ease.outQuad(k)); }
        else { const u = t - ts; sc = 1 - 0.06 * Math.exp(-12 * u) * Math.cos(28 * u); o = 1; rot = STAMP.rot; }
        tf(s.stampAnchor, { x: STAMP.cx, y: STAMP.cy, r: rot, s: sc, o });
        s.stampAnchor.style.visibility = t >= ta ? 'visible' : 'hidden';
        const q = clamp((t - ts) / 0.45);
        const ringOn = t >= ts && q < 1;
        s.stampRing.style.opacity = ringOn ? (0.55 * (1 - q)).toFixed(3) : '0';
        s.stampRing.style.transform = `translate(-50%,-50%) scale(${(1 + 0.16 * ease.outCubic(q)).toFixed(4)})`;

        // card 4 takes the hit
        const u = t - ts;
        const nudge = u > 0 ? 5 * Math.exp(-14 * u) * Math.sin(Math.min(u, 0.6) * 34 + 0.0001) : 0;
        tf(s.c4, { y: nudge });

        // un-grey: fill, outline, title
        const g = prog(t, T.grey, 0.32, ease.outCubic);
        s.c4.style.background = mixColor('#F2EFF0', '#FFFFFF', g);
        s.c4dash.style.opacity = (1 - g).toFixed(3);
        s.c4.style.boxShadow = g > 0
          ? `0 18px 40px rgba(36,30,30,${(0.1 * g).toFixed(3)}), 0 0 0 ${(1.5 + 0.5 * g).toFixed(2)}px rgba(35,134,83,${(0.9 * g).toFixed(3)})${
            t < T.grey + 0.6 ? `, 0 0 0 ${(2 + 14 * ease.outCubic(clamp((t - T.grey) / 0.6))).toFixed(2)}px rgba(35,134,83,${(0.28 * (1 - clamp((t - T.grey) / 0.6))).toFixed(3)})` : ''}`
          : 'none';
        s.c4Head.style.color = mixColor(FOG, INK, g);
        s.c4Sub.style.color = mixColor(FOG, INK2, g);
        s.c4Mark.style.transform = `scaleX(${prog(t, T.mark, 0.3, ease.outCubic).toFixed(4)})`;

        // the six shots come back to colour, in order (a quick cascade)
        s.shots.forEach((el, k) => {
          const c = prog(t, T.color + k * T.colorStep, T.colorDur, ease.outCubic);
          el.style.filter = c < 1 ? `grayscale(${(1 - c).toFixed(3)})` : 'none';
          el.style.opacity = lerp(0.34, 1, c).toFixed(3);
        });

        // padlock: shackle lifts and swings open, the lock turns green, then the badge flies to the status corner
        const lift = prog(t, T.lift, 0.12, ease.outCubic);
        const swing = prog(t, T.lift + 0.05, 0.24, ease.outBack);
        s.lock.shackle.setAttribute('transform', `translate(0 ${(-10 * lift).toFixed(2)}) rotate(${(-26 * swing).toFixed(2)} 15 33)`);
        const green = prog(t, T.lift, 0.16);
        const fly = prog(t, T.fly, T.flyDur, ease.inOutCubic);
        const lockCol = css(mixRGB(mixRGB(rgbOf(FOG), rgbOf(GREEN), green), [255, 255, 255], fly));
        s.lock.shackle.setAttribute('stroke', lockCol);
        s.lock.body.setAttribute('fill', lockCol);
        const holeCol = mixColor('#FFFFFF', GREEN, fly);
        s.lock.holes.forEach(el => el.setAttribute('fill', holeCol));
        s.badge.style.background = mixColor('#FFFFFF', GREEN, fly);
        s.badge.style.boxShadow = `0 ${lerp(14, 6, fly).toFixed(1)}px ${lerp(30, 14, fly).toFixed(1)}px rgba(36,30,30,${lerp(0.16, 0.12, fly).toFixed(3)}), 0 0 0 1.5px rgba(36,30,30,${(0.08 * (1 - fly)).toFixed(3)})`;
        tf(s.badgeAnchor, { x: lerp(s.gridCx, s.cornerX, fly), y: lerp(s.gridCy, s.cornerY, fly) - 10 * Math.sin(Math.PI * fly), s: lerp(1, BADGE.small / BADGE.d, fly) });
      }
    },

    events(ctx) {
      const T = timing(ctx);
      return [
        { t: T.c1, type: 'pop', gain: 0.35 },
        { t: T.c2, type: 'pop', gain: 0.35 },
        ...T.frames.map(x => ({ t: x, type: 'shutter', gain: 0.2 })),     // each 效果图 is 'captured'
        { t: T.c3, type: 'pop', gain: 0.35 },
        { t: T.ok[2], type: 'tick', gain: 0.22 },
        { t: T.stamp, type: 'ding', gain: 0.5 },
        { t: T.lift + 0.1, type: 'blip', gain: 0.18 },                    // the shackle swings open (same moment as before)
      ];
    },
  });
})();
