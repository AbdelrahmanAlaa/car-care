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
        phone:Joi.string().required()
    });
    return Joi.validate(user, schema);
}
// rest password ... 
//course of jonas in folder 10 video 12



exports.creatRandomPassword = function(){
    const restToken = crypto.randomBytes(32).toString('hex');
    
    passwordRestToken = crypto
    .createHash('sha256')
    .update(restToken)
    .digest('hex');

    passwordRestExpires=Date.now() +10 * 60 *1000
    // console.log({restToken},this.passwordRestToken);
    return restToken;
}


exports.validateLogin = (req)=> {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

exports.validateRestPassword = (user)=> {
    const schema = {
         password: Joi.string().min(5).max(255).required() , 
         confirmPassword:Joi.string().min(8).max(255).required().equal(user.password)
        };

    return Joi.validate(user, schema);
}

exports.validateUpdate = (user)=> {
    const schema = {
        name: Joi.string().min(5).max(50),
        email: Joi.string().min(5).max(255).email(),
        phone:Joi.string()
        };

    return Joi.validate(user, schema);
}



exports.User = User;
exports.schemaUser = schema;