const Pool = require("pg").Pool;
const dotenv = require("dotenv");

dotenv.config();

const DB_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const DB_DETAILS =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.NODE_ENV === "testing"
    ? process.env.TEST_DB_URL
    : DB_URL;

const pool = new Pool({
  connectionString: DB_DETAILS,
});

pool.on("connect", () => {
  console.log("connected to the Database");
});

const createUrlTable = async () => {
  try {
    const queryText = `
		CREATE TABLE IF NOT EXISTS urls
		(
		  id VARCHAR(6) NOT NULL,
		  original_url text NOT NULL,
		  shortened_url VARCHAR(255) NOT NULL,
		  created_on timestamp NOT NULL,
      
      CONSTRAINT urls_pkey PRIMARY KEY (id)
		)`;

    await pool.query(queryText);

    console.log("URL Tables Created");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { db: pool, createUrlTable };
