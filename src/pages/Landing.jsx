// src/pages/Landing.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

function Landing() {
  const navigate = useNavigate();

  // toast message for errors
  const [toastMsg, setToastMsg] = useState("");

  // two answers
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");

  // correct values
  const CORRECT_ANSWER_1 = "mission";
  const CORRECT_ANSWER_2 = "vision";

  const handleStart = (e) => {
    e.preventDefault();

    if (!answer1 || !answer2) {
      setToastMsg("Please answer both verification questions.");
      return;
    }

    if (answer1 !== CORRECT_ANSWER_1 || answer2 !== CORRECT_ANSWER_2) {
      setToastMsg(
        "The answers are not correct. If you are a Rashtrotthana staff member, please check with your unit head."
      );
      return;
    }

    navigate("/login");
  };

  return (
    <>
      {/* Outer wrapper uses the new gradient background from index.css (.hero-page) */}
      <div className="hero-page">
        {/* Inner content stays constrained and centered like before */}
        <div
          style={{
            maxWidth: "900px",
            margin: "40px auto 32px",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <img
            src="/rashtrotthana-logo.png"
            alt="Rashtrotthana Logo"
            className="fade-in-up"
            style={{ height: 140, marginBottom: 16 }}
          />

          {/* Title */}
          <h1
            className="fade-in-up-delay-1"
            style={{ fontSize: "32px", marginBottom: "8px" }}
          >
            Rashtrotthana Parishat
          </h1>
          <p
            className="fade-in-up-delay-1"
            style={{ fontSize: "18px", marginBottom: "4px", color: "#2610eeff" }}
          >
            Quality and Systems are every employee&apos;s responsibility.
          </p>
          <p
            className="fade-in-up-delay-1"
            style={{ fontSize: "15px", marginBottom: "32px", color: "#4b5563" }}
          >
            Welcome to the Arivu – Process Awareness &amp; Certification
            Application.
          </p>

          {/* Feature Cards – now only 2 cards */}
          <div
            className="fade-in-up-delay-2"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
              gap: "22px",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            {/* Card 1 – Process Awareness & Certification */}
            <div
              className="feature-card"
              style={{
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e4e4e4",
                background: "#fff7ed",
                minWidth: "260px",
                maxWidth: "320px",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src="/icon-awareness.png"
                  alt="Process Awareness"
                  style={{ width: "70px", marginBottom: "16px" }}
                />
              </div>

              <h3
                style={{
                  marginBottom: "10px",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Process Awareness &amp; Certification
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#4b5563",
                  lineHeight: 1.6,
                  textAlign: "left",
                }}
              >
                Helps employees understand their key responsibilities, SOPs and
                organizational processes. Staff who complete the test receive a
                process awareness certification.
              </p>
            </div>

            {/* Card 2 – Continuous Improvement */}
            <div
              className="feature-card"
              style={{
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e4e4e4",
                background: "#f3fce8",
                minWidth: "260px",
                maxWidth: "320px",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src="/icon-improvement.png"
                  alt="Continuous Improvement"
                  style={{ width: "70px", marginBottom: "16px" }}
                />
              </div>

              <h3
                style={{
                  marginBottom: "10px",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Continuous Improvement
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#4b5563",
                  lineHeight: 1.6,
                  textAlign: "left",
                }}
              >
                Helps improve internal quality systems and identify training
                needs, supporting continuous organizational development.
              </p>
            </div>
          </div>

          {/* Verification Section */}
          <form
            onSubmit={handleStart}
            className="fade-in-up-delay-2"
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: "24px",
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              textAlign: "left",
            }}
          >
            <label
              style={{
                fontWeight: "600",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Verification Questions
            </label>

            <p
              style={{
                fontSize: "14px",
                color: "#4b5563",
                marginBottom: "16px",
              }}
            >
              Please answer both questions to confirm you are an authorized staff
              member.
            </p>

            {/* Question 1 */}
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              Mission
            </label>
            <select
              value={answer1}
              onChange={(e) => setAnswer1(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                marginBottom: "20px",
              }}
            >
              <option value="">Select the correct answer</option>
              <option value="mission">
                To create models of excellence in all activities and to
                encourage their widespread adaptation.
              </option>
              <option value="wrong1">
                To support communities by promoting sustainable development and
                providing opportunities for lifelong learning.
              </option>
              <option value="wrong2">
                To deliver quality services through innovation and teamwork while
                ensuring customer satisfaction.
              </option>
            </select>

            {/* Question 2 */}
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              Vision
            </label>
            <select
              value={answer2}
              onChange={(e) => setAnswer2(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                marginBottom: "20px",
              }}
            >
              <option value="">Select the correct answer</option>
              <option value="vision">
                Swastha–Susthira Samajanirmanam is our vision.
              </option>
              <option value="wrong3">
                Our vision is to compete in market.
              </option>
              <option value="wrong4">
                Our vision is to create wealthy society.
              </option>
            </select>

            {/* Orange Start Button */}
            <button type="submit" className="btn-orange">
              Start
            </button>

            {/* Footer Text */}
            <p
              style={{
                fontSize: "12px",
                textAlign: "center",
                color: "#6b7280",
                marginTop: "14px",
              }}
            >
              © {new Date().getFullYear()} Rashtrotthana Parishat. All rights
              reserved.
            </p>
            <p
              style={{
                fontSize: "11px",
                textAlign: "center",
                color: "#9ca3af",
              }}
            >
              Disclaimer: This application is intended only for authorized staff
              of Rashtrotthana.
            </p>
          </form>
        </div>
      </div>

      {/* Toast for error messages */}
      {toastMsg && (
        <Toast message={toastMsg} onClose={() => setToastMsg("")} />
      )}
    </>
  );
}

export default Landing;
