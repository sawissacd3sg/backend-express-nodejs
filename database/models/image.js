"use strict";
module.exports = (sequelize, DataTypes) => {
  const image = sequelize.define(
    "Image",
    {
      userId: DataTypes.INTEGER,
      imagePath: DataTypes.STRING,
    },
    {
      tableName: "images",
    }
  );
  return image;
};
