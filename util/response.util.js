exports.createResponse = (status, message, data) => {
  if (data) return { status, message, data };
  return { status, message };
};

exports.createSuccessResponse = (res, message, data) => {
  return res.json(createResponse("Success", message, data));
};

exports.createFailResponse = (res, message, data) => {
    return res.status(500).json(createResponse("Fail", message, data));
  };