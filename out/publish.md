# 发布文案（B站 / 视频号 / 抖音 / X）

## 标题（任选其一）
- 这些视频全是代码写的？！Opus 5.5 炫酷视频的秘密 + 小白上手指南
- 每一帧，都是代码：Opus 5.5 炫酷视频的秘密 + 小白上手指南
- Opus 5.5 的视频为什么这么炫？8 个案例拆给你看，小白也能做
- 这支视频没有一帧是拍的：Opus 5.5 代码做视频，原理和上手全讲明白

## 简介
Opus 5.5 不直接“生成”视频：它写分镜、写代码、调工具，浏览器一帧一帧把画面算出来，FFmpeg 再拼成视频。
这支视频从 WaytoAGI 收录的 1,704 个视频类案例里挑了 8 个，每个拆一招：贯穿全片的形体、只留给高潮的暖色、
画面旁白配乐分层、用真实数据当约束、按用户路径排镜头、固定产品只换演出、让动作驱动特效、多模型各管一段。
后半段是小白上手 6 步：准备能跑代码的 AI 工具 → 选路线（HyperFrames / Remotion / 网页＋无头浏览器 / Lemo-Opuscar）
→ 套模板写需求 → 先要分镜、效果图和小样 → 反馈写成“时间点＋问题＋期望” → 截图、片段、带声音完整检查。

本片本身就是这样做的：Claude Opus 5.5 在 Claude Code 里写了场景代码、时间轴和配乐程序；无头 Chrome 逐帧截图，
FFmpeg 编码；旁白为微软神经网络语音合成（edge-tts），配乐与音效由 Python 程序合成。

- 全文：《Opus 5.5 怎样把代码变成视频：8 个精选案例与制作经验》 https://waytoagi.feishu.cn/docx/EAiLdNnmGoTNA4xpLlAc9s0Pnse
- 案例库（5,181 个案例，截至 2026-10-01）：https://www.waytoagi.com/usecase-atlas/opus5-5/

说明：Claude Code 需付费账号（Pro 起），免费版不含；官方支持地区不含中国大陆、香港、澳门（2026-10-01 核对）。片中命令出自各工具官方文档（2026-10-01 核对）；
耗时、成本等为作者自述。案例片段仅用于介绍与分析，版权归原作者：@twoclipping @morpheusdv @kimmonismus @WinterArc2125
@aiwarts @yoshifujidesign @aicreataro @KanaWorks_AI。

## 标签
Claude、Opus 5.5、Claude Code、AI 视频、代码动画、Remotion、HyperFrames、FFmpeg、动效设计、WaytoAGI、AI 教程

## 章节（B站分P/进度条标记）
00:00 开场：这些视频全是代码写的？！
00:18 原理：Opus 只输出文字，画面 = render(t)
00:47 为什么炫：1,704 个视频案例里的 8 招
02:50 小白上手：6 步做出第一支
04:08 幕后：这支片子也是这么做的
04:22 全文和案例库
