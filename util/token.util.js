const jwt = require("jsonwebtoken");

const generateAccessToken = async (username) => {
  return await jwt.sign(
    {
      data: username,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: 60 * 60 }
  );
};

const verifyAccessToken = async (token) => {
  return await jwt.verify(token, process.env.TOKEN_SECRET);
};

const parseToken = (authorizationHeader) => {
  const BearerToken = authorizationHeader;
  let token = BearerToken.split(" ");
  token = token[1];
  return token;
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  parseToken,
};
