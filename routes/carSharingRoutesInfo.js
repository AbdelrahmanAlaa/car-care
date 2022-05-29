const express = require("express");
const router = express.Router();
const authUsers = require("../controller/authUsersController");
const { uploadMultiImage } = require("../middleware/multer");
const carSharingInfo = require("../controller/carSharingControllerInfo");

//route of car wash
router
  .route("/register")
  .post(authUsers.auth, uploadMultiImage, carSharingInfo.creatCarSharingInfo);

router.route("/").get(authUsers.auth, carSharingInfo.getCarSharingInfo);

// router
// .route('/updateCarInfo')
// .patch(authUsers.auth,carWash.updateCarWash)

module.exports = router;
