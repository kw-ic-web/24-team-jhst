const { Sequelize, member_game } = require('../../config/db');

const getRankings = async () => {
  try {
    const results = await member_game.findAll({
      attributes: [
        'id',
        'win',
        'lose',
        [Sequelize.literal('(win / (win + lose)) * 100'), 'win_rate'],
        [
          Sequelize.literal(
            'RANK() OVER (ORDER BY (win / (win + lose)) * 100 DESC)'
          ),
          'ranking'
        ]
      ],
      where: {
        [Sequelize.Op.gt]: [{ win: 0 }, { lose: 0 }]
      },
      order: [Sequelize.literal('ranking')],
      raw: true
    });
    return results;
  } catch (err) {
    throw err;
  }
};

module.exports = { getRankings };
