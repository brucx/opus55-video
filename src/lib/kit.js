/*
 * Shared visual components so every scene speaks the same design language.
 * All components are built once in build() and updated per frame in render().
 */
(() => {
  'use strict';
  const { h, s, tf, chars, setImg, clipUrl, clipInfo } = window.E;
  const { clamp, lerp, prog, ease, spring, rgba } = window.M;

  // Background layer: 'night' (dark grid), 'paper' (light grid), or 'plain'. Optional soft glows.
  function bg(root, kind = 'night', { glows = [] } = {}) {
    const el = h('div', { class: `fill ${kind === 'paper' ? 'grid-paper' : kind === 'plain' ? 'bg-night' : 'grid-night'}` });
    root.append(el);
    const glowEls = glows.map(g => {
      const d = h('div', { class: 'abs', style: {
        left: `${g.x - g.r}px`, top: `${g.y - g.r}px`, width: `${g.r * 2}px`, height: `${g.r * 2}px`, borderRadius: '50%',
        background: `radial-gradient(circle, ${g.color} 0%, rgba(0,0,0,0) 70%)`, opacity: String(g.o != null ? g.o : 0.5),
      } });
      el.append(d);
      return d;
    });
    return { el, glowEls };
  }

  function tag(text, { light = false, dot = true } = {}) {
    const el = h('div', { class: `k-tag${light ? ' light' : ''}` });
    if (dot) el.append(h('span', { class: 'dot' }));
    el.append(h('span', { text }));
    return el;
  }

  // Kinetic title: per-character rise + fade, staggered. Returns {el, spans, render(t, start)}
  function title(text, { size = 96, weight = 900, color = 'var(--snow)', font = 'var(--cn)', lh = 1.15, ls = '0.01em', stagger = 0.028, dur = 0.7, rise = 0.55, align = 'left', maxWidth } = {}) {
    const el = h('div', { style: { font: `${weight} ${size}px/${lh} ${font}`, color, letterSpacing: ls, textAlign: align, maxWidth: maxWidth ? `${maxWidth}px` : '' } });
    const lines = String(text).split('\n');
    const spans = [];
    lines.forEach((ln, i) => {
      const row = h('div', { style: { whiteSpace: 'nowrap' } });
      spans.push(...chars(row, ln));
      el.append(row);
    });
    function render(t, start = 0, { out = Infinity, outDur = 0.35 } = {}) {
      spans.forEach((sp, i) => {
        const p = prog(t, start + i * stagger, dur, ease.outQuint);
        const q = prog(t, out + i * stagger * 0.5, outDur, ease.inCubic);
        tf(sp, { y: (1 - p) * size * rise - q * size * 0.3, o: p * (1 - q), blur: (1 - p) * 6 });
      });
    }
    return { el, spans, render, size };
  }

  // A rounded video card that plays a pre-extracted clip. credit: {author, note}
  function videoCard({ clip, w, h: hh, radius = 22, credit = null, fit = 'cover', pos = '50% 50%' }) {
    const el = h('div', { class: 'k-video', style: { width: `${w}px`, height: `${hh}px`, borderRadius: `${radius}px` } });
    const img = h('img', { style: { objectFit: fit, objectPosition: pos } });
    el.append(img);
    let creditEl = null;
    if (credit) {
      creditEl = h('div', { class: 'k-credit' }, h('span', { text: credit.author }), credit.note ? h('small', { text: credit.note }) : null);
      el.append(creditEl);
    }
    function render(tClip, mode = 'clamp') { setImg(img, clipUrl(clip, Math.max(0, tClip), mode)); }
    return { el, img, creditEl, render, clip };
  }

  // Code block with simple JS highlighting and typing progress.
  const KW = new Set(['const', 'let', 'var', 'function', 'return', 'for', 'if', 'else', 'await', 'async', 'new', 'of', 'in', 'import', 'from', 'export', 'while', 'true', 'false', 'null']);
  function tokenize(code) {
    const out = []; // [{c, k}]
    const re = /(\/\/[^\n]*|#[^\n]*)|("[^"\n]*"|'[^'\n]*'|`[^`\n]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d])/g;
    let m;
    while ((m = re.exec(code))) {
      let k = 'op';
      if (m[1]) k = 'com'; else if (m[2]) k = 'str'; else if (m[3]) k = 'num';
      else if (m[4]) { k = KW.has(m[4]) ? 'kw' : (code[re.lastIndex] === '(' ? 'fn' : 'id'); }
      else if (m[5]) k = 'ws';
      for (const c of Array.from(m[0])) out.push({ c, k });
    }
    return out;
  }
  function codeBlock(code, { size = 26, width, light = false, caret = true } = {}) {
    const el = h('div', { class: 'k-code', style: { fontSize: `${size}px`, width: width ? `${width}px` : '' } });
    if (light) Object.assign(el.style, { background: '#FFFFFF', color: 'var(--ink)', boxShadow: '0 24px 60px rgba(36,30,30,.12), 0 0 0 1.5px rgba(36,30,30,.08)' });
    const toks = tokenize(code);
    let lastN = -1;
    function render(p, showCaret = true) {
      const n = Math.round(clamp(p) * toks.length);
      if (n === lastN && !caret) return;
      lastN = n;
      let html = '', cur = null, buf = '';
      const flush = () => { if (buf) html += cur && cur !== 'ws' && cur !== 'id' ? `<span class="${cur}">${esc(buf)}</span>` : esc(buf); buf = ''; };
      for (let i = 0; i < n; i++) { const tk = toks[i]; if (tk.k !== cur) { flush(); cur = tk.k; } buf += tk.c; }
      flush();
      if (caret && showCaret) html += '<span class="caret"></span>';
      el.innerHTML = html;
    }
    render(1, false);
    return { el, render, length: toks.length };
  }
  const esc = str => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // SVG path that draws itself. Returns {el, render(p)}; set stroke etc. via attrs.
  function drawPath(d, attrs = {}) {
    const p = s('path', { d, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs });
    let len = null;
    function render(pr) {
      if (len == null) { try { len = p.getTotalLength(); } catch (e) { len = 1000; } p.style.strokeDasharray = `${len} ${len}`; }
      p.style.strokeDashoffset = String(len * (1 - clamp(pr)));
    }
    return { el: p, render };
  }

  function svgRoot(w = 1920, hh = 1080, attrs = {}) {
    return s('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, style: { position: 'absolute', left: 0, top: 0, overflow: 'visible' }, ...attrs });
  }

  // Number formatting with thousands separators
  const fmt = (v, dec = 0) => Number(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  // Pop-in helper: spring scale + fade for an element at time start
  function pop(el, t, start, { from = 0.6, x = 0, y = 0, r = 0, stiffness = 260, damping = 20 } = {}) {
    const sp = spring(t - start, { stiffness, damping });
    const o = clamp((t - start) / 0.18);
    tf(el, { x, y, r, s: lerp(from, 1, sp), o });
    return sp;
  }

  window.K = { bg, tag, title, videoCard, codeBlock, tokenize, drawPath, svgRoot, fmt, pop };
})();
