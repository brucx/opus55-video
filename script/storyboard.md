# 《每一帧，都是代码》 Opus 5.5 炫酷视频的秘密 ＋ 小白上手指南 · Final storyboard

**Base:** Draft A (hook and rhythm), with grafts from B (flip book, syllabus, before/after demos, homework card, formula
threads, footage hygiene) and C (X-ray of our own frame, self-printing code, honesty bridge, 2×2 route cards, film
timeline with real word stamps, "去做你的第一支吧"). Rationale and every must-fix resolution: `script/decisions.md`.

**Measured runtime: 4:06.0 (246.00 s)** with the real TTS (`tools/build_timeline.py`, zh-CN-YunxiNeural +6 %),
22 scenes, 58 lines, 1,248 caption characters, 82 subtitle cues (max 18 visible characters, none shorter than 0.7 s).
Hook: footage moves from frame 0; the first claim is complete at 2.61 s.

All times below are **scene-local seconds** read from the built `src/timeline.js` (same numbers as `ctx.cue()` and
`ctx.word()` return). Code must use `ctx.word(lineId, token)` / `ctx.cue(lineId)`, never these literals. Word tokens are
quoted exactly as the TTS split them (for example `5.5 只`, `14 秒`, `8 到 11 秒`, `你的第一`).

| # | scene | start | dur | ch | in-transition | energy | one idea |
|-|-|-|-|-|-|-|-|
| 1 | s01_cold | 0.00 | 8.00 | 00 | cut (first frame) | 3 | code-rendered shots; the footage types "Every frame is code" |
| 2 | s02_title | 8.00 | 8.50 | 00 | cut (match cut on the bar) | 3 | X-ray of this very frame; the toast becomes our title and syllabus |
| 3 | s03_text | 16.50 | 10.50 | 01 | wipe 0.6 | 1 | Opus 5.5 outputs text; engines paint |
| 4 | s04_render | 27.00 | 17.00 | 01 | zoom 0.6 | 1 | flip book: page = draw(t); this scene's own code; 900 frames ≠ 900 model calls |
| 5 | s05_wall | 44.00 | 11.00 | 02 | wipe 0.6 | 2 | "差在导演功夫"; 1,704 cases → 8 tricks |
| 6 | s06_c1 | 55.00 | 11.00 | 02 | zoom 0.6 (sfx off) | 2 | case 1 lists-006: one form through the film |
| 7 | s07_c2 | 66.00 | 10.50 | 02 | push 0.6 (sfx off) | 2 | case 2 gosail-060: warm colour only at the climax |
| 8 | s08_c3 | 76.50 | 10.00 | 02 | push 0.6 (sfx off) | 2 | case 3 uc-0962: picture, voice, music as layers |
| 9 | s09_c4 | 86.50 | 11.00 | 02 | push 0.6 (sfx off) | 2 | case 4 uc-1377: real data as the constraint |
| 10 | s10_c5 | 97.50 | 11.00 | 02 | push 0.6 (sfx off) | 2 | honesty bridge + case 5 gosail-072: user path = storyboard |
| 11 | s11_c6 | 108.50 | 10.50 | 02 | push 0.6 (sfx off) | 2 | case 6 gosail-054: product fixed, performance changes |
| 12 | s12_c7 | 119.00 | 11.50 | 02 | push 0.6 (sfx off) | 2 | case 7 uc-2348: motion drives effects (据作者) |
| 13 | s13_c8 | 130.50 | 12.00 | 02 | push 0.6 (sfx off) | 2 | case 8 gosail-133: models split the work (据作者) |
| 14 | s14_formula | 142.50 | 13.50 | 02 | iris 0.7 | 1 | not "Opus paints": directing = 5 terms; you direct, it codes |
| 15 | s15_env | 156.00 | 11.50 | 03 | wipe 0.6 | 1 | step 1: an AI environment that runs code |
| 16 | s16_routes | 167.50 | 17.50 | 03 | wipe-up 0.6 | 1 | step 2: four routes, real commands (2×2, scrolls one row) |
| 17 | s17_prompt | 185.00 | 12.00 | 03 | wipe-up 0.6 | 1 | step 3: filled template; style words → checkable rules |
| 18 | s18_sample | 197.00 | 6.00 | 03 | wipe-up 0.6 | 1 | step 4: storyboard, 3 style frames, a sample first |
| 19 | s19_feedback | 203.00 | 11.50 | 03 | wipe-up 0.6 | 1 | step 5: 时间点＋问题＋期望, before/after |
| 20 | s20_ship | 214.50 | 11.50 | 03 | wipe-up 0.6 | 1 | step 6: checks; homework 15–30 s |
| 21 | s21_meta | 226.00 | 13.50 | 04 | wipe 0.6 | 3 | the reveal: this film's real code, timeline, voice |
| 22 | s22_end | 239.50 | 6.50 | 04 | iris 0.7 at (960, 540) | 2 | CTA: read, browse, go make your first |

Chapters start at 0.0, 16.5, 44.0 (bar), 156.0 (bar) and 226.0 (bar), so the music's chapter impacts for 02, 03 and 04
land on downbeats.

---

## Global rules

**1. The through-object: the lime time playhead (lesson 01 applied to ourselves).** One lime pill (`--lime` #C9DF8D
fill, radius = height/2, ink `600 22px var(--mono)` tabular text) stands for *t*, the only input every frame depends on.
Where it carries a readout, the readout is the **real** time (`ctx.start + t`, or the local value a scrubber shows).
Appearances: s01 HUD playhead on a beat ruler → s02 X-ray scanline, then the toast-pill that becomes the title underline →
s03 the "文本" output chip → s04 scrubber playhead → s05 "第 1 招" marker → s06–s13 the template's active series dot →
s14 equation pills → s15–s20 the active step on the rail (lime fill, ink text: allowed on light as a marker fill) and
s19/s20 scrubber playhead → s21 playhead sweeping this film's timeline → s22 end ruler, reaching the right edge on the
last frame. **No voice line claims it**; it is there to be noticed, not announced.

**2. Transition grammar (each type has one meaning; no plain fades anywhere).**
- `cut`: frame 0, and the s01→s02 match cut on the 8.0 s bar line.
- `wipe` (lime bar; green on paper): chapter changes only (s03, s05, s15, s21).
- `zoom`: diving into something (s04 into the flip book, s06 into rack slot 01).
- `push`: the case carousel s07–s13, with `"sfx": false` because the template already swishes at 0.05 s.
- `iris`: synthesis and ending (s14 from case 8, s22 from the centred playhead).
- `wipe-up`: "next step" page turns in the worksheet chapter (s16–s20).
The outgoing scene keeps rendering past `ctx.dur` during the next scene's transition: hold the final state (clamp).

**3. Footage, credits, audio.**
- Every excerpt carries its credit chip while visible: `K.videoCard` credit `{author, note: '原作片段'}` in cards; in
  custom full-bleed scenes the same chip style at (112, 822).
- s01 adds a second chip per shot stating the provenance claim (see s01). Original audio is never used.
- `assets/wall/gosail-072.jpg` is @Just_sharon7's Seedance frame and is **never shown**: wherever the gosail-072 tile
  appears (s05 wall and rack, s14 mini cards) use `ctx.clipUrl('c5-072-brand', 0.65)`, @aiwarts's own GoodCase.ai card
  (checked: no third-party thumbnails before 0.8 s).
- Rack / mini-card thumbnails come from our clips, not posters: 01 `c1-006-morph`@1.9 · 02 `c2-060-light`@4.4 ·
  03 `c3-0962-web`@6.0 · 04 `c4-1377-sun`@3.5 · 05 `c5-072-brand`@0.65 · 06 `c6-054-render`@1.5 ·
  07 `c7-2348-hikare`@2.0 · 08 `c8-133-stage`@10.0.

**4. Honesty, as built.**
- "No frame was filmed / not one-click AI / every frame is code" is voiced only over code-rendered work, each shot
  labelled 「作者自述：画面由代码渲染」 (gosail-054 sits only under the first line and is labelled 「3D 数据渲染 · 工具未公开」).
- Generated material is named **in the voice**: the bridge before case 5 「后四招，画面里还用了现成素材或别的模型」, and
  「据作者，…」 in cases 7 and 8. Every case card carries a caveat; self-reports say 作者自述 / 据作者.
- No "one prompt → film": s17–s19 teach sample-first and timed feedback; s16 voices 「先给我看分镜」.
- Data: 「截至 10 月 1 日 WaytoAGI 收录」 is spoken in s05 and printed in s05 and s22. The wall footnote says not every
  collected work is Opus code-rendered.
- Paid plan is voiced; regions are on screen only, with no workaround. Remotion licence and HyperFrames telemetry are
  footnoted. Commands are footnoted 「命令出自各工具官方文档，2026-10-01 核对」.
- The meta scene says 「也是这么做的」 and credits 「案例片段：归原作者所有，逐段署名」. Our counts appear only as
  `{{FRAMES}} {{CODE_LINES}} {{RENDER_MIN}} {{SCENES}}` placeholders (on screen, filled by `E.fill()`).
- Code on screen is real: s04 prints its own `draw()` via `this.draw.toString()`; s21 reads `scenes/case.js` and
  `tools/music.py` verbatim (see s21 for how). Nothing is labelled 示意 unless it is an illustration (chat bubbles, the
  BEFORE/AFTER mock frames, the sample title in s19).

**5. Type and colour.** design.md tokens only. Dark scenes: `--night` + `grid-night`, snow text, lime accent, lilac/purple
secondary. Light scenes (03): `grid-paper`, ink text, green / green-deep accents, lime only as a fill behind ink.
H1 ≤ 12 CJK per line, body ≤ 24. Smiley Sans at most once per scene. No text in y < 112 or y > 900 while chrome or
subtitles are visible (s02's X-ray outlines around the engine's own chrome are the one deliberate exception: thin
outlines, with their text labels inside the content box).

**6. Shared drawing function.** s04 defines `draw(g, t, w, h)` (the page drawer). Reuse the same function (copy or a small
lib file) for the s18 sample card and the s19 sample preview, so the sample the viewer sees is literally the code the
viewer was shown.

---

## s01_cold — The footage answers the question: impossible-looking shots, then "Every frame is code"   (≈ 8.0 s · dark · cut · energy 3)

- **Voice:**
  - s01_cold.1 (0.25–2.61) 这些视频，没有一帧是拍出来的。
  - s01_cold.2 (3.00–4.84) 也不是 AI 一键生成的。
  - s01_cold.3 (6.00–7.62) 每一帧，都是代码。
- **On screen:** chrome off, subtitles on. No titles.
  - HUD tag (mono 600 20 px, fog, uppercase tracking .06em) at (112, 112): `WAYTOAGI · OPUS 5.5 案例`.
  - Beat ruler: hairline rgba(244,241,242,.28) from x 112 to x 1600 at y 160; beat ticks every 0.5 s (186 px per second),
    8 px tall; bar ticks at 0/2/4/6/8 s, 14 px tall, labelled `0s 2s 4s 6s 8s` (mono 18 px, fog 60 %).
  - Playhead: lime pill 132×40 `t = 0.00 s` riding x = 112 + 186·t (pill centre), ink mono 600 22 px, tabular.
  - Frame counter, right-aligned at x 1808, centred on y 160: `FRAME` (mono 20 px fog) + `00001` (Space Grotesk 700 28 px
    lime, 5 digits, value `floor(T × 30) + 1`).
  - Legibility gradient behind the HUD: y 0→260, rgba(18,16,17,.55)→0.
  - Credit row at (112, 822), chips 40 px tall, gap 12: chip 1 `@handle` + small lime `原作片段`; chip 2 (fog text on
    rgba(18,16,17,.6)) `作者自述：画面由代码渲染`, except the gosail-054 shot: `3D 数据渲染 · 工具未公开`. Chips swap on
    each cut (0.12 s fade).
  - From 7.25: a 10 px lime bar draws under the toast text (x 516→1136, y 604): the film's own accent arrives on 「代码」.
- **Visual (full-bleed 1920×1080, cover-fit, hard cuts on beats):**

  | time | clip (clip-local) | what you see | treatment |
  |-|-|-|-|
  | 0.00–1.00 | `co-060-ring` 0–1.0 | amber light in the character's hand; ring sweeps at 0.25–0.45; ink turns olive; new sun | push 1.00→1.04 |
  | 1.00–2.00 | `co-1377-sun` 0–1.0 | the sun breaking the mist over the ridge, a column marching | push 1.00→1.03 |
  | 2.00–3.00 | `co-054-render` 0–1.0 (9:16) | orange RENDER scanline turning line art into black glass | 608×1080 panel centred; backdrop = the same frame in a 192×108 `<img>` (blur 5 px, saturate 1.2) scaled ×10, darkened 40 % (the case.js ambient trick, inside the blur budget) |
  | 3.00–3.50 | `co-006-island` 0–0.5 | check → black pill stretches into the island, colour cover appears | none |
  | 3.50–4.00 | `co-0962-burst` 0–0.5 | golden attention network bursting into particles | none |
  | 4.00–6.50 | `co-006-cmdk` 0–2.5 | "Type a command"; types f-r-a-m-e (4.50–5.00); selects "Every frame is code" (5.30); Enter (5.50); collapses (5.80–5.95); toast arrives at 6.00 | 1.0× |
  | 6.50–8.00 | `co-006-cmdk` last frame (clip 2.467 = source 12.467) held | the full toast "✓ Every frame is code" | slow push 1.00→1.02 about (960, 540) |

  Measured toast geometry in this crop (needed by s02): pill x 314–1606, y 421–659 (1292×238, radius ≈119), black;
  white check disc Ø ≈80 at (426, 540); text left-aligned from x 516 to ≈1136 (≈ Inter 600 70 px); background ≈#ECEDE8.
- **Sync:**
  - Line 1 runs over shots 1–3 (none filmed). Line 2 starts exactly on the 3.00 cut, so 「不是 AI 一键生成」 plays only over
    lists-006 and uc-0962 (code-rendered by their authors' accounts).
  - 「每」 @6.00 = toast arrives = downbeat of bar 4 (source 12.0 s).
  - 「代码」 @7.25 → lime underline draws (0.35 s, outQuint, left→right).
  - On every cut the ruler's bar/beat tick under the playhead flashes lime for 0.2 s (no full-frame flashes).
- **Footage:** `co-060-ring` @morpheusdv · `co-1377-sun` @WinterArc2125 · `co-054-render` @yoshifujidesign ·
  `co-006-island` @twoclipping · `co-0962-burst` @kimmonismus · `co-006-cmdk` @twoclipping. Full-bleed, credits as above.
- **SFX:** boom 0.00 · shutter 1.00, 2.00, 3.00 · tick 3.50 · glitch (soft) 4.00 · type ×5 at 4.50/4.62/4.75/4.87/5.00 ·
  blip 5.30 · pop 5.50 · riser 4.00→6.00 · impact + sparkle 6.00 · swish 7.25.
- **Continuity:** out: the held toast frame, the HUD and the counter continue unchanged into s02's first frame; the engine
  chrome switches on with s02's downbeat.

## s02_title — "Including this frame": X-ray our own frame, then the toast becomes the title and syllabus   (≈ 8.5 s · dark · cut · energy 3)

- **Voice:**
  - s02_title.1 (0.25–1.72) 包括你现在看到的这一帧。
  - s02_title.2 (2.07–7.94) 用 Opus 5.5 做的视频，为什么这么炫？小白怎么做？一次讲明白。
- **On screen:** chrome on (chapter tag 「00 开场」, logo, progress bar), subtitles on.
  - X-ray labels (exactly three; mono 600 26 px, lime text on ink tabs, radius 6, padding 4×10, 1.5 px lime leaders):
    1. on the toast (outline box = the measured pill x 314–1606, y 421–659): `<img> 原作片段 · @twoclipping`, label at (314, 372).
    2. on the live subtitle box (computed, see Visual): `字幕 · 跟着语音时间戳出现`, label right-aligned at (1808, 846), leader down.
    3. on the progress bar (y 1074–1080): `进度条 · t ÷ 总时长`, label at (112, 846), leader down along x 140.
  - Hero (`K.title`, Noto Sans SC 900, 150 px, snow, one line, centred, cap box ≈ y 400–550): **每一帧，都是代码**
  - Underline: lime bar 1100×16 at y 600 (the stretched toast pill).
  - H3 (44 px 700, snow 85 %), centred at y 690: **Opus 5.5 炫酷视频的秘密 ＋ 小白上手指南**
  - Syllabus chips, one row centred at y 790 (52 px tall, gap 20), styled like the engine's chapter tag (lime mono number
    badge + 26 px CN label): `01 原理` · `02 为什么炫` · `03 小白上手` · `04 ？` (the 「？」 in Smiley Sans: this scene's one
    playful accent).
- **Visual:**
  - 0.00: s01's held toast frame and HUD. The engine chrome appears on the cut, on the downbeat: "the UI boots". A soft
    top gradient (y 0→200, rgba(18,16,17,.45)→0) keeps the dark-theme logo and tag readable on the warm grey frame until
    the iris.
  - 0.25–0.40: the HUD playhead's line extends to full frame height. 0.40–1.45: it sweeps left→right as a 3 px lime
    scanline with glow (inOutCubic). Behind it the frame turns into "code view": footage at 30 %, a 48 px lime grid at
    8 %, and 2 px lime outline boxes that draw themselves (`K.drawPath`, 0.3 s) as the line passes their x, each label
    popping (`K.pop`). The subtitle box is computed, never read from the DOM: take the current chunk from
    `window.TIMELINE.lines[].subs`, measure it in a hidden span with `600 44px var(--cn)` + .02em tracking, add 60 px
    padding; box centred, bottom at y 1028, height 83.
  - 1.45–1.95: hold; all three labels readable; the counter keeps counting.
  - 1.95–2.25: retract: labels, boxes and grid fade (0.3 s); footage back to 100 %; the HUD ruler fades out.
  - 2.07 「用」: blur handoff. The held footage frame cross-dissolves (0.15 s, 6 px blur on the outgoing) into our code
    replica of the toast built to the measured geometry (pill, check disc, Inter 600 ≈70 px text from x 516, #ECEDE8
    background, shadow `0 18px 40px rgba(0,0,0,.18)`). Check: mean absolute difference between the last footage frame and
    the first replica frame ≤ 3 % inside the pill box. Then the replica text blur-swaps (out 0.15 s, in 0.25 s) to
    「每一帧，都是代码」 (Noto Sans SC 900 60 px, white, still left-aligned after the check).
  - 2.38 「Opus」: the pill springs black→lime, text turns ink; an iris of `--night` + `grid-night` opens from the pill
    centre (radius 0→1150 px, outQuart 0.5 s). The warm grey world is gone.
  - 2.38–3.38: the lists-006 dual-spring stretch. Right edge stiffness 260 / damping 22, left edge 170 / 20, so the leading
    edge overshoots first. The pill widens to 1100 px and thins to 16 px, settling as the underline at y 600 on 「做」
    (3.38); the check disc shrinks away; the text lifts off and grows to the 150 px snow hero.
  - 3.57 「视频」: H3 rises (per character, 0.6 s).
  - 4.26 「为什么」: chips 01 and 02 pop (60 ms apart). 5.56 「小白」: chip 03. 7.44 「明白」: chip 04 with a ±4° wobble.
  - Whole frame drifts 1.00→1.02.
- **Sync:** 包括 0.25 scan starts · 帧 1.43 third label lands · 用 2.07 handoff · Opus 2.38 lime + iris · 做 3.38 underline
  settles · 视频 3.57 H3 · 为什么 4.26 chips 01+02 · 小白 5.56 chip 03 · 明白 7.44 chip 04.
- **Footage:** `co-006-cmdk` last frame only, until 2.22; credit chip 「@twoclipping · 原作片段」 stays until the image is
  gone. Everything after 2.07 is our own drawing.
- **SFX:** glitch (soft, 0.3) 0.25 · tick at each label pop · swish 2.07 · boom + sparkle 2.38 · rise_short 2.38→3.38 ·
  impact 3.38 · pop 4.26, 4.32, 5.56, 7.44.
- **Continuity:** in: the same held frame. Out: the lime underline is the last bright element when the lime chapter wipe
  crosses; it becomes s03's 「文本」 chip. The 「04 ？」 chip is an open loop, paid off by the 「04 幕后」 chapter (s21).

## s03_text — Principle 1: Opus 5.5 writes text; browsers and engines paint   (≈ 10.5 s · dark · wipe · energy 1)

- **Voice:**
  - s03_text.1 (0.48–4.67) 先看原理：Opus 5.5 只输出文字，不直接出视频。
  - s03_text.2 (4.89–9.96) 它写分镜、写代码、调工具，画画的是浏览器和图形引擎。
- **On screen:**
  - Model card (x 140–860, y 200–700, `--night-2`, radius 28):
    - `K.tag` 「ANTHROPIC 模型页」; title 「Claude Opus 5.5」 (H2 64 px 800 snow).
    - Row 「输入」 (body 32 fog) + chips 「文本」「图片」 (snow 2 px outline pills, 36 px).
    - Row 「输出」 + chip 「文本」: the lime pill (lime fill, ink 40 px 800). Ghost chip 「视频」 (fog, dashed 2 px) to its right.
    - Stamp (lilac 2 px outline, rotated −4°, 30 px 800 lilac): 「没有视频输出」.
    - Source line (mono 20 px fog): 「来源：Anthropic 模型概览，2026-10-01 核对」.
  - Right, `K.flow` (dark): nodes at x 1180: 「分镜」 sub 「镜头 · 时长 · 文字」 (y 300), 「代码」 sub 「render(t) 函数」 (y 480),
    「工具指令」 sub 「浏览器 · FFmpeg」 (y 660), each 300×120. Engine node 「浏览器 / 图形引擎」 (360×150, lilac 2 px border)
    at (1600, 480). Output tile 280×158 at (1600, 690): a dark mini frame with the lime ball, caption 「画面」 (mono 22).
- **Visual:**
  - Card rises 0.3–0.9 (outQuint, 40 px).
  - 「文字」 3.06 → the output pill pops (spring).
  - 「视频」 4.19 → ghost chip slides in (0.25 s); 4.40 a lime 4 px strike draws across it (0.2 s) with a ±4 px shake;
    4.50 the stamp drops; the source line fades in.
  - Line 2: a copy of the lime 「文本」 pill flies along an arc to x 1180 and splits into the three node cards (shared-object
    morph): 「分镜」 5.18, 「代码」 6.01, 「工具」 6.86.
  - 「浏览器」 8.40 → three edges draw into the engine node (0.6 s inOutCubic) carrying lime packets.
  - 「引擎」 9.52 → the output tile lights; its ball runs left→right on a 1.5 s loop driven by t.
  - Whole frame drifts −20 px in x over the scene.
- **Sync:** 文字 3.06 · 视频 4.19 (strike 4.40) · 分镜 5.18 · 代码 6.01 · 工具 6.86 · 浏览器 8.40 · 引擎 9.52.
- **Footage:** none.
- **SFX:** pop 3.06 · glitch (soft, 0.3) 4.40 · blip 5.18, 6.01, 6.86 · whoosh 8.40 · ding 9.52.
- **Continuity:** in: s02's underline is this lime 「文本」 pill. Out: the zoom into s04 lands on the output tile's ball,
  which is the ball on every page of s04's flip book.

## s04_render — Principle 2: a flip book where every page is computed; this scene's own code; 900 frames, code written once   (≈ 17.0 s · dark · zoom · energy 1)

- **Voice:**
  - s04_render.1 (0.48–4.76) 代码视频就像一本手翻书：给一个时间，就算出那一页。
  - s04_render.2 (4.98–7.20) 左边，就是这一幕自己的代码。
  - s04_render.3 (7.42–10.61) 30 秒，每秒 30 帧，就是 900 帧。
  - s04_render.4 (10.83–13.64) 但模型不用跑 900 次，代码只写一次。
  - s04_render.5 (13.86–16.36) FFmpeg 再把这些帧编成视频。
- **On screen:**
  - Flip book (phase A): 12 dark pages (`--night-2` cards 420×236, radius 10, faint grid) in a 3D stack (perspective 1600,
    rotateX 50°) centred at (1290, 420); page k is drawn by `draw(g, k × 0.25, …)`; caption 「手翻书」 (H3 44 snow) under it.
  - Preview: `K.windowFrame` 860×484 titled 「预览 · 一页」 at (948, 200), canvas = `draw(g, tPrev, 800, 410)`.
  - Scrubber (x 948–1808, y 712): track with ticks `0 1 2 3 s` (mono 20); playhead = the lime pill `t = 1.50 s`.
  - Determinism: a dashed lime ghost ring left where the dot was at t = 1.50; stamp 「同一帧 ✓」 (lime outline, 28 px 800);
    footnote (20 px fog, y 846): 「同一时刻、同一状态；换一台机器，像素仍可能有细微差别」.
  - Code panel (left, x 112–888, y 200): header line (mono 20 fog) `// src/scenes/s04_render.js · 本幕正在运行的代码`, then
    `K.codeBlock` 26 px, width 776, body = **`this.draw.toString()` verbatim** (≤12 lines; numbers orange, per k-code).
    Active-line bar: lime 16 % fill, 4 px lime left border. Reference implementation (the builder may adjust, but it must
    stay ≤12 lines, ≤ 44 characters per line at 26 px, and be the function that really draws every page and tile):
    ```js
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
    }
    ```
  - Phase C: the 900-tile grid at x 112–1012, y 250–820 (30 × 30 tiles of 26×15 px, 4 px gaps, one canvas); tile i is
    literally `draw(g, i / 30, 26, 15)`, so the grid shows a woven diagonal wave. Formula (H3 44 fog) 「30 秒 × 每秒 30 帧」;
    `K.counter` (Space Grotesk 200 px lime) 「900」 + unit 「帧」 (H2 72 snow), top-right x 1100–1808, y 230–430; chip
    (mono 24, lilac outline) 「1 页 ＝ 1 帧」.
  - Phase D: struck chip 「调用模型 900 次」 (body 30 fog, lime strike) under the counter; code card (the panel shrunk to
    360×200) at (1360, 560) with badge 「代码：写 1 次」 and a lime 「1」 (Space Grotesk 160 px).
  - Phase E: node 「FFmpeg」 (mono 34, lilac border) at (1500, 560); file chip 「video.mp4 · 00:30」 (mono 28) with a play
    triangle.
- **Visual (one focal point per phase):**
  - A (0–4.8): the zoom lands on the flip book. 「手」 1.90: riffle (pages turn about their top edge, 70 ms apart; the ball
    appears to move). 「时间」 3.20: scrubber + playhead appear, preview drawn at 1.50, ghost ring left behind. 「就算」 3.85:
    the top page lifts and flattens into the preview (0.5 s). Then the playhead scrubs 1.50→0.60 (3.95, spring 0.35 s) and
    back to 1.50 (4.35): the dot lands exactly inside the ghost ring → 「页」 4.54 stamp 「同一帧 ✓」 + footnote.
  - B (4.98–7.20): 「左边」 4.98: the code panel types in (4.98–5.90, `codeBlock.render(p)`); its active-line bar sits on
    the `const x` line and steps with the frame; the preview plays `draw(t)` live with the playhead running 0–3 s.
    「代码」 6.80: a lime marker sweeps under the header comment.
  - C (7.42–10.61): 「30 秒」 7.42: formula appears; the preview shrinks into tile 0 (0.5 s) and the grid cascades in row by
    row (7.5–8.4) while the code panel slides right and shrinks into the code card. 「每」 8.48: counter starts (0→900,
    outExpo) and lands on 「900」 10.01; the second 「帧」 10.34 (`ctx.word('s04_render.3', '帧', 1)`; the first 「帧」 is
    at 9.22): unit + chip 「1 页 ＝ 1 帧」.
  - D (10.83–13.64): 「900 次」 11.74: struck chip appears, strike draws at 12.0. 「一次」 13.29: the lime 「1」 lands on the
    code card and 30 thin lime lines fan from the card to the grid's 30 rows (one function feeding every frame).
  - E (13.86–16.36): 「FFmpeg」 13.86: the tiles stream right into the FFmpeg node, which pops. 「视频」 15.89: the file chip
    shoots out below and lands; the lime playhead pill parks on the chip's progress bar.
- **Sync:** 手 1.90 · 时间 3.20 · 就算 3.85 · 页 4.54 · 左边 4.98 · 代码 6.80 · 30 秒 7.42 · 900 10.01 · 900 次 11.74 · 一次 13.29 ·
  FFmpeg 13.86 · 视频 15.89.
- **Footage:** none.
- **SFX:** tick ×6 riffle from 1.90 (70 ms) · tick 3.95, 4.35 (scrub) · ding 4.54 · type (soft) 4.98–5.90 · rise_short
  8.48→10.01 · pop 10.01 · glitch (soft) 12.0 · impact (light) 13.29 · whoosh 13.86 · ding 15.89.
- **Continuity:** in: s03's ball. Out: chapter wipe; the parked lime playhead becomes s05's 「第 1 招」 marker. `draw()` is
  reused by s18 and s19.

## s05_wall — "The principle is easy; the difference is directing": 1,704 cases → 8 tricks   (≈ 11.0 s · dark · wipe · energy 2)

- **Voice:**
  - s05_wall.1 (0.48–3.69) 原理不难，炫不炫，差在导演功夫。
  - s05_wall.2 (3.91–8.37) 截至 10 月 1 日，WaytoAGI 收录了 1704 个视频案例。 (`say`: Way to AGI)
  - s05_wall.3 (8.59–10.34) 我们挑了 8 个，一个一招。
- **On screen:**
  - Wall: `K.wall` with all 60 `assets/wall` ids in manifest order, cols 10, rows 6, tw 160, th 90, gap 10 → 1690×590 at
    (115, 230). Tile row 5 / col 3 (gosail-072) = `ctx.clipUrl('c5-072-brand', 0.65)` **from the first frame**.
  - Thesis (H1 110 px 900 snow, centred at y 480) over a 70 % night scrim: **差在导演功夫**
  - Counter: `K.counter` Space Grotesk 220 px lime 「1,704」, centred, y 330–550; caption (H3 44 snow) 「个视频类案例」 at
    y 580; date line (24 px fog) 「截至 10 月 1 日 WaytoAGI 收录 · 全库 5,181 条」 at y 640.
  - Footnote (20 px fog, y 852): 「缩略图来自 WaytoAGI 案例库，版权归各作者 · 收录作品并非都由 Opus 代码渲染」
  - Rack: 8 slots 190×107, gap 18, centred, top y 600; labels 「01」…「08」 (mono 22 fog) above; slot images = the rack
    thumbnails (global rule 3); lime pill 「第 1 招」 (ink 26 px 800) under slot 01.
- **Visual:**
  - Wall pops in 0.2–1.6 (`wall.render(t, {start: 0.2, spread: 1.4})`).
  - 「炫不」 1.60: a lime scanline sweeps the wall left→right (1.6–2.4); tiles brighten as it passes.
  - 「导演」 2.98: scrim + H1 land (0.3 s); they exit 3.75–4.0.
  - 「截至」 3.91: scrim stays at 65 %; 「Way」 5.33: counter starts (outCubic) and lands on 「1704 个」 6.83 with caption and
    date line.
  - 「8 个」 9.03: scrim and counter lift (0.3 s); the 8 featured tiles (lists-006 r0c0, uc-0962 r0c4, gosail-054 r1c4,
    uc-2348 r1c6, gosail-133 r2c2, gosail-060 r2c7, uc-1377 r4c2, gosail-072 r5c3) scale to 1.12 with a lime 3 px outline
    and cross-fade to their rack thumbnails; the other 52 dim to 20 %.
  - 「一个」 9.71: the 8 fly into the rack (0.6 s inOutCubic, 40 ms stagger, in case order); the rest of the wall fades.
  - 「招」 10.06: 「第 1 招」 pops under slot 01. Last 0.6 s and through the outgoing zoom: the rack scales toward slot 01.
- **Sync:** 炫不 1.60 · 导演 2.98 · 截至 3.91 · Way 5.33 · 1704 个 6.83 · 8 个 9.03 · 一个 9.71 · 招 10.06.
- **Footage:** wall posters (credited by the footnote) + the eight rack frames from our clips. No "drawn by code" claim is
  voiced over the wall.
- **SFX:** tick ripple ×8 (0.2–1.6) · swish 1.60 · impact (soft) 2.98 · rise_short 5.33→6.83 · ding 6.83 · sparkle 9.03 ·
  whoosh 9.71 · pop 10.06.
- **Continuity:** in: s04's parked lime pill becomes 「第 1 招」. Out: zoom into slot 01; the template's lime series dot
  continues the marker.

---

### Case carousel (s06–s13): shared notes

- `"template": "case", "file": "case"`; all fields are in narration.json `data` (quoted verbatim below). Field budgets
  respected: work ≤ 10 CJK (《The First Spark》 measures 494 px < 600 px), secret one line, ≤ 2 points of ≤ 21, takeaway
  ≤ 36 (two lines), caveat ≤ 24.
- Voice refrain: L1 「第 N 招，<secret>。」 (secret cued on its first word) · L2 one piece of evidence, the points cued to its
  words · L3 「照搬：…」 raises the 可以照搬 box. Case 5 opens with the honesty bridge.
- Every on-screen point is cued to a spoken word that names it, or describes footage on screen at that moment (s08 has
  one point only for that reason).
- Clip order is chosen so the footage shows what is being said (maps below).
- SFX: template defaults only (swish 0.05, pop at L1 + 0.2, blip at the last line); transitions carry `"sfx": false`.
- Continuity: the lime rule, the lime 「炫在哪里」 secret and the lime 30×14 active series dot are identical in every case;
  the ambient blurred footage changes temperature each push (warm grey → cream → black-gold → sand → off-white →
  grey-blue → magenta → velvet).

## s06_c1 — Trick 1 (lists-006): one form runs through the whole film   (≈ 11.0 s · dark · zoom · energy 2)

- **Voice:** s06_c1.1 (0.48–2.70) 第一招，一个形体贯穿全片。 · s06_c1.2 (2.92–6.67) 从按钮到图表，14 秒一镜到底，一刀没剪。 ·
  s06_c1.3 (6.89–10.14) 照搬：先定贯穿对象，再排上节拍。
- **On screen (template):** CASE 01 / 08 · work 「无缝 UI 形变」 · @twoclipping · chip 「路线：代码生成与渲染」 · secret
  「一个形体贯穿全片」 · points 「按钮变播放器、图表、命令面板」, 「14 秒一镜到底，一刀没剪」 · 可以照搬 「先定贯穿对象和它的状态，
  排上节拍，每拍出一帧检查」 · caveat 「作者自述：全片是代码，未用 AE」.
- **Visual:** 1:1 card 620×620. `c1-006-morph` 0–9.6 (Generate click 0.25 → loader → check 1.0 → island 1.25 → player
  1.75 → drag 2.75 → volume 3.7 → over-stretch 4.8 → toggle 5.3 → tabs 6.3 → chart 7.25–9.5), last frame held to 11.0.
- **Sync:** secret 「一个」 1.33 (the island forming from the same black shape) · point 1 「按钮」 3.13 · point 2 「14」 4.27 ·
  takeaway 6.89 · caveat 7.39.
- **Footage:** `c1-006-morph`, credit 「@twoclipping · 原作片段」.
- **SFX:** template defaults.
- **Continuity:** dived in from rack slot 01. lists-006's black pill is the same pill that became our title in s02.

## s07_c2 — Trick 2 (gosail-060): warm colour is saved for the climax   (≈ 10.5 s · dark · push · energy 2)

- **Voice:** s07_c2.1 (0.48–2.58) 第二招，暖色只留给高潮。 · s07_c2.2 (2.80–6.71) 全片只有纸和墨，60 秒里，暖光只亮 9 秒。 ·
  s07_c2.3 (6.93–10.05) 照搬：把风格拆成几条能检查的规则。
- **On screen (template):** CASE 02 / 08 · work 「《The First Spark》」 · @morpheusdv · chip 「路线：代码生成与渲染」 · secret
  「暖色只留给高潮」 · points 「全片只有纸色和墨色」, 「60 秒里，暖光只亮 9 秒」 · 可以照搬 「把风格拆成几条能检查的规则，强调色省着用」 ·
  caveat 「作者自述纯 JS；提示另附参考图」.
- **Visual:** 16:9 card. 0–4.4 `c2-060-tree` (zoom crop; arc 0.1–1.85, trunk 2.1–2.6, branches 2.85–3.35, leaves 3.6–4.1,
  pure ink). 4.4–9.1 `c2-060-light` (amber glow from 4.6, release 6.6, ring sweep 7.35–7.55, ink to olive 7.6–8.0, world
  and sun 8.1–9.1). Hold to 10.5.
- **Sync:** secret 「暖色」 1.31 over black and white (the payoff waits) · point 1 「只有」 3.39 (tree growing in ink) ·
  point 2 「暖」 5.39 (the amber glow is on the card) · takeaway 6.93; the ring sweep (7.35) hits during 「照搬」.
- **Footage:** `c2-060-tree`, `c2-060-light`, credit 「@morpheusdv · 原作片段」.
- **SFX:** template defaults; optional sparkle 7.35 (gain 0.25).
- **Continuity:** amber → the gold of uc-0962.

## s08_c3 — Trick 3 (uc-0962): picture, voice and music are separate layers   (≈ 10.0 s · dark · push · energy 2)

- **Voice:** s08_c3.1 (0.48–5.04) 第三招，画面、旁白、配乐分层做，每层单独改。 · s08_c3.2 (5.26–9.13) 照搬：先写分镜，每场先出几张截图检查。
- **On screen (template):** CASE 03 / 08 · work 「AI 历史短片」 · @kimmonismus · chip 「路线：代码渲染＋语音合成」 · secret
  「画面、旁白、配乐分层做」 · one point 「每层单独改，再沿一条时间轴合成」 · 可以照搬 「先写分镜文档，每场先截 3 到 4 张图检查」 ·
  caveat 「工具栈与耗时为作者自述」.
- **Visual:** 16:9 card. 0–7.0 `c3-0962-web` ("the" ignites 0.5, sentence relights 3.0, words fly into a ring 3.5–4.0,
  golden attention web 4.5–7.0). 7.0–10.0 `c3-0962-burst` (network bursts 7.5, gathers into a glowing sphere).
- **Sync:** secret 「画面」 1.34 · point 「每」 4.04 (words fly into the ring as the layers are named) · takeaway 5.26.
  One point only: nothing on the card is left unspoken.
- **Footage:** `c3-0962-web`, `c3-0962-burst`, credit 「@kimmonismus · 原作片段」.
- **SFX:** template defaults.
- **Continuity:** gold particles → sand-gold terrain.

## s09_c4 — Trick 4 (uc-1377): real data as the constraint   (≈ 11.0 s · dark · push · energy 2)

- **Voice:** s09_c4.1 (0.48–3.02) 第四招，用真实数据当约束。 · s09_c4.2 (3.24–7.02) 地形来自高程数据，地图讲移动，地面给情绪。 ·
  s09_c4.3 (7.24–10.59) 照搬：提示只写意图，和你不想要什么。
- **On screen (template):** CASE 04 / 08 · work 「奥斯特里茨战役」 · @WinterArc2125 · chip 「路线：代码渲染＋开放数据」 · secret
  「用真实数据当约束」 · points 「地形取自公开高程数据，纵向放大 3 倍」, 「地图讲移动，地面镜头给情绪」 · 可以照搬 「提示只写导演意图和
  不想要的效果，先配旁白再排镜头」 · caveat 「作者自述：构建 90 分钟，渲染 4 小时」.
- **Visual:** 16:9 card, all clips cropped 16:9 from inside the letterbox. 0–3.0 `c4-1377-relief` (parchment map
  match-dissolves into terrain relief 1.2–1.95, tilts, blue unit blocks). 3.0–6.0 `c4-1377-arrows` (red arrows grow
  across the relief). 6.0–11.0 `c4-1377-sun` (the sun breaks the mist behind the ridge as the column advances).
- **Sync:** secret 「真实」 1.68, exactly as paper turns into elevation data · point 1 「地形」 3.24 (arrows on terrain) ·
  point 2 「地图」 5.08; 「地面」 6.17 lands just after the cut to the ground-level sun (6.0) · takeaway 7.24.
- **Footage:** `c4-1377-relief`, `c4-1377-arrows`, `c4-1377-sun`, credit 「@WinterArc2125 · 原作片段」 (the pixelated
  3:29–3:35 range is not used).
- **SFX:** template defaults.
- **Continuity:** sunlit sand → the off-white web page of case 5.

## s10_c5 — The honesty bridge, then Trick 5 (gosail-072): the user's path is the storyboard   (≈ 11.0 s · dark · push · energy 2)

- **Voice:** s10_c5.1 (0.48–4.62) 后四招，画面里还用了现成素材或别的模型。 · s10_c5.2 (4.84–7.00) 第五招，用户路径就是分镜。 ·
  s10_c5.3 (7.22–10.21) 照搬：每个卖点，配一段真实界面。
- **On screen (template):** CASE 05 / 08 · work 「网站产品宣传片」 · @aiwarts · chip 「路线：代码＋网站已有素材」 · secret
  「用户路径就是分镜」 · one point 「首页、搜索、复制提示词，都是真界面」 · 可以照搬 「每个卖点配一段真实界面；竖屏单独排版，别直接裁」 ·
  caveat 「网页卡片里是他人作品，非 Opus 生成」.
- **Visual:** 16:9 card. 0–2.4 `c5-072-home` (site header 「从作品结果，回到作者与方法。」, the 1318 stat box gets its
  orange frame; motion ends at 1.5, held). 2.4–4.07 `c5-072-search` (cropped to the search UI: sticker 「搜 威尼斯」, typing,
  click 搜索). 4.07–7.57 `c5-072-prompt` (inset crop: sticker 「完整 Prompt 一键复制」, copy click ≈4.67, zoom into the
  prompt with the site's red-boxed note). 7.57–11.0 `c5-072-brand` (GoodCase.ai card types in, button; small thumbnails
  pop from ≈8.37).
- **Sync:** during the bridge line the column shows only the header (tag, work, author, route chip, lime rule): the route
  chip 「代码＋网站已有素材」 is on screen while the voice names the shift. Secret 「用户」 5.74 · point 「分镜」 6.64 ·
  takeaway 7.22 (over the brand card) · caveat 7.72. The template's L1 pop (0.68) lands with the header; fine.
- **Footage:** `c5-072-home`, `c5-072-search`, `c5-072-prompt`, `c5-072-brand`, credit 「@aiwarts · 原作片段」. Not used:
  2.0–3.3 (@Just_sharon7's Seedance shot), 6.95–11.45 (third-party montage), 12.9–13.03 (@mech_eng_dev page),
  14.73–17.0 (the enlarged Venice video), 17.0–20.4 (details page with the third-party video).
- **SFX:** template defaults.
- **Continuity:** off-white UI → the warm grey drawing paper of case 6.

## s11_c6 — Trick 6 (gosail-054): the product stays fixed, only the performance changes   (≈ 10.5 s · dark · push · energy 2)

- **Voice:** s11_c6.1 (0.48–3.23) 第六招，产品不动，只换演出。 · s11_c6.2 (3.45–6.16) 同一个 3D 手机模型，换了几种风格。 ·
  s11_c6.3 (6.38–9.62) 照搬：模型锁死，只改镜头和光线。
- **On screen (template):** CASE 06 / 08 · work 「手机 3D 概念片」 · @yoshifujidesign · chip 「路线：已有 3D 数据＋多版风格」 ·
  secret 「产品不动，只换演出」 · points 「一条橙线扫过，线稿变成写实渲染」, 「同一模型换一版风格，机身看起来一致」 · 可以照搬
  「模型、Logo、配色锁死，只让 AI 改镜头、光线和转场」 · caveat 「片中参数为虚构；渲染工具未公开」.
- **Visual:** 9:16 card 372×662 (series dots at y ≈ 880: tight but inside). 0–3.0 `c6-054-line` (orange scanline draws the
  back line art bottom-up). 3.0–5.7 `c6-054-render` (RENDER xx% scan 3.35–5.1 turns line art into black glass and
  titanium). 5.7–10.5 `c6-054b-plume` (flat blue phone; a handwritten stroke circles it and writes "allure"; flips).
- **Sync:** secret 「产品」 1.39 · point 1 「模型」 4.45 (mid-scan) · point 2 「风格」 5.72 (the card switches to plume at
  5.70, on the word) · takeaway 6.38.
- **Footage:** `c6-054-line`, `c6-054-render`, `c6-054b-plume` (case gosail-054 only; pre1/pre2 never used), credit
  「@yoshifujidesign · 原作片段」.
- **SFX:** template defaults; optional swish 5.70 (style switch).
- **Continuity:** pastel blue → the black and magenta of case 7.

## s12_c7 — Trick 7 (uc-2348): let motion drive the effects   (≈ 11.5 s · dark · push · energy 2)

- **Voice:** s12_c7.1 (0.48–2.77) 第七招，让动作驱动特效。 · s12_c7.2 (2.99–7.50) 据作者，舞者和歌是生成的，骨架数据让歌词挂在手上。 ·
  s12_c7.3 (7.72–10.70) 照搬：挑两三个动作，各绑一种效果。
- **On screen (template):** CASE 07 / 08 · work 「舞蹈骨架 MV」 · @aicreataro · chip 「路线：生成素材＋AE 合成」 · secret
  「让动作驱动特效」 · points 「先给观众看骨架数据，再看效果」, 「举手挂歌词，落地炸光，握拳锁定」 · 可以照搬 「只挑两三个动作，各绑一种效果，
  用完就收」 · caveat 「据作者：舞者和歌由生成模型制作」.
- **Visual:** 16:9 card. 0–1.1 `c7-2348-hikare` from 0 (HIKARE letters, starfield). 1.1–1.93 `c7-2348-skel` (skeleton only
  on black; landing burst at 1.56; magenta 「光」). 1.93–7.22 `c7-2348-lyric` (synthwave stage; the dancer raises her hand
  and the lyric column 「まだ終わらない」 grows from the wrist; wrist coordinate boxes). 7.22–11.5 `c7-2348-hikare` from 1.1
  (fist raised, TARGET LOCKED ≈8.1; HIKARI fills).
- **Sync:** secret 「动作」 1.55 = the landing burst (1.56) · 「据作者」 2.99: provenance spoken over the dancer · point 1
  「骨架」 5.46 (wrist coordinate labels on screen) · point 2 「歌词」 6.50 (lyric column hanging from the hand) · takeaway
  7.72; 「握拳锁定」 is on screen at ≈8.1.
- **Footage:** `c7-2348-hikare`, `c7-2348-skel`, `c7-2348-lyric`, credit 「@aicreataro · 原作片段」. Excluded and avoided:
  0–1.8 and 15.79–16.33 (photosensitive), the 9.583 white frame, the 11.54 / 12.25 / 12.75 / 19.58 / 20.0 glitch frames.
  The single magenta landing (dark → bright → dark within 0.4 s) is one flash, below the 3-per-second limit.
- **SFX:** template defaults only; the footage is already loud.
- **Continuity:** magenta → orange velvet.

## s13_c8 — Trick 8 (gosail-133): several models, each owning one job; the set swaps behind the curtain   (≈ 12.0 s · dark · push · energy 2)

- **Voice:** s13_c8.1 (0.48–2.84) 第八招，多个模型，各管一段。 · s13_c8.2 (3.06–7.76) 据作者，Opus 写代码统筹，人物和布景交给生成模型。 ·
  s13_c8.3 (7.98–11.19) 照搬：每个镜头写清分工和验收标准。
- **On screen (template):** CASE 08 / 08 · work 「五幕舞台短片」 · @KanaWorks_AI · chip 「路线：多模型制作」 · secret
  「多模型各管一段」 · points 「Opus 管统筹，Seedance 管动作」, 「GPT Image 出布景，换景藏在幕后」 · 可以照搬 「先搭固定舞台，每个镜头写清
  输入、工具和验收标准」 · caveat 「分工为作者自述，不是模型排名」.
- **Visual:** 16:9 card, **one continuous take** `c8-133-stage` 0–10.833 (title, curtain opens 1.0–1.375; closes
  2.67–2.88, opens 3.5 on Paris; closes 5.42–5.75, the stage turns sage green behind it, 「CHAPITRE III · Le Jardin」,
  reopens 6.29 on the carrot garden; jump, closes 8.21–8.54; 「CHAPITRE IV · La Nuit」; opens 9.17 on the night sky),
  held to 12.0. No jump cuts.
- **Sync:** secret 「多个」 1.34 (curtain opening) · point 1 「Opus」 3.93 · point 2 「人物」 5.71, while the curtain is shut
  and the set swaps behind it (≈5.75–6.29): 「换景藏在幕后」 is literally on screen · takeaway 7.98; the night sky (9.17)
  opens during 「照搬」.
- **Footage:** `c8-133-stage` (720p source shown at 1000×562), credit 「@KanaWorks_AI · 原作片段」.
- **SFX:** template defaults.
- **Continuity:** out: iris into s14; card 08's thumbnail is the last mini card to land there.

---

## s14_formula — Synthesis: beauty is directing, not "Opus paints"; you direct, it codes   (≈ 13.5 s · dark · iris · energy 1)

- **Voice:**
  - s14_formula.1 (0.56–3.63) 所以，好看不是因为 Opus 会画画。
  - s14_formula.2 (3.85–8.81) 而是叙事、规则、时间轴、声音，加上反复检查。
  - s14_formula.3 (9.03–12.69) 这是导演功夫：方向和反馈靠你，代码交给它。
- **On screen:**
  - Top row: 8 mini case cards (168×95, the rack thumbnails) at y 160–255, x 162–1758, gap 36; numbers 01–08 (mono 20
    lime) under each.
  - Struck phrase (H1 96 px snow, centred at y 380): 「Opus 会画画」.
  - Equation row (y 430–580): 「好看 ＝」 (H2 64 snow) at x 112; five term cards (230×150, `--night-2`, 2 px border, radius
    22) joined by 「＋」 (fog). Term (40 px 800 snow) + sub (22 px fog) = the cases it came from:
    「叙事」 01 · 03 · 05 · 「少量规则」 02 · 04 · 06 · 「统一时间轴」 01 · 03 · 「声音落点」 01 · 07 · 「反复检查」 03 · 08.
  - Threads: lime 2 px `K.drawPath` curves from each mini card down to its term(s).
  - Bracket under the five cards + 「＝ 导演功夫」 (H2 64 lime).
  - Role chips (28 px) at y 772: 「方向和反馈：你」 (lime fill, ink) and 「代码：Opus」 (lilac outline).
  - Footnote (20 px fog, y 852): 「注：案例 05、07、08 最像大片的画面来自现成素材或生成模型；Opus 负责设计、代码与编排（据作者）」
- **Visual:**
  - 0.2–1.0: the mini cards drop in (stagger 0.1); card 08 arrives from the shrinking iris.
  - 「Opus」 2.52: 「Opus 会画画」 types in. 「画画」 3.23: lime strike (0.2 s) + 4 px shake. 3.85: it falls away (0.4 s).
  - Terms land on 「叙事」 4.16, 「规则」 4.97, 「时间」 5.84, 「声音」 6.72, 「检查」 8.32: each card fills lime (ink text) on its
    word, its threads draw (0.4 s), then it settles back to outline (the newest stays lime). On 「检查」 the whole row glows
    once. The footnote fades in at 4.2 and stays.
  - 「导演」 9.29: bracket draws and 「＝ 导演功夫」 lands. 「方向」 10.33: chip 「方向和反馈：你」. 「代码」 11.94: chip 「代码：Opus」.
  - Hold with a slow push-in 1.00→1.03.
- **Sync:** Opus 2.52 · 画画 3.23 · 叙事 4.16 · 规则 4.97 · 时间 5.84 · 声音 6.72 · 检查 8.32 · 导演 9.29 · 方向 10.33 · 代码 11.94.
- **Footage:** mini cards only (frames from our clips; the footnote names the material sources).
- **SFX:** tick per card drop · glitch 3.23 · blip ×5 at the terms · ding 8.32 · impact (light) 9.29 · pop 10.33, 11.94.
- **Continuity:** in: iris from case 8. Out: the chapter wipe turns to paper; the lime 「方向和反馈：你」 chip becomes step 1's
  lime pill on the rail.

---

### Worksheet chapter (s15–s20): shared notes

- Theme light (`grid-paper`): ink text, green / green-deep accents, lime only as a fill behind ink.
- **Step rail** (y 150–198, centred, fixed layer above scrolling content): six pills 200×48, gap 24: 「1 环境」「2 路线」
  「3 需求」「4 小样」「5 反馈」「6 验收」. Inactive: white fill, 1.5 px `--line` border, ink-2 24 px. Active: lime fill, ink
  26 px 800, 260 px wide, with mono 16 px 「STEP n/6」 inside. At each scene start the lime pill springs from the previous
  slot to the current one (0–0.5 s) while the wipe-up turns the page under it.
- Headlines: H2 64 px 800 ink at x 112, y 222, where space allows.
- Commands are shown, never read aloud. `K.terminal({light: true})` / light code boxes on #F3F0F1; `$` in green.
- The sticker 「暂停就能抄」 (Smiley Sans 36 px, ink on a lime marker, −4°) appears in s15 and s16.

## s15_env — Step 1: an AI environment that can run code   (≈ 11.5 s · light · wipe · energy 1)

- **Voice:**
  - s15_env.1 (0.48–6.10) 轮到你了。第一步，准备一个能运行代码的 AI 环境，比如 Claude Code。
  - s15_env.2 (6.32–10.49) 再装 Node 和 FFmpeg。注意，它要付费账号。
- **On screen:**
  - Opening (0.48–1.7): H1 110 px 900 ink, centred: 「轮到你了。」
  - Rail: step 1 active. Headline: 「第一步 · 能运行代码的 AI 环境」.
  - Terminal (`K.terminal` light, 1040×340 at (112, 300), size 24, title 「终端」):
    ```
    $ curl -fsSL https://claude.ai/install.sh | bash
    $ claude --version      # 能看到版本号就装好了
    $ node --version
    $ ffmpeg -version
    ```
  - Under the terminal (mono 22 ink-2, y 664): 「Windows PowerShell：irm https://claude.ai/install.ps1 | iex」
  - Checklist (`K.checklist` light, size 38, w 600, at (1208, 300)): 1 「Claude Code」 sub 「需要付费账号（Pro 起）」 ·
    2 「Node.js 22+」 sub 「运行渲染脚本」 · 3 「FFmpeg」 sub 「把画面编成视频」.
  - Sticker 「暂停就能抄」 at (1500, 236).
  - Footnote (20 px ink-2, y 812–860, two lines): 「Claude Code 需要 Pro、Max、Team、Enterprise 或 Console 账号，免费版不含；」 /
    「仅在 Anthropic 支持的国家和地区提供，以官方页面为准。」
- **Visual:** 「轮」 0.48 H1 rises · 「第一」 1.70 the H1 shrinks into the headline slot while the rail's lime pill slides in
  from the left chasing the wipe bar · 「准备」 2.48 terminal slides up 40 px · 「Claude」 5.35 the curl line types (1.0 s)
  and checklist item 1 appears · 6.0 `claude --version` types · 「Node」 6.72 item 2 + `node --version`, tick 7.2 ·
  「FFmpeg」 7.35 item 3 + `ffmpeg -version`, tick 7.8 · sticker slaps on at 8.2 · 「注意」 8.69 footnote fades up ·
  「付费」 9.79 item 1 ticks and its sub gets a lime marker.
- **Sync:** 轮 0.48 · 第一 1.70 · 准备 2.48 · Claude 5.35 · Node 6.72 · FFmpeg 7.35 · 注意 8.69 · 付费 9.79.
- **Footage:** none.
- **SFX:** type (soft) during typing · tick per checklist tick · pop 8.2 (sticker) · pop 9.79.
- **Continuity:** in: s14's lime chip → rail pill. Out: wipe-up; the pill hops to step 2.

## s16_routes — Step 2: four routes, real commands on screen (2×2 grid, scrolls one row)   (≈ 17.5 s · light · wipe-up · energy 1)

- **Voice:**
  - s16_routes.1 (0.48–6.00) 第二步，选路线：HyperFrames 或 Remotion，适合做字幕、图表和界面。
  - s16_routes.2 (6.22–11.40) 想全部自己掌控，就像本片：用网页，加一个自动截图的浏览器。
  - s16_routes.3 (11.62–16.40) 想要现成风格，就装 Lemo-Opuscar，再加一句：先给我看分镜。 (`say`: Lemo Opuscar)
- **On screen:** rail step 2; H3 (40 px 800 ink) 「第二步 · 选一条路线」 at (112, 214); sticker 「暂停就能抄」 at (1560, 214).
  A 2×2 grid of white route cards (radius 20, 1.5 px line, 832×580, gap 32). Row 1 (A, B) at y 268–848; row 2 (C, D)
  starts below the frame and scrolls up at line 2. Each card: name (H3 44 px 800 ink) + chips, a sub line (26 px ink-2),
  a code box (mono 24 px, #F3F0F1, comments ink-2), a note (20 px ink-2). All commands are complete sequences.
  - **A · HyperFrames** · chips 「写网页动画」「Apache 2.0」 · sub 「适合字幕、图表、界面」
    ```
    # 装插件（推荐）
    $ claude plugin marketplace add \
        heygen-com/hyperframes
    $ claude plugin install hyperframes@hyperframes
    # 然后新开会话，用 /hyperframes 提需求
    # 或手动
    $ npx hyperframes init my-video
    $ cd my-video
    $ npx hyperframes render --output out.mp4
    ```
    note 「需 Node 22+ 与 FFmpeg · 默认开启匿名遥测，npx hyperframes telemetry disable 可关」
  - **B · Remotion** · chips 「写 React 组件」「内置 FFmpeg」 · sub 「适合字幕、图表、界面」
    ```
    # 装插件（推荐）
    $ claude plugin marketplace add \
        remotion-dev/claude-code-plugin
    $ claude plugin install remotion@remotion
    # 然后重启，用 /remotion-best-practices 提需求
    # 或手动
    $ npx create-video@latest --yes \
        --blank --no-tailwind my-video
    $ cd my-video && npm i
    $ npx remotion render MyComp out/video.mp4
    ```
    note 「个人与 3 人以内团队免费，更大的营利公司需购买许可」
  - **C · 网页＋自动截图的浏览器** · chips 「本片同路线」 (lime fill, ink) 「完全自己掌控」 · sub 「网页画面 → 浏览器逐帧截图 → FFmpeg 编码」
    ```
    $ npm init -y && npm i puppeteer
    # render.mjs 可以让 Claude Code 帮你写：
    # 逐帧调用 renderFrame(i / 30)，再截图
    $ node render.mjs
    $ ffmpeg -framerate 30 -i frames/%05d.png \
        -c:v libx264 -pix_fmt yuv420p out.mp4
    ```
    note 「本片用 Playwright 驱动无头 Chrome，6 路并行渲染，原理相同」
  - **D · Lemo-Opuscar** · chips 「风格插件」「43 种风格」「MIT」 · sub 「现成风格库，装好直接提需求」
    ```
    $ claude plugin marketplace add \
        lemomo-ai/lemo-opuscar
    $ claude plugin install lemo-opuscar@lemolab
    ```
    Chat bubble (light, user side; corner tag 「示意」, 26 px ink): 「用水彩笔刷风格，做一支 20 秒的短片，讲我家的猫。先给我看分镜。」
    A strip of 43 tiny swatches (two rows of 22/21, 30×30, seeded code patterns: brush, dots, stripes, gradient, grain).
    note 「需 Node 20+、ffmpeg、Python 3.11+；Windows 用 WSL；3D 风格要 GPU · 默认直接出片、30–60 秒，第一支可以要 15–30 秒」
  - Fixed footnote (20 px ink-2, y 862): 「命令出自各工具官方文档，2026-10-01 核对」
  - Widest line measured: 658 px at 24 px mono, inside the 776 px code box.
- **Visual:**
  - 0.3: cards A and B rise (stagger 0.15) with code already laid out at 35 % ink (readable on pause from the start).
  - 「HyperFrames」 2.02: A gets a 6 px green left border, scale 1.015, soft shadow; its code type-ons to full ink (0.6 s);
    B dims to 70 %. 2.5: the sticker slaps on. 「Remotion」 3.24: B highlights the same way.
  - 「字幕」 4.56 · 「图表」 5.10 · 「界面」 5.66: small use-case chips pop on both sub lines.
  - 「想」 6.22: the grid scrolls up 612 px (0.6 s, inOutCubic) under the fixed rail/H3 layer; row 2 now at y 268–848.
  - 「本片」 8.03: card C highlights, chip 「本片同路线」 stamps (`K.pop` from 1.4), its code types (0.8 s). 「浏览器」 10.85:
    its Playwright note fades in.
  - 「Lemo」 13.31: card D highlights, code types. 「句」 15.07: the chat bubble types (0.8 s). 「分镜」 16.06: a lime marker
    draws behind 「先给我看分镜」 (0.35 s).
- **Sync:** HyperFrames 2.02 · Remotion 3.24 · 字幕 4.56 · 图表 5.10 · 界面 5.66 · 想 6.22 (scroll) · 本片 8.03 · 浏览器 10.85 ·
  Lemo 13.31 · 句 15.07 · 分镜 16.06.
- **Footage:** none (the swatches are our own drawings).
- **SFX:** type (soft) under each code block · blip at each card highlight · pop 2.5 (sticker), 8.03 (chip) · swish 6.22
  (scroll) · ding 16.06.
- **Continuity:** in: rail 1→2. Out: wipe-up; rail 2→3; the lime marker motif carries into the template.

## s17_prompt — Step 3: a filled template; style words become checkable rules   (≈ 12.0 s · light · wipe-up · energy 1)

- **Voice:**
  - s17_prompt.1 (0.48–6.67) 第三步，套模板写需求。给谁看，记住什么，多长，哪些不能改。
  - s17_prompt.2 (6.89–10.94) 风格别写高级感，写能检查的规则：每屏一个主信息。
- **On screen:**
  - Rail step 3. Document `K.windowFrame` light 1040×620 at (112, 228), title 「需求.txt」, body 26 px / 1.55 ink, every
    ［…］ in green-deep 700:
    1. 我要为［新同事］做一支［自我介绍］视频。
    2. 看完要记住：［我做数据可视化，也爱跑步］
    3. 规格：［20 秒］［16:9］［1920×1080］［每秒 30 帧］
    4. 已有素材：［一张头像、三个关键词］
    5. 必须保持：［名字和头像］
    6. 允许发挥：［镜头、转场、背景］
    7. 风格：高级感、电影感  (struck)
    8. 规则：两种字号 · 每屏一个主信息 · 强调色只给高潮  (types in)
    9. 先列出缺口；不确定的，不要写成事实。
    10. 本轮只交：分镜表、三张风格帧、一个小样。
  - Caption under the window (20 px ink-2): 「模板改写自 WaytoAGI 原文「一份可以直接改写的制作提示」」
  - Right column (x 1216–1808): two code-drawn mini frames 560×315 (corner tag 「示意」). BEFORE (y 236): four fonts, three
    colours, five small messages; tag (22 px ink-2) 「✗ 高级感？看不出对错」. AFTER (y 572): one message 「我做数据可视化」, two
    type sizes, one green accent; tag (22 px green-deep) 「✓ 每屏一个主信息」.
- **Visual:** window slides up 0.3; lines fade in 0.4–1.4. 「需求」 2.11: lime marker under the window title. 「谁」 3.30
  line 1's slots marked · 「记住」 4.06 line 2 · 「多」 5.03 line 3 · 「不能」 6.20 lines 5–6 (must keep vs allowed).
  「高级」 7.67: line 7 gets an ink strike and BEFORE drops in. 「检查」 8.81: line 8 types in and AFTER drops in.
  「每屏」 9.93: 「每屏一个主信息」 gets a green check; AFTER pulses. 10.6–11.2: lines 9–10 get a soft underline sweep (no
  voice; there to be read on pause). The window pans gently (scale 1.00→1.05) to keep the active line near y 450.
- **Sync:** 需求 2.11 · 谁 3.30 · 记住 4.06 · 多 5.03 · 不能 6.20 · 高级 7.67 · 检查 8.81 · 每屏 9.93.
- **Footage:** none.
- **SFX:** swish (soft, 0.25) per marker · blip at the strike 7.67 · type 8.81 · ding 9.93.
- **Continuity:** out: line 10 「本轮只交」 becomes s18's pipeline.

## s18_sample — Step 4: storyboard, three style frames and one sample before the full piece   (≈ 6.0 s · light · wipe-up · energy 1)

- **Voice:** s18_sample.1 (0.48–5.65) 第四步，先要分镜、三张风格帧和一个小样，确认了再做全片。
- **On screen:** rail step 4. Four white cards (300×220, shadow) at y 330, x 160 / 600 / 1040 / 1480, joined by `K.flow`
  edges in green: 「分镜表」 (mini table 时间 / 画面 / 文字 / 声音) · 「风格帧 ×3」 (three tiny frames 开头 / 中间 / 结尾) · 「5 秒小样」
  (mini player looping `draw(t)` from s04, scrubber, 「out.mp4 ✓」) · 「全片」 (greyed, lock glyph, 「确认后再做」). Stamp (rotated
  −8°, green-deep 3 px outline, 36 px 900 green-deep): 「确认了，再做全片」.
- **Visual:** 「分镜」 1.65 card 1 pops · 「三」 2.34 card 2, its three frames pop in turn · 「小样」 3.86 card 3, the mini
  player starts · 「确认」 4.50 the stamp lands on card 4, the lock's shackle lifts and the card un-greys · edges draw with
  green packets throughout.
- **Sync:** 分镜 1.65 · 三 2.34 · 小样 3.86 · 确认 4.50.
- **Footage:** none.
- **SFX:** pop per card · ding 4.50.
- **Continuity:** out: wipe-up; rail 4→5.

## s19_feedback — Step 5: feedback = time point + problem + expectation   (≈ 11.5 s · light · wipe-up · energy 1)

- **Voice:**
  - s19_feedback.1 (0.48–4.68) 第五步，反馈写成：时间点，问题，期望。
  - s19_feedback.2 (4.90–10.78) 别说再炫一点，要说：第 8 到 11 秒，标题没读完就消失，请延长停留。
- **On screen:**
  - Rail step 5. Formula row (y 250–350): three slot cards (360×100, white, 2 px green outline) 「时间点」 ＋ 「问题」 ＋
    「期望」 (H3 40 px 800, SVG icons clock / warning / check). Tip (22 px ink-2, y 372): 「每轮只改一类：故事 › 构图 › 动作 › 声音」.
  - Left panel (x 112–860, y 420–690), label 「✗ 别这样说」 (24 px ink-2), corner tag 「示意」: user bubble 「感觉不对，再炫一点」;
    grey reply 「……哪一段？哪里不对？」.
  - Right panel (x 960–1808, y 420–690), label 「✓ 这样说」 (24 px green-deep): a bubble assembled from three chips
    「第 8–11 秒」「标题还没读完就消失」「请延长停留」.
  - Bottom strip (y 720–860): a 20 s scrubber (x 160–1760; ticks every 1 s, labels every 5), the 8–11 s range filled
    green at 30 %, the lime playhead pill (ink 「0:08」); a mini preview (240×135) above the range showing a sample title
    「我做数据可视化」 drawn over `draw(t)` (tag 「示意」).
- **Visual:** 「反馈」 1.28 three empty slots draw · 「时间点」 2.43, 「问题」 3.40, 「期望」 4.22 each slot fills · tip at 4.6 ·
  「别说」 4.90 ✗ panel (user bubble 5.0, reply 5.6, small ✗ stamp) · 「要」 6.15 ✓ panel opens · 「8 到 11 秒」 7.14 chip
  1 flies from slot 1 into the bubble, the range lights, the playhead jumps to 0:08 · 「标题」 8.31 chip 2 flies in; the
  preview shows the title vanishing at 0:09.5 (a warm red flag #C0392B at 70 %, used only here) · 「请」 9.85 chip 3 flies
  in; the preview now holds the title; green check at 10.5.
- **Sync:** 反馈 1.28 · 时间点 2.43 · 问题 3.40 · 期望 4.22 · 别说 4.90 · 要 6.15 · 8 到 11 秒 7.14 · 标题 8.31 · 请 9.85.
- **Footage:** none.
- **SFX:** pop ×3 (slots) · blip (✗) 4.90 · swish ×3 (chip flights) · tick 7.14 (playhead jump) · ding 10.5.
- **Continuity:** out: the 20 s scrubber and its lime playhead become the homework timeline in s20.

## s20_ship — Step 6: check everything; your first piece is 15–30 s   (≈ 11.5 s · light · wipe-up · energy 1)

- **Voice:**
  - s20_ship.1 (0.48–4.69) 第六步验收：静帧、片段，再带声音看完整版。
  - s20_ship.2 (4.91–7.62) 模型看不了视频，就让它抽帧来看。
  - s20_ship.3 (7.84–10.62) 你的第一支，就从 15 到 30 秒开始。
- **On screen:**
  - Rail step 6. Phase A: checklist (`K.checklist` light, size 36, w 920, at (112, 260)): 1 「静帧」 sub 「溢出、错字、遮挡」 ·
    2 「片段」 sub 「转场、穿帮」 · 3 「带声音看完整版」 · 4 「手机上再看一遍」 · 5 「保留工程和素材来源」.
  - Tip card (white 640×300 at (1168, 260)): mono tag 「小提示」; 「模型看不了视频」 (H3 44 ink); 「让它先抽帧，再看图」 (body 30
    ink-2); a 4-frame film strip → arrow → eye glyph; small print (20 px ink-2) 「Opus 5.5 输入文字和图片，只输出文字」.
  - Phase B, homework card (white 1300×560 at (310, 250), perforated left edge, settles −1.5°→0°): 「你的第一支」 (H2 64
    ink); 「15–30 秒」 (Space Grotesk 160 px green-deep); three pills (lime fill, ink 32 px) 「一个主体」「一个目标」「一个转折」;
    example timeline (x 360–1560, y 640–690) 「例：20 秒」 with segments 0–3 秒 「钩子：前 3 秒抓人」 (green) · 3–15 秒
    「主体 · 目标」 · 15–20 秒 「转折 · 呼应开头」; small line (24 px ink-2) 「先找一个对标 · 保留工程」.
- **Visual:** 「静帧」 1.67 item 1 ticks · 「片段」 2.37 item 2 · 「声音」 3.49 item 3 · items 4 and 5 tick at 4.2 / 4.5 (no
  voice; readable on pause) · 「模型」 4.91 tip card drops · 「抽帧」 6.87 the strip's cells slide out (extracted) ·
  「你的第一」 7.84 Phase B: checklist and tip slide up and fade (0.4 s); the card assembles; 「15 到 30 秒」 9.29 the big
  number lands; pills pop 9.6 / 9.75 / 9.9; the timeline draws 10.0–10.6 with the lime playhead (from s19) running
  0→20 s along it; small line 10.7. Hold through the wipe (≈4 s of readable card).
- **Sync:** 静帧 1.67 · 片段 2.37 · 声音 3.49 · 模型 4.91 · 抽帧 6.87 · 你的第一 7.84 · 15 到 30 秒 9.29.
- **Footage:** none.
- **SFX:** tick per checklist tick · shutter 6.87 · impact (light) 9.29 · pop ×3 · riser 10.5→11.5 into the 226.0 downbeat.
- **Continuity:** out: the lime chapter wipe; the playhead carries into s21.

---

## s21_meta — The reveal (chip 「04 ？」): this film's real code, real timeline, and a synthetic voice   (≈ 13.5 s · dark · wipe · energy 3)

- **Voice:**
  - s21_meta.1 (0.48–3.59) 揭个底：这支片子，也是这么做的。
  - s21_meta.2 (3.81–8.65) Opus 5.5 在 Claude Code 里，写了场景、时间轴和配乐程序。
  - s21_meta.3 (8.87–12.62) 浏览器逐帧截图，连我的声音，也是合成的。
- **On screen (three phases, one focal point each, ≤3 labels at a time, labels ≥24 px):**
  - A (0–3.6): a paper page (880×495, centred) shows a DOM-rebuilt miniature of s02's title card (「每一帧，都是代码」, lime
    underline, the four chips with 「04 ？」 lit). It flips to its back (`--night-2`, mono 24 px): **verbatim lines from
    `src/scenes/case.js` `render()`**: the `const a = spring(t - 0.05, …)` line, the `tf(s.card.el, …)` line and the
    `up(s.tag, 0.15); up(s.work, 0.25); …` line, each trimmed with 「…」 after 60 characters. Caption (26 px fog):
    「刚才 8 张案例卡的入场动画，就是这几行」.
  - B (3.81–8.65): the page shrinks into a Claude Code window (`K.windowFrame` 1500×560 at (210, 210), title
    「Claude Code · Opus 5.5」) with three tabs (mono 24): 「src/scenes/*.js」 (badge 「{{CODE_LINES}} 行代码」) · 「src/timeline.js」 ·
    「tools/music.py」. Bodies: the case.js lines; this scene's own entry from `window.TIMELINE.scenes` formatted as JSON
    (id, start, dur, chapter, music); the verbatim `CHORDS = [` block of `tools/music.py` (5 lines).
  - C (8.87–13.5): the window collapses into this film's real timeline (track x 160–1760 = 0–246 s, y 380–640), three lanes
    from `window.TIMELINE` with 24 px labels: 「画面」 (22 scene blocks, coloured by chapter: 00 lilac, 01 purple, 02 snow
    20 %, 03 green, 04 lime) · 「旁白」 (one bar per TTS word from `lines[].words`, height ∝ duration, lime 60 %) · 「音乐」
    (energy 0–3 as bar heights per scene). Frame counter at the content box's top-right (mono 56 lime, live) with
    「/ {{FRAMES}}」 after it.
  - Bottom lines: stats (mono 24 fog, y 790) 「{{SCENES}} 个场景 · {{CODE_LINES}} 行代码 · {{FRAMES}} 帧 · 渲染 {{RENDER_MIN}} 分钟」;
    credits (22 px fog, y 832) 「旁白：微软神经网络语音合成（edge-tts · 云希） · 案例片段：归原作者所有，逐段署名」.
- **Visual:**
  - 「揭」 0.48: the page flips (rotateY 0→180°, 0.7 s inOutCubic, perspective 1600); the code reveals line by line
    (0.9–1.6). 「片子」 1.87: soft push-in on the code.
  - 「Opus」 3.81: the page shrinks into the window; tabs pop on 「场景」 6.49, 「时间」 7.12, 「配乐」 8.05 (each tab brings its
    body forward).
  - 「浏览器」 8.87: the window collapses into the timeline; the lime playhead sweeps from 0 to "now" (8.9–10.5) and the frame
    counter races with it (fast-forward readout; it settles on the real current frame).
  - 「声音」 11.05: one zoom (×6, 0.5 s) onto the current line's word bars; each word of s21_meta.3 gets its real start time
    as a 24 px label (from `ctx.lines`), and a bracket labelled 「下面这行字幕，就按这些时间戳出现」 points down toward the
    live subtitle (its leader stops at y 880).
  - 「合成」 12.11: Smiley Sans 「这句也是。」 (34 px lilac) pops beside the bars.
  - 12.6–13.5: zoom back out; everything collapses into the lime playhead pill, which flies to (960, 540) for s22's iris.
- **Sync:** 揭 0.48 · 片子 1.87 · Opus 3.81 · 场景 6.49 · 时间 7.12 · 配乐 8.05 · 浏览器 8.87 · 声音 11.05 · 合成 12.11.
- **Implementation (so the code really is real):** in `build()`, read `scenes/case.js` and `../tools/music.py` once with a
  synchronous `XMLHttpRequest` (the renderer serves the project root over http, see `tools/browser.mjs`), cut the needed
  lines by searching for their first tokens, and cache them in state. If either request fails, throw: never fall back
  to invented code. TIMELINE data comes from `window.TIMELINE`. Nothing is read in `render()`.
- **Footage:** none (all our own code and data).
- **SFX:** whoosh 0.48 (flip) · type (soft) 0.9–1.6 · impact 3.81 · pop ×3 (tabs) · shutter ticks accelerating 8.9→10.5 ·
  whoosh (soft) 11.05 · sparkle 12.11 · swish 12.6.
- **Continuity:** pays off 「04 ？」 (the chapter tag now reads 「04 幕后」); the playhead from s01's HUD ends at the centre
  as the iris origin.

## s22_end — End card: read, browse, go make your first; the playhead reaches the last frame   (≈ 6.5 s · dark · iris (960, 540) · energy 2)

- **Voice:** s22_end.1 (0.56–5.70) 完整文章和 5181 个案例，都在 WaytoAGI，去做你的第一支吧。 (`say`: Way to AGI)
- **On screen:** chrome off, subtitles on.
  - WaytoAGI logo (`LOGO_DARK`, height 80) centred at y 150–230.
  - Hero (H1 96 px 900 snow, centred, y ≈ 320): 「每一帧，都是代码」, lime underline under 「代码」.
  - Left column (x 160–940, from y 430): tag 「读全文」; 「WaytoAGI 飞书知识库」 (H3 44 snow); 「《Opus 5.5 怎样把代码变成视频：」 /
    「8 个精选案例与制作经验》」 (body 30 fog).
  - Right column (x 1000–1760, from y 430): tag 「逛案例」; 「waytoagi.com/usecase-atlas/opus5-5」 (mono 32 lime);
    「5,181 个案例 · 视频类 1,704 个」 (body 30 snow, numbers count up); 「截至 10 月 1 日 WaytoAGI 收录」 (22 px fog).
  - Credit line (mono 20 fog, y 720): 「原作片段：@twoclipping @morpheusdv @kimmonismus @WinterArc2125 @aiwarts
    @yoshifujidesign @aicreataro @KanaWorks_AI」.
  - Ruler (x 112–1808, y 800): hairline + the lime playhead pill; label right-aligned above it 「第 {n} 帧 / 共 {{FRAMES}} 帧」
    (n live). The pill's x maps absolute time over the whole film, so it enters at ≈97 % and reaches x 1808 on the last
    frame.
- **Visual:** the iris opens from the pill at (960, 540); the pill drops to the ruler (0.5 s) and keeps travelling.
  「文章」 0.91 left column rises · 「5181 个」 1.63 right column + count-up (lands 2.4) · 「Way」 3.57 a lime sheen crosses the
  logo · 「去」 4.65 the hero's underline glows once · last frame: the playhead exactly at the ruler's end; music resolves.
- **Sync:** 文章 0.91 · 5181 个 1.63 · Way 3.57 · 去 4.65.
- **Footage:** none.
- **SFX:** pop 0.91 · ticks while counting · sparkle 3.57 · soft ding 6.3 (playhead reaches the end).
- **Continuity:** closes the loop opened by s01's HUD playhead: same pill, now at the end of the film.

---

## Footage index

| clip id | source range (s) | scene | use | credit |
|-|-|-|-|-|
| co-060-ring | gosail-060 49.0–50.0 | s01 0–1 | full-bleed | @morpheusdv · 作者自述：画面由代码渲染 |
| co-1377-sun | uc-1377 175.0–176.0 (16:9 inside letterbox) | s01 1–2 | full-bleed | @WinterArc2125 · 作者自述：画面由代码渲染 |
| co-054-render | gosail-054 19.6–20.6 (9:16) | s01 2–3 | centred panel + 192×108 ambient copy | @yoshifujidesign · 3D 数据渲染 · 工具未公开 |
| co-006-island | lists-006 1.0–1.5 (16:9 crop) | s01 3–3.5 | full-bleed | @twoclipping · 作者自述：画面由代码渲染 |
| co-0962-burst | uc-0962 46.6–47.1 | s01 3.5–4 | full-bleed | @kimmonismus · 作者自述：画面由代码渲染 |
| co-006-cmdk | lists-006 10.0–12.5 (16:9 crop) | s01 4–8 (last frame held), s02 0–2.2 | full-bleed | @twoclipping · 作者自述：画面由代码渲染 / 原作片段 |
| c1-006-morph | lists-006 0.0–9.6 | s06 | 1:1 card | @twoclipping |
| c2-060-tree / c2-060-light | gosail-060 19.9–24.3 (zoom crop) / 46.3–51.0 | s07 | 16:9 card | @morpheusdv |
| c3-0962-web / c3-0962-burst | uc-0962 13.5–20.5 / 46.0–49.0 | s08 | 16:9 card | @kimmonismus |
| c4-1377-relief / -arrows / -sun | uc-1377 73.8–76.8 / 106.0–109.0 / 173.0–178.0 | s09 | 16:9 card | @WinterArc2125 |
| c5-072-home / -search / -prompt / -brand | gosail-072 3.7–5.2 / 13.03–14.70 (crop 1067:600:0:0) / 20.4–23.9 (crop 1792:1008:64:64) / 26.0–30.0 | s10; brand@0.65 also s05, s14 | 16:9 card, wall/rack tile | @aiwarts |
| c6-054-line / -render / c6-054b-plume | gosail-054 0.2–3.2 / 18.9–21.6 · gosail-054-b 0.0–4.8 | s11 | 9:16 card | @yoshifujidesign |
| c7-2348-hikare / -skel / -lyric | uc-2348 25.5–31.0 / 8.667–9.5 / 2.0–7.292 | s12 | 16:9 card | @aicreataro |
| c8-133-stage | gosail-133 0.0–10.833 (one take) | s13 | 16:9 card | @KanaWorks_AI |

Rack and mini-card stills (s05, s14) are frames of the clips above at the times listed in global rule 3.
