// src/pages/Result.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const r = sessionStorage.getItem("arivuLastResult");
    if (!r) {
      navigate("/login");
      return;
    }
    setResult(JSON.parse(r));
  }, [navigate]);

  if (!result) {
    return null;
  }

  const {
    prakalpaName,
    location,
    employeeName,
    employeeId,
    score,
    totalQuestions,
    percentage,
    passed,
    attemptNo,
    wrongDetails = [],
  } = result;

  function handleRetry() {
    navigate("/login");
  }

  function handleDownloadCertificate() {
    navigate("/certificate");
  }

  return (
    <div className="page-container">
      <div className="card result-card">
        <h2>Test Result</h2>

        <p>
          <strong>Name:</strong> {employeeName} ({employeeId})
        </p>
        <p>
          <strong>Prakalpa:</strong> {prakalpaName} &nbsp; | &nbsp;
          <strong>Location:</strong> {location}
        </p>
        <p>
          <strong>Attempt Number:</strong> {attemptNo}
        </p>

        <div className="result-summary">
          <div>
            <span className="result-label">Score</span>
            <span className="result-value">
              {score} / {totalQuestions}
            </span>
          </div>
          <div>
            <span className="result-label">Percentage</span>
            <span className="result-value">{percentage}%</span>
          </div>
          <div>
            <span className="result-label">Result</span>
            <span
              className={
                "result-tag " + (passed ? "result-pass" : "result-fail")
              }
            >
              {passed ? "Passed" : "Failed"}
            </span>
          </div>
        </div>

        <p className="result-message">
          {passed
            ? "Congratulations! You have successfully completed the Process Awareness test."
            : "You did not reach the 80% pass mark. Please review the wrong answers and try again."}
        </p>

        {wrongDetails.length > 0 && (
          <div className="wrong-answers">
            <h3>Questions you missed</h3>
            <ul>
              {wrongDetails.map((w, idx) => (
                <li key={idx}>
                  <strong>Q{w.qNo}:</strong> {w.question} <br />
                  <span>Correct answer: {w.correctAnswer}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="button-row">
          {passed && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDownloadCertificate}
            >
              Download Certificate
            </button>
          )}

          {!passed && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleRetry}
            >
              Retry Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Result;
