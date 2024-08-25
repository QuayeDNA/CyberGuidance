// ChatSocket.js
import io from 'socket.io-client';

class ChatSocket {
  constructor() {
    this.socket = io('https://cyber-guidance.onrender.com/api/chat', {
      auth: {
        token: localStorage.getItem('token') // Assuming you store the JWT token in localStorage
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  joinRoom(userId, counselorId) {
    const roomId = `${userId}_${counselorId}`;
    this.socket.emit('join_room', { roomId });
  }

  sendMessage(message) {
    this.socket.emit('send_message', message);
  }

  onMessage(callback) {
    this.socket.on('receive_message', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default ChatSocket;