import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

function QuizSources() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const response = await quizAPI.getQuiz(quizId);
      setQuiz(response.data);
    } catch (err) {
      setError('Failed to load quiz sources');
      console.error('Error loading quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading sources...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const papers = quiz?.semantic_scholar_data || [];

  return (
    <div className="sources-container">
      <div className="sources-header">
        <h1>Research Sources</h1>
        <h2>{quiz.topic} - {quiz.subTopic}</h2>
      </div>

      <div className="sources-content">
        {papers.length === 0 ? (
          <p className="no-sources">No sources found for this quiz.</p>
        ) : (
          <div className="papers-list">
            {papers.map((paper, index) => {
              const authors = paper.authors || [];
              const authorNames = authors.slice(0, 3).map(a => a.name).join(', ');
              const moreAuthors = authors.length > 3 ? ` (+${authors.length - 3} more)` : '';
              const pdfUrl = paper.openAccessPdf?.url || '';
              
              return (
                <div key={index} className="paper-card">
                  <div className="paper-number">{index + 1}</div>
                  <div className="paper-content">
                    <h3 className="paper-title">{paper.title || 'Untitled'}</h3>
                    
                    {authorNames && (
                      <p className="paper-authors">
                        <strong>Authors:</strong> {authorNames}{moreAuthors}
                      </p>
                    )}
                    
                    {paper.publicationDate && (
                      <p className="paper-date">
                        <strong>Published:</strong> {paper.publicationDate}
                      </p>
                    )}
                    
                    {paper.citationCount !== undefined && (
                      <p className="paper-citations">
                        <strong>Citations:</strong> {paper.citationCount}
                      </p>
                    )}
                    
                    {paper.fieldsOfStudy && paper.fieldsOfStudy.length > 0 && (
                      <p className="paper-fields">
                        <strong>Fields:</strong> {paper.fieldsOfStudy.join(', ')}
                      </p>
                    )}
                    
                    {paper.abstract && (
                      <div className="paper-abstract">
                        <strong>Abstract:</strong>
                        <p>{paper.abstract}</p>
                      </div>
                    )}
                    
                    <div className="paper-links">
                      {paper.url && (
                        <a 
                          href={paper.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="paper-link"
                        >
                          View on Semantic Scholar
                        </a>
                      )}
                      {pdfUrl && (
                        <a 
                          href={pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="paper-link pdf-link"
                        >
                          Open Access PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="sources-actions">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
        <button onClick={() => navigate(`/quiz/${quizId}`)} className="quiz-btn">
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizSources;
