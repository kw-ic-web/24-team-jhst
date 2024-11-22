const express = require('express');
const router = express.Router();
const rankingsController = require('../controller/rankingsController');


router.get('/', rankingsController.getRankings);

module.exports = router;