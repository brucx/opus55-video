/*
 * s17_prompt — Step 3: a filled template; style words become checkable rules.
 *
 * Phase 1 (第三步…哪些不能改): page 3 of the worksheet. 需求.txt rises centred, so the template is the only subject. Its
 *   title 「需求.txt · 整段发给 Claude Code」 says how the page is used: the whole text goes to the `claude` session of step 1.
 *   Each spoken question lands on the slot that answers it: a lime marker sweeps behind the answer, a dotted leader runs
 *   to a note naming the question (给谁看 / 记住什么 / 多长 / 不能改 · 可以改), and the editor's current-line band
 *   follows the voice.
 * Phase 2 (风格…主信息): the window glides to the storyboard position (112, 228) to make room. 「高级感、电影感」 is struck
 *   and BEFORE drops in (four fonts, three colours, five messages: 看不出对错); the rules line is typed under it and AFTER
 *   drops in (one message, two sizes, one green accent). On 「每屏」 the rule is marked and ticked, and AFTER pulses.
 * Sticker 「暂停就能抄」 (amendment): slaps on at (1560, 214) at 0.5 s beside the centred template. On 风格 it is lifted
 *   and re-stuck on the window's top-right corner as the window glides, so it keeps labelling the template rather than
 *   the BEFORE frame (a bad example) that takes over the right column.
 * Tail: lines 9–10 get a soft underline sweep for pausers; line 10's three deliverables become s18's pipeline.
 * Every time comes from ctx.word(); render() is a pure function of t and holds its end state past ctx.dur.
 */
(() => {
  'use strict';
  const ID = 's17_prompt';
  const INK = '#241E1E', INK2 = '#5D5656', GREEN = '#238653', DEEP = '#176A42', LIME = '#C9DF8D', MUTE = '#A39A9B';

  // ---- layout (stage px) ----
  const WIN = { w: 1040, h: 590, y: 228 };
  WIN.x1 = (1920 - WIN.w) / 2;                  // phase 1: centred
  WIN.x2 = 112;                                 // phase 2: storyboard position
  const PAD_L = 34, PAD_T = 22, INNER_W = WIN.w - 2 * PAD_L;
  const FS = 30, ROW_H = 45, GROUP_GAP = 13;
  const FR = { x: 1252, w: 544, h: 306, yB: 236, yA: 566, k: 544 / 512 };   // right column: BEFORE / AFTER (content drawn at 512×288)
  const RAIL_DELAY = 0.42;                      // the wipe-up uncovers the rail at ≈0.4 s: hop 2 → 3 after that
  const STICK = { x: 1560, y: 214, t: 0.5, dx: -128, dy: 0, dur: 0.78 };   // amendment position; on 风格 it re-sticks to the window corner
  const GLIDE_DUR = 0.8;

  // ---- the template (storyboard + amendment: line 10 「三张效果图」) ----
  // segments: 'plain' | {slot} ［…］ green-deep 700 | {strike} | {key} markable | {u} underlined
  const ROWS = [
    { g: 0, segs: ['我要为', { slot: '新同事' }, '做一支', { slot: '自我介绍' }, '视频。'], note: '给谁看', at: 'who' },
    { g: 0, segs: ['看完要记住：', { slot: '我做数据可视化，也爱跑步' }], note: '记住什么', at: 'mem' },
    { g: 1, segs: ['规格：', { slot: '20 秒' }, { slot: '16:9' }, { slot: '1920×1080' }, { slot: '每秒 30 帧' }], note: '多长', at: 'len' },
    { g: 1, segs: ['已有素材：', { slot: '一张头像、三个关键词' }] },
    { g: 1, segs: ['必须保持：', { slot: '名字和头像' }], note: '不能改', icon: 'lock', at: 'keep' },
    { g: 1, segs: ['允许发挥：', { slot: '镜头、转场、背景' }], note: '可以改', icon: 'open', at: 'free', loose: true },
    { g: 2, segs: ['风格：', { strike: '高级感、电影感' }] },
    { g: 2, segs: ['规则：两种字号 · ', { key: '每屏一个主信息' }, ' · 强调色只给高潮'], typed: true },
    { g: 3, segs: [{ u: '先列出缺口；不确定的，不要写成事实。' }] },
    { g: 3, segs: ['本轮只交：', { u: '分镜表' }, '、', { u: '三张效果图' }, '、', { u: '一个小样' }, '。'] },
  ];
  const TYPED = ROWS.findIndex(r => r.typed);

  // row tops inside the body; q = how far the typed rules line has been inserted (0 → 1)
  function layout(q) {
    const tops = [], hs = [];
    let y = 0;
    ROWS.forEach((r, i) => {
      if (i > 0 && r.g !== ROWS[i - 1].g) y += GROUP_GAP;
      const hh = r.typed ? ROW_H * q : ROW_H;
      tops.push(y); hs.push(hh);
      y += hh;
    });
    return { tops, hs };
  }

  // BEFORE: 「高级感、电影感」 taken literally — four fonts, three colours, five small messages, nothing leads
  const BEFORE_MSGS = [
    { text: '大家好！', font: '900 46px/1 var(--serif)', color: '#FFFFFF', x: 26, y: 22, r: -6, shadow: true },
    { text: '我做数据可视化', font: '800 26px/1 var(--cn)', color: LIME, x: 262, y: 80, r: 4 },
    { text: '也爱跑步！', font: '600 22px/1 var(--mono)', color: '#EAD8EB', x: 42, y: 124, r: -3 },
    { text: 'DATA × RUN', font: '700 38px/1 var(--display)', color: 'rgba(255,255,255,.55)', x: 168, y: 150, r: 0, ls: '.14em' },
    { text: '欢迎来找我聊天～', font: '300 18px/1 var(--cn)', color: '#F4F1F2', x: 304, y: 228, r: 2 },
  ];
  const SPARKS = [
    { x: 474, y: 92, s: 16, c: LIME, ph: 0.0 }, { x: 214, y: 30, s: 11, c: '#FFFFFF', ph: 1.7 },
    { x: 138, y: 206, s: 14, c: '#EAD8EB', ph: 3.1 }, { x: 452, y: 196, s: 10, c: '#FFFFFF', ph: 4.4 },
  ];

  Scene.define({
    id: ID,

    build(root, ctx) {
      const { h, s: S } = E;
      const L1 = `${ID}.1`, L2 = `${ID}.2`;
      const T = {
        tpl: ctx.word(L1, '模板'), req: ctx.word(L1, '需求'),
        who: ctx.word(L1, '谁'), mem: ctx.word(L1, '记住'), len: ctx.word(L1, '多'),
        keep: ctx.word(L1, '不能'), free: ctx.word(L1, '改'),
        style: ctx.word(L2, '风格'), fancy: ctx.word(L2, '高级'), check: ctx.word(L2, '检查'),
        one: ctx.word(L2, '每个'), end2: ctx.cueEnd(L2),
      };
      T.glide = T.style - 0.12;
      T.hop = T.style - 0.06;
      T.before = T.fancy + 0.08;
      T.type0 = T.check + 0.06;
      T.typeDur = 0.82;
      T.after = T.check + 0.08;
      T.sweep = T.end2 - 0.34;                     // ≈10.6: lines 9–10 underline sweep (no voice)
      T.end = ctx.dur + 0.6;

      K.bg(root, 'paper');

      // ---- document group: window + caption ----
      const doc = h('div', { class: 'abs', style: { left: `${WIN.x2}px`, top: `${WIN.y}px`, width: `${WIN.w}px`, height: `${WIN.h + 60}px` } });
      root.append(doc);
      const win = K.windowFrame({ w: WIN.w, h: WIN.h, title: '需求.txt', light: true });
      Object.assign(win.el.style, { left: '0px', top: '0px' });
      win.body.style.padding = '0';
      doc.append(win.el);

      // title 「需求.txt · 整段发给 Claude Code」 (20 px, the "name · how to use it" pattern of s15's terminal title): it says
      // where this page goes — the `claude` session from step 1. The lime marker (on 需求) covers only the file name.
      const titleSpan = win.el.firstChild.lastChild;
      titleSpan.textContent = '';
      Object.assign(titleSpan.style, { display: 'flex', alignItems: 'center', font: '600 20px/1 var(--mono)', color: INK2, whiteSpace: 'nowrap' });
      const fileSpan = h('span', { style: { position: 'relative', padding: '5px 8px' } });
      const titleMk = h('span', { class: 'abs', style: { left: '0px', right: '0px', top: '3px', bottom: '3px', borderRadius: '6px', background: LIME,
        transformOrigin: '0 50%', transform: 'scaleX(0)' } });
      fileSpan.append(titleMk, h('span', { style: { position: 'relative' }, text: '需求.txt' }));
      // 12 px: once the marker is on (2.1 s → end) the dot sits midway between the lime box and 整
      titleSpan.append(fileSpan, h('span', { style: { marginLeft: '12px', fontWeight: '500' }, text: '· 整段发给 Claude Code' }));

      // current-line band (editor style)
      const band = h('div', { class: 'abs', style: { left: `${PAD_L - 18}px`, width: `${INNER_W + 36}px`, top: '0px', height: '45px', borderRadius: '10px',
        background: 'rgba(35,134,83,.075)', opacity: '0' } });
      const bandBar = h('div', { class: 'abs', style: { left: '0px', top: '7px', bottom: '7px', width: '5px', borderRadius: '3px', background: GREEN } });
      band.append(bandBar);
      win.body.append(band);

      const marker = () => h('span', { class: 'abs', style: { left: '-3px', right: '-3px', bottom: '0px', height: '15px', borderRadius: '3px',
        background: LIME, transformOrigin: '0 50%', transform: 'scaleX(0)' } });

      const rows = ROWS.map((r, i) => {
        const el = h('div', { class: 'abs', style: { left: `${PAD_L}px`, top: `${PAD_T}px`, width: `${INNER_W}px`, height: `${ROW_H}px`,
          display: 'flex', alignItems: 'center' } });
        const text = h('div', { style: { position: 'relative', flex: 'none', font: `500 ${FS}px/1 var(--cn)`, color: INK, whiteSpace: 'nowrap' } });
        const parts = { slots: [], strike: null, key: null, unders: [], typed: [] };
        r.segs.forEach(sg => {
          if (typeof sg === 'string') {
            const sp = h('span', { text: sg });
            text.append(sp);
            parts.typed.push({ node: sp, text: sg });
          } else if (sg.slot != null) {
            const wrap = h('span', { style: { color: DEEP, fontWeight: '700' } });
            const inner = h('span', { style: { position: 'relative', display: 'inline-block' } });
            const glint = h('span', { class: 'abs', style: { left: '-4px', right: '-4px', top: '-5px', bottom: '-6px', borderRadius: '7px',
              background: 'rgba(35,134,83,.16)', opacity: '0' } });
            const mk = marker();
            const box = r.loose ? h('span', { class: 'abs', style: { left: '-7px', right: '-7px', top: '-7px', bottom: '-8px', borderRadius: '9px',
              border: `2px dashed ${GREEN}`, opacity: '0' } }) : null;
            inner.append(glint, mk);
            if (box) inner.append(box);
            inner.append(h('span', { style: { position: 'relative' }, text: sg.slot }));
            wrap.append('［', inner, '］');
            text.append(wrap);
            parts.slots.push({ glint, mk, box });
          } else if (sg.strike != null) {
            const wrap = h('span', { style: { position: 'relative', display: 'inline-block' } });
            const tx = h('span', { text: sg.strike });
            const line = h('span', { class: 'abs', style: { left: '-5px', right: '-5px', top: '15px', height: '4px', borderRadius: '2px', background: INK,
              transformOrigin: '0 50%', transform: 'scaleX(0)' } });
            wrap.append(tx, line);
            text.append(wrap);
            parts.strike = { tx, line };
          } else if (sg.key != null) {
            const inner = h('span', { style: { position: 'relative', display: 'inline-block' } });
            const mk = marker();
            const tx = h('span', { style: { position: 'relative' } });
            inner.append(mk, tx);
            text.append(inner);
            parts.key = { mk };
            parts.typed.push({ node: tx, text: sg.key });
          } else if (sg.u != null) {
            const inner = h('span', { style: { position: 'relative', display: 'inline-block' } });
            const ul = h('span', { class: 'abs', style: { left: '0px', right: '0px', bottom: '-8px', height: '3px', borderRadius: '2px', background: GREEN,
              opacity: '.6', transformOrigin: '0 50%', transform: 'scaleX(0)' } });
            inner.append(h('span', { text: sg.u }), ul);
            text.append(inner);
            parts.unders.push(ul);
          }
        });
        el.append(text);
        let leader = null, pill = null, badge = null, caret = null;
        if (r.note) {
          leader = h('div', { style: { flex: '1 1 auto', height: '4px', margin: '0 14px 0 20px',
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(35,134,83,.42) 1.6px, rgba(35,134,83,0) 2.1px)',
            backgroundSize: '11px 4px', backgroundRepeat: 'repeat-x' } });
          pill = notePill(h, S, r.note, r.icon);
          el.append(leader, pill);
        }
        if (r.typed) {
          caret = h('span', { style: { display: 'inline-block', width: '3px', height: '34px', verticalAlign: '-6px', marginLeft: '3px', background: GREEN } });
          text.append(caret);
          badge = h('div', { style: { flex: 'none', marginLeft: '18px', width: '38px', height: '38px', borderRadius: '50%', background: GREEN,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(35,134,83,.30)' } }, checkIcon(S, '#FFFFFF', 24));
          el.append(badge);
        }
        win.body.append(el);
        return { r, el, text, parts, leader, pill, badge, caret };
      });
      // reveal order for the rows on screen from the start (the rules line is inserted later)
      let k = 0;
      rows.forEach(rw => { rw.order = rw.r.typed ? -1 : k++; });

      // mark times per row (the answer lands on the word that asks for it)
      const rowAt = { who: T.who, mem: T.mem, len: T.len, keep: T.keep, free: T.free };
      rows.forEach(rw => { rw.at = rw.r.at ? rowAt[rw.r.at] : null; });

      // caption under the window
      const caption = h('div', { class: 'abs', style: { left: '4px', top: `${WIN.h + 14}px`, font: '500 20px/1.3 var(--cn)', color: INK2, whiteSpace: 'nowrap' },
        text: '模板改写自 WaytoAGI 原文「一份可以直接改写的制作提示」' });
      doc.append(caption);

      // ---- right column: BEFORE / AFTER ----
      const before = buildBefore(h, S);
      const after = buildAfter(h, S);
      const ring = h('div', { class: 'abs', style: { left: `${FR.x}px`, top: `${FR.yA}px`, width: `${FR.w}px`, height: `${FR.h}px`, borderRadius: '18px',
        border: `3px solid ${GREEN}`, opacity: '0' } });
      const vBefore = verdict(h, S, false, '高级感？看不出对错');
      const vAfter = verdict(h, S, true, '每屏一个主信息');
      Object.assign(vBefore.style, { left: `${FR.x - 36}px`, top: `${FR.yB + FR.h - 60}px` });
      Object.assign(vAfter.style, { left: `${FR.x - 36}px`, top: `${FR.yA + FR.h - 60}px` });
      root.append(before.el, after.el, ring, vBefore, vAfter);

      // ---- page furniture: rail + sticker ----
      const rail = K.stepRail();
      root.append(rail.el);
      const sticker = K.sticker('暂停就能抄');
      Object.assign(sticker.el.style, { left: `${STICK.x}px`, top: `${STICK.y}px`, zIndex: '40' });
      root.append(sticker.el);

      return { T, doc, win, titleMk, band, rows, caption, before, after, ring, vBefore, vAfter, rail, sticker };
    },

    render(s, t, ctx) {
      const { tf } = E;
      const { clamp, lerp, prog, ease, spring, mixColor, env } = M;
      const T = s.T;

      // ---- page furniture ----
      s.rail.render(t - RAIL_DELAY, 2, 1);

      // ---- document: rises in centred, glides to the storyboard slot on 风格 ----
      // Between those moves it sits still on whole pixels: it is the page people pause on and copy, so its text must
      // stay crisp. (A slow sub-pixel drift or scale push makes Chrome reuse rasters baked at other offsets, so the same
      // t anti-aliased differently depending on render history.) Motion between cues comes from the markers, band,
      // typing and the right column.
      const enter = prog(t, 0.1, 0.75, ease.outQuint);
      const glide = ease.inOutCubic(clamp((t - T.glide) / GLIDE_DUR));
      const docX = (WIN.x1 - WIN.x2) * (1 - glide), docY = (1 - enter) * 64;
      tf(s.doc, { x: docX, y: docY, o: prog(t, 0.1, 0.35, ease.linear) });

      // 「暂停就能抄」: slaps on at (1560, 214) beside the template; on 风格 it is lifted and re-stuck on the window's
      // top-right corner, so it keeps labelling the template (not the BEFORE frame that takes the right column)
      {
        // s16 ends with the same sticker at the same spot: continue it (already stuck) instead of slapping it on again
        const carried = !!(ctx.prev && ctx.prev.id === 's16_routes');
        const sp = carried ? 1 : spring(t - STICK.t, { stiffness: 320, damping: 18 });
        const base = lerp(1.6, 1, clamp(sp, 0, 1.2));
        const cx = WIN.x2 + WIN.w + docX, cy = WIN.y + docY;                 // window top-right corner on screen
        const p = clamp((t - T.hop) / STICK.dur);
        const e = ease.inOutCubic(p);
        const lift = Math.sin(Math.PI * p);
        const land = t >= T.hop + STICK.dur ? 0.07 * Math.exp(-(t - T.hop - STICK.dur) * 14) * Math.cos((t - T.hop - STICK.dur) * 30) : 0;
        const x = lerp(STICK.x, cx + STICK.dx, e), y = lerp(STICK.y, cy + STICK.dy, e) + 26 * lift;
        tf(s.sticker.el, { x: x - STICK.x, y: y - STICK.y, s: base * (1 + 0.09 * lift - land), r: -4 + 5 * lift, o: carried ? 1 : clamp((t - STICK.t) / 0.12) });
        s.sticker.el.style.boxShadow = `0 ${(10 + 16 * lift).toFixed(1)}px ${(24 + 22 * lift).toFixed(1)}px rgba(36,30,30,${(0.14 + 0.08 * lift).toFixed(3)})`;
      }

      // 「需求.txt」 marker on 需求
      s.titleMk.style.transform = `scaleX(${prog(t, T.req, 0.32, ease.outCubic).toFixed(4)})`;

      // ---- rows ----
      const q = prog(t, T.check - 0.04, 0.32, ease.outCubic);
      const L = layout(q);
      s.rows.forEach((rw, i) => {
        const r = rw.r;
        let a;
        if (r.typed) a = q > 0.02 ? 1 : 0;
        else a = prog(t, 0.4 + rw.order * 0.075, 0.42, ease.outCubic);
        tf(rw.el, { y: L.tops[i] + (1 - a) * 14, o: a });

        // 模板: every blank glints once, top to bottom; then each answer is marked on its word
        rw.parts.slots.forEach((sl, j) => {
          const g0 = T.tpl + 0.05 + (i * 0.035) + j * 0.02;
          sl.glint.style.opacity = env(t, g0, g0 + 0.75, 0.14, 0.5).toFixed(3);
          if (rw.at != null) {
            const tm = rw.at + j * (j === 0 ? 0 : 0.09);
            if (r.loose) {
              const p = prog(t, tm, 0.3, ease.outCubic);
              sl.box.style.opacity = p.toFixed(3);
              tf(sl.box, { s: lerp(1.12, 1, p) });
            } else {
              sl.mk.style.transform = `scaleX(${prog(t, tm, 0.3, ease.outCubic).toFixed(4)})`;
            }
          }
        });
        if (rw.leader) {
          const p = prog(t, rw.at + 0.05, 0.32, ease.outCubic);
          rw.leader.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`;
          K.pop(rw.pill, t, rw.at + 0.2, { from: 0.55 });
        }
        // 高级感: struck in ink, the words grey out
        if (rw.parts.strike) {
          const p = prog(t, T.fancy, 0.26, ease.outCubic);
          rw.parts.strike.line.style.transform = `scaleX(${p.toFixed(4)})`;
          rw.parts.strike.tx.style.color = mixColor(INK, MUTE, prog(t, T.fancy + 0.1, 0.3));
        }
        // 检查: the rules line is typed in
        if (r.typed) {
          const total = rw.parts.typed.reduce((n, p) => n + Array.from(p.text).length, 0);
          let n = Math.round(clamp((t - T.type0) / T.typeDur) * total);
          rw.parts.typed.forEach(p => {
            const arr = Array.from(p.text);
            const take = Math.max(0, Math.min(arr.length, n));
            const str = arr.slice(0, take).join('');
            if (p.node.textContent !== str) p.node.textContent = str;
            n -= arr.length;
          });
          const typing = t >= T.type0 - 0.1 && t < T.type0 + T.typeDur + 0.05;
          const blink = Math.floor((t - T.type0) * 3.2) % 2 === 0;
          rw.caret.style.opacity = typing || (t >= T.type0 && t < T.one && blink) ? '1' : '0';
          // 每屏: the rule is marked and ticked
          rw.parts.key.mk.style.transform = `scaleX(${prog(t, T.one, 0.34, ease.outCubic).toFixed(4)})`;
          K.pop(rw.badge, t, T.one + 0.16, { from: 0.3, stiffness: 300, damping: 16 });
        }
        // tail: soft underline sweep for pausers (line 9, then line 10's three deliverables)
        rw.parts.unders.forEach((ul, j) => {
          const t0 = i === TYPED + 1 ? T.sweep : T.sweep + 0.26 + j * 0.16;
          ul.style.transform = `scaleX(${prog(t, t0, i === TYPED + 1 ? 0.4 : 0.26, ease.outCubic).toFixed(4)})`;
        });
      });

      // ---- current-line band ----
      {
        const stops = [
          { t: T.who, a: 0, b: 0 }, { t: T.mem, a: 1, b: 1 }, { t: T.len, a: 2, b: 2 }, { t: T.keep, a: 4, b: 5 },
          { t: T.style, a: 6, b: 6 }, { t: T.check, a: 7, b: 7 }, { t: T.sweep, a: 8, b: 9 },
        ];
        const geo = st => ({ top: PAD_T + L.tops[st.a] - 1, bot: PAD_T + L.tops[st.b] + Math.max(L.hs[st.b], 8) + 1 });
        let k = 0;
        for (let i = 0; i < stops.length; i++) if (t >= stops[i].t) k = i;
        const cur = stops[k], prev = stops[Math.max(0, k - 1)];
        const p = k === 0 ? 1 : prog(t, cur.t, 0.36, ease.outCubic);
        const g0 = geo(prev), g1 = geo(cur);
        const top = lerp(g0.top, g1.top, p), bot = lerp(g0.bot, g1.bot, p);
        s.band.style.top = `${top.toFixed(2)}px`;
        s.band.style.height = `${(bot - top).toFixed(2)}px`;
        s.band.style.opacity = prog(t, T.who - 0.06, 0.25).toFixed(3);
      }

      // ---- caption ----
      s.caption.style.opacity = prog(t, 1.0, 0.5).toFixed(3);

      // ---- BEFORE: drops in on 高级, busy and wobbling; dims once AFTER is there ----
      {
        const b = s.before;
        const sp = spring(t - T.before, { stiffness: 210, damping: 17 });
        const vis = t >= T.before;
        const float = Math.round(-5 * ease.inOutSine(clamp((t - T.before) / Math.max(1, T.end - T.before))));
        tf(b.el, { y: (1 - sp) * -36 + float, r: (1 - Math.min(1, sp)) * -3.5, o: vis ? clamp((t - T.before) / 0.16) : 0 });
        b.msgs.forEach((m, i) => {
          const w = Math.sin(t * (2.1 + i * 0.37) + i * 1.9);
          tf(m.el, { r: m.m.r + 1.8 * w, y: 2.5 * Math.sin(t * (1.6 + i * 0.29) + i) });
        });
        b.sparks.forEach(sk => {
          const tw = 0.5 + 0.5 * Math.sin(t * 4.2 + sk.ph);
          tf(sk.el, { s: lerp(0.55, 1.15, tw), r: t * 40 + sk.ph * 30, o: lerp(0.35, 1, tw) });
        });
        b.dim.style.opacity = (0.5 * prog(t, T.after + 0.25, 0.5)).toFixed(3);
        const vp = prog(t, T.before + 0.32, 0.42, ease.outCubic);
        tf(s.vBefore, { x: (1 - vp) * -18, y: float, o: vp });
      }

      // ---- AFTER: drops in on 检查, calm; pulses on 每屏 ----
      {
        const a = s.after;
        const sp = spring(t - T.after, { stiffness: 210, damping: 17 });
        const vis = t >= T.after;
        const float = Math.round(-5 * ease.inOutSine(clamp((t - T.after) / Math.max(1, T.end - T.after))));
        const bump = t >= T.one ? 0.03 * Math.sin(Math.PI * clamp((t - T.one) / 0.42)) : 0;
        tf(a.el, { y: (1 - sp) * -36 + float, r: (1 - Math.min(1, sp)) * 3, s: 1 + bump, o: vis ? clamp((t - T.after) / 0.16) : 0 });
        a.mainSpans.forEach((sp2, i) => {
          const p = prog(t, T.after + 0.18 + i * 0.03, 0.5, ease.outQuint);
          tf(sp2, { y: (1 - p) * 22, o: p });
        });
        tf(a.eyebrow, { o: prog(t, T.after + 0.14, 0.4) });
        a.bar.style.transform = `scaleX(${prog(t, T.after + 0.5, 0.45, ease.outCubic).toFixed(4)})`;
        const rp = clamp((t - T.one) / 0.6);
        tf(s.ring, { y: float, s: 1 + 0.07 * ease.outCubic(rp), o: t >= T.one && rp < 1 ? 0.9 * (1 - ease.inQuad(rp)) : 0 });
        // the verdict labels the frame as it settles (≥ 3 s on screen, G3); 每屏 then lights it with the rule
        const vp = prog(t, T.after + 0.45, 0.42, ease.outCubic);
        tf(s.vAfter, { x: (1 - vp) * -18, y: float, s: 1 + bump * 0.6, o: vp });
      }
    },

    events(ctx) {
      const L1 = `${ID}.1`, L2 = `${ID}.2`;
      const out = ctx.prev && ctx.prev.id === 's16_routes' ? [] : [{ t: STICK.t, type: 'pop', gain: 0.3 }];
      out.push({ t: ctx.word(L1, '需求'), type: 'swish', gain: 0.18 });
      ['谁', '记住', '多', '不能'].forEach(w => out.push({ t: ctx.word(L1, w), type: 'swish', gain: 0.25 }));
      out.push({ t: ctx.word(L2, '风格') - 0.06 + STICK.dur, type: 'pop', gain: 0.18 });
      out.push({ t: ctx.word(L2, '高级'), type: 'blip', gain: 0.4 });
      out.push({ t: ctx.word(L2, '高级') + 0.12, type: 'pop', gain: 0.22 });
      out.push({ t: ctx.word(L2, '检查') + 0.06, type: 'type', gain: 0.35 });
      out.push({ t: ctx.word(L2, '每个'), type: 'ding', gain: 0.45 });
      return out;
    },
  });

  // ---------- pieces ----------
  function notePill(h, S, text, icon) {
    const locked = icon === 'lock';
    const el = h('div', { style: { flex: 'none', display: 'flex', alignItems: 'center', gap: '7px', padding: icon ? '6px 15px 7px 11px' : '6px 15px 7px',
      borderRadius: '999px', font: '700 24px/1 var(--cn)', whiteSpace: 'nowrap',
      color: locked ? '#FFFFFF' : DEEP, background: locked ? DEEP : 'rgba(35,134,83,.09)',
      border: icon === 'open' ? `1.5px dashed ${GREEN}` : locked ? `1.5px solid ${DEEP}` : '1.5px solid rgba(35,134,83,.30)' } });
    if (icon) el.append(lockIcon(S, icon === 'open', locked ? '#FFFFFF' : DEEP));
    el.append(h('span', { text }));
    return el;
  }

  function lockIcon(S, open, color) {
    return S('svg', { width: 22, height: 22, viewBox: '0 0 24 24', style: { flex: 'none', display: 'block' } },
      S('rect', { x: 5, y: 10.5, width: 14, height: 10, rx: 2.6, fill: 'none', stroke: color, 'stroke-width': 2.4 }),
      S('path', { d: open ? 'M8.5 10.5V7.4a3.6 3.6 0 0 1 6.9-1.5' : 'M8.5 10.5V7.4a3.5 3.5 0 0 1 7 0v3.1', fill: 'none', stroke: color,
        'stroke-width': 2.4, 'stroke-linecap': 'round' }));
  }

  function checkIcon(S, color, size) {
    return S('svg', { width: size, height: size, viewBox: '0 0 24 24', style: { display: 'block' } },
      S('path', { d: 'M5 12.5 L10 17.5 L19.5 7', fill: 'none', stroke: color, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  }

  function crossIcon(S, color, size) {
    return S('svg', { width: size, height: size, viewBox: '0 0 24 24', style: { display: 'block' } },
      S('path', { d: 'M7 7 L17 17 M17 7 L7 17', fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round' }));
  }

  function verdict(h, S, ok, text) {
    const el = h('div', { class: 'abs', style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 18px 8px 9px', borderRadius: '14px',
      background: '#FFFFFF', border: `1.5px solid ${ok ? 'rgba(35,134,83,.5)' : 'rgba(36,30,30,.16)'}`, boxShadow: '0 12px 26px rgba(36,30,30,.14)',
      font: '700 24px/1.2 var(--cn)', color: ok ? DEEP : INK2, whiteSpace: 'nowrap', zIndex: '6' } });
    const dot = h('div', { style: { flex: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: ok ? GREEN : '#EDE9EA' } }, ok ? checkIcon(S, '#FFFFFF', 22) : crossIcon(S, INK2, 20));
    el.append(dot, h('span', { text }));
    return el;
  }

  function demoTag(h) {
    // same corner tag as s16's illustrations
    return h('div', { class: 'abs', style: { right: '12px', top: '12px', padding: '5px 9px 6px', borderRadius: '7px', font: '600 18px/1 var(--cn)',
      color: INK2, background: '#FFFFFF', border: '1.5px solid #DDD7DB', whiteSpace: 'nowrap' }, text: '示意' });
  }

  // a mini frame: outer box at its stage size, content laid out at 512×288 in a layer scaled to fit
  function frameBox(h, y, bg) {
    const box = h('div', { class: 'abs', style: { left: `${FR.x}px`, top: `${y}px`, width: `${FR.w}px`, height: `${FR.h}px`, borderRadius: '16px', overflow: 'hidden',
      background: bg, boxShadow: '0 22px 48px rgba(36,30,30,.18), 0 0 0 1.5px rgba(36,30,30,.10)', zIndex: '5' } });
    const el = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '512px', height: '288px', transformOrigin: '0 0', transform: `scale(${FR.k.toFixed(5)})` } });
    box.append(el);
    return { box, el };
  }

  function buildBefore(h, S) {
    const { box, el } = frameBox(h, FR.yB, 'linear-gradient(128deg, #B98BC4 0%, #6C4FA0 46%, #183C9C 100%)');
    const glow = (x, y, r, c) => h('div', { class: 'abs', style: { left: `${x - r}px`, top: `${y - r}px`, width: `${2 * r}px`, height: `${2 * r}px`, borderRadius: '50%',
      background: `radial-gradient(circle, ${c} 0%, rgba(0,0,0,0) 66%)` } });
    el.append(glow(430, 40, 150, 'rgba(255,255,255,.42)'), glow(40, 270, 140, 'rgba(201,223,141,.42)'));
    const ringEl = (x, y, r, o) => h('div', { class: 'abs', style: { left: `${x - r}px`, top: `${y - r}px`, width: `${2 * r}px`, height: `${2 * r}px`, borderRadius: '50%',
      border: `1.5px solid rgba(255,255,255,${o})` } });
    el.append(ringEl(408, 116, 38, 0.32), ringEl(446, 148, 16, 0.4), ringEl(470, 166, 7, 0.5));
    const msgs = BEFORE_MSGS.map(m => {
      const d = h('div', { class: 'abs', style: { left: `${m.x}px`, top: `${m.y}px`, font: m.font, color: m.color, whiteSpace: 'nowrap',
        letterSpacing: m.ls || '0', textShadow: m.shadow ? '0 4px 14px rgba(20,10,40,.35)' : 'none', transformOrigin: '50% 50%' }, text: m.text });
      el.append(d);
      return { el: d, m };
    });
    const sparks = SPARKS.map(sk => {
      const sv = S('svg', { width: sk.s * 2, height: sk.s * 2, viewBox: '-10 -10 20 20', style: { position: 'absolute', left: `${sk.x - sk.s}px`, top: `${sk.y - sk.s}px`, overflow: 'visible' } },
        S('path', { d: 'M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10Z', fill: sk.c }));
      el.append(sv);
      return { el: sv, ...sk };
    });
    const dim = h('div', { class: 'fill', style: { background: '#F6F4F5', opacity: '0' } });
    el.append(dim, demoTag(h));
    return { el: box, msgs, sparks, dim };
  }

  function buildAfter(h, S) {
    const { box, el } = frameBox(h, FR.yA, '#FFFFFF');
    const eyebrow = h('div', { class: 'abs', style: { left: '40px', top: '64px', font: '600 18px/1 var(--cn)', color: INK2, letterSpacing: '.06em', whiteSpace: 'nowrap' },
      text: '新同事 · 自我介绍' });
    const main = h('div', { class: 'abs', style: { left: '36px', top: '94px', font: '900 58px/1.1 var(--cn)', color: INK, whiteSpace: 'nowrap', letterSpacing: '-.01em' } });
    const mainSpans = E.chars(main, '我做数据可视化');
    const bar = h('div', { class: 'abs', style: { left: '40px', top: '180px', width: '84px', height: '9px', borderRadius: '5px', background: GREEN,
      transformOrigin: '0 50%', transform: 'scaleX(0)' } });
    el.append(eyebrow, main, bar, demoTag(h));
    return { el: box, eyebrow, main, mainSpans, bar };
  }
})();
