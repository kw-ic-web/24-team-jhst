var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//매칭 성공시 이동하는 room경로
router.get('/room/:roomName',(req,res)=>{
  const roomName = req.params.roomName;
  res.render("room", { roomName }); 
});
module.exports = router;
