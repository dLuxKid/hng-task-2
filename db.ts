import { Client } from "pg";

const client = new Client({
  host: "localhost",
  database: "hng-task-2",
  user: "postgres",
  port: 5432,
  password: "marvellous",
});

export default client;
