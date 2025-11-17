import { Router } from "express";
import { PedidosController } from "../controllers/pedidosController.js";

export const pedidosRouter = Router()

pedidosRouter.get('/', PedidosController.getAllPedidos)
pedidosRouter.post('/', PedidosController.createPedido)
