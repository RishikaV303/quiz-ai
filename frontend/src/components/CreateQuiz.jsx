import React from "react";
import { useState } from "react";
import "./CreateQuiz.css";

function CreateQuiz({ user }) {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const userId = user.id;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, difficulty }),
      });

      const data = await response.json();

      console.log(data);

      if (data.questions) {
        setQuestions(data.questions);
      } else {
        alert("Failed to generate quiz");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (qIndex, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qIndex]: option,
    });
  };

  const calculateScore = async () => {
    let scoreValue = 0;

    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        scoreValue++;
      }
    });

    setScore(scoreValue);
    try {
      await fetch("http://localhost:5000/save-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          topic,
          difficulty,
          score: scoreValue,
        }),
      });
    } catch (err) {
      console.log("Error saving quiz:", err);
    }
  };

  return (
    <>
      <div className="quiz-page">
        <div className="quiz-container">
          {/* ── Header ── */}
          <div className="quiz-header">
            <div className="quiz-header__icon">🧠</div>
            <h1 className="quiz-header__title">Quiz Generator</h1>
            <p className="quiz-header__sub">
              Enter a topic and test your knowledge instantly
            </p>
          </div>

          {/* ── Topic input card ── */}
          <div className="quiz-card quiz-setup-card">
            <label className="quiz-label" htmlFor="topic-input">
              Quiz Topic
            </label>
            <div className="quiz-input-row">
              <input
                id="topic-input"
                className="quiz-input"
                type="text"
                placeholder="e.g. Javascript, Python..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="quiz-input"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button
                className="quiz-btn quiz-btn--primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="quiz-spinner" />
                    Loading…
                  </>
                ) : (
                  <>✦ Generate Quiz</>
                )}
              </button>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="quiz-loading">
                <span className="quiz-loading__dots">
                  <span />
                  <span />
                  <span />
                </span>
                <p className="quiz-loading__text">Generating your quiz…</p>
              </div>
            )}
          </div>

          {/* ── Questions ── */}
          {questions && questions.length > 0 && (
            <div className="quiz-questions-section">
              <div className="quiz-progress-bar">
                <div
                  className="quiz-progress-bar__fill"
                  style={{
                    width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%`,
                  }}
                />
              </div>
              <p className="quiz-progress-label">
                {Object.keys(selectedAnswers).length} / {questions.length}{" "}
                answered
              </p>

              {questions.map((q, index) => (
                <div key={index} className="quiz-card quiz-question-card">
                  <div className="quiz-question-card__header">
                    <span className="quiz-question-card__number">
                      Q{index + 1}
                    </span>
                    <h3 className="quiz-question-card__text">{q.question}</h3>
                  </div>

                  <div className="quiz-options">
                    {Array.isArray(q.options) &&
                      q.options.map((opt, i) => (
                        <button
                          key={i}
                          className={`quiz-option ${selectedAnswers[index] === opt ? "quiz-option--selected" : ""}`}
                          onClick={() => handleOptionClick(index, opt)}
                        >
                          <span className="quiz-option__letter">
                            {["A", "B", "C", "D"][i]}
                          </span>
                          <span className="quiz-option__text">{opt}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}

              {/* Submit */}
              <div className="quiz-actions">
                <button
                  className="quiz-btn quiz-btn--submit"
                  onClick={calculateScore}
                >
                  ✓ Submit Quiz
                </button>
              </div>
            </div>
          )}

          {/* ── Score & Review ── */}
          {score !== null && (
            <div className="quiz-results">
              {/* Score card */}
              <div className="quiz-card quiz-score-card">
                <div className="quiz-score-card__circle">
                  <span className="quiz-score-card__number">{score}</span>
                  <span className="quiz-score-card__divider">/</span>
                  <span className="quiz-score-card__total">
                    {questions.length}
                  </span>
                </div>
                <h2 className="quiz-score-card__label">
                  {score === questions.length
                    ? "🏆 Perfect Score!"
                    : score >= questions.length / 2
                      ? "🎉 Well Done!"
                      : "📚 Keep Practicing!"}
                </h2>
                <p className="quiz-score-card__percent">
                  {Math.round((score / questions.length) * 100)}% correct
                </p>
              </div>

              {/* Review section */}
              <div className="quiz-review">
                <h3 className="quiz-review__title">Review Answers</h3>

                {questions.map((q, index) => (
                  <div key={index} className="quiz-card quiz-review-card">
                    <div className="quiz-question-card__header">
                      <span className="quiz-question-card__number">
                        Q{index + 1}
                      </span>
                      <h3 className="quiz-question-card__text">{q.question}</h3>
                    </div>

                    <div className="quiz-options quiz-options--review">
                      {q.options.map((opt, i) => {
                        const isSelected = selectedAnswers[index] === opt;
                        const isCorrect = q.answer === opt;

                        return (
                          <p
                            key={i}
                            className={`quiz-review-option ${
                              isCorrect
                                ? "quiz-review-option--correct"
                                : isSelected
                                  ? "quiz-review-option--wrong"
                                  : "quiz-review-option--neutral"
                            }`}
                          >
                            <span className="quiz-review-option__letter">
                              {["A", "B", "C", "D"][i]}
                            </span>
                            <span className="quiz-review-option__text">
                              {opt}
                            </span>
                            {isCorrect && (
                              <span className="quiz-review-option__badge quiz-review-option__badge--correct">
                                ✓ Correct
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="quiz-review-option__badge quiz-review-option__badge--wrong">
                                ✗ Your answer
                              </span>
                            )}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Retake ── */}
          {questions.length > 0 && (
            <div className="quiz-retake-row">
              <button
                className="quiz-btn quiz-btn--retake"
                onClick={() => {
                  setQuestions([]);
                  setSelectedAnswers({});
                  setScore(null);
                }}
              >
                ↺ Retake Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateQuiz;
