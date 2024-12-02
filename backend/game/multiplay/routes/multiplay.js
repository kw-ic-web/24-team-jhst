const express = require('express');
const router = express.Router();
const { Game, WrongAns , Round} = require('../../../db/gamedb');
const { Word } = require('../../../db/assets/word');
const Sequelize = require('sequelize');
const { MemberGame } = require('../../../db/memberdb');


// GET /multiplay - 게임 ID를 받고 Word 테이블에서 랜덤 단어 5개 선택
router.get('/', async (req, res) => {
  try {
    const gameId = parseInt(req.query.gameId, 10); // gameId를 정수로 변환
    if (isNaN(gameId)) {
      return res.status(400).json({ message: '유효한 gameId를 제공해야 합니다.' });
    }

    // Word 테이블에서 랜덤으로 5개의 단어를 가져옵니다.
    const words = await Word.findAll({
      order: Sequelize.literal('RAND()'), // 랜덤으로 정렬
      limit: 5, // 5개만 선택
    });

    const roundsData = words.map((word, index) => ({
      word_id: word.word_id,
      game_id: gameId,
      round_num: index + 1, // 1, 2, 3, 4, 5 순서대로 저장
    }));

    // round 테이블에 데이터 삽입
    await Round.bulkCreate(roundsData);

    // 삽입한 데이터 응답으로 반환
    const response = words.map((word, index) => ({
      round_num: index + 1,
      word_id: word.word_id,
      en_word: word.en_word,
      ko_word: word.ko_word,
    }));

    res.status(200).json(response); // JSON 응답
  } catch (error) {
    console.error('데이터 처리 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

module.exports = router;

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

    // //member_game테이블에 포인트 업데이트
    // const member = await MemberGame.findOne({ where: { member_id: winner } });

    // if (!member) {
    //   return res.status(404).json({ message: "해당 winner를 member_game 테이블에서 찾을 수 없습니다." });
    // }
    // member.point += 70;
    // await member.save();

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
