/*
 * s21_meta — 「04 幕后」: this film's real code, its real timeline, and a synthetic voice.
 *
 * Every time below comes from ctx.word / ctx.cue / ctx.cueEnd against src/timeline.js (never a literal second).
 *  A  wipe    A page of this film (a DOM rebuild of s02's title card) arrives with the 「04 ？」 chip lit; the chip rings
 *             once (its glow swelling) just as the wipe uncovers it.
 *     揭      the page turns over (rotateY 0→180°, 0.7 s inOutCubic, perspective 2600; it dips 7 % mid-turn so its near
 *             edge stays clear of the chrome band). Its back holds three verbatim lines of src/scenes/case.js render() —
 *             read in build() with a synchronous XHR, cut after 60 characters with 「…」 — typed line by line, above a
 *             grey skeleton of a case card (the case template's layout in miniature; no footage, so no credit).
 *             Caption 「刚才 8 张案例卡的入场动画，就是这几行」.
 *     片子    soft push-in; the active-line bar steps down the three lines on 片子 / 也 / 做 and each step plays that line
 *             on the skeleton with the template's own numbers: the spring line springs its body in (spring(t − 0.05,
 *             {140, 19}), 0.86 → 1: case 1's zoom entrance); the tf(s.card.el, …) line replays how cases 2–8 entered,
 *             footage first (as the bar reaches it the body cuts to 1.312× centred on the frame, holds 0.12 s, then
 *             shrinks into its slot, 0.5 s outCubic, the series dots riding on it); the up(s.tag, …) line raises its
 *             tag / title / handle rows 0.08 s apart.
 *             Label 「↑ 亮哪行，卡片就动哪里」 under the skeleton.
 *  B  Opus    the page snaps open into a Claude Code window (1560 × 548, code 24 px): the case.js lines on the left,
 *             the skeleton on their right (it passes behind the code, see-through, while the page snaps open); the
 *             header drops with the first tab (src/scenes/*.js, active); the title
 *             「Claude Code · Opus 5.5 · 全片 {{CODE_LINES}} 行代码」 types in place and its count runs up in a fixed-width
 *             slot. The credits arrive with the header, the production numbers with the count (same curve).
 *     写      the window splits into three panes instead of swapping bodies: src/scenes/*.js (top left), the verbatim
 *             CHORDS block of tools/music.py (under it) and this scene's entry in src/timeline.js (right, real line
 *             numbers); the skeleton steps out to make room. Unlit panes sit at 45 % ink.
 *     场景    pane 1 lit: its tab flashes, the active line sweeps 98 → 104.
 *     时间    pane 2 lit (its tab, start / dur marked); the caption fades out (0.3 s).
 *     配乐    pane 3 lit (its tab); the bar sits on the chord playing right now (score bar n → CHORDS[n % 4], as
 *             tools/music.py schedules it) and pulses on the beat.
 *  C  逐帧    the window folds into this film's real timeline (window.TIMELINE); the lanes are born inside the shrinking
 *             window while the code fades: 画面 (22 scene blocks by chapter) · 旁白 (one bar per TTS word) · 音乐 (one
 *             bar per beat, height ∝ the scene's energy). The tab names drop out to the lane gutter on an L. The lime
 *             playhead races 0 → now (0.5 s); the counter 「第 n 帧 / 共 {{FRAMES}} 帧」 fast-forwards, settles on the real
 *             frame and steps back to fog. The view dives into this very line: frame cells, one block per word lit by
 *             the live playhead, each word's real start time appearing as it is spoken (lime while spoken).
 *     连      a bracket 「字幕就按这些时间出现」 is in place; its leader points down at the live subtitle (stops at y 880)
 *             and retracts when the subtitle ends. The label and bracket stay.
 *     也      Smiley Sans 「这句也是。」 pops beside the line (也是合成的).
 *     end     the zoomed view holds to the last frame; the pill leaves its playhead and is parked at (960, 540) over a
 *             dark halo (so it stays the figure on the lit word blocks) before the cut — s22's iris opens on that same
 *             pill — and during the iris everything around it fades out (and recedes 3 %). render() is pure in t.
 */
(() => {
  'use strict';
  const { h, s } = E;
  const { clamp, lerp, prog, ease, spring } = M;

  const ID = 's21_meta';
  const L1 = `${ID}.1`, L2 = `${ID}.2`, L3 = `${ID}.3`;
  const LIME = '#C9DF8D', INK = '#241E1E', SNOW = '#F4F1F2', FOG = '#A39A9B', LILAC = '#EAD8EB', PURPLE = '#AD85BA';
  const GREEN = '#238653', NIGHT = '#121011', NIGHT2 = '#1B1718', WINBG = '#0E0C0D', HEAD = '#1A1617';
  const SNOW85 = 'rgba(244,241,242,.85)';
  const px = v => `${(+v).toFixed(2)}px`;
  const f2 = v => (+v).toFixed(2);

  // ---------------- layout ----------------
  const PAGE = { w: 1080, h: 608, cx: 960, cy: 464, r: 12 };           // phase A page (16:9 frame), y 160–768
  PAGE.x = PAGE.cx - PAGE.w / 2; PAGE.y = PAGE.cy - PAGE.h / 2;
  const MINI_K = PAGE.w / 1920;                                       // miniature of s02's frame
  const FLIP = { persp: 2600, dip: 0.07 };                            // the page dips 7 % mid-turn: near edge within y ≈ 118–810
  const CODE = { size: 24, lh: 34 };                                  // every code body: JetBrains Mono 24 px on 34 px rows
  const GUT = 5;                                                      // gutter: 3 digits + 2 spaces
  const WIN = { x: 180, y: 176, w: 1560, h: 548, bar: 54, tabs: 50, r: 22 };   // y 176–724; body (window-local) y 104–548
  const CARD = { w: 360, h: 200, k: 1.2 };                            // the skeleton case card, drawn at 1.2× (432 × 240)
  // page coordinates (1080 × 608): the code block (centred) above the skeleton, its label under it
  const PG = { codeY: 75, card: { x: 324, y: 247 }, labCx: 540, labY: 499 };
  // window-local, before 写: the code at left, the skeleton at right (centred on each other), the label under it
  const WB = { code: { x: 36, y: 237 }, card: { x: 1039, y: 185 }, labCx: 1255, labY: 437 };
  // window-local, from 写: 0 = src/scenes (top left), 1 = src/timeline.js (right), 2 = tools/music.py (under 0)
  const PANE = [{ x: 36, y: 126 }, { x: 1164, y: 126 }, { x: 36, y: 282 }];
  const DIV = { x: 1140, y: 272 };                                    // pane dividers (window-local)
  const LANES_R = { x: 96, y: 362, w: 1728, h: 276 };                 // the window folds into this
  const TRK = { x0: 184, x1: 1808 };                                  // timeline track: 0 → 255 s
  const TRK_IN = { l: TRK.x0 - LANES_R.x, r: LANES_R.x + LANES_R.w - TRK.x1 };   // the track's inset inside the folding window
  const LN = { pic: [380, 430], voice: [450, 550], vc: 500, music: [570, 620] };   // overview lanes
  const ZL = { pic: [384, 420], labA: 436, voice: [478, 538], vc: 508, labB: 552, br: 606, brLab: 620, brLh: 50, joke: 626,
    leadTop: 680, leadBot: 880 };                                     // zoomed lanes + annotations
  const PILL = { w: 184, h: 38, top: 322, padX: 12, glow: 36, glowA: 0.6, halo: [190, 96] };   // s22 opens its iris on this same pill
  const CV = { top: 360, h: 280 };                                    // lanes canvas y 360–640
  const ZOOM_PPS = 400;                                               // px per second when diving into the line
  const CHAP = { c0: LILAC, c1: PURPLE, c2: 'rgba(244,241,242,0.2)', c3: GREEN, c4: LIME };
  const CNT = { top: 166, size: 56 };                                 // frame counter row, top right (y ≈ 166–222)
  const LANE_FAN = { y0: 250, dy: 36 };                               // lane names fan out to these rows (above the lanes)
  const TITLE_A = 'Claude Code · Opus 5.5 · ';
  const CAPTION = '刚才 8 张案例卡的入场动画，就是这几行';
  const LABEL = '亮哪行，卡片就动哪里';
  const INK_OFF = 0.45;                                               // unlit panes

  // ---------------- helpers ----------------
  // 2D transform + opacity: no compositor layer, so text is rastered at its final scale on every frame
  function tf2(el, { x = 0, y = 0, s: sc = 1, sx = null, sy = null, r = 0, o = null } = {}) {
    const ax = sx != null ? sx : sc, ay = sy != null ? sy : sc;
    let tr = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
    if (r) tr += ` rotate(${r.toFixed(3)}deg)`;
    if (ax !== 1 || ay !== 1) tr += ` scale(${ax.toFixed(5)},${ay.toFixed(5)})`;
    el.style.transform = tr;
    if (o != null) el.style.opacity = clamp(o).toFixed(4);
  }
  const show = (el, on, disp = 'block') => { const d = on ? disp : 'none'; if (el.style.display !== d) el.style.display = d; };
  const setStyle = (el, key, v) => { if (el.style[key] !== v) el.style[key] = v; };
  const esc = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lerpR = (a, b, p) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p) });
  const bump = (tau, k = 9, f = 14) => (tau <= 0 ? 0 : Math.exp(-k * tau) * Math.sin(f * tau));
  // odometer: v padded to n digits with thousands commas → [dim leading zeros, significant part]
  function odo(v, n) {
    const f = String(Math.max(0, Math.round(v))).padStart(n, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let i = 0;
    while (i < f.length - 1 && (f[i] === '0' || f[i] === ',')) i++;
    return [f.slice(0, i), f.slice(i)];
  }

  // ---------------- the real sources (read once in build; a failed read throws: never invented code) ----------------
  function readText(url) {
    let xhr;
    try {
      xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);                       // build() is synchronous, so the request is too
      xhr.overrideMimeType('text/plain; charset=utf-8');
      xhr.send(null);
    } catch (err) { throw new Error(`${ID}: cannot read ${url}: ${err && err.message}`); }
    if (xhr.status !== 200 || !xhr.responseText) throw new Error(`${ID}: cannot read ${url} (HTTP ${xhr.status})`);
    return xhr.responseText;
  }
  // three lines of case.js render(), found by their first tokens; cut after 60 characters
  function pickCase(src) {
    const lines = src.split('\n');
    const r0 = lines.findIndex(l => /^\s*render\s*\(/.test(l));
    if (r0 < 0) throw new Error(`${ID}: render() not found in scenes/case.js`);
    return ['const a = spring(', 'tf(s.card.el,', 'up(s.tag,'].map(head => {
      const i = lines.findIndex((l, k) => k > r0 && l.trim().startsWith(head));
      if (i < 0) throw new Error(`${ID}: "${head}" not found in scenes/case.js render()`);
      const code = Array.from(lines[i].trim());
      return { n: i + 1, code: code.slice(0, 60).join(''), more: code.length > 60 };
    });
  }
  // tools/music.py: from the line starting `CHORDS = [` through its closing `]`
  function pickChords(src) {
    const lines = src.split('\n');
    const i0 = lines.findIndex(l => l.startsWith('CHORDS = ['));
    if (i0 < 0) throw new Error(`${ID}: CHORDS block not found in tools/music.py`);
    let i1 = -1;
    for (let i = i0 + 1; i < lines.length; i++) if (/^\]/.test(lines[i])) { i1 = i; break; }
    if (i1 < 0) throw new Error(`${ID}: CHORDS block in tools/music.py is not closed`);
    return lines.slice(i0, i1 + 1).map((code, k) => ({ n: i0 + 1 + k, code: code.replace(/\s+$/, '') }));
  }
  // src/timeline.js: this scene's entry, the file's own lines from "id" through "chapter" (dedented, real line numbers)
  function pickTimeline(src, id) {
    const lines = src.split('\n');
    const i0 = lines.findIndex(l => l.trim() === `"id": ${JSON.stringify(id)},`);
    if (i0 < 0) throw new Error(`${ID}: entry ${id} not found in src/timeline.js`);
    let i1 = -1;
    for (let i = i0 + 1; i < lines.length && !/^\s*"id":/.test(lines[i]); i++) if (/^\s*"chapter":/.test(lines[i])) { i1 = i; break; }
    if (i1 < 0) throw new Error(`${ID}: "chapter" of ${id} not found in src/timeline.js`);
    const cut = lines.slice(i0, i1 + 1).map(l => l.replace(/\s+$/, ''));
    const ind = Math.min(...cut.map(l => l.match(/^\s*/)[0].length));
    const rows = cut.map((code, k) => ({ n: i0 + 1 + k, code: code.slice(ind) }));
    if (!rows.some(r => r.code.startsWith('"start":')) || !rows.some(r => r.code.startsWith('"dur":'))) {
      throw new Error(`${ID}: "start" / "dur" of ${id} not found in src/timeline.js`);
    }
    return rows;
  }

  // ---------------- code blocks (K.tokenize colours, one row per line, line-number gutter) ----------------
  const TOKC = { kw: PURPLE, fn: LIME, num: '#F2B880', str: '#9FD3A8', com: '#8A8183', op: '#CFC8C9' };
  function tokHtml(toks, n) {
    let html = '', cur = null, buf = '';
    const flush = () => { if (buf) { const c = TOKC[cur]; html += c ? `<span style="color:${c}">${esc(buf)}</span>` : esc(buf); } buf = ''; };
    for (let i = 0; i < n; i++) { const tk = toks[i]; if (tk.k !== cur) { flush(); cur = tk.k; } buf += tk.c; }
    flush();
    return html;
  }
  // barCh: how many characters (after the gutter) the active-line bar covers
  function codeBlock(rows, barCh) {
    const size = CODE.size, lh = CODE.lh, ch = size * 0.6;   // JetBrains Mono advance: 0.6 em
    const el = h('div', { class: 'abs', style: { left: '0px', top: '0px', font: `500 ${size}px/${lh}px var(--mono)`, color: '#E8E3E4',
      whiteSpace: 'pre', transformOrigin: '0 0' } });
    const bar = h('div', { class: 'abs', style: { left: '-14px', top: '0px', height: px(lh), width: px((GUT + barCh) * ch + 28), borderRadius: '6px',
      background: 'rgba(201,223,141,.13)', boxShadow: `inset 4px 0 0 ${LIME}`, opacity: '0' } });
    el.append(bar);
    const items = rows.map(r => {
      const row = h('div', { style: { position: 'relative', height: px(lh) } });
      const gut = h('span', { style: { color: 'rgba(244,241,242,.26)' }, text: r.n != null ? `${String(r.n).padStart(GUT - 2, ' ')}  ` : ' '.repeat(GUT) });
      const txt = h('span');
      row.append(gut, txt);
      el.append(row);
      const toks = r.head ? null : K.tokenize(r.code);
      return { r, row, gut, txt, toks, len: r.head ? Array.from(r.head).length : toks.length, key: null };
    });
    const caret = h('div', { class: 'abs', style: { left: '0px', top: px(lh * 0.16), width: px(ch * 0.9), height: px(lh * 0.68), background: LIME, borderRadius: '2px' } });
    el.append(caret);
    // p(rowIndex) -> 0..1 typed; the caret sits after the last typed character
    function render(t, p, caretOn) {
      let cRow = -1, cCol = 0;
      items.forEach((it, i) => {
        const q = it.r.head ? 1 : clamp(p(i));
        const n = Math.round(q * it.len);
        if (it.key !== n) {
          it.key = n;
          it.txt.innerHTML = it.r.head ? `<span style="color:${FOG}">${esc(it.r.head)}</span>`
            : tokHtml(it.toks, n) + (it.r.more && n >= it.len ? `<span style="color:${FOG}">…</span>` : '');
        }
        if (!it.r.head && q > 0) { cRow = i; cCol = n + (it.r.more && n >= it.len ? 1 : 0); }
      });
      const vis = caretOn && cRow >= 0;
      show(caret, vis);
      if (vis) tf2(caret, { x: (GUT + cCol) * ch + 3, y: cRow * lh });
    }
    const wCh = Math.max(...rows.map(r => (r.head ? Array.from(r.head).length : Array.from(r.code).length + (r.more ? 1 : 0))));
    return { el, bar, items, render, lh, ch, size, w: (GUT + wCh) * ch, h: rows.length * lh };
  }

  // ---------------- a grey skeleton of a case card: the case template's layout in miniature (no footage) ----------------
  // card-local boxes [x, y, w, h, radius]: body = the video card, then the right column's tag / title / handle rows
  const SK = { body: [20, 34, 196, 110, 8], tag: [236, 57, 64, 16, 8], title: [236, 85, 100, 16, 4], handle: [236, 111, 68, 10, 4] };
  const SK_K = 1.6 * CARD.w / 1920;                                   // the template's pixel distances, scaled to the card
  function buildCard(live) {
    const el = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(CARD.w), height: px(CARD.h), borderRadius: '12px', background: NIGHT,
      boxShadow: 'inset 0 0 0 1.5px rgba(244,241,242,.16), 0 16px 34px rgba(0,0,0,.38)', transformOrigin: '0 0' } });
    const box = ([x, y, w, hh, r], css) => h('div', { class: 'abs', style: { left: px(x), top: px(y), width: px(w), height: px(hh), borderRadius: px(r), ...css } });
    // the empty slots, where each part lands
    Object.values(SK).forEach(a => el.append(box(a, { border: '1.5px dashed rgba(244,241,242,.2)', boxSizing: 'border-box' })));
    // the series dots under the body: 8 cases, the first one current
    const dots = h('div', { class: 'abs', style: { left: px(SK.body[0]), top: '156px', width: px(SK.body[2]), height: '5px', display: 'flex', justifyContent: 'center', gap: '5px' } });
    for (let i = 0; i < 8; i++) dots.append(h('span', { style: { width: i === 0 ? '14px' : '5px', height: '5px', borderRadius: '3px', background: i === 0 ? LIME : 'rgba(255,255,255,.24)' } }));
    el.append(dots);
    if (!live) return { el };
    const body = box(SK.body, { overflow: 'hidden', background: 'linear-gradient(140deg, #3B3436, #262122 70%)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
      transformOrigin: '50% 50%' });
    body.append(h('div', { class: 'abs', style: { left: '90px', top: '41px', width: '0px', height: '0px', borderLeft: '22px solid rgba(244,241,242,.5)',
      borderTop: '14px solid transparent', borderBottom: '14px solid transparent' } }));
    const rows = [box(SK.tag, { background: 'rgba(201,223,141,.18)', boxShadow: `inset 0 0 0 1.5px ${LIME}` }),
      box(SK.title, { background: 'rgba(244,241,242,.62)' }), box(SK.handle, { background: 'rgba(163,154,155,.62)' })];
    el.append(body, dots, ...rows);                                   // the dots stay on top while the body is big (as the template's)
    return { el, body, rows };
  }
  // the push cases' big footage, in miniature: 1312 / 1000 of the card, centred on the frame ((960, 510) of 1920 × 1080)
  const SK_BIG = { s: 1312 / 1000, cx: CARD.w / 2, cy: CARD.h * 510 / 1080 };
  // the body turns big as the bar (0.18 s inOutCubic) is half-way onto its line, holds a beat, then the template's 0.5 s outCubic
  const SK_CUT = 0.09, SK_HOLD = 0.12, SK_SHRINK = 0.5;
  // what the lit line does, played on the skeleton (pure in t), with the template's own numbers:
  //  line 1 `const a = spring(…)`  the body springs in, 0.86 → 1 (case 1's zoom entrance)
  //  line 2 `tf(s.card.el, …)`     the pose every card gets: the body is replayed as cases 2–8 entered, footage first:
  //                                big, centred on the frame, then shrinking into its slot (the dots ride on it)
  //  line 3 `up(s.tag, …)`         the tag / title / handle rows rise, 0.08 s apart
  function renderCard(cd, t, T) {
    const on = t >= T.step[0];
    show(cd.body, on);
    if (on && t < T.step[1] + SK_CUT) {
      const tau = t - T.step[0];
      const a = spring(tau - 0.05, { stiffness: 140, damping: 19 });
      tf2(cd.body, { y: (1 - a) * 30 * SK_K, s: lerp(0.86, 1, a), o: clamp(tau / 0.25) });
    } else if (on) {
      const g = 1 - prog(t, T.step[1] + SK_CUT + SK_HOLD, SK_SHRINK, ease.outCubic);   // 1 = big, 0 = in its slot
      const [bx, by, bw, bh] = SK.body;
      tf2(cd.body, { x: (SK_BIG.cx - bx - bw / 2) * g, y: (SK_BIG.cy - by - bh / 2) * g, s: lerp(1, SK_BIG.s, g), o: 1 });
    }
    cd.rows.forEach((el, i) => {
      const p = prog(t, T.step[2] + 0.15 + 0.08 * i, 0.55, ease.outQuint);
      show(el, p > 0);
      if (p > 0) tf2(el, { y: (1 - p) * 26 * SK_K, o: p });
    });
  }

  // ---------------- a DOM rebuild of s02's title card (its final frame), 「04 ？」 lit ----------------
  const CHIP_SH = g => `0 0 0 5px rgba(201,223,141,.16), 0 0 ${f2(44 + 26 * g)}px rgba(201,223,141,${(0.55 + 0.2 * g).toFixed(3)}), 0 14px 34px rgba(0,0,0,.35)`;
  function buildMini() {
    const fr = h('div', { class: 'abs grid-night', style: { left: '0px', top: '0px', width: '1920px', height: '1080px', overflow: 'hidden', transformOrigin: '0 0' } });
    fr.append(h('div', { class: 'abs', style: { left: '230px', top: '-90px', width: '1460px', height: '1120px', borderRadius: '50%',
      background: 'radial-gradient(closest-side, rgba(173,133,186,.27), rgba(173,133,186,0))' } }));
    fr.append(h('div', { class: 'abs', style: { left: '420px', top: '470px', width: '1080px', height: '260px', borderRadius: '50%',
      background: 'radial-gradient(closest-side, rgba(201,223,141,.17), rgba(201,223,141,0))' } }));
    fr.append(h('div', { class: 'abs', style: { left: '0px', top: '386px', width: '1920px', textAlign: 'center', font: '900 150px/1 var(--cn)',
      letterSpacing: '-0.01em', color: SNOW, whiteSpace: 'nowrap' }, text: '每一帧，都是代码' }));
    fr.append(h('div', { class: 'abs', style: { left: '410px', top: '592px', width: '1100px', height: '16px', borderRadius: '8px', background: LIME,
      boxShadow: '0 0 40px rgba(201,223,141,.55)' } }));
    fr.append(h('div', { class: 'abs', style: { left: '0px', top: '663.6px', width: '1920px', textAlign: 'center', font: '700 44px/1.2 var(--cn)',
      letterSpacing: '0.01em', color: 'rgba(244,241,242,.85)', whiteSpace: 'nowrap' }, text: 'Opus 5.5 炫酷视频的秘密 ＋ 小白上手指南' }));
    const row = h('div', { class: 'abs', style: { left: '0px', top: '764px', width: '1920px', height: '52px', display: 'flex', justifyContent: 'center', gap: '20px' } });
    let ring = null, chip = null;
    [['01', '原理'], ['02', '为什么炫'], ['03', '小白上手'], ['04', '？']].forEach(([n, lab], i) => {
      const el = h('div', { style: { position: 'relative', height: '52px', display: 'flex', alignItems: 'center', gap: '12px', padding: i === 3 ? '0 16px 0 9px' : '0 20px 0 9px',
        borderRadius: '14px', background: NIGHT2, border: '1.5px solid rgba(244,241,242,.14)', boxShadow: '0 14px 34px rgba(0,0,0,.35)' } });
      el.append(h('span', { style: { padding: '7px 10px', borderRadius: '8px', background: LIME, color: INK, font: '600 22px/1 var(--mono)', letterSpacing: '.08em' }, text: n }));
      el.append(i === 3 ? h('span', { style: { font: '38px/1 var(--fun)', color: LIME, padding: '0 2px', textShadow: '0 0 18px rgba(201,223,141,.7)' }, text: lab })
        : h('span', { style: { font: '600 26px/1 var(--cn)', color: SNOW, letterSpacing: '.02em' }, text: lab }));
      if (i === 3) {          // the open loop, lit
        el.style.border = `2.5px solid ${LIME}`;
        el.style.boxShadow = CHIP_SH(0);
        ring = h('div', { class: 'abs', style: { left: '-8px', top: '-8px', right: '-8px', bottom: '-8px', borderRadius: '21px', border: `6px solid ${LIME}`, opacity: '0' } });
        el.append(ring);
        chip = el;
      }
      row.append(el);
    });
    fr.append(row);
    // the engine chrome of that frame: chapter tag 00 开场, logo, progress bar at 16.0 s
    const tag = h('div', { class: 'abs', style: { left: '56px', top: '44px', display: 'flex', alignItems: 'center', gap: '14px' } },
      h('span', { style: { padding: '7px 10px', borderRadius: '8px', background: LIME, color: INK, font: '600 22px/1 var(--mono)', letterSpacing: '.08em' }, text: '00' }),
      h('span', { style: { font: '600 24px/1 var(--cn)', letterSpacing: '.04em', color: SNOW }, text: '开场' }));
    // the logo goes in as an <img>: an inline copy of the SVG would duplicate the clip-path ids of the engine's own logo
    const logo = h('img', { class: 'abs', style: { right: '56px', top: '40px', height: '40px', width: px(40 * 317 / 102), opacity: '.9' } });
    const prog16 = h('div', { class: 'abs', style: { left: '0px', bottom: '0px', height: '6px', width: px(16 / window.TIMELINE.duration * 1920), background: LIME } });
    fr.append(tag, logo, prog16);
    return { el: fr, ring, chip };
  }

  // ---------------- timings (all from the voice) ----------------
  function timings(ctx) {
    const w = (l, x, n = 0) => ctx.word(l, x, n);
    const T = {
      jie: w(L1, '揭'), pianzi: w(L1, '片子'), ye: w(L1, '也'), zuo: w(L1, '做'),
      opus: w(L2, 'Opus'), xie: w(L2, '写'), tabs: [w(L2, '场景'), w(L2, '时间'), w(L2, '配乐')],
      zhu: w(L3, '逐帧'), lian: w(L3, '连'), ye3: w(L3, '也'), end3: ctx.cueEnd(L3),
    };
    // the wipe (0.6 s, inOutCubic) uncovers the 「04 ？」 chip at ≈ 0.32 s: it rings then, before the page turns
    const tr = (window.TIMELINE.scenes.find(x => x.id === ctx.id) || {}).transition || {};
    T.pulse0 = tr.type === 'wipe' ? 0.5 * (tr.dur || 0.6) : 0.1; T.pulseDur = 0.4;
    T.flip0 = T.jie; T.flipDur = 0.7; T.flip1 = T.flip0 + T.flipDur;   // the page turns on 揭
    T.type0 = T.jie + 0.42; T.typeGap = 0.22; T.typeDur = 0.34;        // lines type while the back turns towards us
    T.cap = T.type0 + 0.55;                                            // caption
    T.push0 = T.pianzi;                                                // soft push-in on 片子
    T.step = [T.pianzi, T.ye, T.zuo];                                  // active line 1 → 2 → 3 (each plays on the skeleton)
    T.lab = T.step[0] + 0.25;                                          // 「↑ 亮哪行，卡片就动哪里」 once the body has sprung
    T.morph0 = T.opus;                                                 // page → window on Opus (spring)
    T.head0 = T.morph0 + 0.08;                                         // title bar + tab strip drop in …
    T.tab0 = T.head0 + 0.06;                                           // … with the first tab (src/scenes/*.js, active)
    T.cred = T.head0 + 0.06;                                           // credits arrive with the header
    T.title0 = T.morph0 + 0.2; T.titleDur = 0.42;                      // title types in
    T.count0 = T.title0 + T.titleDur + 0.05; T.countDur = 1.3;         // 全片 N 行代码 runs up; the stats come with it
    T.split = T.xie; T.splitDur = 0.45;                                // 写: three panes (no body swaps from here on)
    T.paneIn = [0, 0.16, 0.22];                                        // pane / tab entrances after 写 (timeline right, music under)
    T.flash = T.tabs[0];                                               // 场景: tab 1 flashes, the active line sweeps 98 → 104
    T.col0 = T.zhu; T.colDur = 0.42;                                   // the window folds into the lanes on 逐帧
    T.sw0 = T.col0 + 0.3; T.sw1 = T.sw0 + 0.5;                         // playhead races 0 → now
    T.z0 = T.sw1 - 0.1; T.z1 = T.z0 + 0.6;                             // dive into this line (held: no zoom-out)
    T.br = T.lian;                                                     // bracket + label land on 连 (amendment)
    T.joke = T.ye3;                                                    // 这句也是。 pops on 也 (也是合成的)
    // the line's subtitle (ctx.lines keeps subs in film time): the leader points at it, so it retracts as it goes
    const l3 = ctx.lines.find(l => l.id === L3);
    T.subEnd = l3 && l3.subs && l3.subs.length ? Math.max(...l3.subs.map(sb => sb.end)) - ctx.start : T.end3 + 0.15;
    T.leadOut = T.subEnd - 0.06;                                       // leader + arrow retract with the subtitle
    T.fly1 = ctx.dur - 0.06;                                           // the pill is parked at (960, 540) before s22's iris
    T.fly0 = T.fly1 - 0.42;                                            // … flying in from the playhead (inOutSine: ≤ 100 px/frame)
    T.out0 = ctx.dur; T.outDur = 0.45;                                 // during s22's iris the view fades out around the pill
    return T;
  }

  Scene.define({
    id: ID,

    build(root, ctx) {
      const T = timings(ctx);
      const TL = window.TIMELINE;
      const FPS = TL.fps;

      // ---------- real sources ----------
      const caseRows = pickCase(readText('scenes/case.js'));
      const chordRows = pickChords(readText('../tools/music.py'));
      const tlRows = pickTimeline(readText('timeline.js'), ctx.id);
      const R0 = [{ head: '// src/scenes/case.js · render()' }, ...caseRows];
      const R1 = [{ head: '// src/timeline.js' }, ...tlRows];
      const R2 = [{ head: '# tools/music.py' }, ...chordRows];
      const rStart = 1 + tlRows.findIndex(r => r.code.startsWith('"start":'));
      const rDur = 1 + tlRows.findIndex(r => r.code.startsWith('"dur":'));
      const chord0 = 1 + chordRows.findIndex(r => /^\s*\(/.test(r.code));   // row of CHORDS[0] in pane 3
      if (chord0 < 1) throw new Error(`${ID}: no chord tuples in the CHORDS block of tools/music.py`);

      // production numbers (E.fill); RENDER_MIN may already carry 约 → never 「约 约」
      const linesStr = String(E.fill('{{CODE_LINES}}'));
      const linesNum = Number(linesStr.replace(/,/g, ''));
      const linesLen = Array.from(linesStr).length;
      const statsRow2 = E.fill('{{FRAMES}} 帧 · 渲染约 {{RENDER_MIN}} 分钟').replace(/约\s*约\s*/g, '约 ');
      const framesStr = String(E.fill('{{FRAMES}}'));
      const totalFrames = Math.round(TL.duration * FPS);

      // ---------- measuring ----------
      const meas = h('span', { style: { position: 'absolute', left: '-12000px', top: '0px', whiteSpace: 'pre', visibility: 'hidden' } });
      document.body.append(meas);
      const measure = (text, font, ls = 'normal') => { meas.style.font = font; meas.style.letterSpacing = ls; meas.textContent = text; return meas.getBoundingClientRect().width; };
      const pillFont = '600 22px/1 var(--mono)';
      const pillW = Math.max(PILL.w, Math.ceil(measure(`t = ${(TL.duration - 1 / FPS).toFixed(2)} s`, pillFont) + 2 * PILL.padX));
      const titleFont = '500 24px/1 var(--mono)';
      const titleW = measure(`${TITLE_A}全片 ${linesStr} 行代码`, titleFont);
      const capFont = '500 26px/1.3 var(--cn)';
      const capW = measure(CAPTION, capFont, '.02em');
      const labFont = '500 24px/30px var(--cn)';
      const labW = measure(`↑ ${LABEL}`, labFont, '.02em');

      // ---------- background ----------
      const bg = K.bg(root, 'night', { glows: [
        { x: 0, y: 0, r: 760, color: 'rgba(173,133,186,.42)', o: 0.55 },
        { x: 0, y: 0, r: 560, color: 'rgba(201,223,141,.14)', o: 0.55 },
      ] });

      // ================= A: the page (3D only while it turns) =================
      const logos = [];
      const stage3d = h('div', { class: 'fill', style: { perspective: `${FLIP.persp}px`, perspectiveOrigin: `${PAGE.cx}px ${PAGE.cy}px` } });
      const page = h('div', { class: 'abs', style: { left: px(PAGE.x), top: px(PAGE.y), width: px(PAGE.w), height: px(PAGE.h), transformStyle: 'preserve-3d', transformOrigin: '50% 50%' } });
      const faceCss = { position: 'absolute', left: '0px', top: '0px', width: px(PAGE.w), height: px(PAGE.h), borderRadius: px(PAGE.r), overflow: 'hidden',
        backfaceVisibility: 'hidden', boxShadow: '0 34px 80px rgba(0,0,0,.5)' };
      const rimCss = { borderRadius: px(PAGE.r), boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.2)' };
      const paperCss = { background: 'linear-gradient(150deg, rgba(255,255,255,.06), rgba(255,255,255,0) 42%)' };
      const front = h('div', { style: { ...faceCss, background: NIGHT } });
      const mini = buildMini();
      mini.el.style.transform = `scale(${MINI_K})`;
      logos.push(mini.el.querySelector('img'));
      const fSheen = h('div', { class: 'fill', style: { background: 'linear-gradient(115deg, rgba(255,255,255,0) 25%, rgba(255,255,255,.22) 50%, rgba(255,255,255,0) 75%)', opacity: '0' } });
      const fShade = h('div', { class: 'fill', style: { background: '#000', opacity: '0' } });
      front.append(mini.el, fSheen, fShade, h('div', { class: 'fill', style: rimCss }));
      const back = h('div', { style: { ...faceCss, background: NIGHT2, transform: 'rotateY(180deg)' } });
      const ghostOf = () => {                                         // the front, seen through the paper
        const gEl = mini.el.cloneNode(true);
        gEl.style.transform = `translate(${PAGE.w}px,0px) scale(${-MINI_K},${MINI_K})`;
        gEl.style.opacity = '0.03';
        logos.push(gEl.querySelector('img'));
        return gEl;
      };
      const codeOnBack = codeBlock(R0, 62);
      const PGX = (PAGE.w - codeOnBack.w) / 2;                        // the code block, centred on the page
      tf2(codeOnBack.el, { x: PGX, y: PG.codeY });
      const cardOnBack = buildCard(false);                            // the skeleton as the page turns: empty slots
      tf2(cardOnBack.el, { x: PG.card.x, y: PG.card.y, s: CARD.k });
      const bShade = h('div', { class: 'fill', style: { background: '#000', opacity: '0' } });
      back.append(ghostOf(), h('div', { class: 'fill', style: paperCss }), codeOnBack.el, cardOnBack.el, bShade, h('div', { class: 'fill', style: rimCss }));
      page.append(front, back);
      stage3d.append(page);
      root.append(stage3d);

      // ================= the card (2D once the page lies flat) → the Claude Code window → the lanes =================
      // everything on the page / in the window lives inside it, so the window (overflow hidden) clips it while it folds
      const frame = h('div', { class: 'abs', style: { left: '0px', top: '0px', overflow: 'hidden' } });
      const ghostWrap = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(PAGE.w), height: px(PAGE.h), transformOrigin: '0 0' } }, ghostOf());
      const paper = h('div', { class: 'fill', style: paperCss });
      const head = h('div', { class: 'abs', style: { left: '0px', top: '0px', right: '0px', height: px(WIN.bar + WIN.tabs), background: HEAD,
        borderBottom: '1.5px solid rgba(255,255,255,.06)', transformOrigin: '50% 0%' } });
      const lights = ['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => {
        const d = h('span', { class: 'abs', style: { left: px(22 + i * 24), top: '20px', width: '14px', height: '14px', borderRadius: '50%', background: c, transformOrigin: '50% 50%' } });
        head.append(d);
        return d;
      });
      // title: left-anchored at its final centred position, so typing and counting never move it
      const titleEl = h('div', { class: 'abs', style: { left: '0px', top: '0px', height: px(WIN.bar), display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
        font: titleFont, whiteSpace: 'pre' } });
      const titleA = h('span', { style: { color: 'rgba(244,241,242,.84)' } });
      const titleN = h('span', { style: { display: 'inline-block', minWidth: `${(0.6 * linesLen).toFixed(2)}em`, textAlign: 'right', fontVariantNumeric: 'tabular-nums' } });
      const titleB = h('span', { style: { color: LIME, whiteSpace: 'pre' } }, '全片 ', titleN, ' 行代码');
      titleEl.append(titleA, titleB);
      head.append(titleEl);
      frame.append(ghostWrap, paper, head);

      // pane dividers (from 写)
      const divV = h('div', { class: 'abs', style: { left: px(DIV.x), top: px(WIN.bar + WIN.tabs + 16), width: '1.5px', height: px(WIN.h - WIN.bar - WIN.tabs - 32),
        background: 'rgba(255,255,255,.09)' } });
      const divH = h('div', { class: 'abs', style: { left: '18px', top: px(DIV.y), width: px(DIV.x - 18), height: '1.5px', background: 'rgba(255,255,255,.09)' } });
      // code bodies, all 24 px: 0 = the page's case.js lines, 1 = this scene's timeline.js entry, 2 = the CHORDS block
      const code0 = codeBlock(R0, 62);
      const code1 = codeBlock(R1, 20);
      const code2 = codeBlock(R2, 70);
      // body 1 marks this scene's start / dur (one bar over both rows when they are adjacent)
      const mark1 = rStart > 0 && rDur > 0;
      if (mark1) {
        const r0 = Math.min(rStart, rDur), n = Math.abs(rStart - rDur) === 1 ? 2 : 1;
        code1.bar.style.height = px(n * code1.lh);
        tf2(code1.bar, { y: r0 * code1.lh });
      }
      // the skeleton case card and its label
      const card = buildCard(true);
      const label = h('div', { class: 'abs', style: { left: '0px', top: '0px', font: labFont, color: 'rgba(244,241,242,.72)', whiteSpace: 'pre', letterSpacing: '.02em',
        transformOrigin: '0 0' } }, h('span', { style: { color: LIME }, text: '↑' }), ` ${LABEL}`);
      // the skeleton sits under the code: while the page snaps open it crosses the end of the code lines, behind them
      frame.append(divV, divH, card.el, label, code0.el, code1.el, code2.el);
      root.append(frame);

      // tabs (screen coordinates); on 逐帧 each turns into its lane label
      const TABS = ['src/scenes/*.js', 'src/timeline.js', 'tools/music.py'];
      const LANES = ['画面', '旁白', '音乐'];
      let tx = 16;
      const tabs = TABS.map((lab, i) => {
        const wTab = Array.from(lab).length * 14.4 + 44;
        const el = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(wTab), height: '44px', borderRadius: '10px 10px 0 0', transformOrigin: '0 100%' } });
        const tbg = h('div', { class: 'fill', style: { borderRadius: '10px 10px 0 0' } });
        const ttx = h('div', { class: 'abs', style: { left: '22px', top: '0px', height: '44px', display: 'flex', alignItems: 'center', font: '500 24px/1 var(--mono)',
          whiteSpace: 'pre' }, text: lab });
        el.append(tbg, ttx);
        root.append(el);
        const lane = h('div', { class: 'abs', style: { left: '0px', top: '0px', font: '600 24px/30px var(--cn)', color: 'rgba(244,241,242,.86)', whiteSpace: 'nowrap', letterSpacing: '.04em' }, text: LANES[i] });
        root.append(lane);
        const o = { el, tbg, ttx, lane, x: tx, w: wTab, key: null };
        tx += wTab + 6;
        return o;
      });

      // caption under the page / window (amendment s21), until 时间: from there the code it names is no longer lit
      const caption = h('div', { class: 'abs', style: { left: '0px', top: '0px', font: capFont, color: FOG, whiteSpace: 'nowrap', letterSpacing: '.02em' }, text: CAPTION });
      root.append(caption);

      // credits (bottom left, from the window header to the end)
      const credits = h('div', { class: 'abs', style: { left: '112px', top: '812px', font: '500 22px/32px var(--cn)', color: FOG, whiteSpace: 'nowrap' } },
        h('div', { text: '旁白：微软神经网络语音合成（edge-tts · 云希）' }),
        h('div', { text: '案例片段：归原作者所有，逐段署名' }));
      root.append(credits);

      // ================= C: this film's timeline =================
      const lanesCv = h('canvas', { width: 1920, height: CV.h, style: { position: 'absolute', left: '0px', top: px(CV.top), width: '1920px', height: px(CV.h) } });
      root.append(lanesCv);
      // production numbers: bottom right, mirroring the credits (from the count to the end); 行代码 counts with the title
      const statN = h('span', { style: { display: 'inline-block', minWidth: `${(0.6 * linesLen).toFixed(2)}em`, textAlign: 'right' } });
      const stats = h('div', { class: 'abs', style: { right: `${1920 - 1808}px`, top: '812px', font: '500 24px/32px var(--mono)', color: FOG, whiteSpace: 'pre',
        textAlign: 'right', fontVariantNumeric: 'tabular-nums' } },
        h('div', {}, E.fill('{{SCENES}} 个场景 · '), statN, ' 行代码'),
        h('div', { text: statsRow2 }));
      root.append(stats);
      // what we are looking at: this film's own timeline (length from the production numbers)
      const tag = h('div', { class: 'abs', style: { left: '112px', top: '172px', height: '46px', padding: '0 20px', borderRadius: '23px', display: 'flex', alignItems: 'center',
        gap: '12px', background: 'rgba(201,223,141,.12)', border: '1.5px solid rgba(201,223,141,.45)', color: LIME, font: '600 24px/1 var(--mono)', whiteSpace: 'nowrap',
        letterSpacing: '.04em' } }, h('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: LIME } }), h('span', { text: E.fill('本片时间轴 · {{SECONDS}} 秒') }));
      root.append(tag);
      // frame counter, worded like s22's (第 n 帧 / 共 N 帧) so the two scenes read as one counter
      const counter = h('div', { class: 'abs', style: { right: `${1920 - 1808}px`, top: px(CNT.top), display: 'flex', alignItems: 'baseline', whiteSpace: 'pre',
        transformOrigin: '100% 50%' } });
      const small = color => ({ font: '600 24px/1 var(--mono)', color });
      // odometer (as s22's counts): always as many digits as the total, leading zeros dim, so nothing shifts while it races
      const cDim = h('span', { style: { color: 'rgba(163,154,155,.3)' } });
      const cSig = h('span');
      const cNum = h('span', { style: { display: 'inline-block', font: `600 ${CNT.size}px/1 var(--mono)`, color: LIME, fontVariantNumeric: 'tabular-nums',
        transformOrigin: '100% 80%' } }, cDim, cSig);
      const cTot = h('span', { style: small(SNOW), text: framesStr });
      const nDig = framesStr.replace(/\D/g, '').length || 4;
      counter.append(h('span', { style: small(FOG), text: '第 ' }), cNum, h('span', { style: small(FOG), text: ' 帧 / 共 ' }), cTot, h('span', { style: small(FOG), text: ' 帧' }));
      root.append(counter);

      // the lime playhead: trail and stem under the annotations, the pill above everything
      const trail = h('div', { class: 'abs', style: { left: '0px', top: px(LN.pic[0] - 6), height: px(LN.music[1] - LN.pic[0] + 12), width: '10px',
        background: 'linear-gradient(90deg, rgba(201,223,141,0), rgba(201,223,141,.22))' } });
      const stem = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '2px', height: '10px', background: LIME, boxShadow: '0 0 10px rgba(201,223,141,.75)' } });
      root.append(trail, stem);

      // zoom annotations: word text (karaoke: ink left of the playhead, snow right), real start times, bracket
      const line3 = ctx.lines.find(l => l.id === L3);
      const words3 = line3.words.map(wd => ({ w: wd.w, s: wd.start + ctx.start, e: wd.end + ctx.start, sl: wd.start }));
      const annot = h('div', { class: 'fill', style: { transformOrigin: '0 0' } });
      const aSvg = K.svgRoot(1920, 1080);
      annot.append(aSvg);
      const LFONT = '600 24px/26px var(--mono)';
      const words = words3.map((wd, i) => {
        // the glyph fits its block: a 71 ms word is a 25 px block at 400 px/s
        const dW = (wd.e - wd.s) * ZOOM_PPS;
        const blockW = dW - Math.min(4, dW * 0.12);
        const fs = clamp(Math.floor(blockW - 8), 18, 26);
        const wf = `700 ${fs}px/30px var(--cn)`;
        const tw = measure(wd.w, wf);
        const mk = color => h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(tw), height: '30px', font: wf, color, whiteSpace: 'pre' }, text: wd.w });
        const lite = mk('rgba(244,241,242,.92)'), ink = mk(INK);
        const lab = h('div', { class: 'abs', style: { left: '0px', top: '0px', padding: '1px 7px 2px', borderRadius: '6px', background: NIGHT,
          font: LFONT, color: SNOW85, fontVariantNumeric: 'tabular-nums', whiteSpace: 'pre' }, text: wd.s.toFixed(2) });
        const lead = s('line', { stroke: SNOW, 'stroke-width': 1.5, 'stroke-opacity': 0.4 });
        aSvg.append(lead);
        annot.append(lite, ink, lab);
        return { ...wd, tw, lite, ink, lab, lead, above: i % 2 === 1, lw: measure(wd.s.toFixed(2), LFONT) + 14, col: null };
      });
      // keep each row's labels apart (row above: odd words, row below: even words), as laid out when fully zoomed
      const xz = T0 => 960 + (T0 - (words3[0].s + words3[words3.length - 1].e) / 2) * ZOOM_PPS;
      [true, false].forEach(ab => {
        const row = words.filter(wd => wd.above === ab);
        row.forEach(wd => { wd.dx = 0; });
        for (let it = 0; it < 30; it++) {
          for (let k = 0; k + 1 < row.length; k++) {
            const a = row[k], b = row[k + 1];
            const ov = (xz(a.s) + a.dx + a.lw + 16) - (xz(b.s) + b.dx);
            if (ov > 0) { a.dx -= ov / 2; b.dx += ov / 2; }
          }
        }
      });
      const brPath = s('path', { fill: 'none', stroke: LIME, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      const leader = s('path', { fill: 'none', stroke: LIME, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      const arrow = s('path', { fill: 'none', stroke: LIME, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      aSvg.append(brPath, leader, arrow);
      // the message of the zoom: H3, the largest text on screen
      const brLab = h('div', { class: 'abs', style: { left: '0px', top: px(ZL.brLab), width: '1920px', textAlign: 'center', font: `700 42px/${ZL.brLh}px var(--cn)`, color: SNOW,
        whiteSpace: 'nowrap', letterSpacing: '.02em', transformOrigin: `960px ${ZL.brLh / 2}px` }, text: '字幕就按这些时间出现' });
      const jokeW = measure('这句也是。', '34px/1.1 var(--fun)');
      const joke = h('div', { class: 'abs', style: { left: '0px', top: '0px', font: '34px/1.1 var(--fun)', color: LILAC, whiteSpace: 'nowrap', transformOrigin: '50% 60%' }, text: '这句也是。' });
      annot.append(brLab, joke);
      root.append(annot);

      // a dark halo gathers under the pill as it parks at the iris centre: the pill stays the figure over the lit word blocks
      const halo = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(2 * PILL.halo[0]), height: px(2 * PILL.halo[1]), borderRadius: '50%',
        background: `radial-gradient(closest-side, ${M.rgba(NIGHT, 0.94)} 45%, ${M.rgba(NIGHT, 0.6)} 72%, ${M.rgba(NIGHT, 0)})` } });
      root.append(halo);
      const pill = h('div', { class: 'abs center', style: { left: '0px', top: '0px', width: px(pillW), height: px(PILL.h), borderRadius: px(PILL.h / 2), background: LIME,
        color: INK, font: pillFont, fontVariantNumeric: 'tabular-nums', whiteSpace: 'pre', boxShadow: '0 6px 18px rgba(18,16,17,.35)' } });
      root.append(pill);

      meas.remove();

      // ---------- data for the lanes ----------
      const allWords = [];
      TL.lines.forEach(l => (l.words || []).forEach(wd => allWords.push({ s: wd.start, e: wd.end })));
      const maxWd = allWords.reduce((m, wd) => Math.max(m, wd.e - wd.s), 0.01);
      const beats = [];
      const beatDur = 60 / (TL.bpm || 120);
      for (let k = 0; k * beatDur < TL.duration - 1e-6; k++) {
        const tb = k * beatDur;
        const sc = TL.scenes.find(x => tb >= x.start && tb < x.start + x.dur) || TL.scenes[TL.scenes.length - 1];
        beats.push({ t: tb, e: (sc.music && sc.music.energy) || 0, down: k % 4 === 0 });
      }

      return {
        T, bg, stage3d, page, fSheen, fShade, bShade, mini, codeOnBack, PGX, logos,
        LOGO_URL: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(window.LOGO_DARK || '<svg xmlns="http://www.w3.org/2000/svg"/>')}`,
        frame, ghostWrap, paper, head, lights, titleEl, titleW, titleA, titleB, titleN, tabs, code0, code1, code2, mark1, chord0, divV, divH,
        card, label, labW, caption, capW, credits,
        lanesCv, g: lanesCv.getContext('2d'), stats, statN, tag, counter, cNum, cDim, cSig, cTot, nDig, words, annot, brPath, leader, arrow, brLab, joke, jokeW,
        trail, stem, halo, pill, pillW, allWords, maxWd, beats, beatDur, linesStr, linesNum, totalFrames,
        L3s: words3[0].s, L3e: words3[words3.length - 1].e, last: {},
      };
    },

    render(st, t, ctx) {
      const T = st.T;
      const TL = window.TIMELINE;
      const FPS = TL.fps;
      const now = ctx.start + t;                                       // real film time
      st.logos.forEach(im => { if (im) E.setImg(im, st.LOGO_URL); });
      // the line count, shared by the title and the stats (same eased curve, so they never disagree)
      const cp = ease.outCubic(clamp((t - T.count0) / T.countDur));
      const countStr = Number.isFinite(st.linesNum) && st.linesNum > 0 && cp < 1 ? Math.round(st.linesNum * cp).toLocaleString('en-US') : st.linesStr;
      // past the cut (s22's iris) everything but the pill fades, so the iris opens over the lanes it came from
      const out = prog(t, T.out0, T.outDur, ease.inOutSine);
      const outA = 1 - out;

      // ---------- background glows drift (they end where s22's begin) ----------
      const gp = prog(t, T.col0, 0.8, ease.inOutCubic);
      tf2(st.bg.glowEls[0], { x: lerp(960 + 60 * Math.sin(t * 0.35), 1180, gp), y: lerp(430 - 18 * t, 300, gp) });
      tf2(st.bg.glowEls[1], { x: lerp(380 + 20 * t, 700, gp), y: lerp(880, 760, gp) });

      // ================= A: the page turns =================
      const flipP = ease.inOutCubic(clamp((t - T.flip0) / T.flipDur));
      const in3d = t < T.flip1;
      show(st.stage3d, in3d);
      const typedP = i => (i === 0 ? 1 : (t - (T.type0 + (i - 1) * T.typeGap)) / T.typeDur);
      const typing = t >= T.type0 && t < T.type0 + 2 * T.typeGap + T.typeDur;
      if (in3d) {
        const sc = lerp(0.965, 1, ease.outCubic(clamp(t / 0.8)));
        const sn = Math.sin(Math.PI * flipP);
        st.page.style.transform = `rotateY(${f2(180 * flipP)}deg) scale(${(sc * (1 - FLIP.dip * sn)).toFixed(5)})`;
        st.fSheen.style.opacity = (0.75 * sn).toFixed(3);
        st.fShade.style.opacity = (flipP < 0.5 ? 0.35 * sn : 0).toFixed(3);
        st.bShade.style.opacity = (flipP >= 0.5 ? 0.35 * sn : 0).toFixed(3);
        // the open loop: 「04 ？」 rings once as the wipe uncovers it, its glow swelling 44 → 70 px
        const pr = clamp((t - T.pulse0) / T.pulseDur);
        const ring = pr > 0 && pr < 1;
        st.mini.ring.style.opacity = ring ? (1 - pr).toFixed(3) : '0';
        if (ring) st.mini.ring.style.transform = `scale(${lerp(1, 1.9, ease.outCubic(pr)).toFixed(4)})`;
        const sh = CHIP_SH(ring ? Math.sin(Math.PI * pr) : 0);
        if (st.last.chipSh !== sh) { st.mini.chip.style.boxShadow = sh; st.last.chipSh = sh; }
        st.codeOnBack.render(t, typedP, typing);
      }

      // ================= the card → window → lanes rectangle =================
      const push = 1 + 0.08 * ease.inOutSine(clamp((t - T.push0) / 1.9));
      const cardR = { x: PAGE.cx - PAGE.w * push / 2, y: PAGE.cy - PAGE.h * push / 2, w: PAGE.w * push, h: PAGE.h * push };
      const m = t <= T.morph0 ? 0 : spring(t - T.morph0, { stiffness: 190, damping: 19 });     // snaps open, settles
      const mc = clamp(m);
      const c = ease.inOutCubic(clamp((t - T.col0) / T.colDur));
      const drift = -8 * ease.inOutSine(clamp((t - T.morph0 - 0.6) / Math.max(0.1, T.col0 - T.morph0 - 0.6)));
      const winR = { x: WIN.x, y: WIN.y + drift, w: WIN.w, h: WIN.h };
      const R = lerpR(lerpR(cardR, winR, m), LANES_R, c);
      const rad = lerp(lerp(PAGE.r * push, WIN.r, mc), 26, c);
      const frameOn = t >= T.flip1 && c < 1;
      show(st.frame, frameOn);
      if (frameOn) {
        Object.assign(st.frame.style, { left: px(R.x), top: px(R.y), width: px(R.w), height: px(R.h), borderRadius: px(rad) });
        st.frame.style.background = c > 0 ? M.rgba(WINBG, 1 - c) : (mc < 1 ? M.mixColor(NIGHT2, WINBG, mc) : WINBG);
        // a lime ring flashes as the window snaps open
        const flash = t > T.morph0 ? Math.exp(-5 * (t - T.morph0)) * clamp((t - T.morph0) / 0.06) : 0;
        st.frame.style.boxShadow = `0 34px 80px rgba(0,0,0,${f2(0.5 * (1 - c))}), inset 0 0 0 1.5px rgba(255,255,255,${(lerp(0.2, 0.1, mc) * (1 - c) + 0.08 * Math.sin(Math.PI * c)).toFixed(3)}),` +
          ` 0 0 0 ${f2(2 * flash)}px rgba(201,223,141,${(0.9 * flash).toFixed(3)}), 0 0 ${f2(40 * flash)}px rgba(201,223,141,${(0.35 * flash).toFixed(3)})`;
        // the paper's sheen goes as the page becomes a window; the front seen through it only while the page turns
        const paperA = 1 - prog(t, T.morph0, 0.25);
        const ghostA = paperA * (1 - prog(t, T.flip1, 0.4));
        show(st.ghostWrap, ghostA > 0.001); show(st.paper, paperA > 0.001);
        if (ghostA > 0.001) tf2(st.ghostWrap, { s: push, o: ghostA });
        if (paperA > 0.001) st.paper.style.opacity = paperA.toFixed(3);
        // header (title bar + tab strip) drops in, traffic lights pop
        const hd = spring(t - T.head0, { stiffness: 260, damping: 21 });
        const headA = clamp((t - T.head0) / 0.18) * (1 - prog(t, T.col0, 0.16));
        show(st.head, headA > 0.001);
        if (headA > 0.001) tf2(st.head, { y: -20 * (1 - clamp(hd, 0, 1.2)), sy: lerp(0.7, 1, clamp(hd, 0, 1.1)), o: headA });
        st.lights.forEach((d, i) => tf2(d, { s: clamp(spring(t - T.morph0 - 0.16 - 0.06 * i, { stiffness: 380, damping: 16 }), 0, 1.4) }));
        // title: its left edge is where the final string, centred, starts; it types in and its count runs up in place
        st.titleEl.style.left = px((R.w - st.titleW) / 2);
        const t1 = E.typed(TITLE_A, clamp((t - T.title0) / T.titleDur));
        if (st.last.t1 !== t1) { st.titleA.textContent = t1; st.last.t1 = t1; }
        if (st.last.t2 !== countStr) { st.titleN.textContent = countStr; st.last.t2 = countStr; }
        st.titleB.style.opacity = prog(t, T.count0, 0.2).toFixed(3);
      }

      // ---------- what lives on the page / in the window (coordinates relative to R) ----------
      // a point on the page (page coordinates, pushed with it) → its place in the window (window-local), by the morph
      const place = (pg, wl) => ({ x: lerp(cardR.x + pg.x * push - R.x, wl.x, m), y: lerp(cardR.y + pg.y * push - R.y, wl.y, m), s: lerp(push, 1, m) });
      const fadeC = 1 - prog(t, T.col0 + 0.02, 0.1, ease.inOutQuad);   // the panes go as the fold starts, before the lane names cross them
      const sp = ease.inOutCubic(clamp((t - T.split) / T.splitDur));    // 写: the case.js lines rise into the top-left pane
      // which pane is lit: 0 until 时间, 1 until 配乐, then 2; unlit panes sit at 45 %
      const act = [1 - prog(t, T.tabs[1], 0.25), prog(t, T.tabs[1], 0.25) * (1 - prog(t, T.tabs[2], 0.25)), prog(t, T.tabs[2], 0.25)];
      const inkOf = i => lerp(INK_OFF, 1, act[i]);
      const paneA = i => ease.outCubic(clamp((t - T.split - T.paneIn[i]) / 0.4));

      // body 0: the case.js lines — on the page, then left of the skeleton, then the top-left pane
      const on0 = frameOn && fadeC > 0;
      show(st.code0.el, on0);
      if (on0) {
        const p0 = place({ x: st.PGX, y: PG.codeY }, { x: WB.code.x, y: lerp(WB.code.y, PANE[0].y, sp) });
        tf2(st.code0.el, { x: p0.x, y: p0.y, s: p0.s, o: inkOf(0) * fadeC });
        const blink = Math.floor((t - T.flip1) * 2.4) % 2 === 0;
        st.code0.render(t, typedP, typing || (t > T.flip1 && t < T.tabs[1] && blink));
        // active line: lines 1 → 2 → 3 on 片子 / 也 / 做; on 场景 it sweeps 1 → 3 once more
        let barA, rowY;
        if (t < T.morph0 + 0.45) {
          barA = prog(t, T.step[0], 0.25) * (1 - prog(t, T.morph0 + 0.15, 0.3));
          rowY = 1;
          for (let k = 1; k < 3; k++) rowY += ease.inOutCubic(clamp((t - T.step[k]) / 0.18));
        } else {
          barA = M.env(t, T.flash - 0.06, T.tabs[1], 0.1, 0.22);
          rowY = 1 + 2 * ease.inOutCubic(clamp((t - T.flash) / 0.4));
        }
        st.code0.bar.style.opacity = barA.toFixed(3);
        tf2(st.code0.bar, { y: rowY * st.code0.lh });
      }
      // the skeleton (and its label): under the code on the page, right of it in the window; on 写 it steps out to
      // the right, mostly gone before the timeline pane slides into its place
      const cxp = clamp((t - T.split) / 0.24);
      const cxA = 1 - ease.outQuad(cxp), cxX = 70 * ease.inCubic(cxp);
      const cardOn = frameOn && cxp < 1;
      show(st.card.el, cardOn);
      show(st.label, cardOn && t >= T.lab);
      if (cardOn) {
        const pc = place(PG.card, WB.card);
        const ghost = m > 0 && m < 1 && t < T.morph0 + 0.4 ? 1 - 0.7 * Math.sin(Math.PI * m) : 1;   // see-through while it passes the code
        tf2(st.card.el, { x: pc.x + cxX, y: pc.y, s: pc.s * CARD.k, o: cxA * ghost });
        renderCard(st.card, t, T);
        if (t >= T.lab) {
          const lp = prog(t, T.lab, 0.5, ease.outQuint);
          const pl = place({ x: PG.labCx - st.labW / 2, y: PG.labY }, { x: WB.labCx - st.labW / 2, y: WB.labY });
          tf2(st.label, { x: pl.x + cxX, y: pl.y + 10 * (1 - lp), s: pl.s, o: lp * cxA });
        }
      }
      // bodies 1 and 2 join on 写 as panes (timeline.js from the right, music.py from below), at 45 % until named
      [[st.code1, 1, 46, 0], [st.code2, 2, 0, 30]].forEach(([cb, i, dx, dy]) => {
        const a = paneA(i);
        const on = frameOn && a > 0 && fadeC > 0;
        show(cb.el, on);
        if (!on) return;
        tf2(cb.el, { x: PANE[i].x + dx * (1 - a), y: PANE[i].y + dy * (1 - a), s: lerp(0.985, 1, a), o: a * inkOf(i) * fadeC });
        const blink = Math.floor((t - T.tabs[i]) * 2.4) % 2 === 0;
        cb.render(t, () => 1, act[i] > 0.5 && blink && t < T.col0);
        if (i === 1 && st.mark1) cb.bar.style.opacity = M.env(t, T.tabs[1] + 0.1, T.tabs[2], 0.2, 0.15).toFixed(3);
        if (i === 2) {
          // the chord playing now: tools/music.py plays CHORDS[bar % 4], one chord per 4-beat bar; the bar pulses on the beat
          const barLen = 4 * st.beatDur;
          const ci = ((Math.floor(now / barLen + 1e-9) % 4) + 4) % 4;
          const pulse = Math.exp(-7 * (((now % st.beatDur) + st.beatDur) % st.beatDur));
          tf2(cb.bar, { y: (st.chord0 + ci) * cb.lh });
          cb.bar.style.opacity = prog(t, T.tabs[2] + 0.1, 0.2).toFixed(3);
          cb.bar.style.background = `rgba(201,223,141,${(0.13 + 0.1 * pulse).toFixed(3)})`;
          cb.bar.style.boxShadow = `inset ${f2(4 + 3 * pulse)}px 0 0 ${LIME}`;
        }
      });
      // pane dividers come with the new panes
      const dA = frameOn ? paneA(1) * fadeC : 0;
      show(st.divV, dA > 0.001); show(st.divH, dA > 0.001);
      if (dA > 0.001) { st.divV.style.opacity = dA.toFixed(3); st.divH.style.opacity = (paneA(2) * fadeC).toFixed(3); }

      // ---------- tabs → lane labels ----------
      const zz = ease.inOutCubic(clamp((t - T.z0) / (T.z1 - T.z0)));   // the dive (held to the end: no zoom-out)
      const laneY = [lerp((LN.pic[0] + LN.pic[1]) / 2, (ZL.pic[0] + ZL.pic[1]) / 2, zz), lerp(LN.vc, ZL.vc, zz), (LN.music[0] + LN.music[1]) / 2];
      const activeTab = t >= T.tabs[2] ? 2 : t >= T.tabs[1] ? 1 : 0;
      // the lane names leave the tabs on an L: out to the gutter while fanning out to their own rows above the lanes,
      // then down to their lanes in order (they never cross each other or the bars)
      const flyX = ease.outCubic(clamp((t - T.col0) / 0.3));
      const fanY = ease.outCubic(clamp((t - T.col0) / 0.18));
      const flyY = ease.inOutCubic(clamp((t - T.col0 - 0.26) / 0.3));
      st.tabs.forEach((tb, i) => {
        const tIn = i === 0 ? T.tab0 : T.split + T.paneIn[i];          // tabs 2 and 3 open with their panes on 写
        const on = t >= tIn;
        const tabA = on ? clamp((t - tIn) / 0.15) * (1 - prog(t, T.col0, 0.14)) : 0;
        const laneA = on && t >= T.col0 ? prog(t, T.col0 + 0.05, 0.2) * (i === 2 ? 1 - zz : 1) * outA : 0;
        show(tb.el, tabA > 0.001);
        show(tb.lane, laneA > 0.001);
        if (tabA > 0.001) {
          const x0 = R.x + tb.x, y0 = R.y + WIN.bar + 6;
          const sp2 = spring(t - tIn, { stiffness: 300, damping: 19 });
          const isAct = i === activeTab;
          // each tab flashes lime as its word names it
          const f = isAct && t >= T.tabs[i] ? Math.exp(-6 * (t - T.tabs[i])) * clamp((t - T.tabs[i]) / 0.05) : 0;
          setStyle(tb.tbg, 'background', isAct ? M.mixColor(WINBG, '#1F2316', 0.9 * f) : 'rgba(255,255,255,.035)');
          setStyle(tb.tbg, 'boxShadow', isAct ? `inset 0 ${f2(3 + 3 * f)}px 0 ${LIME}${f > 0.004 ? `, 0 -4px ${f2(30 * f)}px rgba(201,223,141,${(0.55 * f).toFixed(3)})` : ''}` : 'none');
          setStyle(tb.ttx, 'color', isAct ? (f > 0.004 ? M.mixColor(SNOW, LIME, f) : SNOW) : FOG);
          tf2(tb.el, { x: x0, y: y0, s: lerp(0.7, 1, sp2), o: tabA });
        }
        if (laneA > 0.001) {
          const sx = winR.x + tb.x + 22, sy = winR.y + WIN.bar + 6 + 7;     // where the tab's text was as the fold began
          const yFan = lerp(sy, LANE_FAN.y0 + LANE_FAN.dy * i, fanY);       // its own row above the lanes
          tf2(tb.lane, { x: lerp(sx, 112, flyX), y: lerp(yFan, laneY[i] - 15, flyY), o: laneA });
        }
      });

      // ---------- caption & credits ----------
      // the caption names the case.js lines: under the page / window until 时间, then a 0.3 s fade (its code is no longer lit)
      const capIn = prog(t, T.cap, 0.6, ease.outQuint);
      const capA = capIn * (1 - prog(t, T.tabs[1], 0.3, ease.inCubic));
      show(st.caption, capA > 0.001);
      if (capA > 0.001) tf2(st.caption, { x: 960 - st.capW / 2, y: R.y + R.h + 26 + 16 * (1 - capIn), o: capA });
      const crIn = prog(t, T.cred, 0.6, ease.outQuint);
      const crA = crIn * outA;
      show(st.credits, crA > 0.001);
      if (crA > 0.001) tf2(st.credits, { y: 14 * (1 - crIn), o: crA });
      const stIn = prog(t, T.count0, 0.6, ease.outQuint);
      const stA = stIn * outA;
      show(st.stats, stA > 0.001);
      if (stA > 0.001) {
        tf2(st.stats, { y: 14 * (1 - stIn), o: stA });
        if (st.last.sn !== countStr) { st.statN.textContent = countStr; st.last.sn = countStr; }
      }

      // ================= C: the timeline =================
      const inC = t >= T.col0;
      // playhead time: races 0 → now (inOutCubic ⇒ it arrives at exactly real speed), then real time
      const phAt = tt => (tt >= T.sw1 ? ctx.start + tt : tt > T.sw0 ? (ctx.start + tt) * ease.inOutCubic((tt - T.sw0) / (T.sw1 - T.sw0)) : 0);
      const ph = phAt(t);
      // the track is born inside the folding window (R.x + 88 … R.x + R.w − 16 = 184 … 1808 once folded)
      const trk = { x0: R.x + TRK_IN.l, x1: R.x + R.w - TRK_IN.r };
      // view: overview (0–255 s) ↔ this line at 400 px/s, log-interpolated about the line's centre
      const pps0 = (trk.x1 - trk.x0) / TL.duration;
      const Fc = (st.L3s + st.L3e) / 2;
      const pps = Math.exp(lerp(Math.log(pps0), Math.log(ZOOM_PPS), zz));
      const fxc = lerp(trk.x0 + Fc * pps0, 960, zz);
      const ta = Fc - (fxc - trk.x0) / pps;
      const X = T0 => trk.x0 + (T0 - ta) * pps;
      const xPh = Math.min(X(ph), trk.x1);                             // the visible playhead parks at the track's end

      // the pill: on the playhead, then flying to (960, 540) for s22's iris
      const flyP = ease.inOutSine(clamp((t - T.fly0) / (T.fly1 - T.fly0)));
      // at the track's start the pill's left cap sits on the stem (x ≥ 165), clear of the lane names' column
      const pcx0 = clamp(xPh, TRK.x0 - PILL.h / 2 + st.pillW / 2, 1808 - st.pillW / 2);
      const pcx = lerp(pcx0, 960, flyP), pcy = lerp(PILL.top + PILL.h / 2, 540, flyP) - 70 * Math.sin(Math.PI * flyP);

      // the lanes and the zoom annotations recede a touch (3 %, about the iris centre) as they fade through the iris
      const kOut = 1 - 0.03 * out;
      const lanesA = inC ? prog(t, T.col0 + 0.12, 0.3) : 0;
      const lanesOn = lanesA > 0.001 && out < 1;
      show(st.lanesCv, lanesOn);
      if (lanesOn) {
        // while the window folds, the lanes are clipped to it
        const clip = c < 1 ? `inset(${f2(Math.max(0, R.y - CV.top))}px ${f2(Math.max(0, 1920 - R.x - R.w))}px ${f2(Math.max(0, CV.top + CV.h - R.y - R.h))}px ${f2(Math.max(0, R.x))}px round ${f2(rad)}px)` : 'none';
        if (st.last.clip !== clip) { st.lanesCv.style.clipPath = clip; st.last.clip = clip; }
        drawLanes(st, { X, ta, pps, ph, xPh, zz, a: lanesA * outA, k: kOut, FPS, xl: trk.x0, xr: trk.x1 });
      }

      // header of the timeline: tag + frame counter
      const hdA = prog(t, T.col0 + 0.15, 0.4, ease.outCubic) * outA;
      show(st.counter, hdA > 0.001, 'flex'); show(st.tag, hdA > 0.001, 'flex');
      if (hdA > 0.001) {
        // once the fast-forward has landed, the counter steps back (fog, 70 %, 0.8×) and leaves the stage to the zoom
        const calm = prog(t, T.sw1 + 0.1, 0.5, ease.inOutCubic);
        tf2(st.counter, { y: 10 * (1 - clamp(prog(t, T.col0 + 0.15, 0.4, ease.outCubic))), s: lerp(1, 0.8, calm), o: hdA * lerp(1, 0.7, calm) });
        tf2(st.tag, { y: 10 * (1 - clamp(prog(t, T.col0 + 0.15, 0.4, ease.outCubic))), o: hdA });
        setStyle(st.cNum, 'color', calm > 0 ? M.mixColor(LIME, FOG, calm) : LIME);
        setStyle(st.cTot, 'color', calm > 0 ? M.mixColor(SNOW, FOG, calm) : SNOW);
        // a small kick when the fast-forward catches up with the real frame
        const kick = bump(t - T.sw1 + 0.02, 9, 16);
        st.cNum.style.transform = kick > 0 ? `scale(${(1 + 0.07 * kick).toFixed(4)})` : '';
        const fr = Math.min(st.totalFrames, Math.floor(ph * FPS + 1e-6) + 1);
        const [dim, sig] = odo(fr, st.nDig);
        if (st.last.fr !== fr) { st.cDim.textContent = dim; st.cSig.textContent = sig; st.last.fr = fr; }
      }

      // playhead: pops in at 0 s, races, then leaves its stem and flies to the centre for s22's iris
      const pin0 = T.sw0 - 0.1;
      const phOn = t >= pin0;
      show(st.pill, phOn, 'flex');
      const stemA = phOn ? clamp((t - pin0 - 0.05) / 0.12) * (1 - prog(t, T.fly0, 0.12)) : 0;
      show(st.stem, stemA > 0.001);
      if (phOn) {
        const pin = spring(t - pin0, { stiffness: 280, damping: 20 });
        tf2(st.pill, { x: pcx - st.pillW / 2, y: pcy - PILL.h / 2, s: lerp(0.5, 1, clamp(pin, 0, 1.2)), o: clamp((t - pin0) / 0.12) });
        const ptxt = `t = ${ph.toFixed(2)} s`;
        if (st.last.pill !== ptxt) { st.pill.textContent = ptxt; st.last.pill = ptxt; }
        const ga = lerp(0.3, PILL.glowA, flyP), gb = lerp(10, PILL.glow, flyP);
        st.pill.style.boxShadow = `0 6px 18px rgba(18,16,17,.35), 0 0 ${f2(gb)}px rgba(201,223,141,${ga.toFixed(3)})`;
        if (stemA > 0.001) {
          const bottom = lerp(LN.music[1], ZL.voice[1], zz);
          const top = PILL.top + PILL.h;
          st.stem.style.height = px(Math.max(0, bottom - top));
          tf2(st.stem, { x: xPh - 1, y: top, o: stemA });
        }
      }
      // the halo: gathers over the second half of the flight, centred on the pill
      const haloA = prog(t, T.fly0 + 0.18, 0.26, ease.inOutSine) * outA;
      show(st.halo, haloA > 0.001);
      if (haloA > 0.001) tf2(st.halo, { x: pcx - PILL.halo[0], y: pcy - PILL.halo[1], o: haloA });
      // motion trail while racing (overview only)
      const vpx = (X(ph) - X(phAt(t - 1 / 30))) * 30;
      const tw = zz < 0.05 && t > T.sw0 && t < T.sw1 + 0.2 ? clamp(vpx * 0.08, 0, 320) : 0;
      show(st.trail, tw > 3);
      if (tw > 3) { st.trail.style.width = px(tw); tf2(st.trail, { x: xPh - tw }); }

      // ---------- zoom annotations: held to the end, faded with the lanes through the iris ----------
      const annOn = inC && zz > 0.6 && out < 1;
      show(st.annot, annOn);
      if (annOn) {
        tf2(st.annot, { x: 960 * (1 - kOut), y: 540 * (1 - kOut), s: kOut, o: outA });
        renderAnnot(st, t, T, { X, xPh, zz, now });
      }
    },

    events(ctx) {
      const T = timings(ctx);
      const ev = [
        { t: T.flip0, type: 'swish', gain: 0.4 },                       // the page turns (the wipe already whooshed at 0)
        { t: T.type0, type: 'type', gain: 0.12 }, { t: T.type0 + T.typeGap, type: 'type', gain: 0.12 }, { t: T.type0 + 2 * T.typeGap, type: 'type', gain: 0.12 },
        { t: T.morph0, type: 'impact', gain: 0.35 },
        ...T.tabs.map(x => ({ t: x, type: 'pop', gain: 0.4 })),
        { t: T.col0, type: 'swish', gain: 0.3 },
      ];
      // shutter ticks accelerating while the playhead races to now
      const n = 8;
      for (let k = 0; k < n; k++) ev.push({ t: T.sw0 + (T.sw1 - T.sw0) * (1 - Math.pow(1 - k / n, 2)), type: 'shutter', gain: 0.16 + 0.02 * k });
      ev.push({ t: T.z0, type: 'whoosh', gain: 0.25 });
      ev.push({ t: T.br - 0.12, type: 'blip', gain: 0.3 });
      ev.push({ t: T.joke, type: 'sparkle', gain: 0.4 });
      ev.push({ t: T.fly0, type: 'swish', gain: 0.3 });                 // the pill leaves its playhead for the centre
      return ev;
    },
  });

  // ---------------- lanes (canvas): 画面 · 旁白 · 音乐; lit left of the playhead, dim to its right ----------------
  function rr(g, x, y, w, hh, r) {
    r = Math.max(0, Math.min(r, w / 2, hh / 2));
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + hh, r);
    g.arcTo(x + w, y + hh, x, y + hh, r);
    g.arcTo(x, y + hh, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
    g.fill();
  }
  function drawLanes(st, { X, ta, pps, ph, xPh, zz, a, k, FPS, xl, xr }) {
    const g = st.g;
    const TL = window.TIMELINE;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, 1920, CV.h);
    g.setTransform(k, 0, 0, k, 960 * (1 - k), 540 * (1 - k) - CV.top);   // k < 1 only through the iris: a slight recede
    const tb = ta + (xr - xl) / pps;
    const A = a;
    const ppf = pps / FPS;
    const cellsA = clamp((ppf - 4) / 6);
    const picY0 = lerp(LN.pic[0], ZL.pic[0], zz), picY1 = lerp(LN.pic[1], ZL.pic[1], zz);
    const vc = lerp(LN.vc, ZL.vc, zz);
    const curF = Math.floor(ph * FPS + 1e-6);
    for (let pass = 0; pass < 2; pass++) {             // 0 = not yet captured (right of the playhead), 1 = captured
      g.save();
      g.beginPath();
      if (pass === 0) g.rect(Math.max(xl - 2, xPh), 0, Math.max(0, xr + 2 - Math.max(xl - 2, xPh)), 2000);
      else g.rect(xl - 2, 0, Math.max(0, Math.min(xr + 2, xPh) - (xl - 2)), 2000);
      g.clip();
      const lit = pass === 1;
      // 画面: scene blocks by chapter → frame cells when zoomed in
      g.globalAlpha = A * (lit ? 0.92 : 0.26) * (1 - 0.8 * cellsA);
      TL.scenes.forEach(sc => {
        const x0 = Math.max(xl, X(sc.start) + 1), x1 = Math.min(xr, X(sc.start + sc.dur) - 1);
        if (x1 <= x0) return;
        g.fillStyle = CHAP[sc.chapter] || SNOW;
        rr(g, x0, picY0, x1 - x0, picY1 - picY0, 5);
      });
      if (cellsA > 0) {
        const f0 = Math.max(0, Math.floor(ta * FPS)), f1 = Math.ceil(tb * FPS);
        g.globalAlpha = A * cellsA * (lit ? 0.5 : 0.1);
        g.fillStyle = lit ? LIME : SNOW;
        for (let f = f0; f <= f1; f++) {
          const x0 = X(f / FPS) + 1, w = ppf - 2;
          if (x0 + w < xl || x0 > xr) continue;
          rr(g, x0, picY0, w, picY1 - picY0, 2.5);
        }
      }
      // 旁白: one bar per TTS word (height ∝ duration) → equal blocks when zoomed in
      g.fillStyle = LIME;
      g.globalAlpha = A * (lit ? lerp(0.6, 1, zz) : lerp(0.17, 0.2, zz));
      for (const wd of st.allWords) {
        if (wd.e < ta - 0.5 || wd.s > tb + 0.5) continue;
        const x0 = X(wd.s), x1 = X(wd.e);
        const gap = Math.min(4, (x1 - x0) * 0.12);
        const w = Math.max(1.3, x1 - x0 - gap);
        const hh = lerp(8 + 84 * ((wd.e - wd.s) / st.maxWd), ZL.voice[1] - ZL.voice[0], zz);
        rr(g, x0, vc - hh / 2, w, hh, Math.min(8, w / 2));
      }
      // 音乐: one bar per beat, height ∝ the scene's energy (downbeats a little taller); fades when zoomed in
      const mA = A * (1 - zz);
      if (mA > 0.003) {
        g.fillStyle = LILAC;
        g.globalAlpha = mA * (lit ? 0.72 : 0.2);
        const bw = Math.max(1.2, Math.min(0.5 * pps * 0.42, 12));
        for (const b of st.beats) {
          const x = X(b.t);
          if (x < xl - 2 || x > xr + 2) continue;
          const hh = 6 + 12 * b.e + (b.down ? 5 : 0);
          rr(g, x - bw / 2, LN.music[1] - hh, bw, hh, Math.min(1, bw / 2));
        }
      }
      g.restore();
    }
    // the frame being captured right now (only while it is on the track)
    const xc = X(curF / FPS) + 1;
    if (cellsA > 0.02 && xc >= xl - 1 && xc + ppf - 2 <= xr + 1) {
      g.globalAlpha = A * cellsA;
      g.fillStyle = LIME;
      rr(g, xc, picY0 - 3, ppf - 2, picY1 - picY0 + 6, 3);
    }
    g.globalAlpha = 1;
    g.setTransform(1, 0, 0, 1, 0, 0);
  }

  // ---------------- zoom annotations: word text (karaoke), real start times, bracket → live subtitle ----------------
  function renderAnnot(st, t, T, { X, xPh, zz, now }) {
    const wA = clamp((zz - 0.75) / 0.25);
    const vc = lerp(LN.vc, ZL.vc, zz);
    st.words.forEach((wd, i) => {
      const x0 = X(wd.s), x1 = X(wd.e);
      const tl = (x0 + x1) / 2 - 2 - wd.tw / 2;
      // karaoke split at the playhead
      const cut = clamp(xPh - tl, 0, wd.tw);
      tf2(wd.lite, { x: tl, y: vc - 15, o: wA });
      tf2(wd.ink, { x: tl, y: vc - 15, o: wA });
      wd.ink.style.clipPath = `inset(0 ${f2(wd.tw - cut)}px 0 0)`;
      wd.lite.style.clipPath = `inset(0 0 0 ${f2(cut)}px)`;
      show(wd.ink, cut > 0.5);
      show(wd.lite, cut < wd.tw - 0.5);
      // the real start time appears as the word is spoken (words already spoken appear as the dive lands)
      const tIn = Math.max(T.z1 - 0.1 + 0.06 * i, wd.sl);
      const p = prog(t, tIn, 0.2, ease.outCubic);
      const on = t >= tIn;
      show(wd.lab, on);
      wd.lead.style.display = on ? 'inline' : 'none';
      if (!on) return;
      // snow; lime only while its word is being spoken
      const speaking = now >= wd.s && now < wd.e;
      if (wd.col !== speaking) {
        wd.col = speaking;
        wd.lab.style.color = speaking ? LIME : SNOW85;
        wd.lead.setAttribute('stroke', speaking ? LIME : SNOW);
      }
      const ly = wd.above ? ZL.labA : ZL.labB;
      tf2(wd.lab, { x: x0 + wd.dx * zz - 1, y: ly + (wd.above ? 8 : -8) * (1 - p), o: p });
      const yA = wd.above ? ly + 28 : ZL.voice[1], yB = wd.above ? ZL.voice[0] : ly;
      wd.lead.setAttribute('x1', f2(x0 + 0.75)); wd.lead.setAttribute('x2', f2(x0 + 0.75));
      wd.lead.setAttribute('y1', f2(yA)); wd.lead.setAttribute('y2', f2(lerp(yA, yB, p)));
      wd.lead.setAttribute('stroke-opacity', ((speaking ? 0.7 : 0.4) * p).toFixed(3));
    });
    // bracket: drawn out from its centre, complete on 连; it stays to the end
    const xa = X(st.L3s), xb = X(st.L3e) - 3, xm = (xa + xb) / 2;
    const bp = ease.outCubic(clamp((t - (T.br - 0.2)) / 0.2));
    const half = (xb - xa) / 2 * bp;
    const yb = ZL.br;
    st.brPath.setAttribute('d', bp > 0 ? `M${f2(xm - half)},${yb - 12} L${f2(xm - half)},${yb} L${f2(xm + half)},${yb} L${f2(xm + half)},${yb - 12}` : 'M0,0');
    st.brPath.style.opacity = bp > 0 ? '1' : '0';
    // the leader drops towards the live subtitle, and retracts (arrow first) as the subtitle leaves
    const lp = prog(t, T.br + 0.04, 0.26, ease.outCubic);
    const lr = prog(t, T.leadOut, 0.09, ease.inCubic);
    const yEnd = lerp(ZL.leadTop, ZL.leadBot, lp * (1 - lr));
    const leadOn = lp > 0 && lr < 1;
    st.leader.setAttribute('d', `M${f2(xm)},${ZL.leadTop} L${f2(xm)},${f2(yEnd)}`);
    st.leader.style.opacity = leadOn ? '1' : '0';
    st.arrow.setAttribute('d', `M${f2(xm - 10)},${f2(yEnd - 11)} L${f2(xm)},${f2(yEnd)} L${f2(xm + 10)},${f2(yEnd - 11)}`);
    st.arrow.style.opacity = leadOn && lp > 0.6 ? (((lp - 0.6) / 0.4) * (1 - clamp(lr * 2))).toFixed(3) : '0';
    // the label: fully opaque on 连, held to the end
    const lb0 = T.br - 0.12;
    const lb = spring(t - lb0, { stiffness: 320, damping: 20 });
    st.brLab.style.left = px(xm - 960);
    show(st.brLab, t >= lb0);
    tf2(st.brLab, { s: lerp(0.7, 1, clamp(lb, 0, 1.2)), o: clamp((t - lb0) / 0.12) });
    // 也: 这句也是。 — under the bracket's right end, answering the label
    const jk = spring(t - T.joke, { stiffness: 300, damping: 16 });
    show(st.joke, t >= T.joke);
    tf2(st.joke, { x: Math.min(1808, xb) - st.jokeW - 18, y: ZL.joke, s: lerp(0.4, 1, clamp(jk, 0, 1.3)), r: -5 + 3 * bump(t - T.joke, 7, 12), o: clamp((t - T.joke) / 0.12) });
  }
})();
