import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/user/'),
};

// Quiz API
export const quizAPI = {
  createQuiz: (quizData) => api.post('/quizzes/create/', quizData),
  getQuiz: (quizId) => api.get(`/quizzes/${quizId}/`),
  listQuizzes: () => api.get('/quizzes/'),
  deleteQuiz: (quizId) => api.delete(`/quizzes/${quizId}/delete/`),
  getQuizSummary: (quizId) => api.get(`/quizzes/${quizId}/summary/`),
};

// Question API
export const questionAPI = {
  getNextQuestion: (quizId) => api.get(`/quizzes/${quizId}/next-question/`),
  submitAnswer: (questionId, answer) => 
    api.post(`/questions/${questionId}/answer/`, { user_answer: answer }),
};

// Session API
export const sessionAPI = {
  createSession: () => api.post('/sessions/create/'),
  endSession: (sessionId) => api.post(`/sessions/${sessionId}/end/`),
};

// Semantic Scholar API
export const scholarAPI = {
  search: (query, year = '2020-') => 
    api.get('/semantic-scholar/search/', { params: { query, year } }),
};

export default api;
