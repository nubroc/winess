import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const [imcData, setImcData] = useState(null);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmUsername, setConfirmUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await fetch("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        setUser(profileData);

        const imcRes = await fetch("http://localhost:5000/imc", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const imc = await imcRes.json();
        setImcData(imc);

        const programRes = await fetch("http://localhost:5000/program", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (programRes.status === 200) {
          const progData = await programRes.json();
          setProgram(progData);
        }
      } catch (err) {
        console.error("Erreur chargement profil:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getCategorie = (imc) => {
    if (imc < 18.5) return "Maigreur";
    if (imc < 25) return "Corpulence normale";
    if (imc < 30) return "Surpoids";
    return "Obésité";
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("http://localhost:5000/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirmUsername }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("token");
        setMessage("✅ Compte supprimé.");
        setTimeout(() => {
          navigate("/register");
        }, 2000);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Une erreur est survenue.");
    }
  };

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Chargement...</p>;

  return (
    <div style={{
      padding: "2rem",
      color: "white",
      maxWidth: "800px",
      margin: "2rem auto",
      background: "#111",
      borderRadius: "16px",
      boxShadow: "0 0 20px rgba(255,255,255,0.05)",
    }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        Bienvenue <span style={{ color: "#facc15" }}>{user.username}</span> 👋
      </h2>
      <p style={{ marginBottom: "1rem", color: "#ccc" }}>Email : {user.email}</p>

      <hr style={{ border: "1px solid #333", margin: "1.5rem 0" }} />

      {imcData ? (
        <>
          <h3 style={{ fontSize: "1.3rem", color: "#a3e635" }}>📊 Dernier IMC</h3>
          <ul style={{ paddingLeft: "1rem", lineHeight: "1.8" }}>
            <li>Taille : {imcData.taille} cm</li>
            <li>Poids : {imcData.poids} kg</li>
            <li>Âge : {imcData.age} ans</li>
            <li>IMC : <strong>{imcData.imc}</strong></li>
            <li>Catégorie : {getCategorie(imcData.imc)}</li>
            <li>Date : {new Date(imcData.created_at).toLocaleString("fr-FR")}</li>
          </ul>
        </>
      ) : (
        <p style={{ color: "#888" }}>Aucun IMC renseigné.</p>
      )}

      <hr style={{ border: "1px solid #333", margin: "1.5rem 0" }} />

      {program ? (
        <>
          <h3 style={{ fontSize: "1.3rem", color: "#60a5fa" }}>🏋️‍♂️ Programme Sportif</h3>
          <p style={{ fontStyle: "italic", color: "#ddd" }}>{program.programme}</p>
          <img
            src={program.image_url}
            alt={program.programme}
            style={{ width: "100%", maxWidth: "300px", marginTop: "1rem", borderRadius: "12px" }}
          />
        </>
      ) : (
        <p style={{ color: "#888" }}>Aucun programme enregistré.</p>
      )}

      <hr style={{ border: "1px solid #333", margin: "2rem 0" }} />

      <h3 style={{ color: "#ef4444", fontWeight: "bold" }}>🛑 Supprimer mon compte</h3>
      <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
        Veuillez confirmer votre nom d'utilisateur : <strong>{user.username}</strong>
      </p>
      <input
        type="text"
        value={confirmUsername}
        onChange={(e) => setConfirmUsername(e.target.value)}
        placeholder="Confirmez votre nom d’utilisateur"
        style={{
          padding: "0.6rem",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #444",
          backgroundColor: "#1e1e1e",
          color: "white",
          marginBottom: "1rem",
        }}
      />
      <button
        onClick={handleDelete}
        style={{
          padding: "0.75rem",
          backgroundColor: "#dc2626",
          border: "none",
          color: "white",
          borderRadius: "8px",
          width: "100%",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Supprimer mon compte
      </button>

      {message && (
        <p style={{
          marginTop: "1rem",
          backgroundColor: "#1f1f1f",
          padding: "1rem",
          borderRadius: "6px",
          color: message.includes("✅") ? "#4ade80" : "#f87171",
          fontWeight: "bold",
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Profile;
