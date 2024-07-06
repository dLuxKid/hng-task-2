import { Pool } from "pg";

import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const client = new Pool({
  connectionString: process.env.POSTGRES_URL,
  // host: "localhost",
  // database: "hng-task-2",
  // user: "postgres",
  // port: 5432,
  // password: "marvellous",
});

export default client;
