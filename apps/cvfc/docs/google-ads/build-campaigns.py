import csv
SITE="https://www.chulavistafc.com"
SD=("San Diego County,California,United States","9057154")
TJ=("Tijuana,Baja California,Mexico","1010012")

COMMON=["Chula Vista FC","A Club for Everyone","The People's Club","Year-Round Player Evaluations","Free Player Evaluations",
 "A Coach Replies in 48 Hours","Boys and Girls, Ages 4 to U19","South Bay Club Since 1982","Nonprofit Youth Soccer Club",
 "MLS NEXT, EA, DPL and NPL","Bilingual Coaches and Staff","Request an Evaluation Today","Every Family Is Welcome","Financial Aid Available"]
DESC_EVAL=["Year-round evaluations for boys and girls. Request online and a coach replies in 48 hours.",
 "A club for everyone, the people's club. Nonprofit and in the South Bay since 1982.",
 "From Mini Maestros to MLS NEXT, Elite Academy, DPL and NPL. One club, one pathway.",
 "New to the area or switching clubs? We evaluate year-round and place every player well."]

def ads(specific, desc, url, p1, p2):
    # Two ads per ad group: A leads with the ad group's own angle, B with the club.
    pool=[h for h in specific+COMMON]
    a=pool[:15]
    b=(COMMON[:6]+specific+COMMON[6:])[:15]
    d2=desc[2:]+desc[:2]
    return [dict(h=a,d=desc,url=url,p1=p1,p2=p2),dict(h=b,d=d2,url=url,p1=p1,p2=p2)]

campaigns=[]
# 1. Brand
campaigns.append(dict(name="CVFC - Brand",budget=15,negatives=[],groups=[
 dict(name="Club Name",kw=[("chula vista fc","Exact"),("chula vista fc","Phrase"),("chula vista futbol club","Phrase"),
   ("chula vista fútbol club","Phrase"),("cvfc soccer","Phrase"),("chula vista fc soccer","Phrase")],
  ads=ads(["Official Chula Vista FC Site","Chula Vista FC Programs"],DESC_EVAL,SITE+"/","","")),
 dict(name="Club Programs",kw=[("chula vista fc mls next","Phrase"),("chula vista fc academy","Phrase"),("chula vista fc tryouts","Phrase"),
   ("chula vista fc evaluations","Phrase"),("chula vista fc girls","Phrase"),("chula vista fc registration","Phrase")],
  ads=ads(["Chula Vista FC Evaluations","Chula Vista FC Programs"],DESC_EVAL,SITE+"/evaluations","Evaluations","")),
]))
# 2. Evaluations (always-on)
NEG=["adult","adults","men's league","mens league","coed","over 30","fifa","video game","cleats","shoes","jersey","store",
 "tickets","live stream","score","world cup","high school","college","salary","indeed"]
campaigns.append(dict(name="CVFC - Player Evaluations",budget=155,negatives=NEG,groups=[
 dict(name="Youth Soccer Club",kw=[("youth soccer club san diego","Phrase"),("youth soccer clubs near me","Phrase"),("competitive soccer club san diego","Phrase"),
   ("club soccer san diego","Phrase"),("youth soccer teams near me","Phrase"),("soccer club for kids","Phrase"),("travel soccer san diego","Phrase"),("join a youth soccer team","Phrase")],
  ads=ads(["Youth Soccer Club, South Bay","Join a Youth Soccer Club"],DESC_EVAL,SITE+"/evaluations","Evaluations","Youth-Soccer")),
 dict(name="Tryouts Searches",kw=[("soccer tryouts san diego","Phrase"),("youth soccer tryouts","Phrase"),("soccer tryouts near me","Phrase"),
   ("club soccer tryouts","Phrase"),("girls soccer tryouts","Phrase"),("boys soccer tryouts","Phrase"),("missed soccer tryouts","Phrase")],
  ads=ads(["Join Mid-Season, Any Time","New to the Area? Get Evaluated"],DESC_EVAL,SITE+"/evaluations","Evaluations","Year-Round")),
 dict(name="Boys Competitive",kw=[("mls next san diego","Phrase"),("mls next clubs","Phrase"),("elite academy soccer","Phrase"),
   ("boys club soccer san diego","Phrase"),("boys competitive soccer","Phrase"),("mls next academy","Phrase")],
  ads=ads(["MLS NEXT Pathway, San Diego","Elite Academy and MLS NEXT","Boys Competitive Soccer"],DESC_EVAL,SITE+"/programs/boys-competitive-pathway","Boys","MLS-NEXT")),
 dict(name="Girls Competitive",kw=[("girls club soccer san diego","Phrase"),("girls competitive soccer","Phrase"),("dpl soccer","Phrase"),
   ("npl girls soccer","Phrase"),("girls soccer team near me","Phrase"),("girls soccer club","Phrase")],
  ads=ads(["Girls DPL and NPL Soccer","Girls Competitive Pathway","Girls Club Soccer, South Bay"],DESC_EVAL,SITE+"/programs/girls-competitive-pathway","Girls","DPL-NPL")),
 dict(name="Young Players",kw=[("soccer for kids near me","Phrase"),("soccer for 4 year olds","Phrase"),("soccer for 5 year olds","Phrase"),
   ("kids soccer program","Phrase"),("youth soccer for beginners","Phrase"),("soccer classes for kids","Phrase")],
  ads=ads(["Soccer for Kids Ages 4 to 9","Mini Maestros Program","A First Team for Young Players"],DESC_EVAL,SITE+"/programs/foundations","Foundations","Ages-4-9")),
 dict(name="Goalkeepers",kw=[("goalkeeper training san diego","Phrase"),("youth goalkeeper training","Phrase"),("goalie training for kids","Phrase"),
   ("soccer goalkeeper training","Phrase"),("goalkeeper academy","Phrase")],
  ads=ads(["Goalkeeper Training, All Ages","Dedicated Goalkeeper Pathway","Year-Round GK Sessions"],DESC_EVAL,SITE+"/programs/goalkeeper-pathway","Goalkeepers","")),
]))
# 3. Neighborhoods
AREAS=[("Chula Vista","chula-vista",["chula vista"]),("Eastlake","eastlake",["eastlake"]),("Otay Ranch","otay-ranch",["otay ranch"]),
 ("Bonita","bonita",["bonita"]),("City Heights","city-heights",["city heights"]),("Southeast San Diego","southeast-san-diego",["southeast san diego","encanto","skyline"])]
groups=[]
for name,slug,terms in AREAS:
    kw=[]
    for t in terms:
        kw+= [(f"youth soccer {t}","Phrase"),(f"kids soccer {t}","Phrase"),(f"soccer club {t}","Phrase"),(f"{t} soccer teams","Phrase")]
    short=name if len(name)<=14 else "SE San Diego"
    groups.append(dict(name=name,kw=kw[:8],ads=ads([f"Youth Soccer in {short}",f"Soccer Near {short}"],DESC_EVAL,f"{SITE}/areas/{slug}","Areas",slug[:15])))
campaigns.append(dict(name="CVFC - Neighborhoods",budget=80,negatives=NEG,groups=groups))
# 4. Donate & Sponsor
DESC_GIVE=["CVFC is a 501(c)(3) nonprofit. Your gift funds player scholarships, fields and coaching.",
 "Give once or monthly. Tax-deductible to the extent allowed by law.",
 "A club for everyone since 1982. Your gift keeps competitive soccer open to every family.",
 "Local businesses: jersey logos, banners and match-day recognition that fund scholarships."]
GIVE=["Support South Bay Youth Soccer","A Club for Everyone","Donate to Chula Vista FC","501(c)(3) Nonprofit Club","Tax-Deductible Donations",
 "Fund a Player Scholarship","Give Once or Monthly","Chula Vista FC","South Bay Club Since 1982"]
def gads(spec,url,p1):
    a=(spec+GIVE)[:15]; b=(GIVE[:4]+spec+GIVE[4:])[:15]
    return [dict(h=a,d=DESC_GIVE,url=url,p1=p1,p2=""),dict(h=b,d=DESC_GIVE[2:]+DESC_GIVE[:2],url=url,p1=p1,p2="")]
campaigns.append(dict(name="CVFC - Donate and Sponsor",budget=50,negatives=["jobs","volunteer abroad","car donation","clothing donation","used equipment"],groups=[
 dict(name="Donate",kw=[("donate to youth sports","Phrase"),("youth soccer donation","Phrase"),("donate to youth soccer","Phrase"),
   ("youth sports charity san diego","Phrase"),("support youth soccer","Phrase"),("nonprofit youth soccer","Phrase"),("youth sports scholarship donation","Phrase")],
  ads=gads(["Keep a Player on the Field","Every Gift Funds Development"],SITE+"/support","Donate")),
 dict(name="Sponsor",kw=[("sponsor a youth soccer team","Phrase"),("youth sports sponsorship","Phrase"),("sponsor youth sports team","Phrase"),
   ("local business sponsorship","Phrase"),("youth soccer sponsorship","Phrase"),("sponsor a kids soccer team","Phrase")],
  ads=gads(["Sponsor a Youth Soccer Team","Local Business Sponsorships","Your Logo on Our Jerseys"],SITE+"/sponsor","Sponsor")),
]))

# 5. Tijuana families (cross-border), separate budget and reporting
ES=["Chula Vista FC","Un Club para Todos","Evaluaciones Todo el Año","Evaluaciones Gratuitas","Respuesta en 48 Horas",
 "Niños y Niñas, 4 a 19 Años","En Chula Vista Desde 1982","Club Sin Fines de Lucro","MLS NEXT, EA, DPL y NPL",
 "Personal Bilingüe","Solicita una Evaluación","Fútbol Juvenil en San Diego","Ayuda Financiera Disponible"]
DESC_ES=["Evaluaciones todo el año para niños y niñas. Solicítala y un entrenador responde en 48 h.",
 "Un club para todos, el club de la gente. Sin fines de lucro en Chula Vista desde 1982.",
 "De Mini Maestros a MLS NEXT, Elite Academy, DPL y NPL. Un club, un camino completo.",
 "Entrenadores y personal bilingües. Evaluamos todo el año y ubicamos bien a cada jugador."]
def esads(spec,url,p1,p2):
    a=(spec+ES)[:15]; b=(ES[:5]+spec+ES[5:])[:15]
    return [dict(h=a,d=DESC_ES,url=url,p1=p1,p2=p2),dict(h=b,d=DESC_ES[2:]+DESC_ES[:2],url=url,p1=p1,p2=p2)]
campaigns.append(dict(name="CVFC - Tijuana Families",budget=29,loc=TJ,lang="en;es",negatives=NEG+["xolos"],groups=[
 dict(name="San Diego Club (English)",kw=[("soccer club san diego","Phrase"),("youth soccer san diego","Phrase"),("club soccer san diego","Phrase"),
   ("mls next san diego","Phrase"),("soccer academy san diego","Phrase"),("chula vista soccer","Phrase")],
  ads=ads(["Youth Soccer in San Diego","Just North of the Border"],DESC_EVAL,SITE+"/evaluations","Evaluations","")),
 dict(name="Club en San Diego (Español)",kw=[("club de futbol en san diego","Phrase"),("futbol juvenil san diego","Phrase"),("academia de futbol san diego","Phrase"),
   ("futbol en chula vista","Phrase"),("club de futbol chula vista","Phrase"),("equipos de futbol en san diego","Phrase")],
  ads=esads(["Club de Fútbol en San Diego","Fútbol en Chula Vista"],SITE+"/evaluations","Evaluaciones","")),
]))

HCOLS=[f"Headline {i}" for i in range(1,16)]; DCOLS=[f"Description {i}" for i in range(1,5)]
COLS=["Campaign","Campaign Type","Networks","Budget","Budget type","Bid Strategy Type","Languages","EU political ads","Campaign Status",
 "Location","Location ID","Ad Group","Ad Group Status","Keyword","Criterion Type","Ad type","Final URL","Path 1","Path 2",*HCOLS,*DCOLS]
rows=[];errs=[]
for c in campaigns:
    rows.append({"Campaign":c["name"],"Campaign Type":"Search","Networks":"Google search","Budget":c["budget"],"Budget type":"Daily",
      "Bid Strategy Type":"Maximize conversions","Languages":c.get("lang","en"),"EU political ads":"Doesn't have EU political ads","Campaign Status":"Paused"})
    loc=c.get("loc",SD)
    rows.append({"Campaign":c["name"],"Location":loc[0],"Location ID":loc[1]})
    for n in c["negatives"]:
        rows.append({"Campaign":c["name"],"Keyword":n,"Criterion Type":"Negative Phrase"})
    for g in c["groups"]:
        rows.append({"Campaign":c["name"],"Ad Group":g["name"],"Ad Group Status":"Enabled"})
        for k,t in g["kw"]:
            if len(k.split())<2: errs.append(("single-word",k))
            rows.append({"Campaign":c["name"],"Ad Group":g["name"],"Keyword":k,"Criterion Type":t})
        for a in g["ads"]:
            if len(set(a["h"]))!=len(a["h"]): errs.append(("dup headline",g["name"]))
            r={"Campaign":c["name"],"Ad Group":g["name"],"Ad type":"Responsive search ad","Final URL":a["url"],"Path 1":a["p1"],"Path 2":a["p2"]}
            for i,h in enumerate(a["h"]):
                if len(h)>30: errs.append(("H>30",h,len(h)))
                if "tryout" in h.lower() or "!" in h: errs.append(("policy",h))
                r[HCOLS[i]]=h
            for i,d in enumerate(a["d"]):
                if len(d)>90: errs.append(("D>90",d,len(d)))
                if "tryout" in d.lower(): errs.append(("policy",d))
                r[DCOLS[i]]=d
            for p in (a["p1"],a["p2"]):
                if len(p)>15: errs.append(("path>15",p))
            rows.append(r)
with open("cvfc-ad-grants-campaigns.csv","w",newline="",encoding="utf-8") as f:
    w=csv.DictWriter(f,fieldnames=COLS); w.writeheader(); w.writerows(rows)
print("errors:",errs)
print("campaigns",len(campaigns),"ad groups",sum(len(c["groups"]) for c in campaigns),
      "ads",sum(len(g["ads"]) for c in campaigns for g in c["groups"]),
      "keywords",sum(len(g["kw"]) for c in campaigns for g in c["groups"]),"budget/day",sum(c["budget"] for c in campaigns))
