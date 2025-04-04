//payment (paypal) config
import fecth from "node-fetch";

let {
  SANDBOX_PAYPAL_LINK,
  LIVE_PAYPAL_LINK,
  CLIENT_ID_PAYPAL,
  CLIENT_SECRET_KEY_PAYPAL,
  CLIENT_ID_PAYPAL_LIVE,
  CLIENT_SECRET_KEY_PAYPAL_LIVE,
  NODE_ENV,
} = process.env;

if (NODE_ENV === "production") {
  SANDBOX_PAYPAL_LINK = LIVE_PAYPAL_LINK;
  CLIENT_ID_PAYPAL = CLIENT_ID_PAYPAL_LIVE;
  CLIENT_SECRET_KEY_PAYPAL = CLIENT_SECRET_KEY_PAYPAL_LIVE;
}

export const createOrder = async (price) => {
  try {
    const accesToken = await generateAccessToken();
    const url = `${SANDBOX_PAYPAL_LINK}/v2/checkout/orders`;
    const response = await fecth(url, {
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
              value: 0.01,
            },
          },
        ],
        application_context: {
          return_url: `http://localhost:4650/user/shop/success-payment`,
          cancel_url: `http://localhost:4650/user/shop/cancel-payment`,
        },
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error_createOrder", error.message);
  }
};

export const capturePayment = async (orderID) => {
  try {
    const accesToken = await generateAccessToken();
    const url = `${SANDBOX_PAYPAL_LINK}/v2/checkout/orders/${orderID}/capture`;
    const response = await fecth(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accesToken,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error_capturePayment", error.message);
  }
};

const generateAccessToken = async () => {
  try {
    const response = await fetch(SANDBOX_PAYPAL_LINK + "/v1/oauth2/token", {
      method: "post",
      body: "grant_type=client_credentials",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            CLIENT_ID_PAYPAL + ":" + CLIENT_SECRET_KEY_PAYPAL
          ).toString("base64"),
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error_generateAccessToken", error.message);
  }
};
