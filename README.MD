# ➡️**Proyecto Supermercado**

- Este proyecto es una aplicación web para la gestión de un supermercado. La aplicación permite a los usuarios registrarse, iniciar sesión, realizar compras, y gestionar productos y ventas. Está construida utilizando Node.js, Express, y PostgreSQL, y utiliza Handlebars como motor de plantillas para la interfaz de usuario.

## 📹 **Video de presentación**

* [Inicio de sesión](https://www.youtube.com/embed/wOTfcEfk33Q)
* [Pagar con PayPal](https://www.youtube.com/embed/xbfm7xwqmQM)
* [Actualizar nombre de usuario](https://www.youtube.com/embed/e7omqwhBpHA)

## 🗃️ **Archivos y Directorios Principales**
> **.env:** Variables de entorno.
>
> **package.json:** Dependencias y scripts.
>
> **src:** Código fuente.
>
> **controller/:** Controladores.
>
> **index.js:** Configuración del servidor.
>
> **server.js** Arranque del servidor
>
> **models/:** Modelos y scripts SQL.
>
> **routers/:** Enrutadores.
>
> **utils/:** Utilidades.
>
> **views/:** Vistas y archivos estáticos.

#### 🔑 **ENV**
>
>  **LIVE_PAYPAL_LINK:** Enlace a la API de PayPal en producción.
>
> **SANDBOX_PAYPAL_LINK:** Enlace a la API de PayPal en sandbox.
>
> **CLIENT_ID_PAYPAL:** ID del cliente de PayPal.
>
> **CLIENT_ID_PAYPAL_LIVE:** ID del cliente de PayPal en producción.
>
> **CLIENT_SECRET_KEY_PAYPAL:** Clave secreta del cliente de PayPal.
>
> **CLIENT_SECRET_KEY_PAYPAL_LIVE:** Clave secreta del cliente de PayPal en producción.
>
> **CLOUD_DB_URL:** URL de la base de datos en la nube.
>
> **LOCAL_DB_URL:** URL de la base de datos local.
>
> **NODE_ENV:** Entorno de la aplicación ('development' o 'production').
>
> **PORT_SERVER:** Puerto de escucha del servidor.
>
> **SECRET_TOKEN_JWT:** Clave secreta para la generación de tokens JWT.
>
> **SECRET_PASSWORD_EMAIL:** Clave secreta para la generación de contraseñas de email.
>
> **SECRET_EMAIL:** Email de la cuenta de email de la aplicación.

>> <span style="color: rgb(255, 0, 0);">**Notas:**</span>
> para que el proyecto funcione es necesario configurar las API KEY  Y SECRET KEY de PayPal , para saber mas de la API de PayPal puedes consultar la documentación oficial de PayPal.[PayPal Docs](https://developer.paypal.com/), y [PayPal Sandbox](https://www.sandbox.paypal.com/) para probar la API de PayPal.
>>
>> Ademas debe generar una clave secreta para el email, para que funcione el envio de email, para saber mas hacerca de esto puedes consultar la documentación oficial de Gmail.[¿Ques es una clave de aplicación en Gmail?](https://support.google.com/mail/answer/185833?hl=es-419#:~:text=Una%20contrase%C3%B1a%20de%20la%20aplicaci%C3%B3n,Verificaci%C3%B3n%20en%202%20pasos%20activada.), Usualmente la contraseña para la coneccion con cuentas de gmail es: [esta](https://myaccount.google.com/apppasswords?continue=https://myaccount.google.com/security?hl%3Den%26utm_source%3DOGB%26utm_medium%3Dact%26gar%3DWzBd&rapt=AEjHL4N0-g1FQx_6quW3VbsRTBblXUvaSBpKJQPts-ceH6xRqhIw19TYqnjbvP-nyksCfqhK0ejfUQA2A05AU2mGJojQAPFve1T-l_nqvTvkKu83sxmyhZQ)

## 🛠️ **Instalación**
 - <span style="color:rgb(0, 255, 234);">**Dependencias**</span> 
```bash
## Instalar las dependencias
npm install
```

```bash
## Actualizar las dependencias
npm update
```

```bash
## Iniciar el servidor de desarrollo
npm run start
```

```bash
## Iniciar el servidor de produccion
npm run build
```
- <span style="color:rgb(0, 255, 234);">**Base de Datos (PostgreSQL)**</span> 
 ```bash
## Tener instalado PostgreSQL y agregado al PATH del sistema.
```

```bash
## Iniciar PostrgesSQL
psql -U postgres
Password: (Tu contrseña de PostgreSQL)
```

```bash
## Crear la base de datos y las tablas necesarias
Luego de instroducir la contraseña de PostgreSQL, ejecutar el siguiente comando para crear la base de datos y las tablas necesarias:
 
Todo el esquema nesecario para el proyecto se encuentra en el archivo src/models/db.sql.
```

## 🚀 **Rutas (EndPoints)**
- <span style="color:rgb(0, 255, 234);">**Rutas de Autenticación**</span> 

> **/home | Post&Get:** Ruta de inicio de sesión, crear un usuario y iniciar sesión.
>
> **/singup | Post:** Ruta para registrar un nuevo usuario.
>
> **/singin | Post:** Ruta para iniciar sesión.
>
> **/logout | Post:** Ruta para cerrar la sesión del usuario.
>
> **/emailverify** | Post&Get:** Ruta para verificar el correo del usuario.
>

- <span style="color:rgb(0, 255, 234);">**Rutas de Administración**</span> 

> **/adminpanel | Get:** Mostrar el panel de administración.
>
> **/shop | Get:** Mostrar la tienda.
>
> **/config | Get:** Mostrar la configuración del usuario.
>
> **/user/config/update | Post:** Actualizar la configuración del usuario.
>
> **/shop/scan/:id | Post:** Escanear el producto y obtener su información.
>
> **/sales | Get:** Mostrar las ventas del usuario.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

