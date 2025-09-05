import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const updateProductTags = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Updating existing products to move description to tag...");

    // Update river stone products
    await client.query(`
      UPDATE products 
      SET 
        tag = 'Natural irregular shape',
        description = jsonb_build_object(
          'en', 'Handcrafted from natural river stone with unique patterns and textures',
          'bg', 'Изработена от естествен речен камък с уникални шарки и текстури'
        )
      WHERE category = 'riverStone'
    `);

    // Update fossil products
    await client.query(`
      UPDATE products 
      SET 
        tag = 'Petrified wood with natural patterns',
        description = jsonb_build_object(
          'en', 'Unique petrified wood sink showcasing millions of years of natural fossilization',
          'bg', 'Уникална мивка от вкаменено дърво, показваща милиони години естествена фосилизация'
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

    console.log(`✅ Updated ${riverStoneCount.rows[0].count} river stone products`);
    console.log(`   - Tag: "Natural irregular shape"`);
    console.log(`   - Description: Enhanced with craftsmanship details`);

    console.log(`✅ Updated ${fossilCount.rows[0].count} fossil products`);
    console.log(`   - Tag: "Petrified wood with natural patterns"`);
    console.log(`   - Description: Enhanced with fossilization details`);

    console.log("🎉 All product tags and descriptions updated successfully!");
  } catch (error) {
    console.error("❌ Error updating product tags:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runScript = async () => {
  try {
    await updateProductTags();
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runScript();
