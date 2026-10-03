# Design system — 「每一帧，都是代码」

Everything on screen is HTML/SVG/Canvas computed from time `t`, captured frame by frame by headless Chrome.
This file is the contract every scene follows so the film reads as one piece.

## Canvas, safe areas
- 1920×1080, 30 fps. Scene root is an absolutely positioned 1920×1080 box.
- Reserved: top band y < 112 (chapter tag at left, WaytoAGI logo at right, drawn by the engine);
  bottom band y > 900 (burned-in subtitles, drawn by the engine, ~64–110 px tall centered at y≈990).
- Main content box: x 112–1808, y 140–880. Full-bleed backgrounds and video may go under the bands, but no text or
  focal object may sit in them while subtitles/chrome are visible.
- Scenes can turn subtitles or chrome off from narration.json (`"subs": false`, `"chrome": false`) — only for the
  cold open montage, title card and end card.

## Themes and colour
Dark scenes ("night") are the default; light scenes ("paper") are used for the hands-on chapter so it feels like a worksheet.

| token | value | use |
|---|---|---|
| `--night` | #121011 | dark background (with 48 px grid at 4.5 % white: class `grid-night`) |
| `--night-2` / `--night-3` | #1B1718 / #2A2425 | cards and panels on dark |
| `--snow` | #F4F1F2 | primary text on dark |
| `--fog` | #A39A9B | secondary text on dark |
| `--lime` | #C9DF8D | primary accent on dark (highlights, progress, the "code" colour) |
| `--lilac` / `--purple` | #EAD8EB / #AD85BA | secondary accents, glows |
| `--soft` | #F6F4F5 | light background (class `grid-paper`) |
| `--ink` / `--ink-2` | #241E1E / #5D5656 | text on light |
| `--green` / `--green-deep` | #238653 / #176A42 | primary accent on light |
| `--blue` | #103CA0 | secondary accent on light |
Brand rule: lime never as text on light backgrounds (contrast); on light use lime only as a marker fill behind ink text.
Warm orange #F2B880 is reserved for numbers inside code.

## Typography
| role | font | size / weight |
|---|---|---|
| hero | `var(--cn)` (Noto Sans SC VF) | 150–190 px / 900, letter-spacing −0.01em |
| H1 | `var(--cn)` | 96–120 px / 900 |
| H2 | `var(--cn)` | 60–72 px / 800 |
| H3 | `var(--cn)` | 42–52 px / 700 |
| body | `var(--cn)` | 30–36 px / 500, line-height 1.45 |
| tag / meta | `var(--mono)` (JetBrains Mono) | 20–24 px / 600, uppercase, tracking .06em (`K.tag`) |
| numbers | `var(--display)` (Space Grotesk) | 700, `font-variant-numeric: tabular-nums` |
| code | `var(--mono)` | 24–30 px / 500 (`K.codeBlock`) |
| playful accent | `var(--fun)` (Smiley Sans, oblique) | sparingly, ≤ 1 per scene |
Line lengths: H1 ≤ 12 CJK chars per line, body ≤ 24. One main message per screen.

## Motion
- Everything moves a little: a slow camera drift (10–30 px or 1–3 % scale over the scene) so nothing is frozen > 2 s.
- Entrances: per-character rise (`K.title(...).render(t, start)`, outQuint 0.6–0.8 s, 25–35 ms stagger); cards spring in
  (`K.pop`) or slide 40–80 px + fade over 0.5–0.7 s (outCubic / outQuint). Exits are faster (0.25–0.4 s, inCubic).
- Sync to the voice: important elements land on the word that names them: `ctx.word('s05.2', '900')` returns the local time
  the TTS says "900". Use `ctx.cue(lineId)` / `ctx.cueEnd(lineId)` for line starts/ends. Never hard-code seconds that
  depend on speech; durations come from TTS. Use `ctx.dur` for the scene length.
- Beats: `ctx.beatTime(n)` gives the local time of the n-th beat (120 BPM ⇒ 0.5 s) — use it for montage cuts.
- Transitions between scenes are set in narration.json (`wipe` lime bar for chapter changes, `push`, `zoom`, `fade`,
  `iris`, `blur`, `cut`). The outgoing scene keeps rendering with t > ctx.dur during the next scene's transition: hold
  your final state there (clamp) unless you deliberately animate out.
- Shared-object continuity (the lesson of the UI-morph case) is encouraged across adjacent scenes: e.g. the lime rounded
  rectangle that ends one scene starts the next.

## Scene API (src/scenes/<id>.js)
```js
Scene.define({
  id: 's05_frames',
  build(root, ctx) {            // once: create DOM inside root, return state
    const bg = K.bg(root, 'night', { glows: [{ x: 1500, y: 260, r: 520, color: 'rgba(173,133,186,.45)' }] });
    const title = K.title('画面 = render(t)', { size: 120 });
    root.append(title.el);
    return { title };
  },
  render(s, t, ctx) {           // every frame: set every animated property from t (no incremental state!)
    s.title.render(t, ctx.cue('s05_frames.1'));
  },
  events(ctx) {                 // optional SFX cues, local seconds: whoosh swish pop blip tick type ding sparkle impact boom glitch riser rise_short shutter
    return [{ t: ctx.word('s05_frames.2', '900'), type: 'pop', gain: 0.5 }];
  },
});
```
Globals: `E` (h, s, tf, chars, typed, setImg, bgImg, clipUrl, clipInfo, image, fill), `M` (clamp, lerp, invLerp, remap, ease.*, prog,
env, spring, rng, noise1, noise2, mixColor, rgba), `K` (bg, tag, title, videoCard, codeBlock, drawPath, svgRoot, fmt, pop).
- `E.h(tag, props, ...children)` creates DOM; `E.s(...)` creates SVG; `E.tf(el, {x, y, s, sx, sy, r, o, blur, rx, ry})` sets
  transform/opacity in one call.
- `M.prog(t, start, dur, ease)` eased 0..1; `M.env(t, a, b, fadeIn, fadeOut)` in-hold-out envelope;
  `M.spring(t - start, {stiffness, damping})` 0→1 with overshoot.
- Case footage: `const v = K.videoCard({ clip: 'lists-006a', w: 960, h: 540, credit: { author: '@twoclipping', note: '原作片段' } })`,
  then `v.render(tClip)` each frame (clip-local seconds; 'loop' or 'pingpong' as 2nd arg to repeat). Every excerpt of a
  case MUST carry its author credit while visible. Clip ids and their ranges are in script/clips.json → src/media/manifest.js.
- Thumbnails wall: `assets/wall/<caseId>.jpg` (480×270), list in `assets/wall/manifest.json`; reference as
  `../assets/wall/<id>.jpg` from the page.
- Production numbers: on-screen placeholders like `{{FRAMES}}`, `{{CODE_LINES}}`, `{{RENDER_MIN}}`, `{{SCENES}}`, `{{SECONDS}}`,
  `{{MUSIC_CODE_LINES}}` are filled with real values by `E.fill(text)` (from src/stats.js, generated by tools/stats.py). Never hard-code them.
- `E.bgImg(el, url)` sets an image as CSS background (e.g. footage showing through big text with `background-clip: text`) and makes
  the frame wait for the decode.
- Logos: `window.LOGO_DARK` / `window.LOGO_LIGHT` (SVG strings; DARK = for dark backgrounds).

## Rules
- Deterministic: no `Math.random`, `Date`, `performance.now`, CSS animations/transitions, `requestAnimationFrame` loops.
  Use `ctx.rng('name')` / `M.noise1`.
- render() must be idempotent for any t, in any order (workers render frame ranges independently).
- Performance (software rendering): avoid `filter: blur()` on anything larger than ~600×600 px, never animate
  `backdrop-filter`, keep < 1500 DOM nodes per scene, prefer transforms/opacity. Canvas is fine for particles.
- Text must never overflow its box, collide with other text, or sit in the reserved bands.
- Facts on screen must match script/narration.json and research/brief.md (author-reported claims stay labelled as such:
  「作者自述」).

## Review loop for a scene
```
node tools/still.mjs --scene <id> --every 0.5 --sheet <id> --out render/stills/<id>   # contact sheet with time labels
node tools/still.mjs --scene <id> --at 1.2,3.4,end --out render/stills/<id>            # full-size frames
```
Look at the images (Read tool). Check: hierarchy and focal point, text legibility at phone size, alignment to the
voice cues, overlap with subtitle band, empty/frozen moments, consistency with this file.
