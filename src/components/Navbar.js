import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo">winess</div>

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
