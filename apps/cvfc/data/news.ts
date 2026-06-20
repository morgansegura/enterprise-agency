/**
 * CVFC news posts — ported from chulavistafc.com WordPress on 2026-04-30.
 * Powers /news landing page and /news/[slug] detail pages.
 *
 * ============================================================
 *  HOW TO UPDATE
 *  - New post          → push a new entry at the top (newest first)
 *  - Take down         → set status: "archived" (soft delete)
 *
 *  Eventually this file goes away — CMS serves the same shape via API.
 * ============================================================
 */

export type NewsStatus = "published" | "archived";

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  image?: { src: string; alt: string };
  status?: NewsStatus;
};

export const NEWS_POSTS: NewsPost[] = [
  {
    id: "pay-to-play-and-the-cost-of-competitive-soccer-in-america",
    slug: "pay-to-play-and-the-cost-of-competitive-soccer-in-america",
    title: `Pay-to-Play and the Cost of Competitive Soccer in America`,
    date: "2026-05-01",
    excerpt: `Competitive youth soccer in the U.S. costs families thousands of dollars a year. That price tag has consequences. We share how Chula Vista FC tries to do this work differently — and why we think more clubs working this way would matter.`,
    body: `<h2>Competitive soccer in America has a price-tag problem.</h2>

<p>Competitive club soccer in the United States typically costs families <strong>$2,000 to $5,000 per year</strong>, with the top tier of national-league clubs reaching <strong>$8,000 and beyond</strong>. That's before travel, tournaments, gear, and time off work. It's a problem with a name — <em>pay-to-play</em> — and it's been written about for years by reporters like the late Grant Wahl, by U.S. Soccer's own grassroots research, and in The Atlantic, ESPN, and other outlets covering the youth game.</p>

<p>The argument, in short: pay-to-play has priced a lot of working-class American kids out of competitive soccer, and that has real consequences for the development of the sport in this country.</p>

<p>We don't claim Chula Vista FC has solved this. No single club can. But we think how we operate — and how a growing number of other community-rooted clubs operate — points to something worth looking at as the United States co-hosts the 2026 FIFA World Cup.</p>

<h3>What pay-to-play does to the game</h3>

<p>A few things show up over and over in the reporting:</p>

<ul>
<li>Working-class families opt their kids out of competitive soccer because it's simply unaffordable. The decision often happens at U10 or U11, before talent has had a chance to surface.</li>
<li>Talent gets identified through tournaments and showcases that already cost thousands to attend. Kids who can't afford the entry don't get the looks.</li>
<li>The U.S. youth talent pool ends up reflecting income more than ability — a point U.S. Soccer leadership has acknowledged in their own grassroots reviews.</li>
<li>Latino, African American, and immigrant families — the same families who often play the game most passionately — are most likely to be priced out.</li>
</ul>

<p>That last point is where this hits home for us in the South Bay.</p>

<h3>How we try to do this differently</h3>

<p>Chula Vista FC has been operating in Chula Vista since 1982. We're a 501(c)(3) nonprofit. Our competitive program runs in the <strong>$800 to $2,000 per year</strong> range, depending on age and pathway — meaningfully below the U.S. average for an MLS NEXT or Elite Academy member club. We offer need-based financial assistance for families who can't manage that, and our program runs in both English and Spanish because most South Bay families are bilingual.</p>

<p>None of that makes CVFC unique. Other affordable, community-rooted clubs exist across the country, doing similar work in their own regions. We don't think we're the answer. We think we're <em>an</em> answer — one of many models worth supporting if youth soccer access in this country is going to look different a decade from now.</p>

<h3>Why 2026 matters</h3>

<p>The 2026 FIFA World Cup will be co-hosted by the United States, Mexico, and Canada. Los Angeles is one of the host cities; San Diego sits an hour south. The eyes of American sports are about to turn toward soccer in a way they haven't since 1994. Some of that attention will land on how the U.S. develops young players — and how affordable competitive pathways are (or aren't) part of that picture.</p>

<p>It's a moment to actually move on this stuff, not just write about it.</p>

<h3>How you can help</h3>

<p>If our work resonates, here are concrete ways to get involved:</p>

<ul>
<li><strong>Support a club doing this work.</strong> If that's CVFC, we'd be grateful — <a href="/support">our donate page is here</a>. If it's another affordable, community-rooted club in your area, support them.</li>
<li><strong>Push your local club</strong> to publish its scholarship rate, its fee structure, and its financial aid policy. Transparency is the first move.</li>
<li><strong>Talk about it.</strong> Pay-to-play stays a problem partly because most families don't realize how unusual the U.S. system is internationally. The conversation matters.</li>
</ul>

<p>Forty-four years in, we're still here, still bilingual, and still convinced that competitive soccer in the South Bay should look like the South Bay. We'd love to have you alongside us — or alongside whichever club is doing this work in your community.</p>`,
  },
  {
    id: "chula-vista-fcs-b2011-mls-nexts-gavin-jestand-has-officially-signed-a-contract-with-mls-colorado-rapids",
    slug: "chula-vista-fcs-b2011-mls-nexts-gavin-jestand-has-officially-signed-a-contract-with-mls-colorado-rapids",
    title: `Chula Vista FC’s B2011 MLS NEXT’s, Gavin Jestand, has officially signed a contract with MLS Colorado Rapids!`,
    date: "2026-03-29",
    excerpt: `Chula Vista FC continues to raise the bar. We are proud to announce that Gavin Jestand from our B2011 MLS Next squad has officially signed with the Colorado Rapids—another major…`,
    body: `<h2>Chula Vista FC continues to raise the bar.</h2>

<p>We are proud to announce that Gavin Jestand from our B2011 MLS Next squad has officially signed with the Colorado Rapids—another major milestone not just for Gavin, but for our entire club. Since joining CVFC in 2024, Gavin has made an immediate impact, showcasing the kind of talent, discipline, and mentality that defines what we’re building here.</p>

<p>And the momentum doesn’t stop there.</p>

<p>Just days ago, on March 9th, fellow B2011 MLS Next standout Quincy Lamar secured his own MLS move, signing with FC Dallas. Two players. Same squad. Same pathway. Same standard of excellence.</p>

<p>This is not luck. This is development. This is culture. This is Chula Vista FC.</p>

<p>We take immense pride in creating an environment where players are pushed, supported, and prepared for the next level—and moments like these are proof that the work is paying off.</p>

<p>To Gavin and Quincy: your journeys are just beginning, and we couldn’t be more proud to be part of your story.</p>

<p>At Chula Vista FC, we’re not just developing players—we’re building futures.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-b2011-mls-nexts-gavin-jestand-has-officially-signed-a-contract-with-mls-colorado-rapids.jpeg",
      alt: `Chula Vista FC’s B2011 MLS NEXT’s, Gavin Jestand, has officially signed a contract with MLS Colorado Rapids!`,
    },
  },
  {
    id: "chula-vista-fcs-b2011-mls-next-standout-quincy-lamar-has-officially-signed-a-contract-with-fc-dallas",
    slug: "chula-vista-fcs-b2011-mls-next-standout-quincy-lamar-has-officially-signed-a-contract-with-fc-dallas",
    title: `Chula Vista FC’s B2011 MLS NEXT standout, Quincy Lamar, has officially signed a contract with FC Dallas!`,
    date: "2026-03-09",
    excerpt: `Chula Vista FC’s B2011 MLS NEXT standout, Quincy Lamar, has officially signed a contract with FC Dallas! This marks yet another proud moment for Chula Vista FC, as another one of…`,
    body: `<h2>Chula Vista FC’s B2011 MLS NEXT standout, Quincy Lamar, has officially signed a contract with FC Dallas!</h2>

<p>This marks yet another proud moment for Chula Vista FC, as another one of our players takes the next step and signs with an MLS club.</p>

<p>Since joining Chula Vista FC in the 2020/21 season, Quincy has been nothing short of exceptional. A true powerhouse on the field, he consistently impressed with his brilliant style of play, work ethic, and competitive edge, making a lasting impact on the club.</p>

<p>While Quincy will be dearly missed, everyone at Chula Vista FC is incredibly proud of him. The entire club fully supports him, believes in his potential, and wishes him nothing but success as he begins this exciting new chapter of his soccer journey with FC Dallas.</p>

<p>Well deserved, Quincy — once a Chula Vista FC player, always part of the family! ⚽🔥</p>

<h1>cvfc4life</h1>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-b2011-mls-next-standout-quincy-lamar-has-officially-signed-a-contract-with-fc-dallas.png",
      alt: `Chula Vista FC’s B2011 MLS NEXT standout, Quincy Lamar, has officially signed a contract with FC Dallas!`,
    },
  },
  {
    id: "b2017-villa-state-cup-finalists",
    slug: "b2017-villa-state-cup-finalists",
    title: `B2017 Villa State Cup Finalists`,
    date: "2026-03-09",
    excerpt: `Our Chula Vista FC B2017 Villa Socal State Cup Finalist!! Our ‘cardiac kids’ fell short of another PK series by 10 minutes when CZ Elite scored the decisive goal against our B2017…`,
    body: `<h2>Our Chula Vista FC B2017 Villa Socal State Cup Finalist!!</h2>

<p>Our ‘cardiac kids’ fell short of another PK series by 10 minutes when CZ Elite scored the decisive goal against our B2017 Villa team making the final score 2-3 in their favor.</p>

<p>It was a great ride for these kids who won 3 straight PK series after winning their first 4 games, to reach the final.</p>

<p>Way to go Coach Marcos and team!!</p>

<p>Thanks to the parents for their support!</p>

<h1>cvfc4life #trusttheprocess</h1>`,
    image: {
      src: "/media/image/news/b2017-villa-state-cup-finalists.jpeg",
      alt: `B2017 Villa State Cup Finalists`,
    },
  },
  {
    id: "b2014-tuilla-state-cup-champions",
    slug: "b2014-tuilla-state-cup-champions",
    title: `B2014 Tuilla State Cup Champions!`,
    date: "2026-03-09",
    excerpt: `They did it!!!! 🏆⚽ Chula Vista FC B2014 Tuilla are Socal State Cup Champions!! ⚽🏆 What an incredible achievement! This championship is a testament to the hard work, dedication…`,
    body: `<h2>They did it!!!!</h2>

<p>🏆⚽ Chula Vista FC B2014 Tuilla are Socal State Cup Champions!! ⚽🏆</p>

<p>What an incredible achievement! This championship is a testament to the hard work, dedication, and heart these boys have shown all season long. From the first whistle to the final celebration, they gave it everything — and it paid off in the biggest way!</p>

<p>A huge congratulations to our amazing coach for the leadership, vision, and belief in this team. To our players — your commitment, teamwork, and relentless spirit made this moment possible. And to our incredible parents — thank you for your unwavering support, trust in the process, and for being there every step of the journey.</p>

<p>Champions on the field, champions in heart. 💙💛</p>

<p>So proud of you all! 🎉🔥</p>`,
    image: {
      src: "/media/image/news/b2014-tuilla-state-cup-champions.jpeg",
      alt: `B2014 Tuilla State Cup Champions!`,
    },
  },
  {
    id: "chula-vista-fcs-joaquin-jackson-signs-with-atlas-fc-academy",
    slug: "chula-vista-fcs-joaquin-jackson-signs-with-atlas-fc-academy",
    title: `Chula Vista FC’s Joaquin Jackson Signs with Atlas FC Academy`,
    date: "2025-09-17",
    excerpt: `Chula Vista FC’s Joaquin Jackson Signs with Atlas FC Academy Chula Vista, CA – September 16, 2025 – Chula Vista FC is proud to announce that B2009 MLS Next standout, Joaquin…`,
    body: `<h2>Chula Vista FC’s Joaquin Jackson Signs with Atlas FC Academy</h2>

<p>Chula Vista, CA – September 16, 2025 – Chula Vista FC is proud to announce that B2009 MLS Next standout, Joaquin Jackson, has officially signed with Atlas FC Academy in Guadalajara, Mexico. The talented young midfielder, who has grown through the CVFC system since the age of seven, will begin his next chapter with one of Liga MX’s most storied academies.</p>

<p>On Wednesday, September 10, 2025, Joaquin finalized his move to Atlas FC and is set to begin training at Academia AGA, with hopes of featuring in the Liga MX U17 Apertura season.</p>

<p>⸻</p>

<p>From Chula Vista to Guadalajara</p>

<p>Joaquin’s journey with CVFC began at just seven years old under the guidance of one of his first and most influential coaches, Francisco “Cisco” Ramirez. Over the years, CVFC provided a foundation of development, discipline, and opportunity that prepared him for the next level.</p>

<p>Reflecting on his time at CVFC, Joaquin shared:</p>

<p>“Chula Vista FC has helped me work towards my goals and dreams by giving me opportunities to grow as a player and be seen at the highest level. One of the most important moments was when they sent me to the La Liga Academy in Spain, where I trained for a week with top coaches and players. That experience motivated me to work even harder. CVFC also supported me through the El Camino program by the Mexican Football Federation, where I competed with over 1,200 players from the U.S. and Mexico. Thanks to CVFC and El Camino, I was one of only two players called up to the U15 Mexican National Team. I am very thankful for these opportunities and support.”</p>

<p>Among his favorite memories with CVFC, Joaquin recalls one moment that stands above the rest:</p>

<p>“My most memorable moment was scoring a bicycle kick in a match against Murrieta Soccer Academy MLS Next. The feeling was unforgettable, and celebrating with my teammates made it even more special.”</p>

<p>⸻</p>

<p>Looking Ahead with Atlas</p>

<p>For Joaquin, the chance to join Atlas FC Academy represents both a dream realized and a new challenge:</p>

<p>“I am very excited for this opportunity to play for Atlas FC Academy in Guadalajara. I want to continue working toward becoming the best player I can be. I am grateful for this chance and ready to give my all.”</p>

<p>⸻</p>

<p>A Family and Club Behind Him</p>

<p>Joaquin emphasizes that CVFC has been more than just a soccer club:</p>

<p>“Chula Vista FC has been like a family to me. The directors, coaches, and teammates have supported me and given me opportunities to grow. I am proud to represent CVFC and I hope to make everyone proud.”</p>

<p>His mother echoed that sentiment, expressing both gratitude and pride:</p>

<p>“My family and I are very grateful for the opportunities and support Chula Vista FC has given our son. Even though Joaquin will now be playing at Atlas, we will continue to be part of the CVFC family as our younger son is a goalkeeper at the club. We are incredibly proud of Joaquin’s hard work and discipline. This is just the beginning, and we know he will continue to achieve great things. Go Joaquin #295!”</p>

<p>⸻</p>

<p>About Chula Vista FC</p>

<p>Chula Vista FC has built a strong reputation for developing players with the talent, discipline, and character to compete at the highest levels of the game. Joaquin’s signing with Atlas FC Academy continues CVFC’s tradition of preparing players to take the next step in their careers, whether in MLS, Liga MX, or on the international stage.</p>

<p>As Joaquin embarks on his journey with Atlas FC, the entire CVFC family stands behind him with pride and excitement for what lies ahead.</p>

<p>Congratulations, Joaquin Jackson – your CVFC family is proud of you!</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-joaquin-jackson-signs-with-atlas-fc-academy.png",
      alt: `Chula Vista FC’s Joaquin Jackson Signs with Atlas FC Academy`,
    },
  },
  {
    id: "chula-vista-fc-accomplishes-lots-of-historic-firsts-on-the-first-weekend-of-the-fall-season",
    slug: "chula-vista-fc-accomplishes-lots-of-historic-firsts-on-the-first-weekend-of-the-fall-season",
    title: `Chula Vista FC accomplishes lots of historic firsts on the first weekend of the Fall Season!!`,
    date: "2025-09-10",
    excerpt: `Chula Vista FC accomplishes lots of historic firsts on the first weekend of the Fall Season!! Chula Vista FC has always been known for always performing at a high level with their…`,
    body: `<h2>Chula Vista FC accomplishes lots of historic firsts on the first weekend of the Fall Season!!</h2>

<p>Chula Vista FC has always been known for always performing at a high level with their Boys Program. However, this year, the Girls Program is getting their feet wet playing for the first time at the Development Player League (DPL), which is a highly competitive, elite-level girls&#8217; youth soccer league in the United States. The league functions as a significant proving ground for players aspiring to reach the highest levels of collegiate play.</p>

<p>And our Girls teams responded to the challenge with great results. Making club history with the first ever win at a highly competitive win were our G2013 girls beating SoCal Elite, 1-0 on a goal by Angelyn De Leon. Following the G2013s game, our G2010s girls also delivered another 1-0 win over SoCal Elite with a goal scored by Aceana Jenkins.&nbsp; These were exciting times for these girls, coaches, parents and of course Chula Vista FC. And even if a victory was not obtained by our G2007 squad, they enter the club’s record book as the first team to play in the DPL.</p>

<p>Not only did the Girls Program got historic firsts, but the Boys program also delivered with some of their own. Playing on MLS Next’s brand-new Academy Division, our U13s squad came up with a convincing 7-0 victory over TFA in the league’s inaugural season. At the same time our U19s also delivered a 2-1 win. Our U14s tried hard and came up with a tight 0-0 tie. The squad that entered the club’s record book as the first team to play MLS Next academy was our U15 squad.</p>

<p>Our other Boys teams also obtained other first wins. Our U13 started their MLS Next Homegrown Division’s journey with a smashing 10-1 win. On a side note, ALL Homegrown Division teams won their games to have a clean sweep in this weekend’s series against Las Vegas Soccer Academy.&nbsp;</p>

<p>Exciting firsts no doubt for our upper tier’s competitive teams no doubt.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-accomplishes-lots-of-historic-firsts-on-the-first-weekend-of-the-fall-season.jpg",
      alt: `Chula Vista FC accomplishes lots of historic firsts on the first weekend of the Fall Season!!`,
    },
  },
  {
    id: "chula-vista-fc-mls-next-b2006-u19-and-b2011-u14-qualified-for-the-mls-next-cup-playoffs-and-showcase",
    slug: "chula-vista-fc-mls-next-b2006-u19-and-b2011-u14-qualified-for-the-mls-next-cup-playoffs-and-showcase",
    title: `Chula Vista FC MLS Next B2006 (U19) and B2011 (U14) qualified for the MLS Next Cup Playoffs and Showcase!!`,
    date: "2025-06-10",
    excerpt: `Chula Vista FC’s B2006 (U19) and B2011 (U14) Squads Qualify for MLS NEXT Cup Playoffs and Showcase! Both Chula Vista FC’s MLS NEXT B2006 (U19) and B2011 (U14) squads have…`,
    body: `<h2><strong>Chula Vista FC’s B2006 (U19) and B2011 (U14) Squads Qualify for MLS NEXT Cup Playoffs and Showcase!</strong></h2>

<p><br>Both <strong>Chula Vista FC’s MLS NEXT B2006 (U19) and B2011 (U14) squads</strong> have officially qualified for the <strong>2024 MLS NEXT Cup Playoffs and Showcase</strong>, to be held from <strong>June 14th to June 22nd</strong> at the renowned <strong>Richard Siegel Soccer Complex in Nashville, Tennessee.</strong></p>

<p>This monumental achievement follows a <strong>historic first-place tie</strong> in the <strong>Southwest (South) Division</strong> with the elite <strong>Barca Residency Academy</strong>, securing the B2006 (U19) squad’s place among the nation’s best at the <strong>MLS NEXT Cup Playoffs</strong>.</p>

<p>For <strong>Eden Esquerre</strong>, Chula Vista FC’s Technical Director and Head Coach of the B2006 (U19) team, this qualification is more than just a sporting milestone—it’s a story of resilience, determination, and unshakable belief.</p>

<p><strong>A Remarkable Turnaround</strong></p>

<p>The journey to this point was far from smooth. The B2006 squad endured a <strong>challenging start</strong>, going <strong>2-6-3</strong> in MLS Flex play. To make matters more difficult, Coach Esquerre was informed mid-season that his tenure at Chula Vista FC was coming to an end.</p>

<p>Rather than be discouraged, Esquerre embraced the adversity, vowing to finish strong and leave behind a legacy. With the full backing of <strong>Academy Director Jose Hector Diaz</strong>, who recognized the team’s steady improvement, Esquerre and his players redoubled their efforts. Their determination culminated in an extraordinary run—<strong>winning 11 of their final 17 matches, including a dominant 8-1-1 divisional record.</strong></p>

<p>Reflecting on this emotional journey, Esquerre shared:</p>

<p><em>“I didn’t want to leave Chula Vista FC without leaving something meaningful behind. Hector believed in the progress we were making game by game, and time has proven him right. All the hard work has lifted us to this level. We’re not just showing up—we’re competing. This is the first time a CVFC U19 squad has qualified for the MLS NEXT Cup, and it means everything to us. I’m thrilled for the players, the club, and for myself. We’ve earned this. It’s a well-deserved reward for the relentless effort we’ve put in, and we’ll approach the Cup with a winning mentality.”</em></p>

<p>Speaking about his coaching philosophy, Esquerre added:</p>

<p><em>“It hasn’t always been easy for my players. I’m a demanding coach the moment I step onto the pitch. I have a very specific vision for how soccer should be played, and that can be challenging for players to grasp at first. But once they understand the concept, it becomes second nature—and the results speak for themselves.”</em></p>

<p><strong>Leaving a Lasting Legacy</strong></p>

<p>Esquerre’s impact on Chula Vista FC is undeniable. His leadership has helped shape one of the <strong>most successful seasons in club history at the MLS NEXT level.</strong></p>

<ul>
<li>The <strong>B2010 (U15) squad</strong> qualified for MLS NEXT Flex after going <strong>undefeated</strong> and finishing a close second in their division.</li>

<li>The <strong>B2011 (U14) team</strong> concluded another stellar season with a <strong>20-8-4 record</strong>, following last year’s extraordinary <strong>28-2-2 campaign</strong>, securing back-to-back qualifications for the MLS NEXT Cup Playoffs.</li>

<li>And now, the <strong>B2006 (U19) squad</strong> has carved their name into club history, tying the formidable Barca Residency Academy for <strong>first place in the division.</strong></li>
</ul>

<p>Following the MLS NEXT Cup, Esquerre will return to his native <strong>Spain</strong>, marking the close of a transformative chapter for Chula Vista FC. His departure will be felt deeply across the club—from players and coaches to parents and administrators—who will always consider him a cherished part of the <strong>Chula Vista FC family.</strong></p>

<p><strong>Thank you, Eden Esquerre, for your invaluable contributions and best of luck on your next journey!</strong></p>

<hr/>

<p><strong>What’s Next?</strong></p>

<ul>
<li><strong>B2006 (U19) squad</strong>: Will face <strong>Sockers FC</strong> in Round 1 of the <strong>MLS NEXT Cup Playoffs Round of 32.</strong></li>

<li><strong>B2011 (U14) squad</strong>: Will take on <strong>TSF Academy</strong> in Round 1 of the <strong>MLS NEXT Cup Championship Bracket.</strong></li>
</ul>

<p>The <strong>MLS NEXT Cup Playoffs and Showcase</strong> is the premier event of the season, featuring the <strong>top 32 teams from across the country</strong> competing for national titles in four age groups: <strong>U15, U16, U17, and U19.</strong> The event will run from <strong>June 14–22</strong> at the <strong>Richard Siegel Soccer Complex in Nashville, Tennessee.</strong></p>

<p>Teams that did not qualify for the Cup Playoffs, as well as the <strong>U13 and U14 squads</strong>, will participate in the highly competitive <strong>MLS NEXT Cup Showcase</strong>, which offers additional opportunities for players to compete in front of scouts, coaches, and evaluators.</p>

<hr/>

<p><strong>Chula Vista FC continues to rise.</strong></p>

<p><strong>#cvfc4life</strong></p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-mls-next-b2006-u19-and-b2011-u14-qualified-for-the-mls-next-cup-playoffs-and-showcase.jpg",
      alt: `Chula Vista FC MLS Next B2006 (U19) and B2011 (U14) qualified for the MLS Next Cup Playoffs and Showcase!!`,
    },
  },
  {
    id: "chula-vista-fc-b2010-u15-mls-next-squad-gears-up-for-the-2025-mls-next-flex",
    slug: "chula-vista-fc-b2010-u15-mls-next-squad-gears-up-for-the-2025-mls-next-flex",
    title: `Chula Vista FC B2010 (U15) MLS NEXT Squad Gears Up for the 2025 MLS NEXT Flex!`,
    date: "2025-05-09",
    excerpt: `Chula Vista FC B2010 (U15) MLS NEXT Squad Gears Up for the 2025 MLS NEXT Flex! The stage is set and the spotlight is on as Chula Vista FC’s B2010 (U15) MLS NEXT squad prepares to…`,
    body: `<h2>Chula Vista FC B2010 (U15) MLS NEXT Squad Gears Up for the 2025 MLS NEXT Flex!</h2>
<p>The stage is set and the spotlight is on as Chula Vista FC’s B2010 (U15) MLS NEXT squad prepares to compete at the 2025 MLS NEXT Flex, taking place this weekend at the Maryland SoccerPlex in Boyds, Maryland!</p>
<p>Coming off a stellar regular season with an undefeated 7-0-3 record, CVFC earned a remarkable second-place finish in the highly competitive Southwest (South) Division—trailing only the esteemed Barça Academy. Their strong performance secured them a spot in the Flex, where a group-stage victory could see them qualify for the 2025 MLS NEXT Cup Playoffs.</p>
<p>A National Challenge Awaits</p>
<p>In Maryland, CVFC will be tested against some of the top U15 talent in the country:</p>
<p>•Saturday, May 11 vs. Nashville SC – 4:30 PM EST</p>
<p>•Sunday, May 12 vs. New York Red Bulls – 3:15 PM EST</p>
<p>•Tuesday, May 14 vs. Atletico Santa Rosa – 4:30 PM EST</p>
<p>These opponents bring serious pedigree:</p>
<p>•Nashville SC: Backed by an MLS first team, enters the Flex with a dominant 19-4-2 record.</p>
<p>•New York Red Bulls: Another MLS powerhouse, boasting a 21-5-3 record.</p>
<p>•Atletico Santa Rosa: A solid club with a 12-13-4 season tally.</p>
<p>CVFC enters with a 16-7-9 overall record and the determination to make a deep run. Led by Academy Director Jose Hector Diaz, the squad is focused, fearless, and ready to prove themselves on the national stage. Every minute of play will matter as the boys fight for a coveted spot in the MLS NEXT Cup.</p>
<p>About MLS NEXT FLEX</p>
<p>MLS NEXT Flex is a premier scouting and playoff-qualifying event running from May 9–13 at the Maryland SoccerPlex. It features 232 teams from across the U15, U16, U17, and U19 age groups. Clubs qualified through their points-per-game performance in the 2024–25 MLS NEXT regular season standings.</p>
<p>Each group winner from the showcase will automatically advance to the 2025 MLS NEXT Cup Playoffs. All clubs will face off against teams from outside their regular divisions. U15 matches will be 80 minutes, and tied games will be decided via penalty kicks (winner receives 2 points; loser receives 1).</p>
<p>Beyond the playoff stakes, the event serves as a central scouting hub, attracting college coaches, youth national team staff, professional scouts, and evaluators from across North America.</p>
<p>Let’s Go CVFC!</p>
<p>Follow along and support our U15 squad as they take on some of the nation’s best and chase greatness at MLS NEXT Flex 2025!</p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-b2010-u15-mls-next-squad-gears-up-for-the-2025-mls-next-flex.jpg",
      alt: `Chula Vista FC B2010 (U15) MLS NEXT Squad Gears Up for the 2025 MLS NEXT Flex!`,
    },
  },
  {
    id: "chula-vista-fcs-mls-next-program-a-rising-force-in-youth-soccer",
    slug: "chula-vista-fcs-mls-next-program-a-rising-force-in-youth-soccer",
    title: `Chula Vista FC’s MLS Next Program: A Rising Force in Youth Soccer.`,
    date: "2025-04-15",
    excerpt: `Chula Vista FC’s MLS Next Program: A Rising Force in Youth Soccer. Chula Vista FC’s MLS Next program continues to establish itself as a formidable force—both now and for the…`,
    body: `<h2><strong>Chula Vista FC&#8217;s MLS Next Program: A Rising Force in Youth Soccer.</strong></h2>
<p>Chula Vista FC’s MLS Next program continues to establish itself as a formidable force—both now and for the future.</p>
<p>This season, the club’s MLS Next teams have proven that with hard work, dedication, and a strong developmental structure, they can compete toe-to-toe with some of the most established programs in the country, including MLS giants like LA Galaxy and LAFC, as well as top-tier international academies such as Barca Academy.</p>
<p>The results speak for themselves:</p>
<ul>
<li>The <strong>U19s</strong> currently sit at the top of the <em>Southwestern (South) Division.</em></li>
<li>The <strong>U15s</strong> remain undefeated in league play, trailing just behind Barca Academy.</li>
<li>The <strong>U17s</strong> boast a winning record and are only three points behind division leader Barca Academy.</li>
<li>The <strong>U14s</strong> have compiled a solid <strong>18-8-3</strong> record (note: official standings are not kept for U13 and U14 in MLS Next). Impressively, this same 2011 group finished last season with a remarkable <strong>28-2-2</strong> record as U13s.</li>
</ul>
<p>When asked about the key to this sustained success, <strong>Technical Director Eden Esquerre</strong> shared,</p>
<p>“The previous work we’ve done with this group has been crucial. It’s much easier to build when you’ve already laid a strong foundation. Most of our U19 players have been with us for several years—seven of them for over four years. That long-term development makes a big difference.”</p>
<p>Player and parent commitment to the process—and their loyalty to the club—have been vital to the program’s rise. Equally important is the exceptional coaching staff that drives the development from the sidelines.</p>
<p>Leading the charge are head coaches <strong>Isaac Valencia</strong>, <strong>Jose Antonio Govea</strong>, <strong>Fernando Mares</strong>, <strong>Technical Director Eden Esquerre</strong>, and <strong>Academy Director Jose Hector Diaz</strong>. Supporting them is a talented team of assistant coaches: <strong>Alberto Diaz</strong>, <strong>Jesse Lopez</strong>, <strong>Hernan Maldonado</strong>, <strong>Ricardo Morfin</strong>, <strong>Isella Olvera</strong>, <strong>Ismael Vidrio</strong>, and <strong>Erick Cortinas</strong>. Rounding out the staff are goalkeeper coaches <strong>Ricardo Villalva</strong> and <strong>Carlos Arce</strong>, whose specialized training continues to elevate the performance between the posts.</p>
<p>With a clear vision, a culture of excellence, and a deep bench of coaching talent, Chula Vista FC’s MLS Next program is not just competing—it’s thriving.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-mls-next-program-a-rising-force-in-youth-soccer.jpg",
      alt: `Chula Vista FC’s MLS Next Program: A Rising Force in Youth Soccer.`,
    },
  },
  {
    id: "chula-vista-fc-has-been-accepted-into-the-development-player-league-dpl",
    slug: "chula-vista-fc-has-been-accepted-into-the-development-player-league-dpl",
    title: `Chula Vista FC has been accepted into the Development Player League (DPL)`,
    date: "2025-04-02",
    excerpt: `Chula Vista FC has been accepted into the Development Player League (DPL) Chula Vista FC’s acceptance into the Development Player League (DPL) is a transformative moment for our…`,
    body: `<h2>Chula Vista FC has been accepted into the Development Player League (DPL)</h2>
<p>Chula Vista FC’s acceptance into the Development Player League (DPL) is a transformative moment for our Girls’ program. We&#8217;ve established ourselves as a leading force in the South Bay, and now, we&#8217;re taking the next step by joining a prestigious club-vs-club platform specifically designed to elevate girls&#8217; soccer. This is about more than just games; it&#8217;s about solidifying our Girls’ program&#8217;s identity, fostering a strong culture within our female athletes, and driving up the standards for all involved. Playing against the elite clubs of Southern California, who are among the nation&#8217;s best, will provide invaluable experience for our girls. The DPL is a crucial addition, and we&#8217;re excited to offer the girls of the South Bay another pathway to high-level competition and exposure tailored for their development.</p>

<p>The DPL focuses on both athletic and personal growth, aiming to develop players and empower them in a meaningful environment. Its mission extends beyond soccer skills, emphasizing life lessons, community, and collegiate opportunities. The league prioritizes high-quality experiences, ensuring well-organized events, competitive play, and exposure to college scouts. As a standards-driven national league, the DPL offers a structured and reputable environment that fosters player development and long-term success. Chula Vista FC will now be able to offer these benefits to players and parents seeking a supportive and competitive pathway to collegiate soccer.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-has-been-accepted-into-the-development-player-league-dpl.png",
      alt: `Chula Vista FC has been accepted into the Development Player League (DPL)`,
    },
  },
  {
    id: "chula-vista-fc-b2011-villa-wins-socal-state-cup",
    slug: "chula-vista-fc-b2011-villa-wins-socal-state-cup",
    title: `Chula Vista FC B2011 Villa Wins SoCal State Cup!`,
    date: "2025-03-19",
    excerpt: `Chula Vista FC B2011 Villa Wins SoCal State Cup! Our Chula Vista FC B2011 Villa won Socal’s State Cup in dramatic fashion, defeating PYSL Blast in penalty kicks 1-1 (4-3) this…`,
    body: `<h2><strong>Chula Vista FC B2011 Villa Wins SoCal State Cup!</strong></h2>
<p>Our Chula Vista FC B2011 Villa won Socal’s State Cup in dramatic fashion, defeating PYSL Blast in penalty kicks 1-1 (4-3) this past Sunday. The boys earned their way to the championship game by outlasting Atlante FC, also in PKs, 1-1 (3-1). In both games, the team equalized in the final minutes of regulation time with goals from Pablo Sandoval (semifinals) and Christian Felix (championship).</p>
<p>This must be in Chula Vista FC’s DNA. Last season, our Chula Vista FC B2009 Villa reached Socal’s State Cup Championship game by winning back-to-back penalty shootouts. And who could forget the heroics of the First Team in the 2020 Lamar Hunt U.S. Open Cup, where they won three straight penalty shootouts? And by the way, our B2011 Villa’s Head Coach, Rodrigo Meza, was a player for that First Team squad scoring a couple of goals in the last game of that amazing run.</p>
<p>Head Coach Rodrigo Meza shared his thoughts on winning the tournament and what it means for Chula Vista FC:</p>
<p>“It feels great! It really shows the quality and depth of talent the club has. We had four players move up to the EA2 team, added four new players and a new coach (me), and we were still finalists in a couple of tournaments before winning State Cup.”</p>
<p>Coach Meza also reflected on how the tournament unfolded:</p>
<p>“We looked very strong throughout the tournament, and I felt very confident. After winning the semifinal, I thought we had a great shot at winning it all. The boys’ confidence level was something I hadn’t seen from them all season.”</p>
<p>Before the penalty shootout, Coach Meza gave his players some final words of encouragement:</p>
<p>“I told them not to stress too much, pick a side, and shoot confidently. I also reassured them that the parents and I would be proud no matter the outcome.”</p>
<p>Coach Meza concluded:</p>
<p>“Super proud of the boys. We had a rough start to the fall regular season, and winning State Cup was the perfect way to end it. It really showed their improvement and how much their chemistry grew.”</p>
<p>At Chula Vista FC, we strive to field competitive teams, and this is a perfect example. Competing in MLS Next, Elite Academy, EA2, and still winning a State Cup at the SoCal level shows that the club is doing things the right way.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-b2011-villa-wins-socal-state-cup.jpg",
      alt: `Chula Vista FC B2011 Villa Wins SoCal State Cup!`,
    },
  },
  {
    id: "the-united-states-soccer-federation-held-a-u-s-soccer-talent-id-center-in-santee-ca-today",
    slug: "the-united-states-soccer-federation-held-a-u-s-soccer-talent-id-center-in-santee-ca-today",
    title: `The United States Soccer Federation held a U.S. Soccer Talent ID Center in Santee, CA today.`,
    date: "2025-01-23",
    excerpt: `The United States Soccer Federation held a U.S. Soccer Talent ID Center in Santee, CA today. Representing Chula Vista FC were: Alexander Carbajal Quincy Lamar Brandon Marcial…`,
    body: `<h2>The United States Soccer Federation held a U.S. Soccer Talent ID Center in Santee, CA today.</h2>
<p>Representing Chula Vista FC were:</p>
<p>Alexander Carbajal</p>
<p>Quincy Lamar</p>
<p>Brandon Marcial Vazquez</p>
<p>Angel Sillas</p>
<p>Aiden Vega</p>
<p>Dallas Wells</p>
<p>U.S. Soccer Talent ID Centers (IDCs) are free, single-day player identification opportunities for top talents to train and play games under the direction of U.S. Soccer Talent Identification Managers. IDC’s are a critical element to their Talent Identification Plan and are designed to identify and evaluate top talents for Youth</p>
<p>National Teams, while accelerating their development in a challenging environment. IDC’s are scheduled throughout the year in key markets across the country.</p>
<p>U.S. Soccer Talent ID Centers are designed to replicate Youth National Team camps. The sessions are closed to parents and spectators. U.S. Soccer’s objective is to create an environment free from any distractions,</p>
<p>where players take responsibility for their own development. IDCs are the pathway to the Youth National Teams. Club representatives (Directors, Coaches, Scouts) may attend and observe the session from designated areas away from field and players with prior approval.</p>
<p>As the National Governing Body of soccer in the United States, and under the auspices of the United States Olympic Committee, they are empowered and charged with developing the teams that represent the United States in all international competitions such as the Olympics and World Cup. The Talent ID Center Program is an integral part of this process.</p>
<p>Proud of our players that represented Chula Vista FC!!! Great job!!</p>`,
    image: {
      src: "/media/image/news/the-united-states-soccer-federation-held-a-u-s-soccer-talent-id-center-in-santee-ca-today.jpg",
      alt: `The United States Soccer Federation held a U.S. Soccer Talent ID Center in Santee, CA today.`,
    },
  },
  {
    id: "chula-vista-fc-b2009-mls-nexts-anthony-valadez-signs-with-club-tijuana-xoloitzcuintles-de-caliente",
    slug: "chula-vista-fc-b2009-mls-nexts-anthony-valadez-signs-with-club-tijuana-xoloitzcuintles-de-caliente",
    title: `Chula Vista FC B2009 MLS Next’s, Anthony Valadez, signs with Club Tijuana Xoloitzcuintles de Caliente!`,
    date: "2025-01-04",
    excerpt: `Chula Vista FC B2009 MLS Next’s, Anthony Valadez, signs with Club Tijuana Xoloitzcuintles de Caliente! Another Chula Vista FC player has signed with Club Tijuana Xoloitzcuintles…`,
    body: `<h2>Chula Vista FC B2009 MLS Next’s, Anthony Valadez, signs with Club Tijuana Xoloitzcuintles de Caliente!</h2>
<p>Another Chula Vista FC player has signed with Club Tijuana Xoloitzcuintles de Caliente. Last year, center forward, Bryan Yael Ramos, and goalkeeper, Emilio Silva, signed contracts with the Liga MX club. This time, it was Anthony Valadez’s turn.</p>
<p>CVFC’s Academy Director, Jose Hector Diaz, had this to say: “Anthony was a member of our club two years ago. After taking a season away, he returned this summer and quickly found success, earning a spot on the Mexican national team and attracting interest from numerous Mexican professional clubs. We’re thrilled for him and the exciting new chapter in his development. It’s an honor that Chula Vista FC could play a role in supporting his pathway to success.&#8221;</p>
<p>His B2009 MLS Next coach, Fernando Mares, had this to say: &#8220;I am proud to see Anthony Valadez take this step in his career by signing an academy contract with Xolos. Throughout his time with us, he&#8217;s demonstrated a clear desire to pursue opportunities at the professional level. This move is a reflection of his commitment and determination. I wish him the best as he continues his development in this new environment.&#8221;</p>
<p>Anthony played center back for the B2009 MLS Next squad and was their captain. Last Summer, Anthony had already gotten some attention from the Mexican National Team at the ID camp that Chula Vista FC hosted. He was selected to train in Toluca, Mexico, with the Mexico’s U16 National Team in September along with CVFC’s teammate, Joaquin Jackson.</p>
<p>We at CVFC wish Anthony the best of luck in his new adventure and we are sure that he will be a total success in his soccer career!</p>
<p>#cvfc4life</p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-b2009-mls-nexts-anthony-valadez-signs-with-club-tijuana-xoloitzcuintles-de-caliente.jpeg",
      alt: `Chula Vista FC B2009 MLS Next’s, Anthony Valadez, signs with Club Tijuana Xoloitzcuintles de Caliente!`,
    },
  },
  {
    id: "san-diego-fc-partners-with-chula-vista-fc-to-help-grow-the-beautiful-game-in-san-diego-county",
    slug: "san-diego-fc-partners-with-chula-vista-fc-to-help-grow-the-beautiful-game-in-san-diego-county",
    title: `San Diego FC Partners with Chula Vista FC to Help Grow the Beautiful Game in San Diego County`,
    date: "2025-01-04",
    excerpt: `San Diego FC Partners with Chula Vista FC to Help Grow the Beautiful Game in San Diego County SAN DIEGO (Friday, Jan. 3, 2025) – San Diego FC (SDFC) is proud to announce a…`,
    body: `<h2><strong>San Diego FC Partners with Chula Vista FC to Help Grow the Beautiful Game in San Diego County</strong></h2>
<p><strong> </strong></p>
<p><strong>SAN DIEGO (Friday, Jan. 3, 2025) – </strong>San Diego FC (SDFC) is proud to announce a partnership with Chula Vista FC to deepen both Club’s commitment to youth development in San Diego County and to introduce Major League Soccer to the Chula Vista community.</p>
<p>
<p>Chula Vista FC has been operating in San Diego County for 43 years and currently has 48 teams and 900 players across all programs. As SDFC kicks off its inaugural season in MLS in 2025, this partnership greatly benefits both club’s long-standing passion for the game in San Diego County, which is widely known as a hotbed for players, fans and fan engagement.</p>
<p>
<p>“Chula Vista FC is proud to partner with San Diego FC to strengthen our commitment to player development and community engagement,” said Chula Vita FC Academy Director Hector Diaz. “As the County&#8217;s longest-standing soccer club, offering youth and adult teams, we have provided a complete pathway for players to aspire to. Since there was an absence of MLS in San Diego, we created an adult team for our players to aim for, ensuring they had role models and opportunities within their community. Now, with San Diego FC, professional soccer is here to stay, inspiring a new generation to dream of representing their city at the highest level.”</p>
<p>
<p>SDFC’s objective is to support Chula Vista FC with programming that enhances Chula Vista FC’s strengths and provides increased opportunities for players and families to experience the game. SDFC and Chula Vista FC will be in touch with their communities soon with more details about the partnership.</p>
<p>
<p>“Chula Vista FC has long been a pillar in the local soccer community, fostering a deep passion for the game among players and families,” said Bill Miles, COO of SDFC and Executive Director of SDFC’s Right to Dream Academy. “At SDFC, we are proud to partner with a club that shares our vision for development and inclusivity. Together, we will build pathways that inspire the next generation of players and strengthen the foundation of soccer in San Diego.”</p>
<p>
<p>Both Clubs look forward to growing the game in San Diego and beyond. Please join SDFC in 2025 at Snapdragon Stadium to celebrate SDFC’s historical inaugural season! To check out SDFC’s 2025 schedule, please visit SanDiegoFC.com/schedule.</p>
<p>
<p>To learn more about SDFC Season Ticket Memberships, fans can visit SanDiegoFC.com/tickets. For the latest news and Club updates, please visit SanDiegoFC.com, follow @SanDiegoFC on social media across all platforms, and use the hashtag #SanDiegoFC #FlowWithUs.</p>
<p>
<p><strong># # #</strong></p>
<p>
<p><strong>About San Diego FC</strong></p>
<p>San Diego FC is an expansion team in Major League Soccer, scheduled to begin play at Snapdragon Stadium in 2025. San Diego FC is jointly owned by Sir Mohamed Mansour, a distinguished entrepreneur, investor and philanthropist with global ties in the sport, and the Sycuan Band of the Kumeyaay Nation, the first Native American tribe to have an ownership stake in professional soccer. Manny Machado, San Diego’s perennial MLB All-Star, is an investor in the Club. San Diego FC is a proud member of the Right to Dream community, a group of youth academies and professional football clubs around the world. San Diego FC’s stated vision is to become the epicenter of football excellence and innovation in North America.</p>`,
    image: {
      src: "/media/image/news/san-diego-fc-partners-with-chula-vista-fc-to-help-grow-the-beautiful-game-in-san-diego-county.jpg",
      alt: `San Diego FC Partners with Chula Vista FC to Help Grow the Beautiful Game in San Diego County`,
    },
  },
  {
    id: "chula-vista-fcs-first-team-set-to-face-las-vegas-legends-fc-in-the-nisa-nations-western-region-semifinals",
    slug: "chula-vista-fcs-first-team-set-to-face-las-vegas-legends-fc-in-the-nisa-nations-western-region-semifinals",
    title: `Chula Vista FC’s First Team set to face Las Vegas Legends FC in the NISA Nation’s Western Region Semifinals!`,
    date: "2024-11-19",
    excerpt: `Chula Vista FC’s First Team set to face Las Vegas Legends FC in the NISA Nation’s Western Region Semifinals! Our Chula Vista FC’s First Team continues its intense matches schedule…`,
    body: `<h2>Chula Vista FC’s First Team set to face Las Vegas Legends FC in the NISA Nation’s Western Region Semifinals!</h2>
<p>Our Chula Vista FC’s First Team continues its intense matches schedule and will now face defending NISA Nation’s Western Region Champions, Las Vegas Legends FC, in this weekend’s semifinal game.</p>
<p>Our CVFC squad earned its way into the semifinal match by beating Soccer Academy Nevada in the Southwest Premier League’s (SWPL) Championship game, 3-2 last July.</p>
<p>Las Vegas Legends FC won their NPSL Southwest Division Championship by beating Capo FC last June to earn its spot.</p>
<p>The game will be played this Saturday, November 23rd, at 7:30 PM at Canyon Springs High School, North Las Vegas, Nevada.</p>
<p>The winner will advance to Sunday’s Championship game against the winner of Peak XI FC against Worldwide FC. There will be a consolation game for Third place also on Sunday.</p>
<p>Con todo CVFC!!</p>
<p>#cvfc4life</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-first-team-set-to-face-las-vegas-legends-fc-in-the-nisa-nations-western-region-semifinals.jpg",
      alt: `Chula Vista FC’s First Team set to face Las Vegas Legends FC in the NISA Nation’s Western Region Semifinals!`,
    },
  },
  {
    id: "despite-of-yesterdays-heartbreaking-loss-chula-vista-fcs-future-looks-quite-bright",
    slug: "despite-of-yesterdays-heartbreaking-loss-chula-vista-fcs-future-looks-quite-bright",
    title: `Despite of yesterday’s heartbreaking loss, Chula Vista FC’s future looks quite bright!`,
    date: "2024-11-18",
    excerpt: `Despite of yesterday’s heartbreaking loss, Chula Vista FC’s future looks quite bright! Chula Vista FC’s First Team’s heartbreaking, last minute, 2-3 , loss against San Diego…`,
    body: `<h2>Despite of yesterday’s heartbreaking loss, Chula Vista FC’s future looks quite bright!</h2>
<p>Chula Vista FC’s First Team’s heartbreaking, last minute, 2-3 , loss against San Diego Internacional FC in the Lamar Hunt’s US Open Cup’s Third Qualifying Round was hard to swallow. But, on the other hand, this only means that Chula Vista FC is back playing in these type of high profile tournaments.</p>
<p>Chula Vista FC had not fielded a team in the US Cup since 2020. And now, with a rejuvenated squad, Chula Vista FC can only see that they have a bright future ahead of them in these type of competitions. In last night’s game, CVFC’s squad had 7 players under 19 years of age and only 6 players over 25.</p>
<p>Chula Vista FC’s MLS Next program is certainly the reason that the club can afford to use such a young team since their players are constantly playing against the MLS’s regional foes such as LA Galaxy, LAFC, Real Salt Lake and now SDFC.</p>
<p>CVFC’s Academy Director and First Team’s Head Coach, Jose Hector Diaz, had this to say about their program:   “We&#8217;re proud to have a young team gaining valuable experience, bridging MLS Next graduates, college players, former pros, and top regional talent. Adult development at Chula Vista FC is key, as this mix of seasoned and emerging players fosters the region&#8217;s top soccer development.&#8221;</p>
<p>Chula Vista FC is certainly heading in the right direction and can now say: We are back!!!</p>
<p>We can’t hardly wait for the start of the 2026 Lamar Hunt’s US Open Cup’s qualifying rounds!</p>
<p>#cvfc4life</p>`,
    image: {
      src: "/media/image/news/despite-of-yesterdays-heartbreaking-loss-chula-vista-fcs-future-looks-quite-bright.jpg",
      alt: `Despite of yesterday’s heartbreaking loss, Chula Vista FC’s future looks quite bright!`,
    },
  },
  {
    id: "chula-vista-fc-swpl-advanced-to-the-lamar-hunts-us-open-cups-third-qualifying-round-by-beating-fc-balboa-upsl-3-0",
    slug: "chula-vista-fc-swpl-advanced-to-the-lamar-hunts-us-open-cups-third-qualifying-round-by-beating-fc-balboa-upsl-3-0",
    title: `Chula Vista FC (SWPL) advanced to the Lamar Hunt’s US Open Cup’s Third Qualifying round by beating FC Balboa (UPSL), 3-0.`,
    date: "2024-10-28",
    excerpt: `Chula Vista FC (SWPL) advanced to the Lamar Hunt’s US Open Cup’s Third Qualifying round by beating FC Balboa (UPSL), 3-0. Chula Vista FC managed to avoid another penalty shoot-out…`,
    body: `<div>
<div dir="auto">Chula Vista FC (SWPL) advanced to the Lamar Hunt’s US Open Cup’s Third Qualifying round by beating FC Balboa (UPSL), 3-0.</div>
<div dir="auto"></div>
</div>
<div>
<div dir="auto">Chula Vista FC managed to avoid another penalty shoot-out thanks to Jordan Rojas, who was on fire last night, scoring a hat trick that led his team to a convincing victory.</div>
<div dir="auto"></div>
</div>
<div>
<div dir="auto">Rojas first goal was scored at 17th minute of the first half. With that goal, CVFC took control of the game. Rojas second goal came on CVFC’s first play of the second half (46’) and his third goal was scored at the 71st minute sealing CVFC’s victory.</div>
</div>
<div dir="auto"></div>
<div dir="auto">Chula Vista FC&#8217;s Academy Director and First Team&#8217;s Head Coach, Jose Hector Diaz, had this to say about the win: &#8220;I&#8217;m happy with the win! It&#8217;s a big step forward for our club and the boys as we work toward our Open Cup qualification goal. This victory keeps us on the right path, but there&#8217;s still plenty of work ahead to reach the tournament. We expect a formidable opponent next, one who has also earned their place in the third round. We have to keep pushing!&#8221;</div>
<div>
<div dir="auto"></div>
</div>
<div>
<div dir="auto">Chula Vista FC will now await to see who their opponent will be on Third Round to be played the weekend of November 16-17.</div>
<div dir="auto"></div>
</div>
<div>
<div dir="auto">Here is the link to the game:</div>
</div>
<div>
<div dir="auto"><span><a tabindex="0" role="link" href="https://www.youtube.com/live/nz-DZLb3bEI?feature=shared&amp;fbclid=IwZXh0bgNhZW0CMTAAAR3M9gv4DyBJqWAgJjjDwcY3lLFErD0boj2NNvScFScx28nxd_y1ak4qdwU_aem_YRTmoIFFycxd0-0kgR_UDA" target="_blank" rel="nofollow noopener noreferrer">https://www.youtube.com/live/nz-DZLb3bEI?feature=shared</a></span></div>
</div>
<div>
<div dir="auto"></div>
<div dir="auto">Way to go CVFC!!</div>
</div>
<div>
<div dir="auto"><span><a tabindex="0" role="link" href="https://www.facebook.com/hashtag/cvfc4life?__eep__=6&amp;__cft__[0]=AZUSWIlYJ3hC7xoI0v8Y9frMA44vwnW6PP7_GqHVIAlCSqJOkeTWNykvS7BMzJqDZ8seLeE0iCgUofS5GLphkftQ6pFdzW8dy2uxjB8H_S9z57fPoC4fhOLZcz0Etu8ZML0bnugv0z-07r1kCDRsQoJ3DiswArKez1eG51ExbwqmCQ_hP5l7Xxc1DfnVA5bPDk2DhWBhH5rQ3IjFnR3nns76&amp;__tn__=*NK-R">#cvfc4life</a></span></div>
</div>`,
    image: {
      src: "/media/image/news/chula-vista-fc-swpl-advanced-to-the-lamar-hunts-us-open-cups-third-qualifying-round-by-beating-fc-balboa-upsl-3-0.jpg",
      alt: `Chula Vista FC (SWPL) advanced to the Lamar Hunt’s US Open Cup’s Third Qualifying round by beating FC Balboa (UPSL), 3-0.`,
    },
  },
  {
    id: "chula-vista-fcs-first-team-is-ready-to-face-upsls-fc-balboa-in-the-lamar-hunt-us-cups-second-qualifying-round",
    slug: "chula-vista-fcs-first-team-is-ready-to-face-upsls-fc-balboa-in-the-lamar-hunt-us-cups-second-qualifying-round",
    title: `Chula Vista FC’s First Team is ready to face UPSL’s FC Balboa in the Lamar Hunt US Cup’s second qualifying round!`,
    date: "2024-10-24",
    excerpt: `Chula Vista FC’s First Team is ready to face UPSL’s FC Balboa in the Lamar Hunt US Cup’s second qualifying round! Chula Vista FC beat Desert FC 1-1 (3-1) in penalty kicks in the…`,
    body: `<h2>Chula Vista FC’s First Team is ready to face UPSL’s FC Balboa in the Lamar Hunt US Cup’s second qualifying round!</h2>
<p>Chula Vista FC beat Desert FC 1-1 (3-1) in penalty kicks in the first qualifying round back in October 5th.</p>
<p>Chula Vista FC’s penalty kicks victory, was the 4th straight time that they accomplished this. Back in 2020, Chula Vista FC had advanced to the actual US Open Cup tournament by beating Rebels SC, Academica SC and LA Monsters, all in penalty kicks!! Unfortunately, the rest of the tournament was cancelled due to Covid. Chula Vista FC had not returned to the tournament until this year.</p>
<p>The match will be held on Sunday, October 27th, at 6:30 PM, at Logan Memorial Educational Complex.</p>
<p>Con todo CVFC!!</p>
<p>#cvfc4life</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-first-team-is-ready-to-face-upsls-fc-balboa-in-the-lamar-hunt-us-cups-second-qualifying-round.png",
      alt: `Chula Vista FC’s First Team is ready to face UPSL’s FC Balboa in the Lamar Hunt US Cup’s second qualifying round!`,
    },
  },
  {
    id: "chula-vista-fc-was-very-well-represented-at-the-us-soccer-talent-id-center",
    slug: "chula-vista-fc-was-very-well-represented-at-the-us-soccer-talent-id-center",
    title: `Chula Vista FC was very well represented at the US Soccer Talent ID Center!!`,
    date: "2024-10-10",
    excerpt: `Chula Vista FC was very well represented at the US Soccer Talent ID Center!! Chula Vista FC was very well represented at the US Soccer Talent ID Center yesterday, Tuesday, October…`,
    body: `<h2><strong>Chula Vista FC was very well represented at the US Soccer Talent ID Center!!</strong></h2>
<p><strong> </strong></p>
<p><strong>Chula Vista FC was very well represented at the US Soccer Talent ID Center yesterday, Tuesday, October 9th, 2024.  </strong></p>
<p><strong>In the 2011 age group, our representatives were: Alexander Carbajal, Quincy Lamar, Carmelo Lopez-Celaya, Brandon Marcial Vazquez, Angel Sillas and Aiden Vega.</strong></p>
<p><strong>And, in the 2010 age group, our representatives were: Jacob Aguirre, Raul Cintron, Icker Martinez Palacios and Eduardo Saenz.</strong></p>
<p><strong>Our boys did great, and we are very proud of them. </strong></p>
<p><strong>About Talent ID Centers:</strong></p>
<p><strong>U.S. Soccer Talent ID Centers (IDCs) are free, single-day player identification opportunities for top talents to train and play games under the direction of U.S. Soccer Talent Identification Managers. IDC’s are a critical element to our Talent Identification Plan and are designed to identify and evaluate top talents for Youth National Teams, while accelerating their development in a challenging environment. IDC’s are scheduled throughout the year in key markets across the country.</strong></p>
<p><strong>U.S. Soccer Talent ID Centers are designed to replicate Youth National Team camps. The sessions are closed to parents and spectators. U.S. Soccer’s objective is to create an environment free from any distractions, where players take responsibility for their own development. IDCs are the pathway to the Youth National Teams. Club representatives (Directors, Coaches, Scouts) may attend and observe the session from designated areas away from field and players with prior approval.</strong></p>
<p><strong>As the National Governing Body of soccer in the United States, and under the auspices of the United States Olympic Committee, we are empowered and charged with developing the teams that represent the United States in all international competitions such as the Olympics and World Cup. The Talent ID Center Program is an integral part of this process.</strong></p>
<p><strong>At Chula Vista FC, we ensure our talent is showcased, providing them with opportunities to grow as players and giving them a chance to reach higher levels, such as college or professional leagues.</strong></p>
<p><strong>#cvfc4life</strong></p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-was-very-well-represented-at-the-us-soccer-talent-id-center.png",
      alt: `Chula Vista FC was very well represented at the US Soccer Talent ID Center!!`,
    },
  },
  {
    id: "here-we-go-again-chula-vista-fc-beat-desert-fc-1-1-3-1-pks-to-advance-to-the-next-qualifying-round-of-the-2025-us-open-cup",
    slug: "here-we-go-again-chula-vista-fc-beat-desert-fc-1-1-3-1-pks-to-advance-to-the-next-qualifying-round-of-the-2025-us-open-cup",
    title: `Here we go again! Chula Vista FC beat Desert FC 1-1 (3-1 PKs) to advance to the next qualifying round of the 2025 US Open Cup!!`,
    date: "2024-10-06",
    excerpt: `Here we go again! Chula Vista FC beat Desert FC 1-1 (3-1 PKs) to advance to the next qualifying round of the 2025 US Open Cup!! Yes, it’s 2020 all over again! Chula Vista advanced…`,
    body: `<h2>Here we go again! Chula Vista FC beat Desert FC 1-1 (3-1 PKs) to advance to the next qualifying round of the 2025 US Open Cup!!</h2>
<p>Yes, it’s 2020 all over again! Chula Vista advanced to the next qualifying round of the 2025 US Open Cup by beating Desert FC in penalty kicks 1-1 (3-1)</p>
<p>Back in 2020, Chula Vista FC had advanced to the actual US Open Cup tournament by beating Rebels SC, Academica SC and LA Monsters, all in penalty kicks!! However, Covid caused the tournament to be cancelled and CVFC was not able to crown its efforts.</p>
<p>Today, CVFC decided to continue with that tradition and once again, the game was decided in dramatic fashion.</p>
<p>CVFC had taken a 1-0 lead in the first half on Oscar Hernandez’s goal. However, Desert FC was not going to down easily and they tied the game with 10 minutes left sending the game to over time. After nobody could score, it was time again for CVFC’s to come big again at crunch time.</p>
<p>Uzziel Granillo and Bryan Ibarra scored the first two penalty kicks with Leonardo Eros Mendoza scoring the decisive one.<br />
And of course, another hero in today’s game was goalkeeper, Oliver Holt, who stopped 2 of Desert FC’s Pks.</p>
<p>Chula Vista FC will now wait to see who they will play in the next qualifying round.</p>
<p>Will keep you posted!</p>
<p>Great job CVFC!</p>
<p>#cvfc4life</p>`,
    image: {
      src: "/media/image/news/here-we-go-again-chula-vista-fc-beat-desert-fc-1-1-3-1-pks-to-advance-to-the-next-qualifying-round-of-the-2025-us-open-cup.jpg",
      alt: `Here we go again! Chula Vista FC beat Desert FC 1-1 (3-1 PKs) to advance to the next qualifying round of the 2025 US Open Cup!!`,
    },
  },
  {
    id: "the-2015-cinderella-story-chula-vista-fc-is-back-for-the-2025-us-open-cups-qualifying-round",
    slug: "the-2015-cinderella-story-chula-vista-fc-is-back-for-the-2025-us-open-cups-qualifying-round",
    title: `The 2015 Cinderella story, Chula Vista FC, is back for the 2025 US Open Cup’s qualifying round!`,
    date: "2024-10-02",
    excerpt: `The 2015 Cinderella story, Chula Vista FC, is back for the 2025 US Open Cup’s qualifying round! Chula Vista FC will be hosting Desert FC in the first qualifying round for the US…`,
    body: `<h2>The 2015 Cinderella story, Chula Vista FC, is back for the 2025 US Open Cup’s qualifying round!</h2>

<p>Chula Vista FC will be hosting Desert FC in the first qualifying round for the US Open Cup this Saturday, October 5<sup>th</sup>, at O’Farrell Charter School.</p>
<p>Back in 2015, Chula Vista FC grabbed national attention as they advanced all the way to the US Open Cup’s Third Round by beating FC Tucson, 2-1, and Arizona United, 3-0, before losing to Sacramento Republic. The last time Chula Vista FC participated in the US Open Cup, was back in 2020 when they qualified to the tournament by beating the LA Monsters, 5-4, in PKs. Unfortunately, the Covid virus caused the US Open Cup to be cancelled.</p>
<p>This year, Chula Vista FC won the Southwest Premier League (SWPL) championship, and they are ready to go to try and emulate their 2015 efforts.</p>
<p>This year’s tournament will start with 32 matches that will be played on Oct. 5 and 6 as part of the first match window of 2025 Lamar Hunt U.S. Open Cup Qualifying.</p>
<p>US Soccer describes this year’s format: “The historic annual tournament, entering its 110th edition, is the only high-profile event in American team sports where amateur sides have the potential opportunity to face professionals in meaningful competition. A record 114 teams have entered the competition via the Qualifying Rounds this fall, vying for 14 available slots in the Tournament Proper, which kicks off next spring.</p>
<p>With the goal of minimizing overall total travel distance across the Qualifying Rounds, groups (14 in total spread across the country), matchups, and byes for the Qualifying Rounds are determined by a combination of geographical considerations and by random selection. Host teams are determined by random selection.</p>
<p>Based on team counts and byes, only eight games are required in the First Qualifying Round on Oct. 5-6. To balance the remaining competition calendar, seven groups have been selected to play Second Qualifying Round Matches also on Oct. 5-6. These seven groups – Northeast, New York, Pennsylvania, DMV, Mid-Atlantic, East and Colorado – will play their Final Qualifying Round matches on Nov. 16-17. Seven remaining groups – Texas, West, California-North, California-South, Midwest and two from Florida will decide their Tournament Proper berths on Dec. 7-8.</p>
<p>The majority of the 114 teams – 92 in total – face a three-game path to the Tournament Proper. There will be 16 that face a four-game path to the Tournament Proper, and a lucky six teams with a draw that will require just two wins to advance to the Tournament Proper.”</p>
<p>Chula Vista is ready for the challenge once again.</p>
<p>Go CVFC!! #CVFC4Life</p>`,
    image: {
      src: "/media/image/news/the-2015-cinderella-story-chula-vista-fc-is-back-for-the-2025-us-open-cups-qualifying-round.png",
      alt: `The 2015 Cinderella story, Chula Vista FC, is back for the 2025 US Open Cup’s qualifying round!`,
    },
  },
  {
    id: "chula-vista-fcs-first-team-southwest-premier-leagues-champions",
    slug: "chula-vista-fcs-first-team-southwest-premier-leagues-champions",
    title: `Chula Vista FC’s First Team Southwest Premier League’s Champions!!`,
    date: "2024-07-17",
    excerpt: `Chula Vista FC’s First Team comes from behind to beat Soccer Academy Nevada, 3-2, and win the Southwest Premier League Championship! Things did not start very well for our team as…`,
    body: `<h2><strong>Chula Vista FC’s First Team comes from behind to beat Soccer Academy Nevada, 3-2, and win the Southwest Premier League Championship!</strong></h2>

<p><strong>Things did not start very well for our team as they fell behind 0-2 early in the first half. However, Chula Vista FC did not panic and systematically started their comeback (as they always do) by scoring a first half goal by Francisco ‘Cisco’ Ramirez. In the second half, Jorge Navarro evened up the score, 2-2, with the comeback being capped by an amazing olympic goal by Alberto ‘Beto’ Diaz.</strong></p>

<p><strong>Chula Vista had also comeback from a 1-2 deficit in the semifinal game the day before against Worldwide Problems FC. </strong></p>
<p><strong>Chula Vista FC had earned his ticket to the semifinals by winning the San Diego Premier League.</strong></p>

<p><strong>Chula Vista will now wait until December for the NISA Nation National Championship playoffs. They will play either a NISA Nation Southwest or Pacific Region champion for a spot in the NISA Nation Finals.</strong></p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-first-team-southwest-premier-leagues-champions.jpg",
      alt: `Chula Vista FC’s First Team Southwest Premier League’s Champions!!`,
    },
  },
  {
    id: "chula-vista-fcs-b2009-mls-nexts-goalkeeper-benjamin-de-la-herran-signs-with-club-rayados-de-monterrey",
    slug: "chula-vista-fcs-b2009-mls-nexts-goalkeeper-benjamin-de-la-herran-signs-with-club-rayados-de-monterrey",
    title: `Chula Vista FC’s B2009 MLS Next’s goalkeeper, Benjamin de la Herran, signs with Club Rayados de Monterrey!`,
    date: "2024-07-08",
    excerpt: `Chula Vista FC’s B2009 MLS Next’s goalkeeper, Benjamin de la Herran, signs with Club Rayados de Monterrey! Chula Vista FC’s B2009 MLS Next’s goalkeeper, Benjamin de la Herran…`,
    body: `<h2>Chula Vista FC’s B2009 MLS Next’s goalkeeper, Benjamin de la Herran, signs with Club Rayados de Monterrey!</h2>

<p>Chula Vista FC’s B2009 MLS Next’s goalkeeper, Benjamin de la Herran, signed with Club Rayados de Monterrey this past week. Benjamin’s hard work with Chula Vista FC’s MLS Next program paid off and now he has this amazing opportunity to reach the goal for every young player which is to someday make it to the club’s professional First Division’s squad.</p>

<p>Benjamin’s Head Coach, and Chula Vista FC’s Technical Director, Eden Esquerre, had this to say about Benjamin: ‘Benjamin grew a lot as a player at Chula Vista FC. He learned to find spaces, how to identify player number superiority and he improved technically how to play with his feet. He is young, he needs to take advantage of this opportunity at Rayados. That was his dream, and here at Chula Vista FC, we open our arms to help them achieve this. He is a good kid, very intelligent, very respectful, he is dedicated, and he wants to learn which is the most important thing. If Rayados can provide the training that we gave him here at CVFC, Benjamin will keep on growing as a player.’</p>

<p>Benjamin’s father, Benjamin de la Herran Sr, is very proud of his son: ‘We are very proud that he keeps on advancing in his soccer training with the best clubs. My advice to him is to keep focused, keep learning and most of all, enjoy the experience. Being with Chula Vista FC helped him improve his game and learn another system. He played against very tough teams. This helped him have another vision of the game and to improve his confidence and decision making during the game.’</p>

<p>Benjamin played for a year with Chula Vista FC back in 2017. He later came back for the 2022-23 season as a member of Chula Vista FC’s MLS Next team. Benjamin feels very happy with this opportunity.  He hopes that one day he will be able to make his debut with the First Division team. Benjamin’s favorite team is Rayados and his favorite player is Messi.</p>

<p>This year has been very productive for a lot of our Chula Vista FC players. They have been able to sign with pro teams as well as placing themselves in good colleges. The opportunities here at Chula Vista FC are available to them. Programs like MLS Next and Elite Academy, are excellent tools for them to take advantage of. They just need to be dedicated and disciplined and they will be able to achieve all their goals and dreams.</p>

<p>Best of luck Benjamin! We are proud of you!!</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-b2009-mls-nexts-goalkeeper-benjamin-de-la-herran-signs-with-club-rayados-de-monterrey.png",
      alt: `Chula Vista FC’s B2009 MLS Next’s goalkeeper, Benjamin de la Herran, signs with Club Rayados de Monterrey!`,
    },
  },
  {
    id: "our-chula-vista-fc-mls-next-b2011-u13-wins-all-three-games-at-the-mls-next-cup-showcase",
    slug: "our-chula-vista-fc-mls-next-b2011-u13-wins-all-three-games-at-the-mls-next-cup-showcase",
    title: `Our Chula Vista FC MLS Next B2011 (U13) wins all three games at the MLS Next Cup & Showcase!`,
    date: "2024-06-24",
    excerpt: `Our Chula Vista FC MLS Next B2011 (U13) beat the San Francisco Glens, 3-0, to finish their MLS Next Cup & Showcase participation. The boys won their three games after finishing…`,
    body: `<p>Our Chula Vista FC MLS Next B2011 (U13) beat the San Francisco Glens, 3-0, to finish their MLS Next Cup &amp; Showcase participation. The boys won their three games after finishing the regular MLS Next season in second place with a 28-2-2 record. LAFC was first place with a 26-2-1 record.</p>`,
    image: {
      src: "/media/image/news/our-chula-vista-fc-mls-next-b2011-u13-wins-all-three-games-at-the-mls-next-cup-showcase.jpg",
      alt: `Our Chula Vista FC MLS Next B2011 (U13) wins all three games at the MLS Next Cup & Showcase!`,
    },
  },
  {
    id: "our-chula-vista-fc-mls-next-b2008-u16-team-is-ready-to-start-their-participation-in-the-mls-next-flex-tournament-in-boyds-maryland",
    slug: "our-chula-vista-fc-mls-next-b2008-u16-team-is-ready-to-start-their-participation-in-the-mls-next-flex-tournament-in-boyds-maryland",
    title: `Our Chula Vista FC MLS Next B2008 (U16) team is ready to start their participation in the MLS Next Flex tournament in Boyds, Maryland.`,
    date: "2024-05-10",
    excerpt: `Our Chula Vista FC MLS Next B2008 (U16) team is ready to start their participation in the MLS Next Flex tournament in Boyds, Maryland starting tomorrow, Friday. The team’s Head…`,
    body: `<h2>Our Chula Vista FC MLS Next B2008 (U16) team is ready to start their participation in the MLS Next Flex tournament in Boyds, Maryland starting tomorrow, Friday.</h2>
<p>The team’s Head Coach, Jose Antonio Govea, had this to say about the tournament: ‘MLS Next Flex is something special. There’s lots of emotion and passion so I am curious to see what this event brings out in the team. We still have to compete this weekend and demonstrate the values that Chula Vista FC stands for. ‘</p>
<p>The team qualified for the tournament by having an outstanding, 14-4-0, MLS Flex record. On his team’s success, Coach Govea had this to say: ‘I feel much credit goes to the coaches before me and staff for providing an atmosphere where the boys can excel in. The families of our players as well. Their sacrifice does not go unnoticed.’ The team had an amazing 9-game winning streak during the season.</p>
<p>The boys will face St Louis City SC tomorrow (Friday), Athletum FC on Saturday and Ballistic United on Monday.</p>
<p>We wish coaches and teams the best of luck! CVFC very well represented!</p>`,
    image: {
      src: "/media/image/news/our-chula-vista-fc-mls-next-b2008-u16-team-is-ready-to-start-their-participation-in-the-mls-next-flex-tournament-in-boyds-maryland.jpg",
      alt: `Our Chula Vista FC MLS Next B2008 (U16) team is ready to start their participation in the MLS Next Flex tournament in Boyds, Maryland.`,
    },
  },
  {
    id: "chula-vista-fc-b2009-villa-socals-state-cup-finalists",
    slug: "chula-vista-fc-b2009-villa-socals-state-cup-finalists",
    title: `Chula Vista FC B2009 Villa Socal’s State Cup Finalists!`,
    date: "2024-04-23",
    excerpt: `Chula Vista FC B2009 Villa Socal’s State Cup Finalists! What an amazing run for our Chula Vista FC B2009 Villa team! Coach Hernan Maldonado had this to say about his boys’…`,
    body: `<h2>Chula Vista FC B2009 Villa Socal’s State Cup Finalists!</h2>

<p>What an amazing run for our Chula Vista FC B2009 Villa team! Coach Hernan Maldonado had this to say about his boys’ performance: “Going into the State Cup, my expectations were high. I believe that having high expectations is always the key to success.&#8221; Coach Maldonado then spoke about how he kept his team motivated during the tournament: &#8220;The way I kept the boys motivated was through my biggest influence, the late Kobe Bryant. We channeled an old clip where he speaks about &#8216;Finishing the Job.&#8217; They all knew what the goal was and what he was alluding to.&#8221; The boys sure enough got Coach Maldonado’s message. He also spoke about the moment when he realized that this tournament had become something special and how he helped his players keep their composure during the penalty kicks series: &#8216;The moment I felt that we could make the championship game was our comeback win in the Round of 16. The boys secured a comeback 4-3 victory against California Athletic and showed the championship mentality needed to make a run. Penalty kicks are always exciting and filled with pressure. What I always told my players was to enjoy the pressure; they earned it, and it’s a privilege to be in these positions.”</p>

<p>Here is how the tournament unfolded:</p>

<p>Our boys started the tournament with a heartbreaking 0-1 loss to Express SC. However, they bounced back the next day to destroy East County Surf, 6-2. The boys had to wait two weeks to come back to action because of their games being rained out. The break seemed to have given them that extra energy, and it showed when they beat cross-town rivals, Rebels SC, 4-1, to advance to the Round of 16, in which they beat California Athletic SC, 4-3, to advance to the quarterfinals. None of us could have imagined what these boys’ future had in store for them. Winning a penalty kick series in a dramatic fashion is always a dream that soccer players might have had in their lifetime. But these boys not only accomplished this once. They did it TWICE in a row!! The first one came at the expense of Murrieta Soccer Academy during the quarterfinals. After the game had ended in a 0-0 tie, the boys outscored MSA, 4-3, after Lin Galvez scored the deciding PK to advance to the semifinals. Then, for an encore performance, the boys did it again against TFA Antelope Valley. The game ended 1-1, and then it was decided in the same dramatic fashion, 5-4, with Lin again making the winning penalty kick to send the team to the Championship game. Not only was Lin a hero with his amazing poise to score those two crucial penalty kicks, but you always must have a great performance from the team’s goalkeeper. And Dylannh Vergara made it possible by stopping those crucial shots to give his team a chance to win the game. The final game’s score against Bakersfield Alliance Atlas was irrelevant. These boys faced a team that scored 45 goals in the tournament. So, what they accomplished by making it this far is what really counts, and we at Chula Vista FC are very proud of them. This includes players, coaches, and of course the most important component of all our teams: The parents. Without them, we would not have the privilege of coaching their sons and daughters in our club.</p>

<p>Coach Maldonado was also very grateful to his team: “I would like to thank everyone for the support and encouragement through this run. I would like to give all the credit to these young men who fought hard for me. They deserve all the recognition for our performances. Thank you, boys, for an unforgettable season!”</p>

<p>Congrats again Coach Hernan Maldonado and team for your awesome performance!!</p>

<p>Here is the roster:</p>

<p>Coach</p>
<p>Hernan Maldonado</p>

<p>Team Manager</p>
<p>Celina Ali</p>

<p>Players:</p>
<table>
<tbody>
<tr>
<td>Ezra</td>
<td>Abiy</td>
</tr>
<tr>
<td>Geovanni</td>
<td>Aguilar</td>
</tr>
<tr>
<td>Abdullah</td>
<td>Ali</td>
</tr>
<tr>
<td>Jaeden</td>
<td>Arvizu</td>
</tr>
<tr>
<td>Adrian</td>
<td>Ascencio</td>
</tr>
<tr>
<td>Jorell</td>
<td>Baluyot</td>
</tr>
<tr>
<td>Diego</td>
<td>Campos</td>
</tr>
<tr>
<td>Cesar</td>
<td>Delgadillo</td>
</tr>
<tr>
<td>Lin</td>
<td>Galvez</td>
</tr>
<tr>
<td>Angel</td>
<td>Gonzales</td>
</tr>
<tr>
<td>Matthew</td>
<td>Jung</td>
</tr>
<tr>
<td>Allen</td>
<td>Legault</td>
</tr>
<tr>
<td>Sebastian</td>
<td>Luna Valdez</td>
</tr>
<tr>
<td>Marcos</td>
<td>Medrano</td>
</tr>
<tr>
<td>Nathan</td>
<td>Nguyen</td>
</tr>
<tr>
<td>Dimitri</td>
<td>Salim</td>
</tr>
<tr>
<td>Angel</td>
<td>Torres Valencia</td>
</tr>
<tr>
<td>Dylannh</td>
<td>Vergara</td>
</tr>
</tbody>
</table>`,
    image: {
      src: "/media/image/news/chula-vista-fc-b2009-villa-socals-state-cup-finalists.png",
      alt: `Chula Vista FC B2009 Villa Socal’s State Cup Finalists!`,
    },
  },
  {
    id: "2318",
    slug: "2318",
    title: `Chula Vista FC and Rebels SC have joined forces to launch a campaign aimed at improving soccer fields in Chula Vista.`,
    date: "2024-03-27",
    excerpt: `Chula Vista FC and Rebels SC have joined forces to launch a campaign aimed at improving soccer fields in Chula Vista. This past Tuesday, soccer clubs Chula Vista FC and Rebels SC…`,
    body: `<h2>Chula Vista FC and Rebels SC have joined forces to launch a campaign aimed at improving soccer fields in Chula Vista.</h2>
<p>This past Tuesday, soccer clubs Chula Vista FC and Rebels SC attended the weekly Chula Vista City Council meeting to inform council members about their campaign to enhance soccer fields in the city. Chula Vista FC’s Academy Director, Jose Hector Diaz, explained: “We have been diligently working to secure turf fields for our club over the past few months. Our efforts have been met with challenges, but we have remained steadfast in pursuing better facilities for our players. The City Council meeting was a crucial opportunity for us to advocate for soccer facilities, including turf fields, which are essential for the growth and development of our soccer program.” Diaz continued: “We took a significant step forward yesterday. We&#8217;re working closely with the mayor and council members to improve our situation and secure funding as soon as possible.”</p>
<p>During the City Council meeting, Diaz had the chance to address the council members: “We are going to launch a campaign to improve our fields. We are not going to request anything from the city. We are only going to ask you to support us and help us with this campaign. I hope that you join us in this fight to improve the fields so our kids have civic pride and don’t have to go to neighboring cities to play our ‘home’ games. We want to play in Chula Vista, proudly wear our logo on our chests, and represent our community as it deserves.”</p>
<p>Joining Diaz in the City Council meeting were Rebels SC’s Executive Director, Ryan Marquez, Chula Vista FC’s Vice President and current Youth Sports Council President for the City of Chula Vista, Benito Delgado, and Chula Vista FC’s Registrar, Vicente Ortiz.</p>
<p>Delgado addressed the City Council, stating: “Did you know that the City of Chula Vista has 2 swimming pools that can host competitive events, 37 basketball courts, and 33 baseball diamonds, with 19 of them exclusively used for baseball and softball, unable to be shared with any other sport? And did you know that there are zero soccer fields in the City of Chula Vista? Zero!” Delgado continued: “This hinders us. We cannot have snack bars or sell advertising rights for signs. We continuously must rent fields in neighboring communities to host events at incredible expense. Parents who attend these events do not stay in Chula Vista; they stay in San Diego and pay a hotel tax there to those communities, not ours.” Delgado concluded: “Our campaign is going to challenge the City Council and others to find a way for us to get competitive turf fields so we can host events and our children can play here in their city with the civic pride they should have instead of having to play on fields in other cities. Many of our kids can get scholarships to play for higher-end clubs in North County, but they choose to stay here. Help them progress in their lives. We look forward to working with the city.”</p>
<p>Ortiz addressed the condition of Chula Vista&#8217;s fields to the City Council: “Every time we go to other cities’ fields, we see that their fields are nice—turf, brand new, perfect. And then we come to our fields, and the other clubs look at us and say, ‘This is where you guys play?’ It’s embarrassing! I want to be proud of Chula Vista. I want you guys to assist us and work with us so all of us can be proud of what we have in Chula Vista.”</p>
<p>Marquez also addressed the City Council: “One of the saddest things we see is when our kids go to play in other cities and play on their fields and say ‘Wow! We wish we could have that!’ We don’t want that anymore. We have the leagues now where kids can stay here.” Marquez added: “We want to be partners. We want to make sure we can provide our kids with fields, turf fields, safe and equitable fields so that we can continue sending kids to college or professional teams.” Marquez concluded: “We are passionate. We want you to be passionate about what we do as well because we are doing it for our city, and we want to keep our kids and be proud of what we do.”</p>
<p>Overall, these statements reflect the common goal of both clubs: to make Chula Vista&#8217;s soccer players proud of their city every time they put on their soccer gear. There were around 100 of our players with their families in attendance at the City Council meeting last night. This was an amazing statement by both clubs, which have learned to compete fiercely on the pitch but also understand that coming together when needed will benefit the greater good of the sport of soccer and their soccer families. These clubs represent over 2000 soccer players plus their families. We really hope that City Council members embrace and appreciate the effort that these entities have put in to represent the City of Chula Vista with pride.</p>`,
    image: {
      src: "/media/image/news/2318.jpg",
      alt: `Chula Vista FC and Rebels SC have joined forces to launch a campaign aimed at improving soccer fields in Chula Vista.`,
    },
  },
  {
    id: "chula-vista-fc-joins-elite-academy-2-for-the-2024-25-season",
    slug: "chula-vista-fc-joins-elite-academy-2-for-the-2024-25-season",
    title: `Chula Vista FC joins Elite Academy 2 for the 2024-25 season!!`,
    date: "2024-03-07",
    excerpt: `Chula Vista Futbol Club’s acceptance into Elite Academy League 2, alongside our existing membership in the Elite Academy League, signifies a pivotal moment in our club’s…`,
    body: `<p>Chula Vista Futbol Club’s acceptance into Elite Academy League 2, alongside our existing membership in the Elite Academy League, signifies a pivotal moment in our club’s commitment to player development. As we expand our presence within the league, we reinforce our dedication to providing unparalleled opportunities for our young athletes. This milestone underscores our unwavering commitment to fostering the growth and potential of our players, showcasing our relentless pursuit of excellence. By investing in this league, we reaffirm our pledge to deliver quality experiences and pathways, empowering each player to realize their fullest potential on and off the field.” &#8211; Fernando Mares Quiroz, Chula Vista FC Director of Operations &amp; EA Director</p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-joins-elite-academy-2-for-the-2024-25-season.jpg",
      alt: `Chula Vista FC joins Elite Academy 2 for the 2024-25 season!!`,
    },
  },
  {
    id: "chula-vista-fcs-mls-next-select-team-will-make-a-visit-to-arizona-western-college-this-saturday-to-play-a-couple-of-games-and-tour-the-colleges-campus",
    slug: "chula-vista-fcs-mls-next-select-team-will-make-a-visit-to-arizona-western-college-this-saturday-to-play-a-couple-of-games-and-tour-the-colleges-campus",
    title: `Chula Vista FC’s MLS Next Select team will make a visit to Arizona Western College this Saturday to play a couple of games and tour the college’s campus.`,
    date: "2024-03-02",
    excerpt: `Chula Vista FC’s MLS Next Select team will make a visit to Arizona Western College this Saturday to play a couple of games and tour the college’s campus. In an effort to give our…`,
    body: `<h2>Chula Vista FC’s MLS Next Select team will make a visit to Arizona Western College this Saturday to play a couple of games and tour the college’s campus.</h2>
<p>In an effort to give our Chula Vista FC players a chance to experience the college atmosphere, the club has formed a select team composed of MLS Next and Elite Academy players to tour the Arizona Western College campus and play a couple a games against Division 1 colleges. Chula Vista FC’s Academy Director, Jose Hector Diaz, had this to say: “Our trip to Yuma to visit Arizona Western College is shaping up to be a fantastic opportunity for all involved. I genuinely enjoy the process and the unique experience of competing against college teams, offering our players valuable exposure and development opportunities. It is a great opportunity to be evaluated by the college’s coaching staff. We will have a couple of games against Arizona Western College and Ottawa University, who is visiting AWC. In between games we will take a brief tour of the campus.” Diaz added: “The college has a residential hall. I am hoping that this triggers their mind to think that they could live on their own at the college. The college is not far from home, and they can easily go home and come back the same day. This, I think, will push some kids towards pursuing higher education.”  Diaz concluded. “This will now be established as an annual event.”</p>
<p>Current Chula Vista FC B2011 Villa Head Coach, and Arizona Western College’s Alumni, Francisco ‘Cisco’ Ramirez, will also accompany the team. Cisco had this to say about the college’s visit: I attended AWC 2012-2014. ⁠The experience was great. It helped that I went with teammates from San Diego. I got to experience the dorm life, which was great. The fact that you are away from home but close enough that you could visit when you miss it, made it easier. I played soccer the two years that I was there. Made All-American Honorable Mentioned my first year. Unfortunately, it ended a little short due to an ACL injury that required surgery. Second year was a little of getting my rhythm back. Academically, I received my Degree in General Studies. It wasn’t easy. But the people there helped me a lot. Cisco continued by explaining how this experience will benefit our Chula Vista FC’s current players: ⁠The players will benefit from this College both in their normal life and on the field. You become more independent, and you get the experience of feeling what College is about. On the field, you will get to test where you are physically with the big Division 1 college boys. It also helps improve your grades if they are not the best during high school so you can then transfer to a four-year University. Ramirez concluded on how this benefits Chula Vista FC: ⁠It is a very good opportunity to showcase the talent that is hiding down on our Chula Vista area. Take advantage of this and make the best of it by having fun.”</p>
<p>As a Chula Vista FC player, Cisco has been part of many of the club’s major achievements. He was part of the club’s first U19 team that won National Cup in 2013, the club’s adult team that won the Regional Championship in 2014 and was also part of the adult team that was considered the Cinderella story that grabbed national attention in the 2015 Lamar Hunt Open Cup by reaching the Third Round of the competition.</p>
<p>The select team will be composed by the following players:</p>

<table>
<tbody>
<tr>
<td>Daniel</td>
<td>Barragan</td>
<td>Former CVFC MLS Next player</td>
</tr>
<tr>
<td>Julio</td>
<td>Cardona</td>
<td>Former CVFC MLS Next player</td>
</tr>
<tr>
<td>Cesar</td>
<td>Covarrubias</td>
<td>Former CVFC MLS Next player</td>
</tr>
<tr>
<td>Miguel</td>
<td>Badillo</td>
<td>Chula Vista FC B2005 Elite Academy</td>
</tr>
<tr>
<td>Broward Cole</td>
<td>Maryan</td>
<td>Chula Vista FC B2005 Elite Academy</td>
</tr>
<tr>
<td>Sebastian</td>
<td>Mendoza</td>
<td>Chula Vista FC B2005 Elite Academy</td>
</tr>
<tr>
<td>Andres</td>
<td>Ramirez</td>
<td>Chula Vista FC B2005 Elite Academy</td>
</tr>
<tr>
<td>AJ</td>
<td>Salazar</td>
<td>Chula Vista FC B2005 Elite Academy</td>
</tr>
<tr>
<td>Adrian</td>
<td>Cruz Cota</td>
<td>Chula Vista FC B2005 MLS Next</td>
</tr>
<tr>
<td>Luis</td>
<td>Maciel</td>
<td>Chula Vista FC B2005 MLS Next</td>
</tr>
<tr>
<td>Diego</td>
<td>Mendoza</td>
<td>Chula Vista FC B2005 MLS Next</td>
</tr>
<tr>
<td>Nicholas</td>
<td>Orozco</td>
<td>Chula Vista FC B2007 MLS Next</td>
</tr>
<tr>
<td>Alonso</td>
<td>Robles</td>
<td>Chula Vista FC B2007 MLS Next</td>
</tr>
<tr>
<td>Emiliano</td>
<td>Yanez</td>
<td>Chula Vista FC B2007 MLS Next</td>
</tr>
<tr>
<td>Iker</td>
<td>Fiol</td>
<td>Chula Vista FC B2008 MLS Next</td>
</tr>
<tr>
<td>Diego</td>
<td>Mosqueda</td>
<td>Chula Vista FC B2008 MLS Next</td>
</tr>
<tr>
<td>Axel</td>
<td>Rodriguez</td>
<td>Chula Vista FC B2008 MLS Next</td>
</tr>
<tr>
<td>Aaron</td>
<td>Tamer</td>
<td>Chula Vista FC B2008 MLS Next</td>
</tr>
<tr>
<td>Elvis</td>
<td>Villalva</td>
<td>Chula Vista FC B2008 MLS Next</td>
</tr>
</tbody>
</table>

<p>Chula Vista FC is committed to not only developing the athletic side of our players. But also, to assist them in their academic future.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-mls-next-select-team-will-make-a-visit-to-arizona-western-college-this-saturday-to-play-a-couple-of-games-and-tour-the-colleges-campus.jpeg",
      alt: `Chula Vista FC’s MLS Next Select team will make a visit to Arizona Western College this Saturday to play a couple of games and tour the college’s campus.`,
    },
  },
  {
    id: "chula-vista-fc-g2009-academys-kareli-rascon",
    slug: "chula-vista-fc-g2009-academys-kareli-rascon",
    title: `Chula Vista FC G2009 Academy’s Kareli Rascon`,
    date: "2024-02-27",
    excerpt: `Chula Vista FC G2009 Academy’s Kareli Rascon is a great athlete!! Chula Vista FC G2009 Academy’s Kareli Rascon has been playing soccer since she was 4 years old. Kareli started…`,
    body: `<h2>Chula Vista FC G2009 Academy’s Kareli Rascon is a great athlete!!</h2>
<p>Chula Vista FC G2009 Academy’s Kareli Rascon has been playing soccer since she was 4 years old. Kareli started playing with CVFC in 2016. After exploring other opportunities, Kareli came back to CVFC this past Fall season and she was one of the primary factors for her team to go undefeated in NPL play. Her current head coach and Academy Director, Jose Hector Diaz, had this to say about Kareli: “Kareli is a center forward with us but is willing to play other positions and she is a true team player. She is aggressive to the ball and always willing to put the extra energy to put the ball behind the net. She joined our club long ago when she started playing, and we are extremely glad to have her back.’ CVFC G2009 Academy finished the season undefeated with a 7-0-5 record.</p>
<p>Not only does Kareli play soccer, but she is also a great athlete in other sports. Her Dad, Adrian Rascon, shared her impressive athletic achievements: “This is Kareli’s first year playing field hockey and she scored in every game. The last 2 years she ran cross country for her school and every race she finished first except for one race. ⁠She received the MVP award for her team. ⁠Kareli also runs track and field for a club called San Diego Mercury.  She can run anything from 100 to the 1500-meter dash, but she’s mostly a mid-distance runner 400/800 meter. She has qualified for the Junior Olympics for the past 2 years and has raced. Last year she finished in 10th place in the 800-meter dash at the junior Olympics in Oregon. This year she’s looking to be the top runner for her events. She received an award from the USA track and Field (USATF) season. Kareli also played on the Eastlake Middle Soccer team. They won the Championship this past Saturday. She has been invited to participate with the 2010’s PDP (Player Development Program).’ Mr. Rascon concluded on why she is able to achieve all these: “When Kareli is in the zone and focused, she’s a hard person to stop. She’s a very coachable girl, always looking to improve. She is highly self-motivated.”</p>
<p>Kareli is not only a good athlete. She is also doing very well in school with a 3.8 GPA.</p>
<p>All of us at Chula Vista FC are delighted to have back home such a great athlete and great student. We are proud of you Kareli. Keep up the great work!!</p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-g2009-academys-kareli-rascon.jpeg",
      alt: `Chula Vista FC G2009 Academy’s Kareli Rascon`,
    },
  },
  {
    id: "avian-ortiz",
    slug: "avian-ortiz",
    title: `Chula Vista FC B2007 Elite Academy’s Avian Ortiz`,
    date: "2024-02-12",
    excerpt: `Chula Vista FC B2007 Elite Academy’s, Avian Ortiz, plays right back and center back for his team. He has been able to enjoy and maximize his soccer experience with our club. Avian…`,
    body: `<h2>Chula Vista FC B2007 Elite Academy’s, Avian Ortiz, plays right back and center back for his team. He has been able to enjoy and maximize his soccer experience with our club.</h2>
<p>Avian has been with CVFC/DV7 since 2016. His father and current CVFC’s Elite Academy League’s Registrar, Vince Ortiz, explains why he has kept Avian with CVFC/DV7 for this long: “I took Avian to other clubs’ tryouts but they never were able to recognize him as an individual. I always had questions about what team level, what my son look like and what he needed to work on and what they liked about him. But they were not able to respond to.” Mr. Ortiz was able to find those answers with CVFC/DV7.</p>
<p>Avian had some memorable experiences with DV7. One of them was winning State Cup in 2019. Mr. Ortiz recalls: “The State Cup run was amazing. The team struggled at the beginning of the season with the team’s new DV7 methodology. But soon, the tide turned and the dynamic of controlling the game was solidified. Avian’s determination to be the best defender on his team carried them throughout the season. When State Cup started, every family was in great spirit and hopeful for the boys. The team was able to advance through bracket play, round of 32, sweet sixteen and quarterfinals. David Villa sent a message to the boys encouraging them to cease the moment and have fun. The boys went on to win the semifinal game and then the championship. Never in a million years did I see our team have this much success from where we started. Proud parent and loyal family. Recognize your players and know what they represent.”</p>
<p>Avian also had the chance to visit Spain with DV7. Mr. Ortiz said: “The trip to Spain was driven by DV7 as training filled and scrimmages with local clubs. As a true believer in the program Avian had the opportunity to experience training and scrimmage at Camp Nou. The cool part of the training at Camp Nou was that Avian was officially registered on Barcelona’s records as attending training and scrimmage. The Valencia CF training ground and with a local club and fields was also a great experience. Every day was fully filled with training regimen attendance and scrimmages. Attended two professional games including Barcelona where we saw Messi play. The atmosphere at the game was breathtaking.” No doubt those were amazing experiences for Avian and his father.</p>
<p>Avian is a Junior, at Eastlake High School. He currently plays center back and winger for the Varsity Soccer team. He has been awarded Defensive Player of the year for each of the last two years. Avian has also played football as linebacker and free safety.</p>
<p>Avian’s favorite soccer player is Didier Drogba.</p>
<p>Avian’s soccer experiences have been amazing and full of fun memories. This is what club soccer should be all about. We appreciate Avian and his family for being loyal to our CVFC/DV7 family and we are very glad that they have enjoyed the soccer experience with our club.</p>`,
    image: {
      src: "/media/image/news/avian-ortiz.jpeg",
      alt: `Chula Vista FC B2007 Elite Academy’s Avian Ortiz`,
    },
  },
  {
    id: "chula-vista-fc-g2009-academys-hannah-gomez",
    slug: "chula-vista-fc-g2009-academys-hannah-gomez",
    title: `Chula Vista FC G2009 Academy’s, Hannah Gomez`,
    date: "2024-02-12",
    excerpt: `Chula Vista FC G2009 Academy’s Hannah Gomez has been playing soccer since she was 8 years old. Her mother, Elizabeth Gomez, recalls how she started with our DV7/CVFC family: “We…`,
    body: `<p>Chula Vista FC G2009 Academy’s Hannah Gomez has been playing soccer since she was 8 years old. Her mother, Elizabeth Gomez, recalls how she started with our DV7/CVFC family: “We heard that David Villa was coming to San Diego. After an amazing clinic with David Villa and meeting former DV7 Director and former CVFC DA (US Development Academy) Head Coach Diego Gomez, we decided to join DV7. Hannah was the first 2009 girl to sign up. I know this because she had the first pick when it came to choosing her number (# 7). Ever since then, we have been part of the DV7/CVFC family.”<br />
CVFC’s Academy Director and Hannah’s current Head Coach, Jose Hector Diaz, had this to say: Hannah is a highly talented technical player who makes a big difference in the field. She consistently disrupts our opponents, creating awkward situations for them and opportunities for her team. She has been with CVFC since the partnership with DV7 was formed, and we appreciate her and her family’s loyalty to our club.” Hannah is a starter and plays as an attacking midfielder for her team.<br />
Hannah is a great athlete. Not only does she play soccer, but she also plays basketball and field hockey for her school. Mrs. Gomez, who is also CVFC’s Social Media Director, tells us about Hannah’s other sports achievements: “Hannah played soccer for Hilltop Middle and helped bring the banner home in both 7th and 8th grade. She was named the MVP. She is currently a freshman at Hilltop High School and a starter on the Varsity team. Hannah also joined the basketball team last year at Hilltop Middle. She also played on the varsity field hockey at Hilltop High School last fall and made the all-star team. She was also named Best Offensive Player.”<br />
Hannah’s idol is Cristiano Ronaldo, and her nickname is Chewie.<br />
Hannah is also very successful academically. She is a straight-A student with a 4.0 GPA for all middle school and her first semester of high school. She has won an Honor Roll award and a Leadership Award.<br />
Hannah’s academic and athletic achievements are exactly what we at CVFC/DV7 try to promote each day to our players. We are very proud of her and thankful to her family for their loyalty.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-g2009-academys-hannah-gomez.jpeg",
      alt: `Chula Vista FC G2009 Academy’s, Hannah Gomez`,
    },
  },
  {
    id: "chula-vista-fc-mls-next-b2007s-center-forward-bryan-yael-ramos-signed-a-pro-contract-with-club-tijuana-xoloitzcuintles-de-caliente",
    slug: "chula-vista-fc-mls-next-b2007s-center-forward-bryan-yael-ramos-signed-a-pro-contract-with-club-tijuana-xoloitzcuintles-de-caliente",
    title: `Chula Vista FC MLS Next B2007’s center forward, Bryan Yael Ramos, signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente.`,
    date: "2023-12-31",
    excerpt: `Chula Vista FC MLS Next B2007’s center forward, Bryan Yael Ramos, signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente. Chula Vista FC MLS Next B2007’s center…`,
    body: `<h2>Chula Vista FC MLS Next B2007’s center forward, Bryan Yael Ramos, signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente.</h2>

<p>Chula Vista FC MLS Next B2007’s center forward, Bryan Yael Ramos, signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente. Yael shared how he feels about signing with Xolos: I believe that all of us that have played soccer since we were little kids, have this dream to play for a professional team. And, today, my dream is becoming a reality. This is the beginning of my dream.”   Yael continued: I have received a lot of support from CVFC. Here, I have learned to be more disciplined and have more confidence in myself. And most of all, I have made a lot of friends.”</p>

<p>Yael’s mother, Fabiola Mancilla, had this to say: “I know about the quality of play that he can have. Maybe the road will not be that easy. But I will always be there to support him.” Yael’s Dad, Jose Alberto Ramos, added: “I see something in him that maybe he does not even see. I am confident that this will be a great step for him. The change will not be easy, but we will leave everything to time.”</p>

<p>Both of his MLS Next coaches, Fernando Mares (Current) and Isaac Valencia (Former), were very happy for Yael. Mares said: “I am a little worried about having my starting goalkeeper and my starting center forward leave. Our team is 5-1 in League play. But I am very happy for both to have this opportunity. I am confident we will hear great things about them.” Valencia had this to say: “Congratulations to Yael on signing with Tijuana Xolos. We are all very proud of him and I thank Yael for his commitment and contributions to the club throughout the previous years. As one of his coaches, it has been rewarding to witness his growth since joining us as a boy with DV7. We will miss him. But we are excited for his next challenge and of course his Chula Vista FC family will be supporting him. Vamos Yael!” Yael, who’s nickname is ‘El Cazador’ (The Hunter), came over to Chula Vista FC when DV7 merged with the club.</p>

<p>Chula Vista FC Academy Director, Jose Hector Diaz, said: “I am delighted for Yael as he advances his soccer journey, aiming to reach his fullest potential. Chula Vista FC aims to be recognized as the top youth soccer club in San Diego. Despite not always being acknowledged, partly due to several name changes before 2015, we are proud to be the oldest club in the South Bay and a leader in sending players not only to professional MLS youth academies and Liga MX academies but also to U.S. Soccer&#8217;s Youth National Team ID centers. A key strength of our club is the passion that our players and coaching staff bring to the field. This passion is the driving force that propels our club forward more than any other resource. We wish you the best, Yael, and want you to know that we are always here to support you as best as we can.”</p>

<p>Former Chula Vista FC’s Club President and current VP of Administration, Oscar Zamora, is really pleased on what the club has achieved during the past months: “This is what I had envisioned back when I had the privilege to be the club’s President. Have Chula Vista FC provide our local community’s youth the opportunity to help them play at a professional and top college levels as well as top Youth leagues such as MLS Next and Elite Academy at an affordable price. Our Academy Director, Jose Hector Diaz, has done an awesome job of recruiting wonderful coaches that have helped us achieve this goal. And we are not done yet. The sky is the limit on what Diaz and his coaching crew can accomplish in the near future and beyond.”</p>`,
    image: {
      src: "/media/image/news/chula-vista-fc-mls-next-b2007s-center-forward-bryan-yael-ramos-signed-a-pro-contract-with-club-tijuana-xoloitzcuintles-de-caliente.jpg",
      alt: `Chula Vista FC MLS Next B2007’s center forward, Bryan Yael Ramos, signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente.`,
    },
  },
  {
    id: "chula-vista-fcs-mls-next-b2007s-goalkeeper-emilio-silva-signed-a-pro-contract-with-club-tijuana-xoloitzcuintles-de-caliente",
    slug: "chula-vista-fcs-mls-next-b2007s-goalkeeper-emilio-silva-signed-a-pro-contract-with-club-tijuana-xoloitzcuintles-de-caliente",
    title: `Chula Vista FC’s MLS Next B2007’s goalkeeper, Emilio Silva, signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente!!`,
    date: "2023-12-31",
    excerpt: `Chula Vista FC’s MLS Next B2007’s goalkeeper, Emilio Silva, signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente!! Chula Vista FC’s MLS Next B2007’s goalkeeper…`,
    body: `<h2><strong>Chula Vista FC’s MLS Next B2007’s goalkeeper, Emilio Silva, signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente!!</strong></h2>
<p><strong> </strong></p>
<p><strong>Chula Vista FC’s MLS Next B2007’s goalkeeper, Emilio Silva signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente. Emilio had this to say: “I am very happy and very calm because I believe it was the right moment in my life to have signed the contract.  I will give my everything to represent the name of Chula Vista in a good way.” Silva is also thankful to Chula Vista FC and its staff: “Playing in Chula Vista FC increased my confidence a lot. I learned many things tactically and technically. I want to thank my coaches who saw potential in me and helped me improve.”</strong></p>

<p><strong>Emilio’s parents are very happy and very supportive. Emilio’s mother, Yendi Silva, said: “I am very proud for Emilio’s discipline and persistence. As long as he is doing well, I will support him all the way.”</strong></p>

<p><strong>Emilio’s Head Coach, Fernando Mares, had this to say: </strong><strong>&#8220;As a coach who loves to develop players, it is always a pleasure to see one of our players pursue their dreams and witness their development over the years. It&#8217;s very exciting to see how he has progressed, and I hope to assist more of our players in reaching those levels.&#8221;</strong></p>

<p><strong>Chula Vista FC’s goalkeepers coach, Mario Miranda, was also very happy for Emilio: “Emilio has been with our MLS Next’s GK program for 4 years. Emilio has been a hard-working leader on the pitch. He continuously strives to improve his skills and technique. We will miss Emilio. But I am extremely proud of him, and it has been an honor being his coach.”</strong></p>

<p><strong>Chula Vista FC’s Academy Director, Jose Hector Diaz, loves Emilio’s professional approach: “Emilio initially joined Chula Vista FC for the 2016-17 season. He was currently playing under Coach Fernando Mares for this season. Emilio has consistently demonstrated the utmost professionalism. We are thrilled to support him as he takes a significant step forward in his career by joining the professional club, Club Tijuana Xoloitzcuintles de Caliente, to pursue his dreams.” </strong></p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-mls-next-b2007s-goalkeeper-emilio-silva-signed-a-pro-contract-with-club-tijuana-xoloitzcuintles-de-caliente.jpg",
      alt: `Chula Vista FC’s MLS Next B2007’s goalkeeper, Emilio Silva, signed a pro contract with Club Tijuana Xoloitzcuintles de Caliente!!`,
    },
  },
  {
    id: "mini-maestros-second-season-will-start-january-8th",
    slug: "mini-maestros-second-season-will-start-january-8th",
    title: `Mini Maestros second season will start January 8th.`,
    date: "2023-12-23",
    excerpt: `Mini Maestros second season will start January 8 th . Mini Maestros League lead coach, Isaac Valencia, is sure ready for the new season “We are excited for the second season to…`,
    body: `<p>Mini Maestros second season will start January 8<sup>th</sup>. Mini Maestros League lead coach, Isaac Valencia, is sure ready for the new season “We are excited for the second season to keep working with the players and meet new ones. It has been a great experience for all the coaches to work with these age groups. I’m supporting their enjoyment of the game and development in the foundations.” Valencia continued: “Last season’s matches were fun and competitive.  It was amazing to see the players&#8217; progression from the beginning of the season. You can see them coming out of the shell and being more confident with the ball &amp; enjoying being involved with the team.”</p>
<p>Chula Vista FC’s Academy Director, Jose Hector Diaz, is also very excited about the Mini Maestros League&#8217;s second season “I am thrilled with the &#8216;Mini Maestros&#8217; league, a name creatively coined by our former player and coach, Jaime Verdin. Our coaching staff, led by Isaac Valencia, has done an exceptional job crafting a unique experience, complete with standings. They embody the Chula Vista Way by offering this program at an incredibly affordable cost. As a club, we are proud to support this initiative and make it accessible to everyone.”</p>
<p>Mini Maestros is a 6-week session in which players born from 2014 through 2019 learn and or improve their soccer skills. Divided into 4 teams in each category (U6, U8, U10), players then play a round robin, semifinals, and a championship game.  Champions and runners-up received medals. The second season will run from January 8<sup>th</sup> through February 17<sup>th</sup>. All trainings and games are held at our Indoor Training Center.</p>

<p>U10</p>

<p>U8</p>

<p>U6</p>`,
  },
  {
    id: "chula-vista-fcs-mls-next-head-coaches-fernando-mares-and-jose-antonio-govea-obtained-their-ussf-b-license",
    slug: "chula-vista-fcs-mls-next-head-coaches-fernando-mares-and-jose-antonio-govea-obtained-their-ussf-b-license",
    title: `Chula Vista FC’s MLS Next Head Coaches, Fernando Mares and Jose Antonio Govea, obtained their USSF B License.`,
    date: "2023-12-22",
    excerpt: `Chula Vista FC’s MLS Next Head Coaches, Fernando Mares and Jose Antonio Govea, obtained their USSF B License. Motivated by the club’s goal to encourage coaches to seek higher…`,
    body: `<div>
<div dir="auto">Chula Vista FC’s MLS Next Head Coaches, Fernando Mares and Jose Antonio Govea, obtained their USSF B License. Motivated by the club’s goal to encourage coaches to seek higher coaching education and their own desire to better themselves as coaches, both Mares and Govea went ahead and successfully were able to achieve it.</div>
</div>
<div>
<div dir="auto">Mares, who already holds the Mexican Soccer Federation’s Technical Director license, described his experience: “It was a very interesting course for me because the US emphasis is different than in Mexico. Here is a more emphasized on a general structure, and in Mexico, it depends basically on each coach. Also, the facilities are better here.” Mares is willing to go forward and pursue his A license, but he will wait to see if CONCACAF follows through with the plan to create a unified license which will make his Mexican license valid throughout the entire confederation.</div>
<div dir="auto"></div>
</div>
<div>
<div dir="auto">Govea also described his experience taking the class: “I thought it was thought provoking in terms of creating specific and concise objectives during training sessions. It also challenged me to create arguments that defend my principles as a coach and help formulate my philosophy as a coach. I created new friendships with peers from around the country and learned about their playing style and methodologies. Nice to see the shared similarities and differences between one another.”</div>
<div dir="auto"></div>
</div>
<div>
<div dir="auto">Chula Vista FC’s Academy Director, Jose Hector Diaz, was delighted to see both Mares and Govea obtain the B license. Diaz said: “The type of coach we are seeking is someone who consistently strives to improve themselves and their abilities. We value action over words, and the best coaches are the ones who quietly work towards becoming the very best they can be. Both coaches are club alumni who played at the club and are now setting an example for future generations of coaches. I am excited for Jose Antonio, Fernando, and our players to benefit from it.”</div>
</div>
<div>
<div dir="auto">Chula Vista FC expects more of its coaches to follow Mares’ and Govea’s steps to better their coaching skills and experience in the near future.</div>
</div>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-mls-next-head-coaches-fernando-mares-and-jose-antonio-govea-obtained-their-ussf-b-license.jpg",
      alt: `Chula Vista FC’s MLS Next Head Coaches, Fernando Mares and Jose Antonio Govea, obtained their USSF B License.`,
    },
  },
  {
    id: "chula-vista-fcs-academy-director-jose-hector-diaz-shares-his-scotlands-experience",
    slug: "chula-vista-fcs-academy-director-jose-hector-diaz-shares-his-scotlands-experience",
    title: `Chula Vista FC’s Academy Director, Jose Hector Diaz, shares his Scotland’s experience.`,
    date: "2023-12-22",
    excerpt: `Chula Vista FC’s Academy Director, Jose Hector Diaz, went to Scotland to obtain his UEFA C license. Diaz shared his experience: “My experience in Scotland was fantastic! The…`,
    body: `<p>Chula Vista FC’s Academy Director, Jose Hector Diaz, went to Scotland to obtain his UEFA C license. Diaz shared his experience: “My experience in Scotland was fantastic! The Scottish Football Association arranged for great instructors to lead the course. The city of Edinburgh was also excellent. It’s a big town or small city, depending on how you look at it, but it’s friendly, safe, and hospitable. December was incredible because I could wander the Christmas market and taste delicious food.” Diaz also explains why he took the UEFA C class when he has already obtained the USSF A license: “There are no additional licenses that I can apply to in US Soccer. We can always strive to keep learning and advancing. The best soccer is still played in the old continent, and Scotland has produced some exceptional managers.” Diaz also would love to have more of Chula Vista FC’s coaches experience what he did in Europe: “I want to motivate coaches within our club to continue pursuing coaching education outside of the United States, and with that, seeing a new country, making new friends, and seeing soccer elsewhere will be an excellent overall experience.” Diaz plans to finish his UEFA C course by completing a few more online modules and then pursue the UEFA B course.</p>
<p>Diaz accomplishments have also benefited Chula Vista FC in many ways. The club has grown immensely in the last years and has positioned itself as a contender in leagues such as MLS Next and Elite Academy. The sky is the limit for what Diaz and Chula Vista FC will accomplish in the near future.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-academy-director-jose-hector-diaz-shares-his-scotlands-experience.jpg",
      alt: `Chula Vista FC’s Academy Director, Jose Hector Diaz, shares his Scotland’s experience.`,
    },
  },
  {
    id: "chula-vista-fcs-academy-director-is-off-to-scotland-to-obtain-his-uefa-c-license",
    slug: "chula-vista-fcs-academy-director-is-off-to-scotland-to-obtain-his-uefa-c-license",
    title: `Chula Vista FC’s Academy Director is off to Scotland to obtain his UEFA C license!`,
    date: "2023-12-02",
    excerpt: `Chula Vista FC’s Academy Director is off to Scotland to obtain his UEFA C license! Chula Vista FC’s Academy Director, Jose Hector Diaz, is on his way to Scotland to take the…`,
    body: `<h2>Chula Vista FC’s Academy Director is off to Scotland to obtain his UEFA C license!</h2>

<p>Chula Vista FC’s Academy Director, Jose Hector Diaz, is on his way to Scotland to take the UEFA’s C license course. Diaz is thrilled to take this next step in his coaching career: “I am excited to participate in Scotland’s UEFA C license course. I am eager to learn from a distinguished federation that produced one of the greatest coaches in the world, Sir Alex Ferguson. Bringing back the knowledge gained from this course will help improve our club’s growth, and my role is to serve our club as a representative for individuals’ continual growth, hoping to inspire our coaches to continue the coaching education journey.” Diaz already has obtained the United States Soccer Federation (USSF) A License which he received back in 2017. He also received the Scottish Football Association (SFA) Youth camp’s Adult Coaching Award this year. Diaz plans to come back with his Scottish FA C License, and he expects to obtain his UEFA C License around February of 2024.</p>

<p>Diaz was invited to join Chula Vista FC back in 2011 with U17 team, in which he was the head coach, by former club President, Hugo Molina. After Molina retired and handed the reins of the club to Oscar Zamora in 2012, Diaz was appointed as the club’s Director of Coaching. Zamora quickly recognized Diaz’ potential to guide the club in a more professional direction. Zamora said: “When Molina asked me to take over the club, I told him that the only way I can do that was to appoint Diaz as our Director of Coaching. He had fresh ideas that uncovered an uncharted path for the club. It was the perfect opportunity to turn around the club and make a big impact for our Chula Vista community. We had other clubs come to our territory and take away our talent. By transforming our club into a more competitive one, playing in more challenging levels, etc., as the so called ‘big clubs’, this would translate into being able to offer our Chula Vista and South Bay area players a chance to play at those levels for a lesser cost without having to travel far to train with those clubs.” Zamora’s decision proved to be the right one as the club is now very well recognized as a very competitive club, not only regionally but even nationally. The club can competitively participate in prominent leagues such as MLS Next and Elite Academy and was able to grab national attention as the Cinderella story of the tournament back in 2015 when they advanced to the Lamar Hunt’s Open Cup. Zamora, who is still part of the club as VP of Admin and Registrar, concluded: “We made the right choice, and we are proud of his and our club’s accomplishments. Chula Vista FC for life!”</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-academy-director-is-off-to-scotland-to-obtain-his-uefa-c-license.png",
      alt: `Chula Vista FC’s Academy Director is off to Scotland to obtain his UEFA C license!`,
    },
  },
  {
    id: "chula-vista-fcs-teams-are-getting-ready-for-next-weeks-mls-next-fest",
    slug: "chula-vista-fcs-teams-are-getting-ready-for-next-weeks-mls-next-fest",
    title: `Chula Vista FC’s teams are getting ready for next week’s MLS Next Fest!`,
    date: "2023-11-30",
    excerpt: `Chula Vista FC’s teams are getting ready for next week’s MLS Next Fest! Chula Vista FC’s B2005, B2007, B2008 and B2009 teams are getting ready to participate in the annual MLS…`,
    body: `<h2>Chula Vista FC’s teams are getting ready for next week’s MLS Next Fest!</h2>

<p>Chula Vista FC’s B2005, B2007, B2008 and B2009 teams are getting ready to participate in the annual MLS Next Fest tournament to be held from December 5<sup>th</sup> through December 10<sup>th</sup> in Phoenix Arizona.</p>

<p>B2008s Head Coach and former Chula Vista FC player, Jose Antonio Govea, explains how his team matches up for this tournament and how he sees the opportunity to play MLS academies such as Inter Miami in this event: “We are always striving to improve. We’ve established a growth mindset with the group and I’m very pleased to see what we have accomplished in the short time together. We aim to be the best in everything that we do, match results, mentality, attitude, competitiveness. What better way to entertain these core beliefs than with a matchup with Inter Miami. It’s always a privilege to be able to compete against an MLS Academy. It provides a great opportunity for our players to see how they rank against players who are currently at that level. We faced both of our MLS neighbors, LAFC and LA Galaxy, earlier this year and we competed exceptionally against the two. We were able to overcome LAFC U16’s 2-1 and we just fell just short against LA Galaxy’s U17. We currently sit at 12-6-1 in both LEAGUE AND FLEX combined. “ The team’s performance has caught the eye of MLS academies, and currently, two of their players, Pablo Enriquez and Elvis Villalva were invited to try out for LA Galaxy, with Elvis also representing Chula Vista FC in the BEST OF BEST match at the FEST.</p>
<p>Govea’s explains that a great part of his success as a coach comes from what his father, Jose Govea Sr, taught him: “I started coaching as an assistant on my father’s team. I learned a lot from him.  He always told me that you had to finish what you start and that the word ‘Can’t’ was not in his dictionary.  He is a great man. He does things for people without asking for anything in return.” Govea Sr. coached for Chula Vista FC for over 10 years. Govea Jr has been coaching on his own as Head Coach for the past 4 years with Chula Vista FC’s MLS Next teams.</p>

<p>Another Chula Vista FC’s former player, Fernando Mares, coaches the B2007 MLS Next team.  Mares was Govea’s teammate in the same Chula Vista FC’s U18 team. He is also getting his team ready for the tournament. Mares said: “We have been analyzing our previous games. Our priority will be to correct our errors and look to implement our style of play. We are currently in third place in our conference. We have been improving during the past weeks and I am confident that we will do good in this tournament.” Mares added:  “These types of tournaments are very important for our players’ development. It also gives them a chance to get noticed by very important scouts. We hope they show their full potential for them”. Mares also played for Chula Vista FC for 10 years and has been coaching for the club for the last 4 years at the MLS Next level.</p>

<p>Chula Vista FC’s Technical Director, Eden Esquerre, coaches the other two squads (B2005 and B2009) that will also represent the club at the MLS Next Fest. Esquerre said: “This tournament is very important for us as a club. It is an opportunity to showcase our playing style and structure. It is also very beneficial for our players so they can be noticed by the many scouts that will be watching our games.”</p>

<p>Chula Vista FC’s Academy Director, Jose Hector Diaz, had this to say about the event: Diaz said: “The MLS Next Fest event is a unique and fantastic showcase unlike any other from other leagues. Only four clubs represent San Diego, and we are proud to be one of them, especially as the sole representative from the South Bay area. Our participation in such an important event is a testament to the hard work put in by everyone in our club to consistently develop top players in the area. And it will all be capped off at the end, with our U16 playing Inter Miami on the last day of the tournament.&#8221;</p>

<p>MLS Next Fest is the largest event in the 2023-24 season, as over 300 teams from the United States and Canada will compete in the Showcase across four different age groups. The six-day event is one of the most attended by college, national team, and professional scouts/coaches during the entire MLS NEXT season as more than 800 matches will be played in a single location.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-teams-are-getting-ready-for-next-weeks-mls-next-fest.png",
      alt: `Chula Vista FC’s teams are getting ready for next week’s MLS Next Fest!`,
    },
  },
  {
    id: "the-mini-maestros-program-is-a-total-success",
    slug: "the-mini-maestros-program-is-a-total-success",
    title: `The Mini Maestros Program is a total success!!`,
    date: "2023-11-28",
    excerpt: `The Mini Maestros Program is a total success!! With the MLS Next and Elite Academy programs successfully covering the U11s through U19s age categories, Chula Vista FC decided that…`,
    body: `<h2>The Mini Maestros Program is a total success!!</h2>

<p>With the MLS Next and Elite Academy programs successfully covering the U11s through U19s age categories, Chula Vista FC decided that it was time to launch a program for the younger ages, U05s through U10s. And this is how the Mini Maestros program was born.</p>
<p>To make sure the project was going to work, Academy Director, Jose Hector Diaz, appointed B2010 MLS Next coach, Isaac Valencia, to run it. Coach Valencia said: “The club &amp; I share similar visions for working with the younger age groups to eventually form an academy that can provide an environment where the players are developing the foundations of soccer in a fun and competitive way. By kicking off the mini-maestro league, we can start to form weekly training sessions and matches for the players. We had the facility (Indoor Training Center) and resources to put this together. But just needed someone to get it started and manage it. Coach Valencia added: “So far, the program is going very well. Since more players than we anticipated registered, we had to create extra group trainings for the players that registered after the league had filled up. There is a good mix of players between those who are new, transitioning from recreational programs, and players who are already in club soccer.”</p>
<p>Helping Valencia are coaches Isaq Moalim (B2015 and B2014), Matias Medel (B2012 EA Assistant Coach) and Jose Antionio Lizaola (G2013 Head Coach). Coach Lizaola said: “I am very thankful to have the opportunity to help Coach Isaac and our other Chula Vista FC coaches with the Mini Maestro Program.“ Lizaola continued: “These boys and girls are not only talented soccer players, but they are also committed to improving their game and technical skills by working very hard. This helps them build up their confidence so they can also become strong-minded players.</p>
<p>The current Mini Maestros season runs through December 16<sup>th</sup>. But Chula Vista FC is already planning to do another season starting in January 2024. The club is also looking to expand the program to the West side of Chula Vista where they can offer something similar for the families located in that area. Keep an eye in our social media for next season’s signups!!</p>`,
    image: {
      src: "/media/image/news/the-mini-maestros-program-is-a-total-success.jpg",
      alt: `The Mini Maestros Program is a total success!!`,
    },
  },
  {
    id: "chula-vista-fcs-b2011-mls-next-team-is-off-to-an-amazing-16-0-start",
    slug: "chula-vista-fcs-b2011-mls-next-team-is-off-to-an-amazing-16-0-start",
    title: `Chula Vista FC’s B2011 MLS Next team is off to an amazing 16-0 start!!`,
    date: "2023-11-23",
    excerpt: `Chula Vista FC’s B2011 MLS Next team is off to an amazing 16-0 start!! Chula Vista FC’s B2011 MLS Next team is off to an amazing 16-0 start. The boys have risen to the occasion…`,
    body: `<h2>Chula Vista FC’s B2011 MLS Next team is off to an amazing 16-0 start!!</h2>

<p><a href="https://chulavistafc.com/news/chula-vista-fcs-b2011-mls-next-team-is-off-to-an-amazing-16-0-start/"></a></p>

<p>Chula Vista FC’s B2011 MLS Next team is off to an amazing 16-0 start. The boys have risen to the occasion and dealt both LA Galaxy and LA FC their only losses of the season. Additionally, among their 16 victories are wins against both Real Salt Lake (Mesa and Arizona) teams.</p>
<p>The boys are led by former Chula Vista FC player standout and former member of the US Youth National Team, Alberto ‘Beto’ Diaz. Beto was also named Open Cup Player of the Tournament for week two of the memorable 2015 Chula Vista FC team that advanced to Lamar Hunt’s US Open Cup, drawing national attention and being labeled the Cinderella story of the tournament. “The team has come a long way. We have improved and keep getting better. I’m very proud of the boys, but we know we have a lot of room for improvement and can’t settle,” Beto said. Beto added, “We ALWAYS must want to get better. We’ve had some good games and some bad games, but we’ve found ways to win games, and that shows we’re becoming a great team. We’ve got a long way to go. But I can proudly say we have a great team and a great group of parents that are committed to the cause.”</p>
<p>Chula Vista FC’s Academy Director and proud brother of Alberto, Jose Hector Diaz, pointed out: “I&#8217;m grateful to the families who remained patient and kept faith in our club, enduring many losses until we reached this milestone. I&#8217;ve always believed that if we develop correctly, victories will follow, and now they&#8217;re here. I recognize room for improvement, and we&#8217;re committed to improving our team.”</p>
<p>Chula Vista FC’s Technical Director, Eden Esquerre, said, “Our B2011 team wins no matter if they play a good game or not. They have a lot of players who individually carry the team. They are having a great season.” Esquerre added, “All of our MLS teams have the same identity and structure. Our style of play is to have ball possession and play offensively.”</p>
<p>In addition to the B2011 squad, Chula Vista FC’s MLS Next other teams have also been competitive all season long, especially the B2008 team, who are 10-7-1. This team will participate in the MLS Next Fest tournament, where they will face Inter Miami. Other teams participating in MLS Next Fest are the B2007s, B2009s, and B2005s.</p>
<p>The B2011s now enter the Winter break and will be recharging their energies to close out the second half of the season, which will include a showdown against TFA, who are right behind them with a 13-0-1 record. We will keep you posted on further developments.</p>`,
    image: {
      src: "/media/image/news/chula-vista-fcs-b2011-mls-next-team-is-off-to-an-amazing-16-0-start.jpg",
      alt: `Chula Vista FC’s B2011 MLS Next team is off to an amazing 16-0 start!!`,
    },
  },
  {
    id: "congratulations-to-our-five-players-who-attended-us-soccers-id-center-on-tuesday-november-14",
    slug: "congratulations-to-our-five-players-who-attended-us-soccers-id-center-on-tuesday-november-14",
    title: `Congratulations to our five players who attended US Soccer’s ID Center on Tuesday, November 14.`,
    date: "2023-11-21",
    excerpt: `Congratulations to our five players who attended US Soccer’s ID Center on Tuesday, November 14. Santi F. showcased his skills at the 2010 ID Training. While Jona, Joaquin, Santi…`,
    body: `<div dir="auto">Congratulations to our five players who attended US Soccer&#8217;s ID Center on Tuesday, November 14.</div>
<div dir="auto">
<div>
<div dir="auto">Santi F. showcased his skills at the 2010 ID Training.</div>
<div dir="auto">While Jona, Joaquin, Santi S., and Max demonstrated their talents at the 2009 ID Center camp.</div>
</div>
<div>
<div dir="auto">We are thrilled to see our players being consistently invited to the US Soccer&#8217;s ID Center in the region, and we are happy to have played a role in creating these opportunities for them. I had the pleasure of visiting the center and was delighted to see that all of our players excelled among the top players in Southern California, which made me even more satisfied. &#8211; J. Hector Diaz / Academy Director.</div>
</div>
</div>`,
  },
  {
    id: "david-villa-visited-chula-vista-fc",
    slug: "david-villa-visited-chula-vista-fc",
    title: `David Villa visited Chula Vista FC!!`,
    date: "2023-11-18",
    excerpt: `David Villa’s visit was a significant boost for our academy. His support and wisdom go beyond just the field. We’re excited to see and share the area with him, and we look forward…`,
    body: `<p><strong>David Villa&#8217;s visit was a significant boost for our academy. His support and wisdom go beyond just the field.</strong><br />
<strong>We&#8217;re excited to see and share the area with him, and we look forward to his return</strong></p>`,
    image: {
      src: "/media/image/news/david-villa-visited-chula-vista-fc.jpg",
      alt: `David Villa visited Chula Vista FC!!`,
    },
  },
];

export function getActiveNews(posts: NewsPost[]): NewsPost[] {
  return posts.filter((p) => p.status !== "archived");
}

export function getPostBySlug(
  posts: NewsPost[],
  slug: string,
): NewsPost | undefined {
  return getActiveNews(posts).find((p) => p.slug === slug);
}

export function getRecentNews(posts: NewsPost[], limit = 6): NewsPost[] {
  return getActiveNews(posts).slice(0, limit);
}
