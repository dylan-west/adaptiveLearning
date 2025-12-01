from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import render
from django.utils import timezone
from django.db.models import Count, Q
import os
import requests
import json
from openai import OpenAI
from .models import Session, Quiz, Book, Question
from .serializers import (
    UserSerializer, UserRegistrationSerializer, SessionSerializer,
    QuizSerializer, QuizCreateSerializer, QuestionSerializer,
    QuestionAnswerSerializer, QuizSummarySerializer
)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# ==================== AUTHENTICATION ENDPOINTS ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user and return token"""
    username = request.data.get('username', '').lower()
    password = request.data.get('password', '')
    
    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user by deleting token"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current user info"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# ==================== QUIZ MANAGEMENT ENDPOINTS ====================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_quiz(request):
    """Create a new quiz and generate initial questions"""
    serializer = QuizCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Create quiz
    quiz = serializer.save(user=request.user)  # type: ignore
    
    # Generate initial questions based on topic and difficulty
    try:
        generate_questions_for_quiz(quiz)
    except Exception as e:
        quiz.delete()  # type: ignore
        return Response(
            {'error': f'Failed to generate questions: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    return Response(
        QuizSerializer(quiz).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz(request, quiz_id):
    """Get a specific quiz with all questions"""
    try:
        quiz = Quiz.objects.get(quiz_id=quiz_id, user=request.user)
        return Response(QuizSerializer(quiz).data)
    except Quiz.DoesNotExist:
        return Response(
            {'error': 'Quiz not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_quizzes(request):
    """List all quizzes for current user"""
    quizzes = Quiz.objects.filter(user=request.user)
    return Response(QuizSerializer(quizzes, many=True).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_quiz(request, quiz_id):
    """Delete a quiz"""
    try:
        quiz = Quiz.objects.get(quiz_id=quiz_id, user=request.user)
        quiz.delete()
        return Response({'message': 'Quiz deleted successfully'})
    except Quiz.DoesNotExist:
        return Response(
            {'error': 'Quiz not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# ==================== QUESTION ENDPOINTS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_next_question(request, quiz_id):
    """Get the next unanswered question in adaptive order"""
    try:
        quiz = Quiz.objects.get(quiz_id=quiz_id, user=request.user)
    except Quiz.DoesNotExist:
        return Response(
            {'error': 'Quiz not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get next unanswered question
    next_question = quiz.questions.filter(correctness__isnull=True).first()  # type: ignore
    
    if not next_question:
        # No more questions, quiz is complete
        return Response({
            'completed': True,
            'message': 'Quiz completed'
        })
    
    # Return question without correct answer
    question_data = dict(QuestionSerializer(next_question).data)
    question_data.pop('correct_answer', None)  # Hide correct answer
    
    return Response({
        'completed': False,
        'question': question_data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request, question_id):
    """Submit an answer to a question and get adaptive feedback"""
    try:
        question = Question.objects.get(question_id=question_id)
        quiz = question.quiz
        
        # Verify user owns this quiz
        if quiz.user != request.user:
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = QuestionAnswerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user_answer = str(serializer.validated_data['user_answer']) if serializer.validated_data else ''  # type: ignore
        
        # Check if answer is correct
        is_correct = check_answer(question, user_answer)
        
        # Update question
        question.correctness = is_correct
        question.save()
        
        # Generate next question adaptively based on performance
        generate_adaptive_question(quiz, is_correct)
        
        return Response({
            'correct': is_correct,
            'correct_answer': question.correct_answer,
            'explanation': question.why_correct
        })
        
    except Question.DoesNotExist:
        return Response(
            {'error': 'Question not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz_summary(request, quiz_id):
    """Get summary of quiz performance"""
    try:
        quiz = Quiz.objects.get(quiz_id=quiz_id, user=request.user)
    except Quiz.DoesNotExist:
        return Response(
            {'error': 'Quiz not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    questions = quiz.questions.all()  # type: ignore
    total = questions.count()
    correct = questions.filter(correctness=True).count()
    incorrect = questions.filter(correctness=False).count()
    unanswered = questions.filter(correctness__isnull=True).count()
    
    accuracy = (correct / total * 100) if total > 0 else 0
    
    summary_data = {
        'quiz_id': quiz.quiz_id,
        'topic': quiz.topic,
        'subTopic': quiz.subTopic,
        'total_questions': total,
        'correct_answers': correct,
        'incorrect_answers': incorrect,
        'unanswered': unanswered,
        'accuracy': round(accuracy, 2),
        'questions': QuestionSerializer(questions, many=True).data
    }
    
    return Response(summary_data)


# ==================== SESSION ENDPOINTS ====================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_session(request):
    """Create a new session"""
    session = Session.objects.create(user=request.user)
    return Response(
        SessionSerializer(session).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def end_session(request, session_id):
    """End a session"""
    try:
        session = Session.objects.get(session_id=session_id, user=request.user)
        session.session_active = False
        session.end_time = timezone.now()
        session.save()
        return Response(SessionSerializer(session).data)
    except Session.DoesNotExist:
        return Response(
            {'error': 'Session not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# ==================== SEMANTIC SCHOLAR INTEGRATION ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def semantic_scholar_search(request):
    """Search Semantic Scholar for educational resources"""
    query = request.GET.get('query', '')
    if not query:
        return Response(
            {'error': 'Query parameter required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    fields = request.GET.get('fields', 'title,url,publicationTypes,publicationDate,openAccessPdf,abstract')
    year = request.GET.get('year', '2020-')
    
    url = "http://api.semanticscholar.org/graph/v1/paper/search/bulk"
    api_key = os.environ.get("SEMANTIC_SCHOLAR_API_KEY")
    
    if not api_key:
        return Response(
            {'error': 'SEMANTIC_SCHOLAR_API_KEY not configured'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    headers = {"x-api-key": api_key}
    params = {
        "query": query,
        "fields": fields,
        "year": year,
        "limit": 10
    }
    
    try:
        resp = requests.get(url, params=params, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        return Response({
            'query': query,
            'results': data
        })
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': 'Failed to fetch from Semantic Scholar', 'details': str(e)},
            status=status.HTTP_502_BAD_GATEWAY
        )


# ==================== HELPER FUNCTIONS ====================

def generate_questions_for_quiz(quiz, num_questions=5):
    """Generate initial questions for a quiz using AI"""
    topic = quiz.topic
    subtopic = quiz.subTopic
    difficulty = quiz.grade or 5  # Default to grade 5 if not specified
    
    prompt = f"""Generate {num_questions} educational multiple-choice questions about {topic}"""
    if subtopic:
        prompt += f" focusing on {subtopic}"
    prompt += f""".
    
The questions should be appropriate for grade {difficulty} level.

For each question, provide:
1. The question text
2. Four answer options (A, B, C, D)
3. The correct answer (letter)
4. A brief explanation of why the answer is correct
5. A difficulty level (1-5, where {difficulty} is the target)

Return the response as a JSON array with this structure:
[
  {{
    "question_text": "Question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "B",
    "explanation": "Explanation here",
    "difficulty": 3
  }}
]

Make sure the questions are educational, factually accurate, and engaging."""
    
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert educational content creator. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        response_text = completion.choices[0].message.content
        
        if not response_text:
            raise Exception("Empty response from OpenAI")
        
        # Extract JSON from response
        start = response_text.find('[')
        end = response_text.rfind(']') + 1
        if start != -1 and end > start:
            json_text = response_text[start:end]
            questions_data = json.loads(json_text)
        else:
            questions_data = json.loads(response_text)
        
        # Create Question objects
        for idx, q_data in enumerate(questions_data, start=1):
            options = q_data.get('options') or []
            correct_letter = (q_data.get('correct_answer') or 'A').upper()
            correct_index = ord(correct_letter) - ord('A')
            correct_text = options[correct_index] if options and correct_index < len(options) else (options[0] if options else q_data.get('correct_answer', ''))
            
            Question.objects.create(
                quiz=quiz,
                question_text=q_data.get('question_text', ''),
                question_type=q_data.get('question_type', 'mcq'),
                correct_answer=correct_text,
                options=options,
                difficulty=q_data.get('difficulty', difficulty if isinstance(difficulty, int) else 3),
                why_correct=q_data.get('explanation', ''),
                num=idx
            )
        
    except Exception as e:
        raise Exception(f"Failed to generate questions: {str(e)}")


def generate_adaptive_question(quiz, previous_correct):
    """Generate next question based on user performance"""
    questions = quiz.questions.all()
    answered = questions.filter(correctness__isnull=False).count()
    
    # Calculate current difficulty based on performance
    if answered > 0:
        correct_count = questions.filter(correctness=True).count()
        accuracy = correct_count / answered
        
        # Adjust difficulty based on accuracy
        if accuracy > 0.75:
            target_difficulty = min(5, (quiz.grade or 3) + 1)
        elif accuracy < 0.5:
            target_difficulty = max(1, (quiz.grade or 3) - 1)
        else:
            target_difficulty = quiz.grade or 3
    else:
        target_difficulty = quiz.grade or 3
    
    # Only generate if we need more questions
    if questions.filter(correctness__isnull=True).count() < 2:
        prompt = f"""Generate 1 educational multiple-choice question about {quiz.topic}"""
        if quiz.subTopic:
            prompt += f" focusing on {quiz.subTopic}"
        prompt += f""".
        
The question should be at difficulty level {target_difficulty} (scale 1-5).

Return as JSON:
{{
    "question_text": "Question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "B",
    "explanation": "Explanation here",
    "difficulty": {target_difficulty}
}}"""
        
        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert educational content creator. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            response_text = completion.choices[0].message.content
            
            if not response_text:
                raise Exception("Empty response from OpenAI")
            
            # Extract JSON
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            if start != -1 and end > start:
                json_text = response_text[start:end]
                q_data = json.loads(json_text)
            else:
                q_data = json.loads(response_text)
            
            options = q_data.get('options') or []
            correct_letter = (q_data.get('correct_answer') or 'A').upper()
            correct_index = ord(correct_letter) - ord('A')
            correct_text = options[correct_index] if options and correct_index < len(options) else (options[0] if options else q_data.get('correct_answer', ''))
            
            next_num = questions.count() + 1
            Question.objects.create(
                quiz=quiz,
                question_text=q_data.get('question_text', ''),
                question_type=q_data.get('question_type', 'mcq'),
                correct_answer=correct_text,
                options=options,
                difficulty=q_data.get('difficulty', target_difficulty),
                why_correct=q_data.get('explanation', ''),
                num=next_num
            )
        except Exception as e:
            print(f"Failed to generate adaptive question: {str(e)}")


def check_answer(question, user_answer):
    """Check if user's answer is correct"""
    # Simple comparison of user answer with correct answer
    return user_answer.strip().lower() == question.correct_answer.strip().lower()


def evaluate_short_answer(question_text, correct_answer, user_answer):
    """Use AI to evaluate short answer questions"""
    try:
        prompt = f"""Evaluate if the following answer is correct.

Question: {question_text}
Expected Answer: {correct_answer}
User Answer: {user_answer}

Respond with only 'CORRECT' or 'INCORRECT'."""
        
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert educator evaluating student answers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=10
        )
        
        result = completion.choices[0].message.content
        if result:
            result = result.strip().upper()
            return 'CORRECT' in result
        return False
    except Exception:
        # Fallback to simple string matching
        return user_answer.strip().lower() in correct_answer.strip().lower()


# ==================== ADMIN ENDPOINTS ====================

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_user(request, user_id):
    """Admin: Delete a user (requires staff permission)"""
    if not request.user.is_staff:
        return Response(
            {'error': 'Admin permission required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        user = User.objects.get(id=user_id)
        if user.is_superuser:
            return Response(
                {'error': 'Cannot delete superuser'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.delete()
        return Response({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# ==================== HOME VIEW ====================

def home(request):
    """Serve the React frontend"""
    return render(request, 'index.html')
