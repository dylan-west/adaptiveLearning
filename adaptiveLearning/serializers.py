from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Session, Quiz, Book, Question


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        if len(attrs['password']) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters long."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'].lower(),
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['session_id', 'user', 'end_time', 'session_active']
        read_only_fields = ['session_id', 'user']
    
    def validate(self, attrs):
        from django.utils import timezone
        if attrs.get('end_time') and attrs.get('end_time') < timezone.now():
            raise serializers.ValidationError(
                {"end_time": "End time cannot be in the past."}
            )
        return attrs


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'question_id', 'quiz', 'question_text', 'question_type',
            'options', 'difficulty', 'correct_answer', 'correctness',
            'why_correct', 'num'
        ]
        read_only_fields = ['question_id']


class QuestionAnswerSerializer(serializers.Serializer):
    """Serializer for submitting an answer to a question"""
    user_answer = serializers.CharField(required=True, allow_blank=False)
    
    def validate_user_answer(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Answer cannot be empty.")
        return value.strip()


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['book_id', 'quiz', 'author', 'date', 'name']
        read_only_fields = ['book_id']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    books = BookSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = [
            'quiz_id', 'user', 'topic', 'subTopic',
            'publication_year', 'semantic_scholar_data', 
            'created_at', 'questions', 'books'
        ]
        read_only_fields = ['quiz_id', 'user', 'created_at', 'semantic_scholar_data']


class QuizCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new quiz"""
    class Meta:
        model = Quiz
        fields = ['topic', 'subTopic', 'publication_year']
    
    def validate_topic(self, value):
        # Validate against common Semantic Scholar fields of study
        valid_fields = [
            'Computer Science', 'Medicine', 'Chemistry', 'Biology', 
            'Materials Science', 'Physics', 'Geology', 'Psychology',
            'Art', 'History', 'Geography', 'Sociology', 'Business',
            'Political Science', 'Economics', 'Philosophy', 'Mathematics',
            'Engineering', 'Environmental Science', 'Education'
        ]
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Field of study is required.")
        if value not in valid_fields:
            raise serializers.ValidationError(f"Invalid field of study. Must be one of: {', '.join(valid_fields)}")
        return value.strip()
    
    def validate_subTopic(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Specific topic is required and must be at least 2 characters long.")
        return value.strip()


class QuizSummarySerializer(serializers.Serializer):
    """Serializer for quiz summary data"""
    quiz_id = serializers.IntegerField()
    topic = serializers.CharField()
    subTopic = serializers.CharField()
    total_questions = serializers.IntegerField()
    correct_answers = serializers.IntegerField()
    incorrect_answers = serializers.IntegerField()
    unanswered = serializers.IntegerField()
    accuracy = serializers.FloatField()
    questions = QuestionSerializer(many=True, read_only=True)
