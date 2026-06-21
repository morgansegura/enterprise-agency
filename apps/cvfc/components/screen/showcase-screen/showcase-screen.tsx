import { HeroCarousel } from "@/components/feature/hero-carousel";
import { PageHero } from "@/components/feature/page-hero";
import { WelcomeBanner } from "@/components/feature/welcome-banner";
import { IconCards } from "@/components/feature/icon-cards";
import { Callout } from "@/components/feature/callout";
import { MediaSplit } from "@/components/feature/media-split";
import { StatBand } from "@/components/feature/stat-band";
import { PortraitGrid } from "@/components/feature/portrait-grid";
import { Testimonials } from "@/components/feature/testimonials";
import { FaqSection } from "@/components/feature/faq-section";
import {
  Button,
  Input,
  Textarea,
  Label,
  Checkbox,
  Switch,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";

import "./showcase-screen.css";

const PHOTO = "https://chulavistafc.com/wp-content/uploads";

/** A single labeled entry in the gallery. */
function Block({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <section className="showcase-block">
      <p className="showcase-block-label">{name}</p>
      {children}
    </section>
  );
}

/**
 * Block gallery — a single-page visual index of the component/block library for
 * client demos. Each section is rendered with representative content. noindexed.
 */
export function ShowcaseScreen() {
  return (
    <main className="showcase-screen">
      <header className="showcase-header contain">
        <p className="eyebrow-full">
          <span>Component Library</span>
        </p>
        <h1 className="showcase-title">The CVFC block library</h1>
        <p className="showcase-intro">
          Every section below is a reusable, CMS-editable block. Mix, reorder,
          and theme them to compose any page.
        </p>
      </header>

      <Block name="UI Primitives">
        <div className="contain showcase-primitives">
          <div className="showcase-primitives-row">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <div className="showcase-primitives-row">
            <span>
              <Switch defaultChecked aria-label="Sample switch" />
            </span>
            <Label>
              <Checkbox defaultChecked aria-label="Sample checkbox" /> Checkbox
            </Label>
          </div>
          <div className="showcase-primitives-field">
            <Label htmlFor="sc-input">Input</Label>
            <Input id="sc-input" placeholder="Type something…" />
          </div>
          <div className="showcase-primitives-field">
            <Label htmlFor="sc-textarea">Textarea</Label>
            <Textarea id="sc-textarea" placeholder="A few words…" />
          </div>
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Card</CardTitle>
              <CardDescription>
                A surface for grouped content — header, body, footer.
              </CardDescription>
            </CardHeader>
            <CardContent>Drop anything inside.</CardContent>
          </Card>
        </div>
      </Block>

      <Block name="Page Hero">
        <PageHero
          eyebrow="Page Hero"
          heading="A focused header for any inner page."
          description="Eyebrow, heading, description, and optional action buttons."
        />
      </Block>

      <Block name="Hero Carousel">
        <HeroCarousel />
      </Block>

      <Block name="Welcome Banner">
        <WelcomeBanner />
      </Block>

      <Block name="Icon Cards">
        <IconCards />
      </Block>

      <Block name="Media Split">
        <MediaSplit
          eyebrow="Media Split"
          heading="Image and copy, side by side."
          body="Supports tags, buttons, reversed layout, and a white or bone background."
          image={{
            src: `${PHOTO}/2024/02/TurnerMedia-5199-scaled-e1707609763493.jpg`,
            alt: "Sample",
          }}
          tags={["Tag One", "Tag Two"]}
        />
      </Block>

      <Block name="Stat Band">
        <StatBand
          eyebrow="By the Numbers"
          heading="Stats with highlight cards."
          stats={[
            { id: "a", value: "40+", label: "Years" },
            { id: "b", value: "7+", label: "Pro Signings" },
            { id: "c", value: "5+", label: "Championships" },
          ]}
        />
      </Block>

      <Block name="Portrait Grid">
        <PortraitGrid
          eyebrow="People"
          heading="A grid of people."
          people={[
            {
              id: "1",
              name: "Sample Coach",
              role: "Head Coach",
              image: {
                src: `${PHOTO}/2023/12/JHD_Headshot.png`,
                alt: "Sample",
              },
            },
          ]}
        />
      </Block>

      <Block name="Testimonials">
        <Testimonials />
      </Block>

      <Block name="FAQ Section">
        <FaqSection />
      </Block>

      <Block name="Callout">
        <Callout />
      </Block>
    </main>
  );
}
