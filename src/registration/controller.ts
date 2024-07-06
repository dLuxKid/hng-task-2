import { type Request, type Response } from "express";
import {
  addToOrgQuery,
  createOrgQuery,
  getOrgQuery,
  getYourOrgQuery,
} from "./queries";
import client from "../../db";

export const getYourOrganisations = async (req: Request, res: Response) => {
  const { userid } = req.user;

  const query = getYourOrgQuery(userid);

  try {
    const result = await client.query(query);

    if (result.rows.length === 0)
      res.status(401).json({
        status: "Bad request",
        message: "You do not belong to an organisation",
        statusCode: 401,
      });

    res.status(200).json({
      status: "success",
      message: "Successfully fetched your organisations",
      data: {
        organisations: result.rows,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Bad request",
      message: "Error fetching your orgainsation",
      statusCode: 404,
    });
  }
};

export const getOrganisation = async (req: Request, res: Response) => {
  const { id } = req.params;

  const query = getOrgQuery(id);

  try {
    const result = await client.query(query);

    if (result.rows.length === 0)
      res.status(401).json({
        status: "Bad request",
        message: "Such organisation does not exist",
        statusCode: 401,
      });

    res.status(200).json({
      status: "success",
      message: "Successfully fetched the organisation",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(404).json({
      status: "Bad request",
      message: "Error fetching the orgainsation",
      statusCode: 404,
      error,
    });
  }
};

export const createOrg = async (req: Request, res: Response) => {
  const { userid } = req.user;

  const { name, description } = req.body;

  if (!name) {
    return res.status(422).json({
      errors: [
        {
          field: "name",
          message: "name of the organisation is missing",
        },
      ],
    });
  }

  const query = createOrgQuery({ name, userid, description });

  try {
    const result = await client.query(query);

    if (result.rows.length === 0)
      res.status(400).json({
        status: "Bad Request",
        message: "Client error",
        statusCode: 400,
      });

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

export const addToOrg = async (req: Request, res: Response) => {
  const { orgid } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(422).json({
      errors: [
        {
          field: "userId",
          message: "userId is missing",
        },
      ],
    });
  }

  const query = addToOrgQuery(userId, orgid);

  try {
    await client.query(query);

    res.status(201).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};
