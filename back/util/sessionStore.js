import session from "express-session"
import MySQLStoreFactory from "express-mysql-session"

const MySQLStore = MySQLStoreFactory(session)
export const SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutos

export const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: SESSION_TTL_MS,
  expiration: SESSION_TTL_MS,
  createDatabaseTable: true
})
