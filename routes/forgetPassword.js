// const mongoose = require('mongoose');
// const  express = require('express');
// const router = express.Router();
// const {User,roundomPassword} = require('../models/userModel');
// const Joi = require('@hapi/joi');
// const nodemailer = require('nodemailer');
// const {sendEmail} = require('../midelwere/email')



// router.post('/',async(req,res,next)=>{
//     const {error}=validate(req.body);
//     if(error)return res.status(400).json({
//         Msg:"faild",
//         error:error.details[0].message
//     });
//  const user = await User.findOne({email :req.body.email});
//  if(!user)return res.status(404).json({
//      msg :"faild",
//      error:"this email is not found .. "
//  });


//  const rest = roundomPassword();
//  await user.save();

//  await sendEmail({
//      email:user.email,
// 
    //  subject:"your message is sent "
//  })
//  res.status(200).json({
//      status:"succes",
//      message:"sent jwt"
//  })
 
// 
// });



// const schema = mongoose.model('newPassword',({
//     newPassword:{
//         type:String,
//         require:true,
//         minlength:8,
//         maxlength:100
//     }
// }));
// function validate(password){
//     const schema = {
//         email:Joi.string().required()
//     }
// return Joi.validate(password,schema)
// }


// module.exports=router