import { pool } from "../config/database.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryId?: string;
  material?: string;
  dimensions?: string;
  color?: string;
  weight?: number;
  stockQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  images: string[];
  specifications: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId?: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  shippingAddress: Record<string, any>;
  billingAddress?: Record<string, any>;
  paymentMethod?: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  stripePaymentIntentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
}

export class DatabaseService {
  // User operations
  static async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  static async getUserById(id: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "user" | "admin";
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role || "user",
      ]
    );
    return result.rows[0];
  }

  // Category operations
  static async getAllCategories(): Promise<Category[]> {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    return result.rows;
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const result = await pool.query("SELECT * FROM categories WHERE slug = $1", [slug]);
    return result.rows[0] || null;
  }

  // Product operations
  static async getAllProducts(): Promise<Product[]> {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
    `);
    return result.rows;
  }

  static async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const result = await pool.query(
      `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.slug = $1 AND p.is_active = true
      ORDER BY p.created_at DESC
    `,
      [categorySlug]
    );
    return result.rows;
  }

  static async getProductById(id: string): Promise<Product | null> {
    const result = await pool.query(
      `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `,
      [id]
    );
    return result.rows[0] || null;
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    const result = await pool.query(
      `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `,
      [slug]
    );
    return result.rows[0] || null;
  }

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    const result = await pool.query(
      `
      INSERT INTO products (name, slug, description, price, original_price, category_id, material, dimensions, color, weight, stock_quantity, is_featured, images, specifications)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `,
      [
        productData.name,
        productData.slug,
        productData.description,
        productData.price,
        productData.originalPrice,
        productData.categoryId,
        productData.material,
        productData.dimensions,
        productData.color,
        productData.weight,
        productData.stockQuantity || 0,
        productData.isFeatured || false,
        JSON.stringify(productData.images || []),
        JSON.stringify(productData.specifications || {}),
      ]
    );
    return result.rows[0];
  }

  static async updateProduct(id: string, updateData: Partial<Product>): Promise<Product | null> {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "images" || key === "specifications") {
          setClause.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          setClause.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      return this.getProductById(id);
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `
      UPDATE products 
      SET ${setClause.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `,
      values
    );

    return result.rows[0] || null;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async updateProductStock(productId: string, quantityChange: number): Promise<boolean> {
    const result = await pool.query(
      `
      UPDATE products 
      SET stock_quantity = stock_quantity + $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `,
      [quantityChange, productId]
    );
    return (result.rowCount ?? 0) > 0;
  }

  // Cart operations
  static async getCartItems(userId: string): Promise<CartItem[]> {
    const result = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  }

  static async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const result = await pool.query(
      `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `,
      [userId, productId, quantity]
    );
    return result.rows[0];
  }

  static async updateCartItem(id: string, quantity: number): Promise<CartItem | null> {
    const result = await pool.query(
      `
      UPDATE cart_items 
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [quantity, id]
    );
    return result.rows[0] || null;
  }

  static async removeFromCart(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM cart_items WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async clearCart(userId: string): Promise<void> {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
  }

  // Order operations
  static async createOrder(orderData: {
    userId?: string;
    orderNumber: string;
    totalAmount: number;
    shippingAddress: Record<string, any>;
    billingAddress?: Record<string, any>;
    paymentMethod?: string;
    paymentStatus?: string;
    stripePaymentIntentId?: string;
    notes?: string;
  }): Promise<Order> {
    const result = await pool.query(
      `
      INSERT INTO orders (user_id, order_number, total_amount, shipping_address, billing_address, payment_method, payment_status, stripe_payment_intent_id, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        orderData.userId,
        orderData.orderNumber,
        orderData.totalAmount,
        JSON.stringify(orderData.shippingAddress),
        orderData.billingAddress ? JSON.stringify(orderData.billingAddress) : null,
        orderData.paymentMethod,
        orderData.paymentStatus || "pending",
        orderData.stripePaymentIntentId,
        orderData.notes,
      ]
    );
    return result.rows[0];
  }

  static async createOrderItem(orderItemData: {
    orderId: string;
    productId?: string;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
  }): Promise<OrderItem> {
    const result = await pool.query(
      `
      INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [
        orderItemData.orderId,
        orderItemData.productId,
        orderItemData.productName,
        orderItemData.productPrice,
        orderItemData.quantity,
        orderItemData.totalPrice,
      ]
    );
    return result.rows[0];
  }

  static async getOrderById(id: string): Promise<Order | null> {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async getOrdersByUser(userId: string): Promise<Order[]> {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  }

  static async getAllOrders(): Promise<Order[]> {
    const result = await pool.query(`
      SELECT o.*, u.email, u.first_name, u.last_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    return result.rows;
  }

  static async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const result = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at",
      [orderId]
    );
    return result.rows;
  }

  static async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    const result = await pool.query(
      `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [status, id]
    );
    return result.rows[0] || null;
  }

  static async updateOrderPaymentStatus(id: string, paymentStatus: string): Promise<Order | null> {
    const result = await pool.query(
      `
      UPDATE orders 
      SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [paymentStatus, id]
    );
    return result.rows[0] || null;
  }
}
