const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Worker } = require('../models/workerModel');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    // First Validate The HTTP Request
    const { error } = validate(req.body);
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

    res.send(true);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;