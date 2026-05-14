import { Link, Outlet } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBagShopping, faCartShopping, faShop } from '@fortawesome/free-solid-svg-icons'
import './AuthLayout.css'

export const AuthLayout = () => {
  return (
    <div className="section">
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
          <FontAwesomeIcon icon={faBagShopping} size="3x" color="white"/>
        </div>
        <h1 className="store-title">Variedades Dakota</h1>
        <p className="store-subtitle">Tu tienda online de confianza</p>
        <div className="form-container">
          <div className="toggle-buttons single-tab">
            <Link to="/" id="login-tab" className="buton active">Login</Link>
          </div>
        <Outlet />
        </div>
      </div>
    </div>
  )
}
