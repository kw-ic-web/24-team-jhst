const express = require('express');
const router = express.Router();
const { Word } = require('../../../db/assets/word'); // Word 모델을 불러옵니다.
const { WrongAns ,Game} = require('../../../db/gamedb');

const Sequelize = require('sequelize');

router.get('/singleplay', async (req, res) => {
  try {
    const { member_id } = req.query;

    if (!member_id) {
      console.log('member_id is missing');
      return res.status(400).json({ message: 'member_id is required' });
    }

    console.log(`member_id: ${member_id}`);

    // wrongans 테이블에서 해당 member_id의 word_id 조회
    const wrongAnswers = await WrongAns.findAll({
      where: { member_id },
      attributes: ['word_id'],
    });
    const wordIds = wrongAnswers.map((item) => item.word_id);

    console.log('Extracted wordIds:', wordIds);

    // word 테이블에서 해당 word_id의 단어 조회
    const selectedWords = await Word.findAll({
      where: { word_id: wordIds },
    });

    console.log('Selected Words:', selectedWords);

    // 부족한 단어 개수를 계산
    const remainingCount = 5 - selectedWords.length;
    console.log(`Remaining words needed: ${remainingCount}`);

    let additionalWords = [];
    if (remainingCount > 0) {
      // 부족한 단어를 랜덤으로 추가
      additionalWords = await Word.findAll({
        where: { word_id: { [Sequelize.Op.notIn]: wordIds } },
        order: Sequelize.literal('RAND()'),
        limit: remainingCount,
      });

      console.log('Additional Words:', additionalWords);
    }

    const allWords = [...selectedWords, ...additionalWords];
    console.log('All Words (final result):', allWords);

    // 새로운 game_id 생성
    const newGame = await Game.create({
      member_id: member_id, // 전달받은 member_id
      game_mode: null, // null로 설정
      easy_or_hard: null, // null로 설정
      opposite_player: null, // null로 설정
    });

    console.log('New Game Created:', newGame);

    // 프론트엔드에 game_id와 단어 반환
    return res.status(200).json({
      game_id: newGame.game_id,
      words: allWords,
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// 게임 결과 처리
router.post('/roundplay/result', async (req, res) => {
  try {
    const { member_id, results, game_id } = req.body;

    if (!member_id || !results || !Array.isArray(results)) {
      return res.status(400).json({ message: 'Invalid data. Please provide member_id, game_id, and results.' });
    }

    console.log(`member_id: ${member_id}`);
    console.log('Results:', results);

    // 유효하지 않은 데이터 필터링
    const validResults = results.filter((result) => result.word_id !== undefined && result.word_id !== null);
    const correctWords = validResults
      .filter((result) => result.status === 'success')
      .map((result) => result.word_id);
    const wrongWords = validResults
      .filter((result) => result.status === 'fail')
      .map((result) => result.word_id);

    console.log('Correct Words:', correctWords);
    console.log('Wrong Words:', wrongWords);

    // 맞춘 단어 삭제
    if (correctWords.length > 0) {
      await WrongAns.destroy({
        where: {
          member_id,
          word_id: correctWords,
        },
      });
      console.log('Correct words removed from WrongAns:', correctWords);
    }

    // 못 맞춘 단어 저장
    if (wrongWords.length > 0) {
      const existingWrongWords = await WrongAns.findAll({
        where: {
          member_id,
          word_id: wrongWords,
        },
        attributes: ['word_id'],
      });

      const existingWordIds = existingWrongWords.map((item) => item.word_id);
      const newWrongWords = wrongWords.filter((word_id) => !existingWordIds.includes(word_id));

      if (newWrongWords.length > 0) {
        const newEntries = newWrongWords.map((word_id) => ({
          member_id,
          word_id,
          game_id,
        }));

        await WrongAns.bulkCreate(newEntries);
        console.log('New wrong words added to WrongAns:', newEntries);
      }
    }

    return res.status(200).json({ message: 'Game results processed successfully.' });
  } catch (error) {
    console.error('Error processing game results:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
