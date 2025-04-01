import { useEffect, useState } from "react";
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
  const [imc, setImc] = useState(null);
  const [categorie, setCategorie] = useState("");
  const [objectifPoids, setObjectifPoids] = useState(null);
  const [bmiList, setBmiList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [lastIMC, setLastIMC] = useState(null);

  const token = localStorage.getItem("token");

  const getCategorie = (imc) => {
    if (imc < 18.5) return { label: "Maigreur", color: "blue" };
    if (imc < 25) return { label: "Corpulence normale", color: "green" };
    if (imc < 30) return { label: "Surpoids", color: "orange" };
    return { label: "Obésité", color: "red" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tailleM = parseFloat(taille) / 100;
    const poidsKg = parseFloat(poids);
    const result = parseFloat((poidsKg / (tailleM * tailleM)).toFixed(2));
    setImc(result);
    setCategorie(getCategorie(result));
    const poidsCible = 24.9 * (tailleM * tailleM);
    const diff = (poidsKg - poidsCible).toFixed(1);
    setObjectifPoids(diff > 0 ? diff : 0);

    try {
      const res = await fetch("http://localhost:5000/imc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taille, poids, imc: result, age }),
      });
      const data = await res.json();
      console.log("✅ IMC enregistré :", data);
      loadLastIMC();
      loadHistory();
      setShowForm(false);
    } catch (err) {
      console.error("❌ Erreur enregistrement IMC :", err);
    }

    setTaille("");
    setPoids("");
    setAge("");
  };

  const loadHistory = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/imc/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    } catch (err) {
      console.error("❌ Erreur historique IMC :", err);
    }
  };

  const loadLastIMC = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/imc", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLastIMC(data);
    } catch (err) {
      console.error("❌ Erreur dernier IMC :", err);
    }
  };

  useEffect(() => {
    loadHistory();
    loadLastIMC();
  }, []);

  return (
    <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
      <h2 style={{ color: "red" }}>Suivi IMC</h2>

      {lastIMC && (
        <>
          <p>Dernier IMC : <strong>{lastIMC.imc}</strong></p>
          <p>
            Catégorie :{" "}
            <span style={{ color: getCategorie(lastIMC.imc).color }}>
              {getCategorie(lastIMC.imc).label}
            </span>
          </p>
          <p>Poids : {lastIMC.poids} kg | Taille : {lastIMC.taille} cm | Âge : {lastIMC.age}</p>
          <p>Date : {new Date(lastIMC.created_at).toLocaleString("fr-FR")}</p>
        </>
      )}

      <h3 style={{ marginTop: "2rem" }}>Historique des IMC</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={bmiList}>
          <Line type="monotone" dataKey="imc" stroke="#00ccff" strokeWidth={2} />
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, "auto"]} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>

      <button onClick={() => setShowForm(!showForm)} style={{ marginTop: "1rem" }}>
        {showForm ? "Annuler" : "Mettre à jour mon IMC"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <input type="number" placeholder="Taille en cm" value={taille} onChange={(e) => setTaille(e.target.value)} required />
          <input type="number" placeholder="Poids en kg" value={poids} onChange={(e) => setPoids(e.target.value)} required />
          <input type="number" placeholder="Âge" value={age} onChange={(e) => setAge(e.target.value)} required />
          <button type="submit">Valider</button>
        </form>
      )}
    </div>
  );
};

export default BMI;
