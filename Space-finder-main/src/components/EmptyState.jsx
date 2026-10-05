// EmptyState.jsx
import React from "react";

export default function EmptyState({ icon = "📭", title = "Nothing here yet", message = "No data to display." }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
