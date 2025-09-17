import { Router } from "express";
import { MockDataService } from "../services/mockDataService.js";
import { DatabaseService } from "../services/databaseService.js";
import { NewDatabaseService } from "../services/newDatabaseService.js";
import { config } from "../config/config.js";
import { createError } from "../middleware/errorHandler.js";
import { upload } from "../middleware/upload.js";
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/auth.js";
import path from "path";

export const productsRouter = Router();

// GET /api/products - Get all products
productsRouter.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;

    let products;
    if (category && typeof category === "string") {
      products = config.USE_MOCK_DATA
        ? await MockDataService.getProductsByCategory(category)
        : await NewDatabaseService.getProductsByCategory(category);
    } else {
      products = config.USE_MOCK_DATA
        ? await MockDataService.getAllProducts()
        : await NewDatabaseService.getAllProducts();
    }

    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get single product
productsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = config.USE_MOCK_DATA
      ? await MockDataService.getProductById(id)
      : await NewDatabaseService.getProductById(id);

    if (!product) {
      return next(createError("Product not found", 404));
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create new product (admin only)
productsRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req: AuthRequest, res, next) => {
    try {
      const {
        serialNumber,
        modelEn,
        modelBg,
        titleEn,
        titleBg,
        descriptionEn,
        descriptionBg,
        materialEn,
        materialBg,
        colorEn,
        colorBg,
        dimensions,
        weight,
        mountingEn,
        mountingBg,
        tag,
        category,
        priceEur,
        priceBgn,
      } = req.body;

      if (!req.file) {
        return next(createError("Product image is required", 400));
      }

      // Create image URL (relative to server)
      const imageUrl = `/uploads/${req.file.filename}`;

      // Generate slug from title
      const slug = titleEn
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      const productData = {
        serialNumber,
        model: {
          en: modelEn,
          bg: modelBg,
        },
        title: {
          en: titleEn,
          bg: titleBg,
        },
        description: {
          en: descriptionEn,
          bg: descriptionBg,
        },
        material: {
          en: materialEn,
          bg: materialBg,
        },
        color: {
          en: colorEn,
          bg: colorBg,
        },
        dimensions: dimensions,
        weight: weight,
        mounting: {
          en: mountingEn,
          bg: mountingBg,
        },
        manufacture: {
          en: "hand-made",
          bg: "ръчен труд",
        },
        tag: tag || "",
        category,
        priceEur: parseFloat(priceEur),
        priceBgn: parseFloat(priceBgn),
        image: imageUrl,
        slug: slug,
        date: new Date().toISOString(),
        salesCount: 0,
      };

      const product = config.USE_MOCK_DATA
        ? await MockDataService.createProduct(productData)
        : await NewDatabaseService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/products/:id - Update product (admin only)
productsRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const {
        serialNumber,
        modelEn,
        modelBg,
        titleEn,
        titleBg,
        descriptionEn,
        descriptionBg,
        materialEn,
        materialBg,
        colorEn,
        colorBg,
        dimensions,
        weight,
        mountingEn,
        mountingBg,
        tag,
        category,
        priceEur,
        priceBgn,
      } = req.body;

      let updateData: any = {
        serialNumber,
        model: {
          en: modelEn,
          bg: modelBg,
        },
        title: {
          en: titleEn,
          bg: titleBg,
        },
        description: {
          en: descriptionEn,
          bg: descriptionBg,
        },
        material: {
          en: materialEn,
          bg: materialBg,
        },
        color: {
          en: colorEn,
          bg: colorBg,
        },
        dimensions: dimensions,
        weight: weight,
        mounting: {
          en: mountingEn,
          bg: mountingBg,
        },
        manufacture: {
          en: "hand-made",
          bg: "ръчен труд",
        },
        tag: tag || "",
        category,
        priceEur: parseFloat(priceEur),
        priceBgn: parseFloat(priceBgn),
      };

      // If new image uploaded, add to update data
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const product = config.USE_MOCK_DATA
        ? await MockDataService.updateProduct(id, updateData)
        : await NewDatabaseService.updateProduct(id, updateData);

      if (!product) {
        return next(createError("Product not found", 404));
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/products/:id - Delete product (admin only)
productsRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const deleted = config.USE_MOCK_DATA
        ? await MockDataService.deleteProduct(id)
        : await NewDatabaseService.deleteProduct(id);

      if (!deleted) {
        return next(createError("Product not found", 404));
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

// Check if serial number exists
productsRouter.get("/check-serial/:serialNumber", async (req, res, next) => {
  try {
    const { serialNumber } = req.params;

    const products = config.USE_MOCK_DATA
      ? await MockDataService.getAllProducts()
      : await NewDatabaseService.getAllProducts();

    const exists = products.some((product) => product.serialNumber === serialNumber);

    res.json({ exists, serialNumber });
  } catch (error) {
    next(error);
  }
});
