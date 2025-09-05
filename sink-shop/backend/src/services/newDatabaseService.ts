import { pool } from "../config/database.js";
import bcrypt from "bcryptjs";

// Updated interfaces for multilingual products
export interface ProductTranslation {
  en: string;
  bg: string;
}

export interface Product {
  id: string;
  serialNumber: string;
  model: ProductTranslation;
  title: ProductTranslation;
  description: ProductTranslation;
  material: ProductTranslation;
  color: ProductTranslation;
  mounting: ProductTranslation;
  manufacture: ProductTranslation;
  dimensions: string;
  weight: string;
  tag: ProductTranslation;
  category: string;
  salesCount: number;
  image: string;
  dateAdded: string;
  priceEur: number;
  priceBgn: number;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

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

export class NewDatabaseService {
  // Helper to convert database row to Product interface
  private static mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      serialNumber: row.serial_number,
      model: row.model,
      title: row.title,
      description: row.description,
      material: row.material,
      color: row.color,
      mounting: row.mounting,
      manufacture: row.manufacture,
      dimensions: row.dimensions,
      weight: row.weight,
      tag: row.tag, // JSONB already parsed by pg
      category: row.category,
      salesCount: row.sales_count,
      image: row.image,
      dateAdded: row.date_added,
      priceEur: parseFloat(row.price_eur),
      priceBgn: parseFloat(row.price_bgn),
      slug: row.slug,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      stockQuantity: row.stock_quantity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

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

  // Product operations
  static async getAllProducts(): Promise<Product[]> {
    const result = await pool.query(`
      SELECT * FROM products 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `);
    return result.rows.map(this.mapRowToProduct);
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    const result = await pool.query(
      `
      SELECT * FROM products 
      WHERE category = $1 AND is_active = true 
      ORDER BY created_at DESC
    `,
      [category]
    );
    return result.rows.map(this.mapRowToProduct);
  }

  static async getProductById(id: string): Promise<Product | null> {
    const result = await pool.query(
      `
      SELECT * FROM products WHERE id = $1
    `,
      [id]
    );
    return result.rows[0] ? this.mapRowToProduct(result.rows[0]) : null;
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    const result = await pool.query(
      `
      SELECT * FROM products WHERE slug = $1
    `,
      [slug]
    );
    return result.rows[0] ? this.mapRowToProduct(result.rows[0]) : null;
  }

  static async getProductBySerialNumber(serialNumber: string): Promise<Product | null> {
    const result = await pool.query(
      `
      SELECT * FROM products WHERE serial_number = $1
    `,
      [serialNumber]
    );
    return result.rows[0] ? this.mapRowToProduct(result.rows[0]) : null;
  }

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    const result = await pool.query(
      `
      INSERT INTO products (
        serial_number, model, title, description, material, color, mounting, manufacture,
        dimensions, weight, tag, category, sales_count, image, price_eur, price_bgn,
        slug, is_active, is_featured, stock_quantity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `,
      [
        productData.serialNumber,
        JSON.stringify(productData.model),
        JSON.stringify(productData.title),
        JSON.stringify(productData.description),
        JSON.stringify(productData.material),
        JSON.stringify(productData.color),
        JSON.stringify(productData.mounting),
        JSON.stringify(productData.manufacture),
        productData.dimensions,
        productData.weight,
        productData.tag,
        productData.category,
        productData.salesCount || 0,
        productData.image,
        productData.priceEur,
        productData.priceBgn,
        productData.slug,
        productData.isActive !== false,
        productData.isFeatured || false,
        productData.stockQuantity || 1,
      ]
    );
    return this.mapRowToProduct(result.rows[0]);
  }

  static async updateProduct(id: string, updateData: Partial<Product>): Promise<Product | null> {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        // Convert camelCase to snake_case for database columns
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();

        if (
          [
            "model",
            "title",
            "description",
            "material",
            "color",
            "mounting",
            "manufacture",
          ].includes(key)
        ) {
          setClause.push(`${dbKey} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          setClause.push(`${dbKey} = $${paramCount}`);
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

    return result.rows[0] ? this.mapRowToProduct(result.rows[0]) : null;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    return result.rowCount > 0;
  }

  static async updateProductStock(productId: string, quantityChange: number): Promise<boolean> {
    const result = await pool.query(
      `
      UPDATE products 
      SET stock_quantity = stock_quantity + $1, 
          sales_count = CASE WHEN $1 < 0 THEN sales_count + ABS($1) ELSE sales_count END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `,
      [quantityChange, productId]
    );
    return result.rowCount > 0;
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
    return result.rowCount > 0;
  }

  static async clearCart(userId: string): Promise<void> {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
  }

  // Order operations (same as before, no changes needed)
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
