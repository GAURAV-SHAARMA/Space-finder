import { useState } from "react";
import { useApp } from "../context/AppContext";
import { restSpaces } from "../data/restSpaces";
import SpaceCard from "../components/SpaceCard";
import CircleScore from "../components/CircleScore";
import "./AIRecommendations.css";

const preferenceOptions = [
  { key: "elderlyFriendly", label: "Elderly Friendly", icon: "👴", desc: "Smooth surfaces, benches, low crowd" },
  { key: "wheelchairAccessible", label: "Wheelchair Accessible", icon: "♿", desc: "Ramps, paved paths, wide access" },
  { key: "quietArea", label: "Quiet Area", icon: "🤫", desc: "Low noise, peaceful environment" },
  { key: "shadedSeating", label: "Shaded Seating", icon: "🌳", desc: "Tree cover or overhead shade" },
  { key: "drinkingWater", label: "Drinking Water", icon: "💧", desc: "Water dispensers or fountains nearby" },
  { key: "lowCrowd", label: "Low Crowd", icon: "🟢", desc: "Avoid busy areas" },
];

function computeScore(space, prefs) {
  let score = space.accessibilityScore;
  if (prefs.elderlyFriendly) {
    if (space.surfaceType === "paved" || space.surfaceType === "tiled") score += 10;
    if (space.crowdLevel === "low") score += 8;
    if (space.features.includes("bench")) score += 6;
  }
  if (prefs.wheelchairAccessible && space.features.includes("wheelchairAccess")) score += 15;
  if (prefs.quietArea && space.noiseLevel === "quiet") score += 12;
  if (prefs.shadedSeating && space.features.includes("shade")) score += 10;
  if (prefs.drinkingWater && space.features.includes("drinkingWater")) score += 8;
  if (prefs.lowCrowd && space.crowdLevel === "low") score += 10;
  return Math.min(score, 100);
}

export default function AIRecommendations() {
  const { state, dispatch, addToast } = useApp();
  const [prefs, setPrefs] = useState(state.preferences || {});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const generate = () => {
    setLoading(true);
    dispatch({ type: "SET_PREFERENCES", payload: prefs });
    setTimeout(() => {
      const scored = restSpaces
        .map((s) => ({ ...s, aiMatchScore: computeScore(s, prefs) }))
        .sort((a, b) => b.aiMatchScore - a.aiMatchScore);
      setResults(scored);
      setLoading(false);
      addToast("AI recommendations generated!", "success");
    }, 1200);
  };

  const activePrefs = Object.keys(prefs).filter((k) => prefs[k]);

  return (
    <div className="page-wrapper ai-page">
      <div className="ai-header">
        <div className="ai-header-text">
          <h1 className="section-title">🤖 AI Recommendations</h1>
          <p className="section-subtitle">Personalized rest space suggestions based on your accessibility preferences</p>
        </div>
        <div className="ai-badge glass-card">
          <span className="ai-badge-icon">🧠</span>
          <div>
            <p className="ai-badge-label">AI Engine</p>
            <p className="ai-badge-val">PRSF-ML v2.1</p>
          </div>
        </div>
      </div>

      <div className="ai-layout">
        {/* Preference form */}
        <div className="glass-card ai-prefs-panel">
          <h3 className="ai-panel-title">⚙️ Your Preferences</h3>
          <p className="ai-panel-sub">Select what matters most to you</p>
          <div className="prefs-grid">
            {preferenceOptions.map((opt) => (
              <button
                key={opt.key}
                className={`pref-card ${prefs[opt.key] ? "active" : ""}`}
                onClick={() => togglePref(opt.key)}
              >
                <span className="pref-icon">{opt.icon}</span>
                <span className="pref-label">{opt.label}</span>
                <span className="pref-desc">{opt.desc}</span>
                {prefs[opt.key] && <span className="pref-check">✓</span>}
              </button>
            ))}
          </div>

          {activePrefs.length > 0 && (
            <div className="active-prefs">
              <p className="active-prefs-label">Active preferences:</p>
              <div className="active-prefs-chips">
                {activePrefs.map((k) => {
                  const opt = preferenceOptions.find((o) => o.key === k);
                  return <span key={k} className="badge badge-primary">{opt?.icon} {opt?.label}</span>;
                })}
              </div>
            </div>
          )}

          <button
            className="btn btn-primary ai-generate-btn"
            onClick={generate}
            disabled={loading || activePrefs.length === 0}
          >
            {loading ? "🔄 Analyzing..." : "🤖 Generate Recommendations"}
          </button>
          {activePrefs.length === 0 && <p className="ai-hint">Select at least one preference to generate recommendations</p>}
        </div>

        {/* Results */}
        <div className="ai-results">
          {!results && !loading && (
            <div className="ai-empty glass-card">
              <div className="ai-empty-visual">
                <span className="ai-empty-icon">🤖</span>
                <div className="ai-pulse-ring"></div>
              </div>
              <h3>Ready to Analyze</h3>
              <p>Set your preferences and click Generate to get personalized recommendations powered by PRSF-ML.</p>
            </div>
          )}

          {loading && (
            <div className="ai-loading glass-card">
              <div className="ai-loading-spinner"></div>
              <h3>Analyzing Preferences...</h3>
              <p>PRSF-ML is computing accessibility scores based on your profile</p>
              <div className="ai-loading-steps">
                {["Loading space data", "Applying preference weights", "Computing match scores", "Ranking results"].map((s, i) => (
                  <div key={i} className="ai-loading-step" style={{ animationDelay: `${i * 250}ms` }}>
                    <span className="step-dot"></span> {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results && !loading && (
            <div className="ai-results-content animate-fadeInUp">
              <div className="ai-results-header">
                <h3>Top Recommendations for You</h3>
                <span className="badge badge-success">✓ {results.length} spaces analyzed</span>
              </div>

              {/* Top 3 highlight */}
              <div className="ai-top3">
                {results.slice(0, 3).map((space, i) => (
                  <div key={space.id} className={`ai-top-card glass-card ${i === 0 ? "top-1" : ""}`}>
                    <div className="ai-rank">#{i + 1}</div>
                    <img src={space.image} alt={space.name} className="ai-top-img" />
                    <div className="ai-top-info">
                      <h4>{space.name}</h4>
                      <p>{space.address}</p>
                      <div className="ai-top-scores">
                        <CircleScore score={space.aiMatchScore} size={60} label="Match" />
                        <CircleScore score={space.accessibilityScore} size={60} label="Access" />
                        <CircleScore score={space.aiConfidence} size={60} label="AI Conf" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="ai-all-title">All Ranked Spaces</h4>
              <div className="spaces-grid">
                {results.map((space) => (
                  <div key={space.id} className="ai-result-wrap">
                    <div className="ai-match-badge">
                      🎯 {space.aiMatchScore}% match
                    </div>
                    <SpaceCard space={space} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
