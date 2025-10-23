import { Router } from "express";
import { CategoryController } from "../controllers/categoryController.js";


export const categoryRouter = Router();

categoryRouter.get("/", CategoryController.getAllCategories);
categoryRouter.get("/:categori_id", CategoryController.getCategoryById);
