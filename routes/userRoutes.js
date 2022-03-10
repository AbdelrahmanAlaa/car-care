const express = require('express');
const authUsers = require('../controller/authUsersController');
const multerConfig = require('../middleware/multer');
const userController = require('../controller/userController');
const router = express.Router();

router.post('/uploadImg', multerConfig, authUsers.uploadImg)


router
.route('/updatePassword')
.patch(authUsers.auth, userController.updatePassword);
  
router
.route('/updateMe')
.patch(
    authUsers.auth,
     userController.updateMe);


     router
.route('/updateMyPhoto')
.patch(
    authUsers.auth,
    multerConfig,userController.updateMyPhoto);


router 
.route('/:key/getUsers')
.get(userController.getAllUser);

router 
.route('/deleteMe')
.delete(authUsers.auth,userController.deleteMe);


router 
.route('/:key/:id')
.get(userController.getUser);


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
.route('/restPassword')
.patch(authUsers.restPassword);

router
.route('/findLocation/within/:distance/center/:latlng/unit/:unit')
.get(authUsers.getLocation)

router
.route('/findLocation/distance/:latlng/unit/:unit')
.get(authUsers.getDistance)


module.exports = router ; 
