const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const schema = new mongoose.Schema(
  {
    carSharingInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carSharingInfo",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    from: { from: { type: String }, city: { type: String } },
    to: { to: { type: String }, city: { type: String } },
    date: { type: Date },
    number: { type: Number },
    price: { type: Number },
    description: { type: String },
  },
  { timestamps: true }
);

schema.index({ date: 1 });

const CarSharingPost = mongoose.model("carSharingPost", schema);

exports.validateCarSharingPost = (req) => {
  const schema = Joi.object({
    // from: Joi.required(),
    // to: Joi.required(),
    carSharingInfo: Joi.required(),
    user: Joi.required(),
    date: Joi.date().greater("now").required(),
    number: Joi.number().min(1).max(4).required(),
    price: Joi.number().required(),
    description: Joi.string().min(2).max(500).required(),
  });
  return Joi.validate(req, schema);
};

exports.validateUpdateCarSharingPost = (req) => {
  const schema = Joi.object({
    // from: Joi,
    // to: Joi,

    date: Joi.date().greater("now"),
    number: Joi.number().min(1).max(4),
    price: Joi.number(),
    description: Joi.string().min(2).max(500),
  });
  return Joi.validate(req, schema);
};

exports.CarSharingPost = CarSharingPost;
