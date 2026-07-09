import { Contact } from "@/components/feature/contact";
import { Faq } from "@/components/feature/faq";
import { Hero } from "@/components/feature/hero";
import { ImageText } from "@/components/feature/image-text";
import { Intro } from "@/components/feature/intro";
import { LogoCarousel } from "@/components/feature/logo-carousel";
import { Separator } from "@/components/feature/separator";
import { Services } from "@/components/feature/services";
import { StatsImage } from "@/components/feature/stats-image";
import { Testimonials } from "@/components/feature/testimonials";
import { Title } from "@/components/feature/title";
import { cn } from "@/lib/utils";

import "./landing-screen.css";

/** Landing screen — composes the page's blocks in order. */
export function LandingScreen({ className }: { className?: string }) {
  return (
    <main className={cn("landing-screen", className)}>
      <Hero />
      <LogoCarousel />
      <Intro />
      <ImageText />
      <Testimonials />
      <Title />
      <Separator />
      <StatsImage />
      <Services />
      <Faq />
      <Contact />
    </main>
  );
}
