export const meta = {
  name: 'opus55-video-research',
  description: 'Research the 8 cases, linked guides and tools for an Opus 5.5 video explainer',
  phases: [
    { title: 'Cases', detail: 'download HQ case videos, view frames, pick highlight segments' },
    { title: 'Context', detail: 'Lemo-Opuscar guides, tools landscape, library stats + poster wall' },
    { title: 'Brief', detail: 'synthesize a production brief for scriptwriters' },
  ],
}

const P = '/home/box/orca/projects/opus55-video'
const REPO = '/home/box/orca/projects/opus55'

const COMMON = `
CONTEXT: We are producing a Chinese-language explainer VIDEO (16:9, 1920x1080) for WaytoAGI (a Chinese AI community) titled roughly
"Opus 5.5 为什么能做出这么炫酷的视频 + 小白如何自己做出来". It is based on the Feishu article saved at ${P}/research/source-article.md
(READ IT FIRST - it is the primary reference; it covers 8 curated cases, the render(t) principle, three production routes,
a 6-stage workflow, 6 production lessons and a prompt template). The video itself will be made with code (HTML/Canvas/SVG rendered
frame-by-frame by headless Chrome, encoded by FFmpeg), so it is itself a demonstration of the method.

RULES:
- Write ONLY inside ${P}. Never modify anything in ${REPO} (read-only source of case data and saved post snapshots).
- Be factually careful: distinguish author-reported claims from verified facts, as the article does.
- Helpers: \`python3 ${P}/tools/xpost.py <tweet_id> [--download DIR]\` reads a public X post via the syndication endpoint
  (text may be truncated for long posts; media variants incl. best mp4 are listed; --download saves the highest-bitrate mp4 as DIR/<tweet_id>.mp4).
  \`bash ${P}/tools/contact.sh <video> <out.jpg> [every_s=2] [start=0] [end=dur] [cols=6] [thumb_w=320]\` makes a timestamped contact sheet.
  View images with the Read tool (it displays images). Put scratch images under ${P}/research/cases/sheets/.
- Full post texts (untruncated) for many posts are saved in ${REPO}/data/_refresh/gosail-2026-09-28-full/posts/<tweet_id>.json
  (fxtwitter format: .tweet.text / .tweet.raw_text) and in ${REPO}/data/_refresh/tweets.json / tweet-candidates.json. grep -rl <tweet_id> ${REPO}/data/_refresh to find them.
- api.fxtwitter.com is blocked by a Cloudflare challenge; use the helper instead. x.com pages are not readable directly.
- The prior session's low-res copies and a frame-level visual review live in ${REPO}/draft_f87d65c6_folder/visual-review/ (read-only; visual-review-report.json has observations).
`

const CASE_SCHEMA = {
  type: 'object',
  properties: {
    cases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          caseId: { type: 'string' },
          author: { type: 'string' },
          postUrl: { type: 'string' },
          videoFile: { type: 'string', description: 'absolute path of the downloaded HQ mp4' },
          width: { type: 'number' }, height: { type: 'number' }, fps: { type: 'number' },
          duration: { type: 'number' }, hasAudio: { type: 'boolean' },
          postTextZh: { type: 'string', description: 'faithful Chinese rendering of the main post text' },
          promptSummaryZh: { type: 'string', description: 'what the public prompt/instructions ask for, key techniques, in Chinese; empty if no prompt' },
          promptFile: { type: 'string', description: 'path where the full prompt text was saved, or empty' },
          highlights: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                start: { type: 'number' }, end: { type: 'number' },
                onScreen: { type: 'string' }, motion: { type: 'string' },
                colors: { type: 'string' }, subjectPosition: { type: 'string' },
                textOnScreen: { type: 'string' },
                bestUse: { type: 'string', description: 'hook montage / case card / background / meta-quote etc.' },
                score: { type: 'number', description: '1-10 visual impact' },
              },
              required: ['start', 'end', 'onScreen', 'motion', 'bestUse', 'score'],
            },
          },
          heroStill: { type: 'object', properties: { t: { type: 'number' }, description: { type: 'string' } }, required: ['t', 'description'] },
          whyCoolZh: { type: 'string', description: 'concrete visual/craft reasons it looks impressive' },
          takeawayZh: { type: 'string', description: 'what a beginner can copy' },
          evidenceLimitsZh: { type: 'string' },
          notes: { type: 'string' },
        },
        required: ['caseId', 'author', 'postUrl', 'videoFile', 'duration', 'highlights', 'heroStill', 'whyCoolZh', 'takeawayZh', 'evidenceLimitsZh'],
      },
    },
  },
  required: ['cases'],
}

const CASE_GROUPS = [
  [
    { id: 'lists-006', author: '@twoclipping', post: '2103273003555402193', prompt: '2103273003555402193 (the prompt is in the main post itself)', extra: 'Note: the video literally contains a command palette with "Every frame is code" - record its exact timestamps.' },
    { id: 'gosail-060', author: '@morpheusdv', post: '2102910531560731063', prompt: '2102910588565225905', extra: '"The First Spark" procedural hand-drawn short; 1080p variant exists.' },
  ],
  [
    { id: 'uc-0962', author: '@kimmonismus', post: '2102844654169575547', prompt: '2102847451111772219', extra: '3-minute AI history film, Remotion + SVG/Canvas + open-source TTS + Python music.' },
    { id: 'uc-1377', author: '@WinterArc2125', post: '2103116235009347650', prompt: '2103116689944502720', extra: '~5-minute Austerlitz battle film; author self-reports 90 min build, 4h render, $40 cloud agent cost.' },
  ],
  [
    { id: 'gosail-072', author: '@aiwarts', post: '2103419586964316483', prompt: '2103419813263815008 (the prompt may span several replies 1/3..3/3 - find all parts in the snapshots)', extra: 'GoodCase promo, 16:9 + 9:16; 1080p variant exists.' },
    { id: 'gosail-054', author: '@yoshifujidesign', post: '2103988134069617127', prompt: 'none public; follow-up post 2103989912676741479 (also download its video if it has one, as <caseId>-b.mp4)', extra: 'Product PV variants using existing 3D data; the video is VERTICAL 1080x1920.' },
  ],
  [
    { id: 'uc-2348', author: '@aicreataro', post: '2103757144789221819', prompt: 'none separate; the post explains the workflow', extra: 'Dance skeleton (MiniMax H3 footage) drives After Effects text/light; Suno music.' },
    { id: 'gosail-133', author: '@KanaWorks_AI', post: '2103836147277345052', prompt: 'none separate; post explains model division of labor', extra: 'Multi-model: Opus 5.5 code orchestration, Seedance 2.5 motion, GPT Image 2.5 stills, MiniMax H3 background motion.' },
  ],
]

function casePrompt(group) {
  const list = group.map(c => `- ${c.id} by ${c.author}: post id ${c.post}; prompt: ${c.prompt}. ${c.extra}`).join('\n')
  return `${COMMON}
YOUR TASK: deep visual + text research for these cases:
${list}

For EACH case:
1. Download the highest-quality mp4: \`python3 ${P}/tools/xpost.py <post_id> --download ${P}/assets/cases/\` then rename the file to ${P}/assets/cases/<caseId>.mp4.
   ffprobe it (width/height/fps/duration/audio). If the download fails, fall back to the best variant URL listed, or to the copy in the prior visual-review folder (note it).
2. Read the FULL post text and the full public prompt text (local snapshots first, helper second). Save the full prompt verbatim to
   ${P}/research/cases/<caseId>-prompt.txt (or note that none is public). Summarize what it asks for in Chinese.
3. VISUALLY review the video: make a coarse contact sheet over the whole duration (every 1-2 s for <=60 s videos, every 4-6 s for long ones),
   view it, then make dense sheets (every 0.25-0.5 s) around the most striking moments and view those too. Actually look at the images.
4. Choose 3-5 highlight segments (each 2-8 s, no hard cuts inside unless noted) ranked by visual impact, suitable for reuse as short,
   credited excerpts in our explainer (hook montage, case card, or background). For each give exact start/end seconds, what is on screen,
   the motion, palette, subject position (important for cropping to 16:9 / square cards), any on-screen text, best use, and a 1-10 impact score.
   Prefer moments that show the craft the article praises (continuous morph, hand-drawn growth, dot-globe + motif, terrain + arrows,
   product path, skeleton-driven type, multi-model shots). Avoid moments with dense unreadable text unless that is the point.
5. Pick one hero still timestamp (poster frame) per case.
6. Write: whyCoolZh (concrete craft reasons it looks impressive, grounded in what you saw), takeawayZh (what a beginner can copy, 1-2 sentences),
   evidenceLimitsZh (which claims are author-reported / unverified, consistent with the article).
7. Save each case's result JSON to ${P}/research/cases/<caseId>.json (same fields as your structured output).
Return the structured output for both cases.`
}

phase('Cases')
const casesP = parallel(CASE_GROUPS.map((g, i) => () =>
  agent(casePrompt(g), { label: `cases:${g.map(c => c.id).join('+')}`, phase: 'Cases', schema: CASE_SCHEMA })))

phase('Context')
const lemoP = agent(`${COMMON}
YOUR TASK: research the Lemo-Opuscar project the article recommends: https://github.com/lemomo-ai/lemo-opuscar
(README, DIRECTOR.md, TECHNIQUE.md, any SKILL.md / .claude / install docs, examples, license). Use gh CLI (\`gh api repos/lemomo-ai/lemo-opuscar/contents\`,
\`gh api ... --jq .content | base64 -d\`) or raw.githubusercontent.com via curl; WebFetch also works (load it via ToolSearch "select:WebFetch,WebSearch").
Produce ${P}/research/lemo-opuscar.md (Chinese, <= 1500 字) covering:
- What it is (a skill / prompt pack / method library?), who made it, license, how a beginner actually uses it with Claude Code or another agent (exact install/usage commands if any - verify they exist in the repo).
- DIRECTOR.md: the core directing principles (story, shots, sound) - list the most quotable, concrete rules.
- TECHNIQUE.md: deterministic drawing, shared timeline, rendering and checking - the concrete implementation recipe.
- 5-8 rules that would make a beginner's video look dramatically better (with short source quotes, English original + Chinese).
- Anything that contradicts or nuances the article.
Also briefly check the WaytoAGI gallery link https://github.com/waytoagi-team/gallery/tree/main/cases/models/claude-opus-5-5-usecases (what's there) and the public page https://www.waytoagi.com/usecase-atlas/opus5-5/ (does it load; title).
Return a concise summary (<= 400 words) of the key findings and the file path.`, { label: 'context:lemo-opuscar', phase: 'Context' })

const toolsP = agent(`${COMMON}
YOUR TASK: verify the tools landscape a beginner (小白) needs, as of 2026-10-01, using official docs (load WebFetch/WebSearch via ToolSearch "select:WebFetch,WebSearch").
Cover, with exact URLs and quotes:
1. Anthropic models overview https://platform.claude.com/docs/en/models/overview : what it says about Claude Opus 5.5 (input/output modalities, context window, availability). Confirm "output is text" as the article claims.
2. Remotion: https://www.remotion.dev/docs/the-fundamentals (frame-driven React model: useCurrentFrame, composition fps/duration), how a beginner starts (npx create-video@latest), whether there are official agent skills / Claude Code integration (e.g. remotion.dev/docs/ai or "skills"), and the license terms (free for individuals/small companies? company license?).
3. HyperFrames by HeyGen: https://hyperframes.heygen.com (and /packages/engine): what it is, how the engine seeks to exact time and captures frames, license, quickstart commands, and whether it ships an agent skill / Claude Code plugin. Verify commands from the docs/GitHub README; do not invent.
4. Claude Code for beginners: official install command(s) and what plans give access to Opus 5.5 in Claude Code (check https://code.claude.com/docs or docs.claude.com); keep to verifiable facts.
5. FFmpeg's role (encoding frames + audio), and whether Chrome/Chromium headless is needed for HTML-based video tools.
6. Any official Anthropic statement or launch post about Opus 5.5 relevant to video/animation/code-to-video (search anthropic.com/news). Only report what you can cite.
Write ${P}/research/tools.md (Chinese with English quotes where useful, <= 1800 字) with a "小白最短路径" section: the minimal, verified setup and first commands for (a) HyperFrames route, (b) Remotion route, (c) pure HTML/Canvas + headless browser route. Mark anything unverified clearly.
Return a concise summary (<= 400 words) + file path.`, { label: 'context:tools', phase: 'Context' })

const statsP = agent(`${COMMON}
YOUR TASK (two parts):
A. Case-library stats from ${REPO}/data/all_cases.json (meta + cases; category 'video' = 视频编辑与制作). Compute with python and save ${P}/research/library-stats.json:
   total cases, video-category count (article says 1,704), evidenceType distribution within video, source/platform distribution within video,
   date range, count of video cases with promptEvidence or resources (public prompts), top 15 video cases by likes and by views (id, title, author, likes, views, poster).
B. A "case wall" image set for a visual where dozens of real thumbnails fill the screen: pick ~60 video-category cases with poster URLs (pbs.twimg.com or hdslb),
   prefer high likes and visual variety, include the 8 featured cases (lists-006, gosail-060, uc-0962, uc-1377, gosail-072, gosail-054, uc-2348, gosail-133).
   Download posters (for pbs.twimg.com append ?format=jpg&name=small or similar; use a Mozilla User-Agent), center-crop + resize each to exactly 480x270 JPEG (quality 88)
   with python (install Pillow into a venv under ${P}/.venv if needed, or use ffmpeg), save as ${P}/assets/wall/<caseId>.jpg, and write ${P}/assets/wall/manifest.json
   listing [{caseId, author, title, likes, file}]. Then make one preview grid image (10x6) and VIEW it; drop any thumbnail that is blank, broken, NSFW or mostly text, and replace it.
C. Also read the other linked post from the article: @twoclipping product film prompt https://x.com/twoclipping/status/2102554209166000267 (snapshots under ${REPO}/data/_refresh or the xpost helper)
   and summarize in Chinese how it calibrates music beats and aligns SFX peaks to visual events (quote key lines). Save to ${P}/research/twoclipping-product-prompt.md.
Return a concise summary (<= 300 words) with the key numbers and file paths.`, { label: 'context:stats+wall', phase: 'Context' })

const [casesRes, lemo, tools, stats] = await Promise.all([casesP, lemoP, toolsP, statsP])
const cases = (casesRes || []).filter(Boolean).flatMap(r => r.cases || [])
log(`cases researched: ${cases.map(c => c.caseId).join(', ')}`)

phase('Brief')
const brief = await agent(`${COMMON}
YOUR TASK: synthesize all research into a production brief for the scriptwriters and scene designers.
Inputs: ${P}/research/source-article.md (primary), ${P}/research/cases/*.json and *-prompt.txt, ${P}/research/lemo-opuscar.md, ${P}/research/tools.md,
${P}/research/library-stats.json, ${P}/research/twoclipping-product-prompt.md, ${P}/assets/wall/manifest.json.
Summaries from the research agents:
--- lemo ---
${lemo || '(missing)'}
--- tools ---
${tools || '(missing)'}
--- stats ---
${stats || '(missing)'}

Write ${P}/research/brief.md in Chinese (<= 3500 字), organized as:
1. 一句话核心洞见 (why Opus 5.5 videos look so good: it writes code/plans/orchestrates; renderers draw frames; quality = narrative + visual rules + timeline + iterative checking).
2. 可上屏的硬事实 (numbers & claims with source + whether verified or author-reported): 1,704 video cases / 5,181 total, 900 frames ≠ 900 calls, etc.
3. 八个案例速览 table: caseId, author, one-line 独特之处, best highlight segment (file + start-end), hero still t, why cool, beginner takeaway, evidence caveat.
4. "为什么这么炫" — 5-7 cross-case craft patterns, each tied to cases.
5. 小白路线 — verified setup + first steps for each route (from tools.md), the 6-stage workflow, the 6 lessons, the prompt template essentials, Lemo-Opuscar tips.
6. Risky claims to avoid or caveat on screen.
7. Asset inventory: every downloaded file with path, resolution, duration.
Check every file path you list exists (ls). Return a <= 300-word summary.`, { label: 'brief', phase: 'Brief' })

return { cases: cases.map(c => ({ id: c.caseId, file: c.videoFile, dur: c.duration, top: (c.highlights || [])[0] })), lemo, tools, stats, brief }
