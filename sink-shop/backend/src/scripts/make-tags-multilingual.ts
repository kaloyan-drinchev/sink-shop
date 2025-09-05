import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const makeTagsMultilingual = async () => {
  const client = await pool.connect();

  try {
    console.log("🔄 Converting tags to multilingual format...");

    // First, let's see what tags we have
    const existingTags = await client.query(`
      SELECT DISTINCT tag FROM products WHERE tag IS NOT NULL
    `);

    console.log(
      "Current tags:",
      existingTags.rows.map((r) => r.tag)
    );

    // Change tag column from VARCHAR to JSONB
    await client.query(`
      ALTER TABLE products 
      ALTER COLUMN tag TYPE JSONB USING 
      CASE 
        WHEN tag = 'Natural' THEN '{"en": "Natural", "bg": "Естествен"}'::jsonb
        WHEN tag = 'Fossil' THEN '{"en": "Fossil", "bg": "Фосил"}'::jsonb
        WHEN tag = 'Natural irregular shape' THEN '{"en": "Natural", "bg": "Естествен"}'::jsonb
        WHEN tag = 'Petrified wood with natural patterns' THEN '{"en": "Fossil", "bg": "Фосил"}'::jsonb
        ELSE jsonb_build_object('en', tag, 'bg', tag)
      END
    `);

    console.log("✅ Tags converted to multilingual format!");
    console.log("   - Natural → {en: 'Natural', bg: 'Естествен'}");
    console.log("   - Fossil → {en: 'Fossil', bg: 'Фосил'}");
  } catch (error) {
    console.error("❌ Error converting tags:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runScript = async () => {
  try {
    await makeTagsMultilingual();
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runScript();
