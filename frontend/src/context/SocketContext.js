import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    // 소켓 초기화
    socketRef.current = io('https://team10.kwweb.duckdns.org', {
      autoConnect: false, // 필요 시 연결
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    socket.connect(); // 연결 시작

    return () => {
      socket.disconnect(); // 연결 종료
    };
  }, []);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
