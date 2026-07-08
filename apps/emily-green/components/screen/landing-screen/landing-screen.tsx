import { Button, Eyebrow, Heading, Text } from "@/components/ui";
import { getTenant } from "@/lib/cms";
import { site } from "@/site.config";
import { cn } from "@/lib/utils";

import "./landing-screen.css";

export async function LandingScreen({ className }: { className?: string }) {
  const tenant = await getTenant();

  return (
    <main className={cn("landing-screen", className)}>
      <section className="landing-screen-hero contain">
        <Eyebrow>
          {tenant
            ? `Connected to CMS · ${tenant.name}`
            : "CMS offline — start apps/cms"}
        </Eyebrow>
        <Heading as="h1" size="xl">
          {site.name}
        </Heading>
        <Text size="lg" tone="muted" className="landing-screen-sub">
          Scaffolded with the new-site process and wired to the central CMS.
          Build this site&rsquo;s screens here.
        </Text>
        <div className="landing-screen-actions">
          <Button>Get started</Button>
          <Button variant="outline">Learn more</Button>
        </div>
      </section>
    </main>
  );
}
