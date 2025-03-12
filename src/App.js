import React from "react";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="grid">
        <Card image="/images/profil.jpg" title="PROFIL" />
        <Card image="/images/sport.jpg" title="SPORT PROGRAM" />
        <Card image="/images/dietetic.jpg" title="DIETETIC" />
        <Card image="/images/bmi.jpg" title="BMI" />
      </div>
    </div>
  );
}

export default App;
