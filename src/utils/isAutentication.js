import jwt from "jsonwebtoken";
import { globalEnvConfig } from "../config.js";

const { JWT_SECRET } = globalEnvConfig;

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.access_token_login;
    
    if (!token) {
      return res.status(401).redirect("/register");
      // return res.status(401).json({ mes sage: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.session = decoded;
    res.locals.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    throw error
  }
};
