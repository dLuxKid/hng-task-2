import { Router } from "express";
import { protect } from "../auth/controller";
import {
  addToOrg,
  createOrg,
  getOrganisation,
  getYourOrganisations,
} from "./controller";

const organisationRouter = Router();

organisationRouter.get("/", protect, getYourOrganisations);
organisationRouter.get("/:id", protect, getOrganisation);

organisationRouter.post("/", protect, createOrg);
organisationRouter.post("/:orgid/users", addToOrg);

export default organisationRouter;
