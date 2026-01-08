import express from "express";
import * as userController from "./user.controller.js";
import { validateRegister, validateLogin } from "./user.validators.js";
import { authenticateToken } from "../../shared/middleware/auth.js";
import { authLimiter } from "../../shared/middleware/rateLimiter.js";

const router = express.Router();

// Public routes
router.post("/register", authLimiter, validateRegister, userController.register);
router.post("/login", authLimiter, validateLogin, userController.login);

// Protected routes
router.get("/profile", authenticateToken, userController.getProfile);
router.get("/", authenticateToken, userController.getAllUsers);

export default router;
