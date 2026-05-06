import { createPool } from 'mysql2/promise';
import { loadEnvFile } from 'node:process';
loadEnvFile('./.env');


const db = await createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

try {
  const connection = await db.getConnection();
  console.log("✅ Conectado a MySQL")
  connection.release()
} catch (error) {
  console.error("❌ Error conectando a MySQL: ", error)
  process.exit(1)
}

export default db
