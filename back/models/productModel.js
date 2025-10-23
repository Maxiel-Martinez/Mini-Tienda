import db from "../config/db.js";

export class Product {
  static async getAllProducts() {
    try {
      const [products] = await db.query(
        `SELECT id, nombre, descripcion, nombre_categoria, precio, stock, imagen_url
        FROM productos
        INNER JOIN categorias ON productos.categoria_id = categorias.categoria_id
        `);
      if (products.length === 0) {
        throw new Error('No se pudieron obtener los productos');
      }
      return products;
    } catch (error) {
      return error;
    }
  }
  static async getProductById(product_id) {
    try {
      const [[product]] = await db.query(
        `SELECT id, nombre, descripcion, nombre_categoria, precio, stock, imagen_url
        FROM productos
        INNER JOIN categorias ON productos.categoria_id = categorias.categoria_id
        WHERE id = ?`, [product_id]);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      return error;
    }
  }
  static async getProductsByCategory(category_id) {
    try {
      const [products] = await db.query(
        `SELECT id, nombre, descripcion, nombre_categoria, precio, stock, imagen_url
        FROM productos
        INNER JOIN categorias ON productos.categoria_id = categorias.categoria_id
        WHERE categorias.categoria_id = ?`, [category_id]);
      if (products.length === 0) {
        throw new Error('No se encontraron productos para esta categoría');
      }
      return products;
    } catch (error) {
      return error;
    }
  }
  static async createProduct(productData) {
    try {
      const { nombre, descripcion, categoria_id, precio, stock, imagen_url, imagen_public_id } = productData;
      const [result] = await db.query(
        `INSERT INTO productos (nombre, descripcion, categoria_id, precio, stock, imagen_url, imagen_public_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre, descripcion, categoria_id, precio, stock, imagen_url, imagen_public_id]
      );

      const [[newProduct]] = await db.query(
        `SELECT id, nombre, descripcion, categoria_id, precio, stock, imagen_url
        FROM productos
        WHERE id = ?`, [result.insertId]);

      return newProduct;
    } catch (error) {
      return error;
    }
  }
}
