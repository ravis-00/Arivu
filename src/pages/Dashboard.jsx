// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetchDashboard();
        // Expecting res.summary or res.rows – fall back safely
        const data =
          res?.summary ||
          res?.rows ||
          res?.data ||
          [];

        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ---- Totals / Aggregates ----
  const totals = rows.reduce(
    (acc, row) => {
      const tested = Number(row.employeesTested ?? row.totalTested ?? 0);
      const passed = Number(row.passedEmployees ?? row.totalPassed ?? 0);
      const avgAtt = Number(row.averageAttempts ?? row.avgAttempts ?? 0);

      acc.tested += tested;
      acc.passed += passed;
      // for weighted average attempts
      acc.attemptsWeightedSum += tested * avgAtt;

      return acc;
    },
    { tested: 0, passed: 0, attemptsWeightedSum: 0 }
  );

  const totalPassPct =
    totals.tested > 0 ? (totals.passed / totals.tested) * 100 : 0;

  const totalAvgAttempts =
    totals.tested > 0 ? totals.attemptsWeightedSum / totals.tested : 0;

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <p>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card">
          <p style={{ color: "#b91c1c" }}>{error}</p>
          <button
            className="btn btn-secondary"
            style={{ marginTop: "12px" }}
            onClick={() => navigate("/login")}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ background: "#f3f4f6" }}>
      <div style={{ width: "100%" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "4px",
            fontSize: "20px",
          }}
        >
          Process Awareness &amp; Certification Results Dashboard
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#6b7280",
            marginBottom: "16px",
          }}
        >
          Summary by Prakalpa
        </p>

        <table
          className="dashboard-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th>Prakalpa</th>
              <th>School / Location</th>
              <th>Employees Tested</th>
              <th>Passed Employees</th>
              <th>Pass Percentage</th>
              <th>Average Attempts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const prakalpaName =
                row.prakalpaName || row.prakalpa || row.name || "-";

              // FIX 1: show school / location from any available field
              const schoolLocation =
                row.schoolLocation ||
                row.location ||
                row.school ||
                row.school_location ||
                "-";

              const tested = Number(row.employeesTested ?? row.totalTested ?? 0);
              const passed = Number(row.passedEmployees ?? row.totalPassed ?? 0);

              // FIX 2: format with 1 decimal
              const passPctRaw =
                row.passPercentage ?? row.passPercent ?? row.passPct ?? 0;
              const passPct =
                tested > 0
                  ? Number(passPctRaw).toFixed(1)
                  : "0.0";

              const avgAttRaw =
                row.averageAttempts ?? row.avgAttempts ?? row.avgAtt ?? 0;
              const avgAtt = Number(avgAttRaw).toFixed(1);

              return (
                <tr key={idx}>
                  <td>{prakalpaName}</td>
                  <td>{schoolLocation}</td>
                  <td>{tested}</td>
                  <td>{passed}</td>
                  <td>{passPct}</td>
                  <td>{avgAtt}</td>
                </tr>
              );
            })}
          </tbody>

          {/* FIX 3: totals row */}
          <tfoot>
            <tr style={{ background: "#fef3c7", fontWeight: 600 }}>
              <td colSpan={2}>Total</td>
              <td>{totals.tested}</td>
              <td>{totals.passed}</td>
              <td>{totalPassPct.toFixed(1)}</td>
              <td>{totalAvgAttempts.toFixed(1)}</td>
            </tr>
          </tfoot>
        </table>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/login")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
