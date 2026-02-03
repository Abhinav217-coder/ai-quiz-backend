import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../services/socket";

export default function Lobby() {
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [players, setPlayers] = useState([]);

  const roomCode = localStorage.getItem("roomCode");
  const topic = localStorage.getItem("topic");
  console.log("LOBBY TOPIC =", topic);

  const playerName = localStorage.getItem("playerName");
  const isHost = localStorage.getItem("isHost") === "true"

  useEffect(() => {
    if (!roomCode || !playerName) {
      navigate("/");
      return;
    }

    
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      return;
    }

    const socket = connectSocket(roomCode);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          action: "join",
          name: playerName,
          topic: isHost ? topic : null, 
        })
      );
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("WS DATA:", data);

      if (data.type === "players") {
        setPlayers(data.players || []);
      }

      
      if (data.type === "start") {
        localStorage.setItem("quizTopic", data.topic);
        navigate("/quiz", { state: { topic: data.topic } });
      }
    };

    socket.onerror = (e) => {
      console.error("WebSocket error", e);
    };
  }, [roomCode, playerName, topic, isHost, navigate]);

  const startQuiz = () => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Socket not open");
      return;
    }

    socket.send(
      JSON.stringify({
        action: "start",
        name: playerName,
      })
    );
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4 text-center" style={{ width: "500px" }}>
        <h3 className="mb-3">Lobby</h3>

        <h5>Room Code</h5>
        <div className="display-6 mb-3">{roomCode}</div>

        <h6>Topic</h6>
        <div className="mb-3">{topic}</div>

        <hr />

        <h5>Players Joined</h5>
        <ul className="list-group mb-3">
          {players.map((p, i) => (
            <li key={i} className="list-group-item">
              {p}
            </li>
          ))}
        </ul>

        
        {isHost && (
          <button className="btn btn-success" onClick={startQuiz}>
            Start Quiz
          </button>
        )}
      </div>
    </div>
  );
}
