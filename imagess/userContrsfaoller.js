const {
  User,
  validateRestPassword,
  validateUpdate,
} = require("../models/userModel");
const asyncError = require("../middleware/asyncMiddleware");
const bcrypt = require("bcryptjs");
const upload = require("../middleware/cloudinary");
const { uploader } = require("../middleware/multer");
const fs = require("fs");

exports.getAllUser = asyncError(async (req, res, next) => {
  const key = req.params.key;
  if (key != process.env.KEY)
    res.status(400).json({
      status: "failed",
      message: "you cant have access to open ...!!",
    });
  const user = await User.find();
  res.json({
    status: "success",
    message: "Request was a success",
    user,
  });
});

exports.getUser = asyncError(async (req, res, next) => {
  const key = req.params.key;
  if (key != process.env.KEY)
    res.status(400).json({
      status: "failed",
      message: "you cant have access to open ...!!",
    });
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({
      status: "failed",
      message: "invalid id number..",
    });

  res.json({
    status: "success",
    message: "Request was a success",
    user,
  });
});

exports.updatePassword = asyncError(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  const checkPassword = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!user || !checkPassword)
    return res.status(404).json({
      status: "failed",
      message: "incorrect password ... ",
    });

  const { error } = validateRestPassword({
    password: req.body.newPassword,
    confirmPassword: req.body.confirmPassword,
  });
  if (error)
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
    });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.newPassword, salt);

  await user.save();
  res.status(200).json({
    status: "success",
    message: "Request was a success",
    user,
  });
});

exports.updateMyPhoto = asyncError(async (req, res) => {
  // send unique name to picture by id
  console.log(req.file)
  const fileName = `user-${req.user._id}-${Date.now()}`;

  const result = await upload.uploads(req.file.path);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      photo: fileName,
      url: result.url,
    },
    { new: true }
  );
  // delete my photo local after upload to cloudinary
  fs.unlinkSync(req.file.path);

  res.status(200).json({
    status: "success",
    message: "Request was a success",
    user,
  });
});

exports.updateMe = asyncError(async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error)
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
    });

  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: "Request was a success",
    user,
  });
});

exports.deleteMe = asyncError(async (req, res) => {
  await User.findByIdAndRemove(req.user._id, { active: false });
  res.status(200).json({
    status: "success",
    message: "Request was a success",
    data: null,
  });
});
