import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";
import fs from "fs";
import path from "path";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Get all fossil image filenames
const getFossilImages = (): string[] => {
  const imagesDir = path.join(process.cwd(), "../src/assets/fosil-sink-images");

  try {
    const files = fs.readdirSync(imagesDir);
    return files
      .filter((file) => file.endsWith(".jpg"))
      .map((file) => file.replace(".jpg", ""))
      .sort((a, b) => {
        // Extract numbers from d1, d2, etc.
        const numA = parseInt(a.replace("d", ""));
        const numB = parseInt(b.replace("d", ""));
        return numA - numB;
      });
  } catch (error) {
    console.error("Error reading fossil images directory:", error);
    // Fallback: generate d1 to d60 based on what we saw
    const numbers = [];
    const existingNumbers = [
      1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 22, 24, 25, 28, 30, 32, 34, 35, 36,
      37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
      60,
    ];
    return existingNumbers.map((num) => `d${num}`);
  }
};

const generateFossilProducts = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Generating fossil products...");

    const imageNames = getFossilImages();
    console.log(`📸 Found ${imageNames.length} fossil images`);

    // Clear existing fossil products
    await client.query(`DELETE FROM products WHERE category = 'fossil'`);

    let insertedCount = 0;

    for (const imageName of imageNames) {
      const serialNumber = imageName; // d1, d2, d3, etc.
      const slug = `fossil-petrified-wood-sink-${serialNumber}`;
      const imagePath = `/assets/fosil-sink-images/${imageName}.jpg`;

      // Generate random sales count between 10-35 (fossils are rarer)
      const salesCount = Math.floor(Math.random() * 26) + 10;

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
            en: `Type F${imageName.replace("d", "")}`,
            bg: `Вид F${imageName.replace("d", "")}`,
          }),
          JSON.stringify({
            en: `Fossil Petrified Wood Sink ${serialNumber}`,
            bg: `Фосилна вкаменена дърва мивка ${serialNumber}`,
          }),
          JSON.stringify({
            en: "Petrified wood with natural patterns",
            bg: "Вкаменено дърво с естествени шарки",
          }),
          JSON.stringify({
            en: "Fossil",
            bg: "Фосил",
          }),
          JSON.stringify({
            en: "Black/Grey with wood patterns",
            bg: "Черно/Сиво с дървесни шарки",
          }),
          JSON.stringify({
            en: "Top mount",
            bg: "Горен монтаж",
          }),
          JSON.stringify({
            en: "hand-made",
            bg: "ръчен труд",
          }),
          "50 x 30 cm", // Standard dimensions like river stone
          "20-25 kg", // Slightly lighter than river stone
          "Fossil", // Tag
          "fossil", // Category
          salesCount, // Random sales count
          imagePath, // Image path
          850.0, // Price EUR (higher than river stone - fossils are premium)
          1665.0, // Price BGN
          slug, // Unique slug
          true, // is_active
          false, // is_featured (can be updated later)
          1, // stock_quantity
        ]
      );

      insertedCount++;

      if (insertedCount % 10 === 0) {
        console.log(`📦 Generated ${insertedCount} fossil products...`);
      }
    }

    console.log(`✅ Successfully generated ${insertedCount} fossil products`);

    // Show some statistics
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_products,
        MIN(serial_number) as first_serial,
        MAX(serial_number) as last_serial
      FROM products 
      WHERE category = 'fossil'
    `);

    console.log("📊 Fossil Product Statistics:");
    console.log(`   Total Products: ${stats.rows[0].total_products}`);
    console.log(`   Serial Range: ${stats.rows[0].first_serial} - ${stats.rows[0].last_serial}`);
  } catch (error) {
    console.error("❌ Error generating fossil products:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runGeneration = async () => {
  try {
    console.log("🚀 Starting fossil product generation...");
    await generateFossilProducts();
    console.log("✅ Fossil generation completed successfully");
  } catch (error) {
    console.error("❌ Fossil generation failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runGeneration();
