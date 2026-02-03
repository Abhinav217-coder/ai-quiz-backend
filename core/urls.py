from django.urls import path
from .views import *

urlpatterns = [
    path("create-room/", create_room),
    path("generate/", generate_quiz),
    path("submit-quiz/", submit_quiz),
    path("leaderboard/<str:room_code>/", leaderboard),
]

