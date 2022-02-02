const {Location,validateLocation} = require('../models/location');
const {User}=require('../models/userModel');
exports.creatLocation = async(req,res)=>{

    // get user emmbedd relashion
    const user = await User.findById(req.params.id)
    const{error} = validateLocation(req.body);
    if (error) return res.status(400).json({
        message :"fail",
        error :error.details[0].message});

    let location = new Location({
        location:req.body.location,
        userId:{
            name:user.name,
            phone:user.phone
        }
    });
    location.save();
    
    res.json({
        msg:"success",
        location
    })

}

exports.get=async(req, res)=>{
    const location = await Location.find();
        // location:{$near:{$geometry:{cordinates:[23.119411, 32.315344]}}}
    
    res.json({
        location
    })
}
