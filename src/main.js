// Loads one script per timeline scene (src/scenes/<id>.js), then boots the engine.
(async () => {
  const load = src => new Promise(resolve => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = () => resolve(true);
    el.onerror = () => { console.warn('missing', src); resolve(false); };
    document.body.append(el);
  });
  const ids = [...new Set(window.TIMELINE.scenes.map(s => s.file || s.id))];
  for (const id of ids) await load(`scenes/${id}.js`);
  await window.__boot();
})().catch(err => { console.error(err); window.__error = String(err && err.stack || err); });
