const { verifyAccessToken, parseToken } = require("../util/token.util");

module.exports.verifyToken = async (req, res, next) => {
  if (
    !req.headers.authorization &&
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(500).json({
      status: "fail",
      message: "Unauthorized",
    });
  }
  try {
    await verifyAccessToken(parseToken(req.headers.authorization));
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Unauthorized",
    });
  }

  return next();
};
