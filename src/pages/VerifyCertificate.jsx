// src/pages/VerifyCertificate.jsx
import { useEffect, useState } from "react";
import { verifyCertificate } from "../api";

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

function formatVerifiedOn() {
  return new Date().toLocaleString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function VerifyCertificate() {
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  const params = new URLSearchParams(window.location.search);
  const certificateId = params.get("id");

  useEffect(() => {
    async function loadVerification() {
      try {
        if (!certificateId) {
          setError("Certificate ID is missing.");
          return;
        }

        const res = await verifyCertificate(certificateId);

        if (res.status === "ok" && res.valid) {
          setCertificate(res.certificate);
        } else {
          setError("This certificate could not be verified in the Arivu system.");
        }
      } catch (err) {
        console.error("Certificate verification error:", err);
        setError("Unable to verify certificate. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadVerification();
  }, [certificateId]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Verifying Certificate...</h2>
          <p>Please wait while Arivu verifies the certificate.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card">
          <h2 style={{ color: "#b91c1c" }}>Certificate Not Verified</h2>
          <p>{error}</p>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            Please contact the Quality &amp; Systems Prakalpa if you believe this
            certificate should be valid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: "620px" }}>
        <h2 style={{ color: "#166534" }}>✓ Valid Certificate</h2>

        <p>
          This certificate has been successfully verified through the Arivu
          Certification System.
        </p>

        <div style={{ marginTop: "18px", lineHeight: 1.9 }}>
          <strong>Certificate ID:</strong> {certificate.certificateId}
          <br />
          <strong>Name:</strong> {certificate.employeeName}
          <br />
          <strong>Employee ID:</strong> {certificate.employeeId}
          <br />
          <strong>Programme:</strong> {certificate.prakalpaName}
          <br />
          <strong>Unit / School:</strong> {certificate.location}
          <br />
          <strong>Date of Test:</strong> {formatDate(certificate.timestamp)}
          <br />
          <strong>Score Percentage:</strong> {certificate.percentage}%
          <br />
          <strong>Attempt Number:</strong> {certificate.attemptNo}
          <br />
          <strong>Status:</strong> Successfully Completed
          <br />
          <strong>Issued By:</strong> Quality &amp; Systems Prakalpa,
          Rashtrotthana Parishat
          <br />
          <strong>Verified On:</strong> {formatVerifiedOn()}
        </div>
      </div>
    </div>
  );
}

export default VerifyCertificate;