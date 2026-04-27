import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { restSpaces } from "../data/restSpaces";
import "./Community.css";

const categoryOptions = ["Bench Condition", "Wheelchair Access", "Shade Quality", "Water Availability", "Lighting", "Cleanliness", "Safety", "Other"];

export default function Community() {
  const { state, dispatch, addToast } = useApp();
  const fileRef = useRef();
  const [form, setForm] = useState({ spaceId: "", category: "", description: "", imagePreview: null });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  const allReports = [...state.reports].reverse();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return addToast("Image must be under 5MB", "warning");
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.spaceId || !form.category || !form.description.trim()) {
      return addToast("Please fill all required fields", "warning");
    }
    setSubmitting(true);
    setTimeout(() => {
      const space = restSpaces.find((s) => s.id === Number(form.spaceId));
      dispatch({
        type: "ADD_REPORT",
        payload: {
          spaceId: Number(form.spaceId),
          spaceName: space?.name || "Unknown Space",
          category: form.category,
          description: form.description,
          imagePreview: form.imagePreview,
          user: state.user.name,
          avatar: state.user.avatar,
          date: new Date().toISOString().split("T")[0],
          helpful: 0,
          notHelpful: 0,
        },
      });
      setForm({ spaceId: "", category: "", description: "", imagePreview: null });
      if (fileRef.current) fileRef.current.value = "";
      setSubmitting(false);
      setActiveTab("feed");
      addToast("Report submitted! Thank you for contributing.", "success");
    }, 800);
  };

  const handleVote = (id, vote) => {
    dispatch({ type: "VOTE_REPORT", payload: { id, vote } });
    addToast(vote > 0 ? "Marked as helpful!" : "Feedback noted", "info");
  };

  return (
    <div className="page-wrapper community-page">
      <div className="community-header">
        <div>
          <h1 className="section-title">💬 Community Feedback</h1>
          <p className="section-subtitle">Crowdsource accessibility reports and help improve urban rest spaces</p>
        </div>
        <div className="community-stats glass-card">
          <div className="comm-stat"><span>{allReports.length}</span><p>Reports</p></div>
          <div className="comm-stat"><span>{allReports.reduce((a, r) => a + (r.helpful || 0), 0)}</span><p>Helpful Votes</p></div>
          <div className="comm-stat"><span>{new Set(allReports.map((r) => r.spaceId)).size}</span><p>Spaces Covered</p></div>
        </div>
      </div>

      <div className="community-tabs">
        <button className={`tab-btn ${activeTab === "feed" ? "active" : ""}`} onClick={() => setActiveTab("feed")}>
          📋 Reports Feed ({allReports.length})
        </button>
        <button className={`tab-btn ${activeTab === "submit" ? "active" : ""}`} onClick={() => setActiveTab("submit")}>
          ➕ Submit Report
        </button>
      </div>

      {activeTab === "feed" && (
        <div className="community-feed animate-fadeIn">
          {allReports.length === 0 ? (
            <div className="empty-state glass-card">
              <span className="empty-state-icon">📋</span>
              <h3>No reports yet</h3>
              <p>Be the first to submit an accessibility report</p>
              <button className="btn btn-primary" onClick={() => setActiveTab("submit")} style={{ marginTop: 12 }}>
                ➕ Submit First Report
              </button>
            </div>
          ) : (
            <div className="reports-grid">
              {allReports.map((report) => (
                <div key={report.id} className="report-card glass-card animate-scaleIn">
                  {report.imagePreview && (
                    <img src={report.imagePreview} alt="Report" className="report-img" />
                  )}
                  <div className="report-body">
                    <div className="report-header">
                      <div className="report-avatar">{report.avatar}</div>
                      <div className="report-meta">
                        <strong>{report.user}</strong>
                        <span>{report.date}</span>
                      </div>
                      <span className="badge badge-accent">{report.category}</span>
                    </div>
                    <p className="report-space">📍 {report.spaceName}</p>
                    <p className="report-desc">{report.description}</p>
                    <div className="report-actions">
                      <button className="vote-btn helpful" onClick={() => handleVote(report.id, 1)}>
                        👍 Helpful ({report.helpful || 0})
                      </button>
                      <button className="vote-btn not-helpful" onClick={() => handleVote(report.id, -1)}>
                        👎 Not Helpful ({report.notHelpful || 0})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "submit" && (
        <div className="community-submit animate-fadeIn">
          <div className="submit-layout">
            <div className="glass-card submit-form-wrap">
              <h3 className="submit-title">📝 Submit Accessibility Report</h3>
              <p className="submit-sub">Help the community by reporting accessibility issues or improvements</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Rest Space *</label>
                  <select
                    className="form-input"
                    value={form.spaceId}
                    onChange={(e) => setForm({ ...form, spaceId: e.target.value })}
                    required
                  >
                    <option value="">Select a rest space...</option>
                    {restSpaces.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <div className="category-chips">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`filter-chip ${form.category === cat ? "active" : ""}`}
                        onClick={() => setForm({ ...form, category: cat })}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Describe the accessibility issue or improvement in detail..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload Image (optional)</label>
                  <div
                    className="image-upload-zone"
                    onClick={() => fileRef.current?.click()}
                  >
                    {form.imagePreview ? (
                      <div className="image-preview-wrap">
                        <img src={form.imagePreview} alt="Preview" className="image-preview" />
                        <button
                          type="button"
                          className="image-remove"
                          onClick={(e) => { e.stopPropagation(); setForm({ ...form, imagePreview: null }); if (fileRef.current) fileRef.current.value = ""; }}
                        >×</button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">📷</span>
                        <p>Click to upload image</p>
                        <span>PNG, JPG up to 5MB</span>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                </div>

                <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
                  {submitting ? "🔄 Submitting..." : "📤 Submit Report"}
                </button>
              </form>
            </div>

            {/* Guidelines */}
            <div className="glass-card submit-guidelines">
              <h4>📌 Reporting Guidelines</h4>
              <ul className="guidelines-list">
                <li>🎯 Be specific about the location and issue</li>
                <li>📷 Include photos when possible for better context</li>
                <li>♿ Focus on accessibility barriers or improvements</li>
                <li>✅ Verify information before submitting</li>
                <li>🤝 Be respectful and constructive</li>
                <li>🔄 Update reports if conditions change</li>
              </ul>
              <div className="guidelines-categories">
                <h5>Report Categories</h5>
                {categoryOptions.map((cat, i) => (
                  <span key={i} className="badge badge-primary" style={{ margin: "3px" }}>{cat}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
