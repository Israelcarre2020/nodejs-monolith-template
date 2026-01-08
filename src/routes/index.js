import express from "express";
import userRoutes from "../features/users/user.routes.js";
import productRoutes from "../features/products/product.routes.js";

const router = express.Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Feature routes
router.use("/api/users", userRoutes);
router.use("/api/products", productRoutes);

export default router;
