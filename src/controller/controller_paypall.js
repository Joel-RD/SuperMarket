import { globalEnvConfig } from "../config.js";
import { executeQuery } from "../models/DB.js";
import * as paypal from "../utils/config.payment.js";

const { NODE_ENV } = globalEnvConfig;

export const createPaypalOrder = async (req, res) => {
  try {
    let { total } = req.body;
    if (NODE_ENV === "production") {
      total = 0.01;
    }
    const order = await paypal.createOrder(total.toFixed(2));    
   res.status(200).json({message: order.links[1].href});
  } catch (error) {
    res.status(500).json({ message: "Error creando la orden de PayPal" });
  }
};

export const confirmPaypalPayment = async (req, res) => {
  try {
    let { productos, orderID, total} = req.body;
    const newTotal = total;

    const paymentResult = await paypal.capturePayment(orderID);
    if (paymentResult.status !== "COMPLETED") {
      return res.status(400).json({ message: "Pago no completado" });
    }    

    if (typeof newTotal !== 'number') {
      total = Number(newTotal);
    }

    console.log(req.body, total);
    
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
      if (!stockResult.rows[0]) {
        throw new Error(`Producto con código de barras ${barCode} no encontrado.`);
      }
      if (stockResult.rows[0].stock < productos[barCode].cantidad) {
        throw new Error(
          `Stock insuficiente para el producto con código ${barCode}.`
        );
      }
    }

    // Insertar venta
    const ventaQuery = `INSERT INTO ventas (ventas_id, id_sucursal, total) VALUES ($1, $2, $3) RETURNING *`;
    const ventaParams = [orderID, userIdSucursal, total];
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

    res.status(200).json({ message: "Compra registrada correctamente" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error al registrar la compra" });
  }
};

export const paymentSuccess = (req, res) => {
  res.render("payment_success.handlebars");
};

export const cancelPayment = (req, res) => {
  res.render("cancel-payment.handlebars");
};
