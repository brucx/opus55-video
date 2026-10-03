#!/usr/bin/env bash
# Contact sheet with burned-in timestamps.
# Usage: tools/contact.sh <video> <out.jpg> [every_seconds=2] [start=0] [end=duration] [cols=6] [thumb_width=320]
set -euo pipefail
in="$1"; out="$2"; every="${3:-2}"; start="${4:-0}"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
end="${5:-$dur}"; cols="${6:-6}"; tw="${7:-320}"
span=$(python3 -c "print(max(0.001, float('$end') - float('$start')))")
n=$(python3 -c "import math; print(max(1, math.ceil($span / $every)))")
rows=$(python3 -c "import math; print(math.ceil($n / $cols))")
font=/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc
[ -f "$font" ] || font=$(fc-match -f '%{file}' 'Noto Sans CJK SC:bold')
ffmpeg -v error -y -ss "$start" -t "$span" -i "$in" \
  -vf "fps=1/$every,scale=$tw:-2,drawtext=fontfile=$font:text='%{pts\:hms\:$start}':x=6:y=6:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6,tile=${cols}x${rows}:padding=4:margin=4" \
  -frames:v 1 -q:v 3 "$out"
echo "$out ($n frames, every ${every}s from ${start}s to ${end}s)"
