import json
from channels.generic.websocket import AsyncWebsocketConsumer

rooms = {}

class QuizConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_code = self.scope["url_route"]["kwargs"]["room_code"]
        self.group_name = f"quiz_{self.room_code}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        if self.room_code not in rooms:
            rooms[self.room_code] = {
                "players": [],
                "scores": {},
                "finished": set(),
                "topic": None
            }

        print("ROOM STATE:", rooms[self.room_code])

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")
        room = rooms[self.room_code]

       
        if action == "join":
            name = data["name"]

            if room["topic"] is None:
                room["topic"] = data.get("topic")

            if name not in room["players"]:
                room["players"].append(name)
                room["scores"][name] = 0

            await self.broadcast_state()

       
        elif action == "answer":
            name = data["name"]
            correct = data.get("correct", False)

            if correct:
                room["scores"][name] += 1

            await self.broadcast_state()

       
        elif action == "start":
            print("QUIZ START REQUEST")

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "quiz_start",
                    "topic": room["topic"]
                }
            )

     
        elif action == "finished":
            name = data["name"]
            room["finished"].add(name)

            print(f"{name} FINISHED ({len(room['finished'])}/{len(room['players'])})")

            
            if len(room["finished"]) == len(room["players"]):
                await self.channel_layer.group_send(
                    self.group_name,
                    {"type": "quiz_end"}
                )

    async def broadcast_state(self):
        room = rooms[self.room_code]

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_update",
                "payload": {
                    "players": room["players"],
                    "scores": room["scores"],
                    "finished": list(room["finished"])
                }
            }
        )

    async def room_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "players",
            **event["payload"]
        }))

   
    async def quiz_start(self, event):
        await self.send(text_data=json.dumps({
            "type": "start",
            "topic": event["topic"]
        }))

    async def quiz_end(self, event):
        await self.send(text_data=json.dumps({
            "type": "quiz_end"
        }))
