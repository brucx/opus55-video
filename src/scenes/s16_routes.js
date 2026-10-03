/*
 * s16_routes — Step 2: four routes, real commands on screen (2×2 grid that scrolls one row).
 *
 * Fixed layer: K.stepRail (step 2 active; the pill hops 1 → 2 once the wipe-up has revealed the rail), the H3
 *   「第二步 · 选一条路线」 with a 2×2 mini-map of the grid, the 「暂停就能抄」 sticker and the source footnote.
 *   The sticker comes over from s15 already stuck, at s15's spot (the page turns under it), and between the two names
 *   it glides 52 px right / 19 px up to (1560, 214), where s17 carries it on. No second slap.
 * Row 1 (A HyperFrames · B Remotion) rises with every command already laid out at 35 % ink, so a pause reads it.
 *   Each card lights up on its name (green edge, 1.5 % spring scale, its code inks on with a caret) while its neighbour
 *   dims to 70 %; on 「适合」 B's 「同样适合」 gets a lime chip, then 「字幕 / 图表 / 界面」 pop one by one on A's sub line.
 *   A's footer and B's sub line give the tie-breaker (A: 写网页, FFmpeg installed separately · B: 写 React, FFmpeg built in).
 * 「想」: the grid scrolls one row under the fixed layer. Row 2 (C 网页＋自动截图的浏览器 · D Lemo-Opuscar):
 *   「掌控」 flags C's chip, 「本片」 stamps 「本片同路线」 and inks C's code, 「网页 / 截图」 light the pipeline and the browser
 *   captures six frames drawn by the film's own PAGE.draw, 「浏览器」 brings the Playwright note.
 *   「现成风格」 ripples the 43-swatch strip, 「Lemo」 inks D's code and then the chat bubble (one swatch gets picked as the
 *   bubble names 水彩笔刷), 「句」 underlines the added sentence and 「分镜」 lays a lime marker behind 「先给我看分镜」.
 *   The strip and the bubble share a right edge; their two identical 「示意」 tags stand in one column at the card's padding.
 * Every time comes from ctx.word(); render() is a pure function of t and holds its last state past ctx.dur.
 */
(() => {
  'use strict';
  const ID = 's16_routes';
  const L1 = `${ID}.1`, L2 = `${ID}.2`, L3 = `${ID}.3`;

  const INK = '#241E1E', INK2 = '#5D5656', INK3 = '#716A6B', GREEN = '#238653', GDEEP = '#176A42', LIME = '#C9DF8D';
  const LINE = '#DDD7DB', CODE_BG = '#F3F0F1', WHITE = '#FFFFFF', BUBBLE_BG = '#E9F3EC';

  // ---- layout (storyboard: cards 832×580, gap 32, row 1 at y 268; row 2 one row lower, scrolled up on 「想」) ----
  const CW = 832, CH = 580, GAP = 32, GX = 112, GY = 268, ROW = CH + GAP;
  const PAD = 28;                       // card inner padding; code text, sub lines and notes share this left edge
  const CODE_PX = 24, CODE_LH = 1.36;
  const SCROLL_DUR = 0.6;
  const RAIL_DELAY = 0.4;               // the engine's wipe-up uncovers y 150–198 at ≈0.4 s; the pill hops once it shows
  const H3_X = 112, H3_Y = 212, H3_PX = 40;
  // card C's lines are our own tested recipe (render.mjs is the viewer's script; the ffmpeg line is 实测), so the source
  // line names both origins; true for both pages
  const FOOT = '命令出自各工具官方文档或本机实测，2026-10-01 核对';
  // 「暂停就能抄」 is carried over from s15, the way s17 carries it on from here: from t = 0 it sits exactly where s15 left
  // it on screen (s15 places it at (1500, 236) inside its page, whose push-in rests at scale 1.012 about (960, 540)), so
  // the wipe-up replaces s15's copy in place. On T.sticker it glides to this page's slot (1560, 214), where s17 takes it.
  const STICK = { x: 1560, y: 214, dur: 0.35 };
  const S15_STICK = { x: 1500, y: 236, push: 1.012, ox: 960, oy: 540 };
  // soft top/bottom edges of the scroll viewport, applied only while the grid moves: content is gone above the H3's
  // baseline (y 254) and below the footnote's cap line (y 858), so nothing crosses fixed text mid-scroll
  const SCROLL_MASK = 'linear-gradient(to bottom, rgba(0,0,0,0) 254px, #000 268px, #000 848px, rgba(0,0,0,0) 858px)';

  // A's sub line carries the spoken uses (lime chips on 字幕 / 图表 / 界面); B's says it fits the same and gives the
  // tie-breaker (FFmpeg ships with it — s15 already suggests Remotion on Windows for that reason), its 「同样适合」 lit on 「适合」
  const ROUTES = [
    {
      key: 'A', name: 'HyperFrames', chips: ['写网页动画', 'Apache 2.0'],
      sub: [{ t: '适合' }, { t: '字幕', cue: 'u1' }, { t: '、' }, { t: '图表', cue: 'u2' }, { t: '、' }, { t: '界面', cue: 'u3' }],
      code: [
        '# 装插件（推荐）',
        '$ claude plugin marketplace add \\',
        '    heygen-com/hyperframes',
        '$ claude plugin install hyperframes@hyperframes',
        '# 然后新开会话，用 /hyperframes:hyperframes 提需求',
        '# 或手动',
        // the opt-out comes before the first run (the CLI's telemetry is on by default; the setting is global, ~/.hyperframes)
        '$ npx hyperframes telemetry disable  # 可选：先关匿名遥测',
        '$ npx hyperframes init my-video',
        '$ cd my-video',
        '$ npx hyperframes render --output out.mp4',
      ],
      note: ['写网页 · 需 Node 22+，另装 FFmpeg'],
    },
    {
      key: 'B', name: 'Remotion', chips: ['写 React 组件', '内置 FFmpeg'],
      sub: [{ t: '同样适合', cue: 'fit' }, { t: ' · 写 React，自带 FFmpeg（少装一样）' }],
      code: [
        '# 装插件（推荐）',
        '$ claude plugin marketplace add \\',
        '    remotion-dev/claude-code-plugin',
        '$ claude plugin install remotion@remotion',
        '# 然后重启，用 /remotion-best-practices 提需求',
        '# 或手动',
        '$ npx create-video@latest --yes \\',
        '    --blank --no-tailwind my-video',
        '$ cd my-video',
        '$ npm i',
        '$ npx remotion render MyComp out/video.mp4',
      ],
      note: ['个人、3 人内团队和非营利免费；超过 3 人的公司需买许可'],
    },
    {
      key: 'C', name: '网页＋自动截图的浏览器', stamp: '本片同路线', subChip: '完全自己掌控',
      sub: [{ t: '网页画面', cue: 'web' }, { t: ' → ', arrow: true }, { t: '浏览器逐帧截图', cue: 'shot' }, { t: ' → ', arrow: true }, { t: 'FFmpeg 编码', cue: 'enc' }],
      code: [
        '$ npm init -y',
        '$ npm i puppeteer',
        '# render.mjs 可以让 Claude Code 帮你写：',
        '# 逐帧调用 renderFrame(i / 30)，再截图',
        '$ node render.mjs',
        '$ ffmpeg -framerate 30 -i frames/%05d.png \\',
        '    -c:v libx264 -pix_fmt yuv420p out.mp4',
      ],
      note: ['本片用 Playwright 驱动无头 Chrome'], noteCue: 'browser', frames: true,
      lineCues: { 4: 'shot', 5: 'enc', 6: 'enc' },             // node render.mjs ← 截图 · ffmpeg … ← FFmpeg 编码
    },
    {
      key: 'D', name: 'Lemo-Opuscar', chips: ['风格插件', '43 种风格', 'MIT'],
      sub: [{ t: '现成风格库', cue: 'style' }, { t: '，装好直接提需求' }],
      code: [
        '$ claude plugin marketplace add \\',
        '    lemomo-ai/lemo-opuscar',
        '$ claude plugin install lemo-opuscar@lemolab',
      ],
      note: ['需 Node 20+、ffmpeg、Python 3.11+；Windows 用 WSL；3D 风格要 GPU', '默认直接出片、30–60 秒，第一支可以要 15–30 秒'],
      swatches: true, bubble: true,
    },
  ];
  // the chat bubble (an illustration, tagged 示意); line 2 is the sentence 「再加一句」 adds
  const BUBBLE = [
    [{ s: '用水彩笔刷风格，做一支 20 秒的短片，讲我家的猫。' }],
    [{ s: '先给我看分镜', mark: true }, { s: '。' }],
  ];

  // ---- swatches: 43 seeded code patterns in two rows (22 + 21) ----
  const SW = 29, SW_GAP = 3, SW_COLS = 22, SW_N = 43, SW_M = 8;   // SW_M: canvas margin for the ripple overshoot
  const SW_W = SW_COLS * SW + (SW_COLS - 1) * SW_GAP, SW_H = 2 * SW + SW_GAP;
  const PICK = SW_COLS + 5;                                      // the 「水彩笔刷」 swatch (row 2, col 6)
  // ---- capture strip (card C): six frames drawn by PAGE.draw ----
  const FR_N = 6, FR_W = 112, FR_H = 63, FR_GAP = 12;
  const FR_STRIP_W = FR_N * FR_W + (FR_N - 1) * FR_GAP;

  // ---------- small helpers ----------
  const wide = ch => ch.charCodeAt(0) > 0x7f;
  const cellsOf = str => Array.from(str).reduce((a, c) => a + (wide(c) ? 2 : 1), 0);
  // write a style only when it changes (render stays a pure function of t; this only skips redundant writes)
  const setS = (el, k, v) => { const c = el.__s || (el.__s = {}); if (c[k] !== v) { c[k] = v; el.style[k] = v; } };

  // shell line → tokens {s, k}: k = prompt | com | slash | bs | (plain)
  function shellTokens(line) {
    const out = [];
    const m = line.match(/^(\s*)(.*)$/);
    if (m[1]) out.push({ s: m[1] });
    let rest = m[2];
    const comment = str => {
      str.split(/(\/[a-z][\w-]*(?::[\w-]+)?)/).forEach((p, i) => { if (p) out.push({ s: p, k: i % 2 ? 'slash' : 'com' }); });
    };
    if (rest.startsWith('#')) { comment(rest); return out; }
    if (rest.startsWith('$ ')) { out.push({ s: '$', k: 'prompt' }); rest = rest.slice(1); }
    let com = '';
    const ci = rest.indexOf('  #');
    if (ci >= 0) { com = rest.slice(ci); rest = rest.slice(0, ci); }
    let bs = false;
    if (rest.endsWith(' \\')) { bs = true; rest = rest.slice(0, -1); }
    if (rest) out.push({ s: rest });
    if (bs) out.push({ s: '\\', k: 'bs' });
    if (com) { const lead = com.match(/^\s*/)[0]; out.push({ s: lead }); comment(com.slice(lead.length)); }
    return out;
  }
  const CODE_STYLE = {
    prompt: { color: GREEN, fontWeight: '700' },
    com: { color: INK2 },
    slash: { color: GDEEP, fontWeight: '700' },
    bs: { color: INK3 },
  };

  // A row of text laid out at 35 % ink with a full-ink copy on top; sweeping the clip edge "types" it to full ink.
  function inkRow(tokens, styleOf, caretColor = GREEN) {
    const { h } = E;
    const row = h('div', { style: { position: 'relative', width: 'max-content', whiteSpace: 'pre' } });
    const make = () => tokens.map(tk => h('span', { style: styleOf(tk) }, tk.s));
    const base = h('div', { style: { position: 'relative', zIndex: '1', opacity: '0.35' } }, make());
    const over = h('div', { style: { position: 'absolute', left: '0px', top: '0px', zIndex: '2', clipPath: 'inset(0 100% 0 0)' } }, make());
    const caret = h('div', { style: { position: 'absolute', zIndex: '3', top: '16%', height: '68%', width: '0.52em', marginLeft: '1px',
      borderRadius: '2px', background: caretColor, visibility: 'hidden' } });
    row.append(base, over, caret);
    return { row, base, over, caret, cells: tokens.reduce((a, tk) => a + cellsOf(tk.s), 0) };
  }
  // split an overall 0..1 progress over rows in proportion to their length (constant typing speed)
  function schedule(rows) {
    const total = rows.reduce((a, r) => a + r.cells, 0) || 1;
    let acc = 0;
    rows.forEach(r => { r.a = acc / total; acc += r.cells; r.b = acc / total; });
  }
  // p: overall ink progress; caretEnd: show a resting caret after the last row (blink phase handled by caller)
  function sweep(rows, p, caretEnd) {
    rows.forEach((r, i) => {
      const q = M.clamp((p - r.a) / Math.max(1e-6, r.b - r.a));
      setS(r.over, 'clipPath', q >= 1 ? 'none' : `inset(0 ${(100 - q * 100).toFixed(2)}% 0 0)`);
      setS(r.base, 'clipPath', q <= 0 ? 'none' : `inset(0 0 0 ${(q * 100).toFixed(2)}%)`);
      const typing = q > 0 && q < 1;
      const resting = caretEnd && i === rows.length - 1 && q >= 1;
      setS(r.caret, 'visibility', typing || resting ? 'visible' : 'hidden');
      setS(r.caret, 'left', `${(q * 100).toFixed(2)}%`);
    });
  }

  // outline feature chip (header / sub row)
  function chipEl(text) {
    return E.h('div', { style: { padding: '6px 13px 7px', borderRadius: '999px', border: `1.5px solid ${LINE}`, background: WHITE, color: INK2,
      font: '600 20px/1.1 var(--sans)', whiteSpace: 'nowrap' }, text });
  }
  // the 「示意」 corner tag: card D's swatch strip and chat bubble each carry one, identical, right-aligned in one column
  const TAG_H = 20 + 5 + 6 + 3;         // ≈ its height: 20 px type at line-height 1 + padding + borders
  const LAB_H = 24;                     // the bubble's 「YOU」 label row
  function tagEl() {
    return E.h('div', { style: { justifySelf: 'end', padding: '5px 9px 6px', borderRadius: '7px', border: `1.5px solid ${LINE}`, background: WHITE,
      color: INK2, font: '600 20px/1 var(--cn)', whiteSpace: 'nowrap' }, text: '示意' });
  }

  // ---------- timing (shared by render and events) ----------
  function times(ctx) {
    const w = (l, word) => ctx.word(l, word);
    const T = {
      second: w(L1, '第二'), choose: w(L1, '选路线'), hf: w(L1, 'HyperFrames'), rm: w(L1, 'Remotion'), fit: w(L1, '适合'),
      u1: w(L1, '字幕'), u2: w(L1, '图表'), u3: w(L1, '界面'),
      want: w(L2, '想'), ctrl: w(L2, '掌控'), film: w(L2, '本片'), web: w(L2, '网页'), shot: w(L2, '截图'), browser: w(L2, '浏览器'),
      want2: w(L3, '想要'), style: w(L3, '现成'), lemo: w(L3, 'Lemo'), ju: w(L3, '句'), fj: w(L3, '分镜'),
    };
    T.enc = Math.min(T.browser + 0.32, T.want2 - 0.1);   // the pipeline completes before line 3
    T.sticker = (T.hf + T.rm) / 2;
    T.typeDur = { A: 0.6, B: 0.6, C: 0.8, D: 0.6 };
    T.typeAt = { A: T.hf, B: T.rm, C: T.film, D: T.lemo };
    T.bubble = T.lemo + 0.35;                             // inks while 「Lemo-Opuscar」 is still being said (amendment)
    T.bubbleDur = 0.9;
    T.capture = T.shot;                                   // the browser captures its frames on 「截图」
    return T;
  }

  Scene.define({
    id: ID,

    build(root, ctx) {
      const { h } = E;
      const T = times(ctx);
      K.bg(root, 'paper');

      // ---------- scroll viewport + grid ----------
      const vp = h('div', { class: 'fill' });
      const grid = h('div', { class: 'fill' });
      vp.append(grid);
      root.append(vp);

      const cards = ROUTES.map((R, i) => {
        const col = i % 2, rowIdx = Math.floor(i / 2);
        const wrap = h('div', { class: 'abs', style: { left: `${GX + col * (CW + GAP)}px`, top: `${GY + rowIdx * ROW}px`, width: `${CW}px`, height: `${CH}px` } });
        const card = h('div', { class: 'fill', style: { borderRadius: '20px', background: WHITE, border: `1.5px solid ${LINE}`, overflow: 'hidden' } });
        const body = h('div', { class: 'fill', style: { display: 'flex', flexDirection: 'column', padding: `24px ${PAD}px 18px` } });
        const bar = h('div', { class: 'abs', style: { left: '0px', top: '0px', bottom: '0px', width: '6px', background: GREEN, zIndex: '5', transformOrigin: '50% 50%' } });
        card.append(body, bar);
        wrap.append(card);
        grid.append(wrap);

        // header: badge + name · chips
        const head = h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px', flex: 'none' } });
        const left = h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px' } });
        const badge = h('div', { class: 'center', style: { width: '40px', height: '40px', borderRadius: '10px', background: CODE_BG, color: INK,
          font: '800 22px/1 var(--mono)', flex: 'none' }, text: R.key });
        const name = h('div', { style: { font: '800 44px/1.1 var(--cn)', color: INK, whiteSpace: 'nowrap' }, text: R.name });
        left.append(badge, name);
        const right = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', flex: 'none' } });
        (R.chips || []).forEach(c => right.append(chipEl(c)));
        let stamp = null;
        if (R.stamp) {
          stamp = h('div', { style: { padding: '8px 16px 9px', borderRadius: '999px', background: LIME, color: INK, font: '800 22px/1.1 var(--cn)',
            whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(36,30,30,.16)', opacity: '0' }, text: R.stamp });
          right.append(stamp);
        }
        head.append(left, right);
        body.append(head);

        // sub line (+ lime chips that pop on the spoken words)
        const subRow = h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', height: '38px', flex: 'none' } });
        const sub = h('div', { style: { font: '500 26px/1.4 var(--cn)', color: INK2, whiteSpace: 'nowrap' } });
        const pops = [];
        R.sub.forEach(sg => {
          if (!sg.cue) {
            sub.append(sg.arrow ? h('span', { style: { color: INK3, display: 'inline-block', margin: '0 9px' }, text: '→' }) : h('span', { text: sg.t }));
            return;
          }
          const w = h('span', { style: { position: 'relative', display: 'inline-block', padding: '0 4px', margin: '0 -1px' } });
          const bgEl = h('span', { style: { position: 'absolute', left: '0px', right: '0px', top: '4px', bottom: '3px', borderRadius: '8px', background: LIME,
            transformOrigin: '0 50%', transform: 'scaleX(0)' } });
          const tx = h('span', { style: { position: 'relative' }, text: sg.t });
          w.append(bgEl, tx);
          sub.append(w);
          pops.push({ w, bgEl, tx, cue: sg.cue });
        });
        subRow.append(sub);
        let subChip = null;
        if (R.subChip) { subChip = chipEl(R.subChip); subChip.style.transformOrigin = '50% 50%'; subRow.append(subChip); }
        body.append(subRow);

        // code band (full bleed inside the card)
        const band = h('div', { style: { margin: `14px ${-PAD}px 0`, padding: `12px ${PAD}px`, background: CODE_BG, flex: R.frames || R.swatches ? 'none' : '1 0 auto',
          font: `500 ${CODE_PX}px/${CODE_LH} var(--mono)`, color: INK, borderTop: '1px solid #E9E4E6', borderBottom: '1px solid #E9E4E6' } });
        const rows = R.code.map((line, k) => {
          const r = inkRow(shellTokens(line), tk => CODE_STYLE[tk.k] || {});
          const cue = R.lineCues && R.lineCues[k];
          if (cue) {
            // editor-style line highlight behind the command the voice is describing
            r.hl = h('div', { style: { position: 'absolute', left: `${-(PAD - 10)}px`, top: '1px', bottom: '1px', width: `${CW - 3 - 20}px`, zIndex: '0',
              borderRadius: '6px', background: 'rgba(201,223,141,.6)', transformOrigin: '0 50%', transform: 'scaleX(0)' } });
            r.row.prepend(r.hl);
            r.cue = cue;
          }
          band.append(r.row);
          return r;
        });
        schedule(rows);
        body.append(band);

        const out = { R, wrap, card, body, bar, badge, name, stamp, pops, subChip, rows, note: null };

        // card C: the browser's capture strip (frames drawn by PAGE.draw, the film's own page drawer)
        if (R.frames) {
          const cv = h('canvas', { width: FR_STRIP_W, height: FR_H, style: { display: 'block', width: `${FR_STRIP_W}px`, height: `${FR_H}px` } });
          const strip = h('div', { style: { marginTop: 'auto', flex: 'none', alignSelf: 'flex-start' } }, cv);
          body.append(strip);
          out.frames = { cv, g: cv.getContext('2d'), last: null };
        }

        // card D: swatch strip + chat bubble, laid out on one two-column grid — the illustrations share a right edge (the
        // strip's) and their identical 「示意」 tags share the column on the right, flush with the card's inner padding
        let ill = null;
        if (R.swatches || R.bubble) {
          ill = h('div', { style: { display: 'grid', gridTemplateColumns: `${SW_W}px 1fr`, rowGap: '14px', marginTop: '14px', flex: 'none' } });
          body.append(ill);
        }
        if (R.swatches) {
          const box = h('div', { style: { position: 'relative', width: `${SW_W}px`, height: `${SW_H}px`, gridArea: '1 / 1' } });
          const cv = h('canvas', { width: SW_W + 2 * SW_M, height: SW_H + 2 * SW_M, style: { position: 'absolute', left: `${-SW_M}px`, top: `${-SW_M}px`,
            width: `${SW_W + 2 * SW_M}px`, height: `${SW_H + 2 * SW_M}px` } });
          box.append(cv);
          const tag = tagEl();
          Object.assign(tag.style, { gridArea: '1 / 2', alignSelf: 'center' });
          ill.append(box, tag);
          out.sw = { cv, g: cv.getContext('2d'), list: makeSwatches(ctx) };
        }
        if (R.bubble) {
          const bub = h('div', { style: { gridArea: '2 / 1', justifySelf: 'end', padding: '12px 22px 14px', borderRadius: '18px 18px 6px 18px',
            background: BUBBLE_BG, border: '1.5px solid rgba(35,134,83,.35)', color: INK, font: '500 26px/1.45 var(--cn)' } });
          const lab = h('div', { style: { display: 'flex', alignItems: 'center', height: `${LAB_H}px`, marginBottom: '6px' } },
            h('span', { style: { font: '600 18px/1 var(--mono)', color: INK3, letterSpacing: '.05em' }, text: 'YOU' }));
          bub.append(lab);
          // the bubble's tag sits just outside its top-right corner, centred on the 「YOU」 label row
          const tag = tagEl();
          Object.assign(tag.style, { gridArea: '2 / 2', alignSelf: 'start', marginTop: `${(1.5 + 12 + LAB_H / 2 - TAG_H / 2).toFixed(1)}px` });
          ill.append(bub, tag);
          let mark = null, under = null;
          const brows = BUBBLE.map(toks => {
            const r = inkRow(toks, () => ({}), GREEN);
            const mi = toks.findIndex(tk => tk.mark);
            if (mi >= 0) {
              // a hidden copy of the line carries the marker exactly under the marked words
              const layer = h('div', { style: { position: 'absolute', left: '0px', top: '0px', zIndex: '0', color: 'transparent' } });
              toks.forEach((tk, k) => {
                if (k !== mi) { layer.append(h('span', { text: tk.s })); return; }
                const sp = h('span', { style: { position: 'relative', display: 'inline-block' } });
                mark = h('span', { style: { position: 'absolute', left: '-4px', right: '-4px', top: '20%', bottom: '4%', borderRadius: '6px', background: LIME,
                  transformOrigin: '0 50%', transform: 'scaleX(0)' } });
                under = h('span', { style: { position: 'absolute', left: '0px', right: '0px', bottom: '2%', height: '3px', borderRadius: '2px', background: GREEN,
                  transformOrigin: '0 50%', transform: 'scaleX(0)' } });
                sp.append(mark, under, document.createTextNode(tk.s));
                layer.append(sp);
              });
              r.row.prepend(layer);
            }
            bub.append(r.row);
            return r;
          });
          schedule(brows);
          out.bubble = { el: bub, rows: brows, mark, under };
        }

        // note (anchored to the card bottom)
        const note = h('div', { style: { marginTop: 'auto', paddingTop: '10px', font: '500 20px/1.4 var(--cn)', color: INK2, flex: 'none' } },
          R.note.map(n => h('div', { style: { whiteSpace: 'nowrap' }, text: n })));
        body.append(note);
        out.note = note;
        return out;
      });

      // ---------- fixed layer ----------
      const fixed = h('div', { class: 'fill', style: { zIndex: '20' } });
      root.append(fixed);
      const h3 = K.title('第二步 · 选一条路线', { size: H3_PX, weight: 800, color: 'var(--ink)', lh: 1.0, ls: '0.01em', stagger: 0.03, dur: 0.7, rise: 0.5 });
      Object.assign(h3.el.style, { position: 'absolute', left: `${H3_X}px`, top: `${H3_Y}px`, width: 'max-content' });
      fixed.append(h3.el);
      // mini-map of the 2×2 grid: the visible row is ink, the active card green
      const map = h('div', { class: 'abs', style: { top: `${H3_Y + H3_PX / 2 - 16}px`, width: '50px', height: '32px' } });
      const cells = [0, 1, 2, 3].map(i => {
        const c = h('div', { class: 'abs', style: { left: `${(i % 2) * 27}px`, top: `${Math.floor(i / 2) * 18}px`, width: '23px', height: '14px', borderRadius: '4px',
          border: `1.5px solid ${LINE}`, background: WHITE } });
        map.append(c);
        return c;
      });
      fixed.append(map);
      const sticker = K.sticker('暂停就能抄');
      Object.assign(sticker.el.style, { left: `${STICK.x}px`, top: `${STICK.y}px`, opacity: '0' });
      fixed.append(sticker.el);
      const foot = h('div', { class: 'abs', style: { left: '112px', top: '862px', font: '500 20px/1.3 var(--cn)', color: INK2, whiteSpace: 'nowrap' }, text: FOOT });
      fixed.append(foot);

      const rail = K.stepRail();
      root.append(rail.el);

      return { T, vp, grid, cards, h3, map, cells, sticker, foot, rail, mapX: null };
    },

    render(s, t, ctx) {
      const { tf } = E;
      const { clamp, lerp, prog, ease, spring, mixColor } = M;
      const T = s.T;

      // ---- rail: the lime pill hops 1 → 2 once the page has turned far enough to show it ----
      s.rail.render(Math.max(0, t - RAIL_DELAY), 1, 0);

      // ---- H3 + mini-map ----
      s.h3.render(t, T.second);
      if (s.mapX == null) s.mapX = H3_X + s.h3.el.offsetWidth + 26;
      setS(s.map, 'left', `${s.mapX}px`);
      const mapIn = prog(t, T.choose, 0.45, ease.outCubic);
      setS(s.map, 'transform', `translate(${((1 - mapIn) * -14).toFixed(2)}px,0px)`);
      setS(s.map, 'opacity', mapIn.toFixed(4));

      // ---- sticker & footnote ----
      // carried from s15 (ctx.prev is only known after every build, so it is read here): already stuck at s15's on-screen
      // pose (its page's push-in scales the sticker and its spot about (960, 540)), then on T.sticker a short lifted glide
      // to (1560, 214). Without s15 before it, the kit's slap.
      if (ctx.prev && ctx.prev.id === 's15_env') {
        if (s.stW == null) { s.stW = s.sticker.el.offsetWidth; s.stH = s.sticker.el.offsetHeight; }
        const P = S15_STICK.push;
        const dx0 = S15_STICK.ox + P * (S15_STICK.x + s.stW / 2 - S15_STICK.ox) - (STICK.x + s.stW / 2);
        const dy0 = S15_STICK.oy + P * (S15_STICK.y + s.stH / 2 - S15_STICK.oy) - (STICK.y + s.stH / 2);
        const p = clamp((t - T.sticker) / STICK.dur);
        const e = ease.inOutCubic(p), lift = Math.sin(Math.PI * p);
        tf(s.sticker.el, { x: lerp(dx0, 0, e), y: lerp(dy0, 0, e), s: lerp(P, 1, e) * (1 + 0.05 * lift), r: -4 + 1.5 * lift, o: 1 });
        setS(s.sticker.el, 'boxShadow', `0 ${(10 + 10 * lift).toFixed(1)}px ${(24 + 14 * lift).toFixed(1)}px rgba(36,30,30,${(0.14 + 0.05 * lift).toFixed(3)})`);
      } else {
        s.sticker.render(t, T.sticker);
      }
      // the source footnote is printed on the page: the wipe-up uncovers it first, and it stays for the whole scene

      // ---- scroll ----
      const sp = prog(t, T.want, SCROLL_DUR, ease.inOutCubic);
      const scrolling = t >= T.want && sp < 1;
      setS(s.grid, 'transform', `translate3d(0,${(-ROW * sp).toFixed(2)}px,0)`);
      setS(s.vp, 'webkitMaskImage', scrolling ? SCROLL_MASK : 'none');
      setS(s.vp, 'maskImage', scrolling ? SCROLL_MASK : 'none');

      // ---- per-card state ----
      // highlight windows [on, off) and dim windows; off = null holds to the end
      const HL = { A: [T.hf, T.rm], B: [T.rm, T.fit], C: [T.film, T.want2], D: [T.lemo, null] };
      const DIM = { A: [T.rm, T.fit], B: [T.hf, T.rm], C: [T.lemo, null], D: [T.film, T.want2] };
      const win = (w, fi, fo) => Math.min(prog(t, w[0], fi, ease.outCubic), w[1] == null ? 1 : 1 - prog(t, w[1], fo, ease.inOutCubic));
      const hlState = {};

      s.cards.forEach((c, i) => {
        const key = c.R.key;
        const rowIdx = Math.floor(i / 2);
        const visible = rowIdx === 0 ? sp < 1 : t >= T.want;
        setS(c.wrap, 'visibility', visible ? 'visible' : 'hidden');
        const hl = win(HL[key], 0.28, 0.32);
        hlState[key] = hl;
        // hidden cards are still updated (no early return), so the DOM is the same whatever frame came before

        // entrance (row 1 rises with the page turn; row 2 arrives with the scroll)
        let ey = 0, eo = 1;
        if (rowIdx === 0) {
          const st = 0.3 + (i % 2) * 0.15;
          ey = (1 - prog(t, st, 0.7, ease.outQuint)) * 56;
          eo = prog(t, st, 0.35, ease.outCubic);
        }
        const dim = win(DIM[key], 0.3, 0.32);
        const out = HL[key][1] == null ? 0 : prog(t, HL[key][1], 0.32, ease.inOutCubic);
        const grow = clamp(spring(t - HL[key][0], { stiffness: 320, damping: 19 }), 0, 1.25) * (1 - out);
        // 2D transform on purpose: a translate3d would give each card its own compositor layer, whose raster scale Chrome
        // keeps from earlier frames (after the 1.5 % highlight scale), so out-of-order stills could differ by a sub-pixel
        setS(c.wrap, 'transform', `translate(0px,${ey.toFixed(2)}px) scale(${(1 + 0.015 * grow).toFixed(4)})`);
        setS(c.wrap, 'opacity', (eo * (1 - 0.3 * dim)).toFixed(4));
        setS(c.card, 'borderColor', mixColor(LINE, '#8CC0A2', hl));
        setS(c.card, 'boxShadow', `0 ${lerp(8, 26, hl).toFixed(1)}px ${lerp(24, 58, hl).toFixed(1)}px rgba(36,30,30,${lerp(0.06, 0.15, hl).toFixed(3)})`);
        const barIn = prog(t, HL[key][0], 0.3, ease.outCubic);
        setS(c.bar, 'transform', `scaleY(${barIn.toFixed(4)})`);
        setS(c.bar, 'opacity', hl.toFixed(4));
        setS(c.badge, 'background', mixColor(CODE_BG, GREEN, hl));
        setS(c.badge, 'color', mixColor(INK, WHITE, hl));

        // code: 35 % ink until its name is spoken, then it inks on with a caret; the caret rests while the card is lit
        const tp = prog(t, T.typeAt[key], T.typeDur[key], ease.linear);
        const typedAt = T.typeAt[key] + T.typeDur[key];
        let rest = hl > 0.5 && t >= typedAt && Math.floor((t - typedAt) * 2.2) % 2 === 0;
        if (c.bubble && t >= T.bubble) rest = false;            // the caret moves on to the bubble
        sweep(c.rows, tp, rest);

        c.rows.forEach(r => {
          if (!r.hl) return;
          const k = Math.min(prog(t, T[r.cue], 0.3, ease.outCubic), 1 - prog(t, T.want2, 0.35, ease.inOutCubic));
          setS(r.hl, 'transform', `scaleX(${prog(t, T[r.cue], 0.3, ease.outCubic).toFixed(4)})`);
          setS(r.hl, 'opacity', k.toFixed(3));
        });

        // sub-line chips
        c.pops.forEach(pp => {
          const at = T[pp.cue];
          const k = prog(t, at, 0.26, ease.outCubic);
          setS(pp.bgEl, 'transform', `scaleX(${k.toFixed(4)})`);
          setS(pp.tx, 'color', mixColor(INK2, INK, k));
          const bump = t >= at ? 0.09 * Math.sin(Math.PI * clamp((t - at) / 0.3)) : 0;
          setS(pp.w, 'transform', bump > 0.0005 ? `scale(${(1 + bump).toFixed(4)})` : 'none');
        });

        // card C extras
        if (c.stamp) K.pop(c.stamp, t, T.film, { from: 1.4, stiffness: 300, damping: 17 });
        if (c.subChip) {
          const k = prog(t, T.ctrl, 0.25, ease.outCubic);
          const sp2 = t >= T.ctrl ? spring(t - T.ctrl, { stiffness: 340, damping: 16 }) : 0;
          setS(c.subChip, 'transform', t >= T.ctrl ? `scale(${lerp(1.18, 1, clamp(sp2, 0, 1.3)).toFixed(4)})` : 'none');
          setS(c.subChip, 'borderColor', mixColor(LINE, GREEN, k));
          setS(c.subChip, 'color', mixColor(INK2, GDEEP, k));
          setS(c.subChip, 'background', mixColor(WHITE, BUBBLE_BG, k));
        }
        if (c.frames && visible) drawFrames(c.frames, t, T);
        if (c.R.noteCue) {
          const k = prog(t, T[c.R.noteCue], 0.45, ease.outCubic);
          setS(c.note, 'transform', `translate(0px,${((1 - k) * 10).toFixed(2)}px)`);
          setS(c.note, 'opacity', k.toFixed(4));
        }

        // card D extras
        if (c.sw && visible) drawSwatches(c.sw, t, T);
        if (c.bubble) {
          const bp = prog(t, T.bubble, T.bubbleDur, ease.linear);
          sweep(c.bubble.rows, bp, false);
          setS(c.bubble.under, 'transform', `scaleX(${prog(t, T.ju, 0.3, ease.inOutCubic).toFixed(4)})`);
          const mk = prog(t, T.fj, 0.35, ease.inOutCubic);
          setS(c.bubble.mark, 'transform', `scaleX(${mk.toFixed(4)})`);
          setS(c.bubble.under, 'opacity', (1 - prog(t, T.fj + 0.15, 0.3)).toFixed(3));
        }
      });

      // ---- mini-map ----
      s.cells.forEach((cell, i) => {
        const rowIdx = Math.floor(i / 2);
        const seen = rowIdx === 0 ? 1 - sp : sp;
        const key = ROUTES[i].key;
        const lit = hlState[key] || 0;
        setS(cell, 'background', mixColor(mixHex(WHITE, '#9C9496', seen), GREEN, lit));
        setS(cell, 'borderColor', mixColor(LINE, lit > 0.5 ? GREEN : '#9C9496', Math.max(seen, lit)));
      });
    },

    events(ctx) {
      const T = times(ctx);
      const out = [];
      const typing = (t0, dur, n, gain = 0.09) => { for (let i = 0; i < n; i++) out.push({ t: t0 + (i * dur) / n, type: 'type', gain }); };
      out.push({ t: T.hf, type: 'blip', gain: 0.3 });
      typing(T.hf + 0.04, T.typeDur.A, 7);
      // the sticker comes over from s15 already stuck and only glides 55 px: silent (it slaps, with its pop, only without s15)
      if (!(ctx.prev && ctx.prev.id === 's15_env')) out.push({ t: T.sticker, type: 'pop', gain: 0.4 });
      out.push({ t: T.rm, type: 'blip', gain: 0.3 });
      typing(T.rm + 0.04, T.typeDur.B, 7);
      for (const u of [T.fit, T.u1, T.u2, T.u3]) out.push({ t: u, type: 'tick', gain: 0.2 });   // B's 「同样适合」, then A's three uses
      out.push({ t: T.want, type: 'swish', gain: 0.35 });
      out.push({ t: T.ctrl, type: 'tick', gain: 0.22 });
      out.push({ t: T.film, type: 'pop', gain: 0.42 });
      typing(T.film + 0.06, T.typeDur.C, 8);
      out.push({ t: T.web, type: 'tick', gain: 0.18 });
      out.push({ t: T.capture, type: 'shutter', gain: 0.22 });
      out.push({ t: T.browser, type: 'blip', gain: 0.18 });
      out.push({ t: T.style, type: 'sparkle', gain: 0.22 });
      out.push({ t: T.lemo, type: 'blip', gain: 0.3 });
      // D's code and the bubble ink back to back (slightly overlapping): one steady typing stream across both
      typing(T.lemo + 0.04, T.bubble + T.bubbleDur - (T.lemo + 0.04), 10, 0.08);
      out.push({ t: T.ju, type: 'tick', gain: 0.12 });
      out.push({ t: T.fj, type: 'ding', gain: 0.45 });
      return out;
    },
  });

  // hex → hex mix (M.mixColor returns rgb(), which it cannot take back as input)
  function mixHex(a, b, p) {
    const A = M.hex2rgb(a), B = M.hex2rgb(b);
    return '#' + A.map((v, i) => Math.round(M.lerp(v, B[i], M.clamp(p))).toString(16).padStart(2, '0')).join('');
  }

  // ---------- capture strip ----------
  function drawFrames(F, t, T) {
    const { clamp } = M;
    // state key: only redraw when something visible changes
    const caps = [];
    for (let i = 0; i < FR_N; i++) caps.push(clamp((t - (T.capture + i * 0.07)) / 0.3));
    const key = caps.map(v => v.toFixed(3)).join(',');
    if (F.last === key) return;
    F.last = key;
    const g = F.g;
    g.clearRect(0, 0, FR_STRIP_W, FR_H);
    for (let i = 0; i < FR_N; i++) {
      const x = i * (FR_W + FR_GAP);
      const q = caps[i];
      rr(g, x + 0.75, 0.75, FR_W - 1.5, FR_H - 1.5, 8);
      if (q <= 0) {
        g.fillStyle = CODE_BG; g.fill();
        g.setLineDash([5, 4]); g.lineWidth = 1.5; g.strokeStyle = '#CFC8CC'; g.stroke(); g.setLineDash([]);
        continue;
      }
      g.save();
      rr(g, x, 0, FR_W, FR_H, 8); g.clip();
      g.translate(x, 0);
      window.PAGE.draw(g, i * 0.4, FR_W, FR_H);
      g.translate(-x, 0);
      // capture flash
      if (q < 1) { g.fillStyle = `rgba(255,255,255,${((1 - q) * (1 - q) * 0.95).toFixed(3)})`; g.fillRect(x, 0, FR_W, FR_H); }
      g.restore();
    }
  }

  // ---------- swatches ----------
  const PALS = [
    ['#241E1E', '#C9DF8D', '#AD85BA'], ['#F6F4F5', '#238653', '#103CA0'], ['#EAD8EB', '#AD85BA', '#103CA0'], ['#103CA0', '#EAD8EB', '#C9DF8D'],
    ['#176A42', '#C9DF8D', '#F4F1F2'], ['#C9DF8D', '#241E1E', '#238653'], ['#1B1718', '#F4F1F2', '#AD85BA'], ['#E9F3EC', '#238653', '#241E1E'],
    ['#AD85BA', '#F4F1F2', '#241E1E'], ['#F3F0F1', '#5D5656', '#AD85BA'], ['#2A2425', '#EAD8EB', '#C9DF8D'], ['#F4F1F2', '#103CA0', '#C9DF8D'],
  ];
  const KINDS = ['brush', 'dots', 'stripes', 'grad', 'grain', 'rings', 'wave', 'check', 'blob'];
  function makeSwatches(ctx) {
    const r = ctx.rng('swatches');
    const list = [];
    for (let i = 0; i < SW_N; i++) {
      const kind = i === PICK ? 'brush' : KINDS[(i * 5 + Math.floor(r() * 3)) % KINDS.length];
      const pal = i === PICK ? ['#EAD8EB', '#AD85BA', '#103CA0'] : PALS[Math.floor(r() * PALS.length)];
      const grain = [];
      for (let k = 0; k < 46; k++) grain.push([r(), r(), r() < 0.5 ? 1 : 2, r()]);
      list.push({ kind, pal, a: r() * Math.PI * 2, ph: r() * 10, sp: 0.6 + r() * 0.8, grain,
        col: i < SW_COLS ? i : i - SW_COLS, row: i < SW_COLS ? 0 : 1 });
    }
    return list;
  }
  function drawSwatches(S, t, T) {
    const { clamp, ease, spring, lerp } = M;
    const g = S.g;
    g.clearRect(0, 0, SW_W + 2 * SW_M, SW_H + 2 * SW_M);
    const pickT = T.bubble + T.bubbleDur * (10 / 62);     // when the bubble's ink passes 「水彩笔刷」
    const order = [];
    S.list.forEach((sw, i) => { if (i !== PICK) order.push(i); });
    order.push(PICK);                                       // the picked swatch draws on top
    order.forEach(i => {
      const sw = S.list[i];
      const x = SW_M + sw.col * (SW + SW_GAP), y = SW_M + sw.row * (SW + SW_GAP);
      // ripple on 「现成风格」: a wave runs left → right
      const r0 = T.style + sw.col * 0.024 + sw.row * 0.05;
      const rq = clamp((t - r0) / 0.38);
      let k = 1 + 0.2 * Math.sin(Math.PI * rq) * (rq > 0 && rq < 1 ? 1 : 0);
      let lift = -4 * Math.sin(Math.PI * rq) * (rq > 0 && rq < 1 ? 1 : 0);
      let pk = 0;
      if (i === PICK) {
        pk = clamp(spring(t - pickT, { stiffness: 300, damping: 18 }), 0, 1.3);
        k *= lerp(1, 1.22, pk);
      }
      const cx = x + SW / 2, cy = y + SW / 2 + lift;
      g.save();
      g.translate(cx, cy); g.scale(k, k); g.translate(-SW / 2, -SW / 2);
      drawPattern(g, sw, t);
      if (pk > 0.001) {
        g.lineWidth = 2.2 / k;
        g.strokeStyle = `rgba(255,255,255,${clamp(pk).toFixed(3)})`;
        rr(g, -1.5, -1.5, SW + 3, SW + 3, 7); g.stroke();
        g.strokeStyle = `rgba(35,134,83,${clamp(pk).toFixed(3)})`;
        g.lineWidth = 2.6 / k;
        rr(g, -4, -4, SW + 8, SW + 8, 9); g.stroke();
      }
      g.restore();
    });
  }
  function drawPattern(g, sw, t) {
    const s = SW, [bg, fg, fg2] = sw.pal;
    const tt = t * sw.sp + sw.ph;
    g.save();
    rr(g, 0, 0, s, s, 6); g.clip();
    g.fillStyle = bg; g.fillRect(0, 0, s, s);
    switch (sw.kind) {
      case 'brush': {
        g.lineCap = 'round';
        [[fg, 0.26, 0], [fg2, 0.16, 1.7], [fg, 0.1, 3.1]].forEach(([c, wdt, o]) => {
          g.strokeStyle = c; g.lineWidth = s * wdt; g.globalAlpha = 0.85;
          const w1 = Math.sin(tt * 0.9 + o) * s * 0.12;
          g.beginPath();
          g.moveTo(s * 0.1, s * (0.3 + 0.2 * o / 3) + w1);
          g.bezierCurveTo(s * 0.4, s * (0.05 + 0.25 * o / 3) - w1, s * 0.55, s * (0.95 - 0.2 * o / 3) + w1, s * 0.92, s * (0.6 - 0.15 * o / 3));
          g.stroke();
        });
        g.globalAlpha = 1;
        break;
      }
      case 'dots': {
        g.fillStyle = fg;
        for (let yy = 0; yy < 4; yy++) for (let xx = 0; xx < 4; xx++) {
          const rad = s * (0.05 + 0.045 * (1 + Math.sin(tt * 1.4 + (xx + yy) * 0.9)));
          g.beginPath(); g.arc(s * (0.14 + xx * 0.24), s * (0.14 + yy * 0.24), rad, 0, Math.PI * 2); g.fill();
        }
        break;
      }
      case 'stripes': {
        g.save(); g.translate(s / 2, s / 2); g.rotate(sw.a); g.fillStyle = fg;
        const off = ((tt * 6) % 10) - 10;
        for (let xx = -s + off; xx < s; xx += 10) g.fillRect(xx, -s, 4.5, 2 * s);
        g.restore();
        break;
      }
      case 'grad': {
        const a = sw.a + tt * 0.25, dx = Math.cos(a) * s / 2, dy = Math.sin(a) * s / 2;
        const gr = g.createLinearGradient(s / 2 - dx, s / 2 - dy, s / 2 + dx, s / 2 + dy);
        gr.addColorStop(0, fg); gr.addColorStop(1, fg2);
        g.fillStyle = gr; g.fillRect(0, 0, s, s);
        break;
      }
      case 'grain': {
        const shift = (tt * 2) % s;
        sw.grain.forEach(([gx, gy, sz, c]) => {
          g.fillStyle = c < 0.5 ? fg : fg2;
          g.fillRect(((gx * s + shift) % s), gy * s, sz, sz);
        });
        break;
      }
      case 'rings': {
        g.strokeStyle = fg; g.lineWidth = 2;
        const ph = (tt * 4) % 7;
        for (let rad = ph; rad < s; rad += 7) { g.beginPath(); g.arc(s * 0.3, s * 0.7, rad, 0, Math.PI * 2); g.stroke(); }
        break;
      }
      case 'wave': {
        g.strokeStyle = fg; g.lineWidth = 2.2;
        for (let k = 0; k < 4; k++) {
          g.beginPath();
          for (let xx = 0; xx <= s; xx += 2) {
            const yy = s * (0.2 + k * 0.2) + Math.sin(xx * 0.32 + tt * 2 + k) * 3;
            if (xx === 0) g.moveTo(xx, yy); else g.lineTo(xx, yy);
          }
          g.stroke();
        }
        break;
      }
      case 'check': {
        const n = 4, c = s / n, off = (tt * 3) % (2 * c);
        g.fillStyle = fg;
        for (let yy = -1; yy <= n; yy++) for (let xx = -2; xx <= n; xx++) if ((xx + yy) % 2 === 0) g.fillRect(xx * c + off, yy * c, c, c);
        break;
      }
      case 'blob': {
        const bx = s * (0.5 + 0.22 * Math.sin(tt * 0.8)), by = s * (0.5 + 0.22 * Math.cos(tt * 0.7));
        const gr = g.createRadialGradient(bx, by, 1, bx, by, s * 0.75);
        gr.addColorStop(0, fg); gr.addColorStop(0.55, fg2); gr.addColorStop(1, bg);
        g.fillStyle = gr; g.fillRect(0, 0, s, s);
        break;
      }
      default: break;
    }
    g.restore();
  }
  function rr(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
})();
