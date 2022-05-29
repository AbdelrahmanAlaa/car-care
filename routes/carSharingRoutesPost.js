const express = require("express");
const router = express.Router();
const authUsers = require("../controller/authUsersController");
const { uploadMultiImage } = require("../middleware/multer");
const carSharingPost = require("../controller/carSharingControllerPost");

router
  .route("/register")
  .post(authUsers.auth, uploadMultiImage, carSharingPost.creatCarSharingPost);

router
  .route("/checkUser")
  .post(authUsers.auth, carSharingPost.checkUserIfRegister);

router.route("/").get(carSharingPost.getCarSharingPost);

// router
// .route('/getUserInfo')
// .get(authUsers.auth,carWash.getUserInfo)

// router
// .route('/updateCarInfo')
// .patch(authUsers.auth,carWash.updateCarWash)

module.exports = router;
