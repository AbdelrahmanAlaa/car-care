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
      type: {
        type: String,
        default: "point",
        enum: ["point"],
      },
      coordinates: [Number],
    },
    streetAddress: { type: String },
    city: { type: String },
    country: { type: String },
    carMake: { type: String },
    carModel: { type: Number },
    color: { type: String },
    price: { type: Number },
    title: { type: String },
    option: [{ title: String, price: Number }],
  },
  { timestamps: true }
);

schema.index({ name: 1 });

const CarWash = mongoose.model("carWash", schema);

exports.validateCarWash = (req) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    location: Joi,
    carMake: Joi.string().min(3).max(30).required(),
    carModel: Joi.string().min(4).max(30).required(),
    color: Joi.string().min(2).max(30).required(),
    streetAddress: Joi.string().min(3).max(100),
    city: Joi.string().min(3).max(100),
    country: Joi.string().min(3).max(100),
    price: Joi.number().required(),
    pricing: Joi.number().required(),
    title: Joi.string().required(),
    option: Joi.array().required(),
  });
  return Joi.validate(req, schema);
};

exports.validateUpdateCarWash = (req) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    location: Joi,
    carMake: Joi.string().min(3).max(30),
    carModel: Joi.string().min(4).max(30),
    color: Joi.string().min(2).max(30),
    streetAddress: Joi.string().min(3).max(100),
    city: Joi.string().min(3).max(100),
    country: Joi.string().min(3).max(100),
    price: Joi.number().required(),
    pricing: Joi.number().required(),
    title: Joi.string(),
    option: Joi.array(),
  });
  return Joi.validate(req, schema);
};

exports.CarWash = CarWash;
