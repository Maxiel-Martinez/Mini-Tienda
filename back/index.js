import express, { json, urlencoded } from "express";
import { loadEnvFile } from 'node:process';
import { categoryRouter } from "./routes/categoryRoutes.js";
import { userRouter } from "./routes/userRouter.js";
import { productRouter } from "./routes/productRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import cors from "cors"

loadEnvFile();

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware para JSON
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors())

app.get("/", (req, res) => {
  res.json("API funcionando 🚀");
});

app.use('/api/users',userRouter)
app.use('/api/categories',categoryRouter)
app.use('/api/products',productRouter)
app.use("/api/clientes", clienteRoutes);

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
