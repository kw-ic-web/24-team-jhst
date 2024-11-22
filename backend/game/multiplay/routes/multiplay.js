const express = require('express');
const router = express.Router();
const { Game, WrongAns } = require('../../../db/gamedb');
const { Word } = require('../../../db/assets/word');
const Sequelize = require('sequelize');
const { MemberGame } = require('../../../db/memberdb');


router.post("/winner", async (req, res, next) => {
    const { member_id, opposite_player, game_mode, easy_or_hard, winner } = req.body;

    try {
        // Sequelize를 사용하여 Game 테이블에 데이터 삽입
        const game = await Game.create({
            member_id,
            opposite_player,
            game_mode,
            easy_or_hard,
            winner,
        });

        console.log(`Game 데이터 저장 성공: ${game.member_id} vs ${game.opposite_player}`);
        res.status(200).json({ message: "Game 데이터 저장 성공", data: game });
    } catch (error) {
        console.error("Game 데이터 저장 중 오류 발생:", error.message);
        res.status(500).json({ message: "Game 데이터 저장 실패", error: error.message });
    }
});
router.post("/wrongans", async (req, res) => {
    try {
      // 요청 바디에서 데이터 추출
      const { member_id, en_word, game_id } = req.body;
  
      // 필수 데이터 유효성 검사
      if (!member_id || !en_word || !game_id) {
        return res.status(400).json({ error: "username, en_word, game_id를 모두 입력해야 합니다." });
      }
  
      // en_word로 word 테이블에서 word_id를 조회
      const word = await Word.findOne({ where: { en_word } });
      const member = await MemberGame.findOne({ where: { member_id } });
  
      if (!word) {
        return res.status(404).json({ error: "해당 단어(en_word)를 word 테이블에서 찾을 수 없습니다." });
      }
  
      // wrongans 테이블에 데이터 저장
      const newWrongAns = await WrongAns.create({
        member_id : member.member_id,
        word_id: word.word_id, // word 테이블에서 가져온 word_id
        game_id,
      });
  
      // 성공적으로 저장되었다는 응답 반환
      res.status(201).json({
        message: "Wrong answer 저장 성공",
        data: newWrongAns,
      });
    } catch (error) {
      console.error("Error saving wrong answer:", error);
      res.status(500).json({ error: "Wrong answer 저장 중 오류가 발생했습니다." });
    }
  });


module.exports = router;