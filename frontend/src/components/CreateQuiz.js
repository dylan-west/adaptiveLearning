import React, { useState } from 'react';
import { quizAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function CreateQuiz() {
  const [formData, setFormData] = useState({
    topic: '',
    subTopic: '',
    grade: 5,
    prompt: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await quizAPI.createQuiz(formData);
      navigate(`/quiz/${response.data.quiz_id}`);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to create quiz. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-container">
      <div className="create-quiz-card">
        <h2>Create New Quiz</h2>
        <p className="description">
          Enter a topic and we'll generate adaptive questions using AI
        </p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Topic: *</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Biology, World History, Algebra"
              required
            />
          </div>
          <div className="form-group">
            <label>Subtopic (optional):</label>
            <input
              type="text"
              name="subTopic"
              value={formData.subTopic}
              onChange={handleChange}
              placeholder="e.g., Cell Structure, World War II, Linear Equations"
            />
          </div>
          <div className="form-group">
            <label>Grade Level: *</label>
            <select name="grade" value={formData.grade} onChange={handleChange}>
              <option value="1">1st Grade</option>
              <option value="2">2nd Grade</option>
              <option value="3">3rd Grade</option>
              <option value="4">4th Grade</option>
              <option value="5">5th Grade</option>
              <option value="6">6th Grade</option>
              <option value="7">7th Grade</option>
              <option value="8">8th Grade</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </select>
          </div>
          <div className="form-group">
            <label>Additional Instructions (optional):</label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              placeholder="Any specific requirements or focus areas..."
              rows="4"
            />
          </div>
          <div className="button-group">
            <button type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Generating Quiz...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;
