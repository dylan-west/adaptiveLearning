import React, { useState, useEffect } from 'react';
import { quizAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

function QuizSummary() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [quizId]);

  const loadSummary = async () => {
    try {
      const response = await quizAPI.getQuizSummary(quizId);
      setSummary(response.data);
    } catch (err) {
      console.error('Error loading summary:', err);
      alert('Failed to load quiz summary');
    } finally {
      setLoading(false);
    }
  };

  const exportSummary = () => {
    if (!summary) return;

    const exportData = summary.questions.map((q) => ({
      Question: q.question_text,
      Answer: q.correct_answer,
      Source: q.source_reference,
      UserAnswer: q.user_answer || 'Not answered',
      Correct: q.correctness === true ? 'Yes' : q.correctness === false ? 'No' : 'N/A',
    }));

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_summary_${quizId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="loading">Loading summary...</div>;
  }

  if (!summary) {
    return <div className="error">Failed to load summary</div>;
  }

  const correctQuestions = summary.questions.filter((q) => q.correctness === true);
  const incorrectQuestions = summary.questions.filter((q) => q.correctness === false);

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h2>Quiz Summary</h2>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="summary-stats">
        <div className="stat-card">
          <h3>{summary.topic}</h3>
          {summary.subTopic && <p className="subtopic">{summary.subTopic}</p>}
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.total_questions}</div>
          <div className="stat-label">Total Questions</div>
        </div>
        <div className="stat-card success">
          <div className="stat-number">{summary.correct_answers}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="stat-card error">
          <div className="stat-number">{summary.incorrect_answers}</div>
          <div className="stat-label">Incorrect</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{summary.accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
      </div>

      <div className="summary-actions">
        <button onClick={exportSummary} className="export-btn">
          📥 Export as JSON
        </button>
        <button onClick={() => navigate(`/quiz/${quizId}`)} className="retake-btn">
          Continue Quiz
        </button>
      </div>

      <div className="questions-review">
        {correctQuestions.length > 0 && (
          <div className="section correct-section">
            <h3>✓ Correct Answers ({correctQuestions.length})</h3>
            {correctQuestions.map((q) => (
              <div key={q.question_id} className="question-review correct">
                <div className="question-header">
                  <span className="question-num">Q{q.num}</span>
                  <span className="difficulty">Difficulty: {q.difficulty}/5</span>
                </div>
                <p className="question-text">{q.question_text}</p>
                <p className="answer">
                  <strong>Your Answer:</strong> {q.user_answer}
                </p>
                {q.why_correct && (
                  <p className="explanation">
                    <strong>Explanation:</strong> {q.why_correct}
                  </p>
                )}
                {q.source_reference && (
                  <p className="source">
                    <strong>Further Reading:</strong> {q.source_reference}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {incorrectQuestions.length > 0 && (
          <div className="section incorrect-section">
            <h3>✗ Incorrect Answers ({incorrectQuestions.length})</h3>
            {incorrectQuestions.map((q) => (
              <div key={q.question_id} className="question-review incorrect">
                <div className="question-header">
                  <span className="question-num">Q{q.num}</span>
                  <span className="difficulty">Difficulty: {q.difficulty}/5</span>
                </div>
                <p className="question-text">{q.question_text}</p>
                <p className="answer wrong">
                  <strong>Your Answer:</strong> {q.user_answer}
                </p>
                <p className="answer correct">
                  <strong>Correct Answer:</strong> {q.correct_answer}
                </p>
                {q.why_correct && (
                  <p className="explanation">
                    <strong>Explanation:</strong> {q.why_correct}
                  </p>
                )}
                {q.source_reference && (
                  <p className="source">
                    <strong>Further Reading:</strong> {q.source_reference}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizSummary;
