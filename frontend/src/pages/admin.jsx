import React, { useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [deleteMemberId, setDeleteMemberId] = useState("");
  const [pointMemberId, setPointMemberId] = useState("");
  const [pointValue, setPointValue] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [characterImage, setCharacterImage] = useState(null);
  const [englishWord, setEnglishWord] = useState("");
  const [koreanWord, setKoreanWord] = useState("");

  // 회원 탈퇴
  const handleDeleteMember = async () => {
    try {
      const response = await axios.post("http://localhost:8000/admin/deleteMember", {
        member_id: deleteMemberId,
      });
      alert(response.data.message);
      setDeleteMemberId(""); // 입력값 초기화
    } catch (error) {
      console.error("회원 탈퇴 오류:", error);
      alert("회원 탈퇴 실패");
    }
  };

  // 포인트 수정
  const handleUpdatePoint = async () => {
    try {
      const response = await axios.post("http://localhost:8000/admin/updateMemberPoint", {
        member_id: pointMemberId,
        point: pointValue,
      });
      alert(response.data.message);
      setPointMemberId(""); // 입력값 초기화
      setPointValue(""); // 입력값 초기화
    } catch (error) {
      console.error("포인트 수정 오류:", error);
      alert("포인트 수정 실패");
    }
  };

  // 캐릭터 추가
  const handleAddCharacter = async () => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageBase64 = reader.result.split(",")[1];
        const response = await axios.post("http://localhost:8000/admin/addCharacter", {
          name: characterName,
          imageFile: imageBase64,
        });
        alert(response.data.message);
        setCharacterName(""); // 입력값 초기화
        setCharacterImage(null); // 이미지 초기화
      };
      if (characterImage) {
        reader.readAsDataURL(characterImage);
      }
    } catch (error) {
      console.error("캐릭터 추가 오류:", error);
      alert("캐릭터 추가 실패");
    }
  };

  // 단어 추가
  const handleAddWord = async () => {
    try {
      const response = await axios.post("http://localhost:8000/admin/addWord", {
        en_word: englishWord,
        ko_word: koreanWord,
      });
      alert(response.data.message);
      setEnglishWord(""); // 입력값 초기화
      setKoreanWord(""); // 입력값 초기화
    } catch (error) {
      console.error("단어 추가 오류:", error);
      alert("단어 추가 실패");
    }
  };

  return (
    <div className="min-h-screen bg-customWhite flex justify-center items-center">
      <div className="grid grid-cols-6 gap-4 p-10 w-[90%] bg-white shadow-lg max-w-3xl">
        {/* 헤더 */}
        <label className="col-span-6 text-gray-600 text-2xl font-semibold mb-6">
          관리자 페이지
        </label>

        {/* 회원 탈퇴 */}
        <label className="col-span-1 text-gray-600">회원 탈퇴</label>
        <input
          type="text"
          placeholder="member_id를 입력하세요"
          value={deleteMemberId}
          onChange={(e) => setDeleteMemberId(e.target.value)}
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <button
          onClick={handleDeleteMember}
          className="col-span-1 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          완료
        </button>

        {/* 포인트 수정 */}
        <label className="col-span-1 text-gray-600">포인트 수정</label>
        <input
          type="text"
          placeholder="member_id를 입력하세요"
          value={pointMemberId}
          onChange={(e) => setPointMemberId(e.target.value)}
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="포인트를 입력하세요"
          value={pointValue}
          onChange={(e) => setPointValue(e.target.value)}
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <button
          onClick={handleUpdatePoint}
          className="col-span-1 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          수정
        </button>

        {/* 캐릭터 추가 */}
        <label className="col-span-1 text-gray-600">게임 캐릭터</label>
        <input
          type="text"
          placeholder="캐릭터 이름을 입력하세요"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <input
          type="file"
          onChange={(e) => setCharacterImage(e.target.files[0])}
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <button
          onClick={handleAddCharacter}
          className="col-span-1 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          완료
        </button>

        {/* 게임 단어 */}
        <label className="col-span-1 text-gray-600">게임 단어</label>
        <input
          type="text"
          placeholder="영단어를 입력하세요"
          value={englishWord}
          onChange={(e) => setEnglishWord(e.target.value)}
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="뜻을 입력하세요"
          value={koreanWord}
          onChange={(e) => setKoreanWord(e.target.value)}
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <button
          onClick={handleAddWord}
          className="col-span-1 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
