import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/login`, { username, password });


      localStorage.setItem("token", data.token);
      setMessage("Connexion réussie !");
      navigate("/welcome");
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Connexion</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>

      {message && <p className="login-message">{message}</p>}

      <p className="login-register">
        Pas de compte ? <Link to="/register">Inscrivez-vous</Link>
      </p>
    </div>
  );
};

export default Login;
