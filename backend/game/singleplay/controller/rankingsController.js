const { Sequelize } = require('../../../config/db');
const { MemberGame } = require('../../../db/memberdb');

const getRankings = async (req, res) => {
  try {
    const rankings = await MemberGame.findAll({
      attributes: [
        'member_id',
        'win',
        'lose',
        [
          Sequelize.literal(
            `CASE WHEN (win + lose) > 0 THEN (win / (win + lose)) * 100 ELSE 0 END`
          ),
          'win_rate'
        ],
        [
          Sequelize.literal(
            'DENSE_RANK() OVER (ORDER BY (win / (win + lose)) * 100 DESC)'
          ),
          'ranking'
        ]
      ],
      order: [Sequelize.literal('ranking')],
      raw: true
    });
    res.json(rankings);
  } catch (error) {
    console.error('Error fetching rankings:', error);
    res.status(500).send('랭킹 정보를 가져오는 중 오류 발생');
  }
};

module.exports = { getRankings };
