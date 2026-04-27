import "./ProgressBar.css";

export default function ProgressBar({ label, value, max = 100, color, showValue = true }) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = color || (pct >= 80 ? "var(--success)" : pct >= 55 ? "var(--warning)" : "var(--danger)");

  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar-header">
        <span className="progress-label">{label}</span>
        {showValue && <span className="progress-value" style={{ color: barColor }}>{value}{max !== 100 ? `/${max}` : "%"}</span>}
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: barColor }}
        ></div>
      </div>
    </div>
  );
}
