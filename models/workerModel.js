const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
//defining user schema 
const schema = new mongoose.Schema({
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
    location:{
        type:String
    },
    SSN:{
        type:String
    },
    dateOfBirthday:{
        type:String
    }
})
const Worker = mongoose.model('Worker', schema);
// validate Worker data 
function validateWorker(Worker) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        confirmPassword: Joi.string().min(8).max(255).required().valid(Worker.password),
        Gender: Joi.string().required(),
        phone:Joi.string().required(),
        location:Joi.string().required(),
        SSN:Joi.string().required(),
        pic:Joi.string().required(),
        dateOfBirthday:Joi.string().required()
    });
    return Joi.validate(Worker, schema);
}
exports.Worker = Worker;
exports.validate = validateWorker;
