import { Category } from "../models/categoryModel.js";

export class CategoryController {
  static async getAllCategories(req, res) {
    const categories = await Category.getAllCategories();
    if (categories instanceof Error) {
      return res.status(500).json({ msg: categories.message });
    }
    res.status(200).json({ categories });
  }
  static async getCategoryById(req, res) {
    const { categori_id } = req.params;
    const category = await Category.getCategoryById(categori_id);
    if (category instanceof Error) {
      return res.status(404).json({ msg: category.message });
    }
    res.status(200).json({ category });
  }
}
