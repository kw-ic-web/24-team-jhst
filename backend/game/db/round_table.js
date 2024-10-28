const db = require('../../config/db');

// round 테이블 생성 및 데이터 삽입 함수
const createRoundTableAndInsertData = () => {
  // round 테이블 생성 쿼리
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS round (
      round_id INT PRIMARY KEY AUTO_INCREMENT, -- 자동 증가 필드
      game_id INT, -- game 테이블의 외래 키
      word_id INT, -- word 테이블의 외래 키
      round_num INT, -- 라운드 번호
      winner VARCHAR(20), -- 승자
      loser VARCHAR(20), -- 패자
      FOREIGN KEY (game_id) REFERENCES game(game_id) ON DELETE CASCADE, -- game 테이블 참조 외래 키 설정
      FOREIGN KEY (word_id) REFERENCES word(word_id) ON DELETE CASCADE  -- word 테이블 참조 외래 키 설정
    );
  `;

  return new Promise((resolve, reject) => {
    // 테이블 생성 쿼리 실행
    db.query(createTableQuery, (err) => {
      if (err) {
        return reject('round 테이블 생성 중 오류 발생: ' + err.stack);
      }

      // game 테이블에서 game_id 가져오기
      const getGameIdsQuery = `SELECT game_id FROM game`;

      db.query(getGameIdsQuery, (err, results) => {
        if (err) {
          return reject('game 테이블에서 game_id 가져오는 중 오류 발생: ' + err.stack);
        }

        // 가져온 game_id 값을 사용하여 round 테이블에 데이터 삽입
        const insertDataQuery = `
          INSERT INTO round (game_id, word_id, round_num, winner, loser)
          VALUES
          (${results[0].game_id}, 1, 1, 'user1', 'user2'),
          (${results[0].game_id}, 2, 2, 'user1', 'user2'),
          (${results[1].game_id}, 3, 1, 'user3', 'user4'),
          (${results[1].game_id}, 4, 2, 'user3', 'user4'),
          (${results[2].game_id}, 5, 1, 'user5', 'user1');
        `;

        db.query(insertDataQuery, (err) => {
          if (err) {
            return reject('round 데이터 삽입 중 오류 발생: ' + err.stack);
          }
          resolve('round 테이블 생성 및 데이터 삽입 성공');
        });
      });
    });
  });
};

module.exports = { createRoundTableAndInsertData };
