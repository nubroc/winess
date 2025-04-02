import { useState } from "react";
import "../styles.css";
import { API_BASE_URL } from "../config"; 

const Dietetic = () => {
  const [weight, setWeight] = useState(70);
  const [program, setProgram] = useState("");
  const [recipes, setRecipes] = useState([]);

  const generateProgram = () => {
    if (weight < 60) {
      setProgram("Programme pour poids léger : Repas riches en protéines et glucides.");
      setRecipes([
        { name: "Salade de quinoa et poulet", image: "/images/quinoa.png", grammage: "200g" },
        { name: "Smoothie protéiné aux fruits rouges", image: "/images/smoothie.png", grammage: "300ml" },
        { name: "Poêlée de légumes et tofu", image: "/images/tofu.png", grammage: "250g" },
      ]);
    } else if (weight >= 60 && weight < 80) {
      setProgram("Programme équilibré : Apport en protéines, lipides et glucides modérés.");
      setRecipes([
        { name: "Pâtes complètes au saumon", image: "/images/salmon.png", grammage: "300g" },
        { name: "Omelette aux épinards et fromage", image: "/images/omelette.png", grammage: "200g" },
        { name: "Poulet rôti avec patates douces", image: "/images/chicken.png", grammage: "350g" },
      ]);
    } else if (weight >= 80 && weight < 100) {
      setProgram("Programme pour prise de masse : Alimentation riche en calories et en protéines.");
      setRecipes([
        { name: "Steak de bœuf avec riz complet", image: "/images/steak.png", grammage: "400g" },
        { name: "Porridge aux flocons d'avoine et banane", image: "/images/porridge.png", grammage: "300g" },
        { name: "Poulet curry avec riz basmati", image: "/images/curry.png", grammage: "350g" },
      ]);
    } else {
      setProgram("Programme pour perte de poids : Alimentation contrôlée et équilibrée.");
      setRecipes([
        { name: "Soupe aux légumes et lentilles", image: "/images/soup.png", grammage: "300ml" },
        { name: "Salade composée aux protéines maigres", image: "/images/salad.png", grammage: "250g" },
        { name: "Filet de poisson grillé avec légumes vapeur", image: "/images/fish.png", grammage: "300g" },
      ]);
    }

    saveDietToDatabase();
  };

  const saveDietToDatabase = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE_URL}/diet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weight, program, recipes }),
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ Diet program saved:", data))
        .catch((err) => console.error("❌ Error saving diet program:", err));
    }
  };

  return (
    <div className="dietetic-container">
      <h2>🍽️ Programme Diététique</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateProgram();
        }}
        className="dietetic-form"
      >
        <label>Votre poids (kg) :</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
        <button type="submit">Générer le programme</button>
      </form>

      {program && <p className="program-result">{program}</p>}

      {recipes.length > 0 && (
        <div className="recipes">
          <h3>🍲 Recettes suggérées :</h3>
          <div className="recipe-list">
            {recipes.map((recipe, index) => (
              <div className="recipe-card" key={index}>
                <img src={recipe.image} alt={recipe.name} />
                <h4>{recipe.name}</h4>
                <p>{recipe.grammage}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dietetic;
