import * as paypal from "../../../src/utils/config.payment.js";

describe("Configuration paymente, paypal", () => {
  describe("create order", () => {
    it("return true if the command was successful", async () => {
      const totalPrice = 0.01;
      const order = await paypal.createOrder(totalPrice);
      expect(order.status).toBe("CREATED");
    });

    it("should return an order object with id property", async () => {
      const totalPrice = 1.0;
      const order = await paypal.createOrder(totalPrice);
      expect(order).toHaveProperty("id");
    });
    
    it("should throw error if totalPrice is invalid", async () => {
      await expect(paypal.createOrder(null)).rejects.toThrow();
    });

    it("should throw error if totalPrice is not a number (string)", async () => {
      await expect(paypal.createOrder("not-a-number")).rejects.toThrow();
    });

    it("should throw error if totalPrice is not a number (object)", async () => {
      await expect(paypal.createOrder({})).rejects.toThrow();
    });

    it("should throw error if totalPrice is not a number (array)", async () => {
      await expect(paypal.createOrder([1, 2, 3])).rejects.toThrow();
    });

    it("should throw error if totalPrice is not a number (boolean)", async () => {
      await expect(paypal.createOrder(true)).rejects.toThrow();
    });

    it("should throw error if totalPrice is not a number (undefined)", async () => {
      await expect(paypal.createOrder(undefined)).rejects.toThrow();
    });
  });

  describe("capture payment", () => {
    it("should return a payment object when orderID is valid", async () => {
      const totalPrice = 1.0;
      const order = await paypal.createOrder(totalPrice);

      // Busca el link que contiene 'checkout'
      const checkoutLink = order.links.find((link) => link.rel === "approve");

      expect(checkoutLink).toBeDefined();
      expect(checkoutLink.href).toContain(
        "https://www.sandbox.paypal.com/checkoutnow?token="
      );
    });

    it("should throw error if orderID is null", async () => {
      await expect(paypal.capturePayment(null)).rejects.toThrow();
    });

    it("should throw error if orderID is undefined", async () => {
      await expect(paypal.capturePayment(undefined)).rejects.toThrow();
    });

    it("should throw error if orderID is not a string (number)", async () => {
      await expect(paypal.capturePayment(12345)).rejects.toThrow();
    });

    it("should throw error if orderID is not a string (object)", async () => {
      await expect(paypal.capturePayment({})).rejects.toThrow();
    });

    it("should throw error if orderID is not a string (array)", async () => {
      await expect(paypal.capturePayment([1, 2, 3])).rejects.toThrow();
    });

    it("should throw error if orderID is not a string (boolean)", async () => {
      await expect(paypal.capturePayment(true)).rejects.toThrow();
    });
  });
});
