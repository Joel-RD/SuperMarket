import { executeQuery } from "../models/DB.js";
import { creteProducts } from "../utils/generateFakeData.js";
import { comparePassword, hashgenerator } from "../utils/passwordEncrypt.js";

export const updateConfig = async (req, res) => {
  let { username, password, isAdminValid } = req.body;
  const { userEmail } = req.session;

  if (isAdminValid || userEmail === "user_admin@gmail.com") {
    return res
      .status(403)
      .send("No se puede modificar la cuenta de administrador.");
  }

  const existUserQuery = "select * from usersauth where email = $1;";
  const existUserParams = [userEmail];
  const existUserResult = await executeQuery(existUserQuery, existUserParams);

  if (existUserResult.rowCount === 0) {
    return res.send("El usuario no existe...");
  }

  const oldPassword = existUserResult.rows[0].password;
  if (await comparePassword(password, oldPassword)) {
    return res
      .status(400)
      .send(
        "La contraseña no puede ser igual a la antigua, Intente con una diferente."
      );
  }

  //Hashear la nueva contraseña en caso de que exista
  if (password) {
    const newHashPassword = await hashgenerator(password);
    req.body.password = newHashPassword;
  }

  let updateQuery = "update usersauth set";
  let updateParams = [];
  let count = 1;

  Object.keys(req.body).forEach((key) => {
    let value = req.body[key];
    if (value === undefined || value === "") return;
    updateQuery += ` ${key} = $${count}, `;
    updateParams.push(value);
    count++;
  });

  updateQuery =
    updateQuery.trim().replace(/,$/, "") + ` where email = $${count}`;
  updateParams.push(userEmail);

  const updateResult = await executeQuery(updateQuery, updateParams);

  if (updateResult.rowCount === 0) {
    return res.send("Save error to new config.").statusCode(500);
  }

  res.send("Save new config").status(200);
};

export const scandProduct = async (req, res) => {
  try {
    const barCode = req.params.id.toString();
    const { userIdSucursal } = req.session;
    const query = `SELECT * FROM productos WHERE codigo_barras = $1`;
    const params = [barCode];
    const result = await executeQuery(query, params);

    if (result.rowCount === 0) {
      const insertQuery =
        "INSERT INTO productos (id_sucursal, codigo_barras, nombre, precio, stock) values ($1, $2, $3, $4, $5)";
      const insertParams = [
        userIdSucursal,
        barCode,
        creteProducts()[0],
        creteProducts()[1],
        creteProducts()[2],
      ];

      const resultInsert = await executeQuery(insertQuery, insertParams);

      const newProduct = resultInsert.rows[0];
      res.json({ newProduct });
      return;
    }

    //Limpiar todas las ventas y sus detalles cada 2 horas
    const interval = 2 * 60 * 60 * 1000;
    setInterval(async () => {
      const autoDeleteQuery = `truncate ventas , detall_ventas;`;
      await executeQuery(autoDeleteQuery); //Borrar todas las ventas y sus detalles
    }, interval);

    const producto = result.rows[0];

    res.json({ producto });
  } catch (error) {
    console.error(error);
    res
      .json("Upps a ocurrido un error inesperado, intentelo nuevamente")
      .status(500);
  }
};

export const sales_Panel = async (req, res) => {
  let { userIdSucursal } = req.session;

  userIdSucursal = Number(userIdSucursal);
  if (isNaN(userIdSucursal)) {
    return res.status(400).send("El id de sucursal no es válido.");
  }

  const query = `
    SELECT 
  v.ventas_id,
  v.id_sucursal,
  v.total,
  dv.id_producto,
  p.nombre AS producto,
  dv.cantidad,
  dv.precio_unitario,
  dv.subtotal
FROM 
  ventas v
  INNER JOIN detalle_ventas dv ON v.id = dv.id_venta
  INNER JOIN productos p ON dv.id_producto = p.id
WHERE 
  v.id_sucursal = $1
ORDER BY 
  v.ventas_id;
  `;
  const params = [userIdSucursal];

  const result = await executeQuery(query, params);

  const agrupar = result.rows.reduce((acumulado, actual) => {
    if (!acumulado[actual.ventas_id]) {
      acumulado[actual.ventas_id] = {
        ventas_id: actual.ventas_id,
        id_sucursal: actual.id_sucursal,
        total: actual.total,
        productos: [],
      };
    }
    acumulado[actual.ventas_id].productos.push({
      id_producto: actual.id_producto,
      producto: actual.producto,
      cantidad: actual.cantidad,
      precio_unitario: actual.precio_unitario,
      subtotal: actual.subtotal,
    });
    return acumulado;
  }, {});
  res.render("sales.handlebars", { ventas: JSON.stringify(agrupar) });
};

export const salesPanel =  sales_Panel;
setInterval(() =>  salesPanel, 43200000);
