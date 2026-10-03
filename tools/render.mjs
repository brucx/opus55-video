// Parallel frame render: N headless Chrome workers each seek + capture a contiguous frame range and pipe it into
// its own ffmpeg encoder; chunks are then concatenated without re-encoding.
//   node tools/render.mjs [--workers 6] [--start 0] [--end <dur>] [--scale 1] [--format jpeg|png] [--out render/video.mp4]
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { ROOT, startServer, openStage, seek, capture, parseArgs } from './browser.mjs';

const args = parseArgs(process.argv.slice(2));
const workers = Number(args.workers || 6);
const scale = Number(args.scale || 1);
const format = args.format || 'jpeg';
const out = path.resolve(ROOT, args.out || 'render/video.mp4');
const chunkDir = path.join(path.dirname(out), `.chunks-${path.basename(out, '.mp4')}`);
fs.rmSync(chunkDir, { recursive: true, force: true });
fs.mkdirSync(chunkDir, { recursive: true });

const { server, port } = await startServer();
// probe timeline with one page
const probe = await openStage({ port, scale: 0.25, query: '?nograin=0' });
const TL = await probe.page.evaluate(() => window.TIMELINE);
await probe.browser.close();
const fps = TL.fps;
const startF = Math.round(Number(args.start || 0) * fps);
const endF = Math.round(Math.min(Number(args.end || TL.duration), TL.duration) * fps);
const total = endF - startF;
const per = Math.ceil(total / workers);
console.log(`render ${total} frames (${(total / fps).toFixed(2)} s) @${fps}fps, ${workers} workers, scale ${scale}, ${format}`);

let done = 0;
const t0 = Date.now();
const timer = setInterval(() => {
  const el = (Date.now() - t0) / 1000;
  console.log(`  ${done}/${total} frames  ${(done / el).toFixed(1)} fps  eta ${((total - done) / Math.max(1, done / el)).toFixed(0)} s`);
}, 10000);

async function worker(k) {
  const a = startF + k * per, b = Math.min(endF, a + per);
  if (a >= b) return null;
  const chunk = path.join(chunkDir, `c${String(k).padStart(2, '0')}.mp4`);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', format === 'png' ? 'png' : 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(args.crf || 12), '-pix_fmt', 'yuv420p', '-r', String(fps), chunk], { stdio: ['pipe', 'inherit', 'inherit'] });
  const finished = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error(`ffmpeg chunk ${k} exit ${c}`)))));
  const { browser, page, cdp, errors } = await openStage({ port, scale, query: '' });
  for (let f = a; f < b; f++) {
    await seek(page, f / fps);
    const buf = await capture(cdp, format, 95);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    done++;
  }
  ff.stdin.end();
  await finished;
  await browser.close();
  if (errors.length) console.log(`worker ${k} page errors:\n` + errors.slice(0, 10).join('\n'));
  return chunk;
}

const chunks = (await Promise.all(Array.from({ length: workers }, (_, k) => worker(k)))).filter(Boolean);
clearInterval(timer);
server.close();
const list = path.join(chunkDir, 'list.txt');
fs.writeFileSync(list, chunks.map(c => `file '${c}'`).join('\n'));
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', out]);
const secs = (Date.now() - t0) / 1000;
console.log(`wrote ${out} in ${secs.toFixed(1)} s (${(total / secs).toFixed(1)} fps)`);
fs.writeFileSync(out.replace(/\.mp4$/, '.render.json'), JSON.stringify({ frames: total, fps, workers, scale, format, seconds: secs, start: startF / fps, end: endF / fps }, null, 2));
