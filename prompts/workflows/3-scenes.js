export const meta = {
  name: 'opus55-video-scenes',
  description: 'Build every custom scene in parallel (author -> independent critic -> fixer), each verified on rendered frames',
  phases: [
    { title: 'Build', detail: 'one motion-design agent per scene writes src/scenes/<id>.js and iterates on rendered stills' },
    { title: 'Critique', detail: 'fresh-eyes reviewer per scene, against storyboard + amendments + design contract' },
    { title: 'Fix', detail: 'apply the critique, re-render, verify' },
  ],
}

const P = '/home/box/orca/projects/opus55-video'
const scenes = args

const CONTEXT = `
PROJECT ${P}: a Chinese explainer video「每一帧，都是代码」(Opus 5.5 炫酷视频的秘密 + 小白上手指南) rendered entirely by code. Each scene
is a JS file src/scenes/<id>.js whose render(state, t, ctx) sets every visual property from local time t; headless Chrome seeks and
captures each frame; FFmpeg encodes. Voice-over timings (edge-tts word timings) drive everything: ctx.cue(lineId) / ctx.cueEnd(lineId) /
ctx.word(lineId, '词', nth) give local seconds. Always look the words up in src/timeline.js; storyboard times are approximate.

READ BEFORE CODING:
1. ${P}/script/design.md — the visual contract (palette, type scale, safe areas: no text in y<112 or y>900 while subtitles/chrome show,
   motion rules, determinism, performance, scene API). Follow it exactly.
2. ${P}/script/storyboard.md — the "Global rules" section, the chapter notes that apply to you, YOUR scene section, and your neighbours'
   sections for continuity. The storyboard is the spec.
3. ${P}/script/amendments.md — the "Global" section and YOUR section OVERRIDE the storyboard where they differ.
4. ${P}/src/timeline.js — window.TIMELINE: your scene's start/dur/theme/transition and its lines with per-word timings.
5. ${P}/src/lib/engine.js, kit.js, kit2.js, shared.js — APIs and ready components: K.bg, K.tag, K.title, K.videoCard, K.codeBlock,
   K.drawPath, K.svgRoot, K.pop, K.terminal, K.chat, K.windowFrame, K.filmStrip, K.flow, K.checklist, K.counter, K.wall, K.marker,
   K.stepRail, K.sticker, K.chip, PAGE.draw, E.fill (for {{STATS}} placeholders), E.setImg/E.bgImg/ctx.clipUrl for footage frames.
6. ${P}/src/scenes/case.js — a finished reference scene (the case template used by s06–s13): match or beat its craft level.
7. ${P}/script/clips.json and ${P}/src/media/manifest.js — clip ids and frame counts. Every footage excerpt shows its author credit
   while visible. Wall thumbnails: ../assets/wall/<id>.jpg (list: ${P}/assets/wall/manifest.json).

RULES:
- Write ONLY ${P}/src/scenes/<your id>.js (plus scratch images under ${P}/render/stills/<your id>/). Do not edit the engine, kit, shared
  libs, other scenes, timeline, narration, clips or amendments. Helpers go inside your file (wrap in an IIFE or keep names unique).
- Deterministic: no Math.random/Date/performance.now/CSS animations/transitions/rAF. render() must be pure in t (any order, any t),
  including t beyond ctx.dur (the outgoing scene keeps rendering during the next scene's transition: hold the end state).
- Performance: no filter blur on elements larger than ~600 px, no backdrop-filter, < 1500 DOM nodes, prefer transform/opacity; canvas ok.
- Text: Chinese copy exactly as specified, never overflowing or colliding, sizes per design.md, legible on a phone.
- Facts: don't invent numbers or claims; keep 作者自述/据作者 labels where specified.

REVIEW LOOP (mandatory, at least 3 iterations), run from ${P}:
  node tools/still.mjs --scene <id> --every 0.5 --scale 0.5 --sheet sheet --out render/stills/<id>     (contact sheet, time-labelled)
  node tools/still.mjs --scene <id> --at <t1>,<t2>,end --out render/stills/<id>                          (full-size frames)
  Look at the images with the Read tool every time. The tool prints PAGE ERRORS: a 404 for a not-yet-built neighbour scene file is
  expected; anything else must be fixed. Check focal point and hierarchy, sync with spoken words, no empty/frozen stretch > 2 s,
  smoothness of fast moves (frames 0.1 s apart), reserved bands, the final frames and the transition tail, consistency with design.md.
`

const BUILD_SCHEMA = { type: 'object', properties: {
  file: { type: 'string' }, summary: { type: 'string' },
  cues: { type: 'array', items: { type: 'string' }, description: 'which words/lines drive which visual events' },
  sfx: { type: 'array', items: { type: 'string' } }, knownIssues: { type: 'array', items: { type: 'string' } },
  iterations: { type: 'number' },
}, required: ['file', 'summary', 'knownIssues', 'iterations'] }

const CRIT_SCHEMA = { type: 'object', properties: {
  issues: { type: 'array', items: { type: 'object', properties: {
    t: { type: 'string', description: 'local time(s) where visible' }, severity: { type: 'string', enum: ['blocker', 'major', 'minor', 'polish'] },
    problem: { type: 'string' }, fix: { type: 'string', description: 'concrete change (positions, sizes, timing, copy)' },
  }, required: ['t', 'severity', 'problem', 'fix'] } },
  verdict: { type: 'string', enum: ['ship', 'fix'] }, praise: { type: 'string' },
}, required: ['issues', 'verdict'] }

const results = await pipeline(
  scenes,
  (sc) => agent(`${CONTEXT}
YOUR SCENE: ${sc.id} — ${sc.title}. Previous scene: ${sc.prev || '(none: first frame of the film)'}; next scene: ${sc.next || '(none: last scene)'}.
Amendments for your scene (override the storyboard):
${sc.amend}
Build it to the storyboard + amendments, beautifully. Then run the review loop until you would put it in a showreel. Return the summary.`,
    { label: `build:${sc.id}`, phase: 'Build', schema: BUILD_SCHEMA }),
  (built, sc) => agent(`${CONTEXT}
YOU ARE AN INDEPENDENT CRITIC (senior motion designer + editor) for scene ${sc.id} — ${sc.title}. You did not build it.
Amendments for this scene: ${sc.amend}
The builder says: ${JSON.stringify(built || {})}
Render it yourself (contact sheet at 0.5 s + full-size frames at every voice cue, at fast moves, at the end and in the transition tail),
LOOK at the images, read the storyboard section, the amendments and design.md, and list every problem with a concrete fix. Be demanding:
storyboard intent, hierarchy, legibility on a phone, sync with the spoken words, safe areas, overlaps, awkward line breaks, empty or static
stretches, jank, inconsistency with the film's system, factual/credit errors. Do NOT edit files. verdict 'ship' only if nothing above minor.`,
    { label: `critique:${sc.id}`, phase: 'Critique', schema: CRIT_SCHEMA }),
  (crit, sc) => (crit && crit.verdict === 'ship' && !(crit.issues || []).some(i => ['blocker', 'major'].includes(i.severity)))
    ? { id: sc.id, shipped: true, crit }
    : agent(`${CONTEXT}
YOU ARE THE FIXER for scene ${sc.id} — ${sc.title}. Amendments: ${sc.amend}
Apply this critique to ${P}/src/scenes/${sc.id}.js (all blocker/major/minor items; polish where cheap), then re-run the review loop and
verify each fix on rendered frames:
${JSON.stringify(crit || { issues: [] })}
Return the structured summary (knownIssues = anything you could not fix).`, { label: `fix:${sc.id}`, phase: 'Fix', schema: BUILD_SCHEMA })
      .then(r => ({ id: sc.id, shipped: false, crit, fix: r })),
)
return results.map((r, i) => r || { id: scenes[i].id, failed: true })
