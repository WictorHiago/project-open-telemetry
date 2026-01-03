import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./src/infrastructure/database/drizzle/migrations",
    schema: "./src/infrastructure/database/drizzle/schemas/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
})