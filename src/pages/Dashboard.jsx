// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("overall");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await fetchDashboard();

        if (data.status !== "ok") {
          setError("Unable to load dashboard data.");
          return;
        }

        setSummary(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const rows = summary?.rows || [];

  const rvkRows = useMemo(() => {
    return rows.filter((r) =>
      String(r.prakalpa || "").toUpperCase().includes("RVK")
    );
  }, [rows]);

  const stateRows = useMemo(() => {
    return rows.filter((r) =>
      String(r.prakalpa || "").toUpperCase().includes("STATE BOARD")
    );
  }, [rows]);

  const otherRows = useMemo(() => {
    return rows.filter((r) => {
      const prakalpa = String(r.prakalpa || "").toUpperCase();
      return !prakalpa.includes("RVK") && !prakalpa.includes("STATE BOARD");
    });
  }, [rows]);

  function calculateTotals(dataRows) {
    const employees = dataRows.reduce(
      (sum, r) => sum + Number(r.employeesTested || 0),
      0
    );

    const passed = dataRows.reduce(
      (sum, r) => sum + Number(r.passedEmployees || 0),
      0
    );

    const weightedAttempts = dataRows.reduce(
      (sum, r) =>
        sum + Number(r.averageAttempts || 0) * Number(r.employeesTested || 0),
      0
    );

    return {
      employees,
      passed,
      passPercentage: employees ? (passed / employees) * 100 : 0,
      avgAttempts: employees ? weightedAttempts / employees : 0,
    };
  }

  const overallRows = useMemo(() => {
    const rvkTotal = calculateTotals(rvkRows);
    const stateTotal = calculateTotals(stateRows);
    const otherTotal = calculateTotals(otherRows);

    const result = [];

    if (rvkTotal.employees > 0) {
      result.push({
        group: "RVK CBSE Schools",
        units: rvkRows.length,
        employeesTested: rvkTotal.employees,
        passedEmployees: rvkTotal.passed,
        passPercentage: rvkTotal.passPercentage,
        averageAttempts: rvkTotal.avgAttempts,
      });
    }

    if (stateTotal.employees > 0) {
      result.push({
        group: "RV State Board Schools",
        units: stateRows.length,
        employeesTested: stateTotal.employees,
        passedEmployees: stateTotal.passed,
        passPercentage: stateTotal.passPercentage,
        averageAttempts: stateTotal.avgAttempts,
      });
    }

    if (otherTotal.employees > 0) {
      result.push({
        group: "Other Prakalpas",
        units: otherRows.length,
        employeesTested: otherTotal.employees,
        passedEmployees: otherTotal.passed,
        passPercentage: otherTotal.passPercentage,
        averageAttempts: otherTotal.avgAttempts,
      });
    }

    return result;
  }, [rvkRows, stateRows, otherRows]);

  const activeRows =
    view === "rvk"
      ? rvkRows
      : view === "state"
      ? stateRows
      : view === "others"
      ? otherRows
      : rows;

  const activeTotals =
    view === "overall"
      ? calculateTotals(rows)
      : view === "rvk"
      ? calculateTotals(rvkRows)
      : view === "state"
      ? calculateTotals(stateRows)
      : calculateTotals(otherRows);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1150px",
        margin: "0 auto",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "6px" }}>
        Process Awareness & Certification Results Dashboard
      </h2>

      <p style={{ color: "#6b7280", marginBottom: "20px" }}>
        Summary by group - RVK schools, State Board schools and other
        prakalpas
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setView("overall")}
          style={tabButtonStyle(view === "overall")}
        >
          Overall
        </button>

        <button
          onClick={() => setView("rvk")}
          style={tabButtonStyle(view === "rvk")}
        >
          RVK CBSE Schools
        </button>

        <button
          onClick={() => setView("state")}
          style={tabButtonStyle(view === "state")}
        >
          RV State Board Schools
        </button>

        <button
          onClick={() => setView("others")}
          style={tabButtonStyle(view === "others")}
        >
          Other Prakalpas
        </button>
      </div>

      {view === "overall" ? (
        <OverallTable rows={overallRows} />
      ) : (
        <DetailedTable rows={activeRows} view={view} />
      )}

      <TotalRow view={view} totals={activeTotals} />

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "24px",
          padding: "10px 28px",
          borderRadius: "20px",
          border: "none",
          background: "#e5e7eb",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  );
}

function OverallTable({ rows }) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...thStyle, width: "22%" }}>Group</th>
          <th style={{ ...thNumberStyle, width: "14%" }}>Units / Schools</th>
          <th style={{ ...thNumberStyle, width: "16%" }}>Employees Tested</th>
          <th style={{ ...thNumberStyle, width: "16%" }}>Passed Employees</th>
          <th style={{ ...thNumberStyle, width: "16%" }}>Pass Percentage</th>
          <th style={{ ...thNumberStyle, width: "16%" }}>Average Attempts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, index) => (
          <tr key={index}>
            <td style={tdStyle}>{r.group}</td>
            <td style={tdNumberStyle}>{r.units}</td>
            <td style={tdNumberStyle}>{r.employeesTested}</td>
            <td style={tdNumberStyle}>{r.passedEmployees}</td>
            <td style={tdNumberStyle}>
              {Number(r.passPercentage || 0).toFixed(1)}
            </td>
            <td style={tdNumberStyle}>
              {Number(r.averageAttempts || 0).toFixed(1)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DetailedTable({ rows, view }) {
  const isRVK = view === "rvk";
  const isState = view === "state";

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {!isRVK && !isState && (
            <th style={{ ...thStyle, width: "24%" }}>Prakalpa</th>
          )}

          <th
            style={{
              ...thStyle,
              width: isRVK || isState ? "28%" : "24%",
            }}
          >
            {isRVK
              ? "RVK School"
              : isState
              ? "State Board School"
              : "School / Location"}
          </th>

          <th style={{ ...thNumberStyle, width: isRVK || isState ? "18%" : "13%" }}>
            Employees Tested
          </th>
          <th style={{ ...thNumberStyle, width: isRVK || isState ? "18%" : "13%" }}>
            Passed Employees
          </th>
          <th style={{ ...thNumberStyle, width: isRVK || isState ? "18%" : "13%" }}>
            Pass Percentage
          </th>
          <th style={{ ...thNumberStyle, width: isRVK || isState ? "18%" : "13%" }}>
            Average Attempts
          </th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r, index) => (
          <tr key={index}>
            {!isRVK && !isState && <td style={tdStyle}>{r.prakalpa}</td>}

            <td style={tdStyle}>{r.location}</td>
            <td style={tdNumberStyle}>{r.employeesTested}</td>
            <td style={tdNumberStyle}>{r.passedEmployees}</td>
            <td style={tdNumberStyle}>
              {Number(r.passPercentage || 0).toFixed(1)}
            </td>
            <td style={tdNumberStyle}>
              {Number(r.averageAttempts || 0).toFixed(1)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TotalRow({ view, totals }) {
  if (view === "overall") {
    return (
      <table style={totalTableStyle}>
        <tbody>
          <tr>
            <td style={{ ...totalCellStyle, width: "22%" }}>Total</td>
            <td style={{ ...totalNumberCellStyle, width: "14%" }}>-</td>
            <td style={{ ...totalNumberCellStyle, width: "16%" }}>
              {totals.employees}
            </td>
            <td style={{ ...totalNumberCellStyle, width: "16%" }}>
              {totals.passed}
            </td>
            <td style={{ ...totalNumberCellStyle, width: "16%" }}>
              {totals.passPercentage.toFixed(1)}
            </td>
            <td style={{ ...totalNumberCellStyle, width: "16%" }}>
              {totals.avgAttempts.toFixed(1)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (view === "rvk" || view === "state") {
    return (
      <table style={totalTableStyle}>
        <tbody>
          <tr>
            <td style={{ ...totalCellStyle, width: "28%" }}>Total</td>
            <td style={{ ...totalNumberCellStyle, width: "18%" }}>
              {totals.employees}
            </td>
            <td style={{ ...totalNumberCellStyle, width: "18%" }}>
              {totals.passed}
            </td>
            <td style={{ ...totalNumberCellStyle, width: "18%" }}>
              {totals.passPercentage.toFixed(1)}
            </td>
            <td style={{ ...totalNumberCellStyle, width: "18%" }}>
              {totals.avgAttempts.toFixed(1)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table style={totalTableStyle}>
      <tbody>
        <tr>
          <td style={{ ...totalCellStyle, width: "24%" }}>Total</td>
          <td style={{ ...totalCellStyle, width: "24%" }}></td>
          <td style={{ ...totalNumberCellStyle, width: "13%" }}>
            {totals.employees}
          </td>
          <td style={{ ...totalNumberCellStyle, width: "13%" }}>
            {totals.passed}
          </td>
          <td style={{ ...totalNumberCellStyle, width: "13%" }}>
            {totals.passPercentage.toFixed(1)}
          </td>
          <td style={{ ...totalNumberCellStyle, width: "13%" }}>
            {totals.avgAttempts.toFixed(1)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function tabButtonStyle(active) {
  return {
    padding: "10px 18px",
    borderRadius: "20px",
    border: active ? "none" : "1px solid #d1d5db",
    background: active ? "#f45105" : "#ffffff",
    color: active ? "#ffffff" : "#111827",
    fontWeight: "600",
    cursor: "pointer",
  };
}

const tableStyle = {
  width: "100%",
  tableLayout: "fixed",
  borderCollapse: "collapse",
  background: "#ffffff",
};

const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f9fafb",
  textAlign: "left",
  fontWeight: "700",
};

const thNumberStyle = {
  ...thStyle,
  textAlign: "center",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left",
  wordBreak: "break-word",
};

const tdNumberStyle = {
  ...tdStyle,
  textAlign: "center",
};

const totalTableStyle = {
  width: "100%",
  tableLayout: "fixed",
  borderCollapse: "collapse",
  background: "#fff7cc",
  fontWeight: "700",
};

const totalCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #facc15",
  textAlign: "left",
};

const totalNumberCellStyle = {
  ...totalCellStyle,
  textAlign: "center",
};

export default Dashboard;