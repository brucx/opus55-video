// Report every ctx.word()/wordEnd() lookup that found no spoken word (the scene then falls back to the line start).
// Renders one frame inside every scene so lazily computed cues are exercised too.
import { startServer, openStage, seek } from './browser.mjs';
const { server, port } = await startServer();
const { browser, page } = await openStage({ port, scale: 0.25 });
const TL = await page.evaluate(() => window.TIMELINE);
for (const sc of TL.scenes) for (const f of [0.3, 0.6, 0.9]) await seek(page, sc.start + sc.dur * f);
const misses = await page.evaluate(() => window.__cueMisses || []);
const uniq = [...new Map(misses.map(m => [`${m.scene}|${m.line}|${m.word}|${m.noLine ? 'L' : ''}`, m])).values()];
console.log(uniq.length ? uniq.map(m => `${m.scene}: line ${m.line} word "${m.word}"${m.noLine ? ' (NO SUCH LINE)' : ''}${m.end ? ' (end)' : ''}`).join('\n') : 'no cue misses');
await browser.close(); server.close();
