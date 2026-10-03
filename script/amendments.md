# Storyboard amendments (override script/storyboard.md where they differ)

Applied after the fact-check and beginner/voice verification (2026-10-01). Voice lines in script/narration.json are already
updated; timings in storyboard.md are therefore approximate — always use ctx.word()/ctx.cue() against src/timeline.js.

## Global
- G1. Shared pieces now live in src/lib/shared.js and MUST be used (do not re-implement):
  - `PAGE.draw(g, t, w, h)` — the flip-book page drawer (exactly the storyboard's reference implementation). s04 prints
    `PAGE.draw.toString()` in its code panel and draws every page/tile with it; s18 and s19 reuse it for their samples.
  - `K.stepRail()` → `{el, render(t, active, prev)}` — the six-step rail for s15–s20 (labels 1 环境 2 路线 3 需求 4 小样 5 反馈
    6 检查; step 6 was renamed from 验收). `active` is 0-based (s15 → 0 … s20 → 5); `prev` = active − 1 (s15: −1 → no hop).
    Append `rail.el` to your root; it positions itself at y 150–198.
  - `K.sticker('暂停就能抄')` → `{el, render(t, start)}`; place with el.style.left/top.
  - `K.chip(text, {light, accent, size})` → a small credit/provenance chip element (absolute; set left/top).
- G2. Wall/rack/mini-card thumbnail for case 05 is `ctx.clipUrl('c5-072-brand', 0.65)` (never assets/wall/gosail-072.jpg).
- G3. On-screen text that must be read needs ≥ (chars ÷ 4.5 + 1.5) s of visibility.

## s01_cold
- Footage description fixes (the builder must look at the frames anyway): in the 4.00–6.50 row, 「Search ⌘K」 pill expands into
  「Type a command」 (4.16–4.20 of the clip).

## s02_title
- s02_title.1 now speaks slower (rate −8 %, gapAfter 0.12): re-read word times from timeline.js.
- Start the H3 rise at ≈3.0 s (not 3.57) so it stays ≥ 5.1 s.

## s04_render
- s04_render.1 is now 「代码视频就像一本手翻书。给一个时间，就算出那一页。」 and s04_render.5 is 「再用 FFmpeg 把这些帧拼成视频。」
  (TTS reads "F F mpeg": `ctx.word('s04_render.5', 'FFmpeg')` matches the 'mpeg' token). Re-read all word times.
- Code panel: `PAGE.draw.toString()` from src/lib/shared.js (header comment: `// src/lib/shared.js · 本幕正在运行的代码`).
- Keep the determinism stamp 「同一帧 ✓」 and its footnote visible as a footer (y ≈ 846) until the end of the scene.

## s05_wall
- s05_wall.3 is now 「我们挑了 8 个，每个一招。」: the fly-to-rack cue is `ctx.word('s05_wall.3', '每个')`.
- s05_wall.2 TTS says "Way to A G I" (subtitles timed proportionally); cue words in that line may differ — check timeline.js.
- H1 「差在导演功夫」: at ≈4.0 s shrink it to a 64 px header at y ≈ 170 instead of exiting; keep it until 「8 个」.
- Wall footnote stays: 「缩略图来自 WaytoAGI 案例库，版权归各作者 · 收录作品并非都由 Opus 代码渲染」.

## s14_formula
- Term threads (which cases illustrate which term) must be: 「叙事」 01 · 03 · 05 · 「少量规则」 02 · 06 · 08 · 「统一时间轴」 01 · 03 ·
  「声音落点」 01 · 04 · 07 · 「反复检查」 01 · 03. Every case keeps ≥ 1 thread.
- The footnote fades in at 0.5 s (not 4.2).

## s15_env
- s15_env.1 → 「轮到你了。第一步，准备一个能运行代码的 AI 工具，比如 Claude Code。」; headline 「第一步 · 能运行代码的 AI 工具」.
- s15_env.2 → 「再装 Node 和 FFmpeg。注意，Claude Code 要付费账号。」
- Footnote: ONE line that fades in at 「准备」 together with the terminal:
  「Claude Code 需付费账号（Pro 起），免费版不含；官方支持地区不含中国大陆、香港、澳门（2026-10-01 核对）」 (film review round 2)
- Terminal lines after `$ ffmpeg -version`: `$ mkdir my-video` / `$ cd my-video` / `$ claude      # 首次运行按提示登录，然后用中文提需求`
  (separate lines; no &&). Make the terminal tall enough (or font 22) so all 7 lines fit.
- Replace the single line under the terminal with three lines (mono 22, ink-2; film review: one joined line ran into the
  checklist column):
  「Windows PowerShell：irm https://claude.ai/install.ps1 | iex」
  「缺 Node：nodejs.org 装 LTS 版」
  「缺 FFmpeg：Mac 用 brew install ffmpeg；Windows 可先走 Remotion（自带 FFmpeg）」
- Use K.stepRail (active 0) and K.sticker.

## s16_routes
- s16_routes.3 → 「想要现成风格，就装 Lemo-Opuscar。再加一句：先给我看分镜。」
- Card A (HyperFrames) code: plugin invocation comment 「# 然后新开会话，用 /hyperframes:hyperframes 提需求」; add the line
  `$ npx hyperframes telemetry disable   # 可选：关闭匿名遥测`; its note becomes 「需 Node 22+ 与 FFmpeg」.
- Card B (Remotion): `$ cd my-video` and `$ npm i` on separate lines; licence note 「个人和 3 人内团队免费，大公司需买许可」.
- Card C (pure HTML): `$ npm init -y` and `$ npm i puppeteer` on separate lines; chip 「本片同路线」; footnote
  「本片用 Playwright 驱动无头 Chrome」.
- Card D (Lemo-Opuscar): the 43-swatch strip is our own illustration → corner tag 「示意」.
- Lemo chat bubble: lay it out at 35 % ink from the scroll (≈6.8 s) and type it to full ink at the word 「Lemo」.
- Use K.stepRail (active 1, prev 0) and K.sticker.

## s17_prompt
- Add K.sticker 「暂停就能抄」 at (1560, 214) from 0.5 s.
- Template line 10 → 「本轮只交：分镜表、三张效果图、一个小样。」
- Use K.stepRail (active 2, prev 1).

## s18_sample
- s18_sample.1 → 「第四步，先要分镜、三张效果图和一个小样，确认了再做全片。」; on screen 「风格帧 ×3」 → 「效果图 ×3」.
- The sample card uses PAGE.draw. Use K.stepRail (active 3, prev 2).

## s19_feedback
- s19_feedback.2 → 「别说再炫一点。要说：第 8 到 11 秒，标题没读完就消失，请延长停留。」
- The sample preview uses PAGE.draw. Use K.stepRail (active 4, prev 3).

## s20_ship
- s20_ship.1 → 「第六步，检查：截图、片段，再带声音完整看一遍。」; s20_ship.2 → 「模型看不了视频，就让它先截成图片再看。」
- On screen: checklist item 1 「静帧」 → 「截图」; tip card 「让它先抽帧，再看图」 → 「先截成图片，再让它看」. Re-cue 静帧 → 「截图」,
  抽帧 → 「截成」. The scene is now longer (tail 1.9 s, bar snap): the homework card must stay readable ≥ 5 s.
- Use K.stepRail (active 5, prev 4).

## s21_meta
- Window title 「Claude Code · Opus 5.5 · 全片 {{CODE_LINES}} 行代码」 (via E.fill); NO line-count badge on the src/scenes tab.
- The music.py excerpt is the CHORDS block: from the line starting `CHORDS = [` through its closing `]` (6 lines). Read files
  with fetch('../tools/music.py') / fetch('scenes/case.js') during build(); if a fetch fails, throw (never show invented code).
  Because build() cannot be async, fetch synchronously with XMLHttpRequest (open(..., false)).
- Keep the caption 「刚才 8 张案例卡的入场动画，就是这几行」 under the window until 「时间」 (film review); shorten the bracket to
  「字幕就按这些时间出现」 and land it at 「连」; the fold happens on 「逐帧」.
- {{RENDER_MIN}} is filled from the last full-resolution render (approximate, "约"); write it as 「渲染约 {{RENDER_MIN}} 分钟」.

## s22_end
- minDur is now 7.5 s: the URL stays ≥ 5.8 s.

## Film review round 1 (2026-10-01, after the first full render)
- Narration: s08/s09 照搬 lines now follow from their trick; s18 tail 1.0 and s20 tail 2.4 (reading time); subtitles show
  1,704 / 5,181 (voice unchanged); s10 prompt clip held 4.5 s and s12 lyric clip 6.0 s so the footage matches the words.
- Engine: chrome (logo, progress bar, vignette, chapter label) follows the wipe edge between dark and light pages.
- s05 wall tiles pop as the wipe bar passes; s17 continues s16's sticker instead of slapping it on again.
- Case template redesign (footage first, proof strips, less text, s11 triptych, s10 honesty banner): see src/scenes/case.js header.
