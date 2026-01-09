import express from "express";
import * as productController from "./product.controller.js";
import { validateCreateProduct, validateUpdateProduct } from "./product.validators.js";
import { authenticateToken } from "../../shared/middleware/auth.js";
import { apiLimiter } from "../../shared/middleware/rateLimiter.js";

const router = express.Router();

// All product routes require authentication
router.use(authenticateToken);

// Routes
router.post("/", validateCreateProduct, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", validateUpdateProduct, productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
