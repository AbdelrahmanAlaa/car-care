const {
  CarSharingInfo,
  validateCarSharingInfo,
} = require("../models/carSharingModelInfo");
const { User } = require("../models/userModel");
const asyncError = require("../middleware/asyncMiddleware");
const upload = require("../middleware/cloudinary");
const _ = require("lodash");

exports.creatCarSharingInfo = asyncError(async (req, res) => {
  // const fileName = `carSharing-${req.user._id}-${Date.now()}`;
  req.body.user = req.user._id;
  const { error } = validateCarSharingInfo(req.body);
  if (error)
    return res.status(404).json({
      status: "failed",
      message: error.details[0].message,
    });
  // upload photo and send to cloudinary to take url
  if (req.files.licensePhoto) {
    req.body.licensePhoto = [];
    await Promise.all(
      req.files.licensePhoto.map(async (img) => {
        const result = await upload.uploads(img.path);
        req.body.licensePhoto.push(result);
      })
    );
  }
  if (req.files.licenseCarPhoto) {
    req.body.licenseCarPhoto = [];
    await Promise.all(
      req.files.licenseCarPhoto.map(async (img) => {
        const result = await upload.uploads(img.path);
        req.body.licenseCarPhoto.push(result);
      })
    );
  }
  const carSharingInfo = await CarSharingInfo.create(req.body);
  res.send(carSharingInfo);
});

exports.getCarSharingInfo = asyncError(async (req, res) => {
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 20;
  // const skip = (page - 1) * limit;

  const carSharingInfo = await CarSharingInfo.find().sort({ date: -1 });
  res.send(carSharingInfo);
});
// check if user register before or not

//   const user = await User.findById(req.user._id);

//   const validate = await CarWash.findOne({ userId: user });
//   if (validate)
//     return res.status(400).json({
//       status: "failed",
//       message:
//         "You are already registered ..! if you want to update your information you can go to your profile !! ",
//     });
// if (!req.body.email) req.body.email = user.email;

//   let carWash = new CarWash({
//
//   });
//   res.status(200).json({
//     status: "success",
//     message: "Request was a success",
//     carWash,
//   });
//   await carWash.save();
// });

// exports.getUserInfo = asyncError(async (req, res) => {
//   const user = await User.findById(req.user._id);
//   res.json({
//     status: "success",
//     message: "Request was a success",
//     message: _.pick(user, ["name", "email", "phone"]),
//   });
// });111111111111111

// exports.getCarInfo = asyncError(async (req, res) => {
//   const carWash = await CarWash.findOne({ userId: req.user._id });
//   res.json({
//     status: "success",
//     message: "Request was a success",
//     carWash: _.pick(carWash, ["carMake", "color", "carModel", "location"]),
//   });
// });

// exports.updateCarWash = asyncError(async (req, res) => {
//   const { error } = validateUpdateCarWash(req.body);
//   if (error)
//     return res.status(404).json({
//       status: "failed",
//       message: error.details[0].message,
//     });
//   const carWash = await CarWash.findOneAndUpdate(
//     { userId: req.user._id },
//     req.body,
//     { new: true }
//   );

//   res.json({
//     status: "success",
//     message: "Request was a success",
//     carWash,
//   });
// });
