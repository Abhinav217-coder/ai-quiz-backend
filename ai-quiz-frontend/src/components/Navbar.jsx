import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const roomCode = localStorage.getItem("roomCode"); 

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          AI Quiz
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item mx-2">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link" to="/create">CreateRoom</Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link" to="/join">Join Room</Link>
            </li>

            {roomCode && (
              <li className="nav-item mx-2">
                <Link
                  className="nav-link"
                  to={`/leaderboard/${roomCode}`}
                >
                  LeaderBoard
                </Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}
