/*
 * Higher-level components shared across scenes. Each returns { el, render(...) } and keeps no time state:
 * render() derives everything from the times passed in.
 */
(() => {
  'use strict';
  const { h, s, tf, chars, typed, setImg } = window.E;
  const { clamp, lerp, prog, ease, spring, rgba, noise1 } = window.M;

  // ---------- window chrome (terminal / editor / chat) ----------
  function windowFrame({ w, h: hh, title = '', light = false, radius = 22 }) {
    const el = h('div', { class: 'abs', style: {
      width: `${w}px`, height: `${hh}px`, borderRadius: `${radius}px`, overflow: 'hidden',
      background: light ? '#FFFFFF' : '#0E0C0D',
      boxShadow: light ? '0 30px 70px rgba(36,30,30,.16), 0 0 0 1.5px rgba(36,30,30,.10)' : '0 34px 90px rgba(0,0,0,.55), 0 0 0 1.5px rgba(255,255,255,.09)',
    } });
    const bar = h('div', { style: { height: '54px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 22px',
      background: light ? '#F3F0F1' : '#1A1617', borderBottom: light ? '1.5px solid #E6E1E3' : '1.5px solid rgba(255,255,255,.06)' } });
    ['#FF5F57', '#FEBC2E', '#28C840'].forEach(c => bar.append(h('span', { style: { width: '14px', height: '14px', borderRadius: '50%', background: c, display: 'inline-block' } })));
    bar.append(h('span', { style: { marginLeft: '14px', font: '500 20px/1 var(--mono)', color: light ? '#8A8284' : '#8F8688' }, text: title }));
    const body = h('div', { style: { position: 'absolute', left: 0, right: 0, top: '54px', bottom: 0, padding: '26px 30px' } });
    el.append(bar, body);
    return { el, body };
  }

  // Terminal with typed commands: lines = [{t: startLocal, cmd: '...', out: ['...'], typeDur}]
  function terminal({ w = 1100, h: hh = 420, title = 'Terminal', lines = [], size = 26, prompt = '$', light = false }) {
    const win = windowFrame({ w, h: hh, title, light });
    const pre = h('div', { style: { font: `500 ${size}px/1.55 var(--mono)`, color: light ? 'var(--ink)' : '#E9E4E5', whiteSpace: 'pre-wrap' } });
    win.body.append(pre);
    function render(t) {
      let html = '';
      for (const ln of lines) {
        if (t < ln.t) break;
        const td = ln.typeDur != null ? ln.typeDur : Math.max(0.4, ln.cmd.length * 0.035);
        const p = clamp((t - ln.t) / td);
        const shown = typed(ln.cmd, p);
        const caret = p < 1 || (ln === lines[lines.length - 1] && Math.floor(t * 2) % 2 === 0) ? '<span class="tcaret"></span>' : '';
        html += `<div><span style="color:${light ? 'var(--green)' : 'var(--lime)'}">${prompt}</span> ${esc(shown)}${p < 1 ? caret : ''}</div>`;
        if (p >= 1 && ln.out) {
          ln.out.forEach((o, i) => {
            if (t >= ln.t + td + 0.15 + i * 0.12) html += `<div style="color:${light ? '#6E6668' : '#9E9597'}">${esc(o)}</div>`;
          });
        }
      }
      pre.innerHTML = html;
    }
    return { el: win.el, render };
  }
  const esc = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Chat exchange: msgs = [{from: 'user'|'claude', text, t, typeDur}]
  function chat({ w = 980, h: hh = 620, title = 'Claude Code', msgs = [], size = 28, light = false }) {
    const win = windowFrame({ w, h: hh, title, light });
    const col = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px' } });
    win.body.append(col);
    const items = msgs.map(m => {
      const bubble = h('div', { style: {
        alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: '16px 22px', borderRadius: '18px',
        font: `500 ${size}px/1.45 var(--cn)`, whiteSpace: 'pre-wrap',
        background: m.from === 'user' ? (light ? '#E9F3EC' : 'rgba(201,223,141,.14)') : (light ? '#F3F0F1' : '#1D191A'),
        color: light ? 'var(--ink)' : 'var(--snow)', border: m.from === 'user' ? `1.5px solid ${light ? 'rgba(35,134,83,.35)' : 'rgba(201,223,141,.35)'}` : '1.5px solid transparent',
      } });
      const label = h('div', { style: { font: '600 18px/1 var(--mono)', color: light ? '#8A8284' : '#8F8688', marginBottom: '8px', letterSpacing: '.05em' }, text: m.from === 'user' ? 'YOU' : 'CLAUDE' });
      const txt = h('div');
      bubble.append(label, txt);
      col.append(bubble);
      return { m, bubble, txt };
    });
    function render(t) {
      items.forEach(({ m, bubble, txt }) => {
        const a = prog(t, m.t, 0.35, ease.outCubic);
        bubble.style.display = t < m.t ? 'none' : 'block';
        tf(bubble, { y: (1 - a) * 24, o: a });
        const td = m.typeDur != null ? m.typeDur : (m.from === 'user' ? Math.min(2.2, m.text.length * 0.04) : Math.min(3, m.text.length * 0.03));
        txt.textContent = typed(m.text, (t - m.t) / Math.max(0.01, td));
      });
    }
    return { el: win.el, render };
  }

  // ---------- film strip ----------
  // A strip of n frames drawn by a callback draw(ctx2d, i, w, h) on canvases; scroll offset in frames.
  function filmStrip({ n = 12, fw = 240, fh = 135, gap = 18, light = false, draw }) {
    const el = h('div', { class: 'abs', style: { height: `${fh + 56}px`, width: `${n * (fw + gap) + gap}px`,
      background: light ? '#241E1E' : '#050404', borderRadius: '12px', boxShadow: '0 24px 60px rgba(0,0,0,.45)' } });
    const holesTop = h('div', { class: 'abs', style: { left: 0, right: 0, top: '8px', height: '12px',
      background: 'repeating-linear-gradient(90deg, rgba(255,255,255,.75) 0 16px, transparent 16px 34px)', opacity: '.5' } });
    const holesBot = holesTop.cloneNode(); holesBot.style.top = ''; holesBot.style.bottom = '8px';
    el.append(holesTop, holesBot);
    const frames = [];
    for (let i = 0; i < n; i++) {
      const c = h('canvas', { width: fw, height: fh, style: { position: 'absolute', left: `${gap + i * (fw + gap)}px`, top: '28px', width: `${fw}px`, height: `${fh}px`, borderRadius: '6px', background: '#222' } });
      const label = h('div', { class: 'abs', style: { left: `${gap + i * (fw + gap) + 8}px`, top: `${28 + fh - 30}px`, font: '600 18px/1 var(--mono)', color: '#fff', padding: '4px 7px', borderRadius: '6px', background: 'rgba(0,0,0,.55)' } });
      el.append(c, label);
      frames.push({ c, g: c.getContext('2d'), label });
    }
    function render(offset = 0, labelFn = i => `#${i}`) {
      frames.forEach((f, i) => {
        const idx = i + Math.floor(offset);
        if (draw) { f.g.clearRect(0, 0, fw, fh); draw(f.g, idx, fw, fh); }
        f.label.textContent = labelFn(idx);
      });
    }
    return { el, frames, render, width: n * (fw + gap) + gap };
  }

  // ---------- flow diagram ----------
  // nodes: [{id, x, y, w, h, label, sub, color}] ; edges: [{from, to, label, bend}] ; render(t, {nodeStart: {id: t}, edgeStart: {i: t}, packets: [{edge, t0, dur}]})
  function flow({ nodes, edges, light = false, font = 34 }) {
    const el = h('div', { class: 'fill' });
    const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: 0, top: 0, overflow: 'visible' } });
    const defs = s('defs');
    const mk = s('marker', { id: `arrow-${light ? 'l' : 'd'}`, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' },
      s('path', { d: 'M0,0 L10,5 L0,10 z', fill: light ? '#238653' : '#C9DF8D' }));
    defs.append(mk); svg.append(defs);
    el.append(svg);
    const byId = {};
    const nodeEls = nodes.map(nd => {
      const box = h('div', { class: 'abs center', style: {
        left: `${nd.x - nd.w / 2}px`, top: `${nd.y - nd.h / 2}px`, width: `${nd.w}px`, height: `${nd.h}px`, borderRadius: '24px', flexDirection: 'column', gap: '8px',
        background: nd.fill || (light ? '#FFFFFF' : '#1B1718'), border: `2px solid ${nd.color || (light ? 'rgba(36,30,30,.14)' : 'rgba(255,255,255,.12)')}`,
        boxShadow: light ? '0 18px 40px rgba(36,30,30,.10)' : '0 20px 50px rgba(0,0,0,.45)', color: light ? 'var(--ink)' : 'var(--snow)', textAlign: 'center' } });
      const lab = h('div', { style: { font: `800 ${nd.size || font}px/1.15 var(--cn)` }, text: nd.label });
      box.append(lab);
      if (nd.sub) box.append(h('div', { style: { font: `500 ${Math.round((nd.size || font) * 0.62)}px/1.3 var(--cn)`, color: light ? 'var(--ink-2)' : 'var(--fog)' }, text: nd.sub }));
      el.append(box);
      byId[nd.id] = nd;
      return { nd, box };
    });
    const edgeEls = edges.map(e => {
      const a = byId[e.from], b = byId[e.to];
      const [x1, y1, x2, y2] = clipLine(a, b);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const nx = -(y2 - y1), ny = x2 - x1, nl = Math.hypot(nx, ny) || 1;
      const bend = e.bend || 0;
      const cx = mx + (nx / nl) * bend, cy = my + (ny / nl) * bend;
      const d = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
      const path = s('path', { d, fill: 'none', stroke: light ? '#238653' : '#C9DF8D', 'stroke-width': 4, 'stroke-linecap': 'round', 'marker-end': `url(#arrow-${light ? 'l' : 'd'})` });
      svg.append(path);
      let label = null;
      if (e.label) {
        label = h('div', { class: 'abs', style: { left: `${cx}px`, top: `${cy}px`, transform: 'translate(-50%,-50%)', padding: '6px 12px', borderRadius: '10px',
          font: '600 22px/1.2 var(--cn)', whiteSpace: 'nowrap', background: light ? '#F6F4F5' : '#121011', color: light ? 'var(--green-deep)' : 'var(--lime)' }, text: e.label });
        el.append(label);
      }
      const dot = s('circle', { r: 9, fill: light ? '#238653' : '#C9DF8D', style: { filter: light ? '' : 'drop-shadow(0 0 8px rgba(201,223,141,.9))' } });
      svg.append(dot);
      return { e, path, label, dot, len: null, pt: (p) => quad(x1, y1, cx, cy, x2, y2, p) };
    });
    function render(t, { nodeStart = {}, edgeStart = {}, packets = [] } = {}) {
      nodeEls.forEach(({ nd, box }) => {
        const st = nodeStart[nd.id] != null ? nodeStart[nd.id] : Infinity;
        const sp = spring(t - st, { stiffness: 240, damping: 20 });
        tf(box, { s: lerp(0.7, 1, sp), o: clamp((t - st) / 0.2) });
        box.style.visibility = t >= st ? 'visible' : 'hidden';
      });
      edgeEls.forEach((ed, i) => {
        if (ed.len == null) { try { ed.len = ed.path.getTotalLength(); } catch (err) { ed.len = 600; } ed.path.style.strokeDasharray = `${ed.len} ${ed.len}`; }
        const st = edgeStart[i] != null ? edgeStart[i] : Infinity;
        const p = prog(t, st, 0.6, ease.inOutCubic);
        ed.path.style.strokeDashoffset = String(ed.len * (1 - p));
        ed.path.style.visibility = p > 0 ? 'visible' : 'hidden';
        if (ed.label) { const a = prog(t, st + 0.35, 0.35); ed.label.style.opacity = a.toFixed(3); }
        ed.dot.style.visibility = 'hidden';
      });
      packets.forEach(pk => {
        const ed = edgeEls[pk.edge];
        if (!ed) return;
        const p = (t - pk.t0) / pk.dur;
        if (p < 0 || p > 1) return;
        const [x, y] = ed.pt(ease.inOutSine(p));
        ed.dot.setAttribute('cx', x.toFixed(1)); ed.dot.setAttribute('cy', y.toFixed(1));
        ed.dot.style.visibility = 'visible';
      });
    }
    return { el, render, nodeEls, edgeEls };
  }
  function quad(x1, y1, cx, cy, x2, y2, p) {
    const a = (1 - p) * (1 - p), b = 2 * (1 - p) * p, c = p * p;
    return [a * x1 + b * cx + c * x2, a * y1 + b * cy + c * y2];
  }
  function clipLine(a, b) {
    // shorten the segment from center a to center b so it starts/ends at the box edges (+ margin)
    const dx = b.x - a.x, dy = b.y - a.y;
    const ta = boxT(a, dx, dy), tb = boxT(b, -dx, -dy);
    return [a.x + dx * ta, a.y + dy * ta, b.x - dx * tb, b.y - dy * tb];
  }
  function boxT(n, dx, dy) {
    const hw = n.w / 2 + 16, hh = n.h / 2 + 16;
    const tx = dx !== 0 ? hw / Math.abs(dx) : Infinity, ty = dy !== 0 ? hh / Math.abs(dy) : Infinity;
    return Math.min(tx, ty, 0.45);
  }

  // ---------- checklist ----------
  // items: [{text, sub, t}] ; ticks at tick times
  function checklist({ items, w = 900, size = 40, light = true, numbered = true }) {
    const el = h('div', { class: 'abs', style: { width: `${w}px`, display: 'flex', flexDirection: 'column', gap: '22px' } });
    const rows = items.map((it, i) => {
      const row = h('div', { style: { display: 'flex', alignItems: 'center', gap: '22px' } });
      const box = h('div', { class: 'center', style: { width: `${size * 1.35}px`, height: `${size * 1.35}px`, flex: 'none', borderRadius: '14px',
        border: `3px solid ${light ? 'var(--green)' : 'var(--lime)'}`, font: `800 ${size * 0.7}px/1 var(--display)`, color: light ? 'var(--green)' : 'var(--lime)' } });
      const num = h('span', { text: numbered ? String(i + 1) : '' });
      const tick = s('svg', { width: size, height: size, viewBox: '0 0 24 24', style: { position: 'absolute' } },
        s('path', { d: 'M5 12.5 L10 17.5 L19.5 7', fill: 'none', stroke: light ? '#FFFFFF' : '#241E1E', 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      box.style.position = 'relative';
      box.append(num, tick);
      const txt = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
        h('div', { style: { font: `800 ${size}px/1.2 var(--cn)`, color: light ? 'var(--ink)' : 'var(--snow)' }, text: it.text }),
        it.sub ? h('div', { style: { font: `500 ${Math.round(size * 0.62)}px/1.35 var(--cn)`, color: light ? 'var(--ink-2)' : 'var(--fog)' }, text: it.sub }) : null);
      row.append(box, txt);
      el.append(row);
      return { row, box, num, tick, path: tick.firstChild, it };
    });
    function render(t, { tickAt = {} } = {}) {
      rows.forEach((r, i) => {
        const a = prog(t, r.it.t, 0.5, ease.outQuint);
        tf(r.row, { x: (1 - a) * 40, o: a });
        const tt = tickAt[i];
        const k = tt != null ? prog(t, tt, 0.35, ease.outCubic) : 0;
        r.box.style.background = k > 0 ? (light ? 'var(--green)' : 'var(--lime)') : 'transparent';
        r.num.style.opacity = String(1 - k);
        r.tick.style.opacity = String(k);
        const L = 26;
        r.path.style.strokeDasharray = `${L} ${L}`;
        r.path.style.strokeDashoffset = String(L * (1 - k));
      });
    }
    return { el, render, rows };
  }

  // ---------- number counter ----------
  function counter({ size = 160, color = 'var(--lime)', font = 'var(--display)', weight = 700, suffix = '', prefix = '', dec = 0 }) {
    const el = h('div', { style: { font: `${weight} ${size}px/1 ${font}`, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', letterSpacing: '-0.02em' } });
    function render(value) { el.textContent = `${prefix}${Number(value).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}${suffix}`; }
    return { el, render };
  }

  // ---------- thumbnail wall ----------
  // ids: wall image ids; grid cols x rows, tile w/h, gap; render(t, {reveal: [t0, dur], drift}) staggered pop-in
  function wall({ ids, cols = 10, rows = 6, tw = 240, th = 135, gap = 14, radius = 10, seed = 'wall' }) {
    const el = h('div', { class: 'abs', style: { width: `${cols * (tw + gap) - gap}px`, height: `${rows * (th + gap) - gap}px` } });
    const tiles = [];
    const r = window.M.rng(seed);
    const order = [];
    for (let i = 0; i < cols * rows; i++) order.push(i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    for (let i = 0; i < cols * rows; i++) {
      const id = ids[i % ids.length];
      const c = i % cols, rr = Math.floor(i / cols);
      const img = h('img', { style: { position: 'absolute', left: `${c * (tw + gap)}px`, top: `${rr * (th + gap)}px`, width: `${tw}px`, height: `${th}px`, objectFit: 'cover', borderRadius: `${radius}px`, background: '#222' } });
      el.append(img);
      tiles.push({ img, id, c, rr, rank: order.indexOf(i) / (cols * rows) });
    }
    function render(t, { start = 0, spread = 1.2, dur = 0.5 } = {}) {
      tiles.forEach(tl => {
        setImg(tl.img, `../assets/wall/${tl.id}.jpg`);
        const st = start + tl.rank * spread;
        const sp = spring(t - st, { stiffness: 260, damping: 22 });
        tf(tl.img, { s: lerp(0.4, 1, sp), o: clamp((t - st) / 0.15) });
      });
    }
    return { el, tiles, render };
  }

  // ---------- marker highlight (light theme) ----------
  function marker(text, { size = 64, color = 'var(--ink)', fill = '#C9DF8D', weight = 900 } = {}) {
    const el = h('span', { style: { position: 'relative', display: 'inline-block', font: `${weight} ${size}px/1.2 var(--cn)`, color, padding: '0 .12em' } });
    const bg = h('span', { style: { position: 'absolute', left: 0, right: 0, bottom: '.08em', height: '.5em', background: fill, transformOrigin: '0 50%', zIndex: 0, borderRadius: '.08em' } });
    const tx = h('span', { style: { position: 'relative', zIndex: 1 }, text });
    el.append(bg, tx);
    function render(p) { bg.style.transform = `scaleX(${clamp(p).toFixed(4)})`; }
    return { el, render };
  }

  Object.assign(window.K, { windowFrame, terminal, chat, filmStrip, flow, checklist, counter, wall, marker });
})();
