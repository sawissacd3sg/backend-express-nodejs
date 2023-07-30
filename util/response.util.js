exports.createResponse = (status, message, data) => {
  if (data) return { status, message, data };
  return { status, message };
};