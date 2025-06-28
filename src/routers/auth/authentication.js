import { Router } from "express";
import { createUsers, userLogin, verifyEmail} from "../../controller/controller_autentication.js"

const router = Router();
router.post("/singup", createUsers);

router.get("/emailverify", async (req, res) => {
  res.render("email.handlebars");
});

router.post("/emailverify", verifyEmail);

router.post("singin/", userLogin);

router.post("/user/logout", (req, res) => {
  res.clearCookie("access_token_login");
  res.redirect("/register");
});

export default router;
