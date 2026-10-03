# 这些视频全是代码写的？！— Opus 5.5 炫酷视频的秘密 + 小白上手指南

A 4:31 Chinese explainer (1920×1080, 30 fps) for WaytoAGI, based on the Feishu article
《Opus 5.5 怎样把代码变成视频：8 个精选案例与制作经验》. The video is itself made with the method it explains: every
frame is HTML/SVG/Canvas computed from time `t`, captured by headless Chrome and encoded by FFmpeg; the voice is
TTS with word timings; the music and sound effects are synthesized by Python.

**Watch:** see [VIDEO-LINKS.md](VIDEO-LINKS.md) (1080p / 720p / subtitles / cover).
**How it was made:** prompts and multi-agent workflows in [prompts/](prompts/README.md); time and token report in
[docs/PRODUCTION-REPORT.md](docs/PRODUCTION-REPORT.md).

## Deliverables (`out/`, videos not committed)
| file | what |
|-|-|
| `opus55-video.mp4` | final video, H.264 + AAC, −16 LUFS, burned-in Chinese subtitles |
| `subtitles.srt` | the same subtitles as a separate track |
| `cover.jpg` | 1920×1080 cover frame (no subtitles) |
| `publish.md` | suggested title, description, tags and credits for B站 / 视频号 / X |

## How it is built
```
script/narration.json ──► tools/build_timeline.py ──► src/timeline.js (scenes, lines, word + subtitle timings)
   (voice lines,             edge-tts zh-CN-YunxiNeural      audio/narration.wav, out/subtitles.srt
    scene list, data)
script/clips.json ──► tools/extract_clips.py ──► src/media/<clip>/f#####.jpg (exact-frame footage excerpts)
src/scenes/*.js  ──► tools/events.mjs ──► audio/events.json (SFX cues declared by scenes)
audio/timeline.json ──► tools/music.py ──► audio/music.wav (chords/bass/drums/arp follow each scene's energy)
narration + music + SFX ──► tools/mix.py ──► audio/mix.wav (music ducked under the voice)
src/index.html + scenes ──► tools/render.mjs ──► render/video.mp4 (6 Chrome workers seek(t) + capture, FFmpeg chunks)
video + mix ──► tools/finalize.sh ──► out/opus55-video.mp4 (two-pass loudnorm −16 LUFS, x264 CRF 19)
```
- Engine: `src/lib/engine.js` (deterministic seek, transitions, subtitles, chrome), `kit.js` / `kit2.js` / `shared.js`
  (components), `src/scenes/*.js` (one file per scene; the eight case scenes share `case.js`).
- Spec: `script/creative-brief.md`, `script/storyboard.md` + `script/amendments.md`, `script/design.md`,
  `script/decisions.md`. Research: `research/` (brief, per-case highlight analysis, tools and Lemo-Opuscar notes).

## Rebuild
Requirements: Node 20+, Python 3.11+, FFmpeg, a Chromium headless shell (Playwright's cache is used automatically).
```bash
npm install                       # playwright-core
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
tools/fetch_assets.sh             # fonts (OFL) + case footage (not committed)
tools/build.sh                    # full build → out/opus55-video.mp4 (~7 min render on 8 cores)
PREVIEW=1 tools/build.sh          # half-resolution preview → out/preview.mp4
node tools/still.mjs --scene s04_render --every 0.5 --sheet s04 --out render/stills/s04   # inspect one scene
.venv/bin/python tools/asr_check.py audio/mix_norm.wav    # Whisper listens back and compares every line
```
`tools/stats.py` fills the on-screen production numbers (frames, lines of code, render minutes) from the real build;
render minutes come from the previous full render (`render/video.render.json`).

## Credits and rights
- Case footage excerpts (shown with on-screen credit, for commentary): @twoclipping, @morpheusdv, @kimmonismus,
  @WinterArc2125, @aiwarts, @yoshifujidesign, @aicreataro, @KanaWorks_AI. All rights remain with the authors; original
  audio is not used. Thumbnail wall: case posters from the WaytoAGI Opus 5.5 case atlas, rights with their authors.
- Fonts (SIL OFL): Noto Sans SC, Noto Serif SC, Smiley Sans (得意黑), Space Grotesk, Inter, JetBrains Mono.
- Voice: Microsoft Edge neural TTS via `edge-tts` (zh-CN-YunxiNeural). For commercial distribution consider switching
  the voice to a licensed TTS service or a recorded narrator; only `script/narration.json` → `build_timeline.py` changes.
- Music and sound effects: synthesized by `tools/music.py` and `tools/mix.py` (no samples).
- WaytoAGI logo: official brand asset.
