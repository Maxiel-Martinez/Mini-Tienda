import { User } from "../models/userModel.js";

export class UserController {
  static async createUser(req, res) {
    const { nombre_completo, correo, contrasena } = req.body;
    const newUser = await User.create({ nombre_completo, correo, contrasena });

    if (newUser instanceof Error) {
      return res.status(500).json({ succes: false, msg: newUser.message });
    }

    res.status(201).json({ succes: true, msg: "Usuario registrado ✅", user: newUser });
  }

  static async loginUser(req, res) {
    const { correo, contrasena } = req.body;
    const response = await User.login({ correo, contrasena });
    if (response instanceof Error) {
      return res.status(401).json({succes: false, msg: response.message });
    }
    req.session.regenerate(async (err)=>{
      if (err) {
        return res.status(500).json({succes: false, msg: "Error al generar la sesión" });
      }
      req.session.user = response
      req.session.createdAt = Date.now()

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({succes: false, msg: "Error al guardar la sesión" });
        }
        return res.status(200).json({succes: true, msg: "Login exitoso ✅", user: req.session.user });
      })

    })
  }

  static async logoutUser(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({succes: false, msg: "Error al cerrar la sesión" });
      }
      res.clearCookie(process.env.SESSION_NAME);
      return res.status(200).json({succes: true, msg: "Logout exitoso ✅" });
    })
  }
}
