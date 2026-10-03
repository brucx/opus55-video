#!/usr/bin/env bash
# Full build: narration timeline -> clip frames -> SFX events -> music -> mix -> parallel render -> mux -> ASR check.
#   tools/build.sh            full 1080p build to out/opus55-video.mp4
#   PREVIEW=1 tools/build.sh  half-resolution preview to out/preview.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
PY=.venv/bin/python
$PY tools/build_timeline.py
$PY tools/extract_clips.py
$PY tools/stats.py
node tools/events.mjs
$PY tools/music.py
$PY tools/mix.py
if [ "${PREVIEW:-0}" = "1" ]; then
  node tools/render.mjs --workers "${WORKERS:-6}" --scale 0.5 --out render/preview.mp4
  tools/finalize.sh render/preview.mp4 out/preview.mp4
else
  node tools/render.mjs --workers "${WORKERS:-6}" --out render/video.mp4
  tools/finalize.sh render/video.mp4 out/opus55-video.mp4
fi
$PY tools/asr_scenes.py audio/mix_norm.wav || true
