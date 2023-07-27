const path = require("path");

exports.getSchema = (fileProps) => {
  const filePath = fileProps.split(".");
  return require(path.join(__dirname, "../jsonSchema", filePath[0] + ".json"))[
    filePath[1]
  ];
};
