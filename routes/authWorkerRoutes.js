const express = require('express');
const router = express.Router();
const authWorkerController  = require('./../controller/authWorkerController');


router
  .route('/signWorker')
  .post(authWorkerController.creatWorker)
  .get(authWorkerController.getWorker)

  router.post('/loginWorker' , authWorkerController.loginWorker)

module.exports = router;
