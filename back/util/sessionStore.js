import session from "express-session"
import MySQLStoreFactory from "express-mysql-session"

const MySQLStore = MySQLStoreFactory(session)

export const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000, // 15 minutos
  expiration: 24 * 60 * 60 * 1000, // 24 horas
  createDatabaseTable: true
})
