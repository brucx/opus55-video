#!/usr/bin/env python3
"""Case-wall thumbnails for the explainer video.

Run with the project venv (Pillow):
  .venv/bin/python tools/build_wall.py candidates [n_x n_bili]  # pick pool, download, crop, labeled contact sheets
  .venv/bin/python tools/build_wall.py sheets [ids...]       # re-draw labeled sheets (optionally for given ids)
  .venv/bin/python tools/build_wall.py frames              # real video frames for featured cases with blank posters
  .venv/bin/python tools/build_wall.py finalize <ids file>   # copy chosen thumbs to assets/wall + manifest + 10x6 preview

Reads /home/box/orca/projects/opus55/data/all_cases.json (read-only). Writes only inside this project.
"""
import concurrent.futures as cf
import io
import json
import os
import re
import shutil
import sys
import urllib.request

from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageStat

SRC = "/home/box/orca/projects/opus55/data/all_cases.json"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGE = os.path.join(ROOT, "research", "cases", "sheets", "wall-candidates")
RAW = os.path.join(STAGE, "raw")
THUMB = os.path.join(STAGE, "thumb")
WALL = os.path.join(ROOT, "assets", "wall")
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
W, H = 480, 270

FEATURED = ["lists-006", "gosail-060", "uc-0962", "uc-1377", "gosail-072", "gosail-054", "uc-2348", "gosail-133"]


def load_cases():
    data = json.load(open(SRC, encoding="utf-8"))
    return {c["id"]: c for c in data["cases"]}


def host(url):
    return url.split("/")[2] if url else ""


def eligible(c):
    p = c.get("poster") or ""
    h = host(p)
    return c["category"] == "video" and (h == "pbs.twimg.com" or h.endswith("hdslb.com"))


def media_key(poster):
    m = re.search(r"/(amplify_video_thumb|ext_tw_video_thumb|tweet_video_thumb|media)/([\w-]+)", poster)
    return m.group(2) if m else poster


def fetch_url(poster):
    if host(poster) == "pbs.twimg.com":
        base = poster.split("?")[0]
        return base + "?format=jpg&name=medium"
    return poster.replace("http://", "https://")


def select_pool(cases, n_x=100, n_bili=28, per_author=1):
    pool = [c for c in cases.values() if eligible(c)]
    # dedupe by underlying media, keep the most-liked record
    best = {}
    for c in pool:
        k = media_key(c["poster"])
        if k not in best or (c.get("likes") or 0) > (best[k].get("likes") or 0):
            best[k] = c
    pool = list(best.values())
    pool.sort(key=lambda c: -(c.get("likes") or 0))
    chosen, authors, keys = [], {}, set()
    for cid in FEATURED:
        c = cases[cid]
        chosen.append(c)
        authors[c["author"]] = authors.get(c["author"], 0) + 1
        keys.add(media_key(c["poster"]))

    def take(items, limit):
        added = 0
        for c in items:
            if added >= limit:
                break
            if c["id"] in {x["id"] for x in chosen} or media_key(c["poster"]) in keys:
                continue
            if authors.get(c["author"], 0) >= per_author:
                continue
            chosen.append(c)
            keys.add(media_key(c["poster"]))
            authors[c["author"]] = authors.get(c["author"], 0) + 1
            added += 1

    take([c for c in pool if "twimg" in c["poster"]], n_x)
    take([c for c in pool if "hdslb" in c["poster"]], n_bili)
    return chosen


def download(c):
    os.makedirs(RAW, exist_ok=True)
    dest = os.path.join(RAW, c["id"] + ".img")
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        return c["id"], dest, None
    url = fetch_url(c["poster"])
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/avif,image/webp,image/*,*/*;q=0.8"})
        with urllib.request.urlopen(req, timeout=40) as r:
            body = r.read()
        Image.open(io.BytesIO(body)).verify()
        with open(dest, "wb") as f:
            f.write(body)
        return c["id"], dest, None
    except Exception as e:  # noqa: BLE001 - report and continue
        return c["id"], None, f"{type(e).__name__}: {e}"


def to_thumb(raw_path, out_path):
    im = Image.open(raw_path)
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (0, 0, 0, 255))
        im = Image.alpha_composite(bg, im)
    im = im.convert("RGB")
    w, h = im.size
    target = W / H
    if w / h > target:
        nw = round(h * target)
        left = (w - nw) // 2
        box = (left, 0, left + nw, h)
    else:
        nh = round(w / target)
        top = (h - nh) // 2
        box = (0, top, w, top + nh)
    out = im.crop(box).resize((W, H), Image.LANCZOS)
    out.save(out_path, "JPEG", quality=88, optimize=True)
    return {"srcSize": [w, h], "srcAspect": round(w / h, 3)}


def image_stats(path):
    im = Image.open(path).convert("L")
    st = ImageStat.Stat(im)
    mean, std = st.mean[0], st.stddev[0]
    # crude "flatness": share of pixels close to the dominant tone
    hist = im.histogram()
    peak = max(range(256), key=lambda i: hist[i])
    near = sum(hist[max(0, peak - 6):min(256, peak + 7)]) / (im.width * im.height)
    return {"mean": round(mean, 1), "std": round(std, 1), "dominantShare": round(near, 3)}


def font(size):
    try:
        return ImageFont.truetype(FONT, size)
    except OSError:
        return ImageFont.load_default(size=size)


def sheet(entries, out_path, cols=6, tw=320, label=True):
    th = round(tw * H / W)
    pad = 6
    lab_h = 22 if label else 0
    rows = (len(entries) + cols - 1) // cols
    img = Image.new("RGB", (cols * (tw + pad) + pad, rows * (th + lab_h + pad) + pad), (24, 24, 24))
    d = ImageDraw.Draw(img)
    f = font(15)
    for i, (cid, path, text) in enumerate(entries):
        r, c = divmod(i, cols)
        x = pad + c * (tw + pad)
        y = pad + r * (th + lab_h + pad)
        try:
            t = Image.open(path).convert("RGB").resize((tw, th), Image.LANCZOS)
            img.paste(t, (x, y))
        except Exception:  # noqa: BLE001
            d.rectangle([x, y, x + tw, y + th], fill=(120, 0, 0))
        if label:
            d.text((x + 2, y + th + 2), text[:40], fill=(235, 235, 235), font=f)
    img.save(out_path, "JPEG", quality=85)
    return out_path


def cmd_candidates(n_x=100, n_bili=28):
    cases = load_cases()
    prev = set()
    cpath = os.path.join(STAGE, "candidates.json")
    if os.path.exists(cpath):
        prev = {r["caseId"] for r in json.load(open(cpath, encoding="utf-8"))}
    pool = select_pool(cases, n_x=n_x, n_bili=n_bili)
    os.makedirs(THUMB, exist_ok=True)
    results = {}
    with cf.ThreadPoolExecutor(max_workers=8) as ex:
        for cid, path, err in ex.map(download, pool):
            results[cid] = (path, err)
    rows = []
    for c in pool:
        path, err = results[c["id"]]
        row = {"caseId": c["id"], "author": c["author"], "title": c["title"], "title_en": c.get("title_en"),
               "platform": c["platform"], "likes": c.get("likes"), "views": c.get("views"),
               "poster": c["poster"], "featured": c["id"] in FEATURED, "error": err}
        if path:
            tpath = os.path.join(THUMB, c["id"] + ".jpg")
            try:
                row.update(to_thumb(path, tpath))
                row.update(image_stats(tpath))
                row["thumb"] = tpath
            except Exception as e:  # noqa: BLE001
                row["error"] = f"thumb: {e}"
        rows.append(row)
    with open(os.path.join(STAGE, "candidates.json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    ok = [r for r in rows if r.get("thumb")]
    print(f"pool {len(pool)} ok {len(ok)} errors {[ (r['caseId'], r['error']) for r in rows if r.get('error')]}")
    flagged = [(r["caseId"], r["mean"], r["std"], r["dominantShare"]) for r in ok if r["std"] < 18 or r["mean"] < 14 or r["dominantShare"] > 0.6]
    print("auto-flagged (flat/dark):", flagged)
    new = [r for r in ok if r["caseId"] not in prev]
    if prev and new:
        print("new candidates:", len(new))
        draw_sheets(new, prefix="new")
    else:
        draw_sheets(ok)


def draw_sheets(ok, prefix="cand"):
    per = 30
    outs = []
    for i in range(0, len(ok), per):
        chunk = ok[i:i + per]
        entries = [(r["caseId"], r["thumb"], f"{r['caseId']} {r.get('likes') or '-'} {r['author']}") for r in chunk]
        outs.append(sheet(entries, os.path.join(STAGE, f"{prefix}-{i // per + 1:02d}.jpg"), cols=6, tw=320))
    print("\n".join(outs))


def cmd_sheets(ids):
    rows = json.load(open(os.path.join(STAGE, "candidates.json"), encoding="utf-8"))
    ok = [r for r in rows if r.get("thumb")]
    if ids:
        by = {r["caseId"]: r for r in ok}
        ok = [by[i] for i in ids if i in by]
    draw_sheets(ok, prefix="pick" if ids else "cand")


# Featured cases whose X poster is a blank first frame (or too plain) get a real frame from the work itself.
VR = "/home/box/orca/projects/opus55/draft_f87d65c6_folder/visual-review"  # read-only prior-session copies
FRAME_SPECS = {
    "lists-006": {"src": f"{VR}/lists-006-publication.mp4", "t": [2.8],
                  "why": "poster is the plain end-state 'Generate' button; 2.8s shows the music-player state"},
    "gosail-060": {"src": f"{VR}/gosail-060.mp4", "t": [39],
                   "why": "poster is a blank paper-colored first frame"},
    "uc-0962": {"src": f"{VR}/uc-0962-publication.mp4", "t": [75],
                "why": "poster is a near-black first frame; 75s is the frame used in the article"},
    "uc-1377": {"src": f"{VR}/uc-1377-publication.mp4", "t": [125.5], "precrop": [0, 86, 1280, 634],
                "why": "poster is a near-black first frame; 125.5s is the frame used in the article; letterbox removed (ffmpeg cropdetect 1280:548:0:86)"},
    "gosail-054": {"src": os.path.join(ROOT, "research", "cases", "video", "2103988134069617127.mp4"), "t": [22.5, 25.5, 27],
                   "mode": "triptych",
                   "why": "poster is blank white and the video is 9:16; three colorway frames placed side by side"},
}


# Display credit when the posting account is not the maker (verified against the post text).
CREDIT_OVERRIDES = {
    "uc-0155": {"credit": "@kevin_t_ngo", "creditNote": "Short created by @kevin_t_ngo; posted by @claudeai ('A short story about a watermelon created by @kevin_t_ngo')."},
}


def center_crop_resize(im):
    w, h = im.size
    target = W / H
    if w / h > target:
        nw = round(h * target)
        left = (w - nw) // 2
        box = (left, 0, left + nw, h)
    else:
        nh = round(w / target)
        top = (h - nh) // 2
        box = (0, top, w, top + nh)
    return im.crop(box).resize((W, H), Image.LANCZOS)


def cmd_frames():
    import subprocess
    fdir = os.path.join(STAGE, "frames")
    os.makedirs(fdir, exist_ok=True)
    sources = {}
    for cid, spec in FRAME_SPECS.items():
        frames = []
        for t in spec["t"]:
            png = os.path.join(fdir, f"{cid}@{t}.png")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", spec["src"], "-frames:v", "1", png], check=True)
            im = Image.open(png).convert("RGB")
            if spec.get("precrop"):
                im = im.crop(tuple(spec["precrop"]))
            frames.append(im)
        if spec.get("mode") == "triptych":
            fw, fh = frames[0].size
            strip = Image.new("RGB", (fw * len(frames), fh))
            for i, f in enumerate(frames):
                strip.paste(f.resize((fw, fh)), (i * fw, 0))
            src_im = strip
        else:
            src_im = frames[0]
        poster_thumb = os.path.join(THUMB, cid + ".jpg")
        if os.path.exists(poster_thumb) and not os.path.exists(os.path.join(THUMB, cid + ".poster.jpg")):
            shutil.copyfile(poster_thumb, os.path.join(THUMB, cid + ".poster.jpg"))
        center_crop_resize(src_im).save(poster_thumb, "JPEG", quality=88, optimize=True)
        label = "video-frame" if len(spec["t"]) == 1 else "video-frames"
        sources[cid] = {"imageSource": f"{label}@" + "/".join(f"{t}s" for t in spec["t"]),
                        "frameFrom": spec["src"], "reason": spec["why"]}
        print(cid, sources[cid]["imageSource"], src_im.size)
    with open(os.path.join(STAGE, "frame-sources.json"), "w", encoding="utf-8") as f:
        json.dump(sources, f, ensure_ascii=False, indent=2)


def avg_rgb(path):
    im = Image.open(path).convert("RGB").resize((16, 9), Image.BILINEAR)
    st = ImageStat.Stat(im)
    return [round(v, 1) for v in st.mean]


def arrange(ids, cols=10):
    """Greedy grid order: each cell takes the remaining tile most different from its left/top neighbours."""
    col = {i: avg_rgb(os.path.join(THUMB, i + ".jpg")) for i in ids}

    def dist(a, b):
        return sum((x - y) ** 2 for x, y in zip(col[a], col[b])) ** 0.5

    remaining = list(ids)
    order = [remaining.pop(0)]
    while remaining:
        k = len(order)
        neigh = []
        if k % cols:
            neigh.append(order[k - 1])
        if k >= cols:
            neigh.append(order[k - cols])
        best = max(remaining, key=lambda r: (min(dist(r, n) for n in neigh) if neigh else 0, -ids.index(r)))
        remaining.remove(best)
        order.append(best)
    return order, col


def cmd_finalize(ids_file):
    ids = [ln.split("#")[0].strip() for ln in open(ids_file, encoding="utf-8")]
    ids = [i for i in ids if i]
    assert len(ids) == len(set(ids)), "duplicate ids"
    missing = [i for i in FEATURED if i not in ids]
    assert not missing, f"featured cases missing: {missing}"
    cases = load_cases()
    fsrc_path = os.path.join(STAGE, "frame-sources.json")
    fsrc = json.load(open(fsrc_path, encoding="utf-8")) if os.path.exists(fsrc_path) else {}
    order, col = arrange(ids)
    os.makedirs(WALL, exist_ok=True)
    keep = {i + ".jpg" for i in ids}
    for name in os.listdir(WALL):
        if name.endswith(".jpg") and name not in keep:
            os.remove(os.path.join(WALL, name))
    manifest = []
    for n, cid in enumerate(order):
        src = os.path.join(THUMB, cid + ".jpg")
        dst = os.path.join(WALL, cid + ".jpg")
        shutil.copyfile(src, dst)
        im = Image.open(dst)
        assert im.size == (W, H) and im.format == "JPEG", (cid, im.size, im.format)
        c = cases[cid]
        assert c["category"] == "video", cid
        row = {"caseId": cid, "author": c["author"], "title": c["title"], "title_en": c.get("title_en"),
               "platform": c["platform"], "likes": c.get("likes"), "views": c.get("views"), "date": c.get("date"),
               "featured": cid in FEATURED, "sourceUrl": c.get("sourceUrl"), "poster": c["poster"],
               "imageSource": "poster", "file": f"assets/wall/{cid}.jpg",
               "grid10x6": {"index": n, "row": n // 10, "col": n % 10}, "avgRGB": col[cid]}
        row["credit"] = c["author"]
        row.update(CREDIT_OVERRIDES.get(cid, {}))
        if cid in fsrc:
            row.update({k: fsrc[cid][k] for k in ("imageSource", "reason")})
        manifest.append(row)
    with open(os.path.join(WALL, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    entries = [(m["caseId"], os.path.join(ROOT, m["file"]), m["caseId"]) for m in manifest]
    sheets_dir = os.path.join(ROOT, "research", "cases", "sheets")
    prev = sheet(entries, os.path.join(sheets_dir, "wall-preview-10x6.jpg"), cols=10, tw=192, label=False)
    lab = sheet(entries, os.path.join(sheets_dir, "wall-preview-10x6-labeled.jpg"), cols=10, tw=192, label=True)
    print(f"{len(manifest)} thumbs -> {WALL}\n{prev}\n{lab}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    cmd = sys.argv[1]
    if cmd == "candidates":
        args = [int(a) for a in sys.argv[2:4]]
        cmd_candidates(*args)
    elif cmd == "sheets":
        cmd_sheets(sys.argv[2:])
    elif cmd == "frames":
        cmd_frames()
    elif cmd == "finalize":
        cmd_finalize(sys.argv[2])
    else:
        print(__doc__)
        sys.exit(2)
