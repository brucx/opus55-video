// Dump the SFX event list (window.__events()) to audio/events.json for tools/mix.py.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, openStage } from './browser.mjs';
const { server, port } = await startServer();
const { browser, page } = await openStage({ port, scale: 0.25 });
const ev = await page.evaluate(() => window.__events());
fs.writeFileSync(path.join(ROOT, 'audio', 'events.json'), JSON.stringify(ev, null, 1));
console.log(`${ev.length} events -> audio/events.json`);
await browser.close();
server.close();
