"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

import "./hero-carousel.css";

export type HeroSlideCta =
  | { kind: "link"; label: string; href: string }
  | { kind: "evaluation"; label: string };

export type HeroSlide = {
  id: string;
  image: { src: string; alt: string };
  eyebrow?: string;
  heading: string;
  tagline?: string;
  cta?: HeroSlideCta;
};

type HeroCarouselProps = {
  className?: string;
  slides?: HeroSlide[];
  autoPlayDelay?: number;
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "shaping-players",
    image: {
      src: "https://chulavistafc.com/wp-content/uploads/2025/05/image6.jpeg",
      alt: "Chula Vista FC players in training",
    },
    eyebrow: "Chula Vista Fútbol Club · Since 1982",
    heading: "Shaping Players.\nInspiring Futures.",
    tagline:
      "A program for the player and the person — built on attitude, respect, unity, and passion since 1982.",
    cta: { kind: "evaluation", label: "Request an Evaluation" },
  },
  {
    id: "state-cup",
    image: {
      src: "https://chulavistafc.com/wp-content/uploads/2023/02/SEB01049-scaled.jpg",
      alt: "Chula Vista FC players celebrating a State Cup win",
    },
    eyebrow: "State Cup Champions",
    heading: "Built to Compete.\nTrained to Win.",
    tagline:
      "A real curriculum and a real pathway delivering real results — season after season, year after year.",
    cta: { kind: "link", label: "See the Pathway", href: "#pathway" },
  },
  {
    id: "pathway",
    image: {
      src: "https://chulavistafc.com/wp-content/uploads/2023/11/Goalkeepers-pic.jpg",
      alt: "CVFC goalkeepers training",
    },
    eyebrow: "MLS NEXT · DPL · NPL · College Pathway",
    heading: "A Real Pathway.\nFrom Day One.",
    tagline:
      "Boys, girls, and goalkeepers — guided from Mini Maestros all the way to MLS NEXT, EA, NPL, DPL, and college recruiting.",
    cta: { kind: "link", label: "Explore Programs", href: "/programs" },
  },
];

/** Min horizontal travel (px) before a pointer drag counts as a swipe. */
const SWIPE_THRESHOLD = 50;

export function HeroCarousel({
  className,
  slides = DEFAULT_SLIDES,
  autoPlayDelay = 6500,
}: HeroCarouselProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const goTo = React.useCallback(
    (index: number) =>
      setSelectedIndex(
        ((index % slides.length) + slides.length) % slides.length,
      ),
    [slides.length],
  );

  // Auto-advance (paused on hover / during a drag).
  React.useEffect(() => {
    if (!autoPlayDelay || slides.length < 2) return;
    const interval = setInterval(() => {
      if (!isPaused) setSelectedIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayDelay);
    return () => clearInterval(interval);
  }, [autoPlayDelay, isPaused, slides.length]);

  // Pointer/touch swipe — one handler covers mouse drag and touch.
  const dragStartX = React.useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    setIsPaused(true);
  };
  const endDrag = (e: React.PointerEvent) => {
    const start = dragStartX.current;
    dragStartX.current = null;
    setIsPaused(false);
    if (start === null) return;
    const dx = e.clientX - start;
    if (Math.abs(dx) > SWIPE_THRESHOLD) goTo(selectedIndex + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      className={cn("hero-carousel", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ touchAction: "pan-y" }}
      aria-roledescription="carousel"
    >
      <div className="hero-carousel-viewport">
        <div className="hero-carousel-track">
          {slides.map((slide, index) => (
            <Slide
              key={slide.id}
              slide={slide}
              index={index}
              selectedIndex={selectedIndex}
            />
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div
          className="hero-carousel-indicator"
          role="tablist"
          aria-label="Slide navigation"
        >
          <Icon
            token="custom:soccer-ball"
            className="hero-carousel-indicator-mark"
          />
          <div className="hero-carousel-indicator-track">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Go to slide ${index + 1} — ${slide.eyebrow ?? slide.heading}`}
                onClick={() => goTo(index)}
                data-active={index === selectedIndex}
                className="hero-carousel-indicator-dot"
              >
                <span className="hero-carousel-indicator-fill" />
              </button>
            ))}
          </div>
          <span className="hero-carousel-indicator-count">
            {String(selectedIndex + 1).padStart(2, "0")}
            <span className="hero-carousel-indicator-slash">/</span>
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      ) : null}
    </section>
  );
}

type SlideProps = {
  slide: HeroSlide;
  index: number;
  selectedIndex: number;
};

function Slide({ slide, index, selectedIndex }: SlideProps) {
  const isActive = index === selectedIndex;
  const lines = slide.heading.split("\n");

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of slides`}
      aria-hidden={!isActive}
      data-active={isActive}
      className={cn(
        "hero-carousel-slide",
        isActive
          ? "hero-carousel-slide-active"
          : "hero-carousel-slide-inactive",
      )}
    >
      <Image
        src={slide.image.src}
        alt={slide.image.alt}
        fill
        priority={index === 0}
        sizes="100vw"
        className="hero-carousel-slide-image"
      />
      <div className="hero-carousel-slide-overlay" aria-hidden="true" />
      <div className="hero-carousel-slide-content contain">
        {slide.eyebrow ? (
          <p className="hero-carousel-slide-eyebrow">
            <span
              className="hero-carousel-slide-eyebrow-rule"
              aria-hidden="true"
            />
            <span className="hero-carousel-slide-eyebrow-text">
              {slide.eyebrow}
            </span>
          </p>
        ) : null}

        <h1 className="hero-carousel-slide-heading">
          {lines.map((line, i) => (
            <span key={i} className="hero-carousel-slide-heading-line">
              {line}
            </span>
          ))}
        </h1>

        {slide.tagline ? (
          <p className="hero-carousel-slide-tagline">{slide.tagline}</p>
        ) : null}

        {slide.cta?.kind === "evaluation" ? (
          <EvaluationCTA className="hero-carousel-slide-cta">
            <span>{slide.cta.label}</span>
            <span className="hero-carousel-slide-cta-arrow" aria-hidden="true">
              →
            </span>
          </EvaluationCTA>
        ) : slide.cta?.kind === "link" ? (
          <Link href={slide.cta.href} className="hero-carousel-slide-cta">
            <span>{slide.cta.label}</span>
            <span className="hero-carousel-slide-cta-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
