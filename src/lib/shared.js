/*
 * Pieces shared by several scenes, built once so adjacent scenes match exactly.
 *  - PAGE.draw: the flip-book page drawer. s04 prints PAGE.draw.toString() on screen and uses it for every page/tile;
 *    s18 and s19 reuse it, so the sample the viewer sees is literally the code they were shown.
 *  - K.stepRail: the worksheet chapter's six-step rail (s15–s20).
 *  - K.sticker: the 「暂停就能抄」 sticker.
 *  - K.chip: small credit / provenance chip (used for full-bleed footage at (112, 822)).
 */
(() => {
  'use strict';
  const { h, tf } = window.E;
  const { clamp, lerp, prog, ease, spring } = window.M;

  window.PAGE = {
    draw(g, t, w, h) {          // 一页 = draw(时间)
      g.fillStyle = '#1B1718';
      g.fillRect(0, 0, w, h);
      const p = (t % 3) / 3;    // 3 秒走一趟
      const s = Math.sin(Math.PI * 2 * t);
      const x = w * (0.1 + 0.8 * p);
      const y = h * (0.62 - 0.3 * Math.abs(s));
      g.fillStyle = '#C9DF8D';
      g.beginPath();
      g.arc(x, y, h * 0.09, 0, Math.PI * 2);
      g.fill();
    },
  };

  const STEPS = ['环境', '路线', '需求', '小样', '反馈', '检查'];

  // Fixed rail at y 150–198. render(t, active, prev): the lime pill springs from slot `prev` to slot `active` over ~0.5 s.
  function stepRail() {
    const el = h('div', { class: 'abs', style: { left: '0px', top: '150px', width: '1920px', height: '48px', zIndex: '50' } });
    const pills = STEPS.map((label, i) => {
      const pill = h('div', { class: 'abs', style: { top: '0px', height: '48px', borderRadius: '24px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '10px', whiteSpace: 'nowrap', overflow: 'hidden', boxSizing: 'border-box' } });
      const step = h('span', { style: { font: '600 16px/1 var(--mono)', letterSpacing: '.06em', color: 'var(--ink)' }, text: `STEP ${i + 1}/6` });
      const num = h('span', { style: { font: '600 24px/1 var(--mono)' }, text: String(i + 1) });
      const lab = h('span', { style: { font: '500 24px/1 var(--cn)' }, text: label });
      pill.append(step, num, lab);
      el.append(pill);
      return { pill, step, num, lab };
    });
    function render(t, active, prev = active - 1) {
      const from = prev >= 0 ? prev : active;
      const sp = from === active ? 1 : spring(t, { stiffness: 210, damping: 22 });
      const k = clamp(sp, 0, 1.08);
      // activeness of each slot
      const act = STEPS.map((_, i) => (i === active ? Math.min(1, k) : 0) + (i === from && from !== active ? Math.max(0, 1 - k) : 0));
      const widths = act.map(a => lerp(200, 260, clamp(a)));
      const total = widths.reduce((a, b) => a + b, 0) + 24 * (STEPS.length - 1);
      let x = (1920 - total) / 2;
      pills.forEach((p, i) => {
        const a = clamp(act[i]);
        p.pill.style.left = `${x.toFixed(1)}px`;
        p.pill.style.width = `${widths[i].toFixed(1)}px`;
        p.pill.style.background = a > 0.5 ? 'var(--lime)' : '#FFFFFF';
        p.pill.style.border = a > 0.5 ? '1.5px solid var(--lime)' : '1.5px solid var(--line)';
        p.pill.style.boxShadow = a > 0.5 ? '0 8px 22px rgba(35,134,83,.18)' : 'none';
        p.step.style.display = a > 0.5 ? 'inline' : 'none';
        p.num.style.display = a > 0.5 ? 'none' : 'inline';
        p.lab.style.font = a > 0.5 ? '800 26px/1 var(--cn)' : '500 24px/1 var(--cn)';
        p.lab.style.color = a > 0.5 ? 'var(--ink)' : 'var(--ink-2)';
        p.num.style.color = 'var(--ink-2)';
        x += widths[i] + 24;
      });
    }
    return { el, render, steps: STEPS };
  }

  // 「暂停就能抄」: Smiley Sans 36 px, ink on a lime marker, rotated −4°. render(t, start) slaps it on with a spring.
  function sticker(text = '暂停就能抄') {
    const el = h('div', { class: 'abs', style: { padding: '6px 18px 8px', background: 'var(--lime)', color: 'var(--ink)', borderRadius: '8px',
      font: '36px/1.1 var(--fun)', whiteSpace: 'nowrap', boxShadow: '0 10px 24px rgba(36,30,30,.14)', transformOrigin: '50% 50%' }, text });
    function render(t, start) {
      const sp = spring(t - start, { stiffness: 320, damping: 18 });
      tf(el, { s: lerp(1.6, 1, clamp(sp, 0, 1.2)), r: -4, o: clamp((t - start) / 0.12) });
    }
    return { el, render };
  }

  // Small chip: credit/provenance labels. light = for paper scenes.
  function chip(text, { light = false, accent = false, size = 20 } = {}) {
    return h('div', { class: 'abs', style: { padding: '8px 14px', borderRadius: '12px', whiteSpace: 'nowrap',
      background: light ? 'rgba(255,255,255,.92)' : 'rgba(10,8,9,.74)', color: light ? 'var(--ink)' : '#fff',
      border: accent ? `1.5px solid ${light ? 'var(--green)' : 'rgba(201,223,141,.6)'}` : '1.5px solid transparent',
      font: `600 ${size}px/1.1 var(--sans)` }, text });
  }

  Object.assign(window.K, { stepRail, sticker, chip });
})();
