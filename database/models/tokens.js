"use strict";

module.exports = (sequelize, DataTypes) => {
  const tokens = sequelize.define(
    "Token",
    {
      userId: DataTypes.INTEGER,
      token: DataTypes.TEXT,
    },
    {
      tableName: "tokens",
    }
  );
  return tokens;
};
