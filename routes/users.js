const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

// get all users
router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

// get user with the given id 
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('This user with the given ID was not found.');
    res.send(user);
});


// add a new user
router.post('/', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = await User.create(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.confirmPassword = await bcrypt.hash(user.confirmPassword, salt);
        // Donesn't show all data only id,name,email
        res.send(_.pick(user, ['_id', 'name', 'email']));
    }
});

// delete user with the given id
router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

router.patch('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            Gender: req.body.Gender
        }, { new: true });

    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});


module.exports = router;