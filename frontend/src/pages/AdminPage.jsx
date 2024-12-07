import React, { useState, useRef } from "react";
import axios from "axios";

const AdminPage = () => {
  const [deleteMemberId, setDeleteMemberId] = useState("");
  const [pointMemberId, setPointMemberId] = useState("");
  const [pointValue, setPointValue] = useState("");
  const [pointResult, setPointResult] = useState(null);
  const [characterNameToDelete, setCharacterNameToDelete] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [characterImage, setCharacterImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [englishWord, setEnglishWord] = useState("");
  const [koreanWord, setKoreanWord] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [wordId, setWordId] = useState("");
  const [wordResult, setWordResult] = useState({ en_word: "", ko_word: "" });
  const [updatedEnglishWord, setUpdatedEnglishWord] = useState("");
  const [updatedKoreanWord, setUpdatedKoreanWord] = useState("");

  // 섹션 
  const memberSection = useRef(null);
  const characterSection = useRef(null);
  const wordSection = useRef(null);

  const scrollToSection = (section) => {
    section.current.scrollIntoView({ behavior: "smooth" });
  };

  // 회원 삭제
  const handleDeleteMember = async () => {
    try {
      const response = await axios.post("https://team10.kwweb.duckdns.org/admin/deleteMember", {
        member_id: deleteMemberId,
      });
      alert(response.data.message);
      setDeleteMemberId("");
    } catch (error) {
      console.error("회원 삭제 오류:", error);
      alert("회원 삭제 실패");
    }
  };

  // 회원 포인트 조회
  const handleFetchPoint = async () => {
    try {
      const response = await axios.get(`https://team10.kwweb.duckdns.org/admin/getMemberPoint/${pointMemberId}`);
      setPointResult(response.data.point);
    } catch (error) {
      console.error("포인트 조회 오류:", error);
      alert("포인트 조회 실패");
    }
  };

  // 회원 포인트 수정
  const handleUpdatePoint = async () => {
    try {
      const response = await axios.post("https://team10.kwweb.duckdns.org/admin/updateMemberPoint", {
        member_id: pointMemberId,
        point: pointValue,
      });
      alert(response.data.message);
      setPointMemberId("");
      setPointValue("");
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
        const response = await axios.post("https://team10.kwweb.duckdns.org/admin/addCharacter", {
          name: characterName,
          imageFile: imageBase64,
        });
        alert(response.data.message);
        setCharacterName("");
        setCharacterImage(null);
        setImagePreview(null); 
      };
      if (characterImage) {
        reader.readAsDataURL(characterImage);
      }
    } catch (error) {
      console.error("캐릭터 추가 오류:", error);
      alert("캐릭터 추가 실패");
    }
  };

  // 이미지 선택 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCharacterImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 캐릭터 삭제
  const handleDeleteCharacter = async () => {
    try {
      const response = await axios.post("https://team10.kwweb.duckdns.org/admin/deleteCharacterByName", {
        name: characterNameToDelete,
      });
      alert(response.data.message);
      setCharacterNameToDelete("");
    } catch (error) {
      console.error("캐릭터 삭제 오류:", error);
      alert("캐릭터 삭제 실패");
    }
  };

  // 단어 추가
  const handleAddWord = async () => {
    try {
      const response = await axios.post("https://team10.kwweb.duckdns.org/admin/addWord", {
        en_word: englishWord,
        ko_word: koreanWord,
        difficulty: difficulty,
      });
      alert(response.data.message);
      setEnglishWord("");
      setKoreanWord("");
      setDifficulty("easy");
    } catch (error) {
      console.error("단어 추가 오류:", error);
      alert("단어 추가 실패");
    }
  };

  // 단어 조회
  const handleFetchWord = async () => {
    try {
      const response = await axios.get(`https://team10.kwweb.duckdns.org/admin/getWord/${wordId}`);
      setWordResult(response.data);
    } catch (error) {
      console.error("단어 조회 오류:", error);
      alert("단어 조회 실패");
    }
  };

  // 단어 수정
  const handleUpdateWord = async () => {
    try {
      const response = await axios.post("https://team10.kwweb.duckdns.org/admin/updateWord", {
        word_id: wordId,
        en_word: updatedEnglishWord,
        ko_word: updatedKoreanWord,
      });
      alert(response.data.message);
      setWordId("");
      setUpdatedEnglishWord("");
      setUpdatedKoreanWord("");
    } catch (error) {
      console.error("단어 수정 오류:", error);
      alert("단어 수정 실패");
    }
  };

  return (
    <div className="flex h-screen">
      {/* 네비게이션 바 */}
      <div className="w-1/5 bg-gray-100 p-6 h-full">
        <h1 className="text-xl font-bold mt-16 mb-6">관리자 페이지</h1>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => scrollToSection(memberSection)}
              className="text-gray-700 text-lg hover:text-gray-900 block"
            >
              회원 관리
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(characterSection)}
              className="text-gray-700 text-lg hover:text-gray-900 block"
            >
              캐릭터 관리
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(wordSection)}
              className="text-gray-700 text-lg hover:text-gray-900 block"
            >
              단어 관리
            </button>
          </li>
        </ul>
      </div>

      {/* 메인 */}
      <div className="w-4/5 overflow-y-scroll scrollbar-hide mt-14 p-10 px-16">
        {/* 회원 관리 섹션 */}
        <div ref={memberSection} className="mb-10 p-6">
          <h2 className="text-2xl font-semibold mb-4">회원 관리</h2>
          {/* 회원 삭제 */}
          <label className="block mb-2">회원 삭제</label>
          <input
            type="text"
            placeholder="member_id를 입력하세요"
            value={deleteMemberId}
            onChange={(e) => setDeleteMemberId(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button onClick={handleDeleteMember} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
            삭제
          </button>

          {/* 포인트 조회 */}
          <h3 className="text-lg font-medium mt-6">포인트 조회</h3>
          <input
            type="text"
            placeholder="member_id를 입력하세요"
            value={pointMemberId}
            onChange={(e) => setPointMemberId(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button onClick={handleFetchPoint} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
            조회
          </button>
          {pointResult !== null && (
            <div className="text-gray-700 mt-4">조회된 포인트: {pointResult}</div>
          )}

          {/* 포인트 수정 */}
          <h3 className="text-lg font-medium mt-6">포인트 수정</h3>
          <input
            type="text"
            placeholder="포인트를 입력하세요"
            value={pointValue}
            onChange={(e) => setPointValue(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button onClick={handleUpdatePoint} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
            수정
          </button>
        </div>

        {/* 캐릭터 관리 섹션 */}
        <div ref={characterSection} className="mb-10 p-6">
          <h2 className="text-2xl font-semibold mb-4">캐릭터 관리</h2>
          <label className="block mb-2">캐릭터 추가</label>
          <input
            type="text"
            placeholder="캐릭터 이름을 입력하세요"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          {imagePreview && (
            <div className="flex justify-center mb-4">
              <img
                src={imagePreview}
                alt="캐릭터 미리보기"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          <button onClick={handleAddCharacter} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
            추가
          </button>

          {/* 캐릭터 삭제 */}
          <h3 className="text-lg font-medium mt-6">캐릭터 삭제</h3>
          <input
            type="text"
            placeholder="캐릭터 이름을 입력하세요"
            value={characterNameToDelete}
            onChange={(e) => setCharacterNameToDelete(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button onClick={handleDeleteCharacter} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
            삭제
          </button>
        </div>

        {/* 단어 관리 섹션 */}
        <div ref={wordSection} className="mb-10 p-6">
          <h2 className="text-2xl font-semibold mb-4">단어 관리</h2>
          <label className="block mb-2">단어 추가</label>
          <input
            type="text"
            placeholder="영단어를 입력하세요"
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="뜻을 입력하세요"
            value={koreanWord}
            onChange={(e) => setKoreanWord(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          >
            <option value="easy">easy</option>
            <option value="hard">hard</option>
          </select>
          <button onClick={handleAddWord} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
            추가
          </button>

          {/* 단어 조회 */}
          <h3 className="text-lg font-medium mt-6">단어 조회</h3>
          <input
            type="text"
            placeholder="word_id를 입력하세요"
            value={wordId}
            onChange={(e) => setWordId(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button onClick={handleFetchWord} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
            조회
          </button>
          {wordResult.en_word && (
            <div className="text-gray-700 mt-4">
              <p>영단어: {wordResult.en_word}</p>
              <p>뜻: {wordResult.ko_word}</p>
            </div>
          )}

          {/* 단어 수정 */}
          <h3 className="text-lg font-medium mt-6">단어 수정</h3>
          <input
            type="text"
            placeholder="word_id를 입력하세요"
            value={wordId}
            onChange={(e) => setWordId(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="영단어를 입력하세요"
            value={updatedEnglishWord}
            onChange={(e) => setUpdatedEnglishWord(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="뜻을 입력하세요"
            value={updatedKoreanWord}
            onChange={(e) => setUpdatedKoreanWord(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button onClick={handleUpdateWord} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
