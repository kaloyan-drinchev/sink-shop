import "dotenv/config";
import { Pool } from "pg";
import { config } from "../config/config.js";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const createAdminUser = async () => {
  const client = await pool.connect();

  try {
    // Check if admin user already exists
    const existingAdmin = await client.query("SELECT * FROM users WHERE email = $1", [
      "admin@sinkshop.com",
    ]);

    if (existingAdmin.rows.length > 0) {
      console.log("✅ Admin user already exists: admin@sinkshop.com");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await client.query(
      `
      INSERT INTO users (email, password, first_name, last_name, role) VALUES
      ($1, $2, 'Admin', 'User', 'admin')
    `,
      ["admin@sinkshop.com", hashedPassword]
    );

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@sinkshop.com");
    console.log("🔑 Password: admin123");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  } finally {
    client.release();
  }
};

const runScript = async () => {
  try {
    console.log("🔄 Creating admin user...");
    await createAdminUser();
    console.log("✅ Script completed successfully");
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runScript();
