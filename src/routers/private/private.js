import { Router } from "express";
import { rate_Limit } from "../../utils/rateLimit.js";
import {
  scandProduct,
  updateConfig,
  salesPanel
} from "../../controller/private.controller.js";

const router = Router();

router.get("/adminpanel", (req, res) => {
  const user = req.session;
  res.render("panel.handlebars");
});

router.get("/shop", (req, res) => {
  res.render("shop.handlebars");
});

router.get("/config", (req, res) => {
  const user = req.session;
  const isAdmin = user.userEmail === "user_admin@gmail.com"
  res.render("config.handlebars", {isAdmin});
});

router.post("/user/config/update", rate_Limit, updateConfig);

router.post("/shop/scan/:id", rate_Limit, scandProduct);

router.get("/sales", salesPanel);

export default router;
