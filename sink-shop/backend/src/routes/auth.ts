import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MockDataService } from "../services/mockDataService.js";
import { DatabaseService } from "../services/databaseService.js";
import { NewDatabaseService } from "../services/newDatabaseService.js";
import { config } from "../config/config.js";
import { createError } from "../middleware/errorHandler.js";

export const authRouter = Router();

// POST /api/auth/register - Register new user
authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = config.USE_MOCK_DATA
      ? await MockDataService.getUserByEmail(email)
      : await NewDatabaseService.getUserByEmail(email);

    if (existingUser) {
      return next(createError("User already exists with this email", 400));
    }

    // Create user
    const user = config.USE_MOCK_DATA
      ? await MockDataService.createUser({
          email,
          password,
          firstName,
          lastName,
          role: "user",
        })
      : await NewDatabaseService.createUser({
          email,
          password,
          firstName,
          lastName,
          role: "user",
        });

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login - Login user
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = config.USE_MOCK_DATA
      ? await MockDataService.getUserByEmail(email)
      : await NewDatabaseService.getUserByEmail(email);

    if (!user) {
      return next(createError("Invalid email or password", 401));
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(createError("Invalid email or password", 401));
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/verify - Verify token
authRouter.post("/verify", async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(createError("No token provided", 401));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    const user = config.USE_MOCK_DATA
      ? await MockDataService.getUserById(decoded.id)
      : await NewDatabaseService.getUserById(decoded.id);

    if (!user) {
      return next(createError("User not found", 404));
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    next(createError("Invalid token", 401));
  }
});
