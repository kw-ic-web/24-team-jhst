const db = require('../../config/db');

const insertGameData = (member_id, game_mode, easy_or_hard) => {
    const insertDataQuery = `
      INSERT INTO game (member_id, create_date, game_mode, easy_or_hard)
      VALUES (?, NOW(), ?, ?);
    `;
  
    return new Promise((resolve, reject) => {
      db.query(
        insertDataQuery,
        [member_id, game_mode, easy_or_hard],
        (err, result) => {
          if (err) {
            return reject('데이터 삽입 중 오류 발생: ' + err.stack);
          }
          resolve('모드 정보 저장 성공');
        }
      );
    });
  };

  module.exports = { insertGameData };