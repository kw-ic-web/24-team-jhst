const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/deleteMember', adminController.deleteMember); // 회원 삭제
router.post('/updateMemberPoint', adminController.updateMemberPoint); // 회원 포인트 수정
router.post('/addCharacter', adminController.addCharacter); // 캐릭터 추가
router.post('/addWord', adminController.addWord); // 단어 추가
router.post('/updateWord', adminController.updateWord); // 단어 수정
router.get('/getMemberPoint/:member_id', adminController.getMemberPoint); // 회원 포인트 조회
router.post('/deleteCharacterByName', adminController.deleteCharacterByName); // 캐릭터 삭제 (이름 기준)
router.get('/getWord/:word_id', adminController.getWord); // 단어 조회

module.exports = router;
