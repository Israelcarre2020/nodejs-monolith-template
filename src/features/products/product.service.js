import { Op } from "sequelize";
import Product from "./product.model.js";
import User from "../users/user.model.js";
import { HTTP_STATUS } from "../../shared/constants/index.js";

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @param {string} userId - User ID creating the product
 * @returns {Object} Created product
 */
export const createProduct = async (productData, userId) => {
  const { name, description, price, stock } = productData;

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    userId
  });

  return product;
};

/**
 * Get all products with optional filters
 * @param {Object} filters - Filter options (userId, minPrice, maxPrice)
 * @returns {Array} List of products
 */
export const getAllProducts = async (filters = {}) => {
  const { userId, minPrice, maxPrice } = filters;
  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }

  const products = await Product.findAll({
    where,
    include: [{
      model: User,
      as: "user",
      attributes: ["id", "name", "email"]
    }],
    order: [["createdAt", "DESC"]]
  });

  return products;
};

/**
 * Get product by ID
 * @param {string} productId - Product ID
 * @returns {Object} Product data
 */
export const getProductById = async (productId) => {
  const product = await Product.findByPk(productId, {
    include: [{
      model: User,
      as: "user",
      attributes: ["id", "name", "email"]
    }]
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  return product;
};

/**
 * Update product
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @param {string} userId - User ID (must own the product)
 * @returns {Object} Updated product
 */
export const updateProduct = async (productId, productData, userId) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Check if user owns the product
  if (product.userId !== userId) {
    const error = new Error("Not authorized to update this product");
    error.statusCode = HTTP_STATUS.FORBIDDEN;
    throw error;
  }

  await product.update(productData);
  return product;
};

/**
 * Delete product
 * @param {string} productId - Product ID
 * @param {string} userId - User ID (must own the product)
 * @returns {Object} Success message
 */
export const deleteProduct = async (productId, userId) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Check if user owns the product
  if (product.userId !== userId) {
    const error = new Error("Not authorized to delete this product");
    error.statusCode = HTTP_STATUS.FORBIDDEN;
    throw error;
  }

  await product.destroy();
  return { message: "Product deleted successfully" };
};
