import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultSingle = () => {
  const { state } = useLocation();
  const { results, words } = state;

  return (
    <div>
      <h1>게임 결과</h1>
      <ul>
        {words.map((word, index) => (
          <li key={index}>
            {word} - {results[index]?.isCorrect ? '정답' : '오답'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultSingle;
