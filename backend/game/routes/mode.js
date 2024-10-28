const express = require('express');
const router = express.Router();
const modeController = require('../controllers/modeController');


router.post('/', modeController.insertmode);

module.exports = router;