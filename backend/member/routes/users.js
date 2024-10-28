var express = require('express');
var router = express.Router();
const memberController = require('../controllers/memberController');

// 기존 기본 경로
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 회원 정보 조회 
router.get('/info', memberController.viewInfo);

// 회원 탈퇴 
router.delete('/delete', memberController.deleteMember);

// 회원 정보 수정
router.put('/update', memberController.updateMember);

module.exports = router;
