const express = require("express");
const router = express.Router();
const authUsers = require("../controller/authUsersController");
const { uploadMultiImage } = require("../middleware/multer");
const carSharingPost = require("../controller/carSharingControllerPost");

router
  .route("/register")
  .post(authUsers.auth, uploadMultiImage, carSharingPost.createCarSharingPost);

router
  .route("/checkUser")
  .post(authUsers.auth, carSharingPost.checkUserIfRegister);

router.route("/getAllPost").get(carSharingPost.getAllCarSharingPost);
router.route("/getPostById/:id").get(carSharingPost.getCarSharingPostById);
router.route("/getMyPost").get(authUsers.auth,carSharingPost.getCarSharingPost);
router.route("/deleteMyPost/:id").delete(authUsers.auth,carSharingPost.deleteMyPost);

router
.route('/getBooking')
.get(authUsers.auth,carSharingPost.getBooking)

router
.route('/acceptedBooking/:postBooking/:check')
.post(carSharingPost.acceptBooking)

module.exports = router;
