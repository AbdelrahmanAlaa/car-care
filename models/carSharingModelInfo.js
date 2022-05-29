const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const schema = new mongoose.Schema(
  {
    user: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
    },
    gender: { type: String },
    age: { type: Number },
    checked: { type: Boolean, default: "0" },
    licensePhoto: [Array],
    licenseCarPhoto: [Array],
  },
  { timestamps: true }
);

schema.index({ date: 1 });

const CarSharingInfo = mongoose.model("carSharingInfo", schema);

exports.validateCarSharingInfo = (req) => {
  const schema = Joi.object({
    user: Joi.required(),
    gender: Joi.string().required(),
    age: Joi.number().required(),
    licensePhoto: Joi,
    licenseCarPhoto: Joi.array().min(2).max(2),
  });
  return Joi.validate(req, schema);
};

// exports.validateUpdateCarSharingInfo = (req) => {
//   const schema = Joi.object({
//     email: Joi.string().email(),
//     location: Joi,
//     carMake: Joi.string().min(3).max(30),
//     carModel: Joi.string().min(4).max(30),
//     color: Joi.string().min(2).max(30),
//     streetAddress: Joi.string().min(3).max(100),
//     city: Joi.string().min(3).max(100),
//     country: Joi.string().min(3).max(100),
//     price: Joi.number(),
//     title: Joi.string(),
//     option: Joi.array(),
//   });
//   return Joi.validate(req, schema);
// };

exports.CarSharingInfo = CarSharingInfo;
