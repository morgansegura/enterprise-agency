"""Writes one Ad Grants Search campaign as a Google Ads Editor import file,
after checking it against the Ad Grant and ad-length rules. Shared by the
seasonal campaign builders."""

import csv
import sys

SD = ("San Diego County,California,United States", "9057154")
HCOLS = [f"Headline {i}" for i in range(1, 16)]
DCOLS = [f"Description {i}" for i in range(1, 5)]
COLS = ["Campaign", "Campaign Type", "Networks", "Budget", "Budget type", "Bid Strategy Type",
        "Languages", "EU political ads", "Campaign Status", "Location", "Location ID", "Ad Group",
        "Ad Group Status", "Keyword", "Criterion Type", "Ad type", "Final URL", "Path 1", "Path 2",
        *HCOLS, *DCOLS]


def two_ads(specific, common, desc, url, p1, p2):
    """Two ads per ad group: A leads with the group's own angle, B with the club."""
    a = (specific + common)[:15]
    b = (common[:5] + specific + common[5:])[:15]
    return [dict(h=a, d=desc, url=url, p1=p1, p2=p2),
            dict(h=b, d=desc[2:] + desc[:2], url=url, p1=p1, p2=p2)]


def write(path, name, budget, negatives, groups):
    rows, errs = [], []
    rows.append({"Campaign": name, "Campaign Type": "Search", "Networks": "Google search",
                 "Budget": budget, "Budget type": "Daily", "Bid Strategy Type": "Maximize conversions",
                 "Languages": "en", "EU political ads": "Doesn't have EU political ads",
                 "Campaign Status": "Paused"})
    rows.append({"Campaign": name, "Location": SD[0], "Location ID": SD[1]})
    for n in negatives:
        rows.append({"Campaign": name, "Keyword": n, "Criterion Type": "Negative Phrase"})
    for g in groups:
        rows.append({"Campaign": name, "Ad Group": g["name"], "Ad Group Status": "Enabled"})
        for k in g["kw"]:
            if len(k.split()) < 2:
                errs.append(("single-word keyword", k))  # Ad Grants disallows these
            rows.append({"Campaign": name, "Ad Group": g["name"], "Keyword": k, "Criterion Type": "Phrase"})
        for a in g["ads"]:
            if len(set(a["h"])) != len(a["h"]):
                errs.append(("duplicate headline", g["name"]))
            r = {"Campaign": name, "Ad Group": g["name"], "Ad type": "Responsive search ad",
                 "Final URL": a["url"], "Path 1": a["p1"], "Path 2": a["p2"]}
            for i, h in enumerate(a["h"]):
                if len(h) > 30:
                    errs.append(("headline over 30", h, len(h)))
                if "!" in h:
                    errs.append(("policy", h))
                r[HCOLS[i]] = h
            for i, d in enumerate(a["d"]):
                if len(d) > 90:
                    errs.append(("description over 90", d, len(d)))
                r[DCOLS[i]] = d
            for p in (a["p1"], a["p2"]):
                if len(p) > 15:
                    errs.append(("path over 15", p))
            rows.append(r)

    if errs:
        sys.stderr.write(f"Not written. Fix these first: {errs}\n")
        sys.exit(1)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLS)
        w.writeheader()
        w.writerows(rows)
    sys.stdout.write(
        f"Wrote {path}: {len(groups)} ad groups, {sum(len(g['ads']) for g in groups)} ads, "
        f"{sum(len(g['kw']) for g in groups)} keywords, {len(negatives)} negatives, ${budget}/day\n")
