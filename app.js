var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var cors = require('cors'); 
var db = require('./backend/config/db');

// member_game.js의 테이블 생성 및 데이터 삽입 함수 가져오기
var { createTableAndInsertData } = require('./backend/game/db/member_game');
var {createWordTableAndInsertData } = require('./backend/game/db/word')
var { createGameTableAndInsertData } = require('./backend/game/db/game_table'); 
var { createRoundTableAndInsertData } = require('./backend/game/db/round_table');

const charactersRoutes = require('./backend/characters/charactersRoutes');

// // 서버 시작 시 여러 테이블을 동시에 생성
// Promise.all([createTableAndInsertData(), createGameTableAndInsertData(),createRoundTableAndInsertData(),createWordTableAndInsertData() ])
//   .then((messages) => {
//     messages.forEach((message) => console.log(message));
//     console.log('모든 테이블 생성 완료');
//   })
//   .catch((error) => {
//     console.error('테이블 생성 중 오류 발생:', error);
//   });

var app = express();

app.use(cors({
  origin: 'http://localhost:3000' // 프론트엔드 URL
}));

createTableAndInsertData() // 가장 먼저 실행
  .then(() => {
    return createWordTableAndInsertData(); // 그 다음 word 테이블 생성
  })
  .then(() => {
    return createGameTableAndInsertData(); // 그 다음 game 테이블 생성
  })
  .then(() => {
    return createRoundTableAndInsertData(); // 마지막으로 round 테이블 생성
  })
  .then(() => {
    console.log('모든 테이블 생성 및 데이터 삽입 완료');
  })
  .catch((error) => {
    console.error('테이블 생성 중 오류 발생:', error);
  });

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/characters', charactersRoutes);


// 자동 라우터 등록 함수
const autoRegisterRoutes = (baseDir, basePath) => {
  const routeDir = path.join(__dirname, baseDir);
  fs.readdirSync(routeDir).forEach((file) => {
    if (file.endsWith('.js')) {
      const route = require(path.join(routeDir, file));

      // 라우터가 함수인지 확인
      if (typeof route === 'function') {
        const routeName = file.replace('.js', ''); // 파일명을 경로로 변환
        app.use(`${basePath}/${routeName}`, route); // 경로에 라우터 등록
      } else {
        console.error(`Invalid route file: ${file}. Expected a function but got ${typeof route}`);
      }
    }
  });
};

// '/game' 경로에 있는 모든 라우트 자동 등록
autoRegisterRoutes('backend/game/routes', '/game');

// '/users' 경로에 있는 모든 라우트 자동 등록
autoRegisterRoutes('/backend/member/routes', '/users');

// 기본 인덱스 라우트 등록 (필요할 경우 변경 가능)
app.use('/', require('./backend/game/routes/index'));

module.exports = app;
