import db from "../config/db.js";

export class Venta {
  // Crear venta con transacción manual
  static async create({ cliente_id, total, saldo_restante, metodo_pago_id, productos }) {
    try {
      // Insertar venta
      const [result] = await db.query(
        "INSERT INTO ventas (cliente_id, total, saldo_restante, metodo_pago_id) VALUES (?, ?, ?, ?)",
        [cliente_id || null, total, saldo_restante, metodo_pago_id]
      );

      const ventaId = result.insertId;

      // Insertar detalle de productos y actualizar stock
      if (productos && productos.length > 0) {
        for (const producto of productos) {
          // Insertar detalle
          await db.query(
            "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
            [ventaId, producto.producto_id, producto.cantidad, producto.precio_unitario]
          );

          // Actualizar stock del producto
          await db.query(
            "UPDATE productos SET stock = stock - ? WHERE id = ?",
            [producto.cantidad, producto.producto_id]
          );
        }
      }

      // Si tiene saldo restante y tiene cliente, actualizar saldo del cliente
      if (saldo_restante > 0 && cliente_id) {
        await db.query(
          "UPDATE clientes SET saldo = saldo + ? WHERE id = ?",
          [saldo_restante, cliente_id]
        );
      }

      // Obtener la venta creada con sus relaciones
      const [[newVenta]] = await db.query(
        `SELECT v.*, 
                m.metodo_pago as metodo_pago_nombre,
                c.nombre as cliente_nombre
         FROM ventas v
         LEFT JOIN metodo_pago m ON v.metodo_pago_id = m.id
         LEFT JOIN clientes c ON v.cliente_id = c.id
         WHERE v.id = ?`,
        [ventaId]
      );

      return newVenta;
    } catch (error) {
      console.error('Error en create venta:', error);
      return error;
    }
  }

  // Listar todas las ventas
  static async getAll() {
    try {
      const [ventas] = await db.query(`
        SELECT v.*, 
               m.metodo_pago as metodo_pago_nombre,
               c.nombre as cliente_nombre
        FROM ventas v
        LEFT JOIN metodo_pago m ON v.metodo_pago_id = m.id
        LEFT JOIN clientes c ON v.cliente_id = c.id
        ORDER BY v.fecha DESC
      `);
      return ventas;
    } catch (error) {
      return error;
    }
  }

  // Obtener venta por ID con detalles
  static async getById(id) {
    try {
      const [[venta]] = await db.query(
        `SELECT v.*, 
                m.metodo_pago as metodo_pago_nombre,
                c.nombre as cliente_nombre,
                c.telefono as cliente_telefono
         FROM ventas v
         LEFT JOIN metodo_pago m ON v.metodo_pago_id = m.id
         LEFT JOIN clientes c ON v.cliente_id = c.id
         WHERE v.id = ?`,
        [id]
      );

      if (!venta) throw new Error("Venta no encontrada");

      // Obtener detalle de productos
      const [detalles] = await db.query(
        `SELECT dv.*, p.nombre as producto_nombre
         FROM detalle_ventas dv
         INNER JOIN productos p ON dv.producto_id = p.id
         WHERE dv.venta_id = ?`,
        [id]
      );

      venta.productos = detalles;
      return venta;
    } catch (error) {
      return error;
    }
  }

  // Obtener estadísticas
  static async getEstadisticas() {
    try {
      // Ventas de hoy
      const [[ventasHoy]] = await db.query(`
        SELECT 
          COALESCE(SUM(total), 0) as totalHoy,
          COUNT(*) as transaccionesHoy
        FROM ventas
        WHERE DATE(fecha) = CURDATE()
      `);

      // Por método de pago (hoy)
      const [metodosPago] = await db.query(`
        SELECT 
          m.metodo_pago,
          COALESCE(SUM(v.total), 0) as total
        FROM metodo_pago m
        LEFT JOIN ventas v ON m.id = v.metodo_pago_id AND DATE(v.fecha) = CURDATE()
        GROUP BY m.id, m.metodo_pago
      `);

      // Créditos pendientes (saldo restante total)
      const [[creditosPendientes]] = await db.query(`
        SELECT COALESCE(SUM(saldo_restante), 0) as totalCreditos
        FROM ventas
        WHERE saldo_restante > 0
      `);

      return {
        ventasHoy: ventasHoy.totalHoy,
        transaccionesHoy: ventasHoy.transaccionesHoy,
        metodosPago: metodosPago,
        creditosPendientes: creditosPendientes.totalCreditos
      };
    } catch (error) {
      return error;
    }
  }

  // Eliminar venta
  static async delete(id) {
    try {
      // Obtener detalles para restaurar stock
      const [detalles] = await db.query(
        "SELECT producto_id, cantidad FROM detalle_ventas WHERE venta_id = ?",
        [id]
      );

      // Obtener info de la venta para restaurar saldo del cliente
      const [[venta]] = await db.query(
        "SELECT cliente_id, saldo_restante FROM ventas WHERE id = ?",
        [id]
      );

      // Restaurar stock
      for (const detalle of detalles) {
        await db.query(
          "UPDATE productos SET stock = stock + ? WHERE id = ?",
          [detalle.cantidad, detalle.producto_id]
        );
      }

      // Restaurar saldo del cliente si tenía deuda
      if (venta && venta.cliente_id && parseFloat(venta.saldo_restante) > 0) {
        await db.query(
          "UPDATE clientes SET saldo = saldo - ? WHERE id = ?",
          [venta.saldo_restante, venta.cliente_id]
        );
      }

      // Eliminar detalles
      await db.query("DELETE FROM detalle_ventas WHERE venta_id = ?", [id]);

      // Eliminar venta
      const [result] = await db.query("DELETE FROM ventas WHERE id = ?", [id]);
      
      if (result.affectedRows === 0) throw new Error("Venta no encontrada");

      return { message: "Venta eliminada correctamente" };
    } catch (error) {
      return error;
    }
  }
}