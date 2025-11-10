import { Router } from 'express';
import { ClienteController } from '../controllers/clienteController.js';

const router = Router();

// Rutas de clientes (sin /clientes ya que está en app.use)
// IMPORTANTE: Las rutas específicas ANTES de las genéricas con :id
router.post('/', ClienteController.createCliente);
router.get('/', ClienteController.getClientes);
//router.get('/:id/ultima-compra', ClienteController.getUltimaCompra); // <- ANTES
router.get('/:id', ClienteController.getClienteById);                 // <- DESPUÉS
router.put('/:id', ClienteController.updateCliente);
router.delete('/:id', ClienteController.deleteCliente);

export default router;