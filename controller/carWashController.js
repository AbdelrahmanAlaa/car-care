const { CarWash, validateCarWash } = require("../models/carWashModel");
const asyncError = require("../middleware/asyncMiddleware");
const { User } = require("../models/userModel");
const _ = require("lodash");

exports.creatCarWash = asyncError(async (req, res) => {
  const { error } = validateCarWash(req.body);
  if (error)
    return res.status(404).json({
      status: "failed",
      message: error.details[0].message,
    });

  // check if user register before or not

  const user = await User.findById(req.user._id).select("_id");
  req.body.userId = user;

  //   const validate = await CarWash.findOne({ userId: user });
  //   if (validate)
  //     return res.status(400).json({
  //       status: "failed",
  //       message:
  //         "You are already registered ..! if you want to update your information you can go to your profile !! ",
  //     });
  if (!req.body.email) req.body.email = user.email;

  let carWash = new CarWash(req.body);
  res.status(200).json({
    status: "success",
    message: "created was a success",
    carWash,
  });
  await carWash.save();
});

exports.getUserInfo = asyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    status: "success",
    message: "Request was a success",
    message: _.pick(user, ["name", "email", "phone"]),
  });
});

exports.getCarInfo = asyncError(async (req, res) => {
  const carWash = await CarWash.findOne({ userId: req.user._id });
  res.json({
    status: "success",
    message: "Request was a success",
    carWash: _.pick(carWash, ["carMake", "color", "carModel", "location"]),
  });
});

exports.deleteCarWash = asyncError(async (req, res) => {
  const carWash = await CarWash.findOneAndDelete({ userId: req.user._id });

  res.json({
    status: "success",
    message: "deleted was a success",
    carWash,
  });
});

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
//     message: "updated was a success",
//     carWash,
//   });
// });
