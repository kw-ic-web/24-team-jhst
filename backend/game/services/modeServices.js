// Game 데이터 삽입 함수
const insertGameData = async (member_id, game_mode, easy_or_hard) => {
  try {
    await Game.create({
      member_id,
      game_mode,
      easy_or_hard,
    });
    console.log('모드 정보 저장 성공');
  } catch (err) {
    console.error('데이터 삽입 중 오류 발생: ', err);
  }
};
