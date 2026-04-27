import { useState } from "react";
import { Link } from "react-router-dom";
import { restSpaces } from "../data/restSpaces";
import CircleScore from "../components/CircleScore";
import "./MapView.css";

const heatZones = [
  { id: 1, label: "Zone A – Central", score: 91, top: "20%", left: "35%", size: 120, color: "rgba(16,185,129,0.18)" },
  { id: 2, label: "Zone B – Metro", score: 85, top: "40%", left: "55%", size: 100, color: "rgba(16,185,129,0.14)" },
  { id: 3, label: "Zone C – South", score: 70, top: "60%", left: "25%", size: 90, color: "rgba(245,158,11,0.16)" },
  { id: 4, label: "Zone D – Old City", score: 55, top: "25%", left: "70%", size: 80, color: "rgba(239,68,68,0.14)" },
  { id: 5, label: "Zone E – Tech Hub", score: 90, top: "70%", left: "65%", size: 110, color: "rgba(16,185,129,0.16)" },
];

const mapPins = [
  { id: 1, top: "28%", left: "38%", score: 92, name: "Central Park Zone" },
  { id: 2, top: "45%", left: "58%", score: 85, name: "Metro Alcove" },
  { id: 3, top: "35%", left: "20%", score: 78, name: "Riverside Point" },
  { id: 4, top: "55%", left: "42%", score: 96, name: "CP Plaza" },
  { id: 5, top: "65%", left: "28%", score: 70, name: "Green Belt" },
  { id: 6, top: "50%", left: "72%", score: 88, name: "Hospital Zone" },
  { id: 7, top: "22%", left: "68%", score: 55, name: "Old City Bench" },
  { id: 8, top: "72%", left: "62%", score: 90, name: "Tech Hub Lounge" },
];

const routePoints = [
  { top: "55%", left: "42%", label: "Start" },
  { top: "45%", left: "50%", label: "" },
  { top: "45%", left: "58%", label: "" },
  { top: "28%", left: "38%", label: "End" },
];

export default function MapView() {
  const [selectedPin, setSelectedPin] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [activeZone, setActiveZone] = useState(null);

  const pinColor = (score) => score >= 85 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444";
  const space = selectedPin ? restSpaces.find((s) => s.id === selectedPin) : null;

  return (
    <div className="page-wrapper map-page">
      <div className="map-page-header">
        <div>
          <h1 className="section-title">🗺️ City Map Visualization</h1>
          <p className="section-subtitle">Interactive accessibility map with heatmap zones and route recommendations</p>
        </div>
        <div className="map-controls glass-card">
          <button className={`map-ctrl-btn ${showHeatmap ? "active" : ""}`} onClick={() => setShowHeatmap(!showHeatmap)}>
            🌡️ Heatmap
          </button>
          <button className={`map-ctrl-btn ${showRoute ? "active" : ""}`} onClick={() => setShowRoute(!showRoute)}>
            🛣️ Route
          </button>
          <button className="map-ctrl-btn" onClick={() => setSelectedPin(null)}>
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="map-layout">
        {/* Map canvas */}
        <div className="map-canvas glass-card">
          <div className="map-canvas-header">
            <span className="map-canvas-title">📍 New Delhi – Accessibility Map</span>
            <div className="map-legend-inline">
              <span><span className="legend-dot-sm" style={{ background: "#10b981" }}></span> Excellent (85+)</span>
              <span><span className="legend-dot-sm" style={{ background: "#f59e0b" }}></span> Good (65-84)</span>
              <span><span className="legend-dot-sm" style={{ background: "#ef4444" }}></span> Poor (&lt;65)</span>
            </div>
          </div>

          <div className="map-area">
            {/* Grid background */}
            <div className="map-bg-grid"></div>

            {/* Road lines */}
            <svg className="map-roads" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border-solid)" strokeWidth="0.4" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="var(--border-solid)" strokeWidth="0.4" />
              <line x1="0" y1="30" x2="100" y2="70" stroke="var(--border-solid)" strokeWidth="0.3" />
              <line x1="20" y1="0" x2="80" y2="100" stroke="var(--border-solid)" strokeWidth="0.3" />
              <line x1="0" y1="70" x2="100" y2="30" stroke="var(--border-solid)" strokeWidth="0.25" />
            </svg>

            {/* Heatmap zones */}
            {showHeatmap && heatZones.map((zone) => (
              <div
                key={zone.id}
                className={`heat-zone ${activeZone === zone.id ? "active" : ""}`}
                style={{
                  top: zone.top, left: zone.left,
                  width: zone.size, height: zone.size,
                  background: zone.color,
                  marginLeft: -zone.size / 2, marginTop: -zone.size / 2,
                }}
                onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)}
              >
                <span className="heat-zone-label">{zone.score}</span>
              </div>
            ))}

            {/* Route */}
            {showRoute && (
              <svg className="map-route-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={routePoints.map((p) => `${parseFloat(p.left)},${parseFloat(p.top)}`).join(" ")}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="1.2"
                  strokeDasharray="3,2"
                  className="route-line-anim"
                />
              </svg>
            )}

            {/* Pins */}
            {mapPins.map((pin) => (
              <div
                key={pin.id}
                className={`map-pin-marker ${selectedPin === pin.id ? "selected" : ""}`}
                style={{ top: pin.top, left: pin.left }}
                onClick={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}
                title={pin.name}
              >
                <div className="pin-circle" style={{ background: pinColor(pin.score) }}>
                  <span className="pin-score">{pin.score}</span>
                </div>
                <div className="pin-stem"></div>
                <div className="pin-name-tooltip">{pin.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="map-side">
          {/* Zone info */}
          {activeZone && showHeatmap && (
            <div className="glass-card map-zone-info animate-scaleIn">
              <h4>🌡️ Zone Details</h4>
              {(() => {
                const z = heatZones.find((z) => z.id === activeZone);
                return z ? (
                  <>
                    <p className="zone-name">{z.label}</p>
                    <CircleScore score={z.score} size={70} label="Score" />
                    <p className="zone-desc">Accessibility coverage zone with {z.score >= 85 ? "excellent" : z.score >= 65 ? "good" : "poor"} infrastructure.</p>
                  </>
                ) : null;
              })()}
            </div>
          )}

          {/* Selected pin info */}
          {space && (
            <div className="glass-card map-pin-info animate-scaleIn">
              <img src={space.image} alt={space.name} className="pin-info-img" />
              <div className="pin-info-body">
                <h4>{space.name}</h4>
                <p>📍 {space.address}</p>
                <div className="pin-info-scores">
                  <CircleScore score={space.accessibilityScore} size={60} label="Access" />
                  <CircleScore score={space.aiConfidence} size={60} label="AI Conf" />
                </div>
                <div className="pin-info-features">
                  {space.features.map((f) => (
                    <span key={f} className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                      {f === "bench" ? "🪑" : f === "shade" ? "🌳" : f === "drinkingWater" ? "💧" : "♿"} {f}
                    </span>
                  ))}
                </div>
                <Link to={`/space/${space.id}`} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                  View Details →
                </Link>
              </div>
            </div>
          )}

          {/* All zones list */}
          <div className="glass-card map-zones-list">
            <h4 className="chart-title">📊 Accessibility Zones</h4>
            {heatZones.map((zone) => (
              <div
                key={zone.id}
                className={`zone-list-item ${activeZone === zone.id ? "active" : ""}`}
                onClick={() => { setShowHeatmap(true); setActiveZone(zone.id); }}
              >
                <div className="zone-list-dot" style={{ background: pinColor(zone.score) }}></div>
                <span className="zone-list-label">{zone.label}</span>
                <span className="zone-list-score" style={{ color: pinColor(zone.score) }}>{zone.score}</span>
              </div>
            ))}
          </div>

          {/* Nearby spaces */}
          <div className="glass-card map-nearby-list">
            <h4 className="chart-title">📍 All Mapped Spaces</h4>
            {restSpaces.map((s) => (
              <div
                key={s.id}
                className={`map-space-item ${selectedPin === s.id ? "active" : ""}`}
                onClick={() => setSelectedPin(s.id)}
              >
                <div className="map-space-dot" style={{ background: pinColor(s.accessibilityScore) }}></div>
                <span className="map-space-name">{s.name}</span>
                <span className="map-space-score" style={{ color: pinColor(s.accessibilityScore) }}>{s.accessibilityScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
