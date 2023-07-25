const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

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

const getClientToken = () => {
  return 
}

module.exports = {
  generateAccessToken,
  verifyAccessToken
};

