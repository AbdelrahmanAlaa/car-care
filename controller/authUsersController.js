const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser,validateLogin } = require('../models/userModel');
const asyncError=require('../midelwere/asyncMidelwere');
const jwt =require('jsonwebtoken');
const config =require('config')
const {Worker}=require('../models/workerModel');

// we get all user for check : 
exports.getAllUser = async(req,res,next)=>{
    const user = await User.find();
    res.json({
        status:200,
        msg:"success",
        user
    });
}
// creat user 

exports.creatUser = asyncError(async (req, res,next) => {
    // First Validate The Request
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({
        message :"fail",
        error :error.details[0].message});
    
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({
           message:"fail",
            error :'That user already exisits!'});
    
        user = new User(req.body);
        user.confirmPassword=undefined ;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const token = jwt.sign({_id : user._id} , config.get('jwtPrivatKey')); 

        res.status(200).json({
            message:"success",
            user:_.pick(user, ['_id', 'name', 'email']),
            token
        });
        await user.save();
});


// we login user and take email and passwords to check 
exports.loginUser =asyncError( async (req, res) => {
    // First Validate The HTTP Request
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({
        message:"faild",
        error:error.details[0].message})

    //  check email and paswword is exact
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({
        message:"faild",
        error:'Incorrect email or password.'
    });
        //compare password with coming in req and database : 
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)return res.status(400).json({
        message:"faild",
        error:'Incorrect email or password.'});
        
        res.send({
            message:"success",
            user:_.pick(user, ['_id', 'name', 'email'])         
        });
});

//filter : get location by within and get all location with your distance :
exports.getLocation=asyncError(async(req,res,next)=>{1
    const {distance,latlng,unit}=req.params;
    const [lat,lng] = latlng.split(',');
    const radies = unit==='mi' ? distance/3963.2 : distance/6378.1;

    const worker =await Worker.find({
      'location.coordinates':{$geoWithin: { $centerSphere: [ [ lat, lng ],radies ]}}
    });

    res.status(200).json({
        "msg":"success",
        "result":worker.length,
        data:worker
    });

 if(!lat || !lng){
        res.status(400).json({"msg":"you can provide your lat and lng.."});   
    
}
});
//filter :  get all location near for you without distance :
exports.getDistance=asyncError(async(req,res)=>{
    const {latlng,unit}=req.params;
    const [lat ,lng]=latlng.split(',');
    
    if(!lat || !lng){
        res.status(400).json({"msg":"error you must provied your lat and lng .."});
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
    
    res.json({
        'msg':'success',
        data:distance
    });
    
})