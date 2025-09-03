import { Router } from 'express';
import { MockDataService } from '../services/mockDataService.js';
import { createError } from '../middleware/errorHandler.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware, adminMiddleware, type AuthRequest } from '../middleware/auth.js';
import path from 'path';

export const productsRouter = Router();

// GET /api/products - Get all products
productsRouter.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    
    let products;
    if (category && typeof category === 'string') {
      products = await MockDataService.getProductsByCategory(category);
    } else {
      products = await MockDataService.getAllProducts();
    }
    
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get single product
productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await MockDataService.getProductById(id);
    
    if (!product) {
      return next(createError('Product not found', 404));
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create new product (admin only)
productsRouter.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req: AuthRequest, res, next) => {
  try {
    const { titleEn, titleBg, descriptionEn, descriptionBg, tag, category, priceEur, priceBgn } = req.body;
    
    if (!req.file) {
      return next(createError('Product image is required', 400));
    }

    // Create image URL (relative to server)
    const imageUrl = `/uploads/${req.file.filename}`;

    const productData = {
      title: {
        en: titleEn,
        bg: titleBg
      },
      description: {
        en: descriptionEn,
        bg: descriptionBg
      },
      tag: tag || '',
      category,
      priceEur: parseFloat(priceEur),
      priceBgn: parseFloat(priceBgn),
      image: imageUrl,
      date: new Date().toISOString(),
      salesCount: 0
    };

    const product = await MockDataService.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update product (admin only)
productsRouter.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { titleEn, titleBg, descriptionEn, descriptionBg, tag, category, priceEur, priceBgn } = req.body;
    
    let updateData: any = {
      title: {
        en: titleEn,
        bg: titleBg
      },
      description: {
        en: descriptionEn,
        bg: descriptionBg
      },
      tag: tag || '',
      category,
      priceEur: parseFloat(priceEur),
      priceBgn: parseFloat(priceBgn)
    };

    // If new image uploaded, add to update data
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await MockDataService.updateProduct(id, updateData);
    
    if (!product) {
      return next(createError('Product not found', 404));
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete product (admin only)  
productsRouter.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await MockDataService.deleteProduct(id);
    
    if (!deleted) {
      return next(createError('Product not found', 404));
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});
