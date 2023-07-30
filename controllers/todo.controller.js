const { Validator } = require("jsonschema");
const { sequelize } = require("../database/models");
const { getTodos, createTodos, updateTodos } = require("../services/todo");
const { getUserFromToken } = require("../services/user");
const { createResponse } = require("../util/response.util");
const { parseToken } = require("../util/token.util");
const { getSchema } = require("../util/schema.util");

const validator = new Validator();

exports.showTodo = async (req, res) => {
  //* minify [true, false] optional
  const minify = req.body.minify;
  const todoUsers = await getTodos(minify);
  return res.json(
    createResponse(
      "success",
      `${todoUsers.length} todo user records found.`,
      todoUsers
    )
  );
};

exports.create = async (req, res) => {
  //* valid todo body request
  const result = validator.validate(
    req.body,
    getSchema("todo.create"),
    "/create"
  );

  if (result && !result.valid)
    return res.status(400).json(createResponse("fail", "body todo required."));

  const [user] = await getUserFromToken(parseToken(req.headers.authorization));

  //* create todo list
  try {
    await sequelize.transaction(async (transaction) => {
      const todoListCreated = await createTodos(
        result.instance.todo,
        user.id,
        false,
        transaction
      );

      if (!todoListCreated)
        return res
          .status(400)
          .json(createResponse("fail", "can't create todo list."));

      return res.json(
        createResponse("success", "todo list created.", {
          userName: user.userName,
          todoList: {
            list: todoListCreated.list,
          },
        })
      );
    });
  } catch (error) {
    return res.status(400).json("fail", "todo create unsuccessful");
  }
};

exports.update = async (req, res) => {
  //* valid todo body request
  const result = validator.validate(
    req.body,
    getSchema("todo.update"),
    "/update"
  );
  if (result && !result.valid)
    return res
      .status(400)
      .json(
        createResponse(
          "fail",
          "body todo:string, status:boolean, id:number required."
        )
      );

  const [user] = await getUserFromToken(parseToken(req.headers.authorization));

  //* update todo list
  sequelize.transaction(async (transaction) => {
    const todoListUpdated = await updateTodos(
      {
        list: result.instance.todo,
        status: result.instance.status,
      },
      result.instance.id,
      user.id,
      transaction
    );

    if (!todoListUpdated)
      return res.json(createResponse("success", "fail to updated."));

    return res.json(createResponse("success", "todo list updated."));
  });
};
