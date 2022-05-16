const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const schema = new mongoose.Schema(
  {
    from: { from: { type: String }, city: { type: String } },
    to: { to: { type: String }, city: { type: String } },
    date: { type: Date },
    time: { type: Number },
    number: { type: Number },
    price: { type: Number },
    description: { type: String },
    checked: { type: Boolean },
    licensePhoto: [Array],
    // carPhoto: [{type:String}],
  },
  { timestamps: true }
);

schema.index({ name: 1 });

const CarSharing = mongoose.model("carSharing", schema);

exports.validateCarSharing = (req) => {
  const schema = Joi.object({
    // from: Joi.required(),
    // to: Joi.required(),
    date: Joi.date().greater("now").required(),
    time: Joi.number().required(),
    number: Joi.number().min(1).max(4).required(),
    price: Joi.number().required(),
    description: Joi.string().min(2).max(500).required(),
    licensePhoto: Joi,
    carPhoto: Joi,
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
