const { QueryTypes } = require("sequelize");
const { Todo, sequelize } = require("../database/models");

exports.getTodos = async (minify) => {
  const temp = [];
  const todoUser = await sequelize.query(
    `SELECT todos.id,todos."userId", users."userName", todos.list, todos.status FROM todos 
        LEFT JOIN users 
        ON todos."userId" = users.id 
    `,
    {
      type: QueryTypes.SELECT,
    }
  );

  const filterByUserId = (list) => {
    if (!temp.includes(list.userId)) {
      temp.push(list.userId);
      return true;
    }
    return false;
  };

  const onlyIdNameList = (list) => ({
    id: list.userId,
    userName: list.userName,
  });

  const onlyUserIdNameList = todoUser
    .filter(filterByUserId)
    .map(onlyIdNameList);

  const filterByUser = (userId) => (list) => list.userId === userId;

  const onlyIdListStatus = (list) => {
    if (minify) {
      return `${list.id} : ${list.list} : ${list.status}`;
    }
    return {
      id: list.id,
      list: list.list,
      status: list.status,
    };
  };

  const todoUsers = onlyUserIdNameList.map((userList) => ({
    ...userList,
    lists: todoUser
      .filter(filterByUser(userList.id))
      .sort((a, b) => a.id - b.id)
      .map(onlyIdListStatus),
  }));

  return todoUsers;
};

exports.createTodos = async (list, userId, status, transaction) => {
  return await Todo.create(
    {
      list,
      userId,
      status,
    },
    {
      transaction,
    }
  );
};

exports.updateTodos = async (updatedList, id, userId, transaction) => {
  return await Todo.update(updatedList, {
    where: {
      id,
      userId,
    },
    transaction,
  });
};
