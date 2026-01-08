import User from "./user.model.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../../shared/constants/index.js";

/**
 * Create a new user
 * @param {Object} userData - User data (email, password, name)
 * @returns {Object} Created user (without password)
 */
export const createUser = async (userData) => {
  const { email, password, name } = userData;
  
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error("User with this email already exists");
    error.statusCode = HTTP_STATUS.CONFLICT;
    throw error;
  }

  const user = await User.create({ email, password, name });
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  };
};

/**
 * Authenticate user and generate JWT token
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Token and user data
 */
export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object} User data (without password)
 */
export const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] }
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  return user;
};

/**
 * Get all users
 * @returns {Array} List of users (without passwords)
 */
export const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]]
  });
  return users;
};
