"use strict";

const { sequelize } = require("../database/models");
const {
  getUser,
  getAllUser,
  createUser,
  deleteUser,
} = require("../services/user");
const { createResponse } = require("../util/response.util");
const { getSchema } = require("../util/schema.util");
const { Validator } = require("jsonschema");

const validator = new Validator();

exports.showUserById = async (req, res) => {
  //* check id params
  const id = req.params.id;
  if (!id || id === ":id")
    return res.status(400).json(createResponse("fail", "params :id required."));

  //* get user form users table
  const users = await getUser(id);
  if (!users)
    return res.status(400).json(createResponse("fail", "user doesn't exist."));
  return res.json(createResponse("success", `user id ${id} found.`, users));
};

exports.showUser = async (_, res) => {
  //* get all user from users table
  const users = await getAllUser();
  return res.json(
    createResponse("success", `${users.length} records found.`, users)
  );
};

exports.createUser = async (req, res) => {
  //* valid user body request
  const result = validator.validate(
    req.body,
    getSchema("user.create"),
    "/create"
  );
  if (result && !result.valid)
    return res
      .status(400)
      .json(createResponse("fail", "body userName, email, password required."));
  const { userName, email, password } = result.instance;

  //* insert user to users table
  try {
    await sequelize.transaction(async (transaction) => {
      const [_, created] = await createUser(
        userName,
        email,
        password,
        transaction
      );
      if (!created)
        return res
          .status(400)
          .json(createResponse("fail", "email already exist."));
      return res.json(
        createResponse("success", `${result.instance.email} created!`)
      );
    });
  } catch (error) {
    return res
      .status(400)
      .json(createResponse("fail", "user create unsuccessful!"));
  }
};

exports.destroy = async (req, res) => {
  //* check id params
  const id = req.params.id;
  if (!id || id === ":id")
    return res.status(400).json(createResponse("fail", "params :id required."));

  //* delete user by id
  try {
    const success = await deleteUser(id);
    if (!success) {
      return res
        .status(400)
        .json(
          createResponse("fail", `id ${id} already deleted or not exists!`)
        );
    }
    return res.json(createResponse("success", `id ${id} deleted.`));
  } catch (error) {
    return res
      .status(500)
      .json(createResponse("fail", "user delete unsuccessful."));
  }
};
