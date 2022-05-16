const express = require("express");
const router = express.Router();
const authUsers = require("../controller/authUsersController");
const { uploadMultiImage } = require("../middleware/multer");
const carSharing = require("../controller/carSharingController");

//route of car wash
router
  .route("/register")
  .post(authUsers.auth, uploadMultiImage, carSharing.creatCarSharing);

// router
// .route('/getCarInfo')
// .get(authUsers.auth,carWash.getCarInfo)

// router
// .route('/getUserInfo')
// .get(authUsers.auth,carWash.getUserInfo)

// router
// .route('/updateCarInfo')
// .patch(authUsers.auth,carWash.updateCarWash)

module.exports = router;
