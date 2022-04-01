const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const schema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    worker:{
        type:mongoose.Schema.ObjectId,
        ref:'worker'
    },
    review:{
        type:String
    },
    rating:{
        type:Number
    }
});

schema.statics.calcAverageRatings = async function(worker){
    console.log(worker)
}


const Review = mongoose.model('Review',schema);

exports.validateReview =(req)=>{
    const schema = Joi.object({
    review:Joi.string().min(2).max(50).required(),
    rating:Joi.string().min(1).max(5).required(),
    worker:Joi.string().required()
    })
    return Joi.validate(req, schema);
} 


exports.Review = Review ;