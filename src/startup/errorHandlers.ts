import process from "process";
import { logger } from "./logger";

export const handleGlobalErrors = () => {
  // Handle uncaught exceptions (synchronous errors that aren't caught)
  process.on("uncaughtException", (err) => {
    logger.error("🚨 Uncaught Exception:", err);
    process.exit(1); // Exit process with failure
  });

  // Handle unhandled promise rejections (async errors that aren't caught)
  process.on("unhandledRejection", (reason, promise) => {
    console.log(reason)
    logger.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1); // Exit process with failure
  });

  // Handle graceful shutdown (CTRL+C or Docker stop)
  process.on("SIGTERM", () => {
    logger.info("🛑 SIGTERM received. Shutting down gracefully...");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    logger.info("🛑 SIGINT received. Shutting down gracefully...");
    process.exit(0);
  });
};
