import { Router } from 'express';
import { VentaController } from '../controllers/ventaController.js';

const router = Router();

// Rutas de ventas
router.post('/', VentaController.createVenta);
router.get('/', VentaController.getVentas);
router.get('/estadisticas', VentaController.getEstadisticas);
router.get('/:id', VentaController.getVentaById);
router.delete('/:id', VentaController.deleteVenta);

export default router;