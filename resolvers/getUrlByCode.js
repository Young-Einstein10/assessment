const { db } = require("../models");

const getUrlByCode = async (code) => {
  try {
    if (!code || code.length < 6) {
      throw new Error("Incomplete URL");
    }

    const queryText = `SELECT * FROM urls WHERE id = $1`;

    const { rows } = await db.query(queryText, [code]);

    if (rows.length) {
      return {
        shortened_url: longUrl,
      };
    } else {
      throw new Error("No URL Found");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
};

module.exports = getUrlByCode;
