// Render individual frames to PNG for review.
//   node tools/still.mjs --t 1,2.5,10                      absolute seconds
//   node tools/still.mjs --scene s03_render --at 0.5,2,4   local seconds within a scene ("end" = last frame of the scene)
//   node tools/still.mjs --scene s03_render --every 0.5    sweep a scene (includes the next scene's transition overlap)
//   node tools/still.mjs --range 0:30 --every 2            sweep an absolute range
// Options: --out DIR (default render/stills)  --sheet NAME (also write a contact sheet NAME.jpg in DIR)  --cols 4
//          --nodebug (no time label)  --nosubs (hide subtitles)  --grain (keep film grain)  --scale 0.5 (faster, smaller)
//          --page src/test/cover.html (render an isolated test page with its own timeline)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, startServer, openStage, seek, parseArgs } from './browser.mjs';

const args = parseArgs(process.argv.slice(2));
const outDir = path.resolve(ROOT, args.out || 'render/stills');
fs.mkdirSync(outDir, { recursive: true });
const scale = args.scale ? Number(args.scale) : 1;
const query = `?${args.nodebug ? '' : 'debug=1&'}nograin=${args.grain ? 0 : 1}${args.nosubs ? '&nosubs=1' : ''}`;

const { server, port } = await startServer();
const { browser, page, errors, duration } = await openStage({ port, scale, query, page: args.page || 'src/index.html' });
const TL = await page.evaluate(() => window.TIMELINE);

let times = []; // [{abs, label}]
const fpsSnap = t => Math.round(t * TL.fps) / TL.fps;
if (args.t) times = String(args.t).split(',').map(Number).map(t => ({ abs: t, label: `t${t.toFixed(2)}` }));
if (args.scene) {
  const sc = TL.scenes.find(s => s.id === args.scene);
  if (!sc) { console.error(`no scene ${args.scene}; scenes: ${TL.scenes.map(s => s.id).join(', ')}`); process.exit(2); }
  const idx = TL.scenes.indexOf(sc);
  const next = TL.scenes[idx + 1];
  const tail = next && next.transition ? next.transition.dur || 0 : 0;
  if (args.at) {
    times = String(args.at).split(',').map(x => (x === 'end' ? sc.dur - 1 / TL.fps : Number(x))).map(l => ({ abs: sc.start + l, label: `${sc.id}_${l.toFixed(2)}` }));
  } else {
    const step = Number(args.every || 1);
    for (let l = 0; l < sc.dur + tail - 1e-6; l += step) times.push({ abs: sc.start + l, label: `${sc.id}_${l.toFixed(2)}` });
  }
}
if (args.range) {
  const [a, b] = String(args.range).split(':').map(Number);
  const step = Number(args.every || 1);
  for (let t = a; t < Math.min(b, duration) - 1e-6; t += step) times.push({ abs: t, label: `t${t.toFixed(2)}` });
}
if (!times.length) { console.error('nothing to render; see header for usage'); process.exit(2); }

const files = [];
for (const { abs, label } of times) {
  const t = fpsSnap(Math.max(0, Math.min(duration - 1 / TL.fps, abs)));
  await seek(page, t);
  const f = path.join(outDir, `${label}.png`);
  await page.screenshot({ path: f, type: 'png' });
  files.push(f);
}
console.log(files.join('\n'));
if (errors.length) console.log('PAGE ERRORS:\n' + errors.slice(0, 30).join('\n'));

if (args.sheet) {
  const cols = Number(args.cols || 4);
  const list = path.join(outDir, `.${args.sheet}.txt`);
  fs.writeFileSync(list, files.map(f => `file '${f}'`).join('\n'));
  const rows = Math.ceil(files.length / cols);
  const sheet = path.join(outDir, `${args.sheet}.jpg`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-vf', `scale=480:-2,tile=${cols}x${rows}:padding=6:margin=6:color=0x333333`, '-frames:v', '1', '-q:v', '3', sheet]);
  console.log('sheet:', sheet);
}
await browser.close();
server.close();
