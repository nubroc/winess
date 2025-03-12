import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/login", { username, password });
      localStorage.setItem("token", data.token);
      setMessage("Connexion réussie !");
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Nom d'utilisateur" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Se connecter</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
