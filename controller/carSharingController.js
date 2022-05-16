const { CarSharing, validateCarSharing } = require("../models/carSharingModel");
const asyncError = require("../middleware/asyncMiddleware");
const upload = require("../middleware/cloudinary");
const _ = require("lodash");

exports.creatCarSharing = asyncError(async (req, res) => {
  // const fileName = `carSharing-${req.user._id}-${Date.now()}`;

  if (req.files.licensePhoto) {
    req.body.licensePhoto = [];
    await Promise.all(
      req.files.licensePhoto.map(async (img) => {
        const result = await upload.uploads(img.path);
        // console.log(result);
        req.body.licensePhoto.push(result);
      })
    );
  }
  // console.log(req.body.licensePhoto);

  // console.log(result);
  const { error } = validateCarSharing(req.body);
  if (error)
    return res.status(404).json({
      status: "failed",
      message: error.details[0].message,
    });

  console.log(req.body.licensePhoto);
  const carSharing = await CarSharing.create(req.body);

  //   time:req.body.time,
  // date:req.body.date,
  // price:req.body.price,
  // description:req.body.description,
  // number:req.body.number,
  // licensePhoto:req.body.licensePhoto,
  // carPhoto:req.body.carPhoto,

  res.send(carSharing);
});

// check if user register before or not

//   const user = await User.findById(req.user._id);

//   //   const validate = await CarWash.findOne({ userId: user });
//   //   if (validate)
//   //     return res.status(400).json({
//   //       status: "failed",
//   //       message:
//   //         "You are already registered ..! if you want to update your information you can go to your profile !! ",
//   //     });
//   if (!req.body.email) req.body.email = user.email;

//   let carWash = new CarWash({
//     userId: user._id,
//     location: req.body.location,
//     carMake: req.body.carMake,
//     carModel: req.body.carModel,
//     color: req.body.color,
//     streetAddress: req.body.streetAddress,
//     city: req.body.city,
//     country: req.body.country,
//     price: req.body.price,
//     title: req.body.title,
//     option: req.body.option,
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
// });

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
