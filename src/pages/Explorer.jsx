import { useState, useEffect, useMemo } from "react";
import SpaceCard from "../components/SpaceCard";
import FilterPanel from "../components/FilterPanel";
import SkeletonCard from "../components/SkeletonCard";
import { useApp } from "../context/AppContext";
import { restSpaces } from "../data/restSpaces";
import "./Explorer.css";

export default function Explorer() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({ features: [], crowd: "all", minScore: 0 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (val) => {
    setSearch(val);
    if (val.trim()) dispatch({ type: "ADD_SEARCH_HISTORY", payload: val.trim() });
  };

  const filtered = useMemo(() => {
    return restSpaces.filter((s) => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase());
      const matchFeatures = filters.features.length === 0 || filters.features.every((f) => s.features.includes(f));
      const matchCrowd = filters.crowd === "all" || s.crowdLevel === filters.crowd;
      const matchScore = s.accessibilityScore >= filters.minScore;
      return matchSearch && matchFeatures && matchCrowd && matchScore;
    });
  }, [search, filters]);

  return (
    <div className="page-wrapper explorer-page">
      <div className="explorer-header">
        <div>
          <h1 className="section-title">Rest Space Explorer</h1>
          <p className="section-subtitle">Discover {restSpaces.length} accessible urban rest spaces</p>
        </div>
        <div className="explorer-controls">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search spaces, locations..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch("")}>×</button>}
          </div>
          <button className={`btn btn-secondary filter-toggle ${showFilters ? "active" : ""}`} onClick={() => setShowFilters(!showFilters)}>
            🔧 Filters {filters.features.length + (filters.crowd !== "all" ? 1 : 0) + (filters.minScore > 0 ? 1 : 0) > 0 && (
              <span className="filter-count">{filters.features.length + (filters.crowd !== "all" ? 1 : 0) + (filters.minScore > 0 ? 1 : 0)}</span>
            )}
          </button>
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>⊞</button>
            <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>☰</button>
          </div>
        </div>
      </div>

      {/* Search history */}
      {state.searchHistory.length > 0 && !search && (
        <div className="search-history">
          <span className="search-history-label">Recent:</span>
          {state.searchHistory.slice(0, 5).map((h, i) => (
            <button key={i} className="history-chip" onClick={() => setSearch(h)}>{h}</button>
          ))}
        </div>
      )}

      <div className="explorer-layout">
        {showFilters && (
          <aside className="explorer-sidebar animate-fadeIn">
            <FilterPanel filters={filters} onChange={setFilters} />
          </aside>
        )}

        <div className="explorer-results">
          <div className="results-meta">
            <span className="results-count">{filtered.length} spaces found</span>
            {(filters.features.length > 0 || filters.crowd !== "all" || filters.minScore > 0) && (
              <button className="btn btn-ghost clear-filters" onClick={() => setFilters({ features: [], crowd: "all", minScore: 0 })}>
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className={`spaces-${viewMode}`}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🔍</span>
              <h3>No spaces found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={`spaces-${viewMode}`}>
              {filtered.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
