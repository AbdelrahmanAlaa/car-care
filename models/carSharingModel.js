const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const schema = new mongoose.Schema(
  {
    to: { to: { type: String }, city: { type: String } },
    from: { from: { type: String }, city: { type: String } },
    date: { type: Date },
    time: { type: Date },
    number: { type: Number },
    price: { type: Number },
  },
  { timestamps: true }
);

schema.index({ name: 1 });

const CarSharing = mongoose.model("carShaing", schema);

exports.validateCarSharing = (req) => {
  const schema = Joi.object({
    from: Joi.required(),
    to: Joi.required(),
    date: Joi.number().required(),
    time: Joi.string().required(),
    number: Joi.number().required(),
    price: Joi.number().required(),
  });
  return Joi.validate(req, schema);
};

exports.validateUpdateCarSharing = (req) => {
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
    title: Joi.string().required(),
    option: Joi.array().required(),
  });
  return Joi.validate(req, schema);
};

exports.CarSharing = CarSharing;
