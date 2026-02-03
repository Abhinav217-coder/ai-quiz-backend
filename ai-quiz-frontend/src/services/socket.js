let socket = null;

export const connectSocket = (roomCode) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(`ws://localhost:8000/ws/room/${roomCode}/`);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
    socket = null;
  };

  socket.onerror = (e) => {
    console.error("WebSocket error", e);
  };

  
  window.socket = socket;

  return socket;
};
