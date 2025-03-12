import React from "react";

const Register = () => {
  return (
    <div>
      <h2>Inscription</h2>
      <form>
        <input type="text" placeholder="Nom" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Mot de passe" required />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
