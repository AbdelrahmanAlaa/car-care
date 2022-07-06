const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
});

const fileFilter= (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    console.log("taher 5wal ")
    cb(null, false);
  }
};

const fileFilterMulter= (req, file, cb) => {
  if (files.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    console.log("taher 5wal ")
    cb(null, false);
  }
};

exports.uploadSingleImage = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("licensePhoto");

exports.uploadMultiImage = multer({
  storage: fileStorage,
  fileFilterMulter: fileFilterMulter,
}).fields([
  {
    name: "licenseCarPhoto",
    maxCount: "2",
  },
  {
    name: "licensePhoto",
    maxCount: "2",
  },
]);
