import "./FilterPanel.css";

const filterOptions = [
  { key: "bench", label: "Benches", icon: "🪑" },
  { key: "shade", label: "Shade", icon: "🌳" },
  { key: "drinkingWater", label: "Drinking Water", icon: "💧" },
  { key: "wheelchairAccess", label: "Wheelchair", icon: "♿" },
];

const crowdOptions = ["all", "low", "medium", "high"];

export default function FilterPanel({ filters, onChange }) {
  const toggleFeature = (key) => {
    const features = filters.features.includes(key)
      ? filters.features.filter((f) => f !== key)
      : [...filters.features, key];
    onChange({ ...filters, features });
  };

  return (
    <div className="filter-panel glass-card">
      <h3 className="filter-title">🔧 Filters</h3>

      <div className="filter-section">
        <p className="filter-section-label">Features</p>
        <div className="filter-chips">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              className={`filter-chip ${filters.features.includes(opt.key) ? "active" : ""}`}
              onClick={() => toggleFeature(opt.key)}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-section-label">Crowd Level</p>
        <div className="filter-chips">
          {crowdOptions.map((c) => (
            <button
              key={c}
              className={`filter-chip ${filters.crowd === c ? "active" : ""}`}
              onClick={() => onChange({ ...filters, crowd: c })}
            >
              {c === "all" ? "🌐 All" : c === "low" ? "🟢 Low" : c === "medium" ? "🟡 Medium" : "🔴 High"}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-section-label">Min Accessibility Score</p>
        <div className="score-slider-wrap">
          <input
            type="range" min="0" max="100" step="5"
            value={filters.minScore}
            onChange={(e) => onChange({ ...filters, minScore: Number(e.target.value) })}
            className="score-slider"
          />
          <span className="score-slider-val">{filters.minScore}+</span>
        </div>
      </div>

      <button
        className="btn btn-ghost filter-reset"
        onClick={() => onChange({ features: [], crowd: "all", minScore: 0 })}
      >
        ↺ Reset Filters
      </button>
    </div>
  );
}
