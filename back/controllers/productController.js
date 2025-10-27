import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/productModel.js";

export class ProductController {
  static async getAllProducts(req, res) {
    const products =  await Product.getAllProducts();
    if (products instanceof Error) {
      return res.status(500).json({ error: products.message });
    }
    res.status(200).json({products});
  }
  static async getProductById(req, res) {
    const { product_id } = req.params;
    const product =  await Product.getProductById(product_id);
    if (product instanceof Error) {
      return res.status(404).json({ error: product.message });
    }
    res.status(200).json(product);
  }
  static async getProductsByCategory(req, res) {
    const { category_id } = req.params;
    const products =  await Product.getProductsByCategory(category_id);
    if (products instanceof Error) {
      return res.status(404).json({ error: products.message });
    }
    res.status(200).json({products});
  }
  static async createProduct(req, res) {
    let uploadedImage = null
    try {
      const productData = req.body;
      if (req.file){
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
        const uploadImage = await cloudinary.uploader.upload(base64Image, { folder: 'products' });

        uploadedImage = uploadImage;
        productData.imagen_url = uploadImage.secure_url;
        productData.imagen_public_id = uploadImage.public_id;
      }
      const newProduct =  await Product.createProduct(productData);
      if (newProduct instanceof Error) {
        throw newProduct;
      }
      res.status(201).json(newProduct);
    } catch (error) {

  static async updateBasicProduct(req, res) {
    const {id} =req.params
    const productData = req.body;
    const updatedProduct =  await Product.updateBasicProduct(id, productData);
    if (updatedProduct instanceof Error) {
      return res.status(500).json({ error: updatedProduct.message });
    }
    res.status(200).json({updatedProduct});
  }
    }
  }
}
