const express = require('express');
const router = express.Router();
const carSharing = require('../controller/carSharingController')
const authUsers = require('../controller/authUsersController');



//route of car wash
router
.route('/register')
.post(authUsers.auth,carSharing.creatCarSharing) 

// router
// .route('/getCarInfo')
// .get(authUsers.auth,carWash.getCarInfo)

// router
// .route('/getUserInfo')
// .get(authUsers.auth,carWash.getUserInfo)


// router
// .route('/updateCarInfo')
// .patch(authUsers.auth,carWash.updateCarWash)

module.exports = router