// src/pages/Landing.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  // two answers
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");

  // correct values
  const CORRECT_ANSWER_1 = "rvk";
  const CORRECT_ANSWER_2 = "vision";

  const handleStart = (e) => {
    e.preventDefault();

    if (!answer1 || !answer2) {
      alert("Please answer both verification questions.");
      return;
    }

    if (answer1 !== CORRECT_ANSWER_1 || answer2 !== CORRECT_ANSWER_2) {
      alert(
        "The answers are not correct. If you are a Rashtrotthana staff member, please check with your unit head."
      );
      return;
    }

    navigate("/login");
  };

  return (
    // Outer wrapper uses the new gradient background from index.css (.hero-page)
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
          style={{ fontSize: "18px", marginBottom: "4px" }}
        >
          Empowering Growth. Ensuring Excellence.
        </p>
        <p
          className="fade-in-up-delay-1"
          style={{ fontSize: "15px", marginBottom: "32px", color: "#4b5563" }}
        >
          Welcome to the Arivu – Process Awareness &amp; Certification
          Application.
        </p>

        {/* Feature Cards */}
        <div
          className="fade-in-up-delay-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            className="feature-card"
            style={{
              padding: "16px",
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              background: "#fff7ed",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>Process Awareness</h3>
            <p style={{ fontSize: "14px", color: "#4b5563" }}>
              Helps employees understand their key responsibilities, SOPs, and
              organizational processes.
            </p>
          </div>

          <div
            className="feature-card"
            style={{
              padding: "16px",
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              background: "#eef6ff",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>Certification</h3>
            <p style={{ fontSize: "14px", color: "#4b5563" }}>
              Staff who complete the test receive process awareness
              certification.
            </p>
          </div>

          <div
            className="feature-card"
            style={{
              padding: "16px",
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              background: "#f3fce8",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>Continuous Improvement</h3>
            <p style={{ fontSize: "14px", color: "#4b5563" }}>
              Helps improve internal quality systems and identify training
              needs.
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
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
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
            style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
          >
            Question 1
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
            <option value="rvk">
              The Rashtrotthana school network is called RVK.
            </option>
            <option value="wrong1">Rashtrotthana is a software company.</option>
            <option value="wrong2">Rashtrotthana is a private bank.</option>
          </select>

          {/* Question 2 */}
          <label
            style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
          >
            Question 2
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
              Our vision is to compete in IPL cricket.
            </option>
            <option value="wrong4">Our vision is software development.</option>
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
  );
}

export default Landing;
