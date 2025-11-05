import { Cliente } from "../models/clienteModel.js";

export class ClienteController {
  static async createCliente(req, res) {
    try {
      const { nombre, telefono, correo, direccion, saldo } = req.body;

      const newCliente = await Cliente.create({ nombre, telefono, correo, direccion, saldo });
      if (newCliente instanceof Error)
        return res.status(500).json({ msg: newCliente.message });

      res.status(201).json({ msg: "Cliente registrado ✅", cliente: newCliente });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  static async getClientes(req, res) {
    try {
      const clientes = await Cliente.getAll();
      if (clientes instanceof Error)
        return res.status(500).json({ msg: clientes.message });

      res.status(200).json({ msg: "Lista de clientes ✅", clientes });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  static async getClienteById(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.getById(id);

      if (cliente instanceof Error)
        return res.status(404).json({ msg: cliente.message });

      res.status(200).json({ msg: "Cliente encontrado ✅", cliente });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  static async updateCliente(req, res) {
    try {
      const { id } = req.params;
      const { nombre, telefono, correo, direccion, saldo } = req.body;

      const updatedCliente = await Cliente.update(id, {
        nombre,
        telefono,
        correo,
        direccion,
        saldo,
      });

      if (updatedCliente instanceof Error)
        return res.status(404).json({ msg: updatedCliente.message });

      res.status(200).json({ msg: "Cliente actualizado ✅", cliente: updatedCliente });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  static async deleteCliente(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Cliente.delete(id);

      if (deleted instanceof Error)
        return res.status(404).json({ msg: deleted.message });

      res.status(200).json({ msg: "Cliente eliminado ✅" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
}
