const {
  Worker,
  validateRestPassword,
  validateUpdate,
} = require("../models/workerModel");
const asyncError = require("../middleware/asyncMiddleware");
const bcrypt = require("bcryptjs");
const upload = require("../middleware/cloudinary");
const fs = require("fs");

exports.getAllWorker = asyncError(async (req, res, next) => {
  const key = req.params.key;
  if (key != process.env.KEY)
    res.status(400).json({
      status: "failed",
      message: "you cant have access to open ...!!",
    });
  const worker = await Worker.find();
  res.json({
    status: "success",
    message: "Request was a success",
    worker,
  });
});

exports.getWorker = asyncError(async (req, res, next) => {
  const key = req.params.key;
  if (key != process.env.KEY)
    res.status(400).json({
      status: "failed",
      message: "you cant have access to open ...!!",
    });
  const worker = await Worker.findById(req.params.id);
  if (!worker)
    return res.status(404).json({
      status: "failed",
      message: "invalid id number..",
    });

  res.json({
    status: "success",
    message: "Request was a success",
    worker,
  });
});

exports.updatePassword = asyncError(async (req, res) => {
  const worker = await Worker.findById(req.worker._id).select("+password");
  const checkPassword = await bcrypt.compare(
    req.body.currentPassword,
    worker.password
  );
  if (!worker || !checkPassword)
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
  worker.password = await bcrypt.hash(req.body.newPassword, salt);

  await worker.save();
  res.status(200).json({
    status: "success",
    message: "successfully updated",
    worker,
  });
});

exports.updateMyPhoto = asyncError(async (req, res) => {
  const result = await upload.uploads(req.files[0].path);

  const worker = await Worker.findByIdAndUpdate(
    req.worker._id,
    {
      photo: req.files[0].originalname,
      url: result.url,
    },
    { new: true }
  );

  // delete my photo local after upload to cloudinary
  fs.unlinkSync(req.files[0].path);

  res.status(200).json({
    status: "success",
    message: "successfully updated ",
    worker,
  });
});

exports.updateMe = asyncError(async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error)
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
    });

  const worker = await Worker.findByIdAndUpdate(req.worker._id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: "successfully updated",
    worker,
  });
});

exports.deleteMe = asyncError(async (req, res) => {
  await Worker.findByIdAndRemove(req.worker._id, { active: false });
  res.status(200).json({
    status: "success",
    message: "successfully deleted",
    data: null,
  });
});

exports.getSpecialized = asyncError(async (req, res) => {
  const worker = await Worker.find({
    specialized: req.params.specialized,
  }).select(" url name phone ratingQuantity ratingAverage email  -_id");

  res.status(200).json({
    status: "success",
    length: worker.length,
    worker,
  });
});
