import { rate_Limit } from "../../utils/rateLimit.js";
import { createPaypalOrder, paymentSuccess, cancelPayment, confirmPaypalPayment } from "../../controller/controller_paypall.js";
import express from "express";

const router = express.Router();

router.post("/shop/purchasing", rate_Limit, createPaypalOrder );

router.post("/shop/confirm-payment", confirmPaypalPayment)

router.get("/shop/success-payment", paymentSuccess);

router.get("/shop/cancel-payment", cancelPayment);

export default router;
