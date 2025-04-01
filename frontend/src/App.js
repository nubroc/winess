import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import de Routes et Route pour la version 6
import Navbar from "./components/Navbar";
// import Card from "./components/Card";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dietetic from "./pages/Dietetic";
import Dashboard from "./pages/Dashboard";
import "./styles.css";
import Welcome from "./pages/Welcome";
import BMI from "./pages/BMI";
import SportProgram from "./pages/SportProgram";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        {/* Utilisation de Routes au lieu de Switch */}
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/profil" element={<div>Page Profil</div>} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/sport-program" element={<SportProgram />} />
          <Route
            path="/sport-program"
            element={<div>Page Sport Program</div>}
          />
          <Route path="/dietetic" element={<Dietetic />} />
          <Route path="/bmi" element={<div>Page BMI</div>} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
