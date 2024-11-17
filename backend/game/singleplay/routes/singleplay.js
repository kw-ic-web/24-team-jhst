const express = require('express');
const router = express.Router();
const { Word } = require('../../../db/assets/word'); // Word 모델을 불러옵니다.
const Sequelize = require('sequelize');

router.get('/play', async (req, res) => {
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

    res.json(rounds); // JSON 응답
  } catch (error) {
    console.error('단어를 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

module.exports = router;
