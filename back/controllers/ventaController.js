import { Venta } from "../models/ventaModel.js";

export class VentaController {
  // Crear venta
  static async createVenta(req, res) {
    try {
      const { cliente_id, total, saldo_restante, metodo_pago_id, productos } = req.body;

      if (!total || !metodo_pago_id || !productos || productos.length === 0) {
        return res.status(400).json({ 
          msg: "Total, método de pago y productos son obligatorios" 
        });
      }

      const newVenta = await Venta.create({ 
        cliente_id, 
        total, 
        saldo_restante: saldo_restante || 0, 
        metodo_pago_id, 
        productos 
      });

      if (newVenta instanceof Error)
        return res.status(500).json({ msg: newVenta.message });

      res.status(201).json({ msg: "Venta registrada ✅", venta: newVenta });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Obtener todas las ventas
  static async getVentas(req, res) {
    try {
      const ventas = await Venta.getAll();
      if (ventas instanceof Error)
        return res.status(500).json({ msg: ventas.message });

      res.status(200).json({ msg: "Lista de ventas ✅", ventas });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Obtener venta por ID
  static async getVentaById(req, res) {
    try {
      const { id } = req.params;
      const venta = await Venta.getById(id);

      if (venta instanceof Error)
        return res.status(404).json({ msg: venta.message });

      res.status(200).json({ msg: "Venta encontrada ✅", venta });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Obtener estadísticas
  static async getEstadisticas(req, res) {
    try {
      const estadisticas = await Venta.getEstadisticas();

      if (estadisticas instanceof Error)
        return res.status(500).json({ msg: estadisticas.message });

      res.status(200).json(estadisticas);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Eliminar venta
  static async deleteVenta(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Venta.delete(id);

      if (deleted instanceof Error)
        return res.status(404).json({ msg: deleted.message });

      res.status(200).json({ msg: "Venta eliminada ✅" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
}