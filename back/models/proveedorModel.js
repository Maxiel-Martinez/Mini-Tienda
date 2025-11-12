import db from "../config/db.js";

export class Proveedor {
  // Crear proveedor
  static async create({ nombre, telefono, empresa }) {
    try {
      const [result] = await db.query(
        "INSERT INTO proveedores (nombre, telefono, empresa) VALUES (?, ?, ?)",
        [nombre, telefono, empresa]
      );

      const [[newProveedor]] = await db.query(
        "SELECT * FROM proveedores WHERE id = ?",
        [result.insertId]
      );

      if (!newProveedor) throw new Error("Error al crear el proveedor");
      return newProveedor;
    } catch (error) {
      return error;
    }
  }

  // Listar todos los proveedores
  static async getAll() {
    try {
      const [proveedores] = await db.query("SELECT * FROM proveedores ORDER BY nombre");
      return proveedores;
    } catch (error) {
      return error;
    }
  }

  // Obtener proveedor por ID
  static async getById(id) {
    try {
      const [[proveedor]] = await db.query(
        "SELECT * FROM proveedores WHERE id = ?",
        [id]
      );
      if (!proveedor) throw new Error("Proveedor no encontrado");
      return proveedor;
    } catch (error) {
      return error;
    }
  }

  // Eliminar proveedor
  static async delete(id) {
    try {
      const [result] = await db.query("DELETE FROM proveedores WHERE id = ?", [id]);
      if (result.affectedRows === 0) throw new Error("Proveedor no encontrado");
      return { message: "Proveedor eliminado correctamente" };
    } catch (error) {
      return error;
    }
  }

  // Actualizar proveedor
  static async update(id, { nombre, telefono, empresa }) {
    try {
      const [result] = await db.query(
        "UPDATE proveedores SET nombre = ?, telefono = ?, empresa = ? WHERE id = ?",
        [nombre, telefono, empresa, id]
      );

      if (result.affectedRows === 0) throw new Error("Proveedor no encontrado");

      const [[updatedProveedor]] = await db.query(
        "SELECT * FROM proveedores WHERE id = ?",
        [id]
      );
      return updatedProveedor;
    } catch (error) {
      return error;
    }
  }

  // Obtener total de pedidos de un proveedor
  static async getTotalPedidos(id) {
    try {
      const [[result]] = await db.query(
        `SELECT COUNT(*) as totalPedidos 
         FROM pedidos 
         WHERE proveedor_id = ?`,
        [id]
      );
      
      return result ? result.totalPedidos : 0;
    } catch (error) {
      return error;
    }
  }

  // Obtener estadísticas generales
  static async getEstadisticas() {
    try {
      const [[totales]] = await db.query(`
        SELECT 
          COUNT(*) as totalProveedores,
          (SELECT COUNT(DISTINCT proveedor_id) FROM pedidos) as proveedoresActivos
        FROM proveedores
      `);

      const [[pedidosMes]] = await db.query(`
        SELECT COUNT(*) as pedidosMes
        FROM pedidos
        WHERE MONTH(fecha) = MONTH(CURRENT_DATE())
        AND YEAR(fecha) = YEAR(CURRENT_DATE())
      `);

      return {
        totalProveedores: totales.totalProveedores || 0,
        proveedoresActivos: totales.proveedoresActivos || 0,
        pedidosMes: pedidosMes.pedidosMes || 0
      };
    } catch (error) {
      return error;
    }
  }
}