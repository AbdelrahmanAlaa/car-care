const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    gender: { type: String },
    age: { type: Number },
    checked: { type: Boolean, default: "0" },
    // licensePhoto: [Array],
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
    licenseCarPhoto: Joi,
  });
  return Joi.validate(req, schema);
};

exports.validateUpdateCarSharingInfo = (req) => {
  const schema = Joi.object({
    age: Joi.number(),
    licensePhoto: Joi,
    licenseCarPhoto: Joi.array().min(2).max(2),
  });
  return Joi.validate(req, schema);
};

exports.CarSharingInfo = CarSharingInfo;
