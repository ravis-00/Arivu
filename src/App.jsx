import { Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Quiz from "./pages/Quiz.jsx";
import Result from "./pages/Result.jsx";
import Certificate from "./pages/Certificate.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Fixed / sticky topbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#f8f4e6", // light cream shade
          borderBottom: "1px solid #e5e7eb",
          padding: "8px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo + app name + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/Arivu-logo.png"          // <-- uses logo from public/Arivu-logo.png
            alt="Arivu Logo"
            style={{ height: 32 }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: "20px" }}>ಅರಿವು</div>
            <div style={{ fontSize: "12px", color: "#100dc5ff" }}>
              Process Awareness &amp; Certification
            </div>
          </div>
        </div>

        {/* Navigation – only main entry + dashboard */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "14px",
          }}
        >
          {/* Staff entry point */}
          <Link to="/">Home</Link>

          {/* Generic dashboard – visible to everyone for Phase 1 */}
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      {/* Page content */}
      <main style={{ padding: "24px 16px" }}>
        <Routes>
          {/* Staff journey (no links in topbar, navigated via buttons) */}
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
