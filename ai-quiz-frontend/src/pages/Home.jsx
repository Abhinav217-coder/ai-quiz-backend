import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/lobby");
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <div className="card p-5 shadow-lg text-center" style={{ background: "#ffffffdd", width: "450px" }}>
        <h2 className="mb-3">Do you want to play a quiz?</h2>
        <p className="text-muted mb-4">
          Test your knowledge and compete with your friends!
        </p>
        <button className="btn btn-primary btn-lg w-100" onClick={handleStart}>
          Let's Get Started
        </button>
      </div>
    </div>
  );
}
