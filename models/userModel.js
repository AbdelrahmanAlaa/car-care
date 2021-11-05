const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
//defining user schema 
const schema = new mongoose.Schema({
    name: {
        type: String,
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
    }
})
const User = mongoose.model('User', schema);
// validate user data 
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        confirmPassword: Joi.string().min(8).max(255).required().valid(user.password),
        Gender: Joi.string().required()
    });
    return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser;
