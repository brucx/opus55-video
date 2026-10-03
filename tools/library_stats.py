#!/usr/bin/env python3
"""Case-library statistics for the explainer video (read-only over the opus55 project).

Usage: python3 tools/library_stats.py
Writes research/library-stats.json next to this tool's project root.
"""
import collections
import json
import os

SRC = "/home/box/orca/projects/opus55/data/all_cases.json"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "research", "library-stats.json")

PROMPT_LABELS = {"Prompt source", "Related-post prompt source", "Prompt image (not transcribed)", "Styles & prompts"}


def dist(items, key, key_en=None):
    c = collections.Counter(x.get(key) for x in items)
    rows = []
    en = {}
    if key_en:
        for x in items:
            en.setdefault(x.get(key), x.get(key_en))
    for k, n in c.most_common():
        row = {"value": k, "count": n, "share": round(n / len(items), 4)}
        if key_en:
            row["value_en"] = en.get(k)
        rows.append(row)
    return rows


def date_range(items):
    ds = sorted(x["date"] for x in items if x.get("date"))
    return {"min": ds[0], "max": ds[-1], "withDate": len(ds), "missingDate": len(items) - len(ds)}


def top(items, key, n=15):
    ranked = sorted((x for x in items if isinstance(x.get(key), (int, float))), key=lambda x: -x[key])[:n]
    return [{
        "rank": i + 1,
        "id": x["id"],
        "title": x["title"],
        "title_en": x.get("title_en"),
        "author": x["author"],
        "platform": x["platform"],
        "likes": x.get("likes"),
        "views": x.get("views"),
        "date": x.get("date"),
        "poster": x.get("poster") or None,
        "sourceUrl": x.get("sourceUrl"),
    } for i, x in enumerate(ranked)]


def main():
    data = json.load(open(SRC, encoding="utf-8"))
    meta, cases = data["meta"], data["cases"]
    cats = meta["categories"]
    video = [x for x in cases if x["category"] == "video"]

    cat_counts = collections.Counter(x["category"] for x in cases)
    category_rows = [{"category": k, "zh": cats[k]["zh"], "en": cats[k]["en"], "count": n,
                      "share": round(n / len(cases), 4)} for k, n in cat_counts.most_common()]

    pe_ids = {x["id"] for x in video if x.get("promptEvidence")}
    res_ids = {x["id"] for x in video if x.get("resources")}
    prompt_res_ids = {x["id"] for x in video
                      if any(r.get("label_en") in PROMPT_LABELS for r in (x.get("resources") or []))}
    label_counts = collections.Counter()
    for x in video:
        for r in x.get("resources") or []:
            label_counts[(r.get("label"), r.get("label_en"))] += 1
    pe_kind = collections.Counter(p.get("kindReported") for x in video for p in (x.get("promptEvidence") or []))
    pe_verified = collections.Counter(str(p.get("completenessVerified")) for x in video for p in (x.get("promptEvidence") or []))

    per_day = collections.Counter(x.get("date") or "unknown" for x in video)
    poster_hosts = collections.Counter(((x.get("poster") or "").split("/")[2] if x.get("poster") else "none") for x in video)

    stats = {
        "source": SRC,
        "computedAt": "2026-10-01",
        "libraryMeta": {k: meta.get(k) for k in ("asOf", "count", "refreshedAt", "lastFullRefreshAt", "baseFetchedAt", "refreshScope")},
        "totalCases": len(cases),
        "categories": category_rows,
        "video": {
            "category": "video",
            "zh": cats["video"]["zh"],
            "en": cats["video"]["en"],
            "count": len(video),
            "shareOfLibrary": round(len(video) / len(cases), 4),
            "matchesArticle1704": len(video) == 1704,
            "evidenceType": dist(video, "evidenceType", "evidenceType_en"),
            "source": dist(video, "source"),
            "platform": dist(video, "platform"),
            "mediaKind": dist(video, "mediaKind"),
            "dateRange": date_range(video),
            "casesPerDay": dict(sorted(per_day.items())),
            "posterHosts": dict(poster_hosts.most_common()),
            "publicPrompts": {
                "withPromptEvidence": len(pe_ids),
                "withResources": len(res_ids),
                "withPromptEvidenceOrResources": len(pe_ids | res_ids),
                "withPromptEvidenceOrPromptLabeledResource": len(pe_ids | prompt_res_ids),
                "promptEvidenceEntriesByKindReported": dict(pe_kind),
                "promptEvidenceCompletenessVerified": dict(pe_verified),
                "resourceLinkLabels": [{"label": a, "label_en": b, "links": n} for (a, b), n in label_counts.most_common()],
                "note": "promptEvidence = public post text retrieved with the upstream prompt classification (brief/full) kept; "
                        "completenessVerified is false for every entry, i.e. the public text is not verified as the full prompt/session. "
                        "'resources' also contains non-prompt links (related work, repos, guides), so the strict prompt count is "
                        "withPromptEvidenceOrPromptLabeledResource; withPromptEvidenceOrResources is the broader 'has public prompt or linked material' count.",
            },
            "metricsCoverage": {
                "likesMissing": sum(1 for x in video if x.get("likes") is None),
                "viewsMissing": sum(1 for x in video if x.get("views") is None),
                "metricsCheckedAtPresent": sum(1 for x in video if x.get("metricsCheckedAt")),
                "note": "likes/views are platform-native counters captured at metricsCheckedAt (X likes/views, Bilibili likes/plays, etc.) "
                        "and are not comparable across platforms; Reddit/GitHub/HN rows mostly lack them.",
            },
            "topByLikes": top(video, "likes"),
            "topByViews": top(video, "views"),
        },
        "overallDateRange": date_range(cases),
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    v = stats["video"]
    print(OUT)
    print("total", stats["totalCases"], "video", v["count"], "share", v["shareOfLibrary"])
    print("evidenceType", [(r["value"], r["count"]) for r in v["evidenceType"]])
    print("platform", [(r["value"], r["count"]) for r in v["platform"]])
    print("dates", v["dateRange"], "overall", stats["overallDateRange"])
    print("prompts", {k: v["publicPrompts"][k] for k in ("withPromptEvidence", "withResources", "withPromptEvidenceOrResources", "withPromptEvidenceOrPromptLabeledResource")})


if __name__ == "__main__":
    main()
