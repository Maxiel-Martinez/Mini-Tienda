const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Sirve todos los archivos que estén en "public"
app.use(express.static(path.join(__dirname, "public")));

// Muestra el login.html cuando entres a "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
