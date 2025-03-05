import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <button className="btn upload-btn" onClick={() => alert("Upload Clicked")}>
        <img src="/upload-btn.png" alt="Upload PDF" />
      </button>
      <button className="btn evaluate-btn" onClick={() => alert("Evaluate Clicked")}>
        <img src="/evaluate-btn.png" alt="Evaluate PDF" />
      </button>
      <button className="btn list-btn" onClick={() => navigate("/pdf-list")}>
        <img src="/list-btn.png" alt="PDF List" />
      </button>
    </div>
  );
};

export default Home;
