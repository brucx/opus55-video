#!/usr/bin/env python3
"""Read a public X post through the syndication endpoint (fxtwitter is behind a challenge).

Usage:
  python3 tools/xpost.py <tweet_id>                 # print JSON summary
  python3 tools/xpost.py <tweet_id> --download DIR  # also save the best mp4 as DIR/<tweet_id>.mp4
"""
import json
import os
import sys
import urllib.request


def token(tweet_id: str) -> str:
    # Same token derivation the embed widget uses: ((id / 1e15) * pi) in base 36, zeros and dots removed.
    import math
    x = (int(tweet_id) / 1e15) * math.pi
    digits = "0123456789abcdefghijklmnopqrstuvwxyz"
    ip = int(x)
    fp = x - ip
    s = ""
    if ip == 0:
        s = "0"
    while ip > 0:
        s = digits[ip % 36] + s
        ip //= 36
    frac = ""
    for _ in range(12):
        fp *= 36
        d = int(fp)
        frac += digits[d]
        fp -= d
    out = s + "." + frac
    return "".join(ch for ch in out if ch not in "0.")


def fetch(tweet_id: str) -> dict:
    url = f"https://cdn.syndication.twimg.com/tweet-result?id={tweet_id}&token={token(tweet_id)}&lang=en"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def summarize(d: dict) -> dict:
    media = []
    for m in d.get("mediaDetails", []) or []:
        vi = m.get("video_info") or {}
        mp4s = [v for v in vi.get("variants", []) if v.get("content_type") == "video/mp4"]
        mp4s.sort(key=lambda v: v.get("bitrate") or 0)
        media.append({
            "type": m.get("type"),
            "poster": m.get("media_url_https"),
            "durationMs": vi.get("duration_millis"),
            "aspect": vi.get("aspect_ratio"),
            "mp4": [{"bitrate": v.get("bitrate"), "url": v.get("url")} for v in mp4s],
        })
    user = d.get("user") or {}
    return {
        "id": d.get("id_str"),
        "author": "@" + (user.get("screen_name") or ""),
        "name": user.get("name"),
        "created": d.get("created_at"),
        "text": d.get("text"),
        "lang": d.get("lang"),
        "inReplyTo": d.get("in_reply_to_status_id_str"),
        "quoted": (d.get("quoted_tweet") or {}).get("id_str"),
        "favorites": d.get("favorite_count"),
        "conversationCount": d.get("conversation_count"),
        "media": media,
    }


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    tid = sys.argv[1]
    d = fetch(tid)
    s = summarize(d)
    if "--download" in sys.argv:
        out_dir = sys.argv[sys.argv.index("--download") + 1]
        os.makedirs(out_dir, exist_ok=True)
        best = None
        for m in s["media"]:
            if m["mp4"]:
                best = m["mp4"][-1]["url"]
                break
        if best:
            dest = os.path.join(out_dir, f"{tid}.mp4")
            req = urllib.request.Request(best, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
                f.write(r.read())
            s["downloaded"] = {"url": best, "path": dest}
    print(json.dumps(s, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
