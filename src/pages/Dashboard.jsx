import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import BarChart from "../components/BarChart";
import CircleScore from "../components/CircleScore";
import ProgressBar from "../components/ProgressBar";
import { useApp } from "../context/AppContext";
import { recentActivity, restSpaces } from "../data/restSpaces";
import { detectionAccuracy, userSatisfaction } from "../data/analyticsData";
import "./Dashboard.css";

export default function Dashboard() {
  const { state } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const totalReviews = state.reviews.length + 89;
  const avgScore = Math.round(restSpaces.reduce((a, s) => a + s.accessibilityScore, 0) / restSpaces.length);

  const nearby = restSpaces.slice(0, 4);

  return (
    <div className="page-wrapper dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Overview of PRSF accessibility data and activity</p>
        </div>
        <div className="dashboard-date">
          <span>📅 April 27, 2025</span>
          <span className="live-badge">🟢 Live</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4 dashboard-stats">
        <StatCard icon="📍" label="Total Rest Spaces" value="305" change="12 this month" color="primary" delay={0} />
        <StatCard icon="♿" label="Avg Accessibility Score" value={`${avgScore}`} change="2.3 pts" color="success" delay={80} />
        <StatCard icon="❤️" label="Saved Places" value={`${state.savedSpaces.length}`} change="Your favorites" color="accent" delay={160} />
        <StatCard icon="💬" label="User Reviews" value={`${totalReviews}`} change="89 this week" color="warning" delay={240} />
      </div>

      <div className="dashboard-grid">
        {/* Detection accuracy chart */}
        <div className="dashboard-chart-wrap">
          <BarChart
            data={detectionAccuracy}
            xKey="month"
            yKey="accuracy"
            color="#2563eb"
            title="📈 AI Detection Accuracy (Monthly %)"
            height={160}
          />
        </div>

        {/* User satisfaction */}
        <div className="glass-card dashboard-satisfaction">
          <h4 className="chart-title">😊 User Satisfaction Scores</h4>
          {userSatisfaction.map((item, i) => (
            <ProgressBar key={i} label={item.category} value={item.score} />
          ))}
        </div>

        {/* Score overview */}
        <div className="glass-card dashboard-scores">
          <h4 className="chart-title">🎯 Key Metrics</h4>
          <div className="scores-grid">
            <div className="score-item">
              <CircleScore score={94} size={90} label="AI Acc" />
              <p>AI Accuracy</p>
            </div>
            <div className="score-item">
              <CircleScore score={avgScore} size={90} label="Access" />
              <p>Avg Score</p>
            </div>
            <div className="score-item">
              <CircleScore score={88} size={90} label="Satisfy" />
              <p>Satisfaction</p>
            </div>
            <div className="score-item">
              <CircleScore score={82} size={90} label="Route" />
              <p>Route Comfort</p>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="glass-card dashboard-activity">
          <h4 className="chart-title">⚡ Recent Activity</h4>
          <div className="activity-list">
            {recentActivity.map((item) => (
              <div key={item.id} className="activity-item">
                <div className={`activity-dot activity-${item.type}`}></div>
                <div className="activity-content">
                  <p className="activity-action">{item.action}</p>
                  <p className="activity-space">{item.space}</p>
                </div>
                <span className="activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby recommendations */}
        <div className="glass-card dashboard-nearby">
          <div className="nearby-header">
            <h4 className="chart-title">📍 Nearby Recommendations</h4>
            <Link to="/explorer" className="btn btn-ghost" style={{ fontSize: "0.8rem" }}>View All →</Link>
          </div>
          <div className="nearby-list">
            {nearby.map((space) => (
              <Link to={`/space/${space.id}`} key={space.id} className="nearby-item">
                <img src={space.image} alt={space.name} className="nearby-img" />
                <div className="nearby-info">
                  <p className="nearby-name">{space.name}</p>
                  <p className="nearby-meta">♿ {space.accessibilityScore} · 📏 {space.distance}</p>
                </div>
                <div className={`nearby-score ${space.accessibilityScore >= 85 ? "score-good" : "score-ok"}`}>
                  {space.accessibilityScore}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recently viewed */}
        {state.recentlyViewed.length > 0 && (
          <div className="glass-card dashboard-recent-viewed">
            <h4 className="chart-title">👁️ Recently Viewed</h4>
            <div className="recently-viewed-list">
              {state.recentlyViewed.map((space) => (
                <Link to={`/space/${space.id}`} key={space.id} className="recently-viewed-item">
                  <span className="rv-icon">📍</span>
                  <span className="rv-name">{space.name}</span>
                  <span className="rv-score">♿ {space.accessibilityScore}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
