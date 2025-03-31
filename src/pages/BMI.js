import { useState } from "react";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const tailleM = parseFloat(taille) / 100;
    const poidsKg = parseFloat(poids);
    const result = parseFloat((poidsKg / (tailleM * tailleM)).toFixed(2));
    setImc(result);

    const cat = getCategorie(result);
    setCategorie(cat);

    const poidsCible = 24.9 * (tailleM * tailleM);
    const diff = (poidsKg - poidsCible).toFixed(1);
    setObjectifPoids(diff > 0 ? diff : 0);

    const newEntry = {
      date: new Date().toLocaleTimeString(),
      imc: result,
    };
    setBmiList((prev) => [...prev, newEntry]);

    // 🔐 Envoi vers le backend
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/imc", {
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
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ IMC enregistré :", data))
        .catch((err) => console.error("❌ Erreur enregistrement IMC :", err));
    }

    // reset inputs
    setTaille("");
    setPoids("");
    setAge("");
  };

  return (
    <div>
      <h2 style={{ color: "red" }}>Calcul IMC</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Taille en cm"
          value={taille}
          onChange={(e) => setTaille(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Poids en kg"
          value={poids}
          onChange={(e) => setPoids(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Âge"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit">Calculer</button>
      </form>

      {imc && (
        <div>
          <p>Vous avez un IMC de : <strong>{imc}</strong></p>
          <p>
            Votre IMC indique :{" "}
            <span style={{ color: categorie.color }}>{categorie.label}</span>
          </p>

          {objectifPoids > 0 && (
            <p>
              Vous devez perdre <strong>{objectifPoids} kg</strong> pour atteindre un IMC{" "}
              <span style={{ color: "green" }}>Corpulence normale</span>
            </p>
          )}

          <table border="1" cellPadding="10" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Niveau</th>
                <th>Programme conseillé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Débutant</td>
                <td><u>Perte de poids</u></td>
              </tr>
              <tr>
                <td>Intermédiaire</td>
                <td><u>Début Solid</u></td>
              </tr>
              <tr>
                <td>Confirmé</td>
                <td><u>Solid Shred</u></td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: "2rem" }}>Historique des IMC</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bmiList}>
              <Line type="monotone" dataKey="imc" stroke="#8884d8" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
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
