import React, { useState } from 'react';
import { quizAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function CreateQuiz() {
  const [formData, setFormData] = useState({
    topic: 'Computer Science',
    subTopic: '',
    publication_year: '2015-',
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
          Create a college-level quiz based on scholarly research papers
        </p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Field of Study: *</label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Medicine">Medicine</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Materials Science">Materials Science</option>
              <option value="Physics">Physics</option>
              <option value="Geology">Geology</option>
              <option value="Psychology">Psychology</option>
              <option value="Art">Art</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Sociology">Sociology</option>
              <option value="Business">Business</option>
              <option value="Political Science">Political Science</option>
              <option value="Economics">Economics</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Engineering">Engineering</option>
              <option value="Environmental Science">Environmental Science</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <div className="form-group">
            <label>Specific Topic: *</label>
            <input
              type="text"
              name="subTopic"
              value={formData.subTopic}
              onChange={handleChange}
              placeholder="e.g., Neural Networks, Quantum Entanglement, Memory Formation"
              required
            />
          </div>
          <div className="form-group">
            <label>Publication Year Range:</label>
            <select
              name="publication_year"
              value={formData.publication_year}
              onChange={handleChange}
            >
              <option value="2023-">2023 - Present</option>
              <option value="2020-">2020 - Present</option>
              <option value="2015-">2015 - Present</option>
              <option value="2010-">2010 - Present</option>
              <option value="2000-">2000 - Present</option>
              <option value="">All Years</option>
            </select>
          </div>
          <div className="button-group">
            <button type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Fetching Papers & Generating Quiz...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;
