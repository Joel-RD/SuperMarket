import pg from "pg";
const { Pool } = pg;

const {
  NODE_ENV,
  CLOUD_DB_URL,
  Local_DB_URL,
} = process.env;

const DBConnection = async () => {
  try {
    if (NODE_ENV === "production") {
      return new Pool({ connectionString: CLOUD_DB_URL });
    } else {
      return new Pool({ connectionString: Local_DB_URL });
    }
  } catch (error) {
    console.error("DB connection error:", error);
    throw error;
  }
};

const pool = await DBConnection();

export const executeQuery = async (query, params) => {
  try {
    const results = await pool.query(query, params); // Esperar la consulta
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
