# 制作简报：Opus 5.5 炫酷视频的秘密＋小白上手

整理日期 2026-10-01。路径相对于 `/home/box/orca/projects/opus55-video/`。
标记：【核】我方核对或测量；【文】官方文档；【测】本机实测；【自述】作者说法，未核实。

## 1 一句话核心洞见

Opus 5.5 不直接“画”视频：它写分镜和代码、调度工具，由浏览器或 3D 引擎按时间算出每一帧（有的还混入生成模型素材），再由 FFmpeg 编码。好看靠叙事、少而一致的视觉规则、统一时间轴（画面＝render(t)，声音和字幕同轴）和逐帧检查的迭代。

## 2 可上屏的硬事实

| 事实 | 来源与状态 |
|-|-|
| 案例库 5,181 条，视频类 1,704 条（32.9%），其中 X 1,263 条、B站 229 条，附公开提示约 116 条 | research/library-stats.json 重算【核】；收录数，非全网 |
| 视频类点赞第一 gosail-001（14,270 赞，混用 Midjourney 等素材），第二 lists-006（12,016 赞） | 同上【核】，截至 10-01 |
| Opus 5.5 输入文本和图片、只输出文本；9 月 22 日发布。由此推断它不能直接看视频，检查成片要先抽帧 | 模型页【文】 |
| 30 秒×30 fps＝900 帧，不等于调用模型 900 次：代码只写一次，渲染器逐帧取画面 | 文章原理；我方用 HyperFrames 渲染 300 帧用时 8.8 秒，只用浏览器和 FFmpeg【测】 |
| 没有设计方向时，它会落回默认风格 | 提示指南【文】 |
| Claude Code 需付费账号（Pro 月付 $20），免费版不含；官方支持地区不含中国大陆、香港、澳门 | 官方页面【文】 |
| lists-006：14 秒、60 fps、无硬切，约 120 BPM 正好 7 小节，片中打出“Every frame is code” | 我方测量【核】；“0 After Effects”为【自述】 |
| gosail-060：60.0 秒、1,800 帧，暖色只在 46.5–55.5 秒 | 我方测量【核】；“纯 JS”为【自述】 |
| uc-1377“构建 90 分钟、渲染 4 小时、花费 40 美元”；uc-0962“约 1 小时、约 7,400 行代码” | 作者帖【自述】 |
| uc-0430 约 120.4 BPM，可匹配的 22 个鼓点与节拍网格中位偏差约 7 ms，响度 −13.6 LUFS | 我方粗测【核】 |

## 3 八个案例速览

视频在 `assets/cases/`，英雄帧在 `research/cases/sheets/`。

| caseId | 作者 | 独特之处 | 最佳片段（文件：秒） | 英雄帧 t | 为什么炫 | 小白可学 | 证据边界 |
|-|-|-|-|-|-|-|-|
| lists-006 | @twoclipping | 一个形体连续变成按钮、播放器、图表、⌘K | lists-006.mp4：0–2.7 钩子；9.6–12.75 出现“Every frame is code”（必用） | 11.65 | 视线只跟一个物体；弹簧拉伸；光标触发每次变化 | 先定贯穿对象和状态，排上节拍，每拍出一帧检查；可套原帖模板 | 源码未公开；音乐授权不明，静音使用 |
| gosail-060 | @morpheusdv | 一滴墨长成角色、创造世界，失控后被光重组 | gosail-060.mp4：46.3–51.0 光环扫过、世界重组；19.9–24.4 一笔长成树 | 47.9 | 只用纸和墨，暖色只给高潮；物体是“长”出来的 | 按秒写分镜，风格拆成可检查的规则，先做通第一场 | 无音轨；有未公开参考图；远景角色太小 |
| uc-0962 | @kimmonismus | 以发光单词“the”为主角，讲 3 分钟 AI 史 | uc-0962.mp4：13.5–21.0 单词织成注意力网；43.5–49.8 粒子球 | 21.5 | 一个母题串起九段；转场从内容里长出来 | 先写 STORYBOARD.md，每场渲 3–4 张静帧自查；规定每屏字数和停留时长 | 公开提示要求静音，成片却有旁白配乐；史实未逐句核 |
| uc-1377 | @WinterArc2125 | 用高程数据和作者所称的当日太阳位置重现奥斯特里茨战役 | uc-1377.mp4：170.5–178.0 太阳破雾；235.5–243.0 箭头接冰湖落日 | 176.5 | 地图讲移动，地面镜头给情绪；用光线交代时间 | 提示只写导演意图和不想要的效果 | 耗时成本为自述；地形垂直放大 3 倍；3:29–3:35 像素化 |
| gosail-072 | @aiwarts | 读网站代码和线上页面，按用户路径拍产品片，横竖两版 | gosail-072.mp4 与 gosail-072-b.mp4 同取 13.0–16.95 并排；gosail-072.mp4：2.0–4.6 @Just_sharon7 的作品缩回网格 | 3.47 | 卖点都有真实界面作证；竖版重新排版，不是裁切 | 把用户路径写成镜头顺序；竖屏单独排版 | 最炫的画面是他人的 Seedance 等作品；“一次直出”为自述 |
| gosail-054 | @yoshifujidesign | 以手机 3D 模型为固定输入，做四种风格的 PV | gosail-054.mp4：18.5–21.95 扫描线把线稿变写实；gosail-054-b.mp4：0–6.3 一笔手写线 | 20.3（竖屏） | 橙线首尾呼应；机身一致，风格各异 | 模型和 Logo 不改，只改镜头、光线和配色 | 未公开提示；片中参数是虚构的；竖屏需并排 |
| uc-2348 | @aicreataro | 用舞蹈骨架坐标驱动歌词和光效 | uc-2348.mp4：8.667–10.917 从骨架到落地爆发；3.667–7.292 歌词挂在手上 | 10.375 | 先给观众看数据，再看效果；卡在 132 BPM | 只挑两三个动作，各绑一种效果，用完就收 | 据作者，歌和舞者由 Suno、MiniMax 生成；15.79–16.33 秒频闪 |
| gosail-133 | @KanaWorks_AI | Opus 统筹，Seedance、GPT Image、MiniMax 分管动作、布景、背景微动 | gosail-133.mp4：7.917–10.833 幕布合拢、换成夜空；0–2.667 开幕 | 10.25 | 固定舞台统一五幕；换景藏在幕布后，无硬切 | 先搭固定舞台，每个镜头写清输入、工具和验收标准 | 分工为自述；“便宜稳定”不是排名；只有 720p |

## 4 为什么这么炫：7 个跨案例手法

1. **一个对象贯穿全片，转场从内容里长出来**：lists-006 的形体、uc-0962 的“the”、gosail-054 的橙线、gosail-133 的幕布、gosail-060 的墨滴；lists-006、gosail-060、gosail-133 实测无硬切。
2. **规则少，强调色省着用**：gosail-060 的暖色只给高潮，lists-006 的彩色只在 1.4–3.7 秒出现。
3. **时间是唯一依据**：画面＝render(t)，不用真实时钟、未固定的随机数或跨帧状态，才能单帧检查、并行渲染、做子帧运动模糊（lists-006、gosail-060 的提示，uc-1377 的 README）。
4. **声音先行**：测出真实鼓点，事件落在拍点上，音效按峰值对齐，响度定在 −14 LUFS（lists-006、uc-0430）；先生成旁白再排镜头（uc-1377）。
5. **先导演后制作**：按秒写分镜，每场渲染静帧自查（uc-0962），先做通第一场（gosail-060）。
6. **用真实数据做约束**：地形（uc-1377）、3D 模型（gosail-054）、骨架坐标（uc-2348）、真实网站（gosail-072）。
7. **分工明确**：Opus 管设计、代码和编排；gosail-133、uc-2348、gosail-072 最像大片的画面多来自生成模型或现成素材。

## 5 小白路线

**前置**：安装 Claude Code（`curl -fsSL https://claude.ai/install.sh | bash`，Windows 用 `irm https://claude.ai/install.ps1 | iex`），备好付费账号、Node.js、FFmpeg。

| 路线 | 起步 | 注意 |
|-|-|-|
| HyperFrames（HTML，Apache 2.0，适合字幕、图表、界面） | `npx hyperframes init my-video` → `npx hyperframes render --output out.mp4`【测】，预览用 `npx hyperframes preview`；插件：`claude plugin marketplace add heygen-com/hyperframes` → `claude plugin install hyperframes@hyperframes` | 需 Node 22+，自装 FFmpeg；默认开启遥测，`npx hyperframes telemetry disable` 可关 |
| Remotion（React） | `npx create-video@latest --yes --blank --no-tailwind my-video` → `npm i` → `npx remotion render MyComp out/video.mp4`【测】；插件：`claude plugin marketplace add remotion-dev/claude-code-plugin` → `claude plugin install remotion@remotion` | 内置 FFmpeg；个人和 3 人以内团队免费，更大的公司需付费许可 |
| HTML/Canvas＋无头浏览器（本片同路线） | `npm i puppeteer` → `node render.mjs`（逐帧调用 renderFrame(i/30) 后截图）→ `ffmpeg -framerate 30 -i frames/%05d.png -i voice.wav -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest out.mp4`【测】 | 示例代码在 research/tools-check/raw-route/，可上屏；本片用 Playwright |

插件命令取自官方文档，未安装。

**六步流程**（第一支先做 15–30 秒）：①明确任务：观众、用途、主旨、时长、画幅；②整理输入：事实、素材、可用范围、缺口；③设计分镜：目的、主体、动作、文字、声音；④做小样：三张风格帧＋一个短镜头导出；⑤扩展与修改：按时间点逐轮改；⑥验收交付：关键帧、带声完整看、手机上看、素材来源，保留工程。

**六条经验**：①风格词改成可检查的规则（“两种字号，每屏一个主信息”）；②动画以时间为共同依据；③先定声音落点再排动作；④反馈＝时间点＋问题＋期望，每轮只改一类；⑤静帧、片段、最终文件都要查；⑥分项记成本，保留工程。

**提示模板要点**：写清观众、用途、主旨、规格、已有材料、参考借鉴点、必须保持与允许创作的部分、资源限制；让模型先列缺口，标明画面和声音的来源，不把不确定的写成事实；第一轮只要分镜表、三张风格帧、一个短镜头和一次导出；动画按时间可重算、固定随机种子、等字体加载完；最后交付视频、源码、素材清单、字幕和复现说明。

**Lemo-Opuscar**：`claude plugin marketplace add lemomo-ai/lemo-opuscar` → `claude plugin install lemo-opuscar@lemolab`（已对照清单，未安装），再一句话说风格和主题。它默认不看分镜直接出片，小白要说“先给我看分镜”；默认 30–60 秒，首支可要 15–30 秒。需 Node 20+、ffmpeg、Python 3.11+，Windows 用 WSL，3D 风格要 GPU。可学：前 3 秒抓人；一个主体、一个目标、一个转折；先找对标；先写节拍表；看得见的动作都有声音；中文停留不少于“字数÷4.5＋1.5”秒。

## 6 风险说法：避免或加标注

- 不说“Opus 能生成视频”“官方视频功能”：它输出代码，发布文没提视频，也未见官方的代码生成视频说法。
- 不说“一句话出片”：公开提示不是完整对话（uc-0962 的提示要求静音，成片却有旁白和配乐）；“一次直出”“口述一句提示跑 12 小时”标【自述】。
- “纯代码”也常含 TTS、字体、开放数据、参考图或他人作品。
- 耗时、成本、“便宜 30%”“每支 30–60 分钟”只代表某一次，标“作者自述”；史实、地形、太阳位置都未核实。
- gosail-072 最炫的画面、uc-2348 的舞者和歌、gosail-133 的角色动作都不是 Opus 生成的；“便宜稳定”不是模型排名。
- 确定性是同一时刻同一状态，不是跨机器逐像素一致。
- 数据说“截至 10 月 1 日 WaytoAGI 收录”，不说“十天内全网”；库中 2 条视频发于 09-21（UTC），早于官方发布日。
- 案例墙也有 Runway、Higgsfield、Midjourney 和档案剪辑的作品，不说“全是 Opus 用代码画的”；gosail-072 的墙砖是 @Just_sharon7 的 Seedance 画面；uc-0155 由 @claudeai 发布、@kevin_t_ngo 制作，不暗示是 Anthropic 出品。
- 付费和地区限制如实说，不教绕过。
- 库中 github-143 的“39 种、CC BY 4.0”已过时，现为 43 种、MIT；Lemo 部分样片是非官方同人片，借用要署名。
- uc-0430 帖称 Opus 自己选了音乐，模板却要用户给歌，不说“AI 自己选歌”。
- 光敏：避开 uc-2348 的 0–1.8 秒和 15.79–16.33 秒、gosail-054-pre1 的 13.1–14.5 秒。
- 原片音乐大多授权不明，片段静音或压低；每段署作者名，数据注“截至 10-01”。
- 幕后只讲本片真实做法，帧数等渲染后再填。

## 7 素材清单（均已用 ls 核对）

| 文件 | 规格 | 时长 | 备注 |
|-|-|-|-|
| assets/cases/lists-006.mp4 | 1440×1440 60fps | 14.06 s | 方形 |
| assets/cases/gosail-060.mp4 | 1920×1080 30fps | 60.0 s | 无音轨（其余都有） |
| assets/cases/uc-0962.mp4 | 1920×1080 30fps | 180.1 s | |
| assets/cases/uc-1377.mp4 | 1920×1080 24fps | 301.4 s | 带黑边，有效画面 y 130–950 |
| assets/cases/gosail-072.mp4、gosail-072-b.mp4 | 1920×1080 / 1080×1920 30fps | 各 30.1 s | 横竖两版；含第三方作品 |
| assets/cases/gosail-054.mp4、gosail-054-b.mp4、gosail-054-pre1.mp4、gosail-054-pre2.mp4 | 1080×1920 30fps | 各 30.0 s | 前两支属案例 gosail-054；pre1、pre2 不在库中，pre1 有闪白 |
| assets/cases/gosail-133.mp4 | 1280×720 24fps | 15.06 s | |
| assets/cases/uc-2348.mp4 | 1920×1080 24fps | 32.43 s | 有频闪段 |
| research/cases/video/2102554209166000267.mp4 | 1920×1080 60fps | 20.06 s | uc-0430 成片 |
| research/cases/video/2103988134069617127.mp4 | 1080×1920 30fps | 30.0 s | 与 gosail-054.mp4 完全相同 |

- **墙砖**：assets/wall/ 下 60 张 480×270 图片；manifest.json 记录作者、署名和截帧时间。
- **英雄帧**（research/cases/sheets/）：lists-006-hero-11.65s.png（1440×1440）；gosail-060-hero-47.9s.png、gosail-072-hero-3.47s.png、uc-2348-hero-10.375s.png、uc-0962-full-0021.5.jpg、uc-1377-hero-cand-176.5.jpg（均 1920×1080）；gosail-054-hero-20.30s.png（1080×1920）；gosail-133-hero-10.25s.png（1280×720）。
- **其他图**（同目录）：wall-preview-10x6.jpg（1986×690）；gosail-054-variants-camera.jpg（1440×640，四版对比）；uc-0430-beats.jpg（1956×704）。
- **文本和代码**：research/cases/ 下的 *-prompt.txt 和 *-posts.txt；research/cases/uc-1377-repo/（未写许可，只能短引并署名）；research/tools-check/raw-route/。
- **字体与 Logo**：assets/fonts/；assets/waytoagi-logo-dark.svg、assets/waytoagi-logo-light.svg。
