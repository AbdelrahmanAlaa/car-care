const express = require("express");
const router = express.Router();
const carWash = require("../controller/carWashController");
const authUsers = require("../controller/authUsersController");

//route of car wash
router.route("/register").post(authUsers.auth, carWash.createCarWash);

router.route("/getCarInfo").get(authUsers.auth, carWash.getCarInfo);

router.route("/getUserInfo").get(authUsers.auth, carWash.getUserInfo);

router.route("/deletedCarInfo").patch(authUsers.auth, carWash.deleteCarWash);

// router
// .route('/updateCarInfo')
// .patch(authUsers.auth,carWash.updateCarWash)
module.exports = router;
