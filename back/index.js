import express, { json, urlencoded } from "express";
import { loadEnvFile } from 'node:process';
import { userRouter } from "./routes/userRouter.js";
<<<<<<< HEAD
import clienteRoutes from "./routes/clienteRoutes.js";

=======
>>>>>>> d42dfd7b034f43808891c0d1f5207df3f68bb512
loadEnvFile();

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware para JSON
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("API funcionando 🚀");
});

app.use('/api/users',userRouter)
<<<<<<< HEAD
app.use("/clientes", clienteRoutes);
=======
>>>>>>> d42dfd7b034f43808891c0d1f5207df3f68bb512

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
