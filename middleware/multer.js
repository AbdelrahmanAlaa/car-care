const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
exports.uploadSingleImage = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("photo");

exports.uploadMultiImage = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).fields([
  {
    name: "carPhoto",
    maxCount: "4",
  },
  {
    name: "licensePhoto",
    maxCount: "2",
  },
]);
