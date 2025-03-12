import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // Import de Routes et Route pour la version 6
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="grid">
          <Link to="/profil">
            <Card image="/images/profil.png" title="PROFIL" />
          </Link>
          <Link to="/sport-program">
            <Card image="/images/sport.png" title="SPORT PROGRAM" />
          </Link>
          <Link to="/dietetic">
            <Card image="/images/dietetic.png" title="DIETETIC" />
          </Link>
          <Link to="/bmi">
            <Card image="/images/bmi.png" title="BMI" />
          </Link>
        </div>
        {/* Utilisation de Routes au lieu de Switch */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profil" element={<div>Page Profil</div>} />
          <Route
            path="/sport-program"
            element={<div>Page Sport Program</div>}
          />
          <Route path="/dietetic" element={<div>Page Dietetic</div>} />
          <Route path="/bmi" element={<div>Page BMI</div>} />
          <Route path="/" />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
