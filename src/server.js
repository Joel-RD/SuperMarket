import app from "../src/index.js"
import { config } from "dotenv";
import { globalEnvConfig } from "./config.js";

config()
const {PORT_SERVER} = globalEnvConfig;

app.listen(PORT_SERVER, () =>
  console.log(`Server running on port http://localhost:${PORT_SERVER}/register`)

);
