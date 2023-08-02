const { QueryTypes } = require("sequelize");
const { User, sequelize } = require("../database/models");
const { hashPassword } = require("../util/crypto.util");

exports.getUserFromToken = async (token) => {
  return await sequelize.query(
    `SELECT users.id, users."userName" FROM users WHERE users.id = (
          SELECT tokens."userId" FROM tokens WHERE tokens.token = :token
        )`,
    {
      replacements: {
        token,
      },
      type: QueryTypes.SELECT,
    }
  );
};

exports.getUser = async (id) => {
  return await User.findOne({
    attributes: ["id", "userName", "email"],
    where: {
      id,
    },
  });
};

exports.getUserByEmail = async (email) => {
  return await User.findOne({
    attributes: ["id", "userName", "email", 'password'],
    where: {
      email,
    },
  });
};

exports.getAllUser = async () => {
  return await User.findAll({ attributes: ["id", "userName", "email"] });
};

exports.createUser = async (userName, email, password, transaction) => {
  return await User.findOrCreate({
    where: {
      email,
    },
    defaults: {
      userName,
      email,
      password: await hashPassword(password),
    },
    transaction,
  });
};

exports.deleteUser = async (id) => {};
