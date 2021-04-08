const validUrl = require("valid-url");
const { nanoid } = require("nanoid");
const { db } = require("../models");
const getUrlByCode = require("./getUrlByCode");

const shortenUrlResolvers = async ({ url }, req) => {
  let longUrl = url;
  // The API Base URL
  const baseUrl = req.headers.origin || "http://localhost:5000";

  // Validate API Base URL
  if (!validUrl.isUri(baseUrl)) throw new Error("Invalid base URL");

  // Validate Incoming URL
  if (!validUrl.isUri(longUrl)) throw new Error("Invalid URL");

  try {
    //  Check If URL is in database else create it
    const queryText = `SELECT * FROM urls WHERE original_url = $1`;

    // if valid, we create the url code
    const urlCode = nanoid(6);

    const { rows } = await db.query(queryText, [longUrl]);

    // if url exist, return the shortened url
    if (rows.length) {
      return {
        shortened_url: rows[0].shortened_url,
      };
    } else {
      // join the generated short code the the base url
      const shortUrl = `${baseUrl}/${urlCode}`;

      const query = `INSERT INTO urls(id, original_url, shortened_url, created_on) VALUES($1, $2, $3, $4) returning *`;
      const values = [urlCode, longUrl, shortUrl, new Date()];

      const { rows } = await db.query(query, values);

      if (rows.length < 0) {
        throw new Error("Error Shortening URL");
      }

      return {
        shortened_url: rows[0].shortened_url,
      };
    }
  } catch (err) {
    console.log(err);
    throw new Error("Internal Server Error");
  }
};

module.exports = shortenUrlResolvers;
