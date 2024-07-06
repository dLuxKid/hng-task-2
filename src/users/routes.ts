import { Router } from "express";
import { protect } from "../auth/controller";
import { getMyAccount } from "./controller";

const userRouter = Router();

userRouter.get("/:id", protect, getMyAccount);

export default userRouter;
