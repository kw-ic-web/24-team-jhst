var express = require('express');
var router = express.Router();
const loginController = require('../controllers/loginController');

// /login post 메서드로 req 받으면 logincontroller의 login함수 실행
// 현재는 그냥 토큰 발급

router.post('/', loginController.login);

router.get('/test', loginController.verifyToken, (req, res) => {
  res.json(req.decoded); // 인증된 토큰 정보 응답
});

// 회원 정보 조회
//router.get('/info', memberController.viewInfo);

module.exports = router;
