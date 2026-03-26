import type { TestimonialItem, TestimonialBlockData } from "@/lib/blocks";
import "./testimonial-block.css";

type TestimonialBlockProps = {
  data: TestimonialBlockData;
};

/**
 * TestimonialBlock - Renders a collection of testimonial cards
 * Content block (leaf node) - cannot have children
 */
export function TestimonialBlock({ data }: TestimonialBlockProps) {
  const {
    testimonials = [],
    layout = "grid",
    columns = 3,
    variant = "default",
    showRating = false,
  } = data;

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="testimonial-block"
      data-layout={layout}
      data-columns={columns}
      data-variant={variant}
    >
      {testimonials.map(
        (testimonial: TestimonialItem, index: number) => (
          <div key={index} data-slot="testimonial-block-card">
            {showRating && testimonial.rating ? (
              <div
                data-slot="testimonial-block-rating"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    data-slot="testimonial-block-star"
                    data-filled={i < testimonial.rating! ? "true" : "false"}
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
              </div>
            ) : null}
            <blockquote data-slot="testimonial-block-quote">
              {testimonial.quote}
            </blockquote>
            <div data-slot="testimonial-block-author">
              {testimonial.avatar ? (
                <img
                  data-slot="testimonial-block-avatar"
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  loading="lazy"
                />
              ) : null}
              <div data-slot="testimonial-block-info">
                <div data-slot="testimonial-block-name">
                  {testimonial.name}
                </div>
                {testimonial.role || testimonial.company ? (
                  <div data-slot="testimonial-block-role">
                    {[testimonial.role, testimonial.company]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
