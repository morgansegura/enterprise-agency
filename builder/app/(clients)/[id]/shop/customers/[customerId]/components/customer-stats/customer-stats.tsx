import "./customer-stats.css";

interface CustomerStatsProps {
  totalOrders: number;
  totalSpent: number;
  avgOrder: number;
  hasUserAccount: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export function CustomerStats({
  totalOrders,
  totalSpent,
  avgOrder,
  hasUserAccount,
}: CustomerStatsProps) {
  return (
    <div className="customer-detail-card">
      <div className="customer-detail-card-header">
        <h2 className="customer-detail-card-title">Statistics</h2>
      </div>
      <div className="customer-detail-card-body">
        <div className="customer-stats-grid">
          <div className="customer-stats-item">
            <span className="customer-stats-label">Total Orders</span>
            <span className="customer-stats-value">{totalOrders}</span>
          </div>
          <div className="customer-stats-item">
            <span className="customer-stats-label">Total Spent</span>
            <span className="customer-stats-value">
              {formatCurrency(totalSpent)}
            </span>
          </div>
          <div className="customer-stats-item">
            <span className="customer-stats-label">Average Order Value</span>
            <span className="customer-stats-value">
              {formatCurrency(avgOrder)}
            </span>
          </div>
        </div>
        {hasUserAccount && (
          <div className="customer-stats-account-badge">Has User Account</div>
        )}
      </div>
    </div>
  );
}
