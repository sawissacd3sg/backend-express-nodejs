const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const TodoController = require("../controllers/todo.controller");

const router = express.Router();

router.get("/todo", verifyToken, TodoController.showTodo);
router.post("/todo", verifyToken, TodoController.create);
router.put("/todo", verifyToken, TodoController.update);

module.exports = router;
