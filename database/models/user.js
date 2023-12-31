"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userName: DataTypes.STRING,
      email: {
        type: DataTypes.TEXT,
        validate: {
          isEmail: true,
        },
      },
      password: DataTypes.TEXT,
    },
    {
      tableName: "users",
    }
  );
  return User;
};
