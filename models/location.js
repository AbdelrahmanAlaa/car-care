const mongoose=require('mongoose');
const Joi =require('@hapi/joi');
const {schemaUser}=require('./userModel');

const schema = new mongoose.Schema({
  location:{

      type:{
          type:String,
          default:"point",
          enum:["point"]
        },

        cordinates:[Number],
        address:String,
        descrebition:String
    
  },
  userId:{
      type:schemaUser
  }

});

schema.index({location:"2dsphere"});

const Location = mongoose.model('location',schema);

exports.validateLocation = (location)=>{
    const schema = Joi.object({
      location:Joi.required()
    });
    return Joi.validate(location, schema);
}

exports.Location = Location
exports.schemaLocation =schema;