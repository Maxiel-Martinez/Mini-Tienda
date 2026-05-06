import { useActionState } from 'react'
import { faEnvelope, faLock, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import './Login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormStatus } from 'react-dom'
import { Navigate, useNavigate } from 'react-router'
import { useUserSession } from '../../../providers/userContext/useUserSession'

const initialState = {
  error: '',
  success: '',
}

function LoginSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" className="submit-button" disabled={pending}>
      <FontAwesomeIcon icon={faRightToBracket} color='white' className='input-icon' />
      {pending ? 'Ingresando...' : 'Iniciar Sesión'}
    </button>
  )
}

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, loading, login } = useUserSession()

  const [state, loginAction] = useActionState(async (_, formData) => {
    const credentials = {
      correo: String(formData.get('correo') ?? '').trim(),
      contrasena: String(formData.get('contrasena') ?? ''),
    }
    console.log("🚀 ~ Login ~ credentials:", credentials)


    if (!credentials.correo || !credentials.contrasena) {
      return {
        error: 'Debes ingresar correo y contraseña.',
        success: '',
      }
    }

    try {
      await login(credentials)
      navigate('/profile', { replace: true })

      return {
        error: '',
        success: 'Inicio de sesión exitoso.',
      }
    } catch (error) {
      return {
        error:
          error?.response?.data?.msg ??
          error?.response?.data?.message ??
          error?.response?.data?.error ??
          error?.message ??
          'No fue posible iniciar sesión.',
        success: '',
      }
    }
  }, initialState)

  if (!loading && isAuthenticated) {
    return <Navigate to="/profile" replace />
  }

  return (
    <form id="login-form" className="authForm active" action={loginAction}>
        <h2>Iniciar Sesión</h2>
        <div className="input-group">
          <input type="email" id="login-email" name="correo" required placeholder="Correo Electrónico" />
          <FontAwesomeIcon icon={faEnvelope} color='black' className='input-icon' />
        </div>
        <div className="input-group">
          <input type="password" id="login-password" name="contrasena" required placeholder="Contraseña" />
          <FontAwesomeIcon icon={faLock} className='input-icon' color='black' />
        </div>
        {state.error ? <p className="link" role="alert">{state.error}</p> : null}
        {state.success ? <p className="link" role="status">{state.success}</p> : null}
        <LoginSubmitButton />
        <a href="#" className="link forgot-password">¿Olvidaste tu contraseña?</a>
    </form>
  )
}

export default Login
