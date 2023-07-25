const { generateAccessToken } = require("../util/token.util");
const { comparePassword } = require("../util/crypto.util");
const { User, Token, sequelize } = require("../database/models");

exports.login = async (req, res) => {
  const user = req.body.user;

  if (!user.email) {
    return res.status(500).json({
      status: "fail",
      message: "Invalid Email : Empty!",
    });
  }

  if (!user.password) {
    return res.status(500).json({
      status: "fail",
      message: "Invalid Password : Empty!",
    });
  }

  const { id, email, password } = await User.findOne({
    attributes: ["id", "email", "password"],
    where: {
      email: user.email,
    },
  });

  if (!password) {
    return res.status(500).json({
      status: "fail",
      message: "Invalid user account & password",
    });
  }

  const passwordPass = await comparePassword(user.password, password);
  const createdToken = await generateAccessToken(email);

  try {
    if (passwordPass) {
      await sequelize.transaction(async (transaction) => {
        const tokenCreated = await Token.create(
          {
            userId: id,
            token: createdToken,
          },
          {
            transaction,
          }
        );

        if (!tokenCreated) {
          return res.status(500).json({
            status: "fail",
            message: "Error: Can't create token",
          });
        }

        return res.json({
          status: "success",
          verifyToken: createdToken,
        });
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Invalid user account & password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};
