import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Welcome = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Utilisateur non connecté");
      return;
    }

    axios
      .get("http://localhost:5000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        setMessage("Erreur lors du chargement du profil");
      });
  }, []);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "2rem",
        color: "white",
        textAlign: "center",
      }}
    >
      {user ? (
        <>
          <h2 style={{ color: "#facc15", fontSize: "2rem" }}>
            👋 Bienvenue <span style={{ color: "#a3e635" }}>{user.username}</span> !
          </h2>
          <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
            ✉️ {user.email}
          </p>

          <h3 style={{ marginTop: "2rem", fontWeight: "normal" }}>
            Que souhaites-tu faire ?
          </h3>

          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            <li style={liStyle}>
              <Link to="/profil" style={linkStyle}>📋 Accéder à mon profil</Link>
            </li>
            <li style={liStyle}>
              <Link to="/bmi" style={linkStyle}>📊 Calculer mon IMC</Link>
            </li>
            <li style={liStyle}>
              <Link to="/sport-program" style={linkStyle}>🏋️‍♂️ Voir mon programme sportif</Link>
            </li>
            <li style={liStyle}>
              <Link to="/dietetic" style={linkStyle}>🥗 Consulter mes conseils diététiques</Link>
            </li>
          </ul>
        </>
      ) : (
        <p style={{ color: "#ccc", fontSize: "1.2rem" }}>
          {message || "Chargement..."}
        </p>
      )}
    </div>
  );
};

const liStyle = {
  margin: "1rem 0",
};

const linkStyle = {
  padding: "0.75rem 1.2rem",
  backgroundColor: "#facc15",
  borderRadius: "10px",
  display: "inline-block",
  textDecoration: "none",
  color: "#000",
  fontWeight: "bold",
  transition: "0.3s ease",
};

export default Welcome;
