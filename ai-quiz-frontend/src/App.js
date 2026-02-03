import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Lobby from "./pages/Lobby";
import QuizPlay from "./pages/QuizPlay";
import Home from "./pages/Home";
import JoinRoom from "./pages/JoinRoom";
import CreateRoom from "./pages/CreateRoom";
import Leaderboard from "./pages/Leaderboard";



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/quiz" element={<QuizPlay/>} />
        <Route path="/join" element = {<JoinRoom/>}/>
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/leaderboard/:roomCode" element={<Leaderboard />} />






      </Routes>
    </BrowserRouter>
  );
}

export default App;
