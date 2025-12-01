// src/pages/Quiz.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitResult } from "../api";

function Quiz() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Timer state (seconds)
  const [timeLeft, setTimeLeft] = useState(null);

  // Load session + questions from sessionStorage
  useEffect(() => {
    const sStr = sessionStorage.getItem("arivuSession");
    const qStr = sessionStorage.getItem("arivuQuestions");

    if (!sStr || !qStr) {
      // Direct access to /quiz → send to Login
      navigate("/login");
      return;
    }

    const s = JSON.parse(sStr);
    const qs = JSON.parse(qStr);

    setSession(s);
    setQuestions(qs);

    // Duration in minutes from Prakalpa sheet (fallback 30 minutes)
    const minutes = Number(s.durationMinutes) || 30;
    setTimeLeft(minutes * 60);
  }, [navigate]);

  // Countdown effect
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      // Time over → auto-submit (if not already submitting)
      if (!submitting) {
        handleSubmitQuiz(true);
      }
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitting]);

  if (!session || questions.length === 0) {
    return (
      <div className="page-container">
        <div className="card">
          <p>Loading quiz…</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  function handleOptionChange(optionIndex) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  // Helper to format timer as MM:SS
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  async function handleSubmitQuiz(auto = false) {
    if (submitting) return; // avoid double submit
    const totalQuestions = questions.length;

    let score = 0;
    const wrongDetails = [];

    questions.forEach((q, idx) => {
      const selectedOptionIndex = answers[q.id];
      // correctOption is "A","B","C","D"
      const correctIndex = ["A", "B", "C", "D"].indexOf(q.correctOption);

      if (selectedOptionIndex === correctIndex) {
        score += 1;
      } else {
        wrongDetails.push({
          qNo: idx + 1,
          question: q.text,
          correctAnswer: q.options[correctIndex],
        });
      }
    });

    const percentage = totalQuestions
      ? Math.round((score / totalQuestions) * 100)
      : 0;

    const wrongSummary = wrongDetails
      .map(
        (w) => `Q${w.qNo}: ${w.question} | Correct: ${w.correctAnswer}`
      )
      .join(" || ");

    const payload = {
      prakalpaCode: session.prakalpaCode,
      prakalpaName: session.prakalpaName,
      location: session.location,
      employeeName: session.employeeName,
      employeeId: session.employeeId,
      score,
      totalQuestions,
      percentage,
      wrongAnswers: wrongSummary,
    };

    setSubmitting(true);
    try {
      const res = await submitResult(payload);

      const finalResult = {
        ...session,
        score,
        totalQuestions,
        percentage,
        wrongDetails,
        passed: res.passed,
        attemptNo: res.attemptNo,
        certificateNumber: res.certificateNumber,
      };

      sessionStorage.setItem("arivuLastResult", JSON.stringify(finalResult));

      if (auto) {
        alert("Time is over. Your quiz has been submitted.");
      }

      navigate("/result");
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <div className="card quiz-card">
        <div className="quiz-header">
          {/* Title in blue */}
          <h2 style={{ color: "#2563eb" }}>ಪ್ರಶ್ನಾವಳಿ</h2>

          <div className="quiz-meta" style={{ textAlign: "right" }}>
            {/* Question number text in Kannada */}
            <div style={{ fontSize: "14px", marginBottom: "4px" }}>
              ಪ್ರಶ್ನೆ {currentIndex + 1} of {questions.length}
            </div>
            {/* Timer */}
            {timeLeft !== null && (
              <div
                className="timer-pill"
                style={{
                  display: "inline-block",
                  marginTop: "2px",
                }}
              >
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>

        <div className="quiz-question">
          <h3>{currentQuestion.text}</h3>
        </div>

        <div className="quiz-options">
          {currentQuestion.options.map((opt, idx) => {
            const selected = answers[currentQuestion.id] === idx;
            return (
              <label
                key={idx}
                className={
                  "quiz-option" + (selected ? " quiz-option-selected" : "")
                }
              >
                <input
                  type="radio"
                  name={`q-${currentQuestion.id}`}
                  value={idx}
                  checked={selected}
                  onChange={() => handleOptionChange(idx)}
                />
                {/* Only option text – no A/B/C/D prefix */}
                <span className="option-label">{opt}</span>
              </label>
            );
          })}
        </div>

        <div className="quiz-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={goNext}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSubmitQuiz(false)}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
