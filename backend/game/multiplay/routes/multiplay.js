const express = require('express');
const router = express.Router();
const { Game, WrongAns } = require('../../../db/gamedb');
const { Word } = require('../../../db/assets/word');
const Sequelize = require('sequelize');
const { MemberGame } = require('../../../db/memberdb');

// GET /multiplay - 테스트용 기본 엔드포인트
router.get('/', async (req, res) => {
  try {
    // Word 테이블에서 랜덤으로 5개의 단어를 가져옵니다.
    const words = await Word.findAll({
      order: Sequelize.literal('RAND()'), // 랜덤으로 정렬
      limit: 5,                           // 5개만 선택
    });

    // { round1: 단어 } 형식으로 데이터 변환
    const rounds = {};
    words.forEach((word, index) => {
      rounds[`round${index + 1}`] = { en_word: word.en_word, ko_word: word.ko_word };
    });

    res.status(200).json(rounds); // JSON 응답
  } catch (error) {
    console.error('단어를 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

// POST /winner - 게임 승자 업데이트
router.post('/winner', async (req, res, next) => {
  const { game_id, winner } = req.body;

  try {
    // 요청 데이터 유효성 검사
    if (!game_id || !winner) {
      return res.status(400).json({ message: "game_id와 winner를 모두 제공해야 합니다." });
    }

    // game_id에 해당하는 Game 행을 조회
    const game = await Game.findByPk(game_id);

    if (!game) {
      return res.status(404).json({ message: "해당 game_id를 찾을 수 없습니다." });
    }

    // winner 값을 업데이트
    game.winner = winner;
    await game.save();

    console.log(`Game 데이터 업데이트 성공: game_id=${game_id}, winner=${winner}`);
    res.status(200).json({ message: "Game 데이터 업데이트 성공", data: game });
  } catch (error) {
    console.error("Game 데이터 업데이트 중 오류 발생:", error.message);
    res.status(500).json({ message: "Game 데이터 업데이트 실패", error: error.message });
  }
});

// POST /wrongans - 잘못된 답안 저장
router.post('/wrongans', async (req, res) => {
  try {
    // 요청 바디에서 데이터 추출
    const { member_id, en_word, game_id } = req.body;

    // 필수 데이터 유효성 검사
    if (!member_id || !en_word || !game_id) {
      return res.status(400).json({ error: "member_id, en_word, game_id를 모두 입력해야 합니다." });
    }

    // en_word로 word 테이블에서 word_id를 조회
    const word = await Word.findOne({ where: { en_word } });
    const member = await MemberGame.findOne({ where: { member_id } });

    if (!word) {
      return res.status(404).json({ error: "해당 단어(en_word)를 word 테이블에서 찾을 수 없습니다." });
    }

    // wrongans 테이블에 데이터 저장
    const newWrongAns = await WrongAns.create({
      member_id: member.member_id,
      word_id: word.word_id, // word 테이블에서 가져온 word_id
      game_id,
    });

    // 성공적으로 저장되었다는 응답 반환
    res.status(201).json({
      message: "Wrong answer 저장 성공",
      data: newWrongAns,
    });
  } catch (error) {
    console.error("Wrong answer 저장 중 오류 발생:", error);
    res.status(500).json({ error: "Wrong answer 저장 중 오류가 발생했습니다." });
  }
});

module.exports = router;
