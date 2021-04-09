const url = require("url");

const getFullUrl = (req) => {
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
  });
};

module.exports = { getFullUrl };
