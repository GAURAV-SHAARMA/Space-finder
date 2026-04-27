import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./SpaceCard.css";

const featureIcons = {
  bench: "🪑",
  shade: "🌳",
  drinkingWater: "💧",
  wheelchairAccess: "♿",
};

const crowdColors = { low: "success", medium: "warning", high: "danger" };

export default function SpaceCard({ space, onView }) {
  const { state, dispatch, addToast } = useApp();
  const isSaved = state.savedSpaces.some((s) => s.id === space.id);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "TOGGLE_SAVE_SPACE", payload: space });
    addToast(
      isSaved ? "Removed from favorites" : "Saved to favorites!",
      isSaved ? "info" : "success"
    );
  };

  const handleView = () => {
    dispatch({ type: "ADD_RECENTLY_VIEWED", payload: space });
    if (onView) onView(space);
  };

  const scoreColor = space.accessibilityScore >= 85 ? "success" : space.accessibilityScore >= 65 ? "warning" : "danger";

  return (
    <div className="space-card glass-card animate-scaleIn" onClick={handleView}>
      <div className="space-card-image-wrap">
        <img src={space.image} alt={space.name} className="space-card-image" loading="lazy" />
        <div className={`score-badge badge-${scoreColor}`}>
          ♿ {space.accessibilityScore}
        </div>
        <button className={`save-btn ${isSaved ? "saved" : ""}`} onClick={handleSave} aria-label="Save space">
          {isSaved ? "❤️" : "🤍"}
        </button>
        <span className={`crowd-badge badge badge-${crowdColors[space.crowdLevel]}`}>
          {space.crowdLevel === "low" ? "🟢" : space.crowdLevel === "medium" ? "🟡" : "🔴"} {space.crowdLevel}
        </span>
      </div>

      <div className="space-card-body">
        <h3 className="space-card-title">{space.name}</h3>
        <p className="space-card-address">📍 {space.address}</p>

        <div className="space-card-features">
          {space.features.map((f) => (
            <span key={f} className="feature-chip" title={f}>
              {featureIcons[f]} {f.replace(/([A-Z])/g, " $1")}
            </span>
          ))}
        </div>

        <div className="space-card-meta">
          <div className="meta-item">
            <span className="meta-stars">{"★".repeat(Math.round(space.rating))}{"☆".repeat(5 - Math.round(space.rating))}</span>
            <span className="meta-val">{space.rating} ({space.reviews})</span>
          </div>
          <span className="meta-distance">📏 {space.distance}</span>
        </div>

        <div className="ai-confidence">
          <span>AI Confidence</span>
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: `${space.aiConfidence}%` }}></div>
          </div>
          <span className="confidence-val">{space.aiConfidence}%</span>
        </div>

        <Link to={`/space/${space.id}`} className="btn btn-primary space-card-btn" onClick={handleView}>
          View Details →
        </Link>
      </div>
    </div>
  );
}
