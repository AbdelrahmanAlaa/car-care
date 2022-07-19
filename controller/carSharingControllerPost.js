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

  const carSharingInfo = await CarSharingInfo.findOne({
    user: req.user._id,
  }).select("_id");

  // if (carSharingInfo < 1)return res
  // .status(200) 
  // .json({ status: "failed", message: "you should create your information first !! " });
  
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
  

  if(req.query.from||req.query.to){
    const from = req.query.from;
    const to = req.query.to;
  const carSharingPost = await CarSharingPost.find({
    $and:[
      {fromCity:from},
      {toCity:to}
    ]
  })

  if(!carSharingPost)return res.status(404).json({
    status:"failed",
    message:"no trips for this !!!"
  })
  res.status(200).json({
    status:"success",
    carSharingPost
  });
}

else {
  const carSharingPost = await CarSharingPost.find({date:{$gte:Date.now()}})
  .populate({path:'carSharingInfo',select:'checked -_id '})
  .sort({ createdAt:'-1'})
  
  if(!carSharingPost)return res.status(404).json({
    status:"failed",
    message:"inValid request"
  })
  res.status(200).json({
    status:"success",
    carSharingPost
  });
}
  
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


exports.deleteMyPost = asyncError(async(req,res)=>{
  const carSharingPost = await CarSharingPost.findOneAndDelete({_id:req.params.id});
  if(!carSharingPost)return res.status(404).json({
    status:"failed",
    message:"no id founded"
  });
  res.status(200).json({
    status:"success",
    message:"successfully deleted you post"

  })
})

exports.getBooking = asyncError(async(req,res)=>{
  
  const post = await CarSharingPost.find({user:req.user._id}).select("_id")
  const booking = await BookingCarSharing.find({carSharingPostId:post})
  .populate({path:"userId" , select:"name"})
  .populate({path:"carSharingPostId" , select:"fromCity toCity"});

  
  if(!post || !booking)return res.status(404).json({
    status:"failed",
    message:"InValid id "
  })
  res.status(200).json({
    status:"success",
    booking
  })
})

exports.acceptBooking = asyncError(async(req,res)=>{

 
  const booking = await BookingCarSharing.findById(req.params.postBooking).populate("carSharingPostId")

if(!booking)return res.status(404).json({
  status:"failed",
  message:"inValid id "
})

if(req.params.check == "false"){
   await BookingCarSharing.findOneAndRemove({_id:req.params.postBooking})
 res.status(200).json({
  message:"successfully deleted this booking "
 })
}

if(booking.carSharingPostId.number >= booking.many ){
const result = booking.carSharingPostId.number - booking.many

 await CarSharingPost.findOneAndUpdate({_id:booking.carSharingPostId},{number:result})
 await BookingCarSharing.findOneAndUpdate({_id:req.params.postBooking} , {checked:req.params.check})
 

res.status(200).json({
  status:"success",
  message:"You have been receiving your partner in the trip .."
})
  
} 

else{
  return res.status(400).json({
    status:"failed",
    message:`this user just need ${booking.carSharingPostId.number} ` 
  })
}



})

 