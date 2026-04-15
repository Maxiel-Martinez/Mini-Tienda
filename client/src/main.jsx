import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthLayout } from './pages/auth/AuthLayout.jsx'
import Login from './pages/auth/login/Login.jsx'
import { Dashboard } from './pages/Profile/dasboard/Dashboard.jsx'
import ProfileLayout from './pages/Profile/ProfileLayout.jsx'
import { Sales } from './pages/Profile/ventas/Sales.jsx'
import { Clients } from './pages/Profile/clients/Clients.jsx'
import { Orders } from './pages/Profile/orders/Orders.jsx'
import { Suplier } from './pages/Profile/supplier/Suplier.jsx'
import { Products } from './pages/Profile/products/Products.jsx'
import { UserSessionProvider } from './providers/userContext/UserSessionContext.jsx'
import { PrivateRoute } from './routes/PrivateRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserSessionProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route index element={<Login />}></Route>
            <Route path="register" element={<Navigate to="/" replace />}></Route>
          </Route>
          <Route
            path="profile"
            element={(
              <PrivateRoute>
                <ProfileLayout />
              </PrivateRoute>
            )}
          >
            <Route index element={<Dashboard />}></Route>
            <Route path="sales" element={<Sales />}></Route>
            <Route path='clients' element={<Clients />}></Route>
            <Route path='orders' element={<Orders />}></Route>
            <Route path='products' element={<Products />}></Route>
            <Route path='supplier' element={<Suplier />}></Route>
          </Route>
          <Route path="*" element={<Navigate to='/' replace />}></Route>
        </Routes>
      </UserSessionProvider>
    </BrowserRouter>
  </StrictMode>,
)
