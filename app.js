const express = require("express");
const dotenv = require("dotenv");
const path = require("path")
dotenv.config();

const app = express();
const morgan = require("morgan")
const bodyParser = require('body-parser')
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes")
const todoRouter = require("./routes/todo.routes")
const imageRouter = require("./routes/image.route")

app.use(morgan("tiny"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

//* GET http://localhost:3000/api/images/your image file
app.use('/api/images', express.static(path.join(__dirname, "storages/images")))

app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", todoRouter);
app.use("/api", imageRouter);

module.exports = app;