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

## Technology Stack

### Backend
- **Django 5.2.7**: Web framework
- **Django REST Framework**: API development
- **SQLite**: Database
- **OpenAI API**: Question generation
- **Python 3.10+**: Programming language

### Frontend
- **React 18**: UI framework

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
   cd adaptiveLearning
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
