const {
  CarSharingPost,
  validateCarSharingPost,
} = require("../models/carSharingModelPost");
const asyncError = require("../middleware/asyncMiddleware");
const { CarSharingInfo } = require("../models/carSharingModelInfo");
// const { User } = require("../models/userModel");
// const upload = require("../middleware/cloudinary");
const _ = require("lodash");

exports.checkUserIfRegister = asyncError(async (req, res) => {
  const user = await CarSharingInfo.find({ user: req.user._id });
  if (user < 1)
    res
      .status(200)

      .json({ status: "failed", message: "you can creat Post now  " });
  else
    res.status(200).json({
      status: "success",
      message: "this user is register his information before ",
    });
});

exports.creatCarSharingPost = asyncError(async (req, res) => {
  // const fileName = `carSharing-${req.user._id}-${Date.now()}`;
  const carSharingInfo = await CarSharingInfo.find({
    user: req.user._id,
  }).select("_id");
  // console.log(carSharingInfo);
  req.body.carSharingInfo = carSharingInfo;
  req.body.user = req.user._id;
  const { error } = validateCarSharingPost(req.body);
  if (error)
    return res.status(404).json({
      status: "failed",
      message: error.details[0].message,
    });
  // check user if have two trips in the same day
  const checkUser = await CarSharingPost.find({
    $exist: true,
    user: req.user._id,
    date: req.body.date,
  });
  // console.log(checkUser);
  if (checkUser.length > 2)
    return res.status(400).json({
      status: "failed",
      message: "you just have two trips in the same day ..",
    });
  const carSharingPost = await CarSharingPost.create(req.body);
  res.send(carSharingPost);
});

exports.getCarSharingPost = asyncError(async (req, res) => {
  const carSharingPost = await CarSharingPost.find().sort({ date: -1 });
  res.send(carSharingPost);
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
