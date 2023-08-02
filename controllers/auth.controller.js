const { generateAccessToken } = require("../util/token.util");
const { comparePassword } = require("../util/crypto.util");
const { sequelize } = require("../database/models");
const { Validator } = require("jsonschema");
const { getSchema } = require("../util/schema.util");
const { createResponse } = require("../util/response.util");
const { getUserByEmail } = require("../services/user");
const { createToken } = require("../services/token");

const validator = new Validator();

exports.login = async (req, res) => {
  //* valid body request
  const result = validator.validate(req.body, getSchema("auth.auth"), "/auth");

  if (result && !result.valid)
    return res
      .status(400)
      .json(
        createResponse("fail", "body email:string, password:string required.")
      );

  const { id, email, password } = await getUserByEmail(result.instance.email);
  
  const passwordPass = await comparePassword(
    result.instance.password,
    password
  );

  const createdToken = await generateAccessToken(email);

  try {
    if (!passwordPass)
      return res
        .status(400)
        .json(createResponse("fail", "invalid user account & password."));

    await sequelize.transaction(async (transaction) => {
      const tokenCreated = await createToken(id, createdToken, transaction);

      if (!tokenCreated)
        return res
          .status(400)
          .json(createResponse("fail", "fail to create token."));

      return res.json(
        createResponse("success", "token created.", {
          verifyToken: createdToken,
        })
      );
    });
  } catch (error) {
    return res.status(400).json(createResponse("fail", error));
  }
};
