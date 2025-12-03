// src/App.jsx
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Quiz from "./pages/Quiz.jsx";
import Result from "./pages/Result.jsx";
import Certificate from "./pages/Certificate.jsx";
import Dashboard from "./pages/Dashboard.jsx";

/** Top bar shown on all pages */
function Topbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const goHome = () => {
    setMenuOpen(false);
    navigate("/");
  };

  const goDashboard = () => {
    setMenuOpen(false);
    navigate("/dashboard");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: 64,
        backgroundColor: "#2c3b5cff", // dark grey
        color: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* LEFT: hamburger menu */}
      <div
        style={{
          width: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
          style={{
            height: 36,
            width: 36,
            borderRadius: "9999px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column", // <--- make children stacked vertically
            alignItems: "center",
            justifyContent: "center",
            gap: 4, // spacing between bars
            color: "#f9fafb",
          }}
        >
          <span
            style={{
              display: "block",
              width: 22,
              height: 3,
              backgroundColor: "currentColor",
              borderRadius: 9999,
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 3,
              backgroundColor: "currentColor",
              borderRadius: 9999,
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 3,
              backgroundColor: "currentColor",
              borderRadius: 9999,
            }}
          />
        </button>

        {/* Dropdown menu for Home / Dashboard */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              backgroundColor: "#111827",
              borderRadius: 8,
              boxShadow: "0 8px 16px rgba(0,0,0,0.35)",
              padding: "4px 0",
              minWidth: 140,
            }}
          >
            <button
              type="button"
              onClick={goHome}
              style={{
                width: "100%",
                padding: "8px 16px",
                background: "transparent",
                border: "none",
                color: "#f9fafb",
                textAlign: "left",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Home
            </button>
            <button
              type="button"
              onClick={goDashboard}
              style={{
                width: "100%",
                padding: "8px 16px",
                background: "transparent",
                border: "none",
                color: "#f9fafb",
                textAlign: "left",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Dashboard
            </button>
          </div>
        )}
      </div>

      {/* CENTER: logo + Kannada text + tagline */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="/Arivu-logo.png" // logo from public folder
            alt="Arivu Logo"
            style={{ height: 32 }}
          />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>ಅರಿವು</div>
            <div style={{ fontSize: 11, color: "#d1d5db" }}>
              Process Awareness &amp; Certification
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: home icon button */}
      <div
        style={{
          width: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={goHome}
          aria-label="Home"
          style={{
            height: 36,
            width: 36,
            borderRadius: "9999px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f9fafb",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{ width: 18, height: 18 }}
            aria-hidden="true"
          >
            <path
              d="M4 11L12 4l8 7v9a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5h-4v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

function App() {
  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Dark grey topbar on all pages */}
      <Topbar />

      {/* Page content */}
      <main style={{ padding: "24px 16px", flex: 1 }}>
        <Routes>
          {/* Staff journey */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
          <Route path="/certificate" element={<Certificate />} />

          {/* Summary dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
