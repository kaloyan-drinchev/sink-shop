import express from "express";
import { AuthRequest, authenticateUser } from "../middleware/auth.js";
import { MockDataService } from "../services/mockDataService.js";
import { NewDatabaseService } from "../services/newDatabaseService.js";
import { emailService } from "../services/emailService.js";
import { config } from "../config/config.js";
import { createError } from "../utils/errors.js";

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
paymentRouter.post("/process", async (req: AuthRequest, res, next) => {
  try {
    const { shippingInfo, paymentInfo }: PaymentRequest = req.body;

    // For mock payments, we'll simulate the process without real payment processing
    // In production, you would integrate with a real payment processor here

    // Validate required fields
    if (
      !shippingInfo.firstName ||
      !shippingInfo.lastName ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.postalCode ||
      !shippingInfo.country
    ) {
      return next(createError("Missing required shipping information", 400));
    }

    if (
      !paymentInfo.cardNumber ||
      !paymentInfo.expiryDate ||
      !paymentInfo.cvv ||
      !paymentInfo.cardholderName
    ) {
      return next(createError("Missing required payment information", 400));
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get cart items from localStorage (frontend) since we're using frontend cart
    // For this mock implementation, we'll create the order with provided items
    const cartItems = req.body.cartItems || [];

    if (cartItems.length === 0) {
      return next(createError("Cart is empty", 400));
    }

    // Calculate totals and create order items
    let totalEur = 0;
    let totalBgn = 0;
    const orderItems = [];
    const emailItems = [];

    for (const cartItem of cartItems) {
      const product = config.USE_MOCK_DATA
        ? await MockDataService.getProductById(cartItem.id)
        : await NewDatabaseService.getProductById(cartItem.id);

      if (!product) continue;

      const itemTotalEur = product.priceEur * cartItem.quantity;
      const itemTotalBgn = product.priceBgn * cartItem.quantity;

      totalEur += itemTotalEur;
      totalBgn += itemTotalBgn;

      orderItems.push({
        id: `item-${Date.now()}-${cartItem.id}`,
        orderId: "", // Will be set after order creation
        productId: cartItem.id,
        quantity: cartItem.quantity,
        priceEur: product.priceEur,
        priceBgn: product.priceBgn,
        createdAt: new Date(),
      });

      // Prepare email items with serial numbers and product links
      emailItems.push({
        title: product.title?.en || product.title || "Product",
        serialNumber: product.serialNumber || "N/A",
        productId: product.id,
        quantity: cartItem.quantity,
        price: product.priceEur,
        currency: "EUR",
      });
    }

    // Create order (without user ID for now since we're not requiring auth for checkout)
    const order = config.USE_MOCK_DATA
      ? await MockDataService.createOrder({
          userId: req.user?.id || "guest", // Allow guest checkout for mock
          items: orderItems,
          totalEur,
          totalBgn,
          status: "processing", // Set to processing since payment is "successful"
          paymentStatus: "paid", // Mock payment success
          shippingAddress: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode,
            country: shippingInfo.country,
          },
          billingAddress: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode,
            country: shippingInfo.country,
          },
        })
      : await NewDatabaseService.createOrder({
          userId: req.user?.id || null, // Use null instead of "guest" for UUID field
          orderNumber: `ORD-${Date.now()}`,
          totalAmount: totalEur,
          shippingAddress: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode,
            country: shippingInfo.country,
          },
          billingAddress: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode,
            country: shippingInfo.country,
          },
          paymentStatus: "paid",
          paymentMethod: "credit_card",
        });

    // Update order items with order ID
    order.items = orderItems.map((item) => ({ ...item, orderId: order.id }));

    // Send email notification
    try {
      // Use the imported emailService instance
      const orderEmailData = {
        orderNumber: order.id.substring(0, 8),
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        shippingAddress: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          country: shippingInfo.country,
        },
        items: emailItems,
        totalEur,
        totalBgn,
        orderDate: new Date(),
      };

      await emailService.sendOrderNotification(orderEmailData);
      console.log("✅ Order notification email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send email notification:", emailError);
      // Don't fail the order if email fails
    }

    console.log("Order created successfully:", order.id);
    console.log("Customer:", `${shippingInfo.firstName} ${shippingInfo.lastName}`);
    console.log("Items ordered:", orderItems.length);
    console.log("Total: €" + totalEur + " / " + totalBgn + " лв");

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
          bgn: totalBgn,
        },
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    next(createError("Payment processing failed", 500));
  }
});

export { paymentRouter };
