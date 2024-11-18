import React from "react";

const AdminPage = () => {
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
          placeholder="User_id를 입력하세요"
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <button className="col-span-1 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
          완료
        </button>

        {/*  포인트 수정 */}
        <label className="col-span-1 text-gray-600">포인트 수정</label>
        <input
          type="text"
          placeholder="User_id를 입력하세요"
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <button className="col-span-1 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
          조회
        </button>
        <div className="col-span-1"></div>
        <input
          type="text"
          placeholder="포인트를 입력하세요"
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <button className="col-span-1 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
          수정
        </button>

        {/* 캐릭터 추가 */}
        <label className="col-span-1 text-gray-600">게임 캐릭터</label>
        <input
          type="text"
          placeholder="캐릭터 이름을 입력하세요"
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <label className="col-span-1 px-4 py-2 rounded ">
        </label>
        <div className="col-span-1"></div>
        <input
          type="file"
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <button className="col-span-1 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
          완료
        </button>

        {/* 게임 단어 */}
        <label className="col-span-1 text-gray-600">게임 단어</label>
        <input
          type="text"
          placeholder="영단어를 입력하세요"
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
    <label className="col-span-1 px-4 py-2 rounded ">
    </label>
        <div className="col-span-1"></div>
        <input
          type="text"
          placeholder="뜻을 입력하세요"
          className="col-span-4 px-3 py-2 border rounded w-full"
        />
        <button className="col-span-1 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
          완료
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
