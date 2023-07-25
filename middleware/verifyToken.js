module.exports.verifyToken = (req, res, next) => {
  if (
    !req.headers.authorization &&
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(500).json({
        status: "fail",
        message: "Unauthorized"
    })
  }
  return next();
};
