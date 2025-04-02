import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const [confirmUsername, setConfirmUsername] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setMessage("Erreur de chargement du profil"));
  }, []);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

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
        setMessage("✅ Compte supprimé avec succès");
        setTimeout(() => {
          navigate("/register");
        }, 2000);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Une erreur est survenue");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", color: "white" }}>
      <h2 style={{ textAlign: "center", color: "#f87171" }}>❌ Supprimer mon compte</h2>

      {user ? (
        <>
          <p style={{ marginBottom: "1rem" }}>
            Pour confirmer la suppression, veuillez entrer votre nom d’utilisateur : <strong>{user.username}</strong>
          </p>
          <input
            type="text"
            placeholder="Nom d’utilisateur"
            value={confirmUsername}
            onChange={(e) => setConfirmUsername(e.target.value)}
            style={{
              padding: "0.5rem",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #444",
              marginBottom: "1rem",
              backgroundColor: "#1e1e1e",
              color: "white",
            }}
          />
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              padding: "0.75rem",
              border: "none",
              borderRadius: "8px",
              width: "100%",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Supprimer définitivement mon compte
          </button>
        </>
      ) : (
        <p>Chargement du profil...</p>
      )}

      {message && (
        <p
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: "#333",
            borderRadius: "6px",
            color: message.includes("✅") ? "#4ade80" : "#f87171",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default DeleteAccount;
