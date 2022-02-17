const crypto = require('crypto');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
//defining user schema 
const schema = new mongoose.Schema({
   
   location:{
    type:{
     type:String
    },
        coordinates:[{
            type:Number
        }],
        address:String
    
    },
    name: {
        type: String,
    },
    phone:{
        type:String
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    
    confirmPassword: {
        type: String,
    },
    Gender: {
        type: String,
    },
    pic:{
        type:String
    },
    SSN:{
        type:String
    },
    dateOfBirthday:{
        type:String
    },
    passwordRestToken:String,
    passwordRestExpires:Date
})
schema.index({location:"2dsphere"});
schema.index({name:1})

const Worker = mongoose.model('Worker', schema);



// validate Worker data 
exports.validateWorker =(Worker) =>{
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        confirmPassword: Joi.string().min(8).max(255).required().valid(Worker.password),
        Gender: Joi.string().required(),
        phone:Joi.string().required(),
        SSN:Joi.string().required(),
        pic:Joi.string().required(),
        dateOfBirthday:Joi.string().required(),
        location:Joi.required()
    });
    return Joi.validate(Worker, schema);
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

exports.creatRandomPassword = function(){
    const restToken = crypto.randomBytes(32).toString('hex');

    passwordRestToken=crypto.createHash('sha256').update(restToken).digest('hex');
    passwordRestExpires=Date.now() +10 * 60 *1000

    console.log(restToken);
    return restToken ;
}

exports.Worker = Worker;