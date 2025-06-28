import nodemailer from "nodemailer";
import { globalEnvConfig } from "../config.js"

const { SECRET_PASSWORD_EMAIL, SECRET_EMAIL } = globalEnvConfig;

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: SECRET_EMAIL,
    pass: SECRET_PASSWORD_EMAIL,
  },
});

export const generateCode = () => {
  const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 9000);
  return code;
};

export const templateEmailHtml = (code) => {
  return `
  <h1> Verifica tu correo electronico </h1>
  <p>
    Para completar el registro, por favor introduce el siguiente codigo de verificacion:
  </p>
  <h3>${code}</h3>

  <p>
    El codigo de verificacion es valido por 10 miutos
  </p>
  `;
};
