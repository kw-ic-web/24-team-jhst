const sequelize = require('../../config/db');
const { DataTypes, Sequelize } = require('sequelize');

const Word = sequelize.define(
  'word',
  {
    word_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    en_word: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    ko_word: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    easy_or_hard: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: 'word',
    timestamps: false,
  }
);

// word 테이블 생성 및 데이터 삽입 함수
const createWordTableAndInsertData = async () => {
  try {
    await Word.sync(); // Word 테이블 생성

    // 테이블에 데이터가 있는지 확인
    const count = await Word.count();
    if (count === 0) {
      // 데이터가 없을 때만 삽입
      const words = [
        { en_word: 'apple', ko_word: '사과', easy_or_hard: 'easy' },
        { en_word: 'banana', ko_word: '바나나', easy_or_hard: 'easy' },
        { en_word: 'cat', ko_word: '고양이', easy_or_hard: 'easy' },
        { en_word: 'dog', ko_word: '강아지', easy_or_hard: 'easy' },
        { en_word: 'computer', ko_word: '컴퓨터', easy_or_hard: 'hard' },
        { en_word: 'science', ko_word: '과학', easy_or_hard: 'hard' },
        { en_word: 'book', ko_word: '책', easy_or_hard: 'easy' },
        { en_word: 'pencil', ko_word: '연필', easy_or_hard: 'easy' },
        { en_word: 'mountain', ko_word: '산', easy_or_hard: 'hard' },
        { en_word: 'river', ko_word: '강', easy_or_hard: 'easy' },
        { en_word: 'ocean', ko_word: '바다', easy_or_hard: 'easy' },
        { en_word: 'car', ko_word: '자동차', easy_or_hard: 'easy' },
        { en_word: 'airplane', ko_word: '비행기', easy_or_hard: 'hard' },
        { en_word: 'universe', ko_word: '우주', easy_or_hard: 'hard' },
        { en_word: 'forest', ko_word: '숲', easy_or_hard: 'easy' },
        { en_word: 'flower', ko_word: '꽃', easy_or_hard: 'easy' },
        { en_word: 'rain', ko_word: '비', easy_or_hard: 'easy' },
        { en_word: 'snow', ko_word: '눈', easy_or_hard: 'easy' },
        { en_word: 'teacher', ko_word: '선생님', easy_or_hard: 'hard' },
        { en_word: 'student', ko_word: '학생', easy_or_hard: 'easy' },
      ];

      await Word.bulkCreate(words);
      console.log('word 테이블에 데이터 삽입 완료');
    } else {
      console.log('word 테이블에 이미 데이터가 존재합니다. 삽입을 건너뜁니다.');
    }
  } catch (error) {
    console.error('word 테이블 생성 중 오류 발생:', error);
    throw error;
  }
};

module.exports = { Word, createWordTableAndInsertData };
