/*
 * s05_wall — 「原理不难，炫不炫，差在导演功夫」 → WaytoAGI 收录 1,704 个视频案例 → 挑 8 个，每个一招 → dive into case 01.
 *
 * Beats (all from src/timeline.js via ctx.word):
 *   0.2–0.7   the 60-tile WaytoAGI wall pops in, desaturated, right behind the chapter wipe's bar (each tile 0–0.15 s
 *             after the bar passes its centre, 0.10 s fade; complete ≈0.17 s after the wipe), tick ripple
 *   「炫不」    a lime scanline sweeps the wall; colour floods in behind it
 *   「导演」    the wall dims, H1 「差在导演功夫」 rises (导演功夫 in lime)
 *   「截至」+   the H1 shrinks to a 64 px header at y≈170 (导演功夫 turns snow: lime is kept for the number) and stays until
 *              「8 个」; the date line 「截至 10 月 1 日 · WaytoAGI 收录」 takes the centre it left
 *   「Way」     the date line tucks into the eyebrow while the lime counter rises into its place and rolls 0 → 1,704, the
 *              wall lighting tile by tile; lands on 「1704 个」; one sheen across the number on 「视频」
 *   「8 个」    counter, header and scrim lift; the 8 featured tiles pop to 1.10 with lime outlines, turn into rack stills and
 *              get their number tags 01–08 on their top edge
 *   「每个」    the 8 fly into the rack together (far ones first, 0.40–0.56 s by distance, inOutSine, slight velocity smear;
 *              02 lobs over the upper rows, 08 ducks under, both lifted); the tags ride along and settle as the labels above
 *              the slots; the wall fades. The full rack holds ≈10.42–10.82
 *   「一」      lime pill 「第 1 招」 under slot 01
 *   then       slot 01 rewinds its clip to frame 0 and grows into s06's card: its pose is computed from the case template's
 *              own entrance spring and the zoom transition, so during the cross-fade the two cards overlap (same frame,
 *              same credit chip). 02–08 stay solid until ≈10.8, then the rack scales about slot 01 and slides off to the
 *              right. From 0.2 s before the cut the pill's label fades and the bare pill shrinks (uniformly) into the lime
 *              series-dot capsule, so it already sits on s06's capsule while s06 is still faint.
 * Wall tile r5c3 (gosail-072) is @aiwarts's own GoodCase.ai card (ctx.clipUrl('c5-072-brand', 0.65)) from the first frame.
 * Render-order independence (workers render frame ranges independently): every element moves with 2D transforms only
 * (no translate3d / will-change), so nothing gets its own compositor layer whose cached raster would be resampled; text
 * that is scaled and then rests (the date chip) sits on whole-pixel layout positions; and no container with transformed
 * children gets a moving translation (Blink's transform fast path leaves the children's sub-pixel offsets stale).
 * Measured: a frame rendered straight from a seek and the same frame inside a forward run differ by ≤ 25/765 on at most
 * a few hundred pixels (one thumbnail at 9.5 s: 88/765 on 86 px, image-decode noise), except inside s06's zoom, where the
 * engine scales the will-change scene roots.
 */
(() => {
  'use strict';

  // ---------------- layout ----------------
  const COLS = 10, TW = 160, TH = 90, GAP = 10;               // 10 × 6 grid
  const WX = 115, WY = 230;                                   // wall origin → 1690 × 590
  const WW = COLS * (TW + GAP) - GAP;
  const CAM_OX = WX + WW / 2, CAM_OY = 400;                   // camera push pivot: x 960 (centred), y 400
  const CAM_PUSH = 0.028;                                     // linear over the whole scene: the drift never stops

  // assets/wall/manifest.json, manifest order (= 10 × 6 grid, row-major)
  const WALL = [
    'lists-006', 'lists-010', 'video-547', 'uc-1630', 'uc-0962', 'gosail-030', 'uc-1475', 'lists-640', 'lists-099', 'gosail-032',
    'uc-0997', 'uc-1906', 'uc-0505', 'uc-2352', 'gosail-054', 'video-397', 'uc-2348', 'gosail-039', 'uc-0381', 'uc-0534',
    'uc-0160', 'gosail-064', 'gosail-133', 'lists-582', 'gosail-001', 'uc-0155', 'gosail-021', 'gosail-060', 'lists-584', 'lists-024',
    'uc-2318', 'lists-360', 'video-415', 'lists-038', 'video-376', 'uc-0701', 'uc-1402', 'uc-1262', 'uc-2665', 'uc-2613',
    'lists-212', 'gosail-018', 'uc-1377', 'video-355', 'uc-0438', 'lists-007', 'video-451', 'uc-1787', 'lists-575', 'uc-1340',
    'video-389', 'uc-1591', 'lists-009', 'gosail-072', 'uc-1221', 'uc-0164', 'uc-1219', 'uc-2026', 'lists-040', 'uc-2262',
  ];
  // the eight featured cases, in case order; rack stills come from our clips (storyboard global rule 3).
  // c6-054-render is a 9:16 phone render: the 16:9 slot crops it at 50% 36%, which keeps the phone's island, the red
  // 「RENDER 50%」 line and the rendered black half (the centre crop was a white field with a black wedge).
  // lane: vertical detour at mid-flight (px, + = down). Only the two long flyers need one: 02 (r2c7 → slot 02) crosses six
  // paths, so it lobs over the upper rows; 08 (r2c2 → slot 08) ducks under 02 and the row-1 tiles. Both lift a little
  // (scale + shadow) and fly on top. Measured on the DOM, this cuts tile overlap during the flight by ≈75 % against
  // direction-based lanes (where 08 rode the same upper lane as 06 / 07 and covered 06 by 96 %).
  const FEAT = [
    { id: 'lists-006', clip: 'c1-006-morph', at: 1.9, author: '@twoclipping' },
    { id: 'gosail-060', clip: 'c2-060-light', at: 4.4, author: '@morpheusdv', lane: -300, lift: 0.08 },
    { id: 'uc-0962', clip: 'c3-0962-web', at: 6.0, author: '@kimmonismus' },
    { id: 'uc-1377', clip: 'c4-1377-sun', at: 3.5, author: '@WinterArc2125' },
    { id: 'gosail-072', clip: 'c5-072-brand', at: 0.65, author: '@aiwarts' },
    { id: 'gosail-054', clip: 'c6-054-render', at: 1.5, author: '@yoshifujidesign', pos: '50% 36%' },
    { id: 'uc-2348', clip: 'c7-2348-hikare', at: 2.0, author: '@aicreataro' },
    { id: 'gosail-133', clip: 'c8-133-stage', at: 10.0, author: '@KanaWorks_AI', lane: 110, lift: 0.08 },
  ];
  // gosail-072's wall poster is a third-party frame and is never shown: use @aiwarts's own card instead (amendment G2)
  const SAFE_POSTER = { 'gosail-072': ['c5-072-brand', 0.65] };

  // rack: 8 slots 190 × 107, gap 18, centred
  const RW = 190, RH = 107, RGAP = 18;
  const RX0 = (1920 - (8 * RW + 7 * RGAP)) / 2;              // 137
  const RY = 432;                                             // slot top
  const RACK_CY = RY + RH / 2;
  const rackX = k => RX0 + k * (RW + RGAP) + RW / 2;
  const PIV_X = rackX(0), PIV_Y = RACK_CY;                    // the rack exits by scaling about slot 01 …
  const EXIT_S = 0.4, EXIT_D = 800;                           // … 1 → 1.4 while sliding 800 px off to the right
  const HL_S = 1.10;                                          // featured tiles lift to 1.10 on 「8 个」
  const PUSH = 6;                                             // adjacent picks move 6 px apart while highlighted
  const TAG_INSET = 21;                                       // tag centre below the tile's top edge (on the wall)
  const TAG_LIFT = 27;                                        // label centre above the slot's top edge (in the rack)
  const CRED_GAP = 12;                                        // slot bottom → credit top
  const PILL_W = 128, PILL_H = 46;
  const PILL_GAP0 = 65, PILL_GAP1 = 31;                       // card bottom → pill centre (below the credit / tucked up)
  const SMEAR_MAX = 0.18;

  // H1 → header
  const H1_SIZE = 110, H1_Y = 480, HEAD_SIZE = 64, HEAD_Y = 170;
  // counter block
  const EYEBROW_Y = 304, EYE_H = 50, NUM_Y = 356, CAP_Y = 596;
  const DATE_Y = 470, DATE_SIZE = 40, EYE_SIZE = 26;          // date line: centre stage first, then the eyebrow
  // stacking: wall tiles (auto) < scrim plate < featured tiles < glow < scanline < text < labels (02–08) < card 01 < its labels < pill
  const Z_PLATE = 45, Z_FEAT = 48, Z_GLOW = 57, Z_SCAN = 58, Z_TEXT = 60, Z_LABEL = 61, Z_CARD = 62, Z_CARD_LABEL = 63, Z_PILL = 70;
  // scrim plate: radial gradient centred at (960, 440), ellipse radii 1060 × 452, alpha stops below
  const PLATE = { cx: 960, cy: 440, rx: 1060, ry: 452, stops: [[0, 0.84], [0.38, 0.70], [0.60, 0.32], [0.74, 0]] };

  // s06_c1 (case template) card geometry, see src/scenes/case.js: card centred at (112 + 1040/2, 515), entrance
  // spring(t − 0.05, {140, 19}) scaling 0.86 → 1 and sliding up 30 px, slow push 1 + 0.025·t/dur; series dots below it.
  const CASE_AR = { '16:9': [1000, 562], '1:1': [620, 620], '9:16': [372, 662] };
  const CASE_CX = 112 + 1040 / 2, CASE_CY = 515;

  const smooth = p => p * p * (3 - 2 * p);
  const clamp01 = x => Math.min(1, Math.max(0, x));
  const LIME = '#C9DF8D', SNOW = '#F4F1F2';

  function timing(ctx) {
    const w = (line, word) => ctx.word(`s05_wall.${line}`, word);
    const T = {
      xuan: w(1, '炫不'), dao: w(1, '导演'),
      jie: w(2, '截至'), way: w(2, 'Way'), num: w(2, '1704'), vid: w(2, '视频'),
      n8: w(3, '8 个'), mei: w(3, '每个'),
      dur: ctx.dur,
    };
    T.yi = Math.min(Math.max(w(3, '一'), T.mei + 0.15), T.dur - 0.6);   // 「第 1 招」 pops on 「一」 (never before the flight)
    T.scanDur = 0.8;
    T.dim0 = T.dao - 0.35;                 // wall dims under the thesis (from 「差」)
    T.h1In = T.dao - 0.2;                  // per-character rise lands on 「导演」
    T.shrink = T.jie + 0.1;                // ≈4.0 s: H1 → header
    T.shrinkDur = 0.65;
    T.date = T.shrink + 0.44;              // ≈4.45: the date line takes the centre the H1 just left
    T.dateUp = T.way - 0.15;               // date line → eyebrow (0.4 s) …
    T.numIn = T.way + 0.06;                // … while the counter rises into the space it leaves
    T.sheen = Math.max(T.num + 0.6, T.vid + 0.05);
    T.flyMin = 0.40; T.flyMax = 0.56; T.flyStag = 0.015;
    T.land01 = T.mei + T.flyMin;           // slot 01 leaves with the far tiles and lands first, under the pill
    T.rew0 = T.land01 + 0.1;               // slot 01 has landed: start rewinding its clip
    T.dive = Math.min(T.land01 + 0.2, T.dur - 0.5);   // slot 01 lifts out over the row
    T.diveDur = Math.max(0.5, T.dur + 0.1 - T.dive);  // arrives on s06's card ≈0.1 s into the cross-fade
    T.credX = T.dive + 0.5172 * T.diveDur; // dive progress 0.55: card ≈420 px wide → rack credit hands over to the in-card chip
    T.exit0 = Math.max(T.mei + T.flyMax + 0.3, T.dur - 0.18);  // ≈10.82: the full rack has held since ≈10.42
    T.exitDur = 0.33;                      // ends ≈0.15 s into s06's zoom; fades only in its last 0.12 s, under the cross-fade
    T.sync = T.dur;                        // s06 starts c1-006-morph at frame 0
    // pill → capsule: starts 0.2 s before the cut, so the pill already sits on s06's capsule (≥ 95 % of the way at s06's
    // first frame, exact by ≈0.07 s) while s06 is still faint, and the two lime shapes fuse instead of showing side by side.
    // The label fades out first (gone before the pill narrows below ≈120 px), then the bare pill shrinks into the dot.
    T.morph0 = T.sync - 0.2; T.morphDur = 0.3;
    T.txtOut = T.morph0 - 0.03;            // 0.1 s label fade
    return T;
  }

  // Where s06's card (and its active series dot) appear on screen at s06-local time tau, expressed in THIS scene's
  // coordinates (undoing the zoom transition's scale on our outgoing root), so slot 01 can sit exactly on top of it.
  function nextPose(ctx, tau) {
    const nx = ctx.next || {};
    const d = nx.data || {};
    const tr = nx.transition || {};
    const ar = CASE_AR[d.aspect || '16:9'] || CASE_AR['16:9'];
    const tt = Math.max(0, tau);
    const p = tr.type === 'zoom' && tr.dur > 0 ? clamp01(tt / tr.dur) : 1;
    const Z = tr.type === 'zoom' ? M.lerp(1.12, 1, M.ease.outCubic(p)) : 1;            // incoming root scale
    const k = tr.type === 'zoom' ? M.lerp(1, 0.92, M.ease.inOutCubic(p)) : 1;          // our root scale
    const a = M.spring(tt - 0.05, { stiffness: 140, damping: 19 });
    const c = M.lerp(0.86, 1, a) * (1 + 0.025 * clamp01(tt / Math.max(1, nx.dur || 11)));
    const map = (x, y) => [960 + ((960 + (x - 960) * Z) - 960) / k, 540 + ((540 + (y - 540) * Z) - 540) / k];
    const [cx, cy] = map(CASE_CX, CASE_CY + (1 - a) * 30);
    const total = d.total || 8, idx = d.index || 1;
    const dotX = CASE_CX - (total * 26) / 2 + (idx - 1) * 26 + 15, dotY = CASE_CY + ar[1] / 2 + 34 + 7;
    const [dx, dy] = map(dotX, dotY);
    return { cx, cy, w: ar[0], h: ar[1], s: (c * Z) / k, dx, dy, dotS: Z / k };
  }

  // ---------------- pure-in-t pose helpers ----------------
  const camAt = (T, t) => { const cp = clamp01(t / T.dur); return { s: 1 + CAM_PUSH * cp, y: 4 * cp }; };
  const scrAt = (cam, x, y) => [CAM_OX + (x - CAM_OX) * cam.s, CAM_OY + (y - CAM_OY) * cam.s + cam.y];
  // pop-in spring and scan flash of a wall cell
  function popScale(cell, t) {
    const sp = M.spring(t - cell.st, { stiffness: 260, damping: 22 });
    const fl = M.prog(t, cell.ts, 0.08) * (1 - M.prog(t, cell.ts + 0.08, 0.45, M.ease.outCubic));
    return { s: M.lerp(0.4, 1, sp) * (1 + 0.07 * fl), fl };
  }
  // rack exit (02–08): accelerating slide to the right while scaling about slot 01 (inQuad)
  const exitE = (T, t) => M.ease.inQuad(clamp01((t - T.exit0) / T.exitDur));
  // featured tile: wall → highlight → flight → rack (→ exit, 02–08). Slot 01's dive is applied on top by render().
  function featPose(T, ft, t) {
    const cam = camAt(T, t);
    const hl = M.spring(t - ft.t8, { stiffness: 240, damping: 16 });
    const [wx, wy0] = scrAt(cam, ft.cell.cx, ft.cell.cy);
    const wy = wy0 + ft.push * hl;
    const wallK = cam.s * popScale(ft.cell, t).s * M.lerp(1, HL_S, hl);
    const fp = M.ease.inOutSine(clamp01((t - ft.launch) / ft.fdur));
    const arc = Math.sin(Math.PI * fp);
    let cx = M.lerp(wx, rackX(ft.k), fp);
    let cy = M.lerp(wy, RACK_CY, fp) + (ft.f.lane || 0) * arc;
    let kk = M.lerp(wallK, 1, fp) * (1 + (ft.f.lift || 0) * arc);
    if (ft.k > 0) {
      const e = exitE(T, t), S = 1 + EXIT_S * e;
      cx = PIV_X + (cx - PIV_X) * S + EXIT_D * e; cy = PIV_Y + (cy - PIV_Y) * S; kk *= S;
    }
    return { cx, cy, kk, fp, hl, arc, wx, wy, w: M.lerp(TW, RW, fp), hh: M.lerp(TH, RH, fp) };
  }
  // The growing card 01 covers slots 02 and 03 before the rack slides away; they (and their labels) are switched off while
  // fully covered, so the slide never pulls them back out from under the card. First fully-covered time per slot (pure in
  // ctx; computed once, on the first render, because ctx.next is only known after every scene is built).
  function coverTimes(T, feat, ctx) {
    const out = feat.map(() => Infinity);
    for (let t = T.dive; t <= T.exit0 + T.exitDur; t += 1 / 240) {
      const dp = M.prog(t, T.dive, T.diveDur, M.ease.inOutCubic);
      const P = nextPose(ctx, t - T.sync), c = featPose(T, feat[0], t);
      const cx = M.lerp(c.cx, P.cx, dp), cy = M.lerp(c.cy, P.cy, dp);
      const hw = (M.lerp(c.w, P.w, dp) * M.lerp(c.kk, P.s, dp)) / 2 - 20, hh = (M.lerp(c.hh, P.h, dp) * M.lerp(c.kk, P.s, dp)) / 2 - 20;
      for (const ft of feat) {
        if (ft.k === 0 || out[ft.k] < Infinity) continue;
        const q = featPose(T, ft, t);
        const S = 1 + EXIT_S * exitE(T, t);
        const half = Math.max(RW * S, (ft.f.author.length * 12 + 8) * S) / 2;   // slot or its credit, whichever is wider
        const top = q.cy - (RH * S) / 2 - (TAG_LIFT + 16) * S, bot = q.cy + (RH * S) / 2 + (CRED_GAP + 22) * S;
        if (q.cx - half > cx - hw && q.cx + half < cx + hw && top > cy - hh && bot < cy + hh) out[ft.k] = t;
      }
    }
    return out;
  }

  // ---------------- scene ----------------
  Scene.define({
    id: 's05_wall',

    build(root, ctx) {
      const { h } = E;
      const T = timing(ctx);
      K.bg(root, 'night', { glows: [
        { x: 1660, y: 170, r: 680, color: 'rgba(173,133,186,.42)', o: 0.55 },
        { x: 240, y: 960, r: 600, color: 'rgba(201,223,141,.20)', o: 0.5 },
      ] });
      const rnd = ctx.rng('wall-pop');
      const featIdx = new Map(FEAT.map((f, k) => [f.id, k]));
      const scanX0 = 95, scanX1 = 1825;

      const wallLayer = h('div', { class: 'fill' });
      root.append(wallLayer);
      const tiles = [];   // regular tiles
      const cells = [];   // per-cell timing (shared by featured tiles)
      WALL.forEach((id, i) => {
        const c = i % COLS, r = Math.floor(i / COLS);
        const x = WX + c * (TW + GAP), y = WY + r * (TH + GAP);
        const cx = x + TW / 2, cy = y + TH / 2;
        // pop-in: the tile pops as the incoming chapter wipe's bar (x = inOutCubic(p)·1920 over 0.6 s) passes its centre,
        // plus at most 0.15 s of random scatter (a 0.10 s fade), so every tile lands 0.10–0.25 s behind the bar and the
        // wall builds with the wipe (pops 0.20–0.57 s, all opaque by ≈0.67 s) instead of after it
        const ux = Math.min(1, Math.max(0, cx / 1920));
        const uinv = ux < 0.5 ? Math.cbrt(ux / 4) : 1 - Math.cbrt(2 * (1 - ux)) / 2;
        const st = 0.6 * uinv + 0.15 * rnd();
        // when the scanline crosses the tile centre (inverse of its inOutSine sweep)
        const q = clamp01((cx - scanX0) / (scanX1 - scanX0));
        const ts = T.xuan + T.scanDur * (Math.acos(1 - 2 * q) / Math.PI);
        // counter fill: tile i lights when the rolling count passes (i + .5)/60 of 1,704 (outCubic count)
        const frac = (i + 0.5) / WALL.length;
        const tl = T.way + (1 - Math.cbrt(1 - frac)) * (T.num - T.way);
        // halo: tiles near the text block darken a little more
        const hx = (cx - 960) / 800, hy = (cy - 470) / 340;
        const halo = smooth(clamp01(1 - Math.sqrt(hx * hx + hy * hy)));
        const cell = { i, id, c, r, x, y, cx, cy, st, ts, tl, halo };
        cells.push(cell);
        if (featIdx.has(id)) return; // drawn by the featured layer
        const el = h('div', { class: 'abs', style: { left: `${x}px`, top: `${y}px`, width: `${TW}px`, height: `${TH}px`,
          borderRadius: '10px', overflow: 'hidden', background: '#1F1B1C' } });
        const img = h('img', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', objectFit: 'cover', display: 'block' } });
        el.append(img);
        wallLayer.append(el);
        tiles.push({ el, img, cell, url: posterUrl(ctx, id), filt: '' });
      });

      // lime scanline (「炫不」)
      const scan = h('div', { class: 'abs', style: { left: '0px', top: '200px', width: '320px', height: '636px', pointerEvents: 'none', zIndex: String(Z_SCAN) } });
      scan.append(
        h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '317px', height: '100%',
          background: 'linear-gradient(90deg, rgba(201,223,141,0) 0%, rgba(201,223,141,.05) 55%, rgba(201,223,141,.20) 100%)' } }),
        h('div', { class: 'abs', style: { right: '0px', top: '0px', width: '3px', height: '100%', borderRadius: '2px',
          background: '#E4F2B9', boxShadow: '0 0 14px 3px rgba(201,223,141,.85), 0 0 46px 8px rgba(201,223,141,.35)' } }));
      root.append(scan);

      // featured tiles: wall poster → rack still → (01) the card. Above the scrim (they emulate it until picked), under the text
      const camM = camAt(T, T.mei);
      const feat = FEAT.map((f, k) => {
        const cell = cells[WALL.indexOf(f.id)];
        const el = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: `${TW}px`, height: `${TH}px`, overflow: 'hidden',
          borderRadius: '10px', background: '#1F1B1C' } });
        const imgStyle = { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
        const poster = h('img', { style: { ...imgStyle } });
        const still = h('img', { style: { ...imgStyle, objectFit: f.fit || 'cover', objectPosition: f.pos || '50% 50%', background: f.ground || 'transparent' } });
        el.append(poster, still);
        let credit = null;
        if (k === 0) {
          credit = h('div', { class: 'k-credit' }, h('span', { text: f.author }), h('small', { text: '原作片段' }));
          el.append(credit);
        }
        root.append(el);
        const [wx, wy] = scrAt(camM, cell.cx, cell.cy);
        const dist = Math.hypot(rackX(k) - wx, RACK_CY - wy);
        return { f, k, cell, el, poster, still, credit, posterUrl: posterUrl(ctx, f.id), filt: '', z: '',
          t8: T.n8 + 0.04 + k * 0.03, dist, push: 0, launch: T.mei, fdur: T.flyMin };
      });
      // flight plan: everyone leaves on 「每个」, far tiles first (≤15 ms apart), duration by distance (0.40–0.56 s), so the
      // whole rack is complete by ≈10.42. Slot 01 leaves with the first ones and lands first (under the 「第 1 招」 pill).
      const others = feat.slice(1).sort((a, b) => b.dist - a.dist);
      const dMin = Math.min(...feat.map(ft => ft.dist)), dMax = Math.max(...feat.map(ft => ft.dist));
      feat.forEach(ft => { ft.fdur = T.flyMin + (T.flyMax - T.flyMin) * clamp01((ft.dist - dMin) / Math.max(1, dMax - dMin)); });
      others.forEach((ft, rank) => { ft.launch = T.mei + rank * T.flyStag; ft.zBase = Z_FEAT + 6 - rank; });
      feat[0].fdur = T.flyMin;
      feat[0].zBase = Z_FEAT + 7;
      // adjacent picks (8-neighbourhood on the grid) move apart vertically while highlighted, so outlines never merge
      for (const a of feat) for (const b of feat) {
        if (a === b || Math.abs(a.cell.c - b.cell.c) > 1 || Math.abs(a.cell.r - b.cell.r) !== 1) continue;
        a.push = a.cell.r < b.cell.r ? -PUSH : PUSH;
      }

      // dark plate behind the text block (no blur: a radial gradient)
      const plate = h('div', { class: 'abs', style: { left: `${PLATE.cx - 750}px`, top: `${PLATE.cy - 320}px`, width: '1500px', height: '640px', zIndex: String(Z_PLATE),
        background: `radial-gradient(ellipse ${PLATE.rx}px ${PLATE.ry}px at 50% 50%, ${PLATE.stops.map(([p, a]) => `rgba(18,16,17,${a}) ${p * 100}%`).join(', ')})` } });
      // soft lime glow behind the counter (pulses when it lands)
      const glow = h('div', { class: 'abs', style: { left: '420px', top: '258px', width: '1080px', height: '440px', zIndex: String(Z_GLOW),
        background: 'radial-gradient(ellipse at center, rgba(201,223,141,.15) 0%, rgba(201,223,141,.05) 38%, rgba(201,223,141,0) 70%)' } });
      root.append(plate, glow);

      // H1 → header 「差在导演功夫」 (导演功夫 in lime, turning snow as it shrinks)
      const h1 = K.title('差在导演功夫', { size: H1_SIZE, align: 'center', stagger: 0.04, dur: 0.7, ls: '0.02em' });
      // no per-glyph compositor layers (the shared .ch class asks for will-change), see tf2()
      h1.spans.forEach((sp, i) => { if (i >= 2) sp.style.color = LIME; sp.style.willChange = 'auto'; });
      const h1LineH = H1_SIZE * 1.15;
      const h1Wrap = h('div', { class: 'abs', style: { left: '0px', top: `${Math.round(H1_Y - h1LineH / 2)}px`, width: '1920px', zIndex: String(Z_TEXT),
        transformOrigin: `960px ${h1LineH / 2}px`, textShadow: '0 6px 40px rgba(0,0,0,.55)' } }, h1.el);
      root.append(h1Wrap);

      // date line → eyebrow 「截至 10 月 1 日 · WaytoAGI 收录」: one element, scaled 40/26 at the centre, 1 in the eyebrow slot
      // fixed even width: the chip's layout x is a whole pixel (721). It is scaled 1.54 → 1 and then rests at identity, and
      // Blink keeps the whole-pixel paint offset it snapped to while scaled; a fractional x would make the resting chip sit
      // 0.3 px apart depending on whether the frame was rendered after the scale-down or straight from a seek.
      const eyeChip = h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', width: '478px', height: `${EYE_H}px`,
        padding: '0 22px 1px 18px', borderRadius: '999px',
        background: 'rgba(18,16,17,0)', border: '1.5px solid rgba(244,241,242,0)', font: `600 ${EYE_SIZE}px/1.2 var(--cn)`, letterSpacing: '.03em',
        color: 'var(--snow)', whiteSpace: 'nowrap', textShadow: '0 4px 22px rgba(0,0,0,.65)' } },
        h('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: 'var(--lime)', boxShadow: '0 0 10px rgba(201,223,141,.9)' } }),
        h('span', { text: '截至 10 月 1 日 · WaytoAGI 收录' }));
      const eyebrow = h('div', { class: 'abs', style: { left: '0px', top: `${EYEBROW_Y}px`, width: '1920px', display: 'flex', justifyContent: 'center', zIndex: String(Z_TEXT) } }, eyeChip);
      root.append(eyebrow);
      const counter = K.counter({ size: 220, color: 'var(--lime)' });
      counter.el.style.textShadow = '0 8px 50px rgba(0,0,0,.5)';
      // one sheen across the landed number: the same text, clipped gradient
      const sheen = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '1920px', textAlign: 'center', font: '700 220px/1 var(--display)',
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', whiteSpace: 'nowrap', color: 'transparent', webkitBackgroundClip: 'text',
        backgroundClip: 'text', backgroundRepeat: 'no-repeat', visibility: 'hidden' }, text: '1,704' });
      const numWrap = h('div', { class: 'abs', style: { left: '0px', top: `${NUM_Y}px`, width: '1920px', textAlign: 'center', zIndex: String(Z_TEXT),
        transformOrigin: '960px 110px' } }, counter.el, sheen);
      root.append(numWrap);
      const capMain = h('span', { style: { font: '700 44px/1.2 var(--cn)', color: 'var(--snow)' }, text: '个视频类案例' });
      const capSub = h('span', { style: { font: '500 30px/1.2 var(--cn)', color: 'var(--fog)' }, text: '· 全库 5,181 条' });
      const cap = h('div', { class: 'abs', style: { left: '0px', top: `${CAP_Y}px`, width: '1920px', display: 'flex', justifyContent: 'center', zIndex: String(Z_TEXT),
        alignItems: 'baseline', gap: '18px', whiteSpace: 'nowrap', textShadow: '0 4px 24px rgba(0,0,0,.6)' } }, capMain, capSub);
      root.append(cap);

      // number tags (ride with the tiles, settle as the rack labels) and rack credits. Zero-size anchors: tags are centred
      // on their anchor, credits hang from it.
      const tags = FEAT.map((f, k) => {
        const chip = h('div', { class: 'abs', style: { left: '0px', top: '0px', transform: 'translate(-50%,-50%)', height: '30px', padding: '0 7px 0 8.3px',
          display: 'flex', alignItems: 'center', borderRadius: '8px', background: 'rgba(18,16,17,.82)', font: '600 22px/1 var(--mono)', letterSpacing: '.06em',
          color: k === 0 ? 'var(--lime)' : 'var(--fog)', whiteSpace: 'nowrap' }, text: String(k + 1).padStart(2, '0') });
        const wrap = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '0px', height: '0px', zIndex: String(k === 0 ? Z_CARD_LABEL : Z_LABEL), visibility: 'hidden' } }, chip);
        root.append(wrap);
        return { wrap, chip, bgA: -1 };
      });
      const creds = FEAT.map((f, k) => {
        const txt = h('div', { class: 'abs', style: { left: '0px', top: '0px', transform: 'translate(-50%,0)', font: '500 20px/1 var(--mono)', color: 'var(--fog)',
          whiteSpace: 'nowrap' }, text: f.author });
        const wrap = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '0px', height: '0px', zIndex: String(k === 0 ? Z_CARD_LABEL : Z_LABEL), visibility: 'hidden' } }, txt);
        root.append(wrap);
        return { wrap };
      });

      // 「第 1 招」 — the lime playhead pill, now marking case 01. Zero-size wrapper at its centre.
      const pillBody = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: `${PILL_W}px`, height: `${PILL_H}px`,
        transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        borderRadius: `${PILL_H / 2}px`, background: 'var(--lime)', boxShadow: '0 10px 30px rgba(201,223,141,.28)' } });
      const pillText = h('span', { style: { font: '800 26px/1 var(--cn)', color: 'var(--ink)', whiteSpace: 'nowrap' }, text: '第 1 招' });
      pillBody.append(pillText);
      const pill = h('div', { class: 'abs', style: { left: '0px', top: '0px', width: '0px', height: '0px', zIndex: String(Z_PILL) } }, pillBody);
      root.append(pill);

      const foot = h('div', { class: 'abs', style: { left: '0px', top: '860px', width: '1920px', textAlign: 'center',
        font: '500 20px/1.2 var(--cn)', color: 'var(--fog)', whiteSpace: 'nowrap' },
        text: '缩略图来自 WaytoAGI 案例库，版权归各作者 · 收录作品并非都由 Opus 代码渲染' });
      root.append(foot);

      return { T, tiles, scan, plate, glow, h1, h1Wrap, h1Col: '', eyebrow, eyeChip, counter, numWrap, sheen, capMain, capSub, cap,
        tags, creds, feat, pill, pillBody, pillText, foot };
    },

    render(s, t, ctx) {
      const { setImg } = E;
      const { lerp, prog, ease, spring } = M;
      const T = s.T;

      // slow linear camera push on the wall, centred on x 960 (pivot y 400: header above and footnote below keep their air)
      const cam = camAt(T, t);
      const camS = cam.s;
      const scr = (x, y) => scrAt(cam, x, y);

      // phase envelopes
      const dimTh = prog(t, T.dim0, 0.4, ease.inOutCubic);
      const lift = prog(t, T.n8 - 0.08, 0.22, ease.inCubic);     // counter / header lift on 「8 个」
      const haloA = dimTh * (1 - prog(t, T.n8, 0.35, ease.outCubic));
      const plateA = dimTh * (1 - prog(t, T.n8 + 0.04, 0.32, ease.inOutCubic)); // scrim outlasts the text
      const dim8 = prog(t, T.n8, 0.35, ease.outCubic);
      const wallOut = prog(t, T.mei + 0.05, 0.45, ease.inCubic);

      // how a cell looks on the wall at time t
      const look = cell => {
        const ps = popScale(cell, t);
        const popO = clamp01((t - cell.st) / 0.10);
        const col = prog(t, cell.ts, 0.4, ease.outCubic);          // colour floods in behind the scanline
        let lv = lerp(1, 0.32, dimTh);
        lv += 0.14 * dimTh * prog(t, cell.tl, 0.22, ease.outCubic); // lights up as the count passes it
        // the library breathes while the number holds: tiles brighten now and then
        const tw = Math.max(0, M.noise1(t * 1.1 + cell.i * 3.71));
        lv += 0.16 * dimTh * prog(t, T.num - 0.2, 0.6) * tw * tw;
        lv = lerp(lv, 0.2, dim8);
        const o = popO * lv * (1 - 0.35 * haloA * cell.halo);
        return { s: ps.s, o, gray: 1 - col, bright: lerp(0.58, 1, col) + 0.45 * ps.fl };
      };
      const filt = (gray, bright) => (gray < 0.004 && Math.abs(bright - 1) < 0.004 ? 'none' : `grayscale(${gray.toFixed(3)}) brightness(${bright.toFixed(3)})`);

      // ---- regular wall tiles ----
      for (const tl of s.tiles) {
        setImg(tl.img, tl.url);
        const L = look(tl.cell);
        const o = L.o * (1 - wallOut);
        const [x, y] = scr(tl.cell.cx, tl.cell.cy);
        tf2(tl.el, { x: x - tl.cell.cx, y: y - tl.cell.cy, s: camS * L.s, o });
        tl.el.style.visibility = o > 0.002 ? 'visible' : 'hidden';
        const f = filt(L.gray, L.bright);
        if (f !== tl.filt) { tl.el.style.filter = f; tl.filt = f; }
      }

      // ---- scanline ----
      const su = clamp01((t - T.xuan) / T.scanDur);
      const sx = lerp(95, 1825, ease.inOutSine(su));
      const so = prog(t, T.xuan - 0.04, 0.1) * (1 - prog(t, T.xuan + T.scanDur - 0.12, 0.14));
      tf2(s.scan, { x: sx - 320, o: so });
      s.scan.style.visibility = so > 0.002 ? 'visible' : 'hidden';

      // ---- plate behind the text ----
      tf2(s.plate, { o: plateA });
      s.plate.style.visibility = plateA > 0.002 ? 'visible' : 'hidden';

      // ---- H1 → header ----
      s.h1.spans.forEach((sp, i) => {                              // K.title's rise: outQuint 0.7 s, 40 ms stagger
        const p = prog(t, T.h1In + i * 0.04, 0.7, ease.outQuint);
        tf2(sp, { y: (1 - p) * H1_SIZE * 0.55, o: p });
        const b = (1 - p) * 6;
        sp.style.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none';
      });
      const shr = prog(t, T.shrink, T.shrinkDur, ease.inOutCubic);
      const col = M.mixColor(LIME, SNOW, shr);                       // lime belongs to the number from here on
      if (col !== s.h1Col) { s.h1.spans.forEach((sp, i) => { if (i >= 2) sp.style.color = col; }); s.h1Col = col; }
      tf2(s.h1Wrap, { y: (HEAD_Y - H1_Y) * shr - 14 * lift, s: lerp(1, HEAD_SIZE / H1_SIZE, shr), o: 1 - lift });
      s.h1Wrap.style.visibility = t < T.h1In - 0.05 || lift >= 1 ? 'hidden' : 'visible';

      // ---- date line → eyebrow, counter block ----
      const blockO = 1 - lift, blockY = -30 * lift;
      const da = prog(t, T.date, 0.5, ease.outQuint);
      const du = prog(t, T.dateUp, 0.4, ease.inOutCubic);
      tf2(s.eyeChip, { y: lerp(DATE_Y - (EYEBROW_Y + EYE_H / 2), 0, du) + (1 - da) * 26 + blockY, s: lerp(DATE_SIZE / EYE_SIZE, 1, du), o: da * blockO });
      s.eyeChip.style.background = `rgba(18,16,17,${(0.6 * du).toFixed(3)})`;
      s.eyeChip.style.borderColor = `rgba(244,241,242,${(0.16 * du).toFixed(3)})`;
      s.eyebrow.style.visibility = t > T.date - 0.05 && lift < 1 ? 'visible' : 'hidden';
      const q = clamp01((t - T.way) / Math.max(0.3, T.num - T.way));
      s.counter.render(Math.round(1704 * ease.outCubic(q)));
      const na = prog(t, T.numIn, 0.6, ease.outQuint);
      const land = t >= T.num ? Math.exp(-(t - T.num) * 6.5) * (1 - Math.exp(-(t - T.num) * 45)) : 0;
      tf2(s.numWrap, { y: (1 - na) * 40 + blockY, s: lerp(0.94, 1, na) * (1 + 0.045 * land) * (1 + 0.012 * clamp01((t - T.num) / 2.2)), o: na * blockO });
      // sheen: a light band crosses the landed number once (105° gradient, clipped to the glyphs)
      const shp = (t - T.sheen) / 0.6;
      if (shp > 0 && shp < 1) {
        const xc = lerp(560, 1360, ease.inOutSine(shp));
        const g = xc * 0.9659 + 110 * 0.2588;                       // position along the 105° gradient line at mid-height
        s.sheen.style.backgroundImage = `linear-gradient(105deg, rgba(250,255,232,0) ${(g - 80).toFixed(1)}px, rgba(250,255,232,.8) ${g.toFixed(1)}px, rgba(250,255,232,0) ${(g + 80).toFixed(1)}px)`;
        s.sheen.style.visibility = 'visible';
      } else { s.sheen.style.backgroundImage = 'none'; s.sheen.style.visibility = 'hidden'; }
      const ca = prog(t, T.numIn + 0.1, 0.6, ease.outQuint);
      const cb = prog(t, T.numIn + 0.32, 0.6, ease.outQuint);
      // the lift goes straight onto the two spans: a moving translation on their container would leave Blink's cached
      // sub-pixel offsets of the (transformed) spans stale, so their pixels would depend on the previous frame
      tf2(s.capMain, { y: (1 - ca) * 20 + blockY, o: ca * blockO });
      tf2(s.capSub, { y: (1 - cb) * 20 + blockY, o: cb * blockO });
      s.numWrap.style.visibility = t > T.numIn - 0.02 && lift < 1 ? 'visible' : 'hidden';
      s.cap.style.visibility = t > T.numIn && lift < 1 ? 'visible' : 'hidden';
      const go = prog(t, T.numIn, 0.6) * (0.55 + 0.45 * land) * blockO;
      tf2(s.glow, { o: go, s: 1 + 0.06 * land });
      s.glow.style.visibility = go > 0.002 ? 'visible' : 'hidden';

      // ---- featured tiles: wall → highlight → rack → (01) card; number tags and credits ride along ----
      const dp = prog(t, T.dive, T.diveDur, ease.inOutCubic);
      const P = nextPose(ctx, t - T.sync);
      const S = 1 + EXIT_S * exitE(T, t);
      // the exit is by motion; the fade only comes in its last 0.12 s, while s06 is already fading in on top
      const exitAll = 1 - prog(t, T.exit0 + T.exitDur - 0.12, 0.12, ease.linear);
      const cover = s.cover || (s.cover = coverTimes(T, s.feat, ctx));
      let card01 = null;
      for (const ft of s.feat) {
        const { k, cell, el } = ft;
        const L = look(cell);
        const fz = featPose(T, ft, t);
        let { cx, cy, w, hh, kk } = fz;
        const { fp } = fz;
        const exitO = exitAll * (1 - prog(t, cover[k], 0.03, ease.linear));   // off while hidden under card 01
        const hlO = prog(t, ft.t8, 0.25, ease.outCubic);
        const xf = prog(t, ft.t8 + 0.12, 0.4, ease.inOutSine);          // poster → rack still
        // velocity smear while flying / exiting (not on slot 01's dive)
        let smx = 1, smy = 1;
        if ((fp > 0 && fp < 1) || (k > 0 && t > T.exit0 && t < T.exit0 + T.exitDur)) {
          const a = featPose(T, ft, t - 1 / 60), b = featPose(T, ft, t + 1 / 60);
          const sm = Math.min(SMEAR_MAX, Math.abs(b.cx - a.cx) * 30 / 5000);
          smx = 1 + sm; smy = 1 - 0.35 * sm;
        }
        let rad = lerp(10, 8, fp);
        // featured tiles sit above the scrim, so until they are picked they take its darkening analytically
        let o = lerp(L.o * (1 - plateA * plateAlpha(fz.wx, fz.wy)), 1, hlO);
        let outline = hlO * (k === 0 ? 1 : 1 - fp);
        if (k === 0) {
          // the dive: slot 01 grows into s06's card, tracking its live pose through the cross-fade
          cx = lerp(cx, P.cx, dp); cy = lerp(cy, P.cy, dp);
          w = lerp(w, P.w, dp); hh = lerp(hh, P.h, dp); kk = lerp(kk, P.s, dp);
          rad = lerp(rad, 24, dp);
          outline *= 1 - prog(t, T.dive + 0.1, 0.35);
          card01 = { cx, cy, top: cy - (hh * kk) / 2, bottom: cy + (hh * kk) / 2 };
        } else {
          o *= exitO;
        }
        const z = String(k === 0 && t >= ft.launch ? Z_CARD : ft.zBase);
        if (z !== ft.z) { el.style.zIndex = z; ft.z = z; }
        el.style.width = `${w.toFixed(2)}px`;
        el.style.height = `${hh.toFixed(2)}px`;
        el.style.borderRadius = `${rad.toFixed(2)}px`;
        tf2(el, { x: cx - w / 2, y: cy - hh / 2, sx: kk * smx, sy: kk * smy, o });
        el.style.visibility = o > 0.002 ? 'visible' : 'hidden';
        // lime outline (3 px on screen) + drop shadow once lifted off the wall
        const ol = 3 / Math.max(0.2, kk);
        const up = k === 0 ? dp : (ft.f.lift ? 0.6 * fz.arc : 0);       // card 01's dive / the long flyers' lift
        el.style.boxShadow = hlO <= 0 && fp <= 0 ? 'none'
          : `0 0 0 ${ol.toFixed(2)}px rgba(201,223,141,${(0.95 * outline).toFixed(3)}), 0 ${(14 + 16 * up).toFixed(1)}px ${(30 + 60 * up).toFixed(1)}px rgba(0,0,0,${(0.45 + 0.1 * up).toFixed(3)})`;
        // images
        setImg(ft.poster, ft.posterUrl);
        let ct = ft.f.at;
        if (k === 0) {
          // rewind the morph from the rack still (1.9 s) to frame 0, then run forward in step with s06's card
          if (t >= T.sync) ct = t - T.sync;
          else if (t > T.rew0) ct = ft.f.at * (1 - ease.inOutSine(clamp01((t - T.rew0) / (T.sync - T.rew0))));
        }
        setImg(ft.still, ctx.clipUrl(ft.f.clip, ct));
        ft.poster.style.opacity = (1 - xf).toFixed(3);
        ft.still.style.opacity = xf.toFixed(3);
        ft.poster.style.visibility = xf < 0.999 ? 'visible' : 'hidden';
        ft.still.style.visibility = xf > 0.001 ? 'visible' : 'hidden';
        const f = fp > 0 || hlO >= 1 ? 'none' : filt(L.gray, L.bright);
        if (f !== ft.filt) { el.style.filter = f; ft.filt = f; }
        if (ft.credit) {
          const co = prog(t, T.credX, 0.12, ease.outCubic);            // in-card chip once the card can hold it
          ft.credit.style.opacity = co.toFixed(3);
          ft.credit.style.visibility = co > 0.002 ? 'visible' : 'hidden';
        }

        // number tag: inset on the tile's top edge from the highlight, rides the flight, settles as the label above the slot
        const sc = k > 0 ? S : 1;
        const Hs = hh * kk * smy;                                      // on-screen height
        const top = cy - Hs / 2;
        const tg = s.tags[k];
        const tIn = ft.t8 + 0.1;
        const ta = prog(t, tIn, 0.18, ease.outCubic) * (k > 0 ? exitO : 1 - prog(t, T.exit0 + 0.12, 0.13));
        const tsc = lerp(0.6, 1, spring(t - tIn, { stiffness: 300, damping: 20 })) * sc;
        tf2(tg.wrap, { x: cx, y: top + lerp(TAG_INSET, -TAG_LIFT * sc, fp), s: tsc, o: ta });
        tg.wrap.style.visibility = ta > 0.002 ? 'visible' : 'hidden';
        const bgA = Math.round(82 * (1 - fp)) / 100;
        if (bgA !== tg.bgA) { tg.chip.style.background = `rgba(18,16,17,${bgA})`; tg.bgA = bgA; }
        // credit under the slot: appears as the tile lands; slot 01's rides under the growing card until the in-card chip
        const cr = s.creds[k];
        const la = prog(t, ft.launch + ft.fdur - 0.1, 0.25, ease.outCubic);
        const lo = la * (k > 0 ? exitO : 1 - prog(t, T.credX, 0.12));
        tf2(cr.wrap, { x: cx, y: cy + Hs / 2 + CRED_GAP * sc + (1 - la) * 8, s: sc, o: lo });
        cr.wrap.style.visibility = lo > 0.002 ? 'visible' : 'hidden';
      }

      // ---- 「第 1 招」: pops under slot 01 on 「一」, rides under the growing card, then shrinks into the series-dot capsule ----
      const pp = spring(t - T.yi, { stiffness: 260, damping: 19 });
      const po = clamp01((t - T.yi) / 0.16);
      const gp = prog(t, T.credX + 0.06, Math.max(0.1, T.sync - T.credX - 0.06), ease.inOutCubic);
      const m = prog(t, T.morph0, T.morphDur, ease.inOutCubic);
      const pcx = lerp(card01.cx, P.dx, m), pcy = lerp(card01.bottom + lerp(PILL_GAP0, PILL_GAP1, gp), P.dy, m);
      // uniform scale towards the 30 × 14 capsule (the box narrows to its aspect so the end size is exact)
      const uEnd = (14 * P.dotS) / PILL_H;
      const u = lerp(1, uEnd, m);
      const wb = lerp(PILL_W, (30 * PILL_H) / 14, m);
      const ps = lerp(0.55, 1, pp) * u;
      s.pillBody.style.width = `${wb.toFixed(2)}px`;
      // the label leaves before the pill starts to narrow (≥ 122 px on screen when it is gone), so no shrunken
      // 「第 1 招」 ever lands over s06's grey dots; by time, not width, so it is fully there through the pop-in
      s.pillText.style.opacity = (1 - prog(t, T.txtOut, 0.1, ease.inOutSine)).toFixed(3);
      tf2(s.pill, { x: pcx, y: pcy, s: ps, o: po });
      s.pill.style.visibility = po > 0.002 ? 'visible' : 'hidden';

      // ---- footnote: with the wall; handed to the rack credits + the card chip on the dive ----
      const fo = prog(t, 0.35, 0.45) * (1 - prog(t, T.dive, 0.25));
      tf2(s.foot, { o: fo });
      s.foot.style.visibility = fo > 0.002 ? 'visible' : 'hidden';
    },

    events(ctx) {
      const T = timing(ctx);
      const out = [];
      // tick ripple over the pop wave behind the wipe bar: tiles start popping 0.20–0.57 s (see build()), the engine's
      // transition whoosh covers the empty first 0.2 s
      for (let k = 0; k < 8; k++) out.push({ t: 0.2 + k * 0.053, type: 'tick', gain: 0.14 + 0.03 * (k % 2) });
      out.push({ t: T.xuan, type: 'swish', gain: 0.4 });
      out.push({ t: T.dao, type: 'impact', gain: 0.3 });
      out.push({ t: Math.max(T.way, T.num - 0.6), type: 'rise_short', gain: 0.32 });
      out.push({ t: T.num, type: 'ding', gain: 0.45 });
      out.push({ t: T.n8, type: 'sparkle', gain: 0.55 });
      out.push({ t: T.mei, type: 'whoosh', gain: 0.3 });
      out.push({ t: T.yi, type: 'pop', gain: 0.42 });
      return out;
    },
  });

  // alpha of the scrim plate's radial gradient at a screen point (premultiplied-alpha stops are linear for one colour)
  function plateAlpha(x, y) {
    const d = Math.hypot((x - PLATE.cx) / PLATE.rx, (y - PLATE.cy) / PLATE.ry);
    const st = PLATE.stops;
    if (d <= st[0][0]) return st[0][1];
    for (let i = 1; i < st.length; i++) {
      if (d <= st[i][0]) return M.lerp(st[i - 1][1], st[i][1], (d - st[i - 1][0]) / (st[i][0] - st[i - 1][0]));
    }
    return st[st.length - 1][1];
  }
  // 2D transform + opacity. Unlike E.tf's translate3d this does not promote the element to its own compositor layer, so
  // Chrome re-rasters it in place every frame instead of reusing (and resampling) a raster from an earlier frame: the
  // pixels of a frame do not depend on which frame was rendered before it (workers render ranges independently).
  function tf2(el, { x = 0, y = 0, s = 1, sx, sy, o } = {}) {
    const ax = sx != null ? sx : s, ay = sy != null ? sy : s;
    let tr = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
    if (ax !== 1 || ay !== 1) tr += ax === ay ? ` scale(${ax.toFixed(4)})` : ` scale(${ax.toFixed(4)},${ay.toFixed(4)})`;
    el.style.transform = tr;
    if (o != null) el.style.opacity = clamp01(o).toFixed(4);
  }
  function posterUrl(ctx, id) {
    const safe = SAFE_POSTER[id];
    return safe ? ctx.clipUrl(safe[0], safe[1]) : `../assets/wall/${id}.jpg`;
  }
})();
