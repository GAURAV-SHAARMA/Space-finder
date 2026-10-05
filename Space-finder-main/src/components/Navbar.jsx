import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Navbar.css";

const navLinks = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/explorer", label: "Explorer", icon: "🔍" },
  { path: "/ai", label: "AI Recs", icon: "🤖" },
  { path: "/map", label: "Map", icon: "🗺️" },
  { path: "/analytics", label: "Analytics", icon: "📈" },
  { path: "/community", label: "Community", icon: "💬" },
];

export default function Navbar() {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar glass-card">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏙️</span>
          <span className="brand-text">PRSF</span>
          <span className="brand-tag">AI</span>
        </Link>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={() => dispatch({ type: "TOGGLE_THEME" })}
            aria-label="Toggle theme"
            title={state.theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {state.theme === "light" ? "🌙" : "☀️"}
          </button>
          <div className="user-avatar">{state.user.avatar}</div>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`ham-line ${menuOpen ? "open" : ""}`}></span>
            <span className={`ham-line ${menuOpen ? "open" : ""}`}></span>
            <span className={`ham-line ${menuOpen ? "open" : ""}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
