import { Proveedor } from "../models/proveedorModel.js";

export class ProveedorController {
  // Crear proveedor
  static async createProveedor(req, res) {
    try {
      const { nombre, telefono, empresa } = req.body;

      if (!nombre || !telefono) {
        return res.status(400).json({ msg: "Nombre y teléfono son obligatorios" });
      }

      const newProveedor = await Proveedor.create({ nombre, telefono, empresa });
      if (newProveedor instanceof Error)
        return res.status(500).json({ msg: newProveedor.message });

      res.status(201).json({ msg: "Proveedor registrado ✅", proveedor: newProveedor });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Obtener todos los proveedores
  static async getProveedores(req, res) {
    try {
      const proveedores = await Proveedor.getAll();
      if (proveedores instanceof Error)
        return res.status(500).json({ msg: proveedores.message });

      res.status(200).json({ msg: "Lista de proveedores ✅", proveedores });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Obtener proveedor por ID
  static async getProveedorById(req, res) {
    try {
      const { id } = req.params;
      const proveedor = await Proveedor.getById(id);

      if (proveedor instanceof Error)
        return res.status(404).json({ msg: proveedor.message });

      res.status(200).json({ msg: "Proveedor encontrado ✅", proveedor });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Actualizar proveedor
  static async updateProveedor(req, res) {
    try {
      const { id } = req.params;
      const { nombre, telefono, empresa } = req.body;

      if (!nombre || !telefono) {
        return res.status(400).json({ msg: "Nombre y teléfono son obligatorios" });
      }

      const updatedProveedor = await Proveedor.update(id, {
        nombre,
        telefono,
        empresa,
      });

      if (updatedProveedor instanceof Error)
        return res.status(404).json({ msg: updatedProveedor.message });

      res.status(200).json({ msg: "Proveedor actualizado ✅", proveedor: updatedProveedor });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Eliminar proveedor
  static async deleteProveedor(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Proveedor.delete(id);

      if (deleted instanceof Error)
        return res.status(404).json({ msg: deleted.message });

      res.status(200).json({ msg: "Proveedor eliminado ✅" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Obtener total de pedidos de un proveedor
  static async getTotalPedidos(req, res) {
    try {
      const { id } = req.params;
      const totalPedidos = await Proveedor.getTotalPedidos(id);

      if (totalPedidos instanceof Error)
        return res.status(404).json({ msg: totalPedidos.message });

      res.status(200).json({ totalPedidos });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  // Obtener estadísticas
  static async getEstadisticas(req, res) {
    try {
      const estadisticas = await Proveedor.getEstadisticas();

      if (estadisticas instanceof Error)
        return res.status(500).json({ msg: estadisticas.message });

      res.status(200).json(estadisticas);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
}