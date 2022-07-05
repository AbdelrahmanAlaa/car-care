const { required } = require('@hapi/joi');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    
   photo:{
       type:String
   },
   url:{
       type:String,
       required:true 
   }

})


const photo = mongoose.model('photo', schema);

exports.Image = photo;