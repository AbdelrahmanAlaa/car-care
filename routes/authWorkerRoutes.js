const auth = require('./../middleware/auth');
const express = require('express');
const router = express.Router();
const authWorkerController  = require('./../controller/authWorkerController');



router
  .route('/signWorker')
  .post(authWorkerController.creatWorker)
  

  router.post('/loginWorker' ,authWorkerController.loginWorker)

  router
  .route('/forgetPasswordWorker')
  .post(authWorkerController.forgetPassword);
  
  router
  .route('/restPasswordWorker/:token')
  .patch(authWorkerController.restPassword);

  router 
  .route('/getWorker')
  .get(authWorkerController.getWorker)

  

  module.exports = router;
