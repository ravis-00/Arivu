// src/pages/Certificate.jsx
import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import { useEffect, useMemo, useState } from "react";

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

function getProgrammeTitle(prakalpaName) {
  const name = String(prakalpaName || "").toUpperCase();

  if (name.includes("RVK")) {
    return "RVK CBSE Process Awareness & Certification";
  }

  if (name.includes("STATE BOARD")) {
    return "RV State Board Process Awareness & Certification";
  }

  if (name.includes("BLOOD")) {
    return "Blood Centre Process Awareness & Certification";
  }

  if (name.includes("SEVA")) {
    return "Seva Process Awareness & Certification";
  }

  if (name.includes("YOGA") || name.includes("RYSRI")) {
    return "Yoga Process Awareness & Certification";
  }

  return "Arivu – Process Awareness & Certification";
}

function getAssessmentTitle(programmeTitle) {
  return String(programmeTitle || "Arivu – Process Awareness & Certification")
    .replace("Process Awareness & Certification", "Process Awareness Assessment");
}

function createReadableCertificateId(result) {
  if (!result) return "—";

  const existing = String(result.certificateNumber || "").trim();

  if (existing && !/^\s*ARIVU-[A-Z]+-\d{12,}\s*$/i.test(existing)) {
    return existing;
  }

  const prakalpaCode = String(result.prakalpaCode || "GEN").toUpperCase();
  const employeeId = String(result.employeeId || "EMP")
    .replace(/\s+/g, "")
    .slice(-6);

  const rawDate = result.timestamp ? new Date(result.timestamp) : new Date();
  const year = isNaN(rawDate.getTime())
    ? new Date().getFullYear()
    : rawDate.getFullYear();

  return `ARV-${prakalpaCode}-${year}-${employeeId}`;
}

function Certificate() {
  const locationHook = useLocation();
  const [result, setResult] = useState(null);

  useEffect(() => {
    let res = locationHook.state || null;

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

  const certificateId = useMemo(() => {
    return createReadableCertificateId(result);
  }, [result]);

  if (!result) {
    return (
      <div className="certificate-page">
        <div className="certificate-wrapper fade-in-up">
          <p style={{ fontSize: "14px", color: "#4b5563" }}>
            No certificate data available. Please complete the quiz and view
            your result before downloading the certificate.
          </p>
        </div>
      </div>
    );
  }

  const { employeeName, employeeId, prakalpaName, location, timestamp } =
    result;

  const passedDateText = timestamp
    ? formatDate(timestamp)
    : formatDate(new Date());

  const displayName = employeeName || "Employee Name";
  const displayId = employeeId || "Employee ID";
  const displayPrakalpa = prakalpaName || "Prakalpa";
  const displayLocation = location || "Unit / Location";

  const programmeTitle = getProgrammeTitle(displayPrakalpa);
  const assessmentTitle = getAssessmentTitle(programmeTitle);
  const verificationId = result?.certificateNumber || certificateId;

const verificationUrl = `https://arivu-process-awareness.netlify.app/verify?id=${encodeURIComponent(
  verificationId
)}`;
  return (
    <div className="certificate-page">
      <div className="certificate-wrapper fade-in-up">
        <div className="certificate-toolbar">
          <button
            type="button"
            className="btn-orange certificate-print-button"
            onClick={handlePrint}
          >
            Print / Download PDF
          </button>
        </div>

        <div className="certificate-frame">
          <div className="certificate-inner">
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
                <div className="certificate-app-name">{programmeTitle}</div>
              </div>
            </div>

            <h1 className="certificate-title">Certificate of Completion</h1>

            <p className="certificate-line">This is to certify that</p>

            <div className="certificate-name">{displayName}</div>
            <div className="certificate-name-underline" />

            <p className="certificate-details">
              Employee ID: <span>{displayId}</span>
              <br />
              Prakalpa: <span>{displayPrakalpa}</span>
              <br />
              Unit / Location: <span>{displayLocation}</span>
            </p>

            <p className="certificate-body">
              has successfully completed the{" "}
              <strong>{assessmentTitle}</strong>. This certificate is awarded in
              recognition of the staff member&apos;s demonstrated understanding
              of organizational processes, SOPs, responsibilities, applicable
              standards, and workplace systems.
            </p>

            <div className="certificate-highlight-row">
              <div className="certificate-highlight-box">
                <div className="certificate-footer-label">Status</div>
                <div className="certificate-pass-text">
                  Successfully Completed
                </div>
              </div>

              <div className="certificate-highlight-box">
                <div className="certificate-footer-label">Certificate ID</div>
                <div className="certificate-footer-value">{certificateId}</div>
              </div>
            </div>

            <div className="certificate-footer-row">
              <div className="certificate-footer-block">
                <div className="certificate-footer-label">Date of Test</div>
                <div className="certificate-footer-value">{passedDateText}</div>
              </div>

              <div className="certificate-footer-block certificate-issued-by">
                <div className="certificate-footer-label">Issued by</div>
                <div className="certificate-footer-value">
                  Quality &amp; Systems Prakalpa
                </div>
                <div className="certificate-footer-role">
                  Rashtrotthana Parishat
                </div>
              </div>

              <div className="certificate-footer-block">
                <div className="certificate-footer-label">Mode</div>
                <div className="certificate-footer-role">
                  System-generated e-certificate
                </div>
                <div className="certificate-qr-section">
  <QRCode value={verificationUrl} size={58} />
  <div className="certificate-qr-text">
    Scan to Verify
  </div>
</div>
              </div>
            </div>

          <div className="certificate-qr-section">

  

</div>
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