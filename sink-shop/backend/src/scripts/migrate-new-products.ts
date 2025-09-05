import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const updateProductSchema = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Updating product schema for multilingual support...");

    // Drop existing products table and recreate with new structure
    await client.query(`DROP TABLE IF EXISTS order_items CASCADE`);
    await client.query(`DROP TABLE IF EXISTS cart_items CASCADE`);
    await client.query(`DROP TABLE IF EXISTS products CASCADE`);

    // Create new products table with multilingual support
    await client.query(`
      CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        
        -- Serial number from image filename (b72, b73, etc.)
        serial_number VARCHAR(20) UNIQUE NOT NULL,
        
        -- Multilingual fields stored as JSONB
        model JSONB NOT NULL,              -- {"en": "Type R72", "bg": "Вид R72"}
        title JSONB NOT NULL,              -- {"en": "River Stone Sink b72", "bg": "Речна каменна мивка b72"}
        description JSONB,                 -- {"en": "Irregular Shape", "bg": "Неправилна форма"}
        material JSONB,                    -- {"en": "River Stone", "bg": "Речен камък"}
        color JSONB,                       -- {"en": "Dark Grey/Grey", "bg": "Тъмно сиво/Сиво"}
        mounting JSONB,                    -- {"en": "Top mount", "bg": "Горен монтаж"}
        manufacture JSONB,                 -- {"en": "hand-made", "bg": "ръчен труд"}
        
        -- Single value fields
        dimensions VARCHAR(100),           -- "50 x 30 cm"
        weight VARCHAR(50),                -- "18-30 kg"
        tag VARCHAR(50),                   -- "Natural", "Polished", etc.
        category VARCHAR(50),              -- "riverStone", "marble", "onyx", "fossil"
        sales_count INTEGER DEFAULT 0,     -- Track sales
        image VARCHAR(255),                -- Image path
        date_added DATE DEFAULT CURRENT_DATE,
        
        -- Pricing
        price_eur DECIMAL(10,2),          -- 750.00
        price_bgn DECIMAL(10,2),          -- 1465.00
        
        -- Standard fields
        slug VARCHAR(255) UNIQUE,
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        stock_quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Recreate cart_items table
    await client.query(`
      CREATE TABLE cart_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    // Recreate order_items table
    await client.query(`
      CREATE TABLE order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE SET NULL,
        product_name VARCHAR(255) NOT NULL,
        product_price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_serial ON products(serial_number);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
      CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
      CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
    `);

    console.log("✅ Product schema updated successfully");
  } catch (error) {
    console.error("❌ Error updating schema:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runMigration = async () => {
  try {
    console.log("🔄 Running product schema migration...");
    await updateProductSchema();
    console.log("✅ Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigration();
