#!/usr/bin/env python3
"""Narration-first timeline.

Reads script/narration.json, synthesizes every line with edge-tts (cached in audio/tts/), measures word timings,
lays scenes out on the music grid, and writes:
  src/timeline.js      window.TIMELINE for the frame engine (scenes, lines with word + subtitle timings, chapters)
  audio/narration.wav  48 kHz mono narration placed on the timeline
  out/subtitles.srt    subtitle file matching the burned-in captions

narration.json:
{
  "voice": "zh-CN-YunxiNeural", "rate": "+6%", "pitch": "+0Hz", "bpm": 120, "fps": 30,
  "chapters": [{"id": "c1", "num": "01", "label": "原理"}],
  "scenes": [{
    "id": "s01_hook", "chapter": "c1", "theme": "dark", "transition": {"type": "wipe", "dur": 0.6},
    "lead": 0.5, "tail": 0.6, "minDur": 0, "snap": "beat" | "bar" | "none", "gap": 0.22,
    "subs": true, "chrome": true, "music": {"energy": 2}, "data": {},
    "lines": [{"id": "s01_hook.1", "text": "字幕与朗读文本", "say": "可选：仅朗读用的文本", "gapAfter": 0.3}]
  }]
}
"""
import asyncio
import hashlib
import json
import math
import os
import re
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
TTS_DIR = os.path.join(ROOT, "audio", "tts")
PUNCT = set("，。！？；：、,.!?;:…—「」『』“”\"'（）()《》 ")
STRIP_END = "，。、；：,.;:"
MAX_SUB = 18  # max characters per subtitle chunk


def tts_key(text, voice, rate, pitch):
    return hashlib.sha1(f"{voice}|{rate}|{pitch}|{text}".encode()).hexdigest()[:16]


async def synth(text, voice, rate, pitch):
    import edge_tts
    key = tts_key(text, voice, rate, pitch)
    mp3 = os.path.join(TTS_DIR, f"{key}.mp3")
    meta = os.path.join(TTS_DIR, f"{key}.json")
    if os.path.exists(mp3) and os.path.exists(meta):
        return key, json.load(open(meta))
    words = []
    audio = bytearray()
    for attempt in range(4):
        try:
            audio.clear(); words.clear()
            c = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
            async for ch in c.stream():
                if ch["type"] == "audio":
                    audio.extend(ch["data"])
                elif ch["type"] == "WordBoundary":
                    words.append({"w": ch["text"], "start": ch["offset"] / 1e7, "end": (ch["offset"] + ch["duration"]) / 1e7})
            break
        except Exception as e:  # network hiccup: retry
            print(f"  tts retry {attempt + 1}: {e}", file=sys.stderr)
            await asyncio.sleep(2 + attempt * 3)
    else:
        raise RuntimeError(f"TTS failed for: {text}")
    with open(mp3, "wb") as f:
        f.write(audio)
    wav = decode(mp3)
    info = {"text": text, "voice": voice, "rate": rate, "pitch": pitch, "words": words, "samples": int(len(wav)), "duration": len(wav) / SR}
    json.dump(info, open(meta, "w"), ensure_ascii=False, indent=1)
    return key, info


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def char_times(text, words, offset):
    """Per-character [start, end] times for `text`, matching TTS words in order (offset = absolute time of audio start)."""
    n = len(text)
    starts = [None] * n
    ends = [None] * n
    i = 0
    for w in words:
        wt = w["w"]
        # find next occurrence of the word text (case-insensitive), skipping punctuation/spaces
        j = text.lower().find(wt.lower(), i)
        if j < 0:
            continue
        for k in range(j, j + len(wt)):
            frac0 = (k - j) / max(1, len(wt))
            frac1 = (k - j + 1) / max(1, len(wt))
            starts[k] = offset + w["start"] + (w["end"] - w["start"]) * frac0
            ends[k] = offset + w["start"] + (w["end"] - w["start"]) * frac1
        i = j + len(wt)
    # fill gaps (punctuation, unmatched) from neighbours
    last = None
    for k in range(n):
        if starts[k] is None:
            starts[k] = last if last is not None else offset
            ends[k] = starts[k]
        else:
            last = ends[k]
    return starts, ends


CONJ = ["但是", "但", "而且", "而", "然后", "因为", "所以", "如果", "或者", "并且", "再", "就", "也", "还", "才", "让", "把", "用", "从", "对", "和", "跟", "给", "的时候"]


def split_subs(text):
    """Split a line into subtitle chunks (character index ranges): first at clause punctuation (incl. —— and …),
    then long clauses near the middle at a space or before a conjunction, never between a number and its unit."""
    n = len(text)
    ends = []
    i = 0
    while i < n:
        ch = text[i]
        digit_sep = ch in ",." and 0 < i < n - 1 and text[i - 1].isdigit() and text[i + 1].isdigit()
        if (ch in "，。！？；：、,!?;:." ) and not digit_sep:
            ends.append(i + 1)
        elif text.startswith("——", i):
            ends.append(i + 2)
            i += 1
        elif ch == "…":
            while i + 1 < n and text[i + 1] == "…":
                i += 1
            ends.append(i + 1)
        i += 1
    if not ends or ends[-1] != n:
        ends.append(n)
    clauses = []
    a = 0
    for b in ends:
        if b > a:
            clauses.append((a, b))
        a = b
    vis = lambda a, b: len([c for c in text[a:b] if c not in PUNCT])
    # rendered width in CJK units: Latin letters, digits and spaces are about half as wide as a CJK character
    visw = lambda a, b: sum(0.5 if c.isascii() else 1 for c in text[a:b] if c not in PUNCT or c == " ")
    chunks = []
    for a, b in clauses:
        if chunks and vis(chunks[-1][0], b) <= MAX_SUB and text[chunks[-1][1] - 1] not in "。！？!?":
            chunks[-1] = (chunks[-1][0], b)
        else:
            chunks.append((a, b))

    def cut_points(a, b):
        cands = []
        for c in range(a + 4, b - 3):
            left, right = text[c - 1], text[c]
            if right == " " or left == " ":
                if left.isdigit() or (c + 1 < n and text[c + 1].isdigit() and left == " " and False):
                    continue
                # avoid "900 帧" / "30 秒": a digit followed by space + unit
                if left == " " and c - 2 >= 0 and text[c - 2].isdigit():
                    continue
                cands.append(c)
            for w in CONJ:
                if text.startswith(w, c) and left not in " " and not left.isdigit():
                    cands.append(c)
        return sorted(set(cands))

    out = []
    for a, b in chunks:
        while visw(a, b) > MAX_SUB:
            mid = a + (b - a) / 2
            cands = [c for c in cut_points(a, b) if vis(a, c) >= 4 and vis(c, b) >= 4]
            if cands:
                cut = min(cands, key=lambda c: abs(c - mid))
            else:
                cut = int(mid)
                while cut < b - 1 and (text[cut - 1].isdigit() or text[cut].isdigit()):
                    cut += 1
            out.append((a, cut))
            a = cut
        out.append((a, b))
    return out


def clean_sub(s):
    s = s.replace("——", " ").replace("…", "…").strip()
    while s and s[-1] in STRIP_END:
        s = s[:-1]
    return s.strip()


def fmt_srt(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


async def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry" in sys.argv  # measure only: synthesize (cached) and print the layout, write nothing else
    spec_path = os.path.abspath(args[0]) if args else os.path.join(ROOT, "script", "narration.json")
    spec = json.load(open(spec_path))
    voice = spec.get("voice", "zh-CN-YunxiNeural")
    rate = spec.get("rate", "+0%")
    pitch = spec.get("pitch", "+0Hz")
    bpm = spec.get("bpm", 120)
    fps = spec.get("fps", 30)
    beat = 60.0 / bpm
    bar = beat * 4
    os.makedirs(TTS_DIR, exist_ok=True)

    # synthesize all lines (limited concurrency)
    sem = asyncio.Semaphore(6)
    jobs = {}

    async def run(line):
        async with sem:
            say = line.get("say", line["text"])
            jobs[line["id"]] = await synth(say, line.get("voice", voice), line.get("rate", rate), pitch)

    all_lines = [ln for sc in spec["scenes"] for ln in sc.get("lines", [])]
    ids = [ln["id"] for ln in all_lines]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        raise SystemExit(f"duplicate line ids: {dup}")
    await asyncio.gather(*(run(ln) for ln in all_lines))

    t = 0.0
    scenes_out, lines_out = [], []
    placements = []  # (key, start_sample)
    for sc in spec["scenes"]:
        start = t
        tr = sc.get("transition", {"type": "cut", "dur": 0})
        cursor = start + sc.get("lead", max(0.45, tr.get("dur", 0) * 0.8))
        gap = sc.get("gap", 0.22)
        last_end = cursor
        for ln in sc.get("lines", []):
            key, info = jobs[ln["id"]]
            words = info["words"]
            sp0 = words[0]["start"] if words else 0.0
            sp1 = words[-1]["end"] if words else info["duration"]
            if "at" in ln:  # explicit offset from scene start
                cursor = max(cursor, start + ln["at"])
            audio_start = cursor - sp0
            placements.append((key, audio_start, ln.get("gain", 1.0)))
            l_start, l_end = cursor, cursor + (sp1 - sp0)
            text = ln["text"]
            say = ln.get("say", text)
            wabs = [{"w": w["w"], "start": round(audio_start + w["start"], 3), "end": round(audio_start + w["end"], 3)} for w in words]
            subs = []
            if ln.get("subs") is not None:  # explicit subtitle chunks: list of strings, timed proportionally
                parts = ln["subs"]
                total = sum(len(p) for p in parts) or 1
                acc = l_start
                for p in parts:
                    d = (l_end - l_start) * len(p) / total
                    subs.append({"text": clean_sub(p), "start": round(acc, 3), "end": round(acc + d, 3)})
                    acc += d
            else:
                base = say if say == text else text
                if say == text:
                    cs, ce = char_times(text, words, audio_start)
                else:
                    n = max(1, len(text))
                    cs = [l_start + (l_end - l_start) * k / n for k in range(n)]
                    ce = [l_start + (l_end - l_start) * (k + 1) / n for k in range(n)]
                for a, b in split_subs(base):
                    seg = clean_sub(base[a:b])
                    if not seg:
                        continue
                    subs.append({"text": seg, "start": round(cs[a], 3), "end": round(max(ce[b - 1], cs[a] + 0.3), 3)})
                # make chunks contiguous within the line
                for k in range(len(subs) - 1):
                    subs[k]["end"] = subs[k + 1]["start"]
                if subs:
                    subs[0]["start"] = round(l_start, 3)
                    subs[-1]["end"] = round(l_end + 0.15, 3)
            lines_out.append({"id": ln["id"], "scene": sc["id"], "text": text, "start": round(l_start, 3), "end": round(l_end, 3), "words": wabs, "subs": subs})
            last_end = l_end
            cursor = l_end + ln.get("gapAfter", gap)
        end = max(last_end + sc.get("tail", 0.6), start + sc.get("minDur", 0))
        snap = sc.get("snap", "beat")
        if snap == "beat":
            end = math.ceil(end / beat - 1e-6) * beat
        elif snap == "bar":
            end = math.ceil(end / bar - 1e-6) * bar
        end = round(round(end * fps) / fps, 4)
        scenes_out.append({
            "id": sc["id"], "file": sc.get("file", sc["id"]), "template": sc.get("template"), "start": round(start, 4), "dur": round(end - start, 4),
            "theme": sc.get("theme", "dark"), "chapter": sc.get("chapter"), "transition": tr,
            "subs": sc.get("subs", True), "chrome": sc.get("chrome", True), "music": sc.get("music", {}), "data": sc.get("data", {}),
        })
        t = end

    duration = round(t, 4)
    chapters = []
    for ch in spec.get("chapters", []):
        scs = [s for s in scenes_out if s["chapter"] == ch["id"]]
        if not scs:
            continue
        chapters.append({**ch, "start": scs[0]["start"], "end": round(scs[-1]["start"] + scs[-1]["dur"], 4)})

    timeline = {"fps": fps, "duration": duration, "bpm": bpm, "voice": voice, "scenes": scenes_out, "lines": lines_out, "chapters": chapters}
    if dry:
        chars = sum(len(l["text"]) for l in lines_out)
        print(f"[dry] {spec_path}: duration {duration:.2f}s ({int(duration // 60)}:{duration % 60:04.1f}), {len(scenes_out)} scenes, {len(lines_out)} lines, {chars} chars")
        for s_ in scenes_out:
            n = sum(len(l["text"]) for l in lines_out if l["scene"] == s_["id"])
            print(f"  {s_['start']:7.2f} +{s_['dur']:6.2f}  {s_['id']:<28} {n:4d} chars")
        return
    with open(os.path.join(ROOT, "src", "timeline.js"), "w") as f:
        f.write("// Generated by tools/build_timeline.py from script/narration.json. Do not edit by hand.\n")
        f.write("window.TIMELINE = " + json.dumps(timeline, ensure_ascii=False, indent=1) + ";\n")
    json.dump(timeline, open(os.path.join(ROOT, "audio", "timeline.json"), "w"), ensure_ascii=False, indent=1)

    # narration track
    total = int(math.ceil(duration * SR)) + SR
    track = np.zeros(total, dtype=np.float32)
    for key, at, gain in placements:
        wav = decode(os.path.join(TTS_DIR, f"{key}.mp3"))
        i0 = int(round(at * SR))
        a0 = max(0, -i0)
        i0 = max(0, i0)
        seg = wav[a0:]
        seg = seg[: max(0, total - i0)]
        track[i0:i0 + len(seg)] += seg * gain
    track = track[: int(math.ceil(duration * SR))]
    import wave
    pcm = (np.clip(track, -1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(ROOT, "audio", "narration.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

    # srt
    os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
    n = 1
    with open(os.path.join(ROOT, "out", "subtitles.srt"), "w") as f:
        for ln in lines_out:
            for sb in ln["subs"]:
                f.write(f"{n}\n{fmt_srt(sb['start'])} --> {fmt_srt(sb['end'])}\n{sb['text']}\n\n")
                n += 1

    print(f"duration {duration:.2f}s, {len(scenes_out)} scenes, {len(lines_out)} lines")
    for s in scenes_out:
        print(f"  {s['start']:7.2f} +{s['dur']:6.2f}  {s['id']}")


if __name__ == "__main__":
    asyncio.run(main())
