import { executeQuery } from "../models/DB.js";
import * as paypal from "../utils/config.payment.js";

let {NODE_ENV} = process.env; 

export const paymentPaypal = async (req, res) => {
  try {
    let { productos, total } = req.body;

    if (NODE_ENV === "production") {
      total = 0.01;
    }

    const order = await paypal.createOrder(total.toFixed(2));
    await paypal.capturePayment(order.id);

    //usuario logueado
    const user = req.session.userEmail;
    const queryUser = `SELECT * FROM usersauth WHERE email = $1`;
    const paramsUser = [user];
    const userResult = await executeQuery(queryUser, paramsUser);
    const userIdSucursal = userResult.rows[0].id_sucursal;

    // Validar stock
    for (const barCode in productos) {
      const query = `SELECT id, stock FROM productos WHERE codigo_barras = $1`;
      const params = [barCode];
      const stockResult = await executeQuery(query, params);
      if (stockResult.rows[0].stock < productos[barCode].cantidad) {
        throw new Error(
          `Stock insuficiente para el producto con código ${barCode}.`
        );
      }
    }

    // Insertar venta
    const ventaQuery = `INSERT INTO ventas (ventas_id, id_sucursal, total) VALUES ($1, $2, $3) RETURNING *`;
    const ventaParams = [order.id, userIdSucursal, total];
    const ventaResult = await executeQuery(ventaQuery, ventaParams);
    const ventaId = ventaResult.rows[0].id;

    // Insertar detalle de venta
    for (const barCode in productos) {
      const query = `SELECT  * FROM productos WHERE codigo_barras = $1`;
      const params = [barCode];
      const productoResult = await executeQuery(query, params);
      const productoId = productoResult.rows[0].id;
      const detalleVentaQuery = `INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)`;

      const detalleVentaParams = [
        ventaId,
        productoId,
        productos[barCode].cantidad,
        productos[barCode].precio,
      ];
      await executeQuery(detalleVentaQuery, detalleVentaParams);
    }

    // Actualizar stock
    for (const barCode in productos) {
      const query = `SELECT id, stock FROM productos WHERE codigo_barras = $1`;
      const params = [barCode];
      const stockResult = await executeQuery(query, params);
      const productId = stockResult.rows[0].id;

      const updateStockQuery = `UPDATE productos SET stock = stock - $1 WHERE id = $2`;
      const updateStockParams = [productos[barCode].cantidad, productId];
      await executeQuery(updateStockQuery, updateStockParams);
    }

    res.status(200).json(order.links[1].href);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Ah ocurrido u error al procesar la compra, Intentelo nuevamente." });
  }
};

export const paymentSuccess = (req, res) => {
  res.render("payment_success.handlebars");
};

export const cancelPayment = (req, res) => {
  res.render("cancel-payment.handlebars");
};
