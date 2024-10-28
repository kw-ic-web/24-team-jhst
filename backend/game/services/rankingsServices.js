const db = require('../../config/db');

const getRankings = () => {
  const query = `
    SELECT id, win, lose, (win / (win + lose)) * 100 AS win_rate,
           RANK() OVER (ORDER BY (win / (win + lose)) * 100 DESC) AS ranking
    FROM member_game
    WHERE (win + lose) > 0
    ORDER BY ranking;
  `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

module.exports = { getRankings };

//테스트