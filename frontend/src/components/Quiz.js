import React, { useState, useEffect } from 'react';
import { questionAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadNextQuestion();
  }, [quizId]);

  const loadNextQuestion = async () => {
    setLoading(true);
    setSelectedAnswer('');
    setFeedback(null);

    try {
      const response = await questionAPI.getNextQuestion(quizId);
      if (response.data.completed) {
        setCompleted(true);
      } else {
        setQuestion(response.data.question);
      }
    } catch (err) {
      console.error('Error loading question:', err);
      alert('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer');
      return;
    }

    setSubmitting(true);

    try {
      const response = await questionAPI.submitAnswer(
        question.question_id,
        selectedAnswer
      );
      setFeedback(response.data);
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    loadNextQuestion();
  };

  if (loading) {
    return <div className="loading">Loading question...</div>;
  }

  if (completed) {
    return (
      <div className="quiz-completed">
        <h2>Quiz Completed!</h2>
        <p>You've answered all available questions.</p>
        <div className="completion-actions">
          <button onClick={() => navigate(`/quiz/${quizId}/summary`)}>
            View Summary
          </button>
          <button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <div className="quiz-progress">
          Question {question?.num || 1} | Difficulty: {question?.difficulty || 1}/5
        </div>
      </div>

      <div className="question-card">
        <h3 className="question-text">{question?.question_text}</h3>

        {question?.question_type === 'mcq' && question?.options && (
          <div className="options">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option ${
                  selectedAnswer === option ? 'selected' : ''
                } ${
                  feedback
                    ? option === feedback.correct_answer
                      ? 'correct'
                      : selectedAnswer === option
                      ? 'incorrect'
                      : ''
                    : ''
                }`}
                onClick={() => !feedback && setSelectedAnswer(option)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
              </div>
            ))}
          </div>
        )}

        {question?.question_type === 'short_answer' && (
          <div className="short-answer">
            <textarea
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={feedback !== null}
              rows="4"
            />
          </div>
        )}

        {feedback && (
          <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
            <h4>{feedback.correct ? '✓ Correct!' : '✗ Incorrect'}</h4>
            {!feedback.correct && (
              <p>
                <strong>Correct Answer:</strong> {feedback.correct_answer}
              </p>
            )}
            {feedback.explanation && (
              <p>
                <strong>Explanation:</strong> {feedback.explanation}
              </p>
            )}
            {feedback.source && (
              <p className="source">
                <strong>Source:</strong> {feedback.source}
              </p>
            )}
          </div>
        )}

        <div className="quiz-actions">
          {!feedback ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || submitting}
              className="submit-btn"
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          ) : (
            <button onClick={handleNext} className="next-btn">
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
