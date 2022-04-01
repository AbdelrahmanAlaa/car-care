
const express = require('express');
const router = express.Router();
const authWorker  = require('../controller/authWorkerController');
const multerConfig = require('../middleware/multer');
const workerController = require('../controller/workerController');


//  route of worker controller 

router 
.route('/:key/getWorker')
.get(workerController.getAllWorker)

router 
.route('/:key/getWorkerById/:id')
.get(workerController.getWorker)

router
.route('/updatePassword')
.patch(authWorker.auth, workerController.updatePassword);
  
router
.route('/updateMe')
.patch(
    authWorker.auth,
     workerController.updateMe);


     router
.route('/updateMyPhoto')
.patch(
    authWorker.auth,
    multerConfig,workerController.updateMyPhoto);


router 
.route('/deleteMe')
.delete(authWorker.auth,workerController.deleteMe);


  // route of auth worker  

router
  .route('/signWorker')
  .post(authWorker.creatWorker)
  

  router.post('/loginWorker' ,authWorker.loginWorker)

  router
  .route('/forgetPasswordWorker')
  .post(authWorker.forgetPassword);
  
  router
  .route('/restPasswordWorker/:token')
  .patch(authWorker.restPassword); 

  module.exports = router;
