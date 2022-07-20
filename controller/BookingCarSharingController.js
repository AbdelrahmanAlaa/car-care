const { BookingCarSharing, validateBookingCarSharing } = require("../models/BookingCarSharingModel");
const asyncError = require("../middleware/asyncMiddleware");
const { CarSharingPost } = require("../models/carSharingModelPost");
const _ = require("lodash");


exports.CreateBooking = asyncError(async (req, res) => {
  req.body.userId = req.user._id;
  req.body.carSharingPostId = req.params.carSharingPostId
  
  // if( !mongoose.Types.ObjectId.isValid(req.params.carSharingPosId) ) return 
  // res.status(400).json({status:"failed",message:"inValid id "});
  
  const { error } = validateBookingCarSharing(req.body);
  if (error)
    return res.status(404).json({
      status: "failed",
      message: error.details[0].message,
    });

const checkPostId = await CarSharingPost.findById(req.body.carSharingPostId)
console.log(checkPostId)
if(checkPostId.user == req.body.userId)return res.status(404).json({
  status:'failed',
  message:"you can't booking for you post "
})
if(!checkPostId)return res.status(404).send("no id like this ")

const checkBooking = await BookingCarSharing.find({
  userId:req.body.userId, 
  carSharingPostId:req.body.carSharingPostId
})

if(checkBooking.length >= 1)return res.status(400).json({
  status:"failed",
  message:"You have already registered! We will communicate with you as soon as possible"
})
// const checkBooking= await Booking.findOne({carSharingPostId:checkPostId})

const Booking = new BookingCarSharing(req.body)

await Booking.save();
res.status(200).json({
  status:"success",
  message:"We will communicate with you as soon as possible",
Booking
})
});


exports.getBooking = asyncError(async(req,res)=>{

  const booking = await BookingCarSharing.find({userId:req.user._id})
  .populate({path:"userId",select:"phone"}) 
  .populate({path:"carSharingPostId",select:"fromCity toCity"});
  
  if(!booking)return res.status(404).json({
    status:"failed",
    message:"you not have booking yet !!"
  })

  res.status(200).json({
    status:"success",
    booking 
})
})

exports.getAllBooking = asyncError(async(req,res)=>{
  const booking = await BookingCarSharing.find();
 
  res.status(200).json({
    status:"success",
    booking
  })
})

exports.deleteBooking = asyncError(async(req,res)=>{
 
  const booking = await BookingCarSharing.findOneAndRemove({_id:req.params.id})
  if(!booking) return res.status(400).json({
    status:"failed",
    message:"No Booking for you in this Post "
  })
  res.status(200).json({
    status:"success",
    message:"successfully deleted .."
  })
   

})

// exports.updateBooking=asyncError(async(req,res)=>{
//   const booking = await BookingCarSharing.findOneAndUpdate({carSharingPostId:req.params.carSharingPost},(req.body),{new:true})
// res.send(booking)  

// })
