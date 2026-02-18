import { faEnvelope, faLock, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import './Login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Login() {

  return (
    <form id="login-form" className="form active">
        <h2>Iniciar Sesión</h2>
        <div className="input-group">
          <input type="email" id="login-email" name="correo" required placeholder="Correo Electrónico" />
          <FontAwesomeIcon icon={faEnvelope} color='black' className='input-icon' />
        </div>
        <div className="input-group">
          <input type="password" id="login-password" name="contrasena" required placeholder="Contraseña" />
          <FontAwesomeIcon icon={faLock} className='input-icon' color='black' />
        </div>
        <button type="submit" className="submit-button">
          <FontAwesomeIcon icon={faRightToBracket} color='white' className='input-icon' />
          Iniciar Sesión
        </button>
        <a href="#" className="link forgot-password">¿Olvidaste tu contraseña?</a>
    </form>
  )
}

export default Login
