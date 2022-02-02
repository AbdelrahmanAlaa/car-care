const express = require('express');
const router = express.Router();
const location = require('../controller/location');

router
.route('/location/:id').post(location.creatLocation)
.get(location.get)

module.exports = router;