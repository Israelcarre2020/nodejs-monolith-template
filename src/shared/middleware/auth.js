import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../constants/index.js";

/**
 * Middleware to authenticate JWT tokens
 * Adds user info to req.user if token is valid
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Access token required"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    req.user = user;
    next();
  });
};
