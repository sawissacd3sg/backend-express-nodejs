"use strict";

const { User, sequelize } = require("../database/models");
const { hashPassword } = require("../util/crypto.util");

exports.showUserById = async (req, res) => {
  const id = req.params.id;

  const users = await User.findOne({
    attributes: ["id", "userName", "email"],
    where: {
      id,
    },
  });

  if (!users) {
    return res.status(500).json({
      status: "fail",
      data: "User doesn't exists!",
    });
  }

  return res.json({
    status: "success",
    data: users,
  });
};

exports.showUser = async (_, res) => {
  const users = await User.findAll({ attributes: ["id", "userName", "email"] });
  return res.json({
    status: "success",
    data: users,
  });
};

exports.createUser = async (req, res) => {
  const userReq = req.body.user;

  if (!userReq.userName) {
    return res.status(500).json({
      status: "fail",
      message: "Invalid UserName : Empty!",
    });
  }
  if (!userReq.email) {
    return res.status(500).json({
      status: "fail",
      message: "Invalid Email : Empty!",
    });
  }

  if (!userReq.password) {
    return res.status(500).json({
      status: "fail",
      message: "Invalid Password : Empty!",
    });
  }

  try {
    await sequelize.transaction(async (transaction) => {
      const [_, created] = await User.findOrCreate({
        where: {
          email: userReq.email,
        },
        defaults: {
          ...userReq,
          password: await hashPassword(userReq.password),
        },
        transaction,
      });

      if (!created) {
        return res.status(500).json({
          status: "fail",
          message: "Invalid Email : Already Exists!",
        });
      }

      return res.json({
        status: "success",
        message: `${userReq.email} created!`,
      });
      
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Error: User create unsuccessful!",
    });
  }
};

exports.destroy = async (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(500).json({
      status: "fail",
      message: "Invalid ID: Not a number!",
    });
  }

  try {
    const success = await User.destroy({
      where: {
        id,
      },
    });

    if (!success) {
      return res.json({
        status: "fail",
        message: `User ID: ${id} already deleted or not exists!`,
      });
    }

    return res.json({
      status: "success",
      message: `User ID: ${id} deleted!`,
    });

  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Error: User delete unsuccess!",
    });
  }
};
