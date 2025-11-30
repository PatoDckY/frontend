import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/lib/schema.ts", // Dónde está tu esquema
  out: "./drizzle",              // Dónde guardar migraciones (opcional)
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});