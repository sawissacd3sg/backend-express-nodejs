const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const ImageController = require("../controllers/image.controller");
const router = express.Router();

router.post(
  "/image",
  verifyToken,
  ImageController.verifyImage,
  ImageController.uploadImage
);

module.exports = router;
