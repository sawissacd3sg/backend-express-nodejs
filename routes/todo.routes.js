const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const TodoController = require("../controllers/todo.controller")

const router = express.Router();

router.post("/todo",verifyToken, TodoController.create);

module.exports = router;
