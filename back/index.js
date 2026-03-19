import express, { json, urlencoded } from "express";
import { loadEnvFile } from 'node:process';
import { categoryRouter } from "./routes/categoryRoutes.js";
import { userRouter } from "./routes/userRouter.js";
import { productRouter } from "./routes/productRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import cors from "cors"
import { pedidosRouter } from "./routes/pedidosRoutes.js";
import session from "express-session";
import { requiresAuth } from "./middlewares/auth.js";
import { sessionStore } from "./util/sessionStore.js";

loadEnvFile();

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware para JSON
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutos
    path: '/',
  }
}))

app.get("/", (req, res) => {
  res.json({
    ok: true,
    authenticated: Boolean(req.session?.user),
    user: req.session?.user ?? null,
  });
});

app.use('/api/users',userRouter);
app.use('/api/categories', requiresAuth, categoryRouter);
app.use('/api/products', requiresAuth, productRouter);
app.use("/api/clientes", requiresAuth, clienteRoutes);
app.use("/api/proveedores", requiresAuth, proveedorRoutes);
app.use('/api/pedidos', requiresAuth, pedidosRouter);
app.use("/api/ventas", requiresAuth, ventaRoutes);

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
