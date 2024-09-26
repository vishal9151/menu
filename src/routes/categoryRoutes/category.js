import express from "express";
import CategoryController from "../../controllers/category.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";

const router= express.Router();
const categoryController= new CategoryController();

router.get("/",authMiddleware,categoryController.getAllCategories);
router.post("/create",authMiddleware,categoryController.addNewCategory);
router.post("/update",authMiddleware,categoryController.updateCategory);
router.get("/delete",authMiddleware,categoryController.deleteCategory);
router.get("/plugin",categoryController.getAllCategoriesPlugin);

export const categoryRouter = router;