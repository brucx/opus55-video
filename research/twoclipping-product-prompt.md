# @twoclipping 产品片提示：怎样校准鼓点、怎样让音效峰值对准画面

- 原帖：https://x.com/twoclipping/status/2102554209166000267 （@twoclipping，2026-09-23 00:22 UTC，附 20 秒 1920×1080 视频）
- 案例库：uc-0430「按节拍与液态玻璃制作产品发布片」，evidenceType = 教程；promptEvidence 标注 `full`，但 `completenessVerified = false`
- 指标：库内 2026-10-01 记录为 608 赞 / 1,437 收藏 / 51,703 浏览；9 月 28 日快照为 605 / 1,430 / 50,677
- 文本来源：项目保存的完整帖文（长帖）`/home/box/orca/projects/opus55/data/_refresh/gosail-2026-09-28-full/posts/2102554209166000267.json`。syndication 接口返回的正文可能被截断，本文引用的是完整文本。原文第 1 步写作 `window.seek(t)`；快照里显示的 `http://window.seek(t)` 是 X 自动生成链接造成的，不属于提示内容。
- 文章中的位置：源文章“先确定声音落点，再安排画面动作”一节引用了它：“专门要求校准音乐实际鼓点，并把音效峰值对准视觉事件”。

## 一句话结论

这份提示的做法是：先测出歌曲的真实节拍，再把所有画面事件写进同一张拍点表。画面是时间的纯函数，可以在任意时刻精确取帧；音效按“峰值时刻”而不是“文件开头”对齐。结论来自作者公开的提示文本。下文最后一节另有我们对成片的粗略检测，检测只能说明成片与提示的节拍要求大体一致。

## 证据边界：帖子声明与提示模板要分开看

- 帖子开头写道：“opus picked the music, downloaded the sfx, built every frame and synced it all to the beat by itself”（Opus 自己选音乐、下载音效、搭建每一帧并全部对上节拍）。这是作者的说法，本轮无法核实。
- 公开模板的 `<inputs>` 却要求用户提供歌曲：“Ask me for: … a royalty-free song with a clear drop (e.g. Mixkit, free for commercial use)”。按模板，音乐由人提供；帖子则说 Opus 选了音乐。演示片的实际做法可能与模板不同。
- “公开提示”只能证明作者提出过这些要求，不能证明成片逐条实现，也不能证明这就是完整对话。

## 关键原文（逐字引用）与含义

| 原文 | 含义 |
|-|-|
| “10 bars at 120 BPM, 2 seconds each.” | 理论网格：120 BPM 时每拍 0.5 秒，4/4 拍每小节 2 秒，10 小节共 20 秒、40 拍 |
| “Bar 1: the hook lands word by word on the beats.” | 第一小节的标题按拍逐词出现 |
| “The drop: a circle opens out of the button into a dark scene.” | 音乐的 drop 对应全片最大的场景转换 |
| “Then one move per bar …” | drop 之后每小节只做一个动作 |
| “Every style is computed from time inside window.seek(t): no CSS animations, no timers, no state between frames.” | 画面是时间的纯函数，所以能在任意拍点精确取帧 |
| “extract clips to 30fps JPEG sequences with ffmpeg and swap img sources per frame. seek awaits the image decodes.” | 实拍素材也按帧号取图，并等待解码完成，避免素材时间漂移 |
| “Analyze the song with numpy: tempo, beat grid, energy per bar, the drop.” | 用代码分析歌曲：速度、拍点网格、每小节能量、drop 位置 |
| **“Calibrate the grid to the real kick hits.”** | **把理论网格校准到真实的底鼓起音上** |
| “Every cut sits on a downbeat, every UI hit on a beat.” | 切镜放在强拍（每小节第一拍），UI 动作放在拍点 |
| “Render with Playwright: 3 subframes per frame at t minus, at, and plus 1/240s, then blend with ffmpeg tmix for real motion blur at 60fps.” | 每帧在 t−1/240、t、t+1/240 秒各渲染一次再混合，得到 60fps 运动模糊 |
| **“Place each sound effect so its measured peak, not its file start, lands on the event.”** | **让测得的音效峰值落在画面事件上，而不是文件开头** |
| “Keep the effects quiet under the music. Loudnorm to -14 LUFS.” | 音效压在音乐下面，最后整体响度标准化到 −14 LUFS |
| “Probe 20 or more frames before the full render. Fix anything cluttered, overlapping or hard to read.” | 完整渲染前至少抽查 20 帧 |
| “Only use music and sound effects whose license allows commercial use.” | 只用许可允许商用的音乐和音效 |
| “Ask me for the inputs, then show me a storyboard with every timing on the beat grid before you write any code.” | 写代码前，先交一张每个时间点都落在拍点网格上的分镜表 |

## 方法拆解

### 1. 校准节拍：理论网格加真实鼓点
- 理论网格：`拍长 = 60 / BPM`。120 BPM 时拍长 0.5 秒，第 k 拍在 `t_k = t_0 + k × 0.5`。
- 为什么要“校准到真实鼓点”：歌曲的第一拍通常不在 0 秒，开头可能有静音或弱起；标称 BPM 也可能与实际略有出入。只按 BPM 推算，网格会整体偏移或逐渐漂移。做法是检测底鼓（低频瞬态）的实际起音时间，用它修正 `t_0`（以及必要时修正拍长）。提示中“The drop”和“energy per bar”的分析结果，用来决定最大转场放在哪一小节。
- 我们的补充（不在原提示中）：120 BPM 配 60fps 时每拍正好 30 帧，配 30fps 时每拍 15 帧，拍点落在整数帧上，不会累积取整误差。选 BPM 和帧率时可以优先考虑这种组合。

### 2. 先写拍点表，再写代码
提示要求先交分镜，每个时间点都写在拍点网格上。各类事件的放置规则：
- 切镜放强拍（downbeat），UI 点击和数字跳变放拍点；
- drop 对应全片最大的视觉变化（浅色 UI 中的按钮打开成暗场景）；
- 每小节一个动作；标题按拍逐词出现。

### 3. 画面可按时间精确取帧，是对齐的前提
`seek(t)` 是纯函数，没有计时器和跨帧状态；实拍素材转成 30fps JPEG 序列按帧取图，并等待解码完成。这样第 n 帧的画面完全由 `t = n / fps` 决定，事件时间写多少，画面就出现在哪一帧。运动模糊用 ±1/240 秒子帧混合，也是按时间取样。

### 4. 音效按峰值对齐
- 很多音效文件开头有静音或渐强段。例如 whoosh 往往要经过几百毫秒才到最响处，点击声则几毫秒就到峰值。把文件开头对准画面事件，观众感受到的“撞击点”会比画面晚。
- 做法：先测出音效文件内部最响时刻的偏移 `p`（例如按 10ms 窗口取包络最大值的位置），再让音效从 `事件时刻 − p` 开始播放。
- 混音时把音效压在音乐下面（“quiet under the music”），最后整体响度标准化到 −14 LUFS。−14 LUFS 是常见的流媒体响度参考值。
- 源文章由此提炼出可迁移的原则：检查观众感受到的同步，而不是只比较音频文件的起始时间。

### 5. 渲染前后都要检查
完整渲染前抽查 20 帧以上。同一作者的另两份模板还要求“每拍看一帧”，并检查单帧跳变（见下一节）。

## 同一作者另外两份模板里的同类规则（对照用）

- UI 形变模板（lists-006，https://x.com/twoclipping/status/2103273003555402193）：
  “Analyze the song with numpy for the beat grid and start on a downbeat. Place every UI sound by its measured peak.”
  “Render one frame per beat before the full render. Fix anything off the grid, cramped or hard to read.”
- 54 拍一镜到底模板（https://x.com/twoclipping/status/2103835273813496100，2026-09-26）：
  “120 BPM, 54 beats, something happens on every beat.”
  “Sound: a downloaded SFX for every event (Mixkit), never synthesized, each placed by its measured peak. The song starts on a downbeat: the zoom lands on the drop, the wall sits in the breakdown, the wordmark returns with the beat. Loudnorm to -14 LUFS.”
  “Check one frame per beat, then scan for single-frame pops (frame-difference spikes 3x their neighbours).”

三份模板的共同顺序：测出真实拍点 → 歌曲从强拍开始 → 每个事件落在拍上 → 音效按峰值放置 → 按拍抽帧检查。

## 我们对成片的粗略检测（本轮新增，不是严格验证）

对象是 X 分发的 1920×1080、60fps、20.06 秒 mp4。这个文件经过平台转码，我们也没有分轨。
- 画面结构（每 0.5 秒取一帧看，`research/cases/sheets/uc-0430-beats.jpg`）与提示的 10×2 秒结构一致：
  - 0–2 秒，“your / next / ad / is one link away”每 0.5 秒出现一个词或词组；
  - 2–4 秒，产品 UI 与光标输入；
  - 约 4 秒，转入暗场景，接真实素材墙；
  - 8–12 秒，3D 轮播，约 10.5 秒处有一次甩镜；
  - 12–14 秒，手机与面板；
  - 14–16 秒，四个数字每拍换一个；
  - 16–18 秒，三词滚动“hooks / ads / launched”；
  - 18–20 秒，Logo 收尾。
- 音频（numpy 频谱通量）：
  - 估计速度约 120.4 BPM，首拍约在 0.04–0.10 秒；
  - 以 120 BPM、相位 0.04 秒的网格计，41 个拍点中有 22 个能在 ±80ms 内找到低频起音，中位偏差约 +7ms，90% 分位约 24ms；
  - 前约 3 秒低频强弱交替（约 −18 / −25 dB），约 3–4 秒起持续保持在 −14～−18 dB，4.0–4.5 秒是此前最强的一拍，与画面约 4 秒进入暗场景大体吻合。
- 画面与拍点：
  - 以音频相位 0.04 秒计，拍点 ±50ms 内的平均帧间变化约为拍间（离拍 ≥150ms）的 2.0 倍；随机相位对照的中位数是 0.97 倍；
  - 后 10 秒，画面变化峰值的相位约 0.045 秒，与鼓点相位一致，倍数 2.77；
  - 前 10 秒（含持续运动的实拍素材墙）峰值相位约 0.175 秒，对齐不明显。
- 整体响度 −13.6 LUFS（ffmpeg ebur128），接近提示要求的 −14 LUFS。
- 局限：
  - 帧差法只能给出约 ±1 帧加缓动时长的精度；
  - 没有分轨，音效和音乐无法分开，所以“按峰值放音效”未能验证；
  - 检测结果也不能说明这些步骤由 Opus 自主完成。
- 数据：`research/cases/uc-0430-beatcheck.json`、`research/cases/uc-0430-sync-profile.json`、`research/cases/uc-0430-visual-onsets.json`；脚本 `tools/beatcheck.py`。

## 给小白的可执行版本（可直接用于视频讲解）

1. 选一首节拍清楚、可商用的歌，记下 BPM（例如 120 → 每拍 0.5 秒，每小节 2 秒）。
2. 让 AI 用代码找出第一个底鼓的真实时间 `t0`，生成拍点表 `t_k = t0 + k × 60/BPM`，并标出 drop 在哪一小节。
3. 写一张时间表：每行包括时间（拍号）、画面事件、文字、音效。切镜放每小节第一拍，点击和数字变化放拍点，最大的转场放 drop。
4. 动画写成 `render(t)`，不用计时器，保证任意时刻都能精确取帧。
5. 对每个音效测出峰值偏移 `p`，让它从 `事件时刻 − p` 开始；音效比音乐小声，最后整体标准化到 −14 LUFS。
6. 每拍抽一帧检查，再带声音完整看一遍；觉得晚了，就按 1–2 帧微调。

```text
拍长      = 60 / BPM                 # 120 BPM → 0.5 s
第 k 拍   = t0 + k × 拍长             # t0 = 实测第一个底鼓时间
音效开始  = 事件时刻 − 音效峰值偏移 p   # 不是事件时刻本身
```
