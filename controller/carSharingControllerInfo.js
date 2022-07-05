const {
  CarSharingInfo,
  validateCarSharingInfo,
  validateUpdateCarSharingInfo
} = require("../models/carSharingModelInfo");
const { User } = require("../models/userModel");
const asyncError = require("../middleware/asyncMiddleware");
const upload = require("../middleware/cloudinary");
const _ = require("lodash");

exports.createCarSharingInfo = asyncError(async (req, res) => {
  // const fileName = `carSharing-${req.user._id}-${Date.now()}`;
  
  req.body.user = req.user._id;
  const checkUser = await CarSharingInfo.findOne({user: req.body.user}) ;
  if(checkUser) return res.status(400).json({
    status:"failed",
    message:"you already registered before !! you can go to your page to update or remove  "
  })
  
    const { error } = validateCarSharingInfo(req.body);
  if (error)
    return res.status(404).json({
      status: "failed",
      message: error.details[0].message,
    });
  // upload photo and send to cloudinary to take url
  if (req.files.licensePhoto) {
    req.body.licensePhoto = [];
    await Promise.all(
      req.files.licensePhoto.map(async (img) => {
        const result = await upload.uploads(img.path);
        req.body.licensePhoto.push(result);
      })
    );
  }
  if (req.files.licenseCarPhoto) {
    req.body.licenseCarPhoto = [];
    await Promise.all(
      req.files.licenseCarPhoto.map(async (img) => {
        const result = await upload.uploads(img.path);
        req.body.licenseCarPhoto.push(result);
      })
    );
  }
  if(!req.files.licenseCarPhoto || !req.files.licensePhoto) {
    return res.status(404).json({
      status:"failed",
      message:"you should send your information correct"
    })
  }
  const carSharingInfo = await CarSharingInfo.create(req.body);
res.status(200).json({
  status:"success",
  carSharingInfo
})
});

exports.getCarSharingInfo = asyncError(async (req, res) => {
  const carSharingInfo = await CarSharingInfo.find().sort({ date: -1 });
  res.status(200).json({
    status:"success",
    carSharingInfo
  });
});
 
exports.getCarSharingInfoById = asyncError(async (req, res) => {
  const carSharingInfo = await CarSharingInfo.findOne({user:req.params.id}).sort({ date: -1 });
  if(!carSharingInfo)return res.status(400).json({
    status:"failed",
    message:"no id founded .. "
  })
  res.status(200).json({
    status:"success",
    carSharingInfo
  });
});

exports.deleteCareSharingInfo = asyncError(async(req,res)=>{
  console.log(req.user._id)
  const carSharing = await CarSharingInfo.findOneAndRemove({user:req.user._id} )
  if(!carSharing)return res.status(404).json({
    status:"failed",
    message:"no id founded"
  })
  res.status(200).json({
    status:"success",
    message:"successfully deleted"
  })

})


