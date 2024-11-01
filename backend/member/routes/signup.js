var express = require('express');
var router = express.Router();
const signupController = require('../controllers/signupController');
const jwt = require('jsonwebtoken');

router.use(express.json());

// get 메서드 /signup 페이지 연결하는 라우팅
router.get('/', function (req, res, next) {
  res.render('register', { title: 'register' });
});

router.post('/checkid', signupController.checkid);

//새로운 멤버 추가 시 : post메서드 /register
router.post('/register', signupController.insertMemberTableData);

//만약 sequelize 오류발생시 쿼리문버전으로 해결하려면 아래 코드 주석 풀어주시면 됩니다
//router.post('/register', signupController.register);

module.exports = router;
