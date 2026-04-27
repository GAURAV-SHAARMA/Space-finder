import { Link } from "react-router-dom";
import "./Landing.css";

const features = [
  { icon: "🤖", title: "AI-Powered Detection", desc: "Machine learning algorithms identify and classify rest spaces with 94% accuracy using satellite and street-level imagery." },
  { icon: "♿", title: "Accessibility Scoring", desc: "Each space is scored on a 100-point scale covering ramps, surface quality, shade, water access, and crowd levels." },
  { icon: "🗺️", title: "Smart City Mapping", desc: "Interactive city map with heatmap overlays showing accessibility zones and optimal rest routes." },
  { icon: "👥", title: "Community Crowdsourcing", desc: "Citizens contribute real-time updates, photos, and accessibility reports to keep data fresh and accurate." },
  { icon: "📊", title: "Research Analytics", desc: "Comprehensive dashboards with research-grade statistics for urban planners and accessibility researchers." },
  { icon: "🔔", title: "Personalized Recommendations", desc: "AI tailors suggestions based on user preferences — elderly-friendly, wheelchair-accessible, quiet zones, and more." },
];

const steps = [
  { step: "01", title: "Data Collection", desc: "Satellite imagery, street-view data, and community reports are aggregated from multiple sources." },
  { step: "02", title: "AI Processing", desc: "Deep learning models classify rest spaces, detect accessibility features, and compute comfort scores." },
  { step: "03", title: "Score & Rank", desc: "Each space receives an accessibility score and is ranked by proximity, comfort, and user ratings." },
  { step: "04", title: "Discover & Navigate", desc: "Users explore the map, filter by needs, and get personalized route recommendations." },
];

const stats = [
  { value: "305+", label: "Rest Spaces Mapped", icon: "📍" },
  { value: "94%", label: "AI Detection Accuracy", icon: "🎯" },
  { value: "1,247", label: "Active Users", icon: "👥" },
  { value: "79.6", label: "Avg Accessibility Score", icon: "♿" },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Animated background */}
      <div className="landing-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge badge badge-primary animate-fadeInUp">
            🏙️ Smart City Initiative · Research Project 2025
          </div>
          <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: "100ms" }}>
            Public Rest Space Finder
            <span className="hero-title-accent"> AI-Powered</span>
          </h1>
          <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: "200ms" }}>
            Discover, navigate, and analyze accessible urban rest areas using advanced AI detection,
            community crowdsourcing, and real-time accessibility scoring for inclusive smart cities.
          </p>
          <div className="hero-actions animate-fadeInUp" style={{ animationDelay: "300ms" }}>
            <Link to="/explorer" className="btn btn-primary hero-btn">
              🔍 Explore Rest Spaces
            </Link>
            <Link to="/dashboard" className="btn btn-secondary hero-btn">
              📊 View Dashboard
            </Link>
          </div>
          <div className="hero-stats animate-fadeInUp" style={{ animationDelay: "400ms" }}>
            {stats.map((s, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-icon">{s.icon}</span>
                <span className="hero-stat-val">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual animate-fadeIn" style={{ animationDelay: "200ms" }}>
          <div className="hero-map-card glass-card">
            <div className="map-header">
              <span className="map-dot green"></span>
              <span className="map-dot yellow"></span>
              <span className="map-dot red"></span>
              <span className="map-title">PRSF Live Map</span>
            </div>
            <div className="map-preview">
              <div className="map-grid">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="map-cell" style={{ opacity: Math.random() * 0.5 + 0.1 }}></div>
                ))}
              </div>
              {[
                { top: "30%", left: "25%", score: 92, color: "#10b981" },
                { top: "55%", left: "60%", score: 85, color: "#10b981" },
                { top: "20%", left: "65%", score: 70, color: "#f59e0b" },
                { top: "70%", left: "30%", score: 55, color: "#ef4444" },
                { top: "45%", left: "45%", score: 96, color: "#10b981" },
              ].map((pin, i) => (
                <div key={i} className="map-pin" style={{ top: pin.top, left: pin.left }}>
                  <div className="pin-dot" style={{ background: pin.color }}></div>
                  <div className="pin-label">{pin.score}</div>
                </div>
              ))}
            </div>
            <div className="map-legend">
              <span className="legend-item"><span className="legend-dot" style={{ background: "#10b981" }}></span>Excellent</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: "#f59e0b" }}></span>Good</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: "#ef4444" }}></span>Poor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="section-header">
          <p className="section-eyebrow">Core Capabilities</p>
          <h2 className="section-title">Why PRSF?</h2>
          <p className="section-subtitle">A comprehensive platform combining AI, community data, and smart-city infrastructure for accessible urban mobility.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass-card animate-fadeInUp" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section how-section">
        <div className="section-header">
          <p className="section-eyebrow">Methodology</p>
          <h2 className="section-title">How PRSF Works</h2>
          <p className="section-subtitle">A four-stage pipeline from raw data to personalized accessibility recommendations.</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card glass-card animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="step-number">{s.step}</div>
              <div className="step-connector"></div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research Stats */}
      <section className="section stats-section">
        <div className="stats-banner glass-card">
          <div className="stats-banner-content">
            <p className="section-eyebrow">Research Findings</p>
            <h2 className="section-title">Impact by Numbers</h2>
          </div>
          <div className="stats-banner-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-banner-item animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="stat-banner-icon">{s.icon}</span>
                <span className="stat-banner-val">{s.value}</span>
                <span className="stat-banner-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="cta-card glass-card">
          <h2 className="cta-title">Start Exploring Accessible Spaces</h2>
          <p className="cta-desc">Join 1,247 users discovering inclusive urban rest areas powered by AI and community data.</p>
          <div className="cta-actions">
            <Link to="/explorer" className="btn btn-primary">🔍 Explore Now</Link>
            <Link to="/ai" className="btn btn-secondary">🤖 Get AI Recommendations</Link>
            <Link to="/community" className="btn btn-secondary">💬 Join Community</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 PRSF – Public Rest Space Finder · Research Project · Smart City Initiative</p>
        <p className="footer-sub">Built with React.js · AI-Powered · Accessibility-First Design</p>
      </footer>
    </div>
  );
}
