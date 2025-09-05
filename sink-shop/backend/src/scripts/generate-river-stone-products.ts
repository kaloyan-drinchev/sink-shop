import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";
import fs from "fs";
import path from "path";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Get all river stone image filenames
const getRiverStoneImages = (): string[] => {
  const imagesDir = path.join(process.cwd(), "../src/assets/river-stone-sink-images");

  try {
    const files = fs.readdirSync(imagesDir);
    return files
      .filter((file) => file.endsWith(".jpg"))
      .map((file) => file.replace(".jpg", ""))
      .sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically
  } catch (error) {
    console.error("Error reading images directory:", error);
    // Fallback: generate numbers from 72 to 372 based on what we saw
    const numbers = [];
    for (let i = 72; i <= 98; i++) numbers.push(i.toString());
    for (let i = 100; i <= 182; i++) numbers.push(i.toString());
    for (let i = 197; i <= 372; i++) numbers.push(i.toString());
    return numbers;
  }
};

const generateRiverStoneProducts = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Generating river stone products...");

    const imageNumbers = getRiverStoneImages();
    console.log(`📸 Found ${imageNumbers.length} river stone images`);

    // Clear existing river stone products
    await client.query(`DELETE FROM products WHERE category = 'riverStone'`);

    let insertedCount = 0;

    for (const imageNumber of imageNumbers) {
      const serialNumber = `b${imageNumber}`;
      const slug = `river-stone-sink-${serialNumber}`;
      const imagePath = `/assets/river-stone-sink-images/${imageNumber}.jpg`;

      // Generate random sales count between 15-45
      const salesCount = Math.floor(Math.random() * 31) + 15;

      await client.query(
        `
        INSERT INTO products (
          serial_number,
          model,
          title,
          description,
          material,
          color,
          mounting,
          manufacture,
          dimensions,
          weight,
          tag,
          category,
          sales_count,
          image,
          price_eur,
          price_bgn,
          slug,
          is_active,
          is_featured,
          stock_quantity
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        )
      `,
        [
          serialNumber,
          JSON.stringify({
            en: `Type R${imageNumber}`,
            bg: `Вид R${imageNumber}`,
          }),
          JSON.stringify({
            en: `River Stone Sink ${serialNumber}`,
            bg: `Речна каменна мивка ${serialNumber}`,
          }),
          JSON.stringify({
            en: "Natural irregular shape",
            bg: "Естествена неправилна форма",
          }),
          JSON.stringify({
            en: "River Stone",
            bg: "Речен камък",
          }),
          JSON.stringify({
            en: "Dark Grey/Grey",
            bg: "Тъмно сиво/Сиво",
          }),
          JSON.stringify({
            en: "Top mount",
            bg: "Горен монтаж",
          }),
          JSON.stringify({
            en: "hand-made",
            bg: "ръчен труд",
          }),
          "50 x 30 cm", // Standard dimensions as requested
          "18-30 kg", // Standard weight range
          "Natural", // Tag
          "riverStone", // Category
          salesCount, // Random sales count
          imagePath, // Image path
          750.0, // Price EUR
          1465.0, // Price BGN
          slug, // Unique slug
          true, // is_active
          false, // is_featured (can be updated later)
          1, // stock_quantity
        ]
      );

      insertedCount++;

      if (insertedCount % 50 === 0) {
        console.log(`📦 Generated ${insertedCount} products...`);
      }
    }

    console.log(`✅ Successfully generated ${insertedCount} river stone products`);

    // Show some statistics
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_products,
        MIN(serial_number) as first_serial,
        MAX(serial_number) as last_serial
      FROM products 
      WHERE category = 'riverStone'
    `);

    console.log("📊 Product Statistics:");
    console.log(`   Total Products: ${stats.rows[0].total_products}`);
    console.log(`   Serial Range: ${stats.rows[0].first_serial} - ${stats.rows[0].last_serial}`);
  } catch (error) {
    console.error("❌ Error generating products:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runGeneration = async () => {
  try {
    console.log("🚀 Starting river stone product generation...");
    await generateRiverStoneProducts();
    console.log("✅ Generation completed successfully");
  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runGeneration();
