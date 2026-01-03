import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

class DrizzleClient {
    private static pool: Pool;
    private static instance: ReturnType<typeof drizzle>;

    private constructor() {}

    static async getInstance() {
        if (!this.instance) {
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
            });

            this.instance = drizzle(this.pool);
        }

        return this.instance;
    }

    static async close() {
        if (this.pool) {
            await this.pool.end();
        }
    }
}

export const db = DrizzleClient.getInstance();
