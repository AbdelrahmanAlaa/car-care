const {
  CarSharingPost,
  validateCarSharingPost,
} = require("../models/carSharingModelPost");
const {BookingCarSharing} = require('../models/BookingCarSharingModel')
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

      .json({ status: "failed", message: "you can create Post now  " });
  else
    res.status(200).json({
      status: "success",
      message: "this user is register his information before ",
    });
});

exports.createCarSharingPost = asyncError(async (req, res) => {
  // const fileName = `carSharing-${req.user._id}-${Date.now()}`;
  const carSharingInfo = await CarSharingInfo.find({
    user: req.user._id,
  }).select("_id");
  console.log(carSharingInfo)
  if (carSharingInfo < 1)return res
  .status(200) 
  .json({ status: "failed", message: "you should create your information first !! " });
  
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
  res.status(200).json({
    status:"success",
    carSharingPost
  })
});

exports.getAllCarSharingPost = asyncError(async (req, res) => {
  const carSharingPost = await CarSharingPost.find().sort({ date: -1 });
  res.send(carSharingPost);
});

exports.getCarSharingPost = asyncError(async (req, res) => {
  const carSharingPost = await CarSharingPost.find({user:req.user._id}).sort({ date: -1 });
  if(!carSharingPost)return res.status(404).json({
    status:"failed",
    message:"InValid Id"
  })
  res.send(carSharingPost);
});

exports.getCarSharingPostById = asyncError(async (req, res) => {
  const carSharingPost = await CarSharingPost.findById(req.params.id).sort({ date: -1 });
  if(!carSharingPost)return res.status(404).json({
    status:"failed",
    message:"InValid Id"
  })
  res.send(carSharingPost);
});

exports.getBooking = asyncError(async(req,res)=>{

  const post = await CarSharingPost.find({user:req.user._id}).select("_id")
  const booking = await BookingCarSharing.find({carSharingPostId:post})
  if(!post || !booking)return res.status(404).json({
    status:"failed",
    message:"InValid id "
  })
  res.status(200).json({
    status:"success",
    booking
  })
})

// exports.acceptBooking = asyncError(async(req,res)=>{
//   console.log(req.params.postBooking)
// const booking = await BookingCarSharing.findById(req.params.postBooking).populate("carSharingPostId")

// if(booking.carSharingPostId.number >= many  ){
// return result = booking.carSharingPostId.number - many
// console.log(result)
// } 
// else{
//   return res.status(400).json({
//     status:"failed",
//     message:`this user just need ${booking.carSharingPostId.number}  ` 
//   })
// }

// })

 