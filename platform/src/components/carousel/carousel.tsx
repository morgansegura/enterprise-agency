'use client'

import useEmblaCarousel from 'embla-carousel-react'
import React from 'react'

type Slide = { image?: { url?: string; alt?: string } | null; caption?: string }

export function CarouselClient({ slides }: { slides: Slide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  if (!slides?.length) {
    return <p className="carousel-empty">Add slides in the field panel.</p>
  }
  return (
    <div className="carousel">
      <div className="embla" ref={emblaRef}>
        <div className="embla-container">
          {slides.map((s, i) => {
            const img = s.image && typeof s.image === 'object' ? s.image : null
            return (
              <div className="embla-slide" key={i}>
                {img?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="carousel-img"
                    src={img.url}
                    alt={img.alt ?? ''}
                  />
                ) : null}
                {s.caption ? (
                  <p className="carousel-caption">{s.caption}</p>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
      <button
        type="button"
        className="carousel-btn carousel-prev"
        aria-label="Previous"
        onClick={() => emblaApi?.scrollPrev()}
      >
        ‹
      </button>
      <button
        type="button"
        className="carousel-btn carousel-next"
        aria-label="Next"
        onClick={() => emblaApi?.scrollNext()}
      >
        ›
      </button>
    </div>
  )
}
