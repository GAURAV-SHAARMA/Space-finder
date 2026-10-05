import BarChart from "../components/BarChart";
import ProgressBar from "../components/ProgressBar";
import CircleScore from "../components/CircleScore";
import {
  accessibilityDistribution,
  detectionAccuracy,
  userSatisfaction,
  routeComfortIndex,
  researchDatasets,
  statsCards,
} from "../data/analyticsData";
import "./Analytics.css";

function exportReport() {
  const data = {
    title: "PRSF Research Analytics Report",
    generated: new Date().toISOString(),
    summary: statsCards,
    accessibilityDistribution,
    detectionAccuracy,
    userSatisfaction,
    routeComfortIndex,
    datasets: researchDatasets,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "PRSF_Analytics_Report.json";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Analytics() {
  return (
    <div className="page-wrapper analytics-page">
      <div className="analytics-header">
        <div>
          <h1 className="section-title">📈 Admin Analytics</h1>
          <p className="section-subtitle">Research-grade dashboard — PRSF Study 2024–2025, New Delhi Urban Region</p>
        </div>
        <button className="btn btn-primary export-btn" onClick={exportReport}>
          📥 Export Report
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid-4 analytics-summary">
        {statsCards.map((card, i) => (
          <div key={i} className="analytics-stat-card glass-card animate-fadeInUp" style={{ animationDelay: `${i * 80}ms` }}>
            <span className="analytics-stat-icon">{card.icon}</span>
            <div>
              <p className="analytics-stat-label">{card.label}</p>
              <h2 className="analytics-stat-value">{card.value}</h2>
              <p className="analytics-stat-change">↑ {card.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="analytics-charts-row">
        <BarChart
          data={detectionAccuracy}
          xKey="month"
          yKey="accuracy"
          color="#2563eb"
          title="📈 AI Detection Accuracy Over Time (%)"
          height={160}
        />
        <BarChart
          data={routeComfortIndex}
          xKey="zone"
          yKey="index"
          color="#06b6d4"
          title="🛣️ Route Comfort Index by Zone"
          height={160}
        />
      </div>

      {/* Charts row 2 */}
      <div className="analytics-charts-row">
        {/* Accessibility distribution */}
        <div className="glass-card analytics-dist">
          <h4 className="chart-title">♿ Accessibility Score Distribution</h4>
          <div className="dist-bars">
            {accessibilityDistribution.map((item, i) => (
              <div key={i} className="dist-bar-item">
                <div className="dist-bar-label-row">
                  <span className="dist-range">{item.range}</span>
                  <span className={`badge badge-${item.label === "Excellent" ? "success" : item.label === "Good" ? "primary" : item.label === "Moderate" ? "warning" : "danger"}`}>
                    {item.label}
                  </span>
                  <span className="dist-count">{item.count} spaces</span>
                </div>
                <div className="dist-track">
                  <div
                    className="dist-fill"
                    style={{
                      width: `${(item.count / 28) * 100}%`,
                      background: item.label === "Excellent" ? "var(--success)" : item.label === "Good" ? "var(--primary)" : item.label === "Moderate" ? "var(--warning)" : "var(--danger)",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User satisfaction */}
        <div className="glass-card analytics-satisfaction">
          <h4 className="chart-title">😊 User Satisfaction by Category</h4>
          {userSatisfaction.map((item, i) => (
            <ProgressBar key={i} label={item.category} value={item.score} />
          ))}
        </div>

        {/* Key metrics circles */}
        <div className="glass-card analytics-circles">
          <h4 className="chart-title">🎯 Core Performance Metrics</h4>
          <div className="circles-grid">
            <div className="circle-metric">
              <CircleScore score={94} size={90} label="AI Acc" />
              <p>Detection Accuracy</p>
            </div>
            <div className="circle-metric">
              <CircleScore score={88} size={90} label="Satisfy" />
              <p>User Satisfaction</p>
            </div>
            <div className="circle-metric">
              <CircleScore score={82} size={90} label="Route" />
              <p>Route Comfort</p>
            </div>
            <div className="circle-metric">
              <CircleScore score={79} size={90} label="Access" />
              <p>Avg Accessibility</p>
            </div>
          </div>
        </div>
      </div>

      {/* Research datasets table */}
      <div className="glass-card analytics-table-wrap">
        <div className="table-header">
          <h4 className="chart-title">📋 Research Dataset — Location-wise Analysis</h4>
          <span className="badge badge-primary">7 Zones · 305 Spaces</span>
        </div>
        <div className="table-scroll">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Location</th>
                <th>Total Spaces</th>
                <th>Accessible</th>
                <th>Avg Score</th>
                <th>Coverage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {researchDatasets.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td><strong>{row.location}</strong></td>
                  <td>{row.totalSpaces}</td>
                  <td>{row.accessible}</td>
                  <td>
                    <span className={`score-pill ${row.avgScore >= 80 ? "good" : row.avgScore >= 70 ? "ok" : "poor"}`}>
                      {row.avgScore}
                    </span>
                  </td>
                  <td>
                    <div className="table-progress">
                      <div className="table-progress-fill" style={{ width: row.coverage, background: parseFloat(row.coverage) >= 85 ? "var(--success)" : "var(--warning)" }}></div>
                      <span>{row.coverage}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${parseFloat(row.coverage) >= 85 ? "success" : "warning"}`}>
                      {parseFloat(row.coverage) >= 85 ? "✓ Good" : "⚠ Needs Work"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Research notes */}
      <div className="glass-card analytics-notes">
        <h4 className="chart-title">📝 Research Notes</h4>
        <div className="notes-grid">
          <div className="note-item">
            <span className="note-icon">🔬</span>
            <div>
              <strong>Methodology</strong>
              <p>AI detection using CNN-based image classification on satellite + street-view imagery. Validated against ground-truth surveys.</p>
            </div>
          </div>
          <div className="note-item">
            <span className="note-icon">📊</span>
            <div>
              <strong>Dataset Size</strong>
              <p>305 rest spaces across 7 urban zones in the Delhi NCR region. Data collected Oct 2024 – Apr 2025.</p>
            </div>
          </div>
          <div className="note-item">
            <span className="note-icon">🎯</span>
            <div>
              <strong>Accuracy Benchmark</strong>
              <p>94% detection accuracy surpasses the 85% baseline set by prior smart-city accessibility studies.</p>
            </div>
          </div>
          <div className="note-item">
            <span className="note-icon">🏙️</span>
            <div>
              <strong>Impact</strong>
              <p>Identified 75 previously unmapped accessible spaces, improving urban mobility for 1,247+ users.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
