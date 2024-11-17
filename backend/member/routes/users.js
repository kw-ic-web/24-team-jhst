const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { verifyToken } = require('../controllers/loginController'); // verifyToken 미들웨어

// 회원 정보 조회 (미들웨어 추가)
router.get('/viewInfo', verifyToken, memberController.viewInfo);

// 회원 정보 수정 (미들웨어 추가)
router.put('/updateMember', verifyToken, memberController.updateMember);

// 회원 탈퇴 (미들웨어 추가)
router.delete('/deleteMember', verifyToken, memberController.deleteMember);

module.exports = router;
