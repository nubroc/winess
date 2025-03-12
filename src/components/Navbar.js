import React from "react";
import { Link } from "react-router-dom"; // Import de Link pour la navigation

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">winess</div>
      <div className="buttons">
        <Link to="/login">
          <button>LOGIN</button>
        </Link>
        <Link to="/register">
          <button>REGISTER</button>
        </Link>
        <Link to="/">
          <button>MENU</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
