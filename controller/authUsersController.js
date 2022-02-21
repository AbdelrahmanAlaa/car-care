const crypto =require('crypto');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validateUser,validateLogin,creatRandomPassword,validateRestPassword,validateUpdate} = require('../models/userModel');
const asyncError=require('../middleware/asyncMiddleware');
const sendEmail=require('../middleware/email');
const jwt =require('jsonwebtoken');
const config =require('config')
const {Worker}=require('../models/workerModel');
const {Photo} = require('../models/img')

exports.uploadImg = asyncError(async (req,res)=>{

    
console.log(req.file);
console.log(req.body);
    let img =new Photo({
        photo :req.body.photo
    }) 
    await img.save();
    res.send(img);


})
// exports.updateUser  =asyncError(async(req,res)=>{
//     if (req.body.password || req.body.passwordConfirm){
//         res.status(400).json({ 
//             status:'failed',
//             message:'this route is not for password update '
//         })}

//         const{error}=validateUpdate(req.body);
//         if (error) return res.status(400).send({
//             status :"failed",
//             error :error.details[0].message});

//             const updateUser = await User.findByIdAndUpdate(req.user.id) 
//             res.status(200).json({
//                 status:"success",
//                 user:updateUser
//             });


//     })


exports.getAllUser = asyncError(async(req,res,next)=>{
    const key = req.params.key;
    if(key != process.env.KEY)res.status(400).send({
        status:'failed',
        message:'you cant have access to open ...!!'
    });
  const user = await User.find();
    res.send({
        status:"success",
        user
    });
})
// creat user 

exports.creatUser = asyncError(async (req, res,next) => {
    // First Validate The Request
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send({
        status :"fail",
        error :error.details[0].message});
    
    // Check if this user already exist
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({
           status:"fail",
            message :'That user already exist!'});
    
        user = new User(req.body);
        user.confirmPassword=undefined ;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const token = jwt.sign({_id : user._id} , config.get('jwtPrivateKey')); 

        res.header('x-auth-token',token)
        .status(200).send({
            status:"success",
            user:_.pick(user, ['_id', 'name', 'email']),
            token
        });
        await user.save();
});


// we login user and take email and passwords to check 
exports.loginUser =asyncError( async (req, res, next) => {
    // First Validate The HTTP Request
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send({
        status:"failed",
        error:error.details[0].message})

    //  check email and password is exact
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({
        status:"failed",
        message:'Incorrect email or password.'
    });
        //compare password with coming in req and database : 
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)return res.status(400).send({
        status:"failed",
        message:'Incorrect email or password.'});

        const token = jwt.sign({_id : user._id} , config.get('jwtPrivateKey')); 
        
        // we here send token in header with name : x-auth-token 

        res.header('x-auth-token',token)
        .status(200).send({
            status:"success", 
            token,
            user:_.pick(user, ['_id', 'name', 'email'])         
        });
});

exports.forgetPassword =asyncError( async(req,res)=>{
    

    let user =await User.findOne({email:req.body.email});
    if(!user)res.status(404).send({
        status :'failed',
        message : 'this email is not found ..!'
 });
    const restToken =creatRandomPassword();
    user.passwordRestToken =passwordRestToken
    user.passwordRestExpires =passwordRestExpires 
    // res.send(passwordRestToken)
    await user.save();

    const restURL = `${req.protocol}://${req.get('host')}/api/v1/users/restPassword/${restToken}`;

    const status = `Forgot Your password ? Submit a PATCH request with  your new password and 
    passwordConfirm to :${restURL}. \n If you didn't forget your password , please ignore this email! `;
    
    try{
    await sendEmail({
        email:user.email,
        subject :'your password reset token (valid for 10 min)',
        status
    });
    res.status(200).send({
        status:'success',
        status:'token sent to email'
    })}

    catch(err){
        user.passwordRestToken =undefined;
        user.passwordRestExpires=undefined;

        return res.status(500).send('there was an error sending the email , try again later !!')
    }

})

exports.restPassword=async(req,res)=>{
    
    const {error}=validateRestPassword(req.body)
    if(error)return res.status(404).send({
        status:'failed',
        error:error.details[0].message
    })
    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
         passwordRestToken:hashedToken,
         passwordRestExpires:{$gt:Date.now()}
         });
         
            if(!user)return res.status(400).send('Token is invalid or expired ..')
            
         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(user.password, salt);
        
         user.confirmPassword=undefined;
        user.passwordRestToken =undefined;
        user.passwordExpires =undefined;

        await user.save();
        const token = jwt.sign({_id : user._id} , config.get('jwtPrivateKey')); 
    res.status(200).send({
        status:'success',
        token
    })

        }
//filter : get location by within and get all location with your distance :
exports.getLocation = asyncError(async(req,res,next)=>{
    const {distance,latlng,unit}=req.params;
    const [lat,lng] = latlng.split(',');
    const radies = unit==='mi' ? distance/3963.2 : distance/6378.1;

    const worker =await Worker.find({
      'location.coordinates':{$geoWithin: { $centerSphere: [ [ lat, lng ],radies ]}}
    });

    res.status(200).send({
        "status":"success",
        "result":worker.length,
        data:worker
    });

 if(!lat || !lng){
        res.status(400).send({"status":"you can provide your lat and lng.."});   
    
}
});
//filter :  get all location near for you without distance :
exports.getDistance=asyncError(async(req,res)=>{
    const {latlng,unit}=req.params; 
    const [lat ,lng]=latlng.split(',');
    
    if(!lat || !lng){
        res.status(400).send({"status":"error you must provied your lat and lng .."});
    }

    const distance = await Worker.aggregate([
        {
            $geoNear:{
                near:{
                    type:'point',
                    cordinates:[lng * 1,lat * 1]
                },
                distanceField: 'distance'
            } 
        }
    ]);
    
    res.status(200).send({
        'status':'success',
        data:distance
    });
    
})
