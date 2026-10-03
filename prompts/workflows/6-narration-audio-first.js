export const meta = {
  name: 'opus55-narration-audio-first',
  description: 'Make the narration understandable by ear alone and smooth the 照搬 transitions: blind audits, two rewrites, two judges, synthesis',
  phases: [
    { title: 'Audit', detail: 'blind listener + flow editor read the voice-only script' },
    { title: 'Draft', detail: 'minimal-change rewrite and fluent rewrite, both measured with real TTS' },
    { title: 'Judge', detail: 'by-ear judge and sync/feasibility judge' },
    { title: 'Synthesize', detail: 'final proposal + required scene cue updates + changelog' },
  ],
}

const P = '/home/box/orca/projects/opus55-video'
const OUT = `${P}/script/narration-v3`
const VOICE = args.voice

const RULES = `
CONTEXT: a 4:20 Chinese explainer video「这些视频全是代码写的？！」for WaytoAGI (小白 audience): why Opus 5.5 videos look so cool (principle +
8 cases, one "招" each) and how a beginner can make one (6 steps), ending with a reveal that this film itself was made the same way.
The narration is spoken by TTS (zh-CN-YunxiNeural, +6 %) and also shown as burned-in subtitles.
THE USER'S REQUEST (verbatim): 「旁白声音要求没有看画面也能连贯听明白，检查一下。几个"照搬"上下衔接有点突兀，有没有办法优化」
→ (1) a listener who never looks at the screen must follow the whole story: no line may depend on the picture ("左边…", "挂在手上",
an unnamed "这些视频"/"一个形体"); each case must say WHAT the work is (one short identifying phrase) before its trick; (2) the eight
「照搬：…」 lines currently read like a label spoken aloud and jump straight into the next case — make each lesson flow naturally from its
trick (varied, conversational connectives, no colon-label), and give the case-to-case and chapter transitions small bridges.
CONSTRAINTS: keep every scene and line ID (you may change a line's text, add a "say" for pronunciation, or split nothing/merge nothing);
keep facts exactly as the sources say (research/brief.md §3 case table and §6 risky claims; author self-reports stay 据作者/作者自述;
the honesty bridge before case 5 must stay; numbers stay as they are); keep it tight — total runtime may grow by at most ~12 s over the
current 4:21 (measure!); TTS-friendly Chinese (short clauses, no symbols, no @handles/URLs, product names ok); keep the subtitle-friendly
punctuation (，。？！：、). The on-screen case template still shows a small 「照搬」 tag + a takeaway box — the box text must say the same
idea as the spoken lesson in ≤ 36 chars (2 lines of 18).
VISUAL SYNC: scenes trigger animations on specific spoken words via ctx.word(lineId, word). A starting map is in
/tmp/claude-1000/-home-box-orca-projects-opus55/5ce66f83-c1b1-47c5-90bd-562b76f3648a/scratchpad/cue-deps.json (incomplete — grep
${P}/src/scenes/<scene>.js for "word(" to be exact; case scenes s06–s13 take cues from narration.json data.cues). Prefer keeping the cue
words in the new text; when a cue word must go, name the replacement word that should trigger the same visual.
MEASURE: write a full copy of the narration to your own file and run
  ${P}/.venv/bin/python ${P}/tools/build_timeline.py <your file> --dry
(real TTS, cached; prints per-scene durations; writes nothing else). Never edit ${P}/script/narration.json, scene files or timeline files.
`

const VOICE_BLOCK = `THE CURRENT NARRATION (voice-only, in order; this is all a listener hears):\n${VOICE}`

phase('Audit')
const AUDIT_SCHEMA = { type: 'object', properties: {
  issues: { type: 'array', items: { type: 'object', properties: {
    line: { type: 'string' }, kind: { type: 'string', enum: ['needs-picture', 'missing-context', 'abrupt-transition', 'unclear-wording', 'jargon', 'repetitive'] },
    problem: { type: 'string' }, suggestion: { type: 'string' } }, required: ['line', 'kind', 'problem', 'suggestion'] } },
  overall: { type: 'string' },
}, required: ['issues', 'overall'] }
const audits = await parallel([
  () => agent(`${RULES}\nYOU ARE A BLIND LISTENER. You cannot see the screen and must not read the storyboard. Read ONLY the narration below
(you may read research/brief.md to know what the cases are, to judge whether the voice names them). Go line by line: where would you get
lost, where does a line point at something you cannot see, where is context missing, where is a word unclear by ear (homophones,
abbreviations)? Then judge the whole: can you retell the WHY and the HOW after listening once?\n\n${VOICE_BLOCK}`, { label: 'audit:blind', phase: 'Audit', schema: AUDIT_SCHEMA }),
  () => agent(`${RULES}\nYOU ARE A RADIO/PODCAST EDITOR focused on FLOW. Read the narration below (voice only). Mark every abrupt join:
between lines, between scenes (especially the eight cases: 第N招 … 照搬：… → 第N+1招), and at the four chapter changes (原理 → 为什么炫 →
小白上手 → 幕后). Propose natural connective phrasing, with variety so the eight lessons do not sound templated, and keep each addition
short (TTS speaks ≈5 chars/s).\n\n${VOICE_BLOCK}`, { label: 'audit:flow', phase: 'Audit', schema: AUDIT_SCHEMA }),
])
const auditText = audits.filter(Boolean).map((a, i) => `--- ${['blind listener', 'flow editor'][i]} ---\n${a.overall}\n${JSON.stringify(a.issues)}`).join('\n\n')

phase('Draft')
const DRAFT_SCHEMA = { type: 'object', properties: {
  file: { type: 'string', description: 'path of the full narration copy you wrote' },
  seconds: { type: 'number' }, changedLines: { type: 'number' },
  voiceOnly: { type: 'string', description: 'the new narration as "[id] text" lines, in order' },
  takeaways: { type: 'string', description: 'per case scene: new takeaway box text (≤36 chars)' },
  cueImpact: { type: 'string', description: 'every cue word that no longer appears, with the replacement word' },
  rationale: { type: 'string' },
}, required: ['file', 'seconds', 'changedLines', 'voiceOnly', 'takeaways', 'cueImpact', 'rationale'] }
const drafts = await parallel([
  () => agent(`${RULES}\nAUDITS:\n${auditText}\n\nWRITE DRAFT A — MINIMAL CHANGE: fix every audit issue with the smallest possible edits, keep cue words wherever you can,
keep durations close to the current ones. Copy ${P}/script/narration.json to ${OUT}/A.json and edit only "text"/"say" of lines and the
"takeaway" (and cue words in "cues" if needed) of case scenes in that copy. Measure with --dry. Return the summary.\n\n${VOICE_BLOCK}`, { label: 'draft:A-minimal', phase: 'Draft', schema: DRAFT_SCHEMA }),
  () => agent(`${RULES}\nAUDITS:\n${auditText}\n\nWRITE DRAFT B — BEST LISTENING FLOW: rewrite as a great narrator would say it, so that it sounds like one continuous,
warm explanation rather than a list; still keep every line ID, the facts, the 8 cases and 6 steps, and the length budget. Copy
${P}/script/narration.json to ${OUT}/B.json and edit only "text"/"say" of lines and "takeaway"/"cues" of case scenes in that copy.
Measure with --dry. Return the summary.\n\n${VOICE_BLOCK}`, { label: 'draft:B-fluent', phase: 'Draft', schema: DRAFT_SCHEMA }),
])
const ok = drafts.filter(Boolean)
const draftText = ok.map((d, i) => `--- DRAFT ${['A (minimal)', 'B (fluent)'][i]} — ${d.seconds} s, ${d.changedLines} lines changed, file ${d.file}\n${d.voiceOnly}\nTAKEAWAYS: ${d.takeaways}\nCUE IMPACT: ${d.cueImpact}\nRATIONALE: ${d.rationale}`).join('\n\n')

phase('Judge')
const JUDGE_SCHEMA = { type: 'object', properties: {
  verdict: { type: 'string' }, preferBase: { type: 'string', enum: ['A', 'B'] },
  perLine: { type: 'array', items: { type: 'object', properties: { line: { type: 'string' }, pick: { type: 'string', description: 'A, B, or a better rewrite' }, why: { type: 'string' } }, required: ['line', 'pick', 'why'] } },
  problems: { type: 'array', items: { type: 'string' } },
}, required: ['verdict', 'preferBase', 'perLine', 'problems'] }
const judges = await parallel([
  () => agent(`${RULES}\nYOU ARE THE BY-EAR JUDGE (you cannot see the screen). Read both drafts as pure audio scripts, aloud in your head at speaking pace.
Which one could a 小白 follow and retell after one listen? Which lessons flow naturally out of their trick? Pick per line (or write a
better line), list remaining problems (facts must stay faithful to research/brief.md).\n\n${draftText}`, { label: 'judge:ear', phase: 'Judge', schema: JUDGE_SCHEMA }),
  () => agent(`${RULES}\nYOU ARE THE SYNC & FEASIBILITY JUDGE. For both drafts, check against the actual scene code (grep ${P}/src/scenes/*.js for
ctx.word/word( uses and the case data cues in the drafts) which visual triggers would lose their word, whether the replacement words are
spoken at a sensible moment, the duration change per scene (run --dry on ${OUT}/A.json and ${OUT}/B.json yourself), takeaway box length,
subtitle readability (≤18 chars per chunk after splitting), and TTS risks (odd readings). Pick per line where it matters.\n\n${draftText}`, { label: 'judge:sync', phase: 'Judge', schema: JUDGE_SCHEMA }),
])
const judgeText = judges.filter(Boolean).map((j, i) => `--- ${['BY-EAR', 'SYNC'][i]} JUDGE (base ${j.preferBase}) ---\n${j.verdict}\nPER LINE: ${JSON.stringify(j.perLine)}\nPROBLEMS: ${JSON.stringify(j.problems)}`).join('\n\n')

phase('Synthesize')
const final = await agent(`${RULES}\nYOU ARE THE HEAD WRITER. Produce the final narration from the drafts and judges.
${draftText}\n\n${judgeText}\n\nWrite:
1. ${OUT}/final.json — a full narration file (copy of ${P}/script/narration.json with the final "text"/"say" of lines and the final case
   "takeaway"/"cues"). Measure with --dry and keep total growth ≤ ~12 s.
2. ${OUT}/cue-updates.json — [{scene, file, line, oldWord, newWord, where}] for every scene-code ctx.word(...) whose word no longer appears
   in its line (grep the scene files to be exact; include line numbers), so the director can update the code.
3. ${OUT}/CHANGES.md — before → after for every changed line with a one-line reason, the voice-only final script in order, and the
   measured duration per scene (old vs new).
Return: total old/new duration, number of changed lines, and the voice-only final script.`, { label: 'synthesize', phase: 'Synthesize' })
return { audits: audits.map(a => a && a.overall), drafts: ok.map(d => ({ file: d.file, seconds: d.seconds, changed: d.changedLines })), judges: judges.map(j => j && { base: j.preferBase, verdict: j.verdict }), final }
