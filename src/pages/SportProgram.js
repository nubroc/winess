import { useEffect, useState } from "react";

const SportProgram = () => {
  const [imc, setImc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/imc", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setImc(data.imc);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération IMC :", err);
        setLoading(false);
      });
  }, []);

  const getProgramme = () => {
    if (!imc) return "Aucun programme disponible";

    if (imc < 18.5) return "Programme prise de masse (débutant)";
    if (imc < 25) return "Programme classique de maintien";
    if (imc < 30) return "Programme perte de poids";
    return "Programme intensif + suivi nutritionnel";
  };

  return (
    <div style={{ color: "white", textAlign: "center", paddingTop: "2rem" }}>
      <h2>Page Sport Program</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : imc ? (
        <>
          <p>Votre IMC est : <strong>{imc}</strong></p>
          <p>Programme recommandé :</p>
          <h3 style={{ color: "orange" }}>{getProgramme()}</h3>
        </>
      ) : (
        <p>Aucun IMC trouvé. Veuillez d'abord le calculer.</p>
      )}
    </div>
  );
};

export default SportProgram;
