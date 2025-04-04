
CREATE DATABASE supermarketeudy;

-- Tabla de sucursales
CREATE TABLE sucursal (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE usersauth (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    id_sucursal INT,
    roles TEXT[] NOT NULL,
    password VARCHAR(255) NOT NULL,
    code_verification_id INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE SET NULL,
    FOREIGN KEY (code_verification_id) REFERENCES code_verification(id) ON DELETE SET NULL
);

-- Tabla de códigos de verificación
CREATE TABLE code_verification (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    id_sucursal INT,
    codigo_barras VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE SET NULL
);

-- Tabla de ventas
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    ventas_id VARCHAR(255) NOT NULL,
    id_sucursal INT,
    total NUMERIC(10, 2) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sucursal) REFERENCES sucursal(id) ON DELETE SET NULL
);

CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (id_venta) REFERENCES ventas(id) ON DELETE SET NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE SET NULL
);

