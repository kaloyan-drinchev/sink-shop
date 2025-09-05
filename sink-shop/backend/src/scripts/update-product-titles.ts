import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const updateProductTitles = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Updating existing product titles to remove serial numbers...");

    // Update river stone products
    await client.query(`
      UPDATE products 
      SET title = jsonb_build_object(
        'en', 'River Stone Sink',
        'bg', 'Речна каменна мивка'
      )
      WHERE category = 'riverStone'
    `);

    // Update fossil products
    await client.query(`
      UPDATE products 
      SET title = jsonb_build_object(
        'en', 'Fossil Petrified Wood Sink',
        'bg', 'Фосилна вкаменена дърва мивка'
      )
      WHERE category = 'fossil'
    `);

    // Get count of updated products
    const riverStoneCount = await client.query(`
      SELECT COUNT(*) FROM products WHERE category = 'riverStone'
    `);

    const fossilCount = await client.query(`
      SELECT COUNT(*) FROM products WHERE category = 'fossil'
    `);

    console.log(`✅ Updated ${riverStoneCount.rows[0].count} river stone product titles`);
    console.log(`✅ Updated ${fossilCount.rows[0].count} fossil product titles`);
    console.log("🎉 All product titles updated successfully!");
  } catch (error) {
    console.error("❌ Error updating product titles:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runScript = async () => {
  try {
    await updateProductTitles();
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runScript();
