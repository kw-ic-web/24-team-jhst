const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// 테이블 생성 및 데이터 삽입 API
router.get('/', tableController.initializeTable);

module.exports = router;
