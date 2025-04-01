require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ajout de headers CORS personnalisés pour autoriser les tokens
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// 🔌 Connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à MySQL:", err);
  } else {
    console.log("✅ Connecté à la base de données MySQL");
  }
});

// 🔐 Middleware de vérification du token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ✅ Test de connexion à la BDD
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: "Connexion DB OK ✅" });
  });
});

// ✅ Inscription
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ error: "Email déjà utilisé" });

    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Utilisateur enregistré avec succès" });
      }
    );
  });
});

// ✅ Connexion
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Utilisateur non trouvé" });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, username: user.username });
  });
});

// ✅ Récupération du profil
app.get("/profile", authenticateToken, (req, res) => {
  db.query(
    "SELECT username, email FROM users WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0]);
    }
  );
});

// ✅ Enregistrement de l’IMC
app.post("/imc", authenticateToken, (req, res) => {
  const { taille, poids, imc, age } = req.body;
  const userId = req.user.id;

  db.query(
    "INSERT INTO user_metrics (user_id, taille, poids, imc, age) VALUES (?, ?, ?, ?, ?)",
    [userId, taille, poids, imc, age],
    (err) => {
      if (err) {
        console.error("Erreur INSERT IMC:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "IMC enregistré" });
    }
  );
});

// ✅ Dernier IMC
app.get("/imc", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM user_metrics WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Aucun IMC trouvé" });
      res.json(results[0]);
    }
  );
});

// ✅ Historique IMC
app.get("/imc/history", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT taille, poids, imc, age, created_at FROM user_metrics WHERE user_id = ? ORDER BY created_at ASC",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// ✅ Programme sportif
app.post("/program", authenticateToken, (req, res) => {
  const { imc, programme, image_url } = req.body;
  const userId = req.user.id;

  db.query(
    "INSERT INTO user_programs (user_id, imc, programme, image_url) VALUES (?, ?, ?, ?)",
    [userId, imc, programme, image_url],
    (err) => {
      if (err) {
        console.error("Erreur INSERT PROGRAM:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Programme enregistré" });
    }
  );
});

app.get("/program", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM user_programs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Aucun programme trouvé" });
      res.json(results[0]);
    }
  );
});

// ✅ Programme diététique (bonus)
app.post("/diet", authenticateToken, (req, res) => {
  const { weight, program, recipes } = req.body;
  const userId = req.user.id;

  db.query(
    "INSERT INTO user_diets (user_id, weight, program, recipes) VALUES (?, ?, ?, ?)",
    [userId, weight, program, JSON.stringify(recipes)],
    (err) => {
      if (err) {
        console.error("Erreur INSERT Diet:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Programme diététique enregistré" });
    }
  );
});

// ✅ Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur le port ${PORT}`);
});
