import express from 'express';
import { AuthRequest, authenticateUser } from '../middleware/auth.js';
import { MockDataService } from '../services/mockDataService.js';
import { createError } from '../utils/errors.js';

const paymentRouter = express.Router();

interface PaymentRequest {
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
}

// POST /api/payment/process - Process payment and create order
paymentRouter.post('/process', async (req: AuthRequest, res, next) => {
  try {
    const { shippingInfo, paymentInfo }: PaymentRequest = req.body;

    // For mock payments, we'll simulate the process without real payment processing
    // In production, you would integrate with a real payment processor here

    // Validate required fields
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || 
        !shippingInfo.postalCode || !shippingInfo.country) {
      return next(createError('Missing required shipping information', 400));
    }

    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || 
        !paymentInfo.cvv || !paymentInfo.cardholderName) {
      return next(createError('Missing required payment information', 400));
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get cart items from localStorage (frontend) since we're using frontend cart
    // For this mock implementation, we'll create the order with provided items
    const cartItems = req.body.cartItems || [];
    
    if (cartItems.length === 0) {
      return next(createError('Cart is empty', 400));
    }

    // Calculate totals and create order items
    let totalEur = 0;
    let totalBgn = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
      const product = await MockDataService.getProductById(cartItem.id);
      if (!product) continue;

      const itemTotalEur = product.priceEur * cartItem.quantity;
      const itemTotalBgn = product.priceBgn * cartItem.quantity;
      
      totalEur += itemTotalEur;
      totalBgn += itemTotalBgn;
      
      orderItems.push({
        id: `item-${Date.now()}-${cartItem.id}`,
        orderId: '', // Will be set after order creation
        productId: cartItem.id,
        quantity: cartItem.quantity,
        priceEur: product.priceEur,
        priceBgn: product.priceBgn,
        createdAt: new Date()
      });

      // Email items removed - no longer sending emails
    }

    // Create order (without user ID for now since we're not requiring auth for checkout)
    const order = await MockDataService.createOrder({
      userId: req.user?.id || 'guest', // Allow guest checkout
      items: orderItems,
      totalEur,
      totalBgn,
      status: 'processing', // Set to processing since payment is "successful"
      paymentStatus: 'paid', // Mock payment success
      shippingAddress: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country
      },
      billingAddress: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country
      }
    });

    // Update order items with order ID
    order.items = orderItems.map(item => ({ ...item, orderId: order.id }));

    // Email notifications removed - order info will be available in admin panel
    console.log('Order created successfully:', order.id);
    console.log('Customer:', `${shippingInfo.firstName} ${shippingInfo.lastName}`);
    console.log('Items ordered:', orderItems.length);
    console.log('Total: €' + totalEur + ' / ' + totalBgn + ' лв');

    // Update inventory (reduce stock counts)
    for (const item of orderItems) {
      try {
        await MockDataService.updateProductStock(item.productId, -item.quantity);
      } catch (error) {
        console.warn(`Failed to update stock for product ${item.productId}:`, error);
      }
    }

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: {
          eur: totalEur,
          bgn: totalBgn
        },
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    next(createError('Payment processing failed', 500));
  }
});

export { paymentRouter };
