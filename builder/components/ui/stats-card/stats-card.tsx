import { LucideIcon } from "lucide-react";
import "./stats-card.css";

interface StatsCardProps {
  name: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: "blue" | "green" | "purple" | "orange";
}

export function StatsCard({
  name,
  value,
  icon: Icon,
  iconColor,
}: StatsCardProps) {
  return (
    <div className="stats-card">
      <div className="stats-card-content">
        <div className="stats-card-icon-wrapper">
          <div className={`stats-card-icon stats-card-icon-${iconColor}`}>
            <Icon className="stats-card-icon-svg" />
          </div>
        </div>
        <div className="stats-card-details">
          <dl>
            <dt className="stats-card-label">{name}</dt>
            <dd className="stats-card-value">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
