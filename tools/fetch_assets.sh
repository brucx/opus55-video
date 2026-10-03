#!/usr/bin/env bash
# Fetch the large / third-party inputs that are not committed: OFL fonts and the case footage (for commentary use only;
# rights remain with the authors). Then: python3 tools/build_wall.py for the thumbnail wall (needs the opus55 case data).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/fonts/smiley assets/cases
G=https://github.com/google/fonts/raw/main/ofl
curl -sL -o assets/fonts/NotoSansSC-VF.ttf    "$G/notosanssc/NotoSansSC%5Bwght%5D.ttf"
curl -sL -o assets/fonts/NotoSerifSC-VF.ttf   "$G/notoserifsc/NotoSerifSC%5Bwght%5D.ttf"
curl -sL -o assets/fonts/JetBrainsMono-VF.ttf "$G/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"
curl -sL -o assets/fonts/Inter-VF.ttf         "$G/inter/Inter%5Bopsz,wght%5D.ttf"
curl -sL -o assets/fonts/SpaceGrotesk-VF.ttf  "$G/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf"
curl -sL -o /tmp/smiley.zip https://github.com/atelier-anchor/smiley-sans/releases/download/v2.0.1/smiley-sans-v2.0.1.zip
unzip -o -q /tmp/smiley.zip -d assets/fonts/smiley
# case footage: <caseId> <post id>
while read -r id post; do
  python3 tools/xpost.py "$post" --download assets/cases/ >/dev/null && mv "assets/cases/$post.mp4" "assets/cases/$id.mp4"
done <<'LIST'
lists-006 2103273003555402193
gosail-060 2102910531560731063
uc-0962 2102844654169575547
uc-1377 2103116235009347650
gosail-072 2103419586964316483
gosail-054 2103988134069617127
gosail-054-b 2103989912676741479
uc-2348 2103757144789221819
gosail-133 2103836147277345052
LIST
echo "fonts and footage fetched"
