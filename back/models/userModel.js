import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export class User {
  static async create({ nombre_completo, correo, contrasena }){
    try {
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const emailExists = await this.checkEmailExists(correo);
      if (emailExists) {
        throw new Error('El correo ya está registrado');
      }
      const [result] = await db.query(
        "INSERT INTO usuarios (nombre_completo, correo, contrasena) VALUES (?, ?, ?)",
        [nombre_completo, correo, hashedPassword]
      );

      const [[newUser]] = await db.query("SELECT id, nombre_completo, correo FROM usuarios WHERE id = ?", [result.insertId]);
      if (!newUser) {
        throw new Error('Error al crear el usuario');
      }

      return newUser;
    } catch (error) {
      return error;
    }
  }

  static async login({ correo, contrasena }){
    try {
      const [[user]] = await db.query("SELECT id, nombre_completo, correo, contrasena FROM usuarios WHERE correo = ?", [correo]);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
      if (!passwordMatch) {
        throw new Error('Contraseña incorrecta');
      }
      delete user.contrasena
      return user
    } catch (error) {
      return error;
    }
  }

  static async checkEmailExists(email) {
    const [rows] = await db.query("SELECT 1 FROM usuarios WHERE correo = ?", [email]);
    return rows.length > 0;
  }
}
