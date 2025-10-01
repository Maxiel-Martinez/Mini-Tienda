const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const path = require("path");


const app = express();
const PORT = 3000;

// conexión a MySQL (XAMPP)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // si tu MySQL tiene clave, ponla aquí
  database: "variedades_dakota"
});

db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

// Middleware para JSON
app.use(express.json());

// ---- Registro ----
app.post("/register", (req, res) => {
  const { nombre_completo, correo, contrasena } = req.body;

  // encriptar contraseña
  const hashed = bcrypt.hashSync(contrasena, 10);

  db.query(
    "INSERT INTO usuarios (nombre_completo, correo, contrasena) VALUES (?, ?, ?)",
    [nombre_completo, correo, hashed],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error al registrar" });
      }
      res.json({ msg: "Usuario registrado ✅" });
    }
  );
});

// ---- Login ----
app.post("/login", (req, res) => {
  const { correo, contrasena } = req.body;

  db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Error en login" });
    }

    if (rows.length === 0) {
      return res.status(401).json({ msg: "Usuario no encontrado ❌" });
    }

    const usuario = rows[0];
    const valido = bcrypt.compareSync(contrasena, usuario.contrasena);

    if (!valido) {
      return res.status(401).json({ msg: "Contraseña incorrecta ❌" });
    }

    res.json({ msg: "Login exitoso ✅", usuario: { id: usuario.id, nombre: usuario.nombre_completo } });
  });
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
