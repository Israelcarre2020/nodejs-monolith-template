import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./shared/middleware/errorHandler.js";
import { apiLimiter } from "./shared/middleware/rateLimiter.js";
import { logger } from "./shared/utils/logger.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Rate limiting
app.use("/api", apiLimiter);

// Routes
app.use("/", routes);

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
