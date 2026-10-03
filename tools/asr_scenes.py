#!/usr/bin/env python3
"""Scene-level intelligibility check: Whisper transcribes each scene's narration window from the mix (several
decodes; best kept) and compares it by tone-less pinyin with the script. Whisper is erratic on short clips, so a
scene passes when any decode hears it well; a real masking problem fails every decode.
Usage: asr_scenes.py [audio/mix_norm.wav]"""
import json, os, subprocess, sys, difflib
import numpy as np
from faster_whisper import WhisperModel
from pypinyin import lazy_pinyin
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'audio', 'mix_norm.wav')
tl = json.load(open(os.path.join(ROOT, 'audio', 'timeline.json')))
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
a = np.frombuffer(raw, dtype=np.float32).copy()
SKIP = set('，。！？；：、,.!?;:…—「」『』“”"\'（）()《》 -')
norm = lambda s: [p for p in (''.join(c for c in q if c not in SKIP) for q in lazy_pinyin(s.lower())) if p]
m = WhisperModel('small', device='cpu', compute_type='int8')
rows = []
for sc in tl['scenes']:
    lines = [l for l in tl['lines'] if l['scene'] == sc['id']]
    if not lines:
        continue
    s0, s1 = max(0, lines[0]['start'] - 0.5), lines[-1]['end'] + 0.6
    ref = ''.join(l['text'] for l in lines)
    best = (0.0, '')
    configs = [dict(temperature=t) for t in (0.0, 0.2, 0.4)] + \
              [dict(temperature=t, no_speech_threshold=None, log_prob_threshold=None, compression_ratio_threshold=2.2) for t in (0.0, 0.2)]
    for cfg in configs:
        segs, _ = m.transcribe(a[int(s0 * 16000):int(s1 * 16000)], language='zh', beam_size=5, condition_on_previous_text=False, **cfg)
        heard = ''.join(x.text for x in segs)
        sim = difflib.SequenceMatcher(None, norm(ref), norm(heard)).ratio()
        if sim > best[0]:
            best = (sim, heard)
        if sim >= 0.9:
            break
    rows.append({'scene': sc['id'], 'similarity': round(best[0], 3), 'heard': best[1], 'script': ref})
json.dump(rows, open(os.path.join(ROOT, 'audio', 'asr_scenes.json'), 'w'), ensure_ascii=False, indent=1)
print(f"mean {sum(r['similarity'] for r in rows) / len(rows):.3f}; below 0.85: " + ', '.join(f"{r['scene']} {r['similarity']}" for r in rows if r['similarity'] < 0.85))
for r in rows:
    print(f"  {r['scene']:14s} {r['similarity']:.3f}")
