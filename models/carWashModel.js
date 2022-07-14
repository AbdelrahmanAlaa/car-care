const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const schema = new mongoose.Schema(
  {
    email: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    location: {
      // type: {
      //   type: String,
      //   default: "point"
      // },
      type: [Number],
    },
    streetAddress: { type: String },
    city: { type: String },
    country: { type: String },
    carModel: { type: Number },
    pricing: { type: Number },
    totalPrice: { type: Number },
    title: { type: String },
    option: [{ title: String, price: Number }],
  },
  { timestamps: true }
);

schema.index({ name: 1 });

const CarWash = mongoose.model("carWash", schema);

// exports.validateCarWash = (req) => {
//   const schema = Joi.object({
//     email: Joi,
//     location: Joi,
//     carModel: Joi.string().min(4).max(30).required(),
//     streetAddress: Joi.string().min(3).max(100),
//     city: Joi.string().min(3).max(100),
//     country: Joi.string().min(3).max(100),
//     totalPrice: Joi.number().required(),
//     pricing: Joi.number().required(),
//     title: Joi.string().required(),
//     option: Joi.array().required(),
//   });
//   return Joi.validate(req, schema);
// };

exports.validateUpdateCarWash = (req) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    location: Joi,
    carModel: Joi.string().min(4).max(30),
    color: Joi.string().min(2).max(30),
    streetAddress: Joi.string().min(3).max(100),
    city: Joi.string().min(3).max(100),
    country: Joi.string().min(3).max(100),
    totalPrice: Joi.number().required(),
    pricing: Joi.number().required(),
    title: Joi.string(),
    option: Joi.array(),
  });
  return Joi.validate(req, schema);
};

exports.CarWash = CarWash;
