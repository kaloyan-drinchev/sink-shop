export const config = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  // Database (for when PostgreSQL is available)
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/sinkshop",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Stripe (for payments)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  // Email configuration
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",

  // Mock data mode (switch to false when PostgreSQL is ready)
  USE_MOCK_DATA: process.env.USE_MOCK_DATA === "true" ? true : false,
};
