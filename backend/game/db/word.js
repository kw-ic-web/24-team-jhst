const db = require('../../config/db');

// word 테이블 생성 및 데이터 삽입 함수
const createWordTableAndInsertData = () => {
  // word 테이블 생성 쿼리
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS word (
      word_id INT PRIMARY KEY AUTO_INCREMENT, -- 자동 증가 필드
      en_word VARCHAR(20) NOT NULL, -- 영어 단어
      ko_word VARCHAR(20) NOT NULL, -- 한글 뜻
      easy_or_hard VARCHAR(10) NOT NULL -- 난이도
    );
  `;

  // 데이터 삽입 쿼리 (20개의 단어 추가)
  const insertDataQuery = `
    INSERT INTO word (en_word, ko_word, easy_or_hard)
    VALUES
    ('apple', '사과', 'easy'),
    ('banana', '바나나', 'easy'),
    ('cat', '고양이', 'easy'),
    ('dog', '강아지', 'easy'),
    ('computer', '컴퓨터', 'hard'),
    ('science', '과학', 'hard'),
    ('book', '책', 'easy'),
    ('pencil', '연필', 'easy'),
    ('mountain', '산', 'hard'),
    ('river', '강', 'easy'),
    ('ocean', '바다', 'easy'),
    ('car', '자동차', 'easy'),
    ('airplane', '비행기', 'hard'),
    ('universe', '우주', 'hard'),
    ('forest', '숲', 'easy'),
    ('flower', '꽃', 'easy'),
    ('rain', '비', 'easy'),
    ('snow', '눈', 'easy'),
    ('teacher', '선생님', 'hard'),
    ('student', '학생', 'easy');
  `;

  return new Promise((resolve, reject) => {
    // 테이블 생성 쿼리 실행
    db.query(createTableQuery, (err) => {
      if (err) {
        return reject('word 테이블 생성 중 오류 발생: ' + err.stack);
      }

      // 데이터 삽입 쿼리 실행
      db.query(insertDataQuery, (err) => {
        if (err) {
          return reject('word 데이터 삽입 중 오류 발생: ' + err.stack);
        }
        resolve('word 테이블 생성 및 데이터 삽입 성공');
      });
    });
  });
};

module.exports = { createWordTableAndInsertData };
