const express = require("express");
const UserController = require("../controllers/user.controller");

const router = express.Router();

router.get("/:id/user", UserController.showUserById);
router.get("/user", UserController.showUser);
router.post("/user", UserController.createUser);
router.delete("/:id/user", UserController.destroy);

module.exports = router;
