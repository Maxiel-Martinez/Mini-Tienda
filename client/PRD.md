# PRD Tecnico - Frontend

## 1. Identificacion del proyecto

- Proyecto: Mini Tienda
- Componente: Frontend React
- Ubicacion: `client/`
- Stack principal: React, React Router, Axios, Vite
- Tipo de aplicacion: SPA administrativa

## 2. Proposito del frontend

El frontend implementa la interfaz administrativa del sistema Mini Tienda. Su objetivo es ofrecer una SPA para autenticacion y navegacion de modulos operativos del negocio, consumiendo la API del backend mediante HTTP y manteniendo la sesion del usuario administrador por cookie.

Este modulo corresponde a la nueva version del cliente y reemplaza progresivamente a la implementacion legacy ubicada en `front/`.

## 3. Objetivos tecnicos

El frontend debe:

- proporcionar una entrada unica de autenticacion
- proteger rutas privadas del panel
- consumir la API del backend usando `withCredentials`
- presentar una estructura modular por pagina
- reutilizar componentes de layout, tarjetas y modales
- servir como base de migracion desde el frontend legacy

## 4. Alcance funcional

### 4.1 Autenticacion

Incluye:

- pantalla de login
- validacion de sesion contra el backend
- logout
- proteccion de rutas privadas

Restriccion actual:

- la ruta de registro no esta habilitada para uso funcional
- `/register` redirige al login

### 4.2 Panel administrativo

Incluye vistas para:

- dashboard
- ventas
- clientes
- pedidos
- productos
- proveedores

### 4.3 Componentes compartidos

Incluye:

- layout de autenticacion
- layout privado del panel
- sidebar
- seccion de titulo
- tarjetas de resumen
- modal reutilizable

## 5. Estado actual del frontend

El proyecto se encuentra en una fase de migracion desde `front/` hacia React.

Estado actual:

- autenticacion y sesion funcionales
- enrutamiento funcional
- estructura general del panel funcional
- varias pantallas del panel migradas visualmente
- algunas vistas aun son principalmente presentacionales
- la migracion visual no esta completamente cerrada en todos los modulos

## 6. Arquitectura del frontend

### 6.1 Punto de entrada

Archivo:

- `client/src/main.jsx`

Responsabilidades:

- inicializar la aplicacion React
- envolver la app con `BrowserRouter`
- registrar el `UserSessionProvider`
- definir rutas publicas y privadas

### 6.2 Capa de sesion

Archivos:

- `client/src/providers/userContext/UserSessionContext.jsx`
- `client/src/providers/userContext/userContext.js`
- `client/src/providers/userContext/useUserSession.js`

Responsabilidades:

- almacenar usuario autenticado en memoria
- restaurar sesion al cargar la app
- exponer `login`, `logout`, `loading` e `isAuthenticated`

### 6.3 Capa de transporte HTTP

Archivo:

- `client/src/utils/httpClient.js`

Responsabilidades:

- centralizar configuracion de Axios
- definir `baseURL`
- enviar cookies de sesion con `withCredentials: true`

### 6.4 Capa de routing

Archivo:

- `client/src/routes/PrivateRoute.jsx`

Responsabilidad:

- restringir acceso a rutas privadas cuando no existe sesion valida

### 6.5 Capa de presentacion

Ubicacion:

- `client/src/pages/`

Subdivisiones:

- `auth/`: acceso al sistema
- `Profile/`: panel administrativo

## 7. Rutas de la SPA

### 7.1 Rutas publicas

- `/` -> login
- `/register` -> redireccion a `/`

### 7.2 Rutas privadas

- `/profile`
- `/profile/sales`
- `/profile/clients`
- `/profile/orders`
- `/profile/products`
- `/profile/supplier`

## 8. Flujo de autenticacion

Flujo actual:

1. El usuario abre la SPA.
2. `UserSessionProvider` ejecuta `GET /api/users/me`.
3. Si el backend responde con usuario, la sesion se considera valida.
4. Si no hay sesion, las rutas privadas quedan bloqueadas.
5. El formulario de login envia `POST /api/users/login`.
6. El backend crea la sesion y devuelve el usuario.
7. El frontend actualiza el contexto y redirige a `/profile`.
8. El logout ejecuta `POST /api/users/logout` y limpia el estado local.

Observacion tecnica:

- el frontend no depende de JWT para autenticar
- el estado real de autenticacion esta determinado por la cookie de sesion del backend

## 9. Layout y modulos principales

### 9.1 `AuthLayout`

Archivo:

- `client/src/pages/auth/AuthLayout.jsx`

Responsabilidades:

- renderizar fondo, logo y contenedor del acceso
- alojar el formulario de login
- mantener una sola opcion visual de acceso

### 9.2 `ProfileLayout`

Archivo:

- `client/src/pages/Profile/ProfileLayout.jsx`

Responsabilidades:

- renderizar header superior
- mostrar nombre del usuario autenticado
- renderizar sidebar con navegacion
- exponer el boton de cerrar sesion
- mostrar el modulo activo mediante `Outlet`

### 9.3 `TitleSection`

Archivo:

- `client/src/pages/Profile/components/titleSection/TitleSection.jsx`

Responsabilidad:

- estandarizar encabezados de modulos con titulo, subtitulo y boton de accion

### 9.4 `CardsGrid` y `Card`

Archivos:

- `client/src/pages/Profile/components/cards/CardsGrid.jsx`
- `client/src/pages/Profile/components/cards/Card.jsx`

Responsabilidad:

- renderizar bloques de estadisticas reutilizables

### 9.5 `Modal`

Archivo:

- `client/src/pages/Profile/components/modal/Modal.jsx`

Responsabilidad:

- encapsular la estructura comun de modales reutilizables

## 10. Modulos de negocio del panel

### 10.1 Dashboard

Archivo:

- `client/src/pages/Profile/dasboard/Dashboard.jsx`

Proposito:

- mostrar resumen general del negocio
- alojar espacio visual para graficas

Estado:

- estructura visual disponible
- pendiente integracion real con datos dinamicos

### 10.2 Ventas

Archivo:

- `client/src/pages/Profile/ventas/Sales.jsx`

Proposito:

- mostrar resumen de ventas y tabla historica

Estado:

- estructura visual migrada
- falta conexion funcional completa con backend

### 10.3 Clientes

Archivo:

- `client/src/pages/Profile/clients/Clients.jsx`

Proposito:

- mostrar clientes y exponer modal de formulario

Estado:

- migracion visual avanzada
- aun conserva fragmentos de HTML legacy que deben normalizarse a JSX

### 10.4 Pedidos

Archivo:

- `client/src/pages/Profile/orders/Orders.jsx`

Proposito:

- mostrar historial de pedidos
- mostrar formulario de nuevo pedido
- mostrar detalle de pedido en modal

Estado:

- estructura visual avanzada
- pendiente integracion completa y limpieza final de migracion

### 10.5 Productos

Archivo:

- `client/src/pages/Profile/products/Products.jsx`

Proposito:

- mostrar indicadores de inventario
- alojar grid de productos
- mostrar modal de edicion e imagen

Estado:

- migracion parcial
- faltan algunos elementos visuales respecto al frontend legacy

### 10.6 Proveedores

Archivo:

- `client/src/pages/Profile/supplier/Suplier.jsx`

Proposito:

- mostrar resumen y tabla de proveedores
- exponer formulario modal

Estado:

- estructura JSX presente
- migracion visual incompleta
- requiere cierre de CSS y estandarizacion

## 11. Integracion con backend

### 11.1 Cliente HTTP

El frontend usa Axios con:

- `baseURL = VITE_API_BASE_URL`
- `withCredentials = true`

Esto permite que el navegador envie automaticamente la cookie de sesion.

### 11.2 Endpoints ya integrados en la capa de sesion

- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/me`

## 12. Requisitos tecnicos de interfaz

El frontend debe mantener:

- navegacion SPA sin recarga completa
- estructura modular por pagina
- separacion entre layout, sesion y vistas
- consistencia visual entre modulos
- capacidad de extender cada modulo con llamadas HTTP reales

## 13. Dependencias principales

- `react`
- `react-dom`
- `react-router`
- `axios`
- `@fortawesome/react-fontawesome`
- `sweetalert2`
- `vite`

## 14. Restricciones y limitaciones actuales

- el frontend React aun no reemplaza al 100% la version `front/`
- algunos componentes conservan atributos heredados de HTML vanilla
- varias vistas aun no consumen la API del backend
- no existe una capa de servicios por dominio
- no existe manejo uniforme de estados de carga y error por modulo

## 15. Riesgos tecnicos identificados

- divergencia visual entre `front/` y `client/` durante la migracion
- inconsistencias si cada modulo consume la API sin una capa intermedia comun
- deuda tecnica por mezclar JSX nuevo con markup legacy adaptado

## 16. Criterios de aceptacion tecnicos

El frontend se considera correctamente implementado para esta fase si:

- la autenticacion funciona extremo a extremo con el backend
- las rutas privadas quedan protegidas
- el usuario autenticado puede navegar el panel
- la estructura base de todos los modulos existe en React
- la migracion visual desde `front/` avanza sin romper el layout principal

## 17. Mejoras futuras recomendadas

- completar la migracion visual faltante desde `front/`
- normalizar JSX legacy restante
- crear servicios o hooks por modulo
- integrar cada vista con endpoints reales
- unificar estados de `loading`, `error` y `empty`
- agregar pruebas de componentes y flujo de autenticacion
