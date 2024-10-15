const tableServices = require('../services/tableServices');

// 테이블 생성 및 데이터 삽입 처리
const initializeTable = async (req, res) => {
  try {
    const result = await tableServices.createTableAndInsertData();
    res.send(result);  // 성공 메시지 반환
  } catch (error) {
    res.status(500).send('테이블 생성 및 데이터 삽입 중 오류 발생');
  }
};

module.exports = { initializeTable };
