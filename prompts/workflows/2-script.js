export const meta = {
  name: 'opus55-video-script',
  description: 'Three script drafts from different angles, three-lens judging, synthesis, then fact and voice verification',
  phases: [
    { title: 'Draft', detail: 'hook-first, teacher-first, meta-demo-first drafts with storyboard + clips' },
    { title: 'Judge', detail: 'viewer, producer, fact-checker lenses score all drafts' },
    { title: 'Synthesize', detail: 'merge winner + grafts into final narration/storyboard/clips; measure with TTS' },
    { title: 'Verify', detail: 'fact-check and beginner/voice check of the final script' },
  ],
}

const P = '/home/box/orca/projects/opus55-video'

const CONTEXT = `
PROJECT: ${P} — a Chinese explainer video rendered entirely by code (HTML/SVG/Canvas scenes as functions of time, headless Chrome
captures each frame, FFmpeg encodes; voice = edge-tts zh-CN-YunxiNeural +6%; music/SFX synthesized in Python).
READ FIRST (in this order): ${P}/script/creative-brief.md (the ask, audience, promise, honesty rules), ${P}/research/brief.md
(facts, the 8 cases with best segments, cross-case craft patterns, beginner routes with verified commands, RISKY CLAIMS list in §6),
${P}/research/source-article.md (the WaytoAGI article the video is based on), ${P}/script/design.md (visual contract, safe areas,
scene API), ${P}/src/scenes/case.js (the shared CASE TEMPLATE every featured-case scene must use — read its header for data fields).
Look up details as needed in ${P}/research/cases/<caseId>.json (highlights with exact seconds, onScreen, subjectPosition),
${P}/research/lemo-opuscar.md, ${P}/research/tools.md, ${P}/research/library-stats.json, ${P}/assets/wall/manifest.json (60 thumbnails),
${P}/src/lib/kit.js and kit2.js (ready components: bg, tag, title (kinetic text), videoCard, codeBlock, drawPath, terminal, chat,
windowFrame, filmStrip, flow (node diagram with moving packets), checklist, counter, wall (thumbnail grid), marker (highlighter)).

FORMAT of narration.json (see the docstring in ${P}/tools/build_timeline.py):
{ "voice": "zh-CN-YunxiNeural", "rate": "+6%", "bpm": 120, "fps": 30,
  "chapters": [{"id":"c0","num":"00","label":"开场"}, ...],
  "scenes": [{ "id": "s01_hook", "chapter": "c0", "theme": "dark"|"light", "transition": {"type": "cut|wipe|wipe-up|push|zoom|iris|blur|fade", "dur": 0.6},
     "lead": 0.5, "tail": 0.6, "snap": "beat"|"bar"|"none", "subs": true, "chrome": true, "music": {"energy": 0-3},
     "template": "case", "file": "case", "data": {...}  (ONLY for case scenes),
     "lines": [{"id": "s01_hook.1", "text": "字幕兼朗读文本", "say": "(optional TTS-only text)", "gapAfter": 0.25, "at": (optional seconds from scene start)}] }] }
Line ids must be unique and prefixed with the scene id. A scene may have zero lines (music-only beat) — then set "minDur".
Transitions: no plain fades as the default (DIRECTOR rule "avoid default fades and hard cuts"); use wipe for chapter changes,
push for the case carousel, cut only on music beats in montages, iris/zoom for reveals. Music energy: 3 = hook/peak, 2 = cases,
1 = explanation/how-to, 0 = calm moments.
MEASURE real voice duration any time with: ${P}/.venv/bin/python ${P}/tools/build_timeline.py <path/to/your/narration.json> --dry
(this synthesizes with the real TTS — cached — and prints per-scene durations; it writes nothing else).

CLIPS: define every footage excerpt in a clips.json: { "<clipId>": {"src": "assets/cases/<file>.mp4", "start": s, "end": s,
"width": 1280|960|720, "fps": 30, "case": "<caseId>", "author": "@handle"} }. Use the research highlight ranges (exact seconds).
EXCLUDE photosensitive ranges: uc-2348 0–1.8 s and 15.79–16.33 s; gosail-054-pre1 entirely. Do not use gosail-054-pre1/pre2
(not in the library). gosail-072 2.0–3.3 s shows @Just_sharon7's Seedance work — avoid, or double-credit. Original audio is never used.

HARD CONSTRAINTS:
- Total 3:20–4:10 measured (hard max 4:20). 14–24 scenes. Hook in the first 3 seconds.
- Two jobs, both done well: WHY Opus 5.5 videos look so cool (mechanism + craft patterns, grounded in the 8 cases) and HOW a 小白
  can make one (environment, route choice with real commands shown on screen, workflow, feedback habits, prompt template, first 15–30 s piece).
- All 8 featured cases appear as case-template scenes (data: index/total/clips/aspect/author/work/tagline/secret/points/takeaway/caveat/cues).
  Case template text capacity: work ≤ 10 chars; secret ≤ 11 chars (one line); points: max 2, each ≤ 21 chars; takeaway ≤ 36 chars
  (2 lines of 18); caveat ≤ 24 chars. Keep each case scene ~8–12 s of voice.
- Honesty: Opus 5.5 outputs text (code, storyboards, tool calls); there is NO official video feature. When the voice says frames are
  "drawn by code", the footage on screen at that moment must be code-rendered work (lists-006, gosail-060, uc-0962, uc-1377, gosail-054),
  NOT uc-2348 (generated dancer/song + AE), gosail-133 (Seedance/GPT Image/MiniMax), or gosail-072's third-party clips.
  Author self-reports are labelled 作者自述. No "one prompt → finished film". No region-bypass advice. Data "截至 10 月 1 日 WaytoAGI 收录".
- TTS-friendly Chinese: short sentences, no symbols (→ / = × @ URLs), digits ok, product names ok (Opus 5.5, Claude Code, HyperFrames,
  Remotion, FFmpeg, Blender, After Effects, Lemo-Opuscar). Don't read code or commands aloud — show them, summarize in voice.
- Our own pipeline facts you may state (true): Claude Opus 5.5 in Claude Code wrote this video's scene code, timeline and Python music;
  headless Chrome rendered every frame; FFmpeg encoded; the voice is edge-tts (Microsoft neural TTS); captions are timed to the voice's
  word timings. Final counts (frames, code lines, render minutes) go on screen as placeholders {{FRAMES}} {{CODE_LINES}} {{RENDER_MIN}} {{SCENES}} only.
`

const STORYBOARD_SPEC = `
STORYBOARD (markdown) — one section per scene, in order:
## <scene id> — <purpose in one line>   (≈ N s · theme · transition · energy)
- Voice: the lines verbatim (or "music only")
- On screen: every text exactly as it should appear, with hierarchy (hero/H1/H2/body/tag) — respect line-length rules in design.md
- Visual: layout (positions in the 1920×1080 frame, safe areas!), elements, motion; name kit components when they fit
- Sync: which spoken word triggers which visual change (e.g. word "900" in line s05.2 → counter lands)
- Footage: clip ids + how used (card / full-bleed / grid / split) + credit text
- SFX: what sounds where (whoosh swish pop blip tick type ding sparkle impact boom glitch riser rise_short shutter)
- Continuity: what carries from the previous scene and into the next (shared shapes/colors make the film feel like one piece)
Be concrete enough that a motion designer can build each scene without asking questions, and make every scene visually distinct
yet on-system. Think like a director: one subject, one goal, one turn; signature shot; the film's own "every frame is code" reveal.
`

const ANGLES = [
  { key: 'A', name: '钩子与节奏 (hook & rhythm first)', brief: 'Maximize retention and the "wow": a beat-synced cold open from the most striking code-rendered shots, strong contrasts and reveals, a fast case carousel that feels like a countdown of 8 tricks, a how-to compressed into memorable, visual steps, and a punchy meta reveal at the end. Every scene must earn its seconds.' },
  { key: 'B', name: '老师讲明白 (teacher clarity first)', brief: 'Maximize understanding and confidence for absolute beginners: concrete analogies (e.g. a flip book / 手翻书 for render(t), a film crew where Opus is director + programmer + editor), progressive disclosure, before/after examples (vague style words vs checkable rules; vague feedback vs "时间点＋问题＋期望"), and a crystal-clear first-project plan. Still cool and visual, never a lecture with bullet slides.' },
  { key: 'C', name: '本片即示范 (the film demonstrates itself)', brief: 'Use THIS video as the running demonstration: show its own timeline, the render(t) code of the scene you are watching, the word-timed captions, the Python music grid, the frame counter, so each principle is proven on screen while it is explained; the 8 cases show what others built with the same method; the how-to mirrors exactly how this film was made. Honest about what was TTS/synthesized.' },
]

const JUDGE_LENSES = [
  { key: 'viewer', brief: 'You are a 小白 WaytoAGI viewer (no coding/animation background) AND a retention analyst. Score: would I keep watching past 5 s / 30 s / 2 min? Do I understand WHY these videos look cool? Do I know EXACTLY what to do tonight to make my first 15–30 s video? Is anything confusing, too fast, or jargon-heavy?' },
  { key: 'producer', brief: 'You are a senior motion-design producer. Score: hook strength, pacing and scene variety, visual feasibility as code-rendered scenes with the assets we actually have, signature shots, continuity between scenes, sync points, total length vs 3:20–4:10, whether case scenes fit the case template capacity, whether the cold open uses the strongest legal clips.' },
  { key: 'factcheck', brief: 'You are a strict fact-checker. Compare every spoken line and on-screen text with research/brief.md (incl. §6 risky claims), research/source-article.md, research/tools.md, research/lemo-opuscar.md and research/cases/*.json. Flag overclaims ("Opus 生成视频", "一句话出片", unlabelled self-reports), wrong commands, wrong attributions (who made which footage), code-drawn claims over non-code footage, photosensitive or third-party clip misuse, licence errors, and anything unverifiable.' },
]

const DRAFT_SCHEMA = { type: 'object', properties: {
  narration: { type: 'string', description: 'path of the draft narration.json' },
  storyboard: { type: 'string' }, clips: { type: 'string' },
  measuredSeconds: { type: 'number' }, scenes: { type: 'number' }, title: { type: 'string' },
  pitch: { type: 'string', description: '5-8 sentences: the idea, structure, signature shots' },
}, required: ['narration', 'storyboard', 'clips', 'measuredSeconds', 'scenes', 'title', 'pitch'] }

const JUDGE_SCHEMA = { type: 'object', properties: {
  scores: { type: 'array', items: { type: 'object', properties: {
    draft: { type: 'string' }, hook: { type: 'number' }, clarity: { type: 'number' }, accuracy: { type: 'number' },
    coolness: { type: 'number' }, pacing: { type: 'number' }, actionability: { type: 'number' }, total: { type: 'number' },
    strengths: { type: 'array', items: { type: 'string' } }, problems: { type: 'array', items: { type: 'string' } },
  }, required: ['draft', 'hook', 'clarity', 'accuracy', 'coolness', 'pacing', 'actionability', 'total', 'strengths', 'problems'] } },
  winner: { type: 'string' },
  graft: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, what: { type: 'string' }, why: { type: 'string' } }, required: ['from', 'what', 'why'] } },
  mustFix: { type: 'array', items: { type: 'string' } },
}, required: ['scores', 'winner', 'graft', 'mustFix'] }

phase('Draft')
const drafts = await parallel(ANGLES.map(a => () => agent(`${CONTEXT}
YOUR ANGLE: Draft ${a.key} — ${a.name}. ${a.brief}
Write a complete, independent script + storyboard + clip list for the whole video from this angle (do not look at other drafts):
- ${P}/script/drafts/${a.key}/narration.json
- ${P}/script/drafts/${a.key}/storyboard.md
- ${P}/script/drafts/${a.key}/clips.json
${STORYBOARD_SPEC}
Measure with the --dry command and iterate until the total is inside 3:20–4:10. Validate the JSON (python -m json.tool).
Return the structured summary.`, { label: `draft:${a.key}`, phase: 'Draft', schema: DRAFT_SCHEMA })))
const okDrafts = drafts.map((d, i) => d ? { ...d, key: ANGLES[i].key } : null).filter(Boolean)
log(`drafts: ${okDrafts.map(d => `${d.key} ${Math.round(d.measuredSeconds)}s/${d.scenes} scenes "${d.title}"`).join(' | ')}`)

phase('Judge')
const draftList = okDrafts.map(d => `Draft ${d.key} (${Math.round(d.measuredSeconds)} s, ${d.scenes} scenes, title "${d.title}"): ${d.pitch}\n  files: ${d.narration}, ${d.storyboard}, ${d.clips}`).join('\n')
const judgments = await parallel(JUDGE_LENSES.map(j => () => agent(`${CONTEXT}
YOU ARE A JUDGE. Lens: ${j.brief}
Read ALL drafts completely (narration.json + storyboard.md + clips.json each), then score each 1–10 on hook, clarity, accuracy, coolness,
pacing, actionability (total = sum). Name a winner as the best BASE, list concrete elements from the other drafts worth grafting
(scene ideas, lines, shots, analogies), and list must-fix problems for the final version (be specific: scene id + what + fix).
${draftList}`, { label: `judge:${j.key}`, phase: 'Judge', schema: JUDGE_SCHEMA })))
const okJ = judgments.map((r, i) => r ? { ...r, lens: JUDGE_LENSES[i].key } : null).filter(Boolean)
const tally = {}
okJ.forEach(r => r.scores.forEach(s => { tally[s.draft] = (tally[s.draft] || 0) + s.total }))
log(`tally: ${JSON.stringify(tally)}; winners: ${okJ.map(r => `${r.lens}:${r.winner}`).join(', ')}`)

phase('Synthesize')
const judgeText = okJ.map(r => `--- ${r.lens} judge (winner ${r.winner}) ---\nSCORES: ${JSON.stringify(r.scores.map(s => ({ d: s.draft, total: s.total, strengths: s.strengths, problems: s.problems })))}\nGRAFT: ${JSON.stringify(r.graft)}\nMUST FIX: ${JSON.stringify(r.mustFix)}`).join('\n\n')
const synth = await agent(`${CONTEXT}
YOU ARE THE HEAD WRITER/DIRECTOR. Produce the FINAL script from the drafts and the judges' verdicts.
Drafts:
${draftList}
Score tally (higher is better): ${JSON.stringify(tally)}
Judges:
${judgeText}

Steps:
1. Choose the base (usually the highest tally) and graft the best elements from the others; fix EVERY must-fix item.
2. Write ${P}/script/narration.json, ${P}/script/storyboard.md (format below) and ${P}/script/clips.json (merge the needed clip
   definitions; clip ids unique; check each range against the research JSON and the exclusions). Replace the test content that is
   currently in those files (it is a throwaway test). Delete nothing else.
${STORYBOARD_SPEC}
3. Measure with --dry and iterate to 3:20–4:10. Then run the REAL build: ${P}/.venv/bin/python ${P}/tools/build_timeline.py
   (writes src/timeline.js, audio/narration.wav, out/subtitles.srt) and ${P}/.venv/bin/python ${P}/tools/extract_clips.py.
   Check out/subtitles.srt reads naturally (no orphan characters, no split numbers/units, ≤ 18 chars per chunk).
4. Also write ${P}/script/decisions.md: base chosen and why, what was grafted from where, how each must-fix was resolved, any
   remaining risks.
Return: final duration, scene list (id · seconds · one-line purpose), and the path list.`, { label: 'synthesize', phase: 'Synthesize' })

phase('Verify')
const VERIFY_SCHEMA = { type: 'object', properties: {
  issues: { type: 'array', items: { type: 'object', properties: {
    where: { type: 'string', description: 'scene id / line id / storyboard text' }, severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
    problem: { type: 'string' }, fix: { type: 'string', description: 'exact replacement text or action' },
  }, required: ['where', 'severity', 'problem', 'fix'] } },
  verdict: { type: 'string' },
}, required: ['issues', 'verdict'] }
const verify = await parallel([
  () => agent(`${CONTEXT}
VERIFY (facts): Check the FINAL ${P}/script/narration.json (every line and every case data field), ${P}/script/storyboard.md (every on-screen
text, command, number, attribution) and ${P}/script/clips.json (ranges, exclusions, author credits) against the sources. Run commands
you are unsure about only in a throwaway dir if needed (don't install globally). Report every issue with an exact fix. Synthesizer notes:
${synth || '(none)'}`, { label: 'verify:facts', phase: 'Verify', schema: VERIFY_SCHEMA }),
  () => agent(`${CONTEXT}
VERIFY (beginner clarity + voice): (1) Read the FINAL ${P}/script/narration.json and storyboard.md as a 小白: flag jargon, leaps, anything
too fast to follow (on-screen text must stay ≥ chars÷4.5+1.5 s), and whether the how-to is actionable tonight. (2) Run
${P}/.venv/bin/python ${P}/tools/asr_check.py ${P}/audio/narration.wav and report lines with similarity < 0.9 or odd readings (product names,
numbers). (3) Read ${P}/out/subtitles.srt for bad splits. Report each issue with an exact rewrite.`, { label: 'verify:clarity+voice', phase: 'Verify', schema: VERIFY_SCHEMA }),
])
return { drafts: okDrafts, tally, judges: okJ.map(r => ({ lens: r.lens, winner: r.winner, mustFix: r.mustFix })), synth, verify }
