const db = require('../../config/db');

// 테이블 생성 및 데이터 삽입 함수
const createGameTableAndInsertData = () => {
  // game 테이블 생성 쿼리
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS game (
      game_id INT PRIMARY KEY AUTO_INCREMENT, -- AUTO_INCREMENT 추가
      member_id VARCHAR(20) NOT NULL,
      opposite_player VARCHAR(20),
      create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      game_mode VARCHAR(10),
      easy_or_hard VARCHAR(10),
      winner VARCHAR(20)
    );
  `;

  // 기존 데이터 삭제 쿼리
  const deleteDataQuery = `
    DELETE FROM game;
  `;

  // 데이터 삽입 쿼리
  const insertDataQuery = `
    INSERT INTO game (member_id, opposite_player, create_date, game_mode, easy_or_hard, winner)
    VALUES
    ('user1', 'user2', NOW(), 'english', 'easy', 'user1'),
    ('user3', 'user4', NOW(), 'english', 'hard', 'user3'),
    ('user5', 'user1', NOW(), 'korean', 'easy', 'user5'),
    ('user2', 'user3', NOW(), 'korean', 'hard', 'user3'),
    ('user4', 'user5', NOW(), 'korean', 'easy', 'user4');
  `;

  return new Promise((resolve, reject) => {
    // 테이블 생성 쿼리 실행
    db.query(createTableQuery, (err) => {
      if (err) {
        return reject('게임 테이블 생성 중 오류 발생: ' + err.stack);
      }

      // 기존 데이터 삭제 쿼리 실행
      db.query(deleteDataQuery, (err) => {
        if (err) {
          return reject('기존 게임 데이터 삭제 중 오류 발생: ' + err.stack);
        }

        // 데이터 삽입 쿼리 실행
        db.query(insertDataQuery, (err) => {
          if (err) {
            return reject('게임 데이터 삽입 중 오류 발생: ' + err.stack);
          }
          resolve('게임 테이블 생성 및 데이터 삽입 성공');
        });
      });
    });
  });
};

module.exports = { createGameTableAndInsertData };
