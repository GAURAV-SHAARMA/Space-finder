import "./StatCard.css";

export default function StatCard({ icon, label, value, change, color = "primary", delay = 0 }) {
  return (
    <div className="stat-card glass-card animate-fadeInUp" style={{ animationDelay: `${delay}ms` }}>
      <div className={`stat-icon-wrap stat-icon-${color}`}>
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <h2 className="stat-value">{value}</h2>
        {change && <p className="stat-change">↑ {change}</p>}
      </div>
    </div>
  );
}
