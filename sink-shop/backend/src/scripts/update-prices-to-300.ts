import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const updatePricesTo300 = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Updating all product prices to 300 EUR...");

    // Update all products to 300 EUR / 585 BGN
    await client.query(`
      UPDATE products 
      SET 
        price_eur = 300.00,
        price_bgn = 585.00
      WHERE category IN ('riverStone', 'fossil')
    `);

    // Get count of updated products
    const riverStoneCount = await client.query(`
      SELECT COUNT(*) FROM products WHERE category = 'riverStone'
    `);

    const fossilCount = await client.query(`
      SELECT COUNT(*) FROM products WHERE category = 'fossil'
    `);

    const totalCount =
      parseInt(riverStoneCount.rows[0].count) + parseInt(fossilCount.rows[0].count);

    console.log(`✅ Updated ${riverStoneCount.rows[0].count} river stone products`);
    console.log(`✅ Updated ${fossilCount.rows[0].count} fossil products`);
    console.log(`✅ Total: ${totalCount} products updated`);
    console.log(`   Price: 300.00 EUR / 585.00 BGN`);
    console.log("🎉 All products now have uniform pricing!");
  } catch (error) {
    console.error("❌ Error updating prices:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runScript = async () => {
  try {
    await updatePricesTo300();
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runScript();
