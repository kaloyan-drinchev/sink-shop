import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const fixFossilBulgarian = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Fixing Bulgarian translation for fossil products...");

    // Update fossil products with correct Bulgarian title
    await client.query(`
      UPDATE products 
      SET title = jsonb_build_object(
        'en', 'Fossil Petrified Wood Sink',
        'bg', 'Фосилна вкаменена дървена мивка'
      )
      WHERE category = 'fossil'
    `);

    // Get count of updated products
    const fossilCount = await client.query(`
      SELECT COUNT(*) FROM products WHERE category = 'fossil'
    `);

    console.log(`✅ Fixed Bulgarian translation for ${fossilCount.rows[0].count} fossil products`);
    console.log(`   Changed: "дърва" → "дървена"`);
    console.log("🎉 Bulgarian translation corrected!");
  } catch (error) {
    console.error("❌ Error fixing Bulgarian translation:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runScript = async () => {
  try {
    await fixFossilBulgarian();
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runScript();
