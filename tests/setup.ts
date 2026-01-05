import dotenv from 'dotenv';
import path from 'path';

// Força o uso do .env.test
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Timeout global para operações de banco
jest.setTimeout(30000);

