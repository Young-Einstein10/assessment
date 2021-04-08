const express = require("express");
const { redirectController } = require("../controllers");

// create an express route handler
const router = express.Router();

router.get("/:code", redirectController);

module.exports = router;