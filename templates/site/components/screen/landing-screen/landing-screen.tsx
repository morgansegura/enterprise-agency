import { getTenant } from "@/lib/cms";
import { site } from "@/site.config";
import { cn } from "@/lib/utils";

import "./landing-screen.css";

export async function LandingScreen({ className }: { className?: string }) {
  const tenant = await getTenant();

  return (
    <main className={cn("landing-screen", className)}>
      <section className="landing-screen-hero contain">
        <p
          className="landing-screen-eyebrow"
          data-online={tenant ? "true" : "false"}
        >
          {tenant
            ? `Connected to CMS · ${tenant.name}`
            : "CMS offline — start apps/cms"}
        </p>
        <h1 className="landing-screen-title">{site.name}</h1>
        <p className="landing-screen-sub">
          Scaffolded with the new-site process and wired to the central CMS.
          Build this site&rsquo;s screens here.
        </p>
      </section>
    </main>
  );
}
