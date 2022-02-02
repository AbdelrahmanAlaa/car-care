const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const crypto = require('crypto');
const validator=require('validator')
//defining user schema 
const schema = new mongoose.Schema({
   
    name: {
        type: String,
    },
    phone:{
        type:Number
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    confirmPassword: {
        type: String

    },
    Gender: {
        type: String,
    },
    passwordRestToken:String,
    passwordRestExpires:Date
})
const User = mongoose.model('User', schema);

// schema.index({name:1})
// validate user data 
exports.validateUser = (user)=>{
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        confirmPassword: Joi.string().min(8).max(255).required().valid(user.password),
        Gender: Joi.string().required(),
        phone:Joi.string().required()
    });
    return Joi.validate(user, schema);
}
// rest password ... 
//course of jonas in folder 10 vidio 12
function creatRoundomPassword (){
    const restToken = crypto.randomBytes(32).toString('hex');
    this.passwordRestToken  =crypto
    .createHash('sha256')
    .update(restToken)
    .digest('hex');
    console.log({restToken} , this.passwordRestToken)
    this.passwordRestExpires =Date.now() +10 * 60 * 1000;
}

exports.validateLogin = (req)=> {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

exports.roundomPassword = creatRoundomPassword;
exports.User = User;
exports.schemaUser = schema;