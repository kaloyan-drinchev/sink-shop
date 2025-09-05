import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const updateShortTags = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Updating products with shorter, single-word tags...");

    // Update river stone products with "Natural" tag
    await client.query(`
      UPDATE products 
      SET tag = 'Natural'
      WHERE category = 'riverStone'
    `);

    // Update fossil products with "Fossil" tag
    await client.query(`
      UPDATE products 
      SET tag = 'Fossil'
      WHERE category = 'fossil'
    `);

    // Get count of updated products
    const riverStoneCount = await client.query(`
      SELECT COUNT(*) FROM products WHERE category = 'riverStone'
    `);

    const fossilCount = await client.query(`
      SELECT COUNT(*) FROM products WHERE category = 'fossil'
    `);

    console.log(
      `✅ Updated ${riverStoneCount.rows[0].count} river stone products with "Natural" tag`
    );
    console.log(`✅ Updated ${fossilCount.rows[0].count} fossil products with "Fossil" tag`);
    console.log("🎉 All product tags updated to single words!");
  } catch (error) {
    console.error("❌ Error updating product tags:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runScript = async () => {
  try {
    await updateShortTags();
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runScript();
