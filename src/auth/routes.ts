import { Router, type Request, type Response } from "express";
import { createUser, loginUser } from "./controller";

const authRouter = Router();

authRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json("using api route");
});

authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);

export default authRouter;
