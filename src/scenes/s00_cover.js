/*
 * s00_cover — the opening cover (one bar, 2 s, no voice).
 * Frame 0 is a finished cover (platforms use it as the thumbnail): everything is at rest at t = 0 and only breathes,
 * bobs and pulses on the beat afterwards; the last 0.3 s punch in towards the cut into s01_cold on the downbeat.
 * Headline 「这些视频 / 全是代码 / 写的？！」 sits beside a fan of code-rendered case footage (each card credited).
 */
(() => {
  const { h, s: S, tf, setImg } = E;
  const { clamp, lerp, prog, ease } = M;

  // code-rendered works only, because the headline says the frames are code
  const CARDS = [   // listed back to front; `al` = which side of the polaroid strip carries the credit
    { clip: 'c4-1377-sun', from: 2.4, author: '@WinterArc2125', w: 430, ar: 16 / 9, x: 1660, y: 236, r: 7, ph: 0.35, al: 'right' },
    { clip: 'c2-060-light', from: 3.9, author: '@morpheusdv', w: 540, ar: 16 / 9, x: 1268, y: 446, r: -6, ph: 0.0, al: 'left' },
    { clip: 'c3-0962-web', from: 5.0, author: '@kimmonismus', w: 480, ar: 16 / 9, x: 1360, y: 826, r: 3, ph: 0.6, al: 'left' },
    { clip: 'c6-054-render', from: 1.4, author: '@yoshifujidesign', w: 196, ar: 9 / 16, x: 1774, y: 724, r: 8, ph: 0.85, al: 'right', narrow: true },
  ];
  const BORDER = 12, STRIP = 34;
  const LIME = '#C9DF8D', INK = '#241E1E', SNOW = '#F4F1F2', LILAC = '#EAD8EB', PURPLE = '#AD85BA';

  Scene.define({
    id: 's00_cover',
    chrome: false,
    build(root, ctx) {
      // background: night grid, coloured glows, diagonal light streaks
      K.bg(root, 'night', { glows: [
        { x: 1480, y: 440, r: 760, color: 'rgba(173,133,186,.50)', o: 0.75 },
        { x: 260, y: 980, r: 620, color: 'rgba(201,223,141,.22)', o: 0.8 },
        { x: 760, y: 120, r: 520, color: 'rgba(234,216,235,.16)', o: 0.7 },
      ] });
      const streaks = [0, 1, 2].map(i => {
        const el = h('div', { class: 'abs', style: { left: '-200px', top: `${120 + i * 330}px`, width: '2600px', height: `${[6, 2, 3][i]}px`,
          background: i === 1 ? 'rgba(234,216,235,.35)' : 'rgba(201,223,141,.28)', transformOrigin: '50% 50%' } });
        root.append(el);
        return el;
      });

      // confetti (seeded)
      const rnd = ctx.rng('confetti');
      const confetti = [];
      for (let i = 0; i < 30; i++) {
        let x, y;
        do { x = rnd.range(60, 1860); y = rnd.range(60, 1020); } while (x > 90 && x < 930 && y > 170 && y < 960); // keep the title clear
        const kind = rnd.pick(['dot', 'sq', 'plus', 'tri']);
        const col = rnd.pick([LIME, LIME, LILAC, PURPLE, SNOW, '#F2B880']);
        const sz = rnd.range(10, 22);
        const el = h('div', { class: 'abs', style: { left: `${x}px`, top: `${y}px`, width: `${sz}px`, height: `${sz}px` } });
        if (kind === 'dot') Object.assign(el.style, { borderRadius: '50%', background: col });
        if (kind === 'sq') Object.assign(el.style, { borderRadius: '3px', background: col });
        if (kind === 'plus') el.innerHTML = `<svg width="${sz}" height="${sz}" viewBox="0 0 10 10"><path d="M5 0v10M0 5h10" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/></svg>`;
        if (kind === 'tri') el.innerHTML = `<svg width="${sz}" height="${sz}" viewBox="0 0 10 10"><path d="M5 0.5L9.6 9.2H0.4z" fill="${col}"/></svg>`;
        root.append(el);
        confetti.push({ el, r0: rnd.range(-40, 40), spin: rnd.range(-90, 90), bob: rnd.range(4, 12), ph: rnd() });
      }

      // footage fan (polaroids)
      const cards = CARDS.map(c => {
        const iw = c.w, ih = Math.round(c.w / c.ar);
        const el = h('div', { class: 'abs', style: { left: `${c.x - (iw + 2 * BORDER) / 2}px`, top: `${c.y - (ih + BORDER + STRIP) / 2}px`,
          width: `${iw + 2 * BORDER}px`, height: `${ih + BORDER + STRIP}px`, background: '#FBF9FA', borderRadius: '10px',
          boxShadow: '0 26px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(0,0,0,.25)' } });
        const img = h('img', { style: { position: 'absolute', left: `${BORDER}px`, top: `${BORDER}px`, width: `${iw}px`, height: `${ih}px`,
          objectFit: 'cover', borderRadius: '4px', background: '#111' } });
        const handle = h('span', { style: { font: `600 ${c.narrow ? 15 : 17}px/1 var(--mono)`, color: INK }, text: c.author });
        const note = c.narrow ? null : h('span', { style: { color: '#8A8284', font: '500 15px/1 var(--cn)' }, text: '原作片段' });
        const cap = h('div', { style: { position: 'absolute', left: `${BORDER + 2}px`, right: `${BORDER + 2}px`, bottom: '8px', display: 'flex', gap: '10px',
          justifyContent: c.al === 'right' ? 'flex-end' : 'flex-start', alignItems: 'center', whiteSpace: 'nowrap' } },
          c.al === 'right' ? [note, handle] : [handle, note]);
        el.append(img, cap);
        root.append(el);
        return { el, img, c };
      });

      // title block
      const col = h('div', { class: 'abs', style: { left: '104px', top: '84px', width: '900px', transformOrigin: '40% 45%' } });
      const brand = h('div', { style: { position: 'relative', zIndex: '1', display: 'flex', alignItems: 'center', gap: '18px', height: '50px' } });
      const logo = h('div', { style: { height: '46px' }, html: window.LOGO_DARK || '' });
      const logoSvg = logo.querySelector('svg'); if (logoSvg) { logoSvg.style.height = '46px'; logoSvg.style.width = 'auto'; logoSvg.style.display = 'block'; }
      const eyebrow = h('div', { style: { padding: '9px 16px', borderRadius: '999px', border: `2px solid ${LIME}`, color: LIME,
        font: '700 22px/1 var(--mono)', letterSpacing: '.06em', whiteSpace: 'nowrap' }, text: 'OPUS 5.5 · 视频拆解' });
      brand.append(logo, eyebrow);

      const shadow = `8px 9px 0 ${INK}, 0 18px 40px rgba(0,0,0,.45)`;
      const lineStyle = mt => ({ position: 'relative', zIndex: '1', marginTop: mt, font: '176px/1.0 var(--fun)', color: SNOW, whiteSpace: 'nowrap',
        textShadow: shadow, display: 'flex', alignItems: 'center', transformOrigin: '0% 60%' });
      const line1 = h('div', { style: lineStyle('40px') }, h('span', { text: '这些视频' }));
      const line2 = h('div', { style: lineStyle('8px') });
      const hl = h('span', { style: { position: 'relative', display: 'inline-block', padding: '0 .06em', margin: '0 .04em', color: INK, textShadow: 'none' } });
      const hlBox = h('span', { style: { position: 'absolute', left: '-.04em', right: '-.04em', top: '.08em', bottom: '.02em', background: LIME,
        borderRadius: '.10em', boxShadow: `8px 9px 0 ${INK}`, transform: 'rotate(-2.5deg)', zIndex: '0' } });
      hl.append(hlBox, h('span', { style: { position: 'relative', zIndex: '1' }, text: '代码' }));
      line2.append(h('span', { text: '全是' }), hl);
      const line3 = h('div', { style: lineStyle('8px') });
      const bang = h('span', { style: { color: LIME, marginLeft: '.02em', letterSpacing: '-0.18em', display: 'inline-block' }, text: '？！' });
      line3.append(h('span', { text: '写的' }), bang);
      const sub = h('div', { style: { position: 'relative', zIndex: '1', marginTop: '34px', display: 'inline-block', padding: '14px 24px 16px', borderRadius: '16px',
        background: 'rgba(14,11,13,.72)', border: '1.5px solid rgba(255,255,255,.10)', font: '800 40px/1.15 var(--cn)', color: SNOW, whiteSpace: 'nowrap' } },
        h('span', { text: 'Opus 5.5 炫酷视频的秘密 ' }), h('span', { style: { color: LIME }, text: '＋' }), h('span', { text: ' 小白上手指南' }));
      const chips = h('div', { style: { position: 'relative', zIndex: '1', marginTop: '22px', display: 'flex', gap: '14px' } });
      [['8 个爆款案例', LILAC, INK, 'none'], ['6 步上手', SNOW, INK, 'none'], ['附提示词模板', 'transparent', LIME, `2px solid ${LIME}`]].forEach(([t, bg, fg, bd]) => {
        chips.append(h('div', { style: { padding: '11px 20px 12px', borderRadius: '12px', background: bg, color: fg, border: bd,
          font: '800 32px/1 var(--cn)', whiteSpace: 'nowrap' }, text: t }));
      });
      col.append(brand, line1, line2, line3, sub, chips);
      root.append(col);

      // sticker (stamp) over the headline's top-right corner
      const sticker = h('div', { class: 'abs', style: { left: '640px', top: '128px', zIndex: '2', padding: '10px 22px 14px', background: LIME, color: INK,
        borderRadius: '14px', font: '56px/1.05 var(--fun)', whiteSpace: 'nowrap', boxShadow: `6px 7px 0 ${INK}, 0 16px 30px rgba(0,0,0,.4)`,
        transformOrigin: '50% 50%' }, text: '小白也能学会' });
      col.append(sticker);

      // burst behind the 「！」
      const burst = S('svg', { width: 260, height: 260, viewBox: '-130 -130 260 260', style: { position: 'absolute', left: '0px', top: '0px', overflow: 'visible' } });
      const pts = [];
      for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, rr = i % 2 ? 62 : 118; pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`); }
      burst.append(S('polygon', { points: pts.join(' '), fill: PURPLE, stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }));
      const burstWrap = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '260px', height: '260px', zIndex: '0' } }, burst);
      col.insertBefore(burstWrap, col.firstChild);

      return { streaks, confetti, cards, col, line1, line2, hlBox, bang, sticker, burstWrap, sub, chips };
    },

    render(st, t, ctx) {
      const beat = ctx.beat;                                  // 0.5 s at 120 BPM
      const kick = tt => Math.exp(-((((tt % beat) + beat) % beat)) * 9); // 1 on each beat, decays
      const end = ctx.dur;
      const punch = ease.inCubic(clamp((t - (end - 0.32)) / 0.32)); // last 0.32 s: push in towards the cut

      // camera: tiny drift + punch-in about the headline
      const camS = 1 + 0.012 * Math.sin(t * 1.3) + 0.16 * punch;
      st.camS = camS;

      st.streaks.forEach((el, i) => tf(el, { x: ((t * (60 + i * 25)) % 300) - 150, r: -18, o: 1 - punch }));
      st.confetti.forEach((c, i) => tf(c.el, { y: c.bob * Math.sin((t * 1.4 + c.ph) * Math.PI * 2), r: c.r0 + c.spin * t, o: 1 - punch }));

      st.cards.forEach((k, i) => {
        const c = k.c;
        const bob = 7 * Math.sin((t * 0.9 + c.ph) * Math.PI * 2);
        const k1 = kick(t - 0.06 * i) * 0.018;
        const out = punch * (i % 2 ? 1 : -1);
        tf(k.el, { x: out * 260, y: bob + punch * 120, r: c.r + 0.9 * Math.sin((t * 0.7 + c.ph) * Math.PI * 2), s: 1 + k1, o: 1 - punch * 0.85 });
        setImg(k.img, ctx.clipUrl(c.clip, c.from + t));
      });

      // headline: beat pulses on the highlight and the sticker; everything is at rest at t = 0
      tf(st.col, { s: camS });
      st.hlBox.style.transform = `rotate(-2.5deg) scale(${(1 + 0.05 * kick(t)).toFixed(4)})`;
      tf(st.bang, { r: 8 * Math.sin(t * Math.PI * 2 * 1.0), s: 1 + 0.08 * kick(t + 0.25) });
      const stick = -8 + 2.5 * Math.sin(t * Math.PI * 2 * 0.9);
      tf(st.sticker, { r: stick, s: 1 + 0.06 * kick(t) });

      // burst sits behind the 「！」 (measured once from layout) and rotates slowly
      if (st.bangPos == null) {
        // layout offsets ignore transforms, so this is the same whichever frame renders first
        let x = st.bang.offsetLeft + st.bang.offsetWidth / 2, y = st.bang.offsetTop + st.bang.offsetHeight / 2;
        let el = st.bang.offsetParent;
        while (el && el !== st.col) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
        st.bangPos = { x, y };
      }
      tf(st.burstWrap, { x: st.bangPos.x - 130, y: st.bangPos.y - 130, r: t * 40, s: 0.92 + 0.08 * kick(t + 0.25) });
    },

    events(ctx) {
      return [
        { t: 0.0, type: 'impact', gain: 0.55 },
        { t: 0.5, type: 'pop', gain: 0.25 },
        { t: 1.0, type: 'pop', gain: 0.25 },
        { t: 1.05, type: 'rise_short', gain: 0.35 },
        { t: ctx.dur - 0.32, type: 'whoosh', gain: 0.45 },
      ];
    },
  });
})();
