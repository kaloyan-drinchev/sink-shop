import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const fixManufactureCapitalization = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Fixing manufacture capitalization...");

    // Update all products to have proper capitalization in both languages
    await client.query(`
      UPDATE products 
      SET manufacture = jsonb_build_object(
        'en', 'Hand-made',
        'bg', 'Ръчен труд'
      )
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
    console.log(`   EN: "hand-made" → "Hand-made"`);
    console.log(`   BG: "ръчен труд" → "Ръчен труд"`);
    console.log("🎉 Manufacture field now has proper capitalization in both languages!");
  } catch (error) {
    console.error("❌ Error fixing capitalization:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runScript = async () => {
  try {
    await fixManufactureCapitalization();
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runScript();
