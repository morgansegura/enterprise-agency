import { Section } from "@/components/layout";
import { Image } from "@/components/ui";
import {
  STORY_TIMELINE,
  type StoryTimelineContent,
} from "@/data/story-timeline";

import "./story-timeline.css";

type StoryTimelineProps = {
  content?: StoryTimelineContent;
};

/** Our Story — club history as a scroll-animated alternating timeline. Reveal +
 *  spine are pure CSS scroll-driven (no JS); everything shows if unsupported. */
export function StoryTimeline({
  content = STORY_TIMELINE,
}: StoryTimelineProps) {
  const { eyebrow, heading, intro, entries } = content;
  if (!entries?.length) return null;

  return (
    <Section
      bg="white"
      size="default"
      ariaLabel={heading ?? "Our story"}
      className="story-timeline"
    >
      {eyebrow || heading || intro ? (
        <div className="story-timeline-head">
          {eyebrow ? (
            <p className="story-timeline-eyebrow">
              <span className="eyebrow-rule" aria-hidden="true" />
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2 className="story-timeline-heading">{heading}</h2>
          ) : null}
          {intro ? <p className="story-timeline-intro">{intro}</p> : null}
        </div>
      ) : null}

      <ol className="story-timeline-list">
        {entries.map((entry, i) => (
          <li
            key={`${entry.year}-${i}`}
            className="story-timeline-entry"
            data-side={i % 2 === 0 ? "left" : "right"}
          >
            <span className="story-timeline-node" aria-hidden="true" />
            <div className="story-timeline-card">
              <p className="story-timeline-year">{entry.year}</p>
              <h3 className="story-timeline-title">{entry.title}</h3>
              {entry.body ? (
                <p className="story-timeline-body">{entry.body}</p>
              ) : null}
              {entry.image?.src ? (
                <div className="story-timeline-media">
                  <Image
                    src={entry.image.src}
                    alt={entry.image.alt}
                    className="story-timeline-image"
                  />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
