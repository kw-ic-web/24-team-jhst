const express = require('express');
const router = express.Router();
const { Word } = require('../../../db/assets/word'); // Word 모델을 불러옵니다.
const { WrongAns } = require('../../../db/gamedb');
const Sequelize = require('sequelize');

router.get('/singleplay', async (req, res) => {
  try {
    const { member_id } = req.query; // 요청에서 member_id 가져오기

    if (!member_id) {
      console.log('member_id is missing'); // 로그로 확인
      return res.status(400).json({ message: 'member_id is required' });
    }
    console.log(`member_id: ${member_id}`); // member_id 값 출력

    // wrongans 테이블에서 해당 member_id의 word_id를 조회
    const wrongAnswers = await WrongAns.findAll({
      where: { member_id }, // member_id 조건
      attributes: ['word_id'], // word_id만 선택
    });
    console.log('Wrong Answers:', wrongAnswers); // wrongAnswers 확인

    // word_id 배열 추출
    const wordIds = wrongAnswers.map((item) => item.word_id);
    console.log('Extracted wordIds:', wordIds); // 추출된 word_id 배열 확인

    // word 테이블에서 word_id에 해당하는 단어를 조회
    const selectedWords = await Word.findAll({
      where: { word_id: wordIds }, // word_id와 일치하는 항목 조회
    });
    console.log('Selected Words:', selectedWords); // 조회된 단어 확인

    // 부족한 단어 개수를 계산
    const remainingCount = 5 - selectedWords.length;
    console.log(`Remaining words needed: ${remainingCount}`); // 부족한 단어 개수 확인

    let additionalWords = [];
    if (remainingCount > 0) {
      // word 테이블에서 랜덤하게 부족한 단어를 가져옴
      additionalWords = await Word.findAll({
        where: { word_id: { [Sequelize.Op.notIn]: wordIds } }, // 이미 선택된 word_id는 제외
        order: Sequelize.literal('RAND()'), // 랜덤 정렬
        limit: remainingCount, // 부족한 개수만큼 가져오기
      });
      console.log('Additional Words:', additionalWords); // 추가로 가져온 단어 확인
    }

    // 기존 단어 + 추가 단어 합치기
    const allWords = [...selectedWords, ...additionalWords];
    console.log('All Words (final result):', allWords); // 최종 결과 확인
Y
    return res.status(200).json(allWords); // 총 5개의 단어 반환
  } catch (error) {
    console.error('Error occurred:', error); // 에러 로그 출력
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
