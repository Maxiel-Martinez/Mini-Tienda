DROP DATABASE IF EXISTS variedades_dakota;
CREATE DATABASE variedades_dakota
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE variedades_dakota;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_login DATETIME NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion_categoria VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria_id INT NOT NULL,
    imagen_public_id VARCHAR(200) DEFAULT NULL,
    imagen_url VARCHAR(500) DEFAULT NULL,
    CONSTRAINT chk_productos_precio CHECK (precio >= 0),
    CONSTRAINT chk_productos_stock CHECK (stock >= 0),
    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(categoria_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    direccion VARCHAR(150) DEFAULT NULL,
    saldo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT uq_clientes_correo UNIQUE (correo),
    CONSTRAINT chk_clientes_saldo CHECK (saldo >= 0)
) ENGINE=InnoDB;

CREATE TABLE metodo_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metodo_pago VARCHAR(50) NOT NULL,
    CONSTRAINT uq_metodo_pago UNIQUE (metodo_pago)
) ENGINE=InnoDB;

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_id INT NULL,
    total DECIMAL(10,2) NOT NULL,
    saldo_restante DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    venta_pagada BOOLEAN GENERATED ALWAYS AS (saldo_restante = 0) STORED,
    metodo_pago_id INT NOT NULL,
    CONSTRAINT chk_ventas_total CHECK (total >= 0),
    CONSTRAINT chk_ventas_saldo_restante CHECK (saldo_restante >= 0),
    CONSTRAINT chk_ventas_total_vs_saldo CHECK (total >= saldo_restante),
    CONSTRAINT fk_ventas_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_ventas_metodo_pago
        FOREIGN KEY (metodo_pago_id)
        REFERENCES metodo_pago(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT chk_detalle_ventas_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_detalle_ventas_precio CHECK (precio_unitario >= 0),
    CONSTRAINT uq_detalle_venta_producto UNIQUE (venta_id, producto_id),
    CONSTRAINT fk_detalle_ventas_venta
        FOREIGN KEY (venta_id)
        REFERENCES ventas(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_detalle_ventas_producto
        FOREIGN KEY (producto_id)
        REFERENCES productos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    empresa VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'recibido', 'cancelado') NOT NULL DEFAULT 'pendiente',
    CONSTRAINT chk_pedidos_total CHECK (total >= 0),
    CONSTRAINT fk_pedidos_proveedor
        FOREIGN KEY (proveedor_id)
        REFERENCES proveedores(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE pedidos_productos (
    id_pedido_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_pedido INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario_compra DECIMAL(10,2) NOT NULL,
    CONSTRAINT chk_pedidos_productos_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_pedidos_productos_precio CHECK (precio_unitario_compra >= 0),
    CONSTRAINT uq_pedido_producto UNIQUE (id_pedido, id_producto),
    CONSTRAINT fk_pedidos_productos_producto
        FOREIGN KEY (id_producto)
        REFERENCES productos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_pedidos_productos_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO usuarios (nombre_completo, correo, contrasena_hash, activo)
VALUES (
    'Admin',
    'admin@admin.com',
    '$2a$12$J3mlG9Z1jA/VsxPfjrQGsOSKG.YYP8mVZsSiubxR5fxEghmooLcYG',
    TRUE
);

INSERT INTO metodo_pago (metodo_pago) VALUES
('Efectivo'),
('Nequi'),
('Bancolombia'),
('Credito Cliente');

INSERT INTO categorias (nombre_categoria, descripcion_categoria) VALUES
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
