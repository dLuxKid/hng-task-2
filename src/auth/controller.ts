import bcrypt from "bcryptjs";
import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import client from "../../db";
import { createSendToken, signToken } from "../lib/utils";
import { createUserQuery, loginQuery } from "./queries";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const errorFields: { field: string; message: string }[] = [];

  if (!firstName)
    errorFields.push({
      field: "firstName",
      message: "Your firstname is missing",
    });

  if (!lastName)
    errorFields.push({
      field: "lastName",
      message: "Your lastName is missing",
    });

  if (!email)
    errorFields.push({
      field: "email",
      message: "Your email is missing",
    });

  if (!password)
    errorFields.push({
      field: "password",
      message: "Your password is missing",
    });

  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({ errors: errorFields });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const query = createUserQuery({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
  });

  try {
    const result = await client.query(query);
    const { firstname, lastname, email, phone, userid } = result.rows[0];

    const token = signToken(userid);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          firstname,
          lastname,
          email,
          phone,
          userid,
        },
      },
    });
  } catch (error: any) {
    if (error.code == "23505") {
      const detail = error.detail;
      const field = detail.slice(detail.indexOf("(") + 1, detail.indexOf(")"));
      res.status(422).json({
        errors: [
          {
            field,
            message: `user with email ${email} already exists`,
          },
        ],
      });
    } else {
      res.status(400).json({
        status: "Bad Request",
        message: "Registration unsuccessful",
        statusCode: 400,
        error,
      });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const errorFields: { field: string; message: string }[] = [];

  if (!email)
    errorFields.push({
      field: "email",
      message: "Your email is missing",
    });

  if (!password)
    errorFields.push({
      field: "password",
      message: "Your password is missing",
    });

  if (!email || !password) {
    return res.status(422).json({ errors: errorFields });
  }

  const query = loginQuery({ email });

  try {
    const result = await client.query(query);

    if (
      result.rows.length === 0 ||
      !(await bcrypt.compare(password, result.rows[0].password))
    )
      return res.status(400).json({
        status: "Bad Request",
        message: "Invalid Email or Password",
        statusCode: 401,
      });

    const { firstname, lastname, email, phone, userid } = result.rows[0];

    const token = signToken(userid);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          firstname,
          lastname,
          email,
          phone,
          userid,
        },
      },
    });
  } catch (err: any) {
    console.error("Error logging in", err);

    res.status(400).json({
      status: "Bad Request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "Authentication failed. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userid: string;
    };

    const query = `SELECT * FROM users WHERE userid = $1`;
    const result = await client.query(query, [decoded.userid]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Authentication failed. User not found.",
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      status: "Unauthorized",
      message: "Authentication failed. Invalid token.",
    });
  }
};
