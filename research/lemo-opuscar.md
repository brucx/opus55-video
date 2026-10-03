# Lemo-Opuscar 调研（2026-10-01）

依据仓库 main（09-30）的文档、插件清单、LICENSE、提交历史和作者 X 帖；未安装、未渲染。

## 1. 是什么

- 风格库＋方法文档＋渲染工具，打包成 Claude Code 插件。43 种风格分 9 类，每种是一份 `STYLE.md` 风格提示词加一支纯代码样片；另有 6:25 的《OPUSCAR 98》。图鉴：lemomo-ai.github.io/lemo-opuscar。
- 作者 Lemomo（X @lemomo_ai），署名 LemoLab；09-26 建库，约 693 星。自述两天“做了 100 多支，挑了 39 个风格”。
- 许可：现为 MIT，另注第三方素材沿用各自授权。09-29 前指南与成片是 CC BY 4.0；我们案例库 github-143 仍写旧许可和“39 种”，gallery README 也写“39 种”。
- 技术栈：Canvas/three.js/WebGL2 页面，无头 Chromium 逐帧截图，ffmpeg 合成；Kokoro 或 edge-tts 配音（中文走微软在线服务），whisper 校对；采样库加 numpy 配乐。不用视频生成和素材库画面。

## 2. 小白怎么用（命令已核对）

```sh
claude plugin marketplace add lemomo-ai/lemo-opuscar
claude plugin install lemo-opuscar@lemolab
```

清单与命令一致，`claude plugin validate` 通过。也可 clone 后运行 `claude`；其他 agent 可复制 `plugin/skills/lemo-opuscar/`。

然后说：“用水彩笔刷风格做一支 45 秒的片子，讲……”。agent 只问一次：事实、自带素材、是否先看分镜（默认不看，直接出片）。

- 需要 Node 20+、ffmpeg、Python 3.11+；Windows 用 WSL，3D 风格要 GPU。核心依赖约 350 MB，配音层另需约 0.7 GB。
- 作者估计每支 30–60 分钟（未验证）。默认 1080p、24 fps、−14 LUFS；交付成片、字幕、TREATMENT.md、CREDITS 和源码。

## 3. DIRECTOR.md：先导演，后制作

- 评判顺序：声音、节奏、镜头、导演；好看的画面只是起点。
- 先选 1–2 部对标作品，写明学什么、不拿什么。
- 故事：一个主体、一个目标、一个转折；前 3 秒有钩子；结尾呼应开头。
- 开工前写 TREATMENT.md：三个候选结构、分镜表（景别、运镜、时长、理由）、逐秒节拍、cue map、声音设计表；再用真实代码出三张风格帧或角色设定稿。
- 声音：动作都有声；环境、拟音、音乐三层；转折前至少两次安静。
- 镜头：至少四种运镜和一个招牌镜头；转场用媒介本身完成；关键时刻主体至少占画面高 1/3。
- 常见失败：主体太小、太暗、字幕挡主体、转场空帧。
- 别照抄样片：结构、开场、招牌镜头等六项至少四项不同。

## 4. TECHNIQUE.md：实现配方

1. 页面暴露 `DUR`、`render(t)`、`READY`，可选 `EV`（音效事件）和 `TEXTS(t)`（屏上文字）。
2. 确定性：不用 `Date.now()`、无种子随机数和跨帧状态，任意帧可单独、乱序、并行渲染。
3. 节拍和命中点写在同一个 `timeline.js`，配乐、混音、字幕、检查共用。
4. 截 JPEG 交给 ffmpeg；颗粒在 ffmpeg 里加；两遍响度归一到 −14 LUFS。
5. TTS 写数字读法，字幕用数字；whisper 逐句比对；中文字体子集化后本地加载。
6. 检查：联系表看两遍，关键动作看 0.2 秒帧条，成片测响度和黑帧，最后带声看一遍。

## 5. 新手最该学的 8 条

| 原文 | 中文 |
|-|-|
| “Hook in the first 3 seconds.” | 前 3 秒抓人 |
| “One subject, one goal, one turn.” | 一个主体、一个目标、一个转折 |
| “The benchmark lifts quality more than any rule below.” | 先找对标，比任何规则都管用 |
| “Write the cue map before animating.” | 先写节拍表，再做动画 |
| “Every visible action has a sound” | 看得见的动作都有声音 |
| “(characters ÷ 4.5 + 1.5) s in Chinese” | 中文停留≥字数÷4.5＋1.5 秒（18 字约 5.5 秒）；字幕≥1.8 秒 |
| “make it fast with fewer words per screen” | 想快就少放字 |
| “Avoid default fades and hard cuts.” | 不用默认淡入淡出和硬切 |

## 6. 与文章的出入

- 只走“代码生成与渲染”路线，SKILL.md 写明不做已有视频剪辑。
- 文章主张先审分镜和小样；Lemo 默认直接出片，靠脚本和 agent 自检，作者自己的样片却有人审风格帧和成片。新手宜要求“先看分镜”。
- 首片时长：文章建议 15–30 秒，Lemo 默认 30–60 秒。
- “纯代码”仍用采样库、字体、模型和 TTS，须写进 CREDITS。
- 确定性指同一时刻得到同一状态，未声称跨机器逐像素一致。
- 文章说 skill 补不齐审美；Lemo 把大量审美写成规则，但事实和素材仍靠用户。
- 耗时和“每一帧都是 Opus 写代码做的”属作者自报。仓库自述部分样片是真实事件或角色的非官方同人片；借用画面须署名，不暗示官方关系。

## 7. WaytoAGI 资料

- GitHub gallery 目录：README（5181 条，视频类 1704 条）、离线单文件 `index.html`（约 4.1 MB）、`data/`、`scripts/`、`reviews/`、`assets/` 和更新日志；案例归原作者，数据与脚本 MIT。
- 公开页 waytoagi.com/usecase-atlas/opus5-5/ 返回 HTTP 200，标题“Claude Opus 5.5 真实案例使用图谱 · Real-World Use Case Atlas | WaytoAGI”。

## 8. 对本片

可沿用页面契约、阅读时长公式和联系表检查；引用画面注明“Lemo-Opuscar / Lemomo”；`docs/cover.jpg` 风格拼图可作 B-roll。
