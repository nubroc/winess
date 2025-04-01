import { useEffect, useState } from "react";

const SportProgram = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const programs = [
    {
      range: [0, 18.5],
      name: "Programme prise de masse",
      image: "/images/prise_masse.png",
      description: "Pour les personnes en dessous du poids idéal, ce programme vise à développer la masse musculaire et l’appétit de façon saine.",
    },
    {
      range: [18.5, 25],
      name: "Programme maintien & renforcement",
      image: "/images/renforcement.png",
      description: "Conçu pour entretenir sa condition physique et tonifier son corps sans objectif de perte ou prise de poids.",
    },
    {
      range: [25, 30],
      name: "Programme perte de poids",
      image: "/images/perte_poids.png",
      description: "Axé sur la combustion des graisses et le renforcement musculaire progressif pour retrouver la forme.",
    },
    {
      range: [30, 100],
      name: "Programme intensif + suivi diététique",
      image: "/images/intensif.png",
      description: "Un accompagnement renforcé pour les personnes en situation d'obésité, combinant sport et alimentation stricte.",
    },
  ];

  const handleSelect = async (program) => {
    if (!token) return alert("Connectez-vous pour enregistrer un programme.");
    setLoading(true);

    try {
      await fetch("http://localhost:5000/program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imc: 0, // ou vous pouvez mettre null si le backend accepte
          programme: program.name,
          image_url: program.image,
        }),
      });
      setSelectedProgram(program.name);
      alert("✅ Programme sélectionné !");
    } catch (err) {
      console.error("❌ Erreur enregistrement programme :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white", textAlign: "center" }}>
      <h2 style={{ marginBottom: "2rem", color: "#facc15" }}>🏋️‍♂️ Choisissez votre programme sportif</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
        {programs.map((program, index) => (
          <div
            key={index}
            style={{
              width: "260px",
              background: "#1e1e1e",
              borderRadius: "12px",
              padding: "1rem",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <img
              src={program.image}
              alt={program.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h3 style={{ marginTop: "1rem", color: "#facc15" }}>{program.name}</h3>
            <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "#ccc" }}>
              {program.description}
            </p>
            <button
              onClick={() => handleSelect(program)}
              disabled={loading}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: selectedProgram === program.name ? "#22c55e" : "#facc15",
                border: "none",
                borderRadius: "8px",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {selectedProgram === program.name ? "✅ Sélectionné" : "Choisir"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportProgram;
