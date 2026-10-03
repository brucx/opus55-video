#!/usr/bin/env python3
"""Listen to the narration (or the final mix) with Whisper and compare every script line with what was heard.

Each line is transcribed on its own window [start-0.4, end+0.4] by one or more models; a line passes if ANY model
hears it well (Whisper occasionally returns nothing or a hallucination for a short clip; requiring agreement of a
failure across models filters those out). Comparison is by tone-less pinyin, so homophones (帧/针) and
traditional/simplified differences don't count.
Usage: asr_check.py [audio/mix_norm.wav] [--models small,medium]
Writes audio/asr_report.json; prints lines whose best similarity is below 0.85.
"""
import difflib, json, os, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
from pypinyin import lazy_pinyin

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = [a for a in sys.argv[1:] if not a.startswith('--')]
path = args[0] if args else os.path.join(ROOT, 'audio', 'mix_norm.wav')
models = (sys.argv[sys.argv.index('--models') + 1] if '--models' in sys.argv else 'small,medium').split(',')
tl = json.load(open(os.path.join(ROOT, 'audio', 'timeline.json')))
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(raw, dtype=np.float32).copy()
SKIP = set('，。！？；：、,.!?;:…—「」『』“”"\'（）()《》 -')


def norm(s):
    out = []
    for p in lazy_pinyin(s.lower()):
        p = ''.join(ch for ch in p if ch not in SKIP)
        if p:
            out.append(p)
    return out


best = {ln['id']: {'id': ln['id'], 'text': ln['text'], 'heard': '', 'similarity': 0.0, 'model': None} for ln in tl['lines']}
for name in models:
    m = WhisperModel(name, device='cpu', compute_type='int8')
    for ln in tl['lines']:
        if best[ln['id']]['similarity'] >= 0.95:
            continue
        a, b = max(0, ln['start'] - 0.4), ln['end'] + 0.4
        seg = audio[int(a * 16000):int(b * 16000)]
        segs, _ = m.transcribe(seg, language='zh', beam_size=5, condition_on_previous_text=False, vad_filter=False)
        heard = ''.join(s.text for s in segs).strip()
        ref, hyp = norm(ln['text']), norm(heard)
        sim = difflib.SequenceMatcher(None, ref, hyp).ratio() if ref else 1.0
        if sim > best[ln['id']]['similarity']:
            best[ln['id']].update({'heard': heard, 'similarity': round(sim, 3), 'model': name})
report = list(best.values())
json.dump(report, open(os.path.join(ROOT, 'audio', 'asr_report.json'), 'w'), ensure_ascii=False, indent=1)
bad = [r for r in report if r['similarity'] < 0.85]
print(f"{len(report)} lines checked ({'+'.join(models)}), mean best similarity {sum(r['similarity'] for r in report) / max(1, len(report)):.3f}, {len(bad)} below 0.85")
for r in bad:
    print(f"  {r['id']}: {r['similarity']} ({r['model']})\n    script: {r['text']}\n    heard:  {r['heard']}")
