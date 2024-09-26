import express from "express";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import ProductController from "../../controllers/product.js";

const router= express.Router();
const productController= new ProductController();

router.get("/",authMiddleware,productController.getAllProducts);
router.post("/create",authMiddleware,productController.addProduct);
router.post("/update",authMiddleware,productController.updateProducts);
router.delete("/",authMiddleware,productController.deleteProduct);
router.get("/plugin",productController.getAllProductsPlugin);

export const productRouter = router;