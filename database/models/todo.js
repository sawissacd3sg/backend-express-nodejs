'use strict';

module.exports = (sequelize, DataTypes) => {
  const todo = sequelize.define(
    "Todo",
    {
        list: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        status: DataTypes.BOOLEAN
    },
    {
      tableName: "todos",
    }
  );
  return todo;
};