// src/pages/Certificate.jsx
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function formatDate(value) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Certificate() {
  const locationHook = useLocation();
  const [result, setResult] = useState(null);

  useEffect(() => {
    // 1) Try to get result from navigation state (if we navigated with state)
    let res = locationHook.state || null;

    // 2) Fallback to sessionStorage where Result/Login save it
    if (!res) {
      try {
        const stored = sessionStorage.getItem("arivuLastResult");
        if (stored) {
          res = JSON.parse(stored);
        }
      } catch (e) {
        console.warn("Unable to read result from sessionStorage", e);
      }
    }

    setResult(res || null);
  }, [locationHook.state]);

  const handlePrint = () => {
    window.print();
  };

  if (!result) {
    return (
      <div className="certificate-page">
        <div className="certificate-wrapper fade-in-up">
          <p style={{ fontSize: "14px", color: "#4b5563" }}>
            No certificate data available. Please complete the quiz and view your
            result before downloading the certificate.
          </p>
        </div>
      </div>
    );
  }

  // Match the actual shape we store in arivuLastResult
  const {
    employeeName,
    employeeId,
    prakalpaName,
    location,
    score,
    totalQuestions,
    percentage,
    // optional: if later you add this field from backend / result page
    timestamp,
  } = result;

  const correctCount =
    typeof score === "number" ? score : Number(score || 0);
  const total =
    typeof totalQuestions === "number"
      ? totalQuestions
      : Number(totalQuestions || 0);

  // If we don't have a stored timestamp, just show today's date
  const passedDateText = formatDate(timestamp || new Date());

  const displayName = employeeName || "Employee Name";
  const displayId = employeeId || "Employee ID / Mobile";
  const displayPrakalpa = prakalpaName || "Prakalpa / Department";
  const displayLocation = location || "Unit / Location";

  return (
    <div className="certificate-page">
      <div className="certificate-wrapper fade-in-up">
        {/* Toolbar with Print button (hidden in print view) */}
        <div className="certificate-toolbar">
          <button
            type="button"
            className="btn-orange certificate-print-button"
            onClick={handlePrint}
          >
            Print / Download PDF
          </button>
        </div>

        {/* Main certificate frame */}
        <div className="certificate-frame">
          <div className="certificate-inner">
            {/* Logo + heading */}
            <div className="certificate-header">
              <img
                src="/rashtrotthana-logo.png"
                alt="Rashtrotthana Logo"
                className="certificate-logo"
              />
              <div className="certificate-heading-text">
                <div className="certificate-org-name">
                  Rashtrotthana Parishat
                </div>
                <div className="certificate-app-name">
                  Arivu – Process Awareness &amp; Certification
                </div>
              </div>
            </div>

            {/* Certificate title */}
            <h1 className="certificate-title">Certificate of Completion</h1>

            {/* Intro line */}
            <p className="certificate-line">This is to certify that</p>

            {/* Name */}
            <div className="certificate-name">{displayName}</div>

            {/* Additional details */}
            <p className="certificate-details">
              Employee ID / Mobile: <span>{displayId}</span>
              <br />
              Prakalpa / Department: <span>{displayPrakalpa}</span>
              <br />
              Unit / Location: <span>{displayLocation}</span>
            </p>

            {/* Body text */}
            <p className="certificate-body">
              has successfully completed the{" "}
              <strong>Arivu – Process Awareness Test</strong> conducted by
              Rashtrotthana Parishat, securing a score of{" "}
              <strong>
                {percentage}% ({correctCount} out of {total} questions correct)
              </strong>
              . This certificate is issued in recognition of the staff member&apos;s
              understanding of key organizational processes and
              responsibilities.
            </p>

            {/* Date & footer */}
            <div className="certificate-footer-row">
              <div className="certificate-footer-block">
                <div className="certificate-footer-label">Date of Test</div>
                <div className="certificate-footer-value">
                  {passedDateText}
                </div>
              </div>

              <div className="certificate-footer-block">
                <div className="certificate-footer-label">
                  Authorized Signatory
                </div>
                <div className="certificate-footer-line" />
                <div className="certificate-footer-role">
                  Head – Quality &amp; Systems
                </div>
              </div>
            </div>

            {/* Disclaimer at bottom */}
            <p className="certificate-disclaimer">
              This certificate is issued for internal process awareness and
              capacity-building within Rashtrotthana Parishat. It does not
              represent an external academic qualification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
