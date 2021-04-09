const validUrl = require("valid-url");
const { nanoid } = require("nanoid");
const { db } = require("../models");
const { getFullUrl } = require("../utils");

const shortenUrlResolvers = async ({ url }, req) => {
  let originalUrl = url;
  // The API Base URL
  const baseUrl = getFullUrl(req);

  // Validate API Base URL
  if (!validUrl.isUri(baseUrl)) throw new Error("Invalid Base URL");

  // Validate Incoming URL\
  if (!validUrl.isUri(originalUrl)) throw new Error("Invalid URL");

  try {
    //  Check If URL is in database else create it
    const queryText = `SELECT * FROM urls WHERE original_url = $1`;

    // if valid, we create the url code
    const urlCode = nanoid(6);

    const { rows } = await db.query(queryText, [originalUrl]);

    // if url exist, return the shortened url
    if (rows.length) {
      return {
        shortened_url: rows[0].shortened_url,
      };
    } else {
      // join the generated short code to the base url
      const shortUrl = `${baseUrl}/${urlCode}`;

      const query = `INSERT INTO urls(id, original_url, shortened_url, created_on) VALUES($1, $2, $3, $4) returning *`;

      const values = [urlCode, originalUrl, shortUrl, new Date()];

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
