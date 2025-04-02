import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dietetic from "./pages/Dietetic";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import BMI from "./pages/BMI";
import SportProgram from "./pages/SportProgram";
import Profile from "./pages/Profile";
import DeleteAccount from "./pages/DeleteAccount"; 
import "./styles.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/sport-program" element={<SportProgram />} />
          <Route path="/dietetic" element={<Dietetic />} />
          <Route path="/delete-account" element={<DeleteAccount />} /> {/* New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
