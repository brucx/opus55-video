/*
 * Case card template, shared by every featured-case scene (narration.json: "template": "case", "file": "case").
 *
 * Choreography (film review round 1 redesign: footage first, proof strips, less text at once; round 2: steady footage)
 *  - zoom-in case (s06_c1): the card springs in exactly as before (spring(t − 0.05, {140, 19}), 0.86 → 1, +30 px rise,
 *    push 1 + 0.025·t/dur, centre (632, 515)); s05_wall tracks that pose and the active series dot for its hand-off.
 *  - push cases (s07–s13): FOOTAGE FIRST. The first clip plays big, centred in the content box (16:9 1312×738 · 1:1
 *    738×738 · 9:16 415×738 at (960, 510)) with its credit chip, until T.shrink; then the same element shrinks into its
 *    card slot (0.5 s outCubic, transform only) while the header rises (tag · title · meta, ~0.1 s apart).
 *    T.shrink defaults to the secret's word − 0.3 s; data.shrink (a cue) holds the footage big until 0.35 s before that
 *    cue (round 2: ≈2 s of steady full-size footage per case instead of a 0.4 s flash).
 *  - the secret lands on its word. If the word comes while the footage is still big, it lands ON the footage as a lime
 *    caption on a dark pill (top inset on the column's side; 9:16: in the margin beside the footage), and rides into
 *    its column slot with the shrink (transform only; the pill fades on the way).
 *  - layout 'A' = card left / column right, 'B' = mirrored; default alternates with the case index (odd A, even B).
 *    16:9 cards always settle at the template's classic 1000×562 slot (centre x 632 or 1288, y 515): s14_formula
 *    replicates case 8's final card (1000×562 at (632, 515), push 1.025, last frame) under its iris, so s13 is 'A'.
 *  - column: CASE tag, title, ONE quiet meta line (@handle · 路线), the provenance caveat (24 px, 78 % white), lime rule,
 *    the secret (no 「炫在哪里」 label), points (the newest bright, earlier ones dimmed; all dim when 照搬 lands), and
 *    the takeaway box with a small 「照搬」 label (20 px mono, the tag/meta floor).
 *  - proof strip (data.proof): a small diagram that SHOWS the trick while the voice states it — 'film' (the whole film
 *    as a bar, its warm span in amber, a lime playhead reading the clip's real source time in seconds from
 *    ctx.clipInfo; the card gets an amber rim while the playhead is inside the warm span), 'lanes' (picture / voice /
 *    music lanes, each re-cut on its word, under ONE playhead whose handle is labelled), 'chain' (chips that light in
 *    order with the clips or the words; the newest is the lime pill; footage moments that pass before the strip is up
 *    light one by one once it has faded in; an item's optional `say` cue rings it with a lime pulse when the voice names
 *    it, without changing its lit state). pos 'above' (default, y 150–220 over a 16:9 card) or 'left' (vertical rail
 *    beside s06's 1:1 card).
 *  - pager dots: the film's through-object (lime active dot). Never faded for a transition. Big phase (16:9 / 1:1): on
 *    the credit chip's own row, just right of it, so the two never cross while the card shrinks (the row barely moves
 *    vertically: it settles 34 px under the card); 9:16: just outside the footage, level with the credit, gliding 0.15 s
 *    after the card starts shrinking (once the credit has risen out of its band). An incoming row enters the screen
 *    at ~⅓ of a push, before the outgoing row is covered. data.tint lilacs dots ≥ tint.from (the 后四招 cases also use
 *    ready-made footage or other models).
 *  - data.bridge (s10): a lilac banner in the big footage's top margin, from the page's arrival until the card starts
 *    to shrink (and before the next clip cuts in); bridge.mark draws a purple outline (+ lilac tag) round the page's
 *    ready-made thumbnails on its word, and the footage pushes in toward them.
 *  - data.trio (s11, 9:16): on its word the card becomes the middle of three side-by-side panels, each with its credit;
 *    a slow shared 1 → 1.03 drift keeps the held frames alive; a side panel may ping-pong its clip (loop 'pingpong').
 *  - credit chips: .88 black + 1 px hairline so they read on white pages and paper alike (原作片段 18 px, as s01);
 *    every visible excerpt carries one. A clip with credit 'right' anchors it bottom-right (a page busy bottom-left).
 *
 * ctx.data:
 *   index, total            position in the series (1-based)
 *   aspect                  '16:9' | '1:1' | '9:16'
 *   layout                  'A' | 'B' (optional)
 *   clips: [{id, from?, dur?, credit?: 'right'}]   footage played in sequence in the card (clip-local start `from`)
 *   author, work, tagline, secret, points[], takeaway, caveat     text (tagline = 「路线：…」)
 *   cues: { secret, points: [...], takeaway }   sync overrides
 *     a cue is lineId | [lineId, word, nth?] | seconds | {clip, t} (= clip `clip` at its own time t: a footage moment)
 *   shrink: cue              hold the footage big until 0.35 s before this cue (push cases)
 *   capTop: px               the secret caption's pill top below the big footage's top edge (default 28; keeps it off
 *                            the footage's own data labels)
 *   proof: { type: 'film', total, warm: [from, to], label, warmLabel: [word, rest], cues: {total, warm, nine} }
 *        | { type: 'lanes', lanes: [{label, cue}], edits: [cue, …], align: cue, label, note }
 *        | { type: 'chain', dir?: 'v', pos?: 'left', items: [{label, sub?, sep?, say?, cue? | clip + t?}] }
 *          (clip + t = clip index in `clips` and that clip's own time: lights when the footage reaches it)
 *   bridge: { text: [strong, rest], line, mark?: {box: [x0, y0, x1, y1] (footage fractions), at: cue, label, push, pushFrom: cue} }
 *   tint: { from, at? }        kenBurns: false (s13: s14 hand-off)
 *   trio:   { at: cue, labels: [l, m, r], side: [{id, from, loop?, loopFrom?}, …] }   left / right panels; middle = the card
 *           (loop 'pingpong': after one pass from `from`, swing between the clip's end and loopFrom)
 * render() keeps the three lines s21_meta prints (`const a = spring(`, `tf(s.card.el,`, `up(s.tag,`): keep them.
 */
(() => {
  'use strict';
  const { h, tf } = E;
  const { clamp, lerp, prog, ease, spring } = M;
  const LIME = '#C9DF8D', LILAC = '#EAD8EB', PURPLE = '#AD85BA', INK = '#241E1E', SNOW = '#F4F1F2', FOG = '#A39A9B', AMBER = '#F2A649';
  const BIG = { '16:9': [1312, 738], '1:1': [738, 738], '9:16': [415, 738] };      // footage-first size, centre (960, 510)
  const CARD = { '16:9': [1000, 562], '1:1': [620, 620], '9:16': [360, 640] };     // settled card
  const BIG_C = { x: 960, y: 510 };
  const SHRINK = 0.5;                                     // big → card, outCubic
  const SHRINK_LEAD = 0.35;                               // data.shrink: the card starts shrinking this long before its cue
  const COL_W = 596, COL_TOP = 150;
  const STRIP = { top: 150, h: 70 };                     // proof strip over a 16:9 card (card top 234, 227 at push 1.025)
  const TRIO = { w: 330, h: 587, gap: 25, cy: 468 };     // s11 panels: 3 × 330 + 2 × 25 = the 1040 px card region
  const CREDIT_BG = 'rgba(10,8,9,.88)', CREDIT_LINE = '0 0 0 1px rgba(255,255,255,.18)';
  // footage-first secret caption: pill padding; 16:9 / 1:1 inset from the footage's top corner; 9:16 margin gap and top
  const CAP = { padX: 22, padY: 9, inset: 32, top: 28, gap916: 40, top916: 470 };
  const DOT_GAP = 26;                                    // big phase: the dots row starts this far right of the credit chip
  const WRAP = { wordBreak: 'keep-all', overflowWrap: 'anywhere', textWrap: 'balance' };   // CJK lines break at punctuation, evenly
  const px = v => `${v.toFixed ? v.toFixed(1) : v}px`;
  const pad2 = n => String(n).padStart(2, '0');

  // ---------------- timing (pure in ctx; shared by build and events) ----------------
  // a cue: lineId | [lineId, word, nth?] | seconds | {clip, t} (a footage moment: clip index in the sequence, its own time)
  function cueFn(ctx, seq) {
    return (c, fb) => {
      if (c == null) return fb;
      if (typeof c === 'number') return c;
      if (Array.isArray(c)) return ctx.word(c[0], c[1], c[2] || 0, ctx.cue(c[0], fb));
      if (typeof c === 'object') { const q = seq[c.clip]; return q ? q.t0 + (c.t || 0) - (q.from || 0) : fb; }
      return ctx.cue(c, fb);
    };
  }
  function sequence(ctx, clips) {
    let acc = 0;
    return clips.map(c => {
      const info = ctx.clipInfo(c.id);
      const nat = info ? info.frames / info.fps - (c.from || 0) : 4;
      const dur = c.dur || nat;
      const o = { ...c, t0: acc, dur, nat };
      acc += dur;
      return o;
    });
  }
  // the clip on screen at t: clip-local time (clamped to the clip) and how long its last frame has been held
  function clipAt(seq, t) {
    let idx = seq.length - 1;
    for (let i = 0; i < seq.length; i++) if (t < seq[i].t0 + seq[i].dur) { idx = i; break; }
    const cur = seq[idx];
    const lt = Math.max(0, t - cur.t0);
    return { id: cur.id, idx, credit: cur.credit || 'left', local: Math.min(lt, cur.nat - 1 / 60) + (cur.from || 0), over: Math.max(0, lt - cur.nat) };
  }
  function timing(ctx) {
    const d = ctx.data, L = ctx.lines;
    const zoom = !!(ctx.transition && ctx.transition.type === 'zoom');
    const cues = d.cues || {};
    const T = { zoom };
    T.seq = sequence(ctx, d.clips);
    const at = cueFn(ctx, T.seq);
    T.say = at(cues.secret, L[0] ? L[0].start + 0.2 : 0.8);                 // the secret's spoken word
    // footage plays big until here: by default just before the secret's word; data.shrink holds it longer
    T.shrink = zoom ? 0 : Math.max(0.75, d.shrink != null ? at(d.shrink, T.say) - SHRINK_LEAD : T.say - 0.3);
    T.head = zoom ? 0.15 : T.shrink + 0.1;                           // tag, then title / meta / caveat 0.08 s apart
    T.cap = !zoom && T.say < T.shrink - 0.2;                          // the secret lands on the big footage as a caption
    T.secret = T.cap ? T.say : Math.max(T.say, T.head + 0.2);
    T.points = (d.points || []).map((_, i) => at(cues.points && cues.points[i], L[1 + i] ? L[1 + i].start : T.secret + 0.8 + i * 0.7));
    T.take = at(cues.takeaway, L.length > 1 ? L[L.length - 1].start : T.secret + 2.5);
    T.strip = zoom ? 0.55 : T.shrink + 0.32;                         // proof strip appears once the card has cleared it
    const pf = d.proof || null;
    if (pf && pf.items) {
      // a footage moment that passed before the strip was up lights once it has faded in, one by one
      const s0 = T.strip + 0.25;
      T.items = pf.items.map((it, i) => {
        const x = it.clip != null ? at({ clip: it.clip, t: it.t || 0 }, T.strip) : at(it.cue, T.strip);
        return x < s0 ? s0 + 0.2 * i : x;
      });
      for (let i = 1; i < T.items.length; i++) T.items[i] = Math.max(T.items[i], T.items[i - 1]);
      T.says = pf.items.map(it => (it.say != null ? at(it.say, null) : null));
    }
    if (pf && pf.type === 'film') {
      const c = pf.cues || {};
      T.film = { total: at(c.total, T.strip + 1), warm: at(c.warm, T.strip + 2), nine: at(c.nine, T.strip + 3) };
    }
    if (pf && pf.type === 'lanes') {
      T.lanes = (pf.lanes || []).map(l => at(l.cue, T.strip));
      T.edits = (pf.edits || []).map(c => at(c, Infinity));
      T.align = at(pf.align, Infinity);
    }
    // the banner arrives with the page (≥ chars ÷ 4.5 + 1.5 s of reading, amendments G3) and is gone as the card starts
    // to shrink (before the header rises into its corner) and before the next clip cuts in (that page has its own headline)
    if (d.bridge) {
      T.bridge = { t0: Math.max(0.15, ctx.cue(d.bridge.line, 0.5) - 0.3), t1: Math.max(ctx.cueEnd(d.bridge.line, 4) + 0.3, T.shrink - 0.28) };
      if (T.seq.length > 1) T.bridge.t1 = Math.min(T.bridge.t1, T.seq[1].t0 - 0.28);
      const mk = d.bridge.mark;
      if (mk) T.mark = { t0: at(mk.at, T.bridge.t0 + 1), p0: at(mk.pushFrom, null), p1: T.seq.length > 1 ? T.seq[1].t0 : ctx.dur };
    }
    if (d.tint) T.tint = d.tint.at ? at(d.tint.at, 0) + 0.15 : -1;
    if (d.trio) T.trio = at(d.trio.at, Infinity);
    return T;
  }

  // ---------------- pieces ----------------
  function styleCredit(el) {
    if (!el) return;
    el.style.background = CREDIT_BG;
    el.style.boxShadow = CREDIT_LINE;
    el.style.transformOrigin = '0 100%';
    const sm = el.querySelector('small');
    if (sm) sm.style.font = '500 18px/1 var(--mono)';               // 原作片段 at s01's size (kit default is 16 px)
  }

  function buildColumn(d, x, tinted) {
    const col = h('div', { class: 'abs', style: { left: px(x), top: px(COL_TOP), width: px(COL_W), display: 'flex', flexDirection: 'column' } });
    const tag = K.tag(`CASE ${pad2(d.index)} / ${pad2(d.total)}`);
    const tagRow = h('div', { style: { display: 'flex', marginBottom: '20px' } }, tag);
    const work = h('div', { style: { font: '800 52px/1.16 var(--cn)', color: SNOW, marginBottom: '12px', whiteSpace: 'nowrap' }, text: d.work });
    const meta = h('div', { style: { font: '500 24px/1.3 var(--cn)', color: FOG, marginBottom: '6px', whiteSpace: 'nowrap' } },
      h('span', { style: { font: '600 22px/1 var(--mono)', letterSpacing: '.02em' }, text: d.author }),
      d.tagline ? h('span', { text: `  ·  ${d.tagline}` }) : null);
    // the provenance caveat is the honesty label: 24 px at 78 % white; a lilac rule marks the 后四招 cases
    const caveat = d.caveat ? h('div', { style: { font: '500 24px/1.35 var(--cn)', color: 'rgba(244,241,242,.78)', marginBottom: '22px',
      paddingLeft: tinted ? '14px' : '0px', borderLeft: tinted ? `3px solid ${LILAC}` : 'none' }, text: d.caveat }) : null;
    const rule = h('div', { style: { height: '3px', width: px(COL_W), background: LIME, transformOrigin: '0 50%', marginBottom: '22px', borderRadius: '2px' } });
    // the secret: its box hugs the text; the pill behind it shows only while it is a caption on the big footage
    const secPill = h('div', { class: 'abs', style: { left: px(-CAP.padX), right: px(-CAP.padX), top: px(-CAP.padY), bottom: px(-CAP.padY),
      borderRadius: '18px', background: 'rgba(10,8,9,.82)', boxShadow: '0 0 0 1px rgba(255,255,255,.14), 0 14px 36px rgba(0,0,0,.35)', opacity: '0' } });
    const secBox = h('div', { style: { position: 'relative', width: 'fit-content', maxWidth: '100%' } },
      secPill, h('span', { style: { position: 'relative' }, text: d.secret }));
    const secret = h('div', { style: { font: '900 52px/1.18 var(--cn)', color: LIME, marginBottom: '20px', ...WRAP } }, secBox);
    const pts = (d.points || []).map(p => {
      const dot = h('span', { style: { flex: 'none', width: '10px', height: '10px', marginTop: '17px', borderRadius: '50%', background: LIME } });
      const row = h('div', { style: { display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '10px' } },
        dot, h('span', { style: { font: '500 30px/1.4 var(--cn)', color: SNOW, ...WRAP }, text: p }));
      return { row, dot };
    });
    const take = h('div', { style: { marginTop: '14px', padding: '14px 22px 16px', borderRadius: '18px', background: 'rgba(201,223,141,.10)', border: '1.5px solid rgba(201,223,141,.40)' } },
      h('div', { style: { font: '600 20px/1 var(--mono)', color: LIME, letterSpacing: '.1em', marginBottom: '10px' }, text: '照搬' }),
      h('div', { style: { font: '600 30px/1.4 var(--cn)', color: SNOW, ...WRAP }, text: d.takeaway }));
    col.append(tagRow, work, meta);
    if (caveat) col.append(caveat);
    col.append(rule, secret, ...pts.map(p => p.row), take);
    return { col, tag, work, meta, caveat, rule, secret, secBox, secPill, pts, take };
  }

  // pager dots; left/top = the classic slot (s05 computes the active dot from it)
  function buildDots(d) {
    const W = (d.total - 1) * 26 + 30;
    const wrap = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(W), height: '14px' } });
    const cap = h('div', { class: 'abs', style: { left: '-16px', top: '-11px', width: px(W + 32), height: '36px', borderRadius: '18px',
      background: 'rgba(10,8,9,.66)', boxShadow: '0 0 0 1px rgba(255,255,255,.12)' } });
    const row = h('div', { class: 'abs', style: { left: '0px', top: '0px', display: 'flex', gap: '12px' } });
    const dots = [];
    for (let i = 1; i <= d.total; i++) {
      const sp = h('span', { style: { display: 'block', width: i === d.index ? '30px' : '14px', height: '14px', borderRadius: '7px', background: i === d.index ? LIME : 'rgba(255,255,255,.22)' } });
      row.append(sp);
      dots.push(sp);
    }
    wrap.append(cap, row);
    return { wrap, cap, dots };
  }

  // ---- proof: chips that light in order ----
  function buildChain(pf, T) {
    const vert = pf.dir === 'v';
    const el = h('div', { class: 'abs', style: { display: 'flex', flexDirection: vert ? 'column' : 'row', alignItems: 'center', gap: vert ? '6px' : '12px' } });
    const items = pf.items.map((it, i) => {
      const glyph = it.sep != null ? it.sep : pf.sep != null ? pf.sep : vert ? '↓' : '→';
      const sep = i > 0 && glyph ? h('span', { style: { font: '700 26px/1 var(--sans)', color: 'rgba(255,255,255,.3)', padding: vert ? '0' : '0 2px' }, text: glyph }) : null;
      const chip = h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '10px', padding: '9px 18px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
        font: '700 25px/1.1 var(--cn)', border: '2px solid rgba(255,255,255,.22)', background: 'rgba(18,16,17,.6)', color: FOG } },
        h('span', { text: it.label }), it.sub ? h('span', { style: { font: '500 22px/1.1 var(--cn)', opacity: '0.85' }, text: it.sub }) : null);
      if (sep) el.append(sep);
      el.append(chip);
      return { chip, sep, at: T.items[i], say: T.says ? T.says[i] : null };
    });
    function draw(t) {
      let cur = -1;
      items.forEach((it, i) => { if (t >= it.at) cur = i; });
      items.forEach((it, i) => {
        const lit = t >= it.at, now = i === cur;
        it.chip.style.background = now ? LIME : lit ? 'rgba(201,223,141,.14)' : 'rgba(18,16,17,.6)';
        it.chip.style.borderColor = now ? LIME : lit ? 'rgba(201,223,141,.55)' : 'rgba(255,255,255,.22)';
        it.chip.style.color = now ? INK : lit ? SNOW : FOG;
        const sp = lit ? spring(t - it.at, { stiffness: 320, damping: 17 }) : 1;
        // the voice names this chip: a 2 px lime ring and a 1 → 1.08 → 1 pulse (0.5 s); its lit state stays the footage's
        const u = it.say != null ? (t - it.say) / 0.5 : -1;
        const pulse = u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
        it.chip.style.boxShadow = pulse > 0.005 ? `0 0 0 2px rgba(201,223,141,${pulse.toFixed(3)})` : 'none';
        tf(it.chip, { s: (now ? lerp(0.86, 1, sp) : 1) * (1 + 0.08 * pulse) });
        if (it.sep) it.sep.style.color = lit ? LIME : 'rgba(255,255,255,.3)';
      });
    }
    return { el, draw };
  }

  // ---- proof: the whole film as a bar, warm segment, playhead on the clip's real source time ----
  function buildFilm(pf, W, ctx) {
    const el = h('div', { class: 'abs', style: { width: px(W), height: px(STRIP.h) } });
    const LAB = 158, BX = LAB, BW = W - LAB, BY = 44;     // bar: x from LAB, centre y 44
    const xOf = s => BX + BW * clamp(s / pf.total);
    const label = h('div', { class: 'abs', style: { left: '0px', top: px(BY - 17), font: '700 26px/1.25 var(--cn)', color: SNOW, whiteSpace: 'nowrap' }, text: pf.label });
    const track = h('div', { class: 'abs', style: { left: px(BX), top: px(BY - 8), width: px(BW), height: '16px', borderRadius: '8px', background: 'rgba(255,255,255,.16)', boxShadow: '0 0 0 1px rgba(255,255,255,.08)' } });
    const x0 = xOf(pf.warm[0]), x1 = xOf(pf.warm[1]);
    const seg = h('div', { class: 'abs', style: { left: px(x0), top: px(BY - 8), width: px(x1 - x0), height: '16px', borderRadius: '8px', background: AMBER } });
    const wl = pf.warmLabel || ['暖光', ''];
    const warmA = h('span', { text: wl[0] }), warmB = h('span', { text: wl[1] ? ` ${wl[1]}` : '' });
    const warm = h('div', { class: 'abs', style: { left: px((x0 + x1) / 2), top: '-6px', transform: 'translateX(-50%)', font: '800 26px/1.1 var(--cn)', color: AMBER, whiteSpace: 'nowrap' } }, warmA, warmB);
    const head = h('div', { class: 'abs', style: { left: '0px', top: px(BY - 15), height: '30px', padding: '0 10px', borderRadius: '15px', background: LIME, color: INK,
      font: '600 20px/30px var(--mono)', whiteSpace: 'nowrap', boxShadow: '0 0 0 2px rgba(18,16,17,.85), 0 4px 14px rgba(0,0,0,.45)', fontVariantNumeric: 'tabular-nums' } });
    el.append(label, track, seg, warm, head);
    let hw = null;
    function draw(t, T) {
      const cur = clipAt(T.seq, t);
      const info = ctx.clipInfo(cur.id);
      const src = (info ? info.srcStart : 0) + cur.local;
      const txt = `${src.toFixed(1)} s`;                            // the film's own time; fixed width (all ≥ 10 s)
      if (head.textContent !== txt) head.textContent = txt;
      if (hw == null) hw = head.offsetWidth || 96;
      tf(head, { x: xOf(src) - hw / 2 });
      const wv = clamp((src - pf.warm[0]) / 0.3) * clamp((pf.warm[1] - src) / 0.3);   // 1 while the playhead is in the warm span
      seg.style.boxShadow = wv > 0.01 ? `0 0 ${(24 * wv).toFixed(1)}px rgba(242,166,73,.9), 0 0 0 2px rgba(242,166,73,${(0.5 * wv).toFixed(3)})` : 'none';
      const fl = M.env(t, T.film.total, T.film.total + 1.1, 0.12, 0.6);       // 「60 秒」: the whole bar flashes
      track.style.background = `rgba(255,255,255,${(0.16 + 0.3 * fl).toFixed(3)})`;
      label.style.color = fl > 0.02 ? M.mixColor('#F4F1F2', '#C9DF8D', fl) : SNOW;
      const a = prog(t, T.film.warm, 0.4, ease.outCubic), b = prog(t, T.film.nine, 0.4, ease.outCubic);
      warm.style.opacity = a.toFixed(3);
      warm.style.transform = `translate(-50%, ${((1 - a) * 8).toFixed(2)}px)`;
      warmB.style.opacity = b.toFixed(3);
      return wv;
    }
    return { el, draw };
  }

  // ---- proof: picture / voice / music lanes on one timeline (schematic, labelled 示意) ----
  const LANE_BLOCKS = [
    [[0, 0.17], [0.19, 0.41], [0.43, 0.62], [0.64, 0.83], [0.85, 1]],
    [[0.03, 0.15], [0.2, 0.37], [0.45, 0.58], [0.66, 0.8], [0.87, 0.97]],
    [[0, 0.24], [0.255, 0.495], [0.51, 0.745], [0.76, 1]],
  ];
  const LANE_COL = ['rgba(244,241,242,.55)', 'rgba(234,216,235,.75)', 'rgba(173,133,186,.9)'];
  const LANE_EDIT = [[2, 0.62, 0.55], [3, 0.8, 0.74], [1, 0.495, 0.43]];   // which block each edit re-cuts: [block, from end, to end]
  function buildLanes(pf, W) {
    const el = h('div', { class: 'abs', style: { width: px(W), height: px(STRIP.h) } });
    // lanes 14 px on a 28 px pitch: the 22 px labels get 6 px between rows; the block ends at y 220, clear of the card (227)
    const LX = 76, NOTE = pf.note ? 58 : 0, LW = W - LX - NOTE - 12, LH = 14, LG = 14, H3 = 3 * LH + 2 * LG;
    const lanes = (pf.lanes || []).map((ln, i) => {
      const y = i * (LH + LG);
      const lab = h('div', { class: 'abs', style: { left: '0px', top: px(y - 6), width: '64px', font: '700 22px/26px var(--cn)', color: SNOW, whiteSpace: 'nowrap' }, text: ln.label });
      const bg = h('div', { class: 'abs', style: { left: px(LX), top: px(y), width: px(LW), height: px(LH), borderRadius: '5px', background: 'rgba(255,255,255,.06)' } });
      el.append(lab, bg);
      const blocks = LANE_BLOCKS[i % 3].map(([a, b]) => {
        const bl = h('div', { class: 'abs', style: { left: px(LX + a * LW), top: px(y), width: px((b - a) * LW - 2), height: px(LH), borderRadius: '5px', background: LANE_COL[i % 3] } });
        el.append(bl);
        return { bl, a, b };
      });
      return { lab, bg, blocks, y };
    });
    // ONE shared playhead through all three lanes; its handle carries the label
    const line = h('div', { class: 'abs', style: { left: px(LX - 1.5), top: '-6px', width: '3px', height: px(H3 + 12), borderRadius: '2px', background: LIME } });
    const pill = h('div', { class: 'abs', style: { left: px(LX), top: px(H3 / 2 - 17), height: '34px', padding: '0 14px', borderRadius: '17px',
      font: '800 21px/30px var(--cn)', whiteSpace: 'nowrap', border: `2px solid ${LIME}`, color: LIME, background: 'rgba(18,16,17,.92)',
      boxShadow: '0 4px 14px rgba(0,0,0,.5)' }, text: pf.label || '一条时间轴' });
    const note = pf.note ? h('div', { class: 'abs', style: { left: px(W - NOTE + 8), top: px(H3 / 2 - 10), font: '500 20px/1 var(--cn)', color: FOG }, text: pf.note }) : null;
    el.append(line, pill);
    if (note) el.append(note);
    let pw = null;
    function draw(t, T, dur) {
      lanes.forEach((ln, i) => {
        const a = prog(t, T.lanes[i], 0.35, ease.outCubic);
        ln.lab.style.opacity = (0.25 + 0.75 * a).toFixed(3);
        ln.blocks.forEach((b, k) => {
          const e = LANE_EDIT[i % 3];
          const te = T.edits[i];
          let w = (b.b - b.a) * LW - 2;
          let col = LANE_COL[i % 3];
          if (k === e[0] && te < Infinity) {                       // 每层单独改: this lane's block is re-cut on its word
            const q = prog(t, te, 0.3, ease.outCubic);
            w = (lerp(e[1], e[2], q) - b.a) * LW - 2;
            const fl = M.env(t, te, te + 0.9, 0.08, 0.5);
            if (fl > 0.02) col = `rgba(201,223,141,${(0.55 + 0.45 * fl).toFixed(3)})`;
          }
          b.bl.style.width = px(Math.max(4, w));
          b.bl.style.background = col;
          b.bl.style.opacity = (0.2 + 0.8 * a).toFixed(3);
        });
      });
      if (pw == null) pw = pill.offsetWidth || 140;
      const p = clamp((t - T.strip) / Math.max(1, dur - T.strip));
      const x = lerp(pw / 2 + 6, LW - pw / 2 - 6, p);          // the handle never leaves the lanes
      tf(line, { x });
      const g = prog(t, T.align, 0.3, ease.outCubic);            // 对齐同一条时间轴: the playhead lights up
      const sp = g > 0 ? spring(t - T.align, { stiffness: 300, damping: 16 }) : 1;
      tf(pill, { x: x - pw / 2, s: lerp(0.88, 1, sp) });
      line.style.boxShadow = g > 0.01 ? `0 0 ${(16 * g).toFixed(1)}px rgba(201,223,141,.95)` : 'none';
      pill.style.background = g > 0.5 ? LIME : 'rgba(18,16,17,.92)';
      pill.style.color = g > 0.5 ? INK : LIME;
    }
    return { el, draw };
  }

  // ---- s10: lilac banner over the big footage ----
  function buildBanner(bd) {
    const [strong, rest] = Array.isArray(bd.text) ? bd.text : [bd.text, ''];
    const el = h('div', { class: 'abs', style: { left: '960px', top: '0px', display: 'flex', alignItems: 'baseline', gap: '14px', padding: '14px 30px 16px', borderRadius: '20px',
      background: LILAC, color: INK, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,.45), 0 0 0 2px rgba(173,133,186,.9)' } },
      h('span', { style: { font: '900 36px/1.15 var(--cn)' }, text: strong }),
      rest ? h('span', { style: { font: '700 32px/1.15 var(--cn)', color: '#7A5A86' }, text: '·' }) : null,
      rest ? h('span', { style: { font: '700 32px/1.15 var(--cn)', color: '#3A2F3B' }, text: rest }) : null);
    return { el };
  }

  // ---- s10: outline + tag round the page's ready-made thumbnails, inside the card (moves and scales with the footage).
  // Drawn while the card is big, so its sizes are screen px ÷ the big scale k.
  function buildMark(mk, cw, ch, k) {
    const [x0, y0, x1, y1] = mk.box;
    const bx = x0 * cw, by = y0 * ch, bw = (x1 - x0) * cw, bh = (y1 - y0) * ch, pad = 10 / k;
    const wrap = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: px(cw), height: px(ch), transformOrigin: '50% 50%', visibility: 'hidden' } });
    const svg = E.s('svg', { width: (bw + 2 * pad).toFixed(1), height: (bh + 2 * pad).toFixed(1), style: { position: 'absolute', left: px(bx - pad), top: px(by - pad), overflow: 'visible' } });
    const rect = (stroke, sw) => E.s('rect', { x: pad.toFixed(2), y: pad.toFixed(2), width: bw.toFixed(1), height: bh.toFixed(1), rx: (10 / k).toFixed(2), fill: 'none',
      stroke, 'stroke-width': (sw / k).toFixed(2), pathLength: '1', 'stroke-dasharray': '1 1', 'stroke-dashoffset': '1', 'stroke-linecap': 'round' });
    const halo = rect('rgba(234,216,235,.95)', 9), line = rect(PURPLE, 3.5);
    svg.append(halo, line);
    const tag = h('div', { class: 'abs', style: { right: px(cw - (bx + bw)), bottom: px(ch - by + 10 / k), padding: `${(4 / k).toFixed(2)}px ${(13 / k).toFixed(2)}px ${(5 / k).toFixed(2)}px`,
      borderRadius: px(10 / k), background: LILAC, color: INK, font: `800 ${(23 / k).toFixed(2)}px/1.2 var(--cn)`, whiteSpace: 'nowrap',
      boxShadow: `0 0 0 ${(2 / k).toFixed(2)}px rgba(173,133,186,.9), 0 ${(6 / k).toFixed(2)}px ${(16 / k).toFixed(2)}px rgba(36,30,30,.25)`, transformOrigin: '100% 100%' },
      text: mk.label || '他人作品' });
    wrap.append(svg, tag);
    return { wrap, halo, line, tag, P: { x: bx + bw / 2, y: by + bh / 2 }, push: mk.push != null ? mk.push : 0.04 };
  }

  // ---------------- template ----------------
  Scene.template('case', {
    build(root, ctx) {
      const d = ctx.data;
      const T = timing(ctx);
      const aspect = d.aspect || '16:9';
      const layout = d.layout || (d.index % 2 ? 'A' : 'B');
      const tinted = !!d.tint;
      K.bg(root, 'night');
      // ambient: tiny blurred copy of the footage scaled up behind everything
      const amb = h('img', { class: 'abs', style: { left: '0px', top: '0px', width: '192px', height: '108px', objectFit: 'cover', filter: 'blur(5px) saturate(1.3)', transformOrigin: '0 0', opacity: '0.42' } });
      const ambWrap = h('div', { class: 'fill', style: { overflow: 'hidden' } }, amb);
      const shade = h('div', { class: 'fill', style: { background: `linear-gradient(${layout === 'A' ? 90 : 270}deg, rgba(18,16,17,.35) 0%, rgba(18,16,17,.78) 55%, rgba(18,16,17,.94) 100%)` } });
      const shadeBig = h('div', { class: 'fill', style: { background: 'radial-gradient(ellipse at 50% 47%, rgba(18,16,17,.35) 30%, rgba(18,16,17,.86) 75%)', opacity: '0' } });
      root.append(ambWrap, shade, shadeBig);

      // geometry: the classic slot (x 632 / 1288, y 515); 9:16 sits a little higher to leave room for its dots
      const [cw, ch] = CARD[aspect] || CARD['16:9'];
      const cx = layout === 'A' ? 632 : 1288;
      const cy = aspect === '9:16' ? 492 : 515;
      const [bw] = BIG[aspect] || BIG['16:9'];
      const big = { dx: BIG_C.x - cx, dy: BIG_C.y - cy, s: bw / cw };

      // proof strip (under the card in z: the shrinking footage passes over it)
      let proof = null;
      const pf = d.proof;
      if (pf) {
        if (pf.type === 'film') proof = buildFilm(pf, cw, ctx);
        else if (pf.type === 'lanes') proof = buildLanes(pf, cw);
        else proof = buildChain(pf, T);
        if (pf.pos === 'left' || pf.dir === 'v') { proof.el.style.right = px(1920 - (cx - cw / 2 - 30)); proof.el.style.top = '0px'; proof.side = true; }
        else { proof.el.style.left = px(cx - cw / 2); proof.el.style.top = px(STRIP.top); }
        root.append(proof.el);
      }

      // s11: the side panels of the trio sit under the card and slide out from behind it
      let trio = null;
      if (d.trio) {
        const pw = TRIO.w, ph = TRIO.h, step = pw + TRIO.gap;
        const side = d.trio.side.map((sd, i) => {
          const v = K.videoCard({ clip: sd.id, w: pw, h: ph, radius: 20, credit: { author: d.author, note: '原作片段' } });
          styleCredit(v.creditEl);
          v.el.style.left = px(cx - pw / 2);
          v.el.style.top = px(TRIO.cy - ph / 2);
          root.append(v.el);
          const info = ctx.clipInfo(sd.id);
          const end = info ? (info.frames - 1) / info.fps : 4;
          return { v, from: sd.from || 0, loopFrom: sd.loopFrom != null ? sd.loopFrom : sd.from || 0, end, loop: sd.loop || null, dx: (i === 0 ? -1 : 1) * step };
        });
        const labels = (d.trio.labels || []).map((tx, i) => {
          const el = h('div', { class: 'abs', style: { left: px(cx + (i - 1) * step - pw / 2), top: px(TRIO.cy + ph / 2 + 14), width: px(pw), textAlign: 'center',
            font: '700 26px/1.2 var(--cn)', color: SNOW, whiteSpace: 'nowrap' }, text: tx });
          return el;
        });
        trio = { side, labels, s: pw / cw, dy: TRIO.cy - cy };
      }

      const card = K.videoCard({ clip: d.clips[0].id, w: cw, h: ch, radius: 24, credit: { author: d.author, note: '原作片段' } });
      card.el.style.left = px(cx - cw / 2);
      card.el.style.top = px(cy - ch / 2);
      card.img.style.transformOrigin = '50% 50%';
      styleCredit(card.creditEl);
      root.append(card.el);
      if (trio) root.append(...trio.labels);

      // s10: the outline round the page's ready-made thumbnails lives in the card, under the credit
      let mark = null;
      if (d.bridge && d.bridge.mark) {
        mark = buildMark(d.bridge.mark, cw, ch, big.s * (1 + 0.006 * T.mark.t0));
        card.el.insertBefore(mark.wrap, card.creditEl);
      }

      const colX = layout === 'A' ? 1212 : 112;
      const C = buildColumn(d, colX, tinted);
      root.append(C.col);

      // pager dots: settled under the card (classic slot), big phase beside the credit chip (16:9 / 1:1, placed in render
      // from the chip's measured size) or just outside a 9:16 footage's left edge, level with its credit
      const dots = buildDots(d);
      const dotsSet = { x: cx - (d.total * 26) / 2, y: cy + ch / 2 + 34 };
      const [bW, bH] = BIG[aspect] || BIG['16:9'];
      const sBig = bW / cw;
      const dotsW = (d.total - 1) * 26 + 30;
      const dots916 = { x: BIG_C.x - bW / 2 - 40 - dotsW, y: BIG_C.y + bH / 2 - 16 * sBig - 25 };
      dots.wrap.style.left = px(dotsSet.x);
      dots.wrap.style.top = px(dotsSet.y);
      if (T.zoom) dots.cap.style.display = 'none';
      root.append(dots.wrap);

      let banner = null;
      if (d.bridge) { banner = buildBanner(d.bridge); root.append(banner.el); }

      return { T, aspect, layout, card, amb, shadeBig, proof, trio, banner, mark, dots, dotsSet, dots916, big, cw, ch, cx, cy, bigW: bW, bigH: bH, colX,
        kb: d.kenBurns !== false, credRight: false, credW: null, credH: null, capGeo: null, capTop: d.capTop != null ? d.capTop : CAP.top,
        tag: C.tag, work: C.work, meta: C.meta, caveat: C.caveat, rule: C.rule, secret: C.secret, secBox: C.secBox, secPill: C.secPill,
        pts: C.pts, take: C.take, bannerW: null };
    },

    render(s, t, ctx) {
      const T = s.T;
      // footage: play the clip sequence, hold the last frame (with a slow Ken Burns while a clip is held)
      const cur = clipAt(T.seq, t);
      E.setImg(s.card.img, ctx.clipUrl(cur.id, cur.local));
      E.setImg(s.amb, ctx.clipUrl(cur.id, cur.local));
      let ik = s.kb ? 1 + 0.045 * ease.inOutSine(clamp(cur.over / 3)) : 1, ix = 0, iy = 0;
      if (s.mark && cur.idx === 0 && T.mark.p0 != null) {
        // s10: the (static) brand page pushes in toward its thumbnail row instead
        ik = 1 + s.mark.push * prog(t, T.mark.p0, Math.max(0.5, T.mark.p1 - T.mark.p0), ease.inOutSine);
        ix = (1 - ik) * (s.mark.P.x - s.cw / 2);
        iy = (1 - ik) * (s.mark.P.y - s.ch / 2);
      }
      tf(s.card.img, { x: ix, y: iy, s: ik });
      tf(s.amb, { s: 10.2 + 0.4 * (t / Math.max(1, ctx.dur)), x: -20 - 30 * (t / Math.max(1, ctx.dur)), y: -10 });
      // credit chip: bottom-left, or bottom-right for a clip whose page is busy bottom-left
      const right = cur.credit === 'right';
      if (s.credRight !== right) {
        const ce = s.card.creditEl;
        ce.style.left = right ? 'auto' : '18px';
        ce.style.right = right ? '18px' : 'auto';
        ce.style.transformOrigin = right ? '100% 100%' : '0 100%';
        s.credRight = right;
      }

      // card: zoom case = the classic spring entrance; push cases = big footage, then shrink into the slot
      const a = spring(t - 0.05, { stiffness: 140, damping: 19 });
      const g = T.zoom ? 0 : 1 - prog(t, T.shrink, SHRINK, ease.outCubic);           // 1 = big, 0 = in its slot
      const push = 1 + 0.025 * clamp(T.zoom ? t / ctx.dur : (t - T.shrink - SHRINK) / Math.max(1, ctx.dur - T.shrink - SHRINK));
      const q = s.trio ? prog(t, T.trio, 0.6, ease.inOutCubic) : 0;                  // s11: card → middle panel
      const drift = s.trio ? 1 + 0.03 * prog(t, T.trio + 0.6, Math.max(1, ctx.dur - T.trio), ease.linear) : 1;   // trio: shared slow drift
      const pose = T.zoom ? { x: 0, y: (1 - a) * 30, s: lerp(0.86, 1, a) * push }
        : { x: s.big.dx * g, y: s.big.dy * g + (s.trio ? s.trio.dy * q : 0), s: lerp(lerp(push, 1, q), s.big.s * (1 + 0.006 * t), g) * (s.trio ? lerp(1, s.trio.s, q) * drift : 1) };
      tf(s.card.el, { x: pose.x, y: pose.y, s: pose.s, o: 1 });
      if (!T.zoom) tf(s.card.creditEl, { s: lerp(push, 1, q) / pose.s });                         // credit keeps its size while the card scales
      s.shadeBig.style.opacity = g.toFixed(3);

      // right (or left) column
      const up = (el, t0, dist = 26, dur = 0.55) => { if (!el) return; const p = prog(t, t0, dur, ease.outQuint); tf(el, { y: (1 - p) * dist, o: p }); };
      up(s.tag, T.head);
      up(s.work, T.head + 0.08); up(s.meta, T.head + 0.16); up(s.caveat, T.head + 0.24, 14);
      s.rule.style.transform = `scaleX(${prog(t, T.head + (T.zoom ? 0.3 : 0.12), 0.7, ease.inOutCubic).toFixed(4)})`;
      const sp = prog(t, T.secret, 0.6, ease.outQuint);
      if (T.cap) {
        // the secret lands on the big footage as a caption, then rides into its slot with the shrink
        if (!s.capGeo) {
          const bw = s.secBox.offsetWidth;
          if (bw > 0) {
            const slot = { x: s.colX + s.secBox.offsetLeft, y: COL_TOP + s.secBox.offsetTop };
            const colRight = s.layout === 'A';
            const capPos = s.aspect === '9:16'
              ? { x: colRight ? BIG_C.x + s.bigW / 2 + CAP.gap916 + CAP.padX : BIG_C.x - s.bigW / 2 - CAP.gap916 - CAP.padX - bw, y: CAP.top916 + CAP.padY }
              : { x: colRight ? BIG_C.x + s.bigW / 2 - CAP.inset - CAP.padX - bw : BIG_C.x - s.bigW / 2 + CAP.inset + CAP.padX, y: BIG_C.y - s.bigH / 2 + s.capTop + CAP.padY };
            s.capGeo = { dx: capPos.x - slot.x, dy: capPos.y - slot.y };
          }
        }
        const geo = s.capGeo || { dx: 0, dy: 0 };
        const k = 1 - prog(t, T.shrink, SHRINK, ease.outCubic);
        tf(s.secBox, { x: geo.dx * k + (1 - sp) * -30, y: geo.dy * k, o: sp });
        s.secPill.style.opacity = (1 - prog(t, T.shrink + 0.05, 0.3, ease.inOutCubic)).toFixed(3);
      } else {
        tf(s.secBox, { x: (1 - sp) * -30, o: sp });
      }
      // points: the newest one bright, earlier ones dimmed; all dim when 照搬 lands
      s.pts.forEach((p, i) => {
        const pin = prog(t, T.points[i], 0.55, ease.outQuint);
        const dim = Math.max(i + 1 < s.pts.length ? prog(t, T.points[i + 1], 0.35) : 0, prog(t, T.take, 0.4));
        tf(p.row, { y: (1 - pin) * 22, o: pin * lerp(1, 0.4, dim) });
        p.dot.style.background = dim > 0.5 ? FOG : LIME;
      });
      up(s.take, T.take, 30, 0.6);

      // proof strip
      if (s.proof) {
        const pa = prog(t, T.strip, 0.45, ease.outCubic);
        if (s.proof.side) tf(s.proof.el, { x: (1 - pa) * 24, y: s.cy, o: pa });
        else tf(s.proof.el, { y: (1 - pa) * 12, o: pa });
        s.proof.el.style.transform += s.proof.side ? ' translateY(-50%)' : '';
        const warm = s.proof.draw(t, T, ctx.dur);
        if (typeof warm === 'number') s.card.el.style.boxShadow = warm > 0.01
          ? `0 30px 90px rgba(0,0,0,.55), 0 0 0 ${(3 * warm).toFixed(2)}px rgba(242,166,73,.95), 0 0 ${(46 * warm).toFixed(1)}px rgba(242,166,73,${(0.4 * warm).toFixed(3)})` : '';
      }

      // s11 trio: the side panels slide out from behind the card, each with its own clip and credit
      if (s.trio) {
        s.trio.side.forEach((sd, i) => {
          const k = prog(t, T.trio + 0.04 * i, 0.6, ease.outCubic);
          sd.v.el.style.visibility = k > 0 ? 'visible' : 'hidden';
          tf(sd.v.el, { x: sd.dx * k, y: 0, s: lerp(0.9, 1, k) * drift, o: clamp(k * 2.2) });
          // plays once from `from`; a 'pingpong' panel then swings between its end and loopFrom (never back to a blank start)
          let tl = sd.from + Math.max(0, t - T.trio);
          if (sd.loop === 'pingpong' && tl > sd.end) { const L = Math.max(0.1, sd.end - sd.loopFrom), m = (tl - sd.end) % (2 * L); tl = m <= L ? sd.end - m : sd.loopFrom + (m - L); }
          sd.v.render(tl);
        });
        // labels keep their 14 px gap under the drifting panels
        s.trio.labels.forEach((el, i) => {
          const p = prog(t, T.trio + 0.35 + 0.06 * i, 0.45, ease.outQuint);
          tf(el, { y: (1 - p) * 14 + (TRIO.h / 2) * (drift - 1), o: p });
        });
      }

      // pager dots: always opaque; beside the credit while the footage is big, under the card once it settles
      let dB = s.dots916;
      if (s.aspect !== '9:16') {
        if (s.credW == null) { const w = s.card.creditEl.offsetWidth; if (w > 0) { s.credW = w; s.credH = s.card.creditEl.offsetHeight; } }
        // the chip's row at the big footage's pose (its slow push frozen once the shrink starts, so the row glides level)
        const kB = s.big.s * (1 + 0.006 * Math.min(t, T.shrink));
        dB = { x: BIG_C.x - (s.cw / 2 - 18) * kB + (s.credW || 230) + DOT_GAP, y: BIG_C.y + (s.ch / 2 - 16) * kB - (s.credH || 38) / 2 - 7 };
      }
      // 9:16: the row waits 0.15 s, until the credit (moving right more slowly) has risen out of its band, then glides
      const gd = s.aspect === '9:16' && !T.zoom ? 1 - prog(t, T.shrink + 0.15, SHRINK, ease.outCubic) : g;
      tf(s.dots.wrap, { x: (dB.x - s.dotsSet.x) * gd, y: (dB.y - s.dotsSet.y) * gd, o: 1 });
      s.dots.cap.style.opacity = (T.zoom ? 0 : gd).toFixed(3);
      const tp = T.tint == null ? 0 : T.tint < 0 ? 1 : prog(t, T.tint, 0.5, ease.outCubic);
      const d = ctx.data;
      s.dots.dots.forEach((el, i) => {
        if (i + 1 === d.index) return;
        const lil = tp > 0 && i + 1 >= d.tint.from ? tp : 0;
        el.style.background = `rgba(${Math.round(lerp(255, 214, lil))},${Math.round(lerp(255, 178, lil))},${Math.round(lerp(255, 222, lil))},${lerp(0.22, 0.92, lil).toFixed(3)})`;
      });

      // s10: lilac banner over the big footage while the bridge line is spoken
      if (s.banner) {
        const bi = spring(t - T.bridge.t0, { stiffness: 260, damping: 20 });
        const bo = prog(t, T.bridge.t1, 0.28, ease.inCubic);
        const o = clamp((t - T.bridge.t0) / 0.15) * (1 - bo);
        if (s.bannerW == null) s.bannerW = s.banner.el.offsetWidth || 700;
        s.banner.el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
        // in the footage's top margin (empty on the GoodCase card), clear of its thumbnail row (the very 现成素材 it
        // names), the credit and the dots
        tf(s.banner.el, { x: -s.bannerW / 2, y: BIG_C.y - s.bigH / 2 + 20 - (1 - clamp(bi, 0, 1.2)) * 24 - bo * 12, s: lerp(0.92, 1, clamp(bi, 0, 1.1)), o });
      }
      // s10: the outline draws round the ready-made thumbnails on its word and leaves with the banner
      if (s.mark) {
        const m = s.mark;
        const dp = prog(t, T.mark.t0, 0.4, ease.inOutCubic);
        const mo = 1 - prog(t, T.bridge.t1, 0.28, ease.inCubic);
        m.wrap.style.visibility = dp > 0 && mo > 0.001 && cur.idx === 0 ? 'visible' : 'hidden';
        m.wrap.style.opacity = mo.toFixed(3);
        tf(m.wrap, { x: ix, y: iy, s: ik });
        const off = (1 - dp).toFixed(4);
        m.line.setAttribute('stroke-dashoffset', off);
        m.halo.setAttribute('stroke-dashoffset', off);
        const tg = spring(t - T.mark.t0 - 0.3, { stiffness: 320, damping: 18 });
        tf(m.tag, { s: lerp(0.7, 1, clamp(tg, 0, 1.2)), o: clamp((t - T.mark.t0 - 0.3) / 0.12) });
      }
    },

    events(ctx) {
      const d = ctx.data;
      const T = timing(ctx);
      const out = [{ t: 0.05, type: 'swish', gain: 0.35 }];
      if (!T.zoom) out.push({ t: T.shrink, type: 'swish', gain: 0.18 });
      out.push({ t: T.secret, type: 'pop', gain: 0.35 });
      out.push({ t: T.take, type: 'blip', gain: 0.4 });
      if (T.items) T.items.forEach(x => { if (x > T.strip + 0.2 && x < ctx.dur) out.push({ t: x, type: 'tick', gain: 0.16 }); });
      if (T.bridge) out.push({ t: T.bridge.t0, type: 'pop', gain: 0.25 });
      if (T.mark && T.mark.t0 < ctx.dur) out.push({ t: T.mark.t0, type: 'tick', gain: 0.18 });
      if (T.trio != null && T.trio < ctx.dur) out.push({ t: T.trio, type: 'swish', gain: 0.28 });
      if (d.proof && d.proof.type === 'lanes') T.edits.forEach(x => { if (x < ctx.dur) out.push({ t: x, type: 'tick', gain: 0.14 }); });
      return out.sort((p, q) => p.t - q.t);
    },
  });
})();
