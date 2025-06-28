import pg from "pg";
import { globalEnvConfig } from "../config.js";

const { Pool } = pg;

const { DB_CONECTION } = globalEnvConfig;

const DBConnection = async () => {
  try {
    return new Pool({ connectionString: DB_CONECTION });
  } catch (error) {
    console.error("DB connection error:", error);
    throw error;
  }
};

const pool = await DBConnection();

export const executeQuery = async (query, params) => {
  try {
    const results = await pool.query(query, params); 
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
