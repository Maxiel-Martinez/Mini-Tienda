import { Router } from 'express';
import { ProveedorController } from '../controllers/proveedorController.js';

const router = Router();

// Rutas de proveedores
router.post('/', ProveedorController.createProveedor);
router.get('/', ProveedorController.getProveedores);
router.get('/estadisticas', ProveedorController.getEstadisticas);
router.get('/:id/pedidos', ProveedorController.getTotalPedidos);
router.get('/:id', ProveedorController.getProveedorById);
router.put('/:id', ProveedorController.updateProveedor);
router.delete('/:id', ProveedorController.deleteProveedor);

export default router;