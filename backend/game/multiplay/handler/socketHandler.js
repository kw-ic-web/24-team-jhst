const { Server } = require("socket.io");
const { matching,removeFromQueue } = require("../controller/matchingsController");


const generateRandomLetters = (currentWord) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const wordLetters = [...currentWord].sort(() => Math.random() - 0.5);
    const randomLetters = Array.from({ length: 10 }, () =>
      alphabet[Math.floor(Math.random() * alphabet.length)]
    );
    const allLetters = [...wordLetters, ...randomLetters].sort(
      () => Math.random() - 0.5
    );
    return allLetters.map((letter) => ({
      letter,
      x: Math.random() * 700 + 50, // 랜덤 X 위치
      y: Math.random() * 300 + 50, // 랜덤 Y 위치
    }));
    
  };



const socketHandler=(server)=>{
    const io = new Server(server, {
        cors: {
          origin: "http://localhost:3000", 
          methods: ["GET", "POST"], 
          allowedHeaders: ["Content-Type", "Authorization"], 
          credentials: true,
        },
      });

    io.on("connection", (socket) => {
        const socket_id = socket.id;
        console.log("connection!", socket_id);

        


        socket.on("showID", (msg) => { 
            console.log(msg);
            socket.emit("getID", socket.id); // 소켓 아이디를 넘겨줌
        });

        socket.on('requestLetters', ({ word, roomName }) => {
            const letters = generateRandomLetters(word); // 랜덤 알파벳 생성
            io.to(roomName).emit('updateLetters', letters); // 해당 방에 브로드캐스트
          });

        

        //매칭 요청
        socket.on("matching", (data) => {
            // data에 모드와 난이도 정보 받아와
            const { mode, difficulty, member_id } = data;
            console.log("모드:", mode, "난이도:", difficulty,"아이디:",member_id);
            matching(socket, mode, difficulty, member_id,io);
        });

        //나의 상태 업데이트됐을때
        socket.on("updatePosition", ({ roomName, player }) => {
            // 다른 클라이언트에게 플레이어 데이터 전송
            socket.to(roomName).emit("updatePlayers", { id: player.id, x: player.position.x, y: player.position.y });
        });


        //보유 단어 정보 바꼈을 때 호출
        socket.on("updateWord",(data)=>{
            const {roomName,letter,playerId} = data;
            console.log(`Player ${playerId} sent word: ${letter}`);

            // "EMPTY" 문자열을 받은 경우 상대방 단어를 비움
            const updateLetter = letter === "EMPTY" ? "" : letter;
            //바뀐정보 전송
            socket.to(roomName).emit("receiveWord", { updateLetter, playerId });
        });

        socket.on('updateLetters', ({ roomName, updatedLetters }) => {
            // 해당 방에 있는 모든 클라이언트에게 업데이트된 알파벳 리스트 브로드캐스트
            socket.to(roomName).emit('receiveUpdatedLetters', { updatedLetters });
        });


        // 클라이언트 접속 종료 시 처리
        socket.on("disconnect", () => {
            if (socket.roomName) {
                console.log(`클라이언트가 종료된 룸: ${socket.roomName}`); // roomName 확인용 로그
                // 룸의 상대방에게 접속 종료 알림
                socket.to(socket.roomName).emit("opponentDisconnected"); 
            } 
            removeFromQueue(socket.id); // 대기열에서 제거
            console.log(`클라이언트 ${socket.id}가 접속 종료`);
        });
    });


};

module.exports=socketHandler;