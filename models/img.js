const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    
    photo : String

})


const photo = mongoose.model('photo', schema);

exports.photo = photo;