import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { restSpaces } from "../data/restSpaces";
import { sampleReviews } from "../data/reviews";
import CircleScore from "../components/CircleScore";
import ProgressBar from "../components/ProgressBar";
import SpaceCard from "../components/SpaceCard";
import "./SpaceDetail.css";

const featureIcons = { bench: "🪑", shade: "🌳", drinkingWater: "💧", wheelchairAccess: "♿" };

export default function SpaceDetail() {
  const { id } = useParams();
  const { state, dispatch, addToast } = useApp();
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);

  const space = restSpaces.find((s) => s.id === Number(id));

  useEffect(() => {
    if (space) dispatch({ type: "ADD_RECENTLY_VIEWED", payload: space });
  }, [id]);

  if (!space) return (
    <div className="page-wrapper" style={{ paddingTop: "calc(var(--nav-height) + 28px)" }}>
      <div className="empty-state">
        <span className="empty-state-icon">😕</span>
        <h3>Space not found</h3>
        <Link to="/explorer" className="btn btn-primary" style={{ marginTop: 12 }}>Back to Explorer</Link>
      </div>
    </div>
  );

  const isSaved = state.savedSpaces.some((s) => s.id === space.id);
  const allReviews = [...sampleReviews.filter((r) => r.spaceId === space.id), ...state.reviews.filter((r) => r.spaceId === space.id)];
  const nearby = restSpaces.filter((s) => s.id !== space.id && s.features.some((f) => space.features.includes(f))).slice(0, 3);

  const handleSave = () => {
    dispatch({ type: "TOGGLE_SAVE_SPACE", payload: space });
    addToast(isSaved ? "Removed from favorites" : "Saved to favorites!", isSaved ? "info" : "success");
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return addToast("Please write a comment", "warning");
    dispatch({ type: "ADD_REVIEW", payload: { spaceId: space.id, user: state.user.name, avatar: state.user.avatar, ...reviewForm, date: new Date().toISOString().split("T")[0], helpful: 0 } });
    setReviewForm({ rating: 5, comment: "" });
    addToast("Review submitted! Thank you.", "success");
  };

  const scoreColor = space.accessibilityScore >= 85 ? "#10b981" : space.accessibilityScore >= 65 ? "#f59e0b" : "#ef4444";

  return (
    <div className="page-wrapper space-detail-page">
      <div className="detail-breadcrumb">
        <Link to="/explorer">Explorer</Link> / <span>{space.name}</span>
      </div>

      <div className="detail-hero glass-card">
        <div className="detail-hero-img-wrap">
          <img src={space.image} alt={space.name} className="detail-hero-img" />
          <div className="detail-hero-overlay">
            <div className="detail-score-big">
              <CircleScore score={space.accessibilityScore} size={110} label="Score" color={scoreColor} />
            </div>
          </div>
        </div>
        <div className="detail-hero-info">
          <div className="detail-badges">
            {space.features.map((f) => (
              <span key={f} className="badge badge-primary">{featureIcons[f]} {f.replace(/([A-Z])/g, " $1")}</span>
            ))}
          </div>
          <h1 className="detail-title">{space.name}</h1>
          <p className="detail-address">📍 {space.address}</p>
          <p className="detail-desc">{space.description}</p>
          <div className="detail-meta-row">
            <span>⏰ {space.openHours}</span>
            <span>📏 {space.distance}</span>
            <span>⭐ {space.rating} ({space.reviews} reviews)</span>
            <span className={`badge badge-${space.crowdLevel === "low" ? "success" : space.crowdLevel === "medium" ? "warning" : "danger"}`}>
              Crowd: {space.crowdLevel}
            </span>
          </div>
          <div className="detail-actions">
            <button className={`btn ${isSaved ? "btn-secondary" : "btn-primary"}`} onClick={handleSave}>
              {isSaved ? "❤️ Saved" : "🤍 Save Space"}
            </button>
            <Link to="/map" className="btn btn-secondary">🗺️ View on Map</Link>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Accessibility metrics */}
        <div className="glass-card detail-section">
          <h3 className="detail-section-title">♿ Accessibility Metrics</h3>
          <ProgressBar label="Overall Accessibility" value={space.accessibilityScore} />
          <ProgressBar label="Wheelchair Access" value={space.features.includes("wheelchairAccess") ? 95 : 30} />
          <ProgressBar label="Surface Quality" value={space.surfaceType === "paved" ? 90 : space.surfaceType === "tiled" ? 85 : 55} />
          <ProgressBar label="Lighting Quality" value={space.lighting === "excellent" ? 95 : space.lighting === "good" ? 80 : space.lighting === "moderate" ? 60 : 35} />
          <ProgressBar label="Drinking Water" value={space.features.includes("drinkingWater") ? 90 : 0} />
        </div>

        {/* Environmental comfort */}
        <div className="glass-card detail-section">
          <h3 className="detail-section-title">🌿 Environmental Comfort</h3>
          <ProgressBar label="Environment Score" value={space.environmentScore} />
          <ProgressBar label="Shade Coverage" value={space.features.includes("shade") ? 85 : 20} />
          <ProgressBar label="Noise Level" value={space.noiseLevel === "quiet" ? 90 : space.noiseLevel === "moderate" ? 60 : 30} />
          <ProgressBar label="AI Confidence" value={space.aiConfidence} color="var(--secondary)" />
          <div className="env-tags">
            <span className="badge badge-accent">Surface: {space.surfaceType}</span>
            <span className="badge badge-primary">Noise: {space.noiseLevel}</span>
            <span className="badge badge-success">Lighting: {space.lighting}</span>
          </div>
        </div>

        {/* Nearby facilities */}
        <div className="glass-card detail-section">
          <h3 className="detail-section-title">🏢 Nearby Facilities</h3>
          <div className="facilities-grid">
            {space.nearbyFacilities.map((f, i) => (
              <div key={i} className="facility-item">
                <span className="facility-icon">
                  {f === "restroom" ? "🚻" : f === "parking" ? "🅿️" : f === "metro" ? "🚇" : f === "bus stop" ? "🚌" : f === "food stall" ? "🍜" : f === "food court" ? "🍽️" : f === "pharmacy" ? "💊" : f === "cycling track" ? "🚴" : "📍"}
                </span>
                <span className="facility-name">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route comfort */}
        <div className="glass-card detail-section">
          <h3 className="detail-section-title">🛣️ Route Comfort Index</h3>
          <div className="route-visual">
            {["Start", "Path A", "Junction", "Path B", space.name].map((node, i, arr) => (
              <div key={i} className="route-node-wrap">
                <div className={`route-node ${i === arr.length - 1 ? "route-node-end" : ""}`}>
                  {i === 0 ? "📍" : i === arr.length - 1 ? "🏁" : "•"}
                </div>
                <span className="route-node-label">{node}</span>
                {i < arr.length - 1 && <div className="route-line"></div>}
              </div>
            ))}
          </div>
          <div className="route-scores">
            <div className="route-score-item"><span>Comfort</span><strong>82%</strong></div>
            <div className="route-score-item"><span>Safety</span><strong>88%</strong></div>
            <div className="route-score-item"><span>Accessibility</span><strong>{space.accessibilityScore}%</strong></div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="glass-card detail-reviews">
        <h3 className="detail-section-title">💬 User Reviews ({allReviews.length})</h3>
        {allReviews.length === 0 ? (
          <div className="empty-state" style={{ padding: "30px" }}>
            <span className="empty-state-icon">💬</span>
            <h3>No reviews yet</h3>
            <p>Be the first to review this space</p>
          </div>
        ) : (
          <div className="reviews-list">
            {allReviews.map((r) => (
              <div key={r.id} className="review-item">
                <div className="review-avatar">{r.avatar}</div>
                <div className="review-content">
                  <div className="review-header">
                    <strong>{r.user}</strong>
                    <span className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    <span className="review-date">{r.date}</span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                  <span className="review-helpful">👍 {r.helpful} found helpful</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add review form */}
        <div className="add-review-form">
          <h4>Add Your Review</h4>
          <form onSubmit={handleReview}>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="stars">
                {[1,2,3,4,5].map((s) => (
                  <span
                    key={s}
                    className={`star ${s <= (hoverRating || reviewForm.rating) ? "filled" : ""}`}
                    onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                  >★</span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      </div>

      {/* Nearby similar */}
      {nearby.length > 0 && (
        <div className="detail-nearby">
          <h3 className="section-title" style={{ marginBottom: 20 }}>📍 Nearby Similar Spaces</h3>
          <div className="grid-3">
            {nearby.map((s) => <SpaceCard key={s.id} space={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}
