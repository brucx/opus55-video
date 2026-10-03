export const meta = {
  name: 'opus55-video-film-review',
  description: 'Whole-film review from five lenses, dedupe per scene, then fix each scene and verify',
  phases: [
    { title: 'Review', detail: 'continuity, typography, sync/pacing, facts/credits, first-time viewer' },
    { title: 'Fix', detail: 'one fixer per scene with issues' },
  ],
}

const P = '/home/box/orca/projects/opus55-video'
const A = args // { round, sheets: [paths], scenes: [{id, start, dur}], notes }

const CONTEXT = `
PROJECT ${P}: Chinese explainer「每一帧，都是代码」(4:13, 22 scenes, 1920×1080, 30 fps) rendered entirely by code: each scene is
src/scenes/<id>.js (case scenes s06–s13 share src/scenes/case.js, data in script/narration.json); headless Chrome captures frames.
Spec: script/storyboard.md + script/amendments.md (amendments override) + script/design.md (visual contract). Timings: src/timeline.js
(scene start/dur, lines with word timings). The current full render is ${P}/render/video.mp4 (no audio) and the final mix with audio is
${P}/out/opus55-video.mp4. Whole-film contact sheets (one frame per second, time-labelled, half size): ${A.sheets.join(', ')}.
Render any frame yourself: node tools/still.mjs --t <abs seconds,...> --out render/review/<you>   or  --scene <id> --at <local,...>
(run from ${P}; view images with the Read tool). Extract frames from the rendered mp4 with ffmpeg -ss <t> -i render/video.mp4 -frames:v 1.
Scenes and absolute start/dur: ${JSON.stringify(A.scenes)}
${A.notes || ''}
Report only real, visible problems with concrete fixes (positions, sizes, timing, copy). Severity: blocker (wrong fact, broken frame,
unreadable key text, crash, missing credit), major (clear craft flaw a viewer notices), minor, polish.
`

const ISSUE_SCHEMA = { type: 'object', properties: {
  issues: { type: 'array', items: { type: 'object', properties: {
    scene: { type: 'string' }, t: { type: 'string', description: 'absolute or local time, say which' },
    severity: { type: 'string', enum: ['blocker', 'major', 'minor', 'polish'] }, problem: { type: 'string' }, fix: { type: 'string' },
  }, required: ['scene', 't', 'severity', 'problem', 'fix'] } },
  summary: { type: 'string' },
}, required: ['issues', 'summary'] }

const LENSES = [
  { key: 'continuity', brief: 'Continuity and transitions: for EVERY scene boundary render frames at boundary −0.4, −0.1, +0.1, +0.3, +0.6 s (absolute) and check the transition type matches the storyboard grammar, shared objects (lime playhead/pill, rail, rack, title pill) line up across the cut, no flash of empty/placeholder frames, no element popping, chrome (chapter tag, logo, progress bar, subtitles) behaves, theme switches are clean.' },
  { key: 'typography', brief: 'Typography, layout and legibility: text sizes vs design.md, overlaps and collisions (including with the burned-in subtitle at y≈950–1030 and the top chrome), awkward CJK line breaks, orphans, contrast, alignment to the grid, consistency of styles across scenes (tags, chips, cards, code blocks), anything unreadable on a phone.' },
  { key: 'sync', brief: 'Sync and pacing: for every narration line, check that the visual it describes is on screen when the word is spoken (use the word timings in src/timeline.js and render frames at those times); find frozen stretches > 2 s, text that disappears before it can be read (chars÷4.5+1.5 s), visuals that run ahead of the voice, and dead air.' },
  { key: 'facts', brief: 'Facts, honesty and credits: every on-screen claim, number, command and label against research/brief.md (incl. §6), research/tools.md, research/lemo-opuscar.md and the article; every footage excerpt shows its author credit; 作者自述/据作者 labels; no code-rendered claim over generated footage; {{PLACEHOLDERS}} all filled; no leftover debug text or placeholder scenes.' },
  { key: 'viewer', brief: 'First-time 小白 viewer + editor: go through the sheets in order as if watching. Where would you get bored, confused or lost? Which moments are the most impressive, and which feel cheap or templated? Is the WHY clear, is the HOW actionable? Suggest the few highest-impact improvements per scene.' },
]

phase('Review')
const reviews = await parallel(LENSES.map(l => () => agent(`${CONTEXT}\nYOUR LENS: ${l.brief}`, { label: `review:${l.key}`, phase: 'Review', schema: ISSUE_SCHEMA })))
const all = reviews.filter(Boolean).flatMap((r, i) => (r.issues || []).map(x => ({ ...x, lens: LENSES[i].key })))
const keep = all.filter(x => x.severity !== 'polish' || A.round === 1)
const byScene = {}
keep.forEach(x => { const id = (x.scene.match(/s\d\d_\w+/) || ['global'])[0]; (byScene[id] = byScene[id] || []).push(x) })
log(`${all.length} issues (${keep.length} kept) across ${Object.keys(byScene).length} scenes`)

phase('Fix')
const CASE_IDS = ['s06_c1', 's07_c2', 's08_c3', 's09_c4', 's10_c5', 's11_c6', 's12_c7', 's13_c8']
const caseIssues = CASE_IDS.flatMap(id => byScene[id] || [])
const jobs = Object.entries(byScene).filter(([id]) => !CASE_IDS.includes(id) && id !== 'global')
const caseJob = caseIssues.length ? [() => agent(`${CONTEXT}
YOU ARE THE FIXER for the CASE TEMPLATE (scenes s06_c1 … s13_c8 all render through ${P}/src/scenes/case.js; their per-scene data is in
${P}/script/narration.json → "data"). You may edit ONLY src/scenes/case.js and the "data" fields of s06–s13 in narration.json (never
"lines"); after a data edit run \`.venv/bin/python tools/build_timeline.py\` (TTS is cached). Keep s06's entrance geometry unchanged
(s05_wall.js tracks it) and keep three lines inside render() starting with \`const a = spring(\`, \`tf(s.card.el,\` and \`up(s.tag,\`
(s21_meta.js shows them). Apply every blocker/major/minor issue below (polish where cheap), re-render the affected moments with
tools/still.mjs, LOOK at them, verify each fix. Report needs outside your files in "outside".
Issues: ${JSON.stringify(caseIssues)}`, { label: 'fix:case-template', phase: 'Fix', schema: { type: 'object', properties: {
      fixed: { type: 'array', items: { type: 'string' } }, notFixed: { type: 'array', items: { type: 'string' } }, outside: { type: 'array', items: { type: 'string' } },
    }, required: ['fixed', 'notFixed', 'outside'] } }).then(r => ({ id: 'case-template', ...(r || {}) }))] : []
const fixes = await parallel([
  ...caseJob,
  ...jobs.map(([id, issues]) => () => agent(`${CONTEXT}
YOU ARE THE FIXER for scene ${id}. Edit ONLY ${P}/src/scenes/${id}.js. Apply every blocker/major/minor issue below (polish where cheap),
re-render the affected moments with tools/still.mjs, LOOK at them, and verify each fix. If an issue needs a change outside your file
(engine, kit, narration, clips, another scene), do not make it — report it in "outside".
Issues: ${JSON.stringify(issues)}`, { label: `fix:${id}`, phase: 'Fix', schema: { type: 'object', properties: {
      fixed: { type: 'array', items: { type: 'string' } }, notFixed: { type: 'array', items: { type: 'string' } }, outside: { type: 'array', items: { type: 'string' } },
    }, required: ['fixed', 'notFixed', 'outside'] } }).then(r => ({ id, ...(r || {}) }))),
])
return { byScene, caseIssues, global: byScene.global || [], fixes }
