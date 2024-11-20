import React, { useState, useEffect } from "react";
import axios from "axios";

const GameSingle = () => {
  const TOTAL_ROUNDS = 5; // 총 라운드 수
  const INITIAL_TIMER = 30; // 초기 타이머 값
  const [round, setRound] = useState(1);
  const [wordIndex, setWordIndex] = useState(0); // 현재 단어 인덱스
  const [words, setWords] = useState([]); // 가져온 단어 배열
  const [letters, setLetters] = useState([]);
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [player, setPlayer] = useState({
    name: "", 
    position: { x: 100, y: 100 },
    collectedLetters: [], 
  });
  const [gameStatus, setGameStatus] = useState("ongoing"); // 'ongoing', 'win', 'lose', 'complete'
  const [isTransitioning, setIsTransitioning] = useState(false); // 라운드 전환 중 여부

  // 현재 로그인한 사용자 ID 가져오기
  const getMemberId = () => {
    const memberId = localStorage.getItem("memberId");
    if (!memberId) {
      console.warn("로그인 상태가 아닙니다. memberId를 찾을 수 없습니다.");
      return null;
    }
    return memberId;
  };

  // 단어 가져오기 함수
  const fetchWords = async () => {
    const memberId = getMemberId();
    if (!memberId) return;
    try {
      const response = await axios.get("http://localhost:8000/game/singleplay", {
        params: { member_id: memberId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const fetchedWords = response.data.map((item) => item.en_word);
      console.log("제시된 단어 리스트:", fetchedWords);
      setWords(fetchedWords);
      setWordIndex(0);
    } catch (error) {
      console.error("단어를 가져오는 중 오류 발생:", error);
    }
  };

  // 초기 플레이어 설정
  const initializePlayer = () => {
    const memberId = getMemberId();
    if (!memberId) return;
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      name: `Player ${memberId}`,
    }));
  };

  // 단어 글자 배열 생성
  const generateRandomLetters = (word) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const wordLetters = [...word].sort(() => Math.random() - 0.5);
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

  // 현재 라운드의 단어 글자들 업데이트
  useEffect(() => {
    if (words.length > 0 && wordIndex < words.length) {
      setLetters(generateRandomLetters(words[wordIndex]));
    }
  }, [wordIndex, words]);

  // 타이머 관리
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setGameStatus("lose"); // 시간 초과 시 게임 종료
    }
  }, [timer]);

  useEffect(() => {
    initializePlayer();
    fetchWords();
  }, []);

  // 플레이어 이동 이벤트 처리
  const handlePlayerMove = (direction) => {
    setPlayer((prevPlayer) => {
      let newPosition = { ...prevPlayer.position };
      const step = 10;
      if (direction === "up") newPosition.y -= step;
      if (direction === "down") newPosition.y += step;
      if (direction === "left") newPosition.x -= step;
      if (direction === "right") newPosition.x += step;
      return { ...prevPlayer, position: newPosition };
    });
  };

  // 알파벳 획득 처리
  const handleLetterCollect = () => {
    const closeLetter = letters.find((letterObj) => {
      const distance = Math.sqrt(
        Math.pow(player.position.x - letterObj.x, 2) +
          Math.pow(player.position.y - letterObj.y, 2)
      );
      return distance < 30; // 플레이어 글자 범위
    });

    if (closeLetter) {
      setPlayer((prevPlayer) => {
        const updatedLetters = [...prevPlayer.collectedLetters, closeLetter.letter];
        console.log("플레이어가 획득한 단어:", updatedLetters.join(""));
        return {
          ...prevPlayer,
          collectedLetters: updatedLetters,
        };
      });
      setLetters((prevLetters) =>
        prevLetters.filter((letterObj) => letterObj !== closeLetter)
      );
    }
  };

  // Backspace 키로 알파벳 하나만 뱉기
  const handleLetterDrop = () => {
    setPlayer((prevPlayer) => {
      if (prevPlayer.collectedLetters.length === 0) return prevPlayer;

      // 큐의 마지막 알파벳을 뱉음
      const droppedLetter = prevPlayer.collectedLetters.pop();

      // 뱉은 알파벳을 화면에 다시 배치
      setLetters((prevLetters) => [
        ...prevLetters,
        {
          letter: droppedLetter,
          x: prevPlayer.position.x, 
          y: prevPlayer.position.y,
        },
      ]);

      console.log("뱉은 알파벳:", droppedLetter);
      return { ...prevPlayer, collectedLetters: [...prevPlayer.collectedLetters] };
    });
  };

  // 단어 완성 체크
  useEffect(() => {
    if (
      player.collectedLetters.join("") === words[wordIndex] &&
      gameStatus === "ongoing" &&
      !isTransitioning
    ) {
      setIsTransitioning(true); // 전환 상태로 설정
      setTimeout(() => {
        if (round < TOTAL_ROUNDS) {
          setRound((prevRound) => prevRound + 1);
          setWordIndex((prevIndex) => prevIndex + 1);
          setPlayer((prevPlayer) => ({
            ...prevPlayer,
            collectedLetters: [],
          }));
          setTimer(INITIAL_TIMER); // 타이머 초기화
        } else {
          setGameStatus("complete"); // 게임 종료
        }
        setIsTransitioning(false); 
      }, 5000); // 5초 후에 다음 라운드 시작
    }
  }, [player.collectedLetters, words, wordIndex, round, gameStatus, isTransitioning]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "w") handlePlayerMove("up");
      if (e.key === "s") handlePlayerMove("down");
      if (e.key === "a") handlePlayerMove("left");
      if (e.key === "d") handlePlayerMove("right");
      if (e.key === "Enter") handleLetterCollect();
      if (e.key === "Backspace") handleLetterDrop();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [letters, player]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex justify-between items-center w-full max-w-4xl mb-8 space-x-4">
        <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
          <p>{player.name || "Player 1"}</p>
          <p>남은 시간: {timer}초</p>
        </div>
        <div className="text-center bg-gray-300 p-4 rounded-md flex-1 mx-2">
          <p>라운드</p>
          <p>
            {round} / {TOTAL_ROUNDS}
          </p>
        </div>
      </div>

      <div className="text-center bg-gray-300 p-4 rounded-md text-2xl mb-8 max-w-2xl w-full">
        {words[wordIndex] || "단어를 가져오는 중..."}
      </div>

      <div className="relative w-full max-w-4xl h-96 bg-white rounded-md">
        {letters.map((letterObj, index) => (
          <div
            key={index}
            className="absolute text-black text-xl font-bold"
            style={{
              left: `${letterObj.x}px`,
              top: `${letterObj.y}px`,
            }}
          >
            {letterObj.letter}
          </div>
        ))}
        <div
          className="absolute text-blue-500 text-2xl font-bold"
          style={{
            left: `${player.position.x}px`,
            top: `${player.position.y}px`,
          }}
        >
          ❤️
        </div>
      </div>

      <div className="mt-4">
        {player.collectedLetters.map((letter, index) => (
          <span key={index} className="text-xl font-bold">
            {letter}
          </span>
        ))}
      </div>

      {gameStatus === "complete" && (
        <div className="text-center mt-8 text-xl font-bold text-green-500">
          🎉 게임 완료! 축하합니다!
        </div>
      )}
      {gameStatus === "lose" && (
        <div className="text-center mt-8 text-xl font-bold text-red-500">
          ⏰ 시간 초과! 게임 종료!
        </div>
      )}
    </div>
  );
};

export default GameSingle;
