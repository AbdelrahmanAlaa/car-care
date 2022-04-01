const crypto = require('crypto');
const sendEmail = require('../middleware/email');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { Worker, validateLogin , validateWorker,creatRandomPassword,validateRestPassword } = require('./../models/workerModel');
const asyncError=require('./../middleware/asyncMiddleware')


exports.auth = async(req,res,next)=>{
    const token = req.header('x-auth-token');
    if(!token)return res.status(401).send('access denied . no token provided  ')
  
    try{ 
    const decoded = await jwt.verify(token , config.get('jwtPrivateKey'));
    req.worker= decoded ;
    // console.log(decoded)
    next();
   }
   catch(ex){
       res.status(400).send('invalid token ');
   }
}


// add a new Worker
exports.creatWorker = asyncError(async (req, res) => {
    // First Validate The Request
    const { error } = validateWorker(req.body);
    if (error) return res.status(400).send({
        status:'failed',
        error :error.details[0].message});
    
    // Check if this Worker already exist
    let worker = await Worker.findOne({ email: req.body.email });
    if (worker) return res.status(400).send({
        status:'failed',
        message :'That email already exist..!'});
    
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
            status:'success',
            message: "successfully register",
            token,
            Worker:_.pick(worker, ['_id', 'name', 'email'])
        });
        await worker.save();
});


exports.loginWorker = asyncError( async (req, res) => {
    // First Validate The Request of the body 
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send({
        status:"failed",
        message:error.details[0].message})

    //  Now find the worker by their email address
    let worker = await Worker.findOne({ email: req.body.email });
    if (!worker) return res.status(400).send({
        status:"failed",
        message:'Incorrect email or password.'});

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, worker.password);
    if (!validPassword)return res.status(400).send({
        status:"failed",
        message:'Incorrect email or password.'});
        const token = jwt.sign({_id:worker._id},config.get('jwtPrivateKey'));
        
        res.send({
        status:"success",
        message: "successfully login",
        token,
        Worker:_.pick(worker,['_id','name','email',''])
    });
});

exports.forgetPassword =asyncError(async(req,res)=>{

    let worker =await Worker.findOne({email:req.body.email});
    if(!worker)return res.status(404).send({    
     status :'failed',
     message : 'this email is not found ..!'
}) ;

const restToken = creatRandomPassword();
worker.passwordRestToken=passwordRestToken;
worker.passwordRestExpires=passwordRestExpires;
 
//  res.send(passwordRestExpires);
await worker.save();

const resltURL = `${req.protocol}://${req.get('host')}/api/v1/users/restPassword/${restToken}`;

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
    message: "Request was a success",
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
    if(error)return res.status(400).send({
        status:'failed',
        message:error.details[0].message
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
    res.status(200).send({
    status:'success',
    message: "Request was a success",
    token
})

})
