import { User } from "../models/userModel.js";

export class UserController {
  static async loginUser(req, res) {
    const { correo, contrasena } = req.body ?? {};

    if (!correo || !contrasena) {
      return res.status(400).json({ succes: false, msg: "Correo y contraseña son obligatorios" });
    }

    try {
      const user = await User.login({ correo, contrasena });

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ succes: false, msg: "Error al generar la sesión" });
        }

        req.session.user = {
          id: user.id,
          nombre_completo: user.nombre_completo,
          correo: user.correo
        };

        req.session.save((saveError) => {
          if (saveError) {
            return res.status(500).json({ succes: false, msg: "Error al guardar la sesión" });
          }
          return res.status(200).json({ succes: true, msg: "Login exitoso ✅", user: req.session.user });
        });
      });
    } catch (error) {
      const status = error.status ?? 500;
      return res.status(status).json({
        succes: false,
        msg: status === 500 ? "Error interno del servidor" : error.message
      });
    }
  }

  static async logoutUser(req, res) {
    const sessionName = process.env.SESSION_NAME || "sid";
    const isProduction = process.env.NODE_ENV === "production";
    const sameSite = process.env.SESSION_SAMESITE || "lax";

    if (!req.session) {
      res.clearCookie(sessionName, {
        path: "/",
        httpOnly: true,
        secure: isProduction,
        sameSite
      });
      return res.status(200).json({ succes: true, msg: "Logout exitoso ✅" });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ succes: false, msg: "Error al cerrar la sesión" });
      }

      res.clearCookie(sessionName, {
        path: "/",
        httpOnly: true,
        secure: isProduction,
        sameSite
      });
      return res.status(200).json({ succes: true, msg: "Logout exitoso ✅" });
    });
  }

  static async me(req, res) {
    return res.status(200).json({ succes: true, user: req.session.user });
  }
}
