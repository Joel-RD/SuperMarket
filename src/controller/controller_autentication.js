import { validationData } from "../utils/validateData.js";
import { executeQuery } from "../models/DB.js";
import {
  hashgenerator,
  comparePassword,
  createRoles,
} from "../utils/passwordEncrypt.js";
import jwt from "jsonwebtoken";
import {
  transporter,
  templateEmailHtml,
  generateCode,
} from "../utils/config.email.js";
const { SECRET_TOKEN_JWT, SECRET_EMAIL } = process.env;

export const createUsers = async (req, res) => {
  try {
    const { username, email, password, branch } = req.body;

    try {
      validationData.validateName(username);
      validationData.validateEmail(email);
      validationData.validatePassword(password);
      validationData.validateBranch(branch);
    } catch (validationError) {
      return res.status(400).json(validationError.message);
    }

    const query = `SELECT * FROM usersauth WHERE email = $1`;
    const params = [email];

    const result = await executeQuery(query, params);

    if (result.rowCount > 0) {
      res.status(400).send("User already exists");
      throw new Error("User already exists");
    }

    //Seleccionar la sucursal a la que pertenece el usuario
    const query2 = `SELECT * FROM sucursal WHERE nombre = $1`;
    const params2 = [branch];
    const result2 = await executeQuery(query2, params2);

    if (result2.rowCount === 0) {
      return res.status(400).send("Branch not found");
    }

    //Generar hash
    const hash = await hashgenerator(password);

    // Insert user
    const query3 = `insert into usersauth (username, email, id_sucursal, roles, password) values ($1, $2, $3, $4, $5)`;
    const params3 = [
      username,
      email,
      result2.rows[0].id,
      [`${createRoles()[0]}, ${createRoles()[1]}`],
      hash,
    ];

    const result3 = await executeQuery(query3, params3);
    console.log(result3.rows);
    console.log(req.body);
    res.send("Usuario registrado").status(201);
  } catch (error) {
    console.error(error.message);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, codeEmail } = req.body;
    //Validar usuario
    const query = `
      SELECT 
        ua.id,
        ua.username,
        ua.email,
        ua.id_sucursal,
        ua.roles,
        ua.code_verification_id,
        cv.code,
        cv.creado_en AS code_created_at
      FROM 
        usersauth ua
      LEFT JOIN 
        code_verification cv
      ON 
        ua.code_verification_id = cv.id
      WHERE 
        ua.email = $1;
    `;
    const params = [email];

    const result = await executeQuery(query, params);
    if (result.rowCount === 0) {
      return res.status(400).send("User not found, Please register first");
    }

    //Eliminar code verification
    const query2 = `
      DELETE
      FROM code_verification
      WHERE id = $1
      AND creado_en < NOW() - INTERVAL '10 minute'
    `;
    const params2 = [result.rows[0].code_verification_id];
    await executeQuery(query2, params2);

    const codeDB = parseFloat(result.rows[0].code);
    const codeEmailVerified = parseFloat(codeEmail);

    if (codeDB !== codeEmailVerified || codeDB === null) {
      return res.status(400).send("Code not valid");
    }

    const token = jwt.sign(
      {
        userIdSucursal: result.rows[0].id_sucursal,
        userName: result.rows[0].username,
        userEmail: result.rows[0].email,
        userRoles: result.rows[0].roles,
      },
      SECRET_TOKEN_JWT,
      {
        expiresIn: "10h",
      }
    );

    res
      .cookie("access_token_login", token, {
        httpOnly: true,
        sameSite: "none", // deberia ser none
        maxAge: 1000 * 60 * 60 * 10, // 10 Horas
        secure: true,
      })
      .json("Email verified")
      .status(201);
  } catch (error) {
    res.json({ error: "error internal server" }).status(500);
    console.error("Error internal server", error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const codeGenerator = generateCode();
    const { email, password } = req.body;

    try {
      validationData.validateEmail(email);
      validationData.validatePassword(password);
    } catch (validationError) {
      return res.status(400).json(validationError.message);
    };

    //Validar usuario
    const query = `SELECT * FROM usersauth WHERE email = $1`;
    const params = [email];

    const result = await executeQuery(query, params);

    if (result.rowCount === 0) {
      return res.status(400).send("User not found, Please register first");
    }

    const hashPassword = result.rows[0].password;

    if (!(await comparePassword(password, hashPassword))) {
      return res.status(400).send("La contraseña es incorrecta.");
    }

    // Insert code verification
    if (result.rows[0].code_verification_id === null) {
      const query2 = `INSERT INTO code_verification (code) VALUES ($1) RETURNING *`;
      const params2 = [codeGenerator];
      const result2 = await executeQuery(query2, params2);

      const query3 = `UPDATE usersauth SET code_verification_id = $1 WHERE id = $2 RETURNING *`;
      const params3 = [result2.rows[0].id, result.rows[0].id];
      await executeQuery(query3, params3);
    }

    if (result.rows[0].code_verification_id !== null) {
      const query2 = `UPDATE code_verification SET code = $1 WHERE id = $2 RETURNING *`;
      const params2 = [codeGenerator, result.rows[0].code_verification_id];
      await executeQuery(query2, params2);
    }

    // sendCode to email
    const sendEmail = async () => {
      const info = await transporter.sendMail({
        from: `"Hello👋" <${SECRET_EMAIL}>`,
        to: email,
        subject: "Code verification",
        text: "Hello , code verification",
        html: templateEmailHtml(codeGenerator),
      });
      console.log("Message sent: %s", info);
    };

    res.send("user logged in");
    sendEmail();
  } catch (error) {
    res.status(500).send("¡Ups!... algo salió mal al iniciar sesión");
    console.error("algo salió mal al iniciar sesión", error.message);
  }
};
