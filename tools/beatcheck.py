#!/usr/bin/env python3
"""Rough beat-grid vs. visual-cut check for a rendered video (numpy only; approximate, not a proof of sync).

Usage: .venv/bin/python tools/beatcheck.py <video.mp4> [--json out.json]
- Audio: mono 22.05 kHz -> STFT (1024/256) -> spectral-flux onset envelope (+ low-band 30-150 Hz flux for kicks)
- Tempo: autocorrelation of the onset envelope in 70-180 BPM; beat phase by maximizing summed onset strength on the grid
- Visual: ffmpeg scene-change scores per frame; cuts = frames whose score exceeds a threshold
- Report: estimated BPM and first-beat offset, per-bar RMS (to locate the drop), and each cut's distance to the nearest beat
"""
import json
import re
import subprocess
import sys

import numpy as np

SR = 22050
N_FFT = 1024
HOP = 256


def load_audio(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def onset_envelopes(y):
    win = np.hanning(N_FFT).astype(np.float32)
    n = 1 + (len(y) - N_FFT) // HOP
    frames = np.lib.stride_tricks.as_strided(y, shape=(n, N_FFT), strides=(y.strides[0] * HOP, y.strides[0]))
    spec = np.abs(np.fft.rfft(frames * win, axis=1))
    logspec = np.log1p(100 * spec)
    flux = np.maximum(0, np.diff(logspec, axis=0)).sum(axis=1)
    freqs = np.fft.rfftfreq(N_FFT, 1 / SR)
    low = (freqs >= 30) & (freqs <= 150)
    low_flux = np.maximum(0, np.diff(logspec[:, low], axis=0)).sum(axis=1)
    t = (np.arange(len(flux)) + 1) * HOP / SR + N_FFT / (2 * SR)
    norm = lambda a: (a - a.mean()) / (a.std() + 1e-9)
    return t, norm(flux), norm(low_flux)


def estimate_tempo(env, fps):
    env = env - env.mean()
    ac = np.correlate(env, env, mode="full")[len(env) - 1:]
    lags = np.arange(len(ac))
    bpm = 60 * fps / np.maximum(lags, 1)
    mask = (bpm >= 70) & (bpm <= 180)
    best = lags[mask][np.argmax(ac[mask])]
    # parabolic refinement
    if 1 <= best < len(ac) - 1:
        a, b, c = ac[best - 1], ac[best], ac[best + 1]
        best = best + 0.5 * (a - c) / (a - 2 * b + c + 1e-9)
    return 60 * fps / best


def best_phase(t, env, period, start=0.0, end=None):
    end = end or t[-1]
    phases = np.linspace(0, period, 200, endpoint=False)
    scores = []
    for ph in phases:
        grid = np.arange(start + ph, end, period)
        idx = np.clip(np.searchsorted(t, grid), 0, len(t) - 1)
        scores.append(env[idx].sum())
    return phases[int(np.argmax(scores))]


def scene_scores(path):
    out = subprocess.run(["ffmpeg", "-v", "info", "-i", path, "-vf", "select='gte(scene,0)',metadata=print:key=lavfi.scene_score",
                          "-an", "-f", "null", "-"], capture_output=True, text=True).stderr
    times, scores = [], []
    cur = None
    for line in out.splitlines():
        m = re.search(r"pts_time:([0-9.]+)", line)
        if m:
            cur = float(m.group(1))
        m = re.search(r"lavfi\.scene_score=([0-9.]+)", line)
        if m and cur is not None:
            times.append(cur)
            scores.append(float(m.group(1)))
    return np.array(times), np.array(scores)


def main():
    path = sys.argv[1]
    y = load_audio(path)
    t, env, low = onset_envelopes(y)
    fps = SR / HOP
    bpm = estimate_tempo(env, fps)
    period = 60 / bpm
    phase = best_phase(t, env, period)
    # same analysis assuming exactly 120 BPM (the prompt's nominal tempo)
    phase120 = best_phase(t, env, 0.5)
    dur = len(y) / SR
    # per-2s-bar RMS to find the drop
    bars = []
    for k in range(int(np.ceil(dur / 2))):
        seg = y[int(k * 2 * SR):int(min(dur, (k + 1) * 2) * SR)]
        bars.append(round(float(20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9)), 1))
    # kick onsets: local maxima of low-band flux above 1.5 sd
    peaks = [i for i in range(1, len(low) - 1) if low[i] > 1.5 and low[i] >= low[i - 1] and low[i] >= low[i + 1]]
    kick_times = t[peaks]
    grid = np.arange(phase120, dur, 0.5)
    kick_dev = []
    for g in grid:
        near = kick_times[np.abs(kick_times - g) < 0.08]
        if len(near):
            kick_dev.append(float(near[np.argmin(np.abs(near - g))] - g))
    vt, vs = scene_scores(path)
    thr = 0.12
    cut_idx = [i for i in range(len(vs)) if vs[i] >= thr and (i == 0 or vs[i] >= vs[i - 1]) and (i == len(vs) - 1 or vs[i] >= vs[i + 1])]
    cuts = []
    for i in cut_idx:
        ct = float(vt[i])
        k = round((ct - phase120) / 0.5)
        nearest = phase120 + k * 0.5
        cuts.append({"t": round(ct, 3), "score": round(float(vs[i]), 3), "nearestBeat": round(nearest, 3),
                     "beatIndex": int(k), "offsetMs": round((ct - nearest) * 1000, 1)})
    res = {
        "file": path,
        "durationS": round(dur, 3),
        "estimatedBPM": round(float(bpm), 2),
        "estimatedFirstBeatS": round(float(phase), 3),
        "firstBeatAssuming120BPM": round(float(phase120), 3),
        "barRmsDb_2s": bars,
        "kickToGrid": {"matchedBeats": len(kick_dev), "gridBeats": len(grid),
                       "medianOffsetMs": round(float(np.median(kick_dev)) * 1000, 1) if kick_dev else None,
                       "p90AbsOffsetMs": round(float(np.percentile(np.abs(kick_dev), 90)) * 1000, 1) if kick_dev else None},
        "sceneCutThreshold": thr,
        "cuts": cuts,
        "cutsWithin1FrameOfBeat": sum(1 for c in cuts if abs(c["offsetMs"]) <= 1000 / 60 + 1),
        "cutsWithin50msOfBeat": sum(1 for c in cuts if abs(c["offsetMs"]) <= 50),
    }
    print(json.dumps(res, ensure_ascii=False, indent=1))
    if "--json" in sys.argv:
        with open(sys.argv[sys.argv.index("--json") + 1], "w", encoding="utf-8") as f:
            json.dump(res, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
