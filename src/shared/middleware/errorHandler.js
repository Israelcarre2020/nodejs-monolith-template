import { logger } from "../utils/logger.js";
import { HTTP_STATUS } from "../constants/index.js";

/**
 * Global error handler middleware
 * Handles all errors and returns consistent error responses
 */
export const errorHandler = (err, req, res, next) => {
  logger.error("Error:", err);

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: "Duplicate entry",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: `${e.path} already exists`
      }))
    });
  }

  // Sequelize foreign key constraint errors
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Foreign key constraint violation",
      error: err.message
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Invalid token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Token expired"
    });
  }

  // Custom application errors
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
