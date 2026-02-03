from django.db import models
from django.contrib.auth.models import User
import uuid


def generate_room_code():
    return str(uuid.uuid4())[:6].upper()


class Room(models.Model):
    code = models.CharField(max_length=6, unique=True, default=generate_room_code)
    topic = models.CharField(max_length=200)
    host = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code



class Player(models.Model):
    name = models.CharField(max_length=100)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="players")

    def __str__(self):
        return f"{self.name} ({self.room.code})"



class QuizResult(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="results")
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    score = models.IntegerField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("room", "player")  

    def __str__(self):
        return f"{self.player.name} - {self.room.code} - {self.score}"
