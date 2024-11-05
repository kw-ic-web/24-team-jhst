var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var cors = require('cors');
const sequelize = require('./backend/config/db');

// DB 관련 데이터 삽입 함수 불러오기
const { createTableAndInsertData: createMemberGameTableAndInsertData } = require('./backend/game/db/member_game');
const { createWordTableAndInsertData } = require('./backend/game/db/word');
const { createGameTableAndInsertData } = require('./backend/game/db/game_table');
const { createRoundTableAndInsertData } = require('./backend/game/db/round_table');
const { insertExampleData } = require('./backend/game/db/wrongAns');
const { createCharactersTableAndInsertData } = require('./backend/game/db/characters_table'); // 추가된 부분
const { createMemberCharactersTableAndInsertData } = require('./backend/game/db/memberCharacters_table'); // 추가된 부분

// 모델 관계 설정
const { Game } = require('./backend/game/db/game_table');
const { Round } = require('./backend/game/db/round_table');
const { MemberGame } = require('./backend/game/db/member_game');
const { Word } = require('./backend/game/db/word');
const { WrongAns } = require('./backend/game/db/wrongAns');
const { Characters } = require('./backend/game/db/characters_table');
const { MemberCharacters } = require('./backend/game/db/memberCharacters_table');

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

const charactersRoutes = require('./backend/characters/charactersRoutes');
const loginRoutes = require('./backend/member/routes/login'); // 로그인 라우터 등록
const signupRoutes = require('./backend/member/routes/signup'); // 회원가입 라우터 등록

var app = express();

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
    await createMemberGameTableAndInsertData(); // member_game 테이블 생성 및 데이터 삽입
    await createWordTableAndInsertData(); // word 테이블 생성 및 데이터 삽입
    await createGameTableAndInsertData(); // game 테이블 생성 및 데이터 삽입
    await createRoundTableAndInsertData(); // round 테이블 생성 및 데이터 삽입
    await createCharactersTableAndInsertData(); // characters 테이블
    await createMemberCharactersTableAndInsertData(); // membercharacters 테이블
    await insertExampleData();

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

app.use('/login', loginRoutes); // 로그인 라우터 등록

app.use('/signup', signupRoutes); // 회원가입 라우터 등록

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
