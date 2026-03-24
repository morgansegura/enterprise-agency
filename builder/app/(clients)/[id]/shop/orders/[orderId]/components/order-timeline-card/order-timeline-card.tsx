import { formatDateTime } from "../../utils";

import "./order-timeline-card.css";

interface TimelineEvent {
  label: string;
  date: string;
  active: boolean;
}

interface OrderTimelineCardProps {
  timeline: TimelineEvent[];
}

export function OrderTimelineCard({ timeline }: OrderTimelineCardProps) {
  return (
    <div className="order-detail-card">
      <div className="order-detail-card-header">
        <h2 className="order-detail-card-title">Timeline</h2>
      </div>
      <div className="order-detail-card-body">
        <div className="order-timeline">
          {timeline.map((event, i) => (
            <div key={i} className="order-timeline-item">
              <div
                className={`order-timeline-dot ${event.active ? "order-timeline-dot-active" : ""}`}
              />
              <div className="order-timeline-content">
                <span className="order-timeline-label">{event.label}</span>
                <span className="order-timeline-date">
                  {formatDateTime(event.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
