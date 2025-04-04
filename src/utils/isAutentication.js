import jwt from "jsonwebtoken";
const { SECRET_TOKEN_JWT } = process.env;

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.access_token_login;

    if (!token) {
      return res.status(401).redirect("/register");
    }

    const decoded = jwt.verify(token, SECRET_TOKEN_JWT);
    req.session = decoded;
    res.locals.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send("Unauthorized: Invalid token");
  }
};
