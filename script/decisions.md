# Decisions: final script for 《每一帧，都是代码》

Final files: `script/narration.json` (22 scenes, 58 lines), `script/clips.json` (25 excerpts), `script/storyboard.md`.
Built with the real TTS: **246.00 s (4:06.0)**, inside 3:20–4:10. `tools/build_timeline.py` wrote `src/timeline.js`,
`audio/narration.wav` and `out/subtitles.srt`; `tools/extract_clips.py` wrote `src/media/*` and `src/media/manifest.js`.

## 1. Base: Draft A

A won the tally (147 vs 139.5 and 138) and all three judges ranked it first. Reasons it is the right spine:
- The strongest first 8 seconds. Code-rendered shots are beat-cut from frame 0, and lists-006's own toast
  "✓ Every frame is code" lands on the bar-4 downbeat exactly on 「每」 (6.00 s). The toast then becomes the title
  through lists-006's own tricks.
- The tightest rhythm grammar: one meaning per transition type, plus the spoken 「第 N 招… / 照搬…」 refrain. Footage is
  ordered so it shows what is being said.
- The most complete and correct how-to (six-step rail, complete commands, 「先给我看分镜」 voiced, frame-extraction tip).
- The shortest measured runtime (231 s), which left room for the grafts.

## 2. Grafts

**From B (「老师讲明白」)**
- The flip-book analogy in s04 line 1 (「代码视频就像一本手翻书：给一个时间，就算出那一页。」), and the 900-tile grid where tile i
  is literally `draw(i/30)`, with 「1 页 ＝ 1 帧」 on screen.
- The syllabus chips 01 原理 / 02 为什么炫 / 03 小白上手 / 04 ？ (labels match the chapter tags; 「04 ？」 is paid off by
  「04 幕后」) and 「小白怎么做？一次讲明白」.
- The thesis 「差在导演功夫」, reworded as 「原理不难，炫不炫，差在导演功夫。」, so it does not imply that the whole wall is
  code-made.
- Formula threads from the eight case cards into the five terms, and the footnote 「案例 05、07、08 最像大片的画面来自现成素材
  或生成模型；Opus 负责设计、代码与编排（据作者）」.
- The filled template (新同事自我介绍) with 「风格：高级感、电影感」 struck and replaced by checkable rules. The voiced line
  「风格别写高级感，写能检查的规则：每屏一个主信息。」 and the stamp 「确认了，再做全片」.
- The feedback before/after: 「别说再炫一点，要说：第 8 到 11 秒，标题没读完就消失，请延长停留。」 with ✗/✓ panels and a 20 s
  scrubber.
- The homework card (15–30 秒 with a 20 s example: 0–3 钩子 / 3–15 主体·目标 / 15–20 转折·呼应开头).
- The case.js page flip (「刚才 8 张案例卡的入场动画，就是这几行」) and 「连我的声音，也是合成的」 with 「这句也是。」.
- Footage hygiene: the cropped gosail-072 search shot, one continuous gosail-133 take, uc-2348 skeleton ending at 9.5,
  rack and mini-card thumbnails taken from our own clips, `"sfx": false` on case pushes, and 据作者 in the voice.
- 「claude --version  # 能看到版本号就装好了」 and the checklist sub-labels.

**From C (「本片即示范」)**
- 「也不是 AI 一键生成的」 in the cold open.
- 「包括你现在看到的这一帧。」 with a short X-ray of our own frame. It has three labels at 26 px, and the footage is labelled
  honestly as `<img> 原作片段 · @twoclipping`.
- Self-printing code in s04 (`this.draw.toString()`, 26 px, at most 12 lines) with 「左边，就是这一幕自己的代码。」. Also the
  scrub away and back to 「同一帧 ✓」, with the footnote 「同一时刻、同一状态；换一台机器，像素仍可能有细微差别」.
- The voiced honesty bridge before case 5, in the fact-check wording 「后四招，画面里还用了现成素材或别的模型。」.
- 2×2 route cards with plugin and manual paths, the chip 「本片同路线」 and 「本片用 Playwright 驱动无头 Chrome，6 路并行渲染，原理相同」.
- The model card's source line 「来源：Anthropic 模型概览，2026-10-01 核对」 and the stamp 「没有视频输出」.
- In s21, this film's real `window.TIMELINE` as three lanes (画面 / 旁白 / 音乐) with one zoom. The real word stamps of the
  current line carry the label 「下面这行字幕，就按这些时间戳出现」, and the credit line names edge-tts 云希 and the
  original authors.
- 「截至 10 月 1 日」 spoken in s05; `node --version` / `ffmpeg -version` checks; 「机身看起来一致」.
- The ending 「…去做你的第一支吧。」 and the end ruler whose playhead reaches the last frame. A's lime pill became the time
  playhead from C (the s01 HUD, then the s04 scrubber, the s19/s20 scrubber, the s21 timeline and the s22 ruler).

**Deliberately not grafted**
- C's s10_proof, a 13.5 s scene in the middle of the carousel. The viewer judge called it a jargon detour, and it would
  have broken the 250 s budget. Its essence (real timeline, word stamps, beat) lives in s21 phase C, held to 3 lanes and
  one zoom.
- B's crew metaphor (「导演、程序员、剪辑一人包」). It overstates Opus and contradicts 「差在导演功夫」. The formula now says
  who directs: 「方向和反馈靠你，代码交给它」.
- C's 「本片也在用」 mapping, because 「强调色只有一种：亮绿」 is false about this film.
- C's internal `tools/still.mjs` workflow card: viewers can't run it, and it needs `--sheet NAME`.
- A's command-palette phase in s21, cut for density.

**Structural changes**
- Routes are now one scene: a 2×2 grid that scrolls one row on line 2. This replaces A's s16 + s17.
- A's s19 is split into s18 (sample first) and s19 (feedback demo).
- Scene count is 22.

## 3. Must-fix items and how each was resolved

### Viewer judge
1. **c5-072-search ran into the Venice Seedance video.** It is now 13.03–14.70 with crop `1067:600:0:0` (frame-checked:
   only the search UI). The caveat 「网页卡片里是他人作品，非 Opus 生成」 is kept.
2. **The gosail-072 wall tile showed @Just_sharon7's Seedance frame.** It is replaced from the wall's first frame (and in
   the rack and the s14 mini cards) by `c5-072-brand` at 0.65 s, @aiwarts's own GoodCase.ai card. I checked frames
   0.5–0.8: third-party thumbnails only start at 0.8.
   - The wall footnote now says 「收录作品并非都由 Opus 代码渲染」.
   - No handle row sits under the posters.
3. **Opus 5.5 was not named until 13 s.** It is now named in voice at 10.4 s (「用 Opus 5.5 做的视频，为什么这么炫？小白怎么做？
   一次讲明白。」) and by the H3 「Opus 5.5 炫酷视频的秘密 ＋ 小白上手指南」. The HUD tag 「WAYTOAGI · OPUS 5.5 案例」 is on
   screen from frame 0, and the chips are re-cued.
   - I used 「用 … 做的视频」 rather than 「Opus 5.5 的视频」, so the line does not imply that Opus outputs video.
4. **Jargon 「代码像一个函数」.** It is now 「代码视频就像一本手翻书：给一个时间，就算出那一页。」, with 「1 页 ＝ 1 帧」 on screen.
   「一本」 was added because without it the TTS split 「像手 / 翻书」.
5. **「无头浏览器」 unexplained, and the 「本片同款」 chip next to puppeteer.** The voice now says 「用网页，加一个自动截图的浏览器」;
   the chip is 「本片同路线」, with the Playwright note; and the code box says 「render.mjs 可以让 Claude Code 帮你写」.
6. **gosail-133 jump cuts.** Case 8 is one continuous take, 0–10.833. Point 2 lands on 「人物」 at 5.71, while the curtain
   is shut and the set swaps behind it (5.75–6.29).
7. **据作者 for cases 7 and 8.** Both evidence lines now start with 「据作者，」.
8. **「硬切」.** The line is now 「从按钮到图表，14 秒一镜到底，一刀没剪。」, and the on-screen point reads 「14 秒一镜到底，一刀没剪」.
9. **s21 density and the pill claim.** s21 is 13.5 s with three phases and no palette. The 「绿色胶囊，贯穿了全片」 claim is
   dropped from the voice. The callback is now the case.js page flip plus 「连我的声音，也是合成的」. The playhead motif stays
   visual only.
10. **No final action.** The end line is now 「完整文章和 5181 个案例，都在 WaytoAGI，去做你的第一支吧。」 (`say`: Way to AGI).
11. **Lemo pronunciation and s15 labels.** `say` 「Lemo Opuscar」 is added. s15 adds the checklist sub-labels (Node.js 22+ —
    运行渲染脚本; FFmpeg — 把画面编成视频) and 「claude --version  # 能看到版本号就装好了」.
12. **Runtime and cues.** The film is 246.0 s. Every cue was re-derived from the built timeline: 133 cited words were
    checked with the engine's `ctx.word` rule, with 0 mismatches.
13. **Complete commands.** All route commands keep `cd my-video`, plus `cd my-video && npm i` for Remotion. Plugin and
    manual paths are separated by 「# 或手动」.
14. **Crew metaphor and 「本片也在用」.** Neither is used. Opus is never called the director.

### Producer judge
1. **作者自述 on the hook credits.** Every hook shot carries a second chip, 「作者自述：画面由代码渲染」. The exception is
   gosail-054, whose render tool is unknown (fact-check): it reads 「3D 数据渲染 · 工具未公开」 and plays only under the
   「拍出来的」 line.
2. **The toast replica did not match.** s01 no longer uses a replica; it holds the real last frame (12.467 s).
   - The s02 replica is built to the geometry I measured: pill x 314–1606, y 421–659, radius ≈119, check disc at (426, 540),
     text from x 516 at ≈ Inter 600 70 px, background ≈#ECEDE8.
   - The handoff hides behind a 0.15 s blur and has a diff check (≤3 % mean difference inside the pill).
   - The X-ray outline uses the same box.
3. **Blur budget on the 9:16 backdrop.** It now uses a 192×108 blurred copy scaled ×10, as case.js does.
4. **Subs off on spoken lines.** s02 and s22 now have `subs: true`.
5. **c5-072-search.** Same fix as viewer item 1 (start moved to 13.03, so @mech_eng_dev's page is out).
6. **gosail-133.** One continuous take, as in viewer item 6.
7. **s21 length and callback.** s21 is 13.5 s: page flip to real case.js lines, then the Claude Code tabs, then the
   TIMELINE sweep with the frame counter, then 「连我的声音，也是合成的」. The callback is to the case cards, not the pill.
8. **s04 showed only 示意代码.** The code panel now prints this scene's real drawing function via
   `this.draw.toString()` (26 px, at most 12 lines).
   - `draw()` is the function that draws every page, preview and tile. The scene's `render()` choreographs five phases and
     cannot fit in 12 lines.
   - The struck 「调用模型 900 次」 chip and the determinism footnote are kept.
9. **Who directs; the 05/07/08 note.** The formula says 「这是导演功夫：方向和反馈靠你，代码交给它。」, with role chips
   「方向和反馈：你」 / 「代码：Opus」 and the 05/07/08 footnote.
10. **Plugin commands.** `claude plugin marketplace add` + `install` for HyperFrames and Remotion are shown next to the npx
    path. The Node 22+ / telemetry and Remotion licence notes are kept.
11. **「实物」.** Case 6 point 1 now says 「一条橙线扫过，线稿变成写实渲染」, and point 2 says 「…机身看起来一致」.
12. **Unspoken points in cases 3 and 4.** Case 3 now has one point only, cued to 「每」. Case 4's evidence line now says
    「…地图讲移动，地面给情绪」, so point 2 is cued to the spoken 「地图」, and the ground-level sun cuts in at 6.0, just before
    「地面」 (6.17). Every case keeps secret + 1–2 points + takeaway.
13. **gosail-072 poster.** It is never featured or labelled; see viewer item 2.
14. **Limits on grafted C material.** The s21 timeline has 3 lanes, labels of at least 24 px and one zoom. The X-ray has
    three labels at 26 px. The engine chrome is treated as switching on at the cut ("the UI boots on the downbeat"); the
    cut is not described as pixel-identical.
15. **B's hook.** Not reused. 「拍出来的」 is kept, and uc-1377 uses 175.0–176.0.

### Fact-check judge
1. **作者自述 on the montage.** As producer item 1. gosail-054's chip says what is known: 3D data, tool not disclosed.
2. **gosail-072 tile.** Replaced from the first frame (viewer item 2).
3. **c5-072-search.** 13.03–14.70, crop `1067:600:0:0`.
4. **Raw route.** It carries 「本片同路线」 and 「本片用 Playwright 驱动无头 Chrome，6 路并行渲染，原理相同」.
5. **Command sequences.** Complete, separated by 「# 或手动」. The raw route uses the tested `npm init -y && npm i puppeteer`
   and the no-audio form of the tested ffmpeg line.
6. **Footnote wording.** The footnote reads 「命令出自各工具官方文档，2026-10-01 核对」, never 「完整命令见 WaytoAGI 原文」. The only
   pointer to the article is about the template, which the article does contain.
7. **The pill claim.** Dropped from the voice.
8. **「写实渲染」.** Done.
9. **s04 determinism and wording.** Real code plus the determinism footnote. C's 「永远是同一帧」 and 「模型不用画 900 次」 are
   not used. A's 「模型不用跑 900 次，代码只写一次」 is kept.
10. **「一种强调色」.** Not used anywhere.
11. **B's wording.** No crew metaphor. 「原理一样」 became 「原理不难，炫不炫，差在导演功夫」, and 「拍出来的」 is kept.
12. **Honesty bridge wording.** 「后四招，画面里还用了现成素材或别的模型」.
13. **Case 7.** The voice says 「据作者，舞者和歌是生成的，骨架数据让歌词挂在手上」. The unhedged 「Opus 取出骨架」 is not used.
    - The skeleton clip is 8.667–9.5, before the 9.583 white frame.
    - The fist clip is dropped because its range brushed the 11.54 glitch frame.
    - The lyric clip starts at 2.0, after the 0–1.8 photosensitive range.
14. **Case data.** Kept 「提示另附参考图」 (gosail-060) and 「纵向放大 3 倍」 (uc-1377). The work title is 《The First Spark》,
    measured at 494 px in the 600 px work line: more than 10 characters, but Latin glyphs, so it fits. Case 6 uses
    「看起来一致」.
15. **s02 subtitles and chip text.** Subtitles are on, and the chips use the chapter labels, so on-screen text and voice
    agree.
16. **Runtime.** 246.0 s.

## 4. Other choices worth knowing
- **Bar-aligned chapters.** Chapters 02, 03 and 04 start on bar lines (44.0, 156.0, 226.0), so the music's chapter
  impacts fall on downbeats. s18's tail is 0.35 so the meta reveal starts on the 226.0 downbeat. s20's tail is 0.85 so
  the homework card stays readable for about 4 s.
- **s17 punctuation.** 「需求」 is followed by 「。」 so the subtitle reads 「第三步，套模板写需求」 / 「给谁看，记住什么，多长，哪些不能改」
  instead of splitting the list. This cost 0.5 s.
- **Voice text for Node.** s15's voice and subtitle say 「Node」; the checklist shows 「Node.js 22+」. This keeps the subtitle
  word-aligned; with a separate `say` it would have lagged by 0.4 s.
- **Case 7 clip order.** HIKARE (1.1 s), then skeleton, then lyric, then HIKARE again. This puts the landing burst on
  「动作」 (1.56) and keeps the lyric column on screen through 「歌词挂在手上」.
- **Case 5 prompt clip.** It starts at 20.4 with a 64 px inset crop. 20.0–20.4 still shows a sliver of the outgoing
  third-party video (frame-checked).

## 5. Verification done
- **Runtime.** `build_timeline.py --dry` and the real build both give 246.00 s.
- **Subtitles.** `out/subtitles.srt` has 82 cues, at most 18 visible characters each, no cue of 2 characters or fewer, no
  cue shorter than 0.7 s, and no split number/unit (`30 秒`, `8 到 11 秒`, `15 到 30 秒`, `1704 个` stay whole).
- **Clips.** All 25 ranges are inside their sources (ffprobe) and every crop is 16:9 inside the frame.
  - None overlaps uc-2348 0–1.8 / 15.79–16.33 or the known white/glitch frames, or gosail-072 2.0–3.3 / 6.95–11.45 /
    12.9–13.03 / 14.733–17.0.
  - gosail-054-pre1/pre2 are not used.
  - Sync-critical frames were checked visually:
    - toast arrival at clip 2.0, and the held frame;
    - brand card 0.5–0.8;
    - curtain 5.3–6.3;
    - uc-2348 2.0–9.5 and 25.5–31;
    - gosail-072 search crop and prompt crop.
- **Layout widths** (measured in headless Chrome with the project fonts):
  - 《The First Spark》: 494 px;
  - longest 24 px command: 658 px, in a 776 px box;
  - hero title: 1200 px; H3: 834 px;
  - every case point: at most 476 px, in a 576 px column.
- **Pronunciation.** Whisper-small was run per line on `audio/narration.wav` and on the individual TTS files.
  - The window-based run (`tools/asr_check.py`) scored 20 lines under 0.85. The direct re-runs showed these were mostly
    Whisper failures: prompt echo, empty decodes, and first-word truncation that disappears with 0.6 s of leading silence.
  - Every flagged line was transcribed correctly at least once.
  - Brand names come out as 「Way2AGI / limo opa star」, which is expected for TTS English.

## 6. Remaining risks
- **s02 is the hardest build.** It needs the X-ray, the footage-to-replica handoff with the diff check, the iris and the
  dual-spring stretch, all in 8.5 s. For about 2.4 s the dark-theme logo sits on the warm grey frame; the storyboard adds a
  top gradient.
- **s21 reads files with a synchronous XHR.** It reads `scenes/case.js` and `tools/music.py` this way. Chrome logs a
  deprecation warning, which the renderer only prints. If the request fails, the scene must throw rather than show
  invented code.
- **s16 is dense.** Four route cards, but readable on pause. The voice carries the choice, and a 「暂停就能抄」 sticker
  invites pausing.
- **Plugin commands are unverified locally.** They come from the official docs and were not installed here, as noted in
  research/tools.md. The footnote says where they come from.
- **Small third-party thumbnails remain in two places.** They are inside the gosail-072 site UI (home clip and brand card
  after 0.8 s), never enlarged, and covered by the case caveat.
- **Case 6 dots are tight.** The 9:16 card puts its series dots at y ≈ 880, inside the box but close to the edge.
- **One template pop is early.** In case 5 the template's L1 pop fires at 0.68 with the header, not with the secret
  (5.74). This is a template limitation, and harmless.
- **Placeholders.** `{{FRAMES}} {{CODE_LINES}} {{RENDER_MIN}} {{SCENES}}` must be filled by `tools/stats.py` after the
  render. They are never in the voice.
- **ASR on the final mix.** Run `tools/asr_check.py audio/mix_norm.wav` (part of `tools/build.sh`), and treat Whisper-small
  0.0 scores as model noise unless a direct listen confirms them.
