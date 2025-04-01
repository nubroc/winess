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

    const token = localStorage.getItem("token");
    if (!token) return alert("Vous devez être connecté");

    try {
      const res = await fetch("http://localhost:5000/imc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taille, poids, imc: result, age }),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      console.log("✅ IMC enregistré :", data);
      loadHistory();
    } catch (err) {
      console.error("❌ Erreur enregistrement IMC :", err.message);
    }

    setTaille("");
    setPoids("");
    setAge("");
  };

  const loadHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/imc/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur API historique");
      const data = await res.json();

      const formatted = data.map((entry) => ({
        ...entry,
        date: new Date(entry.created_at).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      }));

      setBmiList(formatted);
    } catch (err) {
      console.error("❌ Erreur historique IMC :", err.message);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div>
      <h2 style={{ color: "red" }}>Calcul IMC</h2>

      <form onSubmit={handleSubmit}>
        <input type="number" placeholder="Taille en cm" value={taille} onChange={(e) => setTaille(e.target.value)} required />
        <input type="number" placeholder="Poids en kg" value={poids} onChange={(e) => setPoids(e.target.value)} required />
        <input type="number" placeholder="Âge" value={age} onChange={(e) => setAge(e.target.value)} required />
        <button type="submit">Calculer</button>
      </form>

      {imc && (
        <div>
          <p>Vous avez un IMC de : <strong>{imc}</strong></p>
          <p>
            Votre IMC indique : <span style={{ color: categorie.color }}>{categorie.label}</span>
          </p>
          {objectifPoids > 0 && (
            <p>
              Vous devez perdre <strong>{objectifPoids} kg</strong> pour atteindre un IMC{" "}
              <span style={{ color: "green" }}>Corpulence normale</span>
            </p>
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

          <button onClick={() => window.location.reload()} style={{ marginTop: "1rem" }}>
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
};

export default BMI;
