import { Router } from "express";
import { PedidosController } from "../controllers/pedidosController.js";
import multer from "multer";

export const pedidosRouter = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

pedidosRouter.get('/stats', PedidosController.getPedidoStats)
pedidosRouter.get('/:pedido_id', PedidosController.getPedidoById)
pedidosRouter.get('/', PedidosController.getAllPedidos)
pedidosRouter.post('/', upload.single('image'), PedidosController.createPedido)
pedidosRouter.put('/:pedido_id/status', PedidosController.updatePedidoStatus)
