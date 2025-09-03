import { Router } from 'express';
import { MockDataService } from '../services/mockDataService.js';
import { createError } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.js';

export const ordersRouter = Router();

// GET /api/orders - Get user's orders
ordersRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const orders = await MockDataService.getOrdersByUser(userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - Get specific order
ordersRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const order = await MockDataService.getOrderById(id);
    
    if (!order) {
      return next(createError('Order not found', 404));
    }
    
    // Check if user owns this order or is admin
    if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
      return next(createError('Access denied', 403));
    }
    
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// POST /api/orders - Create new order from cart
ordersRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { shippingAddress, billingAddress } = req.body;
    
    // Get cart items
    const cartItems = await MockDataService.getCartItems(userId);
    if (cartItems.length === 0) {
      return next(createError('Cart is empty', 400));
    }
    
    // Calculate totals and create order items
    let totalEur = 0;
    let totalBgn = 0;
    const orderItems = [];
    
    for (const cartItem of cartItems) {
      const product = await MockDataService.getProductById(cartItem.productId);
      if (!product) continue;
      
      const itemTotalEur = product.priceEur * cartItem.quantity;
      const itemTotalBgn = product.priceBgn * cartItem.quantity;
      
      totalEur += itemTotalEur;
      totalBgn += itemTotalBgn;
      
      orderItems.push({
        id: `item-${Date.now()}-${cartItem.productId}`,
        orderId: '', // Will be set after order creation
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceEur: product.priceEur,
        priceBgn: product.priceBgn,
        createdAt: new Date()
      });
    }
    
    // Create order
    const order = await MockDataService.createOrder({
      userId,
      items: orderItems,
      totalEur,
      totalBgn,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress,
      billingAddress
    });
    
    // Update order items with order ID
    order.items = orderItems.map(item => ({ ...item, orderId: order.id }));
    
    // Clear cart after successful order
    await MockDataService.clearCart(userId);
    
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});
