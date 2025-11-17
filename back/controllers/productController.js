import { Product } from "../models/productModel.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../util/images.js";

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
        const imageUploaded = await uploadImageToCloudinary(req.file)
        if (imageUploaded instanceof Error) {
          throw imageUploaded;
        }

        uploadedImage = {public_id: imageUploaded?.publicId, secure_url: imageUploaded?.url};
        productData.imagen_url = imageUploaded?.url;
        productData.imagen_public_id = imageUploaded?.publicId;
      }
      const newProduct =  await Product.createProduct(productData);
      if (newProduct instanceof Error) {
        throw newProduct;
      }
      res.status(201).json(newProduct);
    } catch (error) {
      const deletedResult = await deleteImageFromCloudinary(uploadedImage.public_id);
      return res.status(500).json({ error: 'Error Creating the product', deleteStatus: deletedResult });
    }
  }

  static async updateBasicProduct(req, res) {
    const {id} =req.params
    const productData = req.body;
    const updatedProduct =  await Product.updateBasicProduct(id, productData);
    if (updatedProduct instanceof Error) {
      return res.status(500).json({ error: updatedProduct.message });
    }
    res.status(200).json({updatedProduct});
  }

  static async updateProductImage(req, res){
    const {id} =req.params
    try {
      const data = {}
      let uploadedImage = null
      if (req.file){
        const publicIdFromDB = await Product.getImagePublicId(id);
        if (publicIdFromDB instanceof Error) {
          throw publicIdFromDB;
        }
        await deleteImageFromCloudinary(publicIdFromDB);
        const imageUploaded = await uploadImageToCloudinary(req.file)
        if (imageUploaded instanceof Error) {
          throw imageUploaded;
        }

        uploadedImage = {public_id: imageUploaded?.publicId, secure_url: imageUploaded?.url};
        data.imagen_url = imageUploaded?.url;
        data.imagen_public_id = imageUploaded?.publicId;
      }
      const updatedProduct =  await Product.updateProductImage(id, data);
      if (updatedProduct instanceof Error) {
        throw updatedProduct;
      }
      res.status(200).json({success: true, updatedProduct});
    } catch (error) {
      const deletedResult = await deleteImageFromCloudinary(uploadedImage.public_id);
      return res.status(500).json({ success : false, error: 'Error updating the image', deleteStatus: deletedResult });
    }
  }

  static async getProductsStats(req, res){
    const stats =  await Product.getProductsStats();
    if (stats instanceof Error) {
      return res.status(500).json({ error: stats.message });
    }
    res.status(200).json({stats});
  }
}
