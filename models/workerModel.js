const crypto = require('crypto');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
//defining user schema 
const schema = new mongoose.Schema({
    location:{
    type:{
        type:String,    
        default:'point'
    },
    coordinates:{
        type:[Number]
    },
    address:String,
    description:String
   },
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
        type: String,
    },

    IDNumber:{
        type:Number
    },
    ratingAverage:{
        type:Number
    },
    ratingQuantity:{
        type:Number
    },
    specialized:{
        type:String,
        
        default:false
    },
    passwordRestToken:String,
    passwordRestExpires:Date
})



const Worker = mongoose.model('Worker', schema);

// validate Worker data 
exports.validateWorker =(Worker) =>{
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        confirmPassword: Joi.string().min(8).max(255).required().valid(Worker.password),
        phone:Joi.string().min(11).max(14).required(),
        IDNumber:Joi.string().min(16).max(16).required(),
        location:Joi.required(),
        specialized:Joi.string().min(3).max(50).required().valid('motor','electronic','anather')
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



exports.validateUpdate = (worker)=> {
    const schema = {
        name: Joi.string().min(5).max(50),
        phone:Joi.string()
        };

    return Joi.validate(worker, schema);
}
exports.Worker = Worker;