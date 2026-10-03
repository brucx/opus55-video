#!/usr/bin/env bash
# Loudness-normalize the mix (two-pass loudnorm to -16 LUFS / -1.5 dBTP) and mux with the rendered video.
# Usage: tools/finalize.sh [render/video.mp4] [out/opus55-video.mp4]
set -euo pipefail
cd "$(dirname "$0")/.."
video="${1:-render/video.mp4}"; out="${2:-out/opus55-video.mp4}"
mkdir -p "$(dirname "$out")"
stats=$(ffmpeg -hide_banner -i audio/mix.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
mi=$(echo "$stats" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'])")
mtp=$(echo "$stats" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_tp'])")
mlra=$(echo "$stats" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_lra'])")
mth=$(echo "$stats" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_thresh'])")
moff=$(echo "$stats" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['target_offset'])")
ffmpeg -v error -y -i audio/mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$mi:measured_TP=$mtp:measured_LRA=$mlra:measured_thresh=$mth:offset=$moff:linear=true,aresample=48000" -c:a pcm_s16le audio/mix_norm.wav
ffmpeg -v error -y -i "$video" -i audio/mix_norm.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -profile:v high -level 4.2 \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest "$out"
ffprobe -v error -show_entries format=duration,size,bit_rate -of default=nw=1 "$out"
ffmpeg -hide_banner -i "$out" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA|Peak):" | head -4
