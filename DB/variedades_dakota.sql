DROP DATABASE variedades_dakota;
CREATE DATABASE IF NOT EXISTS variedades_dakota;
USE variedades_dakota;

CREATE TABLE IF NOT EXISTS roles(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE categorias (
  categoria_id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
  descripcion_categoria VARCHAR(255) DEFAULT NULL
);

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categoria_id INT NOT NULL,
    imagen_url VARCHAR(255),
    FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id)
);

-- Tabla de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, 
    telefono VARCHAR(20) NOT NULL,
    coreo VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    saldo DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE metodo_pago(
	id INT AUTO_INCREMENT PRIMARY KEY,
    metodo_pago TEXT
);

-- Tabla de ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    cliente_id INT NULL,
    total DECIMAL(10,2) NOT NULL,
    saldo_restante DECIMAL(10,2) DEFAULT 0.00,
    venta_pagada BOOLEAN GENERATED ALWAYS AS (saldo_restante = 0) STORED,
    metodo_pago_id INT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES metodo_pago(id)
);

-- Detalle de cada venta
CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de proveedores
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    empresa VARCHAR(100)
);

-- Pedidos a proveedores
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'recibido', 'cancelado') DEFAULT 'pendiente',
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

CREATE TABLE pedidos_productos (
	id_pedido_producto INT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_pedido INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id)
);

INSERT INTO roles (nombre_rol) VALUES 
('Administador'),
('Empleado');

INSERT INTO usuarios(nombre_completo, correo, contrasena, rol_id) VALUES
('Admin', 'admin@admin.com', '$2a$10$.qUBiiHheGusLqILTJjlt.52EnLOc4tj4UXpSiC2lTWuxrzGXGC96', 1); -- pass 1234567890

INSERT INTO metodo_pago(metodo_pago) VALUES
('Efectivo'),
('Nequi'),
('Bancolombia'),
('Credito Cliente');

INSERT INTO categorias (nombre_categoria, descripcion_categoria)
VALUES
('Paquetes', 'Productos empacados como snacks, pastas o arroz'),
('Gaseosas', 'Bebidas carbonatadas de diferentes sabores y tamaños'),
('Jugos', 'Jugos naturales o procesados, en botella o bolsa'),
('Leche', 'Productos lácteos líquidos de diferentes marcas y presentaciones'),
('Salchicha', 'Embutidos y productos similares para comidas rápidas'),
('Cerveza', 'Bebidas alcohólicas tipo cerveza'),
('Aseo Personal', 'Productos de higiene y cuidado personal'),
('Aseo para el Hogar', 'Artículos de limpieza y desinfección doméstica'),
('Galletas para Mascotas', 'Snacks y galletas para perros y gatos'),
('Dulces', 'Caramelos, chocolates y confitería en general');
