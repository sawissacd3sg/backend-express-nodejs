const multer = require("multer");
const { Image } = require("../database/models");
const { generate } = require("short-uuid");
const { createResponse } = require("../util/response.util");
const { getSchema } = require("../util/schema.util");
const { Validator } = require("jsonschema");
const { getUserFromToken } = require("../services/user");
const { parseToken } = require("../util/token.util");
const validator = new Validator();

//* Defining custom file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "storages/images");
  },
  filename: function (req, file, cb) {
    const parsedFileName = req.body.fileName.split(" ").join("-").toLowerCase();
    //* pattern uuidv4 - {file name with no space} - country . file extension.
    const genFileName = `${generate()}-${parsedFileName}-mm.png`;
    cb(null, genFileName);
  },
});

function fileFilter(req, file, cb) {
  const result = validator.validate(
    req.body,
    getSchema("image.upload"),
    "/upload"
  );

  if (result && !result.valid) {
    cb("body fileName required.", false);
    return;
  }

  if (file.mimetype !== "image/png") {
    cb("png file only supported.", false);
    return;
  }

  cb(null, true);
}

const upload = multer({ storage, fileFilter }).single("image");

module.exports.verifyImage = async (req, res, next) => {
  await upload(req, res, function (log) {
    if (log instanceof multer.MulterError) {
      res.status(500).json(createResponse("fail", log));
      return 
    }
    if (log) {
      res.status(400).json(createResponse("fail", log));
      return 
    }
  next();
  });
};

module.exports.uploadImage = async (req, res) => {
  const result = validator.validate(
    req.body,
    getSchema("image.upload"),
    "/upload"
  );

  if ((result && !result.valid) || !req.file)
    return res.json(createResponse("fail", "body [fileName, image] required."));

  const [user] = await getUserFromToken(parseToken(req.headers.authorization));

  const imageCreated = await Image.create({
    userId: user.id,
    imagePath: req.file.filename.split(".")[0],
  });

  return res.json(
    createResponse("success", "image uploaded & created.", {
      userId: user.id,
      image: imageCreated.imagePath,
    })
  );
};
