const {
  CarWash,
  validateCarWash,
  validateUpdateCarWash,
} = require("../models/carWashModel");
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

  const user = await User.findById(req.user._id);

  //   const validate = await CarWash.findOne({ userId: user });
  //   if (validate)
  //     return res.status(400).json({
  //       status: "failed",
  //       message:
  //         "You are already registered ..! if you want to update your information you can go to your profile !! ",
  //     });
  if (!req.body.email) req.body.email = user.email;

  let carWash = new CarWash({
    userId: user._id,
    location: req.body.location,
    carMake: req.body.carMake,
    carModel: req.body.carModel,
    color: req.body.color,
    streetAddress: req.body.streetAddress,
    city: req.body.city,
    country: req.body.country,
    price: req.body.price,
    title: req.body.title,
    option: req.body.option,
  });
  res.status(200).json({
    status: "success",
    message: "Request was a success",
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

exports.updateCarWash = asyncError(async (req, res) => {
  const { error } = validateUpdateCarWash(req.body);
  if (error)
    return res.status(404).json({
      status: "failed",
      message: error.details[0].message,
    });
  const carWash = await CarWash.findOneAndUpdate(
    { userId: req.user._id },
    req.body,
    { new: true }
  );

  res.json({
    status: "success",
    message: "Request was a success",
    carWash,
  });
});
