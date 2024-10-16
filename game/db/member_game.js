const db = require('../../config/db');

// 테이블 생성 및 데이터 삽입 함수
const createTableAndInsertData = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS member_game (
      id VARCHAR(20) PRIMARY KEY,
      pwd VARCHAR(20) NOT NULL,
      name VARCHAR(20) NOT NULL,
      email VARCHAR(60) NOT NULL,
      point INT DEFAULT 0,
      win INT DEFAULT 0,
      lose INT DEFAULT 0,
      create_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertDataQuery = `
    INSERT INTO member_game (id, pwd, name, email, point, win, lose, create_date) 
    VALUES
    ('user1', 'password123', 'John Doe', 'john@example.com', 100, 10, 5, NOW()),
    ('user2', 'password456', 'Jane Smith', 'jane@example.com', 150, 15, 7, NOW()),
    ('user3', 'password789', 'Alice Johnson', 'alice@example.com', 120, 12, 6, NOW()),
    ('user4', 'password321', 'Bob Brown', 'bob@example.com', 80, 8, 9, NOW()),
    ('user5', 'password654', 'Charlie Black', 'charlie@example.com', 60, 6, 3, NOW())
    ON DUPLICATE KEY UPDATE id=id;
  `;

  return new Promise((resolve, reject) => {
    db.query(createTableQuery, (err) => {
      if (err) {
        return reject('테이블 생성 중 오류 발생: ' + err.stack);
      }

      db.query(insertDataQuery, (err) => {
        if (err) {
          return reject('데이터 삽입 중 오류 발생: ' + err.stack);
        }
        resolve('테이블 생성 및 데이터 삽입 성공');
      });
    });
  });
};

module.exports = { createTableAndInsertData };
