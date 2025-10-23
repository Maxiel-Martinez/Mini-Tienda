import express, { json, urlencoded } from "express";
import { loadEnvFile } from 'node:process';
import { categoryRouter } from "./routes/categoryRoutes.js";
import { userRouter } from "./routes/userRouter.js";
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
app.use('/api/categories',categoryRouter)

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
