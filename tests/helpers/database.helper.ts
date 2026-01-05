import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

let pool: Pool;
let db: ReturnType<typeof drizzle>;

/**
 * Inicializa o banco de dados de teste
 */
export async function setupTestDatabase() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
        db = drizzle(pool);
    }
    return db;
}

/**
 * Limpa todas as tabelas do banco de dados
 * Usa TRUNCATE com CASCADE para remover todas as dependências
 */
export async function cleanDatabase() {
    if (!pool) {
        await setupTestDatabase();
    }

    try {
        await pool.query(
            'TRUNCATE TABLE sensor_readings, devices, tenants RESTART IDENTITY CASCADE',
        );
        console.log('✓ Database cleaned');
    } catch (error) {
        console.error('Error cleaning database:', error);
        throw error;
    }
}

/**
 * Fecha a conexão com o banco de dados
 */
export async function closeDatabase() {
    if (pool) {
        await pool.end();
        console.log('✓ Database connection closed');
    }
}
