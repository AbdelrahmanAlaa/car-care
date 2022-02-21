const crypto = require('crypto');
const sendEmail = require('../middleware/email');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { Worker, validateLogin , validateWorker,creatRandomPassword,validateRestPassword } = require('./../models/workerModel');
const asyncError=require('./../middleware/asyncMiddleware')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };
  
exports.getWorker = async(req,res)=>{
    const worker = await Worker.find()
    res.send({
        msg:"success" ,
        worker
    })
}

// add a new Worker
exports.creatWorker = asyncError(async (req, res) => {
    // First Validate The Request
    const { error } = validateWorker(req.body);
    if (error) return res.status(400).json({
        msg :"fail",
        error :error.details[0].message});
    
    // Check if this Worker already exist
    let worker = await Worker.findOne({ email: req.body.email });
    if (worker) return res.status(400).json({
            msg:"fail",
            error :'That email already exist..!'});
    
        worker = new Worker({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword,
            phone:req.body.phone,
            IDNumber:req.body.IDNumber, 
            location:req.body.location,
            
        });
        
        worker.confirmPassword=undefined ;
        const salt = await bcrypt.genSalt(10);
        worker.password = await bcrypt.hash(worker.password, salt);
        // Worker.confirmPassword = await bcrypt.hash(Worker.confirmPassword, salt);
        // Doesn't show all data only id,name,email
        const token = jwt.sign({_id : worker._id} , config.get('jwtPrivateKey'));

        res.send({
            msg:"success",
            token,
            Worker:_.pick(worker, ['_id', 'name', 'email'])
        });
        await worker.save();
});


exports.loginWorker = asyncError( async (req, res) => {
    // First Validate The Request of the body 
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({
        massage:"failed",
        error:error.details[0].message})

    //  Now find the worker by their email address
    let worker = await Worker.findOne({ email: req.body.email });
    if (!worker) return res.status(400).json({
        message:"failed",
        error:'Incorrect email or password.'});

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, worker.password);
    if (!validPassword)return res.status(400).json({
        message:"failed",
        error:'Incorrect email or password.'});
        const token = jwt.sign({_id:worker._id},config.get('jwtPrivateKey'));
        
        res.send({
        msg:"success",
        token,
        Worker:_.pick(worker,['_id','name','email',''])
    });
});

exports.forgetPassword =asyncError(async(req,res)=>{

    let worker =await Worker.findOne({email:req.body.email});
    if(!worker)return res.status(404).json({    
     status :'failed',
     error : 'this email is not found ..!'
}) ;

const restToken = creatRandomPassword();
worker.passwordRestToken=passwordRestToken;
worker.passwordRestExpires=passwordRestExpires;
 
//  res.send(passwordRestExpires);
await worker.save();

const restURL = `${req.protocol}://${req.get('host')}/api/v1/users/restPassword/${restToken}`;

const message = `Forgot Your password ? Submit a PATCH request with  your new password and 
passwordConfirm to :${restURL}. \n If you didn't forget your password , please ignore this email! `;

try{
await sendEmail({
    email:worker.email,
    subject :'your password reset token (valid for 10 min)',
    message
});
res.status(200).send({
    status:'success',
    message:'token sent to email'
})}

catch(err){
    worker.passwordRestToken =undefined;
    worker.passwordRestExpires=undefined;

    return res.status(500).send('there was an error sending the email , try again later !!')
}


})

exports.restPassword = asyncError(async(req,res)=>{

    const {error}=validateRestPassword(req.body);
    if(error)return res.status(400).json({
        status:'failed',
        error:error.details[0].message
    });
    
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const worker = await Worker.findOne({
        passwordRestToken:hashedToken,
        passwordRestExpires:{$gt:Date.now()}
    });
    if(!worker)return res.status(400).send('Token is invalid or expired ..')
     
      const salt = await bcrypt.genSalt(10);
    worker.password = await bcrypt.hash(worker.password, salt);
    worker.confirmPassword = undefined;
    worker.passwordRestToken = undefined;
    worker.passwordRestExpires=undefined;

    await worker.save();
    const token = jwt.sign({_id : worker._id} , config.get('jwtPrivateKey')); 
    res.status(200).json({
    status:'success',
    token
})

})
