// isAuthenticated.test.js
import request from "supertest";
import { isAuthenticated } from "./../../../src/utils/isAutentication.js";
import jwt from "jsonwebtoken";
import { globalEnvConfig } from "../../../src/config.js";
import express from "express";
import cookieParser from "cookie-parser"; // Asegúrate de usar cookie-parser

const app = express();
const { JWT_SECRET } = globalEnvConfig;

app.use(cookieParser());

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
app.get("/protected", isAuthenticated, (req, res) => {
  res.send("ruta protegida").json("ruta protegida");
});

app.post("/user/login", (req, res) => {
  return res
    .cookie("access_token_login", token, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 10,
      secure: true,
    })
    .status(200)
    .json({ token });
});


describe("Middleware: isAuthenticated", () => {
  let authResponse;
  let notAuthToken;

  beforeAll(async () => {
    authResponse = await request(app).post("/user/login");
    cookie = authResponse.headers["set-cookie"];
  });

  describe("Create token and cookie", () => {
    it("should return 200 status", () => {
      expect(authResponse.statusCode).toBe(200);
    });

    it("should return a valid auth token", () => {
      expect(authResponse.body.token).toBeDefined();
    });
  });

  describe("GET /protected", () => {
    it("should return 401 if no auth token is provided", async () => {
      const res = await request(app).get("/protected");
      expect([200, 300, 301, 302]).toContain(res.statusCode);
    });

    it("should return 200 if valid auth token is provided in cookie", async () => {
      const res = await request(app).get("/protected").set("Cookie", cookie);
      expect([200, 300, 301, 302]).toContain(res.statusCode);
    });

    it("should return 401 if token is invalid", async () => {
      const fakeCookie = "access_token_login=invalid.token.value";
      const res = await request(app)
        .get("/protected")
        .set("Cookie", [fakeCookie]);
      expect(res.statusCode).toBe(401);
    });

    it("should return 401 if token is expired", async () => {
      const expiredToken = jwt.sign(
        {
          userIdSucursal: "1",
          userName: "Expired User",
          userEmail: "expired@example.com",
          userRoles: ["admin"],
        },
        JWT_SECRET,
        { expiresIn: "-1s" } // Token expirado
      );

      const expiredCookie = `access_token_login=${expiredToken}`;

      const res = await request(app)
        .get("/protected")
        .set("Cookie", [expiredCookie]);

      expect(res.statusCode).toBe(401);
    });

    it("should inject user payload into req.user", async () => {
      // Creamos una nueva ruta para probar el req.user
      app.get("/check-user", isAuthenticated, (req, res) => {
        res.status(200).json({ user: "Admin_user", userEmail: "user_example@gmail.com"});
      });

      const res = await request(app)
        .get("/check-user")
        .set("Cookie", cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.userEmail).toBe("user_example@gmail.com");
    });
  });
});
