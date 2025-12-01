from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/user/', views.current_user, name='current_user'),
    
    # Quiz Management
    path('quizzes/', views.list_quizzes, name='list_quizzes'),
    path('quizzes/create/', views.create_quiz, name='create_quiz'),
    path('quizzes/<int:quiz_id>/', views.get_quiz, name='get_quiz'),
    path('quizzes/<int:quiz_id>/delete/', views.delete_quiz, name='delete_quiz'),
    path('quizzes/<int:quiz_id>/summary/', views.get_quiz_summary, name='get_quiz_summary'),
    
    # Questions
    path('quizzes/<int:quiz_id>/next-question/', views.get_next_question, name='get_next_question'),
    path('questions/<int:question_id>/answer/', views.submit_answer, name='submit_answer'),
    
    # Sessions
    path('sessions/create/', views.create_session, name='create_session'),
    path('sessions/<int:session_id>/end/', views.end_session, name='end_session'),
    
    # Semantic Scholar
    path('semantic-scholar/search/', views.semantic_scholar_search, name='semantic_scholar_search'),
    
    # Admin
    path('admin/users/<int:user_id>/delete/', views.admin_delete_user, name='admin_delete_user'),
]
