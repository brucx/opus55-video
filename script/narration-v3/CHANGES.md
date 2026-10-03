# Narration v3: final (head writer)

Files in this folder:
- `final.json`: the full narration (a copy of `script/narration.json` with the final line `text`/`say` and the final case `takeaway`/cue data).
- `cue-updates.json`: the scene-code `ctx.word()` cues whose word is no longer spoken.

## Summary

- **Runtime.** Measured with `tools/build_timeline.py --dry`: live 261.00 s (4:21.0) → final **271.00 s (4:31.0), +10.0 s**, inside the +12 s cap.
- **What changed.** 38 of 58 lines: 36 text changes and 2 say-only changes (s05_wall.2, s15_env.2). There are 7 case-data edits: 3 takeaway boxes and 4 cues. All 58 IDs are kept in order, and nothing is split or merged.
- **Facts.** Every number is unchanged. Both 据作者 markers stay (now 据作者说). The honesty bridge before case 5 stays, now opened by 不过.
- **Music grid.** Chapter 03 starts on a bar (170.0 s; live 162.0, also on a bar), and chapter 04 starts on a bar (248.0 s). s20 keeps 15.5 s, and the homework card has 6.4 s from line 3 to the cut (live 6.56 s).
- **Required code edit.** `s17_prompt.js` lines 87 and 403: 「每屏」 → 「每个」. Without it, the rule tick, AFTER pulse and ding fire 3.05 s early. Also rename `s04_render.js:193` 「左边」 → 「这」; this one is cosmetic, because the fallback is the same moment (5.11 s).

## The two asks

**1. A listener who never looks at the screen can follow the film.**
- Lines that pointed at the picture now describe instead:
  - 「这些视频」 → 「最近有一批视频」.
  - 「左边，就是…」 → 「这一幕，也是代码算出来的」.
  - 「歌词挂在手上」 → 「歌词跟着手走」.
- Every case now names its work in one short phrase before its trick:
  - 一段界面动画, 一支白纸黑墨的动画, 一支讲 AI 历史的短片 and 一部拿破仑战役片;
  - 一支网站宣传片, 一支手机概念片, 一支舞蹈 MV and 一部舞台短片.
  - Afterwards, a 小白 can say which film each trick came from.
- Small ear fixes:
  - 比如 30 秒 (an example, not a timestamp);
  - 先做 15 到 30 秒就够了;
  - 全部 5,181 (the whole library, not the 1,704 videos);
  - 一共六步;
  - 看完记住什么;
  - 每个画面 (instead of 每屏);
  - 把画面写成网页;
  - 再叮嘱它一句.
- Homophone guards:
  - 据作者说 (not 剧作者);
  - 人体骨架 (not 股价);
  - 歌曲;
  - 别的 AI 模型;
  - FFmpeg is said 「F F mpeg」 in s15 as it already is in s04;
  - WaytoAGI is said the same way in s05 and s22.
- Whisper (medium and small) was run on every changed line. Every line was transcribed correctly at least once. The remaining misses are Whisper's known failures: empty decodes and a dropped first word.

**2. The 「照搬」 lines no longer read like a label.**
- The spoken 「照搬：」 is gone. The word is said once, as a verb, in case 1 (「想照搬，就…」), which explains the small on-screen tag.
- Each lesson grows out of the trick and the evidence just heard, and each opens differently:
  - 想照搬，就… / 这就叫… / 再把三层… / 照这样做，…
  - 换成你，… / 你也可以… / 别贪多，… / 分工时，…
- **Bridges between cases:**
  - every case opens on its work, with varied verbs (来自, 出自, 接着是, 藏在…里);
  - 不过 leads into the honesty note before case 5;
  - case 8 opens 「最后一招」, so the ear hears the list closing.
- **Bridges between chapters:** 八招看下来 → 轮到你了，一共六步 → 最后揭个底.
- Each on-screen takeaway box says the same idea as its spoken lesson in at most 20 characters (two lines of 18):
  - 先定贯穿对象，再让变化踩上节拍
  - 风格拆成能检查的规则
  - 画面、旁白、配乐各管一层，对齐一条时间轴
  - 先找真实数据，每个镜头写清依据和用意
  - 每个卖点，配一段真实界面
  - 模型锁死，只改镜头、光线和配色
  - 别贪多：挑两三个动作，各绑一种效果
  - 分工时，每个镜头写清谁来做、怎样算合格

## Before → after (every changed line)

| Line | Before | After | Why |
|-|-|-|-|
| s01_cold.1 | 这些视频，没有一帧是拍出来的。 | 最近有一批视频，没有一帧是拍出来的。 | 「这些视频」 pointed at the footage. 「最近有一批」 gives the ear a referent, and it stays "some videos", so s10's honesty note does not contradict it. |
| s04_render.2 | 左边，就是这一幕自己的代码。 | 这一幕，也是代码算出来的。 | 「左边」 is a screen direction. The new line works by ear, and 代码 still lands on the header 「本幕正在运行的代码」. |
| s04_render.3 | 30 秒，每秒 30 帧，就是 900 帧。 | 比如 30 秒，每秒 30 帧，就是 900 帧。 | 「比如」 marks 30 秒 as an example, not this scene's length. |
| s05_wall.2 | say 「截至 10 月 1 日，Way to A G I 收录了 1704 个视频案例。」 | say 「截至 10 月 1 日，Way to AGI 收录了 1704 个视频案例。」 | say only: 「Way to AGI」, the same spoken brand name as s22. |
| s06_c1.1 | 第一招，一个形体贯穿全片。 | 第一招来自一段界面动画：一个形体贯穿全片。 | Names the work before its trick. |
| s06_c1.2 | 从按钮到图表，14 秒一镜到底，一刀没剪。 | 从按钮变成图表，14 秒一刀没剪。 | 「变成」 tells the ear the shape turns into the chart. 「一镜到底」 is dropped because 「一刀没剪」 already says it. |
| s06_c1.3 | 照搬：先定贯穿对象，再排上节拍。 | 想照搬，就先定贯穿对象，再让变化踩上节拍。 | The spoken 「照搬：」 label is gone. 照搬 is said only here, inside a sentence, which explains the on-screen tag. 「让变化」 says what lands on the beat. |
| s07_c2.1 | 第二招，暖色只留给高潮。 | 第二招出自一支白纸黑墨的动画：暖色只留给高潮。 | Names the work by its look. 白纸黑墨 is the base palette, which 暖色 contrasts with. 出自 varies the openers. |
| s07_c2.2 | 全片只有纸和墨，60 秒里，暖光只亮 9 秒。 | 全片 60 秒，暖光只亮 9 秒。 | Paper and ink moved to line 1. 「全片 60 秒」 says what the 60 seconds are. |
| s07_c2.3 | 照搬：把风格拆成几条能检查的规则。 | 这就叫把风格拆成能检查的规则。 | The label is gone. The lesson now names what the numbers just showed. |
| s08_c3.1 | 第三招，画面、旁白、配乐分层做，每层单独改。 | 第三招来自一支讲 AI 历史的短片。画面、旁白、配乐分层做，每层单独改。 | Names the work. 「讲 AI 历史的」 cannot be heard as "made by AI". The 。 keeps the trick in one subtitle. |
| s08_c3.2 | 照搬：画面、旁白、配乐各管一层，对齐同一条时间轴。 | 再把三层对齐同一条时间轴。 | The label and the repeated list are gone. This line is now the method's second step. |
| s09_c4.1 | 第四招，用真实数据当约束。 | 第四招出自一部拿破仑战役片：用真实数据当约束。 | Names the work concretely: the author's README says Napoleon at Austerlitz. |
| s09_c4.2 | 地形来自海拔数据，地图讲移动，地面镜头给情绪。 | 地形来自海拔数据，地图讲部队移动，地面镜头给情绪。 | 「部队移动」 says what moves on the map (the article's wording). |
| s09_c4.3 | 照搬：先找真实数据，每个镜头写清依据和用意。 | 照这样做，每个镜头都写清依据和用意。 | The label is gone. 「照这样做」 follows from the example: 依据 is the data, 用意 is movement and emotion. |
| s10_c5.1 | 后四招，画面里还用了现成素材或别的模型。 | 不过后四招，画面里还用了现成素材或别的 AI 模型。 | 「不过」 bridges into the honesty note. 「AI」 keeps 模型 from being heard as a 3D model. |
| s10_c5.2 | 第五招，用户怎么点，镜头就怎么走。 | 第五招来自一支网站宣传片。用户怎么点，镜头就怎么走。 | Names the work. The 。 keeps the trick in one subtitle. |
| s10_c5.3 | 照搬：每个卖点，配一段真实界面。 | 换成你，每个卖点都配一段真实界面。 | The label is gone. 「换成你」 turns the trick into the listener's task. |
| s11_c6.1 | 第六招，产品不动，只换演出。 | 接着是一支手机概念片。第六招，产品不动，只换演出。 | 「接着是」 bridges in and names the work before the trick. |
| s11_c6.2 | 同一个 3D 手机模型，换了几种风格。 | 同一个 3D 模型，换了几种风格。 | 手机 was just said in line 1. |
| s11_c6.3 | 照搬：模型锁死，只改镜头、光线和配色。 | 你也可以把模型锁死，只改镜头、光线和配色。 | The label is gone. 「你也可以」 hands the trick to the listener. |
| s12_c7.1 | 第七招，让动作驱动特效。 | 第七招藏在一支舞蹈 MV 里：让动作驱动特效。 | Names the work, with a varied opener: 藏在…里. |
| s12_c7.2 | 据作者，舞者和歌是 AI 生成的，骨架数据让歌词挂在手上。 | 据作者说，舞者和歌曲是 AI 生成的，人体骨架数据让歌词跟着手走。 | 据作者说 (not heard as 剧作者); 歌曲 (clearer than a lone 歌); 人体骨架 (骨架 alone is heard as 股价); 跟着手走 describes the motion instead of the picture. |
| s12_c7.3 | 照搬：挑两三个动作，各绑一种效果。 | 别贪多，挑两三个动作，各绑一种效果。 | The label is gone. 「别贪多」 is the advice in plain speech. |
| s13_c8.1 | 第八招，多个模型，各管一段。 | 最后一招来自一部舞台短片：多个模型各管一段。 | 「最后一招」 tells the ear the list is ending. The work name matches the on-screen 五幕舞台短片. |
| s13_c8.2 | 据作者，Opus 写代码统筹，人物和布景交给 AI 模型。 | 据作者说，Opus 写代码统筹，人物和布景交给别的模型。 | 据作者说. Opus is a model too, so 「别的模型」. |
| s13_c8.3 | 照搬：每个镜头写清分工，和怎样算合格。 | 分工时，每个镜头写清谁来做、怎样算合格。 | The label is gone, and so is the dangling 「，和」. 每个镜头 is kept (brief: per shot). |
| s14_formula.1 | 所以，好看不是因为 Opus 会画画。 | 八招看下来，好看不是因为 Opus 会画画。 | 「八招看下来」 bridges out of the cases. |
| s15_env.1 | 轮到你了。第一步，准备一个能运行代码的 AI 工具，比如 Claude Code。 | 轮到你了，一共六步。第一步，准备一个能运行代码的 AI 工具，比如 Claude Code。 | 「一共六步」 tells the ear how many steps follow. |
| s15_env.2 | no say (text: 再装 Node 和 FFmpeg。注意，Claude Code 要付费账号。) | say 「再装 Node 和 F F mpeg。注意，Claude Code 要付费账号。」 | say only: 「F F mpeg」. Raw FFmpeg was heard as "F-Pack"; s04 already says it this way. |
| s16_routes.2 | 想全部自己掌控，就像本片：用网页，加一个自动截图的浏览器。 | 想全部自己掌控，就像本片：把画面写成网页，再用一个自动截图的浏览器。 | 「把画面写成网页」 is something a listener can picture. |
| s16_routes.3 | 想要现成风格，就装 Lemo-Opuscar。再加一句：先给我看分镜。 | 想要现成风格，就装 Lemo-Opuscar，再叮嘱它一句：先给我看分镜。 | 「再叮嘱它一句」 says who you are telling. (say updated to match.) |
| s17_prompt.1 | 第三步，套模板写需求。给谁看，记住什么，多长，哪些不能改。 | 第三步，套模板写需求。给谁看，看完记住什么，多长，哪些不能改。 | 「看完记住什么」 names who remembers. |
| s17_prompt.2 | 风格别写高级感，写能检查的规则：每屏一个主信息。 | 风格别写高级感，写能检查的规则：每个画面一个主信息。 | 每屏 is written shorthand and ASR mishears it. 「每个画面」 is clear. Needs the 每屏→每个 cue edit. |
| s20_ship.1 | 第六步，检查：截图、片段，再带声音完整看一遍。 | 第六步，检查：先看截图、片段，再带声音完整看一遍。 | 「先看」 orders the checks. The 、 keeps the 截图→片段 gap at 0.73 s for the visual. |
| s20_ship.3 | 你的第一支，就从 15 到 30 秒开始。 | 你的第一支，先做 15 到 30 秒就够了。 | No longer sounds like a timestamp. |
| s21_meta.1 | 揭个底：这支片子，也是这么做的。 | 最后揭个底：这支片子，也是这么做的。 | 「最后」 marks the closing reveal. |
| s22_end.1 | 完整文章和 5,181 个案例，都在 WaytoAGI，去做你的第一支吧。 | 完整文章和全部 5,181 个案例，都在 WaytoAGI，去做你的第一支吧。 | 「全部」 makes 5,181 the whole library, distinct from the 1,704 videos in s05. (say updated to match.) |

## Case data changes in final.json

| Scene | Field | Live | Final | Why |
|-|-|-|-|-|
| s06_c1 | takeaway | 先定贯穿对象，再排上节拍 | 先定贯穿对象，再让变化踩上节拍 | Same words as the voice. |
| s07_c2 | cues.points[0] | ["s07_c2.2","只有"] | ["s07_c2.2","全片"] | 只有 is no longer spoken. 全片 is the line start (4.44 s). film.total (60 秒), warm (暖) and nine (9 秒) still match. |
| s08_c3 | proof.edits[1] | ["s08_c3.1","层"] | ["s08_c3.1","层",1] | Pre-existing glitch: 层 matched 分层, so the 旁白 lane re-cut before the 画面 lane. The lanes now re-cut top to bottom on 每 → 层 → 单 (6.13 / 6.36 / 6.57 s). |
| s11_c6 | trio.at | ["s11_c6.2","换"] | ["s11_c6.2","同"] | The new intro pushes 换 to 7.10 s, 2.2 s after the card's last clip ends at 4.90 s. With 同 (5.67 s) the frozen card lasts 0.77 s, and the three panels open as the voice says 「同一个 3D 模型」. |
| s12_c7 | takeaway | 两三个动作，各绑一种效果 | 别贪多：挑两三个动作，各绑一种效果 | Same words as the voice. |
| s13_c8 | takeaway | 写清分工，和怎样算合格 | 分工时，每个镜头写清谁来做、怎样算合格 | Same words as the voice. The dangling 「，和」 is gone. |
| s13_c8 | cues.points[0] | {"clip":0,"t":3.5} | {"clip":0,"t":4.7} | The longer intro moves the card shrink to 3.93 s, so 3.5 would put the bullet over the still-big footage. 4.7 keeps the bullet about 0.8 s after the shrink starts, as in live. |

The on-screen secrets are unchanged (一个形体贯穿全片, 多模型各管一段 and the rest), and the voice keeps their wording, so subtitle and caption never disagree.

## Scene-code cue updates (cue-updates.json)

| File:line | Old | New | Required? | Effect until edited |
|-|-|-|-|-|
| src/scenes/s17_prompt.js:87 | 每屏 | 每个 | yes | T.one (rule mark and tick, caret, AFTER bump and ring) falls back to the line start, 3.05 s early |
| src/scenes/s17_prompt.js:403 | 每屏 | 每个 | yes | The ding falls back 3.05 s early |
| src/scenes/s04_render.js:193 | 左边 | 这 | no | None: the fallback is the line start, the same 5.11 s |

- Every other scene-code cue still matches its word; only its timing shifts.
  - Most shifts are a few tenths of a second, because a line got a short bridge: s05 −0.12 to −0.14 (say change), s14 +0.3, s16 +0.25 to +0.7, s17 +0.4 to +0.5, s20 +0.15 to +0.4, s21 +0.15 to +0.33, s22 +0.35.
  - s15 moves +0.9 s because of 一共六步.
- s15_env.js:95 `ffmpeg: w(L2, 'FFmpeg')` now matches the 「mpeg」 token, the same way s04 already works. The typing and tick start 0.55 s after the spoken 「F F」.
  - Optional fix: change it to `w(L2, 'F')` (8.27 s). Leave `ffEnd` as is.
- s20 `jiu` (就) now hits 就够了, but T.jiu is not used anywhere.

## Voice-only final script

**s01_cold**  
最近有一批视频，没有一帧是拍出来的。也不是 AI 一键生成的。每一帧，都是代码。

**s02_title**  
包括你现在看到的这一帧。用 Opus 5.5 做的视频，为什么这么炫？小白怎么做？一次讲明白。

**s03_text**  
先看原理：Opus 5.5 只输出文字，不直接出视频。它写分镜、写代码、调工具，画画的是浏览器和图形引擎。

**s04_render**  
代码视频就像一本手翻书。给一个时间，就算出那一页。这一幕，也是代码算出来的。比如 30 秒，每秒 30 帧，就是 900 帧。但模型不用跑 900 次，代码只写一次。再用 FFmpeg 把这些帧拼成视频。

**s05_wall**  
原理不难，炫不炫，差在导演功夫。截至 10 月 1 日，WaytoAGI 收录了 1,704 个视频案例。我们挑了 8 个，每个一招。

**s06_c1**  
第一招来自一段界面动画：一个形体贯穿全片。从按钮变成图表，14 秒一刀没剪。想照搬，就先定贯穿对象，再让变化踩上节拍。

**s07_c2**  
第二招出自一支白纸黑墨的动画：暖色只留给高潮。全片 60 秒，暖光只亮 9 秒。这就叫把风格拆成能检查的规则。

**s08_c3**  
第三招来自一支讲 AI 历史的短片。画面、旁白、配乐分层做，每层单独改。再把三层对齐同一条时间轴。

**s09_c4**  
第四招出自一部拿破仑战役片：用真实数据当约束。地形来自海拔数据，地图讲部队移动，地面镜头给情绪。照这样做，每个镜头都写清依据和用意。

**s10_c5**  
不过后四招，画面里还用了现成素材或别的 AI 模型。第五招来自一支网站宣传片。用户怎么点，镜头就怎么走。换成你，每个卖点都配一段真实界面。

**s11_c6**  
接着是一支手机概念片。第六招，产品不动，只换演出。同一个 3D 模型，换了几种风格。你也可以把模型锁死，只改镜头、光线和配色。

**s12_c7**  
第七招藏在一支舞蹈 MV 里：让动作驱动特效。据作者说，舞者和歌曲是 AI 生成的，人体骨架数据让歌词跟着手走。别贪多，挑两三个动作，各绑一种效果。

**s13_c8**  
最后一招来自一部舞台短片：多个模型各管一段。据作者说，Opus 写代码统筹，人物和布景交给别的模型。分工时，每个镜头写清谁来做、怎样算合格。

**s14_formula**  
八招看下来，好看不是因为 Opus 会画画。而是叙事、规则、时间轴、声音，加上反复检查。这是导演功夫：方向和反馈靠你，代码交给它。

**s15_env**  
轮到你了，一共六步。第一步，准备一个能运行代码的 AI 工具，比如 Claude Code。再装 Node 和 FFmpeg。注意，Claude Code 要付费账号。

**s16_routes**  
第二步，选路线：HyperFrames 或 Remotion，适合做字幕、图表和界面。想全部自己掌控，就像本片：把画面写成网页，再用一个自动截图的浏览器。想要现成风格，就装 Lemo-Opuscar，再叮嘱它一句：先给我看分镜。

**s17_prompt**  
第三步，套模板写需求。给谁看，看完记住什么，多长，哪些不能改。风格别写高级感，写能检查的规则：每个画面一个主信息。

**s18_sample**  
第四步，先要分镜、三张效果图和一个小样，确认了再做全片。

**s19_feedback**  
第五步，反馈写成：时间点，问题，期望。别说再炫一点。要说：第 8 到 11 秒，标题没读完就消失，请延长停留。

**s20_ship**  
第六步，检查：先看截图、片段，再带声音完整看一遍。模型看不了视频，就让它先截成图片再看。你的第一支，先做 15 到 30 秒就够了。

**s21_meta**  
最后揭个底：这支片子，也是这么做的。Opus 5.5 在 Claude Code 里，写了场景、时间轴和配乐程序。浏览器逐帧截图，连我的声音，也是合成的。

**s22_end**  
完整文章和全部 5,181 个案例，都在 WaytoAGI，去做你的第一支吧。

## Measured duration per scene (build_timeline.py --dry)

| Scene | Live start | Live dur | Final start | Final dur | Δ |
|-|-:|-:|-:|-:|-:|
| s00_cover | 0.00 | 2.00 | 0.00 | 2.00 | 0 |
| s01_cold | 2.00 | 8.00 | 2.00 | 8.00 | 0 |
| s02_title | 10.00 | 8.50 | 10.00 | 8.50 | 0 |
| s03_text | 18.50 | 10.50 | 18.50 | 10.50 | 0 |
| s04_render | 29.00 | 18.00 | 29.00 | 18.00 | 0 |
| s05_wall | 47.00 | 11.00 | 47.00 | 11.00 | 0 |
| s06_c1 | 58.00 | 11.00 | 58.00 | 11.50 | +0.5 |
| s07_c2 | 69.00 | 10.50 | 69.50 | 10.50 | 0 |
| s08_c3 | 79.50 | 10.50 | 80.00 | 10.00 | -0.5 |
| s09_c4 | 90.00 | 12.50 | 90.00 | 13.00 | +0.5 |
| s10_c5 | 102.50 | 11.50 | 103.00 | 13.50 | +2.0 |
| s11_c6 | 114.00 | 11.00 | 116.50 | 12.50 | +1.5 |
| s12_c7 | 125.00 | 12.00 | 129.00 | 14.00 | +2.0 |
| s13_c8 | 137.00 | 12.00 | 143.00 | 13.50 | +1.5 |
| s14_formula | 149.00 | 13.00 | 156.50 | 13.50 | +0.5 |
| s15_env | 162.00 | 12.00 | 170.00 | 13.00 | +1.0 |
| s16_routes | 174.00 | 17.50 | 183.00 | 18.00 | +0.5 |
| s17_prompt | 191.50 | 12.00 | 201.00 | 12.50 | +0.5 |
| s18_sample | 203.50 | 7.00 | 213.50 | 7.00 | 0 |
| s19_feedback | 210.50 | 12.00 | 220.50 | 12.00 | 0 |
| s20_ship | 222.50 | 15.50 | 232.50 | 15.50 | 0 |
| s21_meta | 238.00 | 14.50 | 248.00 | 14.50 | 0 |
| s22_end | 252.50 | 8.50 | 262.50 | 8.50 | 0 |
| **total** | | **261.00** | | **271.00** | **+10.0** |

- Live chapter starts: 18.5, 47.0, 162.0 and 238.0 s. Final: 18.5, 47.0, 170.0 and 248.0 s.
- s20 is bar-snapped and has 1.07 s of room. Scenes before it can grow by up to 1.0 s (two beats) in total before the runtime jumps to 273 s.
- Fragile scenes: s10 has 0.00 s of slack and s13 has 0.02 s. Lengthening any line in either costs 0.5 s of scene time, but the total stays 271 s until s20's room is used up.

## Follow-ups outside the narration (clip data)

The voice is longer, but the footage clips have fixed lengths. Measured on `final.json`:
- **s09.**
  - 地图 is spoken at 6.47 s, but the arrows clip ends at 6.03 s, so 「地图讲部队移动」 plays over the ground shot. 地面 (7.86 s) does land on the sun shot.
  - Fix: lengthen `c4-1377-relief` by about 1.5 s (clips.json 73.8–76.8 → about 73.8–78.3, after a frame check). This puts 地图 on the arrows and cuts the end hold from 1.97 s to about 0.5 s.
- **s12.**
  - 「歌词跟着手走」 is spoken at 9.25–10.25 s. The lyric clip runs 2.77–8.77 s and is frozen from 8.04 s.
  - Fix: play the lyric shot about 1.3 s later. Either lengthen the first hikare segment, or extend the `c7-2348-lyric` source (uc-2348 2.0–7.25 → about 2.0–8.3, which stays before the skeleton at 8.667) and set `dur` to about 7.0.
  - End hold: 1.63 s (live 0).
- **s13.**
  - The static end hold is 2.67 s (live 1.17).
  - Fix: extend `c8-133-stage`, since gosail-133 has about 4 s more after 10.833, and keep s14's case-8 frame consistent. Otherwise accept the hold; s14 opens on that same frame.
- **s10.**
  - The end hold is 1.38 s (live 0).
  - Setting `dur` alone does not help, because clipAt clamps to the clip's natural 3.5 s. A longer `c5-072-prompt` source does.
  - The home and search clips now play while the footage is still big, during 「第五招来自一支网站宣传片」. Their chips light one by one once the strip is up (8.15 / 8.35 / 8.62 s).
- **s11.** After the trio cue moves to 同, the card is frozen 0.77 s before the trio (live 0.25). The plume panel then holds its last frame for the final ~2 s, under the template's shared drift.
- **s07 and s08.** No new holds: s07 is 1.40 s as in live, and s08 is 0.
- **Optional on-screen wording.** In s17, the rule text 「每屏一个主信息」 could become 「每个画面一个主信息」 to match the voice; same meaning either way.

## Decision for you: say the region limit aloud?

- Today only s15's small print says that Claude Code's official regions exclude mainland China, Hong Kong and Macau. A listener who isn't watching never hears it, although brief §2/§6 asks to state it plainly. It was kept to the small print in film review round 2, so I did not change that on my own.
- Ready-to-use option for `s15_env.2`:
  - text: 「再装 Node 和 FFmpeg。注意，Claude Code 要付费，官方也不支持中国大陆和港澳。」
  - say: 「再装 Node 和 F F mpeg。注意，Claude Code 要付费，官方也不支持中国大陆和港澳。」
- Measured: **273.00 s (+12.0 s, exactly the cap)**.
  - s20 drops to 15.0 s, with 5.9 s from its line 3 to the cut, so it is still ≥ 5 s.
  - The subtitles split into three clean chunks.
  - The s15 cues keep their words.

## Draft and judge picks I did not take

- s04_render.5 「浏览器算完每一帧…」 (B, by-ear judge):
  - It adds 1.0 s to s04 and holds the D state about 2 s before 「再」.
  - s03.2 (画画的是浏览器) and s04.1 (给一个时间，就算出那一页) already tell the ear who computes the frames.
- 形状 / 各管一块 / 故事 / 舞台剧 (B, by-ear judge):
  - They contradict the on-screen secrets, the s14 labels (形体贯穿, 各管一段) and the 叙事 chip.
  - The next spoken line already explains 形体 and 各管一段.
  - The work is a stage-set short film, not a stage play.
- 「第六招也拍产品：产品不动…」 (B, sync judge): it says 产品 twice and holds the phone back to line 2. I used A's opener and moved the trio cue instead (see above).
- 三分钟 in case 3: it would be another number right after 60 秒 and 9 秒.
- C_final's s16 without 一个: not needed. With 一个, s20 still keeps 15.5 s and the total is the same.
- Things I added beyond the drafts:
  - 每个镜头 in s13 (from the brief's lesson "每个镜头写清输入、工具和验收标准"). It also lands chapter 03 on a bar.
  - The s08 lane-edit fix.
  - The s11 trio cue.
  - 「这就叫…」 for case 2. It is the shortest of the four case-2 options and has no comma to garden-path on.

## Checks run

- **`--dry` on `final.json`:** 271.00 s.
- **Cues:** every `ctx.word()` cue in the scene files (from a grep of `src/scenes/*.js`) and every case data cue was checked against the new TTS tokens with engine.js's matching rule.
- **Case template:** the case timing was replayed (shrink, caption, points, chips, film, lanes, trio, footage per cue).
- **Subtitles:** every changed line's chunks are at most 18 wide and on screen for at least 0.9 s. No trick is split across two chunks.
- **ASR:** Whisper medium and small were run on every changed line.

Scripts are in the session scratchpad: `hw/build.py`, `cues.py`, `casetime.py`, `subs.py`, `asr.py` and `mkdoc.py`.
