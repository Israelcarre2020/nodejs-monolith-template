import * as productService from "./product.service.js";
import { HTTP_STATUS } from "../../shared/constants/index.js";

/**
 * Create a new product
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.user.id);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products
 * GET /api/products
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const filters = {
      userId: req.query.userId,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined
    };

    const products = await productService.getAllProducts(filters);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id, req.user.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
