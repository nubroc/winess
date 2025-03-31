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
  const [bmiList, setBmiList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taille || !poids) return;

    const tailleM = parseFloat(taille) / 100;
    const poidsKg = parseFloat(poids);
    const result = parseFloat((poidsKg / (tailleM * tailleM)).toFixed(2));

    const newEntry = {
      date: new Date().toLocaleTimeString(),
      imc: result,
    };

    setBmiList((prev) => [...prev, newEntry]);
    setTaille("");
    setPoids("");
  };

  return (
    <div>
      <h2>Calcul de l'IMC</h2>
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
        <button type="submit">Calculer</button>
      </form>

      {bmiList.length > 0 && (
        <>
          <h3>Historique des IMC</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bmiList}>
              <Line type="monotone" dataKey="imc" stroke="#8884d8" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 'auto']} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default BMI;
