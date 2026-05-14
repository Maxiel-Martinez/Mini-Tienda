import cors from "cors"

export const ACEPTED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://mini-tienda-eight.vercel.app/",
  "https://d3sixnrgohgozq.cloudfront.net/"
]

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || ACEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error("Origin not allowed by CORS"))
  },
  credentials: true
})
