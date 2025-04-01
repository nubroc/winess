import { useState } from "react";

const Dietetic = () => {
  const [weight, setWeight] = useState(70); // Poids par défaut
  const [program, setProgram] = useState("");
  const [recipes, setRecipes] = useState([]);

  const generateProgram = () => {
    if (weight < 60) {
      setProgram(
        "Programme pour poids léger : Repas riches en protéines et glucides."
      );
      setRecipes([
        "Salade de quinoa et poulet",
        "Smoothie protéiné aux fruits rouges",
        "Poêlée de légumes et tofu",
      ]);
    } else if (weight >= 60 && weight < 80) {
      setProgram(
        "Programme équilibré : Apport en protéines, lipides et glucides modérés."
      );
      setRecipes([
        "Pâtes complètes au saumon",
        "Omelette aux épinards et fromage",
        "Poulet rôti avec patates douces",
      ]);
    } else if (weight >= 80 && weight < 100) {
      setProgram(
        "Programme pour prise de masse : Alimentation riche en calories et en protéines."
      );
      setRecipes([
        "Steak de bœuf avec riz complet",
        "Porridge aux flocons d'avoine et banane",
        "Poulet curry avec riz basmati",
      ]);
    } else {
      setProgram(
        "Programme pour perte de poids : Alimentation contrôlée et équilibrée."
      );
      setRecipes([
        "Soupe aux légumes et lentilles",
        "Salade composée aux protéines maigres",
        "Filet de poisson grillé avec légumes vapeur",
      ]);
    }
  };

  return (
    <div className="dietetic-container">
      <h2>Programme Diététique</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateProgram();
        }}
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
          <h3>Recettes suggérées :</h3>
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>{recipe}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dietetic;
