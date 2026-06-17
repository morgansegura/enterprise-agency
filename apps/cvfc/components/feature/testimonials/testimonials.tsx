"use client";

import * as React from "react";

import { LogoIcon } from "@/components/layout";
import { cn } from "@/lib/utils";

import "./testimonials.css";

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  image?: { src: string; alt: string };
};

type TestimonialsProps = {
  className?: string;
  heading?: string;
  description?: string;
  testimonials?: Testimonial[];
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "0",
    quote:
      "The coaching staff at Chula Vista FC truly cares about each player's growth, both on and off the field. My son's confidence has soared since joining.",
    author: "Morgan Segura",
    role: "Parent",
  },
  {
    id: "1",
    quote:
      "At Chula Vista FC, we focus on developing well-rounded athletes. It’s rewarding to see players improve technically, tactically, and mentally. Attitude, Respect, Unity, Passion!",
    author: "J. Hector Diaz",
    role: "Club Director",
    image: {
      src: "https://chulavistafc.com/wp-content/uploads/2023/12/JHD_Headshot21.png",
      alt: "J. Hector Diaz headshot",
    },
  },
  {
    id: "2",
    quote:
      "Our goalkeeper program is built to push players beyond their comfort zone. I’ve seen keepers improve their skills and reaction times more than they thought possible.",
    author: "Goalkeeper Coach",
  },
  {
    id: "3",
    quote:
      "We emphasize quality over quantity — every drill has a purpose, and every player leaves training better than they came.",
    author: "Luis Guzman",
    role: "Coach",
    image: {
      src: "https://chulavistafc.com/wp-content/uploads/2025/07/53517d04ec70095bbacb153e985a82ce.avif",
      alt: "Luis Guzman",
    },
  },
  {
    id: "4",
    quote:
      "The goalkeeper program is top-notch — my daughter’s skills and reaction time have improved more in one season here than in years elsewhere.",
    author: "Anonymous",
    role: "Parent",
  },
  {
    id: "5",
    quote:
      "The shooting clinics have made a huge difference. My son is scoring more and playing with real confidence in front of the net.",
    author: "Rebecca Muñoz",
    role: "Parent",
  },
  {
    id: "6",
    quote:
      "The speed and agility training is amazing. My daughter is faster, more balanced, and sharper in every game.",
    author: "Jason Wright",
    role: "Parent",
    image: {
      src: "https://chulavistafc.com/wp-content/uploads/2023/12/JHD_Headshot21.png",
      alt: "Jason Wright",
    },
  },
  {
    id: "7",
    quote:
      "I appreciate how organized and intense the practices are. My kid comes home tired but proud of the hard work they put in.",
    author: "J. Carlos Gonzalez",
    role: "Parent",
  },
  {
    id: "8",
    quote:
      "The strength training has helped my son stay injury-free and compete against older, stronger players without hesitation.",
    author: "Xavier Ruiz",
    role: "Parent",
  },
  {
    id: "9",
    quote:
      "We love that extra training is always available. The optional sessions have really accelerated my daughter’s development.",
    author: "Annonymous",
    role: "Parent",
  },
];

export function Testimonials({
  className,
  heading = "Shaping Players. Inspiring Futures.",
  description = "From skill development to team culture, hear first-hand from parents and coaches about the impact Chula Vista FC has had on our players, both on and off the field.",
  testimonials = DEFAULT_TESTIMONIALS,
}: TestimonialsProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max <= 0 ? 1 : el.scrollLeft / max);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [testimonials.length]);

  return (
    <section className={cn("testimonials", className)}>
      <div className="testimonials-inner contain">
        <header className="testimonials-heading-block">
          <h2 className="testimonials-heading">
            <span>{heading}</span>
          </h2>
          {description ? (
            <p className="testimonials-description">{description}</p>
          ) : null}
        </header>

        <div ref={trackRef} className="testimonials-track">
          <div className="testimonials-slider">
            {testimonials.map((t) => (
              <article key={t.id} className="testimonials-card">
                <div className="testimonials-avatar">
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.image.src}
                      alt={t.image.alt}
                      loading="lazy"
                      className="testimonials-avatar-image"
                    />
                  ) : (
                    <LogoIcon className="testimonials-avatar-fallback" />
                  )}
                </div>
                <div className="testimonials-content">
                  <p className="testimonials-quote">{t.quote}</p>
                  <p className="testimonials-author">
                    <small>{t.author}</small>
                    {t.role ? <small>{t.role}</small> : null}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="testimonials-progress" aria-hidden="true">
          <div
            className="testimonials-progress-fill"
            style={{ transform: `scaleX(${Math.max(0.05, progress)})` }}
          />
        </div>
      </div>
    </section>
  );
}
