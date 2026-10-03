# 《每一帧，都是代码》 — Draft B「老师讲明白」 storyboard

Runtime **3:56.0** (236.00 s, measured with `tools/build_timeline.py --dry`, real Yunxi +6 % TTS) · 22 scenes · 54 voice lines · 1,170 subtitle characters.
Files: `script/drafts/B/narration.json` (timeline source), `script/drafts/B/clips.json` (23 excerpts), this storyboard.
All "@x.xx" times below are **scene-local seconds** taken from the measured TTS word boundaries; use `ctx.word(lineId, word)` for them in code, never the literal numbers.

## Director's note

**Idea.** A teacher who makes a beginner *feel* the mechanism before naming it. One analogy carries the film: **a flip book (手翻书)**. Opus 5.5 writes the rule for every page, the browser draws each page, FFmpeg binds the book. Then a second analogy, **the film crew**: Opus is director, programmer and editor in one, which is why "cool" comes from directing, not from a model that paints.

**Shape (progressive disclosure).**
- **00 开场:** an 8-second hook that literally dissolves real footage into code, then a title with a four-chip syllabus.
- **01 原理:** three steps. Text out → flip book → `render(t)` and 900 pages → crew, with the lists-006 "Every frame is code" toast as the punchline.
- **02 为什么炫:** eight lessons ("第一招 … 第八招"), each in the same case card. They collapse into one formula: 炫 = 主线 + 规则 + 时间轴 + 声音 + 检查 = 导演功夫.
- **03 小白上手:** a five-step worksheet on light "paper", with two before/after demos (style words → checkable rules; vague feedback → 时间点＋问题＋期望) and a homework card for the first 20-second piece.
- **04 幕后:** the film turns its own page over: our scene code, our real timeline, our music program. "连我的声音，也是合成的。"

**Signature shots.**
1. s01: the hook footage turns into ASCII glyphs that re-flow into code and collapse into one lime dot.
2. s03→s04: a chat reply's lines peel off into paper pages that riffle into a flip book. The camera zooms into one page, which is `render(t)` scrubbed live.
3. s04: the 900-tile grid. Each tile is literally `render(i/30)`, so the grid is a woven wave.
4. s05: the pipeline's `video.mp4` chip morphs into the lists-006 card. Its toast "✓ Every frame is code" pops exactly on the voice's "每一帧".
5. s21: the page-flip callback. A mini title card flips to reveal the real code that animated the eight case cards, then the camera pulls back to this film's actual timeline (read from `window.TIMELINE`) with the lime-dot playhead.

**The recurring object (we practise lesson 01 ourselves).** A lime dot (r = 14 px, soft glow; on light scenes `--green` #238653 with a 6 px lime halo ring).
- s01–s02: the code collapses into it, the title iris opens from it, and it sits as the title's period.
- s03–s05: it is the typing caret, then the dot drawn by `render(t)`, then the packet in the pipeline.
- s06: it hops across the wall.
- Cases: the template's lime series pill echoes it.
- s15: a wink, "本片的主线：这颗绿点".
- s16–s20: it is the checklist marker, metro-map traveller and timeline playhead.
- s21: it is the playhead on our real timeline.
- s22: it is the final period. It shrinks to nothing on the last frame.

**Grammar.**
- Chapter changes use `wipe` (lime bar; green on light).
- The case carousel uses `push`.
- Worksheet steps use `wipe-up` ("turn the page").
- Reveals use `iris` or `zoom`.
- Hard cuts appear only on beats inside the s01 montage.
- No plain fades.

**Music energy:** 3 at s01–s02 (hook), s15 (formula peak) and s21 (reveal); 2 for the wall and cases; 1 for explanation and how-to; 1 for the end card (outro).

## Timeline

| # | scene | start | dur | chapter | theme | in-transition | energy |
|-|-|-|-|-|-|-|-|
| 1 | s01_hook | 0.00 | 8.00 | 00 开场 | dark, chrome off | cut (film start) | 3 |
| 2 | s02_title | 8.00 | 6.00 | 00 开场 | dark, chrome off | iris 0.6 @ (960,540), sfx impact | 3 |
| 3 | s03_flipbook | 14.00 | 9.50 | 01 原理 | dark | wipe 0.6 | 1 |
| 4 | s04_render | 23.50 | 10.50 | 01 原理 | dark | zoom 0.6 | 1 |
| 5 | s05_crew | 34.00 | 13.50 | 01 原理 | dark | wipe-up 0.6 | 1 |
| 6 | s06_wall | 47.50 | 9.50 | 02 为什么炫 | dark | wipe 0.6 | 2 |
| 7 | s07_case1 lists-006 | 57.00 | 11.50 | 02 | dark | zoom 0.6 (sfx off) | 2 |
| 8 | s08_case2 gosail-060 | 68.50 | 10.50 | 02 | dark | push 0.7 (sfx off) | 2 |
| 9 | s09_case3 uc-0962 | 79.00 | 11.50 | 02 | dark | push 0.7 (sfx off) | 2 |
| 10 | s10_case4 uc-1377 | 90.50 | 10.50 | 02 | dark | push 0.7 (sfx off) | 2 |
| 11 | s11_case5 gosail-072 | 101.00 | 10.00 | 02 | dark | push 0.7 (sfx off) | 2 |
| 12 | s12_case6 gosail-054 | 111.00 | 11.00 | 02 | dark | push 0.7 (sfx off) | 2 |
| 13 | s13_case7 uc-2348 | 122.00 | 12.00 | 02 | dark | push 0.7 (sfx off) | 2 |
| 14 | s14_case8 gosail-133 | 134.00 | 12.00 | 02 | dark | push 0.7 (sfx off) | 2 |
| 15 | s15_formula | 146.00 | 11.50 | 02 | dark | iris 0.6 @ (632,515) | 3 |
| 16 | s16_setup | 157.50 | 10.00 | 03 小白上手 | light | wipe 0.6 | 1 |
| 17 | s17_route | 167.50 | 11.00 | 03 | light | wipe-up 0.6 | 1 |
| 18 | s18_prompt | 178.50 | 15.50 | 03 | light | wipe-up 0.6 | 1 |
| 19 | s19_feedback | 194.00 | 12.00 | 03 | light | wipe-up 0.6 | 1 |
| 20 | s20_first | 206.00 | 8.50 | 03 | light | zoom 0.6 | 1 |
| 21 | s21_meta | 214.50 | 14.00 | 04 幕后 | dark | wipe 0.6 | 3 |
| 22 | s22_end | 228.50 | 7.50 | 04 幕后 | dark, chrome off | iris 0.8 @ (1728,410) | 1 |

Case pushes carry `"sfx": false` because the case template already plays its own swish at t = 0.05. The engine's default transition whoosh still plays on wipes, zooms and irises.

## Global rules for every scene

- **Safe areas.** Focal objects and text stay in x 112–1808, y 140–880. Subtitles sit in the band y > 900. Footage may bleed under the bands only in s01, where chrome is off and its credit chip moves to the top band.
- **Credits.** Every excerpt carries its credit while visible.
  - Case template: `K.videoCard` credit `@handle · 原作片段`.
  - Custom scenes: the same chip style. The four hook shots add a second line, `作者自述：代码渲染`.
- **Data.** Library numbers always carry "截至 10 月 1 日 WaytoAGI 收录". Author claims carry "作者自述" / "据作者".
- **Thumbnail swap.** The 60-tile wall has a trap: tile `gosail-072` in `assets/wall/` is @Just_sharon7's Seedance frame. Wherever the wall or a featured-case thumbnail appears (s06, s15, s22), replace that tile with a frame from clip `g072_end` at 1.5 s (GoodCase's own brand card).
- **Featured thumbnails.** The eight featured thumbnails (s06 row, s15 top row) use frames from our own clips, not wall posters:
  - `l006_case`@1.9
  - `g060_light`@5.0
  - `u0962_web`@7.0
  - `u1377_sun`@3.0
  - `g072_end`@1.5
  - `g054_scan`@2.6
  - `u2348_hikare`@4.0
  - `g133_main`@10.0
- **Fun font.** Smiley Sans is used at most once per scene: s02 "？", s15 wink, s21 "这句也是。".
- **Placeholders.** `{{SCENES}} {{CODE_LINES}} {{FRAMES}} {{RENDER_MIN}}` appear on screen only (s21), never in the voice.

---

## s01_hook — make the viewer doubt their eyes: four "hand-made-looking" shots turn into code   (≈ 8.0 s · dark · cut · energy 3)

**Voice**
- s01_hook.1 (0.30–2.54) 这些画面，没有一帧是画出来的。
- s01_hook.2 (2.79–6.25) 是 Opus 5.5 写的代码，一帧帧算出来的。

**On screen**
- *Credit chip.* Top-left at x 56, y 44 (chrome is off, so the top band is free). Chip style: `.k-credit`, 20 px, plus a second line in mono 16 px lime.
  - 0.00–2.00 "@morpheusdv · 原作片段 / 作者自述：代码渲染"
  - 2.00–3.50 "@kimmonismus · 原作片段 / 作者自述：代码渲染"
  - 3.50–5.00 "@twoclipping · 原作片段 / 作者自述：代码渲染"
  - 5.00–6.60 "@WinterArc2125 · 原作片段 / 作者自述：代码渲染"
- *Frame counter.* Top-right at x 1660, y 48, mono 22 px, fog. Shows "F 0001" through "F 0240" (= ⌊t·30⌋+1): our own frame index, the film's first hint.
- *Code that the glyphs settle into* (6.5–7.4). Mono 34 px, centred; keywords lilac, `render` lime:
  ```
  function render(t) {
    for (const g of glyphs) g.draw(t);
  }
  ```

**Visual**
- *Shots.* Full-bleed `object-fit: cover`, each with a 1.00→1.04 push-in. Cuts land on beats at 2.0, 3.5 and 5.0.
  - A `h_g060_light` (0.0–2.0)
  - B `h_u0962_burst` (2.0–3.5)
  - C `h_l006_morph` (3.5–5.0): square source; cover crop keeps the centre 56 %, where the morph lives.
  - D `h_u1377_sun` (5.0–6.5): letterbox already cropped in the clip.
- *Glyph dissolve* (canvas overlay, 1920×1080).
  - Each frame, draw the current shot into an offscreen 80×45 canvas and read the luminance per cell (24 px cells).
  - Glyph per cell from the ramp ` .:-=+*#%@`. Colour is `M.mixColor('#A39A9B', '#F4F1F2', lum)`; cells with lum > 0.8 are lime.
  - From the word "算", cells flip from image to glyph in a radial wave from the centre over 0.8 s, and the footage opacity falls to 0 by 6.5.
  - 6.5–7.4: glyphs travel along seeded eased paths (`ctx.rng('glyph')`, outQuint) into the three-line code block. The other glyphs fade.
  - 7.4–8.0: the block squashes (scaleY → 0, then scaleX → 0) into the **lime dot** at (960, 540). It lands on the downbeat at 8.0, where s02's iris opens.

**Sync**
- "画面" @0.57: shot A is the character's glow. Its warm ring sweeps the screen at 0.85, the first wow.
- "代码" @4.59: shot C reaches the player card "made in code" (clip 1.75–2.0 → scene 4.75–5.0).
- "算" @5.68: the glyph wave starts on shot D.
- Voice end 6.25: the code is assembled by ~7.0. The dot lands at 8.0.

**Footage**
- `h_g060_light` gosail-060 48.4–50.4 · `h_u0962_burst` uc-0962 46.4–47.9 · `h_l006_morph` lists-006 0.5–2.0 · `h_u1377_sun` uc-1377 171.0–172.5. All full-bleed.
- All four are code-rendered works by their authors' accounts, which is why the voice may say "代码算出来的" here.
- None of uc-2348, gosail-133 or gosail-072 appears in this scene.

**SFX:** 0.00 boom (0.55). 2.0 / 3.5 / 5.0 shutter (0.3). 5.68 glitch (0.35). 6.5–7.3 type ×3 (0.2). 7.75 rise_short (0.4) into s02's impact.

**Continuity:** the lime dot is born here and opens s02. The glyphs reappear as drifting particles in s02.

---

## s02_title — the promise and the syllabus   (≈ 6.0 s · dark · iris from the dot · energy 3)

**Voice**
- s02_title.1 (0.60–4.44) 为什么这么炫？小白怎么做？一次讲明白。

**On screen**
- Hero, Noto Sans SC 900, 172 px, snow, one line, centred (cap height ≈ y 360–520): **每一帧，都是代码**. The lime dot sits after "码" as its period.
- H3, 44 px 700, fog, centred at y 600: **Opus 5.5 炫酷视频的秘密 ＋ 小白上手指南**
- Syllabus chips, row centred at y 720. Styled like the engine's `#chapter` tag: lime number badge plus CN label, 24 px:
  - 「01 原理」「02 八个案例」「03 小白上手」「04 ？」
  - The "？" in chip 04 is in Smiley Sans.

**Visual**
- *Background.* Night grid. About 200 faint code glyphs (alpha 0.12) drift upward: the remains of s01.
- *Entrances.* Title per-char rise from 0.30 (`K.title`, stagger 45 ms, outQuint 0.8 s). Subtitle rises at 0.90. Whole frame pushes 1.00→1.03.
- *Exit (5.3–6.0).* The title characters flip down one by one (rotateX 0→90°, 50 ms stagger), like pages turning, as an anticipation of the flip book. Then the chapter wipe.

**Sync**
- "炫" @1.11: chips 01 + 02 pop (`K.pop`).
- "小白" @2.06: chip 03 pops.
- "明白" @3.93: chip 04 "？" pops with a small wobble. It promises a secret, paid off in s21.
- The dot pulses on every beat (`ctx.beatTime`).

**Footage:** none.

**SFX:** iris impact (from the transition `sfx`). Pop ×3 (0.3) on the chips. The music engine adds the chapter riser 12–14 s automatically.

**Continuity:** the chips use the same component as the chapter tag. When the tag "01 原理" appears top-left in s03, the viewer recognises the syllabus.

---

## s03_flipbook — Opus only outputs text; pictures come from a flip book   (≈ 9.5 s · dark · wipe · energy 1)

**Voice**
- s03_flipbook.1 (0.60–5.93) Opus 5.5 不直接生成视频，只输出文字：代码、分镜、指令。
- s03_flipbook.2 (6.21–9.21) 那画面从哪来？答案像一本手翻书。

**On screen**
- *Left: chat window.* `K.chat` dark, w 860, h 560, at x 140, y 200, title "Claude Code".
  - User bubble (t 0.5): 帮我做一支 20 秒的视频
  - Claude bubble (t 1.7, typeDur 2.6), four lines:
    `好的，先给你三样文字：`
    `① 代码：render(t) {…}`
    `② 分镜：0–3 秒 钩子…`
    `③ 指令：node render.mjs`
- *Right: spec card.* Panel `--night-2`, 680×300, at x 1100, y 220.
  - Tag "CLAUDE OPUS 5.5".
  - Row 「输入」 with chips [文字] [图片].
  - Row 「输出」 with chip [文字] and a ghost chip [视频].
  - Small print below (21 px fog): 据 Anthropic 模型文档：输入文字和图片，只输出文字
- Three lime tags pop beside Claude's lines: 「代码」「分镜」「指令」.
- *Flip book* (from 6.4). Centre-right, x 980–1700, y 300–760: 12 paper pages (#F4F1F2, 560×320, radius 10) in a 3D stack (perspective 1600, rotateX 50°).
  - Each page has a faint grid and the lime dot at a different x (page k: x = 60 + 40k).
  - Caption under the book, H3 44 px snow: **手翻书**

**Visual**
- *Entrances.* The chat slides in from x −60 (0.6 s outQuint). The spec card rises at 1.2.
- *"Video" rejected.* The ghost [视频] chip appears in the 输出 row at "视频" @2.37. A fog strike line draws through it (0.3 s).
- *Text lights up.* [文字] pops lime at "文字" @3.51.
- *Three kinds of text.* At "代码" @4.21, "分镜" @4.81 and "指令" @5.51, the matching Claude line gets a lime underline and its tag pops.
- *Text becomes pages.*
  - At "画面" @6.40 the spec card fades.
  - Claude's three lines detach and fly right (6.4–8.0). Each one grows into a paper page: its scaleY grows, it rotates into the stack, and its colour shifts from snow text to paper.
- *Riffle.* At "手" @8.64 the riffle starts: pages rotate about their top edge, 70 ms apart. The dots line up into motion and the dot appears to move. The riffle continues through the transition.

**Footage:** none (all code-drawn).

**SFX:** type ×3 short bursts (1.7–4.3, 0.2). Blip at the strike (2.4). Pop (3.5). Tick ×3 (4.2 / 4.8 / 5.5). Swish (6.4). Riffle = tick ×8 at 70 ms from 8.7 (0.15 each).

**Continuity:** the caret in Claude's bubble is the lime dot from s02. s04 zooms into the top page.

---

## s04_render — every page is computed: 画面 = render(t); 900 pages, the rule written once   (≈ 10.5 s · dark · zoom · energy 1)

**Voice**
- s04_render.1 (0.50–3.71) 代码视频也是手翻书，只是每页都靠算：
- s04_render.2 (3.93–6.56) 给规则一个时间，就还你那一刻的画面。
- s04_render.3 (6.84–9.93) 30 秒就是 900 页，规则却只写一次。

**On screen**
- *Phase 1–2.*
  - Left: one big page (paper card 760×428, x 140, y 210) with a light grid and the lime dot (r 26).
  - Under it: a scrubber (x 140–900, y 690). Track, ticks 0 / 1 / 2 / 3 s, a lime knob, and the readout (mono 30 px) "t = 1.50 s".
  - Right: `K.codeBlock` 26 px, width 800, at x 1000, y 210:
    ```js
    // 每一页，都由同一条规则算出来
    function render(t) {
      const x = 120 + 520 * ease(t / 3);
      const y = 214 - 90 * hop(t);
      dot(x, y);
    }
    ```
    `ease` = clamped outCubic; `hop(t)` = |sin πt|. The page really is drawn with this function, in the page's own coordinates (760×428).
  - Formula (H2 64 px) at x 1000, y 560: **画面 = render(t)** ("画面" in CN snow; `render(t)` in mono lime).
- *Phase 3.*
  - The 900-tile grid fills the left half (x 140–1040, y 230–800): 30 × 30 mini frames, 26×15 px each, 4 px gaps. Tile i draws `render(i/30 mod 3)`, so the grid shows a woven diagonal wave.
  - Right top, H3 44 px fog: 30 秒 × 每秒 30 页
  - Counter (`K.counter`, Space Grotesk 180 px lime): **900** followed by 「页」 at 64 px.
  - Right bottom: the code block, scaled 0.6, with badge (`K.tag`) 「规则：写 1 次」.
  - The grid gets badge 「画面：算 900 次」.
  - Small print (24 px fog): 不等于调用模型 900 次

**Visual**
- *Arrival.* The zoom lands on the top page of s03's riffle. By "手翻书" @1.73 the page lies flat and fills the left slot.
- *Code.* "靠算" @3.31: the code types in (3.3–4.3).
- *Scrubbing.* "时间" @4.51: the knob scrubs t = 0.00 → 0.75 (4.6) → 1.50 (5.1) → 2.25 (5.6) → 1.50 (6.19). Each step re-draws the page. The number literals in the code flash orange (#F2B880) and a ghost annotation `render(1.50)` hovers next to `function`.
- *Formula.* "画面" @6.19: the formula lands (`K.title`, 0.6 s).
- *Grid.* "30 秒" @6.84: the page shrinks into tile 0. The grid cascades in row by row (6.9–7.8).
- *Count.* "900" @7.72: the counter rolls 0→900 by 8.2.
- *Rule.* "规则" @8.63: the code block slides in at right-bottom. "一次" @9.54: its badge pulses lime.

**Footage:** none.

**SFX:** tick on each scrub step (4.6 / 5.1 / 5.6 / 6.19). Soft whoosh (6.84). Counter ticks 7.7–8.2. Pop (8.2). Ding (9.54).

**Continuity:** the lime dot is the drawn object. Into s05 (wipe-up), the grid's tiles start streaming right; they become the packets of the pipeline.

---

## s05_crew — who flips the book: browser + FFmpeg; Opus = the whole crew; the work that says it   (≈ 13.5 s · dark · wipe-up · energy 1)

**Voice**
- s05_crew.1 (0.50–3.61) 浏览器逐页去算，FFmpeg 装订成片。
- s05_crew.2 (3.83–8.27) Opus 像整个摄制组：导演、程序员、剪辑一人包。
- s05_crew.3 (8.55–12.99) 有位作者，干脆把原理打进了片子：每一帧，都是代码。

**On screen**
- *Pipeline.* `K.flow` dark, nodes at y 330, each w 330 h 150:
  - A "Opus 5.5" sub "写规则" (x 330)
  - B "浏览器" sub "逐页计算画面" (x 960)
  - C "FFmpeg" sub "装订成视频" (x 1590)
  - Edge labels: A→B 「代码」, B→C 「900 张画面」
  - Under C at y 470: chip 「video.mp4」
- *Crew labels* under the nodes (22 px lilac tags): under B 「摄影机」, under C 「冲印师」.
- *Role badges* around A. Pills, 28 px CN, each with a simple SVG icon:
  - 「导演 · 写分镜」 (clapperboard)
  - 「程序员 · 写代码」 (`</>`)
  - 「剪辑 · 排时间轴」 (three timeline bars)
- *Phase 3.*
  - Caption, body 30 px fog, at x 160, y 420: 作品自己打出了这句话
  - H1 110 px 900 snow, two lines at x 160, y 480–720: **每一帧，** / **都是代码。**
  - Lime marker under 「代码」.
  - Video card 600×600 at x 1150, y 200, with credit "@twoclipping · 原作片段".

**Visual**
- *Browser.* "浏览器" @0.50: node B springs in. Edge A→B draws and three lime-dot packets travel it. "逐页" @1.08: B's sub-label flickers through a counter 0001→0900.
- *FFmpeg.* "FFmpeg" @1.97: node C springs in. Edge B→C draws and mini frame tiles (from s04) stream along it.
- *Binding.* "装订" @2.88: the tiles stack into a film-reel glyph, and 「video.mp4」 pops at 3.2.
- *Crew.*
  - "Opus" @3.83: the camera dollies toward A (scale 1→1.15 around A). "摄制组" @4.92: A gets a lime ring.
  - Badges pop at "导演" @5.76, "程序员" @6.39, "剪辑" @7.28.
  - "一人包" @7.72–8.03: the badges orbit 180° and snap into A. A's sub-label becomes 「导演＋程序员＋剪辑」.
- *Shared-element morph.*
  - 8.55: the whole diagram scales to 0.62 into the top-left corner (x 112–1000, y 140–400).
  - 8.6–9.0: the 「video.mp4」 chip morphs into the 600×600 video card.
  - From 9.0 the clip plays (clip-local 0 at scene 9.0). The H1 types per character as spoken.

**Sync**
- The clip's toast "✓ Every frame is code" appears at clip 12.0 → scene **11.4**, on "每" @11.45. The card then holds that last frame (from 11.83) to the end.
- H1 line 1 types at "每一帧" @11.45. Line 2 at "都是" @12.37. The marker sweeps at "代码" @12.65.

**Footage:** `q_l006_quote` (lists-006 9.6–12.43) as a square card. Credit "@twoclipping · 原作片段".
- Honesty: lists-006 is code-rendered by the author's account, so "每一帧，都是代码" is said over a code-rendered work.

**SFX:** pop (0.5, 1.97). Blip per packet. Shutter stack (2.88). Soft whoosh (3.83). Tick ×3 badges. Sparkle (7.9). Swish (8.6). Ding (11.4, 0.5).

**Continuity:** the H1 repeats the film's title, so the film has now named itself through someone else's work. Optional in the outgoing transition: the video card flies to the top-left wall slot that lists-006 occupies in s06.

---

## s06_wall — "the difference is directing"; from 1,704 videos, eight lessons   (≈ 9.5 s · dark · wipe · energy 2)

**Voice**
- s06_wall.1 (0.60–3.65) 原理一样，炫不炫，差在导演功夫。
- s06_wall.2 (3.90–8.76) 我们从 WaytoAGI 收录的 1704 条视频里挑了 8 个，一个一招。

**On screen**
- *Wall.* `K.wall` 10×6, tw 158, th 89, gap 12 → 1688×594 at x 116, y 200. Remember the gosail-072 tile swap (global rules).
- *Overlay* over a 70 % night scrim: H1 110 px 900 snow, centred: **差在导演功夫**
- *Counter* (centre, Space Grotesk 200 px lime): **1,704**
  - Label below (H3 44 px snow): 条视频案例
  - Note (body 30 px fog): 截至 10 月 1 日 WaytoAGI 收录 · 案例库共 5,181 条
  - WaytoAGI logo (`LOGO_DARK`, 48 px high) above the counter.
- *Eight-card row* at y 690–797: 8 cards of 190×107, gap 22, x 123–1797. Each card has its number tag (mono 22 lime) 01–08 and a label below (22 px snow):
  - 「一个形状」「几条规则」「先写分镜」「真实数据」「真实界面」「产品不动」「动作驱动」「模型分工」
- *Footnote* (20 px fog) at y 852: 缩略图来自 WaytoAGI 案例库，版权归各作者 · 收录作品并非都由 Opus 代码渲染

**Visual**
- *Wall reveal.* Tiles pop 0.3–1.5 (`wall.render(t, {start: 0.3, spread: 1.2})`).
- *Scan.* "炫不炫" @1.58: a lime scan line sweeps left→right (1.6–2.4) and tiles brighten as it passes.
- *Thesis.* "导演" @2.98: the scrim and H1 land, then exit at 3.85.
- *Counter.* "WaytoAGI" @4.35: the logo fades in. "1704" @5.68: the counter rolls 0→1,704 (5.68–6.6, outCubic) while the wall dims to 25 %.
- *Selection.* "挑" @7.34: the counter shrinks to the top-left (x 140, y 150, 72 px). The wall returns, 52 tiles dim to 15 %, and 8 featured tiles lift (scale 1.12, lime 3 px outline) as the lime dot hops across them (8 hops in 0.8 s).
- *Table of contents.* "一个一招" @8.17: the 8 tiles fly into the numbered row (spring) and the labels appear. 9.0–9.5: card 01 scales toward the case-1 card position (zoom transition).

**Footage:** wall thumbnails only.
- Featured cards use our clip frames (global rules).
- No "drawn by code" claim is made over the wall.

**SFX:** soft tick cascade (0.3–1.5). Swish (1.6). Soft impact (2.98). Counter ticks (5.7–6.6). Pop (7.34). Blip ×8 (hops). Whoosh (8.17).

**Continuity:** the 8-card row is the syllabus of chapter 02; its card 01 becomes s07's footage card. The same eight thumbnails return in s15.

---

### Case scenes (s07–s14): shared notes

- **Template.** `"template": "case"`, `"file": "case"` (src/scenes/case.js). Layout per the template:
  - 16:9 card 1000×562 at x 132–1132, y 234–796; 1:1 card 620×620; 9:16 card 372×662; all centred at (632, 515).
  - Right column at x 1212, from y 146.
  - Series dots under the card.
- **Timing.** The template places `secret` on the cue's first word, `points` on their cues, `takeaway` at line 3, and the caveat 0.5 s after the takeaway.
- **Template SFX:** swish 0.05, pop at line 1 + 0.2, blip at the takeaway.
- **Voice pattern (teacher rhythm).** Line 1 "第N招：<lesson>". Line 2 is the evidence, described as it is on screen. Line 3 "照搬：<how to copy>".
- **Clip timing.** All clip sequences were timed against the measured words. The listed clip lengths sum to the scene length (holds of ≤ 1.8 s are noted).

## s07_case1 — 第一招: one shape through the whole film (lists-006)   (≈ 11.5 s · dark · zoom from card 01 · energy 2)

**Voice**
- s07_case1.1 (0.40–2.65) 第一招：一个形状贯穿全片。
- s07_case1.2 (2.87–7.52) 按钮变成播放器，进度条又变成开关，眼睛只跟着它。
- s07_case1.3 (7.74–11.11) 照搬：先定主角，再把变化排上节拍。

**On screen** (template data)
- tag CASE 01 / 08
- work 「UI 形变循环」 · author @twoclipping · chip 「路线：代码生成与渲染」
- 炫在哪里: **一个形状贯穿全片**
- points:
  - 按钮→播放器→滑块→开关→图表
  - 视线只跟一个物体，从不迷路
- 可以照搬: 先定主角和它的状态，再把每次变化排上节拍
- caveat: “0 After Effects”为作者自述

**Visual:** one continuous clip, no cuts inside the card, because that is the lesson. The aspect is 1:1. The card holds the last crisp frame (the "19,204" chart card) for 1.8 s while the takeaway animates.

**Sync** (cues: secret ["s07_case1.1","一个"] @1.24; point 1 line 2 @2.87; point 2 ["s07_case1.2","眼睛"] @6.40; takeaway line 3 @7.74)
- 0.4–2.65: Generate → loader → check → island → player all happen during line 1.
- "开关" @5.66: the switch is on screen (clip 5.3–6.2).
- "眼睛" @6.40: tabs (Day/Week/Month), then the chart unfolds (7.25).

**Footage:** `l006_case` lists-006 0.0–9.7 (9.7 s), 1:1 card. Credit "@twoclipping · 原作片段".

**SFX:** template default.

**Continuity:** the template's lime series pill continues the lime dot. Next: push.

## s08_case2 — 第二招: style = a few rules; the only warm colour is saved for the climax (gosail-060)   (≈ 10.5 s · dark · push · energy 2)

**Voice**
- s08_case2.1 (0.40–2.77) 第二招：风格只定几条规则。
- s08_case2.2 (2.99–5.70) 只有纸和墨，暖色只留给那束光。
- s08_case2.3 (5.92–9.91) 照搬：把手绘感写成纸色、墨色、留白。

**On screen**
- CASE 02 / 08 · 「墨滴手绘短片」 · @morpheusdv · 「路线：代码生成与渲染」
- 炫在哪里: **风格只定几条规则**
- points:
  - 只用纸色和墨色，画面一笔笔长出来
  - 唯一的暖色，只留给高潮那束光
- 可以照搬: 把手绘感拆成纸色、墨色、留白这些能检查的规则
- caveat: 参考图未公开；纯 JS 为作者自述

**Sync** (secret @1.27 "风格"; point 1 @2.99; point 2 "暖色" @4.28; takeaway @5.92)
- **Key hit.** The warm ring sweeps across the card at clip 49.25 → scene 4.05, one beat before the word "暖色" @4.28.
- "那束光" @5.14–5.45: the rebuilt world and its sun.
- From 5.8 the tree clip runs, black and white again, under "纸色" @7.87 (the line becomes a trunk), "墨色" @8.58 (branching) and "留白" @9.35 (leaves).

**Footage:**
- `g060_light` 45.2–51.0 (5.8 s): calm chaos → the glow in the hand → ring sweep → reorganised world.
- `g060_tree` 19.9–24.6 (4.7 s): one stroke grows into a tree.
- 16:9 card, credit "@morpheusdv · 原作片段". No hold.
- Teacher note: the hook already teased the light; now the viewer sees *why* it is warm.

**SFX:** template default, plus an optional soft sparkle at 4.05 (0.25).

**Continuity:** push to case 3.

## s09_case3 — 第三招: storyboard first, check every scene; layers you can fix separately (uc-0962)   (≈ 11.5 s · dark · push · energy 2)

**Voice**
- s09_case3.1 (0.40–3.28) 第三招：先写分镜，每场自查。
- s09_case3.2 (3.50–7.57) 画面、旁白、配乐分层，哪层不对改哪层。
- s09_case3.3 (7.79–10.98) 照搬：先定讲解顺序，再想怎么画。

**On screen**
- CASE 03 / 08 · 「AI 历史短片」 · @kimmonismus · 「路线：代码生成与渲染」
- 炫在哪里: **先写分镜，每场自查**
- points:
  - 画面、旁白、配乐分成三层
  - 哪层不对改哪层，再合回时间轴
- 可以照搬: 先定讲解顺序和事实，再决定每个概念怎么画
- caveat: 做法出自公开提示；工具栈为作者自述

**Sync** (secret "先" @1.39; point 1 @3.50; point 2 "不对" @6.45; takeaway @7.79)
- "the" ignites at 0.5.
- The words fly into a ring and the golden attention web weaves (scene 3.0–7.0) under line 2.
- From 7.5 the dot-matrix earth with "the" at its centre plays under line 3.

**Footage:**
- `u0962_web` 13.5–21.0 (7.5 s)
- `u0962_earth` 150.4–154.4 (4.0 s): it starts after the horizontal flash; a soft lens streak remains.
- 16:9 card, credit "@kimmonismus · 原作片段".

**SFX:** template default.

**Continuity:** push to case 4.

## s10_case4 — 第四招: build the scene from real data (uc-1377)   (≈ 10.5 s · dark · push · energy 2)

**Voice**
- s10_case4.1 (0.40–2.95) 第四招：用真实数据搭场景。
- s10_case4.2 (3.17–7.16) 山丘来自高程数据；地图讲行军，地面给情绪。
- s10_case4.3 (7.38–10.10) 照搬：只写导演意图和禁区。

**On screen**
- CASE 04 / 08 · 「奥斯特里茨战役」 · @WinterArc2125 · 「路线：代码生成与渲染」
- 炫在哪里: **用真实数据搭场景**
- points:
  - 山丘来自公开的高程数据
  - 地图讲清行军，地面镜头给情绪
- 可以照搬: 提示只写导演意图和不想要的效果，技术交给模型
- caveat: 耗时为作者自述；地形高度放大了 3 倍

**Sync** (secret "用" @1.33; point 1 @3.17; point 2 "地图" @5.16; takeaway @7.38)
- The terrain relief map runs under "真实数据". Red arrows grow from 3.0.
- The cut to the ground-level sun lands at 6.0, just before "地面" @6.35.

**Footage:**
- `u1377_map` 105.5–111.5 (6.0 s)
- `u1377_sun` 172.5–177.0 (4.5 s)
- Both clips have the 2.35:1 letterbox cropped out (`crop 1920:820:0:130`). Cover-fit keeps the centre 76 % of the width.
- Credit "@WinterArc2125 · 原作片段".
- Avoid 3:29–3:35 (pixelation); not used.

**SFX:** template default.

**Continuity:** push to case 5.

## s11_case5 — 第五招: every selling point is proven by the real interface (gosail-072)   (≈ 10.0 s · dark · push · energy 2)

**Voice**
- s11_case5.1 (0.40–3.03) 第五招：卖点都有真实界面作证。
- s11_case5.2 (3.25–6.29) 先核对网站，再按使用路径排镜头。
- s11_case5.3 (6.51–9.41) 照搬：观众怎么用，镜头就怎么排。

**On screen**
- CASE 05 / 08 · 「网站宣传片」 · @aiwarts · 「路线：真实素材＋代码」
- 炫在哪里: **卖点都有真实界面作证**
- points:
  - 先读网站代码和线上页面
  - 按使用路径排镜头：看到、搜索、深入
- 可以照搬: 观众怎么用产品，镜头就怎么排；竖屏要单独排版
- caveat: 片中收录作品属各自作者；“一次直出”为自述

**Visual:** four excerpts follow the product film's own user path: home → search → prompt page → brand. Clip lengths 1.5 / 1.5 / 2.0 / 4.05 s, so our cuts land on beats (1.5, 3.0, 5.0), which echoes the case's own beat-locked editing. The end card is static from ~6.4 (clip 27.3) and its last frame is held 0.95 s.

**Sync** (secret "卖点" @1.39; point 1 @3.25; point 2 "路径" @5.15; takeaway @6.51)
- The site's own "溯源 · 已核对" box (red frame) appears at clip 23.0 → scene 4.05, under "核对网站" @3.58–4.2.
- "GoodCase.ai" types itself at 5.05–5.35.

**Footage** (16:9 card, credit "@aiwarts · 原作片段"):
- `g072_grid` 3.7–5.2: headline 「从作品结果，回到作者与方法。」 and the 1318 stats box taking its orange outline.
- `g072_search` 13.0–14.5, **cropped to 1067×600 top-left**: sticker 「搜 威尼斯」, typing in the search box, filter chips. The crop keeps the large third-party thumbnails out.
- `g072_prompt` 21.95–23.95: the prompt page and the 「已核对」 red box.
- `g072_end` 25.95–30.0: brand card GoodCase.ai / goodcase.ai.
- Deliberately **not used:** 2.0–3.65 (the full-screen Seedance video by @Just_sharon7), 6.95–11.45 (the montage of third-party works) and 17.0–20.3 (the detail page playing the Venice video).

**SFX:** template default.

**Continuity:** push to case 6.

## s12_case6 — 第六招: the product never changes, only the performance does (gosail-054)   (≈ 11.0 s · dark · push · energy 2)

**Voice**
- s12_case6.1 (0.40–3.19) 第六招：产品不动，只换演出。
- s12_case6.2 (3.41–7.31) 同一个 3D 模型换出几种风格，机身始终一致。
- s12_case6.3 (7.53–10.62) 照搬：模型锁死，只改镜头和光。

**On screen**
- CASE 06 / 08 · 「手机概念 PV」 · @yoshifujidesign · 「路线：固定 3D 资产」
- 炫在哪里: **产品不动，只换演出**
- points:
  - 同一个 3D 模型，换出几种风格
  - 机身比例始终一致，不走样
- 可以照搬: 模型、Logo、配色锁死，只让 AI 改镜头、光线和转场
- caveat: 片中参数为虚构；渲染工具未公开

**Sync** (secret "产品" @1.37; point 1 @3.41; point 2 "机身" @6.14; takeaway @7.53)
- The orange "RENDER xx%" scan line turns the line art photoreal at scene 0.75–2.5, under "产品不动，只换演出".
- At 3.45, the cut to the pastel *plume* version lands on "同一个 3D 模型 … 几种风格". The phone flips at 7.45–7.95.
- From 9.75, three colourways stand side by side under "只改镜头和光".

**Footage:**
- `g054_scan` gosail-054 18.5–21.95
- `g054b_line` gosail-054-b 0.0–6.3: the handwritten line writes "allure" around the phone.
- `g054b_trio` gosail-054-b 23.5–25.3
- 9:16 card, credit "@yoshifujidesign · 原作片段".
- gosail-054-pre1 / pre2 are not used (not in the library; pre1 flashes).

**SFX:** template default.

**Continuity:** push to case 7.

## s13_case7 — 第七招: let motion drive the effects; honest about who made what (uc-2348)   (≈ 12.0 s · dark · push · energy 2)

**Voice**
- s13_case7.1 (0.40–2.70) 第七招：让动作驱动特效。
- s13_case7.2 (2.92–8.52) 据作者，舞者和歌是生成的；Opus 取出骨架，让文字和光跟着动作走。
- s13_case7.3 (8.74–11.71) 照搬：挑两三个动作，各绑一种效果。

**On screen**
- CASE 07 / 08 · 「舞蹈骨架特效」 · @aicreataro · 「路线：素材编辑与合成」
- 炫在哪里: **让动作驱动特效**
- points:
  - 先取骨架坐标，再驱动文字和光
  - 举手挂歌词，出拳射文字
- 可以照搬: 只挑两三个动作，各绑一种效果，用完就收
- caveat: 作者自述：歌用 Suno，舞者用 MiniMax

**Sync** (secret "让" @1.30; point 1 "骨架" @6.13; point 2 "文字" @6.93; takeaway @8.74)
- Lyrics start growing from the raised hand at 1.67, while line 1 is spoken.
- "据作者，舞者和歌是生成的" (2.92–4.94) is spoken over the dancer herself: the honest label goes where the generated material is.
- The skeleton-only frame (red stick figure plus wrist coordinates) shows at 5.29–5.70, on "取出骨架". The landing burst follows at 5.75.
- The HIKARE / light-dot section runs under "文字和光跟着动作走".
- "TARGET LIGHT LOCKED" on the raised fist appears at 9.79, under "挑两三个动作".

**Footage** (16:9 card, credit "@aicreataro · 原作片段"; holds 0.375 s):
- `u2348_lyric` 2.0–7.292 (after the 0–1.8 s strobe teaser)
- `u2348_skel` 8.667–9.5 (stops before the bright transition frame at 9.583)
- `u2348_hikare` 25.5–31.0
- Avoided: 0–1.8 s and 15.79–16.33 s (photosensitive), and the one-frame glitches at 11.54 / 12.25 / 12.75 / 19.58 / 20.0 s.
- The voice never says "drawn by code" in this scene.

**SFX:** template default. No added hits on the magenta burst; the footage is loud enough visually.

**Continuity:** push to case 8.

## s14_case8 — 第八招: assign each shot the right tool; a fixed stage hides the scene changes (gosail-133)   (≈ 12.0 s · dark · push · energy 2)

**Voice**
- s14_case8.1 (0.40–2.77) 第八招：按镜头给模型分工。
- s14_case8.2 (2.99–8.01) 据作者，动作、布景、背景各交一个模型，Opus 用代码统筹。
- s14_case8.3 (8.23–11.41) 照搬：每个镜头写清工具和合格标准。

**On screen**
- CASE 08 / 08 · 「五幕舞台短片」 · @KanaWorks_AI · 「路线：多模型制作」
- 炫在哪里: **按镜头给模型分工**
- points:
  - 动作、布景、背景微动，各交一个模型
  - Opus 用代码统筹，精细控制归它
- 可以照搬: 先搭固定舞台，每个镜头写清输入、工具和验收标准
- caveat: 分工为作者自述；便宜稳定不是排名

**Sync** (secret "按" @1.36; point 1 @2.99; point 2 "统筹" @7.57; takeaway @8.23)
- The curtain opens at 1.0.
- Under "布景" @4.31 / "背景" @4.90: the La Ville set, with birds crossing the sky.
- The curtain closes at 5.42 and reopens on Le Jardin at 6.29, under "Opus 用代码统筹".
- "照搬" @8.23: the dancer's jump; the curtain closes behind it (8.17–8.54). La Nuit opens at 9.17.

**Footage:** `g133_main` gosail-133 0.0–12.0, one continuous 720p excerpt (upscaled into the 1000 px card). Credit "@KanaWorks_AI · 原作片段".
- No hard cut inside, which is the lesson.
- Never described as "drawn by code".

**SFX:** template default.

**Continuity:** the formula iris opens from this card's centre (632, 515). The card shrinks into mini-card 08 of s15.

---

## s15_formula — consolidate eight lessons into one formula: 好看 = 导演功夫, not a model that paints   (≈ 11.5 s · dark · iris from the case card · energy 3)

**Voice**
- s15_formula.1 (0.60–8.03) 这 8 招，归成一个公式：一条主线，几条规则，一根时间轴，卡准声音，反复检查。
- s15_formula.2 (8.31–10.89) 好看不靠会画画，靠导演功夫。

**On screen**
- *Top row.* 8 mini case cards (168×95, frames per global rules) at y 160–255, x 162–1758, gap 36. Number under each (mono 20 lime): 01 … 08.
- *Equation row* (y 430–580):
  - 「炫」 (hero 180 px 900 lime) at x 140, then 「＝」 (120 px snow) at x 340.
  - Five term cards (230×150, `--night-2`, 2 px border, radius 22) at x 460–1770, with 「＋」 (56 px fog) between them. Each card: term (40 px 800 snow) + sub (22 px fog).
    - 「一条主线」 01 · 03 · 08
    - 「几条规则」 02 · 04 · 05 · 06
    - 「一根时间轴」 01 · 03
    - 「卡准声音」 01 · 07
    - 「反复检查」 03 · 后面教你
- *Correction (y 640–720).*
  - Left: dashed pill 「会画画」 (H3 44 px fog) with a strike line.
  - Under the five cards: a lime bracket and 「＝ 导演功夫」 (H2 64 px lime).
- *Wink* (Smiley Sans 30 px lilac) beside the 「一条主线」 card, with the lime dot on the card's corner: 本片的主线：这颗绿点
- *Footnote* (20 px fog) at y 852: 注：案例 05、07、08 最像大片的画面来自现成素材或生成模型；Opus 负责设计、代码与编排（据作者）

**Visual**
- *Eight cards.* "这 8 招" @0.60: the 8 mini cards drop in (50 ms stagger); card 08 arrives from s14's shrinking card.
- *Equation.* "公式" @2.11: 「炫 ＝」 lands.
- *Terms.* Each term card pops on its word, and lime SVG threads draw (0.5 s, `K.drawPath`) from the source mini-cards down into it:
  - "主线" @3.18 (threads from 01, 03, 08; the wink appears)
  - "规则" @4.20 (02, 04, 05, 06)
  - "时间轴" @5.22 (01, 03; tiny scrubber icon)
  - "声音" @6.51 (01, 07; beat icon pulsing on `ctx.beatTime`)
  - "检查" @7.57 (from 03; its sub 「后面教你」 lights lime as a bridge to chapter 03)
- *Correction.* "会画画" @9.12–9.28: the 「会画画」 pill appears and is struck. "导演" @10.20: the bracket draws and 「＝ 导演功夫」 lands.

**Footage:** none (mini cards are stills from our clips, credited by the s06 footnote style). Repeat the footnote line 「缩略图版权归各作者」 small at the right end of the top row.

**SFX:** pop ×5 on the terms (0.35). Ticks for the threads. Small glitch on the strike (9.2). Impact (0.5) at 10.2, the chapter's peak. The music engine adds the riser into chapter 03.

**Continuity:** the 「反复检查」 card glows last. As the wipe to light comes in, it becomes the first worksheet page.

---

## s16_setup — 第一步: prepare an AI environment that can run code   (≈ 10.0 s · light · wipe · energy 1)

**Voice**
- s16_setup.1 (0.60–5.59) 轮到你了。第一步，准备 Claude Code 这类能跑程序的 AI 环境。
- s16_setup.2 (5.81–9.64) 它会写代码、跑渲染、看截图，要付费账号。

**On screen** (light "paper" grid; ink text; green accents; lime only as marker fills)
- *Opening line.* H1 110 px 900 ink, centred (0.6–1.8): **轮到你了。**
- *Header.* Step tag (`K.tag` light) 「STEP 1 / 5」 at x 140, y 150. H2 64 px 800 ink at y 200: **第一步 · 准备环境**
- *Terminal.* `K.terminal` light, w 1000, h 300, at x 140, y 320, title 「终端」, 24 px mono:
  ```
  # macOS / Linux / WSL
  $ curl -fsSL https://claude.ai/install.sh | bash
  $ claude --version      # 能看到版本号就装好了
  ```
  Chip under the terminal (24 px ink-2): Windows PowerShell：irm https://claude.ai/install.ps1 | iex
- *Checklist.* `K.checklist` light, w 600, size 40, at x 1180, y 330:
  1. **Claude Code** — 能写代码、跑渲染、看截图
  2. **付费账号** — Pro 起；免费版不含 Claude Code
  3. **Node.js** — 运行网页渲染工具
  4. **FFmpeg** — 把画面编码成视频
- *Footnote* (20 px ink-2) at y 846: Claude Code 需 Pro、Max、Team、Enterprise 或 Console 账号；仅在 Anthropic 支持的国家和地区提供

**Visual**
- *Opening.* 「轮到你了。」 per-char rise at 0.6. At "第一" @1.82 it scales down and slides into the header slot (the text morphs into 「第一步 · 准备环境」).
- *Install.* "Claude" @2.87: the terminal slides up (40 px, 0.6 s) and types the curl line (typeDur 1.2). Checklist row 1 appears.
- *Abilities.* Three inline icons light next to row 1, drawn in SVG (no emoji): `</>` at "写代码" @6.05, ▶ at "跑渲染" @6.85, a frame icon at "看截图" @7.87. The `claude --version` line types at 6.0.
- *Ticks.* Row 1 ticks at 8.0. "付费" @8.99: row 2 appears and ticks (9.2), and the footnote fades in. Rows 3 and 4 appear at 9.3 / 9.45 and tick at 9.6 / 9.75.

**Footage:** none.

**SFX:** pop (1.82). Type (2.9–4.1, soft). Tick ×4 on the checklist ticks.

**Continuity:** the green dot is the checklist's tick marker and slides to the metro-map start in s17. The wipe bar is green on light.

---

## s17_route — 第二步: choose a route (real commands on screen)   (≈ 11.0 s · light · wipe-up · energy 1)

**Voice**
- s17_route.1 (0.50–5.69) 第二步选路线：字幕、图表、界面，用 HyperFrames 或 Remotion。
- s17_route.2 (5.91–10.53) 想要现成风格，装 Lemo-Opuscar；本片用的是纯网页渲染。

**On screen**
- *Header.* 「STEP 2 / 5」 + H2 **第二步 · 选一条路线**.
- *Metro map* (SVG, x 140–790, y 320–820).
  - Trunk from (160, 570) to a junction at (330, 570). Use-case chips on the trunk (24 px): 「字幕」「图表」「界面」.
  - Four branches end at station dots (x 470). Labels at x 500 (28 px 800 ink), each with a sub (22 px ink-2):
    - S1 y 360: **HyperFrames** — 写网页 · Apache 2.0
    - S2 y 500: **Remotion** — 写 React · 小团队免费
    - S3 y 640: **Lemo-Opuscar** — 风格插件 · MIT
    - S4 y 780: **纯网页＋无头浏览器** — 本片同款
- *Terminal.* `K.terminal` light, w 980, h 420, at x 820, y 320, 24 px mono. Content per route (clear, then type; 0.25 s per line, 0.08 s stagger):
  - HyperFrames
    ```
    $ claude plugin marketplace add heygen-com/hyperframes
    $ claude plugin install hyperframes@hyperframes
    # 或手动：
    $ npx hyperframes init my-video
    $ npx hyperframes render --output out.mp4
    ```
    Note: 需 Node 22+ 与 FFmpeg · 默认开启匿名遥测，可关闭
  - Remotion
    ```
    $ claude plugin marketplace add remotion-dev/claude-code-plugin
    $ claude plugin install remotion@remotion
    # 或手动：
    $ npx create-video@latest --yes --blank --no-tailwind my-video
    $ npx remotion render MyComp out/video.mp4
    ```
    Note: 个人与 3 人以内团队免费；更大的公司需购买许可
  - Lemo-Opuscar
    ```
    $ claude plugin marketplace add lemomo-ai/lemo-opuscar
    $ claude plugin install lemo-opuscar@lemolab
    > 用水彩风格做一支 20 秒短片，先给我看分镜
    ```
    Note: 默认直接出片，记得先说“给我看分镜” · 需 Node 20+、ffmpeg、Python 3.11+
  - 纯网页
    ```
    $ npm i puppeteer
    $ node render.mjs     # 每帧 renderFrame(i/30) 后截图
    $ ffmpeg -framerate 30 -i frames/%05d.png \
        -c:v libx264 -pix_fmt yuv420p out.mp4
    ```
    Note: 本片用 Playwright 驱动无头 Chrome，原理相同
  - Route notes sit under the terminal (22 px ink-2, x 820, y 760–820, up to 2 lines).
- *Final chip* (22 px) at 10.6: 完整命令见 WaytoAGI 原文

**Visual**
- *Trunk.* The green dot travels the trunk. Use-case chips pop at "字幕" @1.63, "图表" @2.29, "界面" @3.00.
- *Stations.* Each named route: the dot runs its branch (0.4 s), the station lights, and the terminal re-types.
  - HyperFrames at @3.94
  - Remotion at @5.18
  - Lemo-Opuscar at "Lemo" @7.47; the `> … 先给我看分镜` line gets a lime marker fill.
  - 纯网页 at "纯" @9.71, plus a 「本片同款」 marker.

**Footage:** none. Command sources: research/tools.md (`npx hyperframes` / Remotion create+render tested on this machine; plugin commands from the official docs; raw route tested in research/tools-check/raw-route/).

**SFX:** pop ×3 (chips). Blip ×4 (stations). Soft type during typing.

**Continuity:** the green dot keeps travelling. Wipe-up turns the terminal "page" over to the requirements document.

---

## s18_prompt — 第三步: fill in a template; before/after #1 (style words → checkable rules); first round = 3 deliverables   (≈ 15.5 s · light · wipe-up · energy 1)

**Voice**
- s18_prompt.1 (0.50–6.31) 第三步，套模板写需求：给谁看，记住什么，多长，哪些不能改。
- s18_prompt.2 (6.59–10.65) 风格别写高级感，写能检查的规则：每屏一个主信息。
- s18_prompt.3 (10.93–15.20) 最关键：第一轮只要分镜、三张风格帧和一个小样。

**On screen**
- *Header.* 「STEP 3 / 5」 + H2 **第三步 · 套模板写需求**.
- *Document.* `K.windowFrame` light, w 1000, h 640, at x 140, y 230, title 「需求.txt」. Body CN 26 px / 1.55, ink; ［］ slots in --green 700:
  1. 我要为［新同事］做一支［自我介绍］视频。
  2. 看完要记住：［我做数据可视化，也爱跑步］
  3. 规格：［20 秒］［16:9］［1920×1080］［每秒 30 帧］
  4. 已有素材：［一张头像、三个关键词］
  5. 参考：［某支 UI 动效，只借鉴它的转场］
  6. 必须保持：［名字和头像］
  7. 允许发挥：［镜头、转场、背景］
  8. 风格：高级感、电影感
  9. 规则：两种字号 · 每屏一个主信息 · 强调色只给高潮
  10. 先列出缺口；分清代码画面、已有素材和生成素材。
  11. 本轮只交：分镜表、三张风格帧、一个短镜头小样。
  - Caption under the doc (20 px ink-2): 模板改写自 WaytoAGI 原文「一份可以直接改写的制作提示」
- *Right column, phase 2* (x 1220–1780). Two code-drawn mini frames, 520×292:
  - BEFORE at y 250. A cluttered frame: four fonts, three colours, five small messages. Tag (22 px ink-2): ✗ 高级感？看不出对错
  - AFTER at y 570. One message, two type sizes, one green accent. Tag (22 px green): ✓ 每屏一个主信息
- *Right column, phase 3.* Three deliverable cards (560×180, white, shadow) at y 250 / 450 / 650:
  - 「分镜表」: a mini 4-column table 时间 | 画面 | 文字 | 声音
  - 「三张风格帧」: three tiny frames labelled 开头 · 中间 · 结尾
  - 「一个小样」: a player bar ▶ 0:03 · out.mp4 ✓
  - Then a stamp (rotated −8°, green 3 px outline, 36 px 900 green): 确认了，再做全片

**Visual**
- *Camera.* The document pans and zooms slightly (scale 1.0→1.12) to keep the active line near y 450. The active line gets a lime marker fill behind the ink (`K.marker`).
- *Line highlights.*
  - "模板" @1.54: the doc slides in.
  - "给谁看" @2.86 → line 1. "记住" @3.80 → line 2. "多长" @4.65 → line 3. "哪些不能改" @5.49 → line 6 (line 7 dims alongside).
- *Before.* "高级" @7.37: line 8 gets an ink strike-through and the BEFORE frame appears.
- *After.* "写能检查" @8.17–8.87: line 9 types in and the AFTER frame appears. "每屏" @9.64: the rule 「每屏一个主信息」 gets a green check and the AFTER frame pulses.
- *First round.* "最关键" @10.93: the camera pans to line 11 (marker) and the right column clears. Cards arrive at "分镜" @12.57, "三张风格帧" @13.30–14.03 (its three thumbnails pop in turn) and "小样" @14.81. The stamp lands at 15.10.

**Footage:** none.

**SFX:** pop (doc). Tick per highlighted line. Blip on the strike (7.4). Type (8.2–8.8). Swish ×3 (cards). Ding (stamp 15.1).

**Continuity:** the green dot is where every marker sweep starts. Wipe-up turns to step 4.

---

## s19_feedback — 第四步: before/after #2: "再炫一点" vs 时间点＋问题＋期望   (≈ 12.0 s · light · wipe-up · energy 1)

**Voice**
- s19_feedback.1 (0.50–4.70) 第四步，反馈写成：时间点、问题、期望。
- s19_feedback.2 (4.92–10.80) 别说再炫一点，要说：第 8 到 11 秒，标题没读完就消失，请延长停留。

**On screen**
- *Header.* 「STEP 4 / 5」 + H2 **第四步 · 反馈三件套**.
- *Formula row* (y 300–410). Three slot cards (360×110, white, 2 px green outline, centred) with 「＋」 (56 px ink-2) between:
  - [⏱ **时间点**] ＋ [⚠ **问题**] ＋ [✓ **期望**]
  - Icons drawn in SVG; labels H3 44 px 800.
- *Tip line* (22 px ink-2) under the formula at y 440: 每轮只改一类：故事 → 构图 → 动作 → 声音
- *Left panel* (x 140–860, y 480–700). Label 「✗ 别这样说」 (24 px ink-2), corner tag 「示意」 (18 px).
  - User bubble: 感觉不对，再炫一点
  - Grey reply bubble: ……哪一段？哪里不对？
- *Right panel* (x 960–1780, y 480–700). Label 「✓ 这样说」 (24 px green). Its bubble is assembled from three chips:
  - [第 8–11 秒] [标题还没读完就消失] [请延长停留，压缩后面的空镜]
- *Bottom strip* (y 740–860).
  - 20-second scrubber (x 160–1760) with ticks 0 … 20 and the 8–11 s range filled green. The green dot is the playhead.
  - Mini preview (240×135) above the range shows a sample title 「我做数据可视化」 fading too early (before), then holding (after).
- *Closing tip* replaces the left panel (10.9–12.0), 26 px ink, with a mini filmstrip of 6 frames and a magnifier icon: 它看不了视频？让它抽关键帧来检查

**Visual**
- *Formula.* "反馈" @1.30: three empty outlined slots. They fill at "时间点" @2.46, "问题" @3.44, "期望" @4.25. The tip line fades in at 4.7.
- *Don't.* "别说" @4.92: the ✗ panel appears (user bubble at 5.0, reply at 5.6), with a small ✗ stamp.
- *Do.* "要说" @6.17: the ✓ panel opens.
  - "第 8 到 11 秒" @7.16: chip 1 flies from slot 1 into the bubble, the scrubber range lights and the playhead jumps to 0:08.
  - "标题" @8.33 – "消失" @9.18: chip 2 flies in, the preview shows the title vanishing at 0:09.5, and a red-ish flag (#C0392B at 70 %, used only here) appears.
  - "请延长停留" @9.87–10.41: chip 3 flies in, the preview now holds the title, and a green check appears (10.5).
- *Close.* 10.9: the ✗ panel morphs into the closing tip.

**Footage:** none.

**SFX:** pop ×3 (slots). Blip (✗). Swish ×3 (chip flights). Tick (playhead jump). Ding (10.5).

**Continuity:** the 20-second scrubber becomes the homework timeline in s20 (zoom).

---

## s20_first — the homework: your first piece is 20 seconds   (≈ 8.5 s · light · zoom · energy 1)

**Voice**
- s20_first.1 (0.50–4.76) 第一支就做 20 秒：一个主体，一个目标，一个转折。
- s20_first.2 (5.04–8.20) 做完以后，带声音看一遍，再用手机看一遍。

**On screen**
- Step tag 「STEP 5 / 5」 at x 140, y 150.
- *Homework card.* Paper white, 1180×600, x 300, y 210, perforated left edge, shadow. It settles from −1.5° to 0°.
  - Title (H2 60 px 900 ink, green dot bullet): **第一支作业 · 20 秒**
  - Timeline bar inside the card (x 360–1420, y 360–410), three segments with labels under them (26 px):
    - 0–3 秒 (green): 钩子：前 3 秒抓人
    - 3–15 秒: 一个主体 · 一个目标
    - 15–20 秒: 一个转折 · 呼应开头
  - Checklist inside the card, two rows of three (28 px, green ticks):
    - ✓ 分镜表 ✓ 三张风格帧 ✓ 一个小样
    - ✓ 带声音看一遍 ✓ 手机上看一遍 ✓ 保留工程
- *Phone frame* (260×520) slides in at x 1500, y 300 and overlaps the card's right edge. It plays a miniature of the homework timeline.

**Visual**
- *Bar.* "20 秒" @1.24: the bar draws 0→20 s. The 「钩子：前 3 秒抓人」 label appears at 1.7.
- *Segment labels.* "一个主体" @2.14 and "一个目标" @3.14 fill segment 2. "一个转折" @4.01 fills segment 3.
- *Checklist.* "做完以后" @5.04: row 1 ticks in quick succession (5.1 / 5.25 / 5.4), recapping steps 3–4.
- *Sound.* "带声音" @6.06: tick plus a speaker icon pulse.
- *Phone.* "手机" @7.49: the phone slides in; tick at 7.9.
- *Project.* 「保留工程」 ticks at 8.2 with a folder icon (no voice).

**Footage:** none.

**SFX:** pop (card). Tick ×6. Swish (phone). Ding (8.2).

**Continuity:** the last tick's green dot turns lime as the chapter wipe returns to dark.

---

## s21_meta — the secret behind chip 04: this film is made exactly this way   (≈ 14.0 s · dark · wipe · energy 3)

**Voice**
- s21_meta.1 (0.60–3.71) 揭个底：这支片子，也是这么做的。
- s21_meta.2 (3.99–9.58) 代码、时间轴、配乐程序，全是 Opus 5.5 写的，就在 Claude Code 里。
- s21_meta.3 (9.80–13.40) 浏览器算出每一帧，连我的声音，也是合成的。

**On screen**
- *Phase 1 — the page.* A paper page (880×495, centred) shows a DOM-rebuilt miniature of s02's title card (「每一帧，都是代码」 + dot). It flips over. On its back (`--night-2`, mono 22 px):
  - **Verbatim lines read at build time from `src/scenes/case.js` `render()`**. For example, the `const a = spring(t - 0.05, …)` and `tf(s.card.el, …)` lines. Do not paraphrase; trim with `…` if a line is too long.
  - Caption (24 px fog): 刚才 8 张案例卡的入场动画，就是这几行
- *Phase 2 — three panes* (each 530×330, y 300–630, x 140 / 695 / 1250), each with a label tag:
  - 「代码」: the case.js excerpt, path `src/scenes/*.js`
  - 「时间轴」: **this film's real timeline** drawn from `window.TIMELINE`. The 22 scene blocks are bars proportional to `dur`, coloured by chapter and labelled s01 … s22, with voice-line ticks. Path `src/timeline.js（由旁白时长生成）`.
  - 「配乐程序」: verbatim lines from `tools/music.py` (e.g. the `CHORDS = [` block and `def pad_note(`), with a code-drawn spectrum. Path `tools/music.py`.
  - Chip above the panes (H3 44 px): 「Claude Code · Opus 5.5」
- *Phase 3 — the timeline.*
  - The timeline pane expands to full width (x 140–1780, track at y 410). A lime-dot playhead runs from s01 to "now". Frame tiles peel off behind the playhead.
  - Stats row (y 600–690): numbers in Space Grotesk 64 px lime, labels 24 px snow:
    - **{{SCENES}}** 个场景 · **{{CODE_LINES}}** 行代码 · **{{FRAMES}}** 帧 · 渲染 **{{RENDER_MIN}}** 分钟
  - Waveform strip (y 470–530), drawn from `TIMELINE.lines` word timings.
  - Chip (22 px): 旁白：edge-tts 语音合成 · 字幕按语音逐字对齐
  - Playful tag (Smiley Sans 34 px lilac) at the waveform's end: 这句也是。

**Visual**
- *Page flip.* "揭" @0.60: the page flips (rotateY 0→180°, 0.7 s, inOutCubic, perspective 1600). The code reveals line by line (0.9–1.6).
- *Panes.* "这支片子" @1.71–2.0: a soft push-in on the code. The camera then pulls back and the panes pop at "代码" @3.99, "时间" @4.70 and "配乐" @5.54. The chip lands at "Opus" @6.94; "Claude" @8.69 underlines it.
- *Playhead.*
  - "浏览器" @9.80: the timeline expands and the playhead starts. It reaches the s21 block at about 11.0 and ends at (1728, 410) by 13.4, where s22's iris opens.
  - The stat numbers pop at 10.3–10.9.
- *Voice.* "声音" @11.91: the waveform lights up and the chip appears. "合成" @12.93: 「这句也是。」 pops.

**Footage:** none. All content is our own code and timeline. Placeholders are filled after render (on screen only).

**SFX:** whoosh (page flip 0.6). Type (0.9–1.6). Pop ×3 (panes). Impact (0.5) at "Opus" 6.94, the energy-3 peak. Tick stream while the playhead runs (every 0.25 s, 0.12). Sparkle (12.93).

**Continuity:** pays off the 「04 ？」 chip from s02 and the flip book from s03. The playhead dot is the same lime dot, and it hands off to s22's iris.

---

## s22_end — CTA: read the article, browse the atlas; the dot closes the book   (≈ 7.5 s · dark · iris from the playhead · energy 1)

**Voice**
- s22_end.1 (0.80–3.91) 完整文章和全部案例，都在 WaytoAGI。

**On screen** (chrome off; subtitles on until 4.06)
- *Background.* The 60-tile wall at 12 % opacity with a slow drift (gosail-072 tile swapped as in s06).
- *Logo.* WaytoAGI (`LOGO_DARK`, 72 px high), centred at y 250.
- *Article title.* H3 44 px 700 snow, two centred lines at y 360–470:
  - 《Opus 5.5 怎样把代码变成视频：
  - 8 个精选案例与制作经验》
- *Source* (body 30 px fog) at y 500: WaytoAGI 飞书知识库
- *URL* (mono 34 px lime) at y 580: waytoagi.com/usecase-atlas/opus5-5
- *Chips* (`K.tag`) at y 660: 「5,181 个案例」「视频 1,704 个」「截至 10 月 1 日 WaytoAGI 收录」
- *Final line* (from 4.4). H1 110 px 900 snow at y 740–850: **每一帧，都是代码** with the lime dot as its period.

**Visual**
- *CTA.* "文章" @1.15: the title lines rise. "全部案例" @1.72–2.05: the URL types itself and the chips pop. "AGI" @3.34: the logo pulses (scale 1.06).
- *Close.* 4.2: the CTA block eases up 40 px and dims to 85 %. 4.4: the final line rises.
- *Last frame.* 6.6–7.5: everything fades to night except the dot, which shrinks to nothing on the last frame.

**Footage:** none (wall thumbnails at 12 %).

**SFX:** iris whoosh. Pop ×3 (chips). Sparkle (4.4). Music outro on the last bar.

**Continuity:** the film closes on the object it opened with.

---

## Footage index

| clip id | source range (s) | scene | use | credit |
|-|-|-|-|-|
| h_g060_light | gosail-060 48.4–50.4 | s01 0.0–2.0 | full-bleed hook | @morpheusdv · 作者自述：代码渲染 |
| h_u0962_burst | uc-0962 46.4–47.9 | s01 2.0–3.5 | full-bleed hook | @kimmonismus · 作者自述：代码渲染 |
| h_l006_morph | lists-006 0.5–2.0 | s01 3.5–5.0 | full-bleed hook (centre crop) | @twoclipping · 作者自述：代码渲染 |
| h_u1377_sun | uc-1377 171.0–172.5 (letterbox crop) | s01 5.0–6.5 | full-bleed, then glyph dissolve | @WinterArc2125 · 作者自述：代码渲染 |
| q_l006_quote | lists-006 9.6–12.43 | s05 from 9.0, holds the toast | square card 600×600 | @twoclipping · 原作片段 |
| l006_case | lists-006 0.0–9.7 | s07 | case card 1:1 | @twoclipping |
| g060_light / g060_tree | gosail-060 45.2–51.0 / 19.9–24.6 | s08 | case card 16:9 | @morpheusdv |
| u0962_web / u0962_earth | uc-0962 13.5–21.0 / 150.4–154.4 | s09 | case card 16:9 | @kimmonismus |
| u1377_map / u1377_sun | uc-1377 105.5–111.5 / 172.5–177.0 (letterbox crop) | s10 | case card 16:9 | @WinterArc2125 |
| g072_grid / g072_search / g072_prompt / g072_end | gosail-072 3.7–5.2 / 13.0–14.5 (crop 1067×600 top-left) / 21.95–23.95 / 25.95–30.0 | s11 | case card 16:9 | @aiwarts |
| g054_scan / g054b_line / g054b_trio | gosail-054 18.5–21.95 / gosail-054-b 0.0–6.3 / 23.5–25.3 | s12 | case card 9:16 | @yoshifujidesign |
| u2348_lyric / u2348_skel / u2348_hikare | uc-2348 2.0–7.292 / 8.667–9.5 / 25.5–31.0 | s13 | case card 16:9 | @aicreataro |
| g133_main | gosail-133 0.0–12.0 | s14 | case card 16:9 | @KanaWorks_AI |

- Original audio is never used.
- Excluded ranges are respected: uc-2348 0–1.8 and 15.79–16.33; gosail-054-pre1 / pre2 not used; gosail-072 2.0–3.65 (@Just_sharon7's Seedance video) and the third-party montage 6.95–11.45 avoided.

## Honesty checklist (how each risky claim is handled)

- **"Opus makes video."** Never said. s03 says the opposite on voice and screen ("不直接生成视频，只输出文字"), citing the model docs.
- **"Drawn by code" voice lines.** They play only over lists-006, gosail-060, uc-0962 and uc-1377 (s01 and s05), with "作者自述：代码渲染" on the hook credits.
- **Generated material is named in the voice.**
  - uc-2348: "据作者，舞者和歌是生成的".
  - gosail-133: "据作者 … 各交一个模型".
  - The s15 footnote names cases 05, 07 and 08.
  - gosail-072's third-party works are kept out or tiny, with a caveat.
- **Self-reports are labelled in caveats.**
  - 0 After Effects
  - pure JS
  - tool stack and time cost
  - "一次直出"
  - cheap / stable is not a ranking
- **No "one prompt → film".** s18 voices "第一轮只要分镜、三张风格帧和一个小样". s19 teaches iteration. The s17 Lemo line shows "先给我看分镜".
- **Data.** Every library number carries "截至 10 月 1 日 WaytoAGI 收录". The wall footnote says not every collected work is Opus code-rendered.
- **Access and licences.**
  - Paid plan is stated in voice (s16).
  - Region availability is on screen only, with no bypass advice.
  - Remotion licence and HyperFrames telemetry are footnoted (s17).
- **Our own pipeline (s21).** Only the true statements: Opus 5.5 in Claude Code wrote scene code, timeline and Python music; the browser renders frames; the voice is edge-tts; subtitles follow word timings. Counts are placeholders.

## Production notes and open items

- **TTS pronunciation.** Run `tools/asr_check.py` after the first mix. Watch:
  - "FFmpeg" (s05.1)
  - "Lemo Opuscar" (`say` used in s17.2)
  - "Way to AGI" (`say` used in s06.2 and s22.1)
  - "HyperFrames" / "Remotion" (s17.1)
- **Case template limits.** One credit per card; gosail-072 relies on the caveat. If a template change is allowed later, an optional `credit2` ("页面内作品：各自作者") would be cleaner.
- **Real code in s21.** The excerpts must be read from the real files at build time, so if `case.js` or `music.py` change, the reveal stays true.
- **Clip extraction.** `crop` entries in clips.json are passed straight to ffmpeg by `tools/extract_clips.py` (`crop=w:h:x:y`).
- **Length.** If the final cut must lose ~5 s, cut s17's terminal hold and s05's crew badges first. Keep the formula (s15) and both before/after demos; they are this draft's reason to exist.
