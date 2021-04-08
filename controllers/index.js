const validUrl = require("valid-url");
const { db } = require("../models");

const redirectController = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code || code.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Incomplete URL",
      });
    }

    const queryText = `SELECT * FROM urls WHERE id = $1`;

    const { rows } = await db.query(queryText, [code]);

    // if url exist, return the original url
    if (rows.length) {
      return res.redirect(rows[0].original_url);
    } else {
      // else return a not found 404 status
      return res.status(404).json("No URL Found");
    }
  } catch (err) {
    // exception handler
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
};

module.exports = { redirectController };
