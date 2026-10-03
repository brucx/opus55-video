# 小白工具核对：用 Opus 5.5 做代码视频需要什么

核对日期 2026-10-01。标记：【文档】官方页面逐字核对；【实测】本机 Linux 沙箱（隔离 HOME）实际跑通；【未核实】只转述或未运行。

## 1 模型：Opus 5.5 只输出文本

- 【文档】模型页 https://platform.claude.com/docs/en/models/opus-5-5/overview ："Input → output: Text and images → text"；上下文 1M tokens，最大输出 128K tokens；"Released September 22, 2026"；平台：Claude API、Amazon Bedrock、Google Cloud、Microsoft Foundry、Claude Platform on AWS。
- 【文档】概览 https://platform.claude.com/docs/en/models/overview ："All current models support text and image input, text output"。文章"输出模态是文本"成立：视频是模型写的代码经浏览器渲染、FFmpeg 编码得到的。
- 推论：它能看图片，不能直接看视频文件；检查成片要先抽帧。

## 2 Anthropic 官方说法中与视觉相关的内容

- 【文档】发布文 https://www.anthropic.com/claude-opus-5-5 全文没有 video、animation 字样。最接近的是一句测试者评测："A different tester had several Claude models build a game from a single prompt; Opus 5.5 scored higher than any other model on the strength of its graphics and polish."
- 【文档】提示指南 https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5 ："Asked for frontend work without design direction, Claude Opus 5.5 falls back on a few default styles"；"It responds well to instructions that name specific patterns to avoid"。这与文章"把风格词写成可检查规则"一致。
- 【文档】同页称它读 "charts, diagrams, and screenshots considerably more precisely than Claude Opus 5"，可作为"渲染后让它看帧找问题"的依据。
- 未找到 Anthropic 关于"代码生成视频"的官方声明，视频中不要说成官方功能。

## 3 Claude Code：入口与账号

- 【文档】https://code.claude.com/docs/en/setup ：macOS/Linux/WSL 运行 `curl -fsSL https://claude.ai/install.sh | bash`；Windows PowerShell 运行 `irm https://claude.ai/install.ps1 | iex`；也可 `brew install --cask claude-code` 或 `winget install Anthropic.ClaudeCode`；装好后用 `claude --version` 检查。不想用终端，可用 Desktop app。
- 【文档】同页："Claude Code requires a Pro, Max, Team, Enterprise, or Console account. The free claude.ai plan does not include Claude Code access."
- 【文档】https://code.claude.com/docs/en/model-config ："Pro, Max, Team, Enterprise, and Anthropic API: defaults to Opus 5.5"；"Opus 5.5 requires v2.1.280 or later"，旧版本先运行 `claude update`。
- 【文档】https://claude.com/pricing （美元，不含税）：Pro 按月付 $20，年付折合 $17/月；Max 起价 $100/月。
- 【文档】系统要求含 "Location: Anthropic supported countries"；当日 https://www.anthropic.com/supported-countries 列表中未见中国大陆、香港、澳门。

## 4 渲染原理与依赖

| | HyperFrames | Remotion | 纯 HTML/Canvas |
|-|-|-|-|
| 写什么 | HTML、CSS 和可 seek 的动画 | React 组件 | 自写 `renderFrame(t)` |
| 时间 | 引擎让页面 `seek(time)` 后截图 | `useCurrentFrame()` 帧号 | 自己循环 `t = i / fps` |
| 无头浏览器 | 自动下载 | 自动装入 `node_modules` | `npm i puppeteer` 时下载 |
| FFmpeg | 需自装 | v4 起内置 | 需自装 |
| Node.js | 22+ | 16+ | 本次用 v22 |
| 许可 | Apache 2.0 | 个人、≤3 人组织、非营利免费（可商用）；其他营利组织需 Company License | Puppeteer 为 Apache-2.0 |

- 【文档】https://www.remotion.dev/docs/the-fundamentals ："give you a frame number and a blank canvas, to which you can render anything you want using React"；首帧为 0，末帧为 `durationInFrames - 1`；`<Composition>` 需要 `id`、`durationInFrames`、`fps`、`width`、`height`、`component`。
- 【文档】https://hyperframes.heygen.com/packages/engine ：引擎 "seeks to an exact time, and captures the resulting frame"；屏幕录制 "may miss frames under load"；但 "Exact pixels can still vary with Chrome, fonts, codecs, GPU behavior, and the host environment"。引擎 README 说明用 Chrome 的 `HeadlessExperimental.beginFrame` 截图，再交给 FFmpeg 编码。
- 【文档】https://hyperframes.heygen.com/concepts/determinism ：不用 `Date.now()`、`requestAnimationFrame`，不用未设种子的 `Math.random()`，渲染中途不加载素材；FFmpeg "turns the captured frames into the MP4 and mixes in the audio"；`npx hyperframes render --docker` 可固定 Chromium、字体和编码器。
- 【文档】https://ffmpeg.org/ffmpeg.html ："ffmpeg is a universal media converter"；图片序列转视频的官方示例：`ffmpeg -framerate 10 -i 'img-%03d.jpeg' out.mkv`。
- 【文档】https://www.remotion.dev/docs/license/faq ：Company License 分两种，"Remotion for Creators" 每人每月 $25；"Remotion for Automators" 每次渲染 $0.01，每月最低 $100。HyperFrames README："no per-render fees or commercial-use thresholds"。

## 5 小白最短路径

前置：Claude Code 和付费账号、Node.js、FFmpeg。FFmpeg 安装方法见 HyperFrames 排错页：macOS `brew install ffmpeg`；Ubuntu `sudo apt install ffmpeg`；Windows 从 ffmpeg.org 下载，再把 bin 目录加入 PATH。

**(a) HyperFrames**（https://hyperframes.heygen.com/guides/plugins ）

```bash
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes
```

新开会话，输入：`Using /hyperframes:hyperframes, make a 5-second title card that says "Hello world".`
不装插件也可以：`npx skills add heygen-com/hyperframes`，在选择器中选 Core Skills，然后用 `/hyperframes`。Quickstart 还提供一段可整段粘给 agent 的提示（"paste this and skip the rest of the page"）。
手动命令【实测 v0.8.100】：

```bash
npx hyperframes init my-video
cd my-video
npx hyperframes preview
npx hyperframes render --output out.mp4
```

默认模板输出 10 秒、1920×1080、30fps、H.264，本机渲染用时 8.8 秒，首次运行自动下载 chrome-headless-shell。注意：CLI 默认开启匿名遥测，可用 `npx hyperframes telemetry disable` 关闭；`init` 会自动安装核心 skills。

**(b) Remotion**（https://www.remotion.dev/docs/ai/claude-code-plugin ）

```bash
claude plugin marketplace add remotion-dev/claude-code-plugin
claude plugin install remotion@remotion
```

重启 Claude Code，输入 `/remotion-best-practices` 加上需求。
手动命令（https://www.remotion.dev/docs/ ）：

```bash
npx create-video@latest --yes --blank --no-tailwind my-video
cd my-video
npm i
npx remotion skills add
npm run dev
npx remotion render MyComp out/video.mp4
```

【实测 v4.0.531】已跑通创建、`npm i` 和渲染，`skills add`、`npm run dev` 未运行。blank 模板的合成 ID 是 `MyComp`（1280×720、60 帧，画面为空）。首次渲染自动安装 Chrome Headless Shell，无需系统 FFmpeg。

**(c) 纯 HTML/Canvas + 无头浏览器**（本视频的做法）【实测】

```bash
npm init -y && npm i puppeteer
node render.mjs
ffmpeg -framerate 30 -i frames/%05d.png -i voice.wav \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest out.mp4
```

没有配音时，去掉 `-i voice.wav` 和 `-c:a aac -shortest`。`render.mjs` 每帧先调用 `renderFrame(i / 30)`，再执行 `page.screenshot()`。示例在 `research/tools-check/raw-route/`：3 秒、1920×1080 带音轨输出正常，1.5 秒处画面位置正确。Puppeteer README 写明 "npm i puppeteer # Downloads compatible Chrome during installation."；安装脚本被拦截时，运行 `npx puppeteer browsers install`。

## 6 未核实与注意事项

- 两个插件的安装命令取自各自官方文档，写法与 Claude Code 插件文档一致；为避免改动全局环境，本轮未安装。Claude Code 文档提醒："A plugin can run hooks and MCP servers, so read the pane before you install."
- HyperFrames 首页写的是 `npx skills add heygen-com/hyperframes --full-depth`，README 和 Quickstart 不带该参数，本轮未运行。
- `-pix_fmt yuv420p` 是常见的兼容设置。FFmpeg wiki 当日无法访问，未逐字核对；HyperFrames 的实测输出同样是 yuv420p。
- HyperFrames 文档还描述了从 Claude Design 一键 "Send to HyperFrames" 到 HeyGen 云端渲染的路径，未经 Anthropic 文档核实。
- 渲染耗时只代表本机沙箱的一次运行，未在 macOS 和 Windows 上测试。
