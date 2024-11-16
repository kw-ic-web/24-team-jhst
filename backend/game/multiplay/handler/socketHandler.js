const { Server } = require("socket.io");
const { matching,removeFromQueue } = require("../service/matchingService");

const socketHandler=(server)=>{
    const io = new Server(server);
    let user={}; //접속한 유저 관리?

    io.on("connection", (socket) => {
        const socket_id = socket.id;
        console.log("connection!", socket_id);


        socket.on("showID", (msg) => { 
            console.log(msg);
            socket.emit("getID", socket.id); // 소켓 아이디를 넘겨줌
        });


        socket.on("matching", (data) => {
            // data에 모드와 난이도 정보 받아와
            const { mode, difficulty, member_id } = data;
            console.log("모드:", mode, "난이도:", difficulty,"아이디:",member_id);
            matching(socket, mode, difficulty, member_id,io);
        });



        // 클라이언트 접속 종료 시 처리
        socket.on("disconnect", () => {
            if (socket.roomName) {
                console.log(`클라이언트가 종료된 룸: ${socket.roomName}`); // roomName 확인용 로그
            } 
            removeFromQueue(socket.id); // 대기열에서 제거
            console.log(`클라이언트 ${socket.id}가 접속 종료`);
        });
    });


};

module.exports=socketHandler;