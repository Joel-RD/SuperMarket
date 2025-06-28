import fetch from "node-fetch";
import { globalEnvConfig } from "../config.js";

const {
  LINK_PAYPAL_PAYMENT,
  CLIENT_ID_PAYPAL,
  CLIENT_SECRET_PAYPAL,
  DEPLOY_URL,
} = globalEnvConfig;

export const createOrder = async (price) => {
  try {
    if (!price) throw Error("Price is not valid")
    if (typeof price !== "number") throw Error("the type value is not valid")
    const accesToken = await generateAccessToken();
    const url = `${LINK_PAYPAL_PAYMENT}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accesToken,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
        application_context: {
          return_url: `${DEPLOY_URL}/user/shop/success-payment`,
          cancel_url: `${DEPLOY_URL}/user/shop/cancel-payment`,
        },
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw (error);
  }
};

export const capturePayment = async (orderID) => {
  try {
    if (!orderID) throw Error("OrderID does not exist")
    if (typeof orderID !== "string") throw Error("the type orderID is not valid")
    const accesToken = await generateAccessToken();
    const url = `${LINK_PAYPAL_PAYMENT}/v2/checkout/orders/${orderID}/capture`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accesToken,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw (error);
  }
};

const generateAccessToken = async () => {
  try {
    const response = await fetch(LINK_PAYPAL_PAYMENT + "/v1/oauth2/token", {
      method: "post",
      body: "grant_type=client_credentials",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID_PAYPAL + ":" + CLIENT_SECRET_PAYPAL).toString(
            "base64"
          ),
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    throw (error);
  }
};
