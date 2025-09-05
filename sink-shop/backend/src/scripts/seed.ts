import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const seedData = async () => {
  const client = await pool.connect();

  try {
    // Clear existing data
    await client.query("DELETE FROM order_items");
    await client.query("DELETE FROM orders");
    await client.query("DELETE FROM cart_items");
    await client.query("DELETE FROM products");
    await client.query("DELETE FROM categories");
    await client.query("DELETE FROM users");

    // Reset sequences
    await client.query("ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE IF EXISTS categories_id_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE IF EXISTS products_id_seq RESTART WITH 1");

    // Insert categories
    const categoriesResult = await client.query(`
      INSERT INTO categories (name, slug, description) VALUES
      ('Kitchen Sinks', 'kitchen-sinks', 'High-quality kitchen sinks for modern homes'),
      ('Bathroom Sinks', 'bathroom-sinks', 'Elegant bathroom sinks and vanities'),
      ('Utility Sinks', 'utility-sinks', 'Heavy-duty utility sinks for laundry and utility rooms')
      RETURNING id, name, slug
    `);

    const categories = categoriesResult.rows;
    const kitchenCategory = categories.find((c) => c.slug === "kitchen-sinks");
    const bathroomCategory = categories.find((c) => c.slug === "bathroom-sinks");
    const utilityCategory = categories.find((c) => c.slug === "utility-sinks");

    // Insert products
    await client.query(
      `
      INSERT INTO products (name, slug, description, price, original_price, category_id, material, dimensions, color, weight, stock_quantity, is_featured, images, specifications) VALUES
      ('Stainless Steel Double Bowl Kitchen Sink', 'stainless-steel-double-bowl-kitchen-sink', 'Professional-grade stainless steel double bowl kitchen sink with sound dampening', 299.99, 399.99, $1, 'Stainless Steel', '33" x 22" x 9"', 'Silver', 45.5, 25, true, $2, $3),
      ('Granite Composite Undermount Sink', 'granite-composite-undermount-sink', 'Durable granite composite undermount sink with heat resistance', 449.99, 599.99, $1, 'Granite Composite', '30" x 18" x 8"', 'Charcoal', 65.0, 15, true, $4, $5),
      ('Farmhouse Apron Front Sink', 'farmhouse-apron-front-sink', 'Classic farmhouse style apron front sink with deep basin', 599.99, 799.99, $1, 'Fireclay', '30" x 20" x 10"', 'White', 85.0, 10, true, $6, $7),
      ('Modern Vessel Bathroom Sink', 'modern-vessel-bathroom-sink', 'Contemporary vessel sink with minimalist design', 199.99, 299.99, $8, 'Ceramic', '20" x 16" x 6"', 'White', 25.0, 30, false, $9, $10),
      ('Wall-Mounted Bathroom Sink', 'wall-mounted-bathroom-sink', 'Space-saving wall-mounted bathroom sink', 149.99, 199.99, $8, 'Ceramic', '18" x 14" x 5"', 'White', 20.0, 20, false, $11, $12),
      ('Utility Laundry Sink', 'utility-laundry-sink', 'Heavy-duty utility sink for laundry room', 89.99, 129.99, $13, 'Stainless Steel', '24" x 20" x 8"', 'Silver', 35.0, 40, false, $14, $15)
    `,
      [
        kitchenCategory.id,
        JSON.stringify(["/uploads/kitchen-sink-1.jpg", "/uploads/kitchen-sink-1-2.jpg"]),
        JSON.stringify({ capacity: "Large", installation: "Undermount", warranty: "5 years" }),
        JSON.stringify(["/uploads/granite-sink-1.jpg", "/uploads/granite-sink-1-2.jpg"]),
        JSON.stringify({ capacity: "Medium", installation: "Undermount", warranty: "10 years" }),
        JSON.stringify(["/uploads/farmhouse-sink-1.jpg", "/uploads/farmhouse-sink-1-2.jpg"]),
        JSON.stringify({
          capacity: "Extra Large",
          installation: "Apron Front",
          warranty: "Lifetime",
        }),
        bathroomCategory.id,
        JSON.stringify(["/uploads/vessel-sink-1.jpg", "/uploads/vessel-sink-1-2.jpg"]),
        JSON.stringify({ capacity: "Medium", installation: "Vessel", warranty: "2 years" }),
        JSON.stringify(["/uploads/wall-sink-1.jpg", "/uploads/wall-sink-1-2.jpg"]),
        JSON.stringify({ capacity: "Small", installation: "Wall Mount", warranty: "2 years" }),
        utilityCategory.id,
        JSON.stringify(["/uploads/utility-sink-1.jpg", "/uploads/utility-sink-1-2.jpg"]),
        JSON.stringify({ capacity: "Large", installation: "Drop-in", warranty: "3 years" }),
      ]
    );

    // Insert admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await client.query(
      `
      INSERT INTO users (email, password, first_name, last_name, role) VALUES
      ($1, $2, 'Admin', 'User', 'admin')
    `,
      ["admin@sinkshop.com", hashedPassword]
    );

    // Insert test user
    const userPassword = await bcrypt.hash("user123", 10);
    await client.query(
      `
      INSERT INTO users (email, password, first_name, last_name, role) VALUES
      ($1, $2, 'John', 'Doe', 'user')
    `,
      ["user@sinkshop.com", userPassword]
    );

    console.log("✅ Database seeded successfully");
    console.log("👤 Admin user: admin@sinkshop.com / admin123");
    console.log("👤 Test user: user@sinkshop.com / user123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runSeed = async () => {
  try {
    console.log("🔄 Seeding database...");
    await seedData();
    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runSeed();
