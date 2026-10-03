#!/usr/bin/env python3
"""Mix narration + procedural music + procedural SFX into audio/mix.wav.

Inputs: audio/narration.wav (mono), audio/music.wav (stereo), audio/events.json (from the page: window.__events()).
Music is ducked under the voice with a sidechain envelope; the result is loudness-normalized later in finalize.
SFX types: whoosh, swish, pop, tick, type, ding, impact, glitch, riser, shutter, boom, blip, rise_short, sparkle
"""
import json
import math
import os
import wave

import numpy as np
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
rng = np.random.default_rng(7)


def read_wav(path):
    with wave.open(path, "rb") as w:
        n, ch, sw, sr = w.getnframes(), w.getnchannels(), w.getsampwidth(), w.getframerate()
        assert sr == SR and sw == 2, (path, sr, sw)
        x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64) / 32768
    x = x.reshape(-1, ch)
    if ch == 1:
        x = np.repeat(x, 2, 1)
    return x


def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [max(1e-4, lo / (SR / 2)), min(0.99, hi / (SR / 2))], "band")
    return signal.lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = signal.butter(order, min(0.99, fc / (SR / 2)), "high")
    return signal.lfilter(b, a, x)


def lp(x, fc, order=2):
    b, a = signal.butter(order, min(0.99, fc / (SR / 2)), "low")
    return signal.lfilter(b, a, x)


def stereo(s, pan=0.5):
    return np.stack([s * math.cos(pan * math.pi / 2), s * math.sin(pan * math.pi / 2)], 1) * 1.414


def sweep_noise(dur, f0, f1, q=1.6):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blocks = 32
    for b in range(blocks):
        i0, i1 = b * n // blocks, (b + 1) * n // blocks
        fc = f0 * (f1 / f0) ** ((b + 0.5) / blocks)
        pad = 1500
        seg = bp(noise[max(0, i0 - pad):i1], fc / q, fc * q)[-(i1 - i0):]
        out[i0:i1] = seg
    return out


def sfx(kind):
    if kind == "whoosh":
        d = 0.75
        n = int(d * SR); t = np.arange(n) / SR; p = t / d
        s = sweep_noise(d, 300, 3500) * np.sin(np.pi * p) ** 2 * 0.9
        pans = np.linspace(0.2, 0.8, n)
        return np.stack([s * np.cos(pans * np.pi / 2), s * np.sin(pans * np.pi / 2)], 1) * 1.2
    if kind == "swish":
        d = 0.32
        n = int(d * SR); t = np.arange(n) / SR; p = t / d
        s = sweep_noise(d, 1200, 6000) * np.sin(np.pi * p) ** 2
        return stereo(s, 0.55) * 0.8
    if kind == "pop":
        d = 0.12
        n = int(d * SR); t = np.arange(n) / SR
        f = 900 * np.exp(-t * 18) + 380
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38)
        return stereo(s, 0.5) * 0.5
    if kind == "blip":
        d = 0.09
        n = int(d * SR); t = np.arange(n) / SR
        s = np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 55) + 0.4 * np.sin(2 * np.pi * 2640 * t) * np.exp(-t * 80)
        return stereo(s, 0.5) * 0.3
    if kind == "tick":
        d = 0.03
        n = int(d * SR); t = np.arange(n) / SR
        s = hp(rng.standard_normal(n), 3000) * np.exp(-t * 400)
        return stereo(s, 0.5) * 0.35
    if kind == "type":
        d = 0.05
        n = int(d * SR); t = np.arange(n) / SR
        s = bp(rng.standard_normal(n), 1800, 7000) * np.exp(-t * 220) + 0.3 * np.sin(2 * np.pi * 180 * t) * np.exp(-t * 120)
        return stereo(s, 0.45 + 0.1 * rng.random()) * 0.28
    if kind == "ding":
        d = 0.9
        n = int(d * SR); t = np.arange(n) / SR
        s = (np.sin(2 * np.pi * 1568 * t) + 0.5 * np.sin(2 * np.pi * 2349 * t) + 0.25 * np.sin(2 * np.pi * 3136 * t)) * np.exp(-t * 6)
        return stereo(s, 0.5) * 0.18
    if kind == "sparkle":
        d = 0.8
        n = int(d * SR); t = np.arange(n) / SR
        s = np.zeros(n)
        for k, f in enumerate([2093, 2637, 3136, 4186]):
            t0 = k * 0.06
            m = t >= t0
            s[m] += np.sin(2 * np.pi * f * (t[m] - t0)) * np.exp(-(t[m] - t0) * 9)
        return stereo(s, 0.5) * 0.10
    if kind in ("impact", "boom"):
        d = 1.6
        n = int(d * SR); t = np.arange(n) / SR
        boom = np.sin(2 * np.pi * np.cumsum(42 + 70 * np.exp(-t * 10)) / SR) * np.exp(-t * 3.2)
        air = lp(rng.standard_normal(n), 4000) * np.exp(-t * 8) * 0.25
        s = np.tanh(1.8 * (boom + air))
        return stereo(s, 0.5) * (0.55 if kind == "impact" else 0.4)
    if kind == "glitch":
        d = 0.36
        n = int(d * SR)
        s = np.zeros(n)
        pos = 0
        while pos < n:
            ln = int(rng.integers(300, 2400))
            if rng.random() < 0.6:
                seg = np.sign(np.sin(2 * np.pi * rng.uniform(80, 900) * np.arange(ln) / SR)) * 0.6
                seg += rng.standard_normal(ln) * 0.3
                s[pos:pos + ln] = seg[: max(0, min(ln, n - pos))]
            pos += ln
        s = np.round(s * 6) / 6
        return stereo(hp(s, 200), 0.5) * 0.22
    if kind == "riser":
        d = 1.6
        n = int(d * SR); t = np.arange(n) / SR; p = t / d
        s = sweep_noise(d, 300, 7000) * p ** 2.4 * 0.8 + np.sin(2 * np.pi * np.cumsum(220 + 880 * p ** 2) / SR) * p ** 3 * 0.12
        return stereo(s, 0.5)
    if kind == "rise_short":
        d = 0.6
        n = int(d * SR); t = np.arange(n) / SR; p = t / d
        s = sweep_noise(d, 600, 6000) * p ** 2 * 0.8
        return stereo(s, 0.5)
    if kind == "shutter":
        d = 0.18
        n = int(d * SR); t = np.arange(n) / SR
        s = hp(rng.standard_normal(n), 1500) * (np.exp(-t * 300) + (t > 0.07) * np.exp(-(t - 0.07).clip(0) * 260) * 0.8)
        return stereo(s, 0.5) * 0.4
    raise ValueError(kind)


def place(buf, at, x, gain):
    i0 = int(round(at * SR))
    if i0 < 0:
        x = x[-i0:]
        i0 = 0
    n = min(len(x), len(buf) - i0)
    if n > 0:
        buf[i0:i0 + n] += x[:n] * gain


def main():
    voice = read_wav(os.path.join(ROOT, "audio", "narration.wav"))
    music = read_wav(os.path.join(ROOT, "audio", "music.wav"))
    n = max(len(voice), len(music))
    voice = np.pad(voice, ((0, n - len(voice)), (0, 0)))
    music = np.pad(music, ((0, n - len(music)), (0, 0)))
    events = json.load(open(os.path.join(ROOT, "audio", "events.json"))) if os.path.exists(os.path.join(ROOT, "audio", "events.json")) else []

    fx = np.zeros((n, 2))
    cache = {}
    # per-type trims so dense UI texture (typing, ticks, shutters) stays under the voice
    TRIM = {"type": 0.55, "tick": 0.75, "shutter": 0.8, "blip": 0.85}
    for ev in events:
        k = ev["type"]
        if k not in cache:
            cache[k] = sfx(k)
        place(fx, ev["t"] + ev.get("offset", 0), cache[k], ev.get("gain", 0.6) * TRIM.get(k, 1.0))

    # sidechain: envelope of the voice (attack 25 ms, release 350 ms)
    v = np.abs(voice[:, 0])
    a_att = math.exp(-1 / (0.025 * SR))
    a_rel = math.exp(-1 / (0.35 * SR))
    # fast approximate envelope: peak per 10 ms block then smooth
    blk = int(0.01 * SR)
    nb = int(math.ceil(n / blk))
    pk = np.pad(v, (0, nb * blk - n)).reshape(nb, blk).max(1)
    env = np.zeros(nb)
    e = 0.0
    for i in range(nb):
        x = pk[i]
        coef = 0.45 if x > e else 0.9715  # per-10ms block: ~25 ms attack, ~350 ms release
        e = coef * e + (1 - coef) * x
        env[i] = e
    env = np.repeat(env, blk)[:n]
    env = np.clip(env / 0.12, 0, 1)
    duck = 1 - 0.74 * env  # about -11.7 dB under speech
    mus = music * duck[:, None] * 0.30
    fx_bus = fx * 0.62 * (1 - 0.35 * env)[:, None]  # effects also step back a little while the voice speaks
    # dialogue-aware auto-duck: wherever the background (music + effects) comes closer than 11 dB to the voice,
    # pull it down by the shortfall (max 6 dB), smoothed so it breathes instead of pumping
    bgsum = mus + fx_bus
    blk2 = int(0.05 * SR)
    nb2 = int(math.ceil(n / blk2))
    pad = nb2 * blk2 - n
    vrms = np.sqrt((np.pad(voice[:, 0], (0, pad)) ** 2).reshape(nb2, blk2).mean(1))
    brms = np.sqrt((np.pad(bgsum.mean(1), (0, pad)) ** 2).reshape(nb2, blk2).mean(1))
    speech = vrms > 0.02
    need = np.where(speech, 11.0 - 20 * np.log10(np.maximum(vrms, 1e-6) / np.maximum(brms, 1e-6)), 0.0)
    red_db = np.clip(need, 0, 6.0)
    sm = np.zeros(nb2)
    acc = 0.0
    for i in range(nb2):  # attack 1 block, release ~0.4 s
        acc = red_db[i] if red_db[i] > acc else acc * 0.88 + red_db[i] * 0.12
        sm[i] = acc
    gain = np.repeat(10 ** (-sm / 20), blk2)[:n]
    mix = voice * 1.0 + bgsum * gain[:, None]
    peak = np.abs(mix).max()
    if peak > 0.98:
        mix *= 0.98 / peak
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
    out = os.path.join(ROOT, "audio", "mix.wav")
    with wave.open(out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"mix.wav {n / SR:.1f}s, {len(events)} sfx events, peak {peak:.3f}")


if __name__ == "__main__":
    main()
