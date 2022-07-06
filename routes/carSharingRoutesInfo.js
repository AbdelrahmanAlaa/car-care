const express = require("express");
const router = express.Router();
const authUsers = require("../controller/authUsersController");
const { uploadMultiImage } = require("../middleware/multer");
const carSharingInfo = require("../controller/carSharingControllerInfo");

//route of car wash
router
  .route("/register")
  .post(authUsers.auth, uploadMultiImage, carSharingInfo.createCarSharingInfo);

  router.route("/").get(authUsers.auth, carSharingInfo.getCarSharingInfo);

  router.route("/:id").get(authUsers.auth, carSharingInfo.getCarSharingInfoById);

router
.route('/deleteCarSharingInfo')
.delete(authUsers.auth,carSharingInfo.deleteCareSharingInfo)

module.exports = router;
