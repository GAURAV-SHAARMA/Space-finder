import "./SkeletonCard.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card glass-card">
      <div className="skeleton skeleton-img"></div>
      <div className="skeleton-body">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-sub"></div>
        <div className="skeleton-chips">
          <div className="skeleton skeleton-chip"></div>
          <div className="skeleton skeleton-chip"></div>
          <div className="skeleton skeleton-chip"></div>
        </div>
        <div className="skeleton skeleton-btn"></div>
      </div>
    </div>
  );
}
