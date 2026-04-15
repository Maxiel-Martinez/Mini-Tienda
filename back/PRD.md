# PRD Tecnico - Backend

## 1. Identificacion del proyecto

- Proyecto: Mini Tienda
- Componente: Backend
- Ubicacion: `back/`
- Stack principal: Node.js, Express, MySQL, express-session, Cloudinary
- Tipo de sistema: API HTTP para panel administrativo

## 2. Proposito del backend

El backend implementa la capa de servicios y persistencia de una aplicacion de gestion comercial para una tienda. Su responsabilidad es exponer endpoints HTTP que permitan autenticar al usuario administrador, consultar informacion del negocio y ejecutar operaciones de escritura sobre inventario, clientes, proveedores, pedidos y ventas.

Desde el punto de vista arquitectonico, este modulo centraliza:

- autenticacion y sesion
- acceso a base de datos
- reglas de negocio
- integracion con almacenamiento externo de imagenes
- serializacion de respuestas HTTP

## 3. Objetivos tecnicos

El backend debe cumplir con los siguientes objetivos:

- proveer una API consistente consumible por el frontend React
- encapsular la logica de acceso a MySQL
- proteger recursos privados mediante sesion de servidor
- mantener integridad basica del inventario al registrar y eliminar ventas
- soportar carga y actualizacion de imagenes de productos
- exponer estadisticas resumidas por modulo

## 4. Alcance funcional

### 4.1 Autenticacion

Incluye:

- login por correo y contrasena
- logout
- consulta del usuario autenticado
- middleware de proteccion de rutas

No incluye:

- registro publico de usuarios
- recuperacion de contrasena
- roles y permisos

### 4.2 Gestion de categorias

Incluye:

- consulta de todas las categorias
- consulta de categoria por identificador

### 4.3 Gestion de productos

Incluye:

- listado de productos
- consulta por id
- consulta por categoria
- creacion de producto
- actualizacion de informacion base
- actualizacion de imagen
- estadisticas de inventario

### 4.4 Gestion de clientes

Incluye:

- creacion
- consulta global
- consulta individual
- actualizacion
- eliminacion

### 4.5 Gestion de proveedores

Incluye:

- creacion
- consulta global
- consulta individual
- actualizacion
- eliminacion
- estadisticas
- consulta de pedidos por proveedor

### 4.6 Gestion de pedidos

Incluye:

- creacion de pedido
- consulta global
- consulta individual
- actualizacion de estado
- estadisticas

### 4.7 Gestion de ventas

Incluye:

- creacion de venta con detalle
- consulta global
- consulta individual con productos asociados
- eliminacion de venta
- estadisticas

## 5. Arquitectura del backend

La implementacion sigue una arquitectura por capas simple.

### 5.1 Punto de entrada

Archivo:

- `back/index.js`

Responsabilidades:

- cargar variables de entorno
- inicializar Express
- configurar CORS
- configurar parsing de JSON y formularios
- configurar `express-session`
- montar rutas por dominio
- iniciar el servidor HTTP

### 5.2 Capa de rutas

Archivos:

- `back/routes/userRouter.js`
- `back/routes/categoryRoutes.js`
- `back/routes/productRoutes.js`
- `back/routes/clienteRoutes.js`
- `back/routes/proveedorRoutes.js`
- `back/routes/pedidosRoutes.js`
- `back/routes/ventaRoutes.js`

Responsabilidad:

- definir endpoints y asociarlos a controladores

### 5.3 Capa de controladores

Archivos:

- `back/controllers/*.js`

Responsabilidades:

- leer parametros, body y archivos
- validar condiciones basicas
- invocar metodos del modelo
- convertir resultados en respuestas HTTP

### 5.4 Capa de modelos

Archivos:

- `back/models/*.js`

Responsabilidades:

- ejecutar consultas SQL
- transformar resultados de base de datos en objetos de dominio simples
- encapsular operaciones CRUD y consultas agregadas

### 5.5 Capa de infraestructura

Archivos relevantes:

- `back/config/db.js`
- `back/config/cloudinary.js`
- `back/util/sessionStore.js`
- `back/util/images.js`

Responsabilidades:

- conexion a MySQL
- configuracion de Cloudinary
- almacenamiento de sesiones
- carga y eliminacion de imagenes

## 6. Flujo de procesamiento

Flujo general de una solicitud:

1. El cliente envia una request HTTP a `/api/...`.
2. Express resuelve el endpoint montado en `index.js`.
3. Si la ruta es privada, se ejecuta `requiresAuth`.
4. El controlador extrae datos desde `req.params`, `req.body` o `req.file`.
5. El controlador invoca el modelo correspondiente.
6. El modelo ejecuta SQL usando el pool de `mysql2/promise`.
7. El controlador construye la respuesta JSON.
8. Express devuelve el resultado al cliente.

## 7. Gestion de autenticacion y sesion

El backend no utiliza JWT como mecanismo principal. El estado de autenticacion se mantiene con `express-session`.

### 7.1 Mecanismo

- el login valida credenciales contra la tabla `usuarios`
- si la validacion es correcta, el servidor regenera la sesion
- el objeto de usuario autenticado se guarda en `req.session.user`
- el cliente conserva la cookie de sesion
- las rutas privadas validan la existencia de `req.session.user`

### 7.2 Middleware de autorizacion

Archivo:

- `back/middlewares/auth.js`

Comportamiento:

- permite continuar si existe `req.session.user`
- responde `401` si no existe una sesion valida

## 8. Persistencia de datos

La persistencia se implementa con `mysql2/promise` usando un pool de conexiones.

Archivo principal:

- `back/config/db.js`

Caracteristicas:

- inicializacion del pool al arrancar el servidor
- verificacion de conexion al inicio
- uso de consultas SQL directas

Observacion tecnica:

- la implementacion actual no usa un ORM
- el acceso a datos se realiza con SQL manual

## 9. Manejo de imagenes

El modulo de productos permite almacenar imagenes en Cloudinary.

Flujo general:

1. `multer` procesa el archivo en memoria.
2. `uploadImageToCloudinary` carga el archivo al servicio externo.
3. El modelo almacena `imagen_url` e `imagen_public_id`.
4. En actualizacion de imagen, se elimina primero la imagen anterior.

Archivos relevantes:

- `back/routes/productRoutes.js`
- `back/controllers/productController.js`
- `back/util/images.js`

## 10. Modulos del dominio

### 10.1 Usuarios

Responsabilidad:

- autenticar al administrador
- cerrar sesion
- exponer datos del usuario autenticado

Archivos:

- `back/routes/userRouter.js`
- `back/controllers/userController.js`
- `back/models/userModel.js`

### 10.2 Categorias

Responsabilidad:

- exponer categorias para catalogacion y formularios

Archivos:

- `back/routes/categoryRoutes.js`
- `back/controllers/categoryController.js`
- `back/models/categoryModel.js`

### 10.3 Productos

Responsabilidad:

- administrar inventario base
- exponer listados y estadisticas
- gestionar imagen asociada

Archivos:

- `back/routes/productRoutes.js`
- `back/controllers/productController.js`
- `back/models/productModel.js`

### 10.4 Clientes

Responsabilidad:

- administrar datos de clientes
- mantener saldo asociado a operaciones comerciales

Archivos:

- `back/routes/clienteRoutes.js`
- `back/controllers/clienteController.js`
- `back/models/clienteModel.js`

### 10.5 Proveedores

Responsabilidad:

- administrar proveedores
- consultar su actividad operativa

Archivos:

- `back/routes/proveedorRoutes.js`
- `back/controllers/proveedorController.js`
- `back/models/proveedorModel.js`

### 10.6 Pedidos

Responsabilidad:

- registrar pedidos a proveedores
- consultar historial y estado de recepcion

Archivos:

- `back/routes/pedidosRoutes.js`
- `back/controllers/pedidosController.js`
- `back/models/pedidosModel.js`

### 10.7 Ventas

Responsabilidad:

- registrar ventas y sus detalles
- afectar stock
- afectar saldo del cliente cuando hay credito

Archivos:

- `back/routes/ventaRoutes.js`
- `back/controllers/ventaController.js`
- `back/models/ventaModel.js`

## 11. Reglas de negocio implementadas

### 11.1 Login

- el usuario debe existir
- el usuario debe estar activo
- la contrasena debe coincidir con el hash almacenado

### 11.2 Ventas

- una venta requiere total, metodo de pago y lista de productos
- al crear la venta se insertan registros en `detalle_ventas`
- al crear la venta se descuenta stock de `productos`
- si existe saldo restante y cliente asociado, se incrementa el saldo del cliente
- al eliminar una venta se revierte el stock y el saldo afectado

### 11.3 Productos

- al crear un producto con imagen se almacena referencia externa
- al reemplazar imagen se elimina la imagen anterior de Cloudinary

## 12. Endpoints expuestos

### 12.1 Endpoints publicos

- `GET /`
- `POST /api/users/login`
- `POST /api/users/logout`

### 12.2 Endpoints autenticados

#### Usuarios

- `GET /api/users/me`

#### Categorias

- `GET /api/categories`
- `GET /api/categories/:categori_id`

#### Productos

- `GET /api/products/stats`
- `GET /api/products/category/:category_id`
- `GET /api/products`
- `GET /api/products/:product_id`
- `POST /api/products`
- `PUT /api/products/:id`
- `PUT /api/products/image/:id`

#### Clientes

- `POST /api/clientes`
- `GET /api/clientes`
- `GET /api/clientes/:id`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

#### Proveedores

- `POST /api/proveedores`
- `GET /api/proveedores`
- `GET /api/proveedores/estadisticas`
- `GET /api/proveedores/:id/pedidos`
- `GET /api/proveedores/:id`
- `PUT /api/proveedores/:id`
- `DELETE /api/proveedores/:id`

#### Pedidos

- `GET /api/pedidos/stats`
- `GET /api/pedidos/:pedido_id`
- `GET /api/pedidos`
- `POST /api/pedidos`
- `PUT /api/pedidos/:pedido_id/status`

#### Ventas

- `POST /api/ventas`
- `GET /api/ventas`
- `GET /api/ventas/estadisticas`
- `GET /api/ventas/:id`
- `DELETE /api/ventas/:id`

## 13. Dependencias y servicios externos

Dependencias principales:

- `express`
- `mysql2`
- `express-session`
- `express-mysql-session`
- `bcryptjs`
- `multer`
- `cloudinary`
- `cors`

Servicios externos:

- MySQL
- Cloudinary

## 14. Configuracion requerida

Variables de entorno esperadas:

- `PORT`
- `NODE_ENV`
- `FRONTEND_ORIGIN`
- `SESSION_SECRET`
- `SESSION_NAME`
- `SESSION_SAMESITE`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- variables de Cloudinary

## 15. Restricciones y limitaciones actuales

- no existe capa formal de validacion de esquemas
- no existe documentacion OpenAPI
- no existe suite de pruebas automatizadas
- algunos procesos criticos no usan transacciones SQL explicitas
- la API esta orientada a un solo administrador y no a multiples perfiles

## 16. Riesgos tecnicos identificados

- si una operacion compuesta falla a mitad de proceso, puede haber inconsistencias sin transaccion explicita
- el manejo de errores no esta completamente estandarizado entre todos los controladores
- la seguridad depende de configuracion correcta de cookies, CORS y variables de entorno

## 17. Criterios de aceptacion tecnicos

El backend se considera correctamente implementado para este proyecto si:

- inicia y se conecta a MySQL sin errores
- mantiene sesion valida por cookie
- protege rutas privadas con `requiresAuth`
- permite CRUD sobre entidades principales
- actualiza inventario al registrar y eliminar ventas
- permite gestionar imagenes de productos
- responde JSON consumible por el frontend

## 18. Mejoras futuras recomendadas

- agregar validacion estructurada de payloads
- agregar pruebas unitarias e integracion
- introducir transacciones SQL en ventas y operaciones compuestas
- normalizar formato de errores
- generar documentacion OpenAPI
- separar mejor DTOs, servicios y acceso a datos si el proyecto crece
