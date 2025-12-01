import React, { useState, useEffect } from 'react';
import { quizAPI, authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Dashboard({ setIsAuthenticated }) {
  const [quizzes, setQuizzes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResponse, quizzesResponse] = await Promise.all([
        authAPI.getCurrentUser(),
        quizAPI.listQuizzes(),
      ]);
      setUser(userResponse.data);
      setQuizzes(quizzesResponse.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.deleteQuiz(quizId);
        setQuizzes(quizzes.filter((q) => q.quiz_id !== quizId));
      } catch (err) {
        alert('Failed to delete quiz');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Adaptive Learning Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username || 'User'}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="actions">
          <button
            className="create-quiz-btn"
            onClick={() => navigate('/create-quiz')}
          >
            Create New Quiz
          </button>
        </div>

        <div className="quizzes-section">
          <h2>Your Quizzes</h2>
          {quizzes.length === 0 ? (
            <p className="no-quizzes">
              No quizzes yet. Create your first quiz to get started!
            </p>
          ) : (
            <div className="quizzes-grid">
              {quizzes.map((quiz) => (
                <div key={quiz.quiz_id} className="quiz-card">
                  <h3>{quiz.topic}</h3>
                  {quiz.subTopic && <p className="subtopic">{quiz.subTopic}</p>}
                  <p className="quiz-info">
                    Grade Level: {quiz.grade || 'N/A'} | Questions:{' '}
                    {quiz.questions?.length || 0}
                  </p>
                  <p className="quiz-date">
                    Created: {new Date(quiz.created_at).toLocaleDateString()}
                  </p>
                  <div className="quiz-actions">
                    <button
                      onClick={() => navigate(`/quiz/${quiz.quiz_id}`)}
                      className="start-btn"
                    >
                      Start Quiz
                    </button>
                    <button
                      onClick={() => navigate(`/quiz/${quiz.quiz_id}/summary`)}
                      className="summary-btn"
                    >
                      View Summary
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.quiz_id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
