const crypto =require('crypto');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validateUser,validateLogin,creatRandomPassword,validateRestPassword} = require('../models/userModel');
const asyncError=require('../middleware/asyncMiddleware');
const sendEmail=require('../middleware/email');
const jwt =require('jsonwebtoken');
const config =require('config')
const {Worker}=require('../models/workerModel');
const upload =require('../middleware/cloudinary'); 
const {Image}=require('../models/img');
const fs = require('fs');





exports.auth = async(req,res,next)=>{
    const token = req.header('x-auth-token');
    if(!token)return res.status(401).send('access denied . no token provided  ')
  
    try{ 
    const decoded = await jwt.verify(token , config.get('jwtPrivateKey'));
    req.user= decoded ;
    // console.log(decoded)
    next();
   }
   catch(ex){
       res.status(400).send('invalid token ');
   }
}



exports.uploadImg = asyncError(async (req,res)=>{

    const result = await upload.uploads(req.files[0].path);
    // console.log(result)
    const uploadImage = new Image ({
        image:req.files[0].originalname,
        url:result.url
    });
   const asw =  await uploadImage.save();
   
   // delete my photo local after upload to cloudinary 
   fs.unlinkSync(req.files[0].path);

res.json(asw);

})
// creat user 

exports.creatUser = asyncError(async (req, res,next) => {
    // First Validate The Request
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({
        status :"fail",
        message :error.details[0].message});
    
    // Check if this user already exist
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({
           status:"failed",
            message :'That user already regester!'});
     user = new User(req.body);
        user.confirmPassword=undefined ;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const token = jwt.sign({_id : user._id} , config.get('jwtPrivateKey')); 

        res.header('x-auth-token',token)
        .status(200).json({
            status:"success",
            message: "Request was a success",
            user:_.pick(user, ['_id', 'name', 'email']),
            token
        });
        await user.save();
});


// we login user and take email and passwords to check 
exports.loginUser =asyncError( async (req, res, next) => {
    // First Validate The HTTP Request
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({
        status:"failed",
        message:error.details[0].message})

    //  check email and password is exact
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({
        status:"failed",
        message:'Incorrect email.'
    });
        //compare password with coming in req and database : 
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)return res.status(400).json({
        status:"failed",
        message:'Incorrect password.'});

        const token = jwt.sign({_id : user._id} , config.get('jwtPrivateKey')); 
        
        // we here json token in header with name : x-auth-token 

        res.header('x-auth-token',token)
        .status(200).json({
            status:"success", 
            message: "Request was a success",
            token,
            user:_.pick(user, ['_id', 'name', 'email'])         
        });
});

exports.forgetPassword =asyncError( async(req,res)=>{
    let user =await User.findOne({email:req.body.email});
    if(!user)res.status(404).json({
        status :'failed',
        message : 'this email is not found ..!'
 });
    const restToken =creatRandomPassword();
    user.passwordRestToken =passwordRestToken
    user.passwordRestExpires =passwordRestExpires 
    // res.json(passwordRestToken)
    await user.save();

    const restURL = `${restToken}`;

    const status = `Forgot Your password ? Submit a PATCH request with  your new password and 
    passwordConfirm to : <br>  your code : ${restURL} .<>  If you didn't forget your password , \n please ignore this email! `;
    
    try{
    await sendEmail({
        email:user.email,
        subject :`your password reset if you didn't forget your password please ignore this email`,
        status
    });
    res.status(200).json({
        status:'success',
        message: "Request was a success",
        message:'token sent to email'
    })}

    catch(err){
        user.passwordRestToken =undefined;
        user.passwordRestExpires=undefined;

        return res.status(500).json('there was an error sending the email , try again later !!')
    }

})

exports.restPassword=asyncError(async(req,res)=>{
    
  const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
         passwordRestToken:hashedToken,
         passwordRestExpires:{$gt:Date.now()}
         });
         if(!user)return res.status(400).json('Token is invalid or expired ..')
      
    const {error}=validateRestPassword(req.body)
    if(error)return res.status(404).json({
        status:'failed',
        message:error.details[0].message
    })
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    
         user.confirmPassword=undefined;
        user.passwordRestToken =undefined;
        user.passwordExpires =undefined;

        await user.save();
        res.status(200).json({
        status:'success',
        message: "Request was a success",
        user
    })
        })

//filter : get location by within and get all location with your distance :
exports.getLocation = asyncError(async(req,res,next)=>{
    const {distance,latlng,unit}=req.params;
    const [lat,lng] = latlng.split(',');
    const radies = unit==='mi' ? distance/3963.2 : distance/6378.1;

    const worker =await Worker.find({
      'location.coordinates':{$geoWithin: { $centerSphere: [ [ lat, lng ],radies ]}}
    });

    res.status(200).json({
        "status":"success",
        message: "Request was a success",
        "result":worker.length,
        data:worker
    });

 if(!lat || !lng){
        res.status(400).json({"status":"you can provide your lat and lng.."});   
    
}
});
//filter :  get all location near for you without distance :
exports.getDistance=asyncError(async(req,res)=>{
    const {latlng,unit}=req.params; 
    const [lat ,lng]=latlng.split(',');
    
    if(!lat || !lng){
        res.status(400).json({"status":"error you must provied your lat and lng .."});
    }

    const distance = await Worker.aggregate([
        {
            $geoNear:{
                near:{
                    type:'point',
                    coordinates:[lng * 1,lat * 1]
                },
                distanceField: 'distance'
            } 
        }
    ]);
    
    res.status(200).json({
        'status':'success',
        message: "Request was a success",
        data:distance
    });
    
})