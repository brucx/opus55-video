# Draft A — 钩子与节奏 · 《每一帧，都是代码》

**Angle:** hook and rhythm first. A beat-cut cold open of code-rendered shots ends on the lists-006 command palette
typing "frame" and landing the toast "Every frame is code" on a downbeat. The title is morphed out of that toast. Then
there are two jobs, each with a hard rhythm grammar: **8 招连发** (a fast case carousel with a spoken refrain, "第 N 招…照搬…")
and **6 步作业纸** (light worksheet steps that turn like pages). The meta reveal pays off a promise the film keeps
silently from frame 1: one lime pill runs through every scene. That is trick #1 applied to ourselves.

**Measured runtime:** 3:51.0 (231.0 s) with the real TTS (`build_timeline.py --dry`, zh-CN-YunxiNeural +6 %), 22 scenes,
55 lines, 189.9 s of speech. Hook: first spoken line ends at 2.61 s, over a beat-cut montage that starts at frame 0.

All times below are scene-local seconds from the measured layout. Word cues name the exact TTS token, so the engine's
`ctx.word(lineId, token)` resolves them. If wording changes, re-measure and re-derive the times.

| # | scene | start | dur | ch | transition | energy |
|-|-|-|-|-|-|-|
| 1 | s01_cold | 0.00 | 8.00 | 00 | cut (first frame) | 3 |
| 2 | s02_title | 8.00 | 5.00 | 00 | cut (match cut on downbeat) | 3 |
| 3 | s03_text | 13.00 | 11.00 | 01 | wipe 0.6 | 1 |
| 4 | s04_render | 24.00 | 14.50 | 01 | zoom 0.6 | 1 |
| 5 | s05_wall | 38.50 | 8.50 | 02 | wipe 0.6 | 2 |
| 6 | s06_c1 lists-006 | 47.00 | 10.00 | 02 | zoom 0.6 | 2 |
| 7 | s07_c2 gosail-060 | 57.00 | 10.50 | 02 | push 0.6 | 2 |
| 8 | s08_c3 uc-0962 | 67.50 | 10.00 | 02 | push 0.6 | 2 |
| 9 | s09_c4 uc-1377 | 77.50 | 9.50 | 02 | push 0.6 | 2 |
| 10 | s10_c5 gosail-072 | 87.00 | 10.50 | 02 | push 0.6 | 2 |
| 11 | s11_c6 gosail-054 | 97.50 | 10.50 | 02 | push 0.6 | 2 |
| 12 | s12_c7 uc-2348 | 108.00 | 10.50 | 02 | push 0.6 | 2 |
| 13 | s13_c8 gosail-133 | 118.50 | 11.00 | 02 | push 0.6 | 2 |
| 14 | s14_formula | 129.50 | 10.00 | 02 | iris 0.7 | 1 |
| 15 | s15_env | 139.50 | 11.00 | 03 | wipe 0.6 | 1 |
| 16 | s16_routes | 150.50 | 12.00 | 03 | wipe-up 0.6 | 1 |
| 17 | s17_plugin | 162.50 | 9.00 | 03 | push 0.6 (side-step) | 1 |
| 18 | s18_prompt | 171.50 | 10.50 | 03 | wipe-up 0.6 | 1 |
| 19 | s19_loop | 182.00 | 10.50 | 03 | wipe-up 0.6 | 1 |
| 20 | s20_ship | 192.50 | 13.50 | 03 | wipe-up 0.6 | 1 |
| 21 | s21_meta | 206.00 | 18.50 | 04 | wipe 0.6 (on a downbeat) | 3 |
| 22 | s22_end | 224.50 | 6.50 | 04 | iris 0.7 from (960, 540) | 2 |

## Global rules for this draft

**1. The continuity object: one lime pill.** A rounded rectangle (radius = height/2), fill `--lime` #C9DF8D, appears in
every scene. Its first appearance is on the word "代码" in s01. It plays these roles: the title underline (s02); the
"输出：文本" chip (s03); the time playhead `t = …` (s04); the "第 1 招" marker on the rack (s05); the active series dot
in the case template (s06–s13, already built in); the equation pills (s14); the active step on the step rail (s15–s20);
the palette selection bar and X-ray scanline, then the hero of the callback (s21); the final button (s22). The voice
claims this in s21 ("这颗绿色胶囊，贯穿了全片"), so it must actually be there in every scene. On light scenes the pill is
a lime fill behind ink text, which design.md allows; lime is never used as a text colour on light backgrounds.

**2. Transition grammar (the rhythm).** These are the only meanings:
- `cut`: only the beat cuts inside the cold open, plus the match cut s01→s02.
- `wipe`: lime bar, chapter changes only.
- `push`: the case carousel, plus the one lateral side-step s16→s17.
- `wipe-up`: "next step" page turns in the worksheet chapter.
- `zoom` and `iris`: reveals (into the code, into the first case, into the synthesis, out to the end card).

There are no fades. Scene ends snap to the 120 BPM grid. s20 is snapped to the bar, so the meta reveal starts on a
downbeat (206.0 s).

**3. Overlays.**
- **Cold open and title (chrome off):** a lime mono counter `FRAME 0001` in the top-right (x right edge 1864, y 44,
  22 px). It shows the real absolute frame number, `floor(T*30)+1`. There are also four thin lime corner brackets (2 px,
  40 px arms, inset 40 px). The counter returns in s21 and runs up to `{{FRAMES}}`.
- **Footage credit:** while any footage is visible, it shows its credit chip. Use `K.videoCard` credit
  `{author, note: '原作片段'}`. In the full-bleed cold open, the credit chip sits top-left (x 56, y 44) because chrome is
  off.
- **Original audio:** never used.

**4. Honesty, as applied in this draft.**
- When the voice says "没有一帧是拍出来的 / 也不是 AI 直接生成的 / 每一帧，都是代码" (s01), only code-rendered work is on
  screen: gosail-060, uc-1377, lists-006, uc-0962. The gosail-054 shot sits only under line 1 (it is a 3D render, not a
  camera and not a video model).
- uc-2348 and gosail-133 footage appears only inside their own case cards (plus their library posters in the s05
  wall). Their voice lines say "生成模型".
- The s05 wall voice says only "1704 个视频案例". It never says they are all code-made: the wall includes Runway,
  Higgsfield, Midjourney and archival works.
- The gosail-072 card avoids 2.0–3.3 s and carries the caveat "网页卡片里是他人作品，非 Opus 生成". In the s05 rack, its
  tile is replaced by an @aiwarts UI frame (see s05).
- Self-reports are labelled 作者自述 in the caveats.
- Data reads "截至 10 月 1 日 WaytoAGI 收录".
- The meta scene says "也是这么做的", not "每一帧也是代码". Our film embeds others' footage, so on screen it says
  "原作片段归各作者".

**5. Type and colour.** design.md tokens throughout:
- **Dark scenes:** `--night` with `grid-night`. Snow text, lime accent.
- **Light scenes (chapter 03):** `grid-paper`. Ink text, green and green-deep for accents, lime only as a fill.
- **Line lengths:** H1 ≤ 12 CJK chars, body ≤ 24.
- **Text placement:** no text in y < 112 (except chrome-off scenes) or y > 900.

---

## s01_cold — Beat-cut cold open: impossible-looking shots, then the footage itself types the answer   (≈ 8.0 s · dark · cut · energy 3)
- **Voice:**
  - s01_cold.1 (at 0.25): 这些视频，没有一帧是拍出来的。
  - s01_cold.2 (at 3.00, on the cut): 也不是 AI 直接生成的。
  - s01_cold.3 (at 6.00): 每一帧，都是代码。
- **On screen:**
  - Footage only, plus the overlays: the credit chip top-left (one per shot, below), `FRAME 0001…0240` top-right, and
    lime corner brackets.
  - From 7.25: a 10 px lime pill underline draws beneath the toast text "✓ Every frame is code". This is the film's
    first lime element.
  - No titles. Subtitles on, chrome off.
- **Visual (all full-bleed 1920×1080, cover-fit; hard cuts on beats):**

  | time | clip (clip-local) | what you see | treatment | credit |
  |-|-|-|-|-|
  | 0.00–1.00 | `co-060-ring` 0–1.0 | black ink mass, amber light; ring sweeps and the ink turns olive; world regrows | slow push 1.00→1.04 | @morpheusdv |
  | 1.00–2.00 | `co-1377-sun` 0–1.0 | sun breaking through mist over the ridge, a column marching | push 1.00→1.03 | @WinterArc2125 |
  | 2.00–3.00 | `co-054-render` 0–1.0 (9:16) | orange RENDER scanline turning line art into black glass | 608×1080 panel centred over a blurred, 40 %-darkened cover copy of the same frames | @yoshifujidesign |
  | 3.00–3.50 | `co-006-island` 0–0.5 | check → black pill stretches into the "island", colour cover appears | none | @twoclipping |
  | 3.50–4.00 | `co-0962-burst` 0–0.5 | golden network exploding into particles (dark frame; contrast spike before the light palette) | none | @kimmonismus |
  | 4.00–6.50 | `co-006-cmdk` 0–2.5 | "Type a command" list; types f-r-a-m-e (4.50–5.00); "Every frame is code" selected (5.30); Enter (5.50); collapses into a dark capsule; toast lands at 6.00 = downbeat of bar 4 | plays at 1.0× | @twoclipping |
  | 6.50–8.00 | code replica (no footage) | pixel-matched toast: #EBEBE6 background, black pill ≈ 900×120 centred at (960, 540), white "✓ Every frame is code" in Inter 600 40 px | slow push 1.00→1.03; lime underline draws on "代码" | chip stays: @twoclipping · 原作片段 |
- **Sync:**
  - L1 runs over shots 1–3 (code-rendered and 3D only).
  - L2 (3.00–5.05) starts exactly on the 3.00 cut, so it runs only over lists-006, uc-0962 and the palette, all
    code-rendered.
  - The word "每" (6.00) arrives exactly as the toast lands.
  - "代码" (7.25) triggers the lime underline (0.35 s, outQuint, drawn left→right).
- **Footage:** `co-060-ring`, `co-1377-sun`, `co-054-render`, `co-006-island`, `co-0962-burst`, `co-006-cmdk`. Each
  shot's credit chip shows its own author while it is visible.
- **SFX:**
  - 0.00 boom (low hit on the first frame).
  - Cuts: shutter at 1.00, 2.00, 3.00; tick at 3.50.
  - 4.00 glitch (dark→light flip).
  - type ×5 at 4.50, 4.62, 4.75, 4.87, 5.00 (one per keystroke).
  - blip 5.30 (selection), pop 5.50 (Enter).
  - riser 4.00→6.00.
  - 6.00 impact + sparkle (toast).
  - 7.25 swish (underline).
- **Continuity:**
  - In: none (first frame).
  - Out: the code replica of the toast is held, so s02's first frame is identical (match cut). The lime underline is
    the pill that s02 grows.

## s02_title — The toast becomes our title and the two-job promise   (≈ 5.0 s · dark · cut · energy 3)
- **Voice:**
  - s02_title.1 (from 1.40): 两件事：它为什么这么炫，你怎么做。
- **On screen:**
  - **Hero (Noto Sans SC 900, 156 px, snow):** 每一帧，都是代码
  - **Two chips (H3 40 px, 22 px vertical padding, lime 2 px border, night-2 fill):** "① 它为什么这么炫" and
    "② 你怎么做出来".
  - **Overlays:** FRAME counter continues; credit chip "@twoclipping · 原作片段" stays only for 0–0.8 s, while the pill
    is still their black toast.
  - Subtitles off, because the chips carry the line. Chrome off.
- **Visual:**
  - All morph steps sit on the 120 BPM grid; the scene starts on the downbeat at abs 8.0.
  - **0.00:** the exact s01 end state (warm grey, black toast, lime underline).
  - **0.50 (beat):** the toast text blur-swaps to "每一帧，都是代码" (white, 52 px). The old text goes in 0.15 s
    (blur 6 px); the new text arrives in 0.25 s. This is the lists-006 "short blur handoff".
  - **1.00 (beat):** the pill springs black→lime and its text turns ink. At the same time, an iris of `--night` and grid
    opens from the pill centre (radius 0→1150 px, outQuart, 0.5 s). The warm grey world is gone.
  - **1.00–2.00:** dual-spring stretch, the lists-006 trick. The right edge uses stiffness 260 / damping 22; the left
    edge uses 170 / 20, so the leading edge overshoots first. The pill widens to 1100 px and thins to 16 px, settling
    as an underline at y 600 exactly at 2.00 (abs 10.0 = downbeat). The text lifts off the pill, grows to hero 156 px
    in snow and settles centred at y 470 (baseline ≈ 540).
  - **2.65 and 4.01:** the chips rise 30 px with a spring, at y 690. Chip ① is centred x 700 and chip ② x 1220
    (gap 60).
  - **Throughout:** camera drift, scale 1.00→1.02.
- **Sync:**
  - "为什么" (2.65) → chip ①.
  - "怎么" (4.01) → chip ②.
  - The voice starts at 1.40, mid-stretch, so the title is fully formed by the time "它为什么" lands.
- **Footage:** none (code replica only).
- **SFX:**
  - 0.50 swish (text swap).
  - 1.00 boom + sparkle (lime + iris).
  - 1.00–2.00 rise_short (stretch), with an impact at 2.00 when it settles on the downbeat.
  - pop at 2.65 and 4.01.
- **Continuity:**
  - In: the match cut from s01's toast.
  - Out: the lime underline is the object s03 picks up (the wipe bar is lime too). The FRAME counter hides at the end,
    because chrome turns on.

## s03_text — Principle 1: Opus 5.5 writes text; engines paint   (≈ 11.0 s · dark · wipe · energy 1)
- **Voice:**
  - s03_text.1: 先看原理：Opus 5.5 只输出文字，不直接出视频。
  - s03_text.2: 它写分镜、写代码、调工具，画画的是浏览器和图形引擎。
- **On screen:**
  - **Model card (x 140–860, y 220–720, night-2, radius 28):**
    - Title row: "Claude Opus 5.5" (H2 64 px 800, snow) and a `K.tag` "MODEL".
    - Row 1: label "输入" (body 32, fog), then chips "文本" and "图片" (snow 2 px outline pills, 36 px).
    - Row 2: label "输出", then chip "文本". This chip is the lime pill: lime fill, ink text, 40 px 800.
    - Ghost chip "视频": 36 px, fog dashed 2 px outline, right of the output chip.
    - Small label under the ghost chip (body 24, fog): "官方视频功能：无".
  - **Right side, `K.flow` (dark):**
    - Three nodes at x 1180: "分镜" (sub "镜头 · 时长 · 文字", y 300), "代码" (sub "render(t) 函数", y 480) and
      "工具指令" (sub "ffmpeg · 浏览器", y 660). Each is 300×120.
    - One engine node at x 1600, y 480: "浏览器 / 图形引擎" (360×150, lilac 2 px border).
    - One output frame under the engine: a 16:9 tile 280×158 at (1600, 700) with a lime ball, label "画面" (22 px mono
      caption).
- **Visual:**
  - The card rises in at 0.3–0.9 (outQuint, 40 px).
  - On "文字" the output pill pops (spring).
  - On "视频" the ghost chip slides in from the right (0.25 s). A lime 4 px strike line then draws across it in
    0.2 s, with a tiny horizontal shake (±4 px, 2 cycles). The label fades in.
  - Line 2: the lime "文本" pill detaches from the card (a copy flies along an arc to x 1180) and splits into the three
    node cards. This is a shared-object morph: the pill becomes three cards.
  - On "浏览器": three edges draw into the engine node (0.6 s, inOutCubic), and packets (lime dots) travel along them.
  - On "引擎": the output tile lights up, and its ball starts moving left→right on a 1.5 s loop driven by t.
  - Slow drift: the whole frame translates −20 px x over the scene.
- **Sync:**
  - "文字" 3.06 → output pill pops.
  - "视频" 4.19 → ghost chip and strike (strike at 4.40).
  - "分镜" 5.18 → node 1; "代码" 6.01 → node 2; "工具" 6.86 → node 3.
  - "浏览器" 8.40 → edges and engine node.
  - "引擎" 9.52 → output frame lights up.
- **Footage:** none.
- **SFX:**
  - pop at 3.06.
  - glitch (soft, gain 0.3) at 4.40.
  - blip at 5.18, 6.01, 6.86.
  - whoosh at 8.40.
  - ding at 9.52.
  - (The wipe whoosh is automatic.)
- **Continuity:**
  - In: the lime pill again (s02's underline becomes the output chip).
  - Out: the output tile with the moving lime ball is what s04 zooms into. s04 opens on that same ball in a preview
    window.

## s04_render — Principle 2: 画面 = render(t); 900 frames ≠ 900 model calls   (≈ 14.5 s · dark · zoom · energy 1)
- **Voice:**
  - s04_render.1: 代码像一个函数：给它时间，它就画出那一刻。
  - s04_render.2: 30 秒，每秒 30 帧，就是 900 帧。
  - s04_render.3: 但模型不用跑 900 次，代码只写一次。
  - s04_render.4: 最后，FFmpeg 把这些帧编成视频。
- **On screen:**
  - **`K.tag` "示意代码"** above the code panel.
  - **Code panel (`K.codeBlock`, size 28, width 780, at x 112, y 200):**
    ```
    function render(t) {         // t：第几秒
      const x = 200 + 500 * t;   // 位置只由时间决定
      circle(x, 300, 60);
    }
    ```
  - **Preview:** `K.windowFrame` 860×484, title "preview", at x 948, y 200.
  - **Scrubber at y 735:** track 860 px with ticks labelled 0 1 2 3 (mono 20). The playhead is a lime pill 120×44 with
    label "t = 2.00 s" (mono 22, ink).
  - **Thumbnail label (mono 20):** "第 60 帧".
  - **Formula (H3 44, fog):** "30 秒 × 每秒 30 帧".
  - **Counter (`K.counter`, Space Grotesk 200 px, lime):** "900", with unit "帧" (H2 72, snow).
  - **Right counter:** "1" (Space Grotesk 200 px, lime) with label "代码：写 1 次" (H3 44 snow).
  - **Struck chip (body 30, fog, lime strike):** "调用模型 900 次".
  - **Node:** "FFmpeg" (mono 34, lilac border).
  - **File chip:** "video.mp4 · 00:30" (mono 28) with a play-triangle glyph.
- **Visual (four phases, one per line):**
  - **A (0.48–4.08):**
    - The code types in 0.3–2.2 (`codeBlock.render(p)`).
    - The preview shows a lime ball at x(t).
    - On "时间" the playhead scrubs 0 → 1.5 → 0.5 → 2.0 (three springs, 0.35 s each). The ball follows exactly,
      proving that the same t gives the same frame.
    - On "一刻": shutter flash on the preview (white 0→35 %→0 in 0.15 s). A 240×135 thumbnail pops out of the preview
      to (1180, 830), labelled "第 60 帧".
  - **B (4.30–7.49):**
    - The preview shrinks (0.5 s) into the first cell of a `K.filmStrip` (n = 9, fw 200, fh 112) across y 470–640.
    - The strip scrolls left with accelerating offset. Labels count `#0001…#0900`; each cell draws the ball at its own
      t = i/30.
    - The formula appears on "30 秒" (4.30), then the counter rises 0→900 (outExpo), landing exactly on "900" (6.89),
      top-centre y 180–380.
  - **C (7.71–10.52):**
    - The counter "900 帧" slides to x 560.
    - The struck chip appears on "900 次" (8.62), and the strike draws at 8.90.
    - A single code card (a miniature of the code panel, 360×200) settles at x 1360. On "一次" (10.17) a big lime "1"
      lands above it, and 30 thin lime lines fan out from the card to the strip frames (one function feeding every
      frame).
  - **D (10.74–13.76):**
    - The strip slides right into the FFmpeg node at (1500, 560), which pops on "FFmpeg" (11.58).
    - The file chip shoots out below the node and lands on "视频" (13.27).
    - Hold: the playhead pill parks on the chip's progress bar.
- **Sync:** 时间 2.23 · 一刻 3.73 · 30 秒 4.30 · 900 6.89 · 900 次 8.62 · 一次 10.17 · FFmpeg 11.58 · 视频 13.27.
- **Footage:** none.
- **SFX:**
  - type during code typing (soft).
  - tick on each scrub (2.23, 2.58, 2.93).
  - shutter at 3.73.
  - rise_short 4.30→6.89, then pop at 6.89.
  - glitch (soft) at 8.90.
  - impact (light) at 10.17.
  - whoosh at 11.20.
  - ding at 13.27.
- **Continuity:**
  - In: the lime ball, now driven by t.
  - Out: the lime playhead pill rests on the mp4 chip. s05 wipes in and reuses the same pill as the "第 1 招" marker.

## s05_wall — 1,704 cases, 8 tricks: the countdown rack   (≈ 8.5 s · dark · wipe · energy 2)
- **Voice:**
  - s05_wall.1: 那，为什么这么炫？
  - s05_wall.2: 从 WaytoAGI 收录的 1704 个视频案例里，我们挑了 8 个，一个一招。
    (`say` uses "Way to AGI".)
- **On screen:**
  - **Counter (Space Grotesk 220 px, lime):** "1,704".
  - **Caption (H3 44, snow):** "个视频类案例".
  - **Footnote (22 px, fog):** "截至 10 月 1 日 WaytoAGI 收录 · 全库 5,181 条 · 缩略图版权归各作者".
  - **Rack labels (mono 22, fog):** "01" … "08" above each slot.
  - **Marker on slot 01:** a lime pill "第 1 招" (ink, 26 px 800).
- **Visual:**
  - **Wall:** `K.wall` with all 60 `assets/wall` ids, cols 10, rows 6, tw 160, th 90, gap 10 → 1690×590 at x 115,
    y 230. Pop-in from 0.20, spread 1.4.
  - **On "炫":** camera push 1.00→1.04.
  - **On "1704":** a 65 % night scrim fades over the wall (0.3 s), and the counter counts up and lands at 4.50,
    centred y 330–550. The caption and footnote sit under it (y 580 and y 640).
  - **On "8 个":**
    - The scrim and counter lift away (0.3 s).
    - The 8 featured tiles (lists-006, gosail-060, uc-0962, uc-1377, gosail-072, gosail-054, uc-2348, gosail-133)
      jump to scale 1.12 with a lime 3 px outline; the other 52 dim to 20 %.
    - **gosail-072 tile:** in the rack, do not use `assets/wall/gosail-072.jpg` (it is @Just_sharon7's Seedance
      frame). Use `ctx.clipUrl('c5-072-home', 0.6)`, @aiwarts's own site header, cover-fit.
  - **On "一招":**
    - The 8 tiles fly (0.6 s, inOutCubic, staggered 40 ms) into a horizontal rack: 8 slots of 190×107, gap 18, at
      y 600, centred.
    - The rest of the wall fades out.
    - Slot 01 (lists-006) gets the lime "第 1 招" pill beneath it.
  - **Last 0.6 s and the outgoing transition:** keep rendering past `ctx.dur`. The rack scales up toward slot 01 so
    that the zoom into s06 reads as diving into that tile.
- **Sync:**
  - "炫" 1.60 → push.
  - "1704 个" 3.90 → counter starts.
  - "8 个" 6.26 → 8 tiles highlight.
  - "一招" 6.84–7.15 → rack forms.
- **Footage:** wall thumbnails (posters, credited by the footnote), plus one frame of `c5-072-home` for the gosail-072
  slot.
- **SFX:**
  - ticks rippling with the wall pop-in (8 ticks, 0.2–1.6).
  - rise_short 3.90→4.50, ding at 4.50.
  - sparkle at 6.26.
  - whoosh at 6.84.
  - pop at 7.15 (第 1 招).
- **Continuity:**
  - In: the lime pill becomes the "第 1 招" marker.
  - Out: zoom into slot 01. The case template's active series dot (lime pill) continues the marker.

---

### Case carousel (s06–s13) — shared notes
- **Template:** `"template": "case"`, `"file": "case"`. Data is in narration.json; the fields below are verbatim.
- **Voice structure (the refrain):**
  - L1 "第 N 招，<secret>。" — the secret lands on its first word via `cues.secret`.
  - L2 is one concrete piece of evidence. The two points are cued to words in it.
  - L3 starts with "照搬：…" and raises the 可以照搬 box.
- **Clip order:** each case's clips are sequenced so that what is spoken is what is on the card (maps below).
- **SFX:** template defaults (swish at 0.05, pop on L1, blip on the last line), plus the automatic push whoosh.
  - Optional upgrade: a tick when the CASE number changes.
- **Continuity across the carousel:**
  - The lime rule, the lime "炫在哪里" secret and the lime active series dot are identical in every case.
  - The ambient blurred footage swaps colour temperature each time: warm grey → cream → black-gold → sand →
    off-white → grey/blue → magenta → velvet.
  - Each push is a page of the same deck.

## s06_c1 — Trick 1 (lists-006): one form runs through the whole film   (≈ 10.0 s · dark · zoom · energy 2)
- **Voice:**
  - s06_c1.1: 第一招，一个形体贯穿全片。
  - s06_c1.2: 从按钮到图表，14 秒没有一次硬切。
  - s06_c1.3: 照搬：先定贯穿对象，再排上节拍。
- **On screen (template fields):**
  - Tag: CASE 01 / 08
  - Work: 无缝 UI 形变
  - Author: @twoclipping
  - Chip: 路线：代码生成与渲染
  - Secret: 一个形体贯穿全片
  - Point 1: 按钮变播放器、图表、命令面板
  - Point 2: 14 秒一镜到底，没有硬切
  - 可以照搬: 先定贯穿对象和它的状态，排上节拍，每拍出一帧检查
  - Caveat: 作者自述：全片是代码，未用 AE
- **Visual:**
  - 1:1 card, 620×620.
  - Clip map:
    - 0–9.6: `c1-006-morph`. Click Generate 0.25 → loader → check 1.0 → island 1.25 → player 1.75 → drag 2.75 →
      volume 3.7 → over-stretch 4.8 → toggle 5.3 → tabs 6.3 → chart 7.25–9.5.
    - Hold the last frame to 10.0.
- **Sync:**
  - secret on "一个" 1.33 (the island forming in the same black shape).
  - point 1 on "按钮" 3.12.
  - point 2 on "14" 4.14.
  - takeaway on L3 5.93.
- **Footage:** `c1-006-morph`, credit "@twoclipping · 原作片段".
- **SFX:** template defaults, plus the zoom whoosh.
- **Continuity:**
  - In: dived in from rack slot 01.
  - Out: push to case 2.
  - The black pill of lists-006 echoes our lime pill. That is the in-joke paid off in s21.

## s07_c2 — Trick 2 (gosail-060): warm colour is saved for the climax   (≈ 10.5 s · dark · push · energy 2)
- **Voice:**
  - s07_c2.1: 第二招，暖色只留给高潮。
  - s07_c2.2: 全片只有纸和墨，60 秒里，暖光只亮 9 秒。
  - s07_c2.3: 照搬：把风格拆成几条能检查的规则。
- **On screen (template fields):**
  - Tag: CASE 02 / 08
  - Work: 程序化手绘短片
  - Author: @morpheusdv
  - Chip: 路线：代码生成与渲染
  - Secret: 暖色只留给高潮
  - Point 1: 全片只有纸色和墨色
  - Point 2: 60 秒里，暖光只亮 9 秒
  - 可以照搬: 把风格拆成几条能检查的规则，强调色省着用
  - Caveat: 作者自述纯 JS；提示另附参考图
- **Visual:**
  - 16:9 card.
  - Clip map:
    - 0–4.4: `c2-060-tree` (60 % zoom crop). Black-and-white: the character draws an arc, the trunk shoots up (2.1),
      branches (2.85) and leaves (3.6).
    - 4.4–9.1: `c2-060-light`. Amber glow appears 4.6 and grows; release 6.6; ring sweeps the frame 7.35; ink recedes
      to olive; world rebuilt with sun 8.1–9.1.
    - Hold to 10.5.
- **Sync:**
  - secret on "暖色" 1.31, deliberately over black and white, so the payoff waits.
  - point 1 on "只有" 3.39 (the tree growing in pure ink).
  - point 2 on "暖" 5.39, with the amber glow on the card.
  - takeaway 6.93; the ring sweep (7.35) hits during "照搬".
- **Footage:** `c2-060-tree`, `c2-060-light`, credit "@morpheusdv · 原作片段".
- **SFX:** template defaults. Optional sparkle at 7.35 (ring sweep), gain 0.25.
- **Continuity:**
  - In: push from case 1.
  - Out: push to case 3; amber → the gold of uc-0962.

## s08_c3 — Trick 3 (uc-0962): picture, narration and music as separate layers   (≈ 10.0 s · dark · push · energy 2)
- **Voice:**
  - s08_c3.1: 第三招，画面、旁白、配乐分层做，每层单独改。
  - s08_c3.2: 照搬：先写分镜，每场先出几张截图检查。
- **On screen (template fields):**
  - Tag: CASE 03 / 08
  - Work: AI 历史短片
  - Author: @kimmonismus
  - Chip: 路线：代码渲染＋语音合成
  - Secret: 画面、旁白、配乐分层做
  - Point 1: 每层单独改，再沿一条时间轴合成
  - Point 2: 一个发光的 the 串起整部片
  - 可以照搬: 先写分镜文档，每场先截 3 到 4 张图检查
  - Caveat: 工具栈与耗时为作者自述
- **Visual:**
  - 16:9 card.
  - Clip map:
    - 0–7.0: `c3-0962-web`. "the" ignites 0.5; the sentence relights 3.0; words fly out radially 3.5–4.0; the golden
      attention web weaves 4.5–7.0.
    - 7.0–10.0: `c3-0962-burst`. The network bursts into particles and gathers into a glowing sphere.
- **Sync:**
  - secret on "画面" 1.34.
  - point 1 on "每" 4.04 (words fly into a ring).
  - point 2 on "独改" 4.67 (the web wraps "the").
  - takeaway on L2 5.26.
- **Footage:** `c3-0962-web`, `c3-0962-burst`, credit "@kimmonismus · 原作片段".
- **SFX:** template defaults.
- **Continuity:**
  - In: push.
  - Out: push; gold particles → sand-gold terrain.

## s09_c4 — Trick 4 (uc-1377): real data as the constraint   (≈ 9.5 s · dark · push · energy 2)
- **Voice:**
  - s09_c4.1: 第四招，用真实数据当约束。
  - s09_c4.2: 地形来自公开的高程数据。
  - s09_c4.3: 照搬：提示只写意图，和你不想要什么。
- **On screen (template fields):**
  - Tag: CASE 04 / 08
  - Work: 奥斯特里茨战役
  - Author: @WinterArc2125
  - Chip: 路线：代码渲染＋开放数据
  - Secret: 用真实数据当约束
  - Point 1: 地形取自公开高程数据，纵向放大 3 倍
  - Point 2: 地图讲移动，地面镜头给情绪
  - 可以照搬: 提示只写导演意图和不想要的效果，先配旁白再排镜头
  - Caveat: 作者自述：构建 90 分钟，渲染 4 小时
- **Visual:**
  - 16:9 card. All clips are cropped to 16:9 from inside the letterbox.
  - Clip map:
    - 0–3.0: `c4-1377-relief`. The parchment campaign map match-dissolves into real terrain relief 1.2–1.95, then
      tilts; blue unit blocks.
    - 3.0–6.0: `c4-1377-arrows`. Red arrows grow across the relief.
    - 6.0–9.5: `c4-1377-sun`. The sun breaks through the mist behind the ridge as the column advances.
- **Sync:**
  - secret on "真实" 1.68, exactly as paper turns into elevation data.
  - point 1 on "地形" 3.24 (arrows on terrain).
  - point 2 on "数据" 4.83.
  - takeaway 5.44, then the ground-level sun at 6.0 gives the emotion.
- **Footage:** `c4-1377-relief`, `c4-1377-arrows`, `c4-1377-sun`, credit "@WinterArc2125 · 原作片段". The pixelated
  3:29–3:35 range is not used.
- **SFX:** template defaults.
- **Continuity:**
  - In: push.
  - Out: push; sunlit sand → the off-white web page of case 5.

## s10_c5 — Trick 5 (gosail-072): the user's path is the storyboard   (≈ 10.5 s · dark · push · energy 2)
- **Voice:**
  - s10_c5.1: 第五招，用户路径就是分镜。
  - s10_c5.2: 按真实用法来拍：搜索，看结果，点详情。
  - s10_c5.3: 照搬：每个卖点，配一段真实界面。
- **On screen (template fields):**
  - Tag: CASE 05 / 08
  - Work: 网站产品宣传片
  - Author: @aiwarts
  - Chip: 路线：代码＋网站已有素材
  - Secret: 用户路径就是分镜
  - Point 1: 搜索、结果、详情，每步都是真界面
  - Point 2: 横竖两版共用时间轴，竖版重新排版
  - 可以照搬: 每个卖点配一段真实界面；竖屏单独排版，别直接裁
  - Caveat: 网页卡片里是他人作品，非 Opus 生成
- **Visual:**
  - 16:9 card.
  - Clip map:
    - 0–2.9: `c5-072-home` (1.5 s of motion, then hold). Site header "从作品结果，回到作者与方法。"; the 1318 stat box
      gets an orange frame.
    - 2.9–6.0: `c5-072-search`. Sticker "搜 威尼斯", typing 3.0–4.7, results 1318 → 1 at 4.73, push into the card. It
      stops before the third-party video fills the frame.
    - 6.0–9.9: `c5-072-prompt`. "完整 Prompt 一键复制"; copy click 7.0; zoom into the prompt text.
    - Hold to 10.5.
- **Sync:**
  - secret on "用户" 1.38.
  - point 1 on "搜索" 4.44 (typing on screen).
  - point 2 on "详情" 6.22 (details page).
  - takeaway on L3 7.00, landing with the copy click.
- **Footage:** `c5-072-home`, `c5-072-search`, `c5-072-prompt`, credit "@aiwarts · 原作片段". The 2.0–3.3 s range
  (@Just_sharon7's Seedance shot) is not used; the caveat covers the third-party cards visible inside the UI.
- **SFX:** template defaults.
- **Continuity:**
  - In: push.
  - Out: push; the off-white UI → the warm grey drawing paper of case 6.

## s11_c6 — Trick 6 (gosail-054): lock the product, change only the performance   (≈ 10.5 s · dark · push · energy 2)
- **Voice:**
  - s11_c6.1: 第六招，产品不动，只换演出。
  - s11_c6.2: 同一个 3D 手机模型，换了几种风格。
  - s11_c6.3: 照搬：模型锁死，只改镜头和光线。
- **On screen (template fields):**
  - Tag: CASE 06 / 08
  - Work: 手机 3D 概念片
  - Author: @yoshifujidesign
  - Chip: 路线：已有 3D 数据＋多版风格
  - Secret: 产品不动，只换演出
  - Point 1: 同一个 3D 模型，做出几版风格
  - Point 2: 橙线画出线稿，再一扫变成实物
  - 可以照搬: 模型、Logo、配色锁死，只让 AI 改镜头、光线和转场
  - Caveat: 片中参数为虚构；渲染工具未公开
- **Visual:**
  - 9:16 card, 372×662. The series dots sit at y ≈ 880, which is fine but tight.
  - Clip map:
    - 0–3.0: `c6-054-line`. The orange scanline draws the phone's line art bottom-up.
    - 3.0–5.7: `c6-054-render`. "RENDER xx%" scanline 3.35–5.1 turns line art into black glass and titanium.
    - 5.7–10.5: `c6-054b-plume`. The flat blue phone; a handwritten stroke circles it and writes "allure"; the phone
      flips.
- **Sync:**
  - secret on "产品" 1.39.
  - point 1 on "模型" 4.45 (mid-scan).
  - point 2 on "风格" 5.72. The card switches to the plume style at 5.70, on the word.
  - takeaway 6.38.
- **Footage:** `c6-054-line`, `c6-054-render`, `c6-054b-plume` (all from case gosail-054; the pre1 and pre2 files are
  not used), credit "@yoshifujidesign · 原作片段".
- **SFX:** template defaults. Optional swish at 5.70 (style switch).
- **Continuity:**
  - In: push.
  - Out: push; pastel blue → the black and magenta of case 7.

## s12_c7 — Trick 7 (uc-2348): let motion drive the effects   (≈ 10.5 s · dark · push · energy 2)
- **Voice:**
  - s12_c7.1: 第七招，让动作驱动特效。
  - s12_c7.2: 舞者来自生成模型，骨架数据让歌词挂在手上。
  - s12_c7.3: 照搬：挑两三个动作，各绑一种效果。
- **On screen (template fields):**
  - Tag: CASE 07 / 08
  - Work: 舞蹈骨架 MV
  - Author: @aicreataro
  - Chip: 路线：生成素材＋AE 合成
  - Secret: 让动作驱动特效
  - Point 1: 先给观众看骨架数据，再看效果
  - Point 2: 举手挂歌词，出拳射字，落地炸光
  - 可以照搬: 只挑两三个动作，各绑一种效果，用完就收
  - Caveat: 据作者：舞者和歌由生成模型制作
- **Visual:**
  - 16:9 card.
  - Clip map:
    - 0–2.25: `c7-2348-skel`. Skeleton-only on black; landing burst 0.46; magenta rings and "光れ".
    - 2.25–5.875: `c7-2348-lyric`. The lyric column grows from the raised hand, with wrist coordinate labels.
    - 5.875–7.66: `c7-2348-fist`. "今を" shoots out of the fist.
    - 7.66–10.16: `c7-2348-hikare`. HIKARE fills magenta; TARGET LOCKED.
    - Hold to 10.5.
- **Sync:**
  - secret on "动作" 1.55 (the landing burst).
  - "生成模型" (3.6–3.9) with the dancer on screen. The voice states the provenance.
  - point 1 on "骨架" 4.78.
  - point 2 on "歌词" 5.81; the fist shot follows at 5.875.
  - takeaway 7.12.
- **Footage:** `c7-2348-skel`, `c7-2348-lyric`, `c7-2348-fist`, `c7-2348-hikare`, credit "@aicreataro · 原作片段". The
  photosensitive ranges 0–1.8 s and 15.79–16.33 s and the 12.75 s flash are excluded.
- **SFX:** template defaults only. No extra impacts: the footage is already loud visually.
- **Continuity:**
  - In: push.
  - Out: push; magenta → orange velvet.

## s13_c8 — Trick 8 (gosail-133): several models, each owning one job   (≈ 11.0 s · dark · push · energy 2)
- **Voice:**
  - s13_c8.1: 第八招，多个模型，各管一段。
  - s13_c8.2: Opus 写代码统筹，人物和布景交给生成模型。
  - s13_c8.3: 照搬：给每个镜头写清分工和验收标准。
- **On screen (template fields):**
  - Tag: CASE 08 / 08
  - Work: 五幕舞台短片
  - Author: @KanaWorks_AI
  - Chip: 路线：多模型制作
  - Secret: 多模型各管一段
  - Point 1: Opus 管统筹，Seedance 管动作
  - Point 2: GPT Image 出布景，换景藏在幕后
  - 可以照搬: 先搭固定舞台，每个镜头写清输入、工具和验收标准
  - Caveat: 分工为作者自述，不是模型排名
- **Visual:**
  - 16:9 card (720p source).
  - Clip map:
    - 0–2.667: `c8-133-open`. Title "KanaWorks_AI / a pop-up dance"; the curtain opens 1.0–1.375.
    - 2.667–5.917: `c8-133-swap`. Paris set; the curtain closes 4.63–4.96 and the set swaps behind it; reopens.
    - 5.917–8.833: `c8-133-night`. Jump; the curtain closes mid-air; the night sky is revealed 7.17–7.5.
    - Hold on the night sky to 11.0.
- **Sync:**
  - secret on "多个" 1.34 (curtain opening).
  - point 1 on "Opus" 3.06.
  - point 2 on "人物" 4.90, while the curtain is closed and the set swap is hidden.
  - takeaway 7.16, as the night sky is revealed.
- **Footage:** `c8-133-open`, `c8-133-swap`, `c8-133-night`, credit "@KanaWorks_AI · 原作片段".
- **SFX:** template defaults.
- **Continuity:**
  - In: push.
  - Out: iris into the synthesis. All 8 lime "secret" lines reappear there as chips.

---

## s14_formula — Synthesis: beauty comes from directing, not from Opus "drawing"   (≈ 10.0 s · dark · iris · energy 1)
- **Voice:**
  - s14_formula.1: 所以，好看不是因为 Opus 会画画。
  - s14_formula.2: 而是叙事、少量规则、统一时间轴、声音落点，加上反复检查。
- **On screen:**
  - **8 recap chips:** 4×2 grid. Each is 400×64, with a lime 2 px outline and lime body text 28 px. Each is numbered
    with a small mono 18 px fog prefix "01"…"08". Texts in order:
    - 一个形体贯穿全片
    - 暖色只留给高潮
    - 画面、旁白、配乐分层做
    - 用真实数据当约束
    - 用户路径就是分镜
    - 产品不动，只换演出
    - 让动作驱动特效
    - 多模型各管一段
  - **Struck phrase (H1 96 px, snow):** "Opus 会画画".
  - **Equation row (H2 64 px):** "好看 =" (snow), then pills "叙事", "少量规则", "统一时间轴", "声音落点", "反复检查"
    joined by "+" (fog). Pills are night-2 with a 2 px lime border and snow text; each fills lime with ink text as it
    lands, then settles back to outline (the newest stays lime).
- **Visual:**
  - The 8 chips pop in at 0.2–1.0 (stagger 0.1, `K.pop`), in a grid at y 600–760, recalling the carousel.
  - "Opus 会画画" types in at centre y 300 on "Opus" (2.52). On "画画" (3.23) a lime strike slashes through it
    (0.2 s), with a 4 px shake.
  - Line 2:
    - The struck phrase drops away (fall + fade 0.4 s).
    - The 8 chips dissolve into lime particles (canvas, ≤ 400 particles, seeded) that stream up into the equation row
      at y 470.
    - Each pill materialises on its word.
  - Hold with a slow push-in 1.00→1.03.
- **Sync:**
  - "Opus" 2.52 → phrase.
  - "画画" 3.23 → strike.
  - Pills land on 叙事 4.12 · 少量 4.85 · 统一 5.98 · 声音 7.05 · 反复 8.41.
  - "检查" 8.75 → the whole row glows once.
- **Footage:** none.
- **SFX:**
  - ticks for the chip pop-ins.
  - glitch at 3.23.
  - blip at each pill (5×).
  - ding at 8.75.
  - (The iris whoosh is automatic.)
- **Continuity:**
  - In: the carousel's lime secrets become the chips.
  - Out: the lime equation pills hand over to the lime step pill in s15 (wipe = chapter change; the theme flips to
    paper).

---

### Worksheet chapter (s15–s20) — shared notes
- **Theme:** light (`grid-paper`).
- **Step rail:** at the top of the content box, y 150–198, centred.
  - Six pills, 200 px wide, 48 px tall, gap 24: "1 环境", "2 路线", "3 需求", "4 小样", "5 反馈", "6 验收".
  - Inactive pills: white fill, 1.5 px `--line` border, ink-2 24 px.
  - Active pill: lime fill, ink 26 px 800, 260 px wide, with a mono "STEP n/6" (16 px) inside.
  - Between scenes the active pill springs from one slot to the next. This is the same lime pill.
- **Headlines:** H2 72 px 800 ink, x 112, y 230.
- **Commands:** `K.terminal({light: true})` and code boxes on #F3F0F1. Commands are shown, never read aloud.

## s15_env — Step 1: an AI environment that can run code   (≈ 11.0 s · light · wipe · energy 1)
- **Voice:**
  - s15_env.1: 第一步，准备一个能运行代码的 AI 环境，比如 Claude Code。
  - s15_env.2: 再装 Node.js 和 FFmpeg。注意，它要付费账号。
- **On screen:**
  - **Rail:** step 1 active.
  - **Headline:** "能运行代码的 AI 环境".
  - **Terminal (light, 1040×300 at x 112, y 330, size 26, title "Terminal"):**
    ```
    $ curl -fsSL https://claude.ai/install.sh | bash
    $ claude
    ```
  - **Line under the terminal (mono 22, ink-2, y 655):** "Windows PowerShell：irm https://claude.ai/install.ps1 | iex".
  - **Checklist (`K.checklist`, light, size 40, w 560, at x 1240, y 330):**
    1. "Claude Code", sub "需要付费账号（Pro 起）"
    2. "Node.js"
    3. "FFmpeg"
  - **Footnote (22 px, ink-2, y 800–856, two lines):** "Claude Code 需要 Pro、Max、Team、Enterprise 或 Console
    账号，免费版不含；" / "仅在 Anthropic 支持的国家和地区提供。"
- **Visual:**
  - The rail's lime pill slides in from the left edge, chasing the wipe bar.
  - The headline per-character rise on "准备" (1.26). `K.title` uses ink colour.
  - Terminal line 1 types from 1.9 over 1.2 s; `claude` types on "Claude" (4.12).
  - Checklist items appear on "Claude" 4.12, "Node" 5.77 and "FFmpeg" 7.02.
    - Ticks: Node 6.20, FFmpeg 7.40.
    - Item 1 ticks on "付费" (9.46), and its sub gets a lime marker (`K.marker` fill) at the same time.
  - The footnote fades up on "注意" (8.36).
- **Sync:** 准备 1.26 · Claude 4.12 · Node 5.77 · js 6.20 · FFmpeg 7.02 · 注意 8.36 · 付费 9.46.
- **Footage:** none.
- **SFX:**
  - type during terminal typing.
  - tick on each checklist tick.
  - pop at 9.46.
  - (The wipe whoosh is automatic.)
- **Continuity:**
  - In: the lime pill becomes step 1.
  - Out: wipe-up; the pill hops to step 2.

## s16_routes — Step 2: pick a route (real commands on screen)   (≈ 12.0 s · light · wipe-up · energy 1)
- **Voice:**
  - s16_routes.1: 第二步，选路线。做字幕、图表、界面，用 HyperFrames 或 Remotion。
  - s16_routes.2: 想全部自己掌控，就像本片，用网页加无头浏览器。
- **On screen:**
  - **Rail:** step 2 active.
  - **Headline:** "选一条路线".
  - **Three route rows:** white cards 1696×150, radius 20, 1.5 px line, at y 300, 470, 640. Each has a label block on
    the left (x 140–660) and a command box on the right (x 680–1780, mono 22 px, 3 lines).
    - **Row A:**
      - Name: "HyperFrames" (H3 44 px 800)
      - Sub: "写网页动画 · 字幕、图表、界面" (body 26, ink-2)
      - Chip: "Apache 2.0"
      - Commands:
        ```
        $ npx hyperframes init my-video
        $ cd my-video
        $ npx hyperframes render --output out.mp4
        ```
    - **Row B:**
      - Name: "Remotion"
      - Sub: "写 React 组件 · 字幕、图表、界面"
      - Chip: "个人与小团队免费"
      - Commands:
        ```
        $ npx create-video@latest --yes --blank --no-tailwind my-video
        $ cd my-video && npm i
        $ npx remotion render MyComp out/video.mp4
        ```
    - **Row C:**
      - Name: "网页＋无头浏览器"
      - Sub: "自己写 renderFrame(t) · 完全掌控"
      - Chip: "本片同款" (lime fill, ink text)
      - Commands:
        ```
        $ npm i puppeteer
        $ node render.mjs
        $ ffmpeg -framerate 30 -i frames/%05d.png -c:v libx264 -pix_fmt yuv420p out.mp4
        ```
  - **Sticker (Smiley Sans oblique 36 px, ink on a lime marker, rotated −4°, at x 1500, y 236):** "暂停就能抄". This is
    the one playful accent in the scene.
  - **Footnote (20 px, ink-2, y 820):** "Remotion：个人与 3 人内团队免费，更大的营利公司需付费许可 · HyperFrames 需 Node 22+
    与 FFmpeg，默认开启匿名遥测（可关闭）".
- **Visual:**
  - The rows slide up in sequence at 0.6, 0.75 and 0.9, with commands hidden.
  - When a row is named, it gets a 6 px lime left border, scale 1.015 and a soft shadow, and its commands type (0.8 s,
    `typed`). The other rows dim to 70 %.
  - Row C types its three lines over 8.6–10.6.
  - The sticker slaps on at 10.6 (`K.pop` from 1.4 → 1).
- **Sync:** 选路线 1.27 → headline · HyperFrames 4.77 → row A · Remotion 5.97 → row B · 本片 8.62 → row C + "本片同款"
  chip pop · 浏览器 10.53 → row C finishes and the sticker follows.
- **Footage:** none.
- **SFX:**
  - type under each row's typing.
  - blip at each row highlight.
  - pop at 10.6 (sticker).
- **Continuity:**
  - In: the rail pill moves 1→2.
  - Out: push left. A side-step: the rail stays on step 2.

## s17_plugin — Shortcut: a style plugin, and the one sentence to add   (≈ 9.0 s · light · push · energy 1)
- **Voice:**
  - s17_plugin.1: 不想从头写？装个 Lemo-Opuscar 风格插件，内置 43 种风格。
  - s17_plugin.2: 记得加一句：先给我看分镜。
- **On screen:**
  - **Rail:** step 2 active, with a small lime-outline badge "＋捷径" attached.
  - **Headline:** "捷径：风格插件".
  - **Terminal (light, 900×200 at x 112, y 320, size 24):**
    ```
    $ claude plugin marketplace add lemomo-ai/lemo-opuscar
    $ claude plugin install lemo-opuscar@lemolab
    ```
  - **Chat (`K.chat`, light, 760×300 at x 1048, y 320, title "Claude Code"):**
    - Tag above it (mono 18, ink-2): "示意".
    - User bubble: "用水彩笔刷风格，做一支 20 秒的短片，讲我家的猫。先给我看分镜。"
  - **Style ribbon (y 560–704):** 43 code-drawn mini swatches, each 68×68 with a gap of 8, in two rows of 22 and 21. Each
    is a different seeded pattern: brush stroke, dots, stripes, gradient, grain. Each carries a mono 14 px number
    01–43. Tag "示意".
  - **Caption (body 26, ink-2, y 730):** "43 种风格 · 每种一份风格提示＋纯代码样片 · MIT".
  - **Footnote (20 px, ink-2, y 820–870, two lines):** "需要 Node 20+、ffmpeg、Python 3.11+；Windows 用 WSL；3D
    风格要 GPU" / "它默认直接出片、30–60 秒：第一支可以要 15–30 秒".
- **Visual:**
  - Terminal line 1 types on "Lemo-Opuscar" (2.42); line 2 types at 3.40.
  - Swatches cascade in on "内置" (4.24); a counter caption ticks 0→43 and lands on "43" (4.58).
  - The chat bubble types 5.78–7.40.
  - On "分镜" (7.58), a lime marker draws behind "先给我看分镜" (`K.marker`, 0.35 s).
- **Sync:** Lemo-Opuscar 2.42 · 内置 4.24 · 43 4.58 · 记得 5.78 · 分镜 7.58.
- **Footage:** none. No Lemo sample frames are used; the swatches are our own abstract drawings, labelled 示意.
- **SFX:**
  - type during terminal and chat typing.
  - ticks rippling with the swatches.
  - ding at 7.58.
- **Continuity:**
  - In: pushed from the right of step 2.
  - Out: wipe-up; the rail pill moves 2→3, and the lime marker motif continues.

## s18_prompt — Step 3: write the request with the template   (≈ 10.5 s · light · wipe-up · energy 1)
- **Voice:**
  - s18_prompt.1: 第三步，用模板写需求：给谁看，记住什么，多长，什么画幅。
  - s18_prompt.2: 再让它先列出缺口，不确定的，别写成事实。
- **On screen:**
  - **Rail:** step 3 active.
  - **Worksheet card:** white, 1100×610, radius 24, shadow, at x 112, y 225.
    - Header: "制作提示模板（节选）" (H3 40 ink), with a mono tag "PROMPT".
    - Eight lines (body 30, line-height 1.6):
      - 我要为［目标观众］做一支［用途］视频。
      - 观众看完应该记住：［一句话主旨］。
      - 规格：［时长］，［画幅］，［帧率］。
      - 已有材料：［资料、素材与可用范围］。
      - 必须保持：［事实、产品外形、品牌］。
      - 允许创作：［镜头、转场、背景］。
      - 先列出缺口；不确定的，不要写成事实。
      - 本轮只交：分镜表、三张风格帧、一个小样。
  - **Sticky note (lilac paper #EAD8EB, 480×220, rotated 2°, at x 1290, y 260):**
    - "完整模板见 WaytoAGI 原文" (body 28 ink)
    - "原创模板，不是任何案例的原提示" (20 px ink-2)
- **Visual:**
  - The card slides up at 0.3; the lines fade in staggered 0.4–1.6.
  - Bracketed fields get lime `K.marker` highlights on their words.
  - Lines 5–6 get a soft underline sweep at 5.9–6.3, with no voice.
  - Line 7 is marked on "缺口"; "不要写成事实" is marked on "事实".
  - The sticky note drops in at 2.0, with a slight spring.
- **Sync:** 给 2.77 / 谁 2.91 → ［目标观众］ · 记住 3.71 → ［一句话主旨］ · 多 4.58 → ［时长］ · 画幅 5.67 → ［画幅］ ·
  缺口 7.16 → line 7 · 事实 9.25 → "不要写成事实".
- **Footage:** none.
- **SFX:**
  - swish for each marker (soft, gain 0.25).
  - pop at 9.25.
- **Continuity:**
  - In: the marker pills from s17.
  - Out: wipe-up; the last line "本轮只交：分镜表、三张风格帧、一个小样" becomes s19's pipeline.

## s19_loop — Steps 4 and 5: sample before the full piece; feedback = time + problem + expectation   (≈ 10.5 s · light · wipe-up · energy 1)
- **Voice:**
  - s19_loop.1: 第四步，先要分镜、三张风格帧和一个小样，别急着要成片。
  - s19_loop.2: 第五步，反馈写成：时间点，问题，期望。
- **On screen:**
  - **Rail:** step 4 active, sliding to step 5 at 5.57.
  - **Phase A pipeline:** four cards (300×220, white) at y 330, x 160 / 600 / 1040 / 1480, joined by `K.flow` edges in
    green.
    - "分镜表": mini table with 4 rows, labels 时间 / 画面 / 文字 / 声音.
    - "风格帧 ×3": three tiny 16:9 frames labelled 开头 / 中间 / 结尾.
    - "5 秒小样": a mini player with a play triangle and a scrubber.
    - "全片": greyed, with a lock glyph and the label "确认小样后再做".
  - **Phase B review player:** white card 1500×300 at x 210, y 430.
    - A 30-second timeline, ticks every 5 s (mono 20).
    - A lime range marker over 8–11 s.
    - Feedback note below it (body 32, ink, y 640): "第 8–11 秒｜标题还没读完就消失｜请延长停留，压缩下一段空镜"
      (example from the article).
    - Three segment labels above the note (mono 20): "时间点" (lime marker), "问题" (lilac marker), "期望" (green
      underline).
    - Row (body 24, ink-2, y 760): "每轮只改一类：故事 › 构图 › 动作 › 声音".
- **Visual:**
  - **A:** the cards pop on their words; edges draw with green packets.
    - On "别急着" (4.45) the 全片 card does a "no" shake (±10 px, 3 cycles) and its lock glints.
  - **B (5.57):**
    - The pipeline shrinks and lifts to y 250 at 55 % scale (a reminder strip).
    - The review player slides up, and its lime range marker draws on "时间点".
    - The note types 7.5–9.3. Each segment's label and highlight lands on its word.
    - The "每轮只改一类" row appears at 9.8.
- **Sync:** 分镜 1.61 · 三 2.35 · 小样 3.81 · 别 4.45 · 第五 5.57 (rail) · 时间点 7.52 · 问题 8.49 · 期望 9.31.
- **Footage:** none.
- **SFX:**
  - pop per card.
  - glitch (soft "no") at 4.45.
  - tick per highlight.
  - type under the note.
- **Continuity:**
  - In: the "本轮只交" line becomes the pipeline.
  - Out: wipe-up; the rail pill moves to step 6.

## s20_ship — Step 6: check everything; then your first 15–30 s piece   (≈ 13.5 s · light · wipe-up · energy 1)
- **Voice:**
  - s20_ship.1: 第六步，验收：静帧、片段、带声音的完整版，都要看。
  - s20_ship.2: 模型看不了视频，就让它抽帧来看。
  - s20_ship.3: 你的第一支，就从 15 到 30 秒开始。
- **On screen:**
  - **Rail:** step 6 active.
  - **Checklist (light, size 38, w 920, at x 112, y 270):**
    1. "静帧", sub "溢出、错字、遮挡"
    2. "片段", sub "转场、穿帮"
    3. "带声音看完整版"
    4. "手机上再看一遍"
    5. "保留工程和素材来源"
  - **Tip card (white, 640×300, at x 1160, y 270):**
    - Mono tag "小提示"
    - "模型看不了视频" (H3 44 ink)
    - "让它先抽帧，再看图" (body 30 ink-2)
    - A mini film strip of 4 frames → arrow → eye glyph.
  - **Homework card (Phase B, centred):**
    - "你的第一支" (H2 72 ink)
    - "15–30 秒" (Space Grotesk 180 px, green-deep #176A42)
    - Three lime pills with ink text, 34 px: "一个主体", "一个目标", "一个转折"
    - "前 3 秒抓人 · 先找一个对标" (body 26 ink-2)
- **Visual:**
  - Checklist rows appear and tick on their words. Items 4 and 5 tick at 5.0 and 5.4, with no voice.
  - The tip card drops in on "模型" (6.02); its film strip "extracts" frames (cells slide out) on "抽帧" (7.98).
  - Phase B (8.95):
    - The checklist and tip card slide up and fade (0.4 s).
    - The homework card assembles: the title on "第一" (8.95), the big number lands on "15 到 30 秒" (10.40), the
      pills pop at 11.0 / 11.2 / 11.4, and the small line at 11.8.
  - Hold to 13.5 with a gentle push-in.
- **Sync:** 静帧 2.23 · 片段 3.00 · 完整版 4.44 · 模型 6.02 · 抽帧 7.98 · 你的第一 8.95 · 15 到 30 秒 10.40.
- **Footage:** none.
- **SFX:**
  - tick per tick.
  - shutter at 7.98.
  - impact (light) at 10.40.
  - pops at 11.0 / 11.2 / 11.4.
  - riser 12.0→13.5 into the downbeat at 206.0, which lifts the meta reveal.
- **Continuity:**
  - In: rail pill on step 6.
  - Out: the lime "一个转折" pill is the last thing that moves. The lime wipe bar sweeps it into chapter 04.

---

## s21_meta — Reveal: this film was made the same way; the lime pill was trick #1 all along   (≈ 18.5 s · dark · wipe · energy 3)
- **Voice:**
  - s21_meta.1: 揭个底：你正在看的这支片子，也是这么做的。
  - s21_meta.2: Opus 5.5 在 Claude Code 里，写了场景、时间轴和配乐程序。
  - s21_meta.3: Chrome 浏览器逐帧截图，配音是微软的语音合成。
  - s21_meta.4: 还记得第一招吗？这颗绿色胶囊，贯穿了全片。
- **On screen:**
  - **Our command palette (Phase A):** dark, night-2 panel 900×430 centred at y 480, lime accents.
    - Search field types "这支片子" (cn 40 px).
    - List rows (body 30, snow, mono icons):
      - "场景代码 · {{SCENES}} 个场景"
      - "时间轴 · 按语音逐词对齐"
      - "配乐 · Python 程序合成"
      - "逐帧截图 · 无头 Chrome"
      - "每一帧，都是代码" (lime)
  - **Claude Code window (Phase B):** `K.windowFrame` 1500×520 at x 210, y 200, title "Claude Code".
    - Three file tabs (mono 24): "src/scenes/*.js", "src/timeline.js" and "tools/music.py", each with a small badge
      "{{CODE_LINES}} 行" on the first.
    - Body: real code lines from this film's s02_title scene. Paste about 10 lines from `src/scenes/s02_title.js` once
      it exists; no invented code.
  - **Film timeline (Phase C):** a bar 1600×56 at y 520.
    - Built from `window.TIMELINE.scenes`, with block widths proportional to duration and colour by chapter: 00 lime,
      01 lilac, 02 snow 20 %, 03 green, 04 purple.
    - Below it, a voice track drawn from `TIMELINE.lines[].words`: one bar per word, height ∝ duration, lime 60 %.
    - Labels (body 26, fog): "画面：无头 Chrome 逐帧截图" and "配音：微软语音合成（edge-tts）· 字幕按词对齐".
  - **FRAME counter:** returns at the top-right of the content box (x right 1808, y 150, mono 56 lime). It shows the
    real absolute frame number and rockets to "{{FRAMES}}" during the playhead sweep.
  - **Callback (Phase D):**
    - Chip "CASE 01 · 一个形体贯穿全片" (lime text, 28 px).
    - The centre pill (lime, 420×120, label "每一帧，都是代码" in ink, 44 px 800).
    - Six memory vignettes (300×169, line-art in snow 2 px on night-2), each with a mono 18 px caption:
      - "s02 标题下划线"
      - "s03 输出：文本"
      - "s04 时间播放头"
      - "s06–s13 案例圆点"
      - "s15–s20 步骤条"
      - "s21 选中条"
  - **Bottom stats line (mono 26, fog, y 830):** "{{SCENES}} 个场景 · {{CODE_LINES}} 行代码 · {{FRAMES}} 帧 · 渲染
    {{RENDER_MIN}} 分钟 · 原作片段归各作者".
- **Visual:**
  - **A (0.48–4.45):**
    - The lime pill (carried by the wipe) grows into the palette (spring, 0.4 s).
    - The query types in sync with "你正在看的这支片子" (1.39–2.90), and the list filters.
    - The selection bar (lime pill) moves down to "每一帧，都是代码"; Enter on "做" (4.14).
    - The palette collapses into a 12 px vertical lime scanline with glow at the left edge.
  - **B (4.67–9.51):**
    - The scanline sweeps left→right (4.67–6.60, inOutCubic). Ahead of it, the title card is re-rendered live (hero
      "每一帧，都是代码" and its underline). Behind it, the same composition becomes an X-ray: 1.5 px lime element boxes
      with mono labels such as `K.title(…)` and `.pill`, plus the Claude Code window with the real code.
    - Tabs pop on "场景" (7.35), "时间" (7.98) and "配乐" (8.91).
  - **C (9.73–13.28):**
    - The window shrinks into the film timeline bar.
    - The playhead (lime pill) sweeps the whole film 9.73–12.20, and the FRAME counter races in step.
    - On "配音" (11.59) the voice-track bars light up word by word, left to right (2 s); the label lands on "合成"
      (12.82).
  - **D (13.50–17.49):**
    - The chip "CASE 01 · 一个形体贯穿全片" pops on "第一" (13.93).
    - On "这颗" (15.11) the playhead pill detaches, flies to centre and scales up (it is the hero, with its label
      typing in).
    - The six memory vignettes flash in around it, in a ring at radius 420.
    - On "贯穿" (16.55) a thin lime line draws from each vignette to the pill (0.4 s, stagger 60 ms).
    - The stats line types on "全片" (17.00).
  - Hold to 18.5; the pill stays at (960, 540) for the iris.
- **Sync:** 揭 0.48 · 片子 2.80 · 做 4.14 · Opus 4.67 · 场景 7.35 · 时间 7.98 · 配乐 8.91 · Chrome 9.73 · 配音 11.59 ·
  合成 12.82 · 第一 13.93 · 这颗 15.11 · 胶囊 15.87 · 贯穿 16.55 · 全片 17.00.
- **Footage:** none. All 100 % our own render, so no case credit is needed. The stats line still says "原作片段归各作者".
- **SFX:**
  - (The wipe whoosh is automatic.)
  - pop at 0.48 (palette).
  - type during the query.
  - blip at the selection; impact at 4.14 (Enter).
  - glitch (soft) at the start of the scanline, and riser 4.67→6.60.
  - pop at each of the three tabs.
  - rapid shutter ticks accelerating 9.73→12.20 (rendered frames).
  - sparkle at 12.82.
  - boom at 15.11 (pill to centre).
  - ding at 16.55.
- **Continuity:**
  - In: the lime wipe bar becomes the palette.
  - Out: the pill at the exact frame centre is the iris origin for s22.

## s22_end — End card and CTA; the pill becomes the replay button   (≈ 6.5 s · dark · iris (960, 540) · energy 2)
- **Voice:**
  - s22_end.1: 完整文章和 5181 个案例，都在 WaytoAGI。
    (`say` uses "Way to AGI".)
- **On screen:**
  - **Logo:** WaytoAGI logo (`LOGO_DARK`, height 88) centred at y 180–268.
  - **Left column (x 160–940, from y 340):**
    - Tag "读全文"
    - "WaytoAGI 飞书知识库" (H3 48, snow)
    - "《Opus 5.5 怎样把代码变成视频：" / "8 个精选案例与制作经验》" (body 30, fog, two lines)
  - **Right column (x 1000–1760, from y 340):**
    - Tag "逛案例"
    - "waytoagi.com/usecase-atlas/opus5-5" (mono 32, lime)
    - "5,181 个案例 · 视频类 1,704 个" (body 32, snow; the numbers count up)
    - "截至 10 月 1 日 WaytoAGI 收录" (22 px, fog)
  - **Button:** a lime pill 640×110 at y 690, "每一帧，都是代码" (ink, 46 px 800), with a cursor arrow.
  - **Credit line (mono 20, fog, y 850):** "原作片段：@twoclipping @morpheusdv @kimmonismus @WinterArc2125 @aiwarts
    @yoshifujidesign @aicreataro @KanaWorks_AI".
  - Subtitles off; chrome off. The logo is in the composition.
- **Visual:**
  - The iris opens from the pill.
  - The pill drops to y 690 and becomes the button (springs to its final width).
  - The columns rise in on "文章" (0.91) and "5181 个" (1.64); the count lands at 2.40.
  - The logo glows softly on "Way" (3.53).
  - **At 5.2:** the cursor glides in from the bottom-right and clicks the button at 5.80. The pill squashes 0.92 and
    blur-swaps its text to "↺" for 3 frames, then returns. This echoes lists-006's loop back to "Generate" and our
    own cold open.
  - The last frame is the clean end card.
- **Sync:** 文章 0.91 · 5181 个 1.64 · Way 3.53 · click 5.80.
- **Footage:** none.
- **SFX:**
  - (The iris whoosh is automatic.)
  - pop at 0.91.
  - ticks while counting.
  - sparkle at 3.53.
  - click: pop at 5.80, then a soft ding at 6.0.
- **Continuity:**
  - In: the meta-scene pill becomes the iris and then the button.
  - Out: the first-frame echo; the button invites a replay. End of film.

---

## What was verified for this draft
- **Runtime and line timings:** `.venv/bin/python tools/build_timeline.py script/drafts/A/narration.json --dry` gives
  231.00 s (3:51.0) and 22 scenes. Per-line speech and word tokens were read from the TTS cache. Every case `cues`
  word resolves to exactly one token under the engine's substring rule.
- **Subtitles:** chunks run through the builder's `split_subs` stay at 18 visible characters or fewer.
- **Pronunciation:** spot-checked with the local Whisper (small) model. The phrasings "能跑代码", "从零写", "静帧自查" and
  "挑了 8 招" were replaced because they were ambiguous by ear. English product names read correctly.
- **Clips:** every range in `clips.json` is inside its source (ffprobe) and avoids the excluded ranges:
  - uc-2348 0–1.8 s and 15.79–16.33 s
  - gosail-072 2.0–3.3 s
  - gosail-054-pre1 and pre2 (not used at all)
- **Crops:** the crop framings (uc-1377 16:9 inside the letterbox, lists-006 centre 16:9, gosail-060 tree zoom) were
  checked on extracted stills.
- **To fill after the render:** `{{FRAMES}}`, `{{CODE_LINES}}`, `{{SCENES}}` and `{{RENDER_MIN}}`, which appear on
  screen only (s21). For s21's X-ray, paste real lines from `src/scenes/s02_title.js` once it exists.

