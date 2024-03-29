const express = require("express");
const authUsers = require("../controller/authUsersController");
const { uploadSingleImage } = require("../middleware/multer");
const userController = require("../controller/userController");
const review = require("../controller/reviewController");
const router = express.Router();

// routes of review controller
router.route("/review").post(authUsers.auth, review.creatReview);

// routes of uploadImg
// router.post("/uploadImg", uploadSingleImage, authUsers.uploadImg);

router
  .route("/updatePassword")
  .patch(authUsers.auth, userController.updatePassword);

router.route("/updateMe").patch(authUsers.auth, userController.updateMe);

router
  .route("/updateMyPhoto")
  .patch(authUsers.auth, uploadSingleImage, userController.updateMyPhoto);

router.route("/:key/getUsers").get(userController.getAllUser);

router.route("/deleteMe").delete(authUsers.auth, userController.deleteMe);

router.route("/:key/:id").get(userController.getUser);

router.route("/signUser").post(authUsers.creatUser);
// .get(auth , authUsers.getAllUser)

router.route("/loginUser").post(authUsers.loginUser);

router.route("/forgetPassword").post(authUsers.forgetPassword);

router.route("/restPassword/:token").patch(authUsers.restPassword);

// router
//   .route("/findLocation/within/:distance/center/:latlng/unit/:unit")
//   .get(authUsers.getLocation);

// router
//   .route("/findLocation/distance/:latlng/unit/:unit")
//   .get(authUsers.getDistance);

module.exports = router;
