import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const join = () => {
    if (!name || !room) return;

    const roomCode = room.trim().toUpperCase();

   
    localStorage.setItem("playerName", name);
    localStorage.setItem("roomCode", roomCode);
    localStorage.setItem("isHost", "false");

   
    navigate("/lobby");
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">

      <div className="card shadow p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-4">Join Room</h3>

        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Room Code</label>
          <input
            className="form-control"
            placeholder="Enter room code"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={join}
          disabled={!name || !room}
        >
          Join Room
        </button>

      </div>

    </div>
  );
}
