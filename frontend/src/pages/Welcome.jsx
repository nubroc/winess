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
    <div>
      {user ? (
        <>
          <h2>Bienvenue {user.username} !</h2>
          <p>Email : {user.email}</p>

          <h3>Que souhaites-tu faire ?</h3>
          <ul>
            <li>
              <Link to="/profil">Accéder à mon profil</Link>
            </li>
            <li>
              <Link to="/bmi">Calculer mon IMC</Link>
            </li>
            <li>
              <Link to="/sport-program">Voir mon programme sportif</Link>
            </li>
            <li>
              <Link to="/dietetic">Consulter mes conseils diététiques</Link>
            </li>
          </ul>
        </>
      ) : (
        <p>{message || "Chargement..."}</p>
      )}
    </div>
  );
};

export default Welcome;
