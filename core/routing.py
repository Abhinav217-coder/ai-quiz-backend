from django.urls import re_path
from .consumer import QuizConsumer

websocket_urlpatterns = [
    re_path(r"ws/room/(?P<room_code>\w+)/$", QuizConsumer.as_asgi()),
]
