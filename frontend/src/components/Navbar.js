import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Winess Logo" className="logo-image" />
      </Link>

      <div className="buttons">
        {!token ? (
          <>
            <Link to="/login">
              <button>LOGIN</button>
            </Link>
            <Link to="/register">
              <button>REGISTER</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/">
              <button>MENU</button>
            </Link>
            <button onClick={handleLogout}>DÉCONNEXION</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
