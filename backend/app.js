const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const cors = require('cors');
const sequelize = require('./config/db');

// DB 관련 데이터 삽입 함수 불러오기
const { 
  createTableAndInsertData,  
  createMemberCharactersTableAndInsertData 
} = require('./db/memberdb'); // MemberGame과 MemberCharacters가 합쳐진 파일
const { createWordTableAndInsertData } = require('./db/assets/word');
const { 
  createGameTableAndInsertData, 
  createRoundTableAndInsertData, 
  insertExampleData 
} = require('./db/gamedb'); // Game, Round, WrongAns 모델이 합쳐진 파일
const { createCharactersTableAndInsertData } = require('./db/assets/characters_table');

// 모델 관계 설정
const { Game, Round, WrongAns } = require('./db/gamedb'); // 합쳐진 모델 파일에서 가져오기
const { MemberGame, MemberCharacters } = require('./db/memberdb'); // MemberGame과 MemberCharacters가 합쳐진 파일
const { Word } = require('./db/assets/word');
const { Characters } = require('./db/assets/characters_table');

// 모델 간 관계 설정
Game.belongsTo(MemberGame, { foreignKey: 'member_id', onDelete: 'CASCADE' });
MemberGame.hasMany(Game, { foreignKey: 'member_id', onDelete: 'CASCADE' });
Game.hasMany(Round, { foreignKey: 'game_id', onDelete: 'CASCADE' });
Round.belongsTo(Game, { foreignKey: 'game_id', onDelete: 'CASCADE' });
Round.belongsTo(Word, { foreignKey: 'word_id', onDelete: 'CASCADE' });
Word.hasMany(Round, { foreignKey: 'word_id', onDelete: 'CASCADE' });
WrongAns.belongsTo(Word, { foreignKey: 'word_id', onDelete: 'CASCADE' });
WrongAns.belongsTo(Game, { foreignKey: 'game_id', onDelete: 'CASCADE' });
WrongAns.belongsTo(MemberGame, { foreignKey: 'member_id', onDelete: 'CASCADE' });

Word.hasMany(WrongAns, { foreignKey: 'word_id', onDelete: 'CASCADE' });
Game.hasMany(WrongAns, { foreignKey: 'game_id', onDelete: 'CASCADE' });
MemberGame.hasMany(WrongAns, { foreignKey: 'member_id', onDelete: 'CASCADE' });

MemberCharacters.belongsTo(Characters, { foreignKey: 'character_id', onDelete: 'CASCADE' });
Characters.hasMany(MemberCharacters, { foreignKey: 'character_id', onDelete: 'CASCADE' });
MemberCharacters.belongsTo(MemberGame, { foreignKey: 'member_id', onDelete: 'CASCADE' });

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // 프론트엔드 URL
  })
);

// DB 동기화 및 데이터 삽입
sequelize
  .sync({ force: true })
  .then(async () => {
    console.log('데이터베이스가 성공적으로 초기화되었습니다.');

    // 테이블 순서대로 데이터 삽입
    await createCharactersTableAndInsertData(); // characters 테이블 생성 및 데이터 삽입
    await createTableAndInsertData(); // member_game 테이블 생성 및 데이터 삽입
    await createMemberCharactersTableAndInsertData(); // member_characters 테이블 생성 및 데이터 삽입
    await createWordTableAndInsertData(); // word 테이블 생성 및 데이터 삽입
    await createGameTableAndInsertData(); // game 테이블 생성 및 데이터 삽입
    await createRoundTableAndInsertData(); // round 테이블 생성 및 데이터 삽입
    await insertExampleData(); // WrongAns 테이블 예시 데이터 삽입

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

// 수동
const signupRouter = require('./member/routes/signup');
const loginRouter = require('./member/routes/login');
// 라우터 수동 등록
app.use('/users', signupRouter);  // 회원가입 라우터
app.use('/login', loginRouter);   // 로그인 라우터


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
autoRegisterRoutes('game/multiplay/routes', '/game/multi');
autoRegisterRoutes('game/singleplay/routes', '/game');
autoRegisterRoutes('game/characters/routes', '/game/characters');

// '/users' 경로에 있는 모든 라우트 자동 등록
autoRegisterRoutes('member/routes', '/users');


module.exports = app;
