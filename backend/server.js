require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à la base de données:", err);
  } else {
    console.log("✅ Connecté à la base de données MySQL");
  }
});

// ➕ Route test pour vérifier la connexion DB
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Connexion DB échouée", error: err.message });
    }
    res.json({ success: true, message: "Connexion DB OK ✅" });
  });
});

// 🔐 Enregistrement (Inscription)
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Tentative d'inscription :", username, email);

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Erreur SELECT :", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      console.log("Email déjà utilisé :", email);
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("Erreur INSERT :", err);
          return res.status(500).json({ error: err.message });
        }

        console.log("✅ Utilisateur enregistré :", username);
        res.status(201).json({ message: "Utilisateur enregistré avec succès" });
      }
    );
  });
});

// 🔑 Connexion
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Tentative de connexion :", username);

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) {
      console.error("Erreur SELECT :", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      console.log("Utilisateur non trouvé :", username);
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Mot de passe incorrect pour :", username);
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("✅ Connexion réussie pour :", username);
    res.json({ token, username: user.username });
  });
});

// 🔐 Middleware d'authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 👤 Route profil sécurisé
app.get("/profile", authenticateToken, (req, res) => {
  db.query("SELECT username, email FROM users WHERE id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json(results[0]);
  });
});

// 🚀 Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur le port ${PORT}`);
});
