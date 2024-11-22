import React, { useState } from 'react';
import axios from 'axios';

const CharacterTest = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [memberId, setMemberId] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [randomCharacter, setRandomCharacter] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const baseURL = 'http://localhost:8000';

  // 이미지 파일 base64로 변환
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // base64 데이터만 추출
      reader.onerror = (error) => reject(error);
    });
  };

  // 캐릭터 추가 함수
  const handleAddCharacter = async (e) => {
    e.preventDefault();
    if (!image) {
      setErrorMessage('이미지를 선택해 주세요.');
      return;
    }

    try {
      const imageBase64 = await convertToBase64(image);
      const res = await axios.post(`${baseURL}/characters/add`, {
        name,
        imageFile: imageBase64,
      });
      console.log(res.data);
      alert('캐릭터가 추가되었습니다.');
      setName(''); // 입력 필드 초기화
      setImage(null);
      setErrorMessage(null); // 에러 메시지 초기화
    } catch (err) {
      console.error(err);
      setErrorMessage('캐릭터 추가에 실패했습니다.');
    }
  };

  // 캐릭터 선택 
  const handleSelectCharacter = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/characters/select`, {
        memberId,
        characterId,
      });
      console.log(res.data);
      alert('캐릭터가 선택되었습니다.');
      setMemberId('');
      setCharacterId('');
      setErrorMessage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage('캐릭터 선택에 실패했습니다.');
    }
  };

  // 랜덤 캐릭터 뽑기 
  const handleDrawCharacter = async () => {
    try {
      const res = await axios.get(`${baseURL}/characters/draw`, {
        params: { memberId },
      });
      setRandomCharacter(res.data.character);
      alert('랜덤 캐릭터 뽑기 성공');
      setErrorMessage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage('랜덤 캐릭터 뽑기에 실패했습니다.');
    }
  };

  const containerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
  };

  const formSectionStyle = {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h1>캐릭터 테스트</h1>

      {/* 에러 메시지 표시 */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* 캐릭터 추가 폼 */}
      <form onSubmit={handleAddCharacter} style={formSectionStyle}>
        <h2>캐릭터 추가</h2>
        <div>
          <label>캐릭터 이름: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>캐릭터 이미지: </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>캐릭터 추가</button>
      </form>

      {/* 캐릭터 선택 폼 */}
      <form onSubmit={handleSelectCharacter} style={formSectionStyle}>
        <h2>캐릭터 선택</h2>
        <div>
          <label>멤버 ID: </label>
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>캐릭터 ID: </label>
          <input
            type="text"
            value={characterId}
            onChange={(e) => setCharacterId(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>캐릭터 선택</button>
      </form>

      {/* 랜덤 캐릭터 뽑기 */}
      <div style={formSectionStyle}>
        <h2>랜덤 캐릭터 뽑기</h2>
        <div>
          <label>멤버 ID: </label>
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button onClick={handleDrawCharacter} style={buttonStyle}>랜덤 캐릭터 뽑기</button>
        {randomCharacter && (
          <div style={{ marginTop: '15px' }}>
            <h3>뽑힌 랜덤 캐릭터</h3>
            <p>이름: {randomCharacter.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterTest;
