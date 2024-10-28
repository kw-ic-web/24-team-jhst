const modeService = require('../services/modeServices');

// 게임 정보 저장을 처리하는 함수
const insertmode = async (req, res) => {
  const {member_id,game_mode,easy_or_hard } = req.body;
  //로그인, 회원가입 로직 구현 이후 member_id 저장방식 변경 예정
  try {
    const result = await modeService.insertGameData(
      member_id,
      game_mode,
      easy_or_hard
    );
    res.status(201).send(result);  // 성공 메시지 반환
  } catch (error) {
    res.status(500).send('모드 정보를 저장하는 중 오류 발생');
  }
};

module.exports = { insertmode };