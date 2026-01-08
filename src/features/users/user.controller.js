import * as userService from "./user.service.js";
import { HTTP_STATUS } from "../../shared/constants/index.js";

/**
 * Register a new user
 * POST /api/users/register
 */
export const register = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/users/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/users/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users
 * GET /api/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
