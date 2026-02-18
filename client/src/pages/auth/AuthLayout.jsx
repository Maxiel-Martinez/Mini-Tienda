import { Link, Outlet } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBagShopping, faCartShopping, faShop } from '@fortawesome/free-solid-svg-icons'
import {useLocation} from 'react-router'
import './AuthLayout.css'

export const AuthLayout = () => {
  const location = useLocation()
  console.log(location.pathname)

  return (
    <>
      <div className="floating-shapes">
        <div className="shape">
          <FontAwesomeIcon icon={faBagShopping} size="3x" color="#667eea" />
        </div>
        <div className="shape">
          <FontAwesomeIcon icon={faCartShopping} size="3x" color="#764ba2" />
        </div>
        <div className="shape">
          <FontAwesomeIcon icon={faShop} size="3x" color="#667eea" />
        </div>
      </div>
      <div className="container">
        <div className="store-logo">
          <FontAwesomeIcon icon={faBagShopping} size="3x" />
        </div>
        <h1 className="store-title">Variedades Dakota</h1>
        <p className="store-subtitle">Tu tienda online de confianza</p>
        <div className="form-container">
          <div className={`toggle-buttons ${location.pathname === '/register' ? 'register-active' : ''}`}>
            <Link to="/" id="login-tab" className={`buton ${location.pathname === '/' ? 'active' : ''}`}>Login</Link>
            <Link to="/register" id="register-tab" className={`buton ${location.pathname === '/register' ? 'active' : ''}`}>Registro</Link>
          </div>
        <Outlet />
        </div>
      </div>
    </>
  )
}
