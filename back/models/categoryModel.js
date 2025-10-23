import db from "../config/db.js";

export class Category {
  static async getAllCategories() {
    try {
      const [categories] = await db.query("SELECT categoria_id, nombre_categoria, descripcion_categoria FROM categorias");
      if (categories.length === 0) {
        throw new Error('No se pudieron obtener las categorías');
      }
      return categories;
    } catch (error) {
      return error;
    }
  }
  static async getCategoryById(categori_id) {
    try {
      const [[category]] = await db.query("SELECT categoria_id, nombre_categoria, descripcion_categoria FROM categorias WHERE categoria_id = ?", [categori_id]);
      if (!category) {
        throw new Error('Categoría no encontrada');
      }
      return category;
    } catch (error) {
      return error;
    }

  }
}
