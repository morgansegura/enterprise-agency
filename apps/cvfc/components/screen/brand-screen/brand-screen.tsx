import Image from "next/image";
import Link from "next/link";

import { ContactButton } from "@/components/analytics";
import { BrandAssetGrid } from "@/components/feature/brand-asset-grid";
import { BrandMisuseGrid } from "@/components/feature/brand-misuse-grid";
import { BrandRules } from "@/components/feature/brand-rules";
import { BrandSpecList } from "@/components/feature/brand-spec-list";
import { BrandSwatches } from "@/components/feature/brand-swatches";
import { BrandTypeSpecimen } from "@/components/feature/brand-type-specimen";
import { Callout } from "@/components/feature/callout";
import { Heading } from "@/components/feature/heading";
import { PageHero } from "@/components/feature/page-hero";
import { Icon } from "@/components/icon";
import { Section } from "@/components/layout";
import { JsonLd } from "@/components/seo";
import { Button } from "@/components/ui";
import {
  BRAND_ASSETS,
  BRAND_COLORS,
  BRAND_FONTS,
  BRAND_KIT_HREF,
  CREST_ALSO,
  CREST_MISUSE,
  CREST_SPECS,
  IDENTITY_SPECS,
  IMAGERY_DO,
  IMAGERY_DONT,
  NAMING_SPECS,
  PARTNER_DO,
  PARTNER_DONT,
  TYPE_SPECS,
  VOICE_DO,
  VOICE_DONT,
} from "@/data/brand";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { breadcrumbSchema } from "@/lib/schema";

import "./brand-screen.css";

export async function BrandScreen() {
  const page = await getPage("brand");
  const hero = pageHeroFromPage(page);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Brand", path: "/brand" },
          ]),
        ]}
      />

      <main>
        <PageHero
          heading={hero?.heading || "Chula Vista FC brand guidelines"}
          description={
            hero?.description ||
            "Download the crest and learn how to use it — along with our colors, type, name, and the rules that protect our players. Written for partners, sponsors, media, and club staff."
          }
          actions={
            <Button
              variant="default"
              render={<a href={BRAND_KIT_HREF} download />}
            >
              <Icon token="ri:download" aria-hidden="true" />
              <span>Download the brand kit</span>
            </Button>
          }
        />

        <Section id="logo" bg="white" ariaLabel="Logo">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Logo"
            description="Three files, one mark. Pick the version that fits the background — vector wherever your tool accepts it, PNG when it doesn't."
          />
          <BrandAssetGrid
            className="brand-screen-block"
            assets={BRAND_ASSETS}
          />
          <p className="brand-screen-aside">
            <a className="brand-screen-link" href={BRAND_KIT_HREF} download>
              Download every file as a zip
            </a>
          </p>
        </Section>

        <Section id="clear-space" bg="bone" ariaLabel="Clear space">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Clear space"
            description="The crest needs room to read. Keep a quarter of its width free on every side — and give it more where the layout allows."
          />

          <div className="brand-screen-split">
            <figure className="brand-screen-diagram">
              <div className="brand-screen-diagram-frame">
                <Image
                  src="/brand/cvfc-crest.svg"
                  alt="The crest inside its minimum clear space"
                  width={260}
                  height={260}
                  unoptimized
                  className="brand-screen-diagram-crest"
                />
              </div>
              <figcaption className="brand-screen-caption">
                The dashed line is the minimum safe distance — 25% of the
                crest&rsquo;s width. Nothing crosses it.
              </figcaption>
            </figure>

            <BrandSpecList specs={CREST_SPECS} />
          </div>
        </Section>

        <Section id="donts" bg="white" ariaLabel="Logo don'ts">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Logo don'ts"
            description="The crest works because every element stays where it is. These are the changes we see most often — none of them are ours."
          />
          <BrandMisuseGrid
            className="brand-screen-block"
            items={CREST_MISUSE}
          />
          <p className="brand-screen-aside">{CREST_ALSO}</p>
        </Section>

        <Section id="name" bg="bone" ariaLabel="Our name">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Our name"
            description="The club has a public name, a full name, and a registered name for paperwork. Each one has its place."
          />
          <BrandSpecList className="brand-screen-block" specs={NAMING_SPECS} />
        </Section>

        <Section id="color" bg="white" ariaLabel="Color">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Color"
            description="Navy carries the brand and gold accents it. Gold is never the color of a paragraph — at small sizes on white it falls below the contrast a reader needs."
          />
          <BrandSwatches className="brand-screen-block" colors={BRAND_COLORS} />
        </Section>

        <Section id="type" bg="bone" ariaLabel="Typography">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Typography"
            description="Google Sans Flex sets the headlines; Geist does everything else. Both are open source, so partners and printers can install them at no cost."
          />
          <BrandTypeSpecimen
            className="brand-screen-block"
            fonts={BRAND_FONTS}
          />
          <BrandSpecList className="brand-screen-block" specs={TYPE_SPECS} />
        </Section>

        <Section id="voice" bg="white" ariaLabel="Voice">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Voice"
            description="We describe what the club does and what our players achieve. We never build ourselves up by naming another club."
          />
          <BrandRules
            className="brand-screen-block"
            doTitle="How we write"
            dontTitle="What we never write"
            allowed={VOICE_DO}
            forbidden={VOICE_DONT}
          />
        </Section>

        <Section id="photography" bg="bone" ariaLabel="Photography">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Photography"
            description="These are children. Families control how their child appears and can withdraw that permission at any time — anyone publishing club photography holds to the same standard the club does."
          />
          <BrandRules
            className="brand-screen-block"
            allowed={IMAGERY_DO}
            forbidden={IMAGERY_DONT}
          />
          <p className="brand-screen-aside">
            These rules summarize our{" "}
            <Link href="/safeguarding">Youth Safeguarding policy</Link>, which
            is the authority if the two ever differ.
          </p>
        </Section>

        <Section id="partners" bg="white" ariaLabel="Partners and sponsors">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Partners and sponsors"
            description="Co-branding works when both marks keep their own space. The crest is never absorbed into another logo, and the club's name never implies an endorsement it hasn't given."
          />
          <BrandRules
            className="brand-screen-block"
            allowed={PARTNER_DO}
            forbidden={PARTNER_DONT}
          />
          <p className="brand-screen-aside">
            Use of the club&rsquo;s name and marks requires written consent —
            see our <Link href="/link-policy">Link Policy</Link>.
          </p>
        </Section>

        <Section id="nonprofit" bg="bone" ariaLabel="Nonprofit identity">
          <Heading
            eyebrowStyle="none"
            align="left"
            headingSize="display"
            heading="Nonprofit identity"
            description="Chula Vista FC is a 501(c)(3) nonprofit. Grants, receipts, and directory listings need the registered name and EIN — not the public one."
          />
          <BrandSpecList
            className="brand-screen-block"
            specs={IDENTITY_SPECS}
          />
          <p className="brand-screen-aside">
            Where the money goes is published on our{" "}
            <Link href="/transparency">Financial Transparency</Link> page.
          </p>
        </Section>

        <Callout
          heading="Send it to us before it ships."
          body={
            <>
              Building a banner, a program, a jersey, a landing page, or a press
              release? Send the layout and we&rsquo;ll confirm it&rsquo;s right
              — far cheaper than reprinting it. Tell us what you&rsquo;re
              making, where it will appear, and when you need an answer.
            </>
          }
          ctaSlot={
            <ContactButton
              variant="default"
              topic="brand"
              subject="CVFC Brand Approval Request"
            >
              <Icon token="ri:badge" aria-hidden="true" />
              <span>Send it for approval</span>
            </ContactButton>
          }
          variant="bone"
        />
      </main>
    </>
  );
}
