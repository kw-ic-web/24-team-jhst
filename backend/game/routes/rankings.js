const express = require('express');
const router = express.Router();
const rankingsController = require('../controllers/rankingsController');


router.get('/', rankingsController.getRankings);

module.exports = router;