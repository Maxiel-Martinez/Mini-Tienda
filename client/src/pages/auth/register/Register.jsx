import { Link } from "react-router"
import { faEnvelope, faLock, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Register = () =>{
  return (
    <form id="register-form" className="authForm active" >
        <h2>Crear Cuenta</h2>
        <div className="input-group">
          <input type="text" id="register-name" name="nombre_completo" required placeholder="Nombre completo" />
          <FontAwesomeIcon icon={faUser} className="input-icon" />
        </div>
        <div className="input-group">
          <input type="email" id="register-email" name="correo" required placeholder="Correo electrónico" />
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
        </div>
        <div className="input-group">
          <input type="password" id="register-password" name="contrasena" required placeholder="Contraseña" />
          <FontAwesomeIcon icon={faLock} className="input-icon" />
        </div>
        <button type="submit" className="submit-button">
          <FontAwesomeIcon icon={faUserPlus} />
          Registrarse
        </button>
        <p className="link register-link">¿Ya tienes una cuenta? <Link to="/" id="show-login">Inicia Sesión</Link></p>
    </form>
  )
}
