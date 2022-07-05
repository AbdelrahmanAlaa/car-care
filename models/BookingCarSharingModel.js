const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    carSharingPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carSharingPost",
    },
    many:{type:Number},
    
    checked:{
      type:Boolean,
      default:'false'
    },
    description:{
      type:String
    }

    
  },
  { timestamps: true }
);



const BookingCarSharing = mongoose.model("BookingCarSharing", schema);

exports.validateBookingCarSharing = (req) => {
  const schema = Joi.object({
    userId: Joi,
    carSharingPostId: Joi,
    many:Joi.number().min(1).max(4).required(),
    description:Joi.string().min(2).max(100)
  });
  
  return Joi.validate(req, schema);
};


// exports.UpdateBookingCarSharing = (req) => {
//   const schema = Joi.object({
//     carSharingPostId: Joi,
//     many:Joi.min(1).max(4)
//   });
//   return Joi.validate(req, schema);
// };


exports.BookingCarSharing = BookingCarSharing;
