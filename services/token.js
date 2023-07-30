const { Token } = require("../database/models");

exports.createToken = async (userId, token, transaction) => {
  return await Token.create(
    {
      userId,
      token,
    },
    {
      transaction,
    }
  );
};
