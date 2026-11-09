"""The U7–U9 tryouts campaign, for Google Ads Editor (Ad Grants).

Separate from build-campaigns.py so importing it never touches the always-on
campaigns. Unlike those, its ads may say "tryout": these tryouts have real
dates. Run from this folder: python3 build-tryouts-campaign.py
"""

import csv
import sys

SITE = "https://www.chulavistafc.com"
SD = ("San Diego County,California,United States", "9057154")
NAME = "CVFC - U7-U9 Tryouts Dec 2026"
BUDGET = 40  # Ad Grants' $329/day is already spoken for: see tryouts-campaign.md

# Older age groups, adult soccer and things that aren't a club.
NEG = ["adult", "adults", "men's league", "mens league", "coed", "over 30", "fifa",
       "video game", "cleats", "shoes", "jersey", "store", "tickets", "live stream",
       "score", "world cup", "high school", "middle school", "college", "salary",
       "indeed", "u10", "u11", "u12", "u13", "u14", "u15", "u16", "u17", "u19"]

COMMON = ["U7-U9 Soccer Tryouts", "Chula Vista FC Tryouts", "Players Born 2018 to 2021",
          "Girls Tryouts: Mon, Dec 7", "Boys Tryouts: Dec 8 and 9", "Sign Up Online in 2 Minutes",
          "At Victory Christian Academy", "Boys and Girls Welcome", "Youth Soccer in Chula Vista",
          "South Bay Club Since 1982", "Nonprofit Youth Soccer Club", "Bilingual Coaches and Staff",
          "A Club for Everyone"]

DESC = ["Tryouts for players born Aug 2018 to Jul 2021. Girls Dec 7, boys Dec 8 and 9.",
        "Sign up online in two minutes. We email you the date, time and what to bring.",
        "Chula Vista FC is a nonprofit club for everyone, in the South Bay since 1982.",
        "At Victory Christian Academy in Chula Vista. Boys and girls, U7 to U9."]


def ads(specific, url, p1, p2):
    # Two ads per ad group: A leads with the group's own angle, B with the club.
    a = (specific + COMMON)[:15]
    b = (COMMON[:5] + specific + COMMON[5:])[:15]
    return [dict(h=a, d=DESC, url=url, p1=p1, p2=p2),
            dict(h=b, d=DESC[2:] + DESC[:2], url=url, p1=p1, p2=p2)]


URL = SITE + "/tryouts"
GROUPS = [
    dict(name="Kids Tryouts", kw=["kids soccer tryouts", "soccer tryouts for kids",
         "youth soccer tryouts chula vista", "soccer tryouts chula vista",
         "u7 soccer tryouts", "u8 soccer tryouts", "u9 soccer tryouts",
         "club soccer tryouts for kids"],
         ads=ads(["Tryouts for Our Youngest", "Dates Set: Dec 7, 8 and 9"], URL, "Tryouts", "U7-U9")),
    dict(name="By Age", kw=["soccer for 6 year olds", "soccer for 7 year olds",
         "soccer for 8 year olds", "soccer team for 7 year old",
         "competitive soccer for kids", "club soccer for young kids"],
         ads=ads(["Club Soccer for Ages 5 to 8", "A First Club Team"], URL, "Tryouts", "Ages-5-8")),
    dict(name="Girls", kw=["girls soccer tryouts", "girls soccer chula vista",
         "youth girls soccer chula vista", "girls soccer team for kids",
         "girls club soccer for kids"],
         ads=ads(["Girls U7-U9 Tryouts", "Girls Tryouts, Chula Vista"],
                 URL + "?player=girls", "Tryouts", "Girls")),
    dict(name="Boys", kw=["boys soccer tryouts", "boys soccer chula vista",
         "youth boys soccer chula vista", "boys soccer team for kids",
         "boys club soccer for kids"],
         ads=ads(["Boys U7-U9 Tryouts", "Boys Tryouts, Chula Vista"],
                 URL + "?player=boys", "Tryouts", "Boys")),
]

HCOLS = [f"Headline {i}" for i in range(1, 16)]
DCOLS = [f"Description {i}" for i in range(1, 5)]
COLS = ["Campaign", "Campaign Type", "Networks", "Budget", "Budget type", "Bid Strategy Type",
        "Languages", "EU political ads", "Campaign Status", "Location", "Location ID", "Ad Group",
        "Ad Group Status", "Keyword", "Criterion Type", "Ad type", "Final URL", "Path 1", "Path 2",
        *HCOLS, *DCOLS]

rows, errs = [], []
rows.append({"Campaign": NAME, "Campaign Type": "Search", "Networks": "Google search",
             "Budget": BUDGET, "Budget type": "Daily", "Bid Strategy Type": "Maximize conversions",
             "Languages": "en", "EU political ads": "Doesn't have EU political ads",
             "Campaign Status": "Paused"})
rows.append({"Campaign": NAME, "Location": SD[0], "Location ID": SD[1]})
for n in NEG:
    rows.append({"Campaign": NAME, "Keyword": n, "Criterion Type": "Negative Phrase"})
for g in GROUPS:
    rows.append({"Campaign": NAME, "Ad Group": g["name"], "Ad Group Status": "Enabled"})
    for k in g["kw"]:
        if len(k.split()) < 2:
            errs.append(("single-word keyword", k))  # Ad Grants disallows these
        rows.append({"Campaign": NAME, "Ad Group": g["name"], "Keyword": k, "Criterion Type": "Phrase"})
    for a in g["ads"]:
        if len(set(a["h"])) != len(a["h"]):
            errs.append(("duplicate headline", g["name"]))
        r = {"Campaign": NAME, "Ad Group": g["name"], "Ad type": "Responsive search ad",
             "Final URL": a["url"], "Path 1": a["p1"], "Path 2": a["p2"]}
        for i, h in enumerate(a["h"]):
            if len(h) > 30:
                errs.append(("headline over 30", h, len(h)))
            if "!" in h or "free" in h.lower():
                errs.append(("policy", h))  # "free" only once the club confirms it
            r[HCOLS[i]] = h
        for i, d in enumerate(a["d"]):
            if len(d) > 90:
                errs.append(("description over 90", d, len(d)))
            if "free" in d.lower():
                errs.append(("policy", d))
            r[DCOLS[i]] = d
        for p in (a["p1"], a["p2"]):
            if len(p) > 15:
                errs.append(("path over 15", p))
        rows.append(r)

if errs:
    sys.stderr.write(f"Not written. Fix these first: {errs}\n")
    sys.exit(1)

with open("cvfc-tryouts-campaign.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=COLS)
    w.writeheader()
    w.writerows(rows)
sys.stdout.write(
    f"Wrote cvfc-tryouts-campaign.csv: {len(GROUPS)} ad groups, "
    f"{sum(len(g['ads']) for g in GROUPS)} ads, {sum(len(g['kw']) for g in GROUPS)} keywords, "
    f"{len(NEG)} negatives, ${BUDGET}/day\n")
