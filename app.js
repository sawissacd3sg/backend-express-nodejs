const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const morgan = require("morgan")
const bodyParser = require('body-parser')
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes")
const todoRouter = require("./routes/todo.routes")

app.use(morgan("tiny"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", todoRouter);

module.exports = app;