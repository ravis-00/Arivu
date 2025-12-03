// src/pages/Login.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPrakalpas, fetchQuestions } from "../api";

function Login() {
  const navigate = useNavigate();

  const [prakalpas, setPrakalpas] = useState([]);
  const [selectedPrakalpa, setSelectedPrakalpa] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- Load Prakalpa + Location list ----------------
  useEffect(() => {
    async function load() {
      try {
        setError("");
        const res = await fetchPrakalpas();
        console.log("Prakalpas from API:", res);

        if (res.status === "ok" && Array.isArray(res.prakalpas)) {
          setPrakalpas(res.prakalpas);
        } else {
          setError("Unable to load Prakalpa list.");
        }
      } catch (err) {
        console.error("Error loading prakalpas:", err);
        setError("Error while loading Prakalpa list.");
      }
    }
    load();
  }, []);

  // Unique prakalpas for first dropdown
  const prakalpaOptions = Array.from(
    new Map(prakalpas.map((p) => [p.prakalpaKey, p])).values()
  );

  // --- Locations for selected prakalpa, split on comma into separate options ---
  let locationOptions = [];
  if (selectedPrakalpa) {
    const p = prakalpas.find((p) => p.prakalpaKey === selectedPrakalpa);
    if (p && p.schoolLocation) {
      locationOptions = p.schoolLocation
        .split(",")
        .map((loc) => loc.trim())
        .filter(Boolean); // removes empty strings
    }
  }

  // ---------------- Handlers ----------------

  async function handleStartTest(e) {
    e.preventDefault();
    setError("");

    if (!selectedPrakalpa) return setError("Please select a Prakalpa.");
    if (!selectedLocation) return setError("Please select School / Location.");
    if (!employeeName.trim()) return setError("Please enter your name.");
    if (!employeeId.trim())
      return setError("Please enter Employee ID / Mobile Number.");
    if (!consentGiven)
      return setError("Please provide your consent to continue.");

    setLoading(true);

    try {
      // The full prakalpa object selected by the user
      const prakalpa = prakalpaOptions.find(
        (p) => p.prakalpaKey === selectedPrakalpa
      );

      const res = await fetchQuestions(
        selectedPrakalpa,
        employeeId.trim(),
        selectedLocation
      );

      // Already passed case
      if (res.status === "alreadyPassed") {
        const result = res.result;
        sessionStorage.setItem(
          "arivuLastResult",
          JSON.stringify({
            ...result,
            prakalpaCode: selectedPrakalpa,
            prakalpaName: prakalpa?.prakalpaName || "",
            location: selectedLocation,
            employeeName,
            employeeId,
            fromBackend: true,
          })
        );
        navigate("/result");
        return;
      }

      // New quiz
      if (res.status === "ok" && Array.isArray(res.questions)) {
        // Get duration from Prakalpa sheet; fallback only if missing/invalid
        const mins = Number(prakalpa?.durationMinutes);
        const durationMinutes =
          Number.isFinite(mins) && mins > 0 ? mins : 30;

        const quizContext = {
          prakalpaCode: selectedPrakalpa,
          prakalpaName: prakalpa?.prakalpaName || "",
          location: selectedLocation,
          employeeName,
          employeeId,
          // 👇 used by Quiz page for the timer
          durationMinutes,
        };

        sessionStorage.setItem("arivuSession", JSON.stringify(quizContext));
        sessionStorage.setItem(
          "arivuQuestions",
          JSON.stringify(res.questions)
        );

        navigate("/quiz");
      } else {
        console.log("fetchQuestions response:", res);
        setError("Unable to load questions. Please try again.");
      }
    } catch (err) {
      console.error("Error starting test:", err);
      setError("Error while starting the test.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenDashboard() {
    navigate("/dashboard");
  }

  // ---------------- UI ----------------

  return (
    <div className="page-container">
      <div className="card login-card">
        <h2>Login</h2>
        <p>Please enter your details to start the Process Awareness Test.</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleStartTest}>
          {/* Prakalpa */}
          <div className="form-group">
            <label>Prakalpa</label>
            <select
              value={selectedPrakalpa}
              onChange={(e) => {
                setSelectedPrakalpa(e.target.value);
                setSelectedLocation("");
              }}
            >
              <option value="">Select Prakalpa</option>
              {prakalpaOptions.map((p) => (
                <option key={p.prakalpaKey} value={p.prakalpaKey}>
                  {p.prakalpaName}
                </option>
              ))}
            </select>
          </div>

          {/* School / Location */}
          <div className="form-group">
            <label>School / Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              disabled={!selectedPrakalpa}
            >
              <option value="">Select School / Location</option>
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </div>

          {/* Employee ID / Mobile */}
          <div className="form-group">
            <label>Employee ID / Mobile Number</label>
            <input
              type="text"
              placeholder="Enter Employee ID or Mobile Number"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          {/* Consent checkbox */}
          <div
            style={{
              marginTop: "6px",
              marginBottom: "6px",
              textAlign: "left",
              paddingLeft: "4px", // small indent to visually line up with inputs
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "6px",
                fontSize: "12px",
                color: "#4b5563",
                lineHeight: 1.4,
                cursor: "pointer",
                maxWidth: "100%",
              }}
            >
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                style={{ marginTop: "2px" }}
              />
              <span>
                I confirm that I am a staff member and consent to the use of my
                details for verification and certificate generation.
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="button-row">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Starting..." : "Start Test"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleOpenDashboard}
            >
              Dashboard
            </button>
          </div>

          {/* Short privacy note under buttons */}
          <p
            style={{
              marginTop: "16px",
              fontSize: "12px",
              color: "#6b7280",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Your information is stored securely and is not shared with external
            organizations outside Rashtrotthana Parishat.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
