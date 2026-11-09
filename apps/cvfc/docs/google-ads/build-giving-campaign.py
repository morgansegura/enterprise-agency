"""Giving Tuesday (December 1) and year-end giving, for Google Ads Editor (Ad Grants).

Runs November 17 to December 31, 2026, beside the always-on Donate and Sponsor
campaign, on searches that only happen this time of year. Run from this
folder: python3 build-giving-campaign.py
"""

from campaign_csv import two_ads, write

SITE = "https://www.chulavistafc.com"
URL = SITE + "/support"
NAME = "CVFC - Giving Tuesday and Year-End 2026"
BUDGET = 40  # taken from Neighborhoods while it runs: see giving-campaign.md

NEG = ["jobs", "volunteer abroad", "car donation", "clothing donation", "used equipment",
       "furniture donation", "blood donation", "food bank", "toy drive", "salary"]

COMMON = ["Give on Giving Tuesday", "Donate to Chula Vista FC", "501(c)(3) Nonprofit Club",
          "Tax-Deductible Donations", "Fund a Player Scholarship", "Keep a Player on the Field",
          "Give Once or Monthly", "South Bay Club Since 1982", "A Club for Everyone",
          "Support South Bay Youth Soccer", "Every Gift Funds Players", "Year-End Giving, Made Easy"]

DESC = ["This Giving Tuesday, help a South Bay player stay on the field. Give once or monthly.",
        "Chula Vista FC is a 501(c)(3). Gifts are tax-deductible to the extent allowed by law.",
        "Your gift funds player scholarships, coaching and fields, in the South Bay since 1982.",
        "Give before December 31 for this year's taxes. Monthly gifts keep players playing."]

GROUPS = [
    dict(name="Giving Tuesday", kw=["giving tuesday", "giving tuesday donation",
         "giving tuesday nonprofits", "giving tuesday san diego", "donate on giving tuesday",
         "giving tuesday youth sports"],
         ads=two_ads(["Giving Tuesday Is December 1", "Give This Giving Tuesday"],
                     COMMON, DESC, URL, "Giving", "Tuesday")),
    dict(name="Year-End Giving", kw=["year end donation", "year end giving",
         "tax deductible donation", "donate before end of year", "end of year charitable giving",
         "charitable donation tax deduction"],
         ads=two_ads(["Give Before December 31", "A Year-End Gift That Counts"],
                     COMMON, DESC, URL, "Donate", "Year-End")),
    dict(name="Local Giving", kw=["donate to youth sports san diego", "san diego charities to donate to",
         "chula vista nonprofits", "local charities san diego", "youth charity san diego",
         "south bay nonprofits"],
         ads=two_ads(["Give Close to Home", "A Chula Vista Nonprofit"],
                     COMMON, DESC, URL, "Donate", "Local")),
]

write("cvfc-giving-campaign.csv", NAME, BUDGET, NEG, GROUPS)
