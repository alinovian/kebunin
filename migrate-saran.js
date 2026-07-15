const fs = require("fs");
const mysql = require("e:/Project/User Experience/kebunin-new_concept/node_modules/mysql2/promise");

const envPath = "e:/Project/User Experience/kebunin-new_concept/.env";
if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, "utf-8");
  envText.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const parts = trimmed.split("=");
      const key = parts[0].trim();
      let value = parts.slice(1).join("=").trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

async function run() {
  const host = process.env.DB_HOST || "127.0.0.1";
  const port = parseInt(process.env.DB_PORT || "3306", 10);
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "kebunin_v2";

  console.log(`Connecting to ${user}@${host}:${port}/${database}`);

  try {
    const conn = await mysql.createConnection({ host, port, user, password, database });
    console.log("Connected to MySQL database!");

    console.log("Creating 'plant_suggestions' table if not exists...");
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS plant_suggestions (
        id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        suggested_plant VARCHAR(255) NOT NULL,
        suggestion_text TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_plant_suggestions_profile FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("Table 'plant_suggestions' created successfully!");

    await conn.end();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();
