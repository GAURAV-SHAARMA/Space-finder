import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { useApp } from "../context/AppContext";
import CircleScore from "../components/CircleScore";
import "./MapView.css";
import "leaflet/dist/leaflet.css";

const defaultCenter = [28.6139, 77.209];

function scoreColor(score) {
  return score >= 85 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444";
}

function MapViewport({ spaces, selectedSpace, resetVersion }) {
  const map = useMap();
  const bounds = useMemo(
    () => spaces.filter((space) => Number.isFinite(space.lat) && Number.isFinite(space.lng))
      .map((space) => [space.lat, space.lng]),
    [spaces],
  );

  useEffect(() => {
    if (bounds.length) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, bounds]);

  useEffect(() => {
    if (selectedSpace) {
      map.flyTo([selectedSpace.lat, selectedSpace.lng], Math.max(map.getZoom(), 14));
    }
  }, [map, selectedSpace]);

  useEffect(() => {
    if (!selectedSpace && bounds.length) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [bounds, map, resetVersion, selectedSpace]);

  return null;
}

function markerIcon(score, selected) {
  const color = scoreColor(score);
  return L.divIcon({
    className: "leaflet-score-icon",
    html: `<span class="leaflet-score-pin${selected ? " selected" : ""}" style="--pin-color:${color}"><span>${score}</span></span>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

function distanceBetween(first, second) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const latitudeDelta = radians(second.lat - first.lat);
  const longitudeDelta = radians(second.lng - first.lng);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(first.lat)) * Math.cos(radians(second.lat))
    * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapView() {
  const { state } = useApp();
  const [selectedPin, setSelectedPin] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const spaces = useMemo(
    () => state.spaces.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng)),
    [state.spaces],
  );
  const space = spaces.find((item) => item.id === selectedPin) || null;

  const route = useMemo(() => {
    if (spaces.length < 2) return [];
    const start = space || spaces[0];
    const end = spaces
      .filter((candidate) => candidate.id !== start.id)
      .reduce((nearest, candidate) => (
        !nearest || distanceBetween(start, candidate) < distanceBetween(start, nearest)
          ? candidate
          : nearest
      ), null);
    return end ? [start, end] : [];
  }, [space, spaces]);

  const scoreGroups = [
    { label: "Excellent (85+)", minimum: 85 },
    { label: "Good (65–84)", minimum: 65, maximum: 84 },
    { label: "Needs improvement (<65)", minimum: 0, maximum: 64 },
  ];

  const resetMap = () => {
    setSelectedPin(null);
    setResetVersion((version) => version + 1);
  };

  return (
    <div className="page-wrapper map-page">
      <div className="map-page-header">
        <div>
          <h1 className="section-title">🗺️ City Map Visualization</h1>
          <p className="section-subtitle">Explore rest spaces on OpenStreetMap and compare accessibility scores</p>
        </div>
        <div className="map-controls glass-card">
          <button className={`map-ctrl-btn ${showHeatmap ? "active" : ""}`} onClick={() => setShowHeatmap(!showHeatmap)}>
            🌡️ Score overlay
          </button>
          <button className={`map-ctrl-btn ${showRoute ? "active" : ""}`} onClick={() => setShowRoute(!showRoute)}>
            🛣️ Nearby line
          </button>
          <button className="map-ctrl-btn" onClick={resetMap}>
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="map-layout">
        <div className="map-canvas glass-card">
          <div className="map-canvas-header">
            <span className="map-canvas-title">📍 Rest Spaces</span>
            <div className="map-legend-inline">
              {scoreGroups.map((group) => (
                <span key={group.label}>
                  <span className="legend-dot-sm" style={{ background: scoreColor(group.minimum) }}></span>
                  {group.label}
                </span>
              ))}
            </div>
          </div>

          <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom className="map-area">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapViewport spaces={spaces} selectedSpace={space} resetVersion={resetVersion} />

            {showHeatmap && spaces.map((mappedSpace) => (
              <Circle
                key={`score-${mappedSpace.id}`}
                center={[mappedSpace.lat, mappedSpace.lng]}
                radius={350}
                pathOptions={{
                  color: scoreColor(mappedSpace.accessibilityScore),
                  fillColor: scoreColor(mappedSpace.accessibilityScore),
                  fillOpacity: 0.14,
                  weight: 1,
                  interactive: false,
                }}
              />
            ))}

            {showRoute && route.length === 2 && (
              <Polyline
                positions={route.map((item) => [item.lat, item.lng])}
                pathOptions={{ color: "#2563eb", dashArray: "8 8", weight: 4 }}
              />
            )}

            {spaces.map((mappedSpace) => (
              <Marker
                key={mappedSpace.id}
                position={[mappedSpace.lat, mappedSpace.lng]}
                icon={markerIcon(mappedSpace.accessibilityScore, selectedPin === mappedSpace.id)}
                eventHandlers={{
                  click: () => setSelectedPin(mappedSpace.id),
                }}
              >
                <Popup>
                  <strong>{mappedSpace.name}</strong>
                  <br />
                  Accessibility: {mappedSpace.accessibilityScore}/100
                  <br />
                  {mappedSpace.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="map-side">
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
                  {space.features.map((feature) => (
                    <span key={feature} className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                      {feature === "bench" ? "🪑" : feature === "shade" ? "🌳" : feature === "drinkingWater" ? "💧" : "♿"} {feature}
                    </span>
                  ))}
                </div>
                <Link to={`/space/${space.id}`} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                  View Details →
                </Link>
              </div>
            </div>
          )}

          <div className="glass-card map-zones-list">
            <h4 className="chart-title">📊 Accessibility Scores</h4>
            {scoreGroups.map((group) => {
              const count = spaces.filter((item) => item.accessibilityScore >= group.minimum
                && (group.maximum === undefined || item.accessibilityScore <= group.maximum)).length;
              return (
                <div key={group.label} className="zone-list-item">
                  <div className="zone-list-dot" style={{ background: scoreColor(group.minimum) }}></div>
                  <span className="zone-list-label">{group.label}</span>
                  <span className="zone-list-score" style={{ color: scoreColor(group.minimum) }}>{count}</span>
                </div>
              );
            })}
            <p className="map-overlay-note">
              The score overlay circles show approximate coverage around each mapped space, not real-time crowd density.
            </p>
          </div>

          {showRoute && route.length === 2 && (
            <div className="glass-card map-zone-info">
              <h4>🛣️ Nearby spaces</h4>
              <p className="zone-name">{route[0].name} → {route[1].name}</p>
              <p className="zone-desc">Straight-line distance: {distanceBetween(route[0], route[1]).toFixed(1)} km. This is not turn-by-turn navigation.</p>
            </div>
          )}

          <div className="glass-card map-nearby-list">
            <h4 className="chart-title">📍 All Mapped Spaces</h4>
            {spaces.map((mappedSpace) => (
              <button
                type="button"
                key={mappedSpace.id}
                className={`map-space-item ${selectedPin === mappedSpace.id ? "active" : ""}`}
                onClick={() => setSelectedPin(mappedSpace.id)}
              >
                <span className="map-space-dot" style={{ background: scoreColor(mappedSpace.accessibilityScore) }}></span>
                <span className="map-space-name">{mappedSpace.name}</span>
                <span className="map-space-score" style={{ color: scoreColor(mappedSpace.accessibilityScore) }}>{mappedSpace.accessibilityScore}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
