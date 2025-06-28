import { validationData } from "../../../src/utils/validateData";

describe("validationData", () => {
  describe("validateName", () => {
    it("debe retornar el nombre si es válido", () => {
      expect(validationData.validateName("Juan")).toBe("Juan");
      expect(validationData.validateName("Juan Perez")).toBe("Juan Perez");
      expect(validationData.validateName("Juan Perez Lopez")).toBe(
        "Juan Perez Lopez"
      );
    });

    it("debe lanzar error si el nombre es inválido", () => {
      expect(() => validationData.validateName("juan")).toThrow(
        "Nombre inválido"
      );
      expect(() => validationData.validateName("JUAN")).toThrow(
        "Nombre inválido"
      );
      expect(() => validationData.validateName("Juan perez")).toThrow(
        "Nombre inválido"
      );
      expect(() => validationData.validateName("123")).toThrow(
        "Nombre inválido"
      );
      expect(() => validationData.validateName("")).toThrow("Nombre inválido");
      expect(() => validationData.validateName(null)).toThrow(
        "Nombre inválido"
      );
      expect(() => validationData.validateName(undefined)).toThrow(
        "Nombre inválido"
      )
      expect(() => validationData.validateName("Juan1")).toThrow(
        "Nombre inválido"
      );
      expect(() => validationData.validateName(" ")).toThrow("Nombre inválido");
      expect(() => validationData.validateName(123)).toThrow("Nombre inválido");
    });
  });

  describe("validateEmail", () => {
    it("debe retornar el email si es válido", () => {
      expect(validationData.validateEmail("test@gmail.com")).toBe(
        "test@gmail.com"
      );
      expect(validationData.validateEmail("usuario123@hotmail.com")).toBe(
        "usuario123@hotmail.com"
      );
      expect(validationData.validateEmail("nombre.outlook@outlook.com")).toBe(
        "nombre.outlook@outlook.com"
      );
    });

    it("debe lanzar error si el email es inválido", () => {
      expect(() => validationData.validateEmail("test@gmail")).toThrow(
        "Email inválido"
      );
      expect(() => validationData.validateEmail("test@outlook.es")).toThrow(
        "Email inválido"
      );
      expect(() => validationData.validateEmail("test@yahoo.com")).toThrow(
        "Email inválido"
      );
      expect(() => validationData.validateEmail("test@")).toThrow(
        "Email inválido"
      );
      expect(() => validationData.validateEmail("")).toThrow("Email inválido");
      expect(() => validationData.validateEmail(null)).toThrow(
        "Email inválido"
      );
      expect(() => validationData.validateEmail(undefined)).toThrow(
        "Email inválido"
      );
      expect(() => validationData.validateEmail(123)).toThrow("Email inválido");
      expect(() => validationData.validateEmail("testgmail.com")).toThrow(
        "Email inválido"
      );
    });
  });

  describe("validatePassword", () => {
    it("debe retornar la contraseña si es válida", () => {
      expect(validationData.validatePassword("Abcdef1!")).toBe("Abcdef1!");
      expect(validationData.validatePassword("Password1@")).toBe("Password1@");
      expect(validationData.validatePassword("A1b2c3d4!")).toBe("A1b2c3d4!");
    });

    it("debe lanzar error si la contraseña es inválida", () => {
      expect(() => validationData.validatePassword("abcdefg")).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword("ABCDEFGH")).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword("12345678")).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword("Abcdefgh")).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword("Abcdefg1")).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword("Abcdefg!")).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword("")).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword(null)).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword(undefined)).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword(NaN)).toThrow(
        "Contraseña inválida"
      );
      expect(() => validationData.validatePassword("A1!")).toThrow(
        "Contraseña inválida"
      );
    });
  });

  describe("validateBranch", () => {
    it("debe retornar la sucursal si es válida", () => {
      expect(validationData.validateBranch("s1")).toBe("s1");
      expect(validationData.validateBranch("s10")).toBe("s10");
      expect(validationData.validateBranch("s999")).toBe("s999");
      expect(validationData.validateBranch("s1000")).toBe("s1000");
    });

    it("debe lanzar error si la sucursal es inválida", () => {
      expect(() => validationData.validateBranch("S1")).toThrow(
        "Sucursal inválida"
      );
      expect(() => validationData.validateBranch("s")).toThrow(
        "Sucursal inválida"
      );
      expect(() => validationData.validateBranch("1")).toThrow(
        "Sucursal inválida"
      );
      expect(() => validationData.validateBranch("s10000")).toThrow(
        "Sucursal inválida"
      );
      expect(() => validationData.validateBranch("")).toThrow(
        "Sucursal inválida"
      );
      expect(() => validationData.validateBranch(null)).toThrow(
        "Sucursal inválida"
      );
      expect(() => validationData.validateBranch(undefined)).toThrow(
        "Sucursal inválida"
      );
      expect(() => validationData.validateBranch(123)).toThrow(
        "Sucursal inválida"
      );
      expect(() => validationData.validateBranch("sabc")).toThrow(
        "Sucursal inválida"
      );
      expect(() => validationData.validateBranch(" s1")).toThrow(
        "Sucursal inválida"
      );
    });
  });
});
