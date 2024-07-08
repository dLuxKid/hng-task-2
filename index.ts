import express from "express";
import userRouter from "./src/users/routes";
import authRouter from "./src/auth/routes";
import organisationRouter from "./src/registration/routes";
import client from "./db";

import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello" });
});

app.use("/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/organisations", organisationRouter);

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((err) => {
    console.error("Connection error", err.stack);
  });

app.use("*", (req, res) => {
  res.status(404).json({
    status: "Bad request",
    message: "url not found",
    statusCode: 404,
  });
});

export default app;
