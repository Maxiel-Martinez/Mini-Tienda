import db from "../config/db.js";

export class Cliente {
  // Crear cliente
  static async create({ nombre, telefono, correo, direccion, saldo }) {
    try {
      const [result] = await db.query(
        "INSERT INTO clientes (nombre, telefono, coreo, direccion, saldo) VALUES (?, ?, ?, ?, ?)",
        [nombre, telefono, correo, direccion, saldo || 0]
      );

      const [[newCliente]] = await db.query(
        "SELECT id, nombre, telefono, coreo as correo, direccion, saldo FROM clientes WHERE id = ?",
        [result.insertId]
      );

      if (!newCliente) throw new Error("Error al crear el cliente");
      return newCliente;
    } catch (error) {
      return error;
    }
  }

  // Listar todos los clientes
  static async getAll() {
    try {
      const [clientes] = await db.query(
        "SELECT id, nombre, telefono, coreo as correo, direccion, saldo FROM clientes"
      );
      return clientes;
    } catch (error) {
      return error;
    }
  }

  // Obtener cliente por ID
  static async getById(id) {
    try {
      const [[cliente]] = await db.query(
        "SELECT id, nombre, telefono, coreo as correo, direccion, saldo FROM clientes WHERE id = ?",
        [id]
      );
      if (!cliente) throw new Error("Cliente no encontrado");
      return cliente;
    } catch (error) {
      return error;
    }
  }

  // Eliminar cliente
  static async delete(id) {
    try {
      const [result] = await db.query("DELETE FROM clientes WHERE id = ?", [id]);
      if (result.affectedRows === 0) throw new Error("Cliente no encontrado");
      return { message: "Cliente eliminado correctamente" };
    } catch (error) {
      return error;
    }
  }

  // Actualizar cliente
  static async update(id, { nombre, telefono, correo, direccion, saldo }) {
    try {
      const [result] = await db.query(
        "UPDATE clientes SET nombre = ?, telefono = ?, coreo = ?, direccion = ?, saldo = ? WHERE id = ?",
        [nombre, telefono, correo, direccion, saldo, id]
      );

      if (result.affectedRows === 0) throw new Error("Cliente no encontrado");

      const [[updatedCliente]] = await db.query(
        "SELECT id, nombre, telefono, coreo as correo, direccion, saldo FROM clientes WHERE id = ?",
        [id]
      );
      return updatedCliente;
    } catch (error) {
      return error;
    }
  }

  // Obtener última compra del cliente
  static async getUltimaCompra(id) {
    try {
      const [[result]] = await db.query(
        `SELECT MAX(fecha) as ultimaCompra 
         FROM ventas 
         WHERE cliente_id = ?`,
        [id]
      );
      
      return result ? result.ultimaCompra : null;
    } catch (error) {
      return error;
    }
  }
}