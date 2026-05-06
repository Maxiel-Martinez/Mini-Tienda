import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export class User {
  static async login({ correo, contrasena }){
    const [[user]] = await db.query(
      "SELECT id, nombre_completo, correo, contrasena_hash, activo FROM usuarios WHERE correo = ? LIMIT 1",
      [correo]
    );

    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    if (!user.activo) {
      const error = new Error('Usuario inactivo');
      error.status = 403;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena_hash);
    if (!passwordMatch) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    // Si la columna no existe, no bloqueamos el login.
    try {
      await db.query("UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?", [user.id]);
    } catch (error) {
      if (error?.code !== 'ER_BAD_FIELD_ERROR') {
        throw error;
      }
    }

    return {
      id: user.id,
      nombre_completo: user.nombre_completo,
      correo: user.correo
    };
  }

  static async checkEmailExists(email) {
    const [rows] = await db.query("SELECT 1 FROM usuarios WHERE correo = ?", [email]);
    return rows.length > 0;
  }
}
