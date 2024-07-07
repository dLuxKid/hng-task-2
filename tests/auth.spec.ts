import jwt, { type JwtPayload } from "jsonwebtoken";
import request from "supertest";
import app from "..";
import { signToken } from "../src/lib/utils";

describe("Token Generation", () => {
  it("should generate a token with correct expiration and user details", () => {
    const userid = "1";
    const token = signToken(userid);

    // @ts-ignore
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    expect(decoded).toHaveProperty("userid", userid);

    const expiresIn = 60 * 60 * 24 * 7;
    const currentTime = Math.floor(Date.now() / 1000);
    expect(decoded.exp).toBeGreaterThanOrEqual(currentTime + expiresIn - 5);
    expect(decoded.exp).toBeLessThanOrEqual(currentTime + expiresIn + 5);
  });
});

describe("Auth Endpoints", () => {
  it("should register user successfully and confirm that an organisation was created with the user's name", async () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "09012345678",
    };
    const res = await request(app).post("/auth/register").send(user);

    const orgres = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${res.body.data.accessToken}`);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.user.firstName).toBe(user.firstName);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data).toHaveProperty("accessToken");

    expect(orgres.statusCode).toEqual(200);
    expect(orgres.body.data.organisations[0].name.split("'")[0]).toBe(
      user.firstName
    );
  });

  it("should log the user in successfully", async () => {
    const user = {
      email: "john.doe@example.com",
      password: "password123",
    };
    const res = await request(app).post("/auth/login").send(user);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({
        message: expect.any(String),
        field: expect.any(String),
      })
    );
  });

  it("should fail if there’s duplicate email or userID", async () => {
    const user = {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
    };

    await request(app).post("/auth/register").send(user);

    const res = await request(app).post("/auth/register").send(user);

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({
        message: "user with email jane.doe@example.com already exists",
        field: "email",
      })
    );
  });
});
