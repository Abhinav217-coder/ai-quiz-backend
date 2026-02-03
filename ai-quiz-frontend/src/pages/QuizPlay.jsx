import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateQuiz } from "../services/api";

export default function QuizPlay() {
  const location = useLocation();
  const navigate = useNavigate();

  const topic =
    location.state?.topic || localStorage.getItem("quizTopic");

  const playerName = localStorage.getItem("playerName");
  const roomCode = localStorage.getItem("roomCode");

  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

 
  useEffect(() => {
    if (!topic) return;

    generateQuiz(topic).then((res) => {
      setQuiz(res.data.quiz);
    });
  }, [topic]);

  
  useEffect(() => {
    if (!window.socket) return;

    const handler = async (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "quiz_end") {
        navigate(`/leaderboard/${roomCode}`);
      }
    };

    window.socket.addEventListener("message", handler);
    return () => window.socket.removeEventListener("message", handler);
  }, [navigate, roomCode]);

  
  const handleSelect = (opt) => {
    setSelected(opt);

    const correct = opt === quiz[current].answer;
    if (correct) setScore((s) => s + 1);

    window.socket.send(JSON.stringify({
      action: "answer",
      name: playerName,
      correct
    }));

    setTimeout(async () => {
      setSelected(null);

      if (current < quiz.length - 1) {
        setCurrent((c) => c + 1);
      } else {
      
        setFinished(true);

       
        await fetch("http://127.0.0.1:8000/api/submit-quiz/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_code: roomCode,
            player_name: playerName,
            score
          })
        });

        window.socket.send(JSON.stringify({
          action: "finished",
          name: playerName
        }));
      }
    }, 800);
  };

 
  if (finished) {
    return (
      <div className="container text-center mt-5">
        <h3>Waiting for other players to finish…</h3>
        <p>Your score: <b>{score}</b></p>
      </div>
    );
  }

  if (!quiz.length) return <h3>Loading...</h3>;

  const q = quiz[current];

  return (
    <div className="container p-5">
      <h4>Score: <b>{score}</b></h4>

      <h5 className="mt-3">
        {current + 1}. {q.question}
      </h5>

      <div className="list-group mt-3">
        {Object.keys(q.options).map((opt) => (
          <button
            key={opt}
            className="list-group-item list-group-item-action"
            onClick={() => handleSelect(opt)}
            disabled={selected !== null}
          >
            <b>{opt}</b>: {q.options[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}
