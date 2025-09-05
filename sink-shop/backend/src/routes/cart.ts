import { Router } from "express";
import { MockDataService } from "../services/mockDataService.js";
import { DatabaseService } from "../services/databaseService.js";
import { NewDatabaseService } from "../services/newDatabaseService.js";
import { config } from "../config/config.js";
import { createError } from "../middleware/errorHandler.js";
import type { AuthRequest } from "../middleware/auth.js";

export const cartRouter = Router();

// GET /api/cart - Get user's cart items
cartRouter.get("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const cartItems = config.USE_MOCK_DATA
      ? await MockDataService.getCartItems(userId)
      : await NewDatabaseService.getCartItems(userId);

    // Populate with product details
    const populatedItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = config.USE_MOCK_DATA
          ? await MockDataService.getProductById(item.productId)
          : await NewDatabaseService.getProductById(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    res.json(populatedItems);
  } catch (error) {
    next(error);
  }
});

// POST /api/cart - Add item to cart
cartRouter.post("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity } = req.body;

    // Verify product exists
    const product = config.USE_MOCK_DATA
      ? await MockDataService.getProductById(productId)
      : await NewDatabaseService.getProductById(productId);
    if (!product) {
      return next(createError("Product not found", 404));
    }

    const cartItem = config.USE_MOCK_DATA
      ? await MockDataService.addToCart(userId, productId, quantity)
      : await NewDatabaseService.addToCart(userId, productId, quantity);
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
});

// PUT /api/cart/:id - Update cart item quantity
cartRouter.put("/:id", async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = config.USE_MOCK_DATA
      ? await MockDataService.updateCartItem(id, quantity)
      : await NewDatabaseService.updateCartItem(id, quantity);
    if (!cartItem) {
      return next(createError("Cart item not found", 404));
    }

    res.json(cartItem);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/:id - Remove item from cart
cartRouter.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const removed = config.USE_MOCK_DATA
      ? await MockDataService.removeFromCart(id)
      : await NewDatabaseService.removeFromCart(id);
    if (!removed) {
      return next(createError("Cart item not found", 404));
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart - Clear entire cart
cartRouter.delete("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    if (config.USE_MOCK_DATA) {
      await MockDataService.clearCart(userId);
    } else {
      await NewDatabaseService.clearCart(userId);
    }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
});
