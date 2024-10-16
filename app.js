var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var db = require('./config/db');

// member_game.js의 테이블 생성 및 데이터 삽입 함수 가져오기
var { createTableAndInsertData } = require('./game/db/member_game');

var {createWordTableAndInsertData } = require('./game/db/word')
var { createGameTableAndInsertData } = require('./game/db/game_table'); 
var { createRoundTableAndInsertData } = require('./game/db/round_table');


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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
autoRegisterRoutes('game/routes', '/game');

// '/users' 경로에 있는 모든 라우트 자동 등록
autoRegisterRoutes('member/routes', '/users');

// 기본 인덱스 라우트 등록 (필요할 경우 변경 가능)
app.use('/', require('./game/routes/index'));

module.exports = app;
