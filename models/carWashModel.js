const mongoose = require('mongoose');
const Joi = require('@hapi/joi')
const schema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    location:{
        type:{
            type:String,
            default:"point",
            enum:["point"]
          },
          coordinates:[Number]
        },
        carMake:{
            type:String
        },
        carModel:{
            type:Number
        },
        color:{
            type:String
        }
     
});
schema.index({location:"2dsphere"});
schema.index({name:1})

const CarWash = mongoose.model('carWash' ,schema);


exports.validateCarWash = (req)=>{
    const schema = Joi.object({
    location:Joi.required(),
    carMake:Joi.string().min(3).max(30).required(),
    carModel:Joi.string().min(4).max(30).required(),
    color:Joi.string().min(2).max(30).required()
    });
    return Joi.validate(req, schema);
};

exports.validateUpdateCarWash = (req)=>{
    const schema = Joi.object({
    location:Joi,
    carMake:Joi.string().min(3).max(30),
    carModel:Joi.string().min(4).max(30),
    color:Joi.string().min(2).max(30)
    });
    return Joi.validate(req, schema);
};

exports.CarWash=CarWash;