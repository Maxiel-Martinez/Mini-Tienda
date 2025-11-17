import db from "../config/db.js";
import { Product } from "./productModel.js";

export class PedidosModel {
  static async getAllPedidos() {
    try {
      const [pedidos] = await db.query(
        `SELECT proveedores.id, nombre, fecha, total, estado
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

  static async createPedido(pedidoData){
    try {
      const { proveedor_id, total, estado, nombre, descripcion, categoria_id, precio, stock, imagen_url, imagen_public_id } = pedidoData
      const [insertPedido] = await db.query(
        `INSERT INTO pedidos (proveedor_id, total, estado)
        VALUES (?, ?, ?)`,
        [proveedor_id, total, estado]
      )
      const pedidoId = insertPedido.insertId;
      const isertProductos = await Product.createProduct({ nombre, descripcion, categoria_id, precio, stock, imagen_url, imagen_public_id });
      await db.query(
        `INSERT INTO pedido_productos (pedido_id, producto_id)
        VALUES (?, ?)`,
        [pedidoId, isertProductos.id]
      )
      const [[newPedido]] = await db.query(
        `SELECT pedidos.id, proveedor_id, total, estado, fecha, nombre, precio, stock
        FROM pedidos
        INNER JOIN pedido_productos ON pedidos.id = pedido_productos.pedido_id
        INNER JOIN productos ON pedido_productos.producto_id = productos.id
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
}
