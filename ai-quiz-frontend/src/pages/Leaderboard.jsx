import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Leaderboard() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomCode) return;

    fetch(`http://127.0.0.1:8000/api/leaderboard/${roomCode}/`)
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [roomCode]);

  if (loading) {
    return <h3 className="text-center mt-5">Loading leaderboard...</h3>;
  }

  return (
    <div className="container p-5">
      <h2 className="text-center mb-4">🏆 Leaderboard</h2>

      {leaderboard.length === 0 ? (
        <p className="text-center">No results found.</p>
      ) : (
        <table className="table table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{player.username}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="text-center mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
