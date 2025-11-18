import db from "../config/db.js";
import { Product } from "./productModel.js";

export class PedidosModel {
  static async getAllPedidos() {
    try {
      const [pedidos] = await db.query(
        `SELECT pedidos.id, nombre, fecha, total, estado
        FROM pedidos
        INNER JOIN proveedores ON pedidos.proveedor_id = proveedores.id`
      )
      if (pedidos.length === 0) {
        throw new Error('No hay pedidos en este momento');
      }
      return pedidos
    } catch (error) {
      return error
    }
  }

  static async getPedidoById(pedido_id){
    try {
      const [[pedido]] = await db.query(
        `SELECT pedidos.id, fecha, total, estado,
          productos.nombre AS nombre_producto, precio, stock,
          proveedores.nombre AS nombre_proveedor
        FROM pedidos
        INNER JOIN proveedores ON pedidos.proveedor_id = proveedores.id
        INNER JOIN pedidos_productos ON pedidos.id = pedidos_productos.id_pedido
        INNER JOIN productos ON pedidos_productos.id_producto = productos.id
        WHERE pedidos.id = ?`, [pedido_id]
      )
      if (!pedido) {
        throw new Error('Pedido no encontrado por ID');
      }
      return pedido
    } catch (error) {
      return error
    }
  }

  static async createPedido(pedidoData){
    try {
      const { proveedor_id, total, nombre, descripcion, categoria_id, precio, stock, imagen_url, imagen_public_id } = pedidoData
      const [insertPedido] = await db.query(
        `INSERT INTO pedidos (proveedor_id, total)
        VALUES (?, ?)`,
        [proveedor_id, total]
      )
      const pedidoId = insertPedido.insertId;
      const isertProductos = await Product.createProduct({ nombre, descripcion, categoria_id, precio, stock, imagen_url, imagen_public_id });
      await db.query(
        `INSERT INTO pedidos_productos (id_pedido, id_producto)
        VALUES (?, ?)`,
        [pedidoId, isertProductos.id]
      )
      const [[newPedido]] = await db.query(
        `SELECT pedidos.id, proveedor_id, total, estado, fecha, nombre, precio, stock
        FROM pedidos
        INNER JOIN pedidos_productos ON pedidos.id = pedidos_productos.id_pedido
        INNER JOIN productos ON pedidos_productos.id_producto = productos.id
        WHERE pedidos.id = ?`, [pedidoId]
      )
      if (!newPedido) {
        throw new Error('Pedido no encontrado por ID después de la creación');
      }
      return newPedido
    } catch (error) {
      return error
    }
  }

  static async getPedidoStats(){
    try {
      const [[result]] = await db.query(
        `
        SELECT
          COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) AS pedidos_pendientes,
          COUNT(CASE WHEN fecha = CURDATE() AND estado = 'recibido' THEN 1 END) AS entregados_hoy,
          SUM(CASE WHEN DATE(fecha) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE() THEN total END) AS total_mes
        FROM variedades_dakota.pedidos;
        `
      )
      if (!result){
        throw new Error('No se pudieron obtener las estadísticas de pedidos');
      }
      return result
    } catch (error) {
      return error
    }
  }
}
