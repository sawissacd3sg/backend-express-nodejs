const { Token, sequelize } = require("../database/models");
const { QueryTypes } = require("sequelize");

exports.create = async (req, res) => {
  const BearerToken = req.headers.authorization;
  let token = BearerToken.split(" ");
  token = token[1];

  const subQuery = ``

  const user = await sequelize.query(`SELECT tokens.id, tokens.token, tokens."userId" FROM tokens`, {
    type: QueryTypes.SELECT,
  });

  return res.json({
    status: "success",
    result: user,
  });
};
