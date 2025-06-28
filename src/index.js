import express from "express";
import path from "path";
import publicRouter from "./routers/public/public.js";
import authRouter from "./routers/auth/authentication.js";
import privateRouter from "./routers/private/private.js";
import paymentMethod from "./routers/payments/paypal_router.js";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { isAuthenticated } from "./utils/isAutentication.js";
import cors from "cors";
import { globalEnvConfig } from "./config.js";

const app = express();

const { PORT_SERVER, DEPLOY_URL } = globalEnvConfig;

//middlewares
app.use(
  cors({
    origin: DEPLOY_URL,
    credentials: true,
  })
);
app.set('trust proxy', true)
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static files
app.use(express.static(path.join(process.cwd(), "src", "views")));

//config template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src", "views"));

//routers
app.use(publicRouter);
app.use(authRouter);
app.use(isAuthenticated)
app.use("/user", privateRouter, paymentMethod);
app.all("*", (req, res) => {
  res.status(404).render("err.handlebars");
});

export default app;
