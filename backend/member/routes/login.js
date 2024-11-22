var express = require('express');
var router = express.Router();
const loginController = require('../controllers/loginController');

// 로그인 엔드포인트
router.post('/', loginController.login);

// verifyToken 엔드포인트 
router.get('/verifyToken', loginController.verifyToken, (req, res) => {
  res.status(200).json({ message: '토큰이 유효합니다.' });
});

module.exports = router;
