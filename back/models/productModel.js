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
        `SELECT id, nombre, descripcion, categoria_id, precio, stock, imagen_url
        FROM productos
        WHERE id = ?`, [product_id]);
      if (!product) {
        throw new Error('Producto no encontrado por ID');
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

  static async updateBasicProduct(id, data){
    try {
      const { nombre, descripcion, categoria_id, precio, stock } = data;
      await db.query(
        `UPDATE productos
        SET nombre = ?, descripcion = ?, categoria_id = ?, precio = ?, stock = ?
        WHERE id = ?`,
        [nombre, descripcion, categoria_id, precio, stock, id]
      );
      const [[updatedProduct]] = await db.query(
        `SELECT id, nombre, descripcion, categoria_id, precio, stock, imagen_url
        FROM productos
        WHERE id = ?`, [id]);

        if (!updatedProduct) {
          throw new Error('Producto no encontrado después de la actualización');
        }
      return updatedProduct;
    } catch (error) {
      return error;
    }
  }

  static async updateProductImage(id, data){
    try {
      const { imagen_url, imagen_public_id } = data;
      await db.query(
        `UPDATE productos
        SET imagen_url = ?, imagen_public_id = ?
        WHERE id = ?`,
        [imagen_url, imagen_public_id, id]
      );
      const [[updatedProduct]] = await db.query(
        `SELECT id, nombre, descripcion, categoria_id, precio, stock, imagen_url
        FROM productos
        WHERE id = ?`, [id]);
      if (!updatedProduct) {
        throw new Error('Producto no encontrado después de la actualización de imagen');
      }
      return updatedProduct
    } catch (error) {
      return error
    }
  }

  static async getProductsStats(){
    try {
      const [[result]] = await db.query(
        `
        SELECT
          SUM(precio) AS valor_inventario,
          COUNT(id) AS total_productos,
          IFNULL((SELECT COUNT(id) FROM variedades_dakota.productos WHERE stock <= 5), 0) AS bajo_stock,
          IFNULL((SELECT COUNT(id) FROM variedades_dakota.productos WHERE stock = 0), 0) AS agotados
        FROM variedades_dakota.productos;
        `
      )
      if (!result){
        throw new Error('No se pudieron obtener las estadísticas de productos');
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  static async getImagePublicId(id){
    try {
      const [[product]] = await db.query(
        `SELECT imagen_public_id FROM productos WHERE id = ?`, [id]);
      if (!product) {
        throw new Error('Producto no encontrado por imagen ID');
      }
      return product.imagen_public_id;
    } catch (error) {
      return error;
    }
  }
}
