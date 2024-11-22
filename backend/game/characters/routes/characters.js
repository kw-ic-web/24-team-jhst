const express = require('express');
const router = express.Router();
const charactersController = require('../controller/charactersController');

// 캐릭터 추가 라우트
router.post('/add', charactersController.addCharacter);

// 캐릭터 선택 라우트
router.post('/select', verifyToken, charactersController.selectCharacter);

// 캐릭터 뽑기 라우트
router.get('/draw', verifyToken, charactersController.drawCharacter);

// 보유 캐릭터 조회 라우트
router.get('/owned', verifyToken, charactersController.getOwnedCharacters); // 미들웨어 추가

// 활성 캐릭터 조회
router.get('/active', verifyToken, charactersController.getActiveCharacter);

module.exports = router;
