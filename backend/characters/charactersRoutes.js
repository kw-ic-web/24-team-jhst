const express = require('express');
const router = express.Router();
const charactersController = require('./charactersController');

// 캐릭터 추가 라우트
router.post('/add', charactersController.addCharacter);

// 캐릭터 선택 라우트
router.post('/select', charactersController.selectCharacter);

// 캐릭터 뽑기 라우트
router.get('/draw', charactersController.drawCharacter);

module.exports = router;
