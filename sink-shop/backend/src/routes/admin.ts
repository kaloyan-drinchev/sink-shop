import { Router } from 'express';
import { MockDataService, mockOrders, mockUsers } from '../services/mockDataService.js';
import { adminMiddleware } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

export const adminRouter = Router();

// Apply admin middleware to all routes
adminRouter.use(adminMiddleware);

// GET /api/admin/products - Get all products (admin view)
adminRouter.get('/products', async (req: AuthRequest, res, next) => {
  try {
    const products = await MockDataService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/orders - Get all orders
adminRouter.get('/orders', async (req: AuthRequest, res, next) => {
  try {
    res.json(mockOrders);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users - Get all users  
adminRouter.get('/users', async (req: AuthRequest, res, next) => {
  try {
    const users = mockUsers.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/stats - Get dashboard statistics
adminRouter.get('/stats', async (req: AuthRequest, res, next) => {
  try {
    const products = await MockDataService.getAllProducts();
    const orders = mockOrders;
    const users = mockUsers;
    
    const stats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.filter(u => u.role === 'user').length,
      totalRevenue: {
        eur: orders.reduce((sum, order) => sum + order.totalEur, 0),
        bgn: orders.reduce((sum, order) => sum + order.totalBgn, 0)
      },
      recentOrders: orders
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5),
      topProducts: products
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 5)
    };
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/orders/:id/status - Update order status
adminRouter.put('/orders/:id/status', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (status) mockOrders[orderIndex].status = status;
    if (paymentStatus) mockOrders[orderIndex].paymentStatus = paymentStatus;
    mockOrders[orderIndex].updatedAt = new Date();
    
    res.json(mockOrders[orderIndex]);
  } catch (error) {
    next(error);
  }
});
