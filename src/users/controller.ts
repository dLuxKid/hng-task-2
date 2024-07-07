import { type Request, type Response } from "express";

export const getMyAccount = (req: Request, res: Response) => {
  const { firstname, lastname, email, phone, userid } = req.user;
  const { id } = req.params;

  if (userid != id)
    return res.status(400).json({
      status: "Bad Request",
      message: "Authentication failed",
      statusCode: 401,
    });

  return res.status(200).json({
    status: "success",
    message: "Your profile details",
    data: {
      userId: userid,
      firstName: firstname,
      lastName: lastname,
      email,
      phone,
    },
  });
};
