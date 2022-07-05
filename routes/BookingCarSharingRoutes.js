const express = require("express");
const router = express.Router();
const authUsers = require("../controller/authUsersController");
const BookingCarSharing = require("../controller/BookingCarSharingController");

router
  .route("/:carSharingPostId")
  .post(authUsers.auth, BookingCarSharing.CreateBooking);
  
  router.route("/").get(authUsers.auth,BookingCarSharing.getBooking);
  router.route('/getAllBooking').get(BookingCarSharing.getAllBooking)
  router.route("/:carSharingPostId").delete(authUsers.auth,BookingCarSharing.deleteBooking)
// router
//   .route("/checkUser")
//   .post(authUsers.auth, carSharingPost.checkUserIfRegister);


module.exports = router;
