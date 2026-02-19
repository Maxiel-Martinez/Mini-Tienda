import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthLayout } from './pages/auth/AuthLayout.jsx'
import Login from './pages/auth/login/Login.jsx'
import { Register } from './pages/auth/register/Register.jsx'
import { Dashboard } from './pages/Profile/dasboard/Dashboard.jsx'
import ProfileLayout from './pages/Profile/ProfileLayout.jsx'
import { Sales } from './pages/Profile/ventas/Sales.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index element={<Login />}></Route>
          <Route path="register" element={<Register />}></Route>
        </Route>
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<Dashboard />}></Route>
          <Route path="sales" element={<Sales />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
