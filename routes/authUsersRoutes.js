const express = require('express');
const router = express.Router();
const authUsers = require('./../controller/authUsersController');
const auth = require('../middleware/auth'); // here we call oue middleware for protect routes ... 
const multer = require('multer');
const upload = multer({dest:'img/user'});

  
router 
.route('/:key/getUsers')
.get(authUsers.getAllUser);


router 
.route('/signUser')
.post(authUsers.creatUser)
// .get(auth , authUsers.getAllUser)

router
.route('/loginUser')
.post(authUsers.loginUser)

router
.route('/forgetPassword')
.post(authUsers.forgetPassword);

router
.route('/restPassword/:token')
.patch(authUsers.restPassword);

router
.route('/findLocation/within/:distance/center/:latlng/unit/:unit')
.get(authUsers.getLocation)

router
.route('/findLocation/distance/:latlng/unit/:unit')
.get(authUsers.getDistance)


module.exports = router ; 
