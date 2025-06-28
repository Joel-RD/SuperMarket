import bcrypt from "bcrypt";
import { hashgenerator, comparePassword, createRoles } from "../../../src/utils/passwordEncrypt.js";

describe("passwordEncrypt utils", () => {

  describe("hashgenerator", () => {
    it("should return a hash string when given a password", async () => {
      const salt = 10;
      const myPassword = "my_password01"
      const hashWithBcrypt = bcrypt.hash(myPassword,salt);
      const hashWithFuntion = hashgenerator(myPassword)
      
      expect(typeof await hashWithBcrypt).toBe("string");
      expect(typeof await hashWithFuntion).toBe("string");
      expect(await hashWithBcrypt).not.toBe(myPassword);
      expect(await hashWithFuntion).not.toBe(myPassword);
    });
    
    it("should handle errors and return undefined", async () => {
      await expect(hashgenerator()).rejects.toThrow();
    });
  });

  describe("comparePassword", () => {
    it("should return true when password matches hash", async () => {
      const myPassword = "myPassword01";
      const hash = await bcrypt.hash(myPassword, 10);
      const result = await comparePassword(myPassword, hash);
      expect(result).toBe(true);
    });

    it("should return false when password does not match hash", async () => {
      const password1 = "my_secretPassword";
      const password2 = "my_secretPassword2";
      const result = await comparePassword(password1, password2);
      expect(result).toBe(false);
    });

    it("should handle errors and return undefined", async () => {
      const result = await comparePassword("fail", "failhash");
      expect(result).toBe(false);
      expect(result).not.toBe(true)
    });

    it("should handle errors return error", async () => {
      await expect(comparePassword()).rejects.toThrow();
    })
  });
});
