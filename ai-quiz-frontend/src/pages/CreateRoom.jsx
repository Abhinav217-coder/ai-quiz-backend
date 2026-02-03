import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../services/socket";

export default function CreateRoom() {

  const [topic, setTopic] = useState("");
  const [hostName, setHostName] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {

    if (!hostName || !topic) {
      alert("Enter name and topic");
      return;
    }

    try {
     
      const res = await fetch("http://localhost:8000/api/create-room/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({ topic })
      });

    if (!res.ok) {
  const text = await res.text();
  console.log("SERVER ERROR:", text);
  alert("Create room failed — check Django console");
  return;
}

      const data = await res.json();
      const roomCode = data.roomCode;

      if (!roomCode) {
        alert("Invalid server response");
        return;
      }

     
      localStorage.setItem("roomCode", roomCode);
      localStorage.setItem("playerName", hostName);
      localStorage.setItem("topic", topic);
      localStorage.setItem("isHost", "true");

     
      const socket = connectSocket(roomCode);

      socket.onopen = () => {
        socket.send(JSON.stringify({
          action: "join",
          name: hostName
        }));
      };

      socket.onmessage = (e) => {
        console.log("ROOM UPDATE:", JSON.parse(e.data));
      };

      window.socket = socket;

      navigate("/lobby");

    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">

      <div className="card shadow-lg p-4" style={{ width: "450px" }}>

        <h3 className="text-center mb-4">Create Room</h3>

        <input
          className="form-control mb-3"
          placeholder="Your Name"
          onChange={e => setHostName(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Quiz Topic"
          onChange={e => setTopic(e.target.value)}
        />

        <button
          className="btn btn-success w-100"
          onClick={createRoom}
        >
          Create Room
        </button>

      </div>

    </div>
  );
}
