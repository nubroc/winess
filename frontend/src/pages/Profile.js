import { API_BASE_URL } from "../config";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({});
  const [imcData, setImcData] = useState(null);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    };

    const fetchIMC = async () => {
      const res = await fetch(`${API_BASE_URL}/imc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setImcData(data);
    };

    const fetchProgram = async () => {
      const res = await fetch(`${API_BASE_URL}/program`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        const data = await res.json();
        setProgram(data);
      }
    };

    const loadData = async () => {
      try {
        await fetchUserProfile();
        await fetchIMC();
        await fetchProgram();
      } catch (err) {
        console.error("Erreur chargement profil:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const getCategorie = (imc) => {
    if (imc < 18.5) return "Maigreur";
    if (imc < 25) return "Corpulence normale";
    if (imc < 30) return "Surpoids";
    return "Obésité";
  };

  if (loading) return <p style={{ color: "white", padding: "2rem" }}>Chargement...</p>;

  return (
    <div style={{ padding: "2rem", color: "white", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Bienvenue {user.username} 👋
      </h2>

      <div style={cardStyle}>
        <h3>Informations personnelles</h3>
        <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
        <p><strong>Email :</strong> {user.email}</p>
      </div>

      {imcData ? (
        <div style={cardStyle}>
          <h3>Dernier IMC</h3>
          <p><strong>Taille :</strong> {imcData.taille} cm</p>
          <p><strong>Poids :</strong> {imcData.poids} kg</p>
          <p><strong>Âge :</strong> {imcData.age} ans</p>
          <p><strong>IMC :</strong> {imcData.imc} ({getCategorie(imcData.imc)})</p>
          <p><strong>Date :</strong> {new Date(imcData.created_at).toLocaleString("fr-FR")}</p>
        </div>
      ) : (
        <p style={{ marginTop: "1rem" }}>Aucun IMC renseigné.</p>
      )}

      {program ? (
        <div style={cardStyle}>
          <h3>Programme sportif</h3>
          <p><strong>{program.programme}</strong></p>
          <img
            src={program.image_url}
            alt={program.programme}
            style={{ width: "100%", maxWidth: "400px", borderRadius: "10px", marginTop: "1rem" }}
          />
        </div>
      ) : (
        <p style={{ marginTop: "1rem" }}>Aucun programme enregistré.</p>
      )}
    </div>
  );
};

const cardStyle = {
  backgroundColor: "#1e1e1e",
  padding: "1.5rem",
  borderRadius: "10px",
  marginBottom: "2rem",
  boxShadow: "0 0 10px rgba(255, 255, 255, 0.05)",
};

export default Profile;
