import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const fixAllDescriptions = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Fixing product descriptions to be simple and consistent...");

    // Update both fossil and river stone products with simple descriptions
    await client.query(`
      UPDATE products 
      SET description = jsonb_build_object(
        'en', 'Natural stone sink with unique patterns',
        'bg', 'Естествена каменна мивка с уникални шарки'
      )
      WHERE category IN ('fossil', 'riverStone')
    `);

    // Get count of updated products
    const fossilCount = await client.query(`
      SELECT COUNT(*) FROM products WHERE category = 'fossil'
    `);

    const riverStoneCount = await client.query(`
      SELECT COUNT(*) FROM products WHERE category = 'riverStone'
    `);

    console.log(`✅ Fixed descriptions for ${fossilCount.rows[0].count} fossil products`);
    console.log(`✅ Fixed descriptions for ${riverStoneCount.rows[0].count} river stone products`);
    console.log(`   EN: "Natural stone sink with unique patterns"`);
    console.log(`   BG: "Естествена каменна мивка с уникални шарки"`);
    console.log("🎉 All product descriptions are now simple and consistent!");
  } catch (error) {
    console.error("❌ Error fixing fossil descriptions:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runScript = async () => {
  try {
    await fixAllDescriptions();
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runScript();
