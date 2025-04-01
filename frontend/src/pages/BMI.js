import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BMI = () => {
  const [taille, setTaille] = useState("");
  const [poids, setPoids] = useState("");
  const [age, setAge] = useState("");
  const [imcData, setImcData] = useState(null);
  const [bmiList, setBmiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategorie = (imc) => {
    if (imc < 18.5) return { label: "Maigreur", color: "white" };
    if (imc < 25) return { label: "Corpulence normale", color: "white" };
    if (imc < 30) return { label: "Surpoids", color: "white" };
    return { label: "Obésité", color: "white" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tailleM = parseFloat(taille) / 100;
    const poidsKg = parseFloat(poids);
    const result = parseFloat((poidsKg / (tailleM * tailleM)).toFixed(2));
    const token = localStorage.getItem("token");

    if (!token) return alert("Veuillez vous connecter.");

    try {
      const res = await fetch("http://localhost:5000/imc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taille,
          poids,
          imc: result,
          age,
        }),
      });

      const data = await res.json();
      console.log("✅ IMC enregistré :", data);
      fetchIMC();
      fetchHistory();
    } catch (err) {
      console.error("❌ Erreur enregistrement IMC :", err);
    }

    setTaille("");
    setPoids("");
    setAge("");
  };

  const fetchIMC = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/imc", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setImcData(data);
      } else {
        setImcData(null);
      }
    } catch (err) {
      console.error("Erreur récupération IMC :", err);
    }
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/imc/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((entry) => ({
          ...entry,
          date: new Date(entry.created_at).toLocaleString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          }),
        }));
        setBmiList(formatted);
      }
    } catch (err) {
      console.error("Erreur historique IMC :", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      await fetchIMC();
      await fetchHistory();
      setLoading(false);
    };
    loadAll();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "white", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", color: "red" }}>Suivi IMC</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : imcData === null ? (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#facc15" }}>
          <h3>👋 Bienvenue !</h3>
          <p>
            Vous n'avez pas encore renseigné votre IMC. Veuillez remplir le formulaire ci-dessous pour commencer.
          </p>
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p>Dernier IMC : <strong>{imcData.imc}</strong></p>
            <p>Catégorie : <span style={{ color: getCategorie(imcData.imc).color }}>{getCategorie(imcData.imc).label}</span></p>
            <p>Poids : {imcData.poids} kg | Taille : {imcData.taille} cm | Âge : {imcData.age}</p>
            <p>Date : {new Date(imcData.created_at).toLocaleString("fr-FR")}</p>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ textAlign: "center" }}>Historique des IMC</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bmiList}>
                <Line type="monotone" dataKey="imc" stroke="#00ccff" strokeWidth={2} />
                <CartesianGrid stroke="#444" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, "auto"]} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <div style={{ marginTop: "3rem", maxWidth: "300px", marginInline: "auto" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <input type="number" placeholder="Taille en cm" value={taille} onChange={(e) => setTaille(e.target.value)} required />
          <input type="number" placeholder="Poids en kg" value={poids} onChange={(e) => setPoids(e.target.value)} required />
          <input type="number" placeholder="Âge" value={age} onChange={(e) => setAge(e.target.value)} required />
          <button
            type="submit"
            style={{
              backgroundColor: "#facc15",
              border: "none",
              padding: "0.6rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  );
};

export default BMI;
