import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const sql = neon(databaseUrl);

async function main() {
  const [result] = await sql`
    select current_database() as database_name, now() as checked_at
  `;

  console.log("Database connection ok");
  console.log({
    database: result.database_name,
    checkedAt: result.checked_at,
  });
}

main().catch((error) => {
  console.error("Database connection failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
