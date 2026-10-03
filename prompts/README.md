# 提示词与工作流

本片由 Claude Opus 5.5 在 Claude Code 中制作。这里保存驱动多代理协作的全部提示词（Workflow 脚本里的 agent 提示），
以及用户的原始需求。脚本可在 Claude Code 的 Workflow 工具中重跑（`args` 见同名 `.args.json`）。

## 用户需求（原话，按时间）
1. 参考 https://waytoagi.feishu.cn/docx/EAiLdNnmGoTNA4xpLlAc9s0Pnse 和这个参考里面的其他内容，制作一个视频来介绍 Opus5.5 为什么能做成这么炫酷的视频，小白如何自己做出这么炫酷的视频。
2. 发给我看看现在的视频
3. 上传到 tigirs data 的对象存储，给我一个链接
4. 视频开始，做一个封面，要有个活泼的标题吸引用户
5. 2:42 秒之前右上角的 waytoagi logo 不对，检查一下修复了没
6. 标题试试 “这些视频全是代码写的？！”
7. 旁白声音要求没有看画面也能连贯听明白，检查一下。几个“照搬”上下衔接有点突兀，有没有办法优化

## 工作流
| 文件 | 作用 | 代理数 |
|-|-|-|
| `workflows/1-research.js` | 8 个案例的高清原片下载、逐帧审看与高光片段选择；Lemo-Opuscar、工具链核实；案例库统计；汇总简报 | 8 |
| `workflows/2-script.js` | 三个角度的脚本初稿 → 观众/制片/事实三位评审 → 合成 → 事实与语音核实 | 9 |
| `workflows/3-scenes.js` | 每个场景：动效作者 → 独立评审 → 修复，全部基于渲染帧核验 | 37 |
| `workflows/5-film-review.js` | 整片五视角审查（衔接、排版、音画同步、事实署名、小白观感）→ 按场景修复（跑了两轮） | 17 + 12 |
| `case-template-redesign-agent.md` | 第一轮审查后重做 8 个案例模板的代理提示 | 1 |
| `workflows/6-narration-audio-first.js` | 旁白“盲听”审查 → 两版改写 → 两位评审 → 合成 | 7 |

制作规范见 `../script/`：`creative-brief.md`（创意简报）、`design.md`（视觉规范）、`storyboard.md` + `amendments.md`（分镜）、
`narration.json`（旁白与场景数据）、`decisions.md`。研究资料见 `../research/`。
