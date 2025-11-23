import "./dashboard-header.css";

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="dashboard-header">
      <h1 className="dashboard-header-title">{title}</h1>
      <p className="dashboard-header-description">{description}</p>
    </div>
  );
}
