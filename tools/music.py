#!/usr/bin/env python3
"""Procedural score, written as code and laid on the same timeline as the pictures.

Reads audio/timeline.json (scenes carry music.energy 0..3; bpm) and writes audio/music.wav (48 kHz stereo).
Energy layers:  0 pad only · 1 + sub bass, soft arp · 2 + kick, hats, pumping bass, brighter arp · 3 + clap, open hats, lead shimmer
Chord loop (one chord per bar, C major / A minor):  Fmaj9 | G6 | Am9 | Em7
Chapter starts get an impact; the bar before gets a riser.
"""
import json
import math
import os
import sys
import wave

import numpy as np
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
rng = np.random.default_rng(20261001)

CHORDS = [  # (bass midi, pad voicing, arp tones)
    (41, [57, 60, 64, 67], [69, 72, 76, 79]),   # Fmaj9  (F | A C E G)
    (43, [59, 62, 64, 67], [71, 74, 76, 79]),   # G6     (G | B D E G)
    (45, [60, 64, 67, 71], [72, 76, 79, 83]),   # Am9    (A | C E G B)
    (40, [59, 62, 64, 67], [71, 74, 76, 79]),   # Em7    (E | B D E G)
]
ARP_PATTERNS = [
    [0, 1, 2, 3, 2, 1, 2, 3, 0, 2, 1, 3, 2, 3, 1, 2],
    [3, 2, 1, 0, 1, 2, 3, 2, 0, 3, 2, 1, 2, 1, 0, 2],
]  # alternate every 8 bars so long sections keep moving


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lowpass(x, fc, order=2):
    b, a = signal.butter(order, min(0.99, fc / (SR / 2)), "low")
    return signal.lfilter(b, a, x, axis=0)


def highpass(x, fc, order=2):
    b, a = signal.butter(order, min(0.99, fc / (SR / 2)), "high")
    return signal.lfilter(b, a, x, axis=0)


def bandpass(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), min(0.99, hi / (SR / 2))], "band")
    return signal.lfilter(b, a, x, axis=0)


def add(buf, at, x):
    i0 = int(round(at * SR))
    if i0 >= len(buf):
        return
    if i0 < 0:
        x = x[-i0:]
        i0 = 0
    n = min(len(x), len(buf) - i0)
    buf[i0:i0 + n] += x[:n]


# ---------------- instruments ----------------
def pad_note(f, dur, bright):
    """Soft additive pad: 3 detuned voices x 8 harmonics, slow attack/release, stereo spread."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    nh = 8
    for v, (cents, pan) in enumerate([(-8, 0.2), (0, 0.5), (8, 0.8)]):
        fv = f * 2 ** (cents / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        s = np.zeros(n)
        for k in range(1, nh + 1):
            if fv * k > 12000:
                break
            amp = (1.0 / k ** (1.6 - 0.5 * bright))
            s += amp * np.sin(2 * np.pi * fv * k * t + ph * k)
        out[:, 0] += s * math.cos(pan * math.pi / 2)
        out[:, 1] += s * math.sin(pan * math.pi / 2)
    att, rel = min(0.6, dur * 0.3), min(0.9, dur * 0.4)
    env = np.minimum(1, t / att) * np.minimum(1, (dur - t) / rel)
    env = np.clip(env, 0, 1) ** 1.5
    lfo = 1 + 0.08 * np.sin(2 * np.pi * 0.25 * t)
    return out * (env * lfo)[:, None] * 0.06


def sub_note(f, dur, pump=None):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    s = np.tanh(1.6 * s) / np.tanh(1.6)
    env = np.minimum(1, t / 0.01) * np.minimum(1, (dur - t) / 0.06)
    env = np.clip(env, 0, 1)
    return np.stack([s * env, s * env], 1) * 0.22


def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 48 + 110 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 7.5)
    click = highpass(rng.standard_normal(n) * np.exp(-t * 900), 2000) * 0.25
    s = np.tanh(2.2 * (s + click)) * 0.55
    return np.stack([s, s], 1)


def hat(open_=False):
    n = int((0.35 if open_ else 0.08) * SR)
    t = np.arange(n) / SR
    s = highpass(rng.standard_normal(n), 7500, 4) * np.exp(-t * (11 if open_ else 70))
    return np.stack([s * 0.9, s * 1.0], 1) * (0.075 if open_ else 0.055)


def clap():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    e = np.zeros(n)
    for d in (0.0, 0.011, 0.022):
        e += (t >= d) * np.exp(-(t - d).clip(0) * 140) * 0.7
    e += (t >= 0.03) * np.exp(-(t - 0.03).clip(0) * 18) * 0.35
    s = bandpass(rng.standard_normal(n), 900, 3500, 2) * e
    return np.stack([s * 0.95, s], 1) * 0.2


def pluck(f, dur, bright):
    """Karplus-Strong pluck."""
    n = int(dur * SR)
    N = max(2, int(round(SR / f)))
    burst = np.zeros(n)
    burst[:N] = rng.uniform(-1, 1, N)
    burst = lowpass(burst, 2500 + 6000 * bright)
    d = 0.996
    a = np.zeros(N + 2)
    a[0] = 1
    a[N] = -0.5 * d
    a[N + 1] = -0.5 * d
    y = signal.lfilter([1.0], a, burst)
    y *= np.minimum(1, (dur - np.arange(n) / SR) / 0.05).clip(0, 1)
    return y * 0.16


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    p = t / dur
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    # sweep a band upward in blocks
    blocks = 24
    for b in range(blocks):
        i0, i1 = b * n // blocks, (b + 1) * n // blocks
        fc = 400 * (12 ** (b / blocks))
        seg = bandpass(noise[max(0, i0 - 2000):i1], fc * 0.7, fc * 1.4)[-(i1 - i0):]
        out[i0:i1] = seg
    out *= (p ** 2.2) * 0.35
    tone = np.sin(2 * np.pi * np.cumsum(200 + 600 * p ** 2) / SR) * (p ** 3) * 0.05
    s = out + tone
    return np.stack([s * (1 - 0.3 * p), s * (0.7 + 0.3 * p)], 1)


def impact():
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.2) * 0.5
    air = lowpass(rng.standard_normal(n), 6000) * np.exp(-t * 3.5) * 0.10
    s = np.tanh(1.5 * (boom + air))
    return np.stack([s, s], 1) * 0.8


def reverb_ir(dur=2.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-t * 3.2)[:, None]
    ir = lowpass(ir, 5000)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    return ir / np.sqrt((ir ** 2).sum(0, keepdims=True)) * 0.9


# ---------------- arrangement ----------------
def main():
    tl = json.load(open(os.path.join(ROOT, "audio", "timeline.json")))
    bpm = tl.get("bpm", 120)
    beat = 60 / bpm
    bar = beat * 4
    dur = tl["duration"]
    total = int(math.ceil((dur + 3) * SR))

    # energy per bar (max over scenes overlapping the bar)
    nbars = int(math.ceil(dur / bar)) + 1
    energy = np.zeros(nbars)
    for sc in tl["scenes"]:
        e = (sc.get("music") or {}).get("energy", 1)
        b0 = int(sc["start"] // bar)
        b1 = int(math.ceil((sc["start"] + sc["dur"]) / bar - 1e-6))
        for b in range(b0, min(nbars, b1)):
            # bar belongs to the scene covering most of it
            ov = min((b + 1) * bar, sc["start"] + sc["dur"]) - max(b * bar, sc["start"])
            if ov >= bar * 0.5 or energy[b] == 0:
                energy[b] = e
    # explicit silence/outro handling: last bar fades
    print("energy by bar:", "".join(str(int(e)) for e in energy))

    dry = np.zeros((total, 2))      # drums + bass (no reverb)
    wet = np.zeros((total, 2))      # pads + plucks (to reverb)
    pump = np.ones(total)           # sidechain gain from kicks

    k_smp, h_c, h_o, c_smp = kick(), hat(False), hat(True), clap()
    for b in range(nbars):
        t0 = b * bar
        if t0 >= dur + 1:
            break
        e = energy[b]
        bass, voicing, arp = CHORDS[b % 4]
        bright = [0.2, 0.45, 0.75, 1.0][int(e)]
        # pad (always), overlapping into next bar for smoothness
        for m in voicing:
            add(wet, t0 - 0.15, pad_note(mtof(m), bar + 0.6, bright) * (0.8 + 0.25 * e))
        if e >= 1:
            if e == 1:
                add(dry, t0, sub_note(mtof(bass), bar * 0.98))
            else:
                for k in range(8):
                    add(dry, t0 + k * beat / 2, sub_note(mtof(bass), beat / 2 * 0.92))
            # arp: 16ths at e>=2, 8ths at e==1
            step = beat / 4 if e >= 2 else beat / 2
            nsteps = int(round(bar / step))
            for k in range(nsteps):
                idx = ARP_PATTERNS[(b // 8) % 2][k % 16]
                m = arp[idx] + (12 if (e >= 3 and k % 8 == 7) else 0)
                vel = (0.55 + 0.45 * (k % 4 == 0)) * (0.55 if e == 1 else 0.8)
                add(wet, t0 + k * step, np.stack([pluck(mtof(m), 0.5, bright)] * 2, 1) * vel * np.array([0.8 + 0.2 * (k % 2), 1.0 - 0.2 * (k % 2)]))
        if e >= 2:
            for k in range(4):
                tk = t0 + k * beat
                add(dry, tk, k_smp)
                i0 = int(tk * SR)
                n = int(0.42 * SR)
                if i0 < total:
                    env = 1 - 0.75 * np.exp(-np.arange(min(n, total - i0)) / SR * 9)
                    pump[i0:i0 + len(env)] = np.minimum(pump[i0:i0 + len(env)], env)
                add(dry, tk + beat / 2, h_o if (e >= 3 and k == 3) else h_c)
                if e >= 3:
                    add(dry, tk + beat / 4 * 3, h_c * 0.6)
                if e >= 3 and k in (1, 3):
                    add(dry, tk, c_smp)
            # phrase fill: last bar of every 8-bar phrase gets a 16th-note hat run and a clap pickup into the next phrase
            if b % 8 == 7:
                for j in range(8):
                    add(dry, t0 + 2 * beat + j * beat / 4, h_c * (0.45 + 0.07 * j))
                add(dry, t0 + 3.5 * beat, c_smp * 0.7)

    # resolution: when the last voice line ends the groove stops and a Cmaj9 chord rings out to the final frame
    t_res = max(l["end"] for l in tl["lines"]) + 0.15
    t_res = math.ceil(t_res / (beat / 2) - 1e-6) * (beat / 2)
    i_res = int(t_res * SR)
    fade_g = np.ones(total)
    nf = int(0.35 * SR)
    fade_g[i_res:i_res + nf] = np.linspace(1, 0, nf)[: max(0, min(nf, total - i_res))]
    fade_g[i_res + nf:] = 0
    dry *= fade_g[:, None]
    wet *= np.maximum(fade_g, 0.0)[:, None]
    tail = max(1.5, dur - t_res + 1.5)
    for m in [48, 52, 55, 59, 62]:  # C3 E3 G3 B3 D4
        add(wet, t_res, pad_note(mtof(m), tail, 0.5) * 1.5)
    add(dry, t_res, sub_note(mtof(36), min(tail, 3.0)) * 0.8)
    for k, m in enumerate([60, 64, 67, 71, 74, 79]):  # quick upward strum
        add(wet, t_res + 0.03 * k, np.stack([pluck(mtof(m), 2.5, 0.7)] * 2, 1) * 0.6)
    add(dry, t_res, impact() * 0.3)

    # chapter risers + impacts
    for ch in tl.get("chapters", [])[1:]:
        t = ch["start"]
        add(dry, t - bar, riser(bar) * 0.8)
        add(dry, t, impact() * 0.55)

    # sidechain pumping on pads/bass, then reverb on the wet bus
    wet *= (0.55 + 0.45 * pump)[:, None]
    ir = reverb_ir()
    rev = np.stack([signal.oaconvolve(wet[:, c], ir[:, c])[:total] for c in range(2)], 1)
    mix = dry * (0.75 + 0.25 * pump)[:, None] + wet * 0.75 + rev * 0.45
    mix = highpass(mix, 30)

    # fade out at the very end
    end_i = int(dur * SR)  # silent by the last frame
    fade = np.ones(total)
    f0 = int(max(t_res + 0.9, dur - 2.0) * SR)
    fade[f0:end_i] = np.linspace(1, 0, end_i - f0) ** 2
    fade[end_i:] = 0
    mix *= fade[:, None]
    mix = mix[: int(math.ceil(dur * SR))]

    # glue: soft knee compression + normalize
    env = np.abs(mix).max(1)
    env = signal.lfilter([1 - 0.9995], [1, -0.9995], env)
    gain = np.where(env > 0.25, (0.25 / np.maximum(env, 1e-9)) ** 0.4, 1.0)
    mix *= gain[:, None]
    peak = np.abs(mix).max()
    mix = mix / max(peak, 1e-9) * 0.89
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(ROOT, "audio", "music.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"music.wav {dur:.1f}s, peak {peak:.3f}")


if __name__ == "__main__":
    main()
