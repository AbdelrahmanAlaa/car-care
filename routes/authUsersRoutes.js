const express = require('express');
const router = express.Router();
const authUsers = require('./../controller/authUsersController');

router 
.route('/signUser')
.post(authUsers.creatUser)
.get(authUsers.getAllUser)


router
.route('/findLocation/within/:distance/center/:latlng/unit/:unit')
.get(authUsers.getLocation)

router
.route('/findLocation/distance/:latlng/unit/:unit')
.get(authUsers.getDistance)

router.post('/loginUser', authUsers.loginUser);

module.exports = router ; 
