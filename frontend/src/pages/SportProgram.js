import { useEffect, useState } from "react";

const SportProgram = () => {
  const [imc, setImc] = useState(null);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  // Programmes associés à l'IMC
  const programs = [
    {
      range: [0, 18.5],
      name: "Programme prise de masse",
      image: "/images/prise_masse.png",
    },
    {
      range: [18.5, 25],
      name: "Programme maintien & renforcement",
      image: "/images/renforcement.png",
    },
    {
      range: [25, 30],
      name: "Programme perte de poids",
      image: "/images/perte_poids.png",
    },
    {
      range: [30, 100],
      name: "Programme intensif + suivi diététique",
      image: "/images/intensif.png",
    },
  ];

  const getProgramForIMC = (value) => {
    return programs.find((p) => value >= p.range[0] && value < p.range[1]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // 1. Récupère l'IMC
    fetch("http://localhost:5000/imc", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setImc(data.imc);
        const selected = getProgramForIMC(data.imc);
        setProgram(selected);

        // 2. Vérifie s’il y a déjà un programme en BDD
        fetch("http://localhost:5000/program", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (res.status === 404) {
              // 3. Si pas de programme en BDD, enregistre-le
              fetch("http://localhost:5000/program", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  imc: data.imc,
                  programme: selected.name,
                  image_url: selected.image,
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
      <h2>Mon Programme Sportif</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : imc && program ? (
        <>
          <p>Votre IMC : <strong>{imc}</strong></p>
          <h3>{program.name}</h3>
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
