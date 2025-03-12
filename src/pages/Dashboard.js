import React from "react";
import { Link } from "react-router-dom"; // Import de Routes et Route pour la version 6
import Card from "../components/Card";

const Dashboard = () => {
  return (
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
  );
};

export default Dashboard;
