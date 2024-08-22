import io from 'socket.io-client';

class ChatSocket {
  constructor() {
    this.socket = io('https://cyber-guidance.onrender.com/api/chat'); // Replace with your server address if applicable
  }

  joinRoom(userId, counselorId) {
    this.socket.emit('join', { userId, counselorId });
  }

  sendMessage(message) {
    this.socket.emit('message', message);
  }

  onMessage(callback) {
    this.socket.on('message', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default ChatSocket;