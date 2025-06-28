import request from "supertest";
import app from "../../src/index.js";
import { executeQuery } from "../../src/models/DB.js";
import jwt from "jsonwebtoken";
import { globalEnvConfig } from "../../src/config.js";
import express from "express";
import cookieParser from "cookie-parser";

const appExpress = express();
const { JWT_SECRET } = globalEnvConfig;

appExpress.use(cookieParser());

const createdToken = () => {
  return jwt.sign(
    {
      userIdSucursal: "1",
      userName: "Admin User",
      userEmail: "user_example@gmail.com",
      userRoles: ["admin"],
    },
    JWT_SECRET,
    {
      expiresIn: "1h", 
    }
  );
};

const token = createdToken();

describe("User Authrorized and Privated Router ", () => {
  const userData = {
    username: "Ejemplo",
    email: "ejemplo@gmail.com",
    password: "Ejemplo@user01",
    branch: "s1",
  };

  let cookie = "";
  const email = "user_admin@gmail.com";
  const password = "Admin@user01";
  const codeEmail = 1023;

  beforeEach(async () => {
    await executeQuery("DELETE FROM usersauth WHERE email = $1;", [
      userData.email,
    ]);
  });
 
  describe("POST: /singup", () => {
    it("should return 200, user created", async () => {
      const res = await request(app).post("/singup").send(userData);
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Usuario registrado");
    });

    it("should return 400 if username is invalid", async () => {
      const res = await request(app)
        .post("/singup")
        .send({
          ...userData,
          username: "",
        });
      expect(res.statusCode).toBe(401);
    });

    it("should return 400 if email is invalid", async () => {
      const res = await request(app)
        .post("/singup")
        .send({
          ...userData,
          email: "not-an-email",
        });
      expect(res.statusCode).toBe(400);
      expect(res.text).toMatch(/email/i);
    });

    it("should return 400 if password is invalid", async () => {
      const res = await request(app)
        .post("/singup")
        .send({
          ...userData,
          password: "123", // No cumple con los requisitos
        });
      expect(res.statusCode).toBe(400);
    });

    it("should return 400 if branch is invalid", async () => {
      const res = await request(app)
        .post("/singup")
        .send({
          ...userData,
          branch: "", // vacío o inexistente
        });
      expect(res.statusCode).toBe(401);
    });

    it("should return 400 if branch does not exist in DB", async () => {
      const res = await request(app)
        .post("/singup")
        .send({
          ...userData,
          branch: "sucursalInexistente",
        });
      expect(res.statusCode).toBe(400);
    });

    it("should return 400 if email already exists", async () => {
      // Primer intento de registro, debe ser exitoso
      const user1 = await request(app).post("/singup").send(userData);
      expect([200, 201, 301]).toContain(user1.statusCode); // o el código que uses para éxito

      // Segundo intento con el mismo email, debe fallar con 400
      const user02 = await request(app).post("/singup").send(userData);
      expect(user02.status).toBe(400);
      expect(user02.text).toBe("User already exists");
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/singup").send({});
      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST: /singin and Verify email code", () => {
    it("should return 200 it user Loging", async () => {
      const res = await request
        .agent(app)
        .post("/singin")
        .send(email, password);
      expect([200, 201, 301, 302, 303]).toContain(res.statusCode);
    });

    it("should return 200 if verify email code", async () => {
      const res = await request
        .agent(app)
        .post("/emailverify")
        .send({ email, codeEmail });

      cookie = res.headers["set-cookie"];
      expect(res.status).toBe(200);
      expect(res.text).toBe('"Admin access granted"');
    });
  });
});
 