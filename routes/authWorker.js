const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Worker, validate } = require('../models/workerModel');
const express = require('express');
const router = express.Router();



// add a new Worker
router.post('/', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) return res.status(400).json({
        msg :"fail",
        error :error.details[0].message});
    
    // Check if this Worker already exisits
    let worker = await Worker.findOne({ email: req.body.email });
    if (worker) return res.status(400).json({
            msg:"fail",
            error :'That email already exisits!'});
    
        worker = new Worker(req.body);
        worker.confirmPassword=undefined ;
        const salt = await bcrypt.genSalt(10);
        worker.password = await bcrypt.hash(worker.password, salt);
        // Worker.confirmPassword = await bcrypt.hash(Worker.confirmPassword, salt);
        // Donesn't show all data only id,name,email
        res.json({
            msg:"success",
            Worker:_.pick(worker, ['_id', 'name', 'email'])
        });
        await worker.save();
});
module.exports = router;

