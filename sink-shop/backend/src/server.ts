import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { config } from "./config/config.js";
import { testConnection, closePool } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authMiddleware } from "./middleware/auth.js";

// Route imports
import { productsRouter } from "./routes/products.js";
import { cartRouter } from "./routes/cart.js";
import { ordersRouter } from "./routes/orders.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { paymentRouter } from "./routes/payment.js";

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [config.FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Email functionality removed - orders will be tracked in admin panel only

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", authMiddleware, cartRouter);
app.use("/api/orders", authMiddleware, ordersRouter);
app.use("/api/payment", paymentRouter); // No auth required for guest checkout
app.use("/api/admin", authMiddleware, adminRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = config.PORT || 3001;

// Test database connection on startup
testConnection().then((connected) => {
  if (!connected && !config.USE_MOCK_DATA) {
    console.warn("⚠️  Database connection failed, but server will start with mock data");
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  await closePool();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down server...");
  await closePool();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database mode: ${config.USE_MOCK_DATA ? "Mock Data" : "PostgreSQL"}`);
});
