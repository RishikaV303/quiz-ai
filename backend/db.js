import pkg from "pg"
const { Pool } = pkg

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "quiz_db",
  password: "postgresql",
  port: 5432,
})