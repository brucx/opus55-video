# Agent prompt: case template redesign (after film review round 1)

```text
You own the CASE TEMPLATE of a code-rendered Chinese explainer video. Project: /home/box/orca/projects/opus55-video.
Each frame is HTML/SVG computed from time t (render(state, t, ctx) must be pure in t; no Math.random/Date/CSS animations); headless Chrome
captures frames; FFmpeg encodes. The 8 featured-case scenes s06_c1 … s13_c8 all use ONE template: src/scenes/case.js (data per scene in
script/narration.json → "data"; timings in src/timeline.js). Read first: script/design.md (visual contract, safe areas: no text in y<112
or y>900 while subtitles show), src/scenes/case.js (current template), src/lib/engine.js + kit.js + kit2.js + shared.js (APIs: E.tf, E.h,
E.setImg, ctx.clipUrl, ctx.cue, ctx.word, ctx.transition, K.videoCard, K.chip …), script/storyboard.md sections s06–s13, research/brief.md
(case facts), and the review findings in script/case-review-issues.json. A backup of the current file is at
/tmp/claude-1000/-home-box-orca-projects-opus55/5ce66f83-c1b1-47c5-90bd-562b76f3648a/scratchpad/case.v1.js.

THE PROBLEM (from a 5-lens film review): the case section is 35 % of the film but repeats one text-heavy layout 8 times; the footage —
what viewers came for — gets only 12–27 % of the frame; each trick is stated, never demonstrated; by case 4 attention drops.

REDESIGN case.js (you may also add/adjust "data" fields of s06–s13 in script/narration.json — NOT their "lines" — then run
`.venv/bin/python tools/build_timeline.py` to regenerate src/timeline.js; TTS is cached so it is fast). Required:
1. FOOTAGE FIRST for every case whose ctx.transition.type is 'push' (s07–s13): from local 0 until (secret cue − 0.3 s) the first clip plays
   BIG, centred in the content box (16:9 → 1312×738 centred at (960, 510); 1:1 → 738×738; 9:16 → 415×738), with its credit chip; then it
   shrinks into the card position over ~0.5 s (outCubic, transform-based) and the right column comes in (header items staggered quickly,
   then the secret on its cue). s06_c1 (transition 'zoom') must keep its CURRENT entrance exactly (s05_wall.js tracks that card pose for
   its hand-off: spring(t − 0.05, {140, 19}) scale 0.86→1, +30 px rise, push 1 + 0.025·t/dur, card centre (632, 515)) — do not change it.
2. LESS TEXT AT ONCE: merge '@handle · 路线 · caveat' into at most two quiet lines; drop the 炫在哪里/可以照搬 labels if the visual
   hierarchy already makes them clear (or keep tiny); bullets: show the current one prominently and dim earlier ones; reading sizes per
   design.md (points ≥ 30 px, takeaway ≥ 30 px, provenance caveat ≥ 24 px at ~78 % white — it is the honesty label and must stay legible).
3. PROOF, NOT JUST TEXT: add an optional data-driven "proof strip" (small diagram under or beside the card, inside the safe area) so each
   trick is SHOWN while the voice states it. At least: s07 (gosail-060) a 60 s bar with the warm segment 46.5–55.5 s highlighted amber and a
   playhead following the clip's real source time (c2-060-tree = source 19.9–24.3 s, c2-060-light = 46.3–51.0 s — read srcStart from
   ctx.clipInfo); s08 (uc-0962) three lanes 画面/旁白/配乐 with blocks and one shared playhead labelled 一条时间轴; s06 (lists-006) chips
   按钮 → 播放器 → 图表 → 命令面板 lighting up as the morph reaches each state (look at the clip frames to time them); s10 (gosail-072)
   首页 → 搜索 → 复制提示词 lighting with its clip sequence. Others: something equally concrete if cheap (s09: 地形数据 → 地图 → 地面镜头;
   s12: 骨架坐标 → 歌词/光效; s13: 三个模型 each owning a part; s11 see 5).
4. Push transitions: the series-dot row (the film's through-object: lime active dot) must not vanish — use full opacity for push as for zoom.
5. s11_c6 (9:16, gosail-054): when the voice says 风格 (ctx.word('s11_c6.2','风格')), show the three styles side by side (line art, render,
   plume clips) so 「产品不动，只换演出」 is visible at a glance; credit each.
6. s10_c5 honesty pivot: during line s10_c5.1 (「后四招，画面里还用了现成素材或别的模型」) show a lilac banner over/under the big footage:
   「后 4 招 · 画面里有现成素材或别的模型」, and tint pager dots 5–8 lilac from s10 through s13.
7. Credit chips must read on any footage (stronger background ~ .88 + 1 px light hairline); every excerpt visible = its credit visible.
8. Mirror or vary the layout on alternate cases (e.g. even cases card right / column left) so the carousel does not feel templated — but
   keep s06's geometry as in 1.
HARD CONSTRAINTS: s21_meta.js reads case.js at runtime and shows three real lines inside render() that START WITH `const a = spring(`,
`tf(s.card.el,` and `up(s.tag,` — keep three such lines (their content may change, keep each ≤ ~120 chars). Do not edit any other scene,
the engine, kit or shared libs. Deterministic, < 1500 DOM nodes per scene, no blur on large elements. Facts on screen must come from the
data/brief (no invented numbers). Photosensitive ranges stay excluded (they are already excluded from clip extraction).
REVIEW LOOP (mandatory, ≥ 3 passes, LOOK at the images with the Read tool):
  cd /home/box/orca/projects/opus55-video && node tools/still.mjs --scene s07_c2 --every 0.5 --scale 0.5 --sheet sheet --out render/stills/case-s07
  (do this for all 8 scenes; full-size frames at cue words with --at). Check footage size, legibility, sync with the voice words,
  the push hand-offs between consecutive cases (render the last 0.6 s of one case and first 0.8 s of the next), and nothing in the bands.
Finish with: node tools/still.mjs --range 56:150 --every 2 --scale 0.5 --sheet cases --out render/stills/case-final (view it).
Return a summary of what changed, the data fields you added, and any known issues.
```
