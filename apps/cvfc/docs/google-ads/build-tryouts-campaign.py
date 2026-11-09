"""The U7–U9 tryouts campaign, for Google Ads Editor (Ad Grants).

Separate from build-campaigns.py so importing it never touches the always-on
campaigns. Unlike those, its ads may say "tryout": these tryouts have real
dates. Run from this folder: python3 build-tryouts-campaign.py
"""

from campaign_csv import two_ads, write

SITE = "https://www.chulavistafc.com"
NAME = "CVFC - U7-U9 Tryouts Dec 2026"
BUDGET = 40  # Ad Grants' $329/day is already spoken for: see tryouts-campaign.md

# Older age groups, adult soccer and things that aren't a club.
NEG = ["adult", "adults", "men's league", "mens league", "coed", "over 30", "fifa",
       "video game", "cleats", "shoes", "jersey", "store", "tickets", "live stream",
       "score", "world cup", "high school", "middle school", "college", "salary",
       "indeed", "u10", "u11", "u12", "u13", "u14", "u15", "u16", "u17", "u19"]

COMMON = ["Free U7-U9 Soccer Tryouts", "Chula Vista FC Tryouts", "Players Born 2018 to 2021",
          "Girls Tryouts: Mon, Dec 7", "Boys Tryouts: Dec 8 and 9", "Sign Up Online in 2 Minutes",
          "At Victory Christian Academy", "Boys and Girls Welcome", "Youth Soccer in Chula Vista",
          "South Bay Club Since 1982", "Nonprofit Youth Soccer Club", "Bilingual Coaches and Staff",
          "A Club for Everyone"]

DESC = ["Free tryouts for players born Aug 2018 to Jul 2021. Girls Dec 7, boys Dec 8, 9.",
        "Sign up online in two minutes. We email you the date, time and what to bring.",
        "Chula Vista FC is a nonprofit club for everyone, in the South Bay since 1982.",
        "At Victory Christian Academy in Chula Vista. Boys and girls, U7 to U9."]


def ads(specific, url, p1, p2):
    return two_ads(specific, COMMON, DESC, url, p1, p2)


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

write("cvfc-tryouts-campaign.csv", NAME, BUDGET, NEG, GROUPS)
