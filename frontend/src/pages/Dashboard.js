import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";

const Dashboard = () => {
  return (
    <div className="grid">
      <div className="ligne">
        <Link className="boutonMenu" to="/profil">
          <Card
            className="un"
            image="/images/profil.png"
            title="PROFIL"
            numero="unn"
          />
        </Link>
        <Link className="boutonMenu" to="/sport-program">
          <Card image="/images/sport.png" title="SPORT PROGRAM" numero="un" />
        </Link>
      </div>
      <div className="ligne">
        <Link className="boutonMenu" to="/dietetic">
          <Card image="/images/dietetic.png" title="DIETETIC" numero="unn" />
        </Link>
        <Link className="boutonMenu" to="/bmi">
          <Card image="/images/bmi.png" title="BMI" numero="unn" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
