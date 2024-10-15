const rankingsServices = require('../services/rankingsServices');

const getRankings = async (req, res) => {
  try {
    const rankings = await rankingsServices.getRankings();
    res.json(rankings);
  } catch (error) {
    res.status(500).send('랭킹 정보를 가져오는 중 오류 발생');
  }
};

module.exports = { getRankings };