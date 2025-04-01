import { useEffect, useState } from "react";

// ✅ Importation d’images locales (chemin relatif au fichier)
import priseMasse from "./images/prise_masse.png";
import maintien from "./images/renforcement.png";
import pertePoids from "./images/perte_poids.png";
import intensif from "./images/intensif.png";

const SportProgram = () => {
  const [imc, setImc] = useState(null);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Liste des programmes associés aux tranches d'IMC
  const programs = [
    {
      range: [0, 18.5],
      name: "Programme prise de masse",
      image: priseMasse,
    },
    {
      range: [18.5, 25],
      name: "Programme maintien & renforcement",
      image: maintien,
    },
    {
      range: [25, 30],
      name: "Programme perte de poids",
      image: pertePoids,
    },
    {
      range: [30, 100],
      name: "Programme intensif + suivi diététique",
      image: intensif,
    },
  ];

  const getProgramForIMC = (value) => {
    return programs.find((p) => value >= p.range[0] && value < p.range[1]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Étape 1 : Récupérer l’IMC
    fetch("http://localhost:5000/imc", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setImc(data.imc);
        const selected = getProgramForIMC(data.imc);
        setProgram(selected);

        // Étape 2 : Vérifier si un programme existe déjà en base
        fetch("http://localhost:5000/program", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (res.status === 404) {
              // Étape 3 : Sinon, on l’enregistre
              fetch("http://localhost:5000/program", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  imc: data.imc,
                  programme: selected.name,
                  image_url: selected.image, // Stocké aussi en base si besoin
                }),
              })
                .then(() => console.log("✅ Programme enregistré"))
                .catch((err) => console.error("Erreur enregistrement :", err));
            }
          })
          .catch((err) => console.error("Erreur vérif programme :", err));
      })
      .catch((err) => console.error("Erreur récupération IMC :", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ color: "white", textAlign: "center", padding: "2rem" }}>
      <h2 style={{ color: "gold" }}>Mon Programme Sportif</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : imc && program ? (
        <>
          <p>Votre IMC : <strong>{imc.toFixed(2)}</strong></p>
          <h3 style={{ marginTop: "1rem" }}>{program.name}</h3>
          <img
            src={program.image}
            alt={program.name}
            style={{ width: "300px", borderRadius: "10px", marginTop: "1rem" }}
          />
        </>
      ) : (
        <p>Aucun programme disponible. Merci de remplir votre IMC dans la section "Calcul IMC".</p>
      )}
    </div>
  );
};

export default SportProgram;
