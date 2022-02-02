const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Worker, validateLogin , validateWorker } = require('./../models/workerModel');
const asyncMiddelwere=require('./../midelwere/asyncMidelwere')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };
  
exports.getWorker = async(req,res)=>{
    const worker = await Worker.find()
    res.send({
        msg:"succes" ,
        worker
    })
}

// add a new Worker
exports.creatWorker = asyncMiddelwere(async (req, res) => {
    // First Validate The Request
    const { error } = validateWorker(req.body);
    if (error) return res.status(400).json({
        msg :"fail",
        error :error.details[0].message});
    
    // Check if this Worker already exisits
    let worker = await Worker.findOne({ email: req.body.email });
    if (worker) return res.status(400).json({
            msg:"fail",
            error :'That email already exisits!'});
    
        worker = new Worker({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword,
            Gender:req.body.Gender,
            phone:req.body.phone,
            location:req.body.location,
            pic:req.body.pic,
            dateOfBirthday:req.body.dateOfBirthday,
            location:req.body.location
        });
        worker.confirmPassword=undefined ;
        const salt = await bcrypt.genSalt(10);
        worker.password = await bcrypt.hash(worker.password, salt);
        // Worker.confirmPassword = await bcrypt.hash(Worker.confirmPassword, salt);
        // Donesn't show all data only id,name,email
        const token = jwt.sign({_id : worker._id} , config.get('jwtPrivatKey')); 
        res.json({
            msg:"success",
            token:token,
            Worker:_.pick(worker, ['_id', 'name', 'email'])
        });
        await worker.save();
});


exports.loginWorker =  async (req, res) => {
    // First Validate The HTTP Request
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({
        mssage:"faild",
        error:error.details[0].message})

    //  Now find the worker by their email address
    let worker = await Worker.findOne({ email: req.body.email });
    if (!worker) return res.status(400).json({
        message:"faild",
        error:'Incorrect email or password.'});

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, worker.password);
    if (!validPassword)return res.status(400).json({
        message:"faild",
        error:'Incorrect email or password.'});
       const token = signToken(worker._id)
    res.josn({
        msg:"success",
        token
    });
};

