from django.db import models
from django.conf import settings

"""Domain models derived from provided class diagram.

Diagram Entities:
  User (user_id, name, email, password) -> Using Django's built-in user model (settings.AUTH_USER_MODEL).
  Session (session_id, user_id, end_time, session_active)
  Quiz (quiz_id, user_id, topic, subTopic, grade, prompt)
  Book (book_id, quiz_id, author, date, name)
  Question (question_id, quiz_id, correct_answer, correctness, why_correct, num)

Notes:
  - Primary keys use AutoField via explicit naming for clarity with diagram.
  - "correctness" stored as a nullable boolean (True/False/unknown) plus optional explanation.
  - "grade" assumed numeric (e.g., integer score); adjust if letter grades needed.
  - "date" on Book stored as DateField; use DateTimeField if time precision is required.
  - ForeignKey cascade deletes dependent records when parent removed.
"""


class Session(models.Model):
	session_id = models.AutoField(primary_key=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sessions")
	end_time = models.DateTimeField(null=True, blank=True)
	session_active = models.BooleanField(default=True)

	class Meta:
		indexes = [
			models.Index(fields=["user", "session_active"]),
		]
		ordering = ["-session_id"]

	def __str__(self) -> str:
		status = "active" if self.session_active else "closed"
		return f"Session {self.session_id} ({status}) for user {self.user.id}"


class Quiz(models.Model):
	quiz_id = models.AutoField(primary_key=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quizzes")
	topic = models.CharField(max_length=200)
	subTopic = models.CharField(max_length=200, blank=True)
	grade = models.IntegerField(null=True, blank=True)
	prompt = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		indexes = [
			models.Index(fields=["user", "topic"]),
		]
		ordering = ["-created_at"]

	def __str__(self) -> str:
		return f"Quiz {self.quiz_id} ({self.topic}) for user {self.user.id}"


class Book(models.Model):
	book_id = models.AutoField(primary_key=True)
	quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="books")
	author = models.CharField(max_length=200, blank=True)
	date = models.DateField(null=True, blank=True)
	name = models.CharField(max_length=300)

	class Meta:
		indexes = [
			models.Index(fields=["quiz", "name"]),
		]
		ordering = ["name"]

	def __str__(self) -> str:
		return f"Book {self.name} (quiz {self.quiz.quiz_id})"


class Question(models.Model):
	question_id = models.AutoField(primary_key=True)
	quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
	question_text = models.TextField()
	question_type = models.CharField(max_length=20, choices=[('mcq', 'Multiple Choice'), ('short_answer', 'Short Answer')], default='mcq')
	correct_answer = models.TextField()
	# For MCQs, store as JSON array of strings
	options = models.JSONField(null=True, blank=True, help_text="MCQ options including correct answer")
	difficulty = models.IntegerField(default=1, help_text="Difficulty level: 1 (easy) to 5 (hard)")
	# correctness: True if user answered correctly, False if incorrect, None if not answered yet
	correctness = models.BooleanField(null=True, blank=True)
	user_answer = models.TextField(blank=True, null=True)
	why_correct = models.TextField(blank=True, help_text="Explanation of the correct answer")
	source_reference = models.TextField(blank=True, help_text="Reference to source material")
	num = models.IntegerField(help_text="Position/order within the quiz")
	answered_at = models.DateTimeField(null=True, blank=True)

	class Meta:
		unique_together = ("quiz", "num")
		ordering = ["num"]

	def __str__(self) -> str:
		return f"Question {self.num} for quiz {self.quiz.quiz_id}"
