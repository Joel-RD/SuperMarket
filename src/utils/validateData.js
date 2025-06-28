export const validationData = {
  validateName: function (name) {
    const nameRegex = /^[A-Z][a-z]*( [A-Z][a-z]*)*$/;
    if (
      !nameRegex.test(name) ||
      name === "" ||
      name === undefined ||
      name === null ||
      !isNaN(name)
    ) {
      throw new Error(
        "Nombre inválido: Debe comenzar con una letra mayúscula y seguir con letras minúsculas"
      );
    }
    return name;
  },

  validateEmail: function (email) {
    if (typeof email !== "string" || email.trim() === "") {
      throw new Error("Email inválido: No puede estar vacío");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.com$/;
    if (!emailRegex.test(email)) {
      throw new Error(
        "Email inválido: Debe ser Gmail, Hotmail o Outlook (ejemplo@gmail.com, ejemplo@hotmail.com, ejemplo@outlook.com)"
      );
    }

    return email;
  },

  validatePassword: function (password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (
      !passwordRegex.test(password) ||
      password === "" ||
      password === undefined ||
      password === null ||
      password === NaN
    ) {
      throw new Error(
        "Contraseña inválida. Debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial."
      );
    }
    return password;
  },

  validateBranch: function (branch) {
    const branchRegex = /^s(\d{1,4})$/;
    if (
      !branchRegex.test(branch) ||
      branch === "" ||
      branch === undefined ||
      branch === null ||
      !isNaN(branch)
    ) {
      throw new Error(
        "Sucursal inválida: Debe comenzar con 's' y seguir con números hasta 1000 (ejemplo: s1, s2, s3)"
      );
    }
    return branch;
  },
};
