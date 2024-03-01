const express = require("express");

const { healthController, mockController } = require("../../controllers");

const router = express.Router();

router.get("/health", healthController.health);
router.get("/mock/notebook", mockController.data);

module.exports = router;
