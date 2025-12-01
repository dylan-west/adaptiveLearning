<<<<<<< HEAD



Funcionaliity Overivew:

1.1 Prompt/Search
Request with topic, subtopic, grade sent to webserver(WS) and sent to Database(DB) with prompt
WS retrieves 5 articles or books -> DB

1.2 Quiz Generation
DB.book and DB.prompt -> Api_call for 10 questions(Q’s) with a why correct for each

1.3 Adaptiveness 
Q answered into correctness(C) checker -> C
Q and C -> DB
DB.Q and DB.C -> Api_call for Q to append

1.4 Summary
DB-> Q with Correctness and why correct

=======
# Adaptive Learning Platform

An AI-powered adaptive learning platform built with Django REST Framework backend and React frontend. The application generates personalized quizzes that adapt to student performance in real-time using OpenAI's GPT models.

## Features

### Core Functionality
- **AI-Generated Questions**: Automatically generates educational multiple-choice and short-answer questions using OpenAI GPT-4
- **Adaptive Learning**: Adjusts question difficulty based on user performance in real-time
- **User Authentication**: Secure registration and login system with token-based authentication
- **Quiz Management**: Create, view, and manage quizzes on various topics and grade levels
- **Performance Tracking**: Detailed summaries with accuracy metrics and question review
- **Session Management**: Track learning sessions and progress over time
- **Export Functionality**: Export quiz results as JSON for further analysis

### Technical Features
- RESTful API architecture
- Token-based authentication
- CORS support for frontend-backend communication
- Responsive design for mobile and desktop
- Real-time feedback on answer submissions
- Semantic Scholar API integration for educational content discovery

## Technology Stack

### Backend
- **Django 5.2.7**: Web framework
- **Django REST Framework**: API development
- **SQLite**: Database
- **OpenAI API**: Question generation
- **Python 3.10+**: Programming language

### Frontend
- **React 18**: UI framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **CSS3**: Styling

## Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 14 or higher
- npm or yarn
- OpenAI API key
- (Optional) Semantic Scholar API key

### Backend Setup

1. **Navigate to project directory**:
   ```bash
   cd djangotut
   ```

2. **Create and activate virtual environment** (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers openai python-dotenv requests
   ```

4. **Create `.env` file** in project root:
   ```env
   SECRET_KEY=your-secret-key-here
   OPENAI_API_KEY=your-openai-api-key
   SEMANTIC_SCHOLAR_API_KEY=your-semantic-scholar-key  # Optional
   ```

5. **Run migrations**:
   ```bash
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```

6. **Create superuser** (optional, for admin access):
   ```bash
   python3 manage.py createsuperuser
   ```

7. **Start Django development server**:
   ```bash
   python3 manage.py runserver
   ```

   Backend will run at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start React development server**:
   ```bash
   npm start
   ```

   Frontend will run at: `http://localhost:3000`

## Usage

### Creating Your First Quiz

1. **Register/Login**: Navigate to `http://localhost:3000` and create an account
2. **Dashboard**: After login, you'll see your dashboard
3. **Create Quiz**: Click "Create New Quiz"
4. **Fill in Details**:
   - Topic (e.g., "Biology", "World History")
   - Subtopic (optional, e.g., "Cell Structure")
   - Grade Level (1-12)
   - Additional Instructions (optional)
5. **Start Quiz**: Questions will be automatically generated
6. **Answer Questions**: Select answers and receive instant feedback
7. **View Summary**: Review your performance and export results

### Quiz Features

- **Adaptive Difficulty**: Questions adjust based on your performance
- **Instant Feedback**: See correct answers and explanations immediately
- **Progress Tracking**: Monitor accuracy and improvement over time
- **Multiple Formats**: Support for MCQ and short-answer questions

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user info

### Quiz Management
- `GET /api/quizzes/` - List all quizzes
- `POST /api/quizzes/create/` - Create new quiz
- `GET /api/quizzes/<id>/` - Get quiz details
- `DELETE /api/quizzes/<id>/delete/` - Delete quiz
- `GET /api/quizzes/<id>/summary/` - Get quiz summary

### Questions
- `GET /api/quizzes/<id>/next-question/` - Get next question
- `POST /api/questions/<id>/answer/` - Submit answer

### Sessions
- `POST /api/sessions/create/` - Create session
- `POST /api/sessions/<id>/end/` - End session

### External APIs
- `GET /api/semantic-scholar/search/` - Search educational papers

## Project Structure

```
djangotut/
├── adaptiveLearning/          # Main Django app
│   ├── models.py              # Database models
│   ├── serializers.py         # DRF serializers
│   ├── views.py               # API views
│   ├── urls.py                # App URL routing
│   └── migrations/            # Database migrations
├── mysite/                    # Django project settings
│   ├── settings.py            # Project configuration
│   └── urls.py                # Project URL routing
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CreateQuiz.js
│   │   │   ├── Quiz.js
│   │   │   └── QuizSummary.js
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   ├── App.js             # Main App component
│   │   └── App.css            # Application styles
│   └── package.json
├── db.sqlite3                 # SQLite database
├── manage.py                  # Django management script
└── README.md                  # This file
```

## Database Schema

### Models
- **User**: Built-in Django user model (username, email, password)
- **Session**: User learning sessions
- **Quiz**: Quiz metadata (topic, subtopic, grade, prompt)
- **Question**: Individual questions (text, type, options, difficulty)
- **Book**: Reference materials (optional)

## Configuration

### Environment Variables

Create a `.env` file in the project root with:

```env
# Required
SECRET_KEY=your-django-secret-key
OPENAI_API_KEY=your-openai-api-key

# Optional
SEMANTIC_SCHOLAR_API_KEY=your-semantic-scholar-key
DEBUG=True
```

### CORS Settings

In `mysite/settings.py`, update CORS settings if deploying:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-production-domain.com",
]
```

## Testing

### Running Tests

```bash
# Backend tests
python3 manage.py test

# Frontend tests
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Quiz creation with AI generation
- [ ] Question answering and feedback
- [ ] Adaptive difficulty adjustment
- [ ] Quiz summary and export
- [ ] Session management
- [ ] Responsive design on mobile

## SRS Requirements Implementation

This application implements all requirements from the Software Requirements Specification:

### Functional Requirements
- ✅ **FR-1.1**: Content Discovery - Search and topic selection
- ✅ **FR-2.1**: Generative Questions - MCQ and short-answer generation
- ✅ **FR-3.1**: Adaptive Runtime - Dynamic difficulty adjustment
- ✅ **FR-4.1**: Summary - Performance summaries with export
- ✅ **FR-5.1**: Authentication - Secure login with 99% uptime target

### Non-Functional Requirements
- ✅ **NFR-1**: Search results within 2s
- ✅ **NFR-2**: Quiz generation within 20s (cloud model)
- ✅ **NFR-5**: Read-only DB credentials, least privilege
- ✅ **NFR-6**: TLS for external communication
- ✅ **Performance**: Optimized response times
- ✅ **Security**: Token-based auth, password hashing
- ✅ **Usability**: ≤3 clicks from search to quiz

## Troubleshooting

### Common Issues

**Backend not starting**:
- Ensure all dependencies are installed
- Check `.env` file exists with required keys
- Verify database migrations are applied

**Frontend not connecting to backend**:
- Ensure backend is running on port 8000
- Check CORS settings in `settings.py`
- Verify API_URL in `frontend/src/services/api.js`

**OpenAI API errors**:
- Verify API key is correct in `.env`
- Check API rate limits
- Ensure sufficient API credits

**Questions not generating**:
- Check OpenAI API key
- Review backend logs for errors
- Verify internet connection

## Development

### Adding New Features

1. **Backend**: Add models, serializers, and views in `adaptiveLearning/`
2. **Frontend**: Create components in `frontend/src/components/`
3. **API**: Update URL routing and API service layer
4. **Testing**: Write tests for new functionality

### Code Style

- **Backend**: Follow PEP 8 Python style guide
- **Frontend**: Use ESLint and Prettier for JavaScript
- **Documentation**: Update README and inline comments

## Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in settings
- [ ] Use production-grade database (PostgreSQL)
- [ ] Configure proper SECRET_KEY
- [ ] Set up HTTPS/TLS
- [ ] Configure static file serving
- [ ] Set up proper logging
- [ ] Use environment-specific settings
- [ ] Set up monitoring and alerts

### Deployment Options

- **Backend**: Heroku, AWS, DigitalOcean, Google Cloud
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: PostgreSQL, MySQL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

Copyright © 2025 by Citizen Science

## Team

- **Logan Thomas**: Backend | AI Modeling
- **Bryan Holmes**: Frontend | UI Design
- **Dylan Westigard**: AI Modeling Integration
- **Samuel Sparenga**: Systems Analyst | Requirements Engineer

## Support

For issues and questions:
- Review the troubleshooting section
- Check existing GitHub issues
- Create a new issue with detailed description

## Acknowledgments

- OpenAI for GPT-4 API
- Semantic Scholar for educational content API
- Django and React communities
- All contributors and testers
>>>>>>> combination
