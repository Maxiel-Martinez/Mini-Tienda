import express, { json, urlencoded } from "express";
import { loadEnvFile } from 'node:process';
import { userRouter } from "./routes/userRouter.js";
import clienteRoutes from "./routes/clienteRoutes.js";


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
app.use("/clientes", clienteRoutes);

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
