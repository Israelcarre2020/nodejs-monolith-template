import { HTTP_STATUS } from "../../shared/constants/index.js";

/**
 * Validate product creation data
 */
export const validateCreateProduct = (req, res, next) => {
  const { name, price, stock } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }

  if (!price || isNaN(price) || parseFloat(price) < 0) {
    errors.push({ field: "price", message: "Valid price (>= 0) is required" });
  }

  if (stock !== undefined && (isNaN(stock) || parseInt(stock) < 0)) {
    errors.push({ field: "stock", message: "Stock must be a non-negative number" });
  }

  if (errors.length > 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Validation errors",
      errors
    });
  }

  next();
};

/**
 * Validate product update data
 */
export const validateUpdateProduct = (req, res, next) => {
  const { name, price, stock } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }

  if (price !== undefined && (isNaN(price) || parseFloat(price) < 0)) {
    errors.push({ field: "price", message: "Valid price (>= 0) is required" });
  }

  if (stock !== undefined && (isNaN(stock) || parseInt(stock) < 0)) {
    errors.push({ field: "stock", message: "Stock must be a non-negative number" });
  }

  if (errors.length > 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Validation errors",
      errors
    });
  }

  next();
};
