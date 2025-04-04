let productoEscaneado = {};
let totalPrecio = 0;
let productoActual;
let codigo = "";

const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const codigoProducto = document.getElementById("codigo");
const unidades = document.getElementById("unidades");
const total = document.getElementById("total");

Quagga.init(
  {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#viewport"),
      constraints: {
        width: { min: 100 },
        height: { min: 100 },
        facingMode: "environment",
        aspectRatio: { min: 1, max: 2 },
      },
    },
    decoder: {
      readers: [
        "code_128_reader",
        "ean_reader",
        "ean_8_reader",
        "code_39_reader",
        "code_39_vin_reader",
        "upc_reader",
        "upc_e_reader",
        "codabar_reader",
      ],
    },
  },
  function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  }
);

Quagga.onDetected(async function (result) {
  const code = result.codeResult.code;

  try {
    const request = await fetch(`/user/shop/scan/${code}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!request.ok) {
      console.error("Error al escanear producto");
      return;
    }
    
    const response = await request.json();
    const producto = response.producto;

    if (!producto || !producto.nombre || !producto.precio) {
      console.error("Producto no válido");
      return;
    }

    codigo = producto.codigo_barras;
    const precio = producto.precio;

    if (productoEscaneado[codigo]) {
      productoEscaneado[codigo].cantidad++;
    } else {
      productoEscaneado[codigo] = {
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
      };
    }

    productoActual = codigo;

    totalPrecio += parseFloat(precio);

    actualizarUI(
      producto,
      productoEscaneado[codigo].cantidad,
      totalPrecio,
      codigo
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
});

document.getElementById("decrease").addEventListener("click", () => {
  if (productoActual && productoEscaneado[productoActual]) {
    const producto = productoEscaneado[productoActual];
    if (producto.cantidad > 1) {
      producto.cantidad--;
      totalPrecio -= parseFloat(producto.precio);
      actualizarUI(producto, producto.cantidad, totalPrecio, codigo);
    } else {
      console.log("No se puede disminuir más la cantidad.");
    }
  }
});

document.getElementById("increase").addEventListener("click", () => {
  if (productoActual && productoEscaneado[productoActual]) {
    const producto = productoEscaneado[productoActual];
    producto.cantidad++;
    totalPrecio += parseFloat(producto.precio);
    actualizarUI(producto, producto.cantidad, totalPrecio, codigo);
  }
});

function actualizarUI(producto, cantidad, totalPrecio, codigo) {
  nombre.value = producto.nombre;
  precio.value = producto.precio;
  codigoProducto.value = codigo;
  unidades.value = cantidad;
  total.value = (producto.precio * cantidad).toFixed(2);
}

document.getElementById("total_productos").addEventListener
("click", () => {
  nombre.value = "";
  precio.value = "";
  codigoProducto.value = "";
  unidades.value = "";
  total.value = "";

  const precioTotal = document.getElementById("totalApagar");
  precioTotal.value = totalPrecio.toFixed(2);
});

document.getElementById("agregar").addEventListener("click", async () => {
  const precioTotal = document.getElementById("totalApagar");
  precioTotal.value = " ";

  try {
    const request = await fetch(`/user/shop/purchasing`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productos: productoEscaneado,
        total: totalPrecio,
      }),
    });

    const data = await request.json();
    window.open(data, "_blank", "width=500,height=700");
  } catch (error) {
    console.error("Error:", error.message);
  }
});
