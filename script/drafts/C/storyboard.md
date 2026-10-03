# Draft C · 「本片即示范」 storyboard

《每一帧，都是代码》 · Opus 5.5 炫酷视频的秘密 + 小白上手指南

Measured with the real TTS (`tools/build_timeline.py script/drafts/C/narration.json --dry`): **3:56.0 (236.0 s)** ·
22 scenes · 63 lines · 1,223 characters · 196.8 s of speech. All times below are measured: scene starts are absolute,
line and word times are local to the scene (what `ctx.cue()` and `ctx.word()` return). Every word cited in a Sync
line has been checked against the TTS word list with the engine's own `ctx.word()` matching rule.

---

## 0 · The idea in one paragraph

The film is its own proof. Each claim about how Opus 5.5 videos are made is shown on screen with the machinery of
**this** film while the narrator says it: the cold open's footage frame is X-rayed into labelled code layers with a
live frame counter; the render(t) scene prints its own `render()` source; the timeline scene draws the film's real
`window.TIMELINE` (scenes, voice words, subtitle chunks, music energy bars) with a playhead parked on "now", karaoke word
stamps that match the subtitle you are reading, and the Python beat grid lighting up with the audible kick. The 8 cases
show what other people built with the same method. The how-to chapter walks through the steps this film actually went
through (brief → research → narration.json → test scene → contact sheets → checks). The last turn is honest: the
narrator says that his voice is speech synthesis too.

- **Subject:** this film, personified by its time pointer *t*. **Goal:** explain why the videos look good, then hand
  the method over. **Turns:** s02 「包括你现在看到的这一帧」 (the explainer is the specimen) and s16 「轮到你了」.
- **Signature shots:** ① s02 X-ray of our own frame; ② s04 self-printing `render()`; ③ s10 the film's own timeline.
- **The "every frame is code" reveal:** s01 ends on @twoclipping's toast 「✓ Every frame is code」; s02 continues on the
  *same frame* and turns it into our own code view. Their claim hands off to ours.

## 1 · Recurring object: the PLAYHEAD (时间指针 t)

One object travels through the whole film (the lesson of case 1, applied to ourselves):

- **Dark theme:** vertical line 4 px `--lime` with glow `0 0 24px rgba(201,223,141,.55)`; on top a pill 40 px tall,
  radius 20, fill `--lime`, text `--ink`, `600 20px var(--mono)`, tabular-nums, e.g. `t = 12.40 s`.
- **Light theme:** line `--green` (#238653); pill fill `--green`, text white (lime is never text on light).
- It always shows a **real** time: global `ctx.start + t` unless a scene says otherwise.
- Appearances: s01 HUD pill → s02 scanner line, then bent 90° into the title underline → s04 scrubber → s10 timeline
  playhead → s15 marker runner → s18 step runner → s19 contact-sheet scrubber → s20 「15–30 秒」 bar → s22 end-of-film
  ruler. The engine's lime chapter wipe bar (s03, s05, s16, s21) is the same gesture at full height, for free.

**FRAME counter** (s01, s02, s04, s10, s21, s22): label `FRAME` in `600 22px var(--mono)` `--fog`; digits in
`700 var(--display)` `--lime`, tabular, zero-padded to 5 digits; value is always computed live:
`Math.round((ctx.start + t) * 30)`. Final totals use the `{{FRAMES}}` placeholder (filled by `E.fill()`).

## 2 · Scene map

| # | id | start | dur | ch | theme | in-transition | energy | idea |
|-|-|-|-|-|-|-|-|-|
| 1 | s01_cold | 0.00 | 10.00 | 00 | dark, chrome off | (first) | 3 | hook montage + claim |
| 2 | s02_title | 10.00 | 8.00 | 00 | dark | cut (same frame) | 3 | X-ray this frame → title |
| 3 | s03_text | 18.00 | 9.50 | 01 | dark | wipe 0.6 | 1 | Opus outputs text → browser → FFmpeg |
| 4 | s04_render | 27.50 | 14.00 | 01 | dark | zoom 0.7 | 1 | render(t), own code, 900 frames |
| 5 | s05_atlas | 41.50 | 10.50 | 02 | dark | wipe 0.6 | 2 | 1,704 cases, 8 picks |
| 6 | s06_case1 | 52.00 | 9.50 | 02 | dark | zoom 0.6 | 2 | lists-006 · one shape |
| 7 | s07_case2 | 61.50 | 9.50 | 02 | dark | push 0.7 | 2 | gosail-060 · warm only at climax |
| 8 | s08_case3 | 71.00 | 10.50 | 02 | dark | push 0.7 | 2 | uc-0962 · layers |
| 9 | s09_case4 | 81.50 | 10.50 | 02 | dark | push 0.7 | 2 | uc-1377 · real data |
| 10 | s10_proof | 92.00 | 13.50 | 02 | dark | zoom 0.7 | 2 | **this film's timeline** |
| 11 | s11_case5 | 105.50 | 10.50 | 02 | dark | push 0.7 | 2 | gosail-072 · real UI |
| 12 | s12_case6 | 116.00 | 11.00 | 02 | dark | push 0.7 | 2 | gosail-054 · fixed asset |
| 13 | s13_case7 | 127.00 | 11.00 | 02 | dark | push 0.7 | 2 | uc-2348 · motion drives effects |
| 14 | s14_case8 | 138.00 | 11.50 | 02 | dark | push 0.7 | 2 | gosail-133 · model division |
| 15 | s15_formula | 149.50 | 9.00 | 02 | dark | iris 0.8 | 1 | why it looks good, as a formula |
| 16 | s16_env | 158.50 | 11.00 | 03 | light | wipe 0.6 | 1 | environment + install |
| 17 | s17_routes | 169.50 | 14.00 | 03 | light | wipe-up 0.6 | 1 | four routes, real commands |
| 18 | s18_workflow | 183.50 | 11.00 | 03 | light | wipe-up 0.6 | 1 | the loop, with our real files |
| 19 | s19_feedback | 194.50 | 11.00 | 03 | light | zoom 0.6 | 1 | time + problem + expectation |
| 20 | s20_prompt | 205.50 | 10.50 | 03 | light | wipe-up 0.6 | 1 | prompt template, first 15–30 s |
| 21 | s21_reveal | 216.00 | 11.50 | 04 | dark | wipe 0.6 | 0 | how this film was made (honest) |
| 22 | s22_end | 227.50 | 8.50 | 04 | dark, chrome off | iris 0.8 | 3 | CTA end card |

Chapters (engine tag top-left): 00 开场 · 01 原理 · 02 为什么炫 · 03 小白上手 · 04 幕后. Chapter starts that fall on
bar lines (18.0, 216.0) get the music riser and impact exactly on the downbeat. 41.5 and 158.5 land on beats.

## 3 · Rules for every scene in this draft

- **Safe areas:** content box x 112–1808, y 140–880. Nothing readable in y < 112 or y > 900 while chrome or subtitles
  are visible. The only deliberate exception is s02, where thin outlines (not text) are drawn *around* the engine's
  own chrome to label it; their text labels sit inside the content box with leader lines.
- **Determinism:** nothing reads state from a previous frame, including the engine's subtitle DOM. Anything that shows
  "the current subtitle" computes it from `window.TIMELINE.lines[].subs` for the current time.
- **Shared drawing functions** (write once, e.g. at the top of s04 and reuse by copy or a small lib file):
  - `miniSample(g, t, w, h)`: canvas. Background #121011, grid every w/40 at 4.5 % white, one lime (#C9DF8D) rounded
    square (side 0.14 h, radius 0.3 × side, vertically centred) at
    `x = (160 + 400 * clamp(t, 0, 4)) / 1920 * w`. This is exactly the code Claude "writes" in s03
    (`square.x = 160 + 400 * t`). It is drawn in s04 (preview, thumbnails, film strip), s18 (card ④) and s19 (base
    of the contact-sheet sample). Same function everywhere: determinism shown, not told.
  - `sampleShot(g, t, w, h, fixed)` for s19: `miniSample(g, t % 4, w, h)` plus a title 「我的第一支片子」
    (900 weight, 0.09 h) and a dark subtitle bar (rgba(12,10,11,.72), y 0.82–0.94 h, a grey 「字幕」 placeholder bar
    inside). Title y = 0.60 h, but when `!fixed` it slides to 0.86 h during t 7.6–8.0 and stays there until 9.6
    (hidden under the subtitle bar: the staged bug). `fixed` keeps it at 0.60 h.
- **Credits:** every frame of case footage carries the author handle (kit `k-credit` chip: handle + small lime
  「原作片段」). Wall posters carry a footnote; the 8 highlighted posters carry their handles when they line up.
- **Placeholders:** only `{{FRAMES}}`, `{{CODE_LINES}}`, `{{RENDER_MIN}}`, `{{SCENES}}`, on screen only, via `E.fill()`.
  Never in the voice.
- **SFX defaults:** the engine adds a whoosh (gain 0.5) at every non-cut transition; the music adds a riser + impact
  at chapter starts. Scene SFX below are in addition to those.
- **Colour:** lime is the one accent on dark; warm orange #F2B880 only for numbers inside code; lilac/purple for
  secondary chips. On light: ink text, green accents, lime only as a marker fill behind ink.

---

## s01_cold — Hook: four code-rendered works on beat cuts, plus the claim   (≈ 10.0 s · dark · first scene · energy 3)

- **Voice:**
  - s01_cold.1 (0.30–3.15) 这些炫酷的视频，没有一帧是拍出来的。
  - s01_cold.2 (3.40–5.24) 也不是 AI 一键生成的。
  - s01_cold.3 (5.54–9.27) 它们是 Opus 5.5 写的代码，一帧一帧算出来的。
- **On screen:**
  - HUD (mono). It sits inside the content box, not in the empty top band, so it never collides with the chapter tag
    and logo that switch on at s02's first frame: PLAYHEAD pill `t = 0.00 s` … `t = 9.97 s` riding a ruler; right end
    `FRAME 00000` … `FRAME 00299`.
  - Credit chip per clip: `@morpheusdv` / `@kimmonismus` / `@WinterArc2125` / `@twoclipping`, each with small 「原作片段」.
  - Second chip, same row, fog text on dark glass: 「作者自述：画面由代码渲染」 (visible 0.2–9.6 s).
  - No titles. The subtitles carry the words.
- **Visual:**
  - Full-bleed footage (1920×1080, object-fit cover; the clips are 1280×720 → ×1.5). Each clip pushes in slowly
    (scale 1.00 → 1.04 over its 2 s, centred), so nothing is static.
  - HUD ruler: hairline `rgba(244,241,242,.28)` from x 112 to x 1640 at y 160; beat ticks every 0.5 s (152.8 px per
    second), 8 px tall; bar ticks every 2 s 14 px tall with labels `0s 2s 4s 6s 8s` in `14px mono` at 60 % fog. The
    pill rides it (x = 112 + 152.8 · t). `FRAME` counter right-aligned at x 1808, vertically centred on y 160.
    A soft dark gradient (top 0 → 260 px, rgba(18,16,17,.55) → 0) keeps the HUD readable over bright paper frames.
  - Credit + 「作者自述」 chips: left 112, top 822, height 40, gap 12. They swap on each cut (fade 0.15 s).
  - At each cut the bar tick under the playhead flashes lime for 0.2 s (no full-frame flashes).
- **Sync:**
  - Hook timing: the first frame is already moving footage, the amber ring sweeps at ≈ 0.4 s, and the claim
    「没有一帧是拍出来的」 is complete at 3.15 s.
  - Cuts land exactly on bar lines 2.0 / 4.0 / 6.0 (use `ctx.beatTime(4)`, `(8)`, `(12)`).
  - 「一键」 (s01_cold.2 @4.50): the cut to the sun has already happened; hold.
  - 「代码」 (s01_cold.3 @7.44): the lists-006 palette row 「Every frame is code」 gets selected right then
    (source 11.3–11.4 s = scene 7.4–7.5 s). It is in the footage, so it is free sync.
  - 「一帧一帧」 (s01_cold.3 @8.11–8.53): toast 「✓ Every frame is code」 appears (source 12.05 → scene 8.15).
  - 「算」 (@8.72): toast fully settled; clip ends at 8.57 and **holds its last frame** to 10.0.
- **Footage:** full-bleed, sequential, original audio never used.
  - 0.00–2.00 `h-060-light` from clip-local 0.30 (source 48.9 s). The amber ring sweeps at about 0.4 s, ink recedes
    0.6–1.0 s, the new world with trees, daisies and sun from 1.1 s. Credit @morpheusdv.
  - 2.00–4.00 `h-0962-web` from 0 (source 17.2–19.2): words fly into a ring, gold attention lines weave. Credit @kimmonismus.
  - 4.00–6.00 `h-1377-sun` from 0 (source 175.0–177.0, letterbox cropped to 16:9): sun breaks the fog over the column.
    Credit @WinterArc2125.
  - 6.00–10.00 `h-006-code` from 0 (source 9.9–12.47, 16:9 centre crop): ⌘K palette → types 「frame」 → selects
    「Every frame is code」 → toast; last frame held. Credit @twoclipping.
- **SFX:** boom 0.02 (0.45) · shutter at 2.0, 4.0, 6.0 (0.35) · type 6.55 (0.22, the typing in the palette) ·
  pop 7.62 (0.3, enter) · sparkle 8.15 (0.45, toast).
- **Continuity:** the held toast frame, the HUD ruler, the pill and the FRAME counter all continue unchanged into s02's
  first frame. s02 is a hidden cut on the 10.0 s bar line.

## s02_title — Meta turn: X-ray the frame you are watching, then the title   (≈ 8.0 s · dark · cut on the bar · energy 3)

- **Voice:**
  - s02_title.1 (0.25–1.72) 包括你现在看到的这一帧。
  - s02_title.2 (2.17–5.05) 这一期，就让这支视频自己拆给你看。
  - 5.05–8.00 music only (title hold).
- **On screen:**
  - X-ray labels, `600 18px var(--mono)`, lime text on ink tabs (radius 6, padding 4 10):
    - 「<img> media/h-006-code/f00078.jpg」 and second row 「原作片段 · @twoclipping」. Use the real filename from
      `ctx.clipUrl('h-006-code', lastFrameTime)` (the last extracted frame).
    - 「字幕层：按语音时间戳出现」
    - 「章节标签」
    - 「Logo · SVG」
    - 「进度条：t ÷ 总时长」
  - Hero counter: tag `FRAME`, digits live (≈ `00337` at 1.25 s), under it `t = 11.24 s` (`28px mono` snow).
  - Title block (from 4.0 s):
    - tag (K.tag): `WAYTOAGI · 2026.10`
    - hero (K.title, 150 px / 900, one line): 「每一帧，都是代码」, with 「代码」 in lime
    - H3 (44 px / 700, fog): 「Opus 5.5 炫酷视频的秘密 + 小白上手指南」
    - small counter top-right of the content box (x 1808 right-aligned, y 150): `FRAME 00452` (live, 24 px).
- **Visual:**
  - 0.00: pixel-identical to s01's last frame. The chrome is now on: chapter tag 「00 开场」 top-left, logo top-right,
    progress bar at the bottom. All three are engine-drawn and become X-ray subjects.
  - 0.25–1.45 **unzip**: at the pill's x (1640) the playhead line extends to full height (0.25–0.40), then splits into
    two scanner lines that move apart, one to x 0 and one to x 1920, both arriving at 1.45 (ease inOutCubic). Between
    the lines the frame turns into "code view": footage at 25 % brightness, a 48 px lime grid at 8 % opacity, 2 px lime
    outline boxes (radius 6) around:
    - the toast (≈ x 560–1360, y 470–610) → label at its top-left corner;
    - the subtitle box, computed from `window.TIMELINE` for the current time (text width measured with a hidden span in
      the subtitle font 600 44px NSC + 30 px padding each side; box centred, bottom 52 px) → label at x 1180, y 846 with
      a 1.5 px leader down to the box;
    - the chapter tag (≈ x 56–250, y 40–84) → label at x 112, y 196 with a leader up;
    - the logo (x 1740–1864, y 40–80) → label right-aligned at x 1808, y 196 with a leader up;
    - the progress bar (y 1074–1080) → label at x 112, y 846 with a leader down.
    Each outline draws itself (K.drawPath, 0.3 s) and its label pops (K.pop) when a scanner line passes its x.
  - 1.20–1.43 (lands on 「帧」 @1.43): the small HUD FRAME counter flies from (1808, 160) to centre (960, 300) and grows into the hero
    counter (digits 140 px). It keeps counting live. The HUD ruler fades out.
  - 2.17–2.80 (「这一期」, 「期」 @2.49): retract. Labels fade, outlines shrink into the scanner lines, the two lines
    glide back together to x 960, footage dims to black over 0.6 s (background `--night` with the 48 px grid).
  - 3.62 「视频」: the single line rotates 90° around its centre (3.60–4.00, outQuint) into a horizontal lime bar
    720 px wide at y 640 (centre x 960). It is the title underline.
  - 4.00 (= bar line 14.0 s, `ctx.beatTime(8)`): the hero title rises per character (stagger 35 ms, outQuint 0.7 s),
    centred, baseline ≈ y 560. The tag sits at y 400. The H3 rises at 5.05, centred at y 700. The hero counter shrinks
    to the top-right of the content box (4.0–4.6).
  - 5.05–8.00 hold: whole title block drifts 1.00 → 1.02 scale; underline gets a slow lime glow pulse on each bar.
- **Sync:** 「包括」 @0.25 → unzip starts; 「帧」 @1.43 → hero counter lands; 「期」 @2.49 → retract; 「视频」 @3.62 → line
  rotates; bar 4.0 → title (「自己」 @4.23 is mid-rise); line end 5.05 → H3.
- **Footage:** `h-006-code`, last frame only, full-bleed, credit chip 「@twoclipping · 原作片段」 stays visible until the
  image has faded (2.8 s).
- **SFX:** glitch 0.25 (0.3) · tick at each label pop (5 × 0.22) · blip 1.43 (0.4) · swish 2.20 (0.3) ·
  rise_short 3.45 (0.35) · impact 4.00 (0.6).
- **Continuity:** in from s01 on the same frame. Out: the lime underline is the last bright element when the lime
  chapter wipe bar crosses into s03, so it reads as one bar replacing another.

## s03_text — Mechanism 1: Opus outputs text; the browser computes frames; FFmpeg encodes   (≈ 9.5 s · dark · wipe · energy 1)

- **Voice:**
  - s03_text.1 (0.45–4.66) Opus 5.5 不会直接画画，它只输出文字，比如代码。
  - s03_text.2 (4.91–9.03) 浏览器照着代码算出每一帧，FFmpeg 再编成视频。
- **On screen:**
  - Chat window (K.chat, title 「Claude Code · Opus 5.5」):
    - YOU: 「做一支 4 秒的小片：一个绿色圆角方块，从左滑到右。」
    - CLAUDE: 「好的，我用代码来画：」 then a second line in mono lime `square.x = 160 + 400 * t`
  - Model card (K.windowFrame-like card): tag 「ANTHROPIC 模型页」 · H3 「Claude Opus 5.5」 · two rows
    「输入　文本、图片」 / 「输出　文本」 · stamp (lilac outline, rotated −4°) 「没有视频输出」 · footnote
    (18 px mono fog) 「来源：Anthropic 模型概览，2026-10-01 核对」
  - Flow nodes (K.flow): 「代码」 sub 「Opus 写的文字」 · 「浏览器」 sub 「按时间逐帧算」 · 「FFmpeg」 sub 「把帧编成视频」 ·
    「视频」 sub 「out.mp4」 · edge labels `render(t)` and `f00001.jpg …`
  - Chip (lilac) next to the flow, top-right of it: 「本片同款流程」
- **Visual:**
  - Chat at (112, 168), 788 × 420. Model card at (980, 168), 828 × 300.
  - Flow band y 640–860: nodes centred at y 760: 「代码」 x 300 (w 300, h 130), 「浏览器」 x 760, 「FFmpeg」 x 1220,
    「视频」 x 1640 (w 260). Chip 「本片同款流程」 at (1520, 600).
  - Frame stream (custom, on top of K.flow): on edge 「浏览器 → FFmpeg」, a stream of mini frames (64 × 36, radius 6,
    each drawn with `miniSample(g, k/30)` for k = 1, 2, 3 …) leaves the browser node every 0.25 s from 6.0 s and
    slides into FFmpeg, labelled `f00001` `f00002` … in 12 px mono. This is the "every frame" made literal.
  - Camera: whole scene drifts left 20 px over 9.5 s.
- **Sync:**
  - 「Opus」 @0.45: YOU bubble already in (t 0.30). CLAUDE bubble starts typing at 1.30 (typeDur 2.2).
  - 「画画」 @2.14: the model card slides in (0.5 s, outCubic).
  - 「文字」 @3.45: lime marker sweeps under 「输出　文本」 (0.4 s); stamp 「没有视频输出」 pops at 3.75.
  - 「代码」 @4.27: the code line in the CLAUDE bubble gets a lime outline; a copy flies down into node 「代码」
    (4.30–4.80); node pops at 4.60.
  - 「浏览器」 @4.91: node pops; edge 1 draws at 5.10.
  - 「算出」 @6.02: frame stream starts.
  - 「FFmpeg」 @7.14: node pops; edge 2 draws at 7.30.
  - 「视频」 @8.54: last node pops with a ▶ glyph; the chip 「本片同款流程」 fades in.
- **Footage:** none (all drawn).
- **SFX:** type 0.30 (0.2) · type 1.30 (0.2) · blip 3.45 (0.35) · pop 4.60, 4.91, 7.14 (0.35 each) · tick 6.02 and
  6.52 (0.15) · ding 8.54 (0.4).
- **Continuity:** the lime rounded square requested here is the object rendered in s04. Out: the zoom transition
  scales into s04, so the 「代码」 node visually "opens" into the code panel.

## s04_render — Mechanism 2: render(t), shown with this scene's own source   (≈ 14.0 s · dark · zoom · energy 1)

- **Voice:**
  - s04_render.1 (0.45–3.75) 核心就一句：给一个时间，还你一帧画面。
  - s04_render.2 (3.97–6.19) 左边，就是这一幕自己的代码。
  - s04_render.3 (6.41–8.58) 同一个时间，永远是同一帧。
  - s04_render.4 (8.80–13.52) 30 秒是 900 帧，但模型不用画 900 次，渲染器自己算。
- **On screen:**
  - H2 (mono 64 px): `画面 = render(t)` (「画面 =」 snow in `--cn`, `render` lime, `(t)` snow).
  - Code panel header comment (first line of the block): `// 本幕正在运行的代码 · src/scenes/s04_render.js`
  - Preview window title: 「预览 · 小样」; readouts `t = 2.40 s` (lime 28 px mono) and `FRAME 00072` (fog 20 px).
  - Scrubber labels: `0s 1s 2s 3s 4s`.
  - Thumbs: `t = 2.40 s` under each; 「=」; stamp 「同一帧 ✓」; footnote 「同一时刻、同一状态；换一台机器，像素仍可能有细微差别」.
  - Counter: `900` + 「帧」, body 「30 秒 × 每秒 30 帧」.
  - Two chips: 「Opus 5.5：写好一份代码」 (lilac outline) · 「渲染器：算 900 次」 (lime outline).
- **Visual:**
  - H2 at (112, 150), rises per char at 0.45.
  - Left: K.codeBlock (size 20, width 888) at (112, 250), max 18 lines visible (31 px line height). Its text is
    **this scene's real render function**, read in `build()` with `this.render.toString()` (the engine calls
    `def.build(...)`, so `this` is the definition object). Keep `render()` short so it fits; put helpers in `build()`.
    A highlight bar (888 × 31, fill rgba(201,223,141,.16), 4 px lime left border) sits on the "current line":
    phase 1–2 it sits on the line that sets the square's x; in phase 3 it advances one line per video frame
    (`Math.floor(t * 30) % nLines`), a program counter running once per frame.
  - Right top: preview window (K.windowFrame 748 × 380) at (1060, 250) containing a canvas drawn by
    `miniSample(g, tPrev, 700, 300)` and the readouts in its top-right corner.
  - Right middle: scrubber 748 px wide at y 650–700 (0–4 s ruler, PLAYHEAD pill shows `tPrev`).
  - Right bottom: thumbnails row y 720–855: thumb A at x 1060, 「=」 at x 1316, thumb B at x 1380 (each 240 × 135,
    drawn with the same `miniSample(g, 2.40, …)`); stamp at x 1640; footnote under, 16 px mono fog, y 862.
    (Footnote ends at y ≈ 880.)
  - Phase 3 (from 8.80): the preview window, scrubber and thumbs slide up and fade (8.80–9.20). A K.filmStrip
    (n 9, fw 160, fh 90) slides in at (1060, 300), scrolling fast (`offset = (t − 8.8) * 60` frames per second),
    each cell drawn by `miniSample(g, idx/30, …)` with labels `#0001` …. K.counter (180 px lime) at (1060, 470)
    with 「帧」 (H2 snow) to its right, body line under it. Chips row at y 700.
- **Sync:**
  - 「核心」 @0.45 → H2 rises. 「时间」 @1.98 → the scrubber pill pulses (scale 1.15 spring). 「画面」 @3.39 → the
    preview square flashes outline.
  - 「左边」 @3.97 → the code types in (codeBlock.render(p), 3.97–5.60). 「代码」 @5.79 → header comment gets a lime
    marker.
  - Phase 1 (0.45–6.41): `tPrev = (t − 0.45) % 4` (the sample plays and loops).
  - 「一个」 @6.62 → playhead jumps to 2.40, thumb A drops in. Scrub away to 3.60 (6.9–7.3) and back. 「永远」 @7.59 →
    playhead back at 2.40, thumb B drops in. 「同」 @8.07 → 「=」 appears. 「帧」 @8.37 → stamp 「同一帧 ✓」 + both thumbs
    get lime outlines.
  - Counter 0 → 900 from 8.80 to **「900」 @9.54** (ease outCubic, lands exactly on the word).
  - 「模型」 @10.63 → chips appear. Second 「900」 (`ctx.word('s04_render.4','900',1)`, token 「900 次」 @11.64) → the
    second chip's number pops. 「渲染器」 @12.51 → first chip dims to 50 %, second glows.
- **Footage:** none.
- **SFX:** type 3.97 (0.25) · tick 6.62 and 7.59 (0.3) · ding 8.37 (0.4) · rise_short 8.90 (0.3) · pop 9.54 (0.5) ·
  blip 11.64 (0.35).
- **Continuity:** the square from s03; the PLAYHEAD as scrubber; the film strip previews s19's contact sheet (same
  drawing function). Out: chapter wipe.

## s05_atlas — Turn to "why it looks good": the library, then the 8 picks   (≈ 10.5 s · dark · wipe · energy 2)

- **Voice:**
  - s05_atlas.1 (0.45–2.63) 原理不难，难的是好看。
  - s05_atlas.2 (2.85–7.45) 截至 10 月 1 日，WaytoAGI 收录了 1704 条视频案例。
  - s05_atlas.3 (7.67–9.77) 我们挑了 8 个，每个教你一招。
- **On screen:**
  - H2 (60 px / 800): 「原理不难，难的是好看」 (「好看」 in lime).
  - Counter card: K.counter `1,704` (180 px lime) + H3 「条视频案例」 + body (30 px fog)
    「截至 10 月 1 日 · WaytoAGI 收录 · 全库 5,181 条」.
  - Number badges 1–8 (lime circles, ink digits) on the featured posters; handles under them once lined up:
    `@twoclipping` `@morpheusdv` `@kimmonismus` `@WinterArc2125` `@aiwarts` `@yoshifujidesign` `@aicreataro` `@KanaWorks_AI`.
  - Footnote (18 px mono fog) at (112, 852): 「海报来自 WaytoAGI 案例库，版权归各作者；视频类也含其他工具制作的作品」
- **Visual:**
  - H2 at (112, 150).
  - K.wall 10 × 6 (tw 160, th 90, gap 10 → 1690 × 590) at (115, 230), ids in `assets/wall/manifest.json` order (curated
    layout). Tiles pop from 2.85 with spread 1.4 s, then sit at 55 % opacity behind the counter card.
  - Counter card (night-2 at 90 %, radius 28, 900 × 300) centred at (960, 525).
  - Featured posters in the grid (row, col): lists-006 (0,0), uc-0962 (0,4), gosail-054 (1,4), uc-2348 (1,6),
    gosail-133 (2,2), gosail-060 (2,7), uc-1377 (4,2), gosail-072 (5,3).
  - 7.67 「我们」: counter card fades out (0.3 s); 52 other posters dim to 18 %.
  - 8.15 「8 个」: the 8 posters get a 3 px lime outline, scale 1.08 (spring) and badges numbered in case order
    (1 lists-006 · 2 gosail-060 · 3 uc-0962 · 4 uc-1377 · 5 gosail-072 · 6 gosail-054 · 7 uc-2348 · 8 gosail-133).
  - 8.86 「每个」: the 8 posters fly (spring, stagger 0.05) into one row centred at y 720 (x 236 → 1684, gap 24) with
    their handles under them (14 px mono fog).
  - 9.50 「招」 → end: the row shrinks into the 8 series dots of the case template (14 px pills, gap 12) centred at
    (632, 859), dot 1 lime and 30 px wide. That is where s06's card puts its dots.
- **Sync:** 「原理」 @0.45 H2 · 「截至」 @2.85 wall + counter start · **「1704」 @5.76 counter lands** · 「8 个」 @8.15
  highlight · 「每个」 @8.86 fly to row · 「招」 @9.50 collapse to dots.
- **Footage:** posters only (static thumbnails), with the footnote and handles above.
- **SFX:** sparkle 2.85 (0.3) · rise_short 4.80 (0.3) · pop 5.76 (0.5) · pop 8.15 (0.35) · swish 8.86 (0.35) ·
  tick 9.50 (0.25).
- **Continuity:** 8 posters → 8 dots → the case carousel's dots (s06–s14).

## s06_case1 — Case 1 · lists-006: one shape carries the film   (≈ 9.5 s · dark · zoom · energy 2)

- **Voice:**
  - s06_case1.1 (0.45–2.73) 第一招，一个形状贯穿全片。
  - s06_case1.2 (2.93–6.26) 按钮、播放器、图表，都是它变的。
  - s06_case1.3 (6.46–8.76) 先定这个对象，再排它的状态。
- **On screen (case template data):** CASE 01 / 08 · work 「无缝 UI 形变」 · `@twoclipping` · chip 「路线：代码生成与渲染」 ·
  炫在哪里 「一个形状贯穿全片」 · points 「按钮、播放器、图表，都是它在变形」 / 「约 120 BPM，14 秒正好 7 小节」 ·
  可以照搬 「先定贯穿对象和状态，再排上节拍」 · caveat 「“0 After Effects”为作者自述」.
- **Visual:** template, aspect 1:1 (620 × 620 card). Facts on the card are our measurements (120 BPM, 14 s = 7 bars,
  no hard cuts); the "0 AE" claim is labelled.
- **Sync (cues):** secret → s06_case1.1 (0.45) · point 1 → s06_case1.2 (2.93) · point 2 → 「图表」 (4.66) ·
  takeaway → s06_case1.3 (6.46) · caveat 6.96.
- **Footage:** `c1-006-morph` (source 0.0–9.6, one continuous take, no cut): button click 0.25 → loader 0.75 → check
  1.0 → island 1.25 → player 1.75–2.6 → slider 3.7 → overshoot stretch 4.8–5.2 → switch 5.3–6.2 → liquid tabs
  6.3–7.2 → chart 7.25–9.5. Plays from t 0, last frame held. Credit 「@twoclipping · 原作片段」.
- **SFX:** template defaults (swish 0.05, pop at the first line, blip at the takeaway line) + transition whoosh.
- **Continuity:** dots from s05. The voice does not say it, but this is the rule our PLAYHEAD follows; s10 makes that
  explicit.

## s07_case2 — Case 2 · gosail-060: the warm colour is saved for the climax   (≈ 9.5 s · dark · push · energy 2)

- **Voice:**
  - s07_case2.1 (0.45–2.55) 第二招，暖色只留给高潮。
  - s07_case2.2 (2.75–6.12) 其余时间只有纸和墨，东西都是一笔笔长出来的。
  - s07_case2.3 (6.32–8.70) 把好看拆成几条能检查的规则。
- **On screen:** CASE 02 / 08 · 「《最初的火花》」 (the piece is titled 《The First Spark》) · `@morpheusdv` ·
  「路线：代码生成与渲染」 · 炫在哪里 「暖色只留给高潮」 · 「只有纸色和墨色，东西都是长出来的」 /
  「60 秒中，暖色只出现约 9 秒」 · 可以照搬 「把风格拆成能检查的规则，先做通第一场」 · caveat 「“完全 JavaScript”为作者自述」.
- **Visual:** template, 16:9.
- **Sync (cues):** secret 0.45 · point 1 2.75 · point 2 「出来」 5.73 · takeaway 6.32.
- **Footage:**
  - `c2-060-light` with `from: 0.6, dur: 4.1` in the data (source 46.9–51.0, plays 0–4.1 s; `dur` makes the template
    hand over to the next clip at 4.1 instead of freezing): the amber dot grows, then **the ring sweeps
    at ≈ 2.35 s, right after 「高潮」 (2.07)**, then ink recedes and the new world grows.
  - `c2-060-tree` (source 19.9–24.4, plays 4.1–8.6 s): the character draws an arc in the air; the trunk grows at
    ≈ 6.2–6.7 s, while the voice says 「一笔笔长出来的」. Last frame holds.
  - Credit 「@morpheusdv · 原作片段」. The source has no audio track.
- **SFX:** template defaults + whoosh.
- **Continuity:** carousel push; dot 2 lit.

## s08_case3 — Case 3 · uc-0962: picture and sound made as separate layers   (≈ 10.5 s · dark · push · energy 2)

- **Voice:**
  - s08_case3.1 (0.45–2.74) 第三招，画面和声音分层做。
  - s08_case3.2 (2.94–6.66) 一个发光的单词当主角，串起整段 AI 历史。
  - s08_case3.3 (6.86–9.94) 每层单独改，再沿同一条时间轴合成。
- **On screen:** CASE 03 / 08 · 「AI 历史短片」 · `@kimmonismus` · 「路线：代码生成与渲染」 · 炫在哪里 「画面和声音分层做」 ·
  「一个发光的单词“the”串起九段」 / 「先写分镜文件，每场渲几张静帧自查」 · 可以照搬 「每一层单独改，再沿同一条时间轴合成」 ·
  caveat 「工具栈与耗时为作者自述」.
- **Visual:** template, 16:9.
- **Sync (cues):** secret 0.45 · point 1 2.94 · point 2 「历史」 6.30 · takeaway 6.86.
- **Footage:**
  - `c3-0962-web` (source 13.5–21.0, plays 0–7.5): 「the」 ignites ≈ 0.5 s, the sentence relights 3.0, words fly into
    a ring 3.5–4.0, the attention web weaves 4.5–7.0, during 「一个发光的单词当主角」.
  - `c3-0962-sphere` (source 45.8–49.3, plays 7.5–11.0): the network bursts into particles (≈ 8.2) and gathers into the
    sphere, during 「再沿同一条时间轴合成」.
  - Credit 「@kimmonismus · 原作片段」.
- **SFX:** template defaults + whoosh.
- **Continuity:** this layer idea is exactly what s10 shows of our own film.

## s09_case4 — Case 4 · uc-1377: real data constrains the picture   (≈ 10.5 s · dark · push · energy 2)

- **Voice:**
  - s09_case4.1 (0.45–3.10) 第四招，用真实数据约束画面。
  - s09_case4.2 (3.30–7.69) 山丘取自高程数据；旁白先生成，再按时长排镜头。
  - s09_case4.3 (7.89–9.65) 提示里只写导演意图。
- **On screen:** CASE 04 / 08 · 「奥斯特里茨战役」 · `@WinterArc2125` · 「路线：代码生成与渲染」 · 炫在哪里 「用真实数据约束画面」 ·
  「山丘取自高程数据，地图讲清移动」 / 「先生成旁白，再按每段时长排镜头」 · 可以照搬 「提示只写导演意图和不想要的效果」 ·
  caveat 「作者自述：构建90分钟、渲染4小时、40美元」.
- **Visual:** template, 16:9.
- **Sync (cues):** secret 0.45 · point 1 3.30 · point 2 「旁白」 5.23 · takeaway 7.89.
- **Footage:**
  - `c4-1377-sun` (source 171.0–176.0, letterbox cropped 1456 × 819 → 16:9, plays 0–5.0): sun brightening behind the
    ridge as the column advances, during the secret and 「山丘取自高程数据」.
  - `c4-1377-pond` (source 236.0–241.5, same crop, plays 5.0–10.5): blue and red arrows on the relief map during
    「旁白先生成，再按时长排镜头」, then dissolve (≈ 7.75–8.25) to the frozen-pond sunset during 「提示里只写导演意图」.
  - Credit 「@WinterArc2125 · 原作片段」. Avoid 209.5–215 (pixelated close combat); not used.
- **SFX:** template defaults + whoosh.
- **Continuity:** 「旁白先生成」 sets up s10's first proof (our film does the same). Out: zoom.

## s10_proof — Signature 3: this film's own timeline proves the four moves   (≈ 13.5 s · dark · zoom · energy 2)

- **Voice:**
  - s10_proof.1 (0.45–2.12) 这四招，本片也在用。
  - s10_proof.2 (2.34–6.05) 先合成旁白，量出每句多长，再排镜头。
  - s10_proof.3 (6.27–10.51) 字幕跟着语音的时间戳走，配乐是 Python 写的，每拍半秒。
  - s10_proof.4 (10.73–12.56) 全都挂在同一条时间轴上。
- **On screen:**
  - tag 「本片对照」 · H2 (60 px / 800) 「这四招，本片也在用」.
  - Four chips (lilac outline, 24 px), each swapping its text at 「本片」:
    「一个形状贯穿全片」 → 「贯穿对象：时间指针 t」 · 「暖色只留给高潮」 → 「强调色只有一种：亮绿」 ·
    「画面和声音分层做」 → 「分层：画面 · 旁白 · 字幕 · 音乐」 · 「用真实数据约束画面」 → 「数据约束：语音时长决定镜头」.
  - Lane labels (20 px mono fog): 「画面 SCENES」 「旁白 VOICE」 「字幕 SUBS」 「音乐 MUSIC」 「音效 SFX」.
  - Playhead pill: 「本片 01:32.45 · 第 02773 帧」 (live; mm:ss.ss from `ctx.start + t`).
  - Phase 2 label (26 px fog): 「镜头时长 = 旁白时长 + 留白，再对齐节拍」.
  - Phase 3: karaoke line (52 px / 700) 「字幕跟着语音的时间戳走」; word stamps `字幕 6.27` `跟着 6.68` `语音 6.88`
    `时间 7.16` `戳走 7.45` (local seconds, from `ctx.lines`, so they are the real numbers); bracket label
    「↓ 下面这行字幕，就按这些时间戳出现」.
  - Phase 4 code chip (K.codeBlock, size 20), a faithful excerpt of `tools/music.py` (comments translated):
    ```
    CHORDS = [  # 每小节一个和弦
        (41, [57, 60, 64, 67], [69, 72, 76, 79]),   # Fmaj9
        (43, [59, 62, 64, 67], [71, 74, 76, 79]),   # G6
        (45, [60, 64, 67, 71], [72, 76, 79, 83]),   # Am9
        (40, [59, 62, 64, 67], [71, 74, 76, 79]),   # Em7
    ]
    beat = 60 / bpm   # 120 BPM：每拍 0.5 秒
    ```
    plus 「120 BPM · 每拍 0.5 秒」 and a bracket 「0.5 秒」 between two beat cells.
  - Phase 5: 「同一个 t」 (H3 lime) next to the playhead.
- **Visual:**
  - Header at (112, 150); chips row at y 226 (four chips, 400 px slots).
  - Timeline panel (night-2, radius 24) x 112–1808, y 290–870. Five lanes, each 96 px with 12 px gaps, labels at
    x 140. Track area x 330–1780 = the whole film (236 s → 6.14 px per second). **All data is real**, read in build()
    from `window.TIMELINE`:
    - SCENES: one block per scene (start/dur), 2 px gaps, fill by chapter (c0 lilac 35 %, c1 purple 35 %, c2 lime 22 %,
      c3 green 40 %, c4 fog 25 %), ids in 13 px mono where the block is ≥ 60 px wide. Blocks s06–s09 outlined lime in
      phase 1.
    - VOICE: one lane-height block per line (start/end); inside it each TTS word is a 3 px bar at its start time,
      height ∝ word duration (20–60 px). This is word-timing data, not a fake waveform.
    - SUBS: subtitle chunks from `lines[].subs` as rounded rects (lilac 30 %).
    - MUSIC: one cell per 2 s bar, fill height by energy 0–3 (rule as in music.py: the bar belongs to the scene covering
      most of it), chord names Fmaj9 G6 Am9 Em7 cycling in 12 px mono when zoomed in.
    - SFX: small diamonds at the times returned by `window.__events()` (call once on first render and cache; the result
      is deterministic).
    - PLAYHEAD across all lanes at `x = 330 + (ctx.start + t) * 6.14` (≈ x 895 at the start of the scene); it moves
      about 6 px per second, so it visibly travels.
  - Camera (transform on the panel content, scaling about the playhead x):
    - Phase 1 (0.45–2.3): full-film view.
    - Phase 2 (2.34–6.05): VOICE lane brightens. Re-run of the layout as an animation: the voice blocks of s08–s12 redraw
      left to right (2.4–3.7), then the SCENES blocks slide from equal-width placeholders to their real boundaries at
      「量出」 (3.75–4.60), snapping like magnets. Label appears at 「镜头」 (5.67).
    - Phase 3 (6.27–8.0): zoom ×12 around the playhead (6.27–6.90, inOutCubic); lanes show only ±6 s. The current
      line's word bars get their word + time labels; the karaoke copy at y 320 lights each word lime at its real start
      time. A lime bracket with the label points down; its leader ends at y 880 (does not enter the subtitle band).
    - Phase 4 (8.02–10.51): MUSIC lane expands (others compress to 40 px). Code chip at the right of the panel
      (x 1180–1780, y 330–560). Beat grid under it: 16 cells (26 px, gap 8) = 4 bars; the cell of the current beat
      (`ctx.beatTime(n)`, beats at 8.0, 8.5, 9.0 …) lights lime in sync with the audible kick (energy 2 has a kick on
      every beat).
    - Phase 5 (10.73–12.56): zoom back out to the full film (10.73–11.60); the playhead line glows across all five lanes.
- **Sync:** 「这四招」 0.45 chips pop · 「本片」 @1.42 chips swap text · 「旁白」 @2.93 voice lane lights · 「量出」 @3.75
  blocks snap · 「镜头」 @5.67 label · 「字幕」 @6.27 zoom in · 「时间」 @7.16 the word stamps glow · 「配乐」 @8.02
  music lane expands · 「Python」 @8.70 code chip types in · 「半」 @10.12 0.5-second bracket · 「全都」 @10.73 zoom out ·
  「时间」 @11.82 「同一个 t」.
- **Footage:** none. This scene is built entirely from the film's own data.
- **SFX:** pop × 4 at 0.45–0.82 (0.2) · swish 1.42 (0.3) · tick 3.75 (0.3) · whoosh 6.27 (0.25) · type 8.70 (0.2) ·
  pop 10.12 (0.35) · whoosh 10.73 (0.25) · ding 11.82 (0.35). The kick itself comes from the music.
- **Continuity:** in by zoom: the panel starts zoomed on the s09 block, so the case card seems to shrink into its own
  block on the timeline. Out by push to case 5. The VOICE word bars return in s21.

## s11_case5 — Case 5 · gosail-072: every selling point backed by a real interface   (≈ 10.5 s · dark · push · energy 2)

- **Voice:**
  - s11_case5.1 (0.45–3.75) 后四招，还用了真实素材或别的模型。
  - s11_case5.2 (3.95–6.95) 第五招，每个卖点都有真实界面作证。
  - s11_case5.3 (7.15–9.60) 镜头顺序，就是用户的使用路径。
- **On screen:** CASE 05 / 08 · 「双比例产品片」 · `@aiwarts` · 「路线：已有素材的编辑与合成」 · 炫在哪里 「卖点都有真实界面作证」 ·
  「先读网站代码，再看线上页面」 / 「竖版重新排版，不是直接裁切」 · 可以照搬 「把用户怎么用产品，写成镜头的顺序」 ·
  caveat 「站内作品属他人；“一次直出”为自述」.
- **Visual:** template, 16:9. Line 1 is the honesty bridge for the second half: from here on the footage contains real
  material or other models.
- **Sync (cues):** secret → s11_case5.2 (3.95) · point 1 → 「卖点」 (5.20) · point 2 → 「界面」 (6.32) · takeaway →
  s11_case5.3 (7.15) · caveat 7.65.
- **Footage:** chosen so that the site's interface dominates and no third-party work is shown full-screen. **2.0–3.3,
  15.5–19.5 and 6.95–11.45 of the source are deliberately not used** (@Just_sharon7's Seedance piece full-screen and
  the montage of other people's works).
  - `c5-072-result` (source 14.45–15.45, plays 0–1.0): page 「从作品结果，回到作者与方法。」, result count 1318 → 1.
  - `c5-072-prompt` (20.4–23.4, plays 1.0–4.0): sticker 「完整 Prompt 一键复制」, cursor clicks copy, zoom into the prompt.
  - `c5-072-rank` (24.0–25.9, plays 4.0–5.9): 「两张榜单：传播热度与复测生效。」
  - `c5-072-brand` (25.95–29.0, plays 5.9–8.95): GoodCase.ai end card types in, last frame held.
  - Credit 「@aiwarts · 原作片段」. The small thumbnails inside the site UI belong to other creators, which the caveat says.
- **SFX:** template defaults + whoosh.
- **Continuity:** dot 5 lit.

## s12_case6 — Case 6 · gosail-054: the product stays fixed, only the staging changes   (≈ 11.0 s · dark · push · energy 2)

- **Voice:**
  - s12_case6.1 (0.45–3.16) 第六招，产品不改，只改演出。
  - s12_case6.2 (3.36–7.30) 同一份 3D 数据，换了四种风格，机身看起来一致。
  - s12_case6.3 (7.50–10.21) 写清哪些必须保持，哪些允许发挥。
- **On screen:** CASE 06 / 08 · 「3D 产品片变体」 · `@yoshifujidesign` · chip 「固定输入：手机 3D 模型」 · 炫在哪里
  「产品不改，只改演出」 · 「同一份 3D 数据，做出四种风格」 / 「一条橙线，从开场画到收尾」 · 可以照搬
  「写清哪些必须保持原样，哪些允许发挥」 · caveat 「未公开提示与工具链；片中参数为虚构」.
- **Visual:** template, aspect 9:16 (372 × 662 card, y 184–846). "看起来一致" is our visual check across the four
  versions, so the voice says "looks consistent", not "is identical".
- **Sync (cues):** secret 0.45 · point 1 3.36 · point 2 「风格」 5.44 · takeaway 7.50.
- **Footage:** `c6-054-scan` (source 18.5–21.95, plays 0–3.45): orange 「RENDER xx%」 scan line turns the wireframe phone
  into the photoreal render (≈ 0.7–2.5 s, during 「产品不改，只改演出」); then `c6-054b-line` (gosail-054-b 0.0–6.3,
  plays 3.45–9.75): the plume version, one handwritten line circles the phone and writes 「allure」, the phone flips in
  3D. Credit 「@yoshifujidesign · 原作片段」. gosail-054-pre1/pre2 are not used.
- **SFX:** template defaults + whoosh.
- **Continuity:** dot 6 lit.

## s13_case7 — Case 7 · uc-2348: real motion drives text and light   (≈ 11.0 s · dark · push · energy 2)

- **Voice:**
  - s13_case7.1 (0.45–3.52) 第七招，用动作驱动文字和光。
  - s13_case7.2 (3.72–8.00) 舞者和歌来自别的模型，Opus 取出骨架，驱动特效。
  - s13_case7.3 (8.20–10.53) 只挑两三个动作，用完就收。
- **On screen:** CASE 07 / 08 · 「骨架驱动舞蹈」 · `@aicreataro` · 「路线：多模型＋After Effects」 · 炫在哪里 「动作驱动文字和光」 ·
  「举手挂歌词，出拳射文字，落地爆光」 / 「先给观众看骨架数据，再看效果」 · 可以照搬 「只挑两三个动作，各绑一种效果，用完就收」 ·
  caveat 「作者自述：歌与舞者由 AI 生成」.
- **Visual:** template, 16:9. The voice states the split plainly; nothing here is called "drawn by code".
- **Sync (cues):** secret 0.45 · point 1 「骨架」 6.62 · point 2 「特效」 7.62 · takeaway 8.20.
- **Footage:**
  - `c7-2348-burst` (source 8.667–11.45, plays 0–2.78): skeleton-only frames (data first), landing burst ≈ 0.46,
    「光れ」 ≈ 1.33. Photosensitivity check: beat cuts plus one single-frame accent (source 9.583); at most two flashes in
    any 1-second window. Below the 3-per-second limit, so OK. The strobe ranges 0–1.8 and 15.79–16.33 are excluded.
  - `c7-2348-lyric` (3.667–7.292, plays 2.78–6.41): lyrics hang from the raised hand, during 「舞者和歌来自别的模型」.
  - `c7-2348-lock` (25.5–29.5, plays 6.41–10.41): HIKARE word wall; **「TARGET: LIGHT LOCKED」 at ≈ 8.4 s, right as the
    voice says 「只挑两三个动作」**.
  - Credit 「@aicreataro · 原作片段」.
- **SFX:** template defaults + whoosh.
- **Continuity:** dot 7 lit.

## s14_case8 — Case 8 · gosail-133: each model does only what it is best at   (≈ 11.5 s · dark · push · energy 2)

- **Voice:**
  - s14_case8.1 (0.45–3.24) 第八招，每个模型只做最擅长的。
  - s14_case8.2 (3.44–7.09) Opus 统筹，Seedance 管动作，换景藏在幕布后。
  - s14_case8.3 (7.29–10.59) 每个镜头写清输入、工具和验收标准。
- **On screen:** CASE 08 / 08 · 「五幕舞台短片」 · `@KanaWorks_AI` · 「路线：多模型制作」 · 炫在哪里 「每个模型只做最擅长的」 ·
  「Opus 统筹，Seedance 管动作」 / 「换景藏在幕布合拢的那几帧」 · 可以照搬 「每个镜头写清输入、负责工具和验收标准」 ·
  caveat 「分工为作者自述；“便宜稳定”不是排名」.
- **Visual:** template, 16:9.
- **Sync (cues):** secret 0.45 · point 1 3.44 · point 2 「幕布」 6.63 · takeaway 7.29.
- **Footage:** `c8-133-stage` (source 0.0–10.833, one continuous performance, no hard cut): the curtain opens at
  1.0–1.4 s; Paris street; **curtain closes at 5.42–5.75 and reopens on the carrot garden at 6.29, under 「换景藏在幕布后」
  (5.90–7.09)**; jump and close 8.17–8.58; 「CHAPITRE IV · La Nuit」 and the night sky 9.17. 720p source extracted at
  1280. Credit 「@KanaWorks_AI · 原作片段」.
- **SFX:** template defaults + whoosh.
- **Continuity:** dot 8 lit (series complete). Out: iris closes onto the centre, where s15's formula opens.

## s15_formula — Why it looks good, as one formula (with how this film did each part)   (≈ 9.0 s · dark · iris · energy 1)

- **Voice:**
  - s15_formula.1 (0.60–3.14) 所以，炫不是因为模型会画画。
  - s15_formula.2 (3.44–8.35) 而是叙事、规则、时间轴、声音，再加一轮轮检查。
- **On screen:**
  - H1 (100 px / 900), two lines centred: 「炫，不是因为」 (snow) / 「模型会画画」 (fog), the second struck through in lime.
  - Five marker cards (290 × 200, night-2, radius 20), each with an H3 (48 px / 800) and a 20 px mono line:
    - 「叙事」 · 「本片：storyboard.md，一镜一事」
    - 「规则」 · 「本片：design.md，一种强调色」
    - 「时间轴」 · 「本片：timeline.js，同一个 t」
    - 「声音」 · 「本片：120 BPM 节拍网格」
    - 「检查」 · 「本片：逐场联系表」
  - Result (120 px / 900, lime): 「＝ 炫」
- **Visual:**
  - Phase 1: the H1 block centred at y 420 / 540. At 「画画」 a lime strike line (K.drawPath, 8 px, round caps)
    draws across 「模型会画画」 in 0.4 s.
  - Phase 2 (3.44): the H1 shrinks to H2 and moves to the top (y 160). A hairline time line (2 px, 30 % snow) draws
    across y 520 from x 160 to 1760. The cards stand on it at centres x 262, 611, 960, 1309, 1658 (y 420–620, so the
    outer edges sit at x 117 and 1803, inside the content box). The
    PLAYHEAD pill runs along the line and stops under each card as it is named (spring); the card's top border turns
    lime when the pill arrives.
  - 8.35: 「＝ 炫」 pops centred at y 770.
- **Sync:** 「炫」 @1.43 first H1 line rises · 「模型」 @2.20 second line rises · 「画画」 @2.71 strike · 「叙事」 @3.72 ·
  「规则」 @4.51 · 「时间」 @5.32 ·
  「声音」 @6.25 · 「检查」 @7.87 → cards 1–5 · line end 8.35 → result.
- **Footage:** none.
- **SFX:** swish 2.71 (0.35) · pop × 5 at the five words (0.3) · ding 8.35 (0.4).
- **Continuity:** the PLAYHEAD is back as a runner on a time line; out with the lime chapter wipe into the light chapter.

## s16_env — How-to 1: an environment that can run code   (≈ 11.0 s · light · wipe · energy 1)

- **Voice:**
  - s16_env.1 (0.45–5.55) 轮到你了。先准备一个能跑代码的 AI 环境，比如 Claude Code。
  - s16_env.2 (5.75–8.90) 一行命令安装，再装好 Node.js 和 FFmpeg。
  - s16_env.3 (9.10–10.22) 它需要付费账号。
- **On screen:**
  - tag (K.tag light): 「第 1 步 · 环境」 · H2 (64 px / 800 ink): 「准备能跑代码的 AI 环境」 (lime marker behind 「AI 环境」).
  - Small green chip at the right of the header: 「本片也在 Claude Code 里写成」.
  - Terminal (K.terminal light, title 「zsh — ~/my-first-video」), typed lines:
    `curl -fsSL https://claude.ai/install.sh | bash` · `claude --version` · `node --version` · `ffmpeg -version`
  - Under the terminal (20 px mono ink-2): 「Windows PowerShell：irm https://claude.ai/install.ps1 | iex」
  - Checklist (K.checklist light, size 40): 「Claude Code」 sub 「能读文件、跑命令的 AI 编程环境」 · 「付费账号」 sub
    「Pro 起；免费版不含 Claude Code」 · 「Node.js」 sub 「运行渲染脚本」 · 「FFmpeg」 sub 「把画面编成视频」
  - Footnote (18 px ink-2): 「Claude Code 需 Pro、Max、Team、Enterprise 或 Console 账号；仅在 Anthropic 支持的国家和地区提供，以官方页面为准。」
- **Visual:** paper grid. Header at (112, 150). Terminal (1000 × 380) at (112, 270); Windows line at (112, 668).
  Checklist (w 600) at (1180, 270). Footnote at (112, 830), one line (max width 1696). No commands typed without
  being visible for at least 2 s.
- **Sync:** 「轮」 @0.45 header · 「环境」 @3.50 marker · 「Claude」 @4.75 the curl line types (typeDur 1.0) and item 1
  ticks at 5.16 · 「命令」 @6.21 green underline on the curl line · `claude --version` types at 6.40 · 「Node」 @7.57
  `node --version` + tick 3 · 「FFmpeg」 @8.15 `ffmpeg -version` + tick 4 · 「付费」 @9.51 tick 2 (the paid account is
  ticked last, when it is said).
- **Footage:** none.
- **SFX:** type 4.75 (0.25) · type 6.40, 7.57, 8.15 (0.18) · ding at each tick (0.25).
- **Continuity:** the light code-block style carries into s17's route cards.

## s17_routes — How-to 2: pick a route (real commands on screen)   (≈ 14.0 s · light · wipe-up · energy 1)

- **Voice:**
  - s17_routes.1 (0.45–4.91) 然后选路线：做图文和界面，用 HyperFrames 或 Remotion。
  - s17_routes.2 (5.13–9.25) 想全盘掌控，就像本片，用网页加无头浏览器。
  - s17_routes.3 (9.47–13.15) 想直接套风格，装 Lemo-Opuscar，记得先要分镜。
- **On screen:** tag 「第 2 步 · 路线」 · H2 「选一条路线」. Four cards, each: name (H3 40 px / 800 ink), chips, a light
  code block (`500 20px var(--mono)`, line-height 1.5), a note (20 px ink-2):
  - **A · HyperFrames** · chips 「HTML 写画面」 「Apache 2.0」
    ```
    npx hyperframes init my-video
    npx hyperframes render --output out.mp4
    claude plugin marketplace add heygen-com/hyperframes
    claude plugin install hyperframes@hyperframes
    ```
    note 「需 Node 22+，FFmpeg 自装；预览：npx hyperframes preview」
  - **B · Remotion** · chips 「React 写画面」 「内置 FFmpeg」
    ```
    npx create-video@latest --yes --blank --no-tailwind my-video
    npx remotion render MyComp out/video.mp4
    claude plugin marketplace add remotion-dev/claude-code-plugin
    claude plugin install remotion@remotion
    ```
    note 「个人与 3 人以内团队免费；更大的营利公司需购买许可」
  - **C · 网页 + 无头浏览器** · chips 「本片同路线」 (green fill, white text) 「全部自己掌控」
    ```
    npm i puppeteer
    node render.mjs   # 每帧调用 renderFrame(i / 30) 再截图
    ffmpeg -framerate 30 -i frames/%05d.png -i voice.wav \
      -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest out.mp4
    ```
    note 「本片用 Playwright 驱动无头 Chrome，6 路并行渲染」
  - **D · Lemo-Opuscar** · chips 「风格插件」 「MIT」 「43 种风格」
    ```
    claude plugin marketplace add lemomo-ai/lemo-opuscar
    claude plugin install lemo-opuscar@lemolab
    ```
    speech bubble (24 px ink): 「对它说：“先给我看分镜”」 · note 「默认不看分镜直接出片；需 Node 20+、ffmpeg、Python 3.11+」
- **Visual:** 2 × 2 grid inside the content box: columns x 112–948 and 972–1808 (836 px), rows y 240–548 and 572–880
  (308 px). Longest command line is 61 chars, about 732 px at 20 px mono, inside the 780 px inner width. Cards rise
  staggered from 0.2 s. Active card: scale 1.03, 3 px green outline; inactive cards 45 % opacity. Code blocks type in
  (codeBlock.render) when their card becomes active.
- **Sync:** 「选路线」 @0.76 header · 「图文」 @1.84 A and B active · 「HyperFrames」 @3.20 A types · 「Remotion」 @4.40 B
  types · 「掌控」 @5.80 C active · 「本片」 @6.81 the 「本片同路线」 chip stamps (pop) and C types · 「Lemo」 @11.03 D
  active and types · 「分镜」 @12.80 speech bubble pops.
- **Footage:** none.
- **SFX:** type 3.20, 4.40, 6.81, 11.03 (0.2) · pop 6.81 (0.35) · pop 12.80 (0.35).
- **Continuity:** 「本片同路线」 hands over to s18's 「本片是这样做的」.

## s18_workflow — How-to 3: no one-line films; the loop, shown with this film's real files   (≈ 11.0 s · light · wipe-up · energy 1)

- **Voice:**
  - s18_workflow.1 (0.45–3.43) 别指望一句话出片。本片是这样做的：
  - s18_workflow.2 (3.63–7.06) 写清任务，整理资料，写好分镜和台词；
  - s18_workflow.3 (7.26–10.12) 先做一个镜头的小样，看过再扩展到全片。
- **On screen:**
  - tag 「第 3 步 · 流程」 · H2 「别指望一句话出片」 (lime marker behind 「一句话出片」, then a thin ink strike).
  - Chip at 「本片」: 「本片的真实文件 ↓」
  - Six step cards (number badge, H3 34 px / 800, file chip in mono 18 px on a lime marker, mini visual):
    ① 「明确任务」 · `creative-brief.md` · three text bars + 「观众 · 主旨 · 时长」
    ② 「整理输入」 · `research/brief.md` · 8 small abstract tiles + 「8 个案例 · 60 张海报」
    ③ 「分镜台词」 · `narration.json` · a live JSON snippet of the line being spoken:
       `{"id": "s18_workflow.2", "text": "写清任务，整理资料，写好分镜和台词；"}` (built from `ctx.lines`; 14 px mono,
       wrapped over 4 lines inside the 262 px card; the spoken part turns green word by word)
    ④ 「做小样」 · `_test_a.js` · a mini canvas drawn by `miniSample()`, looping
    ⑤ 「逐轮修改」 · 「按时间点反馈」 · a tiny 4 × 2 contact sheet, one cell outlined blue, `8.0s`
    ⑥ 「验收交付」 · 「联系表 · 转写核对 · 响度」 · three check icons
  - Loop arrow label (26 px ink-2): 「看过再改，循环几轮」
- **Visual:** header at (112, 150). Cards 262 × 300, gap 24, y 300–600, x 112 → 1804. A green path (K.drawPath) at
  y 640 under the cards; the green PLAYHEAD runs along it and stops under each card as it is named (the path behind it
  turns solid). Loop arrow (dashed green, curved) from ⑤ back to ③ under the row, y 680–820, with its label at
  (700, 800).
- **Sync:** 「出片」 @1.32 strike · 「本片」 @2.35 chip · 「任务」 @4.08 ① · 「资料」 @5.00 ② · 「台词」 @6.59 ③ (JSON
  highlight runs with the words of s18_workflow.2) · 「小样」 @8.12 ④ · 「看」 @8.81 ⑤ + loop arrow · 「全片」 @9.63 ⑥.
- **Footage:** none (no case posters here; the abstract tiles keep credits simple).
- **SFX:** tick at each card (6 × 0.25) · swish 8.81 (0.3).
- **Continuity:** ⑤'s mini contact sheet is the one s19 zooms into.

## s19_feedback — How-to 4: feedback = time point + problem + expectation   (≈ 11.0 s · light · zoom · energy 1)

- **Voice:**
  - s19_feedback.1 (0.45–4.12) 反馈要写三样：时间点、问题、期望。
  - s19_feedback.2 (4.34–8.48) 比如，第 8 秒，标题被字幕挡住，请上移。
  - s19_feedback.3 (8.70–10.10) 每轮只改一类问题。
- **On screen:**
  - tag 「第 4 步 · 反馈」 · H2 「反馈写三样」.
  - Contact sheet card title (18 px mono ink-2): 「示例小样 · 联系表 · 每 0.5 秒一帧」; cell labels `6.0s` … `11.5s`.
  - Command line under the sheet (18 px mono ink-2) with a chip 「本片的检查方式」:
    `node tools/still.mjs --scene <场景> --every 0.5 --sheet`
  - Feedback note (three rows; label pills + content, cn 30 px ink):
    「时间点」 「第 8 秒」 · 「问题」 「标题被字幕挡住」 · 「期望」 「标题上移，完整停留后再切」
  - Rounds tracker (4 chips, 22 px): 「第 1 轮 故事」 「第 2 轮 构图」 「第 3 轮 动作」 「第 4 轮 声音与输出」
  - Last line (24 px ink-2): 「最后：带声音完整看一遍，再用手机看一遍」
- **Visual:**
  - Contact sheet card (white, radius 20) x 112–1092, y 250–860: 4 × 3 cells (220 × 124, gap 16), each drawn with
    `sampleShot(g, tCell, 220, 124, fixed=false)` for tCell = 6.0, 6.5 … 11.5. Cells 8.0, 8.5, 9.0, 9.5 show the
    title hidden under the subtitle bar. Command line at y 800.
  - The green PLAYHEAD sweeps across the cells (a scrubber over the sheet) from 0.6 s and snaps to the 8.0 s cell.
  - Note card (white, 6 px green left border) x 1140–1808, y 250–590. Tracker y 620–690. Last line y 720.
- **Sync:** 「时间点」 @1.91, 「问题」 @2.87, 「期望」 @3.63: each label pill gets its lime marker. 「8」 @5.38 → the
  playhead snaps to the 8.0 s cell, blue outline + 「!」 badge, and 「第 8 秒」 types in. 「标题」 @6.18 → 「标题被字幕挡住」
  types. 「移」 @8.21 → the content becomes 「标题上移，完整停留后再切」; the four bad cells redraw with
  `fixed=true` (title slides up 0.4 s) and get green ✓ badges. 「一类」 @9.50 → rounds tracker lights chip 1 only;
  last line fades in.
- **Footage:** none. The sample is an illustration, labelled 「示例」; its frames come from the same pure function.
- **SFX:** blip 1.91, 2.87, 3.63 (0.3) · tick 5.38 (0.3) · type 6.18 (0.2) · ding 8.21 (0.4) · pop 9.50 (0.25).
- **Continuity:** from s18 ⑤ by zoom. `miniSample()` inside `sampleShot()` is the same square as s03/s04.

## s20_prompt — How-to 5: the prompt template, the first round, a 15–30 s first piece   (≈ 10.5 s · light · wipe-up · energy 1)

- **Voice:**
  - s20_prompt.1 (0.45–3.48) 提示词照这个模板写，先让它列出缺口。
  - s20_prompt.2 (3.70–7.19) 第一轮只要分镜、三张风格帧和一个短镜头。
  - s20_prompt.3 (7.41–9.89) 你的第一支，先做 15 到 30 秒。
- **On screen:**
  - tag 「第 5 步 · 提示词」 · H2 「照模板写，先列缺口」.
  - Document card title (18 px mono ink-2): 「提示词模板（据 WaytoAGI 文章整理）」. Body (26 px / 1.6, ink), ten lines,
    every ［…］ with a lime marker fill behind it:
    ```
    我要为［目标观众］做一支［用途］视频。
    观众看完应该记住：［一句话主旨］。
    交付规格：［时长］［画幅］［分辨率］［帧率］
    已有材料：［资料、素材与可用范围］
    必须保持：［事实、产品外形、品牌、配色］
    允许创作：［镜头、转场、背景、表现手法］
    先读材料，列出缺口；区分代码画面、已有素材和生成素材。
    不确定的，不要写成事实。
    本轮先交付：分镜表、三张风格帧、一个短镜头小样和一次导出。
    动画按时间可重算，固定随机种子，等字体加载完再出画面。
    ```
  - Right card title 「第一轮只要」 + K.checklist light (size 32): 「分镜表」 · 「三张风格帧」 · 「一个短镜头 + 一次导出」
  - Hero (Space Grotesk 120 px / 700, green-deep): 「15–30」 + 「秒」 (cn 64 px); bar label 「你的第一支」.
- **Visual:** document card (white, radius 22) 1040 × 600 at (112, 250); inner width 960 px fits 36 chars per line
  (longest line is 27). Lines type in fast (0.45–2.6, 0.2 s per line). Right column x 1200–1808: checklist card
  y 250–560; below it (y 600–860) the hero number and a 560 px track 0–60 s with the 15–30 s segment filled green and
  the green PLAYHEAD sliding from 0 to 30.
- **Sync:** 「模板」 @1.35 the markers on ［…］ sweep in · 「缺口」 @3.04 line 7 gets a green left bar + marker ·
  「分镜」 @4.31 tick 1 · 「风格」 @5.46 tick 2 · 「镜头」 @6.73 tick 3 · 「15」 (token 「15 到 30 秒」 @8.90) hero pops and
  the playhead slides to 30.
- **Footage:** none.
- **SFX:** type 0.45 (0.18) · blip 3.04 (0.3) · ding at ticks (0.25) · rise_short 8.40 (0.3) · pop 8.90 (0.45).
- **Continuity:** the PLAYHEAD ends this chapter at "30 s". Lime chapter wipe back to dark.

## s21_reveal — Behind the scenes: how this film was made, including the voice   (≈ 11.5 s · dark · wipe · energy 0)

- **Voice:**
  - s21_reveal.1 (0.45–4.82) 场景代码、时间轴和配乐程序，都是 Opus 5.5 写的。
  - s21_reveal.2 (5.07–8.14) 无头 Chrome 渲染每一帧，FFmpeg 编码。
  - s21_reveal.3 (8.39–10.91) 连我的声音，也是微软的语音合成。
- **On screen:**
  - tag 「幕后」 · H2 「本片是怎么做的」 · live counter right-aligned: `FRAME 06512 / {{FRAMES}}` (live first number).
  - Division table, label column (26 px fog) → value column (30 px / 600 snow):
    - 「场景代码 · 时间轴 · 配乐程序」 → 「Opus 5.5，在 Claude Code 里写」
    - 「每一帧」 → 「无头 Chrome 渲染，6 路并行」
    - 「编码」 → 「FFmpeg」
    - 「旁白」 → 「微软神经网络语音合成（edge-tts · 云希）」
    - 「字幕」 → 「按语音的词级时间戳对齐」
    - 「音乐与音效」 → 「Python 程序合成」
    - 「案例片段」 → 「归原作者所有，逐段署名」
  - Four stat tiles: 「{{FRAMES}}」 帧 · 「{{SCENES}}」 个场景 · 「{{CODE_LINES}}」 行代码 · 「{{RENDER_MIN}}」 分钟渲染
  - Voice strip label (18 px mono fog): 「这句话的语音 · zh-CN-YunxiNeural · 语速 +6%」
- **Visual:** header at (112, 150), counter at x 1808 right-aligned. Table x 112–1100, rows 70 px from y 250 (7 rows →
  y 740). Stat tiles 2 × 2 (300 × 220, night-2, radius 20, numbers 72 px Space Grotesk lime, labels 24 px fog) at
  x 1180–1808, y 250–700. Voice strip x 112–1808, y 790–870: the words of s21_reveal.3 as lime rounded bars
  (height ∝ duration, from `ctx.lines`), each appearing at its real start time; its label at the left.
- **Sync:** 「场景」 @0.45 row 1 · 「Opus」 @3.56 row 1's value lights lime · 「Chrome」 @5.37 row 2 · 「FFmpeg」 @7.00
  row 3 · 「声音」 @8.77 row 4 + voice strip starts · 「微软」 @9.85 row 4's value glows · 「合成」 @10.47 rows 5–7 and
  the stat tiles count up (numbers are placeholders; animate opacity/scale, not the digits).
- **Footage:** none.
- **SFX:** tick per row (0.2) · blip 8.77 (0.3) · sparkle 9.85 (0.35). Music is pads only (energy 0): the quiet
  before the finale.
- **Continuity:** the FRAME counter from s01/s02 returns near the end of the film; the word bars come from s10's VOICE lane.

## s22_end — End card: where to read more; the film ends on its last frame   (≈ 8.5 s · dark · iris (960, 420) · energy 3 · chrome off)

- **Voice:** s22_end.1 (0.60–5.84) 全文和 1704 个视频案例都在 WaytoAGI，去做你的第一支吧。 (then 2.7 s of music)
- **On screen:**
  - WaytoAGI logo (LOGO_DARK), height 72, centred at y 250.
  - H1 (96 px / 900): 「每一帧，都是代码」 (「代码」 lime), centred at y 380.
  - Two rows, centred, 32 px: 「读全文 · WaytoAGI 飞书知识库《Opus 5.5 怎样把代码变成视频》」 and
    「看案例 · waytoagi.com/usecase-atlas/opus5-5」 (the URL in 30 px mono lime).
  - Stats (22 px mono fog): 「5,181 个案例 · 1,704 个视频 · 截至 2026 年 10 月 1 日 WaytoAGI 收录」
  - Ruler label (20 px mono fog, right-aligned at x 1808): 「第 07079 帧 / 共 {{FRAMES}} 帧」 (live first number).
- **Visual:** iris opens on the logo. Rows at y 540 and 610, stats at y 690. Bottom ruler x 112–1808 at y 820: the
  PLAYHEAD pill travels the last 8.5 s of the film so it reaches x 1808 on the very last frame (x mapped from
  `ctx.start + t` over the whole film, so it enters already at ≈ 96 %). Everything else holds still apart from a 1 %
  drift; the music fades over the last 3 s.
- **Sync:** 「全文」 @0.60 row 1 rises · 「1704」 @1.31 row 2 + stats · 「Way」 @3.54 a lime sheen crosses the logo ·
  「去」 @4.79 the H1 「代码」 glows once.
- **Footage:** none.
- **SFX:** sparkle 3.54 (0.3) · ding 8.30 (0.25, playhead reaches the end).
- **Continuity:** closes the loop that started with s01's HUD ruler: same playhead, now at the end of the film.

---

## 4 · Honesty and rights checklist (all handled above)

- Opus 5.5 outputs text; no official video feature is implied (s03 shows the model page: 输出 文本, 没有视频输出).
- Voice says "drawn/computed by code" only over code-rendered work: s01 montage (gosail-060, uc-0962, uc-1377,
  lists-006, labelled 作者自述) and our own scenes. Never over uc-2348, gosail-133 or gosail-072's third-party clips.
- Second-half bridge (s11 line 1) says the next four cases use real material or other models.
- Author self-reports labelled: 0 After Effects, 完全 JavaScript, 工具栈与耗时, 构建90分钟/渲染4小时/40美元, 一次直出,
  歌与舞者, 分工, 便宜稳定.
- No one-prompt promise: s01 「也不是 AI 一键生成的」, s18 「别指望一句话出片」.
- Paid plan and supported regions stated on screen (s16), no workaround advice. Remotion licence note on screen (s17).
- Data phrased 「截至 10 月 1 日 WaytoAGI 收录」 (s05, s22).
- Determinism claim qualified on screen (s04 footnote: pixels can differ across machines).
- Our pipeline statements are limited to the allowed facts; final numbers only as `{{FRAMES}} {{CODE_LINES}}
  {{RENDER_MIN}} {{SCENES}}`; the TTS voice is disclosed in the voice itself (s21).
- Footage: original audio never used; photosensitive ranges of uc-2348 excluded and the chosen burst range checked
  (≤ 2 flashes per second); gosail-054-pre1/pre2 not used; gosail-072 2.0–3.3 and the third-party montage not used.

## 5 · Build notes for the scene authors

- Case scenes use only `script/drafts/C/clips.json` ids and the `data` in narration.json (cues are verified against the
  TTS word list; 「换景」 was split by TTS, so case 8 cues on 「幕布」).
- s01 and s02 need the hook clips `h-060-light`, `h-0962-web`, `h-1377-sun`, `h-006-code` (16:9 crops defined in
  clips.json).
- s10 reads `window.TIMELINE` (scenes, lines, words, subs, bpm) and `window.__events()`. s18 and s21 read `ctx.lines`.
  s04 reads `this.render.toString()`. None of these change between frames, so every frame stays a pure function of t.
- Review each custom scene with `node tools/still.mjs --scene <id> --every 0.5 --sheet <id>`, and check s02, s04,
  s10 at full size on their sync words.
