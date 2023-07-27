const { Todo, sequelize } = require("../database/models");
const { getTodos } = require("../services/todo");
const { getUserFromToken } = require("../services/user");
const { createSuccessResponse, createFailResponse } = require("../util/response.util");
const { parseToken } = require("../util/token.util");

exports.showTodo = async (req, res) => {
  const minify = req.body.minify;
  const todoUsers = await getTodos(minify);
  return createSuccessResponse(res, "Todo lists showed", todoUsers);
};

exports.create = async (req, res) => {
  const list = req.body.list;
  if (!list) createFailResponse(res, "Invalid list : Props Empty!")
  const [user] = await getUserFromToken(parseToken(req.headers.authorization));

  try {
    await sequelize.transaction(async (transaction) => {
      const todoListCreated = await Todo.create(
        {
          list: list.create,
          userId: user.id,
          status: false,
        },
        {
          transaction,
        }
      );

      if (!todoListCreated) {
        return res.status(500).json({
          status: "fail",
          message: "Error: Can't create todo list",
        });
      }

      return createSuccessResponse(res, "Todo list created!", {
        userName: user.userName,
        todoList: {
          list: todoListCreated.list,
        },
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Error: Todo create unsuccessful!",
    });
  }
};

exports.update = async (req, res) => {
  const list = req.body.list;
  const [user] = await getUserFromToken(parseToken(req.headers.authorization));

  if (!list) {
    return res.status(500).json({
      status: "fail",
      message: "Invalid list : Empty!",
    });
  }

  sequelize.transaction(async (transaction) => {
    const listToUpdate = {};

    if (list.rewrite) listToUpdate.list = list.rewrite;
    if (list.check || !list.check) listToUpdate.status = list.check;

    const todoListUpdated = await Todo.update(listToUpdate, {
      where: {
        userId: user.id,
        id: list.id,
      },
      transaction,
    });

    if (!todoListUpdated) {
      return res.json({
        status: "success",
        message: "Fail to updated!",
      });
    }

    return createSuccessResponse(res, "Todo list updated!");
  });
};
