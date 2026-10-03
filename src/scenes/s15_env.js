/*
 * s15_env — Step 1: an AI tool that can run code. The worksheet chapter opens on paper.
 *
 * In:      the chapter wipe (green bar) sweeps s14 away. s14's lime chip 「方向和反馈：你」 has just flown into step 1's slot,
 *          so the rail is in place from t = 0: its lime pill takes over under the bar (a soft ripple as it clicks in) and the
 *          white pills pop in right behind the bar.
 * 轮:      「轮到你了。」 rises big, centred on its ink; 你 gets a lime marker.
 * 了→第一:  the line glides into the headline slot and lands on 「第一」 (the rail pill pulses); only then does it roll over
 *          (odometer) into 「第一步 · 能运行代码的 AI 工具」.
 * 准备:    the terminal slides up with all seven commands and the three hint lines already laid out at 35 % ink (copyable
 *          on a pause from here on); its title bar is an instruction in ink (「打开终端：」 Mac ⌘+空格 / Windows PowerShell).
 *          The one-line footnote (paid plan + the regions it excludes) fades in, and the checklist appears as a blank form
 *          (numbered boxes, blank lines). 能…代码: a marker draws under 「能运行代码」 as it is spoken.
 * AI 工具:  the install line types to full ink; its Windows twin inks under the terminal. 「Claude」: item 1 writes in and
 *          claude --version types.
 * Node / FFmpeg: each writes into the form, its check command types, the box fills and ticks; its 缺 Node / 缺 FFmpeg hint
 *          line inks. mkdir / cd / claude type in the pause after 「FFmpeg」; the 「暂停就能抄」 sticker slaps on.
 * 注意:    a lime marker lands on 「需付费账号（Pro 起）」 in the footnote, which lifts, darkens and gains weight (blip).
 *          「Claude」: item 1 comes forward. 付费: it ticks and its sub gets the lime marker.
 * Out:     s16's wipe-up (the engine clips s16 from the bottom; this scene does not move) rises over the page. The rail
 *          stays put at y 150–198 and s16's identical rail replaces it in place as the edge passes (≈ 0.39 s); then
 *          s16's pill hops.
 *
 * Rendering: nothing inside the push-in `world` is composited (2D transforms that drop to 'none' at rest, no will-change),
 * so every frame is painted fresh at the current camera scale, whatever was rendered before it.
 * Every time comes from ctx.word(); render() is a pure function of t and holds the end state past ctx.dur.
 */
(() => {
  'use strict';
  const ID = 's15_env';
  const L1 = `${ID}.1`, L2 = `${ID}.2`;
  const INK = '#241E1E', INK2 = '#5D5656', GREEN = '#238653', LIME = '#C9DF8D';
  const GHOST = 0.35;                                  // laid out but not yet typed (as s16's code boxes)

  // ---- copy (amendments: s15_env) ----
  const H1_PARTS = [{ t: '轮到' }, { t: '你', mark: true }, { t: '了。' }];     // 「轮到你了。」
  // ' · ' is its own part: Noto Sans SC draws U+00B7 full-width, so the two spaces are pulled in (one title, not two)
  const HEAD_PARTS = [{ t: '第一步' }, { t: ' · ', sep: true }, { t: '能运行代码', mark: true }, { t: '的 AI 工具' }];
  // the region note names the regions (brief §2: safe on screen; §6: state it plainly, no workaround): most of this
  // audience is in mainland China, where 「首次运行按提示登录」 would otherwise fail without warning
  const FOOT = ['Claude Code ', '需付费账号（Pro 起）', '，免费版不含；官方支持地区不含中国大陆、香港、澳门（2026-10-01 核对）'];
  const CMDS = [
    { cmd: 'curl -fsSL https://claude.ai/install.sh | bash' },
    { cmd: 'claude --version', pad: '      ', com: '# 能看到版本号就装好了' },
    { cmd: 'node --version' },
    { cmd: 'ffmpeg -version' },
    { cmd: 'mkdir my-video' },
    { cmd: 'cd my-video' },
    { cmd: 'claude', pad: '      ', com: '# 首次运行按提示登录，然后用中文提需求' },
  ];
  // hint lines under the terminal: [text, isCommand]. The amendment's second line is set as two (split at its 「 · 」):
  // as one line it ran ~1310 px, past the terminal into the checklist column. The Node and FFmpeg lines ink on their words.
  const HINT_WIN = [['Windows PowerShell：', 0], ['irm https://claude.ai/install.ps1 | iex', 1]];
  const HINT_DEP_A = [['缺 Node：', 0], ['nodejs.org', 1], [' 装 LTS 版', 0]];
  const HINT_DEP_B = [['缺 FFmpeg：Mac 用 ', 0], ['brew install ffmpeg', 1], ['；Windows 可先走 Remotion（自带 FFmpeg）', 0]];
  // the title bar is the scene's only answer to "how do I open a terminal" (a true beginner has never opened one), so it
  // is set as an instruction, not chrome: [text, strong] runs in ink, the label and the keys to press/type in bold.
  // (no space after 」: the full-width bracket carries its own; see text-spacing-trim in build)
  const TERM_TITLE = [['打开终端：', 1], ['Mac 按 ', 0], ['⌘+空格', 1], [' 搜「终端」· Windows 在开始菜单搜 ', 0], ['PowerShell', 1]];
  const TITLE_SIZE = 22;                               // ≈ 810 px from x 220: ends ≈ x 1030, inside the bar (x ≤ 1130)
  const ITEMS = [
    { text: 'Claude Code', sub: '需要付费账号（Pro 起）' },
    { text: 'Node.js 22+', sub: '运行渲染脚本' },
    { text: 'FFmpeg', sub: '把画面编成视频' },
  ];

  // ---- layout (stage px) ----
  const H1_SIZE = 110, H2_SIZE = 64, LH = 1.15;
  const H1_CY = 500;                                   // centre line of the opening H1
  const HEAD = { x: 112, y: 222 };                     // worksheet headline slot
  const SEP_PULL = '-0.18em';                          // each side of ' · ' in the headline
  const TERM = { x: 112, y: 326, w: 1040, size: 28, padY: 20, padX: 34 };
  TERM.lineH = Math.round(TERM.size * 1.5);            // 42
  TERM.h = 54 + TERM.padY * 2 + TERM.lineH * CMDS.length;   // 388 → bottom 714
  const HINT = { x: 112, y: TERM.y + TERM.h + 18, size: 22, lineH: 32 };   // three lines at y 732 / 764 / 796
  const CHECK = { x: 1216, w: 592, size: 38 };
  CHECK.gap = 36;
  CHECK.y = Math.round(TERM.y + TERM.h / 2 - (3 * 84 + 2 * CHECK.gap) / 2);   // 3 rows of 84, centred on the terminal
  const STICKER = { x: 1500, y: 236 };
  // the footnote stays its own group: ~32 px of air under the third hint line (~29 px after its 注意 lift), against
  // ~10 px between hint lines; its ink stays above y 878 through the push-in (content box: y ≤ 880)
  const FOOT_Y = 850;
  const INK_SPEED = 1800;                              // px/s of the hint lines' ink sweep
  // odometer roll: a wave crosses WAVE_W px of the slot in WAVE_S s; each glyph rolls one line in ROLL s; the incoming
  // headline trails the outgoing H1 by WAVE_D s
  const WAVE_W = 900, WAVE_S = 0.42, ROLL = 0.26, WAVE_D = 0.09;
  const FLY_BLUR = 1.2;                                // peak blur (H1 px) on the glyphs mid-glide, scaled by speed

  // ---- timing: every value from the voice ----
  function timing(ctx) {
    const w = (l, x) => ctx.word(l, x);
    const T = {
      lun: w(L1, '轮'), you: w(L1, '你'), step: w(L1, '第一'), prep: w(L1, '准备'),
      neng: w(L1, '能'), codeEnd: ctx.wordEnd(L1, '代码'), ai: w(L1, 'AI'), claude1: w(L1, 'Claude'),
      node: w(L2, 'Node'), ffmpeg: w(L2, 'FFmpeg'), ffEnd: ctx.wordEnd(L2, 'FFmpeg'),
      zhuyi: w(L2, '注意'), claude2: w(L2, 'Claude'), paid: w(L2, '付费'),
    };
    // typing schedule: the install line types under 「AI 工具」, claude --version on 「Claude」, the checks on their
    // words, the project lines in the pause after 「FFmpeg」
    const lines = [];
    const add = (i, t0, dc, dm = 0) => {
      const c = CMDS[i];
      const tc = t0 + dc + 0.06;
      const end = c.com ? tc + dm : t0 + dc;
      const promptAt = i === 0 ? T.prep : lines[i - 1].end + 0.06;    // the caret moves to this row
      lines.push({ ...c, t0, dc, tc, dm, end, promptAt });
      return end;
    };
    let e = add(0, T.ai, 0.95);
    e = add(1, Math.max(T.claude1, e + 0.1), 0.32, 0.3);
    e = add(2, Math.max(T.node, e + 0.08), 0.28);
    T.tick2 = e + 0.12;
    e = add(3, Math.max(T.ffmpeg, e + 0.08), 0.3);
    T.tick3 = e + 0.12;
    e = add(4, e + 0.22, 0.26);
    e = add(5, e + 0.1, 0.2);
    add(6, e + 0.12, 0.18, 0.55);
    T.lines = lines;
    // H1 → headline: the glide starts as 「了」 ends and lands on 「第一」; the roll starts once the line has landed
    T.fly0 = T.step - 0.55;
    T.fly1 = T.step;
    T.wave = T.fly1 + 0.03;
    T.sticker = T.ffEnd + 0.12;
    T.blank = T.prep + 0.2;
    T.hintWin = lines[0].end + 0.15;
    T.hintA = T.node + 0.2;
    T.hintB = T.ffmpeg + 0.2;
    return T;
  }

  // when the chapter wipe's edge reaches stage x (the white pills pop in right behind the bar)
  function wipeEdgeTime(x) {
    const me = (window.TIMELINE.scenes || []).find(s => s.id === ID) || {};
    const tr = me.transition || {};
    if (tr.type !== 'wipe' || !tr.dur) return 0;
    let lo = 0, hi = 1;
    for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (M.ease.inOutCubic(mid) * 1920 < x) lo = mid; else hi = mid; }
    return lo * tr.dur;
  }

  // 2D transform + opacity (+ blur). Nothing inside the push-in world may become a compositor layer: a layer keeps the
  // raster of an earlier frame while the camera scale grows, so its pixels would depend on which frames came before
  // (a render worker that starts mid-scene drew the page sharper than its neighbour). A settled element gets no transform.
  function tf2(el, { x = 0, y = 0, s = 1, r = 0, o, blur } = {}) {
    const rest = Math.abs(x) < 0.005 && Math.abs(y) < 0.005 && Math.abs(s - 1) < 1e-4 && Math.abs(r) < 1e-3;
    let tr = 'none';
    if (!rest) {
      tr = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
      if (Math.abs(r) >= 1e-3) tr += ` rotate(${r.toFixed(3)}deg)`;
      if (Math.abs(s - 1) >= 1e-4) tr += ` scale(${s.toFixed(4)})`;
    }
    el.style.transform = tr;
    if (o != null) el.style.opacity = M.clamp(o).toFixed(4);
    if (blur != null) el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
  }
  const setText = (el, str) => { if (el.textContent !== str) el.textContent = str; };
  // markers and blank lines grow by width, never scaleX: a non-uniformly scaled rounded rect is drawn from a cached path
  // mask whose sub-pixel bucket depends on earlier frames (its edge came out up to 0.3 px apart after different seek
  // histories); a resized one is drawn analytically. full width = host width + ext (the marker's overhang)
  function grow(el, k, ext) {
    const q = M.clamp(k);
    el.style.width = q <= 0 ? '0px' : q >= 1 ? `calc(100% + ${ext})` : `calc(${(100 * q).toFixed(3)}% + ${ext} * ${q.toFixed(4)})`;
  }

  // per-character kinetic text (same motion as K.title) whose `mark` parts carry a lime marker behind them and whose
  // `sep` parts are pulled in; no per-glyph will-change (the shared .ch class asks for it)
  function kinetic(parts, { size, weight = 900, color = INK, markH = 0.42, markB = 0.04 }) {
    const { h } = E;
    const el = h('div', { class: 'abs', style: { left: '0px', top: '0px', font: `${weight} ${size}px/${LH} var(--cn)`, color,
      letterSpacing: '0.01em', whiteSpace: 'nowrap', transformOrigin: '0 0' } });
    const spans = [], marks = [];
    parts.forEach(p => {
      let host = el;
      if (p.mark) {
        host = h('span', { style: { position: 'relative', display: 'inline-block', isolation: 'isolate' } });
        const mk = h('span', { style: { position: 'absolute', left: '-0.07em', width: '0px', bottom: `${markB}em`, height: `${markH}em`,
          background: LIME, borderRadius: '0.07em', zIndex: '-1' } });
        host.append(mk);
        marks.push(mk);
        el.append(host);
      } else if (p.sep) {
        host = h('span', { style: { display: 'inline-block', margin: `0 ${SEP_PULL}` } });
        el.append(host);
      }
      for (const c of Array.from(p.t)) {
        const sp = h('span', { class: 'ch', text: c });
        sp.style.willChange = 'auto';
        host.append(sp);
        spans.push(sp);
      }
    });
    return { el, spans, marks, size };
  }

  // a hint line laid out at GHOST ink with a full-ink copy on top; a left-to-right clip sweep inks it (as s16's code)
  function inkLine(runs) {
    const { h } = E;
    const make = () => runs.map(([txt, isCmd]) => h('span', { style: isCmd ? { color: INK, fontWeight: '600' } : {}, text: txt }));
    const base = h('span', { style: { display: 'inline-block', whiteSpace: 'pre', opacity: String(GHOST) } }, make());
    const over = h('span', { style: { position: 'absolute', left: '0px', top: '0px', whiteSpace: 'pre', clipPath: 'inset(0px 100% 0px 0px)' } }, make());
    const wrap = h('span', { style: { position: 'relative', display: 'inline-block', whiteSpace: 'pre' } }, base, over);
    return { wrap, base, over };
  }
  function sweep(line, q) {
    line.over.style.clipPath = q >= 1 ? 'none' : `inset(0px ${(100 - 100 * q).toFixed(2)}% 0px 0px)`;
    line.base.style.clipPath = q <= 0 ? 'none' : `inset(0px 0px 0px ${(100 * q).toFixed(2)}%)`;
  }

  Scene.define({
    id: ID,

    build(root, ctx) {
      const { h } = E;
      const T = timing(ctx);
      // no layer hint on the root (.scene asks for will-change: transform): as a compositor layer its raster offset was
      // pinned to the first frame Chrome rasterized it at, so a frame depended on where a render worker started. Without
      // the hint every frame is painted fresh.
      root.style.willChange = 'auto';

      K.bg(root, 'paper', { glows: [
        { x: 1560, y: 420, r: 640, color: 'rgba(201,223,141,.2)', o: 1 },
        { x: 240, y: 940, r: 620, color: 'rgba(234,216,235,.55)', o: 1 },
      ] });

      // world: everything on the page rides a slow push-in; the rail stays fixed above it
      const world = h('div', { class: 'fill', style: { transformOrigin: '960px 540px' } });
      root.append(world);

      // ---- opening H1 and the headline it becomes ----
      const h1 = kinetic(H1_PARTS, { size: H1_SIZE, weight: 900, markH: 0.36, markB: 0.06 });
      const head = kinetic(HEAD_PARTS, { size: H2_SIZE, weight: 800 });
      Object.assign(head.el.style, { left: `${HEAD.x}px`, top: `${HEAD.y}px`, clipPath: 'inset(0px -80px 0px -80px)' });
      world.append(head.el, h1.el);

      // ---- terminal (K.windowFrame chrome, as K.terminal; comments in ink-2 like the s16 code boxes) ----
      // every row is laid out at GHOST ink from 准备: typed text (d*) | caret anchor | not-yet-typed text (g*)
      const win = K.windowFrame({ w: TERM.w, h: TERM.h, title: TERM_TITLE.map(r => r[0]).join(''), light: true });
      Object.assign(win.el.style, { left: `${TERM.x}px`, top: `${TERM.y}px` });
      // the title is an instruction, not chrome: 22 px ink (not the kit's 20 px grey), label and keys in bold;
      // space-all keeps 」's own half-space before the 「·」 (Chrome trims it against the dot by default, gluing the two)
      const titleEl = win.el.firstElementChild.lastElementChild;
      titleEl.textContent = '';
      titleEl.append(...TERM_TITLE.map(([txt, strong]) => h('span', { style: strong ? { fontWeight: '700' } : {}, text: txt })));
      Object.assign(titleEl.style, { font: `500 ${TITLE_SIZE}px/1 var(--mono)`, color: INK, whiteSpace: 'pre' });
      titleEl.style.setProperty('text-spacing-trim', 'space-all');
      win.body.style.padding = `${TERM.padY}px ${TERM.padX}px`;
      const termRows = CMDS.map(c => {
        const row = h('div', { style: { height: `${TERM.lineH}px`, font: `500 ${TERM.size}px/${TERM.lineH}px var(--mono)`, color: INK, whiteSpace: 'pre' } });
        const pr = h('span', { style: { color: GREEN, fontWeight: '700' }, text: '$ ' });
        const dCmd = h('span'), dPad = h('span'), dCom = h('span', { style: { color: INK2 } });
        // zero-width anchor: the block caret sits on the next (ghost) cell without shifting the text after it
        const anchor = h('span', { style: { display: 'inline-block', position: 'relative', width: '0px', height: '1.08em', verticalAlign: '-0.2em' } });
        const caret = h('span', { style: { position: 'absolute', left: '1px', top: '0px', width: '0.56em', height: '100%', background: GREEN,
          borderRadius: '2px', visibility: 'hidden' } });
        anchor.append(caret);
        const gCmd = h('span', { text: c.cmd }), gPad = h('span', { text: c.pad || '' }), gCom = h('span', { style: { color: INK2 }, text: c.com || '' });
        const ghost = h('span', { style: { opacity: String(GHOST) } }, gCmd, gPad, gCom);
        row.append(pr, dCmd, dPad, dCom, anchor, ghost);
        win.body.append(row);
        return { row, pr, dCmd, dPad, dCom, caret, gCmd, gPad, gCom };
      });
      world.append(win.el);

      // ---- hint lines under the terminal (mono 22, ink-2; the copyable parts in ink), laid out at GHOST ink from 准备 ----
      const hintFont = `500 ${HINT.size}px/${HINT.lineH}px var(--mono)`;
      const hintWin = inkLine(HINT_WIN), depA = inkLine(HINT_DEP_A), depB = inkLine(HINT_DEP_B);
      const hints = [hintWin, depA, depB].map((ln, i) => h('div', { class: 'abs', style: { left: `${HINT.x}px`, top: `${HINT.y + i * HINT.lineH}px`,
        font: hintFont, color: INK2, whiteSpace: 'nowrap' } }, ln.wrap));
      world.append(...hints);

      // ---- checklist ----
      const check = K.checklist({ items: ITEMS.map((it, i) => ({ ...it, t: [T.claude1, T.node, T.ffmpeg][i] })), w: CHECK.w, size: CHECK.size, light: true });
      Object.assign(check.el.style, { left: `${CHECK.x}px`, top: `${CHECK.y}px`, gap: `${CHECK.gap}px` });
      world.append(check.el);
      // the checklist starts as a blank form (numbered boxes + blank lines) that the voice fills in
      const blanks = check.rows.map(r => {
        r.row.style.position = 'relative';
        const txt = r.row.lastElementChild;
        const bx = Math.round(CHECK.size * 1.35) + 22;
        const line = h('div', { style: { position: 'absolute', left: `${bx}px`, top: '50%', width: '0px', height: '2px', marginTop: '-1px',
          background: '#CFC8CB', borderRadius: '1px' } });
        r.row.append(line);
        return { txt, line };
      });
      // item 1: a focus panel behind the row, and a lime marker behind its sub
      const row0 = check.rows[0].row;
      row0.style.alignSelf = 'flex-start';
      const panel = h('div', { style: { position: 'absolute', left: '-22px', top: '-16px', right: '-34px', bottom: '-16px', borderRadius: '20px',
        background: '#FFFFFF', zIndex: '-1', opacity: '0',
        boxShadow: `inset 5px 0 0 ${GREEN}, 0 18px 40px rgba(36,30,30,.10), 0 0 0 1.5px rgba(35,134,83,.28)` } });
      row0.prepend(panel);
      const sub0 = row0.children[2].children[1];
      const subText = sub0.textContent;
      sub0.textContent = '';
      const subWrap = h('span', { style: { position: 'relative', display: 'inline-block', isolation: 'isolate' } });
      const subMark = h('span', { style: { position: 'absolute', left: '-6px', width: '0px', bottom: '0.06em', height: '0.52em', background: LIME,
        borderRadius: '4px', zIndex: '-1' } });
      subWrap.append(subMark, document.createTextNode(subText));
      sub0.append(subWrap);

      // ---- sticker (Smiley Sans: this scene's one playful accent) ----
      const sticker = K.sticker('暂停就能抄');
      Object.assign(sticker.el.style, { left: `${STICKER.x}px`, top: `${STICKER.y}px` });
      world.append(sticker.el);

      // ---- footnote: one line, with the terminal (amendment); 「需付费账号（Pro 起）」 gets a lime marker on 注意 ----
      // the marked phrase stays an inline span (not inline-block) so Chrome still trims 「）」 against the 「，」 after it
      const footMark = h('span', { style: { position: 'absolute', left: '-4px', width: '0px', bottom: '0.15em', height: '0.5em', background: LIME,
        borderRadius: '3px', zIndex: '-1' } });
      const footKey = h('span', { style: { position: 'relative', isolation: 'isolate' } }, footMark, FOOT[1]);
      const foot = h('div', { class: 'abs', style: { left: '112px', top: `${FOOT_Y}px`, font: '500 20px/1.3 var(--cn)', color: INK2, whiteSpace: 'nowrap' } },
        FOOT[0], footKey, FOOT[2]);
      world.append(foot);

      // ---- the rail: fixed above the page ----
      const rail = K.stepRail();
      root.append(rail.el);
      const pills = Array.from(rail.el.children);

      return { T, world, h1, head, win, termRows, hints, hintWin, depA, depB, check, blanks, panel, sub0, subMark, sticker,
        foot, footMark, rail, pills, geo: null };
    },

    render(s, t, ctx) {
      const { clamp, lerp, prog, ease, spring, mixColor } = M;
      const T = s.T;

      // ---- rail: step 1 active (no hop: s14's chip already flew into this slot) ----
      s.rail.render(t, 0, -1);
      if (!s.geo) {
        const relX = (sp, root) => sp.offsetLeft + (sp.offsetParent === root ? 0 : sp.offsetParent.offsetLeft);
        const sweepDur = line => clamp(line.wrap.offsetWidth / INK_SPEED, 0.2, 0.6);
        s.geo = {
          pillT: s.pills.map(p => wipeEdgeTime(parseFloat(p.style.left) + 6) - 0.02),
          click: wipeEdgeTime(parseFloat(s.pills[0].style.left) + parseFloat(s.pills[0].style.width)) + 0.02,
          h1w: s.h1.el.offsetWidth,
          h1x: s.h1.spans.map(sp => relX(sp, s.h1.el)),
          headx: s.head.spans.map(sp => relX(sp, s.head.el)),
          inkWin: sweepDur(s.hintWin), inkA: sweepDur(s.depA), inkB: sweepDur(s.depB),
        };
      }
      s.pills.forEach((p, i) => {
        if (i === 0) return;
        const st = s.geo.pillT[i];
        const sp = spring(t - st, { stiffness: 320, damping: 21 });
        tf2(p, { s: lerp(0.8, 1, sp), o: clamp((t - st) / 0.12) });
      });
      {
        // lime pill: ripple as s14's chip clicks in under the wipe, and again as the headline lands on 「第一」
        const ring = (t0) => { const q = clamp((t - t0) / 0.6); return t >= t0 && q < 1 ? q : -1; };
        const parts = ['0 8px 22px rgba(35,134,83,.18)'];
        for (const t0 of [s.geo.click, T.step - 0.05]) {
          const q = ring(t0);
          if (q >= 0) parts.push(`0 0 0 ${(2 + 14 * ease.outCubic(q)).toFixed(2)}px rgba(35,134,83,${(0.32 * (1 - q)).toFixed(3)})`);
        }
        s.pills[0].style.boxShadow = parts.join(',');
      }
      // the outgoing page turn: the engine's wipe-up only clips s16 (it never moves this scene), so the rail is simply
      // left alone through the tail: it holds y 150–198 until s16's identical rail covers it in place.

      // ---- camera: slow push-in of the page (2D scale; nothing inside is composited, so it is painted at this scale) ----
      const push = 1 + 0.012 * ease.inOutSine(clamp(t / (ctx.dur + 0.6)));
      s.world.style.transform = `scale(${push.toFixed(5)})`;

      // ---- 「轮到你了。」 → headline ----
      // The H1 glides into the headline slot (its scaled line box equals the headline's) and lands; then one left-to-right
      // wave rolls it up and out of the line while the headline rolls up into it (odometer roll, clipped to the line box,
      // so old and new glyphs never overlap).
      {
        const g = s.geo;
        // centred on the ink: the full-width 「。」 leaves the right half of its cell empty (measured ink: x 719–1199)
        const x0 = 960 - g.h1w / 2 + 0.32 * H1_SIZE, y0 = H1_CY - (H1_SIZE * LH) / 2;
        const u = clamp((t - T.fly0) / (T.fly1 - T.fly0));
        const m = ease.inOutSine(u);
        const k = lerp(1, H2_SIZE / H1_SIZE, m);
        tf2(s.h1.el, { x: lerp(x0, HEAD.x, m), y: lerp(y0, HEAD.y, m), s: k });
        s.h1.el.style.clipPath = t >= T.wave ? 'inset(0px -80px 0px -80px)' : 'none';
        const flyBlur = u > 0 && u < 1 ? FLY_BLUR * Math.sin(Math.PI * u) : 0;    // ∝ speed of the inOutSine glide
        const tIn = T.lun - 0.1;
        const H1_LINE = H1_SIZE * LH;
        let lastOut = 0, youQ = 0;
        s.h1.spans.forEach((sp, i) => {
          const p = prog(t, tIn + i * 0.035, 0.7, ease.outQuint);
          const wx = g.h1x[i] * (H2_SIZE / H1_SIZE);            // where this glyph sits once landed (slot px)
          const st = T.wave + (wx / WAVE_W) * WAVE_S;
          lastOut = Math.max(lastOut, st + ROLL);
          const q = prog(t, st, ROLL, ease.inOutCubic);
          tf2(sp, { y: (1 - p) * H1_SIZE * 0.55 - q * H1_LINE, o: p, blur: Math.max((1 - p) * 6, flyBlur) });
          if (i === 2) youQ = q;                                  // 你 carries the marker
        });
        s.h1.el.style.visibility = t >= lastOut ? 'hidden' : 'visible';
        const mk = prog(t, T.you + 0.02, 0.3, ease.outCubic);
        s.h1.marks[0].style.transform = youQ > 0 ? `translate(0px,${(-youQ * H1_LINE).toFixed(2)}px)` : 'none';
        grow(s.h1.marks[0], mk, '0.12em');

        s.head.spans.forEach((sp, i) => {
          const st = T.wave + WAVE_D + (g.headx[i] / WAVE_W) * WAVE_S;
          const p = prog(t, st, ROLL, ease.inOutCubic);
          tf2(sp, { y: (1 - p) * H2_SIZE * LH, o: p > 0 ? 1 : 0 });
        });
        // marker under 「能运行代码」 follows the voice from 能 to the end of 代码
        grow(s.head.marks[0], prog(t, T.neng, Math.max(0.3, T.codeEnd - T.neng), ease.inOutSine), '0.12em');
      }

      // ---- terminal: all rows at GHOST ink from 准备; each types to full ink on its word ----
      {
        const a = prog(t, T.prep, 0.6, ease.outCubic);
        tf2(s.win.el, { y: (1 - a) * 40, o: a });
        const L = T.lines;
        // the active line: the last one whose prompt is up
        let active = -1;
        L.forEach((ln, i) => { if (t >= ln.promptAt) active = i; });
        L.forEach((ln, i) => {
          const r = s.termRows[i];
          const cmd = Array.from(ln.cmd);
          const nc = Math.round(clamp((t - ln.t0) / ln.dc) * cmd.length);
          setText(r.dCmd, cmd.slice(0, nc).join(''));
          setText(r.gCmd, cmd.slice(nc).join(''));
          if (ln.com) {
            const com = Array.from(ln.com);
            const started = t > ln.tc;                            // the pad jumps in as the comment starts
            const nm = started ? Math.round(clamp((t - ln.tc) / ln.dm) * com.length) : 0;
            setText(r.dPad, started ? ln.pad : '');
            setText(r.gPad, started ? '' : ln.pad);
            setText(r.dCom, com.slice(0, nm).join(''));
            setText(r.gCom, com.slice(nm).join(''));
          }
          r.pr.style.opacity = t >= ln.promptAt ? '1' : String(GHOST);
          let on = false;
          if (i === active) {
            const typing = t >= ln.t0 && t < ln.end;
            const idleFrom = t < ln.t0 ? ln.promptAt : ln.end;
            on = typing || Math.floor((t - idleFrom) * 2) % 2 === 0;
          }
          r.caret.style.visibility = on ? 'visible' : 'hidden';
        });
      }

      // ---- hint lines: ride up with the terminal at GHOST ink, then ink left to right on their words ----
      {
        s.hints.forEach((el, i) => {
          const a = prog(t, T.prep + 0.06 * (i + 1), 0.6, ease.outCubic);
          tf2(el, { y: (1 - a) * 40, o: a });
        });
        sweep(s.hintWin, prog(t, T.hintWin, s.geo.inkWin, ease.linear));
        sweep(s.depA, prog(t, T.hintA, s.geo.inkA, ease.linear));
        sweep(s.depB, prog(t, T.hintB, s.geo.inkB, ease.linear));
      }

      // ---- checklist ----
      const tickAt = { 0: T.paid, 1: T.tick2, 2: T.tick3 };
      s.check.render(t, { tickAt });
      s.check.rows.forEach((r, i) => {
        // the row (box + blank line) is up from 准备; the label writes in on its word (replaces the kit's 3D row slide)
        const tb = T.blank + i * 0.09;
        const sp = spring(t - tb, { stiffness: 300, damping: 20 });
        tf2(r.row, { o: clamp((t - tb) / 0.15) });
        const d = t - tickAt[i];
        const bump = d > 0 && d < 0.22 ? 0.12 * Math.sin((Math.PI * d) / 0.22) : 0;     // the box bumps as it ticks
        tf2(r.box, { s: lerp(0.55, 1, sp) * (1 + bump) });
        // the green fill grows with the tick stroke (the kit switches it on in one frame)
        const k = prog(t, tickAt[i], 0.35, ease.outCubic);
        r.box.style.background = k > 0 ? `rgba(35,134,83,${k.toFixed(3)})` : 'transparent';
        const a = prog(t, r.it.t, 0.5, ease.outQuint);
        tf2(s.blanks[i].txt, { x: (1 - a) * 34, o: a });
        const lp = prog(t, tb + 0.08, 0.4, ease.outCubic);
        s.blanks[i].line.style.width = `${(250 * lp).toFixed(2)}px`;
        s.blanks[i].line.style.opacity = (1 - prog(t, r.it.t, 0.25)).toFixed(3);
      });
      {
        const f = prog(t, T.claude2 - 0.05, 0.4, ease.outCubic);
        tf2(s.panel, { s: lerp(0.96, 1, f), o: f });
        grow(s.subMark, prog(t, T.paid + 0.04, 0.35, ease.outCubic), '12px');
        s.sub0.style.color = mixColor(INK2, INK, prog(t, T.paid, 0.3));
      }

      // ---- sticker: the kit's slap (opacity), with its pose re-applied as a 2D transform ----
      s.sticker.render(t, T.sticker);
      {
        const k = lerp(1.6, 1, clamp(spring(t - T.sticker, { stiffness: 320, damping: 18 }), 0, 1.2));
        s.sticker.el.style.transform = Math.abs(k - 1) < 1e-4 ? 'rotate(-4deg)' : `rotate(-4deg) scale(${k.toFixed(4)})`;
        s.sticker.el.style.visibility = t >= T.sticker ? 'visible' : 'hidden';
      }

      // ---- footnote: with the terminal; on 注意 it lifts, darkens, gains weight and gets its marker ----
      {
        const a = prog(t, T.prep, 0.4, ease.outCubic);
        const z = prog(t, T.zhuyi, 0.3, ease.outCubic);
        tf2(s.foot, { y: (1 - a) * 10 - 4 * z, o: a });
        s.foot.style.color = mixColor(INK2, INK, z);
        s.foot.style.fontWeight = String(Math.round(lerp(500, 600, z)));
        grow(s.footMark, z, '7px');
      }
    },

    events(ctx) {
      const T = timing(ctx);
      const out = [];
      // soft keystrokes across every typing run (the type SFX is one 50 ms click)
      const keys = (t0, dur) => {
        const n = Math.max(3, Math.round(dur / 0.075));
        for (let i = 0; i < n; i++) out.push({ t: t0 + (i / n) * dur, type: 'type', gain: 0.09 + 0.03 * ((i * 7) % 3) / 2 });
      };
      T.lines.forEach(l => { keys(l.t0, l.dc); if (l.com) keys(l.tc, l.dm); });
      out.push({ t: T.tick2, type: 'tick', gain: 0.35 });
      out.push({ t: T.tick3, type: 'tick', gain: 0.35 });
      out.push({ t: T.sticker, type: 'pop', gain: 0.4 });
      out.push({ t: T.zhuyi, type: 'blip', gain: 0.3 });
      out.push({ t: T.paid, type: 'tick', gain: 0.35 });
      out.push({ t: T.paid + 0.05, type: 'pop', gain: 0.3 });
      return out;
    },
  });
})();
