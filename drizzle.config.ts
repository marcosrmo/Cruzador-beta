import { defineConfig } from "drizzle-kit";

// REMOVA: import { pool } from "./server/db"; 

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  // 🟢 VOLTAR PARA URL
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
