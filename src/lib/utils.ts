import { type Response } from "express";
import jwt from "jsonwebtoken";

export const signToken = (id: number | string) => {
  return jwt.sign({ userid: String(id) }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendToken = (
  user: {
    userid: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  },
  statusCode: number,
  res: Response,
  type: "signup" | "login"
) => {
  const token = signToken(user.userid);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.status(statusCode).json({
    status: "success",
    message: type === "login" ? "Login successful" : "Registration successful",
    data: {
      accessToken: token,
      user,
    },
  });
};
