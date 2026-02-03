from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Room, Player, QuizResult
from groq import Groq
import re
import json
import os





@csrf_exempt
def create_room(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)
    topic = data.get("topic")

    if not topic:
        return JsonResponse({"error": "Topic required"}, status=400)

    room = Room.objects.create(topic=topic)

    return JsonResponse({
        "roomCode": room.code,
        "topic": room.topic
    })



@api_view(["POST"])
def generate_quiz(request):
    topic = request.data.get("topic", "")

    groq_api_key = os.getenv("GROQ_API_KEY")

    prompt =prompt = f""" Generate 5 MCQ questions about {topic}. 
    Output must be ONLY valid JSON array, no extra words. Format example: 
    [ {{ "question": "Q?", "options": 
    {{"A": "opt1", "B": "opt2", "C": "opt3", "D": "opt4"}}
    , "answer": "A" }} ] """

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    raw_output = completion.choices[0].message.content.strip()

    match = re.search(r"\[[\s\S]*\]", raw_output)
    if not match:
        return Response({"error": "Model did not return JSON"}, status=500)

    try:
        quiz_data = json.loads(match.group(0))
        return Response({"quiz": quiz_data})
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON"}, status=500)



@api_view(["POST"])
def submit_quiz(request):
    room_code = request.data.get("room_code")
    player_name = request.data.get("player_name")
    score = request.data.get("score")

    if not all([room_code, player_name, score is not None]):
        return Response({"error": "Invalid data"}, status=400)

    room = Room.objects.get(code=room_code)

    player, _ = Player.objects.get_or_create(
        name=player_name,
        room=room
    )

    QuizResult.objects.update_or_create(
        room=room,
        player=player,
        defaults={"score": score}
    )

    return Response({"status": "saved"})


@api_view(["GET"])
def leaderboard(request, room_code):
    results = (
        QuizResult.objects
        .filter(room__code=room_code)
        .select_related("player")
        .order_by("-score")
    )

    data = [
        {
            "username": r.player.name,   
            "score": r.score
        }
        for r in results
    ]

    return Response(data)
