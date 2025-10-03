import { createConnection } from 'mysql2/promise';
import { loadEnvFile } from 'node:process';
loadEnvFile('./.env');


const db = await createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

try {
  await db.connect();
  console.log("✅ Conectado a MySQL")
} catch (error) {
  console.error("❌ Error conectando a MySQL: ", error)
}

export default db;
