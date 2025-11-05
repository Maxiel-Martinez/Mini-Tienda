import { Router } from "express";
import { ProductController } from "../controllers/productController.js";
import multer from "multer";

export const productRouter = Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

productRouter.get("/", ProductController.getAllProducts);
productRouter.get("/:product_id", ProductController.getProductById);
productRouter.get("/category/:category_id", ProductController.getProductsByCategory);
productRouter.post("/", upload.single('image'), ProductController.createProduct);
productRouter.put("/:id", ProductController.updateBasicProduct);
productRouter.put("/image/:id", upload.single('image'), ProductController.updateProductImage);
